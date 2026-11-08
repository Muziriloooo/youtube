import json
from pathlib import Path
# Equirectangular regional projection, 22–34 E / 38–44 N; city at 28.9784 E, 41.0082 N.
d=json.loads(Path('/tmp/land.json').read_text());paths=[]
for feat in d['features']:
 polygons=feat['geometry']['coordinates'] if feat['geometry']['type']=='MultiPolygon' else [feat['geometry']['coordinates']]
 for poly in polygons:
  ring=poly[0]
  if not any(20<x<36 and 36<y<46 for x,y in ring):continue
  paths.append('M'+'L'.join(f'{(x-22)/12*1600:.1f},{(44-y)/6*900:.1f}' for x,y in ring)+'Z')
Path('src/geography.json').write_text(json.dumps({'land':paths,'city':[930.45,448.77]}))
