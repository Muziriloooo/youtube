import { createServer as vite } from "vite";
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
const queue = [];
let running = false;
let counter = 0;
const jobs = existsSync("exportacoes/painel/edicoes.json")
  ? JSON.parse(readFileSync("exportacoes/painel/edicoes.json", "utf8")).map(
      (j) => ({
        ...j,
        status: existsSync(`exportacoes/painel/${j.id}.mp4`)
          ? "concluído"
          : "interrompido",
      }),
    )
  : [];
async function next() {
  if (running || !queue.length) return;
  running = true;
  const job = queue.shift();
  job.status = "renderizando";
  const dest = `exportacoes/painel/${job.id}.mp4`;
  mkdirSync("exportacoes/painel", { recursive: true });
  const child = spawn(
    "node",
    [
      "scripts/render-one.mjs",
      "Personalizado",
      dest,
      JSON.stringify(job.props),
    ],
    { stdio: ["ignore", "pipe", "pipe"] },
  );
  child.stdout.on("data", (b) => (job.log = String(b).slice(-1200)));
  child.stderr.on("data", (b) => (job.log = String(b).slice(-1200)));
  child.on("error", (e) => (job.log = e.message));
  child.on("close", (code) => {
    job.status = code === 0 ? "concluído" : "falhou";
    job.file = dest;
    writeFileSync(
      "exportacoes/painel/edicoes.json",
      JSON.stringify(jobs, null, 2),
    );
    running = false;
    next();
  });
}
const server = await vite({
  root: process.cwd(),
  server: { host: "0.0.0.0", port: 3100 },
  appType: "spa",
});
server.middlewares.use("/api/jobs", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  if (req.method === "POST") {
    try {
      let b = "";
      for await (const chunk of req) {
        b += chunk;
        if (b.length > 100000) throw Error("Corpo grande demais");
      }
      const { props } = JSON.parse(b);
      if (
        !Number.isFinite(props.start) ||
        !Number.isFinite(props.end) ||
        props.start < 0 ||
        props.end > 600 ||
        props.end <= props.start
      )
        throw Error("Intervalo inválido");
      if (
        props.shortIndex !== undefined &&
        (!Number.isInteger(props.shortIndex) ||
          props.shortIndex < 0 ||
          props.shortIndex > 7 ||
          props.end > 48)
      )
        throw Error("Corte inválido");
      const j = {
        id: `corte-${Date.now()}-${++counter}`,
        props,
        status: "na fila",
        log: "",
      };
      queue.push(j);
      jobs.push(j);
      mkdirSync("exportacoes/painel", { recursive: true });
      writeFileSync(
        "exportacoes/painel/edicoes.json",
        JSON.stringify(jobs, null, 2),
      );
      next();
      res.end(JSON.stringify(j));
    } catch (e) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: e.message }));
    }
  } else res.end(JSON.stringify(jobs));
});
const api = server.middlewares.stack.pop();
server.middlewares.stack.unshift(api);
await server.listen();
console.log(
  "Painel na porta 3100. Renderizações sequenciais em exportacoes/painel.",
);
