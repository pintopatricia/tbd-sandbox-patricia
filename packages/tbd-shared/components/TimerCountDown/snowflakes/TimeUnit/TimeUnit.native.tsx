import { FunctionComponent } from "react";
import { View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Text } from "@ppb/the-wall-native";
import { TimeGroupItem } from "../Timer/Timer.types";
import { styles } from "./TimeUnit.native.styles";
import { TIME_UNIT, TIME_UNIT_TEXT, TIME_UNIT_VALUES } from "./TimeUnit.native.selectors";

export const TimeUnit: FunctionComponent<TimeGroupItem> = ({ label, value }) => (
  <View style={styles.timeUnit} {...getTestProps(TIME_UNIT)}>
    <View style={styles.timerDigits}>
      {value.map((val, key) => (
        <View style={styles.timerBorder} key={key} {...getTestProps(TIME_UNIT_VALUES)}>
          <Text style={styles.timerLabel}>{val}</Text>
        </View>
      ))}
    </View>

    <Text style={styles.text} {...getTestProps(TIME_UNIT_TEXT)}>
      {label}
    </Text>
  </View>
);
