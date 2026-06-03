import i18next from "i18next";
import { shallowEqual } from "react-redux";
import { createSelector, createSelectorCreator, defaultMemoize, ParametricSelector } from "reselect";

import { PotentialBet, RunnerPosition } from "@ppb/bet-engine";
import { BettingState, LEG_TYPES, PlaceResult } from "@ppb/betslip-core";
import { codecs } from "@ppb/tbd-urn-codecs";

import {
  BaseFixture,
  Entities,
  ExchangeDefaultProductOption,
  Fixture,
  FootballFixture,
  FootballFixtures,
  GreyhoundRaceRunner,
  MarketId,
  MarketRunner,
  ProductsOption,
  RaceRunner,
  SelectionId,
  SportsbookMarket,
  SportsbookRunner,
  SportsbookRunnerStatus,
  UserPreferences,
  UserWallets,
  VirtualRunners,
} from "./index";
import { ApplicationState } from "../ApplicationState.types";
import { ExchangeRunnerTree } from "../betslip";
import { ADD_SELECTION_PAYLOAD } from "../../actions/betting";
import { AddLegOptions, RunnersMetadata } from "../betting/sportsbook-betting/SportsbookBetting.types";
import { EventType, ExchangeRunnerStatus, RacingSport } from "../constants";
import URN from "../layout/URN";
import { createShallowEqualSelector } from "../../helpers/selectors";
import { isRaceHierarchy } from "../../helpers/markets";
import { getRacingMetadata, mapSportsbookOddsToOdds } from "../../helpers/sportsbook-betting";

import { createTennisFixtureByURNSelector } from "./tennis-fixture/tennis-fixture-selectors";
import { createMeetingByURNSelector } from "./meetings/meeting-selectors";
import { createRaceByURNSelector } from "./races/race-selectors";
import { getSportEventByURN } from "./sport-events/sport-event-selectors";
import { getSportByURN } from "./sports/sport-selectors";
import {
  createSportsbookMarketByURNSelector,
  createSportsbookMarketRunnerByRunnerAndMarketURNSelector,
  getSportsbookMarketById,
  getSportsbookMarketRunnerById,
} from "./sportsbook-markets/sportsbook-market-selectors";
import {
  createSportsbookRunnerByURNSelector,
  createSportsbookRunnerStatusSelector,
} from "./sportsbook-runners/sportsbook-runner-selectors";
import { createRaceRunnersByRaceURNSelector } from "./race-runners/race-runners-selectors";
import { getUserWallets } from "./user-wallets/user-wallets-selectors";
import { createUserPreferencesWithProductSwitcherSelector } from "./user-preferences/user-preferences-selectors";
import { createAustralianRulesFixtureByURNSelector } from "./australian-rules-fixture/australian-rules-fixture-selectors";
import { createAmericanFootballFixtureByURNSelector } from "./american-football-fixture/american-football-fixture-selectors";
import { createBaseballFixtureByURNSelector } from "./baseball-fixture/baseball-fixture-selectors";
import { createBasketballFixtureByURNSelector } from "./basketball-fixture/basketball-fixture-selectors";
import { createIceHockeyFixtureByURNSelector } from "./ice-hockey-fixture/ice-hockey-fixture-selectors";
import { createCricketFixtureByURNSelector } from "./cricket-fixture/cricket-fixture-selectors";
import { createSnookerFixtureByURNSelector } from "./snooker-fixture/snooker-fixture-selectors";
import { createDartsFixtureByURNSelector } from "./darts-fixture/darts-fixture-selectors";
import { createTableTennisFixtureByURNSelector } from "./table-tennis-fixture/table-tennis-fixture-selectors";
import { createRugbyUnionFixtureByURNSelector } from "./rugby-union-fixture/rugby-union-fixture-selectors";
import { createRugbyLeagueFixtureByURNSelector } from "./rugby-league-fixture/rugby-league-fixture-selectors";
import { createVolleyballFixtureByURNSelector } from "./volleyball-fixture/volleyball-fixture-selectors";
import {
  createExchangeMarketRunnerByMarketAndRunnerURNsSelector,
  createExchangeMarketSelector,
  getExchangeMarketRunnerByURN,
} from "./exchange-markets/exchange-market-selectors";
import {
  createExchangeRunnerWithoutOddsByRunnerURNSelector,
  getExchangeRunnerByURN,
} from "./exchange-runners/exchange-runner-selectors";
import {
  createBettingMarketRunnersPositionSelector,
  createMarketPotentialBetsSelector,
} from "../betting/exchange-betting/exchange-betting-selectors";
import {
  createVirtualMarketByIdSelector,
  createVirtualMarketByRunnerURNSelector,
} from "./virtual-market/virtual-market-selectors";
import {
  createVirtualRunnerByIdSelector,
  createVirtualRunnerByURNSelector,
} from "./virtual-runner/virtual-runner-selectors";
import { createVirtualSportByURNSelector } from "./virtual-sport/virtual-sport-selectors";
import { createVirtualEventByURNSelector } from "./virtual-event/virtual-event-selectors";
import { getCompetitionByURN } from "./competitions/competition-selectors";
import {
  createGreyhoundRaceRunnerByRaceAndSelectionIdSelector,
  createGreyhoundRaceRunnersByRaceURNSelector,
} from "./greyhound-race-runners/greyhound-race-runners-selectors";
import {
  FootballPlayerFixtureContext,
  FootballPlayerFixtureContexts,
} from "./football-player-fixture-context/FootballPlayerFixtureContext.types";

export const getEntities = (state: ApplicationState): Entities => state.entities;

/**
 * createRaceWithRunnersByURNSelector
 * For a given race URN, returns
 *  - and object with undefined values for race and raceRunners if they dont exist
 *  - or the corresponding hydrated race with the runners:
 *    - race: the race itself
 *    - raceRunners: the runners of that race
 */
