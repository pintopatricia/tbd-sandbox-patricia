import React, { memo, useEffect } from "react";
import { View } from "react-native";
import { RaceDetails } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { useRaceDetailsCardVM } from "../viewmodel/RaceDetailsCard.viewmodel";
import type { RaceDetailsCardProps } from "../viewmodel/RaceDetailsCard.viewmodel";
import SELECTORS from "./RaceDetailsCard.selectors";
import styles from "./RaceDetailsCard.native.styles";
import ConnectedNotificationsSubscription from "../../../../NotificationsSubscription";
import NotificationsSubscription from "../../../../NotificationsSubscription/NotificationsSubscription.native";
import { NotificationsViewMode } from "../../../../NotificationsSubscription/map-to-props-factory";

type MemoizedProps = {
  countryFlag?: { vector?: string; small?: string };
  raceTime: string;
  raceName: string;
  meetingName: string;
  raceStatusLabel?: string;
  date?: string;
  numberOfRunners?: number;
  raceClass?: string;
  trackGoing?: string;
  raceDetailsTitle?: string;
  runnersLabel: string;
  isRaceRunningStatus: boolean;
  isHighlighted?: boolean;
  isSticky?: boolean;
  raceId: string;
  raceUrn: string;
  availableToSubscribe: boolean;
};

const MemoizedRaceDetailsCard: React.FunctionComponent<MemoizedProps> = memo(
  ({
    countryFlag,
    raceTime,
    meetingName,
    date,
    raceName,
    raceStatusLabel,
    numberOfRunners,
    raceClass,
    raceDetailsTitle,
    runnersLabel,
    trackGoing,
    raceId,
    raceUrn,
    availableToSubscribe,
    isRaceRunningStatus,
    isHighlighted,
    isSticky,
  }) => {
    const raceDetails = (
      <RaceDetails
        countryFlag={countryFlag}
        raceTime={raceTime}
        meetingName={meetingName}
        date={date}
        runnersLabel={runnersLabel}
        raceName={raceName}
        numberOfRunners={numberOfRunners}
        raceClass={raceClass}
        raceDetailsTitle={raceDetailsTitle}
        trackGoing={trackGoing}
        raceStatusLabel={raceStatusLabel}
        showMeetingInfo={isSticky}
        isRaceRunningStatus={isRaceRunningStatus}
        isHighlighted={isHighlighted}
      >
        {availableToSubscribe && !!raceUrn && (
          <ConnectedNotificationsSubscription
            viewMode={NotificationsViewMode.RACE}
            raceId={raceId}
            raceUrn={raceUrn}
            component={NotificationsSubscription}
          />
        )}
      </RaceDetails>
    );

    return (
      <View
        {...getTestProps(SELECTORS.TEST_ID, false)}
        style={[styles.raceDetailsContainer, isSticky && styles.raceDetailsContainerStickyColor]}
      >
        {raceDetails}
      </View>
    );
  },
);

MemoizedRaceDetailsCard.displayName = "MemoizedRaceDetailsCard";

type Props = RaceDetailsCardProps & {
  isSticky?: boolean;
};

const RaceDetailsCard: React.FunctionComponent<Props> = ({
  race,
  meeting,
  locale,
  timezone,
  isHighlighted,
  isSticky,
}) => {
  const {
    vm: { data, events },
  } = useRaceDetailsCardVM(race, meeting, locale, timezone);

  useEffect(() => {
    events.onSubscribe({
      raceUrn: race.raceUrn,
      isHorseRacing: race.isHorseRacing,
    });
    return () => {
      events.onUnsubscribe(race.raceUrn);
    };
  }, [race.raceUrn, race.isHorseRacing, events]);

  return (
    <MemoizedRaceDetailsCard
      {...data}
      raceId={race.raceId}
      raceUrn={race.raceUrn}
      isHighlighted={isHighlighted}
      isSticky={isSticky}
    />
  );
};

export default RaceDetailsCard;
