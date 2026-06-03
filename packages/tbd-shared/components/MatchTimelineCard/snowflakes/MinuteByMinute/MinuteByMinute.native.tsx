import { FunctionComponent } from "react";
import { View, ScrollView, StyleProp, ViewStyle } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { MinuteIncidents } from "../MinuteIncidents/MinuteIncidents.native";
import { MinuteByMinuteCommonProps } from "./MinuteByMinute.types";
import {
  MINUTE_BY_MINUTE_CONTAINER,
  MINUTE_BY_MINUTE_SEPARATOR,
  MINUTE_INCIDENTS_CONTAINER,
  MINUTE_INCIDENT_CONTAINER,
} from "./MinuteByMinute.native.selectors";

import styles from "./MinuteByMinute.native.styles";

export type MinuteByMinuteProps = MinuteByMinuteCommonProps & {
  lineExtensionStyle?: StyleProp<ViewStyle>;
};

export const MinuteByMinute: FunctionComponent<MinuteByMinuteProps> = ({ incidents, lineExtensionStyle }) => (
  <ScrollView {...getTestProps(MINUTE_BY_MINUTE_CONTAINER, false)}>
    <View
      style={[styles.minuteIncidentsContainer, lineExtensionStyle]}
      {...getTestProps(MINUTE_INCIDENTS_CONTAINER, false)}
    >
      {incidents.map((incident, index) => (
        <View
          {...getTestProps(MINUTE_INCIDENT_CONTAINER, false)}
          key={`${index}-${incident.minute}`}
          style={index === 0 ? null : styles.minuteIncident}
        >
          <MinuteIncidents
            key={`${index}-${incident.minute}`}
            minute={incident.minute}
            extraTimeMinute={incident.extraTimeMinute}
            events={incident.events}
          />
        </View>
      ))}
    </View>
    <View style={styles.lineContainer} {...getTestProps(MINUTE_BY_MINUTE_SEPARATOR, false)}>
      <View style={styles.line} />
    </View>
  </ScrollView>
);
