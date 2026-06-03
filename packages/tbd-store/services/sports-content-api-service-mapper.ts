/* eslint no-underscore-dangle: 0 */
import { codecs } from "@ppb/tbd-urn-codecs";
import {
  AvBScore,
  FootballMatchDuration,
  PenaltyShootout,
  FootballIncident,
  FootballMatchStats,
  PenaltyStatus,
  FootballParticipantStats,
  GoalIncident,
  Clock,
  GoalIncidentType,
  FootballPlayerSub,
  FootballPlayerStartingType,
  FootballPlayerPosition,
  FootballIncidentDetails,
  CardIncident,
  CardIncidentType,
  FootballMatchPeriod,
  FootballMatchStatus,
  FixtureTeamSide,
  PenaltyScore,
  SubstitutionIncident,
  PenaltyIncidentType,
  PenaltyIncident,
  PenaltyShootoutIncidentType,
  PenaltyShootoutIncident,
  PeriodIncidentType,
  PeriodIncident,
  ShotIncidentType,
  ShotIncident,
  SetPieceIncidentType,
  FoulIncident,
  FoulIncidentType,
  AttackIncident,
  AttackIncidentType,
  SetPieceIncident,
  TeamSide,
  TennisGameType,
  TennisMatchStatus,
  TennisSet,
  TennisStatus,
  TennisStatusReason,
  BaseballClock,
  BaseballScore,
  BaseballInningScore,
  BasketballClock,
  BasketballPeriodScore,
  BasketballScore,
  AmericanFootballClock,
  AmericanFootballScore,
  TableTennisScore,
  TableTennisSet,
  CricketInning,
  CricketScore,
  CricketTime,
  IceHockeyClock,
  IceHockeyScore,
  IceHockeyPeriodScore,
  RugbyUnionScore,
  RugbyLeagueScore,
  SnookerScore,
  VolleyballSet,
  AustralianRulesScore,
  AustralianRulesPeriodScore,
  AustralianRulesScoreBoard,
  DartsFixtureType,
  DartsScore,
  DartsSet,
} from "../state/entities";

import {
  FootballFixtureFragment,
  FootballPlayerFragment,
  FootballPlayerPeriodStatsFragment,
  FootballPlayerSubFragment,
  FootballPlayerWithStatsFragment,
  FootballPlayerWithSubsFragment,
  FootballPlayersStatsFragment,
  GameStatsFragment,
  ClockFragment,
  GoalIncidentFragment,
  IncidentDetailsFragment,
  CardIncidentFragment,
  SubstitutionIncidentFragment,
  PenaltyIncidentFragment,
  PenaltyShootoutIncidentFragment,
  PeriodIncidentFragment,
  ShotIncidentFragment,
  SetPieceIncidentFragment,
  FoulIncidentFragment,
  AttackIncidentFragment,
  ScaUpdatesQuery,
  TennisFixtureFragment,
  BaseballFixtureFragment,
  BasketballFixtureFragment,
  AmericanFootballFixtureFragment,
  CricketFixtureFragment,
  TableTennisFixtureFragment,
  IceHockeyFixtureFragment,
  RugbyUnionFixtureFragment,
  RugbyLeagueFixtureFragment,
  SnookerFixtureFragment,
  VolleyballFixtureFragment,
  AustralianRulesFixtureFragment,
  PeriodDetails,
  RaceResultType,
  RaceStatus,
  DartsFixtureFragment,
} from "../clients/sca/sports-content-api-response-types";
import { getClockExtraMinutes } from "../helpers/clock-extra-minutes";
import { FootballPlayer } from "../state/entities/football-player-fixture-context/FootballPlayerFixtureContext.types";

export type FootballFixtureUpdateResult = {
  scheduledAt?: Date;
  score?: AvBScore;
  duration?: FootballMatchDuration;
  penaltyShootout?: PenaltyShootout;
  incidents?: FootballIncident[];
  stats?: FootballMatchStats[];
  players?: FootballPlayer[];
  home?: FootballFixtureFragment["home"];
  away?: FootballFixtureFragment["away"];
};
export type FootballFixtureUpdatesResult = {
  [urn: string]: FootballFixtureUpdateResult;
} | null;

export type TennisFixtureUpdatesResult = {
  [urn: string]: {
    actualStartTime?: Date;
    scheduledStartTime?: Date;
    teamAScore?: number;
    teamBScore?: number;
    currentSet?: TennisSet;
    status?: TennisMatchStatus;
  };
} | null;

export type BaseballFixtureUpdatesResult = {
  [urn: string]: {
    clock?: BaseballClock;
    score?: BaseballScore;
    scorePerInning?: BaseballInningScore[];
  };
} | null;

export type BasketballFixtureUpdatesResult = {
  [urn: string]: {
    clock?: BasketballClock;
    periodScores?: BasketballPeriodScore[];
    score?: BasketballScore;
  };
} | null;

export type IceHockeyFixtureUpdatesResult = {
  [urn: string]: {
    clock?: IceHockeyClock;
    score?: IceHockeyScore;
    periodScores?: IceHockeyPeriodScore[];
  };
} | null;

export type AmericanFootballFixtureUpdatesResult = {
  [urn: string]: {
    clock?: AmericanFootballClock;
    score?: AmericanFootballScore;
  };
} | null;

export type DartsFixtureUpdatesResult = {
  [urn: string]: {
    type?: DartsFixtureType;
    score?: DartsScore; //
    currentSet?: DartsSet;
    previousSets?: DartsSet[];
  };
} | null;

export type CricketFixtureUpdatesResult = {
  [urn: string]: {
    score?: CricketScore;
    currentTeamBatting?: TeamSide;
    currentTime?: CricketTime;
  };
} | null;

export type TableTennisFixtureUpdatesResult = {
  [urn: string]: {
    currentSet?: TableTennisSet;
    previousSets?: TableTennisSet[];
    setsWon?: TableTennisScore;
  };
} | null;

