import { EventType, IncidentType } from "@ppb/tbd-store/state/entities/notifications/Notifications";
import { getIncidentsByEventType } from "./notifications";

describe("notifications", () => {
  it("should return correct incidents when eventType is Football", () => {
    const incidents = getIncidentsByEventType(EventType.FOOTBALL);
    expect(incidents).toEqual([
      IncidentType.FootballKickOff,
      IncidentType.FootballHalfTime,
      IncidentType.FootballFinalScore,
      IncidentType.FootballRedCard,
      IncidentType.FootballScoreChange,
      IncidentType.FootballPenaltyShootout,
    ]);
  });

  it("should return correct incidents when eventType is HorseRacing", () => {
    const incidents = getIncidentsByEventType(EventType.HORSE_RACE);
    expect(incidents).toEqual([
      IncidentType.HorseRaceKickOff,
      IncidentType.HorseRaceNonRunner,
      IncidentType.HorseRaceFinalResult,
    ]);
  });

  it("should return correct incidents when eventType is Tennis", () => {
    const incidents = getIncidentsByEventType(EventType.TENNIS);
    expect(incidents).toEqual([
      IncidentType.TennisEndOfSet,
      IncidentType.TennisFinalResult,
      IncidentType.TennisKickOff,
    ]);
  });

  it("should return default incidents when eventType is not recognized", () => {
    const incidents = getIncidentsByEventType("test");
    expect(incidents).toEqual([]);
  });
});
