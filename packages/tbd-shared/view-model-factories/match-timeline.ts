import {
  AttackIncident,
  AvBScore,
  CardIncident,
  FixtureTeamSide,
  FootballFixture,
  FootballIncident,
  FootballMatchDuration,
  FootballMatchPeriod,
  FootballMatchStats,
  FootballMatchStatus,
  FoulIncident,
  FoulIncidentType,
  GoalIncident,
  GoalIncidentType,
  PenaltyIncident,
  PenaltyIncidentType,
  PeriodIncident,
  PeriodIncidentType,
  SetPieceIncident,
  SetPieceIncidentType,
  ShotIncident,
  ShotIncidentType,
  SubstitutionIncident,
  TeamDetails,
} from "@ppb/tbd-store/state/entities/football-fixture/FootballFixture.types";

import { BarStatProps, HeadToHeadResultProps, HeadToHeadResultViewMode } from "@ppb/the-wall-common/types";

import { createSelector } from "reselect";

import { IncidentEventsProps } from "../components/MatchTimelineCard/snowflakes/IncidentEvents/IncidentEvents.types";
import {
  IncidentDisplayOrder,
  IncidentProps,
} from "../components/MatchTimelineCard/snowflakes/Incident/Incident.types";
import {
  MatchTimelineDetailsProps,
  MatchTimelineDetailsStats,
} from "../components/MatchTimelineCard/snowflakes/MatchTimelineDetails/MatchTimelineDetails.types";
import {
  MatchTimelineIncident,
  MatchTimelineProps,
  MatchTimelineViewMode,
} from "../components/MatchTimelineCard/snowflakes/MatchTimeline/MatchTimeline.types";
import { CardNotificationType } from "../components/MatchTimelineCard/snowflakes/MinuteIncidents/snowflakes/CardNotification/CardNotification.types";
import {
  MinuteIncidentsEventType,
  MinuteIncidentsProps,
  MinuteIncidentsType,
} from "../components/MatchTimelineCard/snowflakes/MinuteIncidents/MinuteIncidents.types";
import {
  TimelineBarIncident,
  TimelineBarProps,
  TimelineBarViewMode,
} from "../components/MatchTimelineCard/snowflakes/TimelineBar/TimelineBar.types";

import { i18n } from "../helpers/i18n";
import {
  ATTACK_INCIDENT,
  CARD_INCIDENT,
  CARD_RED,
  CARD_SECOND_YELLOW,
  CARD_YELLOW,
  FOUL_INCIDENT,
  getIconTypeForIncident,
  getIncidentType,
  GOAL,
  GOAL_INCIDENT,
  OWN_GOAL,
  PENALTY,
  PENALTY_INCIDENT,
  PENALTY_SCORED,
  PERIOD_INCIDENT,
  SET_PIECE_INCIDENT,
  SHOT_INCIDENT,
  SUBSTITUTION_INCIDENT,
} from "./football-incidents";

const FOOTBALL_REGULAR_PERIOD = 45;
const FOOTBALL_EXTRA_PERIOD = 15;
const FOOTBALL_REGULAR_TIME = 90;
const timelineIncidents = [CARD_INCIDENT, GOAL_INCIDENT];

type TimelineIncidents = [TimelineBarIncident[], TimelineBarIncident[], TimelineBarIncident[], TimelineBarIncident[]];

export type PeriodMinuteIncidents = {
  minutesByMinutesFirstHalf: MinuteIncidentsProps[];
  minutesByMinutesSecondHalf: MinuteIncidentsProps[];
  minutesByMinutesExtraTimeFH: MinuteIncidentsProps[];
  minutesByMinutesExtraTimeSH: MinuteIncidentsProps[];
};

export type PeriodMatchStats = {
  matchStatsHalfTime?: MatchTimelineDetailsStats;
  matchStatsFullTime?: MatchTimelineDetailsStats;
  matchStatsExtraFH?: MatchTimelineDetailsStats;
  matchStatsExtraEnd?: MatchTimelineDetailsStats;
};

// Used by the MatchTimeline component
function getLastIncidentToBeNotified(incidents: FootballIncident[]): FootballIncident | undefined {
  return incidents.find((incident) => {
    const goalIncidentDetails = incident.details as GoalIncident;
    const cardIncidentDetails = incident.details as CardIncident;
    switch (incident.type) {
      case GOAL_INCIDENT:
        if (
          goalIncidentDetails &&
          goalIncidentDetails.goalScorer &&
          goalIncidentDetails.goalType !== GoalIncidentType.CANCELLED &&
          goalIncidentDetails.goalType !== GoalIncidentType.POSSIBLE
        ) {
          return true;
        }
        break;
      case CARD_INCIDENT:
        if (cardIncidentDetails && cardIncidentDetails.player) {
          return true;
        }
        break;
      default:
        return false;
    }
    return false;
  });
}

