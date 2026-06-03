import URN from "../state/layout/URN";
import scaService, { ScaUpdatesResult } from "../services/sports-content-api-service";
import { getInterval } from "../config";
import {
  AmericanFootballFixtureUpdatesResult,
  BaseballFixtureUpdatesResult,
  BasketballFixtureUpdatesResult,
  CricketFixtureUpdatesResult,
  DartsFixtureUpdatesResult,
  FootballFixtureUpdatesResult,
  IceHockeyFixtureUpdatesResult,
  RaceStatusAndResultTypeUpdatesResult,
  RugbyUnionFixtureUpdatesResult,
  RugbyLeagueFixtureUpdatesResult,
  VolleyballFixtureUpdatesResult,
  TableTennisFixtureUpdatesResult,
  TennisFixtureUpdatesResult,
  SnookerFixtureUpdatesResult,
  AustralianRulesFixtureUpdatesResult,
} from "../services/sports-content-api-service-mapper";
import HttpPollerObservable from "./http-poller/http-poller-observable";

/** ***************************************************************************************
 *                                                                                        *
 *                         RichContentUpdatesObservable                                   *
 *                                                                                        *
 *  https://github.com/Flutter-Global/tbd/blob/master/docs/rich-content-live-updates.md   *
 **************************************************************************************** */

type AddToPoolParams = {
  urn: URN;
  typename: string;
  isLite?: boolean;
  includeStats?: boolean;
  includePlayers?: boolean;
  footballPlayerIds?: string[];
  includePlayerStats?: boolean;
  includeSubstitutions?: boolean;
};

export type RichContentUpdateCallbackPayload = {
  updates?: ScaUpdatesResult;
  error?: string;
  inplay?: boolean;
};

type PoolMetadata = {
  typename: string;
  count: number;
  isLite: boolean;
  includeStats: boolean;
  includePlayers: boolean;
  footballPlayerIds?: string[];
  includePlayerStats: boolean;
  includeSubstitutions: boolean;
};

export default class RichContentUpdatesObservable extends HttpPollerObservable<
  PoolMetadata,
  RichContentUpdateCallbackPayload
