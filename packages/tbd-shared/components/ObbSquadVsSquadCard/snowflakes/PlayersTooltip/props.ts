import { RefObject } from "react";

export enum TooltipPosition {
  LEFT,
  RIGHT,
}

export type PlayersTooltipPropsWeb = {
  targetRef: RefObject<HTMLElement | null>;
  position?: TooltipPosition;
};
