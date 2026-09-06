"""Author the portfolio's workshop assets. Run with Blender --background --python.

Coordinates in modelling helpers are web coordinates: X right, Y up, Z forward.
The editable scene keeps bevel modifiers; exports apply them and merge static
parts by material. Display surfaces and moving assemblies remain named meshes.
"""
import argparse
import json
import math
from pathlib import Path
import sys

import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'public/models/hacker-workshop'
SOURCE = Path(__file__).resolve().parent
OUT.mkdir(parents=True, exist_ok=True)
parser = argparse.ArgumentParser()
parser.add_argument('--render', action='store_true')
args = parser.parse_args(sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else [])
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
bpy.context.preferences.filepaths.save_version = 0


def pos(v):
    return Vector((v[0], -v[2], v[1]))


def material(name, color, metal=0, rough=.4, glow=0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    p = m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value = (*color, 1)
    p.inputs['Metallic'].default_value = metal
    p.inputs['Roughness'].default_value = rough
    if glow:
        p.inputs['Emission Color'].default_value = (*color, 1)
        p.inputs['Emission Strength'].default_value = glow
    return m


MAT = {
    'shell': material('Graphite ceramic', (.055, .066, .077), .65, .31),
    'dark': material('Recessed black rubber', (.009, .013, .018), .05, .6),
    'silver': material('Satin titanium', (.43, .49, .53), .82, .28),
    'orange': material('Burnt orange enamel', (.8, .19, .036), .4, .3),
    'white': material('Warm porcelain keys', (.62, .66, .63), .12, .4),
    'amber': material('Amber instrument light', (1, .32, .045), .25, .24, 3),
    'ice': material('Cool display light', (.24, .64, .8), .1, .3, 2),
    'screen': material('Display glass', (.005, .012, .017), .15, .22),
}
COL = None


def register(obj, name, mat):
    obj.name = name
    for collection in list(obj.users_collection):
        collection.objects.unlink(obj)
    COL.objects.link(obj)
    obj.data.materials.append(MAT[mat])
    return obj


def smooth(obj):
    for face in obj.data.polygons:
        face.use_smooth = True


def box(name, at, size, mat='shell', bevel=.06):
    bpy.ops.mesh.primitive_cube_add(size=1, location=pos(at))
    obj = register(bpy.context.object, name, mat)
    obj.dimensions = (size[0], size[2], size[1])
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel:
        mod = obj.modifiers.new('Machined edge radius', 'BEVEL')
        mod.width = min(bevel, min(size) * .45)
        mod.segments = 3
        mod = obj.modifiers.new('Face-weighted normals', 'WEIGHTED_NORMAL')
        mod.keep_sharp = True
        smooth(obj)
    return obj


def cylinder(name, at, radius, depth, mat='silver', axis=(0, 1, 0), vertices=32):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=pos(at))
    obj = register(bpy.context.object, name, mat)
    obj.rotation_mode = 'QUATERNION'
    obj.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(pos(axis))
    mod = obj.modifiers.new('Turned edge', 'BEVEL')
    mod.width = min(.035, depth / 5)
    mod.segments = 2
    obj.modifiers.new('Weighted normals', 'WEIGHTED_NORMAL')
    smooth(obj)
    return obj


def rod(name, start, end, radius=.06, mat='silver'):
    direction = Vector(end) - Vector(start)
    return cylinder(name, (Vector(start) + Vector(end)) / 2, radius, direction.length, mat, direction.normalized())


def torus(name, at, radius, tube, mat='silver', axis=(0, 1, 0)):
    bpy.ops.mesh.primitive_torus_add(major_segments=64, minor_segments=8, location=pos(at), major_radius=radius, minor_radius=tube)
    obj = register(bpy.context.object, name, mat)
    obj.rotation_mode = 'QUATERNION'
    obj.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(pos(axis))
    smooth(obj)
    return obj


def cable(name, points, radius=.045, mat='dark'):
    curve = bpy.data.curves.new(name, 'CURVE')
    curve.dimensions = '3D'
    curve.resolution_u = 10
    curve.bevel_depth = radius
    curve.bevel_resolution = 2
    spline = curve.splines.new('BEZIER')
    spline.bezier_points.add(len(points) - 1)
    for point, value in zip(spline.bezier_points, points):
        point.co = pos(value)
        point.handle_left_type = point.handle_right_type = 'AUTO'
    obj = bpy.data.objects.new(name, curve)
    COL.objects.link(obj)
    curve.materials.append(MAT[mat])
    return obj


