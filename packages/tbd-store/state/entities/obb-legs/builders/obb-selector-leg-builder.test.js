import { buildObbLegSelector } from "./obb-selector-leg-builder";

describe("buildObbLegSelector", () => {
  const mockParticipants = {
    "urn:player:A": { name: "Player A" },
    "urn:player:B": { name: "Player B" },
    "urn:player:C": { name: "Player C" },
    "urn:player:D": { name: "Player D" },
    "urn:player:E": { name: "Player E" },
    "urn:player:F": { name: "Player F" },
  };

  const mockIncidentTypes = {
    "incident-1": { type: "goal" },
    "incident-2": { type: "assist" },
  };

  describe("when templateParams is null", () => {
    it("should return undefined templateParams", () => {
      const input = {
        id: "1",
        templateId: "playerVsPlayer",
        templateParams: null,
        quote: 2.0,
        event: { id: "event1" },
      };

      const result = buildObbLegSelector(input, mockParticipants, mockIncidentTypes);
      expect(result.templateParams).toBeUndefined();
    });
  });

  describe("when templateId is `playerVsPlayer`", () => {
    it("should correctly map templateParams for playerVsPlayer", () => {
      const input = {
        id: "2",
        templateId: "playerVsPlayer",
        templateParams: {
          participantIdA: "urn:player:A",
          participantIdB: "urn:player:B",
          outcomeId: "incident-1",
          timePeriodId: "first-half",
        },
        quote: 1.8,
        event: { id: "event2" },
      };

      const result = buildObbLegSelector(input, mockParticipants, mockIncidentTypes);
      expect(result.templateParams).toEqual({
        participantIdA: { name: "Player A" },
        participantIdB: { name: "Player B" },
        outcomeId: "incident-1",
        timePeriodId: "first-half",
      });
    });
  });

  describe("when templateId is `participantsCombined`", () => {
    it("should correctly map templateParams for squadBet", () => {
      const input = {
        id: "3",
        templateId: "participantsCombined",
        templateParams: {
          participantIds: ["urn:player:C", "urn:player:D"],
          outcomeIds: ["incident-2"],
          value: 42,
        },
        quote: 3.5,
        event: { id: "event3" },
      };

      const result = buildObbLegSelector(input, mockParticipants, mockIncidentTypes);
      expect(result.templateParams).toEqual({
        participantIds: [{ name: "Player C" }, { name: "Player D" }],
        outcomeIds: ["incident-2"],
        value: 42,
      });
    });
  });

  describe("when templateId is `squadVsSquad`", () => {
    it("should correctly map templateParams for squadVsSquad", () => {
      const input = {
        id: "3",
        templateId: "squadVsSquad",
        templateParams: {
          squadAParticipantIds: ["urn:player:C", "urn:player:D"],
          squadBParticipantIds: ["urn:player:E", "urn:player:F"],
          outcomeIds: ["incident-2"],
          timePeriodId: "MATCH",
          quantifier: "GREATER_THAN",
        },
        quote: 3.5,
        event: { id: "event3" },
      };

      const result = buildObbLegSelector(input, mockParticipants, mockIncidentTypes);
      expect(result.templateParams).toEqual({
        squadAParticipantIds: [{ name: "Player C" }, { name: "Player D" }],
        squadBParticipantIds: [{ name: "Player E" }, { name: "Player F" }],
        timePeriodId: "MATCH",
        quantifier: "GREATER_THAN",
        outcomeIds: ["incident-2"],
      });
    });
  });

  describe("when templateId is unknown", () => {
    it("should return undefined templateParams for unknown templateId", () => {
      const input = {
        id: "4",
        templateId: "unknownTemplate",
        templateParams: {
          someKey: "someValue",
        },
        quote: 1.2,
        event: { id: "event4" },
      };

      const result = buildObbLegSelector(input, mockParticipants, mockIncidentTypes);
      expect(result.templateParams).toBeUndefined();
    });
  });
});
