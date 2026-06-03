import { FunctionComponent } from "react";
import { View } from "react-native";

import { Counter } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { MinimizedProps } from "./Minimized.types";
import styles from "./Minimized.native.styles";
import { MINIMIZED, MINIMIZED_TITLE } from "./Minimized.native.selectors";

export const Minimized: FunctionComponent<MinimizedProps> = ({ children, counter, color }) => (
  <View {...getTestProps(MINIMIZED, false)} style={styles.minimizedBetslip}>
    <Counter color={color} value={counter} />
    <View {...getTestProps(MINIMIZED_TITLE, false)} style={styles.children}>
      {children}
    </View>
  </View>
);
