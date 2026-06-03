import { createSelector, createSelectorCreator, defaultMemoize, ParametricSelector, Selector } from "reselect";
import {
  Card,
  CompetitionRegionCard,
  CompetitionRegionCards,
  CompetitionViewLink,
  MatchStatsCard,
  MatchStatsCards,
  RaceViewLinksCard,
  RunnerViewLinks,
} from "./layout/cards/Card.types";
import {
  SwimlaneCardGroup,
  SwimlaneCardGroups,
  PebbleCardGroup,
  PebbleCardGroups,
  HalfTimeSpecialsSwimlaneCardGroup,
  HalfTimeSpecialsSwimlaneCardGroups,
  RacingSwimlaneCardGroup,
  RacingSwimlaneCardGroups,
  PopularSwimlaneCardGroup,
  PopularSwimlaneCardGroups,
} from "./layout/cardgroups/CardGroup.types";
import { RunnerViews, View } from "./layout/views/View.types";
import { ViewLink } from "./layout/views/ViewLink.types";
import { NavigationTabList, NavigationTabListItem } from "./layout/navigation-tabs-list/NavigationTabsList.types";
import {
  Competition,
  Competitions,
  Meeting,
  Meetings,
  Race,
  Races,
  ExchangeRunner,
  ExchangeBetAvailability,
  TeamDetails,
  FootballParticipantStats,
} from "./entities";
import { ApplicationState } from "./ApplicationState.types";
import { createExchangeMarketRunnerByMarketAndRunnerURNsSelector } from "./entities/exchange-markets/exchange-market-selectors";
import { createExchangeRunnerOddsByURNSelector } from "./entities/exchange-runners/exchange-runner-selectors";
import { createCardByURNSelector, createFindCardbyURNSelector } from "./layout/cards/cards-selectors";
import { createFindViewByURNSelector } from "./layout/views/view-selectors";
import { createCompetitionSelector } from "./entities/competitions/competition-selectors";
import { createNavigationTabsListByURNSelector } from "./layout/navigation-tabs-list/navigation-tabs-list-selectors";
import { createNavigationTabByURNSelector } from "./layout/navigation-tabs/navigation-tabs-selectors";
import { createExcRunnerPotentialBetsByRunnerURNSelector } from "./entities/entities-selectors";
import { createHasProductSwitcherSelector } from "./layout/cards/bottom-bar/bottom-bar-card-selectors";
import { createCardGroupByURNSelector } from "./layout/cardgroups/cardgroups-selectors";
import { isHydratedPebbleCardGroup } from "./layout/cardgroups/pebble-cardgroups/pebble-cardgroups-selectors";
import {
  FilteredCouponCardGroup,
  FilteredCouponCardGroups,
} from "./layout/cardgroups/filtered-coupon-cardgroups/FilteredCouponCardGroups.types";
import URN from "./layout/URN";
import { ExchangeSide } from "./betting/exchange-bets/ExchangeBet.types";
import { FootballMatchStatus } from "./constants";
import { MarketPromoSignposting } from "../clients/catalogue/catalogue-response-types";

export const createGetRunnerViewTitlesFromRunnerViewLinksSelector = (): ParametricSelector<
  RunnerViews,
  RunnerViewLinks,
  { [runnerViewUrn: string]: string }
> =>
  createSelector(
    [(state: RunnerViews) => state, (state: RunnerViews, runnerViewLinks: RunnerViewLinks) => runnerViewLinks],
    (runnerViews, runnerViewLinks): { [k: string]: string } =>
      Object.values(runnerViewLinks).reduce(
        (acc, { viewUrn }) => ({ ...acc, [viewUrn]: runnerViews[viewUrn]?.title }),
        {},
      ),
  );

type FootballOpponentStats = {
  home: {
    details?: TeamDetails;
    stats?: FootballParticipantStats;
  };
  away: {
    details?: TeamDetails;
    stats?: FootballParticipantStats;
  };
};

export type HydratedMatchStatsCard = (MatchStatsCard & FootballOpponentStats) | undefined;

/**
 * createHydratedMatchStatsCardByURNSelector
 * For a given match stats card URN, returns
 *  - undefined if no card is found
 *  - or the corresponding card hydrated with all the information it needs to present to the user:
 *    - the card itself
 *    - event opponents (team details) from the corresponding fixture
 *    - event full match stats from the corresponding fixture
 */
export const createHydratedMatchStatsCardByURNSelector = (): ParametricSelector<
  ApplicationState,
  URN,
  HydratedMatchStatsCard
