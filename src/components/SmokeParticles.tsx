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
export const SmokeParticles = ({ intensity = 1 }: { intensity?: number }) => {
  const f = useCurrentFrame();
  return (
    <g>
      {Array.from({ length: 16 }, (_, i) => {
        const k = (f + i * 43) % 220;
        return (
          <circle
            key={i}
            cx={220 + i * 91 + Math.sin(k / 60 + i) * 25}
            cy={730 - k * 2}
            r={10 + k / 3}
            fill="#c8b59d"
            opacity={Math.max(0, (1 - k / 220) * 0.13 * intensity)}
          />
        );
      })}
    </g>
  );
};
