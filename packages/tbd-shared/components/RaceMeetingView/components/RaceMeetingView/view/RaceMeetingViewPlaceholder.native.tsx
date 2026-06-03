import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Placeholder } from "@ppb/the-wall-native";
import React from "react";
import { View } from "react-native";
import SELECTORS from "./RaceMeetingView.selectors";
import styles from "./RaceMeetingView.native.styles";

const RaceMeetingViewPlaceholder: React.FunctionComponent = () => {
  return (
    <View {...getTestProps(SELECTORS.PLACEHOLDER, false)} style={styles.placeholder}>
      <Placeholder />
      <Placeholder />
      <Placeholder />
    </View>
  );
};

export default RaceMeetingViewPlaceholder;
