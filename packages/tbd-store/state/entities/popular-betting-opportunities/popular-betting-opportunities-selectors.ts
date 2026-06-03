import { createSelectorCreator, defaultMemoize } from "reselect";
import { PopularBettingOpportunities, PopularBettingOpportunity } from "./PopularBettingOpportunity.types";

import { SportEvent, Meeting, SportsbookMarket, MarketRunner, Race, type SportsbookRunner } from "../index";
import { ApplicationState } from "../../ApplicationState.types";
import { createMeetingByURNSelector } from "../meetings/meeting-selectors";
import { createRaceByURNSelector } from "../races/race-selectors";
import { createEntityByURNSelector } from "../entities-selectors";
import { createSportsbookMarketByURNSelector } from "../sportsbook-markets/sportsbook-market-selectors";
import { isRaceHierarchy } from "../../../helpers/markets";
import { createSportEventByURNSelector } from "../sport-events/sport-event-selectors";
import URN from "../../layout/URN";

// This component never updates so we can check only URN
const isEqual = (prev: PopularBettingOpportunity, next: PopularBettingOpportunity): boolean => prev?.urn === next?.urn;

type OportunitySelection = {
  runner: MarketRunner;
  market: SportsbookMarket;
};

export type RacingOportunitySelection = {
  meeting: Meeting;
  race: Race;
  silkUrl?: string;
  jockeyName?: string;
  trainerName?: string;
} & OportunitySelection;

export type AvBOportunitySelection = {
  sportEvent: SportEvent;
} & OportunitySelection;

export type PopularBettingOpportunityHydrated = Omit<PopularBettingOpportunity, "typename"> & {
  items: (RacingOportunitySelection | AvBOportunitySelection)[];
};

export const createPopularBettingOpportunityHydratedSelector = () => {
  const getBettingOpportunityByURN = createEntityByURNSelector<PopularBettingOpportunities, URN>();
  const getSportsbookMarketByURN = createSportsbookMarketByURNSelector();
  const getSportEventByURN = createSportEventByURNSelector();
  const getMeetingByURN = createMeetingByURNSelector();
  const getRaceByURN = createRaceByURNSelector();

  return createSelectorCreator(defaultMemoize, isEqual)(
    (state: ApplicationState) => state.entities.sportsbookmarkets,
    (state: ApplicationState) => state.entities.races,
    (state: ApplicationState) => state.entities.meetings,
    (state: ApplicationState) => state.entities.sportevents,
    (state: ApplicationState, urn: URN) => getBettingOpportunityByURN(state.entities.popularbettingopportunities, urn),
    (sportsbookmarkets, races, meetings, sportevents, bettingOpportunity): PopularBettingOpportunityHydrated | null => {
      if (!bettingOpportunity) {
        return null;
      }

      return {
        urn: bettingOpportunity.urn,
        id: bettingOpportunity.id,
        selections: bettingOpportunity.selections,
        count: bettingOpportunity.count,
        name: bettingOpportunity.name,
        type: bettingOpportunity.type,
        items: bettingOpportunity.selections.reduce<(RacingOportunitySelection | AvBOportunitySelection)[]>(
          (acc, selection) => {
            const market = getSportsbookMarketByURN(sportsbookmarkets, selection.marketUrn);
            const runner = market?.runners.find((r) => r.urn === selection.runnerUrn);

            if (market && runner) {
              if (isRaceHierarchy(market.hierarchy)) {
                const race = getRaceByURN(races, market.hierarchy.race);
                const meeting = getMeetingByURN(meetings, market.hierarchy.meeting);

                acc.push({
                  runner,
                  market,
                  meeting,
                  race,
                  silkUrl: selection.silkUrl,
                  jockeyName: selection.jockeyName,
                  trainerName: selection.trainerName,
                });
              } else {
                const sportEvent = getSportEventByURN(sportevents, market.hierarchy.sportevent);
                if (sportEvent) {
                  acc.push({
                    runner,
                    market,
                    sportEvent,
                  });
                }
              }
            }

            return acc;
          },
          [],
        ),
      };
    },
  );
};

const hasSameOdd = (prev?: SportsbookRunner, next?: SportsbookRunner): boolean => {
  if (!prev || !next || prev.urn !== next.urn || !prev.odds || !next.odds) return false;

  return prev.odds.decimal === next.odds.decimal;
};

export const createOddByRunnerUrnSelector = () =>
  createSelectorCreator(defaultMemoize, hasSameOdd)(
    (state: ApplicationState, urn: URN) => state.entities.sportsbookrunners[urn],
    (runner) => runner?.odds,
  );