export type RugbyUnionFixtureUpdatesResult = {
  [urn: string]: {
    score?: RugbyUnionScore;
    halfTimeScore?: RugbyUnionScore;
  };
} | null;

export type RugbyLeagueFixtureUpdatesResult = {
  [urn: string]: {
    score?: RugbyLeagueScore;
    halfTimeScore?: RugbyLeagueScore;
  };
} | null;

export type SnookerFixtureUpdatesResult = {
  [urn: string]: {
    score?: SnookerScore;
  };
} | null;

export type VolleyballFixtureUpdatesResult = {
  [urn: string]: {
    homeScore?: number;
    awayScore?: number;
    currentSet?: VolleyballSet;
    previousSets?: VolleyballSet[];
  };
} | null;

export type AustralianRulesFixtureUpdatesResult = {
  [urn: string]: {
    score?: AustralianRulesScoreBoard;
    periodScores?: AustralianRulesPeriodScore[];
  };
} | null;

export type FixtureUpdatesResult = {
  americanfootball: AmericanFootballFixtureUpdatesResult;
  baseball: BaseballFixtureUpdatesResult;
  basketball: BasketballFixtureUpdatesResult;
  cricket: CricketFixtureUpdatesResult;
  football: FootballFixtureUpdatesResult;
  tennis: TennisFixtureUpdatesResult;
  tabletennis: TableTennisFixtureUpdatesResult;
  icehockey: IceHockeyFixtureUpdatesResult;
  rugbyunion: RugbyUnionFixtureUpdatesResult;
  rugbyleague: RugbyLeagueFixtureUpdatesResult;
  snooker: SnookerFixtureUpdatesResult;
  volleyball: VolleyballFixtureUpdatesResult;
  australianrules: AustralianRulesFixtureUpdatesResult;
  darts: DartsFixtureUpdatesResult;
};

export type RaceStatusAndResultTypeUpdatesResult = {
  [urn: string]: RaceStatusAndResultTypeUpdateResult;
};

export type RaceStatusAndResultTypeUpdateResult = {
  status?: RaceStatus;
  resultType?: RaceResultType;
};

function mapGameStats(teamStats: GameStatsFragment): FootballParticipantStats | undefined {
  return {
    __typename: "FootballGameStats",
    possession: teamStats.possession ?? undefined,
    corners: teamStats.corners ?? undefined,
    yellowCards: teamStats.yellowCards ?? undefined,
    redCards: teamStats.redCards ?? undefined,
    totalCards: teamStats.totalCards ?? undefined,
    offsides: teamStats.offsides ?? undefined,
    fouls: teamStats.fouls ?? undefined,
    throwIns: teamStats.throwIns ?? undefined,
    freeKicks: teamStats.freeKicks ?? undefined,
    goalKicks: teamStats.goalKicks ?? undefined,
    blockedShots: teamStats.blockedShots ?? undefined,
    attacks: teamStats.attacks ?? undefined,
    dangerousAttacks: teamStats.dangerousAttacks ?? undefined,
    shotsOnTarget: teamStats.shotsOnTarget ?? undefined,
    shotsOffTarget: teamStats.shotsOffTarget ?? undefined,
    totalShots: teamStats.totalShots ?? undefined,
    goals: teamStats.goals ?? undefined,
  };
}

function mapPlayerGameStats(
  periodDetails: PeriodDetails,
  playerStats: FootballPlayersStatsFragment | null,
): FootballParticipantStats | undefined {
  return {
    __typename: "FootballPlayerStats",
    periodStatus: periodDetails?.periodStatus ? FootballMatchStatus[periodDetails?.periodStatus] : undefined,
    period: periodDetails?.period ? FootballMatchPeriod[periodDetails?.period] : undefined,
    shotsOnTarget: playerStats?.shotsOnTarget ?? undefined,
    totalShots: playerStats?.totalShots ?? undefined,
    goals: playerStats?.goals ?? undefined,
    fouls: playerStats?.fouls ?? undefined,
    foulsWon: playerStats?.foulsWon ?? undefined,
    passes: playerStats?.passes ?? undefined,
    totalCards: playerStats?.totalCards ?? undefined,
    assists: playerStats?.assists ?? undefined,
    foulInvolvements: playerStats?.foulInvolvements ?? undefined,
  };
}

function mapInstantToClock(instant: ClockFragment): Clock | undefined {
  if (instant.minute === null) {
    return undefined;
  }

  return {
    __typename: "Clock",
    minute: instant.minute,
    second: instant.second ? instant.second : undefined,
  };
}

function mapFootballPlayer(player: FootballPlayerFragment): FootballPlayer | undefined {
  if (player && player.id && player.name && player.startingType) {
    return {
      __typename: "FootballPlayer",
      id: player.id,
      name: player.name,
      startingType: FootballPlayerStartingType[player.startingType],
      shirtNumber: player.shirtNumber ? player.shirtNumber : undefined,
      position: player.position ? FootballPlayerPosition[player.position] : undefined,
      matchName: player.matchName ? player.matchName : undefined,
      formationPlace: player.formationPlace ? player.formationPlace : undefined,
    };
  }
  return undefined;
}

function extractDurationFromFootballFixtureFragment({
  duration,
}: FootballFixtureFragment): FootballMatchDuration | undefined {
  if (!duration) {
    return undefined;
  }

  const clock = duration.clock ? mapInstantToClock(duration.clock) : undefined;

  return {
    period: duration.period ? FootballMatchPeriod[duration.period] : undefined,
    status: duration.status ? FootballMatchStatus[duration.status] : undefined,
    stoppageMinutes: duration.stoppageMinutes ? duration.stoppageMinutes : undefined,
    clock,
  };
}

function mapGoalIncident(goalIncident: GoalIncidentFragment): GoalIncident | undefined {
  if (!goalIncident.__typename || !goalIncident.side || !goalIncident.goalType) {
    return undefined;
  }

  return {
    __typename: goalIncident.__typename,
    goalType: GoalIncidentType[goalIncident.goalType],
    side: FixtureTeamSide[goalIncident.side],
    goalScorer: goalIncident.goalScorer ? mapFootballPlayer(goalIncident.goalScorer) : undefined,
    assist: goalIncident.assist ? mapFootballPlayer(goalIncident.assist) : undefined,
  };
}

