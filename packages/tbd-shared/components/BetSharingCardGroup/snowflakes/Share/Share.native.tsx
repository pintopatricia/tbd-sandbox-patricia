import { FunctionComponent, useMemo } from "react";
import { View, ScrollView, Platform } from "react-native";
import { initialWindowMetrics } from "react-native-safe-area-context";

import { SystemIconName } from "@ppb/the-wall-icons";

import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { PrimaryButton, SecondaryButton, BottomSheet, Text } from "@ppb/the-wall-native";

import { ScreenshotFrame } from "../ScreenshotFrame/ScreenshotFrame.native";
import { ShareViewModel } from "./Share.types";
import { SHARE } from "./Share.native.selectors";
import styles from "./Share.native.styles";

export const Share: FunctionComponent<ShareViewModel> = ({
  title,
  description,
  screenshotRef,
  children,
  leftButtonText,
  rightButtonText,
  onCloseTap,
  onLeftButtonTap,
  onRightButtonTap,
}) => {
  const shareIcon = Platform.OS === "android" ? SystemIconName.SHARE_ANDROID : SystemIconName.SHARE;

  const bottom = (Platform.OS === "ios" && initialWindowMetrics?.insets.bottom) || 0;

  const descriptionContainer = <Text style={styles.description}>{description}</Text>;

  const buttonsContainer = useMemo(
    () => (
      <View style={[styles.buttonsContainer, { paddingBottom: bottom }]}>
        {!!(leftButtonText && onLeftButtonTap) && (
          <View style={styles.button}>
            <PrimaryButton label={leftButtonText} icon={shareIcon} onTap={onLeftButtonTap} />
          </View>
        )}
        <View style={styles.button}>
          <SecondaryButton label={rightButtonText} icon={shareIcon} onTap={onRightButtonTap} />
        </View>
      </View>
    ),
    [bottom, leftButtonText, onLeftButtonTap, onRightButtonTap, rightButtonText, shareIcon],
  );
  return (
    <BottomSheet
      title={title}
      onHeaderIconTap={onCloseTap}
      showOverlay={true}
      showContentFullHeight={true}
      withModal={true}
      headerContent={descriptionContainer}
      footerContent={buttonsContainer}
    >
      <View style={styles.container} {...getTestProps(SHARE, false)}>
        <ScrollView style={styles.screenshotFrame} overScrollMode="never" bounces={false}>
          <View style={styles.screenshotOverlay}></View>
          <ScreenshotFrame screenshotRef={screenshotRef}>{children}</ScreenshotFrame>
        </ScrollView>
      </View>
    </BottomSheet>
  );
};