def display(name, at, width, height):
    x, y, z = at
    vertices = [pos((x-width/2, y-height/2, z)), pos((x+width/2, y-height/2, z)), pos((x+width/2, y+height/2, z)), pos((x-width/2, y+height/2, z))]
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], [(0, 1, 2, 3)])
    mesh.uv_layers.new()
    for loop, uv in zip(mesh.uv_layers.active.data, [(0, 0), (1, 0), (1, 1), (0, 1)]):
        loop.uv = uv
    obj = bpy.data.objects.new(name, mesh)
    COL.objects.link(obj)
    mesh.materials.append(MAT['screen'])
    return obj


def bolt(at, axis=(0, 1, 0)):
    cylinder('Socket fastener', at, .055, .035, 'silver', axis, 6)


def deck(width=11, depth=7):
    box('Floating instrument deck', (0, .12, 0), (width, .36, depth), bevel=.18)
    box('Lower chassis', (0, -.17, 0), (width-.55, .25, depth-.55), 'dark', .13)
    for x in [-width/2+.48, width/2-.48]:
        for z in [-depth/2+.48, depth/2-.48]:
            cylinder('Isolation foot', (x, -.36, z), .27, .22, 'dark')
            bolt((x, .31, z))
    for x in [-width/2+.13, width/2-.13]:
        box('Orange edge insert', (x, .315, 0), (.055, .025, depth-1), 'orange', .01)
    box('Front light recess', (0, .12, depth/2+.01), (width*.45, .085, .025), 'dark', .01)
    box('Front instrument light', (0, .12, depth/2+.027), (width*.35, .025, .01), 'amber', .003)


def keyboard(x=0, y=.68, z=2, width=4.8):
    unit = width / 15
    box('Keyboard milled aluminium tray', (x, y, z), (width+.26, .22, 1.7), 'silver', .12)
    box('Keyboard gasket', (x, y+.12, z), (width+.1, .06, 1.57), 'dark', .04)
    for row in range(5):
        for col in range(15):
            if row == 4 and 4 <= col <= 9:
                continue
            mat = 'orange' if (col == 0 and row == 0) or (col == 14 and row == 2) else 'white' if col < 12 else 'shell'
            box('Sculpted keycap', (x+(col-7)*unit, y+.22, z+(row-2)*.29), (unit*.88, .16, .255), mat, .035)
    box('Space bar', (x-.15, y+.22, z+.58), (unit*5.7, .16, .255), 'white', .045)
    cylinder('Keyboard volume dial', (x+width/2+.01, y+.24, z-.62), .095, .15, 'orange')


def monitor(x=0, y=4.3, z=-.5, width=7, height=3.94, screen='SCREEN_project'):
    box('Rear sculpted monitor shell', (x, y, z-.16), (width+.42, height+.48, .48), 'shell', .2)
    box('Titanium bezel', (x, y, z+.065), (width+.2, height+.2, .1), 'silver', .09)
    box('Glass gasket', (x, y, z+.122), (width+.07, height+.07, .028), 'dark', .02)
    display(screen, (x, y, z+.142), width, height)
    cylinder('Power button', (x+width/2-.13, y-height/2-.16, z+.1), .04, .018, 'amber', (0, 0, 1))
    for i in range(17):
        box('Rear cooling slot', (x+(i-8)*.27, y+height/2-.25, z-.405), (.12, .055, .03), 'dark', .018)
    box('Monitor neck', (x, 1.75, z-.3), (.35, 2.5, .32), 'silver', .12)
    cylinder('Tilt bearing', (x, y-.65, z-.2), .32, .62, 'orange', (1, 0, 0))
    box('Cantilever foot', (x, .46, z+.1), (2.45, .23, 1.65), 'silver', .16)
    cable('Monitor power loom', [(x+.3, y-1, z-.4), (x+.55, 1.4, z-.8), (x+1.6, .4, z-1), (x+3, .4, .2)], .06)