export const createRaceWithRunnersByURNSelector = () => {
  const getRaceByURN = createRaceByURNSelector();
  const getRaceRunnersByRaceURN = createRaceRunnersByRaceURNSelector();

  return createSelector(
    [
      ({ races }: Entities, raceURN: URN) => getRaceByURN(races, raceURN),
      ({ racerunners }: Entities, raceURN: URN) => getRaceRunnersByRaceURN(racerunners, raceURN),
    ],
    (race, raceRunners) => ({
      race,
      raceRunners,
    }),
  );
};

export const createGetVirtualAddOneLinePayloadSelector = () => undefined;

export const createGetVirtualAddPayloadSelector = () => {
  const getVirtualRunnerByURN = createVirtualRunnerByURNSelector();
  const getVirtualMarketByRunnerURN = createVirtualMarketByRunnerURNSelector();

  return createSelector(
    [({ virtualrunners }) => virtualrunners, ({ virtualmarkets }) => virtualmarkets, (_: Entities, urn: URN) => urn],
    (virtualRunners, virtualMarkets, urn) => {
      const runner = getVirtualRunnerByURN(virtualRunners, urn);

      if (!runner) {
        return undefined;
      }

      const virtualMarket = getVirtualMarketByRunnerURN(virtualMarkets, urn);

      if (!virtualMarket) {
        return undefined;
      }

      const odds = mapSportsbookOddsToOdds(runner.odds);
      const displayOdds = mapSportsbookOddsToOdds(runner.odds);
      const { marketId } = virtualMarket;
      const { selectionId } = runner;

      return {
        legType: LEG_TYPES.SIMPLE_SELECTION,
        runners: [{ marketId, selectionId }],
        odds,
        displayOdds,
        combinationDefaults: {
          eachWayOdds: null,
          eachWayPlaces: virtualMarket?.eachWayPlaces || null,
          eachWayPlacesFraction: virtualMarket?.eachWayFraction
            ? { numerator: 1, denominator: virtualMarket?.eachWayFraction }
            : null,
          stake: null,
          isEachWayAvailable: virtualMarket?.hasEachWay || false,
          isEachWaySelected: false,
          isSPAvailable: false,
          isSPSelected: false,
        },
      };
    },
  );
};

/**
 * This selector creates the implyBets payload using runners coming from Apollo component.
 *
 * @param runners
 * @param legType
 * @param legOptions
 */
export const createGetAddOneLinePayloadSelector = (
  runners: BettingState.Runner[],
  legType: LEG_TYPES,
  legOptions?: AddLegOptions,
) => ({
  legType,
  runners,
  odds: null,
  displayOdds: null,
  combinationDefaults: {
    eachWayOdds: null,
    eachWayPlaces: null,
    eachWayPlacesFraction: null,
    stake: null,
    isEachWayAvailable: false,
    isEachWaySelected: false,
    isSPAvailable: false,
    isSPSelected: false,
  },
  groupId: legOptions?.groupId,
  isBoosted: legOptions?.isBoostedLeg,
});

export const createGetAddPayloadSelector = () => {
  const getSportsbookMarketByURN = createSportsbookMarketByURNSelector();
  const getSportsbookRunnerByURN = createSportsbookRunnerByURNSelector();

  return createSelector(
    [
      ({ sportsbookrunners }) => sportsbookrunners,
      ({ sportsbookmarkets }) => sportsbookmarkets,
      ({ sports }) => sports,
      (_: Entities, urn, legOptions?: AddLegOptions) => ({
        urn,
        legOptions,
      }),
    ],

    (sportsbookrunners, sportsbookmarkets, sports, { urn, legOptions }) => {
      const runner = getSportsbookRunnerByURN(sportsbookrunners, urn);

      if (!runner) {
        return undefined;
      }

      const market = getSportsbookMarketByURN(sportsbookmarkets, runner?.market);

      if (!market) {
        return undefined;
      }

      const sport = getSportByURN(sports, market.sport);
      const legType = EventType.LOTTERIES === sport?.sportId ? LEG_TYPES.ONE_LINE_BET : LEG_TYPES.SIMPLE_SELECTION;
      const odds = mapSportsbookOddsToOdds(runner.trueOdds);
      const displayOdds = mapSportsbookOddsToOdds(runner.odds);
      const eachWayOdds = mapSportsbookOddsToOdds(runner.eachWayOdds?.trueOdds);
      const { marketId } = market;
      const { selectionId, handicap } = runner;

      return {
        legType,
        runners: [{ marketId, selectionId, handicap }],
        odds,
        displayOdds,
        combinationDefaults: {
          eachWayOdds,
          eachWayPlaces: market?.eachWayPlaces || null,
          eachWayPlacesFraction: market?.eachWayPlaceFraction || null,
          stake: null,
          isEachWayAvailable: market?.eachWayAvailable || false,
          isEachWaySelected: market?.isAutomaticEachWayMarketType || false,
          isSPAvailable: !!market?.bspMarket,
          isSPSelected: !!market?.bspMarket && !odds,
        },
        groupId: legOptions?.groupId,
        isBoosted: legOptions?.isBoostedLeg,
      };
    },
  );
};

export type MarketRunnerIdAssociation = {
  marketId: MarketId;
  selectionId: SelectionId;
  handicap?: number;
  sportId?: number;
};

export const createGetMarketRunnerIdAssociationSelector = () => {
  const getSportsbookMarketByURN = createSportsbookMarketByURNSelector();
  const getSportsbookRunnerByURN = createSportsbookRunnerByURNSelector();

  return createSelector(
    [
      ({ sportsbookrunners }) => sportsbookrunners,
      ({ sportsbookmarkets }) => sportsbookmarkets,
      ({ sports }) => sports,
      (_: Entities, urn: URN) => urn,
    ],
    (sportsbookrunners, sportsbookmarkets, sports, urn) => {
      const runnerOdds = getSportsbookRunnerByURN(sportsbookrunners, urn);
      if (!runnerOdds) {
        return undefined;
      }
      const market = getSportsbookMarketByURN(sportsbookmarkets, runnerOdds.market);
      if (!market) {
        return undefined;
      }
      const sport = getSportByURN(sports, market.sport);
      const { sportId } = sport || { sportId: undefined };
      const { marketId } = market;
      const { selectionId, handicap } = runnerOdds;
      return { marketId, selectionId, handicap, sportId };
    },
  );
};