> {
  private static instance: RichContentUpdatesObservable;

  private inPlay = false;

  public static getInstance(): RichContentUpdatesObservable {
    if (!RichContentUpdatesObservable.instance) {
      const defaultPollInterval = getInterval("SCA", { inPlay: false });

      RichContentUpdatesObservable.instance = new RichContentUpdatesObservable(defaultPollInterval);
    }
    return RichContentUpdatesObservable.instance;
  }

  private static isInPlay({ fixtures, racesStatusAndResultType }: ScaUpdatesResult): boolean {
    function isAmericanFootballFixtureInPlay(americanFootballFixtures: AmericanFootballFixtureUpdatesResult): boolean {
      const inPlayStatus =
        americanFootballFixtures &&
        !!Object.values(americanFootballFixtures).find((fixture) => {
          switch (fixture.clock?.period) {
            case "PERIOD_1":
            case "END_PERIOD_1":
            case "PERIOD_2":
            case "END_PERIOD_2":
            case "PERIOD_3":
            case "END_PERIOD_3":
            case "PERIOD_4":
            case "END_PERIOD_4":
            case "OVERTIME":
            case "END_OVERTIME":
              return true;
            default:
              return false;
          }
        });

      return inPlayStatus || false;
    }

    function isBaseballFixtureInPlay(baseballFixtures: BaseballFixtureUpdatesResult): boolean {
      const inPlayStatus =
        baseballFixtures &&
        !!Object.values(baseballFixtures).find((fixture) => {
          switch (fixture.clock?.period) {
            case "INNING_1":
            case "INNING_2":
            case "INNING_3":
            case "INNING_4":
            case "INNING_5":
            case "INNING_6":
            case "INNING_7":
            case "INNING_8":
            case "INNING_9":
            case "EXTRA_INNINGS":
              return true;
            default:
              return false;
          }
        });

      return inPlayStatus || false;
    }

    function isBasketballFixtureInPlay(basketballFixtures: BasketballFixtureUpdatesResult): boolean {
      const inPlayStatus =
        basketballFixtures &&
        !!Object.values(basketballFixtures).find((fixture) => {
          switch (fixture.clock?.period) {
            case "PERIOD_1":
            case "END_PERIOD_1":
            case "PERIOD_2":
            case "END_PERIOD_2":
            case "PERIOD_3":
            case "END_PERIOD_3":
            case "PERIOD_4":
            case "END_PERIOD_4":
            case "OVERTIME":
            case "END_OVERTIME":
              return true;
            default:
              return false;
          }
        });

      return inPlayStatus || false;
    }

    function isFootballFixtureInPlay(footballFixtures: FootballFixtureUpdatesResult): boolean {
      const inPlayStatus =
        footballFixtures &&
        !!Object.values(footballFixtures).find((fixture) => {
          switch (fixture.duration?.status) {
            case "INPLAY_FIRST_HALF":
            case "INPLAY_SECOND_HALF":
            case "PENALTY_SHOOTOUT":
              return true;
            default:
              return false;
          }
        });

      return inPlayStatus || false;
    }

    function isTennisFixtureInPlay(tenninsFixtures: TennisFixtureUpdatesResult): boolean {
      const inPlayStatus =
        tenninsFixtures &&
        !!Object.values(tenninsFixtures).find((fixture) => {
          switch (fixture.status?.status) {
            case "INTERRUPTED":
            case "IN_RUNNING":
              return true;
            default:
              return false;
          }
        });

      return inPlayStatus || false;
    }

    function isTableTennisFixtureInPlay(tableTennisFixtures: TableTennisFixtureUpdatesResult): boolean {
      const inPlayStatus =
        tableTennisFixtures &&
        !!Object.values(tableTennisFixtures).find((fixture) => {
          if (fixture.currentSet?.score) {
            return true;
          }
          return false;
        });

      return inPlayStatus || false;
    }

    function isCricketFixtureInPlay(cricketFixtures: CricketFixtureUpdatesResult): boolean {
      const inPlayStatus =
        cricketFixtures &&
        !!Object.values(cricketFixtures).find((fixture) => {
          if (fixture.currentTime) {
            return true;
          }
          return false;
        });

      return inPlayStatus || false;
    }

    function isRaceInPlay(races: RaceStatusAndResultTypeUpdatesResult): boolean {
      const inPlayStatus =
        races &&
        !!Object.values(races).find((race) => {
          switch (race.status) {
            case "AT_THE_POST":
            case "GOING_BEHIND":
            case "OFF":
              return true;
            default:
              return false;
          }
        });

      return inPlayStatus || false;
    }

    function isIceHockeyFixtureInPlay(iceHockeyFixtures: IceHockeyFixtureUpdatesResult): boolean {
      const inPlayStatus =
        iceHockeyFixtures &&
        !!Object.values(iceHockeyFixtures).find((fixture) => {
          switch (fixture.clock?.period) {
            case "PERIOD_1":
            case "END_PERIOD_1":
            case "PERIOD_2":
            case "END_PERIOD_2":
            case "PERIOD_3":
            case "END_PERIOD_3":
            case "PENALTIES":
            case "OVERTIME":
            case "END_OVERTIME":
              return true;
            default:
              return false;
          }
        });

      return inPlayStatus || false;
    }

    function isRugbyUnionFixtureInPlay(rugbyUnionFixtures: RugbyUnionFixtureUpdatesResult): boolean {
      const inPlayStatus =
        rugbyUnionFixtures &&
        !!Object.values(rugbyUnionFixtures).find((fixture) => {
          if (fixture.score || fixture.halfTimeScore) {
            return true;
          }
          return false;
        });

      return inPlayStatus || false;
    }

    function isRugbyLeagueFixtureInPlay(rugbyLeagueFixtures: RugbyLeagueFixtureUpdatesResult): boolean {
      const inPlayStatus =
        rugbyLeagueFixtures &&
        !!Object.values(rugbyLeagueFixtures).find((fixture) => {
          if (fixture.score || fixture.halfTimeScore) {
            return true;
          }
          return false;
        });

      return inPlayStatus || false;
    }

    function isVolleyballFixtureInPlay(volleyballFixtures: VolleyballFixtureUpdatesResult): boolean {
      const inPlayStatus =
        volleyballFixtures &&
        !!Object.values(volleyballFixtures).find((fixture) => {
          if (fixture.homeScore !== undefined || fixture.awayScore !== undefined || fixture.currentSet) {
            return true;
          }
          return false;
        });

      return inPlayStatus || false;
    }

    const americanFootballIsInPlay = isAmericanFootballFixtureInPlay(fixtures.americanfootball);

    function isSnookerFixtureInPlay(snookerFixtures: SnookerFixtureUpdatesResult): boolean {
      const inPlayStatus =
        snookerFixtures &&
        !!Object.values(snookerFixtures).find((fixture) => {
          if (fixture.score) {
            return true;
          }
          return false;
        });

      return inPlayStatus || false;
    }

    function isDartsFixtureInPlay(dartsFixtures: DartsFixtureUpdatesResult): boolean {
      const inPlayStatus =
        dartsFixtures &&
        !!Object.values(dartsFixtures).find((fixture) => {
          if (fixture.score) {
            return true;
          }
          return false;
        });

      return inPlayStatus || false;
    }

    function isAustralianRulesFixtureInPlay(australianRulesFixtures: AustralianRulesFixtureUpdatesResult): boolean {
      const inPlayStatus =
        australianRulesFixtures &&
        !!Object.values(australianRulesFixtures).find((fixture) => {
          const { score } = fixture;
          const { goals, behinds, points } = score || {};
          if (score && (goals || behinds || points)) {
            return true;
          }
          return false;
        });

      return inPlayStatus || false;
    }

    const baseballIsInPlay = isBaseballFixtureInPlay(fixtures.baseball);
    const footballIsInPlay = isFootballFixtureInPlay(fixtures.football);
    const basketballIsInPlay = isBasketballFixtureInPlay(fixtures.basketball);
    const tennisIsInPlay = isTennisFixtureInPlay(fixtures.tennis);
    const tableTennisIsInPlay = isTableTennisFixtureInPlay(fixtures.tabletennis);
    const cricketIsInPlay = isCricketFixtureInPlay(fixtures.cricket);
    const raceIsInplay = isRaceInPlay(racesStatusAndResultType);
    const iceHockeyIsInPlay = isIceHockeyFixtureInPlay(fixtures.icehockey);
    const rugbyUnionIsInPlay = isRugbyUnionFixtureInPlay(fixtures.rugbyunion);
    const rugbyLeagueIsInPlay = isRugbyLeagueFixtureInPlay(fixtures.rugbyleague);
    const snookerIsInPlay = isSnookerFixtureInPlay(fixtures.snooker);
    const volleyballIsInPlay = isVolleyballFixtureInPlay(fixtures.volleyball);
    const australianRulesIsInPlay = isAustralianRulesFixtureInPlay(fixtures.australianrules);
    const dartsIsInPlay = isDartsFixtureInPlay(fixtures.darts);

    return (
      americanFootballIsInPlay ||
      baseballIsInPlay ||
      footballIsInPlay ||
      basketballIsInPlay ||
      tennisIsInPlay ||
      tableTennisIsInPlay ||
      cricketIsInPlay ||
      raceIsInplay ||
      iceHockeyIsInPlay ||
      rugbyUnionIsInPlay ||
      rugbyLeagueIsInPlay ||
      snookerIsInPlay ||
      volleyballIsInPlay ||
      australianRulesIsInPlay ||
      snookerIsInPlay ||
      dartsIsInPlay
    );
  }

  private async request(): Promise<ScaUpdatesResult | undefined> {
    const americanFootballUrns: URN[] = [];
    const baseballUrns: URN[] = [];
    const basketballUrns: URN[] = [];
    const cricketUrns: URN[] = [];
    const footballUrns: URN[] = [];
    const raceUrns: URN[] = [];
    const tableTennisUrns: URN[] = [];
    const tennisUrns: URN[] = [];
    const iceHockeyUrns: URN[] = [];
    const rugbyUnionUrns: URN[] = [];
    const rugbyLeagueUrns: URN[] = [];
    const volleyballUrns: URN[] = [];
    const dartsUrns: URN[] = [];
    const footballPlayerIds: string[] = [];
    const snookerUrns: URN[] = [];
    const australianRulesUrns: URN[] = [];

    let isLite = false;
    let includeStats = false;
    let includePlayers = false;
    let includePlayerStats = false;
    let includeSubstitutions = false;

    this.POOL.forEach((value, key) => {
      isLite = value.isLite ?? true;
      includeStats = includeStats || value.includeStats;
      includePlayers = includePlayers || value.includePlayers;
      includePlayerStats = includePlayerStats || value.includePlayerStats;
      includeSubstitutions = includeSubstitutions || value.includeSubstitutions;

      switch (value.typename) {
        case "AmericanFootballFixture":
          americanFootballUrns.push(key);
          break;
        case "FootballFixture":
          footballUrns.push(key);
          break;
        case "TennisMatch":
          tennisUrns.push(key);
          break;
        case "BaseballFixture":
          baseballUrns.push(key);
          break;
        case "BasketballFixture":
          basketballUrns.push(key);
          break;
        case "CricketFixture":
          cricketUrns.push(key);
          break;
        case "TableTennisFixture":
          tableTennisUrns.push(key);
          break;
        case "Race":
          raceUrns.push(key);
          break;
        case "IceHockeyFixture":
          iceHockeyUrns.push(key);
          break;
        case "RugbyUnionFixture":
          rugbyUnionUrns.push(key);
          break;
        case "RugbyLeagueFixture":
          rugbyLeagueUrns.push(key);
          break;
        case "SnookerFixture":
          snookerUrns.push(key);
          break;
        case "VolleyballFixture":
          volleyballUrns.push(key);
          break;
        case "AustralianRulesFixture":
          australianRulesUrns.push(key);
          break;
        case "DartsFixture":
          dartsUrns.push(key);
          break;
        default:
          break;
      }

      if (value.footballPlayerIds?.length) {
        footballPlayerIds.push(...value.footballPlayerIds);
      }
    });

    const { fixtures, racesStatusAndResultType }: ScaUpdatesResult = await scaService.getScaUpdates({
      americanFootballUrns,
      baseballUrns,
      basketballUrns,
      cricketUrns,
      footballUrns,
      raceUrns,
      tableTennisUrns,
      tennisUrns,
      iceHockeyUrns,
      rugbyUnionUrns,
      rugbyLeagueUrns,
      snookerUrns,
      volleyballUrns,
      australianRulesUrns,
      dartsUrns,
      isLite,
      includeStats,
      includePlayers,
      footballPlayerIds: [...new Set(footballPlayerIds)],
      includePlayerStats,
      includeSubstitutions,
    });

    return { fixtures, racesStatusAndResultType };
  }

  protected async tick() {
    try {
      const response = await this.request();

      // EVAL inplay here and set global "inPlay" var
      if (response) {
        const fixturesInplay = RichContentUpdatesObservable.isInPlay(response);
        if (!this.inPlay && fixturesInplay) {
          this.inPlay = true;

          this.setPollInterval(getInterval("SCA", { inPlay: true }));
          this.restart();
        } else if (this.inPlay && !fixturesInplay) {
          this.inPlay = false;

          this.setPollInterval(getInterval("SCA", { inPlay: false }));
          this.restart();
        }

        this.notify({ updates: response, inplay: this.inPlay });
      }

      return;
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : `Unknown error ${e}`;

      this.notify({ error: errorMsg });
    }
  }

  public addEvent(params: AddToPoolParams): void {
    const {
      urn,
      typename,
      isLite = false,
      includeStats = false,
      includePlayers = false,
      footballPlayerIds = [],
      includePlayerStats = false,
      includeSubstitutions = false,
    } = params;
    const existingEntry = this.POOL.get(urn);
    let metadata;

    if (existingEntry) {
      const mergedFootballPlayerIds = [...(existingEntry.footballPlayerIds || []), ...footballPlayerIds];

      metadata = {
        typename,
        count: existingEntry.count + 1,
        isLite: existingEntry.isLite || isLite,
        includeStats: existingEntry.includeStats || includeStats,
        includePlayers: existingEntry.includePlayers || includePlayers,
        footballPlayerIds: [...new Set(mergedFootballPlayerIds)],
        includePlayerStats: existingEntry.includePlayerStats || includePlayerStats,
        includeSubstitutions: existingEntry.includeSubstitutions || includeSubstitutions,
      };
    } else {
      metadata = {
        typename,
        count: 1,
        isLite,
        includeStats,
        includePlayers,
        footballPlayerIds,
        includePlayerStats,
        includeSubstitutions,
      };
    }

    this.add(urn, metadata);
  }

  public removeEvent(urn: URN): void {
    this.remove(urn);
  }

  public resetEvents(): void {
    this.reset();
  }
}
