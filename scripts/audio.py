"""Local provisional voice, original procedural score and environmental Foley.
VOICE_DIR can contain professional WAV files named <shot-id>.wav.
ESPEAK_ROOT points at a local espeak-ng installation. Never stores credentials.
"""
import os,json,subprocess,wave,math,random,array
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];os.chdir(ROOT)
data=json.loads(Path('src/data.json').read_text());manifest={};rate=22050
esroot=Path(os.environ.get('ESPEAK_ROOT',str(ROOT/'.tools/espeak')))
env=os.environ.copy();env['LD_LIBRARY_PATH']=str(esroot/'usr/lib/x86_64-linux-gnu');env['ESPEAK_DATA_PATH']=str(esroot/'usr/lib/x86_64-linux-gnu/espeak-ng-data')
voice=Path(os.environ.get('VOICE_DIR','public/voice-import'));Path('public/audio').mkdir(parents=True,exist_ok=True)
def run(a,**kw): subprocess.run(a,check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE,**kw)
for s in data['scenes']+[s for c in data['shorts'] for s in c['shots']]:
 ident=str(s['id']);src=voice/(ident+'.wav');raw=Path('/tmp/voice-'+ident+'.wav');out=Path('public/audio/'+ident+'.wav')
 events=[]
 if src.exists():
  raw=src
  timing=src.with_suffix(".words.json")
  if timing.exists():
   events=[dict(time=e["time"],position=e["position"]+1,length=e["length"]) for e in json.loads(timing.read_text())]
 else:
  result=subprocess.run(['python','scripts/voice_engine.py',s['text'],str(raw)],env=env,check=True,capture_output=True,text=True)
  events=json.loads(result.stdout)
 with wave.open(str(raw)) as w: duration=w.getnframes()/w.getframerate()
 target=s['duration']-.6;speed=max(1,duration/target)
 if speed>1.8: raise RuntimeError('Voice too long for shot '+ident)
 run(['ffmpeg','-y','-i',str(raw),'-af',f'atempo={speed},adelay=300|300,loudnorm=I=-18:TP=-2:LRA=8','-ar',str(rate),str(out)])
 manifest[ident]={'file':'audio/'+ident+'.wav','duration':round(duration/speed+.3,3),'provisional':not src.exists(),'words':[dict(time=round(e['time']/speed+.3,3),position=e['position']-1,length=e['length']) for e in events]}
Path('src/audio-manifest.json').write_text(json.dumps(manifest,indent=2))
# Short-format cannon stinger, synchronized by frame in ShotView.
if not Path('public/audio/cannon.wav').exists():
 fx_rng=random.Random(1453);fx=array.array('h')
 for i in range(rate):
  t=i/rate;value=(fx_rng.uniform(-1,1)*.4+math.sin(2*math.pi*(65-30*t)*t)*.45)*math.exp(-t*7);fx.append(int(value*32767))
 with wave.open('public/audio/cannon.wav','wb') as w:
  w.setparams((1,2,rate,0,'NONE','not compressed'));w.writeframes(fx.tobytes())
if Path('public/audio/score.wav').exists() and Path('public/audio/ambience.wav').exists():
 print('Updated voice and word timestamps; retained existing original score.');raise SystemExit(0)
# Independently generated stems; no samples or borrowed compositions.
rng=random.Random(1453)
for stem in ['score','ambience']:
 out=wave.open('public/audio/'+stem+'.wav','wb');out.setparams((1,2,rate,0,'NONE','not compressed'))
 noise=0.
 for sec in range(600):
  samples=array.array('h');chord=[73.416,65.406,58.27,65.406][(sec//15)%4]
  for n in range(rate):
   t=sec+n/rate;noise=.97*noise+.03*rng.uniform(-1,1)
   if stem=='score':
    value=sum(math.sin(2*math.pi*chord*k*t)/(k*7) for k in [1,1.5,2,3])*(.7+.3*math.sin(t*.28)**2)
    value+=math.sin(2*math.pi*146.832*t)*math.exp(-(t%2)*6)*.09
   else:
    value=noise*(.30+.1*math.sin(t*.4))
    # Each cannon flash repeats at frame 0/100 within siege shots.
    local=t%15;blast=local%(100/30)
    if (240<=t<300 or 420<=t<480): value+=noise*math.exp(-blast*5)*1.5
   fade=min(1,t/3,(600-t)/3);samples.append(int(max(-.95,min(.95,value*fade))*32767))
  out.writeframes(samples.tobytes())
 out.close()
print('Generated',len(manifest),'voice clips; music and ambience stems, 600 seconds each. Voice is provisional eSpeak unless imported.')