def workstation():
    deck(11, 7)
    monitor()
    keyboard(z=2)
    # Ribbed equipment tray, mouse, speaker, and coiled data lead.
    box('Mouse pad', (3.7, .34, 2), (1.7, .035, 2), 'dark', .12)
    mouse = box('Sculpted mouse', (3.7, .57, 1.9), (.6, .38, .95), 'white', .18)
    box('Mouse split', (3.7, .77, 1.69), (.016, .01, .34), 'dark', .004)
    cylinder('Scroll wheel', (3.7, .77, 1.75), .045, .1, 'orange', (1, 0, 0))
    box('Instrument speaker', (-4.35, 1.1, -.3), (1.05, 1.5, 1), 'shell', .16)
    for y in [.83, 1.44]:
        cylinder('Speaker recess', (-4.35, y, .217), .31, .025, 'dark', (0, 0, 1))
        torus('Speaker brushed surround', (-4.35, y, .235), .25, .027, 'silver', (0, 0, 1))
        cylinder('Speaker cone', (-4.35, y, .25), .15, .035, 'shell', (0, 0, 1))
    cable('Keyboard cable', [(-1.7, .7, 1.1), (-2.4, .5, .8), (-2.7, .42, -.5), (-1.6, .4, -1.5), (.5, .45, -1.6)], .045, 'orange')
    for i in range(14):
        box('Deck cooling gill', (4.55, .32, -1.65+i*.14), (.5, .025, .055), 'dark', .012)
    display('LABEL_project', (0, .15, 3.521), 4.2, .22)


def server():
    # Separate reusable asset; local bottom rests on the same deck height.
    box('Server alloy exoskeleton', (0, 2.65, 0), (2.5, 4.8, 2.6), 'silver', .19)
    box('Server inset cabinet', (0, 2.65, .12), (2.27, 4.57, 2.48), 'dark', .1)
    for x in [-1.07, 1.07]:
        box('Rack upright', (x, 2.65, 1.4), (.13, 4.45, .12), 'shell', .03)
        for i in range(17):
            bolt((x, .65+i*.235, 1.475), (0, 0, 1))
    for i in range(4):
        y = 1.05+i*.88
        box('Hot swap module', (0, y, .19), (2, .76, 2.55), 'shell', .07)
        box('Disk caddy', (-.13, y, 1.51), (1.45, .61, .14), 'silver', .06)
        for j in range(8):
            box('Drive ventilation', (-.65+j*.15, y+.07, 1.591), (.045, .3, .016), 'dark', .005)
        box('Drive eject tab', (.48, y-.17, 1.61), (.26, .085, .03), 'orange', .015)
        for j in range(2):
            cylinder('Activity indicator', (.82, y-.12+j*.23, 1.56), .036, .025, 'amber' if j else 'ice', (0, 0, 1), 12)
    display('LABEL_server', (0, 4.6, 1.46), 1.85, .42)
    cable('Server uplink', [(-.7, .4, -1.2), (-1.6, .18, -1.6), (-2.2, .15, -.4), (-2.8, .3, 1)], .07, 'orange')


def core():
    deck(9, 8)
    cylinder('Gyroscope pedestal', (0, .65, 0), 2.35, .65, 'shell', vertices=64)
    torus('Pedestal silver seam', (0, .83, 0), 2.25, .05, 'silver')
    cylinder('Core lower bearing', (0, 1.2, 0), .62, .5, 'silver')
    # Two fork arms carry a gimbal assembly above the instrument base.
    for x in [-2.75, 2.75]:
        box('Cast support fork', (x, 2.4, 0), (.42, 3.8, .85), 'orange', .2)
        cylinder('Fork pivot housing', (x, 4.1, 0), .5, .65, 'shell', (1, 0, 0))
        cylinder('Fork bearing cap', (x+(.36 if x>0 else -.36), 4.1, 0), .31, .07, 'silver', (1, 0, 0))
    outer = torus('ROTOR_outer', (0, 4.1, 0), 2.65, .16, 'silver', (1, 0, 0))
    # All animated meshes have origins at the physical pivot.
    inner = torus('ROTOR_inner', (0, 4.1, 0), 2.15, .13, 'orange', (0, 0, 1))
    torus('Inner luminous race', (0, 4.1, 0), 1.55, .055, 'amber')
    cylinder('Central compute spindle', (0, 4.1, 0), .62, 2.85, 'dark', vertices=48)
    for y in [2.75, 3.05, 5.15, 5.45]:
        cylinder('Machined collar', (0, y, 0), .95, .15, 'silver', vertices=48)
        torus('Collar circuit', (0, y+.081, 0), .81, .022, 'amber')
    for i in range(12):
        a = i*math.tau/12
        x, z = math.cos(a)*.7, math.sin(a)*.7
        rod('Luminous processor channel', (x, 3.1, z), (x, 5.1, z), .052, 'amber')
        x, z = math.cos(a)*1.07, math.sin(a)*1.07
        box('Heatsink fin', (x, 4.1, z), (.075, 1.7, .23), 'shell', .025).rotation_euler.z = -a
    for i in range(24):
        a = i*math.tau/24
        box('Pedestal radial cooling', (math.cos(a)*1.7, 1.02, math.sin(a)*1.7), (.12, .05, .42), 'dark', .015).rotation_euler.z = -a
    for x in [-3.9, 3.9]:
        cable('Armoured power feed', [(x, .4, 2.5), (x, .55, .5), (x*.8, 1.4, -.2), (x*.65, 2.8, 0)], .09)
    display('LABEL_core', (0, .65, 2.38), 2.7, .38)
    return outer, inner


