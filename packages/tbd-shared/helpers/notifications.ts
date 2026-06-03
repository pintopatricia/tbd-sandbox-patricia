import { EventType, IncidentType } from "@ppb/tbd-store/state/entities/notifications/Notifications";

export const getIncidentsByEventType = (evenType: EventType): IncidentType[] => {
  switch (evenType) {
    case EventType.FOOTBALL:
      return [
        IncidentType.FootballKickOff,
        IncidentType.FootballHalfTime,
        IncidentType.FootballFinalScore,
        IncidentType.FootballRedCard,
        IncidentType.FootballScoreChange,
        IncidentType.FootballPenaltyShootout,
      ];

    case EventType.HORSE_RACE:
      return [IncidentType.HorseRaceKickOff, IncidentType.HorseRaceNonRunner, IncidentType.HorseRaceFinalResult];

    case EventType.TENNIS:
      return [IncidentType.TennisEndOfSet, IncidentType.TennisFinalResult, IncidentType.TennisKickOff];

    default:
      return [];
  }
};
