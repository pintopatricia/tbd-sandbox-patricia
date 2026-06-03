import { LEG_TYPES, BET_TYPES } from "@ppb/betslip-core";
import { getThrottles } from "@ppb/tbd-store";
import {
  generateCastGroupIds,
  generateCastRunnersIds,
  groupCombinationsByMarketId,
  groupCombinationsByMultiLineTypes,
  isMultiple,
  isSingleLike,
} from "@ppb/tbd-store/helpers/sportsbook-betting";
import {
  getBetslipStep,
  getSportsbookConfirmation,
  getSportsbookConfirmationCastContext,
  getSportsbookConfirmationCombinations,
  getSportsbookConfirmationIgnoredBets,
  getSportsbookConfirmationLegs,
  getSportsbookConfirmationRunners,
} from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { getBettingResolvers } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";

import { buildCastBet, generateCastTypes } from "./betslip-mapper";

import {
  createGetConfirmationMultipleCombinations,
  createIsConfirmStep,
  createIsConfirmStepActive,
  createGetConfirmationOneLineMultiple,
  createGetConfirmationSelectionIdsSelector,
  getSingleCombinationIdsConfirm,
  createGetConfirmationCastRunnerIdsSelector,
  createGetConfirmationCastContextSelector,
  createGetConfirmationCastBetSelector,
  createGetConfirmationCastGroupIdsSelector,
  createGetConfirmationCastTypesSelector,
} from "./sportsbook-betslip-confirm-mapper";

const getThrottle = jest.fn();

jest.mock("@ppb/tbd-store", () => ({
  createGetThrottleSelector: jest.fn(() => getThrottle),
  getThrottles: jest.fn(),
}));

jest.mock("@ppb/tbd-store/helpers/sportsbook-betting", () => ({
  generateCastGroupIds: jest.fn(),
  generateCastRunnersIds: jest.fn(),
  groupCombinationsByMarketId: jest.fn(() => ({})),
  groupCombinationsByMultiLineTypes: jest.fn(),
  isMultiple: jest.fn(),
  isSingleLike: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getBetslipStep: jest.fn(),
  getSportsbookConfirmation: jest.fn(),
  getSportsbookConfirmationCastContext: jest.fn(() => ({})),
  getSportsbookConfirmationCombinations: jest.fn(() => ({})),
  getSportsbookConfirmationIgnoredBets: jest.fn(),
  getSportsbookConfirmationLegs: jest.fn(() => ({})),
  getSportsbookConfirmationRunners: jest.fn(),
}));

const getMetadata = jest.fn();

jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  getBettingResolvers: jest.fn(() => ({ getMetadata })),
}));

const getUserDetailsSelector = jest.fn();

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getUserDetailsSelector),
}));

jest.mock("./betslip-mapper", () => ({
  buildCastBet: jest.fn(),
  generateCastTypes: jest.fn(),
}));

const stateMock = {
  betslip: {
    group: "REAL",
    sportsbookConfirmation: {
      legs: {
        "L:1": { runners: ["R:1", "R:2"] },
        "L:2": { runners: ["R:3", "R:4"] },
        "L:3": {
          id: "CAST:BET:1",
          runners: ["R:5"],
        },
      },
      runners: {
        "R:1": { order: 1 },
        "R:2": { order: 2 },
        "R:3": {},
        "R:4": {},
        "R:5": { marketId: "MARKET:1" },
      },
    },
  },
};
const confirmationState = stateMock.betslip.sportsbookConfirmation;

const combinationsByMarket = {
  "CAST:BET:1": {
    id: "CAST:BET:1",
    metadataRunnerId: "RUNNER:1",
    combinations: [
      {
        id: "C:1",
        betType: BET_TYPES.SINGLE,
        legs: ["LEG:1"],
      },
    ],
  },
};

