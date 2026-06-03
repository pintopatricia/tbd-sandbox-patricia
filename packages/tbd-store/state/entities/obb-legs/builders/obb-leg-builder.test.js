import { buildObbLeg } from "./obb-leg-builder";

describe("buildObbLeg", () => {
  it("should return null templateParams if templateParams is falsy", () => {
    const input = {
      id: "1",
      templateId: "someTemplate",
      templateParams: null,
      quote: 2.0,
      event: { id: "event1" },
    };

    const result = buildObbLeg(input);
    expect(result.templateParams).toBeNull();
  });

  it("should return correct templateParams for playerVsPlayer templateId", () => {
    const input = {
      id: "2",
      templateId: "playerVsPlayer",
      templateParams: {
        participantIdA: { urn: "urn:player:A" },
        participantIdB: { urn: "urn:player:B" },
        outcomeId: "outcome-1",
        timePeriodId: "period-1",
      },
      quote: 1.8,
      event: { id: "event2" },
    };

    const result = buildObbLeg(input);
    expect(result.templateParams).toEqual({
      participantIdA: "urn:player:A",
      participantIdB: "urn:player:B",
      outcomeId: "outcome-1",
      timePeriodId: "period-1",
    });
  });

  it("should return correct templateParams for squadBet templateId", () => {
    const input = {
      id: "3",
      templateId: "participantsCombined",
      templateParams: {
        participantIds: [{ urn: "urn:team:1" }, { urn: "urn:team:2" }],
        outcomeIds: ["outcome-2"],
        value: 100,
      },
      quote: 3.0,
      event: { id: "event3" },
    };

    const result = buildObbLeg(input);
    expect(result.templateParams).toEqual({
      participantIds: ["urn:team:1", "urn:team:2"],
      outcomeIds: ["outcome-2"],
      value: 100,
    });
  });

  it('should assign templateId as "participantsCombined" if input templateId is "participantsCombined"', () => {
    const input = {
      id: "4",
      templateId: "participantsCombined",
      templateParams: null,
      quote: 1.5,
      event: { id: "event4" },
    };

    const result = buildObbLeg(input);
    expect(result.templateId).toBe("participantsCombined");
  });

  it("should return correct templateParams from squadVsSquad template", () => {
    const input = {
      id: "3",
      templateId: "squadVsSquad",
      templateParams: {
        squadAParticipantIds: [{ urn: "urn:team:1" }, { urn: "urn:team:2" }],
        squadBParticipantIds: [{ urn: "urn:team:3" }, { urn: "urn:team:4" }],
        outcomeIds: ["outcome-2"],
        quantifier: "GREATER_THAN",
        timePeriodId: "MATCH",
      },
      quote: 3.0,
      event: { id: "event3" },
    };

    const result = buildObbLeg(input);
    expect(result.templateParams).toEqual({
      squadAParticipantIds: ["urn:team:1", "urn:team:2"],
      squadBParticipantIds: ["urn:team:3", "urn:team:4"],
      outcomeIds: ["outcome-2"],
      quantifier: "GREATER_THAN",
      timePeriodId: "MATCH",
    });
  });

  it("should return null templateParams for unknown structure", () => {
    const input = {
      id: "6",
      templateId: "custom",
      templateParams: {
        somethingElse: true,
      },
      quote: 1.9,
      event: { id: "event6" },
    };

    const result = buildObbLeg(input);
    expect(result.templateParams).toBeNull();
  });
});