function mapCardIncident(cardIncident: CardIncidentFragment): CardIncident | undefined {
  if (!cardIncident.__typename || !cardIncident.side || !cardIncident.cardType) {
    return undefined;
  }

  return {
    __typename: cardIncident.__typename,
    player: cardIncident.player ? mapFootballPlayer(cardIncident.player) : undefined,
    side: FixtureTeamSide[cardIncident.side],
    cardType: CardIncidentType[cardIncident.cardType],
  };
}

function mapSubstitutionIncident(substitutionIncident: SubstitutionIncidentFragment): SubstitutionIncident | undefined {
  if (!substitutionIncident.__typename || !substitutionIncident.side) {
    return undefined;
  }

  return {
    __typename: substitutionIncident.__typename,
    side: FixtureTeamSide[substitutionIncident.side],
    playerIn: substitutionIncident.playerIn ? mapFootballPlayer(substitutionIncident.playerIn) : undefined,
    playerOut: substitutionIncident.playerOut ? mapFootballPlayer(substitutionIncident.playerOut) : undefined,
  };
}

function mapPenaltyIncident(penaltyIncident: PenaltyIncidentFragment): PenaltyIncident | undefined {
  if (!penaltyIncident.__typename || !penaltyIncident.side || !penaltyIncident.penaltyType) {
    return undefined;
  }

  return {
    __typename: penaltyIncident.__typename,
    side: FixtureTeamSide[penaltyIncident.side],
    penaltyType: PenaltyIncidentType[penaltyIncident.penaltyType],
  };
}

function mapPenaltyShootoutIncident(
  penaltyShootoutIncident: PenaltyShootoutIncidentFragment,
): PenaltyShootoutIncident | undefined {
  if (
    !penaltyShootoutIncident.__typename ||
    !penaltyShootoutIncident.side ||
    !penaltyShootoutIncident.penaltyShootoutType
  ) {
    return undefined;
  }

  return {
    __typename: penaltyShootoutIncident.__typename,
    side: FixtureTeamSide[penaltyShootoutIncident.side],
    player: penaltyShootoutIncident.player ? mapFootballPlayer(penaltyShootoutIncident.player) : undefined,
    penaltyShootoutType: PenaltyShootoutIncidentType[penaltyShootoutIncident.penaltyShootoutType],
  };
}

function mapPeriodIncident(periodIncident: PeriodIncidentFragment): PeriodIncident | undefined {
  if (!periodIncident.__typename || !periodIncident.status || !periodIncident.period || !periodIncident.periodType) {
    return undefined;
  }

  return {
    __typename: periodIncident.__typename,
    injuryTime: periodIncident?.injuryTime ?? undefined,
    period: FootballMatchPeriod[periodIncident.period],
    status: FootballMatchStatus[periodIncident.status],
    periodType: PeriodIncidentType[periodIncident.periodType],
  };
}

function mapShotIncident(shotIncident: ShotIncidentFragment): ShotIncident | undefined {
  if (!shotIncident.__typename || !shotIncident.side || !shotIncident.shotType) {
    return undefined;
  }

  return {
    __typename: shotIncident.__typename,
    side: FixtureTeamSide[shotIncident.side],
    player: shotIncident.player ? mapFootballPlayer(shotIncident.player) : undefined,
    shotType: ShotIncidentType[shotIncident.shotType],
  };
}

function mapSetPieceIncident(setPieceIncident: SetPieceIncidentFragment): SetPieceIncident | undefined {
  if (!setPieceIncident.__typename || !setPieceIncident.setPieceType || !setPieceIncident.side) {
    return undefined;
  }

  return {
    __typename: setPieceIncident.__typename,
    side: FixtureTeamSide[setPieceIncident.side],
    setPieceType: SetPieceIncidentType[setPieceIncident.setPieceType],
  };
}

function mapFoulIncident(foulIncident: FoulIncidentFragment): FoulIncident | undefined {
  if (!foulIncident.__typename || !foulIncident.foulType || !foulIncident.side) {
    return undefined;
  }

  return {
    __typename: foulIncident.__typename,
    side: FixtureTeamSide[foulIncident.side],
    player: foulIncident.player ? mapFootballPlayer(foulIncident.player) : undefined,
    foulType: FoulIncidentType[foulIncident.foulType],
  };
}

function mapAttackIncident(attackIncident: AttackIncidentFragment): AttackIncident | undefined {
  if (!attackIncident.__typename || !attackIncident.attackType || !attackIncident.side) {
    return undefined;
  }

  return {
    __typename: attackIncident.__typename,
    side: FixtureTeamSide[attackIncident.side],
    attackType: AttackIncidentType[attackIncident.attackType],
  };
}

function mapIncident(incidentDetails: IncidentDetailsFragment): FootballIncidentDetails | undefined {
  if (incidentDetails.__typename === "GoalIncident") {
    return mapGoalIncident(incidentDetails);
  }
  if (incidentDetails.__typename === "CardIncident") {
    return mapCardIncident(incidentDetails);
  }
  if (incidentDetails.__typename === "SubstitutionIncident") {
    return mapSubstitutionIncident(incidentDetails);
  }
  if (incidentDetails.__typename === "PenaltyIncident") {
    return mapPenaltyIncident(incidentDetails);
  }
  if (incidentDetails.__typename === "PenaltyShootoutIncident") {
    return mapPenaltyShootoutIncident(incidentDetails);
  }
  if (incidentDetails.__typename === "PeriodIncident") {
    return mapPeriodIncident(incidentDetails);
  }
  if (incidentDetails.__typename === "ShotIncident") {
    return mapShotIncident(incidentDetails);
  }
  if (incidentDetails.__typename === "SetPieceIncident") {
    return mapSetPieceIncident(incidentDetails);
  }
  if (incidentDetails.__typename === "FoulIncident") {
    return mapFoulIncident(incidentDetails);
  }
  if (incidentDetails.__typename === "AttackIncident") {
    return mapAttackIncident(incidentDetails);
  }
  return undefined;
}

