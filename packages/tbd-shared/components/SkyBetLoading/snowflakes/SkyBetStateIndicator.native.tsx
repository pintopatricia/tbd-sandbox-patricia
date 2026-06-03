import { FunctionComponent } from "react";
import { View } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { Divider, Text } from "@ppb/the-wall-native";
import LinearView from "@ppb/the-wall-native/helpers/LinearView";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import styles from "./SkyBetStateIndicator.native.styles";
import {
  STATE_INDICATOR,
  STATE_INDICATOR_VERSION,
  STATE_INDICATOR_TITLE,
  STATE_INDICATOR_EFL_IMAGE,
  STATE_INDICATOR_SAFER_GAMBLING_IMAGE,
  STATE_INDICATOR_BRITISH_HEART_FOUNDATION_IMAGE,
  STATE_INDICATOR_EFL_TEXT,
} from "./SkyBetStateIndicator.native.selectors";

import SkyBetLogo from "../../../assets/images/sky_bet/for_the_fans.svg";
import SaferGamblingImage from "../../../assets/images/sky_bet/safer_gambling.svg";
import EflImage from "../../../assets/images/sky_bet/efl.svg";
import BritishHeartFoundationImage from "../../../assets/images/sky_bet/british_heart_foundation.svg";

import { SkyBetStateIndicatorProps } from "./SkyBetLoading.native.types";

export const SkyBetStateIndicator: FunctionComponent<SkyBetStateIndicatorProps> = ({ loadingTitle, appVersion }) => (
  <View style={styles.container} {...getTestProps(STATE_INDICATOR, false)}>
    <LinearView background={tokens.LoadingViewBackgroundColour} style={styles.container}>
      <View style={styles.skyLogoView}>
        <SkyBetLogo />
        <Text {...getTestProps(STATE_INDICATOR_TITLE)} style={styles.title}>
          {loadingTitle}
        </Text>
      </View>
      <View style={styles.logosContainer}>
        <Text {...getTestProps(STATE_INDICATOR_EFL_TEXT)} style={styles.eflText}>
          {"PROUD PARTNERS OF THE EFL AND BRITISH HEART FOUNDATION"}
        </Text>
        <View style={styles.eflView}>
          <EflImage {...getTestProps(STATE_INDICATOR_EFL_IMAGE)} />
          <Divider isVertical />
          <BritishHeartFoundationImage {...getTestProps(STATE_INDICATOR_BRITISH_HEART_FOUNDATION_IMAGE)} />
        </View>
      </View>
    </LinearView>
    <View style={styles.saferGamblingView}>
      <SaferGamblingImage style={styles.image} {...getTestProps(STATE_INDICATOR_SAFER_GAMBLING_IMAGE)} />
      <Text {...getTestProps(STATE_INDICATOR_VERSION)} style={styles.version}>
        {appVersion}
      </Text>
    </View>
  </View>
);
