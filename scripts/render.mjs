import { spawn, execFileSync } from "node:child_process";
import {
  mkdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
  readdirSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
const mode = process.argv[2] ?? "all";
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(`${dir}/${e.name}`) : [`${dir}/${e.name}`],
  );
}
async function render(id, file, range) {
  mkdirSync(file.substring(0, file.lastIndexOf("/")), { recursive: true });
  await new Promise((yes, no) => {
    const p = spawn(
      "node",
      [
        "scripts/render-one.mjs",
        id,
        file,
        "{}",
        ...(range ? [JSON.stringify(range)] : []),
      ],
      { stdio: "inherit" },
    );
    p.on("error", no);
    p.on("exit", (c) => (c === 0 ? yes() : no(Error(`${id}: ${c}`))));
  });
}
if (mode === "pilot") {
  await render("PilotoHorizontal", "exportacoes/piloto/piloto_horizontal.mp4");
  await render("PilotoVertical", "exportacoes/piloto/piloto_vertical.mp4");
} else {
  if (mode !== "shorts") {
    const cache = "exportacoes/.partes";
    mkdirSync(cache, { recursive: true });
    const hash = createHash("sha256");
    for (const f of [
      ...walk("src"),
      ...walk("public"),
      "scripts/render-one.mjs",
    ])
      hash.update(f).update(readFileSync(f));
    const fingerprint = hash.digest("hex");
    const recordFile = `${cache}/estado.json`;
    let record = existsSync(recordFile)
      ? JSON.parse(readFileSync(recordFile))
      : {};
    if (record.fingerprint !== fingerprint)
      record = { fingerprint, completed: [] };
    for (let c = 0; c < 10; c++) {
      const dest = `${cache}/capitulo_${String(c + 1).padStart(2, "0")}.mp4`;
      if (record.completed.includes(c) && existsSync(dest)) {
        console.log("REUSE", dest);
        continue;
      }
      console.log(`CAPÍTULO ${c + 1}/10`);
      await render("Documentario", dest, [c * 1800, c * 1800 + 1799]);
      const info = JSON.parse(
        execFileSync(
          "ffprobe",
          [
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-show_entries",
            "stream=nb_frames",
            "-of",
            "json",
            dest,
          ],
          { encoding: "utf8" },
        ),
      );
      if (Number(info.streams[0].nb_frames) !== 1800)
        throw Error("Capítulo com número incorreto de frames");
      record.completed.push(c);
      writeFileSync(recordFile, JSON.stringify(record, null, 2));
    }
    const list = `${cache}/concat.txt`;
    writeFileSync(
      list,
      Array.from(
        { length: 10 },
        (_, c) =>
          `file '${resolve(`${cache}/capitulo_${String(c + 1).padStart(2, "0")}.mp4`)}'`,
      ).join("\n"),
    );
    mkdirSync("exportacoes/youtube", { recursive: true });
    execFileSync(
      "ffmpeg",
      [
        "-v",
        "error",
        "-y",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        list,
        "-vf",
        "setpts=PTS-STARTPTS",
        "-c:v",
        "libx264",
        "-crf",
        "18",
        "-preset",
        "veryfast",
        "-threads",
        "4",
        "-r",
        "30",
        "-fps_mode",
        "cfr",
        "-c:a",
        "aac",
        "-af",
        "atrim=duration=600,asetpts=PTS-STARTPTS",
        "-t",
        "600",
        "-movflags",
        "+faststart",
        "exportacoes/youtube/documentario_completo.mp4",
      ],
      { stdio: "inherit" },
    );
    console.log("DONE DOCUMENTÁRIO: 600 segundos");
  }
  if (mode !== "main")
    for (let i = 1; i <= 8; i++)
      await render(
        `Corte${String(i).padStart(2, "0")}`,
        `exportacoes/shorts/corte_${String(i).padStart(2, "0")}.mp4`,
      );
}
