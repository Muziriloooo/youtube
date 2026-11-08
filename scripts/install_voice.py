import urllib.request,lzma,hashlib,subprocess
from pathlib import Path
base='https://deb.debian.org/debian/'
raw=lzma.decompress(urllib.request.urlopen(base+'dists/bookworm/main/binary-amd64/Packages.xz').read()).decode()
root=Path(__file__).resolve().parents[1]/'.tools/espeak';root.mkdir(parents=True,exist_ok=True)
for block in raw.split('\n\n'):
 d=dict(line.split(': ',1) for line in block.splitlines() if ': ' in line and not line.startswith(' '))
 if d.get('Package') in ['espeak-ng','libespeak-ng1','espeak-ng-data','libpcaudio0','libsonic0']:
  b=urllib.request.urlopen(base+d['Filename']).read();assert hashlib.sha256(b).hexdigest()==d['SHA256']
  f=root/(d['Package']+'.deb');f.write_bytes(b);subprocess.run(['dpkg-deb','-x',str(f),str(root)],check=True);print(d['Package'],d['Version'],'SHA256 OK')
