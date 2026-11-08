import json,re
from pathlib import Path
root=Path(__file__).resolve().parents[1]
d=json.loads((root/'src/data.json').read_text());a=json.loads((root/'src/audio-manifest.json').read_text())
def clock(t):
 ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
def write(name,shots,size):
 cues=[]
 for s in shots:
  words=list(re.finditer(r'\S+',s['text']));voice=a[str(s['id'])];events=voice.get('words',[])
  starts=[]
  for idx in range(0,len(words),size):
   pos=words[idx].start();stamp=next((e['time'] for e in events if e['position']>=pos),voice['duration']*idx/len(words))
   starts.append((stamp,' '.join(w.group() for w in words[idx:idx+size])))
  for i,(start,text) in enumerate(starts):
   end=starts[i+1][0] if i+1<len(starts) else voice['duration']
   cues.append((s['start']+start,s['start']+max(start+.05,end),text))
 path=root/'exportacoes/legendas'/name;path.parent.mkdir(parents=True,exist_ok=True)
 path.write_text('\n\n'.join(f'{i+1}\n{clock(t)} --> {clock(u)}\n{text}' for i,(t,u,text) in enumerate(cues))+'\n')
write('documentario_completo.srt',d['scenes'],6)
for i,c in enumerate(d['shorts']):write(f'corte_{i+1:02}.srt',c['shots'],4)