function extractPenaltyShootoutFromFootballFixtureFragment({
  penaltyShootout,
}: FootballFixtureFragment): PenaltyShootout | undefined {
  if (!penaltyShootout) {
    return undefined;
  }

  const penaltyScores =
    penaltyShootout.penaltyScores?.reduce<PenaltyScore[]>((acc, penaltyScore) => {
      if (penaltyScore && penaltyScore.side && penaltyScore.shotResult) {
        acc.push({
          penaltyNumber: penaltyScore.penaltyNumber ? penaltyScore.penaltyNumber : undefined,
          side: FixtureTeamSide[penaltyScore.side],
          shotResult: PenaltyStatus[penaltyScore.shotResult],
        });
      }
      return acc;
    }, []) || [];

  return {
    firstTeamToShoot: penaltyShootout.firstTeamToShoot ? FixtureTeamSide[penaltyShootout.firstTeamToShoot] : undefined,
    nextTeamToShoot: penaltyShootout.nextTeamToShoot ? FixtureTeamSide[penaltyShootout.nextTeamToShoot] : undefined,
    penaltyFormat: penaltyShootout.penaltyFormat ? penaltyShootout.penaltyFormat : undefined,
    penaltyScores,
  };
}

function extractMatchStatsFromFixture({ stats }: FootballFixtureFragment): FootballMatchStats[] | undefined {
  if (stats === undefined) {
    return undefined;
  }
  if (!stats?.length) {
    return [];
  }

  return stats.reduce<FootballMatchStats[]>((acc, matchStats) => {
    if (matchStats?.periodStatus) {
      acc.push({
        __typename: "FootballStats",
        periodStatus: FootballMatchStatus[matchStats.periodStatus],
        period: matchStats.period ? FootballMatchPeriod[matchStats.period] : undefined,
        home: matchStats.home ? mapGameStats(matchStats.home) : undefined,
        away: matchStats.away ? mapGameStats(matchStats.away) : undefined,
        both: matchStats.both ? mapGameStats(matchStats.both) : undefined,
      });
    }
    return acc;
  }, []);
}

const mapFootballPlayerWithStats = (player: FootballPlayerWithStatsFragment): FootballPlayer => ({
  __typename: player.__typename,
  id: player.id,
  name: player.name ?? undefined,
  stats: player.stats?.length
    ? player.stats.reduce<FootballParticipantStats[]>((acc, stat: FootballPlayerPeriodStatsFragment | null) => {
        if (stat?.periodDetails?.periodStatus) {
          const stats = mapPlayerGameStats(stat.periodDetails, stat.stats);

          if (stats) {
            acc.push(stats);
          }
        }

        return acc;
      }, [])
    : undefined,
});

const mapFootballPlayerSub = (substitute: FootballPlayerSubFragment | null): FootballPlayerSub | undefined => {
  if (!substitute?.player) {
    return undefined;
  }

  return {
    __typename: substitute.__typename,
    player: mapFootballPlayerWithStats(substitute.player),
  };
};

const mapFootballPlayerWithSubs = (player: FootballPlayerWithSubsFragment | null): FootballPlayer | undefined => {
  if (!player) {
    return undefined;
  }

  return {
    ...mapFootballPlayerWithStats(player),
    substitutions: player.substitutions
      ?.map(mapFootballPlayerSub)
      .filter((substitute): substitute is FootballPlayerSub => !!substitute),
  };
};

function extractFootballPlayerWithStatsFromFixture({ players }: FootballFixtureFragment): FootballPlayer[] | undefined {
  if (!players) {
    return undefined;
  }

  return players.reduce<FootballPlayer[]>((acc, player: FootballPlayerWithSubsFragment | null) => {
    const footballPlayer = mapFootballPlayerWithSubs(player);

    if (footballPlayer) {
      acc.push(footballPlayer);
    }

    return acc;
  }, []);
}

function extractFootballIncidentsFromFixture({ incidents }: FootballFixtureFragment): FootballIncident[] {
  if (!incidents) {
    return [];
  }

  return incidents.reduce<FootballIncident[]>((acc, incident) => {
    if (incident?.period && incident.periodStatus && incident.details) {
      const clock = incident.clock ? mapInstantToClock(incident.clock) : undefined;
      const details = mapIncident(incident.details);

      if (clock && details && incident.details.__typename) {
        const clockExtraMinutes = getClockExtraMinutes(clock.minute, incident.period, incident.periodStatus);

        acc.push({
          __typename: "FootballIncident",
          clock,
          clockExtraMinutes,
          period: FootballMatchPeriod[incident.period],
          periodStatus: FootballMatchStatus[incident.periodStatus],
          type: incident.details.__typename,
          details,
        });
      }
    }
    return acc;
  }, []);
}

function extractScoreFromFixture({ score }: FootballFixtureFragment): AvBScore | undefined {
  if (!score || score.home === null || score.away === null) {
    return undefined;
  }

  return {
    home: score.home,
    away: score.away,
  };
}

function extractCurrentSetFromTennisFixtureFragment({ currentSet }: TennisFixtureFragment): TennisSet | undefined {
  if (!currentSet) {
    return undefined;
  }

  const currentGame = currentSet.currentGame
    ? {
        teamAScore: currentSet.currentGame.teamAScore,
        teamBScore: currentSet.currentGame.teamBScore,
        teamServing: currentSet.currentGame.teamServing ? TeamSide[currentSet.currentGame.teamServing] : undefined,
        type: currentSet.currentGame.type ? TennisGameType[currentSet.currentGame.type] : undefined,
      }
    : undefined;
  const { teamAScore, teamBScore } = currentSet;

  return {
    currentGame,
    teamAScore,
    teamBScore,
  };
}

