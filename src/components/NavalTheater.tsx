import React from "react";
import { C } from "./palette";
export const NavalTheater = () => (
  <g>
    <rect width="1600" height="900" fill={C.sea} />
    <path
      d="M0 0H1600V390L1400 430 1200 410 1050 455 850 410 600 440 400 490 200 520 0 500Z"
      fill={C.land}
      stroke={C.gold}
      strokeWidth="2"
    />
    <path
      d="M0 800L300 770 600 800 900 790 1200 830 1600 820V900H0Z"
      fill={C.land}
      stroke={C.gold}
      strokeWidth="2"
    />
    <text x="700" y="210" fill={C.paper} fontSize="30" letterSpacing="6">
      GÁLATA
    </text>
    <text x="100" y="850" fill={C.paper} fontSize="24">
      CONSTANTINOPLA
    </text>
  </g>
);
