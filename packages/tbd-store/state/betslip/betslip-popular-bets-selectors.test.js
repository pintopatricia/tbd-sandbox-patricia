import { createSelectorCreator } from "reselect";
import { createGetIsCombinationOpportunityType, createGetPopularCombination } from "./betslip-popular-bets-selectors";

jest.mock("reselect", () => ({
  ...jest.requireActual("reselect"),
  createSelectorCreator: jest.fn(() => jest.fn((selector) => selector)),
  defaultMemoize: jest.fn().mockReturnValue(true),
}));

describe("betslip-popular-bets-selectors", () => {
  describe("createGetBettingOpportunitiesSelector", () => {
    describe("comparison function", () => {
      function setup() {
        createGetIsCombinationOpportunityType();
        const [_, bettingOpportunitiesComparisonFn] = createSelectorCreator.mock.calls[0];

        return bettingOpportunitiesComparisonFn;
      }

      it("when they have different lengths", () => {
        const bettingOpportunitiesComparisonFn = setup();
        const previous = {
          1: "first",
          2: "second",
        };
        const next = {
          1: "first",
        };

        expect(bettingOpportunitiesComparisonFn(previous, next)).toBe(false);
      });

      it("when they have the same lengths but their keys differ", () => {
        const bettingOpportunitiesComparisonFn = setup();
        const previous = {
          1: "first",
          2: "second",
        };
        const next = {
          1: "first",
          3: "second",
        };

        expect(bettingOpportunitiesComparisonFn(previous, next)).toBe(false);
      });

      it("when they have the same lengths and their keys are the same", () => {
        const bettingOpportunitiesComparisonFn = setup();
        const previous = {
          1: "first",
          2: "second",
        };
        const next = {
          1: "first",
          2: "does not matter",
        };

        expect(bettingOpportunitiesComparisonFn(previous, next)).toBe(true);
      });
    });
  });

  describe("createGetBetSelectionsSelector", () => {
    describe("comparison function", () => {
      function setup() {
        createGetIsCombinationOpportunityType();
        const [_, betSelectionsComparisonFn] = createSelectorCreator.mock.calls[1];

        return betSelectionsComparisonFn;
      }

      it("when they have different lengths", () => {
        const betSelectionsComparisonFn = setup();
        const previous = [{ urn: "1" }, { urn: "2" }];
        const next = [{ urn: "1" }];

        expect(betSelectionsComparisonFn(previous, next)).toBe(false);
      });

      it("when they have the same lengths but the urns inside differ", () => {
        const betSelectionsComparisonFn = setup();
        const previous = [{ urn: "1" }, { urn: "2" }];
        const next = [{ urn: "1" }, { urn: "3" }];

        expect(betSelectionsComparisonFn(previous, next)).toBe(false);
      });

      it("when they have the same lengths and the urns in each element are the same", () => {
        const betSelectionsComparisonFn = setup();
        const previous = [{ urn: "1" }, { urn: "2" }];
        const next = [{ urn: "1" }, { urn: "2" }];

        expect(betSelectionsComparisonFn(previous, next)).toBe(true);
      });
    });
  });

  describe("createGetIsCombinationOpportunityType", () => {
    it("should return false if none of the popularBettingOpportunities has the same length of selections as betSelections", () => {
      const returnFn = createGetIsCombinationOpportunityType();
      const popularbettingopportunities = {
        "pbo-1": { selections: [{ runnerUrn: "1" }, { runnerUrn: "2" }, { runnerUrn: "3" }] },
        "pbo-2": { selections: [{ runnerUrn: "3" }] },
      };
      const appState = { entities: { popularbettingopportunities } };
      const betSelections = [{ urn: "1" }, { urn: "2" }];

      expect(returnFn(appState, betSelections)).toBe(false);
    });

    it("should return false if none of the popularBettingOpportunities has the same selections urns as betSelections", () => {
      const returnFn = createGetIsCombinationOpportunityType();
      const popularbettingopportunities = {
        "pbo-1": { selections: [{ runnerUrn: "3" }, { runnerUrn: "4" }] },
        "pbo-2": { selections: [{ runnerUrn: "5" }, { runnerUrn: "6" }] },
      };
      const appState = { entities: { popularbettingopportunities } };
      const betSelections = [{ urn: "1" }, { urn: "2" }];

      expect(returnFn(appState, betSelections)).toBe(false);
    });

    it("should return false if the types of popularBettingOpportunities do not match the provided type", () => {
      const returnFn = createGetIsCombinationOpportunityType("bo-type-1");
      const popularbettingopportunities = {
        "pbo-1": { type: "bo-type-2", selections: [{ runnerUrn: "1" }, { runnerUrn: "2" }] },
        "pbo-2": { type: "bo-type-3", selections: [{ runnerUrn: "1" }, { runnerUrn: "2" }] },
      };
      const appState = { entities: { popularbettingopportunities } };
      const betSelections = [{ urn: "1" }, { urn: "2" }];

      expect(returnFn(appState, betSelections)).toBe(false);
    });

    it("should return true if one of the popularBettingOpportunities has the same selections urns as betSelections", () => {
      const returnFn = createGetIsCombinationOpportunityType();
      const popularbettingopportunities = {
        "pbo-1": { selections: [{ runnerUrn: "1" }, { runnerUrn: "2" }] },
        "pbo-2": { selections: [{ runnerUrn: "3" }, { runnerUrn: "4" }] },
      };
      const appState = { entities: { popularbettingopportunities } };
      const betSelections = [{ urn: "1" }, { urn: "2" }];

      expect(returnFn(appState, betSelections)).toBe(true);
    });
  });

  describe("createGetPopularCombination", () => {
    it("should return false if none of the popularBettingOpportunities has the same length of selections as betSelections", () => {
      const returnFn = createGetPopularCombination();
      const popularbettingopportunities = {
        "pbo-1": {
          bettingOpportunityId: "1",
          bettingOpportunityType: "POPULAR",
          selections: [{ runnerUrn: "1" }, { runnerUrn: "2" }],
        },
      };
      const appState = { betting: { popularBetting: popularbettingopportunities } };
      const betSelections = [{ urn: "1" }];

      expect(returnFn(appState, betSelections)).toBe(undefined);
    });

    it("should return false if none of the popularBettingOpportunities has the same selections urns as betSelections", () => {
      const returnFn = createGetPopularCombination();
      const popularbettingopportunities = {
        "pbo-2": {
          bettingOpportunityId: "2",
          bettingOpportunityType: "POPULAR",
          selections: [{ runnerUrn: "3" }, { runnerUrn: "4" }],
        },
      };
      const appState = { betting: { popularBetting: popularbettingopportunities } };
      const betSelections = [{ urn: "1" }, { urn: "2" }];

      expect(returnFn(appState, betSelections)).toBe(undefined);
    });

    it("should return true if one of the popularBettingOpportunities has the same selections urns as betSelections", () => {
      const returnFn = createGetPopularCombination();
      const popularbettingopportunities = {
        "pbo-1": {
          bettingOpportunityId: "1",
          bettingOpportunityType: "POPULAR",
          selections: [{ runnerUrn: "1" }, { runnerUrn: "2" }],
        },
        "pbo-2": {
          bettingOpportunityId: "2",
          bettingOpportunityType: "POPULAR",
          selections: [{ runnerUrn: "3" }, { runnerUrn: "4" }],
        },
      };
      const appState = { betting: { popularBetting: popularbettingopportunities } };
      const betSelections = [{ urn: "1" }, { urn: "2" }];

      expect(returnFn(appState, betSelections)).toEqual({
        bettingOpportunityId: "1",
        bettingOpportunityType: "POPULAR",
        selections: [{ runnerUrn: "1" }, { runnerUrn: "2" }],
      });
    });
  });
});
