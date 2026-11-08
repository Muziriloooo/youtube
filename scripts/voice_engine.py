"""eSpeak NG word event timestamps, same engine used to produce the WAV."""
import ctypes as c,os,wave
from pathlib import Path
root=Path(os.environ.get('ESPEAK_ROOT',str(Path(__file__).resolve().parents[1]/'.tools/espeak')))
# Run this module as a subprocess with the library search path configured.
lib=c.CDLL(str(root/'usr/lib/x86_64-linux-gnu/libespeak-ng.so.1'))
class Id(c.Union):_fields_=[('number',c.c_int),('name',c.c_char_p),('string',c.c_char*8)]
class Event(c.Structure):_fields_=[('type',c.c_int),('unique',c.c_uint),('position',c.c_int),('length',c.c_int),('audio_position',c.c_int),('sample',c.c_int),('user_data',c.c_void_p),('id',Id)]
CB=c.CFUNCTYPE(c.c_int,c.POINTER(c.c_short),c.c_int,c.POINTER(Event))
def synth(text,path):
 chunks=[];events=[]
 @CB
 def callback(wav,n,ev):
  if wav and n:chunks.append(c.string_at(wav,n*2))
  i=0
  while ev and ev[i].type:
   e=ev[i]
   if e.type==1:events.append(dict(time=e.audio_position/1000,position=e.position,length=e.length))
   i+=1
  return 0
 rate=lib.espeak_Initialize(2,0,str(root/'usr/lib/x86_64-linux-gnu').encode(),0)
 if rate<=0:raise RuntimeError('Voice initialization failed')
 lib.espeak_SetVoiceByName(b'pt-br');lib.espeak_SetParameter(1,167,0);lib.espeak_SetParameter(3,37,0);lib.espeak_SetSynthCallback(callback)
 encoded=text.encode();lib.espeak_Synth(encoded,len(encoded)+1,0,1,0,1,None,None);lib.espeak_Synchronize()
 with wave.open(str(path),'wb') as w:w.setparams((1,2,rate,0,'NONE','not compressed'));w.writeframes(b''.join(chunks))
 lib.espeak_Terminate();return events
if __name__=='__main__':
 import sys,json
 print(json.dumps(synth(sys.argv[1],sys.argv[2])))
