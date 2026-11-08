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
export const HistoricalTimeline = ({ chapter }: { chapter: number }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: 42,
        left: 70,
        right: 70,
        display: "flex",
        gap: 8,
      }}
    >
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          style={{
            height: 3,
            flex: 1,
            background: i <= chapter ? C.gold : "#ffffff26",
            opacity: i === chapter ? 0.6 + Math.sin(f / 25) * 0.25 : 1,
          }}
        />
      ))}
    </div>
  );
};
