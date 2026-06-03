import { FunctionComponent, RefCallback, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StickyHeader, useOnIntersect } from "@ppb/the-wall-web";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import {
  HEADER_CONTAINER_ID,
  HEADER_SPACE_ID,
} from "@ppb/the-wall-web/components/bricks/StickyHeader/StickyHeader.types";
import { ComponentProps } from "./props";
import ConnectedEventHeader from "../EventHeader";
import ConnectedFootballFixture from "../FootballFixture";
import ConnectedTennisFixture from "../TennisFixture";
import ConnectedBasketballFixture from "../BasketballFixture";
import ConnectedCricketFixture from "../CricketFixture";
import ConnectedIceHockeyFixture from "../IceHockeyFixture";
import ConnectedSnookerFixture from "../SnookerFixture";
import ConnectedDartsFixture from "../DartsFixture";
import ConnectedTableTennisFixture from "../TableTennisFixture";

import IceHockeyFixture from "../IceHockeyFixture/IceHockeyFixture.web";
import ConnectedBaseballFixture from "../BaseballFixture";
import BaseballFixture from "../BaseballFixture/BaseballFixture.web";
import ConnectedAmericanFootballFixture from "../AmericanFootballFixture";
import ConnectedRugbyUnionFixture from "../RugbyUnionFixture";
import RugbyUnionFixture from "../RugbyUnionFixture/RugbyUnionFixture.web";
import ConnectedAustralianRulesFixture from "../AustralianRulesFixture";
import AustralianRulesFixture from "../AustralianRulesFixture/AustralianRulesFixture.web";
import ConnectedRugbyLeagueFixture from "../RugbyLeagueFixture";
import RugbyLeagueFixture from "../RugbyLeagueFixture/RugbyLeagueFixture.web";
import SnookerFixture from "../SnookerFixture/SnookerFixture.web";
import ConnectedVolleyballFixture from "../VolleyballFixture";
import VolleyballFixture from "../VolleyballFixture/VolleyballFixture.web";
import FootballFixture from "../FootballFixture/FootballFixture.web";
import TableTennisFixture from "../TableTennisFixture/TableTennisFixture.web";
import TennisFixture from "../TennisFixture/TennisFixture.web";
import EventHeader from "../EventHeader/EventHeader.web";
import BasketballFixture from "../BasketballFixture/BasketballFixture.web";
import CricketFixture from "../CricketFixture/CricketFixture.web";
import AmericanFootballFixture from "../AmericanFootballFixture/AmericanFootballFixture.web";
import DartsFixture from "../DartsFixture/DartsFixture.web";
import INTERSECTION_CONFIG from "../../config/cards-intersection";

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
  displayRunners,
  videoAvailable,
  iconsList,
  isSticky,
  activeProduct,
  marketURN,
}) => {
  if (fixtureURN) {
    switch (typename) {
      case "FootballFixture":
        return (
          <ConnectedFootballFixture
            urn={fixtureURN}
            competition={competitionURN}
            component={FootballFixture}
            viewMode={viewMode}
            showBottomSeparator={showBottomSeparator}
            showEventDateBelow={showEventDateBelow}
            showHorizontalDuration={showHorizontalDuration}
            sporteventURN={sporteventURN}
            iconsList={iconsList}
            activeProduct={activeProduct}
            marketURN={marketURN}
          />
        );
      case "TennisMatch":
        return (
          <ConnectedTennisFixture
            urn={fixtureURN}
            competition={competitionURN}
            component={TennisFixture}
            viewMode={viewMode}
            showBottomSeparator={showBottomSeparator}
            showEventDateBelow={showEventDateBelow}
            showHorizontalDuration={showHorizontalDuration}
            sporteventURN={sporteventURN}
            videoAvailable={videoAvailable}
          />
        );
      case "BaseballFixture":
        return (
          <ConnectedBaseballFixture
            urn={fixtureURN}
            competition={competitionURN}
            component={BaseballFixture}
            viewMode={viewMode}
            showBottomSeparator={showBottomSeparator}
            showEventDateBelow={showEventDateBelow}
            showHorizontalDuration={showHorizontalDuration}
            sporteventURN={sporteventURN}
            videoAvailable={videoAvailable}
          />
        );
      case "BasketballFixture":
        return (
          <ConnectedBasketballFixture
            urn={fixtureURN}
            competition={competitionURN}
            component={BasketballFixture}
            viewMode={viewMode}
            showBottomSeparator={showBottomSeparator}
            showEventDateBelow={showEventDateBelow}
            showHorizontalDuration={showHorizontalDuration}
            sporteventURN={sporteventURN}
            videoAvailable={videoAvailable}
          />
        );
      case "CricketFixture":
        return (
          <ConnectedCricketFixture
            urn={fixtureURN}
            competition={competitionURN}
            component={CricketFixture}
            viewMode={viewMode}
            showBottomSeparator={showBottomSeparator}
            showEventDateBelow={showEventDateBelow}
            showHorizontalDuration={showHorizontalDuration}
            sporteventURN={sporteventURN}
            videoAvailable={videoAvailable}
          />
        );
      case "TableTennisFixture":
        return (
          <ConnectedTableTennisFixture
            urn={fixtureURN}
            competition={competitionURN}
            component={TableTennisFixture}
            viewMode={viewMode}
            showBottomSeparator={showBottomSeparator}
            showEventDateBelow={showEventDateBelow}
            showHorizontalDuration={showHorizontalDuration}
            sporteventURN={sporteventURN}
            videoAvailable={videoAvailable}
          />
        );
      case "IceHockeyFixture":
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
      case "AmericanFootballFixture":
        return (
          <ConnectedAmericanFootballFixture
            urn={fixtureURN}
            competition={competitionURN}
            component={AmericanFootballFixture}
            viewMode={viewMode}
            showBottomSeparator={showBottomSeparator}
            showEventDateBelow={showEventDateBelow}
            showHorizontalDuration={showHorizontalDuration}
            sporteventURN={sporteventURN}
            videoAvailable={videoAvailable}
          />
        );
      case "RugbyUnionFixture":
        return (
          <ConnectedRugbyUnionFixture
            urn={fixtureURN}
            competition={competitionURN}
            component={RugbyUnionFixture}
            viewMode={viewMode}
            showBottomSeparator={showBottomSeparator}
            showEventDateBelow={showEventDateBelow}
            showHorizontalDuration={showHorizontalDuration}
            sporteventURN={sporteventURN}
            videoAvailable={videoAvailable}
          />
        );
      case "RugbyLeagueFixture":
        return (
          <ConnectedRugbyLeagueFixture
            urn={fixtureURN}
            competition={competitionURN}
            component={RugbyLeagueFixture}
            viewMode={viewMode}
            showBottomSeparator={showBottomSeparator}
            showEventDateBelow={showEventDateBelow}
            showHorizontalDuration={showHorizontalDuration}
            sporteventURN={sporteventURN}
            videoAvailable={videoAvailable}
          />
        );
      case "SnookerFixture":
        return (
          <ConnectedSnookerFixture
            urn={fixtureURN}
            competition={competitionURN}
            component={SnookerFixture}
            viewMode={viewMode}
            showBottomSeparator={showBottomSeparator}
            showEventDateBelow={showEventDateBelow}
            showHorizontalDuration={showHorizontalDuration}
            sporteventURN={sporteventURN}
            videoAvailable={videoAvailable}
          />
        );
      case "VolleyballFixture":
        return (
          <ConnectedVolleyballFixture
            urn={fixtureURN}
            competition={competitionURN}
            component={VolleyballFixture}
            viewMode={viewMode}
            showBottomSeparator={showBottomSeparator}
            showEventDateBelow={showEventDateBelow}
            showHorizontalDuration={showHorizontalDuration}
            sporteventURN={sporteventURN}
            videoAvailable={videoAvailable}
          />
        );
      case "AustralianRulesFixture":
        return (
          <ConnectedAustralianRulesFixture
            urn={fixtureURN}
            competition={competitionURN}
            component={AustralianRulesFixture}
            viewMode={viewMode}
            showBottomSeparator={showBottomSeparator}
            showEventDateBelow={showEventDateBelow}
            showHorizontalDuration={showHorizontalDuration}
            sporteventURN={sporteventURN}
            videoAvailable={videoAvailable}
          />
        );
      case "DartsFixture":
        return (
          <ConnectedDartsFixture
            urn={fixtureURN}
            competition={competitionURN}
            component={DartsFixture}
            viewMode={viewMode}
            showBottomSeparator={showBottomSeparator}
            showEventDateBelow={showEventDateBelow}
            showHorizontalDuration={showHorizontalDuration}
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
      showHorizontalDuration={showHorizontalDuration}
      showTertiaryTitle={!isSticky}
      iconsList={iconsList}
      isSticky={isSticky}
    />
  );
};

const FixtureHeader: FunctionComponent<ComponentProps> = ({
  fixtureURN,
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
  videoAvailable,
  iconsList,
  activeProduct,
  marketURN,
  dispatchSubscribeFixtureUpdates,
  dispatchUnsubscribeFixtureUpdates,
}) => {
  const fixtureProps = useMemo(
    () => ({
      typename,
      fixtureURN,
      competitionURN,
      viewMode,
      showBottomSeparator,
      showEventDateBelow,
      sporteventURN,
      sportsbookURN,
      exchangeURN,
      displayRunners,
      videoAvailable,
      iconsList,
      activeProduct,
      marketURN,
      showHorizontalDuration,
    }),
    [
      typename,
      fixtureURN,
      competitionURN,
      viewMode,
      showBottomSeparator,
      showEventDateBelow,
      sporteventURN,
      sportsbookURN,
      exchangeURN,
      displayRunners,
      videoAvailable,
      iconsList,
      activeProduct,
      marketURN,
      showHorizontalDuration,
    ],
  );

  const isSubscribedToUpdates = useRef(false);
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const { isIntersecting, ref } = useOnIntersect<HTMLDivElement>(null, INTERSECTION_CONFIG.rootMargin);
  const setRef = useCallback<RefCallback<HTMLDivElement>>((node) => setIsSticky(!!node), []);

  useEffect(() => {
    if (fixtureURN && typename) {
      if ((isIntersecting || isSticky) && !isSubscribedToUpdates.current) {
        dispatchSubscribeFixtureUpdates(fixtureURN, typename, viewMode);
        isSubscribedToUpdates.current = true;
      }

      return () => {
        if (isSubscribedToUpdates.current) {
          dispatchUnsubscribeFixtureUpdates(fixtureURN, typename);
          isSubscribedToUpdates.current = false;
        }
      };
    }

    return () => {};
  }, [
    dispatchSubscribeFixtureUpdates,
    dispatchUnsubscribeFixtureUpdates,
    fixtureURN,
    isIntersecting,
    isSticky,
    isSubscribedToUpdates,
    typename,
    viewMode,
  ]);

  const stickyFixture = useMemo(
    () => (
      <div ref={setRef}>
        <FixtureByTypename {...fixtureProps} viewMode={ScoreboardViewMode.SMALL} isSticky />
      </div>
    ),
    [fixtureProps, setRef],
  );

  const fixture = useMemo(
    () => (
      <div ref={ref}>
        <FixtureByTypename {...fixtureProps} isSticky={false} />
      </div>
    ),
    [fixtureProps, ref],
  );

  return stickyOnScroll ? (
    <StickyHeader stickyView={stickyFixture} attachContainerId={HEADER_CONTAINER_ID} attachSpaceId={HEADER_SPACE_ID}>
      {fixture}
    </StickyHeader>
  ) : (
    fixture
  );
};

export default FixtureHeader;