// Transform an FootballIncident to a MatchTimelineIncident
function toTimelineIncident(incident: FootballIncident, homeTeam = "", awayTeam = ""): MatchTimelineIncident {
  const goalIncidentDetails = incident.details as GoalIncident;
  const cardIncidentDetails = incident.details as CardIncident;
  let goalScorer = "";
  let cardPlayer = "";
  let teamName = "";
  if (goalIncidentDetails && goalIncidentDetails.goalScorer?.name) {
    goalScorer = goalIncidentDetails.goalScorer.name;
    teamName = goalIncidentDetails.side === FixtureTeamSide.HOME ? homeTeam : awayTeam;
  }
  if (cardIncidentDetails && cardIncidentDetails.player?.name) {
    cardPlayer = cardIncidentDetails.player.name;
    teamName = cardIncidentDetails.side === FixtureTeamSide.HOME ? homeTeam : awayTeam;
  }
  const incidentIcon = getIconTypeForIncident(incident);
  const incidentToBeReturned: MatchTimelineIncident = {
    minute: incident.clock.minute + 1,
    extraMinutes: incident.clockExtraMinutes,
    label: "",
    player: "",
    team: "",
  };

  if (incidentIcon) {
    incidentToBeReturned.icon = incidentIcon;
  }

  const incidentType = getIncidentType(incident);
  switch (incidentType) {
    case GOAL:
      incidentToBeReturned.label = i18n({ key: "I18N.MATCH_TIMELINE.GOAL" });
      incidentToBeReturned.player = goalScorer;
      incidentToBeReturned.team = teamName;
      break;
    case OWN_GOAL:
      incidentToBeReturned.label = i18n({ key: "I18N.MATCH_TIMELINE.OWN_GOAL" });
      incidentToBeReturned.player = goalScorer;
      incidentToBeReturned.team = teamName;
      break;
    case PENALTY:
    case PENALTY_SCORED:
      incidentToBeReturned.label = i18n({ key: "I18N.MATCH_TIMELINE.PENALTY_GOAL" });
      incidentToBeReturned.player = goalScorer;
      incidentToBeReturned.team = teamName;
      break;
    case CARD_YELLOW:
      incidentToBeReturned.label = i18n({ key: "I18N.MATCH_TIMELINE.CARD_YELLOW" });
      incidentToBeReturned.player = cardPlayer;
      incidentToBeReturned.team = teamName;
      break;
    case CARD_RED:
      incidentToBeReturned.label = i18n({ key: "I18N.MATCH_TIMELINE.CARD_RED" });
      incidentToBeReturned.player = cardPlayer;
      incidentToBeReturned.team = teamName;
      break;
    case CARD_SECOND_YELLOW:
      incidentToBeReturned.label = i18n({ key: "I18N.MATCH_TIMELINE.CARD_SECOND_YELLOW" });
      incidentToBeReturned.player = cardPlayer;
      incidentToBeReturned.team = teamName;
      break;
    default:
  }

  return incidentToBeReturned;
}

function getIncidentsForTimelines(incidents: FootballIncident[]): TimelineIncidents {
  return incidents.reduce(
    (acc: TimelineIncidents, incident: FootballIncident) => {
      let timelineIndex = 0;
      let timelineMinute = incident.clock.minute;
      const icon = getIconTypeForIncident(incident);
      // do not return incidents that don`t have an icon
      if (icon) {
        if (
          incident.period === FootballMatchPeriod.REGULAR &&
          incident.periodStatus !== FootballMatchStatus.INPLAY_FIRST_HALF
        ) {
          timelineIndex = 1;
          timelineMinute = incident.clock.minute - FOOTBALL_REGULAR_PERIOD;
        } else if (
          incident.period === FootballMatchPeriod.EXTRA &&
          incident.periodStatus === FootballMatchStatus.INPLAY_FIRST_HALF
        ) {
          timelineIndex = 2;
          timelineMinute = incident.clock.minute - FOOTBALL_REGULAR_TIME;
          if (incident.clock.minute - FOOTBALL_REGULAR_TIME > FOOTBALL_EXTRA_PERIOD) {
            timelineMinute = FOOTBALL_EXTRA_PERIOD;
          }
        } else if (incident.period === FootballMatchPeriod.EXTRA) {
          timelineIndex = 3;
          timelineMinute = incident.clock.minute - (FOOTBALL_REGULAR_TIME + FOOTBALL_EXTRA_PERIOD);
          if (incident.clock.minute - (FOOTBALL_REGULAR_TIME + FOOTBALL_EXTRA_PERIOD) > FOOTBALL_EXTRA_PERIOD) {
            timelineMinute = FOOTBALL_EXTRA_PERIOD;
          }
        }
        acc[timelineIndex].push({
          minute: timelineMinute,
          icon,
        });
      }
      return acc;
    },
    [[], [], [], []],
  );
}

function getHomeOrAwayIncidents(incidents: FootballIncident[], side: FixtureTeamSide): FootballIncident[] {
  return incidents.filter((incident) => {
    const goalIncidentDetails = incident.details as GoalIncident;
    if (goalIncidentDetails) {
      return goalIncidentDetails.side === side;
    }
    return false;
  });
}

function getMinutesForTimeline(currentMinute: number, passedPeriodMinute: number, periodMinute: number): number {
  if (currentMinute - passedPeriodMinute > periodMinute) {
    return periodMinute;
  }
  return currentMinute - passedPeriodMinute;
}

