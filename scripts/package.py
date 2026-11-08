"""Package the actual rendered deliverables and all source assets, without caches."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED, ZIP_STORED
import os
root=Path(__file__).resolve().parents[1];os.chdir(root)
clips=[Path(f'exportacoes/shorts/corte_{i:02}.mp4') for i in range(1,9)]
required=clips+[Path('exportacoes/youtube/documentario_completo.mp4')]
missing=[str(p) for p in required if not p.is_file()]
if missing:raise SystemExit('Exportações ainda ausentes: '+', '.join(missing))
with ZipFile('exportacoes/cortes_verticais.zip','w',compression=ZIP_STORED) as z:
 for p in clips:z.write(p,'shorts/'+p.name)
 for p in Path('exportacoes/legendas').glob('corte_*.srt'):z.write(p,'legendas/'+p.name)
 z.write('docs/publicacoes.json','publicacoes.json');z.write('docs/fontes-e-licencas.md','fontes-e-licencas.md')
with ZipFile('exportacoes/projeto_constantinopla.zip','w',compression=ZIP_DEFLATED,compresslevel=1) as z:
 for directory in ['src','public','scripts','panel','docs','exportacoes/legendas']:
  for p in Path(directory).rglob('*'):
   if p.is_file() and '__pycache__' not in p.parts:z.write(p,'youtube/'+str(p))
 for name in ['README.md','package.json','package-lock.json','tsconfig.json','remotion.config.ts','index.html','.gitignore','.nvmrc','.gitattributes','assistir.html']:
  z.write(name,'youtube/'+name)
print('Archives created with real source, audio, illustrations and eight rendered shorts.')
