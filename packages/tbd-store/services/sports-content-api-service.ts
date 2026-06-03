import { codecs } from "@ppb/tbd-urn-codecs";
import URN from "../state/layout/URN";
import SportsContentAPI from "../clients/sca/sports-content-api-client";
import {
  FootballFixtureUpdatesResult,
  mapFootballFixtureUpdates,
  TennisFixtureUpdatesResult,
  mapTennisFixtureUpdates,
  BaseballFixtureUpdatesResult,
  mapBaseballFixtureUpdates,
  BasketballFixtureUpdatesResult,
  mapBasketballFixtureUpdates,
  AmericanFootballFixtureUpdatesResult,
  mapAmericanFootballFixtureUpdates,
  mapRacesStatusAndResultTypeUpdates,
  RaceStatusAndResultTypeUpdatesResult,
  CricketFixtureUpdatesResult,
  mapCricketFixtureUpdates,
  TableTennisFixtureUpdatesResult,
  mapTableTennisFixtureUpdates,
  IceHockeyFixtureUpdatesResult,
  mapIceHockeyFixtureUpdates,
  RugbyUnionFixtureUpdatesResult,
  mapRugbyUnionFixtureUpdates,
  RugbyLeagueFixtureUpdatesResult,
  mapRugbyLeagueFixtureUpdates,
  SnookerFixtureUpdatesResult,
  mapSnookerFixtureUpdates,
  VolleyballFixtureUpdatesResult,
  mapVolleyballFixtureUpdates,
  AustralianRulesFixtureUpdatesResult,
  mapAustralianRulesFixtureUpdates,
  DartsFixtureUpdatesResult,
  mapDartsFixtureUpdates,
} from "./sports-content-api-service-mapper";
import { createClientFactory } from "./client-factory";

type DecodeEventIdsFromFixtureUrnArgs = {
  urns: URN[];
  isRace?: boolean;
};

function decodeEventIdsFromFixtureUrn({ urns, isRace }: DecodeEventIdsFromFixtureUrnArgs): string[] {
  const decode = isRace ? codecs.race.decode : codecs.fixture.decode;
  return urns.map((urn) => decode(urn)).filter((val): val is string => !!val);
}

const sportsContentAPIClientFactory = createClientFactory(SportsContentAPI);

export type ScaUpdatesResult = {
  fixtures: {
    baseball: BaseballFixtureUpdatesResult;
    basketball: BasketballFixtureUpdatesResult;
    cricket: CricketFixtureUpdatesResult;
    darts: DartsFixtureUpdatesResult;
    football: FootballFixtureUpdatesResult;
    tabletennis: TableTennisFixtureUpdatesResult;
    tennis: TennisFixtureUpdatesResult;
    icehockey: IceHockeyFixtureUpdatesResult;
    americanfootball: AmericanFootballFixtureUpdatesResult;
    rugbyunion: RugbyUnionFixtureUpdatesResult;
    rugbyleague: RugbyLeagueFixtureUpdatesResult;
    snooker: SnookerFixtureUpdatesResult;
    volleyball: VolleyballFixtureUpdatesResult;
    australianrules: AustralianRulesFixtureUpdatesResult;
  };
  racesStatusAndResultType: RaceStatusAndResultTypeUpdatesResult;
};

type SportFixtureUrns = {
  baseballUrns: URN[];
  basketballUrns: URN[];
  cricketUrns: URN[];
  dartsUrns: URN[];
  footballUrns: URN[];
  rugbyUnionUrns: URN[];
  rugbyLeagueUrns: URN[];
  volleyballUrns: URN[];
  raceUrns: URN[];
  tableTennisUrns: URN[];
  tennisUrns: URN[];
  iceHockeyUrns: URN[];
  americanFootballUrns: URN[];
  snookerUrns: URN[];
  australianRulesUrns: URN[];
  isLite: boolean;
  includeStats: boolean;
  includePlayers: boolean;
  footballPlayerIds: string[];
  includePlayerStats: boolean;
  includeSubstitutions: boolean;
};