function getTimelines(duration: FootballMatchDuration, incidents: FootballIncident[]): TimelineBarProps[] {
  const timelinesToReturn: TimelineBarProps[] = [];

  let homeTimelineIncidents: TimelineIncidents = [[], [], [], []];
  let awayTimelineIncidents: TimelineIncidents = [[], [], [], []];
  if (incidents) {
    const whitelistedIncidents = incidents.filter((incident) => timelineIncidents.includes(incident.type));
    const homeIncidents = getHomeOrAwayIncidents(whitelistedIncidents, FixtureTeamSide.HOME);
    const awayIncidents = getHomeOrAwayIncidents(whitelistedIncidents, FixtureTeamSide.AWAY);

    homeTimelineIncidents = getIncidentsForTimelines(homeIncidents);
    awayTimelineIncidents = getIncidentsForTimelines(awayIncidents);
  }

  const timelineMinutes = [0, 0, 0, 0];
  const minute = duration.clock ? duration.clock.minute : 0;
  switch (duration.status) {
    case FootballMatchStatus.INPLAY_FIRST_HALF:
      if (duration.period === FootballMatchPeriod.REGULAR) {
        timelineMinutes[0] = minute;
      } else {
        timelineMinutes[0] = FOOTBALL_REGULAR_PERIOD;
        timelineMinutes[1] = FOOTBALL_REGULAR_PERIOD;
        timelineMinutes[2] = getMinutesForTimeline(minute, FOOTBALL_REGULAR_TIME, FOOTBALL_EXTRA_PERIOD);
      }
      break;
    case FootballMatchStatus.HALF:
      if (duration.period === FootballMatchPeriod.REGULAR) {
        timelineMinutes[0] = FOOTBALL_REGULAR_PERIOD;
      } else {
        timelineMinutes[0] = FOOTBALL_REGULAR_PERIOD;
        timelineMinutes[1] = FOOTBALL_REGULAR_PERIOD;
        timelineMinutes[2] = FOOTBALL_EXTRA_PERIOD;
      }
      break;
    case FootballMatchStatus.INPLAY_SECOND_HALF:
      if (duration.period === FootballMatchPeriod.REGULAR) {
        timelineMinutes[0] = FOOTBALL_REGULAR_PERIOD;
        timelineMinutes[1] = minute - FOOTBALL_REGULAR_PERIOD;
      } else {
        timelineMinutes[0] = FOOTBALL_REGULAR_PERIOD;
        timelineMinutes[1] = FOOTBALL_REGULAR_PERIOD;
        timelineMinutes[2] = FOOTBALL_EXTRA_PERIOD;
        timelineMinutes[3] = getMinutesForTimeline(
          minute,
          FOOTBALL_REGULAR_TIME + FOOTBALL_EXTRA_PERIOD,
          FOOTBALL_EXTRA_PERIOD,
        );
      }
      break;
    case FootballMatchStatus.END:
    case FootballMatchStatus.FULL:
    case FootballMatchStatus.PENALTY_SHOOTOUT:
      if (duration.period === FootballMatchPeriod.REGULAR) {
        timelineMinutes[0] = FOOTBALL_REGULAR_PERIOD;
        timelineMinutes[1] = FOOTBALL_REGULAR_PERIOD;
      } else {
        timelineMinutes[0] = FOOTBALL_REGULAR_PERIOD;
        timelineMinutes[1] = FOOTBALL_REGULAR_PERIOD;
        timelineMinutes[2] = FOOTBALL_EXTRA_PERIOD;
        timelineMinutes[3] = FOOTBALL_EXTRA_PERIOD;
      }
      break;
    default:
  }

  timelinesToReturn.push(
    {
      periodLength: FOOTBALL_REGULAR_PERIOD,
      minute: timelineMinutes[0],
      homeIncidents: homeTimelineIncidents[0],
      awayIncidents: awayTimelineIncidents[0],
      viewMode: TimelineBarViewMode.NORMAL,
      caption: i18n({ key: "I18N.FOOTBALL_SCOREBOARD.HALF" }),
    },
    {
      periodLength: FOOTBALL_REGULAR_PERIOD,
      minute: timelineMinutes[1],
      homeIncidents: homeTimelineIncidents[1],
      awayIncidents: awayTimelineIncidents[1],
      viewMode: TimelineBarViewMode.NORMAL,
      caption: i18n({ key: "I18N.FOOTBALL_SCOREBOARD.FULL" }),
    },
  );
  if (duration.period === FootballMatchPeriod.EXTRA) {
    timelinesToReturn.push(
      {
        periodLength: FOOTBALL_EXTRA_PERIOD,
        minute: timelineMinutes[2],
        homeIncidents: homeTimelineIncidents[2],
        awayIncidents: awayTimelineIncidents[2],
        viewMode: TimelineBarViewMode.NORMAL,
        caption: i18n({ key: "I18N.FOOTBALL_SCOREBOARD.HALF" }),
      },
      {
        periodLength: FOOTBALL_EXTRA_PERIOD,
        minute: timelineMinutes[3],
        homeIncidents: homeTimelineIncidents[3],
        awayIncidents: awayTimelineIncidents[3],
        viewMode: TimelineBarViewMode.NORMAL,
        caption: i18n({ key: "I18N.FOOTBALL_SCOREBOARD.FULL" }),
      },
    );
  }
  return timelinesToReturn;
}

