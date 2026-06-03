import {
  PLACE_FAILURE_CODES,
  RUNNER_FAILURE_CODES,
  COMBINATION_FAILURE_CODES,
  BET_TYPES,
  LEG_TYPES,
  isCastLeg,
  VALIDATION_SEVERITIES,
  VALIDATION_TYPES,
} from "@ppb/betslip-core";

import { Result } from "../state/constants";
import { getSportsbookBettingCombinations } from "../state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { Result as BLHResult, ResultType } from "../clients/blh/bet-live-hypotheticals-response-types";

import { isRaceHierarchy } from "./markets";
import {
  processAllUniqueRunnersFailures,
  processAllUniqueCombinationsFailures,
  getSbkPlaceImportantErrorCode,
  getSbkDisplayTransactionalError,
  getRacingMetadata,
  getMetadataType,
  isSingle,
  isSingleLike,
  isCast,
  isMultiple,
  isBoostedMultiple,
  isBetBuilder,
  generateCastRunnersIds,
  generateCastGroupIds,
  groupCombinationsByMarketId,
  groupCombinationsByMultiLineTypes,
  isOrderableCast,
  mapSportsbookOddsToOdds,
  convertEntityTupleToLegId,
  isLegInState,
  getUniqueFailedSGMCombinationGroups,
  getSimpleSelectionLegs,
  isSimpleSelection,
  isTerritoryApplicableValidation,
  isMultiBetBuilder,
  isStakeValid,
  getResultFromResultType,
  hasSpecialValidation,
  createGetMultiBetBuilderSelector,
  hasAnyInvalidCombinationFailure,
  hasAnyMarketClosedFailure,
  hasAnyMarketSuspendedFailure,
  isSingleLegInState,
  findSingleCombinationFromLegId,
} from "./sportsbook-betting";

jest.mock("./markets", () => ({
  isRaceHierarchy: jest.fn(),
}));
jest.mock("@ppb/betslip-core", () => ({
  // Keeping the constants
  ...jest.requireActual("@ppb/betslip-core"),
  isCastLeg: jest.fn(),
}));