def stack():
    deck(12.5, 7)
    # Open laptop with floating phone and a three-layer compute assembly.
    monitor(-3.3, 3.05, -.35, 4.3, 2.7, 'SCREEN_web')
    keyboard(-3.3, .62, 1.6, 3.7)
    box('Phone titanium frame', (.35, 3.5, .5), (1.8, 3.6, .23), 'silver', .2)
    box('Phone face gasket', (.35, 3.5, .625), (1.68, 3.48, .03), 'dark', .16)
    display('SCREEN_mobile', (.35, 3.5, .646), 1.49, 3.15)
    box('Phone camera island', (.35, 4.91, .665), (.49, .085, .025), 'dark', .04)
    for y in [3.7, 4.1]:
        box('Phone side button', (1.26, y, .49), (.04, .25, .09), 'orange', .02)
    cylinder('Magnetic phone pedestal', (.35, .52, .5), .86, .32, 'silver')
    rod('Phone floating mount', (.35, .6, .25), (.35, 2.5, .25), .1, 'shell')
    for i in range(3):
        y = 1.25+i*1.5
        box('Exploded compute module', (4, y, 0), (2.85, .8, 2.6), 'silver', .13)
        box('Module black gasket', (4, y+.35, 0), (2.65, .12, 2.4), 'dark', .06)
        cylinder('Cooling fan recess', (4, y+.43, 0), .85, .04, 'dark')
        torus('Fan rim', (4, y+.46, 0), .74, .027, 'silver')
        for j in range(7):
            a=j*math.tau/7
            obj=box('Fan blade', (4+math.cos(a)*.35, y+.47, math.sin(a)*.35), (.55, .025, .15), 'shell', .03)
            obj.rotation_euler.z=-a+.45
        cylinder('Fan hub', (4, y+.49, 0), .15, .05, 'orange')
        display(f'LABEL_backend_{i}', (4, y, 1.312), 2.22, .39)
        for x in [2.8, 5.2]:
            bolt((x, y+.42, 1.08))
    for x in [2.8, 5.2]:
        rod('Assembly guide rod', (x, .35, -.95), (x, 5.1, -.95), .045, 'orange')
    cable('Frontend uplink', [(-1, .4, 1), (0, .4, 2), (2, .4, 2.1), (3, .7, 1.4)], .048, 'orange')


def timeline():
    deck(12, 7)
    for i, x in enumerate([-3, 3]):
        y = 2.75+i*.9
        cylinder('Archive pedestal', (x, .55, 0), 1.6, .35, 'silver')
        rod('Articulated support', (x, .7, -.3), (x, y, -.3), .19, 'silver')
        cylinder('Pivot bearing', (x, y, -.2), .35, 1.1, 'orange', (1, 0, 0))
        box('Archive terminal shell', (x, y+.7, 0), (4.55, 3.25, .75), 'shell', .24)
        box('Archive orange edge', (x, y+.7, .39), (4.34, 3.04, .1), 'orange', .12)
        box('Archive glass recess', (x, y+.7, .453), (4.13, 2.83, .04), 'dark', .06)
        display(f'SCREEN_experience_{i}', (x, y+.7, .481), 3.95, 2.65)
        for j in range(9):
            box('Terminal exhaust', (x-1.3+j*.33, y-.79, .4), (.18, .06, .08), 'dark', .012)
    cable('Career connection', [(-3, .8, .9), (-2.5, .45, 2), (0, .45, 2.5), (2.5, .45, 2), (3, .8, .9)], .06, 'amber')