> => {
  const getMatchStatsCardByURN = createCardByURNSelector<MatchStatsCards, URN>();

  return createSelector(
    [
      (state: ApplicationState, cardURN: URN) => getMatchStatsCardByURN(state.layouts.cards.matchstats, cardURN),
      (state: ApplicationState, cardURN: URN) => {
        const card = getMatchStatsCardByURN(state.layouts.cards.matchstats, cardURN);
        return card && state.entities.footballfixtures[card?.fixture];
      },
    ],
    (card, fixture) => {
      if (!card || !fixture) {
        return undefined;
      }

      const stats = fixture.stats?.find(
        ({ periodStatus, period }) => periodStatus === FootballMatchStatus.FULL && !period,
      );

      return {
        ...card,
        home: {
          details: fixture.home,
          stats: stats?.home,
        },
        away: {
          details: fixture.away,
          stats: stats?.away,
        },
      };
    },
  );
};

export type RaceViewLinkHydrated = {
  race: Race;
  viewLink: ViewLink;
  marketPromo?: MarketPromoSignposting;
};

export type MeetingViewLinkHydrated = {
  meeting: Meeting;
  viewLink: ViewLink;
};

export type RaceViewLinksCardHydrated = Omit<RaceViewLinksCard, "race" | "raceViewLinks"> & {
  race: Race;
  raceViewLinks: RaceViewLinkHydrated[];
};

/**
 * createLayoutStructureByViewURNSelector
 * For a given current view urn, returns:
 *  - undefined if the urn is not valid or current view doesn't have items
 *  - or corresponding view hydrated with full relational layout structure in "items"
 *
 *  LayoutItems can be either CardGroups, PebbleCardGroups, NavigationTabsList or NavigationTab
 *  (with "items" get overridden by an indexed collection of nested items)
 *  or a Card which doesn't have items (hence being optional).
 */
type LayoutItem =
  | ((
      | Omit<SwimlaneCardGroup, "items">
      | Omit<PebbleCardGroup, "items">
      | Omit<FilteredCouponCardGroup, "items">
      | Omit<NavigationTabList, "items">
      | Omit<NavigationTabListItem, "items">
      | Omit<HalfTimeSpecialsSwimlaneCardGroup, "items">
      | Omit<RacingSwimlaneCardGroup, "items">
      | Omit<PopularSwimlaneCardGroup, "items">
    ) & {
      items?: {
        [urn: string]: LayoutItem | undefined;
      };
    })
  | Card;

type LayoutItems = {
  [urn: string]: LayoutItem;
};

type HydratedView = (Omit<View, "items"> & { items: LayoutItems }) | undefined;

