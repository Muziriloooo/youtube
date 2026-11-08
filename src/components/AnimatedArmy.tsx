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
const Soldier = ({
  x,
  y,
  phase = 0,
}: {
  x: number;
  y: number;
  phase?: number;
}) => (
  <g transform={`translate(${x} ${y + Math.sin(phase) * 3}) scale(.65)`}>
    <path d="M-5 12L-9 28M5 12L9 28" stroke="#302a28" strokeWidth="5" />
    <path d="M-10-6H10L14 15H-14Z" fill={C.red} stroke={C.gold} />
    <circle cy="-15" r="8" fill="#c99c77" />
    <path d="M-9-17Q0-35 9-17" fill="#9ea8a1" />
    <path d="M20-40V20" stroke={C.paper} strokeWidth="2" />
    <path d="M21-38L42-30 21-24Z" fill={C.red} />
  </g>
);
export const AnimatedArmy = ({
  terrain = "map",
}: {
  terrain?: "map" | "ground";
}) => {
  const f = useCurrentFrame();
  return (
    <g>
      {Array.from({ length: 42 }, (_, i) => (
        <Soldier
          key={i}
          x={
            380 -
            (i % 14) * 20 +
            Math.min(f / 450, 1) * 440 +
            Math.floor(i / 14) * 12
          }
          y={
            terrain === "ground"
              ? 800 + Math.floor(i / 14) * 28
              : 265 + Math.floor(i / 14) * 30 + Math.min(f / 450, 1) * 100
          }
          phase={f / 5 + i}
        />
      ))}
    </g>
  );
};
