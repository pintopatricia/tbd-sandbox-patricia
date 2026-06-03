import {
  FootballIncident,
  CardIncidentType,
  GoalIncidentType,
  GoalIncident,
  PenaltyShootoutIncident,
  PenaltyShootoutIncidentType,
  CardIncident,
} from "@ppb/tbd-store/state/entities/football-fixture/FootballFixture.types";

import { IncidentIconType } from "@ppb/the-wall-common/types";

export const CARD_INCIDENT = "CardIncident";
export const GOAL_INCIDENT = "GoalIncident";
export const PENALTY_SHOOTOUT_INCIDENT = "PenaltyShootoutIncident";
export const SUBSTITUTION_INCIDENT = "SubstitutionIncident";
export const PERIOD_INCIDENT = "PeriodIncident";
export const SET_PIECE_INCIDENT = "SetPieceIncident";
export const FOUL_INCIDENT = "FoulIncident";
export const ATTACK_INCIDENT = "AttackIncident";
export const SHOT_INCIDENT = "ShotIncident";
export const PENALTY_INCIDENT = "PenaltyIncident";

export const GOAL = GoalIncidentType.NORMAL.toString();
export const OWN_GOAL = GoalIncidentType.OWN.toString();
export const PENALTY = GoalIncidentType.PENALTY.toString();
export const PENALTY_SCORED = PenaltyShootoutIncidentType.SCORED.toString();
const PENALTY_MISSED = PenaltyShootoutIncidentType.MISSED.toString();
export const CARD_YELLOW = CardIncidentType.YELLOW.toString();
export const CARD_RED = CardIncidentType.RED.toString();
export const CARD_SECOND_YELLOW = CardIncidentType.YELLOW_RED.toString();

const ViewModelIcons = {
  [GOAL]: IncidentIconType.GOAL,
  [OWN_GOAL]: IncidentIconType.OWN_GOAL,
  [PENALTY]: IncidentIconType.PENALTY_SCORED,
  [PENALTY_SCORED]: IncidentIconType.PENALTY_SCORED,
  [PENALTY_MISSED]: IncidentIconType.PENALTY_MISSED,
  [CARD_YELLOW]: IncidentIconType.YELLOW_CARD,
  [CARD_RED]: IncidentIconType.RED_CARD,
  [CARD_SECOND_YELLOW]: IncidentIconType.SECOND_YELLOW_CARD,
};

export function getIncidentType(incident: FootballIncident): string {
  const goalIncidentDetails = incident.details as GoalIncident;
  const penaltyIncidentDetails = incident.details as PenaltyShootoutIncident;
  const cardIncidentDetails = incident.details as CardIncident;
  const type = incident.type || incident.details.__typename;
  switch (type) {
    case GOAL_INCIDENT:
      return goalIncidentDetails.goalType;
    case PENALTY_SHOOTOUT_INCIDENT:
      return penaltyIncidentDetails.penaltyShootoutType;
    case CARD_INCIDENT:
      return cardIncidentDetails.cardType;
    case SUBSTITUTION_INCIDENT:
      return SUBSTITUTION_INCIDENT;
    default:
      return "";
  }
}

export function getIconTypeForIncident(incident: FootballIncident, subIn = false): IncidentIconType | null {
  const incidentType = getIncidentType(incident);
  if (!incidentType) return null;

  if (incidentType === SUBSTITUTION_INCIDENT) {
    return subIn ? IncidentIconType.SUBSTITUTION_IN : IncidentIconType.SUBSTITUTION_OUT;
  }

  return ViewModelIcons[incidentType] || null;
}
