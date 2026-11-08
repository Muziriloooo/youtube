import { execFileSync } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";
const files = [
  ["exportacoes/piloto/piloto_horizontal.mp4", 1350, 1920, 1080],
  ["exportacoes/piloto/piloto_vertical.mp4", 1350, 1080, 1920],
  ["exportacoes/youtube/documentario_completo.mp4", 18000, 1920, 1080],
  ...Array.from({ length: 8 }, (_, i) => [
    `exportacoes/shorts/corte_${String(i + 1).padStart(2, "0")}.mp4`,
    1440,
    1080,
    1920,
  ]),
];
const report = [];
for (const [file, frames, w, h] of files.filter(
  (f) => process.argv[2] !== "pilot" || f[0].includes("/piloto/"),
)) {
  if (!existsSync(file)) {
    report.push({ file, status: "ausente" });
    continue;
  }
  const d = JSON.parse(
    execFileSync(
      "ffprobe",
      ["-v", "error", "-show_streams", "-show_format", "-of", "json", file],
      { encoding: "utf8" },
    ),
  );
  const v = d.streams.find((s) => s.codec_type === "video"),
    a = d.streams.find((s) => s.codec_type === "audio");
  const ok =
    Number(v.nb_frames) === frames &&
    v.width === w &&
    v.height === h &&
    v.r_frame_rate === "30/1" &&
    v.codec_name === "h264" &&
    a?.codec_name === "aac" &&
    Math.abs(Number(d.format.duration) - frames / 30) < 0.002;
  report.push({
    file,
    status: ok ? "passou" : "falhou",
    frames: v.nb_frames,
    width: v.width,
    height: v.height,
    video: v.codec_name,
    audio: a?.codec_name,
    duration: d.format.duration,
  });
}
writeFileSync("docs/validacao.json", JSON.stringify(report, null, 2));
console.log(report);
if (report.some((x) => x.status !== "passou")) process.exitCode = 1;
