import type { JSX } from "react";
import { FunctionComponent } from "react";
import { View, ViewStyle } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { IncidentIcon } from "@ppb/the-wall-native/components/IncidentIcon/IncidentIcon";
import { Text } from "@ppb/the-wall-native";
import { TimelineBarIncident, TimelineBarProps, TimelineBarViewMode } from "./TimelineBar.types";
import styles from "./TimelineBar.native.styles";
import {
  TIMELINE_BAR,
  TIMELINE_BAR_INPLAY_BAR,
  TIMELINE_BAR_INCIDENTS_HOME,
  TIMELINE_BAR_INCIDENTS_AWAY,
  TIMELINE_BAR_CAPTION,
  TIMELINE_BAR_INCIDENTS_ICON,
} from "./TimelineBar.native.selectors";

function getProportion(x: number, length: number): number {
  // minimum value here prevents incident to be rendered outside the bar (e.g. goal at 48' -> 106%)
  return Math.min((x * 100) / length, 100);
}

function renderIncidents(incidents: TimelineBarIncident[], periodLength: number): JSX.Element[] {
  return incidents.map((incident, index) => {
    const positionStyle: ViewStyle = {
      left: `${Number(getProportion(incident.minute, periodLength).toFixed(1))}%`,
    };
    return (
      <View
        key={`${index}-${incident.minute}`}
        style={[styles.incident, positionStyle]}
        {...getTestProps(TIMELINE_BAR_INCIDENTS_ICON)}
      >
        {incident.icon && <IncidentIcon type={incident.icon} />}
      </View>
    );
  });
}

export const TimelineBar: FunctionComponent<TimelineBarProps> = ({
  periodLength,
  minute,
  homeIncidents = [],
  awayIncidents = [],
  caption,
  viewMode = TimelineBarViewMode.CONDENSED,
}) => {
  const inPlayLengthStyle: ViewStyle = {
    width: `${Number(getProportion(minute, periodLength).toFixed(1))}%`,
  };
  const timelineBarStyle = [styles.bar, viewMode === TimelineBarViewMode.CONDENSED && styles.condensed];

  return (
    <View style={styles.timelineBar} {...getTestProps(TIMELINE_BAR, false)}>
      <View style={styles.wrapper}>
        <View style={styles.incidents} {...getTestProps(TIMELINE_BAR_INCIDENTS_HOME, false)}>
          {renderIncidents(homeIncidents, periodLength)}
        </View>
        <View style={timelineBarStyle}>
          <View
            style={[styles.bar, styles.inplay, inPlayLengthStyle]}
            {...getTestProps(TIMELINE_BAR_INPLAY_BAR)}
          ></View>
        </View>
        <View style={styles.incidents} {...getTestProps(TIMELINE_BAR_INCIDENTS_AWAY, false)}>
          {renderIncidents(awayIncidents, periodLength)}
        </View>
      </View>
      {!!caption && viewMode === TimelineBarViewMode.NORMAL && (
        <Text style={styles.caption} {...getTestProps(TIMELINE_BAR_CAPTION)}>
          {caption}
        </Text>
      )}
    </View>
  );
};
