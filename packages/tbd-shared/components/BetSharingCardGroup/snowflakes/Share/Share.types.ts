import { ReactNode } from "react";
import * as React from "react";

export type ShareCallbacks = {
  onCloseTap: () => void;
  onLeftButtonTap?: () => void;
  onRightButtonTap: () => void;
};

export type ShareProps = {
  title: string;
  description: string;
  screenshotRef: React.RefObject<null>;
  children: ReactNode;
  leftButtonText?: string;
  rightButtonText: string;
};

export type ShareViewModel = ShareProps & ShareCallbacks;
