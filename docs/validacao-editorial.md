# Estado de revisão

Validação nesta máquina: TypeScript; timeline contínua de 600s e 18.000 frames; oito cortes de 48s; 72 WAVs com duração compatível; eventos de palavra do sintetizador; painel carregado em Chromium; exportação de seleção de teste pela API.

Piloto horizontal: inspeção de quadros a 3s e 11s e contato a cada 5s. Voz, mapas, cidade e exército presentes. Medição: −18,6 LUFS integrados, −4,35 dBTP. A narração ainda é robótica e provisória.

Piloto vertical: primeira inspeção detectou geometria extravasando a área do mapa. Corrigida com viewport SVG interno, mantendo cidade, títulos, mapa e legendas. O arquivo de validação técnica é gerado por `npm run verify`.

Limites: inspeção por amostragem, sem certificação histórica. Não foi feita revisão auditiva humana integral. As tropas são símbolos vetoriais; rotas e fronteiras precisam de refinamento histórico. A arte gerada não é uma reconstrução arqueológica. A música e os ruídos são procedurais, não uma orquestra ou Foley realista. Não há serviço de voz profissional configurado.

Teste adicional no piloto horizontal: 1.350 frames decodificados, nenhum par de frames adjacentes idêntico. O detector de baixa atividade sinalizou passagens de câmera lenta; isso não equivale a vídeo congelado. Não houve tela preta de duração igual ou superior a 0,5 segundo nos dois pilotos. Os logs técnicos estão em out/ (arquivos locais de inspeção).

Exportação definitiva de revisão: tropas separadas em coordenadas de mapa e de chão; viewport do mapa principal e do detalhe vertical corrigidos; tamanho das legendas cartográficas adaptado ao vertical. Pilotos revisados com esses ajustes: 45,000s, 1.350 frames, H.264/AAC nos dois formatos. Render integral em capítulos verificáveis de 1.800 frames, com concatenação final sem recompressão do vídeo.

## Conferência das exportações entregues

Documentário: 600,000 segundos, 18.000 frames decodificados, 1920×1080, 30 FPS, H.264/AAC. Oito cortes: 48,000 segundos e 1.440 frames cada, 1080×1920, 30 FPS, H.264/AAC. Dois pilotos: 45,000 segundos e 1.350 frames cada. Os onze arquivos passaram na verificação técnica.

Por solicitação do autor, as exportações não mostram avisos sobre origem dos recursos, ilustração ou estado da locução. Essas informações são mantidas nesta documentação. Conferência visual por amostragem: filme aos 3, 125, 325, 365 e 580 segundos; os oito cortes ao primeiro segundo; pilotos após a atualização. Os limites de revisão histórica, topografia e naturalidade da voz descritos acima permanecem válidos.
