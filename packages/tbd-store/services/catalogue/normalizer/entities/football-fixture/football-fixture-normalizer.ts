import {
  AvBScore,
  Clock,
  FixtureForm,
  FixtureOutcome,
  FixtureTeamSide,
  FootballFixture,
  FootballIncident,
  FootballIncidentDetails,
  FootballMatchDuration,
  FootballMatchPeriod,
  FootballMatchStatus,
  GoalIncident,
  PenaltyScore,
  PenaltyShootout,
  PenaltyStatus,
  TeamDetails,
  TeamForm,
  FoulIncident,
  FoulIncidentType,
  GoalIncidentType,
  PenaltyIncident,
  PenaltyIncidentType,
  PenaltyShootoutIncident,
  PenaltyShootoutIncidentType,
  PeriodIncident,
  PeriodIncidentType,
  SetPieceIncident,
  SetPieceIncidentType,
  ShotIncident,
  ShotIncidentType,
  SubstitutionIncident,
  FootballPlayerStartingType,
  FootballPlayerPosition,
  AttackIncident,
  AttackIncidentType,
  CardIncident,
  CardIncidentType,
  FootballMatchStats,
  FootballParticipantStats,
} from "../../../../../state/entities";
import {
  FootballFixtureFragment,
  FootballFixtureWithRecentFormFragment,
  FootballIncidentFragment,
  FootballMatchDuration as FootballMatchDurationFragment,
  Clock as ClockFragment,
  AvbScore as AvbScoreFragment,
  FootballFixturePenaltyShootout as FootballFixturePenaltyShootoutFragment,
  PenaltyScore as PenaltyScoreFragment,
  FootballFixtureForm as FootballFixtureFormFragment,
  FootballTeamForm as FootballTeamFormFragment,
  FootballPlayer as GQLFootballPlayer,
  FootballStats as GQLFootballStats,
  FootballFixtureLiteFragment,
  GameStatsFragment,
  TeamLineupCardFragment,
  MatchStatsCardFragment,
  MatchTimelineCardFragment,
  HeadToHeadCardFragment,
  LineupFootballPlayerFragment,
  FootballFixtureTeamsJerseysFragment,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import {
  isAttackIncident,
  isCardIncident,
  isFoulIncident,
  isGoalIncident,
  isPenaltyIncident,
  isPenaltyShootoutIncident,
  isPeriodIncident,
  isSetPieceIncident,
  isShotIncident,
  isSubstitutionIncident,
} from "../../../catalogue-types";
import { FootballPlayer } from "../../../../../state/entities/football-player-fixture-context/FootballPlayerFixtureContext.types";

type Maybe<T> = T | null | undefined;

function normalizeClock(clock: ClockFragment | null): Clock | undefined {
  if (!clock || clock.minute == null) {
    return undefined;
  }

  return {
    __typename: "Clock",
    minute: clock.minute,
    second: clock.second ? clock.second : undefined,
  };
}

function normalizeDuration(duration: FootballMatchDurationFragment): FootballMatchDuration | undefined {
  if (!duration) {
    return undefined;
  }

  return {
    period: duration.period ? FootballMatchPeriod[duration.period] : undefined,
    status: duration.status ? FootballMatchStatus[duration.status] : undefined,
    stoppageMinutes: duration.stoppageMinutes ? duration.stoppageMinutes : undefined,
    clock: normalizeClock(duration.clock),
  };
}

function normalizeScore(score: AvbScoreFragment | null): AvBScore | undefined {
  if (!score || score.home == null || score.away == null) {
    return undefined;
  }

  return {
    home: score.home,
    away: score.away,
  };
}

function normalizeFootballPlayer(player: Maybe<GQLFootballPlayer>): FootballPlayer | undefined {
  if (player && player.id && player.name && player.startingType) {
    return {
      __typename: "FootballPlayer",
      id: player.id,
      name: player.name,
      startingType: FootballPlayerStartingType[player.startingType],
      shirtNumber: player.shirtNumber ? player.shirtNumber : undefined,
      position: player.position ? FootballPlayerPosition[player.position] : undefined,
    };
  }
  return undefined;
}

function normalizeIncidentDetails(details: FootballIncidentFragment["details"]): {
  typename: Maybe<string>;
  details: Maybe<FootballIncidentDetails>;
} {
  let result;

  if (isGoalIncident(details) && details.side && details.goalType) {
    const goalIncident: GoalIncident = {
      __typename: details.__typename,
      goalType: GoalIncidentType[details.goalType],
      side: FixtureTeamSide[details.side],
      goalScorer: normalizeFootballPlayer(details.goalScorer),
      assist: normalizeFootballPlayer(details.assist),
    };
    result = goalIncident;
  }

  if (isCardIncident(details) && details.side && details.cardType) {
    const cardIncident: CardIncident = {
      __typename: details.__typename,
      cardType: CardIncidentType[details.cardType],
      side: FixtureTeamSide[details.side],
      player: normalizeFootballPlayer(details.player),
    };
    result = cardIncident;
  }

  if (isSubstitutionIncident(details) && details.side) {
    const substitutionIncident: SubstitutionIncident = {
      __typename: details.__typename,
      side: FixtureTeamSide[details.side],
      playerIn: normalizeFootballPlayer(details.playerIn),
      playerOut: normalizeFootballPlayer(details.playerOut),
    };
    result = substitutionIncident;
  }

  if (isPenaltyIncident(details) && details.side && details.penaltyType) {
    const penaltyIncident: PenaltyIncident = {
      __typename: details.__typename,
      side: FixtureTeamSide[details.side],
      penaltyType: PenaltyIncidentType[details.penaltyType],
    };
    result = penaltyIncident;
  }

  if (isPenaltyShootoutIncident(details) && details.side && details.penaltyShootoutType) {
    const penaltyShootoutIncident: PenaltyShootoutIncident = {
      __typename: details.__typename,
      side: FixtureTeamSide[details.side],
      player: normalizeFootballPlayer(details.player),
      penaltyShootoutType: PenaltyShootoutIncidentType[details.penaltyShootoutType],
    };
    result = penaltyShootoutIncident;
  }

  if (isPeriodIncident(details) && details.period && details.status && details.periodType) {
    const periodIncident: PeriodIncident = {
      __typename: details.__typename,
      injuryTime: details?.injuryTime ?? undefined,
      period: FootballMatchPeriod[details.period],
      status: FootballMatchStatus[details.status],
      periodType: PeriodIncidentType[details.periodType],
    };
    result = periodIncident;
  }

  if (isShotIncident(details) && details.side && details.shotType) {
    const shotIncident: ShotIncident = {
      __typename: details.__typename,
      side: FixtureTeamSide[details.side],
      player: normalizeFootballPlayer(details.player),
      shotType: ShotIncidentType[details.shotType],
    };
    result = shotIncident;
  }

  if (isSetPieceIncident(details) && details.side && details.setPieceType) {
    const setPieceIncident: SetPieceIncident = {
      __typename: details.__typename,
      side: FixtureTeamSide[details.side],
      setPieceType: SetPieceIncidentType[details.setPieceType],
    };
    result = setPieceIncident;
  }
  if (isFoulIncident(details) && details.side && details.foulType) {
    const foulIncident: FoulIncident = {
      __typename: details.__typename,
      side: FixtureTeamSide[details.side],
      player: normalizeFootballPlayer(details.player),
      foulType: FoulIncidentType[details.foulType],
    };
    result = foulIncident;
  }

  if (isAttackIncident(details) && details.side && details.attackType) {
    const attackIncident: AttackIncident = {
      __typename: details.__typename,
      side: FixtureTeamSide[details.side],
      attackType: AttackIncidentType[details.attackType],
    };
    result = attackIncident;
  }

  return { typename: details?.__typename, details: result };
}

function normalizePenaltyScores(penaltyScores: (PenaltyScoreFragment | null)[]): PenaltyScore[] {
  if (!penaltyScores) {
    return [];
  }

  return penaltyScores.reduce((acc, penaltyScore): PenaltyScore[] => {
    if (penaltyScore && penaltyScore.side && penaltyScore.shotResult) {
      acc.push({
        penaltyNumber: penaltyScore.penaltyNumber ? penaltyScore.penaltyNumber : undefined,
        side: FixtureTeamSide[penaltyScore.side],
        shotResult: PenaltyStatus[penaltyScore.shotResult],
      });
    }
    return acc;
  }, [] as PenaltyScore[]);
}

function normalizePenaltyShootout(
  penaltyShootout: FootballFixturePenaltyShootoutFragment,
): PenaltyShootout | undefined {
  if (!penaltyShootout) {
    return undefined;
  }

  return {
    firstTeamToShoot: penaltyShootout.firstTeamToShoot ? FixtureTeamSide[penaltyShootout.firstTeamToShoot] : undefined,
    nextTeamToShoot: penaltyShootout.nextTeamToShoot ? FixtureTeamSide[penaltyShootout.nextTeamToShoot] : undefined,
    penaltyFormat: penaltyShootout.penaltyFormat ? penaltyShootout.penaltyFormat : undefined,
    penaltyScores: penaltyShootout.penaltyScores ? normalizePenaltyScores(penaltyShootout.penaltyScores) : [],
  };
}

function normalizeTeamForm(formItem: FootballTeamFormFragment | null): TeamForm | null {
  if (formItem && formItem.opponent && formItem.outcome && formItem.side && formItem.startAt) {
    return {
      opponent: formItem.opponent,
      outcome: FixtureOutcome[formItem.outcome],
      startAt: new Date(formItem.startAt),
      side: FixtureTeamSide[formItem.side],
      score: normalizeScore(formItem.score),
      extraTimeScore: normalizeScore(formItem.extraTimeScore),
      penaltyShootoutScore: normalizeScore(formItem.penaltyShootoutScore),
    };
  }

  return null;
}

function normalizeTeamFormList(formItems: (FootballTeamFormFragment | null)[] | null): TeamForm[] {
  if (!formItems) {
    return [];
  }

  return formItems
    .reduce<TeamForm[]>((acc, value) => {
      const teamForm = normalizeTeamForm(value);

      if (teamForm) {
        acc.push(teamForm);
      }

      return acc;
    }, [])
    .slice(0, 5);
}

function normalizeRecentForm(recentForm: FootballFixtureFormFragment): FixtureForm | undefined {
  if (!recentForm) {
    return undefined;
  }

  return {
    away: normalizeTeamFormList(recentForm.away),
    home: normalizeTeamFormList(recentForm.home),
  };
}

function normalizeIncidents(gqlIncidents: (FootballIncidentFragment | null)[]): FootballIncident[] | undefined {
  const incidents: FootballIncidentFragment[] = gqlIncidents.filter(
    (incident: FootballIncidentFragment | null): incident is FootballIncidentFragment => incident !== null,
  ); // remove nullables

  if (!incidents?.length) {
    return undefined;
  }

  return incidents.reduce((acc: FootballIncident[], incident): FootballIncident[] => {
    if (incident?.period && incident.periodStatus && incident.details) {
      const clock = normalizeClock(incident.clock);
      const details = normalizeIncidentDetails(incident.details);

      if (clock && details?.typename && details?.details) {
        acc.push({
          __typename: "FootballIncident",
          clock,
          period: FootballMatchPeriod[incident.period],
          periodStatus: FootballMatchStatus[incident.periodStatus],
          type: details.typename,
          details: details.details,
        });
      }
    }
    return acc;
  }, []);
}

type FixtureOpponent =
  | TeamLineupCardFragment["fixture"]["home" | "away"]
  | FootballFixtureFragment["home" | "away"]
  | FootballFixtureWithRecentFormFragment["home" | "away"]
  | FootballFixtureLiteFragment["home" | "away"]
  | FootballFixtureTeamsJerseysFragment["home" | "away"];

function normalizeTeamDetails(opponent: FixtureOpponent): TeamDetails {
  const color = "color" in opponent && opponent.color;
  const crest = "crest" in opponent && opponent.crest;
  const name = "name" in opponent ? opponent.name : undefined;
  const id = "id" in opponent ? opponent.id : undefined;
  const jerseys = "jerseys" in opponent ? opponent.jerseys : undefined;
  const statsAllSeason = "statsAllSeason" in opponent ? opponent.statsAllSeason : undefined;

  const mappedOpponent: TeamDetails = {
    id: id ? Number(id) : undefined,
    name,
    color: color ? `#${color}` : undefined,
    crest: crest
      ? {
          vector: crest.vector || undefined,
          small: crest.small || undefined,
          medium: crest.medium || undefined,
          large: crest.large || undefined,
        }
      : undefined,
    jerseys: jerseys
      ? jerseys.map((jersey: any) => ({
          color: jersey?.color ? `#${jersey.color}` : undefined,
          url: jersey?.url || undefined,
          type: jersey?.type || undefined,
        }))
      : undefined,
    statsAllSeason: statsAllSeason?.matchesPlayed ? statsAllSeason : undefined,
  };

  if ("squad" in opponent) {
    const players = opponent.squad?.players?.reduce(
      (
        acc: FootballPlayer[],
        gqlPlayer: Maybe<LineupFootballPlayerFragment | Omit<GQLFootballPlayer, "seasonStats" | "formationPlace">>,
      ): FootballPlayer[] => {
        let player;

        if (gqlPlayer && gqlPlayer.id && gqlPlayer.name && gqlPlayer.startingType) {
          player = {
            __typename: "FootballPlayer",
            id: gqlPlayer.id,
            name: gqlPlayer.name,
            startingType: FootballPlayerStartingType[gqlPlayer.startingType],
            shirtNumber: gqlPlayer.shirtNumber ? gqlPlayer.shirtNumber : undefined,
            position: gqlPlayer.position ? FootballPlayerPosition[gqlPlayer.position] : undefined,
          };
        }

        return player ? [...acc, player] : acc;
      },
      [],
    );
    mappedOpponent.squad = {
      manager: opponent.squad?.manager || undefined,
      players,
    };
  }

  return mappedOpponent;
}

function transformGQLTeamStatsToTeamStats(teamStats: Maybe<GameStatsFragment>): FootballParticipantStats | undefined {
  if (!teamStats) return undefined;
  return {
    __typename: "FootballGameStats",
    possession: teamStats.possession ?? undefined,
    corners: teamStats.corners ?? undefined,
    yellowCards: teamStats.yellowCards ?? undefined,
    redCards: teamStats.redCards ?? undefined,
    offsides: teamStats.offsides ?? undefined,
    fouls: teamStats.fouls ?? undefined,
    throwIns: teamStats.throwIns ?? undefined,
    freeKicks: teamStats.freeKicks ?? undefined,
    goalKicks: teamStats.goalKicks ?? undefined,
    blockedShots: teamStats.blockedShots ?? undefined,
    dangerousAttacks: teamStats.dangerousAttacks ?? undefined,
    shotsOnTarget: teamStats.shotsOnTarget ?? undefined,
    shotsOffTarget: teamStats.shotsOffTarget ?? undefined,
    goals: teamStats.goals ?? undefined,
  };
}

function normalizeStats(footballStats: Maybe<Maybe<GQLFootballStats>[]>): FootballMatchStats[] | undefined {
  if (!footballStats?.length) return undefined;
  return footballStats.reduce<FootballMatchStats[]>((acc, matchStats) => {
    if (matchStats?.periodStatus) {
      acc.push({
        __typename: "FootballStats",
        periodStatus: FootballMatchStatus[matchStats.periodStatus],
        period: matchStats.period ? FootballMatchPeriod[matchStats.period] : undefined,
        home: transformGQLTeamStatsToTeamStats(matchStats.home),
        away: transformGQLTeamStatsToTeamStats(matchStats.away),
      });
    }
    return acc;
  }, []);
}

const normalizeFootballFixtureFragmentIntoFootballFixture = (
  fragment:
    | FootballFixtureFragment
    | FootballFixtureWithRecentFormFragment
    | FootballFixtureLiteFragment
    | TeamLineupCardFragment["fixture"]
    | MatchStatsCardFragment["footballFixture"]
    | MatchTimelineCardFragment["footballFixture"]
    | HeadToHeadCardFragment["footballFixture"],
): TransformedFragment<FootballFixture> => {
  const { urn, home, away } = fragment;
  const __typename = "__typename" in fragment ? fragment.__typename : "FootballFixture";
  const scheduledAt = "scheduledAt" in fragment ? fragment.scheduledAt : undefined;
  const startedAt = "startedAt" in fragment ? fragment.startedAt : undefined;
  const duration = "duration" in fragment ? fragment.duration : undefined;
  const runnerNames = "runnerNames" in fragment ? fragment.runnerNames : undefined;
  const isAmericanFormat = "isAmericanFormat" in fragment ? fragment.isAmericanFormat : undefined;

  let recentForm;
  let head2head;
  let score;
  let incidents;
  let firstLegScore;
  let penaltyShootout;
  let stats;

  if ("recentForm" in fragment) {
    ({ recentForm } = fragment);
  }
  if ("head2head" in fragment) {
    ({ head2head } = fragment);
  }
  if ("score" in fragment) {
    ({ score, firstLegScore, penaltyShootout } = fragment);
  }
  if ("incidents" in fragment) {
    ({ incidents } = fragment);
  }
  if ("stats" in fragment) {
    ({ stats } = fragment);
  }

  return {
    data: {
      urn,
      typename: __typename,
      ...(home ? { home: normalizeTeamDetails(home) } : {}),
      ...(away ? { away: normalizeTeamDetails(away) } : {}),
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      startedAt: startedAt ? new Date(startedAt) : undefined,
      isAmericanFormat,
      ...(runnerNames && { runnerNames }),
      ...(duration ? { duration: normalizeDuration(duration) } : {}),
      ...(score ? { score: normalizeScore(score) } : {}),
      ...(firstLegScore ? { firstLegScore: normalizeScore(firstLegScore) } : {}),
      ...(penaltyShootout ? { penaltyShootout: normalizePenaltyShootout(penaltyShootout) } : {}),
      ...(recentForm ? { recentForm: normalizeRecentForm(recentForm) } : {}),
      ...(head2head ? { head2head: normalizeRecentForm(head2head) } : {}),
      ...(incidents ? { incidents: normalizeIncidents(incidents as FootballIncidentFragment[]) } : {}),
      ...(stats ? { stats: normalizeStats(stats as Maybe<Maybe<GQLFootballStats>[]>) } : {}),
    },
  };
};

export default normalizeFootballFixtureFragmentIntoFootballFixture;
