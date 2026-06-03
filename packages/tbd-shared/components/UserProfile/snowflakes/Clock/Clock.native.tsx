import { FunctionComponent, useCallback, useState } from "react";
import { View } from "react-native";

import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { useInterval } from "@ppb/the-wall-native/hooks/useInterval";

import { Text } from "@ppb/the-wall-native";
import { ClockProps } from "./Clock.types";
import { CLOCK, CLOCK_TEXT } from "./Clock.native.selectors";
import styles from "./Clock.native.styles";

const getCurrentDate = (timeZone: ClockProps["timeZone"]): string =>
  new Date().toLocaleString("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
  });

export const Clock: FunctionComponent<ClockProps> = ({ timeZone }) => {
  const [date, setDate] = useState(getCurrentDate(timeZone));

  const refreshClock = useCallback(() => setDate(getCurrentDate(timeZone)), [timeZone]);

  useInterval(refreshClock, 60000);

  return (
    <View {...getTestProps(CLOCK, false)} style={styles.clock}>
      <Text {...getTestProps(CLOCK_TEXT)} style={styles.clockText}>
        {date}
      </Text>
    </View>
  );
};