export default {
  async getScaUpdates({
    baseballUrns,
    basketballUrns,
    cricketUrns,
    dartsUrns,
    footballUrns,
    raceUrns,
    rugbyUnionUrns,
    rugbyLeagueUrns,
    volleyballUrns,
    tableTennisUrns,
    tennisUrns,
    iceHockeyUrns,
    americanFootballUrns,
    snookerUrns,
    australianRulesUrns,
    isLite,
    includeStats,
    includePlayers,
    footballPlayerIds,
    includePlayerStats,
    includeSubstitutions,
  }: SportFixtureUrns): Promise<ScaUpdatesResult> {
    const baseballEventIds = decodeEventIdsFromFixtureUrn({ urns: baseballUrns });
    const basketballEventIds = decodeEventIdsFromFixtureUrn({ urns: basketballUrns });
    const cricketEventIds = decodeEventIdsFromFixtureUrn({ urns: cricketUrns });
    const dartsEventIds = decodeEventIdsFromFixtureUrn({ urns: dartsUrns });
    const footballEventIds = decodeEventIdsFromFixtureUrn({ urns: footballUrns });
    const raceIds = decodeEventIdsFromFixtureUrn({ urns: raceUrns, isRace: true });
    const tableTennisEventIds = decodeEventIdsFromFixtureUrn({ urns: tableTennisUrns });
    const tennisEventIds = decodeEventIdsFromFixtureUrn({ urns: tennisUrns });
    const iceHockeyEventIds = decodeEventIdsFromFixtureUrn({ urns: iceHockeyUrns });
    const americanFootballEventIds = decodeEventIdsFromFixtureUrn({ urns: americanFootballUrns });
    const rugbyUnionEventIds = decodeEventIdsFromFixtureUrn({ urns: rugbyUnionUrns });
    const rugbyLeagueEventIds = decodeEventIdsFromFixtureUrn({ urns: rugbyLeagueUrns });
    const snookerEventIds = decodeEventIdsFromFixtureUrn({ urns: snookerUrns });
    const volleyballEventIds = decodeEventIdsFromFixtureUrn({ urns: volleyballUrns });
    const australianRulesEventIds = decodeEventIdsFromFixtureUrn({ urns: australianRulesUrns });

    const sportsContentAPIClient = sportsContentAPIClientFactory("SCA");

    const scaUpdates = await sportsContentAPIClient.getScaUpdates({
      basketballEventIds,
      baseballEventIds,
      cricketEventIds,
      dartsEventIds,
      footballEventIds,
      raceIds,
      tableTennisEventIds,
      tennisEventIds,
      iceHockeyEventIds,
      americanFootballEventIds,
      rugbyUnionEventIds,
      rugbyLeagueEventIds,
      snookerEventIds,
      volleyballEventIds,
      australianRulesEventIds,
      isLite,
      includeStats,
      includePlayers,
      footballPlayerIds,
      includePlayerStats,
      includeSubstitutions,
    });

    return {
      fixtures: {
        baseball: mapBaseballFixtureUpdates(scaUpdates),
        basketball: mapBasketballFixtureUpdates(scaUpdates),
        cricket: mapCricketFixtureUpdates(scaUpdates),
        darts: mapDartsFixtureUpdates(scaUpdates),
        football: mapFootballFixtureUpdates(scaUpdates),
        tabletennis: mapTableTennisFixtureUpdates(scaUpdates),
        tennis: mapTennisFixtureUpdates(scaUpdates),
        icehockey: mapIceHockeyFixtureUpdates(scaUpdates),
        americanfootball: mapAmericanFootballFixtureUpdates(scaUpdates),
        rugbyunion: mapRugbyUnionFixtureUpdates(scaUpdates),
        rugbyleague: mapRugbyLeagueFixtureUpdates(scaUpdates),
        snooker: mapSnookerFixtureUpdates(scaUpdates),
        volleyball: mapVolleyballFixtureUpdates(scaUpdates),
        australianrules: mapAustralianRulesFixtureUpdates(scaUpdates),
      },
      racesStatusAndResultType: mapRacesStatusAndResultTypeUpdates(scaUpdates),
    };
  },
};
