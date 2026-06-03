import { FunctionComponent } from "react";
import { View } from "react-native";

import { colors } from "@ppb/the-wall-common/base-theme";

import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Logo } from "../Logo/Logo.native";

import { ScreenshotFrameViewModel } from "./ScreenshotFrame.types";
import { SCREENSHOT_FRAME } from "./ScreenshotFrame.native.selectors";
import styles from "./ScreenshotFrame.native.styles";

export const ScreenshotFrame: FunctionComponent<ScreenshotFrameViewModel> = ({ screenshotRef, children }) => (
  <View ref={screenshotRef} style={styles.container} {...getTestProps(SCREENSHOT_FRAME, false)}>
    <Logo color={colors.AgnosticNeutralsTextDefault} />
    {children}
  </View>
);
