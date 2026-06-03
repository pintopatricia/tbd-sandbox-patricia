import { type FunctionComponent, type JSX, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import Animated, { SlideInDown, FadeOut, LinearTransition } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { navigationRef, ThirdPartyScreenName } from "@ppb/tbd-router/native";
import { MessageType } from "@ppb/tbd-store";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { Snackbar } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import type { ComponentProps } from "./props";
import { SNACKS_CONTAINER } from "./Snacks.native.selectors";
import styles from "./Snacks.native.styles";

const iconColorMap: Partial<Record<MessageType, string>> = {
  [MessageType.Success]: tokens.SnackBarIconLeftSecondaryColour,
  [MessageType.Info]: tokens.NeutralsIconSecondary,
};

const ANIMATION_DURATION = 300;
const EXCLUDED_SCREENS: string[] = [ThirdPartyScreenName.GameLaunchScreen, EntityType.ExternalView];
const THIRD_PARTY_SCREENS: string[] = Object.values(ThirdPartyScreenName);

const Snacks: FunctionComponent<ComponentProps> = ({
  messages,
  withBetslipCollapsed,
  dispatchOnClose,
}): JSX.Element | null => {
  const [currentScreenName, setCurrentScreenName] = useState<string | undefined>(
    () => navigationRef.current?.getCurrentRoute()?.name,
  );

  useEffect(() => {
    const unsubscribe = navigationRef.addListener?.("state", () => {
      setCurrentScreenName(navigationRef.current?.getCurrentRoute()?.name);
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  const insets = useSafeAreaInsets();
  const insetPaddingBottom = useMemo(
    () => (Platform.OS === "android" ? undefined : { paddingBottom: insets.bottom }),
    [insets.bottom],
  );

  if (messages.length === 0) {
    return null;
  }

  if (currentScreenName && EXCLUDED_SCREENS.includes(currentScreenName)) {
    return null;
  }

  const isThirdPartyScreen = !!currentScreenName && THIRD_PARTY_SCREENS.includes(currentScreenName);
  const currentScreenHasBetslip = !isThirdPartyScreen;

  const snacksContainerStyle = [
    styles.snacks,
    insetPaddingBottom,
    withBetslipCollapsed && currentScreenHasBetslip && styles.snacksBetslipCollapsed,
  ];

  return (
    <Animated.View
      {...getTestProps(SNACKS_CONTAINER, false)}
      style={snacksContainerStyle}
      layout={LinearTransition.duration(ANIMATION_DURATION)}
    >
      {messages.map((message) => (
        <Animated.View
          key={message.code}
          entering={SlideInDown.duration(ANIMATION_DURATION)}
          exiting={FadeOut.duration(ANIMATION_DURATION)}
          layout={LinearTransition.duration(ANIMATION_DURATION)}
        >
          <Snackbar
            title={message.title}
            description={message.description}
            icon={message.icon}
            iconColor={message.type && iconColorMap[message.type]}
            centeredIcon={!!message.iconCentered}
            onClose={() => dispatchOnClose(message.code)}
          />
        </Animated.View>
      ))}
    </Animated.View>
  );
};

export default Snacks;
