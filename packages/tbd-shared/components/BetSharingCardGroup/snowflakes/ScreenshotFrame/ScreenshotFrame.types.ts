import { ReactNode } from "react";
import * as React from "react";

export type ScreenshotFrameProps = {
  screenshotRef: React.RefObject<null>;
  children: ReactNode;
};

export type ScreenshotFrameViewModel = ScreenshotFrameProps;