export const createLayoutStructureByViewURNSelector = (): ParametricSelector<ApplicationState, URN, HydratedView> => {
  const getViewByURN = createFindViewByURNSelector();
  const getCardByURN = createFindCardbyURNSelector();
  const getSwimlaneCardGroupByURN = createCardGroupByURNSelector<SwimlaneCardGroups, URN>();
  const getRacingSwimlaneCardGroupByURN = createCardGroupByURNSelector<RacingSwimlaneCardGroups, URN>();
  const getPopularSwimlaneCardGroupByURN = createCardGroupByURNSelector<PopularSwimlaneCardGroups, URN>();
  const getHalfTimeSpecialsSwimlaneCardGroupByURN = createCardGroupByURNSelector<
    HalfTimeSpecialsSwimlaneCardGroups,
    URN
  >();
  const getHydratedPebbleCardGroupByURN = createCardGroupByURNSelector<PebbleCardGroups, URN>();
  const getFilteredCouponCardGroupByURN = createCardGroupByURNSelector<FilteredCouponCardGroups, URN>();
  const getNavigationTabsList = createNavigationTabsListByURNSelector();
  const getNavigationTab = createNavigationTabByURNSelector();

  return createSelector(
    [
      (state: ApplicationState, urn: URN) => getViewByURN(state.layouts.views, urn),
      (state: ApplicationState) => state.layouts,
    ],
    (view, layouts): HydratedView => {
      function fillItems(items: string[] | undefined): LayoutItems | undefined {
        if (!items) {
          return undefined;
        }

        const layoutItems = items.reduce((acc: LayoutItems, urn: string): LayoutItems => {
          let item: LayoutItem | undefined;
          const swimlaneCardGroup = getSwimlaneCardGroupByURN(layouts.cardgroups.swimlanecardgroups, urn);
          const racingSwimlaneCardGroup = getRacingSwimlaneCardGroupByURN(
            layouts.cardgroups.racingswimlanecardgroups,
            urn,
          );
          const popularSwimlaneCardGroup = getPopularSwimlaneCardGroupByURN(
            layouts.cardgroups.popularswimlanecardgroups,
            urn,
          );
          const halfTimeSpecialsSwimlaneCardGroup = getHalfTimeSpecialsSwimlaneCardGroupByURN(
            layouts.cardgroups.halftimespecialsswimlanecardgroups,
            urn,
          );
          const pebbleCardGroup = getHydratedPebbleCardGroupByURN(layouts.cardgroups.pebblecardgroups, urn);
          const filteredCouponCard = getFilteredCouponCardGroupByURN(layouts.cardgroups.filteredcouponcardgroups, urn);
          const card = getCardByURN(layouts.cards, urn);
          const navigationTabsList = getNavigationTabsList(layouts.navigationtabslists, urn);
          const navigationTab = getNavigationTab(layouts.navigationtabs, urn);

          if (swimlaneCardGroup?.items) {
            item = {
              ...swimlaneCardGroup,
              items: fillItems(swimlaneCardGroup.items.map((value) => value.urn)),
            };
          }

          if (halfTimeSpecialsSwimlaneCardGroup?.items) {
            item = {
              ...halfTimeSpecialsSwimlaneCardGroup,
              items: fillItems(halfTimeSpecialsSwimlaneCardGroup.items.map((value) => value.urn)),
            };
          }

          if (pebbleCardGroup && isHydratedPebbleCardGroup(pebbleCardGroup)) {
            const pebbleCardGroupItems = pebbleCardGroup.items.map((edge) => edge.urn);
            item = {
              ...pebbleCardGroup,
              items: fillItems(pebbleCardGroupItems),
            };
          }

          if (navigationTabsList?.items) {
            item = {
              ...navigationTabsList,
              items: fillItems(navigationTabsList.items.map((value) => value.urn)),
            };
          }

          if (navigationTab?.items) {
            item = {
              ...navigationTab,
              items: fillItems(navigationTab.items.map((value) => value.urn)),
            };
          }

          if (filteredCouponCard?.items) {
            item = {
              ...filteredCouponCard,
              items: fillItems(filteredCouponCard.items.map((value) => value.urn)),
            };
          }

          if (racingSwimlaneCardGroup?.items) {
            item = {
              ...racingSwimlaneCardGroup,
              items: fillItems(racingSwimlaneCardGroup.items.map((value) => value.urn)),
            };
          }

          if (popularSwimlaneCardGroup?.items) {
            item = {
              ...popularSwimlaneCardGroup,
              items: fillItems(popularSwimlaneCardGroup.items.map((value) => value.urn)),
            };
          }

          if (card) {
            item = { ...card };
          }

          return item
            ? {
                ...acc,
                [urn]: item,
              }
            : acc;
        }, {});

        if (!Object.keys(layoutItems).length) {
          return undefined;
        }

        return layoutItems;
      }

      const itemUrns = (view?.items || []).map((item) => item.urn);
      const items = fillItems(itemUrns);

      if (view && items) {
        return {
          ...view,
          items,
        };
      }

      return undefined;
    },
  );
};

export type RaceHydrated = Omit<Race, "meeting"> & {
  meeting: Meeting;
};

function isMeetingsEqual(previous: Meetings, current: Meetings): boolean {
  return JSON.stringify(previous) === JSON.stringify(current);
}

const createGetAllMeetingsSelectorABC = createSelectorCreator(defaultMemoize, isMeetingsEqual);

function isRaceEqual(previous: Races, current: Races): boolean {
  return JSON.stringify(previous) === JSON.stringify(current);
}

const getAllRaces = createSelectorCreator(defaultMemoize, isRaceEqual);

export const createGetAllMeetingsSelector = () =>
  createGetAllMeetingsSelectorABC(
    [(state: ApplicationState) => state.entities.meetings],
    (meetings): Meetings => meetings,
  );

export const createGetAllRacesSelector = () =>
  getAllRaces([(state: ApplicationState) => state.entities.races], (races): Races => races);

type HydratedCompetitionViewLink = {
  urn: URN;
  viewLink: ViewLink;
  competition: Competition;
};

export type HydratedCompetitionRegion = {
  urn: string;
  code: string;
  flag?: string;
  competitionViewLinks: HydratedCompetitionViewLink[];
};

export const createHydratedCompetitionRegionSelector = (): ParametricSelector<
  ApplicationState,
  URN,
  HydratedCompetitionRegion[] | null
> => {
  const getCompetitionRegionCard = createCardByURNSelector<CompetitionRegionCards, URN>();
  const getCompetitionByURN = createCompetitionSelector();

  return createSelector(
    [
      (state: ApplicationState, urn: URN) => getCompetitionRegionCard(state.layouts.cards.competitionregions, urn),
      (state: ApplicationState) => state.entities.competitions,
    ],
    (competitionRegionCard: CompetitionRegionCard | null, competitions: Competitions) => {
      if (!competitionRegionCard) {
        return null;
      }

      return competitionRegionCard.competitionRegions.map((competitionRegion) => ({
        urn: competitionRegion.country.urn,
        code: competitionRegion.country.code,
        flag: competitionRegion.country.flag,
        competitionViewLinks: competitionRegion.competitionViewLinks.reduce(
          (result: HydratedCompetitionViewLink[], competitionViewLink: CompetitionViewLink) => {
            const competition = getCompetitionByURN(competitions, competitionViewLink.competition);

            if (competition) {
              result.push({
                urn: competitionViewLink.urn,
                viewLink: competitionViewLink.viewLink,
                competition,
              });
            }
            return result;
          },
          [],
        ),
      }));
    },
  );
};

