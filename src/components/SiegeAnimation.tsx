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
import { MedievalCity } from "./MedievalCity";
import { AnimatedArmy } from "./AnimatedArmy";
import { SmokeParticles } from "./SmokeParticles";
export const SiegeAnimation = ({ final = false }: { final?: boolean }) => {
  const f = useCurrentFrame();
  const phase = f % 100;
  return (
    <g>
      <MedievalCity night={final} />
      <path d="M0 825H1600V900H0Z" fill="#37392e" />
      <AnimatedArmy terrain="ground" />
      <g transform="translate(300 760)">
        <circle
          cx="0"
          cy="30"
          r="40"
          fill="#262b2a"
          stroke={C.gold}
          strokeWidth="5"
        />
        <path
          d="M-50-10L150-60 164-25-35 23Z"
          fill="#514f47"
          stroke={C.gold}
          strokeWidth="3"
        />
        {phase < 8 && (
          <path d="M160-65l90-40-42 60 55 30-100-10Z" fill="#ffc46e" />
        )}
      </g>
      <circle
        cx={460 + phase * 7}
        cy={700 - Math.sin((phase / 100) * Math.PI) * 250}
        r="7"
        fill="#222"
      />
      <SmokeParticles intensity={final ? 2 : 1} />
    </g>
  );
};
