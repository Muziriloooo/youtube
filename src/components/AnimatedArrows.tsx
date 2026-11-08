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
export const AnimatedArrows = () => {
  const f = useCurrentFrame();
  return (
    <g fill="none" stroke={C.red} strokeWidth="7">
      <path
        d="M350 250Q640 260 900 435"
        strokeDasharray="18 12"
        strokeDashoffset={-f * 1.5}
      />
      <path d="m869 407 31 28-43 3" />
    </g>
  );
};