function extractStatusFromTennisFixtureFragment({
  status: matchStatus,
}: TennisFixtureFragment): TennisMatchStatus | undefined {
  if (!matchStatus) {
    return undefined;
  }

  return {
    status: matchStatus.status ? TennisStatus[matchStatus.status] : undefined,
    reason: matchStatus.reason ? TennisStatusReason[matchStatus.reason] : undefined,
  };
}

function mapFootballFixtureUpdates(scaUpdates: ScaUpdatesQuery): FootballFixtureUpdatesResult {
  if (!scaUpdates?.football?.fixture) return null;

  const result: FootballFixtureUpdatesResult = {};

  scaUpdates.football.fixture.forEach((fixture) => {
    const fixtureURN = fixture?.id && codecs.fixture.encode(fixture?.id)?.uid;

    if (!fixtureURN || !fixture) return;

    const score = extractScoreFromFixture(fixture);
    const duration = extractDurationFromFootballFixtureFragment(fixture);
    const penaltyShootout = extractPenaltyShootoutFromFootballFixtureFragment(fixture);
    const stats = extractMatchStatsFromFixture(fixture);
    const incidents = extractFootballIncidentsFromFixture(fixture);
    const players = extractFootballPlayerWithStatsFromFixture(fixture);

    result[fixtureURN] = {
      scheduledAt: fixture.scheduledAt ? new Date(fixture.scheduledAt) : undefined,
      score,
      duration,
      penaltyShootout,
      incidents,
      ...(stats ? { stats } : {}),
      ...(players ? { players } : {}),
      ...(fixture.home?.formation && { home: { formation: fixture.home.formation } }),
      ...(fixture.away?.formation && { away: { formation: fixture.away.formation } }),
    };
  });

  return result;
}

function extractClockFromBasketFixtureFragment(fixture: BasketballFixtureFragment): BasketballClock | undefined {
  if (!fixture?.clock) {
    return undefined;
  }

  const { period, segment, timeElapsed, timeRemaining } = fixture.clock;

  return {
    period: period || undefined,
    segment: segment || undefined,
    timeElapsed: timeElapsed ?? undefined,
    timeRemaining: timeRemaining ?? undefined,
  };
}

function extractPeriodScoresFromBasketFixtureFragment(
  fixture: BasketballFixtureFragment,
): BasketballPeriodScore[] | [] {
  if (!fixture?.periodScores) {
    return [];
  }

  return fixture.periodScores.map((periodScore) => {
    const period = periodScore?.period || undefined;
    const score = periodScore?.score || undefined;

    return { period, score };
  });
}

function extractClockFromBaseballFixtureFragment(fixture: BaseballFixtureFragment): BaseballClock | undefined {
  if (!fixture?.clock) {
    return undefined;
  }

  const { period } = fixture.clock;

  return {
    period: period || undefined,
  };
}

function extractScoreFromBaseballFixtureFragment(fixture: BaseballFixtureFragment): BaseballScore | undefined {
  if (!fixture?.score) {
    return undefined;
  }

  return {
    home: fixture.score.home,
    away: fixture.score.away,
  };
}

function extractScorePerInningFromBaseballFixtureFragment(
  fixture: BaseballFixtureFragment,
): BaseballInningScore[] | undefined {
  if (!fixture?.scorePerInning) {
    return undefined;
  }

  return fixture.scorePerInning.map((inning) => {
    if (!inning) {
      return {};
    }

    return {
      period: inning.period || undefined,
      score: inning.score
        ? {
            home: inning.score.home,
            away: inning.score.away,
          }
        : undefined,
    };
  });
}

function mapBaseballFixtureUpdates(scaUpdates: ScaUpdatesQuery): BaseballFixtureUpdatesResult {
  if (!scaUpdates?.baseball?.fixture) return null;

  const result: BaseballFixtureUpdatesResult = {};

  scaUpdates.baseball.fixture.forEach((fixture) => {
    const fixtureURN = fixture?.id && codecs.fixture.encode(fixture?.id)?.uid;

    if (!fixture || !fixtureURN) return;

    result[fixtureURN] = {
      clock: extractClockFromBaseballFixtureFragment(fixture),
      score: extractScoreFromBaseballFixtureFragment(fixture),
      scorePerInning: extractScorePerInningFromBaseballFixtureFragment(fixture),
    };
  });

  return result;
}

function extractScoreFromBasketFixtureFragment(fixture: BasketballFixtureFragment): BasketballScore | undefined {
  return fixture?.score || undefined;
}

function mapBasketballFixtureUpdates(scaUpdates: ScaUpdatesQuery): BasketballFixtureUpdatesResult {
  if (!scaUpdates?.basketball?.fixture) return null;

  const result: BasketballFixtureUpdatesResult = {};

  scaUpdates.basketball.fixture.forEach((fixture) => {
    const fixtureURN = fixture?.id && codecs.fixture.encode(fixture?.id)?.uid;

    if (!fixture || !fixtureURN) return;

    result[fixtureURN] = {
      clock: extractClockFromBasketFixtureFragment(fixture),
      periodScores: extractPeriodScoresFromBasketFixtureFragment(fixture),
      score: extractScoreFromBasketFixtureFragment(fixture),
    };
  });

  return result;
}

function extractClockFromIceHockeyFixtureFragment(fixture: IceHockeyFixtureFragment): IceHockeyClock | undefined {
  if (!fixture?.clock) {
    return undefined;
  }

  const { period } = fixture.clock;

  return {
    period: period || undefined,
  };
}

function extractClockFromAmericanFootballFixtureFragment(
  fixture: AmericanFootballFixtureFragment,
): AmericanFootballClock | undefined {
  if (!fixture?.clock) {
    return undefined;
  }

  const { period } = fixture.clock;

  return {
    period: period || undefined,
  };
}

function extractScoreFromIceHockeyFixtureFragment(fixture: IceHockeyFixtureFragment): IceHockeyScore | undefined {
  return fixture?.score || undefined;
}

