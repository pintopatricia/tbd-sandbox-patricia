import { buildBettingOpportunitiesVm } from "./ObbCreatedBetsCard.helpers";
import * as obbHelpers from "../../helpers/obb";

jest.mock("../../helpers/obb");

describe("ObbCreatedBetsCard.helpers", () => {
  describe("buildBettingOpportunitiesVm", () => {
    const mockGetObbLegById = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe("when all betting opportunities are valid", () => {
      it("should return formatted betting opportunities", () => {
        const bettingOpportunities = [
          {
            legId: "leg1",
            participants: [{ id: "player1", name: "Player One" }],
          },
          {
            legId: "leg2",
            participants: [{ id: "player2", name: "Player Two" }],
          },
        ];

        const mockObbLeg1 = {
          id: "leg1",
          templateId: "playerVsPlayer",
          templateParams: {
            participantIdA: { id: "player1" },
            participantIdB: { id: "player2" },
            outcomeId: "GOALS_TIME_ADJUSTED",
            timePeriodId: "fullTime",
          },
          quote: {
            typename: "ObbQuoteSuccess",
            price: { decimal: 2.5 },
          },
          event: { urn: "urn:event:1" },
        };

        const mockObbLeg2 = {
          id: "leg2",
          templateId: "squadVsSquad",
          templateParams: {
            squadAParticipantIds: [{ id: "player3" }],
            squadBParticipantIds: [{ id: "player4" }],
            outcomeId: "SHOTS_TIME_ADJUSTED",
            timePeriodId: "fullTime",
          },
          quote: {
            typename: "ObbQuoteSuccess",
            price: { decimal: 3.0 },
          },
          event: { urn: "urn:event:2" },
        };

        mockGetObbLegById.mockImplementation((legId) => {
          if (legId === "leg1") return mockObbLeg1;
          if (legId === "leg2") return mockObbLeg2;
          return undefined;
        });

        obbHelpers.buildObbLegDescription.mockImplementation((leg) => {
          if (leg.id === "leg1") {
            return {
              participantsDescription: "Player One vs Player Two",
              outcomeDescription: "Most Goals",
            };
          }
          if (leg.id === "leg2") {
            return {
              participantsDescription: "Team A vs Team B",
              outcomeDescription: "Most Shots",
            };
          }
          return null;
        });

        obbHelpers.buildObbAvgStatsDescription.mockReturnValueOnce("Avg: 1.5 goals").mockReturnValueOnce(null);

        obbHelpers.formatQuote.mockReturnValueOnce({ odds: "2.50" }).mockReturnValueOnce({ odds: "3.00" });

        const result = buildBettingOpportunitiesVm(bettingOpportunities, mockGetObbLegById);

        expect(result).toEqual([
          {
            legId: "leg1",
            legTemplateId: "playerVsPlayer",
            title: "Player One vs Player Two",
            subtitle: "Most Goals",
            statsLabel: "Avg: 1.5 goals",
            quote: { odds: "2.50" },
          },
          {
            legId: "leg2",
            legTemplateId: "squadVsSquad",
            title: "Team A vs Team B",
            subtitle: "Most Shots",
            statsLabel: null,
            quote: { odds: "3.00" },
          },
        ]);

        expect(mockGetObbLegById).toHaveBeenCalledWith("leg1");
        expect(mockGetObbLegById).toHaveBeenCalledWith("leg2");
        expect(obbHelpers.buildObbLegDescription).toHaveBeenCalledWith(mockObbLeg1);
        expect(obbHelpers.buildObbLegDescription).toHaveBeenCalledWith(mockObbLeg2);
        expect(obbHelpers.buildObbAvgStatsDescription).toHaveBeenCalledWith(
          mockObbLeg1,
          bettingOpportunities[0].participants,
        );
        expect(obbHelpers.buildObbAvgStatsDescription).toHaveBeenCalledWith(
          mockObbLeg2,
          bettingOpportunities[1].participants,
        );
        expect(obbHelpers.formatQuote).toHaveBeenCalledWith(mockObbLeg1.quote);
        expect(obbHelpers.formatQuote).toHaveBeenCalledWith(mockObbLeg2.quote);
      });
    });

    describe("when obbLeg is not found", () => {
      it("should filter out the opportunity", () => {
        const bettingOpportunities = [
          {
            legId: "leg1",
            participants: [{ id: "player1" }],
          },
          {
            legId: "leg2",
            participants: [{ id: "player2" }],
          },
        ];

        mockGetObbLegById.mockImplementation((legId) => {
          if (legId === "leg1") return undefined;
          if (legId === "leg2") {
            return {
              id: "leg2",
              templateId: "playerVsPlayer",
              templateParams: { participantIdA: { id: "player2" } },
              quote: { typename: "ObbQuoteSuccess", price: { decimal: 2.0 } },
            };
          }
          return undefined;
        });

        obbHelpers.buildObbLegDescription.mockReturnValue({
          participantsDescription: "Player Two",
          outcomeDescription: "Goals",
        });

        obbHelpers.buildObbAvgStatsDescription.mockReturnValue("Avg: 1.0");
        obbHelpers.formatQuote.mockReturnValue({ odds: "2.00" });

        const result = buildBettingOpportunitiesVm(bettingOpportunities, mockGetObbLegById);

        expect(result).toHaveLength(1);
        expect(result[0].legId).toBe("leg2");
      });
    });

    describe("when obbLeg has no templateParams", () => {
      it("should filter out the opportunity", () => {
        const bettingOpportunities = [
          {
            legId: "leg1",
            participants: [{ id: "player1" }],
          },
        ];

        mockGetObbLegById.mockReturnValue({
          id: "leg1",
          templateId: "playerVsPlayer",
          templateParams: undefined,
          quote: { typename: "ObbQuoteSuccess", price: { decimal: 2.0 } },
        });

        const result = buildBettingOpportunitiesVm(bettingOpportunities, mockGetObbLegById);

        expect(result).toEqual([]);
        expect(obbHelpers.buildObbLegDescription).not.toHaveBeenCalled();
      });
    });

    describe("when buildObbLegDescription returns null", () => {
      it("should filter out the opportunity", () => {
        const bettingOpportunities = [
          {
            legId: "leg1",
            participants: [{ id: "player1" }],
          },
          {
            legId: "leg2",
            participants: [{ id: "player2" }],
          },
        ];

        const mockObbLeg1 = {
          id: "leg1",
          templateId: "playerVsPlayer",
          templateParams: { participantIdA: { id: "player1" } },
          quote: { typename: "ObbQuoteSuccess", price: { decimal: 2.0 } },
        };

        const mockObbLeg2 = {
          id: "leg2",
          templateId: "squadVsSquad",
          templateParams: { squadAParticipantIds: [{ id: "player2" }] },
          quote: { typename: "ObbQuoteSuccess", price: { decimal: 3.0 } },
        };

        mockGetObbLegById.mockImplementation((legId) => {
          if (legId === "leg1") return mockObbLeg1;
          if (legId === "leg2") return mockObbLeg2;
          return undefined;
        });

        obbHelpers.buildObbLegDescription.mockReturnValueOnce(null).mockReturnValueOnce({
          participantsDescription: "Team A vs Team B",
          outcomeDescription: "Most Shots",
        });

        obbHelpers.buildObbAvgStatsDescription.mockReturnValue("Avg: 2.0");
        obbHelpers.formatQuote.mockReturnValue({ odds: "3.00" });

        const result = buildBettingOpportunitiesVm(bettingOpportunities, mockGetObbLegById);

        expect(result).toHaveLength(1);
        expect(result[0].legId).toBe("leg2");
      });
    });

    describe("when empty betting opportunities array is provided", () => {
      it("should return an empty array", () => {
        const result = buildBettingOpportunitiesVm([], mockGetObbLegById);

        expect(result).toEqual([]);
        expect(mockGetObbLegById).not.toHaveBeenCalled();
      });
    });

    describe("when all opportunities are filtered out", () => {
      it("should return an empty array", () => {
        const bettingOpportunities = [
          {
            legId: "leg1",
            participants: [{ id: "player1" }],
          },
          {
            legId: "leg2",
            participants: [{ id: "player2" }],
          },
        ];

        mockGetObbLegById.mockReturnValue(undefined);

        const result = buildBettingOpportunitiesVm(bettingOpportunities, mockGetObbLegById);

        expect(result).toEqual([]);
      });
    });

    describe("when statsLabel is null", () => {
      it("should include null in the result", () => {
        const bettingOpportunities = [
          {
            legId: "leg1",
            participants: [{ id: "player1" }],
          },
        ];

        const mockObbLeg = {
          id: "leg1",
          templateId: "squadVsSquad",
          templateParams: { squadAParticipantIds: [{ id: "player1" }] },
          quote: { typename: "ObbQuoteSuccess", price: { decimal: 2.5 } },
        };

        mockGetObbLegById.mockReturnValue(mockObbLeg);

        obbHelpers.buildObbLegDescription.mockReturnValue({
          participantsDescription: "Team A vs Team B",
          outcomeDescription: "Most Passes",
        });

        obbHelpers.buildObbAvgStatsDescription.mockReturnValue(null);
        obbHelpers.formatQuote.mockReturnValue({ odds: "2.50" });

        const result = buildBettingOpportunitiesVm(bettingOpportunities, mockGetObbLegById);

        expect(result).toEqual([
          {
            legId: "leg1",
            legTemplateId: "squadVsSquad",
            title: "Team A vs Team B",
            subtitle: "Most Passes",
            statsLabel: null,
            quote: { odds: "2.50" },
          },
        ]);
      });
    });
  });
});
