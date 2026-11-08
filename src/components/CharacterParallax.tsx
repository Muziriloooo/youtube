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
export const CharacterParallax = ({ mehmed = false }: { mehmed?: boolean }) => {
  const f = useCurrentFrame();
  return (
    <g
      transform={`translate(${Math.sin(f / 160) * 12} ${Math.sin(f / 90) * 4})`}
    >
      <ellipse
        cx="980"
        cy="835"
        rx="260"
        ry="30"
        fill="#050d15"
        opacity=".65"
      />
      <svg
        x="640"
        y="60"
        width="680"
        height="770"
        viewBox={mehmed ? "0 0 790 887" : "980 0 794 887"}
      >
        <image
          href={staticFile("personagens-originais.png")}
          width="1774"
          height="887"
        />
      </svg>
      <text x="650" y="830" fill={C.paper} fontSize="32">
        {mehmed ? "MEHMED II" : "CONSTANTINO XI"}
      </text>
    </g>
  );
};
