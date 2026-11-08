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
export const NavalFleet = ({ land = false }: { land?: boolean }) => {
  const f = useCurrentFrame();
  return (
    <g>
      {land && (
        <path
          d="M300 600Q750 180 1300 430"
          fill="none"
          stroke={C.gold}
          strokeWidth="20"
          opacity=".3"
        />
      )}
      {Array.from({ length: 7 }, (_, i) => {
        const x = 180 + i * 185 + f * 0.3,
          y = land
            ? 530 - Math.sin((i / 7 + f / 6000) * Math.PI) * 220
            : 570 + Math.sin(f / 25 + i) * 8 + (i % 2) * 100;
        return (
          <g
            key={i}
            transform={`translate(${x} ${y}) rotate(${Math.sin(f / 45 + i) * 2})`}
          >
            <path
              d="M-60 0H60L40 25H-35Z"
              fill="#6a4534"
              stroke={C.gold}
              strokeWidth="2"
            />
            <path d="M0-100V0" stroke={C.gold} strokeWidth="4" />
            <path d="M-3-98L-3-10H-45Z" fill={C.paper} />
            <path d="M4-95Q45-50 38-12H4Z" fill={C.red} />
            {!land && <path d="M-70 35H65" stroke="#aed5cf" opacity=".4" />}
          </g>
        );
      })}
      <text x="900" y="790" fill={C.gold} fontSize="26">
        CHIFRE DE OURO
      </text>
      <path
        d="M800 680L1450 690"
        stroke={C.gold}
        strokeWidth="5"
        strokeDasharray="8 5"
      />
    </g>
  );
};