export function getPropsForMatchTimeline(
  duration: FootballMatchDuration,
  incidents: FootballIncident[],
  home?: TeamDetails,
  away?: TeamDetails,
): MatchTimelineProps | undefined {
  if (duration.status === FootballMatchStatus.PRE_MATCH) {
    return undefined;
  }
  const translations = {
    prematch: i18n({ key: "I18N.MATCH_TIMELINE.PREMATCH" }),
  };

  const lastIncident = incidents ? getLastIncidentToBeNotified(incidents) : undefined;
  const transformedLastIncident = lastIncident ? toTimelineIncident(lastIncident, home?.name, away?.name) : undefined;

  return {
    homeCrest: home?.crest?.vector || home?.crest?.large,
    awayCrest: away?.crest?.vector || away?.crest?.large,
    lastIncident: transformedLastIncident,
    timelines: getTimelines(duration, incidents),
    translations,
    viewMode: MatchTimelineViewMode.CONDENSED,
  };
}

export function getIncidentEvents(incidents: FootballIncident[]): IncidentEventsProps {
  const copyOfIncidents = [...incidents];
  const whitelistedIncidents = copyOfIncidents
    .reverse()
    .filter((incident) => timelineIncidents.includes(incident.type));
  const homeIncidents = getHomeOrAwayIncidents(whitelistedIncidents, FixtureTeamSide.HOME);
  const awayIncidents = getHomeOrAwayIncidents(whitelistedIncidents, FixtureTeamSide.AWAY);

  const homeIncidentsProps = homeIncidents.reduce((acc: IncidentProps[], incident: FootballIncident) => {
    const timelineIncident = toTimelineIncident(incident);
    if (timelineIncident.icon) {
      acc.push({
        icon: timelineIncident.icon,
        minutes: timelineIncident.extraMinutes ? [timelineIncident.extraMinutes] : [],
        player: timelineIncident.player,
        displayOrder: IncidentDisplayOrder.REVERSED,
      });
    }
    return acc;
  }, []);

  const awayIncidentsProps = awayIncidents.reduce((acc: IncidentProps[], incident: FootballIncident) => {
    const timelineIncident = toTimelineIncident(incident);
    if (timelineIncident.icon) {
      acc.push({
        icon: timelineIncident.icon,
        minutes: timelineIncident.extraMinutes ? [timelineIncident.extraMinutes] : [],
        player: timelineIncident.player,
        displayOrder: IncidentDisplayOrder.NORMAL,
      });
    }
    return acc;
  }, []);

  return {
    homeIncidents: homeIncidentsProps,
    awayIncidents: awayIncidentsProps,
  };
}

