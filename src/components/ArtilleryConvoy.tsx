import React from "react";
import { useCurrentFrame } from "remotion";
import { AnimatedHistoricalMap } from "./AnimatedHistoricalMap";
import { AnimatedArmy } from "./AnimatedArmy";
import { C } from "./palette";
export const ArtilleryConvoy = () => {
  const f = useCurrentFrame();
  const detail = f % 450 >= 225;
  return (
    <g transform={detail ? "translate(-340 -180) scale(1.45)" : undefined}>
      <AnimatedHistoricalMap />
      <AnimatedArmy />
      {[0, 1, 2].map((i) => (
        <g
          key={i}
          transform={`translate(${300 + i * 160 + f * 0.3} ${365 + i * 5})`}
        >
          <path d="M-65 20L-100 13" stroke={C.gold} strokeWidth="3" />
          {[-30, 35].map((x) => (
            <g key={x} transform={`translate(${x} 25) rotate(${f * 1.3})`}>
              <circle r="19" fill="#55412f" stroke={C.gold} strokeWidth="3" />
              {[0, 45, 90, 135].map((angle) => (
                <path
                  key={angle}
                  d="M-17 0H17"
                  stroke={C.gold}
                  transform={`rotate(${angle})`}
                />
              ))}
            </g>
          ))}
          <path d="M-50 7H60V20H-50Z" fill="#594a39" />
          <path
            d="M-45-15L70-40 77-14-40 8Z"
            fill="#726c57"
            stroke={C.gold}
            strokeWidth="2"
          />
          <ellipse cx="72" cy="-27" rx="8" ry="13" fill="#17252b" />
          <rect
            x="-75"
            y="-5"
            width="24"
            height="22"
            fill="#8a6241"
            stroke={C.gold}
          />
          <path d="M-64-5v22" stroke={C.gold} />
        </g>
      ))}
    </g>
  );
};
