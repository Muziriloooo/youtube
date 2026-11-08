import React from "react";
import { Composition } from "remotion";
import { Documentary, EditProps } from "./scenes/Documentary";
import data from "./data.json";
export const Root = () => (
  <>
    <Composition
      id="Documentario"
      component={Documentary}
      durationInFrames={18000}
      fps={30}
      width={1920}
      height={1080}
    />
    {data.shorts.map((s, i) => (
      <Composition
        key={s.id}
        id={s.id}
        component={Documentary}
        durationInFrames={s.duration * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ shortIndex: i, vertical: true, end: s.duration }}
      />
    ))}
    <Composition
      id="PilotoHorizontal"
      component={Documentary}
      durationInFrames={1350}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ end: 45 }}
    />
    <Composition
      id="PilotoVertical"
      component={Documentary}
      durationInFrames={1350}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{ end: 45, vertical: true }}
    />
    <Composition
      id="Personalizado"
      component={Documentary}
      durationInFrames={1800}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{ start: 0, end: 60, vertical: true } as EditProps}
      calculateMetadata={({ props }) => ({
        durationInFrames: Math.max(
          1,
          Math.round((Number(props.end ?? 60) - Number(props.start ?? 0)) * 30),
        ),
        width: props.vertical ? 1080 : 1920,
        height: props.vertical ? 1920 : 1080,
      })}
    />
  </>
);
