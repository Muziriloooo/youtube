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
import { AnimatedArrows } from "./AnimatedArrows";
import geo from "../geography.json";
export const AnimatedHistoricalMap = ({
  era = 0,
  vertical = false,
}: {
  era?: number;
  vertical?: boolean;
}) => {
  const f = useCurrentFrame();
  return (
    <g>
      <rect width="1600" height="1000" fill={C.sea} />
      {Array.from({ length: 14 }, (_, i) => (
        <g key={i} stroke="#a9bfc0" opacity=".07">
          <path d={`M${i * 125} 0V900`} />
          <path d={`M0 ${i * 75}H1600`} />
        </g>
      ))}
      {geo.land.map((d, i) => (
        <path key={i} d={d} fill={C.land} stroke="#bdad83" strokeWidth="1.7" />
      ))}
      <circle cx="930" cy="449" r={10 + Math.sin(f / 16) * 2} fill={C.gold} />
      <circle cx="930" cy="449" r="26" fill="none" stroke={C.gold} />
      <text x="965" y="430" fill={C.paper} fontSize={vertical ? 44 : 26}>
        CONSTANTINOPLA
      </text>
      <text
        x="1080"
        y="170"
        fill="#b2d5d8"
        fontSize={vertical ? 38 : 25}
        letterSpacing="5"
      >
        MAR NEGRO
      </text>
      <text x="610" y="720" fill="#b2d5d8" fontSize={vertical ? 38 : 25}>
        MAR DE MÁRMARA
      </text>
      <text x="400" y="220" fill={C.paper} fontSize={vertical ? 36 : 24}>
        TRÁCIA
      </text>
      <text x="1130" y="760" fill={C.paper} fontSize={vertical ? 36 : 24}>
        ANATÓLIA
      </text>
      {era > 0 && (
        <g opacity=".4">
          <circle
            cx="930"
            cy="449"
            r={Math.max(20, 180 - era * 25)}
            fill="none"
            stroke={C.gold}
            strokeWidth="4"
            strokeDasharray="9 8"
          />
        </g>
      )}
      <AnimatedArrows />
    </g>
  );
};