describe("Sportsbook Confirm Mapper", () => {
  beforeEach(jest.clearAllMocks);

  describe("createGetConfirmationMultipleCombinations", () => {
    it("should call the selectors with the correct parameters", () => {
      createGetConfirmationMultipleCombinations()(stateMock);

      expect(getSportsbookConfirmationCombinations).toHaveBeenCalledTimes(1);
      expect(getSportsbookConfirmationCombinations).toHaveBeenCalledWith(stateMock);
    });

    it("should return multi line combinations when combinations are present", () => {
      const mockCombinations = { 1: { id: 1 }, 2: { id: 2 } };

      groupCombinationsByMultiLineTypes.mockReturnValueOnce(mockCombinations);

      expect(createGetConfirmationMultipleCombinations()(stateMock)).toEqual(mockCombinations);
    });

    it("should return default values when no combinations are present", () => {
      const mockCombinations = { oneLineCombination: undefined, multiLinesCombinations: [] };

      groupCombinationsByMultiLineTypes.mockReturnValueOnce(mockCombinations);

      expect(createGetConfirmationMultipleCombinations()(stateMock)).toEqual(mockCombinations);
    });
  });

  describe("createGetConfirmationOneLineMultiple", () => {
    it("should call the selectors with the correct parameters", () => {
      createGetConfirmationOneLineMultiple()(stateMock);

      expect(getSportsbookConfirmationCombinations).toHaveBeenCalledTimes(1);
      expect(getSportsbookConfirmationCombinations).toHaveBeenCalledWith(stateMock);
    });

    it("returns the first valid accumulator", () => {
      const combinations = {
        comb1: { id: "comb1", numLines: 2, isMultiple: true },
        comb2: { id: "comb2", numLines: 1, isMultiple: true },
      };

      getSportsbookConfirmationCombinations.mockReturnValueOnce(combinations);
      isMultiple.mockReturnValueOnce(true).mockReturnValueOnce(true);

      expect(createGetConfirmationOneLineMultiple()(stateMock)).toEqual(combinations.comb2);
    });

    it("returns undefined if no valid accumulator is found", () => {
      const combinations = {
        comb1: { id: "comb1", numLines: 2, isMultiple: false },
      };

      getSportsbookConfirmationCombinations.mockReturnValueOnce(combinations);
      isMultiple.mockReturnValueOnce(false);

      expect(createGetConfirmationOneLineMultiple()(stateMock)).toBeUndefined();
    });
  });

  describe("createGetConfirmationSelectionIdsSelector", () => {
    it("should call the selectors with the correct parameters", () => {
      createGetConfirmationSelectionIdsSelector()(stateMock);

      expect(getSportsbookConfirmationLegs).toHaveBeenCalledTimes(1);
      expect(getSportsbookConfirmationLegs).toHaveBeenCalledWith(stateMock);

      expect(getSportsbookConfirmationIgnoredBets).toHaveBeenCalledTimes(1);
      expect(getSportsbookConfirmationIgnoredBets).toHaveBeenCalledWith(stateMock);
    });

    it("returns selection ids excluding failures", () => {
      const legs = {
        leg1: { id: "leg1", legType: LEG_TYPES.SIMPLE_SELECTION, runners: ["runner1"] },
        leg2: { id: "leg2", legType: LEG_TYPES.SIMPLE_SELECTION, runners: ["runner2"] },
      };
      const ignoredBets = [{ id: "runner1", hasStake: false }];

      getSportsbookConfirmationLegs.mockReturnValueOnce(legs);
      getSportsbookConfirmationIgnoredBets.mockReturnValueOnce(ignoredBets);

      expect(createGetConfirmationSelectionIdsSelector()(stateMock)).toEqual(["leg2"]);
    });

    it("returns an empty array if no legs match the criteria", () => {
      const legs = {
        leg1: { id: "leg1", legType: "OTHER_TYPE", runners: ["runner1"] },
      };
      const ignoredBets = [{ id: "runner1", hasStake: false }];

      getSportsbookConfirmationLegs.mockReturnValueOnce(legs);
      getSportsbookConfirmationIgnoredBets.mockReturnValueOnce(ignoredBets);

      expect(createGetConfirmationSelectionIdsSelector()(stateMock)).toEqual([]);
    });

    it("should filter for SIMPLE_SELECTION and ONE_LINE_BET", () => {
      const legs = {
        leg1: { id: "leg1", legType: LEG_TYPES.SIMPLE_SELECTION, runners: ["runner1"] },
        leg2: { id: "leg2", legType: LEG_TYPES.ONE_LINE_BET, runners: ["runner2"] },
        leg3: { id: "leg3", legType: "OTHER_TYPE", runners: ["runner3"] },
      };

      getSportsbookConfirmationLegs.mockReturnValueOnce(legs);

      expect(createGetConfirmationSelectionIdsSelector()(stateMock)).toEqual(["leg1", "leg2"]);
    });
  });

  describe("createIsConfirmStepActive", () => {
    it("should call the selectors with the correct parameters", () => {
      createIsConfirmStepActive()(stateMock);

      expect(getThrottles).toHaveBeenCalledTimes(1);
      expect(getThrottles).toHaveBeenCalledWith(stateMock);
    });

    it("should return true if BET_CONFIRMATION_STEP throttle is active", () => {
      getThrottle.mockReturnValueOnce({ isActive: true });

      expect(createIsConfirmStepActive()(stateMock)).toBe(true);
    });

    it("should return false if BET_CONFIRMATION_STEP throttle is not active", () => {
      getThrottle.mockReturnValueOnce({ isActive: false });

      expect(createIsConfirmStepActive()(stateMock)).toBe(false);
    });
  });

  describe("createIsConfirmStep", () => {
    it("should call the selectors with the correct parameters", () => {
      createIsConfirmStep()(stateMock);

      expect(getBetslipStep).toHaveBeenCalledTimes(1);
      expect(getBetslipStep).toHaveBeenCalledWith(stateMock);
    });

    it("should return true if step is CONFIRM_POTENTIAL", () => {
      getBetslipStep.mockReturnValueOnce("CONFIRM_POTENTIAL");

      expect(createIsConfirmStep()(stateMock)).toBe(true);
    });

    it("should return false if step is not CONFIRM_POTENTIAL", () => {
      getBetslipStep.mockReturnValueOnce("OTHER_STEP");

      expect(createIsConfirmStep()(stateMock)).toBe(false);
    });
  });

  describe("getSingleCombinationIdsConfirm", () => {
    it("should call the selectors with the correct parameters", () => {
      getSingleCombinationIdsConfirm(stateMock);

      expect(getSportsbookConfirmationLegs).toHaveBeenCalledTimes(1);
      expect(getSportsbookConfirmationLegs).toHaveBeenCalledWith(stateMock);

      expect(getSportsbookConfirmationCombinations).toHaveBeenCalledTimes(1);
      expect(getSportsbookConfirmationCombinations).toHaveBeenCalledWith(stateMock);
    });

    it("should return the single combination IDs that have not failed runners with shallow equality check", () => {
      const combinationIds = ["combination1", "combination2"];
      const combinations = {
        comb1: { id: combinationIds[0] },
        comb2: { id: combinationIds[1] },
      };

      getSportsbookConfirmationCombinations.mockReturnValueOnce(combinations);
      isSingleLike.mockReturnValueOnce(true).mockReturnValueOnce(true);

      expect(getSingleCombinationIdsConfirm()).toEqual(combinationIds);
    });
  });

  describe("createGetConfirmationCastGroupIdsSelector", () => {
    it("should call the selectors with the correct parameters", () => {
      createGetConfirmationCastGroupIdsSelector()(stateMock);

      expect(getSportsbookConfirmation).toHaveBeenCalledTimes(1);
      expect(getSportsbookConfirmation).toHaveBeenCalledWith(stateMock);

      expect(getBettingResolvers).toHaveBeenCalledTimes(1);
      expect(getBettingResolvers).toHaveBeenCalledWith(stateMock.betslip.group);
    });

    it("should return group ids", () => {
      const metadata = {
        "R:1": {},
        "R:3": {},
      };
      const combinationsByMarketId = {
        924.1: {
          id: "924.1",
          metadataRunnerId: "R:1",
          combinations: [{ id: "C:1", legs: ["L:1"] }],
        },
        924.2: {
          id: "924.2",
          metadataRunnerId: "R:3",
          combinations: [{ id: "C:3", legs: ["L:2"] }],
        },
      };
      const castGroupIds = ["924.1", "924.2"];

      getMetadata.mockReturnValueOnce(metadata);
      groupCombinationsByMarketId.mockReturnValueOnce(combinationsByMarketId);
      generateCastGroupIds.mockReturnValueOnce(castGroupIds);

      const groupIds = createGetConfirmationCastGroupIdsSelector()(stateMock);

      expect(generateCastGroupIds).toHaveBeenCalledTimes(1);
      expect(generateCastGroupIds).toHaveBeenCalledWith(combinationsByMarketId, metadata);

      expect(groupIds).toEqual(castGroupIds);
    });
  });

  describe("createGetConfirmationCastRunnerIdsSelector", () => {
    const combinationId = "comb:1";

    it("should call the selectors with the correct parameters", () => {
      createGetConfirmationCastRunnerIdsSelector()(stateMock, combinationId);

      expect(getSportsbookConfirmationCombinations).toHaveBeenCalledTimes(1);
      expect(getSportsbookConfirmationCombinations).toHaveBeenCalledWith(stateMock, combinationId);

      expect(getSportsbookConfirmationLegs).toHaveBeenCalledTimes(1);
      expect(getSportsbookConfirmationLegs).toHaveBeenCalledWith(stateMock, combinationId);

      expect(getSportsbookConfirmationRunners).toHaveBeenCalledTimes(1);
      expect(getSportsbookConfirmationRunners).toHaveBeenCalledWith(stateMock, combinationId);
    });

    it("should return cast runners ids", () => {
      const runnersIds = ["RUNNER:1", "RUNNER:2"];

      getSportsbookConfirmationCombinations.mockReturnValueOnce("getSportsbookConfirmationCombinations");
      getSportsbookConfirmationLegs.mockReturnValueOnce("getSportsbookConfirmationLegs");
      getSportsbookConfirmationRunners.mockReturnValueOnce("getSportsbookConfirmationRunners");
      generateCastRunnersIds.mockReturnValueOnce(runnersIds);

      const result = createGetConfirmationCastRunnerIdsSelector()(stateMock, combinationId);

      expect(generateCastRunnersIds).toHaveBeenCalledTimes(1);
      expect(generateCastRunnersIds).toHaveBeenCalledWith(
        "getSportsbookConfirmationCombinations",
        "getSportsbookConfirmationLegs",
        "getSportsbookConfirmationRunners",
        combinationId,
      );

      expect(result).toEqual(runnersIds);
    });
  });

  describe("createGetConfirmationCastContextSelector", () => {
    it("should call the selectors with the correct parameters", () => {
      createGetConfirmationCastContextSelector()(stateMock);

      expect(getSportsbookConfirmationCastContext).toHaveBeenCalledTimes(1);
      expect(getSportsbookConfirmationCastContext).toHaveBeenCalledWith(stateMock);
    });

    it("should return cast context", () => {
      const castContext = { "CAST:1": "Cast context" };

      getSportsbookConfirmationCastContext.mockReturnValueOnce(castContext);

      expect(createGetConfirmationCastContextSelector()(stateMock)).toEqual(castContext);
    });
  });

  describe("createGetConfirmationCastBetSelector", () => {
    const castGroupId = "CAST:BET:1";
    const metadata = {
      [castGroupId]: {
        type: "RACING",
      },
    };
    const userDetails = {
      timezone: "UTC+01:00",
    };
    const castBet = {
      id: castGroupId,
      title: "title",
      selectedCastType: "cast type",
      isOrderable: false,
    };

    beforeEach(() => {
      buildCastBet.mockReturnValueOnce(castBet);
    });

    it("should call the selectors with the correct parameters", () => {
      createGetConfirmationCastBetSelector()(stateMock, castGroupId);

      expect(getSportsbookConfirmation).toHaveBeenCalledTimes(1);
      expect(getSportsbookConfirmation).toHaveBeenCalledWith(stateMock, castGroupId);

      expect(getSportsbookConfirmationCastContext).toHaveBeenCalledTimes(1);
      expect(getSportsbookConfirmationCastContext).toHaveBeenCalledWith(stateMock, castGroupId);

      expect(getBettingResolvers).toHaveBeenCalledTimes(1);
      expect(getBettingResolvers).toHaveBeenCalledWith(stateMock.betslip.group);

      expect(getUserDetailsSelector).toHaveBeenCalledTimes(1);
      expect(getUserDetailsSelector).toHaveBeenCalledWith(stateMock, castGroupId);
    });

    describe("when there are no confirmation bets in the state", () => {
      it("should return undefined", () => {
        getSportsbookConfirmation.mockReturnValueOnce(undefined);

        expect(createGetConfirmationCastBetSelector()(stateMock, castGroupId)).toBeUndefined();
      });
    });

    describe("when there are confirmation bets in the state", () => {
      beforeEach(() => {
        getSportsbookConfirmation.mockReturnValueOnce(confirmationState);
        groupCombinationsByMarketId.mockReturnValueOnce(combinationsByMarket);
      });

      describe("and there is no cast group with the provided id", () => {
        it("should return undefined", () => {
          expect(createGetConfirmationCastBetSelector()(stateMock, undefined)).toBeUndefined();
        });
      });

      describe("and there is a cast group with the provided id", () => {
        it("should return the confirmation cast bets", () => {
          expect(createGetConfirmationCastBetSelector()(stateMock, castGroupId)).toEqual(castBet);
        });

        describe("and there is a cast context", () => {
          it("should call buildCastBet with the correct parameters", () => {
            const castContext = { [castGroupId]: "cast context mock" };

            getSportsbookConfirmationCastContext.mockReturnValueOnce(castContext);
            getMetadata.mockReturnValueOnce(metadata);
            getUserDetailsSelector.mockReturnValueOnce(userDetails);

            createGetConfirmationCastBetSelector()(stateMock, castGroupId);

            expect(buildCastBet).toHaveBeenCalledTimes(1);
            expect(buildCastBet).toHaveBeenCalledWith(
              combinationsByMarket[castGroupId],
              castContext,
              confirmationState,
              metadata,
              userDetails,
              false,
            );
          });
        });

        describe("and there is no cast context", () => {
          it("should call buildCastBet with the correct parameters", () => {
            const castContext = { [castGroupId]: "C:1" };

            getSportsbookConfirmationCastContext.mockReturnValueOnce(undefined);
            getMetadata.mockReturnValueOnce(metadata);
            getUserDetailsSelector.mockReturnValueOnce(userDetails);

            createGetConfirmationCastBetSelector()(stateMock, castGroupId);

            expect(buildCastBet).toHaveBeenCalledTimes(1);
            expect(buildCastBet).toHaveBeenCalledWith(
              combinationsByMarket[castGroupId],
              castContext,
              confirmationState,
              metadata,
              userDetails,
              false,
            );
          });
        });
      });
    });
  });

  describe("createGetConfirmationCastTypesSelector", () => {
    const castGroupId = "CAST:BET:1";
    const castTypes = [
      {
        id: castGroupId,
        text: "text",
      },
    ];

    beforeEach(() => {
      generateCastTypes.mockReturnValueOnce(castTypes);
    });

    it("should call the selectors with the correct parameters", () => {
      createGetConfirmationCastTypesSelector()(stateMock, castGroupId);

      expect(getSportsbookConfirmation).toHaveBeenCalledTimes(1);
      expect(getSportsbookConfirmation).toHaveBeenCalledWith(stateMock, castGroupId);
    });

    describe("when there are no confirmation bets in the state", () => {
      it("should return an empty array", () => {
        getSportsbookConfirmation.mockReturnValueOnce(undefined);

        expect(createGetConfirmationCastTypesSelector()(stateMock, castGroupId)).toEqual([]);
      });
    });

    describe("when there are confirmation bets in the state", () => {
      beforeEach(() => {
        getSportsbookConfirmation.mockReturnValueOnce(confirmationState);
        groupCombinationsByMarketId.mockReturnValueOnce(combinationsByMarket);
      });

      describe("and there is no cast group with the provided id", () => {
        it("should return an empty array", () => {
          expect(createGetConfirmationCastTypesSelector()(stateMock, undefined)).toEqual([]);
        });
      });

      describe("and there is a cast group with the provided id", () => {
        it("should return the confirmation cast bets", () => {
          const result = createGetConfirmationCastTypesSelector()(stateMock, castGroupId);

          expect(generateCastTypes).toHaveBeenCalledTimes(1);
          expect(generateCastTypes).toHaveBeenCalledWith(confirmationState.legs, combinationsByMarket[castGroupId]);

          expect(result).toEqual(castTypes);
        });
      });
    });
  });
});