describe("sportsbook betting", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("getUniqueFailedCombinationGroups", () => {
    it("should return unique sgm combination groups", () => {
      const result = getUniqueFailedSGMCombinationGroups({
        "runner:1": [
          { failureCode: RUNNER_FAILURE_CODES.INVALID_SGM_COMBINATION_SINGLE_ODDS, combinationGroups: [1, 2] },
        ],
        "runner:2": [{ failureCode: RUNNER_FAILURE_CODES.IMPOSSIBLE_SAME_MARKET_COMBINATION, combinationGroups: [3] }],
        "runner:3": [{ failureCode: RUNNER_FAILURE_CODES.INVALID_SGM_COMBINATION, combinationGroups: [3] }],
        "runner:4": [{ failureCode: RUNNER_FAILURE_CODES.NOT_ELIGIBLE_SGM_SELECTION, combinationGroups: [4] }],
        "runner:5": [{ failureCode: RUNNER_FAILURE_CODES.RUNNER_SUSPENDED, combinationGroups: [9] }],
      });

      expect(result).toStrictEqual([1, 2, 3]);
    });
  });

  describe("processAllUniqueRunnersFailures", () => {
    it("should return unique runner failures", () => {
      const result = processAllUniqueRunnersFailures({
        "runner:1": [{ failureCode: RUNNER_FAILURE_CODES.RUNNER_SUSPENDED }],
        "runner:2": [{ failureCode: RUNNER_FAILURE_CODES.RUNNER_SUSPENDED }],
        "runner:3": [{ failureCode: RUNNER_FAILURE_CODES.MARKET_SUSPENDED }],
      });

      expect(result).toStrictEqual([RUNNER_FAILURE_CODES.RUNNER_SUSPENDED, RUNNER_FAILURE_CODES.MARKET_SUSPENDED]);
    });
  });

  describe("processAllUniqueCombinationsFailures", () => {
    it("should return unique combination failures", () => {
      const result = processAllUniqueCombinationsFailures({
        "combination:1": { failureCode: COMBINATION_FAILURE_CODES.STAKE_BELOW_MINIMUM_ALLOWED },
        "combination:2": { failureCode: COMBINATION_FAILURE_CODES.STAKE_BELOW_MINIMUM_ALLOWED },
        "combination:3": { failureCode: COMBINATION_FAILURE_CODES.BET_PLACEMENT_RUNNER_FAILURE },
      });

      expect(result).toStrictEqual([
        COMBINATION_FAILURE_CODES.STAKE_BELOW_MINIMUM_ALLOWED,
        COMBINATION_FAILURE_CODES.BET_PLACEMENT_RUNNER_FAILURE,
      ]);
    });

    it("should exclude OTHER_FAILURE_IN_REQUEST", () => {
      const result = processAllUniqueCombinationsFailures({
        "combination:1": { failureCode: COMBINATION_FAILURE_CODES.STAKE_BELOW_MINIMUM_ALLOWED },
        "combination:2": { failureCode: COMBINATION_FAILURE_CODES.OTHER_FAILURE_IN_REQUEST },
        "combination:3": { failureCode: COMBINATION_FAILURE_CODES.BET_PLACEMENT_RUNNER_FAILURE },
      });

      expect(result).toStrictEqual([
        COMBINATION_FAILURE_CODES.STAKE_BELOW_MINIMUM_ALLOWED,
        COMBINATION_FAILURE_CODES.BET_PLACEMENT_RUNNER_FAILURE,
      ]);
    });
  });

  describe("generateCastRunnersIds", () => {
    function setupGenerateScenario({ inverseOrder = false, combinationId } = {}) {
      const legs = {
        "LEG:1": { legType: LEG_TYPES.FORECAST, runners: ["RUNNER:1", "RUNNER:2"] },
        "LEG:2": { legType: LEG_TYPES.FORECAST, runners: ["RUNNER:3", "RUNNER:4"] },
        "LEG:3": { legType: LEG_TYPES.FORECAST, runners: ["RUNNER:3", "RUNNER:4"] },
      };
      const runners = {
        "RUNNER:1": { marketId: "1.11", selectionId: 1, order: inverseOrder ? 4 : 1 },
        "RUNNER:2": { marketId: "1.11", selectionId: 2, order: inverseOrder ? 3 : 2 },
        "RUNNER:3": { marketId: "1.12", selectionId: 3, order: inverseOrder ? 2 : 3 },
        "RUNNER:4": { marketId: "1.12", selectionId: 4, order: inverseOrder ? 1 : 4 },
      };
      const combinationOne = {
        id: "C:1",
        betType: BET_TYPES.SINGLE,
        legs: ["LEG:1"],
      };
      const combinationTwo = {
        id: "C:2",
        betType: BET_TYPES.SINGLE,
        legs: ["LEG:2"],
      };
      const combinationThree = {
        id: "C:3",
        betType: BET_TYPES.SINGLE,
        legs: ["LEG:3"],
      };

      return {
        combinations: {
          "C:1": combinationOne,
          "C:2": combinationTwo,
          "C:3": combinationThree,
        },
        legs,
        runners,
        combinationId,
      };
    }

    it("should generate cast runners ids for combinations with no runners order", () => {
      const bettingState = setupGenerateScenario({ combinationId: "C:1" });

      expect(generateCastRunnersIds(...Object.values(bettingState))).toEqual(["RUNNER:1", "RUNNER:2"]);
    });

    it("should generate cast runners ids for combinations with runners order", () => {
      const bettingState = setupGenerateScenario({ combinationId: "C:1", inverseOrder: true });

      expect(generateCastRunnersIds(...Object.values(bettingState))).toEqual(["RUNNER:2", "RUNNER:1"]);
    });

    it("should return empty array if combinationId is undefined", () => {
      const bettingState = setupGenerateScenario();

      expect(generateCastRunnersIds(...Object.values(bettingState))).toEqual([]);
    });

    it("should return empty array if combination does not exists", () => {
      const bettingState = setupGenerateScenario({ combinationId: "XPTO" });

      expect(generateCastRunnersIds(...Object.values(bettingState))).toEqual([]);
    });

    it("should not reorder the elements if one of them has order 0", () => {
      const bettingState = setupGenerateScenario({ combinationId: "C:1" });

      expect(
        generateCastRunnersIds(
          ...Object.values({
            ...bettingState,
            runners: {
              "RUNNER:1": {
                ...bettingState.runners["RUNNER:1"],
                order: 1,
              },
              "RUNNER:2": {
                ...bettingState.runners["RUNNER:2"],
                order: 0,
              },
            },
          }),
        ),
      ).toEqual(["RUNNER:1", "RUNNER:2"]);
    });
  });

  describe("generateCastGroupsIds", () => {
    const setupGroupScenario = ({ withMetadata = false } = {}) => {
      const combinationsByMarketId = {
        924.1: {
          id: "924.1",
          metadataRunnerId: "R:1",
          combinations: [
            {
              id: "C:1",
              legs: ["L:1"],
            },
          ],
        },
        924.2: {
          id: "924.2",
          metadataRunnerId: "R:3",
          combinations: [
            {
              id: "C:3",
              legs: ["L:2"],
            },
          ],
        },
      };

      const metadata = withMetadata
        ? {
            "R:1": {
              racing: {
                time: 5,
              },
              type: "RACING",
            },
            "R:3": {
              racing: {
                time: 1,
              },
              type: "RACING",
            },
          }
        : { "R:1": {}, "R:3": {} };

      return {
        combinationsByMarketId,
        metadata,
      };
    };

    describe("when there is no racing metadata", () => {
      it("should not sort cast groups by race time", () => {
        const { combinationsByMarketId, metadata } = setupGroupScenario();

        expect(generateCastGroupIds(combinationsByMarketId, metadata)).toEqual(["924.1", "924.2"]);
      });
    });

    describe("when there is racing metadata", () => {
      it("should sort cast groups by race time", () => {
        const { combinationsByMarketId, metadata } = setupGroupScenario({ withMetadata: true });

        expect(generateCastGroupIds(combinationsByMarketId, metadata)).toEqual(["924.2", "924.1"]);
      });
    });
  });

  describe("groupCombinationByMarketId", () => {
    function setupGroupScenario() {
      const legs = {
        "LEG:1": { legType: LEG_TYPES.FORECAST, runners: ["RUNNER:1", "RUNNER:2"] },
        "LEG:2": { legType: LEG_TYPES.FORECAST, runners: ["RUNNER:3", "RUNNER:4"] },
        "LEG:3": { legType: LEG_TYPES.FORECAST, runners: ["RUNNER:3", "RUNNER:4"] },
      };
      const runners = {
        "RUNNER:1": { marketId: "1.11", selectionId: 1 },
        "RUNNER:2": { marketId: "1.11", selectionId: 2 },
        "RUNNER:3": { marketId: "1.12", selectionId: 3 },
        "RUNNER:4": { marketId: "1.12", selectionId: 4 },
      };
      const combinationOne = {
        id: "C:1",
        betType: BET_TYPES.SINGLE,
        legs: ["LEG:1"],
      };
      const combinationTwo = {
        id: "C:2",
        betType: BET_TYPES.SINGLE,
        legs: ["LEG:2"],
      };
      const combinationThree = {
        id: "C:3",
        betType: BET_TYPES.SINGLE,
        legs: ["LEG:3"],
      };

      return {
        combinations: {
          "C:1": combinationOne,
          "C:2": combinationTwo,
          "C:3": combinationThree,
        },
        legs,
        runners,
      };
    }

    it("should return an empty object when does not have bettingState", () => {
      expect(groupCombinationsByMarketId()).toEqual({});
    });

    it("should group combinations by their marketId", () => {
      isCastLeg.mockReturnValue(true);

      const bettingState = setupGroupScenario();

      expect(groupCombinationsByMarketId(bettingState)).toEqual({
        1.11: { id: "1.11", metadataRunnerId: "RUNNER:1", combinations: [bettingState.combinations["C:1"]] },
        1.12: {
          id: "1.12",
          metadataRunnerId: "RUNNER:3",
          combinations: [bettingState.combinations["C:2"], bettingState.combinations["C:3"]],
        },
      });
    });
  });

  describe("groupCombinationsByMultiLineTypes", () => {
    describe("when combinations has multiples with one line only", () => {
      it("should return oneLineCombination only", () => {
        const mockCombinations = {
          1: { id: 1, numLines: 1, betType: BET_TYPES.DOUBLE },
        };

        const result = groupCombinationsByMultiLineTypes(mockCombinations);

        expect(result).toEqual({
          oneLineCombination: mockCombinations[1],
          multiLinesCombinations: [],
        });
      });
    });

    describe("when combinations has multiples with multi lines only", () => {
      it("should return as oneLineCombination", () => {
        const mockCombinations = {
          1: { id: 1, numLines: 2, betType: BET_TYPES.DOUBLE },
        };

        const result = groupCombinationsByMultiLineTypes(mockCombinations);

        expect(result).toEqual({
          oneLineCombination: mockCombinations[1],
          multiLinesCombinations: [],
        });
      });
    });

    describe("when combinations has multiples with one line and multi lines", () => {
      it("should return combinations grouped by multiple type", () => {
        const mockCombinations = {
          1: { id: 1, numLines: 1, betType: BET_TYPES.DOUBLE },
          2: { id: 2, numLines: 2, betType: BET_TYPES.TRIXIE },
        };

        const result = groupCombinationsByMultiLineTypes(mockCombinations);

        expect(result).toEqual({
          oneLineCombination: mockCombinations[1],
          multiLinesCombinations: [mockCombinations[2]],
        });
      });

      it("should sort combinations by numLines", () => {
        const mockCombinations = {
          1: { id: 1, numLines: 3, betType: BET_TYPES.DOUBLE },
          2: { id: 2, numLines: 1, betType: BET_TYPES.TREBLE },
          3: { id: 3, numLines: 2, betType: BET_TYPES.TRIXIE },
        };

        const result = groupCombinationsByMultiLineTypes(mockCombinations);

        expect(result).toEqual({
          oneLineCombination: mockCombinations[2],
          multiLinesCombinations: [mockCombinations[3], mockCombinations[1]],
        });
      });
    });

    describe("when there is no multiples", () => {
      it("should return default object empty", () => {
        const mockCombinations = {
          1: { id: 1, numLines: 1, betType: BET_TYPES.SINGLE },
          2: { id: 2, numLines: 2, betType: BET_TYPES.DOUBLE, isSgm: true },
          3: { id: 3, numLines: 2, betType: BET_TYPES.DOUBLE, isSgmMultiple: true },
        };

        const result = groupCombinationsByMultiLineTypes(mockCombinations);

        expect(result).toEqual({
          oneLineCombination: undefined,
          multiLinesCombinations: [],
        });
      });
    });

    describe("when empty object is passed", () => {
      it("should return default empty object", () => {
        const mockCombinations = {};

        const result = groupCombinationsByMultiLineTypes(mockCombinations);

        expect(result).toEqual({
          oneLineCombination: undefined,
          multiLinesCombinations: [],
        });
      });
    });

    describe("when undefined is passed", () => {
      it("should return default empty object", () => {
        const result = groupCombinationsByMultiLineTypes(undefined);

        expect(result).toEqual({
          oneLineCombination: undefined,
          multiLinesCombinations: [],
        });
      });
    });
  });

  describe("getRacingMetadata", () => {
    function setupRacingScenario(selectionId, greyhoundRunner) {
      const race = {
        urn: "race:urn",
        runners: ["ppb:tbd:racerunner:1/1"],
        startTime: "23:10:10",
      };
      const raceRunners = {
        "ppb:tbd:racerunner:1/1": {
          urn: "ppb:tbd:racerunner:1/1",
          selectionId: 1,
          details: {
            saddleCloth: "1",
            silk: "/some-silk-path",
          },
        },
      };
      const meeting = {
        venue: "Meeting Venue",
        country: "GB",
      };

      return getRacingMetadata(race, meeting, selectionId, raceRunners, greyhoundRunner);
    }

    describe("when the indicated runner exists", () => {
      it("should return a race urn", () => {
        const racingMetadata = setupRacingScenario(1);

        expect(racingMetadata.urn).toEqual("race:urn");
      });

      it("should return a time", () => {
        const racingMetadata = setupRacingScenario(1);

        expect(racingMetadata.time).toEqual("23:10:10");
      });

      it("should return a saddleCloth", () => {
        const racingMetadata = setupRacingScenario(1);

        expect(racingMetadata.saddleCloth).toEqual("1");
      });

      it("should return a venue", () => {
        const racingMetadata = setupRacingScenario(1);

        expect(racingMetadata.venue).toEqual("Meeting Venue");
      });

      it("should return a runnerVisual", () => {
        const racingMetadata = setupRacingScenario(1);

        expect(racingMetadata.runnerVisual).toEqual("/some-silk-path");
      });

      it("should return a meetingCountry", () => {
        const racingMetadata = setupRacingScenario(1);

        expect(racingMetadata.meetingCountry).toEqual("GB");
      });
    });

    describe("when the indicated runner does not exist", () => {
      it("should return partial metadata", () => {
        const racingMetadata = setupRacingScenario(2);

        expect(racingMetadata).toEqual({
          urn: "race:urn",
          time: "23:10:10",
          venue: "Meeting Venue",
          meetingCountry: "GB",
        });
      });
    });

    describe("when a greyhound runner exists", () => {
      it("should include trap", () => {
        const greyhoundRunner = { trap: 5 };
        const racingMetadata = setupRacingScenario(1, greyhoundRunner);

        expect(racingMetadata.trap).toEqual(5);
      });
    });
  });

  describe("getMetadataType", () => {
    describe("when there is a hierarchy", () => {
      describe("when it is a race hierarchy", () => {
        it("should return MetadataType of RACING", () => {
          isRaceHierarchy.mockReturnValue(true);
          const type = getMetadataType({ race: "A", meeting: "B" });

          expect(type).toEqual("RACING");
        });
      });

      describe("when it is a generic hierarchy", () => {
        it("should return MetadataType of GENERIC", () => {
          isRaceHierarchy.mockReturnValue(false);
          const type = getMetadataType({ race: "A" });

          expect(type).toEqual("GENERIC");
        });
      });
    });

    describe("when there is no hierarchy", () => {
      it("should return MetadataType of GENERIC", () => {
        isRaceHierarchy.mockReturnValue(false);
        const type = getMetadataType();

        expect(type).toEqual("GENERIC");
      });
    });
  });

  describe("getSbkPlaceImportantErrorCode", () => {
    describe("when there are only runner failures", () => {
      describe("when it is due to a malformed definition", () => {
        it("should return the general error message", () => {
          const displayError = getSbkPlaceImportantErrorCode({
            operationalFailure: { failureCode: PLACE_FAILURE_CODES.BET_PLACEMENT_FAILURE },
            uniqueRunnersFailures: [RUNNER_FAILURE_CODES.SELECTION_NOT_FOUND],
            uniqueCombinationsFailures: [],
          });

          expect(displayError).toBe("BET_PLACEMENT_FAILURE");
        });
      });

      describe("when there are several runner failures", () => {
        it("should return the general error message", () => {
          const displayError = getSbkPlaceImportantErrorCode({
            operationalFailure: { failureCode: PLACE_FAILURE_CODES.BET_PLACEMENT_FAILURE },
            uniqueRunnersFailures: [RUNNER_FAILURE_CODES.MARKET_SUSPENDED, RUNNER_FAILURE_CODES.RUNNER_SUSPENDED],
            uniqueCombinationsFailures: [],
          });

          expect(displayError).toBe("BET_PLACEMENT_FAILURE");
        });
      });

      describe("when there is only one valid runner failure", () => {
        it("should return the runner error message", () => {
          const displayError = getSbkPlaceImportantErrorCode({
            operationalFailure: { failureCode: PLACE_FAILURE_CODES.BET_PLACEMENT_FAILURE },
            uniqueRunnersFailures: [RUNNER_FAILURE_CODES.MARKET_SUSPENDED],
            uniqueCombinationsFailures: [],
          });

          expect(displayError).toBe("MARKET_SUSPENDED");
        });
      });
    });

    describe("when there are only combination failures", () => {
      describe("when there are several combination failures", () => {
        it("should return the general error message", () => {
          const displayError = getSbkPlaceImportantErrorCode({
            operationalFailure: { failureCode: PLACE_FAILURE_CODES.BET_PLACEMENT_FAILURE },
            uniqueRunnersFailures: [],
            uniqueCombinationsFailures: [
              COMBINATION_FAILURE_CODES.STAKE_BELOW_MINIMUM_ALLOWED,
              COMBINATION_FAILURE_CODES.BET_PLACEMENT_RUNNER_FAILURE,
            ],
          });

          expect(displayError).toBe("BET_PLACEMENT_FAILURE");
        });
      });

      describe("when there is only one valid combination failure", () => {
        it("should return the combination error message", () => {
          const displayError = getSbkPlaceImportantErrorCode({
            operationalFailure: { failureCode: PLACE_FAILURE_CODES.BET_PLACEMENT_FAILURE },
            uniqueRunnersFailures: [],
            uniqueCombinationsFailures: [COMBINATION_FAILURE_CODES.STAKE_BELOW_MINIMUM_ALLOWED],
          });

          expect(displayError).toBe("STAKE_BELOW_MINIMUM_ALLOWED");
        });
      });
    });

    describe("when there is a operational failure", () => {
      it("should return the general error message", () => {
        const displayError = getSbkPlaceImportantErrorCode({
          operationalFailure: { failureCode: PLACE_FAILURE_CODES.ACCOUNT_SUSPENDED },
          uniqueRunnersFailures: [],
          uniqueCombinationsFailures: [],
        });

        expect(displayError).toBe("ACCOUNT_SUSPENDED");
      });
    });
  });

  describe("getSbkDisplayTransactionalError", () => {
    describe("when there's NO operational failure", () => {
      it("should return null", () => {
        const result = getSbkDisplayTransactionalError({});

        expect(result).toBeNull();
      });
    });

    describe("when there's operational failure", () => {
      it("should return the error code to display", () => {
        const result = getSbkDisplayTransactionalError({
          operational: { failureCode: PLACE_FAILURE_CODES.ACCOUNT_LOCKED },
          runners: {
            runner: [],
          },
          combinations: {},
        });

        expect(result).toBe(PLACE_FAILURE_CODES.ACCOUNT_LOCKED);
      });
    });
  });

  describe("mapSportsbookoddsToOdds", () => {
    describe("when there are decimal odds", () => {
      it("should return mapped decimals", async () => {
        const odds = { decimal: 1.22 };

        expect(mapSportsbookOddsToOdds(odds)).toEqual({ decimalOdds: 1.22 });
      });
    });

    describe("when there are fractional odds", () => {
      it("should return also mapped fractions", async () => {
        const odds = { decimal: 1.22, fractional: { numerator: 1, denominator: 2 }, american: -455 };

        expect(mapSportsbookOddsToOdds(odds)).toEqual({
          decimalOdds: 1.22,
          fractionalOdds: { numerator: 1, denominator: 2 },
          americanOdds: -455,
        });
      });
    });

    describe("when there are no odds", () => {
      it("should return null", async () => {
        expect(mapSportsbookOddsToOdds(undefined)).toEqual(null);
      });
    });
  });

  describe("isTerritoryApplicableValidation", () => {
    describe("when ITALY", () => {
      describe("when ABOVE_MAX_PAYOUT", () => {
        it("should return true", () => {
          const userDetails = {
            countryCode: "IT",
            jurisdiction: {
              jurisdiction: "ITALY",
            },
          };

          expect(isTerritoryApplicableValidation(VALIDATION_TYPES.ABOVE_MAX_PAYOUT, userDetails)).toEqual(true);
        });
      });

      describe("when any other validation", () => {
        it("should return true", () => {
          const userDetails = {
            countryCode: "IT",
            jurisdiction: {
              jurisdiction: "ITALY",
            },
          };

          expect(isTerritoryApplicableValidation(VALIDATION_TYPES.ABOVE_MAX_STAKE, userDetails)).toEqual(true);
        });
      });
    });

    describe("when any other jurisdiction", () => {
      describe("when ABOVE_MAX_PAYOUT", () => {
        it("should return false", () => {
          const userDetails = {
            countryCode: "GB",
            jurisdiction: {
              jurisdiction: "INTERNATIONAL",
            },
          };

          expect(isTerritoryApplicableValidation(VALIDATION_TYPES.ABOVE_MAX_PAYOUT, userDetails)).toEqual(false);
        });
      });

      describe("when any other validation", () => {
        it("should return true", () => {
          const userDetails = {
            countryCode: "GB",
            jurisdiction: {
              jurisdiction: "INTERNATIONAL",
            },
          };

          expect(isTerritoryApplicableValidation(VALIDATION_TYPES.ABOVE_MAX_STAKE, userDetails)).toEqual(true);
        });
      });
    });

    describe("when OfflineUserDetails (no jurisdiction)", () => {
      describe("when ABOVE_MAX_PAYOUT", () => {
        it("should return false when countryCode is not in ImplyBets countries", () => {
          const offlineUserDetails = {
            loggedIn: false,
            localeCode: "en_GB",
            localeCodeBcp47: "en-GB",
            timezone: "Europe/London",
            countryCode: "GB",
          };

          expect(isTerritoryApplicableValidation(VALIDATION_TYPES.ABOVE_MAX_PAYOUT, offlineUserDetails)).toEqual(false);
        });

        it("should not throw when jurisdiction is not present", () => {
          const offlineUserDetails = {
            loggedIn: false,
            localeCode: "it_IT",
            localeCodeBcp47: "it-IT",
            timezone: "Europe/Rome",
            countryCode: "IT",
          };

          expect(() =>
            isTerritoryApplicableValidation(VALIDATION_TYPES.ABOVE_MAX_PAYOUT, offlineUserDetails),
          ).not.toThrow();
        });
      });

      describe("when any other validation", () => {
        it("should return true", () => {
          const offlineUserDetails = {
            loggedIn: false,
            localeCode: "en_GB",
            localeCodeBcp47: "en-GB",
            timezone: "Europe/London",
            countryCode: "GB",
          };

          expect(isTerritoryApplicableValidation(VALIDATION_TYPES.ABOVE_MAX_STAKE, offlineUserDetails)).toEqual(true);
        });
      });
    });
  });

  describe("hasSpecialValidation", () => {
    describe("when validation type is ABOVE_MAX_PAYOUT", () => {
      describe("and userDetails countryCode is GB and jurisdiction INTERNATIONAL", () => {
        it("should return true", () => {
          const userDetails = {
            countryCode: "GB",
            jurisdiction: {
              jurisdiction: "INTERNATIONAL",
            },
          };

          expect(hasSpecialValidation(VALIDATION_TYPES.ABOVE_MAX_PAYOUT, userDetails)).toEqual(true);
        });
      });

      describe("and userDetails countryCode is FR and jurisdiction INTERNATIONAL", () => {
        it("should return false", () => {
          const userDetails = {
            countryCode: "FR",
            jurisdiction: {
              jurisdiction: "INTERNATIONAL",
            },
          };

          expect(hasSpecialValidation(VALIDATION_TYPES.ABOVE_MAX_PAYOUT, userDetails)).toEqual(false);
        });
      });

      describe("and userDetails countryCode is BR and jurisdiction BRAZIL", () => {
        it("should return true", () => {
          const userDetails = {
            countryCode: "BR",
            jurisdiction: {
              jurisdiction: "BRAZIL",
            },
          };

          expect(hasSpecialValidation(VALIDATION_TYPES.ABOVE_MAX_PAYOUT, userDetails)).toEqual(true);
        });
      });

      describe("and there is ABOVE_MAX_STAKE", () => {
        it("should return false", () => {
          const userDetails = {};
          const hasAboveMaxStakeValidation = true;

          expect(
            hasSpecialValidation(VALIDATION_TYPES.ABOVE_MAX_PAYOUT, userDetails, hasAboveMaxStakeValidation),
          ).toEqual(false);
        });
      });
    });

    describe("when validation type is BELOW_MIN_STAKE", () => {
      describe("and userDetails countryCode is GB and jurisdiction INTERNATIONAL", () => {
        it("should return false", () => {
          const userDetails = {
            countryCode: "GB",
            jurisdiction: {
              jurisdiction: "INTERNATIONAL",
            },
          };

          expect(hasSpecialValidation(VALIDATION_TYPES.BELOW_MIN_STAKE, userDetails)).toEqual(false);
        });
      });
    });
  });

  describe("isStakeValid", () => {
    describe("when the validations are undefined", () => {
      it("should return true", () => {
        expect(
          isStakeValid(
            {
              jurisdiction: { jurisdiction: "ITALY" },
            },
            undefined,
          ),
        ).toEqual(true);
      });
    });

    describe("when the validations are empty", () => {
      it("should return true", () => {
        expect(
          isStakeValid(
            {
              jurisdiction: { jurisdiction: "ITALY" },
            },
            [],
          ),
        ).toEqual(true);
      });
    });

    describe("when the validation is territory applicable", () => {
      describe("when the validation has a severity of ERROR", () => {
        it("should return false", () => {
          expect(
            isStakeValid(
              {
                jurisdiction: { jurisdiction: "ITALY" },
              },
              [{ type: VALIDATION_TYPES.ABOVE_MAX_PAYOUT, severity: VALIDATION_SEVERITIES.ERROR }],
            ),
          ).toEqual(false);
        });
      });

      describe("when the validation has a severity of WARNING", () => {
        it("should return true", () => {
          expect(
            isStakeValid(
              {
                jurisdiction: { jurisdiction: "ITALY" },
              },
              [{ type: VALIDATION_TYPES.ABOVE_MAX_PAYOUT, severity: VALIDATION_SEVERITIES.WARNING }],
            ),
          ).toEqual(true);
        });
      });

      describe("when the validation has no severity", () => {
        it("should return false", () => {
          expect(
            isStakeValid(
              {
                jurisdiction: { jurisdiction: "ITALY" },
              },
              [{ type: VALIDATION_TYPES.ABOVE_MAX_PAYOUT }],
            ),
          ).toEqual(false);
        });
      });

      describe("when the validation is not applied to the jurisdiction", () => {
        it("should return true", () => {
          expect(
            isStakeValid(
              {
                jurisdiction: { jurisdiction: "INTERNATIONAL" },
              },
              [{ type: VALIDATION_TYPES.ABOVE_MAX_PAYOUT }],
            ),
          ).toEqual(true);
        });
      });
    });

    describe("when the validation has no restrictions", () => {
      describe("when the validation has a severity of ERROR", () => {
        it("should return false", () => {
          expect(
            isStakeValid(
              {
                jurisdiction: { jurisdiction: "INTERNATIONAL" },
              },
              [{ type: VALIDATION_TYPES.ABOVE_MAX_STAKE, severity: VALIDATION_SEVERITIES.ERROR }],
            ),
          ).toEqual(false);
        });
      });

      describe("when the validation has a severity of WARNING", () => {
        it("should return true", () => {
          expect(
            isStakeValid(
              {
                jurisdiction: { jurisdiction: "INTERNATIONAL" },
              },
              [{ type: VALIDATION_TYPES.ABOVE_MAX_STAKE, severity: VALIDATION_SEVERITIES.WARNING }],
            ),
          ).toEqual(true);
        });
      });

      describe("when the validation has no severity", () => {
        it("should return false", () => {
          expect(
            isStakeValid(
              {
                jurisdiction: { jurisdiction: "INTERNATIONAL" },
              },
              [{ type: VALIDATION_TYPES.ABOVE_MAX_STAKE }],
            ),
          ).toEqual(false);
        });
      });
    });

    describe("when userDetails is OfflineUserDetails (no jurisdiction)", () => {
      const offlineUserDetails = {
        loggedIn: false,
        localeCode: "en_GB",
        localeCodeBcp47: "en-GB",
        timezone: "Europe/London",
        countryCode: "GB",
      };

      describe("when validations are undefined", () => {
        it("should return true", () => {
          expect(isStakeValid(offlineUserDetails, undefined)).toEqual(true);
        });
      });

      describe("when validations are empty", () => {
        it("should return true", () => {
          expect(isStakeValid(offlineUserDetails, [])).toEqual(true);
        });
      });

      describe("when ABOVE_MAX_PAYOUT validation with ERROR severity", () => {
        it("should return true because territory is not applicable", () => {
          expect(
            isStakeValid(offlineUserDetails, [
              { type: VALIDATION_TYPES.ABOVE_MAX_PAYOUT, severity: VALIDATION_SEVERITIES.ERROR },
            ]),
          ).toEqual(true);
        });
      });

      describe("when ABOVE_MAX_STAKE validation with ERROR severity", () => {
        it("should return false", () => {
          expect(
            isStakeValid(offlineUserDetails, [
              { type: VALIDATION_TYPES.ABOVE_MAX_STAKE, severity: VALIDATION_SEVERITIES.ERROR },
            ]),
          ).toEqual(false);
        });
      });

      describe("when ABOVE_MAX_STAKE validation with WARNING severity", () => {
        it("should return true", () => {
          expect(
            isStakeValid(offlineUserDetails, [
              { type: VALIDATION_TYPES.ABOVE_MAX_STAKE, severity: VALIDATION_SEVERITIES.WARNING },
            ]),
          ).toEqual(true);
        });
      });
    });
  });

  describe("isSingle", () => {
    describe("when the combination is a betType SINGLE", () => {
      describe("when all the legs are SIMPLE_SELECTION", () => {
        it("should return true", () => {
          const combination = {
            betType: BET_TYPES.SINGLE,
            legs: ["LEG:1"],
          };
          const map = {
            "LEG:1": {
              legType: LEG_TYPES.SIMPLE_SELECTION,
            },
          };

          expect(isSingle(combination, map)).toEqual(true);
        });
      });

      describe("when some of the legs are SIMPLE_SELECTION", () => {
        it("should return false", () => {
          const combination = {
            betType: BET_TYPES.SINGLE,
            legs: ["LEG:1", "LEG:2"],
          };
          const map = {
            "LEG:1": {
              legType: LEG_TYPES.SIMPLE_SELECTION,
            },
            "LEG:2": {
              legType: LEG_TYPES.FORECAST,
            },
          };

          expect(isSingle(combination, map)).toEqual(false);
        });
      });

      describe("when none of the legs are SIMPLE_SELECTION", () => {
        it("should return false", () => {
          const combination = {
            betType: BET_TYPES.SINGLE,
            legs: ["LEG:1", "LEG:2"],
          };
          const map = {
            "LEG:1": {
              legType: LEG_TYPES.REVERSE_FORECAST,
            },
            "LEG:2": {
              legType: LEG_TYPES.FORECAST,
            },
          };

          expect(isSingle(combination, map)).toEqual(false);
        });
      });
    });

    describe("when the combination is not a betType SINGLE", () => {
      it("should return false", () => {
        const combination = {
          betType: BET_TYPES.DOUBLE,
          legs: ["LEG:1"],
        };
        const map = {
          "LEG:1": {
            legType: LEG_TYPES.SIMPLE_SELECTION,
          },
        };

        expect(isSingle(combination, map)).toEqual(false);
      });
    });
  });

  describe("isSingleLike", () => {
    describe("when the combination is a betType SINGLE", () => {
      describe("when all the legs are SIMPLE_SELECTION", () => {
        it("should return true", () => {
          const combination = {
            betType: BET_TYPES.SINGLE,
            legs: ["LEG:1"],
          };
          const map = {
            "LEG:1": {
              legType: LEG_TYPES.SIMPLE_SELECTION,
            },
          };

          expect(isSingleLike(combination, map)).toEqual(true);
        });
      });

      describe("when all the legs are ONE_LINE_BET", () => {
        it("should return true", () => {
          const combination = {
            betType: BET_TYPES.ONE_LINE_BET,
            legs: ["LEG:1"],
          };
          const map = {
            "LEG:1": {
              legType: LEG_TYPES.ONE_LINE_BET,
            },
          };

          expect(isSingleLike(combination, map)).toEqual(true);
        });
      });

      describe("when legs are neither SIMPLE_SELECTION or ONE_LINE_BET", () => {
        it("should return false", () => {
          const combination = {
            betType: BET_TYPES.SINGLE,
            legs: ["LEG:1", "LEG:2"],
          };
          const map = {
            "LEG:1": {
              legType: LEG_TYPES.FORECAST,
            },
            "LEG:2": {
              legType: LEG_TYPES.FORECAST,
            },
          };

          expect(isSingleLike(combination, map)).toEqual(false);
        });
      });
    });

    describe("when the combination is not a betType SINGLE", () => {
      it("should return false", () => {
        const combination = {
          betType: BET_TYPES.DOUBLE,
          legs: ["LEG:1"],
        };
        const map = {
          "LEG:1": {
            legType: LEG_TYPES.SIMPLE_SELECTION,
          },
        };

        expect(isSingleLike(combination, map)).toEqual(false);
      });
    });
  });

  describe("isCast", () => {
    describe("when the combination is a betType SINGLE", () => {
      describe("when all the legs are some kind of cast leg", () => {
        it("should return true", () => {
          const combination = {
            betType: BET_TYPES.SINGLE,
            legs: ["LEG:1"],
          };
          const map = {
            "LEG:1": {
              legType: LEG_TYPES.FORECAST,
            },
          };
          isCastLeg.mockReturnValue(true);

          expect(isCast(combination, map)).toEqual(true);
        });
      });

      describe("when some of the legs are a cast leg", () => {
        it("should return false", () => {
          const combination = {
            betType: BET_TYPES.SINGLE,
            legs: ["LEG:1", "LEG:2"],
          };
          const map = {
            "LEG:1": {
              legType: LEG_TYPES.SIMPLE_SELECTION,
            },
            "LEG:2": {
              legType: LEG_TYPES.FORECAST,
            },
          };
          isCastLeg.mockReturnValueOnce(false);
          isCastLeg.mockReturnValueOnce(true);

          expect(isCast(combination, map)).toEqual(false);
        });
      });

      describe("when none of the legs are a cast leg", () => {
        it("should return false", () => {
          const combination = {
            betType: BET_TYPES.SINGLE,
            legs: ["LEG:1", "LEG:2"],
          };
          const map = {
            "LEG:1": {
              legType: LEG_TYPES.ONE_LINE_BET,
            },
            "LEG:2": {
              legType: LEG_TYPES.ONE_LINE_BET,
            },
          };

          isCastLeg.mockReturnValueOnce(false);
          isCastLeg.mockReturnValueOnce(false);

          expect(isCast(combination, map)).toEqual(false);
        });
      });
    });

    describe("when the combination is not a betType SINGLE", () => {
      it("should return false", () => {
        const combination = {
          betType: BET_TYPES.DOUBLE,
          legs: ["LEG:1"],
        };
        const map = {
          "LEG:1": {
            legType: LEG_TYPES.FORECAST,
          },
        };

        expect(isCast(combination, map)).toEqual(false);
      });
    });
  });

  describe("isMultiple", () => {
    describe("when the combination is a betType SINGLE", () => {
      it("should return false", () => {
        const combination = {
          betType: BET_TYPES.SINGLE,
          legs: ["LEG:1"],
        };

        expect(isMultiple(combination)).toEqual(false);
      });
    });

    describe("when the combination is not a betType SINGLE", () => {
      it("should return true", () => {
        const combination = {
          betType: BET_TYPES.DOUBLE,
          legs: ["LEG:1"],
        };

        expect(isMultiple(combination)).toEqual(true);
      });
    });

    describe("when the combination is a same game multiple", () => {
      it("should return false", () => {
        const combination = {
          betType: BET_TYPES.DOUBLE,
          isSgm: true,
          isSgmMultiple: false,
          legs: ["LEG:1"],
        };

        expect(isMultiple(combination)).toEqual(false);
      });
    });

    describe("when the combination is a sgm multiple", () => {
      it("should return false", () => {
        const combination = {
          betType: BET_TYPES.DOUBLE,
          isSgm: false,
          isSgmMultiple: true,
          legs: ["LEG:1"],
        };

        expect(isMultiple(combination)).toEqual(false);
      });
    });

    describe("when the combination is boosted", () => {
      it("should return false", () => {
        const combination = {
          betType: BET_TYPES.DOUBLE,
          isSgm: false,
          isSgmMultiple: false,
          isBoosted: true,
          legs: ["LEG:1"],
        };

        expect(isMultiple(combination)).toEqual(false);
      });
    });

    describe("when the combination is a simple multiple", () => {
      it("should return true", () => {
        const combination = {
          betType: BET_TYPES.DOUBLE,
          isSgm: false,
          isSgmMultiple: false,
          legs: ["LEG:1"],
        };

        expect(isMultiple(combination)).toEqual(true);
      });
    });

    describe("when the combination has only ONE_LINE_BET", () => {
      it("should return false", () => {
        const combination = {
          betType: BET_TYPES.DOUBLE,
          isSgm: false,
          isSgmMultiple: false,
          legs: ["ONE_LINE_BET:1"],
        };

        expect(isMultiple(combination)).toEqual(false);
      });
    });
  });

  describe("isBoostedMultiple", () => {
    describe("when the combination is a betType SINGLE", () => {
      it("should return false", () => {
        const combination = {
          betType: BET_TYPES.SINGLE,
          legs: ["LEG:1"],
        };

        expect(isBoostedMultiple(combination)).toEqual(false);
      });
    });

    describe("when the combination is a same game multiple", () => {
      it("should return false", () => {
        const combination = {
          betType: BET_TYPES.DOUBLE,
          isSgm: true,
          isSgmMultiple: false,
          isBoosted: false,
          legs: ["LEG:1"],
        };

        expect(isBoostedMultiple(combination)).toEqual(false);
      });
    });

    describe("when the combination is a sgm multiple", () => {
      it("should return false", () => {
        const combination = {
          betType: BET_TYPES.DOUBLE,
          isSgm: false,
          isSgmMultiple: true,
          isBoosted: false,
          legs: ["LEG:1"],
        };

        expect(isBoostedMultiple(combination)).toEqual(false);
      });
    });

    describe("when the combination is a simple multiple", () => {
      it("should return false", () => {
        const combination = {
          betType: BET_TYPES.DOUBLE,
          isSgm: false,
          isSgmMultiple: false,
          isBoosted: false,
          legs: ["LEG:1"],
        };

        expect(isBoostedMultiple(combination)).toEqual(false);
      });
    });

    describe("when the combination is not boosted", () => {
      it("should return false", () => {
        const combination = {
          betType: BET_TYPES.DOUBLE,
          isSgm: false,
          isSgmMultiple: false,
          isBoosted: false,
          legs: ["LEG:1"],
        };

        expect(isBoostedMultiple(combination)).toEqual(false);
      });
    });

    describe("when the combination is boosted", () => {
      it("should return true", () => {
        const combination = {
          betType: BET_TYPES.DOUBLE,
          isSgm: false,
          isSgmMultiple: false,
          isBoosted: true,
          legs: ["LEG:1"],
        };

        expect(isBoostedMultiple(combination)).toEqual(true);
      });
    });
  });

  describe("isBetBuilder", () => {
    describe("when the combination is a bet builder", () => {
      it("should return true", () => {
        const combination = { isSgm: true };

        expect(isBetBuilder(combination)).toEqual(true);
      });
    });

    describe("when the combination is a bet builder multiple", () => {
      it("should return false", () => {
        const combination = { isSgm: false, isSgmMultiple: true };

        expect(isBetBuilder(combination)).toEqual(false);
      });
    });

    describe("when the combination is not a bet builder", () => {
      it("should return false", () => {
        const combination = { isSgm: false };

        expect(isBetBuilder(combination)).toEqual(false);
      });
    });

    describe("when the combination is boosted", () => {
      it("should return false", () => {
        const combination = { isSgm: true, isBoosted: true };

        expect(isBetBuilder(combination)).toEqual(false);
      });
    });
  });

  describe("isMultiBetBuilder", () => {
    describe("when the combination is a multi bet builder", () => {
      it("should return true", () => {
        const combination = { isSgm: true, isSgmMultiple: true };

        expect(isMultiBetBuilder(combination)).toEqual(true);
      });
    });

    describe("when the combination is not a multi bet builder", () => {
      it("should return false", () => {
        const combination = { isSgm: true, isSgmMultiple: false };

        expect(isMultiBetBuilder(combination)).toEqual(false);
      });
    });
  });

  describe("findSingleCombinationFromLegId", () => {
    describe("when there is a respective SINGLE", () => {
      it("should return correct combination", () => {
        const combinations = {
          DOUBLEx1: {
            accaInsuranceDisplayOdds: null,
            accaInsuranceOdds: null,
            accaInsuranceOffers: [],
            accaInsuranceTokenId: null,
            accaInsuranceNumberOfLegs: null,
            accaInsuranceEventRestricted: false,
            accaInsuranceCompetitionRestricted: false,
            accaInsuranceAmountLimit: null,
            accaInsuranceMarketRestricted: false,
            availableOptions: [],
            baseMaxStake: 556,
            betReference: null,
            betType: BET_TYPES.DOUBLE,
            bonusWalletConditions: [],
            boostedAmount: 0,
            isBoosted: false,
            combinationGroupId: null,
            previousDisplayOdds: null,
            calculatedMaxStake: 556,
            maxPayout: 100,
            combinationGroup: null,
            creationTimestamp: 1550522838006,
            displayOdds: null,
            eachWayMaxStake: null,
            eachWayOdds: null,
            eachWayPlaces: null,
            eachWayPlacesFraction: null,
            id: "DOUBLEx1",
            isAccaInsuranceAvailable: false,
            isAccaInsuranceSelected: false,
            isActive: true,
            isBonusAvailable: false,
            isEachWayAvailable: false,
            isEachWaySelected: false,
            isGuaranteedPriceAvailable: false,
            isGuaranteedPriceSelected: false,
            isInplay: true,
            isPriceBoostAvailable: false,
            isPriceBoostSelected: false,
            isMoneyBackAvailable: false,
            isMoneyBackSelected: false,
            isSPAvailable: false,
            isSPSelected: false,
            isSgm: false,
            isSgmMultiple: false,
            legs: ["SIMPLE_SELECTION:[927.53154064-55190]", "SIMPLE_SELECTION:[927.53154065-55190]"],
            minStake: 0.09,
            minStakeIncrement: 0.01,
            numLines: 1,
            odds: {
              decimalOdds: 19,
              fractionalOdds: {
                denominator: 1,
                numerator: 18,
              },
            },
            originalPotentialReturns: null,
            potentialReturns: 0,
            previousOdds: null,
            priceBoostDisplayOdds: null,
            priceBoostEachWayOdds: null,
            priceBoostOdds: null,
            priceBoostOffers: [],
            priceBoostTokenId: null,
            moneyBackOffers: [],
            moneyBackTokenId: null,
            moneyBackNumberOfPlaces: null,
            moneyBackAmountLimit: null,
            moneyBackEventRestricted: false,
            moneyBackCompetitionRestricted: false,
            moneyBackMarketRestricted: false,
            stake: null,
            totalStake: 0,
            totalCombinedStake: 0,
          },
          "SIMPLE_SELECTION:[927.53154064-55190]": {
            accaInsuranceDisplayOdds: null,
            accaInsuranceOdds: null,
            accaInsuranceOffers: [],
            accaInsuranceTokenId: null,
            accaInsuranceNumberOfLegs: null,
            accaInsuranceEventRestricted: false,
            accaInsuranceCompetitionRestricted: false,
            accaInsuranceAmountLimit: null,
            accaInsuranceMarketRestricted: false,
            availableOptions: [],
            baseMaxStake: 556,
            betReference: null,
            betType: BET_TYPES.SINGLE,
            bonusWalletConditions: [],
            boostedAmount: 0,
            isBoosted: false,
            combinationGroupId: null,
            previousDisplayOdds: null,
            calculatedMaxStake: 556,
            maxPayout: 100,
            combinationGroup: null,
            creationTimestamp: 1550522838006,
            displayOdds: null,
            eachWayMaxStake: null,
            eachWayOdds: null,
            eachWayPlaces: null,
            eachWayPlacesFraction: null,
            id: "SIMPLE_SELECTION:[927.53154064-55190]",
            isAccaInsuranceAvailable: false,
            isAccaInsuranceSelected: false,
            isActive: true,
            isBonusAvailable: false,
            isEachWayAvailable: false,
            isEachWaySelected: false,
            isGuaranteedPriceAvailable: false,
            isGuaranteedPriceSelected: false,
            isInplay: true,
            isPriceBoostAvailable: false,
            isPriceBoostSelected: false,
            isMoneyBackAvailable: false,
            isMoneyBackSelected: false,
            isSPAvailable: false,
            isSPSelected: false,
            isSgm: false,
            isSgmMultiple: false,
            legs: ["SIMPLE_SELECTION:[927.53154064-55190]"],
            minStake: 0.09,
            minStakeIncrement: 0.01,
            numLines: 1,
            odds: {
              decimalOdds: 19,
              fractionalOdds: {
                denominator: 1,
                numerator: 18,
              },
            },
            originalPotentialReturns: null,
            potentialReturns: 0,
            previousOdds: null,
            priceBoostDisplayOdds: null,
            priceBoostEachWayOdds: null,
            priceBoostOdds: null,
            priceBoostOffers: [],
            priceBoostTokenId: null,
            moneyBackOffers: [],
            moneyBackTokenId: null,
            moneyBackNumberOfPlaces: null,
            moneyBackAmountLimit: null,
            moneyBackEventRestricted: false,
            moneyBackCompetitionRestricted: false,
            moneyBackMarketRestricted: false,
            stake: null,
            totalStake: 0,
            totalCombinedStake: 0,
          },
          "SIMPLE_SELECTION:[927.53154065-55190]": {
            accaInsuranceDisplayOdds: null,
            accaInsuranceOdds: null,
            accaInsuranceOffers: [],
            accaInsuranceTokenId: null,
            accaInsuranceNumberOfLegs: null,
            accaInsuranceEventRestricted: false,
            accaInsuranceCompetitionRestricted: false,
            accaInsuranceAmountLimit: null,
            accaInsuranceMarketRestricted: false,
            availableOptions: [],
            baseMaxStake: 556,
            betReference: null,
            betType: BET_TYPES.SINGLE,
            bonusWalletConditions: [],
            boostedAmount: 0,
            isBoosted: false,
            combinationGroupId: null,
            previousDisplayOdds: null,
            calculatedMaxStake: 556,
            maxPayout: 100,
            combinationGroup: null,
            creationTimestamp: 1550522838006,
            displayOdds: null,
            eachWayMaxStake: null,
            eachWayOdds: null,
            eachWayPlaces: null,
            eachWayPlacesFraction: null,
            id: "SIMPLE_SELECTION:[927.53154065-55190]",
            isAccaInsuranceAvailable: false,
            isAccaInsuranceSelected: false,
            isActive: true,
            isBonusAvailable: false,
            isEachWayAvailable: false,
            isEachWaySelected: false,
            isGuaranteedPriceAvailable: false,
            isGuaranteedPriceSelected: false,
            isInplay: true,
            isPriceBoostAvailable: false,
            isPriceBoostSelected: false,
            isMoneyBackAvailable: false,
            isMoneyBackSelected: false,
            isSPAvailable: false,
            isSPSelected: false,
            isSgm: false,
            isSgmMultiple: false,
            legs: ["SIMPLE_SELECTION:[927.53154065-55190]"],
            minStake: 0.09,
            minStakeIncrement: 0.01,
            numLines: 1,
            odds: {
              decimalOdds: 19,
              fractionalOdds: {
                denominator: 1,
                numerator: 18,
              },
            },
            originalPotentialReturns: null,
            potentialReturns: 0,
            previousOdds: null,
            priceBoostDisplayOdds: null,
            priceBoostEachWayOdds: null,
            priceBoostOdds: null,
            priceBoostOffers: [],
            priceBoostTokenId: null,
            moneyBackOffers: [],
            moneyBackTokenId: null,
            moneyBackNumberOfPlaces: null,
            moneyBackAmountLimit: null,
            moneyBackEventRestricted: false,
            moneyBackCompetitionRestricted: false,
            moneyBackMarketRestricted: false,
            stake: null,
            totalStake: 0,
            totalCombinedStake: 0,
          },
          "SIMPLE_SELECTION:[927.53154064-55190]-subgroup-1": {
            accaInsuranceDisplayOdds: null,
            accaInsuranceOdds: null,
            accaInsuranceOffers: [],
            accaInsuranceTokenId: null,
            accaInsuranceNumberOfLegs: null,
            accaInsuranceEventRestricted: false,
            accaInsuranceCompetitionRestricted: false,
            accaInsuranceAmountLimit: null,
            accaInsuranceMarketRestricted: false,
            availableOptions: [],
            baseMaxStake: 556,
            betReference: null,
            betType: BET_TYPES.SINGLE,
            bonusWalletConditions: [],
            boostedAmount: 0,
            isBoosted: true,
            combinationGroupId: "subgroup-1",
            previousDisplayOdds: null,
            calculatedMaxStake: 556,
            maxPayout: 100,
            combinationGroup: null,
            creationTimestamp: 1550522838006,
            displayOdds: null,
            eachWayMaxStake: null,
            eachWayOdds: null,
            eachWayPlaces: null,
            eachWayPlacesFraction: null,
            id: "SIMPLE_SELECTION:[927.53154064-55190]-subgroup-1",
            isAccaInsuranceAvailable: false,
            isAccaInsuranceSelected: false,
            isActive: true,
            isBonusAvailable: false,
            isEachWayAvailable: false,
            isEachWaySelected: false,
            isGuaranteedPriceAvailable: false,
            isGuaranteedPriceSelected: false,
            isInplay: true,
            isPriceBoostAvailable: false,
            isPriceBoostSelected: false,
            isMoneyBackAvailable: false,
            isMoneyBackSelected: false,
            isSPAvailable: false,
            isSPSelected: false,
            isSgm: false,
            isSgmMultiple: false,
            legs: ["SIMPLE_SELECTION:[927.53154064-55190]-subgroup-1"],
            minStake: 0.09,
            minStakeIncrement: 0.01,
            numLines: 1,
            odds: {
              decimalOdds: 19,
              fractionalOdds: {
                denominator: 1,
                numerator: 18,
              },
            },
            originalPotentialReturns: null,
            potentialReturns: 0,
            previousOdds: null,
            priceBoostDisplayOdds: null,
            priceBoostEachWayOdds: null,
            priceBoostOdds: null,
            priceBoostOffers: [],
            priceBoostTokenId: null,
            moneyBackOffers: [],
            moneyBackTokenId: null,
            moneyBackNumberOfPlaces: null,
            moneyBackAmountLimit: null,
            moneyBackEventRestricted: false,
            moneyBackCompetitionRestricted: false,
            moneyBackMarketRestricted: false,
            stake: null,
            totalStake: 0,
            totalCombinedStake: 0,
          },
        };
        const legId = "SIMPLE_SELECTION:[927.53154064-55190]";

        expect(findSingleCombinationFromLegId(combinations, legId)).toEqual({
          accaInsuranceDisplayOdds: null,
          accaInsuranceOdds: null,
          accaInsuranceOffers: [],
          accaInsuranceTokenId: null,
          accaInsuranceNumberOfLegs: null,
          accaInsuranceEventRestricted: false,
          accaInsuranceCompetitionRestricted: false,
          accaInsuranceAmountLimit: null,
          accaInsuranceMarketRestricted: false,
          availableOptions: [],
          baseMaxStake: 556,
          betReference: null,
          betType: BET_TYPES.SINGLE,
          bonusWalletConditions: [],
          boostedAmount: 0,
          calculatedMaxStake: 556,
          maxPayout: 100,
          combinationGroup: null,
          combinationGroupId: null,
          creationTimestamp: 1550522838006,
          displayOdds: null,
          eachWayMaxStake: null,
          eachWayOdds: null,
          eachWayPlaces: null,
          eachWayPlacesFraction: null,
          id: "SIMPLE_SELECTION:[927.53154064-55190]",
          isAccaInsuranceAvailable: false,
          isAccaInsuranceSelected: false,
          isActive: true,
          isBonusAvailable: false,
          isEachWayAvailable: false,
          isEachWaySelected: false,
          isGuaranteedPriceAvailable: false,
          isGuaranteedPriceSelected: false,
          isInplay: true,
          isPriceBoostAvailable: false,
          isPriceBoostSelected: false,
          isMoneyBackAvailable: false,
          isMoneyBackSelected: false,
          isSPAvailable: false,
          isSPSelected: false,
          isSgm: false,
          isSgmMultiple: false,
          isBoosted: false,
          legs: ["SIMPLE_SELECTION:[927.53154064-55190]"],
          minStake: 0.09,
          minStakeIncrement: 0.01,
          numLines: 1,
          odds: {
            decimalOdds: 19,
            fractionalOdds: {
              denominator: 1,
              numerator: 18,
            },
          },
          originalPotentialReturns: null,
          potentialReturns: 0,
          previousDisplayOdds: null,
          previousOdds: null,
          priceBoostDisplayOdds: null,
          priceBoostEachWayOdds: null,
          priceBoostOdds: null,
          priceBoostOffers: [],
          priceBoostTokenId: null,
          moneyBackOffers: [],
          moneyBackTokenId: null,
          moneyBackNumberOfPlaces: null,
          moneyBackAmountLimit: null,
          moneyBackEventRestricted: false,
          moneyBackCompetitionRestricted: false,
          moneyBackMarketRestricted: false,
          stake: null,
          totalStake: 0,
          totalCombinedStake: 0,
        });
      });
    });

    describe("when there is no respective base SINGLE", () => {
      it("should return undefined", () => {
        const combinations = {
          DOUBLEx1: {
            betType: BET_TYPES.DOUBLE,
            isBoosted: false,
            id: "DOUBLEx1",
            legs: ["SIMPLE_SELECTION:[927.53154064-55190]", "SIMPLE_SELECTION:[927.53154065-55190]"],
          },
          "SIMPLE_SELECTION:[927.53154064-55190]": {
            betType: BET_TYPES.SINGLE,
            isBoosted: false,
            id: "SIMPLE_SELECTION:[927.53154064-55190]",
            legs: ["SIMPLE_SELECTION:[927.53154064-55190]"],
          },
          "SIMPLE_SELECTION:[927.53154065-55190]": {
            betType: BET_TYPES.SINGLE,
            isBoosted: false,
            id: "SIMPLE_SELECTION:[927.53154065-55190]",
            legs: ["SIMPLE_SELECTION:[927.53154065-55190]"],
          },
          "SIMPLE_SELECTION:[927.53154064-55190]-subgroup-1": {
            id: "SIMPLE_SELECTION:[927.53154064-55190]-subgroup-1",
            isBoosted: true,
            betType: BET_TYPES.SINGLE,
            legs: ["SIMPLE_SELECTION:[927.53154064-55190]-subgroup-1"],
          },
        };
        const legId = "SIMPLE_SELECTION:[927.53154064-55190]-subgroup-1";

        expect(findSingleCombinationFromLegId(combinations, legId)).toBeUndefined();
      });
    });
  });

  describe("createGetMultiBetBuilderSelector", () => {
    const setup = (state) => createGetMultiBetBuilderSelector(getSportsbookBettingCombinations)(state);

    describe("when there is one multi bet builder combination", () => {
      it("should return that combination", () => {
        const state = {
          betting: {
            sportsbookBetting: {
              combinations: {
                "C:1": {
                  id: "C:1",
                  betType: BET_TYPES.SINGLE,
                  isSgmMultiple: true,
                },
              },
            },
          },
        };

        expect(setup(state)).toEqual(state.betting.sportsbookBetting.combinations["C:1"]);
      });
    });

    describe("when there is one or more multi bet builder", () => {
      it("should return the first found", () => {
        const state = {
          betting: {
            sportsbookBetting: {
              combinations: {
                "C:1": {
                  id: "C:1",
                  betType: BET_TYPES.SINGLE,
                  isSgmMultiple: false,
                },
                "C:2": {
                  id: "C:2",
                  betType: BET_TYPES.DOUBLE,
                  isSgmMultiple: true,
                },
                "C:3": {
                  id: "C:3",
                  betType: BET_TYPES.TREBLE,
                  isSgmMultiple: true,
                },
              },
            },
          },
        };

        expect(setup(state)).toEqual(state.betting.sportsbookBetting.combinations["C:2"]);
      });
    });
  });

  describe("isOrderableCast", () => {
    describe("when the leg is one of the orderables", () => {
      it("should return true", () => {
        const combination = {
          betType: BET_TYPES.SINGLE,
          legs: ["LEG:1"],
        };
        const map = {
          "LEG:1": {
            legType: LEG_TYPES.FORECAST,
          },
        };

        expect(isOrderableCast(combination, map)).toEqual(true);
      });
    });

    describe("when the leg is not one of the orderables", () => {
      it("should return true", () => {
        const combination = {
          betType: BET_TYPES.SINGLE,
          legs: ["LEG:1"],
        };
        const map = {
          "LEG:1": {
            legType: LEG_TYPES.REVERSE_FORECAST,
          },
        };

        expect(isOrderableCast(combination, map)).toEqual(false);
      });
    });
  });

  describe("isSimpleSelection", () => {
    describe("when SIMPLE_SELECTION leg type is present", () => {
      it("should return true", () => {
        const leg = {
          id: "LEG:2",
          legType: LEG_TYPES.SIMPLE_SELECTION,
        };

        expect(isSimpleSelection(leg)).toEqual(true);
      });
    });

    describe("when another leg type is present", () => {
      it("should return false", () => {
        const leg = {
          id: "LEG:1",
          legType: LEG_TYPES.FORECAST,
        };

        expect(isSimpleSelection(leg)).toEqual(false);
      });
    });
  });

  describe("getSimpleSelectionLegs", () => {
    it("should return only SIMPLE_SELECTION leg types", () => {
      const legsMap = {
        "LEG:1": {
          id: "LEG:1",
          legType: LEG_TYPES.FORECAST,
        },
        "LEG:2": {
          id: "LEG:2",
          legType: LEG_TYPES.SIMPLE_SELECTION,
        },
      };

      expect(getSimpleSelectionLegs(legsMap)).toEqual({
        "LEG:2": { id: "LEG:2", legType: LEG_TYPES.SIMPLE_SELECTION },
      });
    });
  });

  describe("convertEntityTupleToLegId", () => {
    describe("when a non-grouped selection", () => {
      it("should correctly convert a tuple to a legId", () => {
        expect(convertEntityTupleToLegId("9.2", 2)).toEqual("SIMPLE_SELECTION:[9.2-2]");
      });
    });

    describe("when a grouped selection", () => {
      it("should correctly convert a tuple to a legId", () => {
        expect(convertEntityTupleToLegId("9.2", 2, "bo-1")).toEqual("SIMPLE_SELECTION:[9.2-2]-bo-1");
      });
    });
  });

  describe("isLegInState", () => {
    describe("when the leg is present in the legs map", () => {
      it("should return true", () => {
        const map = {
          "SIMPLE_SELECTION:[9.2-2]": {
            legType: LEG_TYPES.SIMPLE_SELECTION,
          },
        };

        expect(isLegInState("SIMPLE_SELECTION:[9.2-2]", map)).toEqual(true);
      });
    });

    describe("when the leg is not present in the legs map", () => {
      it("should return false", () => {
        const map = {
          "SIMPLE_SELECTION:[9.81-81]": {
            legType: LEG_TYPES.SIMPLE_SELECTION,
          },
        };

        expect(isLegInState("SIMPLE_SELECTION:[9.2-2]", map)).toEqual(false);
      });
    });
  });

  describe("isSingleLegInState", () => {
    describe("when the leg is present in the state legs", () => {
      describe("when the present leg is SIMPLE_SELECTION", () => {
        it("should return true", () => {
          const sportsbookState = {
            legs: {
              "SIMPLE_SELECTION:[9.2-2]": {
                legType: LEG_TYPES.SIMPLE_SELECTION,
              },
            },
          };

          const selectionTuple = ["9.2-2"];

          expect(isSingleLegInState(sportsbookState, selectionTuple)).toEqual(true);
        });
      });

      describe("when the present leg is ONE_LINE_BET", () => {
        it("should return true", () => {
          const sportsbookState = {
            legs: {
              "ONE_LINE_BET:[9.3-2]": {
                legType: LEG_TYPES.ONE_LINE_BET,
              },
            },
          };

          const selectionTuple = ["9.3-2"];

          expect(isSingleLegInState(sportsbookState, selectionTuple)).toEqual(true);
        });
      });
    });

    describe("when the leg is not present in the legs map", () => {
      it("should return false", () => {
        const sportsbookState = {
          legs: {
            "SIMPLE_SELECTION:[9.81-81]": {
              legType: LEG_TYPES.SIMPLE_SELECTION,
            },
            "ONE_LINE_BET:[9.3-2]": {
              legType: LEG_TYPES.ONE_LINE_BET,
            },
          },
        };

        const selectionTuple = ["9.2-2"];

        expect(isSingleLegInState(sportsbookState, selectionTuple)).toEqual(false);
      });
    });
  });

  describe("getResultFromResultType", () => {
    it("returns LOST when result is LOSE and type is CONFIRMED", () => {
      expect(getResultFromResultType(BLHResult.LOSE, ResultType.CONFIRMED)).toBe(Result.LOST);
    });

    it("returns LOSING when result is LOSE and type is POTENTIAL", () => {
      expect(getResultFromResultType(BLHResult.LOSE, ResultType.POTENTIAL)).toBe(Result.LOSING);
    });

    it("returns WON when result is WIN and type is CONFIRMED", () => {
      expect(getResultFromResultType(BLHResult.WIN, ResultType.CONFIRMED)).toBe(Result.WON);
    });

    it("returns WINNING when result is WIN and type is POTENTIAL", () => {
      expect(getResultFromResultType(BLHResult.WIN, ResultType.POTENTIAL)).toBe(Result.WINNING);
    });

    it("returns VOID when result is VOID and type is CONFIRMED", () => {
      expect(getResultFromResultType(BLHResult.VOID, ResultType.CONFIRMED)).toBe(Result.VOID);
    });

    it("returns undefined when result is VOID and type is POTENTIAL", () => {
      expect(getResultFromResultType(BLHResult.VOID, ResultType.POTENTIAL)).toBeUndefined();
    });

    it("returns undefined when result is LOSE and type is unknown", () => {
      expect(getResultFromResultType(BLHResult.LOSE, "UNKNOWN")).toBeUndefined();
    });

    it("returns undefined when result is unknown and type is CONFIRMED", () => {
      expect(getResultFromResultType("UNKNOWN", ResultType.CONFIRMED)).toBeUndefined();
    });
  });

  describe("hasAnyInvalidCombinationFailure", () => {
    it("should return true if the failures array contains an invalid combination", () => {
      const failures = [{ failureCode: RUNNER_FAILURE_CODES.INVALID_COMBINATION }, { failureCode: "OTHER_FAILURE" }];
      const hasInvalid = hasAnyInvalidCombinationFailure(failures);
      expect(hasInvalid).toBe(true);
    });

    it("should return false if the failures array does not contain an invalid combination", () => {
      const failures = [{ failureCode: "OTHER_FAILURE" }, { failureCode: "ANOTHER_FAILURE" }];
      const hasInvalid = hasAnyInvalidCombinationFailure(failures);
      expect(hasInvalid).toBe(false);
    });
  });

  describe("hasAnyMarketClosedFailure", () => {
    it("should return true if any market has a closed failure", () => {
      const runnerFailures = [{ failureCode: RUNNER_FAILURE_CODES.MARKET_NOT_FOUND }, { failureCode: "OTHER_FAILURE" }];
      const hasClosedFailure = hasAnyMarketClosedFailure(runnerFailures);
      expect(hasClosedFailure).toBe(true);
    });

    it("should return false if no market has a closed failure", () => {
      const runnerFailures = [{ failureCode: "OTHER_FAILURE" }, { failureCode: "ANOTHER_FAILURE" }];
      const hasClosedFailure = hasAnyMarketClosedFailure(runnerFailures);
      expect(hasClosedFailure).toBe(false);
    });
  });

  describe("hasAnyMarketSuspendedFailure", () => {
    it("should return true if any market has a suspended failure", () => {
      const runnerFailures = [{ failureCode: RUNNER_FAILURE_CODES.MARKET_SUSPENDED }, { failureCode: "OTHER_FAILURE" }];
      const hasSuspendedFailure = hasAnyMarketSuspendedFailure(runnerFailures);
      expect(hasSuspendedFailure).toBe(true);
    });

    it("should return false if no market has a suspended failure", () => {
      const runnerFailures = [{ failureCode: "OTHER_FAILURE" }, { failureCode: "ANOTHER_FAILURE" }];
      const hasSuspendedFailure = hasAnyMarketSuspendedFailure(runnerFailures);
      expect(hasSuspendedFailure).toBe(false);
    });
  });
});