function extractPeriodScoresFromIceHockeyFixtureFragment(
  fixture: IceHockeyFixtureFragment,
): IceHockeyPeriodScore[] | [] {
  if (!fixture?.periodScores) {
    return [];
  }

  return fixture.periodScores.map((periodScore) => {
    const period = periodScore?.period || undefined;
    const score = periodScore?.score || undefined;

    return { period, score };
  });
}

function mapIceHockeyFixtureUpdates(scaUpdates: ScaUpdatesQuery): IceHockeyFixtureUpdatesResult {
  if (!scaUpdates?.iceHockey?.fixture) return null;

  const result: IceHockeyFixtureUpdatesResult = {};

  scaUpdates.iceHockey.fixture.forEach((fixture) => {
    const fixtureURN = fixture?.id && codecs.fixture.encode(fixture?.id)?.uid;

    if (!fixture || !fixtureURN) return;

    result[fixtureURN] = {
      clock: extractClockFromIceHockeyFixtureFragment(fixture),
      score: extractScoreFromIceHockeyFixtureFragment(fixture),
      periodScores: extractPeriodScoresFromIceHockeyFixtureFragment(fixture),
    };
  });

  return result;
}

function extractScoreFromAustralianRulesFixtureFragment(
  score?: { home: number | null; away: number | null } | null,
): AustralianRulesScore | undefined {
  if (!score || typeof score?.home !== "number" || typeof score?.away !== "number") return undefined;

  return {
    home: score.home,
    away: score.away,
  };
}

function extractScoreBoardFromAustralianRulesFixtureFragment(
  scoreboard?: {
    goals: { home: number | null; away: number | null } | null;
    behinds: { home: number | null; away: number | null } | null;
    points: { home: number | null; away: number | null } | null;
  } | null,
): AustralianRulesScoreBoard | undefined {
  const { goals, behinds, points } = scoreboard || {};
  if (scoreboard && (goals || behinds || points)) {
    return {
      goals: extractScoreFromAustralianRulesFixtureFragment(goals),
      behinds: extractScoreFromAustralianRulesFixtureFragment(behinds),
      points: extractScoreFromAustralianRulesFixtureFragment(points),
    };
  }
  return undefined;
}

function extractPeriodScoresFromAustralianRulesFixtureFragment(
  fixture: AustralianRulesFixtureFragment,
): AustralianRulesPeriodScore[] | [] {
  if (!fixture?.periodScores) {
    return [];
  }

  return fixture.periodScores.map((periodScore) => {
    const period = periodScore?.australianRulesPeriod || undefined;
    const score = extractScoreBoardFromAustralianRulesFixtureFragment(periodScore?.score);

    return { period, score };
  });
}

function mapAustralianRulesFixtureUpdates(scaUpdates: ScaUpdatesQuery): AustralianRulesFixtureUpdatesResult {
  if (!scaUpdates?.australianRules?.fixture) return null;

  const result: AustralianRulesFixtureUpdatesResult = {};

  scaUpdates.australianRules.fixture.forEach((fixture) => {
    const fixtureURN = fixture?.id && codecs.fixture.encode(fixture?.id)?.uid;

    if (!fixture || !fixtureURN) return;

    result[fixtureURN] = {
      score: extractScoreBoardFromAustralianRulesFixtureFragment(fixture.score),
      periodScores: extractPeriodScoresFromAustralianRulesFixtureFragment(fixture),
    };
  });

  return result;
}

function extractScoreFromRugbyUnionFixtureFragment(fixture: RugbyUnionFixtureFragment): RugbyUnionScore | undefined {
  return fixture?.score || undefined;
}

function extractHalfTimeScoreFromRugbyUnionFixtureFragment(
  fixture: RugbyUnionFixtureFragment,
): RugbyUnionScore | undefined {
  return fixture?.halfTimeScore || undefined;
}

function mapRugbyUnionFixtureUpdates(scaUpdates: ScaUpdatesQuery): RugbyUnionFixtureUpdatesResult {
  if (!scaUpdates?.rugbyUnion?.fixture) return null;

  const result: RugbyUnionFixtureUpdatesResult = {};

  scaUpdates.rugbyUnion.fixture.forEach((fixture) => {
    const fixtureURN = fixture?.id && codecs.fixture.encode(fixture?.id)?.uid;

    if (!fixture || !fixtureURN) return;

    result[fixtureURN] = {
      score: extractScoreFromRugbyUnionFixtureFragment(fixture),
      halfTimeScore: extractHalfTimeScoreFromRugbyUnionFixtureFragment(fixture),
    };
  });

  return result;
}

function extractScoreFromRugbyLeagueFixtureFragment(fixture: RugbyLeagueFixtureFragment): RugbyLeagueScore | undefined {
  return fixture?.score || undefined;
}

function extractHalfTimeScoreFromRugbyLeagueFixtureFragment(
  fixture: RugbyLeagueFixtureFragment,
): RugbyLeagueScore | undefined {
  return fixture?.halfTimeScore || undefined;
}

function mapRugbyLeagueFixtureUpdates(scaUpdates: ScaUpdatesQuery): RugbyLeagueFixtureUpdatesResult {
  if (!scaUpdates?.rugbyLeague?.fixture) return null;

  const result: RugbyLeagueFixtureUpdatesResult = {};

  scaUpdates.rugbyLeague.fixture.forEach((fixture) => {
    const fixtureURN = fixture?.id && codecs.fixture.encode(fixture?.id)?.uid;

    if (!fixture || !fixtureURN) return;

    result[fixtureURN] = {
      score: extractScoreFromRugbyLeagueFixtureFragment(fixture),
      halfTimeScore: extractHalfTimeScoreFromRugbyLeagueFixtureFragment(fixture),
    };
  });

  return result;
}

function extractScoreFromAmericanFootballFixtureFragment(
  fixture: AmericanFootballFixtureFragment,
): AmericanFootballScore | undefined {
  return fixture?.score || undefined;
}

