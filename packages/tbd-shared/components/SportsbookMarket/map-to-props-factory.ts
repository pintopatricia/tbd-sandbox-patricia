import { MapStateToPropsFactory } from "react-redux";
import { createSelector } from "reselect";
// types
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { RaceHierarchy } from "@ppb/tbd-store/state/entities/Market.types";
import { SportsbookMarket, createGetThrottleSelector } from "@ppb/tbd-store";
import {
  type MarketPromoIcon,
  type SportsbookMarketI18N,
  type SportsbookMarketProps,
  ViewLink,
} from "@ppb/the-wall-common/types";
import {
  MarketBlurbInfo,
  MarketBlurbPromotion,
  MarketCard,
  MarketCards,
  RunnerViewLinks,
} from "@ppb/tbd-store/state/layout/cards/Card.types";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import {
  extractFootballPlayerRunnerContext,
  getPlayerStatValue,
  getRunnerJersey,
  STAT_LABEL_I18N_KEY,
} from "../FootballRunner/helpers/FootballRunnerHelpers";
import {
  createFootballFixtureByURNSelector,
  createFootballPlayerFixtureContextByURNSelector,
} from "@ppb/tbd-store/state/entities/entities-selectors";
// selectors
import { getSportsbookBettingState } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import {
  getSportsbookMarket,
  getSportsbookMarketRunners,
} from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";
// actions
import {
  SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  SubscribeSportsbookMarketUpdatesAction,
  UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  UnsubscribeSportsbookMarketUpdatesAction,
} from "@ppb/tbd-store/actions/sportsbook-markets";
import { AzSwitchClickAction, UI__AZ_SWITCH_CLICK } from "@ppb/tbd-store/actions/interface";
// other
import { getMarketRunnersByDisplayRunners, isRaceHierarchy } from "@ppb/tbd-store/helpers/markets";
import { createGetRunnerViewTitlesFromRunnerViewLinksSelector } from "@ppb/tbd-store/state/application-state-selectors";
import { MarketTemplate } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { i18n } from "../../helpers/i18n";
import { SbkMarketRunner } from "../SportsbookRunner/SportsbookRunner.types";
import { formatHandicap } from "../../formatters/runner-formatters";

export const createRunnersForSportsbookMarketSelector = () =>
  createSelector(
    [(state, { urn }) => getSportsbookMarketRunners(state, urn), (_, { displayRunnersUrns }) => displayRunnersUrns],
    (marketRunners, displayRunnersUrns) => {
      const displayRunners = getMarketRunnersByDisplayRunners(marketRunners, displayRunnersUrns);

      return displayRunners.map((runner) => ({
        urn: runner.urn,
        name: runner.name,
        handicap: runner.handicap,
        handicapLabel: formatHandicap(runner.handicap, false),
      }));
    },
  );

const getEachWayTermsLabel = (market: SportsbookMarket): string | undefined => {
  const { eachWayAvailable, eachWayPlaces, eachWayPlaceFraction } = market;

  if (eachWayAvailable && eachWayPlaceFraction && eachWayPlaces !== undefined) {
    return i18n({
      key: "I18N.LABELS.EW_TERMS",
      interpolationValues: {
        numerator: eachWayPlaceFraction.numerator,
        denominator: eachWayPlaceFraction.denominator,
        places: eachWayPlaces,
      },
    });
  }
  return undefined;
};

export type StateProps = {
  marketUrn: URN;
  marketId: string;
  runners: SbkMarketRunner[];
  marketPromo?: MarketBlurbPromotion;
  infoBlurbs?: MarketBlurbInfo[];
} & Omit<SportsbookMarketProps, "infoBlurbs" | "marketPromo" | "children"> &
  Pick<MarketCard, "infoBlurbs" | "marketPromo">;