export const createGetVirtualMarketRunnerIdAssociationSelector = () => {
  const getVirtualRunnerByURN = createVirtualRunnerByURNSelector();
  const getVirtualMarketByRunnerURN = createVirtualMarketByRunnerURNSelector();

  return createSelector(
    [({ virtualrunners }) => virtualrunners, ({ virtualmarkets }) => virtualmarkets, (_: Entities, urn: URN) => urn],
    (virtualRunners, virtualMarkets, urn) => {
      const virtualRunner = getVirtualRunnerByURN(virtualRunners, urn);

      if (!virtualRunner) {
        return undefined;
      }

      const virtualMarket = getVirtualMarketByRunnerURN(virtualMarkets, urn);

      if (!virtualMarket) {
        return undefined;
      }

      const { marketId } = virtualMarket;
      const { selectionId } = virtualRunner;

      return { marketId, selectionId };
    },
  );
};

export type MarketRunnerURNAssociation = { marketUrn: URN; runnerUrn: URN };

export const createGetVirtualMarketRunnerURNAssociationSelector = <T extends MarketRunnerIdAssociation>() => {
  const getVirtualMarketById = createVirtualMarketByIdSelector();

  return createSelector(
    [
      ({ virtualmarkets }) => virtualmarkets,
      ({ virtualrunners }) => virtualrunners,
      (_: Entities, idAssociationMap: T[]) => idAssociationMap,
    ],
    (virtualmarkets, virtualrunners: VirtualRunners, idAssociationMap) =>
      Object.values(idAssociationMap).reduce<MarketRunnerURNAssociation[]>((acc, { selectionId, marketId }) => {
        const market = getVirtualMarketById(virtualmarkets, marketId);

        if (!market) {
          return acc;
        }

        const runnerUrn = market.runners.find((urn) => virtualrunners[urn].selectionId === selectionId);

        if (runnerUrn) {
          acc.push({
            runnerUrn,
            marketUrn: market.urn,
          });
        }
        return acc;
      }, []),
  );
};

export const createGetMarketRunnerURNAssociationSelector = <T extends MarketRunnerIdAssociation>() =>
  createSelector(
    [({ sportsbookmarkets }) => sportsbookmarkets, (_: Entities, idAssociationMap: T[]) => idAssociationMap],
    (sportsbookmarkets, idAssociationMap) =>
      Object.values(idAssociationMap).reduce<MarketRunnerURNAssociation[]>((acc, { selectionId, marketId }) => {
        const market = getSportsbookMarketById(sportsbookmarkets, marketId);

        if (!market) {
          return acc;
        }

        const { runners } = market;
        if (!runners) {
          return acc;
        }

        const runner = getSportsbookMarketRunnerById(runners, selectionId);

        if (runner) {
          acc.push({
            runnerUrn: runner.urn,
            marketUrn: market.urn,
          });
        }
        return acc;
      }, []),
  );

export type AddSelectionByGroup = {
  [groupId: string]: Omit<ADD_SELECTION_PAYLOAD, "group">;
  SIMPLE: Omit<ADD_SELECTION_PAYLOAD, "group">;
};

export const createGetAddSelectionsPayloadSelector = () => {
  const getMarketRunnerURNAssociation = createGetMarketRunnerURNAssociationSelector();

  return createSelector(
    [(entities) => entities, (_: Entities, result: PlaceResult.PlacedBetResults) => result],
    (entities, result) =>
      Object.values(result.legs)
        .filter((leg) => leg.legType !== LEG_TYPES.ONE_LINE_BET)
        .reduce<AddSelectionByGroup>(
          (groupIdMap, leg) => {
            const placedLegRunners = leg.runners.map((runnerId) => result.runners[runnerId]);
            const selections = getMarketRunnerURNAssociation(entities, placedLegRunners);

            if (!leg.isBoosted) {
              return {
                ...groupIdMap,
                SIMPLE: {
                  selections: groupIdMap.SIMPLE.selections.concat(selections),
                },
              };
            }

            if (leg.groupId) {
              const currentSelections = groupIdMap[leg.groupId]?.selections || [];

              return {
                ...groupIdMap,
                [leg.groupId]: {
                  ...groupIdMap[leg.groupId],
                  selections: currentSelections.concat(selections),
                  options: {
                    isBoostedLeg: leg.isBoosted,
                    groupId: leg.groupId,
                  },
                },
              };
            }

            return groupIdMap;
          },
          { SIMPLE: { selections: [] } },
        ),
  );
};

export const createGetVirtualAddSelectionsPayloadSelector = () => {
  const getVirtualMarketRunnerURNAssociation = createGetVirtualMarketRunnerURNAssociationSelector();

  return createSelector(
    [(entities) => entities, (_: Entities, result: PlaceResult.PlacedBetResults) => result],
    (entities, result) => ({
      SIMPLE: {
        selections: getVirtualMarketRunnerURNAssociation(entities, Object.values(result.runners)),
      },
    }),
  );
};

