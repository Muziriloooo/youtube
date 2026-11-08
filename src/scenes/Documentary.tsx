import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";
import data from "../data.json";
import audio from "../audio-manifest.json";
import {
  AnimatedHistoricalMap,
  AnimatedArmy,
  ArtilleryConvoy,
  NavalFleet,
  NavalTheater,
  CharacterParallax,
  MedievalCity,
  SiegeAnimation,
  CinematicCamera,
  HistoricalTimeline,
  HistoricalTitle,
  AnimatedSubtitles,
  C,
} from "../components";
export type Shot = (typeof data.scenes)[number];
export const ShotView = ({
  shot,
  vertical = false,
  title,
  caption,
  isShort = false,
}: {
  shot: Shot;
  vertical?: boolean;
  title?: string;
  caption?: string;
  isShort?: boolean;
}) => {
  const f = useCurrentFrame();
  const visualKind =
    f % 450 < 225
      ? shot.kind
      : (
          {
            city: "map",
            map: "city",
            army: "siege",
            fleet: "fleet",
            character: "character",
            siege: "siege",
          } as Record<string, string>
        )[shot.kind];
  const a = (
    audio as Record<
      string,
      {
        file: string;
        duration: number;
        provisional?: boolean;
        words?: { time: number; position: number; length: number }[];
      }
    >
  )[String(shot.id)];
  const fade = interpolate(
    f,
    [0, 10, shot.duration * 30 - 10, shot.duration * 30],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill style={{ background: C.ink, opacity: fade }}>
      <svg
        width="100%"
        height="100%"
        viewBox={vertical ? "0 0 1000 1500" : "0 0 1600 900"}
        preserveAspectRatio={vertical ? "xMidYMid meet" : "xMidYMid slice"}
        style={{
          position: "absolute",
          top: vertical ? "12%" : 0,
          height: vertical ? "76%" : "100%",
        }}
      >
        <svg
          x={0}
          y={vertical ? 230 : 0}
          width={vertical ? 1000 : 1600}
          height={vertical ? 562.5 : 900}
          viewBox="0 0 1600 900"
          overflow="hidden"
        >
          <CinematicCamera vertical={false}>
            {!isShort &&
            shot.chapter === 3 &&
            (visualKind === "army" || visualKind === "siege") ? (
              <ArtilleryConvoy />
            ) : visualKind === "city" ? (
              <MedievalCity night={shot.chapter >= 7} />
            ) : visualKind === "siege" ? (
              <SiegeAnimation final={shot.chapter >= 7} />
            ) : visualKind === "fleet" ? (
              <>
                <NavalTheater />
                <NavalFleet land={shot.chapter === 5 && shot.id % 4 >= 2} />
              </>
            ) : visualKind === "character" ? (
              <>
                <MedievalCity />
                <g transform={vertical ? "translate(-160 0)" : ""}>
                  <CharacterParallax mehmed={shot.chapter === 2} />
                </g>
              </>
            ) : (
              <>
                <AnimatedHistoricalMap
                  vertical={vertical}
                  era={shot.chapter === 1 ? (shot.id % 4) * 2 + 1 : 0}
                />
                {visualKind === "army" && <AnimatedArmy />}
              </>
            )}
          </CinematicCamera>
        </svg>
        {vertical && (
          <svg
            x={0}
            y={700}
            width={1000}
            height={562.5}
            viewBox="0 0 1600 900"
            overflow="hidden"
          >
            {shot.chapter === 5 ? (
              <NavalFleet land />
            ) : shot.kind === "character" ? (
              <AnimatedHistoricalMap vertical={vertical} />
            ) : (
              <AnimatedArmy />
            )}
          </svg>
        )}
      </svg>
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile("grain.png")})`,
          opacity: 0.045,
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg,#07121bcc,transparent 45%,#07121be6)",
        }}
      />
      <HistoricalTimeline chapter={shot.chapter} />
      <HistoricalTitle
        title={title ?? shot.title}
        date={shot.date}
        vertical={vertical}
      />
      <AnimatedSubtitles
        text={caption ?? shot.text}
        duration={shot.duration}
        voiceDuration={a?.duration}
        wordEvents={caption ? undefined : a?.words}
        vertical={vertical}
      />
      <div
        style={{
          position: "absolute",
          bottom: vertical ? 240 : 35,
          left: vertical ? 85 : 70,
          color: C.gold,
          fontSize: vertical ? 19 : 17,
          letterSpacing: 4,
        }}
      >
        CONSTANTINOPLA / 1453{" "}
        <span style={{ opacity: 0.5 }}>
          {" "}
          • {String(shot.chapter + 1).padStart(2, "0")}
        </span>
      </div>
      {isShort &&
        visualKind === "siege" &&
        Array.from(
          { length: Math.ceil((shot.duration * 30) / 100) },
          (_, i) => (
            <Sequence key={i} from={i * 100} durationInFrames={30}>
              <Audio src={staticFile("audio/cannon.wav")} volume={0.15} />
            </Sequence>
          ),
        )}
      {a && <Audio src={staticFile(a.file)} volume={1} />}
    </AbsoluteFill>
  );
};
export type EditProps = {
  start?: number;
  end?: number;
  vertical?: boolean;
  title?: string;
  caption?: string;
  shortIndex?: number;
  captions?: Record<string, string>;
};
export const Documentary: React.FC<EditProps> = ({
  start = 0,
  end = 600,
  vertical = false,
  title,
  caption,
  shortIndex,
  captions = {},
}) => {
  const clipFade = (frame: number) =>
    shortIndex === undefined
      ? 1
      : Math.max(0, Math.min(1, frame / 15, ((end - start) * 30 - frame) / 24));
  const shots =
    shortIndex === undefined ? data.scenes : data.shorts[shortIndex].shots;
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      {shots.map((s) => {
        const from = s.start - start;
        return from + s.duration <= 0 || s.start >= end ? null : (
          <Sequence
            key={s.id}
            from={Math.round(from * 30)}
            durationInFrames={s.duration * 30}
          >
            <ShotView
              shot={s}
              isShort={shortIndex !== undefined}
              vertical={vertical}
              title={title || undefined}
              caption={captions[String(s.id)] ?? (caption || undefined)}
            />
          </Sequence>
        );
      })}
      <Audio
        src={staticFile("audio/ambience.wav")}
        startFrom={Math.round(start * 30)}
        volume={(f) => 0.35 * clipFade(f)}
      />
      <Audio
        src={staticFile("audio/score.wav")}
        startFrom={Math.round(start * 30)}
        volume={(f) => {
          const t = f / 30 + start;
          const duck = shots.reduce((v, s) => {
            const a = s.start + 0.15;
            const b =
              s.start +
              ((audio as Record<string, { duration: number }>)[String(s.id)]
                ?.duration ?? s.duration);
            return Math.max(
              v,
              Math.max(
                0,
                Math.min(1, (t - a + 0.25) / 0.25, (b + 0.4 - t) / 0.4),
              ),
            );
          }, 0);
          return (0.22 - duck * 0.12) * clipFade(f);
        }}
      />
    </AbsoluteFill>
  );
};
