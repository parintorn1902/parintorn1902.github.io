"""Build Boop with rigid hip, knee, ankle and shoulder joints (Three.js Y-up)."""
from pathlib import Path
import bpy
from mathutils import Vector
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
bpy.context.preferences.filepaths.save_version=0
out=Path(__file__).resolve().parent
export=out.parent.parent/'public/models/boop.glb'

def material(name,color,metal=0):
 m=bpy.data.materials.new(name);m.use_nodes=True
 p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1)
 p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=.32
 return m
cream=material('Bot porcelain',(.85,.82,.59));teal=material('Bot mint',(.08,.64,.44));black=material('Bot visor',(.006,.025,.028));pink=material('Bot cheeks',(.9,.16,.25));white=material('Bot eyes',(.85,1,.92))
def box(name,at,size,mat,bevel=.15):
 bpy.ops.mesh.primitive_cube_add(size=1,location=(at[0],-at[2],at[1]));o=bpy.context.object;o.name=name;o.dimensions=(size[0],size[2],size[1]);bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 o.data.materials.append(mat)
 b=o.modifiers.new('Soft toy corners','BEVEL');b.width=bevel;b.segments=5
 for p in o.data.polygons:p.use_smooth=True
 o.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
 return o
def ball(name,at,r,mat):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=20,ring_count=12,radius=r,location=(at[0],-at[2],at[1]));o=bpy.context.object;o.name=name;o.data.materials.append(mat)
 for p in o.data.polygons:p.use_smooth=True
 return o
def joint(name, at, parent=None):
 o=bpy.data.objects.new(name,None);bpy.context.collection.objects.link(o)
 o.location=(at[0],-at[2],at[1]);bpy.context.view_layer.update()
 if parent: attach(o,parent)
 return o

def attach(obj,parent):
 bpy.context.view_layer.update()
 world=obj.matrix_world.copy();obj.parent=parent;obj.matrix_world=world
 return obj

body=joint('body',(0,0,0))
def upper(obj):
 obj.location.z+=.32
 return attach(obj,body)
upper(box('BOT_body',(0,1,0),(1,.95,.75),cream,.23))
upper(box('Utility pocket',(0,.95,.385),(.63,.38,.09),teal,.08))
upper(box('Pocket slot',(0,1,.441),(.3,.03,.01),black,.01))
upper(box('BOT_head',(0,1.97,0),(1.55,1.04,.94),teal,.25))
upper(box('Face glass',(0,1.98,.482),(1.22,.7,.06),black,.2))
for x in [-.31,.31]:
 upper(box('Happy eye',(x,2.06,.522),(.15,.23,.02),white,.065))
 upper(ball('Rose cheek',(x*1.5,1.83,.52),.075,pink))
upper(box('Smile',(0,1.81,.53),(.25,.045,.025),white,.02))
upper(box('Antenna',(0,2.68,-.1),(.055,.5,.055),cream,.024))
upper(ball('Antenna heart',(0,2.95,-.1),.15,pink))
for side,sign in [('left',1),('right',-1)]:
 x=.76*sign
 upper(ball('Ear hinge',(x,2,0),.19,cream))
 shoulder=joint('shoulder_'+side,(x*.84,1.67,0),body)
 attach(ball('Shoulder '+side,(x*.84,1.67,0),.2,black),shoulder)
 attach(box('Arm '+side,(x*.94,1.35,.02),(.23,.55,.25),teal,.1),shoulder)
 attach(ball('Mitten '+side,(x*.94,1.08,.04),.2,cream),shoulder)
 x=.31*sign
 hip=joint('hip_'+side,(x,.97,0),body)
 attach(box('Thigh '+side,(x,.76,0),(.24,.42,.27),black,.07),hip)
 knee=joint('knee_'+side,(x,.55,0),hip)
 attach(ball('Knee cap '+side,(x,.55,.02),.15,teal),knee)
 attach(box('Shin '+side,(x,.34,0),(.23,.42,.26),black,.07),knee)
 ankle=joint('ankle_'+side,(x,.13,0),knee)
 attach(box('Sneaker '+side,(x,.13,.14),(.46,.26,.66),cream,.12),ankle)
 attach(box('Shoe stripe '+side,(x,.17,.473),(.31,.055,.016),teal,.02),ankle)
bpy.ops.wm.save_as_mainfile(filepath=str(out/'boop.blend'))
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=str(export),export_format='GLB',export_apply=True,export_animations=False)