export const createBettingRunnersMetadataSelector = () => {
  const getSportsbookRunner = createSportsbookRunnerByURNSelector();
  const getRaceWithRunnersByURN = createRaceWithRunnersByURNSelector();
  const getGreyhoundRaceRunner = createGreyhoundRaceRunnerByRaceAndSelectionIdSelector();
  const getMeetingByURN = createMeetingByURNSelector();

  return createSelector(
    [
      ({ entities }: ApplicationState) => entities.sportsbookmarkets,
      ({ entities }: ApplicationState) => entities.sportsbookrunners,
      ({ entities }: ApplicationState) => entities.sportevents,
      ({ entities }: ApplicationState) => entities.competitions,
      ({ entities }: ApplicationState) => entities.sports,
      ({ entities }: ApplicationState) => entities,
      ({ entities }: ApplicationState) => entities.meetings,
      ({ betting }: ApplicationState) => betting.sportsbookBetting?.runners,
    ],
    (sportsbookMarkets, sportsbookrunners, sportevents, competitions, sports, entities, meetings, runners) =>
      Object.keys(runners).reduce(
        (bettingRunnersMetadata: RunnersMetadata, bettingRunnerId: string): RunnersMetadata => {
          const bettingRunner = runners[bettingRunnerId];
          const market = getSportsbookMarketById(sportsbookMarkets, bettingRunner.marketId);

          if (!market) {
            return bettingRunnersMetadata;
          }

          const { isOddsboostMarketType } = market;

          if (!market.runners) {
            return bettingRunnersMetadata;
          }

          const runner = getSportsbookMarketRunnerById(market.runners, bettingRunner.selectionId);
          const sport = getSportByURN(sports, market.sport);

          if (!runner || !sport) {
            return bettingRunnersMetadata;
          }

          let previousOdds;

          if (isOddsboostMarketType) {
            const detailedRunner = getSportsbookRunner(sportsbookrunners, runner.urn);
            ({ previousOdds } = detailedRunner || {});
          }

          if (isRaceHierarchy(market.hierarchy)) {
            const { race, raceRunners } = getRaceWithRunnersByURN(entities, market.hierarchy?.race);

            const greyhoundRaceRunner = getGreyhoundRaceRunner(entities, runner.selectionId, race.urn);

            const meeting = getMeetingByURN(meetings, market.hierarchy.meeting);

            if (!race || !meeting) {
              return bettingRunnersMetadata;
            }

            return {
              ...bettingRunnersMetadata,
              [bettingRunnerId]: {
                sportId: sport.sportId,
                sportName: sport.name,
                marketName: market.name,
                marketType: market.marketType,
                guaranteedPriceAvailable: market.guaranteedPriceAvailable,
                marketTypeName: market.marketTypeName,
                is90Min: false,
                isSuperSub: market.isSuperSub,
                runnerName: runner.name,
                runnerUrn: runner.urn,
                bettingGroup: "REAL",
                type: "RACING",
                previousOdds,
                racing: getRacingMetadata(race, meeting, runner.selectionId, raceRunners, greyhoundRaceRunner),
                isOddsboostMarketType,
              },
            };
          }
          const event = getSportEventByURN(sportevents, market.hierarchy.sportevent);
          if (!event) {
            return bettingRunnersMetadata;
          }
          const competition = getCompetitionByURN(competitions, event.competition);

          return {
            ...bettingRunnersMetadata,
            [bettingRunnerId]: {
              sportId: sport.sportId,
              eventUrn: event.urn,
              sportName: sport.name,
              competitionName: competition?.name,
              eventOpenDate: event.openDate,
              eventName: event?.name,
              marketName: market.name,
              marketType: market.marketType,
              guaranteedPriceAvailable: market.guaranteedPriceAvailable,
              marketTypeName: market.marketTypeName,
              is90Min: market.marketType === "MATCH_ODDS_90",
              isSuperSub: market.isSuperSub,
              runnerName: runner.name,
              runnerUrn: runner.urn,
              bettingGroup: "REAL",
              type: "GENERIC",
              previousOdds,
              isOddsboostMarketType,
            },
          };
        },
        {},
      ),
  );
};

export const createVirtualBettingRunnersMetadataSelector = () => {
  const getVirtualMarketById = createVirtualMarketByIdSelector();
  const getVirtualRunnerById = createVirtualRunnerByIdSelector();
  const getVirtualSportByURN = createVirtualSportByURNSelector();
  const getVirtualEventByURN = createVirtualEventByURNSelector();

  return createSelector(
    [
      ({ entities }: ApplicationState) => entities.virtualmarkets,
      ({ entities }: ApplicationState) => entities.virtualrunners,
      ({ entities }: ApplicationState) => entities.virtualevents,
      ({ entities }: ApplicationState) => entities.virtualsports,
      ({ betting }: ApplicationState) => betting.sportsbookBetting?.runners,
    ],
    (virtualmarkets, virtualrunners, virtualevents, virtualsports, runners) =>
      Object.keys(runners).reduce(
        (bettingRunnersMetadata: RunnersMetadata, bettingRunnerId: string): RunnersMetadata => {
          const bettingRunner = runners[bettingRunnerId];
          const market = getVirtualMarketById(virtualmarkets, bettingRunner.marketId);

          if (!market) {
            return bettingRunnersMetadata;
          }

          const runner = getVirtualRunnerById(virtualrunners, bettingRunner.selectionId);
          const sport = getVirtualSportByURN(virtualsports, market.sport);

          if (!runner || !sport) {
            return bettingRunnersMetadata;
          }

          const event = getVirtualEventByURN(virtualevents, market.event);

          if (!event) {
            return bettingRunnersMetadata;
          }

          return {
            ...bettingRunnersMetadata,
            [bettingRunnerId]: {
              sportId: sport.sportId,
              sportName: `virtual:${i18next.t(sport.name.translationKey)}`,
              eventName: event.name,
              eventUrn: event.urn,
              marketName: market.name,
              marketType: market.marketType,
              marketTypeName: null,
              is90Min: false,
              runnerName: runner.name,
              runnerUrn: runner.urn,
              racing: {
                urn: event.urn,
                time: event.openDate,
                venue: event.venue ? event.venue : "",
                saddleCloth: undefined, // TODO: Retrieve saddleCloth
                runnerVisual: undefined, // TODO: Retrieve textures
              },
              type: sport.kind === "RACING" ? "RACING" : "GENERIC",
              bettingGroup: "VIRTUAL",
            },
          };
        },
        {},
      ),
  );
};