// used by the MatchTimeline component
function mapFootballIncidentToIncidentNotification(incident: FootballIncident): MinuteIncidentsType | undefined {
  let title = "";
  let description = "";
  let secondDescription = "";
  switch (incident.type) {
    case GOAL_INCIDENT: {
      const goalIncidentDetails = incident.details as GoalIncident;
      if (
        goalIncidentDetails &&
        (goalIncidentDetails.goalType === GoalIncidentType.NORMAL ||
          goalIncidentDetails.goalType === GoalIncidentType.OWN ||
          goalIncidentDetails.goalType === GoalIncidentType.PENALTY)
      ) {
        title = i18n({ key: "I18N.MATCH_TIMELINE.GOAL_NOTIFICATION" });
        if (goalIncidentDetails.goalType === GoalIncidentType.OWN) {
          title = i18n({ key: "I18N.MATCH_TIMELINE.OWN_GOAL_NOTIFICATION" });
        }
        if (goalIncidentDetails.goalScorer && goalIncidentDetails.goalScorer.name) {
          description = goalIncidentDetails.goalScorer.name;
        }
        if (goalIncidentDetails.assist && goalIncidentDetails.assist.name) {
          secondDescription = `${i18n({ key: "I18N.MATCH_TIMELINE.ASSIST" })} ${goalIncidentDetails.assist.name}`;
        }
        return {
          notificationEventType: MinuteIncidentsEventType.GOAL,
          notificationEventProps: {
            title,
            description,
            secondDescription,
            side: goalIncidentDetails.side,
            isOwnGoal: goalIncidentDetails.goalType === GoalIncidentType.OWN,
          },
        };
      }
      break;
    }
    case PENALTY_INCIDENT: {
      const penaltyIncidentDetails = incident.details as PenaltyIncident;
      if (penaltyIncidentDetails && penaltyIncidentDetails.penaltyType === PenaltyIncidentType.AWARDED) {
        return {
          notificationEventType: MinuteIncidentsEventType.TEAM,
          notificationEventProps: {
            title: i18n({ key: "I18N.MATCH_TIMELINE.PENALTY" }),
            side: penaltyIncidentDetails.side,
          },
        };
      }
      break;
    }
    case CARD_INCIDENT: {
      const cardIncidentDetails = incident.details as CardIncident;
      if (cardIncidentDetails) {
        let cardType = CardNotificationType.RED;
        switch (cardIncidentDetails.cardType) {
          case CARD_RED:
            title = i18n({ key: "I18N.MATCH_TIMELINE.CARD_RED" });
            break;
          case CARD_YELLOW:
            title = i18n({ key: "I18N.MATCH_TIMELINE.CARD_YELLOW" });
            cardType = CardNotificationType.YELLOW;
            break;
          case CARD_SECOND_YELLOW:
            title = i18n({ key: "I18N.MATCH_TIMELINE.CARD_SECOND_YELLOW" });
            cardType = CardNotificationType.SECOND_YELLOW;
            break;
          default:
            title = i18n({ key: "I18N.MATCH_TIMELINE.CARD_YELLOW" });
            cardType = CardNotificationType.YELLOW;
        }
        if (cardIncidentDetails.player && cardIncidentDetails.player.name) {
          description = cardIncidentDetails.player.name;
        }
        return {
          notificationEventType: MinuteIncidentsEventType.CARD,
          notificationEventProps: {
            title,
            description,
            side: cardIncidentDetails.side,
            cardType,
          },
        };
      }
      break;
    }
    case SET_PIECE_INCIDENT: {
      const setPieceIncidentDetails = incident.details as SetPieceIncident;
      if (setPieceIncidentDetails) {
        switch (setPieceIncidentDetails.setPieceType) {
          case SetPieceIncidentType.CORNER:
            title = i18n({ key: "I18N.MATCH_TIMELINE.CORNER" });
            break;
          case SetPieceIncidentType.FREE_KICK:
            title = i18n({ key: "I18N.MATCH_TIMELINE.FREE_KICK" });
            break;
          case SetPieceIncidentType.THROW_IN:
            title = i18n({ key: "I18N.MATCH_TIMELINE.THROW_IN" });
            break;
          case SetPieceIncidentType.GOAL_KICK:
            title = i18n({ key: "I18N.MATCH_TIMELINE.GOAL_KICK" });
            break;
          default:
            title = i18n({ key: "I18N.MATCH_TIMELINE.FREE_KICK" });
        }
        return {
          notificationEventType: MinuteIncidentsEventType.TEAM,
          notificationEventProps: {
            title,
            description,
            side: setPieceIncidentDetails.side,
          },
        };
      }
      break;
    }
    case FOUL_INCIDENT: {
      const foulIncidentDetails = incident.details as FoulIncident;
      if (foulIncidentDetails) {
        title =
          foulIncidentDetails.foulType === FoulIncidentType.FOUL
            ? i18n({ key: "I18N.MATCH_TIMELINE.FOUL" })
            : i18n({ key: "I18N.MATCH_TIMELINE.OFFSIDE" });
        if (foulIncidentDetails.player && foulIncidentDetails.player.name) {
          description = foulIncidentDetails.player.name;
        }
        return {
          notificationEventType: MinuteIncidentsEventType.TEAM,
          notificationEventProps: {
            title,
            description,
            side: foulIncidentDetails.side,
          },
        };
      }
      break;
    }
    case ATTACK_INCIDENT: {
      const attackIncidentDetails = incident.details as AttackIncident;
      if (attackIncidentDetails) {
        title = i18n({ key: "I18N.MATCH_TIMELINE.DANGEROUS_ATTACK" });
        return {
          notificationEventType: MinuteIncidentsEventType.TEAM,
          notificationEventProps: {
            title,
            description,
            side: attackIncidentDetails.side,
          },
        };
      }
      break;
    }
    case SHOT_INCIDENT: {
      const shotIncidentDetails = incident.details as ShotIncident;
      if (shotIncidentDetails) {
        switch (shotIncidentDetails.shotType) {
          case ShotIncidentType.OFF_TARGET:
            title = i18n({ key: "I18N.MATCH_TIMELINE.SHOTS_OFF_TARGET" });
            break;
          case ShotIncidentType.OFF_TARGET_BLOCKED:
            title = i18n({ key: "I18N.MATCH_TIMELINE.BLOCKED_SHOT" });
            break;
          case ShotIncidentType.SAVED:
            title = i18n({ key: "I18N.MATCH_TIMELINE.SHOTS_ON_TARGET" });
            break;
          case ShotIncidentType.SAVED_BLOCKED:
            title = i18n({ key: "I18N.MATCH_TIMELINE.BLOCKED_SHOT" });
            break;
          default:
            title = i18n({ key: "I18N.MATCH_TIMELINE.SHOTS_OFF_TARGET" });
        }
        if (shotIncidentDetails.player && shotIncidentDetails.player.name) {
          description = shotIncidentDetails.player.name;
        }
        return {
          notificationEventType: MinuteIncidentsEventType.TEAM,
          notificationEventProps: {
            title,
            description,
            side: shotIncidentDetails.side,
          },
        };
      }
      break;
    }
    case SUBSTITUTION_INCIDENT: {
      const subsIncidentDetails = incident.details as SubstitutionIncident;
      if (subsIncidentDetails) {
        title = i18n({ key: "I18N.MATCH_TIMELINE.SUBSTITUTION" });
        return {
          notificationEventType: MinuteIncidentsEventType.SUBSTITUTION,
          notificationEventProps: {
            title,
            playerIn: subsIncidentDetails.playerIn?.name || "",
            playerOut: subsIncidentDetails.playerOut?.name || "",
            side: subsIncidentDetails.side,
          },
        };
      }
      break;
    }
    case PERIOD_INCIDENT: {
      const periodIncidentDetails = incident.details as PeriodIncident;
      if (periodIncidentDetails.periodType === PeriodIncidentType.INJURY_TIME_UPDATE) {
        title = i18n({ key: "I18N.MATCH_TIMELINE.INJURY_TIME" });
        if (periodIncidentDetails.injuryTime) {
          description = `+${periodIncidentDetails.injuryTime}'`;
        }
      } else {
        switch (periodIncidentDetails.status) {
          case FootballMatchStatus.INPLAY_FIRST_HALF:
            title =
              periodIncidentDetails.period === FootballMatchPeriod.REGULAR
                ? i18n({ key: "I18N.MATCH_TIMELINE.KICK_OFF" })
                : i18n({ key: "I18N.MATCH_TIMELINE.ET_KICK_OFF" });
            break;
          case FootballMatchStatus.INPLAY_SECOND_HALF:
            title =
              periodIncidentDetails.period === FootballMatchPeriod.REGULAR
                ? i18n({ key: "I18N.MATCH_TIMELINE.SECOND_HALF" })
                : i18n({ key: "I18N.MATCH_TIMELINE.ET_SECOND_HALF" });
            description = i18n({ key: "I18N.MATCH_TIMELINE.STARTS" });
            break;
          case FootballMatchStatus.HALF:
            title =
              periodIncidentDetails.period === FootballMatchPeriod.REGULAR
                ? i18n({ key: "I18N.MATCH_TIMELINE.FIRST_HALF" })
                : i18n({ key: "I18N.MATCH_TIMELINE.ET_FIRST_HALF" });
            description = i18n({ key: "I18N.MATCH_TIMELINE.ENDS" });
            break;
          case FootballMatchStatus.FULL:
            title =
              periodIncidentDetails.period === FootballMatchPeriod.REGULAR
                ? i18n({ key: "I18N.MATCH_TIMELINE.SECOND_HALF" })
                : i18n({ key: "I18N.MATCH_TIMELINE.ET_SECOND_HALF" });
            description = i18n({ key: "I18N.MATCH_TIMELINE.ENDS" });
            break;
          default:
            title = "";
        }
      }
      if (periodIncidentDetails.status !== FootballMatchStatus.END) {
        return {
          notificationEventType: MinuteIncidentsEventType.NOTIFICATION,
          notificationEventProps: {
            title,
            description,
          },
        };
      }
      return undefined;
    }
    default:
      return undefined;
  }
  return undefined;
}

