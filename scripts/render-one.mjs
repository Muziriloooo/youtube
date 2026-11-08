import { execFileSync } from "node:child_process";
import { renameSync, existsSync } from "node:fs";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderMedia } from "@remotion/renderer";
const [id, out, propsJSON, rangeJSON] = process.argv.slice(2);
const inputProps = JSON.parse(propsJSON ?? "{}");
try {
  const serveUrl = await bundle({ entryPoint: "src/index.ts" });
  const composition = await selectComposition({
    serveUrl,
    id,
    inputProps,
    browserExecutable: "/usr/bin/chromium",
  });
  const frameRange = rangeJSON ? JSON.parse(rangeJSON) : undefined;
  const totalFrames = frameRange
    ? frameRange[1] - frameRange[0] + 1
    : composition.durationInFrames;
  await renderMedia({
    frameRange,
    composition,
    serveUrl,
    inputProps,
    outputLocation: out,
    codec: "h264",
    audioCodec: "aac",
    crf: 20,
    x264Preset: "veryfast",
    concurrency: Number(process.env.RENDER_CONCURRENCY ?? 4),
    browserExecutable: "/usr/bin/chromium",
    imageFormat: "jpeg",
    chromiumOptions: { gl: "angle" },
    onProgress: ({ renderedFrames, encodedFrames }) => {
      if (renderedFrames % 300 === 0)
        console.log(
          `${id}: ${renderedFrames}/${totalFrames}; encoded ${encodedFrames}`,
        );
    },
  });
  const temp = out + ".trim.mp4";
  execFileSync("ffmpeg", [
    "-v",
    "error",
    "-y",
    "-i",
    out,
    "-c:v",
    "copy",
    "-c:a",
    "aac",
    "-af",
    `atrim=duration=${totalFrames / composition.fps}`,
    "-t",
    String(totalFrames / composition.fps),
    "-movflags",
    "+faststart",
    temp,
  ]);
  renameSync(temp, out);
  console.log("DONE", out);
  process.exit(0);
} catch (e) {
  console.error(e);
  process.exit(1);
}
