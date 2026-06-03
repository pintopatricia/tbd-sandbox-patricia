import { FunctionComponent, useEffect, useRef } from "react";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import { View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { useIsFocused } from "@react-navigation/native";
import { ComponentProps } from "./props";
import ConnectedEventHeader from "../EventHeader";
import ConnectedFootballFixture from "../FootballFixture";
import ConnectedBaseballFixture from "../BaseballFixture";
import BaseballFixture from "../BaseballFixture/BaseballFixture.native";
import ConnectedIceHockeyFixture from "../IceHockeyFixture";
import IceHockeyFixture from "../IceHockeyFixture/IceHockeyFixture.native";
import ConnectedAustralianRulesFixture from "../AustralianRulesFixture";
import AustralianRulesFixture from "../AustralianRulesFixture/AustralianRulesFixture.native";
import ConnectedAmericanFootballFixture from "../AmericanFootballFixture";
import AmericanFootballFixture from "../AmericanFootballFixture/AmericanFootballFixture.native";
import ConnectedRugbyUnionFixture from "../RugbyUnionFixture";
import RugbyUnionFixture from "../RugbyUnionFixture/RugbyUnionFixture.native";
import ConnectedRugbyLeagueFixture from "../RugbyLeagueFixture";
import RugbyLeagueFixture from "../RugbyLeagueFixture/RugbyLeagueFixture.native";
import ConnectedSnookerFixture from "../SnookerFixture";
import SnookerFixture from "../SnookerFixture/SnookerFixture.native";
import ConnectedVolleyballFixture from "../VolleyballFixture";
import VolleyballFixture from "../VolleyballFixture/VolleyballFixture.native";
import ConnectedDartsFixture from "../DartsFixture";
import DartsFixture from "../DartsFixture/DartsFixture.native";
import FootballFixture from "../FootballFixture/FootballFixture.native";
import EventHeader from "../EventHeader/EventHeader.native";
import TennisFixture from "../TennisFixture/TennisFixture.native";
import ConnectedTennisFixture from "../TennisFixture";
import ConnectedBasketballFixture from "../BasketballFixture";
import BasketballFixture from "../BasketballFixture/BasketballFixture.native";
import ConnectedCricketFixture from "../CricketFixture";
import CricketFixture from "../CricketFixture/CricketFixture.native";
import ConnectedTableTennisFixture from "../TableTennisFixture";
import TableTennisFixture from "../TableTennisFixture/TableTennisFixture.native";
import { useStickyCard } from "../../hooks/useStickyCard.native";

enum FixtureTypes {
  FOOTBALL = "FootballFixture",
  TABLE_TENNIS = "TableTennisFixture",
  TENNIS = "TennisMatch",
  BASKETBALL = "BasketballFixture",
  CRICKET = "CricketFixture",
  ICE_HOCKEY = "IceHockeyFixture",
  AMERICAN_FOOTBALL = "AmericanFootballFixture",
  RUGBY_UNION = "RugbyUnionFixture",
  RUGBY_LEAGUE = "RugbyLeagueFixture",
  SNOOKER = "SnookerFixture",
  BASEBALL = "BaseballFixture",
  VOLLEYBALL = "VolleyballFixture",
  AUSTRALIAN_RULES = "AustralianRulesFixture",
  DARTS = "DartsFixture",
}

type FixtureByTypeNameProps = Omit<
  ComponentProps,
  "dispatchSubscribeFixtureUpdates" | "dispatchUnsubscribeFixtureUpdates" | "fixture"
> & { isSticky: boolean };

const FixtureByTypename: FunctionComponent<FixtureByTypeNameProps> = ({
  typename,
  fixtureURN,
  competitionURN,
  viewMode,
  showBottomSeparator,
  showEventDateBelow,
  showHorizontalDuration,
  sporteventURN,
  sportsbookURN,
  exchangeURN,
  availableToSubscribe,
  displayRunners,
  videoAvailable,
  isSticky,
  iconsList,
  activeProduct,
  marketURN,
}) => {
  if (fixtureURN) {
    switch (typename) {
      case FixtureTypes.FOOTBALL:
        return (
          <ConnectedFootballFixture
            urn={fixtureURN}
            activeProduct={activeProduct}
            marketURN={marketURN}
            competition={competitionURN}
            component={FootballFixture}
            viewMode={viewMode}
            showBottomSeparator={showBottomSeparator}
            showEventDateBelow={showEventDateBelow}
            showHorizontalDuration={showHorizontalDuration}
            availableToSubscribe={availableToSubscribe}
            sporteventURN={sporteventURN}
            iconsList={iconsList}
          />
        );
      case FixtureTypes.TENNIS:
        return (
          <ConnectedTennisFixture
            urn={fixtureURN}
            competition={competitionURN}
            component={TennisFixture}
            viewMode={viewMode}
            showBottomSeparator={showBottomSeparator}
            showEventDateBelow={showEventDateBelow}
            showHorizontalDuration={showHorizontalDuration}
            notificationsSubscription={availableToSubscribe}
            sporteventURN={sporteventURN}
            videoAvailable={videoAvailable}
          />
        );
      case FixtureTypes.BASEBALL:
        return (
          <ConnectedBaseballFixture
            urn={fixtureURN}
            competition={competitionURN}
            component={BaseballFixture}
            viewMode={viewMode}
            showBottomSeparator={showBottomSeparator}
            showEventDateBelow={showEventDateBelow}
            showHorizontalDuration={showHorizontalDuration}
            notificationsSubscription={availableToSubscribe}
            sporteventURN={sporteventURN}
            videoAvailable={videoAvailable}
          />
        );
      case FixtureTypes.BASKETBALL:
        return (
          <ConnectedBasketballFixture
            urn={fixtureURN}
            competition={competitionURN}
            component={BasketballFixture}
            viewMode={viewMode}
            showBottomSeparator={showBottomSeparator}
            showEventDateBelow={showEventDateBelow}
            showHorizontalDuration={showHorizontalDuration}
            notificationsSubscription={availableToSubscribe}
            sporteventURN={sporteventURN}
            videoAvailable={videoAvailable}
          />
        );
      case FixtureTypes.CRICKET:
        return (
          <ConnectedCricketFixture
            urn={fixtureURN}
            competition={competitionURN}
            component={CricketFixture}
            viewMode={viewMode}
            showBottomSeparator={showBottomSeparator}
            showEventDateBelow={showEventDateBelow}
            showHorizontalDuration={showHorizontalDuration}
            notificationsSubscription={availableToSubscribe}
            sporteventURN={sporteventURN}
            videoAvailable={videoAvailable}
          />
        );
      case FixtureTypes.TABLE_TENNIS:
        return (
          <ConnectedTableTennisFixture
            urn={fixtureURN}
            competition={competitionURN}
            component={TableTennisFixture}
            viewMode={viewMode}
            showBottomSeparator={showBottomSeparator}
            showEventDateBelow={showEventDateBelow}
            showHorizontalDuration={showHorizontalDuration}
            notificationsSubscription={availableToSubscribe}
            sporteventURN={sporteventURN}
            videoAvailable={videoAvailable}
          />
        );
      case FixtureTypes.ICE_HOCKEY:
        return (
          <ConnectedIceHockeyFixture
            urn={fixtureURN}
            competition={competitionURN}
            component={IceHockeyFixture}
            viewMode={viewMode}
            showBottomSeparator={showBottomSeparator}
            showEventDateBelow={showEventDateBelow}
            showHorizontalDuration={showHorizontalDuration}
            sporteventURN={sporteventURN}
            videoAvailable={videoAvailable}
          />
        );
      case FixtureTypes.AMERICAN_FOOTBALL:
        return (
          <ConnectedAmericanFootballFixture
            urn={fixtureURN}
            competition={competitionURN}
            component={AmericanFootballFixture}
            viewMode={viewMode}
            showBottomSeparator={showBottomSeparator}
            showEventDateBelow={showEventDateBelow}
            showHorizontalDuration={showHorizontalDuration}
            notificationsSubscription={availableToSubscribe}
            sporteventURN={sporteventURN}
            videoAvailable={videoAvailable}
          />
        );
      case FixtureTypes.RUGBY_UNION:
        return (
          <ConnectedRugbyUnionFixture
            urn={fixtureURN}
            competition={competitionURN}
            component={RugbyUnionFixture}
            viewMode={viewMode}
            showBottomSeparator={showBottomSeparator}
            showEventDateBelow={showEventDateBelow}
            showHorizontalDuration={showHorizontalDuration}
            notificationsSubscription={availableToSubscribe}
            sporteventURN={sporteventURN}
            videoAvailable={videoAvailable}
          />
        );
      case FixtureTypes.RUGBY_LEAGUE:
        return (
          <ConnectedRugbyLeagueFixture
            urn={fixtureURN}
            competition={competitionURN}
            component={RugbyLeagueFixture}
            viewMode={viewMode}
            showBottomSeparator={showBottomSeparator}
            showEventDateBelow={showEventDateBelow}
            showHorizontalDuration={showHorizontalDuration}
            notificationsSubscription={availableToSubscribe}
            sporteventURN={sporteventURN}
            videoAvailable={videoAvailable}
          />
        );
      case FixtureTypes.SNOOKER:
        return (
          <ConnectedSnookerFixture
            urn={fixtureURN}
            competition={competitionURN}
            component={SnookerFixture}
            viewMode={viewMode}
            showBottomSeparator={showBottomSeparator}
            showEventDateBelow={showEventDateBelow}
            showHorizontalDuration={showHorizontalDuration}
            notificationsSubscription={availableToSubscribe}
            sporteventURN={sporteventURN}
            videoAvailable={videoAvailable}
          />
        );
      case FixtureTypes.VOLLEYBALL:
        return (
          <ConnectedVolleyballFixture
            urn={fixtureURN}
            competition={competitionURN}
            component={VolleyballFixture}
            viewMode={viewMode}
            showBottomSeparator={showBottomSeparator}
            showEventDateBelow={showEventDateBelow}
            showHorizontalDuration={showHorizontalDuration}
            notificationsSubscription={availableToSubscribe}
            sporteventURN={sporteventURN}
            videoAvailable={videoAvailable}
          />
        );
      case FixtureTypes.AUSTRALIAN_RULES:
        return (
          <ConnectedAustralianRulesFixture
            urn={fixtureURN}
            competition={competitionURN}
            component={AustralianRulesFixture}
            viewMode={viewMode}
            showBottomSeparator={showBottomSeparator}
            showEventDateBelow={showEventDateBelow}
            showHorizontalDuration={showHorizontalDuration}
            notificationsSubscription={availableToSubscribe}
            sporteventURN={sporteventURN}
            videoAvailable={videoAvailable}
          />
        );
      case FixtureTypes.DARTS:
        return (
          <ConnectedDartsFixture
            urn={fixtureURN}
            competition={competitionURN}
            component={DartsFixture}
            viewMode={viewMode}
            showBottomSeparator={showBottomSeparator}
            showEventDateBelow={showEventDateBelow}
            showHorizontalDuration={showHorizontalDuration}
            notificationsSubscription={availableToSubscribe}
            sporteventURN={sporteventURN}
            videoAvailable={videoAvailable}
          />
        );
      default: {
        break;
      }
    }
  }

  return (
    <ConnectedEventHeader
      component={EventHeader}
      sporteventURN={sporteventURN}
      sportsbookURN={sportsbookURN}
      exchangeURN={exchangeURN}
      displayRunners={displayRunners}
      viewMode={viewMode}
      showBottomSeparator={showBottomSeparator !== false}
      showTertiaryTitle={!isSticky}
      showHorizontalDuration={showHorizontalDuration}
      iconsList={iconsList}
      isSticky={isSticky}
    />
  );
};

const FixtureHeader: FunctionComponent<ComponentProps> = ({
  fixtureURN,
  cardURN,
  competitionURN,
  typename,
  viewMode,
  showBottomSeparator,
  showEventDateBelow,
  showHorizontalDuration,
  stickyOnScroll,
  sporteventURN,
  sportsbookURN,
  exchangeURN,
  displayRunners,
  availableToSubscribe,
  dispatchSubscribeFixtureUpdates,
  dispatchUnsubscribeFixtureUpdates,
  onSticky,
  videoAvailable,
  iconsList,
  activeProduct,
  marketURN,
}) => {
  const isSubscribedToUpdates = useRef(false);
  const isSticky = useStickyCard(cardURN);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (onSticky) {
      onSticky(isSticky);
    }
  }, [onSticky, isSticky]);

  useEffect(() => {
    if (fixtureURN && typename && !isSubscribedToUpdates.current && isFocused) {
      dispatchSubscribeFixtureUpdates(fixtureURN, typename, viewMode);
      isSubscribedToUpdates.current = true;
    }

    return () => {
      if (fixtureURN && typename && isSubscribedToUpdates.current) {
        dispatchUnsubscribeFixtureUpdates(fixtureURN, typename);
        isSubscribedToUpdates.current = false;
      }
    };
  }, [
    dispatchSubscribeFixtureUpdates,
    dispatchUnsubscribeFixtureUpdates,
    fixtureURN,
    isSubscribedToUpdates,
    typename,
    viewMode,
    isFocused,
  ]);

  return (
    <View {...getTestProps("fixture-header", false)}>
      <FixtureByTypename
        typename={typename}
        fixtureURN={fixtureURN}
        activeProduct={activeProduct}
        marketURN={marketURN}
        competitionURN={competitionURN}
        viewMode={stickyOnScroll && isSticky ? ScoreboardViewMode.SMALL : viewMode}
        showBottomSeparator={showBottomSeparator}
        showEventDateBelow={showEventDateBelow}
        showHorizontalDuration={showHorizontalDuration}
        sporteventURN={sporteventURN}
        sportsbookURN={sportsbookURN}
        exchangeURN={exchangeURN}
        displayRunners={displayRunners}
        isSticky={!!stickyOnScroll && isSticky}
        availableToSubscribe={availableToSubscribe}
        videoAvailable={videoAvailable}
        iconsList={iconsList}
      />
    </View>
  );
};

export default FixtureHeader;
