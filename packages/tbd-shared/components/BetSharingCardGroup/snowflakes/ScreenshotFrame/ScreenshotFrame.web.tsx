import { FunctionComponent } from "react";

import { Logo } from "../Logo/Logo.web";

import { ScreenshotFrameViewModel } from "./ScreenshotFrame.types";
import styles from "./ScreenshotFrame.web.css";

export const ScreenshotFrame: FunctionComponent<ScreenshotFrameViewModel> = ({ screenshotRef, children }) => (
  <div ref={screenshotRef} className={styles.container}>
    <Logo color={"var(--agnostic-neutrals-text-default)"} />
    {children}
  </div>
);
