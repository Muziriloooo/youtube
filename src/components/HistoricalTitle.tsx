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
export const HistoricalTitle = ({
  title,
  date,
  vertical = false,
}: {
  title: string;
  date: string;
  vertical?: boolean;
}) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: vertical ? 220 : 105,
        left: vertical ? 85 : 100,
        right: vertical ? 110 : 100,
        transform: `translateY(${interpolate(f, [0, 25], [20, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })}px)`,
      }}
    >
      <div
        style={{
          fontSize: vertical ? 25 : 22,
          color: C.gold,
          letterSpacing: 5,
          marginBottom: 20,
        }}
      >
        {date}
      </div>
      <div
        style={{
          fontFamily: "Georgia,serif",
          fontSize: vertical ? 65 : 64,
          maxWidth: vertical ? 850 : 1100,
          lineHeight: 1.08,
          color: C.paper,
          textShadow: "0 3px 20px #000",
        }}
      >
        {title}
      </div>
    </div>
  );
};
