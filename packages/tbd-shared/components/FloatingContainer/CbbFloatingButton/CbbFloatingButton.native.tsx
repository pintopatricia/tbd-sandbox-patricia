import type { FunctionComponent } from "react";
import { useEffect, useState } from "react";

import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SportsbookChatbotInput from "@ppb/tbd-components-sports-betting/components/SportsbookChatbotInput/view/SportsbookChatbotInput.native";
import { tokens } from "@ppb/the-wall-common/base-theme";
import styles from "./CbbFloatingButton.native.styles";
import subscribeEvent from "../../../event-broker/event-subscriber";
import { useNativeTokens } from "@ppb/the-wall-common/native-for-web-tokens";

export const getBottomOffset = (betslipHasSelections: boolean): number => {
  return betslipHasSelections ? tokens.ExpandableContainerSizing : 0;
};

const CbbFloatingButton: FunctionComponent<{ betslipHasSelections: boolean; urn: string }> = ({
  betslipHasSelections,
  urn,
}) => {
  const bottomOffset = useSharedValue(getBottomOffset(betslipHasSelections));
  const keyboard = useAnimatedKeyboard();
  const insets = useSafeAreaInsets();
  const [isChatbotInputActive, setIsChatbotInputActive] = useState(false);
  const { BottomBarHeightSizing } = useNativeTokens();

  useEffect(() => {
    subscribeEvent("@@UI/SPORTSBOOK_CHATBOT_INPUT_STATE_CHANGED", ({ state }) => {
      setIsChatbotInputActive(state === "active");
    });
  }, []);

  useEffect(() => {
    bottomOffset.value = withTiming(getBottomOffset(betslipHasSelections), {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
  }, [betslipHasSelections, bottomOffset]);

  const animatedStyle = useAnimatedStyle(() => ({
    bottom:
      keyboard.height.value > 0 ? keyboard.height.value - insets.bottom - BottomBarHeightSizing : bottomOffset.value,
  }));

  return (
    <Animated.View pointerEvents={"box-none"} style={[styles.cbbFloatingButton, animatedStyle]}>
      {isChatbotInputActive && (
        <View testID="linear-gradient" pointerEvents="none" style={styles.cbbFloatingButtonGradient} />
      )}

      <SportsbookChatbotInput urn={urn} />
    </Animated.View>
  );
};

export default CbbFloatingButton;