/**
 * TypeGuard function to identify if a given data structure is a BaseFixture or not.
 * @param fixture
 * @returns BaseFixture TS type
 */
export function isBaseFixture(fixture: BaseFixture | string): fixture is BaseFixture {
  return typeof fixture !== "string" && fixture?.typename === "BaseFixture";
}

/**
 * Given a URN, this selector will traverse all the existing fixtures (FootballFixture and other to com in the future like "TennisFixture")
 * and return the corresponding fixture entity
 */
export const createFixtureByURNSelector = () => {
  const getAmericanFootballFixtureByURN = createAmericanFootballFixtureByURNSelector();
  const getTennisFixtureByURN = createTennisFixtureByURNSelector();
  const getBaseballFixtureByURN = createBaseballFixtureByURNSelector();
  const getBasketballFixtureByURN = createBasketballFixtureByURNSelector();
  const getCricketFixtureByURN = createCricketFixtureByURNSelector();
  const getTableTennisFixtureByURN = createTableTennisFixtureByURNSelector();
  const getIceHockeyFixtureByURN = createIceHockeyFixtureByURNSelector();
  const getRugbyUnionFixtureByURN = createRugbyUnionFixtureByURNSelector();
  const getRugbyLeagueFixtureByURN = createRugbyLeagueFixtureByURNSelector();
  const getSnookerFixtureByURN = createSnookerFixtureByURNSelector();
  const getVolleyballFixtureByURN = createVolleyballFixtureByURNSelector();
  const getAustralianRulesFixtureByURN = createAustralianRulesFixtureByURNSelector();
  const getDartsFixtureByURN = createDartsFixtureByURNSelector();

  return createSelector(
    [
      (entities: Entities, urn: URN): Fixture => entities.footballfixtures[urn],
      (entities: Entities, urn: URN): Fixture =>
        getAmericanFootballFixtureByURN(entities.americanfootballfixtures, urn),
      (entities: Entities, urn: URN): Fixture => getTennisFixtureByURN(entities.tennisfixtures, urn),
      (entities: Entities, urn: URN): Fixture => getBaseballFixtureByURN(entities.baseballfixtures, urn),
      (entities: Entities, urn: URN): Fixture => getBasketballFixtureByURN(entities.basketballfixtures, urn),
      (entities: Entities, urn: URN): Fixture => getCricketFixtureByURN(entities.cricketfixtures, urn),
      (entities: Entities, urn: URN): Fixture => getTableTennisFixtureByURN(entities.tabletennisfixtures, urn),
      (entities: Entities, urn: URN): Fixture => getIceHockeyFixtureByURN(entities.icehockeyfixtures, urn),
      (entities: Entities, urn: URN): Fixture => getRugbyUnionFixtureByURN(entities.rugbyunionfixtures, urn),
      (entities: Entities, urn: URN): Fixture => getRugbyLeagueFixtureByURN(entities.rugbyleaguefixtures, urn),
      (entities: Entities, urn: URN): Fixture => getSnookerFixtureByURN(entities.snookerfixtures, urn),
      (entities: Entities, urn: URN): Fixture => getVolleyballFixtureByURN(entities.volleyballfixtures, urn),
      (entities: Entities, urn: URN): Fixture => getAustralianRulesFixtureByURN(entities.australianrulesfixtures, urn),
      (entities: Entities, urn: URN): Fixture => getDartsFixtureByURN(entities.dartsfixtures, urn),
    ],
    (
      footballfixture,
      americanfootballfixture,
      tennisfixture,
      baseballfixture,
      basketballfixture,
      cricketfixture,
      tabletennisfixture,
      icehockeyfixture,
      rugbyunionfixture,
      rugbyleaguefixture,
      snookerfixture,
      volleyballfixture,
      australianrulesfixture,
      dartsfixture,
    ) =>
      footballfixture ||
      americanfootballfixture ||
      tennisfixture ||
      baseballfixture ||
      basketballfixture ||
      cricketfixture ||
      tabletennisfixture ||
      icehockeyfixture ||
      rugbyunionfixture ||
      rugbyleaguefixture ||
      snookerfixture ||
      volleyballfixture ||
      australianrulesfixture ||
      dartsfixture ||
      undefined,
  );
};

/**
 * Given a URN, this selector will return the corresponding FootballFixture entity
 */
export const createFootballFixtureByURNSelector = () => {
  return createSelector(
    [(footballfixtures: FootballFixtures, urn: URN): FootballFixture => footballfixtures[urn]],
    (footballfixture) => footballfixture || undefined,
  );
};

/**
 * Given a URN, this selector will return the corresponding FootballPlayerFixtureContext entity
 */
export const createFootballPlayerFixtureContextByURNSelector = () => {
  return createSelector(
    [
      (footballplayerfixturescontext: FootballPlayerFixtureContexts, urn: URN): FootballPlayerFixtureContext =>
        footballplayerfixturescontext[urn],
    ],
    (footballplayerfixturescontext) => footballplayerfixturescontext || undefined,
  );
};

export type SportsbookMarketWithDisplayOdds = SportsbookRunner & { runnerMarket: SportsbookMarket | undefined };

export const createSportsbookRunnerWithOddsAndMarketByURNSelector = () => {
  const getSportsbookMarketByURN = createSportsbookMarketByURNSelector();
  const getSportsbookRunnerByURN = createSportsbookRunnerByURNSelector();

  return createShallowEqualSelector(
    [
      (entities: Entities, urn: URN): SportsbookRunner | undefined =>
        getSportsbookRunnerByURN(entities.sportsbookrunners, urn),
      (entities: Entities, urn: URN): SportsbookMarket | undefined => {
        const sbkRunnerWithOdds = getSportsbookRunnerByURN(entities.sportsbookrunners, urn);

        if (sbkRunnerWithOdds) {
          return getSportsbookMarketByURN(entities.sportsbookmarkets, sbkRunnerWithOdds.market);
        }

        return undefined;
      },
    ],
    (sbkRunnerWithOdds, sportsbookMarket): SportsbookMarketWithDisplayOdds | undefined => {
      if (sbkRunnerWithOdds) {
        return {
          ...sbkRunnerWithOdds,
          runnerMarket: sportsbookMarket,
        };
      }

      return undefined;
    },
  );
};

