"""Check the Blender-to-React asset contract without starting a renderer."""
import json
from pathlib import Path
import struct

ROOT = Path(__file__).resolve().parents[2] / 'public/models/hacker-workshop'
SURFACES = {
    'core': {'LABEL_core', 'ROTOR_outer', 'ROTOR_inner'},
    'terminal': {'SCREEN_project', 'LABEL_project'},
    'server': {'LABEL_server'},
    'stack': {'SCREEN_web', 'SCREEN_mobile', 'LABEL_backend_0', 'LABEL_backend_1', 'LABEL_backend_2'},
    'timeline': {'SCREEN_experience_0', 'SCREEN_experience_1'},
}
manifest = json.loads((ROOT / 'manifest.json').read_text())
total = 0
for name, expected in SURFACES.items():
    data = (ROOT / f'{name}.glb').read_bytes()
    magic, version, length = struct.unpack_from('<III', data)
    assert (magic, version, length) == (0x46546C67, 2, len(data)), name
    json_length, chunk_type = struct.unpack_from('<II', data, 12)
    assert chunk_type == 0x4E4F534A, name
    gltf = json.loads(data[20:20+json_length])
    nodes = {node['name']: node for node in gltf['nodes']}
    assert expected <= nodes.keys(), f'{name}: missing {expected - nodes.keys()}'
    assert 'KHR_draco_mesh_compression' in gltf['extensionsRequired'], name
    for surface in expected:
        mesh = gltf['meshes'][nodes[surface]['mesh']]
        assert mesh['primitives'], f'{name}/{surface}: no geometry'
        if surface.startswith(('SCREEN_', 'LABEL_')):
            assert all('TEXCOORD_0' in p['attributes'] for p in mesh['primitives']), f'{name}/{surface}: missing UVs'
    assert manifest[name]['bytes'] == len(data), f'{name}: stale manifest'
    assert len(gltf['meshes']) <= 16, f'{name}: static meshes were not merged'
    total += len(data)
assert total < 1_000_000, f'Model transfer budget exceeded: {total}'
print(f'Validated five compressed assets, named display UVs, rotor nodes, and manifest. Total: {total:,} bytes.')
