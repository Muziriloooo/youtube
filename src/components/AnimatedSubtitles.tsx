import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
  staticFile,
} from "remotion";
import { C } from "./palette";
export const AnimatedSubtitles = ({
  text,
  duration,
  vertical = false,
  voiceDuration,
  wordEvents,
}: {
  text: string;
  duration: number;
  vertical?: boolean;
  voiceDuration?: number;
  wordEvents?: { time: number; position: number; length: number }[];
}) => {
  const f = useCurrentFrame();
  const words = text.split(/\s+/);
  const total = (voiceDuration ?? duration - 1) * 30;
  const event = wordEvents?.filter((w) => w.time <= f / 30).at(-1);
  const index = event
    ? Math.min(
        words.length - 1,
        text.slice(0, event.position).trim().split(/\s+/).filter(Boolean)
          .length,
      )
    : Math.min(
        words.length - 1,
        Math.floor((Math.max(0, f - 9) / total) * words.length),
      );
  const size = vertical ? 4 : 6;
  const group = Math.floor(index / size);
  const subset = words.slice(group * size, group * size + size);
  return f > total + 18 ? null : (
    <div
      style={{
        position: "absolute",
        bottom: vertical ? 340 : 94,
        left: vertical ? 85 : 240,
        right: vertical ? 135 : 240,
        textAlign: "center",
        fontFamily: "Arial,sans-serif",
        fontSize: vertical ? 49 : 36,
        fontWeight: 700,
        lineHeight: 1.25,
        transform: `translateY(${Math.max(0, 6 - f) * 2}px)`,
      }}
    >
      <span
        style={{
          background: "#091319ed",
          padding: "12px 22px",
          boxDecorationBreak: "clone",
          borderRadius: 8,
          color: "#fff",
        }}
      >
        {subset.map((w, i) => (
          <span
            key={i}
            style={{ color: group * size + i === index ? C.gold : "#fff" }}
          >
            {w}{" "}
          </span>
        ))}
      </span>
    </div>
  );
};
