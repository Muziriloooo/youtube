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
import { SmokeParticles } from "./SmokeParticles";
export const MedievalCity = ({ night = false }: { night?: boolean }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <image
        href={staticFile("constantinopla-original.png")}
        width="1600"
        height="900"
        preserveAspectRatio="xMidYMid slice"
      />
      <rect
        width="1600"
        height="900"
        fill={night ? "#101a35" : "#071f32"}
        opacity={night ? 0.42 : 0.08}
      />
      <g
        opacity=".14"
        fill={C.gold}
        transform={`translate(${Math.sin(f / 240) * 15} 0)`}
      >
        <path d="M300 170L800 900H500Z" />
        <path d="M300 170L1200 900H1000Z" />
      </g>
      <g transform={`translate(${Math.sin(f / 160) * 20} 0)`}>
        <SmokeParticles intensity={night ? 1.2 : 0.4} />
      </g>
      {Array.from({ length: 5 }, (_, i) => (
        <path
          key={i}
          d={`M${1100 + ((f * 0.6 + i * 72) % 500)} ${170 + i * 16}q8 ${Math.sin(f / 7 + i) * 5} 16 0q8 ${Math.sin(f / 7 + i) * 5} 16 0`}
          fill="none"
          stroke="#1b292d"
          strokeWidth="2"
        />
      ))}
      <g transform={`translate(${Math.sin(f / 100) * 10} 0)`}>
        <path d="M0 890Q120 855 250 900H0Z" fill="#0b181d" />
        <path d="M1600 890Q1480 840 1350 900H1600Z" fill="#0b181d" />
      </g>
    </g>
  );
};
