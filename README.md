# Constantinopla / 1453

## Downloads dos arquivos prontos

- [Documentário completo — MP4, 10 minutos, 1080p](https://github.com/Muziriloooo/youtube/raw/refs/heads/main/exportacoes/youtube/documentario_completo.mp4)
- [Oito cortes verticais — ZIP](https://github.com/Muziriloooo/youtube/raw/refs/heads/main/exportacoes/cortes_verticais.zip)
- [Projeto completo com roteiro, áudio e assets — ZIP](https://github.com/Muziriloooo/youtube/raw/refs/heads/main/exportacoes/projeto_constantinopla.zip)
- Pilotos de 45 segundos: [horizontal](https://github.com/Muziriloooo/youtube/raw/refs/heads/main/exportacoes/piloto/piloto_horizontal.mp4) e [vertical](https://github.com/Muziriloooo/youtube/raw/refs/heads/main/exportacoes/piloto/piloto_vertical.mp4)

Aguarde o download terminar antes de abrir o arquivo. O documentário tem aproximadamente 290 MB.

Os vídeos, áudios e pacotes são armazenados com Git LFS. Para obter o projeto por Git:

```sh
git lfs install
git clone https://github.com/Muziriloooo/youtube.git
cd youtube
git lfs pull
```

O ZIP do projeto, no link acima, já contém os arquivos de áudio e imagens.

Projeto Remotion em português: documentário de **600 s / 18.000 frames / 30 fps**, oito narrativas verticais independentes de **48 s / 1.440 frames**, dois pilotos de 45 s e editor local.

**Estado editorial:** versão animada de revisão, com voz eSpeak provisória e ilustrações vetoriais estilizadas. Não certificada como documentário final de qualidade profissional. Consulte `docs/validacao.json` para os arquivos efetivamente renderizados, nunca infira uma exportação pela existência da composição.

## Instalar

Node 24.22.1 (ou 22.12+); Python 3.12+; FFmpeg; Chromium. No ambiente atual, dependências e áudio já estão preparados.

```sh
cd /workspace/youtube
npm ci --cache /tmp/npm-cache
python scripts/install_voice.py
npm run audio
npm run typecheck
```

O instalador local obtém pacotes Debian por HTTPS e verifica SHA256 contra o índice oficial. Não requer sudo. Em outra distribuição, prefira instalar eSpeak NG pelo gerenciador oficial e ajustar ESPEAK_ROOT. O Chromium configurado está em `/usr/bin/chromium`; ajuste `remotion.config.ts` e o caminho em `scripts/render-one.mjs` se necessário.

## Visualizar e editar

```sh
npm run studio  # porta 3000
npm run panel   # porta 3100
```

Painel: seleção da origem, início/fim em segundos, playhead, orientação, título e legenda alternativa, preview Remotion Player e fila sequencial de exportação. O seletor “Legenda por plano” permite alterar cada bloco separadamente. Editar a legenda alternativa global substitui o texto no intervalo inteiro e usa sincronização estimada; para legendas precisas, edite por plano em `src/data.json` e regenere o áudio. As edições enfileiradas são salvas em `exportacoes/painel/edicoes.json`. O servidor é local, sem autenticação, para uso no ambiente de desenvolvimento.

## Renderizar

```sh
npm run render -- pilot  # obrigatório antes da montagem completa
npm run render -- main
npm run render -- shorts
npm run render -- all
npm run verify
```

Saída H.264 / AAC, 1920×1080 ou 1080×1920, 30 fps:

- `exportacoes/piloto/piloto_horizontal.mp4` e `piloto_vertical.mp4`
- `exportacoes/youtube/documentario_completo.mp4`
- `exportacoes/shorts/corte_01.mp4` até `corte_08.mp4`

O filme é renderizado em dez capítulos de 1.800 frames e montado com normalização de timestamps para manter exatamente 600 segundos. O cache em `exportacoes/.partes` permite retomar o trabalho se código e assets permanecerem iguais; mudanças nesses arquivos invalidam o cache.

Os MP4s e WAVs são locais e ignorados pelo Git. Preserve-os ou regenere-os antes de transferir o projeto. A verificação distingue arquivos ausentes de aprovados.

## Voz profissional

Importe WAVs por bloco em `public/voice-import/<id>.wav`; IDs e textos estão em `src/data.json` (0–39 no filme; 100–131 nos cortes). Execute `npm run audio` novamente e renderize. A rotina normaliza voz para -18 LUFS, deixa 300 ms iniciais e ajusta o tempo ao bloco; rejeita aceleração superior a 1,8×. Para preservar uma voz profissional, grave cada bloco já dentro do tempo disponível. Não há serviço comercial de TTS configurado, nem solicitação de chave em chat.

As palavras da voz eSpeak são sincronizadas pelos eventos do próprio motor. A narração importada aceita um arquivo opcional `<id>.words.json`, com lista de `{time: segundos, position: índice inicial do texto a partir de zero, length: número de caracteres}`; esses tempos são ajustados com a voz. Sem esse arquivo, precisa de alinhamento revisado; a implementação usa estimativa proporcional quando não há eventos. Música e ambiente são stems independentes em `public/audio`; a música faz ducking suave durante falas. O ambiente de batalha é sonoridade procedural estilizada, não Foley realista.

## Organização

`src/components`: animações SVG e títulos; `src/scenes`: montagem; `src/Root.tsx`: composições; `src/data.json`: timeline e narrativas; `src/audio-manifest.json`: durações e palavras; `panel`: editor; `scripts`: áudio, instalação, render e verificação; `docs`: roteiro, storyboard, fontes e publicações.

Leia `docs/fontes-e-licencas.md` antes de publicar. Os mapas militares são diagramas. A voz natural, ilustrações históricas detalhadas e revisão histórica especializada continuam necessárias para atingir o padrão editorial solicitado.
