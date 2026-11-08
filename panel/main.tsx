import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Player, PlayerRef } from "@remotion/player";
import { Documentary, type EditProps } from "../src/scenes/Documentary";
import data from "../src/data.json";
import "./style.css";
function App() {
  const [start, S] = useState(0),
    [end, E] = useState(600),
    [vertical, V] = useState(false),
    [title, T] = useState(""),
    [caption, C] = useState(""),
    [selected, Q] = useState(-1),
    [jobs, J] = useState<any[]>([]),
    [error, X] = useState("");
  const [captions, setCaptions] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState("0");
  const sourceShots = selected < 0 ? data.scenes : data.shorts[selected].shots;
  const ref = useRef<PlayerRef>(null);
  useEffect(() => {
    const timer = setInterval(
      () =>
        fetch("/api/jobs")
          .then((r) => r.json())
          .then(J)
          .catch(() => {}),
      1500,
    );
    return () => clearInterval(timer);
  }, []);
  const props = {
    start,
    end,
    vertical,
    title,
    caption,
    captions,
    ...(selected >= 0 ? { shortIndex: selected } : {}),
  };
  const submit = async (p: EditProps = props) => {
    const r = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ props: p }),
    });
    if (!r.ok) X((await r.json()).error);
  };
  const valid = end > start && start >= 0 && end <= (selected < 0 ? 600 : 48);
  return (
    <main>
      <header>
        <small>SALA DE MONTAGEM / DOCUMENTÁRIO HISTÓRICO</small>
        <h1>
          CONSTANTINOPLA <em>1453</em>
        </h1>
        <p>40 sequências · 18.000 frames · 8 histórias verticais</p>
      </header>
      <section>
        <div className="viewer">
          <Player
            ref={ref}
            component={Documentary}
            inputProps={props}
            durationInFrames={valid ? Math.round((end - start) * 30) : 30}
            compositionWidth={vertical ? 1080 : 1920}
            compositionHeight={vertical ? 1920 : 1080}
            fps={30}
            controls
            style={{ height: 650, maxWidth: "100%" }}
          />
          <p>Prévia do vídeo • 30 FPS • legendas sincronizadas</p>
        </div>
        <aside>
          <label>
            Fonte
            <select
              value={selected}
              onChange={(e) => {
                const n = +e.target.value;
                Q(n);
                V(n >= 0);
                setCaptions({});
                setEditing(String(n < 0 ? 0 : data.shorts[n].shots[0].id));
                S(0);
                E(n < 0 ? 600 : 48);
                T("");
                C("");
              }}
            >
              <option value={-1}>Documentário completo</option>
              {data.shorts.map((s, i) => (
                <option value={i} key={s.id}>
                  {i + 1}. {s.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            Início (segundos)
            <input
              type="number"
              min="0"
              max="599"
              step=".1"
              value={start}
              onChange={(e) => S(+e.target.value)}
            />
          </label>
          <label>
            Fim (segundos)
            <input
              type="number"
              min="1"
              max="600"
              step=".1"
              value={end}
              onChange={(e) => E(+e.target.value)}
            />
          </label>
          <button
            onClick={() => {
              S(start + (ref.current?.getCurrentFrame() ?? 0) / 30);
              ref.current?.seekTo(0);
            }}
          >
            Marcar início no playhead
          </button>
          <button
            onClick={() =>
              E(
                Math.min(
                  selected < 0 ? 600 : 48,
                  start + (ref.current?.getCurrentFrame() ?? 0) / 30 + 1 / 30,
                ),
              )
            }
          >
            Marcar fim no playhead
          </button>
          <label>
            Enquadramento
            <select
              value={vertical ? "v" : "h"}
              onChange={(e) => V(e.target.value === "v")}
            >
              <option value="v">Vertical · 1080 × 1920</option>
              <option value="h">Horizontal · 1920 × 1080</option>
            </select>
          </label>
          <label>
            Título alternativo
            <input value={title} onChange={(e) => T(e.target.value)} />
          </label>
          <label>
            Legenda alternativa (vazio preserva original)
            <textarea value={caption} onChange={(e) => C(e.target.value)} />
          </label>
          <label>
            Legenda por plano
            <select
              value={editing}
              onChange={(e) => setEditing(e.target.value)}
            >
              {sourceShots.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.start}s · {s.title}
                </option>
              ))}
            </select>
            <textarea
              value={
                captions[editing] ??
                sourceShots.find((s) => String(s.id) === editing)?.text ??
                ""
              }
              onChange={(e) =>
                setCaptions({ ...captions, [editing]: e.target.value })
              }
            />
          </label>
          <p style={{ fontSize: 12 }}>
            Editar legendas não altera a voz. Revise a sincronização de textos
            modificados.
          </p>
          <button disabled={!valid} onClick={() => submit()}>
            Exportar seleção
          </button>
          <button
            onClick={() =>
              data.shorts.forEach((s, i) =>
                submit({
                  start: 0,
                  end: 48,
                  vertical: true,
                  title: "",
                  caption: "",
                  shortIndex: i,
                }),
              )
            }
          >
            Exportar os oito cortes
          </button>
          <p>
            {error ||
              `${valid ? Math.round((end - start) * 30) : 0} frames na seleção`}
          </p>
        </aside>
      </section>
      <h2>Fila de exportação</h2>
      {jobs.map((j) => (
        <p key={j.id}>
          {j.id} · {j.status} · {j.file}
          <small>{j.status === "falhou" ? j.log : ""}</small>
        </p>
      ))}
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