type WalletsAvailability = {
  freeBetsBalance: number;
  areGenerosityTokensAvailable: boolean;
};

/**
 * createGetFreeBetsBonusAmountSelector
 *
 * Calculate the total free bets amount between products
 * If user is SBK only - show sbk bonus
 * If user is EXC only - show exc bonus
 * If user is EXC & SBK - show the summary of the bonuses
 * TODO: Update getUserWallets, getPreferences to receive Entities instead of the ApplicationState
 */
export const createGetWalletsAvailabilitySelector = () => {
  const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();

  return createSelector(
    [
      (state: ApplicationState): UserWallets => getUserWallets(state),
      (state: ApplicationState): UserPreferences => getUserPreferencesWithProductSwitcher(state.entities.preferences),
    ],
    (wallets, preferences): WalletsAvailability => {
      if (!(wallets && preferences)) {
        return {
          freeBetsBalance: 0,
          areGenerosityTokensAvailable: false,
        };
      }
      const { SPORTSBOOK_BONUS, EXCHANGE_BONUS_CASH, ACCA_INSURANCE_TOKENS, BOOST_TOKENS, MONEY_BACK_TOKENS } = wallets;
      const { products } = preferences;
      let freeBetsBalance = 0;

      if (products?.includes(ProductsOption.sportsbook) && SPORTSBOOK_BONUS?.amount) {
        freeBetsBalance = SPORTSBOOK_BONUS.amount;
      }

      if (products?.includes(ProductsOption.exchange) && EXCHANGE_BONUS_CASH?.amount) {
        freeBetsBalance += EXCHANGE_BONUS_CASH.amount;
      }

      return {
        freeBetsBalance,
        areGenerosityTokensAvailable:
          !!BOOST_TOKENS?.amount || !!ACCA_INSURANCE_TOKENS?.amount || !!MONEY_BACK_TOKENS?.amount,
      };
    },
  );
};

/**
 * createGetExchangeDefaultProductSelector
 *
 * Get the exchangeDefaultProduct
 *
 */
export const createGetExchangeDefaultProductSelector = () => {
  const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();

  return createSelector(
    [(state: ApplicationState): UserPreferences => getUserPreferencesWithProductSwitcher(state.entities.preferences)],
    (preferences): ExchangeDefaultProductOption | null => {
      if (!preferences) return null;

      const { exchangeDefaultProduct } = preferences;

      if (!exchangeDefaultProduct) {
        return ExchangeDefaultProductOption.default;
      }

      return exchangeDefaultProduct as ExchangeDefaultProductOption;
    },
  );
};

function isGreyhoundRaceRunner(raceRunner: GreyhoundRaceRunner | RaceRunner): raceRunner is GreyhoundRaceRunner {
  return raceRunner.typename === "GreyhoundRaceRunner";
}

type RichContent = {
  greyhoundRaceRunner?: Pick<GreyhoundRaceRunner, "trap" | "urn"> & { meetingCountry?: string };
  horseRaceRunner?: RaceRunner;
};

/**
 * createSbkMarketRunnerWithRichContentByMarketAndRunnerURNSelector
 * For a given marketURN, runnerURN returns
 *  - undefined if there is no runner with runnerURN on market with marketURN
 *  - or marketRunner,enriched with rich content (if applicable)
 * */
type SBKRunnerWithRichContentSelectorProps = { marketUrn: URN; runnerUrn: URN; sportId?: number };
export type SBKRunnerWithRichContent = MarketRunner & { richContent?: RichContent };
const createSbkMarketRunnerWithRichContentByMarketAndRunnerURNSelector = () => {
  const getSbkMarket = createSportsbookMarketByURNSelector();
  const getSBKMarketRunnerByMarketAndRunnerURN = createSportsbookMarketRunnerByRunnerAndMarketURNSelector();
  const getRaceWithRunnersByURN = createRaceWithRunnersByURNSelector();
  const getGreyhoundRaceRunnersByRaceURN = createGreyhoundRaceRunnersByRaceURNSelector();
  const getMeetingByURN = createMeetingByURNSelector();
  return createSelector(
    [
      (entities: Entities, { marketUrn, runnerUrn }: SBKRunnerWithRichContentSelectorProps) =>
        getSBKMarketRunnerByMarketAndRunnerURN(entities.sportsbookmarkets, { marketUrn, runnerUrn }),
      (entities: Entities, { marketUrn, sportId }: SBKRunnerWithRichContentSelectorProps) => {
        const market = getSbkMarket(entities.sportsbookmarkets, marketUrn);

        if (market && isRaceHierarchy(market.hierarchy) && sportId) {
          if (RacingSport.HORSE_RACING === sportId) {
            const { raceRunners } = getRaceWithRunnersByURN(entities, market.hierarchy.race);

            return raceRunners;
          }
          if (RacingSport.GREYHOUND_RACING === sportId) {
            return getGreyhoundRaceRunnersByRaceURN(entities, market.hierarchy.race);
          }
        }
        return undefined;
      },
      (entities: Entities, { marketUrn }: SBKRunnerWithRichContentSelectorProps) => {
        const market = getSbkMarket(entities.sportsbookmarkets, marketUrn);

        return market && isRaceHierarchy(market.hierarchy)
          ? getMeetingByURN(entities.meetings, market.hierarchy.meeting)
          : undefined;
      },
    ],
    (marketRunner, raceRunners, meeting): SBKRunnerWithRichContent | undefined => {
      if (marketRunner && raceRunners) {
        const raceRunner: GreyhoundRaceRunner | RaceRunner | undefined = Object.values(raceRunners).find(
          (runner) => runner.selectionId === marketRunner.selectionId,
        );

        if (raceRunner && isGreyhoundRaceRunner(raceRunner)) {
          return {
            ...marketRunner,
            richContent: {
              greyhoundRaceRunner: {
                urn: raceRunner.urn,
                trap: raceRunner.trap,
                meetingCountry: meeting?.country,
              },
            },
          };
        }
        if (raceRunner && !isGreyhoundRaceRunner(raceRunner)) {
          return {
            ...marketRunner,
            richContent: {
              horseRaceRunner: {
                ...raceRunner,
              },
            },
          };
        }
      }
      return marketRunner;
    },
  );
};