export type ContainerProps = {
  urn: URN;
  cardUrn: URN;
  inline?: boolean;
  runnerViewLinks?: RunnerViewLinks;
  displayRunnersUrns: URN[];
  template: `${MarketTemplate}` | "COUPON";
  isShowMoreAvailable?: boolean;
  isItemsListCollapsed?: boolean;
  numberOfItemsToDisplay?: number;
  eachWayTermsLabel?: string;
  isRunnerExpandable?: boolean;
  eventViewLink?: ViewLink;
  isUppercase?: boolean;
  show90MinBlurb?: boolean;
  visible?: boolean;
} & Pick<SportsbookMarketProps, "onMarketPromoClick" | "onLinkClick"> &
  Pick<MarketCard, "infoBlurbs" | "marketPromo">;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getRunnersForSportsbookMarket = createRunnersForSportsbookMarketSelector();
  const getRunnerViewTitlesFromRunnerViewLinks = createGetRunnerViewTitlesFromRunnerViewLinksSelector();
  const getThrottle = createGetThrottleSelector();
  const getMarketCardByURN = createCardByURNSelector<MarketCards, URN>();
  const getFootballFixtureByURN = createFootballFixtureByURNSelector();
  const getFootballPlayerFixtureContextByURN = createFootballPlayerFixtureContextByURNSelector();
  const getJerseyData = createSelector(
    [
      (state: ApplicationState, cardUrn: URN) => getMarketCardByURN(state?.layouts?.cards?.markets, cardUrn),
      (state: ApplicationState) => state.entities.throttles,
      (state: ApplicationState) => state.entities.footballfixtures,
      (state: ApplicationState) => state.entities.footballplayerfixturecontexts,
    ],
    (marketCard, throttles, footballFixtures, footballPlayerFixtures) => {
      const participantIdByUrn: Record<string, string | null | undefined> = {};
      if (!marketCard)
        return {
          jerseys: null,
          playerHomeAwayMap: null,
          playerStats: null,
          cardStat: undefined,
          participantIdByUrn,
        };
      const { jerseys, playerHomeAwayMap, playerStats } = extractFootballPlayerRunnerContext(
        getThrottle,
        getFootballFixtureByURN,
        getFootballPlayerFixtureContextByURN,
        throttles,
        marketCard,
        footballFixtures,
        footballPlayerFixtures,
      );
      marketCard.displayRunners?.sportsbook?.runners?.forEach((r) => {
        participantIdByUrn[r.urn] = r.participantId;
      });
      return {
        jerseys,
        playerHomeAwayMap,
        playerStats,
        cardStat: marketCard.stat,
        participantIdByUrn,
      };
    },
  );
  const labels: SportsbookMarketI18N = {
    suspended: i18n({ key: "I18N.MARKET.SUSPENDED" }),
    closed: i18n({ key: "I18N.MARKET.CLOSED" }),
    bog: i18n({ key: "I18N.LABELS.BOG_ON_SINGLES" }),
    nonRunnerTitle: i18n({ key: "I18N.NON_RUNNER.TITLE" }),
    azSwitcher: i18n({ key: "I18N.ALPHABETICAL_SORTING_SWITCHER" }),
  };

  return (
    state,
    {
      urn,
      cardUrn,
      runnerViewLinks,
      displayRunnersUrns,
      isItemsListCollapsed,
      isShowMoreAvailable,
      numberOfItemsToDisplay,
      infoBlurbs,
      template,
    },
  ) => {
    const market = getSportsbookMarket(state, urn);

    const isRacing = isRaceHierarchy(market.hierarchy);
    const { isBonusSelected } = getSportsbookBettingState(state);
    const runners = getRunnersForSportsbookMarket(state, {
      urn,
      raceUrn: isRacing ? (market.hierarchy as RaceHierarchy).race : undefined,
      displayRunnersUrns,
    });
    const baseDisplayRunners = [MarketTemplate.Inline, "COUPON"].includes(template) ? runners.slice(0, 3) : runners;

    const { jerseys, playerHomeAwayMap, playerStats, cardStat, participantIdByUrn } = getJerseyData(state, cardUrn);
    const statLabel = playerStats && cardStat ? STAT_LABEL_I18N_KEY[cardStat] : undefined;

    const displayRunners = baseDisplayRunners.map((runner) => {
      const participantId = participantIdByUrn[runner.urn];
      const { jerseyUrl, useFallbackJersey } = getRunnerJersey(jerseys, playerHomeAwayMap, participantId);

      let statValue: string | undefined;
      let statValueInterpolation: Record<string, string | number> | undefined;
      if (playerStats && participantId) {
        const statResult = getPlayerStatValue(playerStats[participantId], cardStat);
        statValue = statResult?.value;
        statValueInterpolation = statResult?.interpolation;
      }

      return { ...runner, jerseyUrl, useFallbackJersey, statValue, statValueInterpolation, statLabel };
    });
    // in racing markets, EW should be shown only when not in-play
    const shouldShowEachWay = !isRacing || (isRacing && !market.inplay);
    const eachWayLabel = shouldShowEachWay ? getEachWayTermsLabel(market) : undefined;
    const eachWayPlaceholder =
      !eachWayLabel && shouldShowEachWay && market.eachWayAvailable
        ? { title: "\u00A0", signposting: "MARKET_RULES" as MarketPromoIcon.MarketRules }
        : undefined;

    const eachWayBlurb = eachWayLabel
      ? { title: eachWayLabel, signposting: "MARKET_RULES" as MarketPromoIcon.MarketRules }
      : eachWayPlaceholder;

    const infoBlurbsWithEachWayTerms = eachWayBlurb ? [eachWayBlurb, ...(infoBlurbs || [])] : infoBlurbs || [];

    return {
      marketUrn: market.urn,
      marketId: market.marketId,
      status: market.status || "OPEN",
      runners: displayRunners,
      guaranteedPriceAvailable:
        !market.inplay && market.guaranteedPriceAvailable ? market.guaranteedPriceAvailable : false,
      i18n: labels,
      isBonusSelected,
      cardUrn,
      runnerViewsTitles: runnerViewLinks
        ? getRunnerViewTitlesFromRunnerViewLinks(state.layouts.views.runner, runnerViewLinks)
        : undefined,
      isShowMoreAvailable,
      isItemsListCollapsed,
      numberOfItemsToDisplay,
      infoBlurbs: infoBlurbsWithEachWayTerms,
    };
  };
};

const dispatchMarketUpdatesSubscribe = (
  marketId: string,
  subscriberId: string,
): SubscribeSportsbookMarketUpdatesAction => ({
  type: SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  payload: {
    marketId,
    subscriberId,
  },
});

const dispatchMarketUpdatesUnsubscribe = (
  marketId: string,
  subscriberId: string,
): UnsubscribeSportsbookMarketUpdatesAction => ({
  type: UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  payload: {
    marketId,
    subscriberId,
  },
});

const dispatchAzSwitchClick = (label: string, isToggleOn: boolean): AzSwitchClickAction => ({
  type: UI__AZ_SWITCH_CLICK,
  payload: {
    label,
    isToggleOn,
  },
});

export type DispatchProps = {
  dispatchMarketUpdatesSubscribe: typeof dispatchMarketUpdatesSubscribe;
  dispatchMarketUpdatesUnsubscribe: typeof dispatchMarketUpdatesUnsubscribe;
  dispatchAzSwitchClick: typeof dispatchAzSwitchClick;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchMarketUpdatesSubscribe,
  dispatchMarketUpdatesUnsubscribe,
  dispatchAzSwitchClick,
};