type ExchangeRunnerOddsWithPotentialBetsByURNProps = {
  marketURN: URN;
  runnerURN: URN;
  bestOdds: boolean;
  side?: ExchangeSide;
};
export type ExchangeRunnerOddsWithPotentialBets = Omit<ExchangeRunner, "back" | "lay"> & {
  back?: (ExchangeBetAvailability & { isPotentialBet: boolean })[];
  lay?: (ExchangeBetAvailability & { isPotentialBet: boolean })[];
};
export const createExchangeRunnerOddsWithPotentialBetsByURNSelector = (): ParametricSelector<
  ApplicationState,
  ExchangeRunnerOddsWithPotentialBetsByURNProps,
  ExchangeRunnerOddsWithPotentialBets | undefined
> => {
  const getExchangeRunnerOddsByURN = createExchangeRunnerOddsByURNSelector();
  const getExchangeMarketRunnerByURN = createExchangeMarketRunnerByMarketAndRunnerURNsSelector();
  const getExcRunnerPotentialBetsByRunnerURN = createExcRunnerPotentialBetsByRunnerURNSelector();

  return createSelector(
    [
      (state: ApplicationState, { marketURN, runnerURN }: ExchangeRunnerOddsWithPotentialBetsByURNProps) =>
        getExchangeMarketRunnerByURN(state.entities.exchangemarkets, { marketURN, runnerURN }),
      (state: ApplicationState, { runnerURN, bestOdds, side }: ExchangeRunnerOddsWithPotentialBetsByURNProps) =>
        getExchangeRunnerOddsByURN(state.entities.exchangerunners, { urn: runnerURN, bestOdds, side }),
      (state: ApplicationState, { runnerURN }: ExchangeRunnerOddsWithPotentialBetsByURNProps) =>
        getExcRunnerPotentialBetsByRunnerURN(state, runnerURN),
      (state: ApplicationState) => state.betslip?.exchangeContext?.marketDepth,
    ],
    (marketRunner, runnerWithOdds, runnerPotentialBets, potentialBetIndex) => {
      if (!marketRunner || !runnerWithOdds) {
        return undefined;
      }

      const backPrices = runnerWithOdds.back?.map((back) => {
        const potentialBet = runnerPotentialBets.find((potentialbet) => potentialbet.side === "BACK");
        return {
          ...back,
          isPotentialBet: !!potentialBet && potentialBetIndex === back.marketDepth,
        };
      });

      const layPrices = runnerWithOdds.lay?.map((lay) => {
        const potentialBet = runnerPotentialBets.find((potentialbet) => potentialbet.side === "LAY");
        return {
          ...lay,
          isPotentialBet: !!potentialBet && potentialBetIndex === lay.marketDepth,
        };
      });

      return {
        ...runnerWithOdds,
        back: backPrices,
        lay: layPrices,
      };
    },
  );
};

export const createIsProductSwitcherActiveSelector = (): Selector<ApplicationState, boolean> => {
  const getHasProductSwitcher = createHasProductSwitcherSelector();

  return createSelector(
    [
      ({ entities: { throttles } }) => throttles?.PRODUCT_SWITCHER?.isActive || false,
      (state) => getHasProductSwitcher(state.layouts.cards.bottombar) || false,
    ],
    (isProductSwitcherThrottleActive, isEligibleForProductSwitcher) =>
      isProductSwitcherThrottleActive && isEligibleForProductSwitcher,
  );
};

/**
 * Note: createIsProductSwitcherActiveNativeSelector was created with only purpose of avoid problems on app submission to
 * AppStore. We should never have different behavior between web and native and this is an exception, and should be
 * deleted as soon as possible
 */
export const createIsProductSwitcherActiveNativeSelector = (): Selector<ApplicationState, boolean> => {
  const getHasProductSwitcher = createHasProductSwitcherSelector();

  return createSelector(
    [
      ({ entities: { throttles } }) => throttles?.PRODUCT_SWITCHER_NATIVE?.isActive || false,
      (state) => getHasProductSwitcher(state.layouts.cards.bottombar) || false,
    ],
    (isProductSwitcherThrottleActive, isEligibleForProductSwitcher) =>
      isProductSwitcherThrottleActive && isEligibleForProductSwitcher,
  );
};
