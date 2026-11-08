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
export const CinematicCamera: React.FC<
  React.PropsWithChildren<{ vertical?: boolean }>
> = ({ children, vertical }) => {
  const f = useCurrentFrame();
  const progress = interpolate(f, [0, 450], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
  });
  const zoom = 1 + progress * 0.065;
  return (
    <g
      transform={`translate(${vertical ? -70 : 0} 0) translate(800 450) scale(${zoom}) translate(${-800 - progress * 18} ${-450 + progress * 12})`}
    >
      {children}
    </g>
  );
};
