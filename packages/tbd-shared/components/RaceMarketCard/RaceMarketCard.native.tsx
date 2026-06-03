import { FunctionComponent, useCallback, useEffect, memo, useRef } from "react";
import { Pressable, View } from "react-native";
import { Divider, RaceDetails, Card } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { MarketTemplate } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { navigate } from "@ppb/tbd-router/native";
import ConnectedMarket from "../Market";
import { Market } from "../Market/Market.native";
import { ComponentProps } from "./props";
import { RACE_DETAILS_CONTAINER, RACE_MARKET_CARD } from "./RaceMarketCard.native.selectors";
import { CardTheme } from "@ppb/the-wall-common/types";
import styles from "./RaceMarketCard.native.styles";

type MemoizedProps = ComponentProps & {
  onRaceDetailsPress: () => void;
};

const MemoizedRaceMarketCard: FunctionComponent<MemoizedProps> = memo(
  ({
    onRaceDetailsPress,
    countryFlag,
    meetingName,
    numberOfRunners,
    displayRunners,
    raceName,
    raceStatusLabel,
    raceViewLink,
    raceTime,
    runnerViewLinks,
    runnersLabel,
    title,
    trackGoing,
    urn,
    showMeetingInfo,
    isRunnerExpandable,
    marketPromo,
    infoBlurbs,
    onLinkClick,
    onMarketPromoClick,
    visible,
    isRaceRunningStatus,
  }) => {
    const raceDetailsContent = (
      <RaceDetails
        raceName={raceName}
        numberOfRunners={numberOfRunners}
        isRaceRunningStatus={isRaceRunningStatus}
        runnersLabel={runnersLabel}
        trackGoing={trackGoing}
        raceStatusLabel={raceStatusLabel}
        countryFlag={countryFlag}
        meetingName={meetingName}
        raceTime={raceTime}
        showMeetingInfo={showMeetingInfo}
        isHighlighted
      />
    );

    return (
      <Card showShadow fullWidthContent theme={CardTheme.TRANSPARENT}>
        <View {...getTestProps(RACE_MARKET_CARD, false)} style={styles.container}>
          <Pressable
            {...getTestProps(RACE_DETAILS_CONTAINER, false)}
            onPress={onRaceDetailsPress}
            style={styles.raceDetailsContainer}
          >
            {raceDetailsContent}
          </Pressable>
          <Divider />
          <ConnectedMarket
            cardUrn={urn}
            title={title}
            runnerViewLinks={runnerViewLinks}
            displayRunners={displayRunners}
            component={Market}
            eventViewLink={raceViewLink}
            isRunnerExpandable={isRunnerExpandable}
            marketPromo={marketPromo}
            infoBlurbs={infoBlurbs}
            onLinkClick={onLinkClick}
            onMarketPromoClick={onMarketPromoClick}
            template={MarketTemplate.Default}
            visible={visible}
          />
        </View>
      </Card>
    );
  },
);

MemoizedRaceMarketCard.displayName = "MemoizedRaceMarketCard";

const RaceMarketCard: FunctionComponent<ComponentProps> = (props) => {
  const {
    dispatchSubscribeRaceUpdates,
    dispatchUnsubscribeRaceUpdates,
    dispatchNavigateToRaceFromRaceDetails,
    meetingEntityName,
    raceViewLink,
    raceURN,
    urn,
    visible,
  } = props;

  const isRaceSubscribedToUpdates = useRef(false);

  const onRaceDetailsPress = useCallback((): void => {
    dispatchNavigateToRaceFromRaceDetails(raceViewLink.viewUrl, urn, meetingEntityName);
    navigate(raceViewLink);
  }, [dispatchNavigateToRaceFromRaceDetails, meetingEntityName, raceViewLink, urn]);

  // Subscribe to race updates when the card becomes visible, and unsubscribe when it goes out of view
  useEffect(() => {
    if (visible && !isRaceSubscribedToUpdates.current) {
      dispatchSubscribeRaceUpdates(raceURN);
      isRaceSubscribedToUpdates.current = true;
    } else if (!visible && isRaceSubscribedToUpdates.current) {
      dispatchUnsubscribeRaceUpdates(raceURN);
      isRaceSubscribedToUpdates.current = false;
    }
  }, [visible, dispatchSubscribeRaceUpdates, raceURN, dispatchUnsubscribeRaceUpdates]);

  return <MemoizedRaceMarketCard onRaceDetailsPress={onRaceDetailsPress} {...props} />;
};

export default RaceMarketCard;
