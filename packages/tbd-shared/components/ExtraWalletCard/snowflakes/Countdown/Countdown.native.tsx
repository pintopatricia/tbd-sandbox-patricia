import { FunctionComponent } from "react";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Text } from "@ppb/the-wall-native";
import { CountdownProps, CountdownType } from "./Countdown.types";
import { COUNTDOWN } from "./Countdown.native.selectors";
import styles from "./Countdown.native.styles";

export const Countdown: FunctionComponent<CountdownProps> = ({ text, type }) => (
  <Text style={type === CountdownType.ALERT ? styles.alert : styles.countdown} {...getTestProps(COUNTDOWN)}>
    {text}
  </Text>
);
