import { buildPopularBettingOpportunitiesVm } from "./ObbEventPopularsCard.helpers";

jest.mock("../../helpers/obb", () => ({
  buildObbLegDescription: jest.fn(),
  buildObbAvgStatsDescription: jest.fn(),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key, interpolationValues }) => {
    if (key === "I18N.POPULAR.TIMES_BACKED") {
      return `${interpolationValues.count} times backed`;
    }
    if (key === "I18N.OBB.POPULARS.POPULAR_EVIDENCE_FALLBACK") {
      return "Popular bet";
    }
    return key;
  }),
}));

import { buildObbLegDescription, buildObbAvgStatsDescription } from "../../helpers/obb";

describe("buildPopularBettingOpportunitiesVm", () => {
  let getObbLegById;

  beforeEach(() => {
    jest.clearAllMocks();
    getObbLegById = jest.fn();
  });

  describe("participantsCombined template", () => {
    it("should build view model with bet count >= 10", () => {
      const popularBettingOpportunity = {
        legId: "leg-1",
        betCount: 25,
        participants: [
          { player: { name: "Player 1", seasonStats: { matchesPlayed: 10, averages: { goals: 0.5 } } } },
          { player: { name: "Player 2", seasonStats: { matchesPlayed: 10, averages: { goals: 0.8 } } } },
        ],
      };

      const obbLeg = {
        id: "leg-1",
        templateId: "participantsCombined",
        templateParams: {
          outcomeIds: ["GOALS"],
          participantIds: [{ player: { name: "Player 1" } }, { player: { name: "Player 2" } }],
          quantifier: "AT_LEAST",
          value: 2,
        },
      };

      getObbLegById.mockReturnValue(obbLeg);
      buildObbLegDescription.mockReturnValue({
        legDescription: "Player 1 & Player 2 to score 2+ goals",
        participantsDescription: "Player 1 & Player 2",
        outcomeDescription: "to score 2+ goals",
      });
      buildObbAvgStatsDescription.mockReturnValue("1.3 avg goals");

      const result = buildPopularBettingOpportunitiesVm([popularBettingOpportunity], getObbLegById);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        legId: "leg-1",
        title: "Player 1 & Player 2",
        subtitle: "to score 2+ goals",
        stats: "1.3 avg goals",
        timesBackedLabel: "25 times backed",
      });
      expect(buildObbLegDescription).toHaveBeenCalledWith(obbLeg);
      expect(buildObbAvgStatsDescription).toHaveBeenCalledWith(obbLeg, popularBettingOpportunity.participants);
    });

    it("should build view model with fallback text when bet count < 10", () => {
      const popularBettingOpportunity = {
        legId: "leg-2",
        betCount: 5,
        participants: [{ player: { name: "Player 1" } }],
      };

      const obbLeg = {
        id: "leg-2",
        templateId: "participantsCombined",
        templateParams: {
          outcomeIds: ["SHOTS"],
          participantIds: [{ player: { name: "Player 1" } }],
        },
      };

      getObbLegById.mockReturnValue(obbLeg);
      buildObbLegDescription.mockReturnValue({
        legDescription: "Player 1 to have 3+ shots",
        participantsDescription: "Player 1",
        outcomeDescription: "to have 3+ shots",
      });
      buildObbAvgStatsDescription.mockReturnValue("2.3 avg shots");

      const result = buildPopularBettingOpportunitiesVm([popularBettingOpportunity], getObbLegById);

      expect(result[0].timesBackedLabel).toBe("Popular bet");
    });

    it("should handle null stats from buildObbAvgStatsDescription", () => {
      const popularBettingOpportunity = {
        legId: "leg-3",
        betCount: 15,
        participants: [],
      };

      const obbLeg = {
        id: "leg-3",
        templateId: "participantsCombined",
        templateParams: {
          outcomeIds: ["GOALS"],
        },
      };

      getObbLegById.mockReturnValue(obbLeg);
      buildObbLegDescription.mockReturnValue({
        legDescription: "Players to score",
        participantsDescription: "Players",
        outcomeDescription: "to score",
      });
      buildObbAvgStatsDescription.mockReturnValue(null);

      const result = buildPopularBettingOpportunitiesVm([popularBettingOpportunity], getObbLegById);

      expect(result[0].stats).toBeNull();
    });
  });

  describe("squadVsSquad template", () => {
    it("should build view model for squad vs squad", () => {
      const popularBettingOpportunity = {
        legId: "leg-4",
        betCount: 30,
        participants: [],
      };

      const obbLeg = {
        id: "leg-4",
        templateId: "squadVsSquad",
        templateParams: {
          squadAParticipantIds: [{ player: { name: "Player A1" } }, { player: { name: "Player A2" } }],
          squadBParticipantIds: [{ player: { name: "Player B1" } }, { player: { name: "Player B2" } }],
          quantifier: "GREATER_THAN",
          outcomeIds: ["GOALS"],
        },
      };

      getObbLegById.mockReturnValue(obbLeg);
      buildObbLegDescription.mockReturnValue({
        legDescription: "Player A1 & Player A2 to score more goals than Player B1 & Player B2",
        participantsDescription: "Player A1 & Player A2",
        outcomeDescription: "to score more goals than Player B1 & Player B2",
      });
      buildObbAvgStatsDescription.mockReturnValue(null);

      const result = buildPopularBettingOpportunitiesVm([popularBettingOpportunity], getObbLegById);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        legId: "leg-4",
        title: "Player A1 & Player A2",
        subtitle: "to score more goals than Player B1 & Player B2",
        stats: null,
        timesBackedLabel: "30 times backed",
      });
    });

    it("should use fallback text when bet count < 10", () => {
      const popularBettingOpportunity = {
        legId: "leg-5",
        betCount: 8,
        participants: [],
      };

      const obbLeg = {
        id: "leg-5",
        templateId: "squadVsSquad",
        templateParams: {},
      };

      getObbLegById.mockReturnValue(obbLeg);
      buildObbLegDescription.mockReturnValue({
        legDescription: "Squad A vs Squad B",
        participantsDescription: "Squad A",
        outcomeDescription: "to beat Squad B",
      });
      buildObbAvgStatsDescription.mockReturnValue(null);

      const result = buildPopularBettingOpportunitiesVm([popularBettingOpportunity], getObbLegById);

      expect(result[0].timesBackedLabel).toBe("Popular bet");
    });
  });

  describe("playerVsPlayer template", () => {
    it("should build view model for player vs player", () => {
      const popularBettingOpportunity = {
        legId: "leg-6",
        betCount: 40,
        participants: [],
      };

      const obbLeg = {
        id: "leg-6",
        templateId: "playerVsPlayer",
        templateParams: {
          participantIdA: {
            player: { name: "Player A", seasonStats: { matchesPlayed: 10, averages: { goals: 1.5 } } },
          },
          participantIdB: {
            player: { name: "Player B", seasonStats: { matchesPlayed: 10, averages: { goals: 0.8 } } },
          },
          outcomeId: "GOALS",
        },
      };

      getObbLegById.mockReturnValue(obbLeg);
      buildObbLegDescription.mockReturnValue({
        legDescription: "Player A to score more than Player B",
        participantsDescription: "Player A",
        outcomeDescription: "to score more than Player B",
      });
      buildObbAvgStatsDescription.mockReturnValue("Goals - P. A: 1.5 | P. B: 0.8");

      const result = buildPopularBettingOpportunitiesVm([popularBettingOpportunity], getObbLegById);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        legId: "leg-6",
        title: "Player A",
        subtitle: "to score more than Player B",
        stats: "Goals - P. A: 1.5 | P. B: 0.8",
        timesBackedLabel: "40 times backed",
      });
    });

    it("should handle null stats", () => {
      const popularBettingOpportunity = {
        legId: "leg-7",
        betCount: 20,
        participants: [],
      };

      const obbLeg = {
        id: "leg-7",
        templateId: "playerVsPlayer",
        templateParams: {
          participantIdA: { player: { name: "Player A" } },
          participantIdB: { player: { name: "Player B" } },
          outcomeId: "UNKNOWN_OUTCOME",
        },
      };

      getObbLegById.mockReturnValue(obbLeg);
      buildObbLegDescription.mockReturnValue({
        legDescription: "Player A vs Player B",
        participantsDescription: "Player A",
        outcomeDescription: "to beat Player B",
      });
      buildObbAvgStatsDescription.mockReturnValue(null);

      const result = buildPopularBettingOpportunitiesVm([popularBettingOpportunity], getObbLegById);

      expect(result[0].stats).toBeNull();
    });
  });

  describe("edge cases and filtering", () => {
    it("should filter out opportunities when leg is not found", () => {
      const popularBettingOpportunity = {
        legId: "non-existent",
        betCount: 10,
        participants: [],
      };

      getObbLegById.mockReturnValue(undefined);

      const result = buildPopularBettingOpportunitiesVm([popularBettingOpportunity], getObbLegById);

      expect(result).toHaveLength(0);
      expect(buildObbLegDescription).not.toHaveBeenCalled();
      expect(buildObbAvgStatsDescription).not.toHaveBeenCalled();
    });

    it("should filter out opportunities when templateParams is null", () => {
      const popularBettingOpportunity = {
        legId: "leg-8",
        betCount: 10,
        participants: [],
      };

      const obbLeg = {
        id: "leg-8",
        templateId: "participantsCombined",
        templateParams: null,
      };

      getObbLegById.mockReturnValue(obbLeg);

      const result = buildPopularBettingOpportunitiesVm([popularBettingOpportunity], getObbLegById);

      expect(result).toHaveLength(0);
      expect(buildObbLegDescription).not.toHaveBeenCalled();
    });

    it("should filter out opportunities when templateParams is undefined", () => {
      const popularBettingOpportunity = {
        legId: "leg-9",
        betCount: 10,
        participants: [],
      };

      const obbLeg = {
        id: "leg-9",
        templateId: "participantsCombined",
      };

      getObbLegById.mockReturnValue(obbLeg);

      const result = buildPopularBettingOpportunitiesVm([popularBettingOpportunity], getObbLegById);

      expect(result).toHaveLength(0);
    });

    it("should filter out opportunities when buildObbLegDescription returns null", () => {
      const popularBettingOpportunity = {
        legId: "leg-10",
        betCount: 10,
        participants: [],
      };

      const obbLeg = {
        id: "leg-10",
        templateId: "unsupportedTemplate",
        templateParams: {},
      };

      getObbLegById.mockReturnValue(obbLeg);
      buildObbLegDescription.mockReturnValue(null);

      const result = buildPopularBettingOpportunitiesVm([popularBettingOpportunity], getObbLegById);

      expect(result).toHaveLength(0);
      expect(buildObbAvgStatsDescription).not.toHaveBeenCalled();
    });

    it("should handle empty popularBettingOpportunities array", () => {
      const result = buildPopularBettingOpportunitiesVm([], getObbLegById);

      expect(result).toHaveLength(0);
      expect(getObbLegById).not.toHaveBeenCalled();
    });

    it("should filter out only invalid opportunities from mixed array", () => {
      const opportunities = [
        { legId: "leg-valid-1", betCount: 10, participants: [] },
        { legId: "leg-invalid", betCount: 15, participants: [] },
        { legId: "leg-valid-2", betCount: 20, participants: [] },
      ];

      getObbLegById
        .mockReturnValueOnce({
          id: "leg-valid-1",
          templateId: "participantsCombined",
          templateParams: { outcomeIds: ["GOALS"] },
        })
        .mockReturnValueOnce(undefined)
        .mockReturnValueOnce({
          id: "leg-valid-2",
          templateId: "squadVsSquad",
          templateParams: {},
        });

      buildObbLegDescription
        .mockReturnValueOnce({
          participantsDescription: "Players 1",
          outcomeDescription: "outcome 1",
        })
        .mockReturnValueOnce({
          participantsDescription: "Squad 2",
          outcomeDescription: "outcome 2",
        });

      buildObbAvgStatsDescription.mockReturnValue(null);

      const result = buildPopularBettingOpportunitiesVm(opportunities, getObbLegById);

      expect(result).toHaveLength(2);
      expect(result[0].legId).toBe("leg-valid-1");
      expect(result[1].legId).toBe("leg-valid-2");
    });

    it("should handle all opportunities being filtered out", () => {
      const opportunities = [
        { legId: "leg-1", betCount: 10, participants: [] },
        { legId: "leg-2", betCount: 15, participants: [] },
      ];

      getObbLegById.mockReturnValue(undefined);

      const result = buildPopularBettingOpportunitiesVm(opportunities, getObbLegById);

      expect(result).toHaveLength(0);
    });
  });

  describe("bet count threshold", () => {
    it("should show exact bet count when count is 10", () => {
      const popularBettingOpportunity = {
        legId: "leg-11",
        betCount: 10,
        participants: [],
      };

      const obbLeg = {
        id: "leg-11",
        templateId: "participantsCombined",
        templateParams: { outcomeIds: ["GOALS"] },
      };

      getObbLegById.mockReturnValue(obbLeg);
      buildObbLegDescription.mockReturnValue({
        participantsDescription: "Players",
        outcomeDescription: "outcome",
      });
      buildObbAvgStatsDescription.mockReturnValue(null);

      const result = buildPopularBettingOpportunitiesVm([popularBettingOpportunity], getObbLegById);

      expect(result[0].timesBackedLabel).toBe("10 times backed");
    });

    it("should show fallback text when count is 9", () => {
      const popularBettingOpportunity = {
        legId: "leg-12",
        betCount: 9,
        participants: [],
      };

      const obbLeg = {
        id: "leg-12",
        templateId: "participantsCombined",
        templateParams: { outcomeIds: ["GOALS"] },
      };

      getObbLegById.mockReturnValue(obbLeg);
      buildObbLegDescription.mockReturnValue({
        participantsDescription: "Players",
        outcomeDescription: "outcome",
      });
      buildObbAvgStatsDescription.mockReturnValue(null);

      const result = buildPopularBettingOpportunitiesVm([popularBettingOpportunity], getObbLegById);

      expect(result[0].timesBackedLabel).toBe("Popular bet");
    });

    it("should handle very large bet counts", () => {
      const popularBettingOpportunity = {
        legId: "leg-13",
        betCount: 999999,
        participants: [],
      };

      const obbLeg = {
        id: "leg-13",
        templateId: "participantsCombined",
        templateParams: { outcomeIds: ["GOALS"] },
      };

      getObbLegById.mockReturnValue(obbLeg);
      buildObbLegDescription.mockReturnValue({
        participantsDescription: "Players",
        outcomeDescription: "outcome",
      });
      buildObbAvgStatsDescription.mockReturnValue(null);

      const result = buildPopularBettingOpportunitiesVm([popularBettingOpportunity], getObbLegById);

      expect(result[0].timesBackedLabel).toBe("999999 times backed");
    });
  });

  describe("integration scenarios", () => {
    it("should process multiple opportunities with different templates", () => {
      const opportunities = [
        { legId: "leg-pc", betCount: 25, participants: [{ player: { name: "P1" } }] },
        { legId: "leg-svs", betCount: 30, participants: [] },
        { legId: "leg-pvp", betCount: 15, participants: [] },
      ];

      getObbLegById
        .mockReturnValueOnce({
          templateId: "participantsCombined",
          templateParams: { outcomeIds: ["GOALS"] },
        })
        .mockReturnValueOnce({
          templateId: "squadVsSquad",
          templateParams: {},
        })
        .mockReturnValueOnce({
          templateId: "playerVsPlayer",
          templateParams: { outcomeId: "SHOTS" },
        });

      buildObbLegDescription
        .mockReturnValueOnce({
          participantsDescription: "P1",
          outcomeDescription: "outcome1",
        })
        .mockReturnValueOnce({
          participantsDescription: "Squad",
          outcomeDescription: "outcome2",
        })
        .mockReturnValueOnce({
          participantsDescription: "PA",
          outcomeDescription: "outcome3",
        });

      buildObbAvgStatsDescription
        .mockReturnValueOnce("1.5 goals")
        .mockReturnValueOnce(null)
        .mockReturnValueOnce("Shots - PA: 2.0 | PB: 1.8");

      const result = buildPopularBettingOpportunitiesVm(opportunities, getObbLegById);

      expect(result).toHaveLength(3);
      expect(result[0]).toMatchObject({
        legId: "leg-pc",
        title: "P1",
        subtitle: "outcome1",
        stats: "1.5 goals",
        timesBackedLabel: "25 times backed",
      });
      expect(result[1]).toMatchObject({
        legId: "leg-svs",
        title: "Squad",
        subtitle: "outcome2",
        stats: null,
        timesBackedLabel: "30 times backed",
      });
      expect(result[2]).toMatchObject({
        legId: "leg-pvp",
        title: "PA",
        subtitle: "outcome3",
        stats: "Shots - PA: 2.0 | PB: 1.8",
        timesBackedLabel: "15 times backed",
      });
    });

    it("should pass correct participants to buildObbAvgStatsDescription", () => {
      const participants = [
        { player: { name: "Player 1", seasonStats: {} } },
        { player: { name: "Player 2", seasonStats: {} } },
      ];

      const popularBettingOpportunity = {
        legId: "leg-14",
        betCount: 20,
        participants,
      };

      const obbLeg = {
        templateId: "participantsCombined",
        templateParams: { outcomeIds: ["GOALS"] },
      };

      getObbLegById.mockReturnValue(obbLeg);
      buildObbLegDescription.mockReturnValue({
        participantsDescription: "Players",
        outcomeDescription: "outcome",
      });
      buildObbAvgStatsDescription.mockReturnValue("1.5 avg");

      buildPopularBettingOpportunitiesVm([popularBettingOpportunity], getObbLegById);

      expect(buildObbAvgStatsDescription).toHaveBeenCalledWith(obbLeg, participants);
    });
  });
});