function getHeadToHeadProps(score: AvBScore, home?: TeamDetails, away?: TeamDetails): HeadToHeadResultProps {
  return {
    homeTeamName: home?.name,
    awayTeamName: away?.name,
    homeTeamCrest: home?.crest?.vector || home?.crest?.small || "",
    awayTeamCrest: away?.crest?.vector || away?.crest?.small || "",
    score: `${score.home} - ${score.away}`,
    i18n: {
      penalties: i18n({ key: "I18N.HEAD_TO_HEAD.PENALTIES" }),
      aet: i18n({ key: "I18N.HEAD_TO_HEAD.AFTER_EXTRA_TIME" }),
    },
    viewMode: HeadToHeadResultViewMode.MIN,
  };
}

function combineMinuteIncidents(incidents: FootballIncident[]): MinuteIncidentsProps[] {
  const minuteIncidentsProps: MinuteIncidentsProps[] = [];
  incidents.forEach((incident) => {
    const minute = incident.clock.minute + 1;
    const incidentNotificationProps = mapFootballIncidentToIncidentNotification(incident);
    if (incidentNotificationProps) {
      if (minuteIncidentsProps.length === 0) {
        minuteIncidentsProps.push({
          minute,
          events: [incidentNotificationProps],
        });
      } else if (minuteIncidentsProps[minuteIncidentsProps.length - 1].minute === minute) {
        minuteIncidentsProps[minuteIncidentsProps.length - 1].events.push(incidentNotificationProps);
      } else {
        minuteIncidentsProps.push({
          minute,
          events: [incidentNotificationProps],
        });
      }
    }
  });
  return minuteIncidentsProps;
}