function mapAmericanFootballFixtureUpdates(scaUpdates: ScaUpdatesQuery): AmericanFootballFixtureUpdatesResult {
  if (!scaUpdates?.americanFootball?.fixture) return null;

  const result: AmericanFootballFixtureUpdatesResult = {};

  scaUpdates.americanFootball.fixture.forEach((fixture) => {
    const fixtureURN = fixture?.id && codecs.fixture.encode(fixture?.id)?.uid;

    if (!fixture || !fixtureURN) return;

    result[fixtureURN] = {
      clock: extractClockFromAmericanFootballFixtureFragment(fixture),
      score: extractScoreFromAmericanFootballFixtureFragment(fixture),
    };
  });

  return result;
}

function extractTypeFromDartsFixtureFragment(fixture: DartsFixtureFragment): DartsFixtureType | undefined {
  if (!fixture?.type) {
    return undefined;
  }
  return fixture.type as unknown as DartsFixtureType;
}

function mapDartsScore(score: { home: number; away: number } | null | undefined): DartsScore | undefined {
  if (!score) return undefined;
  return {
    home: score.home,
    away: score.away,
  };
}

function mapDartsSet(
  set: { number: number; score: { home: number; away: number } } | null | undefined,
): DartsSet | undefined {
  if (!set) return undefined;
  return {
    number: set.number,
    score: mapDartsScore(set.score),
  };
}

function extractScoreFromDartsFixtureFragment(fixture: DartsFixtureFragment): {
  score?: DartsScore;
  currentSet?: DartsSet;
  previousSets?: DartsSet[];
} {
  if (!fixture?.score) return {};

  const scoreData = fixture.score as any;
  const result: {
    score?: DartsScore;
    currentSet?: DartsSet;
    previousSets?: DartsSet[];
  } = {};

  const isSetsStructure =
    scoreData.__typename === "DartsFixtureSetsScore" ||
    "setsWon" in scoreData ||
    "currentSet" in scoreData ||
    "previousSets" in scoreData;

  if (isSetsStructure) {
    // If setsWon is present, use it as the main score
    if (scoreData.setsWon) {
      result.score = mapDartsScore(scoreData.setsWon);
    }

    if (scoreData.currentSet) {
      result.currentSet = mapDartsSet(scoreData.currentSet);
    }

    if (scoreData.previousSets) {
      result.previousSets = scoreData.previousSets
        .map((set: any) => mapDartsSet(set))
        .filter((set: any): set is DartsSet => !!set);
    }
    return result;
  }

  // Handle Basic Score (LEGS)
  if (scoreData.home !== undefined && scoreData.away !== undefined) {
    result.score = {
      home: scoreData.home,
      away: scoreData.away,
    };
  }

  return result;
}

function mapDartsFixtureUpdates(scaUpdates: ScaUpdatesQuery): DartsFixtureUpdatesResult {
  if (!scaUpdates?.darts?.fixture) return null;

  const result: DartsFixtureUpdatesResult = {};

  scaUpdates.darts.fixture.forEach((fixture) => {
    const fixtureURN = fixture?.id && codecs.fixture.encode(fixture?.id)?.uid;

    if (!fixture || !fixtureURN) return;

    const type = extractTypeFromDartsFixtureFragment(fixture);
    const scoringData = extractScoreFromDartsFixtureFragment(fixture);

    result[fixtureURN] = {
      ...(type && { type }),
      ...scoringData,
    };
  });

  return result;
}

function mapTennisFixtureUpdates(scaUpdates: ScaUpdatesQuery): TennisFixtureUpdatesResult {
  if (!scaUpdates?.tennis?.match) return null;

  const result: TennisFixtureUpdatesResult = {};

  scaUpdates.tennis.match.forEach((match) => {
    const fixtureURN = match?.id && codecs.fixture.encode(match?.id)?.uid;

    if (!fixtureURN || !match) return;

    const scheduledStartTime = match.scheduledStartTime ? new Date(match.scheduledStartTime) : undefined;
    const actualStartTime = match.actualStartTime ? new Date(match.actualStartTime) : undefined;

    const teamAScore = match.teamAScore !== null ? match.teamAScore : 0;
    const teamBScore = match.teamBScore !== null ? match.teamBScore : 0;

    const currentSet = extractCurrentSetFromTennisFixtureFragment(match);
    const status = extractStatusFromTennisFixtureFragment(match);

    result[fixtureURN] = {
      scheduledStartTime,
      actualStartTime,
      teamAScore,
      teamBScore,
      currentSet,
      status,
    };
  });

  return result;
}

function extractCricketInningFromCricketScore(scores: CricketInning[]): CricketInning[] | undefined {
  if (!scores.length) return undefined;

  return scores.reduce<CricketInning[]>((acc, score) => {
    if (score) {
      acc.push({
        inningNumber: score.inningNumber ?? 0,
        runs: score.runs ?? 0,
        wickets: score.wickets ?? 0,
      });
    }
    return acc;
  }, []);
}

function extractScoreFromCricketFixtureFragment(fixture: CricketFixtureFragment): CricketScore | undefined {
  if (!fixture) return undefined;

  const { score } = fixture;

  if (!score) return undefined;

  return {
    home: extractCricketInningFromCricketScore(score.home as CricketInning[]),
    away: extractCricketInningFromCricketScore(score.away as CricketInning[]),
  };
}

function extractCurrentTimeFromCricketFixtureFragment({
  currentTime,
}: CricketFixtureFragment): CricketTime | undefined {
  if (!currentTime) return undefined;

  return {
    inning: currentTime.inning ?? 0,
    over: currentTime.over ?? 0,
  };
}