/**
 * createSBKRunnerWithRichContentAndStatusByMarketAndRunnnerURNSelector
 * For a given marketURN, runnerURN returns
 *  - undefined if there is no runner with runnerURN in the provided marketURN
 *  - or the corresponding hydrated runners with rich content and runner status:
 *    - marketRunnerWithRichContent: the runner with rich content (runner + live data + rich content, if available)
 *    - status: the runner status
 */
export type SBKRunnerWithRichContentAndStatus = SBKRunnerWithRichContent & { status?: SportsbookRunnerStatus };
export const createSBKRunnerWithRichContentAndStatusByMarketAndRunnnerURNSelector = () => {
  const getSbkMarketRunnerWithRichContentByMarketAndRunnerURN =
    createSbkMarketRunnerWithRichContentByMarketAndRunnerURNSelector();
  const getSBKRunnerStatusByRunnerURN = createSportsbookRunnerStatusSelector();

  return createSelector(
    [
      (entities: Entities, { marketUrn, runnerUrn, sportId }: SBKRunnerWithRichContentSelectorProps) =>
        getSbkMarketRunnerWithRichContentByMarketAndRunnerURN(entities, { marketUrn, runnerUrn, sportId }),
      (entities: Entities, { runnerUrn }: SBKRunnerWithRichContentSelectorProps) =>
        getSBKRunnerStatusByRunnerURN(entities.sportsbookrunners, runnerUrn),
    ],
    (marketRunnerWithRichContent, runnerStatus) => {
      if (marketRunnerWithRichContent) {
        return {
          ...marketRunnerWithRichContent,
          status: runnerStatus,
        };
      }

      return undefined;
    },
  );
};

/**
 * createSbkMarketRunnerWithRichContentByMarketAndRunnerURNSelector
 * For a given marketURN, runnerURN returns
 *  - undefined if there is no runner with runnerURN on market with marketURN
 *  - or marketRunner,enriched with rich content (if applicable)
 * */
type RichContentExcRunnerSelectorProps = {
  marketURN: URN;
  runnerURN: URN;
};
type RichContentExcRunner = MarketRunner & { raceRunner?: RaceRunner };

export const createRichContentExcRunnerByMarketAndRunnerURNSelector = () => {
  const getExchangeMarket = createExchangeMarketSelector();
  const getExchangeMarketRunnerByMarketAndRunnerURNs = createExchangeMarketRunnerByMarketAndRunnerURNsSelector();
  const getRaceWithRunnersByURN = createRaceWithRunnersByURNSelector();

  return createSelector(
    [
      (entities: Entities, { marketURN, runnerURN }: RichContentExcRunnerSelectorProps) =>
        getExchangeMarketRunnerByMarketAndRunnerURNs(entities.exchangemarkets, { marketURN, runnerURN }),
      (entities: Entities, { marketURN }: RichContentExcRunnerSelectorProps) => {
        const market = getExchangeMarket(entities.exchangemarkets, marketURN);

        if (market && isRaceHierarchy(market.hierarchy)) {
          const { raceRunners } = getRaceWithRunnersByURN(entities, market.hierarchy.race);

          return raceRunners;
        }
        return undefined;
      },
    ],
    (marketRunner, raceRunners): RichContentExcRunner | undefined => {
      if (marketRunner && raceRunners) {
        const raceRunner = Object.values(raceRunners).find((runner) => runner.selectionId === marketRunner.selectionId);

        if (raceRunner) {
          return {
            ...marketRunner,
            raceRunner,
          };
        }
      }
      return marketRunner;
    },
  );
};

/**
 * createSBKRunnerWithRichContentAndStatusByMarketAndRunnnerURNSelector
 * For a given marketURN, runnerURN returns
 *  - undefined if there is no runner with runnerURN in the provided marketURN
 *  - or the corresponding hydrated runners with rich content and runner status:
 *    - marketRunnerWithRichContent: the runner with rich content (runner + live data + rich content, if available)
 *    - status: the runner status
 */
export type RichContentExcRunnerAndPNL = RichContentExcRunner & {
  status?: ExchangeRunnerStatus;
  date?: string | null;
  reduction?: number | null;
} & {
  runnerPosition: RunnerPosition | undefined;
};

