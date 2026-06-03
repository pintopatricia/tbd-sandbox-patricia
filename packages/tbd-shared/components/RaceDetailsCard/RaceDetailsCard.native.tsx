import { FunctionComponent, memo, useCallback, useEffect, useRef } from "react";
import { View, Pressable } from "react-native";
import { RaceDetails } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { navigate } from "@ppb/tbd-router/native";
import { ComponentProps } from "./props";
import { RACE_CARD_LINK, RACE_DETAILS_CARD } from "./RaceDetailsCard.native.selectors";
import { useStickyCard } from "../../hooks/useStickyCard.native";
import styles from "./RaceDetailsCard.native.styles";
import ConnectedNotificationsSubscription from "../NotificationsSubscription";
import NotificationsSubscription from "../NotificationsSubscription/NotificationsSubscription.native";
import { NotificationsViewMode } from "../NotificationsSubscription/map-to-props-factory";

type MemoizedProps = ComponentProps & {
  isSticky: boolean;
  onLinkPress: (viewLink: ViewLink) => void;
};

const MemoizedRaceDetailsCard: FunctionComponent<MemoizedProps> = memo(
  ({
    countryFlag,
    raceTime,
    meetingName,
    showDuration,
    date,
    dateTime,
    raceName,
    raceStatusLabel,
    numberOfRunners,
    raceClass,
    raceDetailsTitle,
    runnersLabel,
    trackGoing,
    showMeetingInfo,
    raceURN,
    viewLink,
    availableToSubscribe,
    isSticky,
    onLinkPress,
    isRaceRunningStatus,
    isHighlighted,
  }) => {
    const raceDetails = (
      <RaceDetails
        countryFlag={countryFlag}
        raceTime={raceTime}
        meetingName={meetingName}
        showDuration={showDuration}
        date={date}
        dateTime={dateTime}
        runnersLabel={runnersLabel}
        raceName={raceName}
        numberOfRunners={numberOfRunners}
        raceClass={raceClass}
        raceDetailsTitle={raceDetailsTitle}
        trackGoing={trackGoing}
        raceStatusLabel={raceStatusLabel}
        showMeetingInfo={isSticky || showMeetingInfo}
        isRaceRunningStatus={isRaceRunningStatus}
        isHighlighted={isHighlighted}
      >
        {availableToSubscribe && !!raceURN && (
          <ConnectedNotificationsSubscription
            viewMode={NotificationsViewMode.EVENT_OR_RACE}
            component={NotificationsSubscription}
          />
        )}
      </RaceDetails>
    );

    return (
      <View
        {...getTestProps(RACE_DETAILS_CARD, false)}
        style={[styles.raceDetailsContainer, isSticky ? styles.raceDetailsContainerStickyColor : {}]}
      >
        {!!viewLink && (
          <>
            <Pressable
              {...getTestProps(RACE_CARD_LINK, false)}
              onPress={() => onLinkPress(viewLink)}
              style={styles.link}
            >
              {raceDetails}
            </Pressable>
          </>
        )}
        {!viewLink && <>{raceDetails}</>}
      </View>
    );
  },
);

MemoizedRaceDetailsCard.displayName = "MemoizedRaceDetailsCard";

const RaceDetailsCard: FunctionComponent<ComponentProps> = (props) => {
  const { urn, raceStatus, raceURN, visible } = props;
  const { dispatchSubscribeRaceUpdates, dispatchUnsubscribeRaceUpdates } = props;
  const isSticky = useStickyCard(urn);
  const subscribedRef = useRef(false);

  useEffect(() => {
    if ((visible || isSticky) && raceStatus && !subscribedRef.current) {
      dispatchSubscribeRaceUpdates(raceURN);
      subscribedRef.current = true;
    }
    return () => {
      if (subscribedRef.current) {
        dispatchUnsubscribeRaceUpdates(raceURN);
        subscribedRef.current = false;
      }
    };
  }, [dispatchSubscribeRaceUpdates, dispatchUnsubscribeRaceUpdates, isSticky, raceStatus, raceURN, visible]);

  const onLinkPress = useCallback((link: ViewLink) => {
    navigate(link);
  }, []);

  return <MemoizedRaceDetailsCard isSticky={isSticky} onLinkPress={onLinkPress} {...props} />;
};

export default RaceDetailsCard;