export function getMinutesByMinutesEvents(incidents: FootballIncident[]): PeriodMinuteIncidents {
  let minutesByMinutesFirstHalf: MinuteIncidentsProps[] = [];
  let minutesByMinutesSecondHalf: MinuteIncidentsProps[] = [];
  let minutesByMinutesExtraTimeFH: MinuteIncidentsProps[] = [];
  let minutesByMinutesExtraTimeSH: MinuteIncidentsProps[] = [];

  if (incidents.length > 0) {
    const firstHalfIncidents = incidents.filter(
      (incident) =>
        incident.period === FootballMatchPeriod.REGULAR &&
        (incident.periodStatus === FootballMatchStatus.INPLAY_FIRST_HALF ||
          incident.periodStatus === FootballMatchStatus.HALF),
    );
    const secondHalfIncidents = incidents.filter(
      (incident) =>
        incident.period === FootballMatchPeriod.REGULAR &&
        (incident.periodStatus === FootballMatchStatus.INPLAY_SECOND_HALF ||
          incident.periodStatus === FootballMatchStatus.END ||
          incident.periodStatus === FootballMatchStatus.FULL),
    );
    const firstHalfETIncidents = incidents.filter(
      (incident) =>
        incident.period === FootballMatchPeriod.EXTRA &&
        (incident.periodStatus === FootballMatchStatus.INPLAY_FIRST_HALF ||
          incident.periodStatus === FootballMatchStatus.HALF),
    );
    const secondHalfETIncidents = incidents.filter(
      (incident) =>
        incident.period === FootballMatchPeriod.EXTRA &&
        (incident.periodStatus === FootballMatchStatus.INPLAY_SECOND_HALF ||
          incident.periodStatus === FootballMatchStatus.END ||
          incident.periodStatus === FootballMatchStatus.FULL),
    );

    minutesByMinutesFirstHalf = combineMinuteIncidents(firstHalfIncidents);
    minutesByMinutesSecondHalf = combineMinuteIncidents(secondHalfIncidents);
    minutesByMinutesExtraTimeFH = combineMinuteIncidents(firstHalfETIncidents);
    minutesByMinutesExtraTimeSH = combineMinuteIncidents(secondHalfETIncidents);
  }

  return {
    minutesByMinutesFirstHalf,
    minutesByMinutesSecondHalf,
    minutesByMinutesExtraTimeFH,
    minutesByMinutesExtraTimeSH,
  };
}

function getBarStatProps(stats: FootballMatchStats | undefined, homeColor: string, awayColor: string): BarStatProps[] {
  const matchStats: BarStatProps[] = [];
  if (stats && stats.home && stats.away) {
    if (
      stats.home.possession !== null &&
      stats.away.possession !== null &&
      stats.home.possession !== undefined &&
      stats.away.possession !== undefined
    ) {
      matchStats.push({
        home: stats.home.possession,
        away: stats.away.possession,
        label: i18n({ key: "I18N.MATCH_STATS.POSSESSION" }),
        homeColor,
        awayColor,
      });
    }
    if (
      stats.home.shotsOnTarget !== null &&
      stats.away.shotsOnTarget !== null &&
      stats.home.shotsOnTarget !== undefined &&
      stats.away.shotsOnTarget !== undefined
    ) {
      matchStats.push({
        home: stats.home.shotsOnTarget,
        away: stats.away.shotsOnTarget,
        label: i18n({ key: "I18N.MATCH_STATS.SHOTS_ON_TARGET" }),
        homeColor,
        awayColor,
      });
    }
    if (
      stats.home.shotsOffTarget !== null &&
      stats.away.shotsOffTarget !== null &&
      stats.home.shotsOffTarget !== undefined &&
      stats.away.shotsOffTarget !== undefined
    ) {
      matchStats.push({
        home: stats.home.shotsOffTarget,
        away: stats.away.shotsOffTarget,
        label: i18n({ key: "I18N.MATCH_STATS.SHOTS_OFF_TARGET" }),
        homeColor,
        awayColor,
      });
    }
    if (
      stats.home.dangerousAttacks !== null &&
      stats.away.dangerousAttacks !== null &&
      stats.home.dangerousAttacks !== undefined &&
      stats.away.dangerousAttacks !== undefined
    ) {
      matchStats.push({
        home: stats.home.dangerousAttacks,
        away: stats.away.dangerousAttacks,
        label: i18n({ key: "I18N.MATCH_STATS.DANGEROUS_ATTACKS" }),
        homeColor,
        awayColor,
      });
    }
  }

  return matchStats;
}