export const createRichContentExcRunnerWithPNLByMarketAndRunnerURNSelector = () => {
  const getExchangeMarketRunnerWithRichContentByMarketAndRunnerURNs =
    createRichContentExcRunnerByMarketAndRunnerURNSelector();
  const getBettingMarketRunnersPositionByMarketURN = createBettingMarketRunnersPositionSelector();
  const getExchangeRunnerWithoutOddsByRunnerURN = createExchangeRunnerWithoutOddsByRunnerURNSelector();

  return createSelector(
    [
      (state: ApplicationState, { marketURN, runnerURN }: RichContentExcRunnerSelectorProps) =>
        getExchangeMarketRunnerWithRichContentByMarketAndRunnerURNs(state.entities, { marketURN, runnerURN }),
      (state: ApplicationState, { marketURN }: RichContentExcRunnerSelectorProps) =>
        getBettingMarketRunnersPositionByMarketURN(state.betting.exchangeBetting, marketURN),
      (state: ApplicationState, { runnerURN }: RichContentExcRunnerSelectorProps) =>
        getExchangeRunnerWithoutOddsByRunnerURN(state.entities.exchangerunners, runnerURN),
    ],
    (
      marketRunnerWithRichContent,
      marketRunnerPositions,
      exchangeRunnerWithoutOdds,
    ): RichContentExcRunnerAndPNL | undefined => {
      if (!marketRunnerWithRichContent) {
        return undefined;
      }

      const runnerPosition = marketRunnerPositions?.find(
        (position) =>
          position.selectionId === marketRunnerWithRichContent.selectionId &&
          position.handicap === marketRunnerWithRichContent.handicap,
      );

      const { status, date, reduction } = exchangeRunnerWithoutOdds || {};

      return {
        ...marketRunnerWithRichContent,
        runnerPosition,
        status,
        date,
        reduction,
      };
    },
  );
};

export const getExchangeRunnerTree = (entities: Entities, runner: URN): ExchangeRunnerTree | null => {
  const getExchangeMarketByURN = createExchangeMarketSelector();
  const { exchangerunners, exchangemarkets, sportevents, sports } = entities;
  const exchangeRunner = getExchangeRunnerByURN(exchangerunners, runner);

  if (!exchangeRunner) {
    return null;
  }

  const market = getExchangeMarketByURN(exchangemarkets, exchangeRunner.market);

  if (!market) {
    return null;
  }

  const exchangeMarketRunner = getExchangeMarketRunnerByURN(market, runner);

  if (!exchangeMarketRunner) {
    return null;
  }

  const sport = getSportByURN(sports, market.sport);

  if (!sport) {
    return null;
  }

  if (isRaceHierarchy(market.hierarchy)) {
    const getRaceWithRunnersByUrn = createRaceWithRunnersByURNSelector();
    const getMeetingByUrn = createMeetingByURNSelector();
    const extractedRace = isRaceHierarchy(market.hierarchy)
      ? getRaceWithRunnersByUrn(entities, market?.hierarchy?.race)
      : undefined;
    const meeting = isRaceHierarchy(market.hierarchy)
      ? getMeetingByUrn(entities.meetings, market?.hierarchy?.meeting)
      : undefined;

    if (!extractedRace || !meeting) {
      return null;
    }

    return {
      type: "RACING",
      runner: exchangeRunner,
      marketRunner: exchangeMarketRunner,
      market,
      sport,
      race: extractedRace?.race,
      raceRunners: extractedRace?.raceRunners,
      meeting,
    };
  }

  const event = getSportEventByURN(sportevents, market.hierarchy.sportevent);
  if (!event) {
    return null;
  }

  return {
    type: "GENERIC",
    runner: exchangeRunner,
    marketRunner: exchangeMarketRunner,
    market,
    event,
    sport,
  };
};

type PotentialBetWithPNL = PotentialBet & {
  pnl?: {
    win?: number;
    lose?: number;
  };
};
const arePotentialBetsEqual: (
  potentialBets: PotentialBet[] | undefined,
  updatedPotentialBets: PotentialBet[] | undefined,
) => boolean = (potentialBets, updatedPotentialBets) => {
  if (potentialBets === updatedPotentialBets) {
    return true;
  }
  if (potentialBets === undefined || updatedPotentialBets === undefined) {
    return false;
  }

  if (potentialBets.length !== updatedPotentialBets.length) {
    return false;
  }

  for (let i = 0; i < potentialBets.length; i += 1) {
    const potentialBet: PotentialBetWithPNL = { ...potentialBets[i] };
    const updatedPotentialBet: PotentialBetWithPNL = { ...updatedPotentialBets[i] };

    if (!shallowEqual(potentialBet.pnl, updatedPotentialBet.pnl)) {
      return false;
    }

    delete potentialBet.pnl;
    delete updatedPotentialBet.pnl;
    if (!shallowEqual(potentialBet, updatedPotentialBet)) {
      return false;
    }
  }

  return true;
};

export const createExcRunnerPotentialBetsByRunnerURNSelector = () => {
  const getMarketPotentialBets = createMarketPotentialBetsSelector();

  return createSelectorCreator(defaultMemoize, arePotentialBetsEqual)(
    [
      (state: ApplicationState, urn: URN) => {
        const runnerTree = getExchangeRunnerTree(state.entities, urn);
        if (!runnerTree?.market) {
          return undefined;
        }
        const marketPotentialBets = getMarketPotentialBets(state.betting.exchangeBetting, runnerTree.market.urn);

        if (!marketPotentialBets) {
          return undefined;
        }
        return marketPotentialBets.filter(
          (bet: PotentialBet) =>
            bet.selectionId === runnerTree.marketRunner.selectionId &&
            bet.handicap === runnerTree.marketRunner.handicap,
        );
      },
    ],
    (potentialBets) => potentialBets || [],
  );
};

export const createFixtureBySportEventURNSelector = (): ParametricSelector<Entities, URN, Fixture> => {
  const getFixtureByURN = createFixtureByURNSelector();

  return createSelector(
    [(entities: Entities) => entities, (_: Entities, urn: URN) => urn],
    (entities, urn): Fixture => {
      const sportEvent = getSportEventByURN(entities.sportevents, urn);

      if (!sportEvent?.eventId) {
        return undefined;
      }

      const fixtureUrn = codecs.fixture.encode(sportEvent.eventId.toString()).uid;

      return getFixtureByURN(entities, fixtureUrn);
    },
  );
};

export function createEntityByURNSelector<S, K extends keyof S>(): ParametricSelector<S, K, S[K] | null> {
  return createSelector(
    [(stateSlice: S) => stateSlice, (_: S, urn: K) => urn],
    (entities, urn): S[K] | null => entities?.[urn] ?? null,
  );
}