BUILDERS = {'core': core, 'terminal': workstation, 'server': server, 'stack': stack, 'timeline': timeline}
for name, build in BUILDERS.items():
    COL = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(COL)
    build()

def setup_studio():
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    scene.cycles.samples = 32
    scene.cycles.use_denoising = True
    scene.render.resolution_x = 1200
    scene.render.resolution_y = 900
    scene.render.resolution_percentage = 100
    scene.world.color = (.12, .12, .12)
    scene.view_settings.view_transform = 'AgX'
    bpy.ops.object.camera_add(location=pos((11, 8, 15)))
    camera = bpy.context.object
    camera.rotation_euler = (pos((0, 3, 0))-camera.location).to_track_quat('-Z', 'Y').to_euler()
    camera.data.type = 'ORTHO'
    camera.data.ortho_scale = 14.8
    scene.camera = camera
    for at, energy, size, color in [((2, 11, 6), 2600, 8, (1, .85, .69)), ((-7, 6, 1), 1900, 7, (.55, .73, 1)), ((3, 7, -7), 3000, 6, (1, .55, .22))]:
        bpy.ops.object.light_add(type='AREA', location=pos(at))
        lamp = bpy.context.object
        lamp.data.energy = energy
        lamp.data.shape = 'DISK'
        lamp.data.size = size
        lamp.data.color = color
        lamp.rotation_euler = (pos((0, 3, 0))-lamp.location).to_track_quat('-Z', 'Y').to_euler()
    return scene

# Store editable modifiers and a ready-to-render studio; show one asset by default.
setup_studio()
for name in BUILDERS:
    bpy.data.collections[name].hide_viewport = name != 'core'
    bpy.data.collections[name].hide_render = name != 'core'
for screen in bpy.data.screens:
    for area in screen.areas:
        if area.type == 'VIEW_3D':
            area.spaces.active.region_3d.view_perspective = 'CAMERA'
bpy.ops.wm.save_as_mainfile(filepath=str(SOURCE / 'hacker-workshop.blend'))
for name in BUILDERS:
    bpy.data.collections[name].hide_viewport = False
    bpy.data.collections[name].hide_render = False


def optimize(collection):
    groups = {}
    for obj in list(collection.objects):
        bpy.ops.object.select_all(action='DESELECT')
        obj.select_set(True)
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.convert(target='MESH')
        if not obj.name.startswith(('SCREEN_', 'LABEL_', 'ROTOR_')):
            groups.setdefault(obj.data.materials[0].name, []).append(obj)
    for name, objects in groups.items():
        bpy.ops.object.select_all(action='DESELECT')
        for obj in objects:
            obj.select_set(True)
        bpy.context.view_layer.objects.active = objects[0]
        bpy.ops.object.join()
        objects[0].name = 'Static / ' + name


manifest = {}
for name in BUILDERS:
    collection = bpy.data.collections[name]
    optimize(collection)
    bpy.ops.object.select_all(action='DESELECT')
    for obj in collection.objects:
        obj.select_set(True)
    path = OUT / f'{name}.glb'
    bpy.ops.export_scene.gltf(filepath=str(path), export_format='GLB', use_selection=True, export_apply=True, export_animations=False, export_yup=True, export_extras=False, export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6)
    triangles = sum(len(p.vertices)-2 for obj in collection.objects for p in obj.data.polygons)
    manifest[name] = {'bytes': path.stat().st_size, 'triangles': triangles, 'meshes': len(collection.objects)}
(OUT / 'manifest.json').write_text(json.dumps(manifest, indent=2)+'\n')
print('WORKSHOP_EXPORT', json.dumps(manifest))

if args.render:
    scene = bpy.context.scene
    for name in ['core', 'terminal', 'stack']:
        for key in BUILDERS:
            bpy.data.collections[key].hide_render = key != name
        scene.render.filepath = str(SOURCE / f'{name}-preview.png')
        bpy.ops.render.render(write_still=True)
