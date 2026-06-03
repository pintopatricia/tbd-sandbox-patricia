import type { ReactNode } from "react";

export type InlinePanelOnAction = () => void;

export enum InlinePanelColor {
  Pink = "PINK",
  Blue = "BLUE",
}

export const InlinePanelColorMap = {
  BACK: InlinePanelColor.Blue,
  LAY: InlinePanelColor.Pink,
  Back: InlinePanelColor.Blue,
  Lay: InlinePanelColor.Pink,
};

export type InlinePanelProps = {
  children: ReactNode;
  title: string;
  titlePrefix?: string;
  color: InlinePanelColor;
};

type InlinePanelCallbacks = {
  onAction: InlinePanelOnAction;
};

export type InlinePanelViewModel = InlinePanelProps & InlinePanelCallbacks;
