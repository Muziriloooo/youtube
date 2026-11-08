import { readFileSync, existsSync } from "node:fs";
import assert from "node:assert/strict";
const d = JSON.parse(readFileSync("src/data.json"));
const a = JSON.parse(readFileSync("src/audio-manifest.json"));
assert.equal(d.scenes.length, 40);
let end = 0;
for (const s of d.scenes) {
  assert.equal(s.start, end);
  end += s.duration;
}
assert.equal(end * 30, 18000);
assert.equal(d.shorts.length, 8);
for (const c of d.shorts) {
  let t = 0;
  for (const s of c.shots) {
    assert.equal(s.start, t);
    t += s.duration;
  }
  assert.equal(t, 48);
}
for (const s of [...d.scenes, ...d.shorts.flatMap((c) => c.shots)]) {
  assert(a[s.id]);
  assert(existsSync("public/" + a[s.id].file));
  assert(a[s.id].duration <= s.duration);
  assert(a[s.id].words.length > 0);
}
console.log(
  "PASS: 18.000 frames; 8 × 1.440; 72 vozes presentes; durações e eventos de palavra válidos.",
);