function mapCricketFixtureUpdates(scaUpdates: ScaUpdatesQuery): CricketFixtureUpdatesResult {
  if (!scaUpdates.cricket?.fixture) return null;

  const result: CricketFixtureUpdatesResult = {};

  scaUpdates.cricket.fixture.forEach((cricketFixture) => {
    if (!cricketFixture) return;

    const fixtureURN = cricketFixture.id && codecs.fixture.encode(cricketFixture.id)?.uid;

    if (!fixtureURN) return;

    result[fixtureURN] = {
      score: extractScoreFromCricketFixtureFragment(cricketFixture),
      currentTeamBatting: cricketFixture.currentTeamBatting ? TeamSide[cricketFixture.currentTeamBatting] : undefined,
      currentTime: extractCurrentTimeFromCricketFixtureFragment(cricketFixture),
    };
  });

  return result;
}

function extractCurrentSetFromTableTennisFixtureFragment({
  currentSet,
}: TableTennisFixtureFragment): TableTennisSet | undefined {
  if (currentSet === null) {
    return undefined;
  }
  const { currentServer, number, score } = currentSet;

  return {
    currentServer: currentServer || undefined,
    number,
    score,
  };
}

function extractPreviousSetsFromTableTennisFixtureFragment({
  previousSets,
}: TableTennisFixtureFragment): TableTennisSet[] | undefined {
  if (!previousSets) {
    return [];
  }

  return previousSets.map((set) => {
    if (!set) {
      return {};
    }
    const { home, away } = set.score;

    return {
      currentServer: set.currentServer || undefined,
      number: set.number,
      score: { home, away },
    };
  });
}

function mapTableTennisFixtureUpdates(scaUpdates: ScaUpdatesQuery): TableTennisFixtureUpdatesResult {
  if (!scaUpdates?.tableTennis?.fixture) return null;

  const result: TableTennisFixtureUpdatesResult = {};
  scaUpdates.tableTennis.fixture.forEach((fixture) => {
    if (!fixture) return;

    const fixtureURN = fixture.id && codecs.fixture.encode(fixture.id)?.uid;
    if (!fixtureURN) return;

    result[fixtureURN] = {
      currentSet: extractCurrentSetFromTableTennisFixtureFragment(fixture),
      previousSets: extractPreviousSetsFromTableTennisFixtureFragment(fixture),
      setsWon: fixture.setsWon || undefined,
    };
  });

  return result;
}

function extractScoreFromSnookerFixtureFragment(fixture: SnookerFixtureFragment): SnookerScore | undefined {
  return fixture?.score || undefined;
}

function mapSnookerFixtureUpdates(scaUpdates: ScaUpdatesQuery): SnookerFixtureUpdatesResult {
  if (!scaUpdates?.snooker?.fixture) return null;

  const result: SnookerFixtureUpdatesResult = {};

  scaUpdates.snooker.fixture.forEach((fixture) => {
    const fixtureURN = fixture?.id && codecs.fixture.encode(fixture?.id)?.uid;

    if (!fixture || !fixtureURN) return;

    result[fixtureURN] = {
      score: extractScoreFromSnookerFixtureFragment(fixture),
    };
  });

  return result;
}

function mapRacesStatusAndResultTypeUpdates(scaUpdates: ScaUpdatesQuery): RaceStatusAndResultTypeUpdatesResult {
  const result: RaceStatusAndResultTypeUpdatesResult = {};

  if (!scaUpdates?.horseRacing?.race) return result;

  scaUpdates.horseRacing.race.forEach((race) => {
    const raceURN = race?.id && codecs.race.encode(race?.id)?.uid;

    if (!raceURN || !race) return;

    result[raceURN] = {
      status: race.details?.status ? RaceStatus[race.details.status] : undefined,
      ...(race.details?.resultType && { resultType: race.details.resultType }),
    };
  });

  return result;
}

function extractCurrentSetFromVolleyballFixtureFragment(fixture: VolleyballFixtureFragment): VolleyballSet | undefined {
  if (!fixture?.currentSet) return undefined;

  const { number, score, currentServer } = fixture.currentSet;

  return {
    number: number ?? undefined,
    score: score ? { home: score.home, away: score.away } : undefined,
    currentServer: currentServer ? TeamSide[currentServer] : undefined,
  };
}

function extractPreviousSetsFromVolleyballFixtureFragment(
  fixture: VolleyballFixtureFragment,
): VolleyballSet[] | undefined {
  if (!fixture?.previousSets) return undefined;

  return fixture.previousSets.reduce<VolleyballSet[]>((acc, set) => {
    if (set) {
      acc.push({
        number: set.number ?? undefined,
        score: set.score ? { home: set.score.home, away: set.score.away } : undefined,
        currentServer: set.currentServer ? TeamSide[set.currentServer] : undefined,
      });
    }
    return acc;
  }, []);
}

function mapVolleyballFixtureUpdates(scaUpdates: ScaUpdatesQuery): VolleyballFixtureUpdatesResult {
  if (!scaUpdates?.volleyball?.fixture) return null;

  const result: VolleyballFixtureUpdatesResult = {};

  scaUpdates.volleyball.fixture.forEach((fixture) => {
    const fixtureURN = fixture?.id && codecs.fixture.encode(fixture?.id)?.uid;

    if (!fixture || !fixtureURN) return;

    result[fixtureURN] = {
      homeScore: fixture.homeScore ?? undefined,
      awayScore: fixture.awayScore ?? undefined,
      currentSet: extractCurrentSetFromVolleyballFixtureFragment(fixture),
      previousSets: extractPreviousSetsFromVolleyballFixtureFragment(fixture),
    };
  });

  return result;
}

export {
  mapAmericanFootballFixtureUpdates,
  mapBaseballFixtureUpdates,
  mapBasketballFixtureUpdates,
  mapCricketFixtureUpdates,
  mapDartsFixtureUpdates,
  mapFootballFixtureUpdates,
  mapRacesStatusAndResultTypeUpdates,
  mapTableTennisFixtureUpdates,
  mapTennisFixtureUpdates,
  mapIceHockeyFixtureUpdates,
  mapRugbyUnionFixtureUpdates,
  mapRugbyLeagueFixtureUpdates,
  mapSnookerFixtureUpdates,
  mapVolleyballFixtureUpdates,
  mapAustralianRulesFixtureUpdates,
};