export function getMatchStatsForTimeline(
  stats: FootballMatchStats[],
  duration: FootballMatchDuration,
  home?: TeamDetails,
  away?: TeamDetails,
): PeriodMatchStats {
  const periodMatchStats: PeriodMatchStats = {};

  const homeColor = home?.color || "";
  const awayColor = away?.color || "";

  const statsFirstHalf = stats.find(
    (item) =>
      item.periodStatus === FootballMatchStatus.INPLAY_FIRST_HALF && item.period === FootballMatchPeriod.REGULAR,
  );
  const statsSecondHalf = stats.find(
    (item) =>
      item.periodStatus === FootballMatchStatus.INPLAY_SECOND_HALF && item.period === FootballMatchPeriod.REGULAR,
  );
  const statsExtraFirstHalf = stats.find(
    (item) => item.periodStatus === FootballMatchStatus.INPLAY_FIRST_HALF && item.period === FootballMatchPeriod.EXTRA,
  );
  const statsFull = stats.find(({ periodStatus, period }) => periodStatus === FootballMatchStatus.FULL && !period);

  const barStatsFH: BarStatProps[] = getBarStatProps(statsFirstHalf, homeColor, awayColor);
  const barStatsFT: BarStatProps[] = getBarStatProps(statsFull, homeColor, awayColor);
  const barStatsETFH: BarStatProps[] = getBarStatProps(statsExtraFirstHalf, homeColor, awayColor);

  const scoreHT = {
    home: statsFirstHalf?.home?.goals || 0,
    away: statsFirstHalf?.away?.goals || 0,
  };

  const scoreFT = {
    home: scoreHT.home + (statsSecondHalf?.home?.goals || 0),
    away: scoreHT.away + (statsSecondHalf?.away?.goals || 0),
  };

  const scoreETHT = {
    home: scoreFT.home + (statsExtraFirstHalf?.home?.goals || 0),
    away: scoreFT.away + (statsExtraFirstHalf?.away?.goals || 0),
  };

  if (duration.period === FootballMatchPeriod.REGULAR) {
    if (
      duration.status !== FootballMatchStatus.PRE_MATCH &&
      duration.status !== FootballMatchStatus.INPLAY_FIRST_HALF
    ) {
      periodMatchStats.matchStatsHalfTime = {
        periodStat: {
          title: i18n({ key: "I18N.MATCH_TIMELINE.FIRST_HALF" }),
          resultProps: getHeadToHeadProps(scoreHT, home, away),
        },
      };
      if (barStatsFH && barStatsFH.length > 0) {
        periodMatchStats.matchStatsHalfTime.stats = barStatsFH;
      }
    }
    if (duration.status === FootballMatchStatus.END || duration.status === FootballMatchStatus.FULL) {
      periodMatchStats.matchStatsFullTime = {
        periodStat: {
          title: i18n({ key: "I18N.MATCH_TIMELINE.FULL_TIME" }),
          resultProps: getHeadToHeadProps(scoreFT, home, away),
        },
      };
    }
  } else if (duration.period === FootballMatchPeriod.EXTRA) {
    periodMatchStats.matchStatsHalfTime = {
      periodStat: {
        title: i18n({ key: "I18N.MATCH_TIMELINE.FIRST_HALF" }),
        resultProps: getHeadToHeadProps(scoreHT, home, away),
      },
    };
    if (barStatsFH && barStatsFH.length > 0) {
      periodMatchStats.matchStatsHalfTime.stats = barStatsFH;
    }
    periodMatchStats.matchStatsFullTime = {
      periodStat: {
        title: i18n({ key: "I18N.MATCH_TIMELINE.FULL_TIME" }),
        resultProps: getHeadToHeadProps(scoreFT, home, away),
      },
    };
    if (barStatsFT && barStatsFT.length > 0) {
      periodMatchStats.matchStatsFullTime.stats = barStatsFT;
    }

    if (
      duration.status === FootballMatchStatus.HALF ||
      duration.status === FootballMatchStatus.INPLAY_SECOND_HALF ||
      duration.status === FootballMatchStatus.FULL ||
      duration.status === FootballMatchStatus.END
    ) {
      periodMatchStats.matchStatsExtraFH = {
        periodStat: {
          title: i18n({ key: "I18N.MATCH_TIMELINE.ET_FIRST_HALF" }),
          resultProps: getHeadToHeadProps(scoreETHT, home, away),
        },
      };
    }
    if (
      barStatsETFH &&
      barStatsETFH.length > 0 &&
      periodMatchStats.matchStatsExtraFH &&
      duration.status !== FootballMatchStatus.INPLAY_FIRST_HALF &&
      duration.status !== FootballMatchStatus.HALF
    ) {
      periodMatchStats.matchStatsExtraFH.stats = barStatsETFH;
    }
  }

  return periodMatchStats;
}

export const createPropsForMatchTimelineDetailsVm = () =>
  createSelector(
    [(footballFixture: FootballFixture) => footballFixture],
    (footballFixture: FootballFixture): MatchTimelineDetailsProps | undefined => {
      const { home, away, duration, stats, incidents } = footballFixture;

      if (duration) {
        const matchTimelinePreview = getPropsForMatchTimeline(duration, incidents || [], home, away);
        const incidentEvents = getIncidentEvents(incidents || []);
        const matchStats = getMatchStatsForTimeline(stats || [], duration, home, away);
        const minuteByMinuteEvents = getMinutesByMinutesEvents(incidents || []);

        if (matchTimelinePreview) {
          return {
            matchTimeline: matchTimelinePreview,
            incidentEvents,
            minutesByMinutesFirstHalf: minuteByMinuteEvents.minutesByMinutesFirstHalf,
            minutesByMinutesSecondHalf: minuteByMinuteEvents.minutesByMinutesSecondHalf,
            minutesByMinutesExtraTimeFH: minuteByMinuteEvents.minutesByMinutesExtraTimeFH,
            minutesByMinutesExtraTimeSH: minuteByMinuteEvents.minutesByMinutesExtraTimeSH,
            matchStatsHalfTime: matchStats.matchStatsHalfTime,
            matchStatsFullTime: matchStats.matchStatsFullTime,
            matchStatsExtraFH: matchStats.matchStatsExtraFH,
            matchStatsExtraEnd: matchStats.matchStatsExtraEnd,
            i18N: {
              minuteByMinuteTitle: i18n({ key: "I18N.MATCH_TIMELINE.MINUTE_BY_MINUTE" }),
            },
          };
        }
      }

      return undefined;
    },
  );
