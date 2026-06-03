import { FunctionComponent } from "react";
import { View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { formatDate, formatHours } from "@ppb/the-wall-native/helpers/time-helper";
import { Text } from "@ppb/the-wall-native";
import { RegulatorySectionsSessionProps } from "./RegulatorySections.types";
import { FOOTER_SESSION, FOOTER_SESSION_TEXT, FOOTER_SESSION_TIME } from "./RegulatorySectionsSession.native.selectors";
import styles from "./RegulatorySectionsSession.native.styles";

export const RegulatorySectionsSession: FunctionComponent<RegulatorySectionsSessionProps> = ({
  item: { text, time },
}) => (
  <View {...getTestProps(FOOTER_SESSION, false)} style={styles.container}>
    {!!text && (
      <Text {...getTestProps(FOOTER_SESSION_TEXT)} style={styles.textLabel}>
        {text}
      </Text>
    )}
    <Text {...getTestProps(FOOTER_SESSION_TIME)} style={styles.timeLabel}>
      {`${formatDate(time)} - ${formatHours(time)}`}
    </Text>
  </View>
);
