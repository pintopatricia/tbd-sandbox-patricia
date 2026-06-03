import { FunctionComponent, useState, useCallback } from "react";
import { View, ViewStyle } from "react-native";

import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SportsIconName } from "@ppb/the-wall-icons";
import { colors } from "@ppb/the-wall-common/base-theme";
import { TBDImage, Text } from "@ppb/the-wall-native";

import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import { TimelineBarProps, TimelineBarViewMode } from "../TimelineBar/TimelineBar.types";
import { TimelineBar } from "../TimelineBar/TimelineBar.native";
import { IncidentNotification } from "../IncidentNotification/IncidentNotification.native";
import { MatchTimelineProps, MatchTimelineViewMode } from "./MatchTimeline.types";
import styles from "./MatchTimeline.native.styles";
import {
  MATCH_TIMELINE,
  MATCH_TIMELINE_PREMATCH,
  MATCH_TIMELINE_TIMELINE_CONTAINER,
  MATCH_TIMELINE_HOME_CREST,
  MATCH_TIMELINE_AWAY_CREST,
  MATCH_TIMELINE_HOME_SHIELD_CREST,
  MATCH_TIMELINE_AWAY_SHIELD_CREST,
  MATCH_TIMELINE_TIMELINE,
} from "./MatchTimeline.native.selectors";

type TimelineListProps = {
  timelines: TimelineBarProps[];
  viewMode: TimelineBarViewMode;
};

const TimelineList: FunctionComponent<TimelineListProps> = ({ timelines, viewMode }) => {
  const matchLength = timelines.reduce(
    (sum: number, timeline: TimelineBarProps): number => sum + timeline.periodLength,
    0,
  );

  const timelineList = timelines.map((timelineBarProps, index, array) => {
    const isLast = index === array.length - 1;
    const timelineWidth = (timelineBarProps.periodLength * 100) / matchLength;
    const timelineStyle: ViewStyle[] = [
      !isLast && viewMode === TimelineBarViewMode.CONDENSED ? styles.timelineCondensed : {},
      {
        width: `${Number(timelineWidth.toFixed(1))}%`,
      },
    ];
    const timelineProps = {
      ...timelineBarProps,
      viewMode,
    };

    return (
      <View style={timelineStyle} key={index} {...getTestProps(MATCH_TIMELINE_TIMELINE, false)}>
        <TimelineBar {...timelineProps} />
      </View>
    );
  });

  return <>{timelineList}</>;
};

export const MatchTimeline: FunctionComponent<MatchTimelineProps> = ({
  homeCrest,
  awayCrest,
  lastIncident,
  timelines,
  translations,
  viewMode = MatchTimelineViewMode.NORMAL,
}) => {
  const isCondensedViewMode = viewMode === MatchTimelineViewMode.CONDENSED;
  const timelineBarViewMode = isCondensedViewMode ? TimelineBarViewMode.CONDENSED : TimelineBarViewMode.NORMAL;

  const matchTimelineStyle = [isCondensedViewMode && styles.matchTimelineCondensed];
  const timelineContainerStyle = [styles.timelineContainer, isCondensedViewMode && styles.timelineContainerCondensed];
  const homeCrestStyle = { ...styles.teamCrest, ...(isCondensedViewMode && styles.homeTeamCondensed) };

  const [homeCrestValid, setHomeCrestValid] = useState(true);
  const [awayCrestValid, setAwayCrestValid] = useState(true);

  const onError = useCallback(
    (invalidCrest: string) => () => {
      if (invalidCrest === "home") {
        setHomeCrestValid(false);
      } else {
        setAwayCrestValid(false);
      }
    },
    [setHomeCrestValid, setAwayCrestValid],
  );

  return (
    <View style={matchTimelineStyle} {...getTestProps(MATCH_TIMELINE, false)}>
      <View style={timelineContainerStyle} {...getTestProps(MATCH_TIMELINE_TIMELINE_CONTAINER, false)}>
        <View style={styles.teamCrests}>
          {!!homeCrest && homeCrestValid ? (
            <TBDImage
              {...getTestProps(MATCH_TIMELINE_HOME_CREST, false)}
              style={homeCrestStyle}
              source={homeCrest}
              onError={onError("home")}
            />
          ) : (
            <View style={homeCrestStyle} {...getTestProps(MATCH_TIMELINE_HOME_SHIELD_CREST, false)}>
              <GenericIcon name={SportsIconName.TEAM_CREST} color={colors.NeutralsIconSecondary} />
            </View>
          )}
          {!!translations?.prematch && !isCondensedViewMode && (
            <Text style={styles.prematch} {...getTestProps(MATCH_TIMELINE_PREMATCH, false)}>
              {translations.prematch}
            </Text>
          )}
          {!!awayCrest && awayCrestValid ? (
            <TBDImage
              {...getTestProps(MATCH_TIMELINE_AWAY_CREST, false)}
              style={styles.teamCrest}
              source={awayCrest}
              onError={onError("away")}
            />
          ) : (
            <View style={styles.teamCrest} {...getTestProps(MATCH_TIMELINE_AWAY_SHIELD_CREST, false)}>
              <GenericIcon name={SportsIconName.TEAM_CREST} color={colors.NeutralsIconSecondary} />
            </View>
          )}
        </View>
        <View style={styles.timelines}>
          <TimelineList timelines={timelines} viewMode={timelineBarViewMode} />
        </View>
      </View>
      {lastIncident && isCondensedViewMode && (
        <View style={styles.lastIncident}>
          <IncidentNotification
            minute={`${lastIncident.minute}'`}
            incidentLabel={lastIncident.label}
            playerName={lastIncident.player}
            teamName={lastIncident.team}
          />
        </View>
      )}
    </View>
  );
};
