import { createSelectorCreator } from "reselect";
import { BET_TYPES, LEG_TYPES, RUNNER_FAILURE_CODES, updateStake } from "@ppb/betslip-core";
import {
  getSportsbookBettingState,
  getSportsbookBettingCombinations,
  getSportsbookBettingReviewCombinations,
  getSportsbookBettingReviewLines,
  getSportsbookRunnerTree,
  getSportsbookMarketTree,
  getPlaceFailures,
  getAllUniqueRunnersFailures,
  getAllUniqueCombinationsFailures,
  getOperationalFailure,
  getPlaceRunnersFailures,
  getPlaceCombinationsFailures,
  getSportsbookBettingValidations,
  createSportsbookCombinationValidationsSelector,
  createHasMultiplesSelector,
  getSportsbookBettingLegs,
  getSportsbookBettingRunners,
  getSportsbookBettingImplyRunnerFailures,
  createSimpleSelectionsCounterSelector,
  createCombinationCounterSelector,
  createGetGreatestOddCombinationSelector,
  createGetCalculatedCombination,
  getSingleCombinationIds,
  createSportsbookBettingRunnerSelector,
  createGetSelectionIdsSelector,
  createGetBetBuilderCombinationIdsSelector,
  createGetCastGroupIdsSelector,
  createGetCastGroupSelector,
  createGetLegsByRunnerSelector,
  createCombinationGroupFailuresSelector,
  createGetFailureLegIdsByCombinationGroupIdSelector,
  createGetRunnerByCombinationGroupSelector,
  createGetCastRunnerIdsSelector,
  createGetReviewCombinationLineIdsSelector,
  getBettingResolvers,
  createGetCombinationEligibleGenerosityWalletsSelector,
  createGetCombinationsSelectedWalletsAmounts,
  createGetBoostedCombinationsSelector,
  getBoostedCombination,
  createGetBoostedUncombinedGroupIdsSelector,
  createGetLegIdsByCombinationGroupIdSelector,
  createQuickBetslipBetPickerSelector,
} from "./sportsbook-betting-selectors";
import {
  isMultiple,
  isSingle,
  isSingleLike,
  isBetBuilder,
  processAllUniqueCombinationsFailures,
  processAllUniqueRunnersFailures,
  groupCombinationsByMarketId,
  getUniqueFailedSGMCombinationGroups,
  isMultiBetBuilder,
  generateCastRunnersIds,
  generateCastGroupIds,
  isBoostedMultiple,
  hasAnyInvalidCombinationFailure,
} from "../../../helpers/sportsbook-betting";
import {
  getSportsbookMarketByURN,
  getSportsbookMarketRunnerById,
} from "../../entities/sportsbook-markets/sportsbook-market-selectors";
import { getSportByURN } from "../../entities/sports/sport-selectors";
import { getSportsbookRunnerByURN } from "../../entities/sportsbook-runners/sportsbook-runners-reducer";
import { createBettingRunnersMetadataSelector } from "../../entities/entities-selectors";
import { WalletTypes } from "../../../clients/catalogue/catalogue-response-types";

jest.mock("reselect", () => ({
  ...jest.requireActual("reselect"),
  createSelectorCreator: jest.fn(jest.requireActual("reselect").createSelectorCreator),
}));

jest.mock("@ppb/betslip-core", () => ({
  ...jest.requireActual("@ppb/betslip-core"),
  updateStake: jest.fn(),
}));
jest.mock("../../entities/sports/sport-selectors");
jest.mock("../../entities/sportsbook-markets/sportsbook-market-selectors");
jest.mock("../../entities/sportsbook-runners/sportsbook-runners-reducer");
jest.mock("../../../helpers/sportsbook-betting");

jest.mock("../../entities/entities-selectors", () => {
  const mock = jest.fn(() => "batatas");

  return {
    createGetVirtualMarketRunnerIdAssociationSelector: jest
      .fn()
      .mockReturnValue("getVirtualMarketRunnerIdAssociationSelector"),
    createGetVirtualMarketRunnerURNAssociationSelector: jest
      .fn()
      .mockReturnValue("getVirtualMarketRunnerURNAssociationSelector"),
    createGetVirtualAddPayloadSelector: jest.fn().mockReturnValue("getVirtualAddPayloadSelector"),
    createVirtualBettingRunnersMetadataSelector: jest.fn().mockReturnValue("virtualBettingRunnersMetadataSelector"),
    createGetMarketRunnerIdAssociationSelector: jest.fn().mockReturnValue("getMarketRunnerIdAssociationSelector"),
    createGetMarketRunnerURNAssociationSelector: jest.fn().mockReturnValue("getMarketRunnerURNAssociationSelector"),
    createGetAddSelectionsPayloadSelector: jest.fn().mockReturnValue("getAddSelectionsPayloadSelector"),
    createGetVirtualAddSelectionsPayloadSelector: jest.fn().mockReturnValue("getVirtualAddSelectionsPayloadSelector"),
    createGetAddPayloadSelector: jest.fn().mockReturnValue("getAddPayloadSelector"),
    createBettingRunnersMetadataSelector: () => mock,
  };
});

describe("Sportsbook Betting Selectors", () => {
  beforeEach(jest.clearAllMocks);

  describe("getSportsbookBettingState", () => {
    it("should return sportsbookBetting", () => {
      const state = { betting: { sportsbookBetting: {} } };

      expect(getSportsbookBettingState(state)).toBe(state.betting.sportsbookBetting);
    });
  });

  describe("getSportsbookBettingCombinations", () => {
    it("should return sportsbookBetting combinations", () => {
      const state = { betting: { sportsbookBetting: { combinations: {} } } };

      expect(getSportsbookBettingCombinations(state)).toBe(state.betting.sportsbookBetting.combinations);
    });
  });

  describe("getSportsbookBettingReviewCombinations", () => {
    it("should return sportsbookBetting review combinations", () => {
      const state = { betting: { sportsbookBetting: { reviews: { combinations: {} } } } };

      expect(getSportsbookBettingReviewCombinations(state)).toBe(state.betting.sportsbookBetting.reviews.combinations);
    });
  });

  describe("getSportsbookBettingReviewLines", () => {
    it("should return sportsbookBetting review lines", () => {
      const state = { betting: { sportsbookBetting: { reviews: { lines: {} } } } };

      expect(getSportsbookBettingReviewLines(state)).toBe(state.betting.sportsbookBetting.reviews.lines);
    });
  });

  describe("getSportsbookBettingImplyRunnerFailures", () => {
    it("should return sportsbookBetting failures imply runners", () => {
      const state = { betting: { sportsbookBetting: { failures: { imply: { runners: {} } } } } };

      expect(getSportsbookBettingImplyRunnerFailures(state)).toBe(
        state.betting.sportsbookBetting.failures.imply.runners,
      );
    });
  });

  describe("createSimpleSelectionsCounterSelector", () => {
    it("should return number of legs of type SIMPLE_SELECTION", () => {
      const state = {
        betting: {
          sportsbookBetting: {
            legs: {
              "L:1": {
                id: "L:1",
                legType: LEG_TYPES.SIMPLE_SELECTION,
              },
              "L:2": {
                id: "L:2",
                legType: LEG_TYPES.TRICAST,
              },
              "L:3": {
                id: "L:3",
                legType: LEG_TYPES.REVERSE_FORECAST,
              },
              "L:4": {
                id: "L:4",
                legType: LEG_TYPES.SIMPLE_SELECTION,
              },
            },
          },
        },
      };
      expect(createSimpleSelectionsCounterSelector()(state)).toBe(2);
    });

    it("should return number of legs of type ONE_LINE_BET", () => {
      const state = {
        betting: {
          sportsbookBetting: {
            legs: {
              "L:1": {
                id: "L:1",
                legType: LEG_TYPES.ONE_LINE_BET,
              },
              "L:2": {
                id: "L:2",
                legType: LEG_TYPES.TRICAST,
              },
              "L:3": {
                id: "L:3",
                legType: LEG_TYPES.REVERSE_FORECAST,
              },
              "L:4": {
                id: "L:4",
                legType: LEG_TYPES.ONE_LINE_MULTIPLE,
              },
            },
          },
        },
      };
      expect(createSimpleSelectionsCounterSelector()(state)).toBe(1);
    });

    it("should return number of legs of type ONE_LINE_BET and SIMPLE_SELECTION", () => {
      const state = {
        betting: {
          sportsbookBetting: {
            legs: {
              "L:1": {
                id: "L:1",
                legType: LEG_TYPES.SIMPLE_SELECTION,
              },
              "L:2": {
                id: "L:2",
                legType: LEG_TYPES.ONE_LINE_BET,
              },
              "L:3": {
                id: "L:3",
                legType: LEG_TYPES.REVERSE_FORECAST,
              },
              "L:4": {
                id: "L:4",
                legType: LEG_TYPES.SIMPLE_SELECTION,
              },
            },
          },
        },
      };
      expect(createSimpleSelectionsCounterSelector()(state)).toBe(3);
    });
  });

  describe("createCombinationCounterSelector", () => {
    it("should return the number of legs in the combination", () => {
      const state = {
        betting: {
          sportsbookBetting: {
            combinations: {
              "C:1": {
                id: "C:1",
                legs: ["L:1", "L:2", "L:3"],
              },
            },
          },
        },
      };

      expect(createCombinationCounterSelector()(state, "C:1")).toBe(3);
    });

    it("should return 0 when the combination does not exist", () => {
      const state = {
        betting: {
          sportsbookBetting: {
            combinations: {},
          },
        },
      };

      expect(createCombinationCounterSelector()(state, "C:1")).toBe(0);
    });

    it("should return the correct count for a single-leg combination", () => {
      const state = {
        betting: {
          sportsbookBetting: {
            combinations: {
              "C:1": {
                id: "C:1",
                legs: ["L:1"],
              },
            },
          },
        },
      };

      expect(createCombinationCounterSelector()(state, "C:1")).toBe(1);
    });
  });

  describe("createHasMultiplesSelector", () => {
    describe("when there is no multiples", () => {
      it("should return false", () => {
        const state = {
          betting: {
            sportsbookBetting: {
              combinations: {
                "C:1": {
                  id: "C:1",
                  betType: BET_TYPES.SINGLE,
                },
              },
            },
          },
        };
        isMultiple.mockReturnValue(false);

        expect(createHasMultiplesSelector()(state)).toBe(false);
      });
    });
    describe("when there is one or more multiples", () => {
      it("should return true", () => {
        const state = {
          betting: {
            sportsbookBetting: {
              combinations: {
                "C:1": {
                  id: "C:1",
                  betType: BET_TYPES.SINGLE,
                },
                "C:2": {
                  id: "C:2",
                  betType: BET_TYPES.DOUBLE,
                },
              },
            },
          },
        };

        isMultiple.mockReturnValueOnce(false).mockReturnValueOnce(true);

        expect(createHasMultiplesSelector()(state)).toBe(true);
      });
    });
  });

  describe("createGetGreatestOddCombinationSelector", () => {
    describe("when there is an accumulator", () => {
      const state = {
        betting: {
          sportsbookBetting: {
            combinations: {
              "C:5": {
                id: "C:5",
                numLines: 1,
                betType: BET_TYPES.DOUBLE,
              },
              "C:1": {
                id: "C:1",
                numLines: 1,
                betType: BET_TYPES.DOUBLE,
                odds: {
                  decimalOdds: 4,
                },
              },
              "C:2": {
                id: "C:2",
                numLines: 1,
                betType: BET_TYPES.SINGLE,
                odds: {
                  decimalOdds: 6,
                },
              },
              "C:3": {
                id: "C:3",
                numLines: 2,
                betType: BET_TYPES.TREBLE,
                odds: {
                  decimalOdds: 5,
                },
              },
              "C:4": {
                id: "C:4",
                numLines: 1,
                betType: BET_TYPES.SINGLE,
              },
            },
          },
        },
      };

      describe("when there is a single", () => {
        it("should sort and return the combination with biggest odd", () => {
          isSingle.mockReturnValue(true);
          isMultiple.mockReturnValue(false);
          isBetBuilder.mockReturnValue(false);
          isMultiBetBuilder.mockReturnValue(false);

          expect(createGetGreatestOddCombinationSelector()(state)).toBe(
            state.betting.sportsbookBetting.combinations["C:2"],
          );
        });
      });

      describe("when the bets are betbuilder", () => {
        it("should sort and return the combination with biggest odd", () => {
          isSingle.mockReturnValue(false);
          isMultiple.mockReturnValue(false);
          isBetBuilder.mockReturnValue(true);
          isMultiBetBuilder.mockReturnValue(false);

          expect(createGetGreatestOddCombinationSelector()(state)).toBe(
            state.betting.sportsbookBetting.combinations["C:2"],
          );
        });
      });

      describe("when the bets are multiples", () => {
        it("should sort and return the combination with biggest odd", () => {
          isSingle.mockReturnValue(false);
          isMultiple.mockReturnValue(true);
          isBetBuilder.mockReturnValue(false);
          isMultiBetBuilder.mockReturnValue(false);

          expect(createGetGreatestOddCombinationSelector()(state)).toBe(
            state.betting.sportsbookBetting.combinations["C:2"],
          );
        });
      });

      describe("when the bets are multibetbuilders", () => {
        it("should sort and return the combination with biggest odd", () => {
          isSingle.mockReturnValue(false);
          isMultiple.mockReturnValue(false);
          isBetBuilder.mockReturnValue(false);
          isMultiBetBuilder.mockReturnValue(true);
          isBoostedMultiple.mockReturnValue(false);

          expect(createGetGreatestOddCombinationSelector()(state)).toBe(
            state.betting.sportsbookBetting.combinations["C:2"],
          );
        });
      });

      describe("when the bets are boosted multiples", () => {
        it("should sort and return the combination with biggest odd", () => {
          isSingle.mockReturnValue(false);
          isMultiple.mockReturnValue(false);
          isBetBuilder.mockReturnValue(false);
          isMultiBetBuilder.mockReturnValue(false);
          isBoostedMultiple.mockReturnValue(true);

          expect(createGetGreatestOddCombinationSelector()(state)).toBe(
            state.betting.sportsbookBetting.combinations["C:2"],
          );
        });
      });
    });

    describe("when there is no accumulator", () => {
      it("should return undefined", () => {
        const state = {
          betting: {
            sportsbookBetting: {
              combinations: {
                "C:2": {
                  id: "C:2",
                  numLines: 1,
                  betType: BET_TYPES.SINGLE,
                },
                "C:3": {
                  id: "C:3",
                  numLines: 2,
                  betType: BET_TYPES.TREBLE,
                },
              },
            },
          },
        };
        isSingle.mockReturnValue(false);
        isMultiple.mockReturnValue(false);
        isBetBuilder.mockReturnValue(false);
        isMultiBetBuilder.mockReturnValue(true);

        expect(createGetGreatestOddCombinationSelector()(state)).toBe(undefined);
      });
    });
  });

  describe("createGetCalculatedCombination", () => {
    describe("when there is a combination", () => {
      it("should return the calculated combination", () => {
        const state = {
          betting: {
            sportsbookBetting: {
              combinations: {
                "C:2": {
                  id: "C:2",
                  numLines: 1,
                  betType: BET_TYPES.SINGLE,
                },
              },
            },
          },
        };
        updateStake.mockReturnValue({
          combinations: {
            "C:2": {
              id: "C:2",
              numLines: 1,
              betType: BET_TYPES.SINGLE,
              totalStake: 1,
              potentialReturns: 12,
            },
          },
        });
        expect(createGetCalculatedCombination()(state, { combinationId: "C:2", stake: 2 })).toEqual({
          id: "C:2",
          numLines: 1,
          betType: BET_TYPES.SINGLE,
          totalStake: 1,
          potentialReturns: 12,
        });
      });

      it("should call updateStake with the correct parameters", () => {
        const state = {
          betting: {
            sportsbookBetting: {
              combinations: {
                "C:2": {
                  id: "C:2",
                  numLines: 1,
                  betType: BET_TYPES.SINGLE,
                },
              },
            },
          },
        };
        updateStake.mockReturnValue({
          combinations: {
            "C:2": {
              id: "C:2",
              numLines: 1,
              betType: BET_TYPES.SINGLE,
              totalStake: 1,
              potentialReturns: 12,
            },
          },
        });
        createGetCalculatedCombination()(state, { combinationId: "C:2", stake: 2 });
        expect(updateStake).toHaveBeenCalledWith(state.betting.sportsbookBetting, { combinationId: "C:2", stake: 2 });
      });
    });

    describe("when there is no combination for the combination id", () => {
      it("should return undefined", () => {
        const state = {
          betting: {
            sportsbookBetting: {
              combinations: {
                "C:2": {
                  id: "C:2",
                  numLines: 1,
                  betType: BET_TYPES.SINGLE,
                },
              },
            },
          },
        };
        expect(createGetCalculatedCombination()(state, { combinationId: "C:1" })).toBe(undefined);
      });
    });

    describe("when there is no combination id", () => {
      it("should return undefined", () => {
        const state = {
          betting: {
            sportsbookBetting: {
              combinations: {
                "C:2": {
                  id: "C:2",
                  numLines: 1,
                  betType: BET_TYPES.SINGLE,
                },
              },
            },
          },
        };
        expect(createGetCalculatedCombination()(state, {})).toBe(undefined);
      });
    });
  });

  describe("getSportsbookBettingLegs", () => {
    it("should return sportsbookBetting", () => {
      const state = { betting: { sportsbookBetting: { legs: "legs" } } };

      expect(getSportsbookBettingLegs(state)).toBe("legs");
    });
  });

  describe("getSportsbookBettingRunners", () => {
    it("should return sportsbook betting runners", () => {
      const state = { betting: { sportsbookBetting: { runners: "runners" } } };

      expect(getSportsbookBettingRunners(state)).toBe("runners");
    });
  });

  describe("getSportsbookMarketTree", () => {
    const appState = {
      entities: {
        sportsbookrunners: "sportsbookrunners",
        sportsbookmarkets: "sportsbookmarkets",
        sports: "sports",
      },
    };
    const runner = { urn: "dummy:urn", selectionId: 123 };
    const market = { sport: "sport:urn", runners: [runner] };
    const marketRunner = "market_runner";
    const sport = "sport";

    const setup = () => {
      getSportsbookMarketByURN.mockReturnValue(market);
      getSportsbookMarketRunnerById.mockReturnValue(marketRunner);
      getSportByURN.mockReturnValue(sport);
    };

    beforeEach(jest.clearAllMocks);

    describe("when there is no SBK market", () => {
      it("should return null", () => {
        setup();
        getSportsbookMarketByURN.mockReturnValue(undefined);

        expect(getSportsbookMarketTree(appState, "market:urn", "dummy:urn")).toBe(null);
        expect(getSportsbookMarketByURN).toHaveBeenCalledWith(appState.entities.sportsbookmarkets, "market:urn");
      });
    });

    describe("when there is no selection Id", () => {
      it("should return null", () => {
        setup();
        getSportsbookMarketByURN.mockReturnValue({ ...market, runners: [{ urn: "runner:urn:1", selectionId: 12 }] });

        expect(getSportsbookMarketTree(appState, "market:urn", "dummy:urn")).toBe(null);
      });
    });

    describe("when there is no SBK market runner", () => {
      it("should return null", () => {
        setup();
        getSportsbookMarketRunnerById.mockReturnValue(undefined);

        expect(getSportsbookMarketTree(appState, "market:urn", "dummy:urn")).toBe(null);
        expect(getSportsbookMarketRunnerById).toHaveBeenCalledWith(market.runners, runner.selectionId);
      });
    });

    describe("when there is no SBK sport", () => {
      it("should return null", () => {
        setup();
        getSportByURN.mockReturnValue(undefined);

        expect(getSportsbookMarketTree(appState, "market:urn", "dummy:urn")).toBe(null);
        expect(getSportByURN).toHaveBeenCalledWith(appState.entities.sports, market.sport);
      });
    });

    describe("when an SBK market, market runner and sport is found", () => {
      it("should return the tree", () => {
        setup();

        expect(getSportsbookMarketTree(appState, "market:urn", "dummy:urn")).toEqual({
          market,
          marketRunner,
          sport,
        });
      });
    });
  });

  describe("getSportsbookRunnerTree", () => {
    const appState = {
      entities: {
        sportsbookrunners: "sportsbookrunners",
        sportsbookmarkets: "sportsbookmarkets",
        sports: "sports",
      },
    };
    const runner = { urn: "dummy:urn", market: "market:urn", selectionId: 123 };
    const market = { sport: "sport:urn", runners: [runner] };
    const marketRunner = "market_runner";
    const sport = "sport";

    const setup = () => {
      getSportsbookRunnerByURN.mockReturnValue(runner);
      getSportsbookMarketByURN.mockReturnValue(market);
      getSportsbookMarketRunnerById.mockReturnValue(marketRunner);
      getSportByURN.mockReturnValue(sport);
    };

    beforeEach(jest.clearAllMocks);

    describe("when there is no SBK runner", () => {
      it("should return null", () => {
        setup();
        getSportsbookRunnerByURN.mockReturnValue(undefined);

        expect(getSportsbookRunnerTree(appState, runner.urn)).toBe(null);
        expect(getSportsbookRunnerByURN).toHaveBeenCalledWith(appState.entities.sportsbookrunners, runner.urn);
      });
    });

    describe("when there is no SBK market", () => {
      it("should return null", () => {
        setup();
        getSportsbookMarketByURN.mockReturnValue(undefined);

        expect(getSportsbookRunnerTree(appState, runner.urn)).toBe(null);
        expect(getSportsbookMarketByURN).toHaveBeenCalledWith(appState.entities.sportsbookmarkets, runner.market);
      });
    });

    describe("when there is no SBK market runner", () => {
      it("should return null", () => {
        setup();
        getSportsbookMarketRunnerById.mockReturnValue(undefined);

        expect(getSportsbookRunnerTree(appState, runner.urn)).toBe(null);
        expect(getSportsbookMarketRunnerById).toHaveBeenCalledWith(market.runners, runner.selectionId);
      });
    });

    describe("when there is no SBK sport", () => {
      it("should return null", () => {
        setup();
        getSportByURN.mockReturnValue(undefined);

        expect(getSportsbookRunnerTree(appState, runner.urn)).toBe(null);
        expect(getSportByURN).toHaveBeenCalledWith(appState.entities.sports, market.sport);
      });
    });

    describe("when an SBK runner, market, market runner and sport is found", () => {
      it("should return the tree", () => {
        setup();

        expect(getSportsbookRunnerTree(appState, runner.urn)).toEqual({
          market,
          marketRunner,
          runner,
          sport,
        });
      });
    });

    describe("when isLotto is true", () => {
      it("should return the tree with lotto as a sport", () => {
        setup();

        expect(getSportsbookRunnerTree(appState, runner.urn, true)).toEqual({
          market,
          marketRunner,
          runner,
          sport: { urn: "ppb:eventType:29125756", name: "Lotteries", sportId: 29125756, typename: "Sport" },
        });
      });
    });
  });

  describe("getPlaceFailures", () => {
    it("should return all the place failures from the state", () => {
      const place = {
        "FAIL:1": {
          fail: "FAIL:1",
        },
      };
      const appState = {
        betting: {
          sportsbookBetting: {
            failures: {
              place,
            },
          },
        },
      };
      expect(getPlaceFailures(appState)).toEqual(place);
    });
  });

  describe("getPlaceRunnersFailures", () => {
    it("should return all the place runners failures from the state", () => {
      const place = {
        runners: {
          "FAIL:1": {},
        },
      };
      const appState = {
        betting: {
          sportsbookBetting: {
            failures: {
              place,
            },
          },
        },
      };
      expect(getPlaceRunnersFailures(appState)).toEqual(place.runners);
    });
  });

  describe("getPlaceCombinationsFailures", () => {
    it("should return all the place combinations failures from the state", () => {
      const place = {
        combinations: {
          "FAIL:1": {},
        },
      };
      const appState = {
        betting: {
          sportsbookBetting: {
            failures: {
              place,
            },
          },
        },
      };
      expect(getPlaceCombinationsFailures(appState)).toEqual(place.combinations);
    });
  });

  describe("getOperationalFailure", () => {
    it("should return the operational failure", () => {
      const place = {
        operational: { failureCode: "SOME_FAIL" },
      };
      const appState = {
        betting: {
          sportsbookBetting: {
            failures: {
              place,
            },
          },
        },
      };
      expect(getOperationalFailure(appState)).toEqual({ failureCode: "SOME_FAIL" });
    });
  });

  describe("getAllUniqueRunnersFailures", () => {
    it("should return all unique runner failures", () => {
      const expectedResult = ["FAIL", "SOME_FAIL", "SOME_FAIL_2"];
      processAllUniqueRunnersFailures.mockReturnValue(expectedResult);

      const place = {
        runners: {
          "runner:1": [{ failureCode: "FAIL" }, { failureCode: "FAIL" }, { failureCode: "SOME_FAIL" }],
          "runner:2": [{ failureCode: "FAIL" }, { failureCode: "SOME_FAIL_2" }],
        },
      };
      const appState = {
        betting: {
          sportsbookBetting: {
            failures: {
              place,
            },
          },
        },
      };
      expect(getAllUniqueRunnersFailures(appState)).toEqual(expectedResult);
    });
  });

  describe("getAllUniqueCombinationsFailures", () => {
    it("should return all unique combination failures ignoring OTHER_FAILURE_IN_REQUEST", () => {
      const expectedResult = ["FAIL", "SOME_FAIL"];
      processAllUniqueCombinationsFailures.mockReturnValue(expectedResult);

      const place = {
        combinations: {
          "combination:1": { failureCode: "OTHER_FAILURE_IN_REQUEST" },
          "combination:2": { failureCode: "FAIL" },
          "combination:3": { failureCode: "FAIL" },
          "combination:4": { failureCode: "SOME_FAIL" },
        },
      };
      const appState = {
        betting: {
          sportsbookBetting: {
            failures: {
              place,
            },
          },
        },
      };
      expect(getAllUniqueCombinationsFailures(appState)).toEqual(["FAIL", "SOME_FAIL"]);
    });
  });

  describe("getSportsbookBettingValidations", () => {
    it("should return the validations object", () => {
      const state = {
        betting: {
          sportsbookBetting: {
            validations: {
              "combinationId-1": ["validationId-1"],
            },
          },
        },
      };
      const validations = getSportsbookBettingValidations(state);

      expect(validations).toEqual({
        "combinationId-1": ["validationId-1"],
      });
    });
  });

  describe("createGetSelectionIdsSelector", () => {
    it("should return the IDs of all simple selections", () => {
      const legsMap = {
        leg1: {
          id: "leg1",
          legType: "SIMPLE_SELECTION",
        },
        leg2: {
          id: "leg2",
          legType: "TRICAST",
        },
        leg3: {
          id: "leg3",
          legType: "FORECAST",
        },
        leg4: {
          id: "leg4",
          legType: "SIMPLE_SELECTION",
        },
        leg5: {
          id: "leg5",
          legType: "BATATAS",
        },
      };

      const selectionIds = createGetSelectionIdsSelector()(legsMap);

      expect(selectionIds).toEqual(["leg1", "leg4"]);
    });

    it("should return the IDs of all one line bet selections", () => {
      const legsMap = {
        leg1: {
          id: "leg1",
          legType: "TRICAST",
        },
        leg2: {
          id: "leg2",
          legType: "ONE_LINE_BET",
        },
        leg3: {
          id: "leg3",
          legType: "ONE_LINE_BET",
        },
        leg4: {
          id: "leg4",
          legType: "FORECAST",
        },
        leg5: {
          id: "leg5",
          legType: "BATATAS",
        },
      };

      const selectionIds = createGetSelectionIdsSelector()(legsMap);

      expect(selectionIds).toEqual(["leg2", "leg3"]);
    });

    it("should return the IDs of all one line bet and simple selections", () => {
      const legsMap = {
        leg1: {
          id: "leg1",
          legType: "SIMPLE_SELECTION",
        },
        leg2: {
          id: "leg2",
          legType: "ONE_LINE_BET",
        },
        leg3: {
          id: "leg3",
          legType: "ONE_LINE_BET",
        },
        leg4: {
          id: "leg4",
          legType: "SIMPLE_SELECTION",
        },
        leg5: {
          id: "leg5",
          legType: "BATATAS",
        },
      };

      const selectionIds = createGetSelectionIdsSelector()(legsMap);

      expect(selectionIds).toEqual(["leg1", "leg2", "leg3", "leg4"]);
    });
  });

  describe("createGetReviewCombinationLineIdsSelector", () => {
    describe("when it does not have reviews for the combination", () => {
      it("should return an empty set", () => {
        const reviewCombinations = {
          betting: {
            sportsbookBetting: {
              reviews: {
                combinations: {
                  "SIMPLE_SELECTION:3": {
                    lineIds: [1, 2, 3],
                  },
                },
              },
            },
          },
        };

        const lineIds = createGetReviewCombinationLineIdsSelector()(reviewCombinations, "SIMPLE_SELECTION:4");

        expect(lineIds).toEqual([]);
      });
    });

    describe("when it has reviews for the combination", () => {
      it("should return all the lines", () => {
        const reviewCombinations = {
          betting: {
            sportsbookBetting: {
              reviews: {
                combinations: {
                  "SIMPLE_SELECTION:3": {
                    lineIds: [1, 2, 3],
                  },
                },
              },
            },
          },
        };

        const lineIds = createGetReviewCombinationLineIdsSelector()(reviewCombinations, "SIMPLE_SELECTION:3");

        expect(lineIds).toEqual([1, 2, 3]);
      });
    });
  });

  describe("createGetCastRunnerIdsSelector", () => {
    const combinations = {
      "C:1": {
        legs: ["L:1"],
      },
    };
    const legs = {
      "L:1": {
        runners: ["R:1", "R:2", "R:3"],
      },
    };
    const runners = {
      "R:1": { order: null },
      "R:2": { order: null },
      "R:3": { order: null },
    };
    const state = {
      betting: {
        sportsbookBetting: {
          combinations,
          legs,
          runners,
        },
      },
    };

    const castRunnersIds = ["R:1", "R:2", "R:3"];

    it("should return runner ids", () => {
      generateCastRunnersIds.mockReturnValueOnce(castRunnersIds);

      const result = createGetCastRunnerIdsSelector()(state, "C:1");

      expect(generateCastRunnersIds).toHaveBeenCalledTimes(1);
      expect(generateCastRunnersIds).toHaveBeenCalledWith(combinations, legs, runners, "C:1");

      expect(result).toEqual(castRunnersIds);
    });

    describe("when combinationId is not provided", () => {
      it("should call generateCastRunnersIds with combinationId as undefined", () => {
        createGetCastRunnerIdsSelector()(state);

        expect(generateCastRunnersIds).toHaveBeenCalledTimes(1);
        expect(generateCastRunnersIds).toHaveBeenCalledWith(combinations, legs, runners, undefined);
      });
    });
  });

  describe("createGetBoostedCombinationsSelector", () => {
    it("should return boosted combinations", () => {
      const combinations = {
        "C:1": {
          id: "C:1",
          isBoosted: false,
        },
        "C:2": {
          id: "C:2",
          isBoosted: true,
        },
        "C:3": {
          id: "C:3",
          isBoosted: false,
        },
        "C:4": {
          id: "C:4",
          isBoosted: true,
        },
      };

      const state = {
        betting: {
          sportsbookBetting: {
            combinations,
          },
        },
      };

      const result = createGetBoostedCombinationsSelector()(state);
      expect(result).toEqual([
        state.betting.sportsbookBetting.combinations["C:2"],
        state.betting.sportsbookBetting.combinations["C:4"],
      ]);
    });
  });

  describe("getBoostedCombination", () => {
    it("should return boosted combination", () => {
      const combinations = {
        "C:1": {
          id: "C:1",
          isBoosted: false,
        },
        "C:2": {
          id: "C:2",
          isBoosted: true,
        },
        "C:3": {
          id: "C:3",
          isBoosted: false,
        },
        "C:4": {
          id: "C:4",
          isBoosted: true,
        },
      };

      const state = {
        betting: {
          sportsbookBetting: {
            combinations,
          },
        },
      };

      expect(getBoostedCombination(state, "C:1")).toBeUndefined();
      expect(getBoostedCombination(state, "C:2")).toBe(state.betting.sportsbookBetting.combinations["C:2"]);
      expect(getBoostedCombination(state, "C:3")).toBeUndefined();
      expect(getBoostedCombination(state, "C:4")).toBe(state.betting.sportsbookBetting.combinations["C:4"]);
    });
  });

  describe("createCombinationGroupFailuresSelector", () => {
    describe("when there are failures without a valid combination", () => {
      it("should return those unique combination groups as is", () => {
        const state = {
          betting: {
            sportsbookBetting: {
              failures: {
                imply: { runners: {} },
              },
              runners: {
                "R:1": { id: "R:1" },
                "R:2": { id: "R:2" },
              },
              combinations: {},
            },
          },
        };

        getUniqueFailedSGMCombinationGroups.mockReturnValue([1, 2]);
        const combinationGroups = createCombinationGroupFailuresSelector()(state);

        expect(combinationGroups).toEqual([1, 2]);
      });
    });

    describe("when there are failures with a valid combination", () => {
      it("should not return those combination groups", () => {
        const state = {
          betting: {
            sportsbookBetting: {
              failures: {
                imply: {
                  runners: {},
                },
              },
              runners: {
                "R:1": { id: "R:1" },
                "R:2": { id: "R:2" },
              },
              combinations: {
                "C:1": {
                  combinationGroup: 1,
                },
              },
            },
          },
        };

        getUniqueFailedSGMCombinationGroups.mockReturnValue([1, 2]);
        const combinationGroups = createCombinationGroupFailuresSelector()(state);

        expect(combinationGroups).toEqual([2]);
      });
    });
  });

  describe("createGetLegIdsByCombinationGroupIdSelector", () => {
    describe("when there are legs with the given groupId", () => {
      it("should return the correct leg id's", () => {
        const state = {
          betting: {
            sportsbookBetting: {
              legs: {
                "LEG:1-BOOSTED_GROUP": {
                  id: "LEG:1-BOOSTED_GROUP",
                  isBoosted: true,
                  groupId: "BOOSTED_GROUP",
                },
                "LEG:2-BOOSTED_GROUP": {
                  id: "LEG:2-BOOSTED_GROUP",
                  isBoosted: true,
                  groupId: "BOOSTED_GROUP",
                },
              },
              combinations: {},
            },
          },
        };

        expect(createGetLegIdsByCombinationGroupIdSelector()(state, "BOOSTED_GROUP")).toEqual([
          "LEG:1-BOOSTED_GROUP",
          "LEG:2-BOOSTED_GROUP",
        ]);
      });
    });

    describe("when there are no legs with the given groupId", () => {
      it("should return an empty array", () => {
        const state = {
          betting: {
            sportsbookBetting: {
              legs: {
                "LEG:1-BOOST_GROUP": {
                  id: "LEG:1-BOOST_GROUP",
                  isBoosted: true,
                  groupId: "BOOSTED_GROUP",
                },
              },
              combinations: {},
            },
          },
        };

        expect(createGetLegIdsByCombinationGroupIdSelector()(state, "BOOSTED_GROUP2")).toEqual([]);
      });
    });
  });

  describe("createGetBoostedUncombinedGroupIdsSelector", () => {
    describe("when there are boosted legs with leg failures", () => {
      it("should return the group ids without repetition", () => {
        const state = {
          betting: {
            sportsbookBetting: {
              legs: {
                "LEG:1-BOOST_GROUP": {
                  id: "LEG:1-BOOST_GROUP",
                  isBoosted: true,
                  groupId: "BOOSTED_GROUP2",
                  runners: ["RUNNER:1"],
                },
                "LEG:2-BOOST_GROUP2": {
                  id: "LEG:2-BOOST_GROUP2",
                  isBoosted: true,
                  groupId: "BOOSTED_GROUP2",
                  runners: ["RUNNER:2"],
                },
              },
              combinations: {
                "COMB:1": {
                  id: "COMB:1",
                  isBoosted: true,
                  combinationGroupId: "BOOSTED_GROUP",
                },
              },
              failures: {
                imply: {
                  legs: {
                    "LEG:2-BOOST_GROUP2": [{ failureCode: "X" }],
                  },
                  runners: {},
                },
              },
            },
          },
        };

        expect(createGetBoostedUncombinedGroupIdsSelector()(state)).toEqual(["BOOSTED_GROUP2"]);
      });
    });

    describe("when there are boosted legs with runner failures of the same combination group id", () => {
      it("should return the group ids without repetition", () => {
        const state = {
          betting: {
            sportsbookBetting: {
              legs: {
                "LEG:1-BOOST_GROUP": {
                  id: "LEG:1-BOOST_GROUP",
                  isBoosted: true,
                  groupId: "BOOSTED_GROUP2",
                  runners: ["RUNNER:1"],
                },
                "LEG:2-BOOST_GROUP2": {
                  id: "LEG:2-BOOST_GROUP2",
                  isBoosted: true,
                  groupId: "BOOSTED_GROUP2",
                  runners: ["RUNNER:2"],
                },
              },
              combinations: {
                "COMB:1": {
                  id: "COMB:1",
                  isBoosted: true,
                  combinationGroupId: "BOOSTED_GROUP",
                },
              },
              failures: {
                imply: {
                  legs: {},
                  runners: {
                    "RUNNER:1": [{ failureCode: "X" }],
                    "RUNNER:2": [{ failureCode: "X" }],
                  },
                },
              },
            },
          },
        };

        expect(createGetBoostedUncombinedGroupIdsSelector()(state)).toEqual(["BOOSTED_GROUP2"]);
      });
    });

    describe("when there are no leg failures nor runner failures", () => {
      it("should return an empty array", () => {
        const state = {
          betting: {
            sportsbookBetting: {
              legs: {
                "LEG:1-BOOST_GROUP": {
                  id: "LEG:1-BOOST_GROUP",
                  isBoosted: true,
                  groupId: "BOOSTED_GROUP2",
                  runners: ["RUNNER:1"],
                },
                "LEG:2-BOOST_GROUP2": {
                  id: "LEG:2-BOOST_GROUP2",
                  isBoosted: true,
                  groupId: "BOOSTED_GROUP2",
                  runners: ["RUNNER:1"],
                },
              },
              combinations: {
                "COMB:1": {
                  id: "COMB:1",
                  isBoosted: true,
                  combinationGroupId: "BOOSTED_GROUP",
                },
              },
              failures: {
                imply: {
                  legs: {},
                  runners: {},
                },
              },
            },
          },
        };

        expect(createGetBoostedUncombinedGroupIdsSelector()(state)).toEqual([]);
      });
    });
  });

  describe("createGetFailureLegIdsByCombinationGroupIdSelector", () => {
    describe("when the combination group is defined", () => {
      it("should return the legs related to that combination group", () => {
        const state = {
          betting: {
            sportsbookBetting: {
              failures: {
                imply: {
                  runners: {
                    "R:1": [
                      {
                        combinationGroups: [1],
                        failureCode: RUNNER_FAILURE_CODES.INVALID_SGM_COMBINATION_SINGLE_ODDS,
                      },
                    ],
                    "R:2": [
                      {
                        combinationGroups: [2],
                        failureCode: RUNNER_FAILURE_CODES.INVALID_SGM_COMBINATION_SINGLE_ODDS,
                      },
                    ],
                  },
                },
              },
              legs: {
                "L:1": {
                  id: "L:1",
                  runners: ["R:1"],
                },
                "L:2": {
                  id: "L:2",
                  runners: ["R:2"],
                },
              },
              runners: {
                "R:1": { id: "R:1" },
                "R:2": { id: "R:2" },
              },
              combinations: {},
            },
          },
        };

        const legIds = createGetFailureLegIdsByCombinationGroupIdSelector()(state, 1);

        expect(legIds).toEqual(["L:1"]);
      });
    });
  });

  describe("createGetLegsByRunnerSelector", () => {
    it("should return the legs which have the runners", () => {
      const state = {
        betting: {
          sportsbookBetting: {
            legs: {
              leg1: {
                id: "leg1",
                legType: "SIMPLE_SELECTION",
                runners: ["R:1"],
              },
              leg2: {
                id: "leg2",
                legType: "TRICAST",
                runners: ["R:2"],
              },
              leg3: {
                id: "leg3",
                legType: "FORECAST",
                runners: ["R:1", "R:2"],
              },
              leg4: {
                id: "leg4",
                legType: "SIMPLE_SELECTION",
                runners: ["R:3"],
              },
              leg5: {
                id: "leg5",
                legType: "BATATAS",
                runners: ["R:4"],
              },
            },
          },
        },
      };

      const legIds = createGetLegsByRunnerSelector()(state, ["R:1", "R:2"]);

      expect(legIds).toEqual(["leg1", "leg2", "leg3"]);
    });
  });

  describe("createGetRunnerByCombinationGroupSelector", () => {
    it("should the runners with the combination groups", () => {
      const state = {
        betting: {
          sportsbookBetting: {
            failures: {
              imply: {
                runners: {
                  "R:1": [
                    {
                      combinationGroups: [1],
                      failureCode: RUNNER_FAILURE_CODES.INVALID_SGM_COMBINATION_SINGLE_ODDS,
                    },
                  ],
                  "R:2": [
                    {
                      combinationGroups: [1],
                      failureCode: RUNNER_FAILURE_CODES.INVALID_SGM_COMBINATION_SINGLE_ODDS,
                    },
                  ],
                },
              },
            },
            runners: {
              "R:1": { id: "R:1" },
              "R:2": { id: "R:2" },
            },
          },
        },
      };

      const runnerIds = createGetRunnerByCombinationGroupSelector()(state, 1);

      expect(runnerIds).toEqual(["R:1", "R:2"]);
    });
  });

  describe("getSingleCombinationIds", () => {
    it("should return ordered single ids only", () => {
      const state = {
        betting: {
          sportsbookBetting: {
            combinations: {
              "C:1": {
                id: "C:1",
                legs: ["LEG:1"],
                betType: BET_TYPES.SINGLE,
              },
              "C:2": {
                id: "C:2",
                legs: ["LEG:1", "LEG:2"],
                betType: BET_TYPES.DOUBLE,
              },
            },
          },
        },
      };

      isSingleLike.mockReturnValueOnce(true);
      isSingleLike.mockReturnValueOnce(false);

      const ids = getSingleCombinationIds(state);

      expect(ids).toEqual(["C:1"]);
    });
  });

  describe("createGetBetBuilderCombinationIdsSelector", () => {
    it("should return bet builder ids only", () => {
      const state = {
        betting: {
          sportsbookBetting: {
            combinations: {
              "C:1": {
                id: "C:1",
                legs: ["LEG:1", "LEG:2"],
                betType: BET_TYPES.DOUBLE,
                isSameGameMultiple: true,
              },
              "C:2": {
                id: "C:2",
                legs: ["LEG:3", "LEG:4"],
                betType: BET_TYPES.DOUBLE,
                isSameGameMultiple: false,
              },
            },
          },
        },
      };
      isBetBuilder.mockReturnValueOnce(true);
      isBetBuilder.mockReturnValueOnce(false);

      const ids = createGetBetBuilderCombinationIdsSelector()(state);

      expect(ids).toEqual(["C:1"]);
    });
  });

  describe("createSportsbookCombinationValidationsSelector", () => {
    describe("when there are validations for the combination ID", () => {
      it("should return the validations array for the given combination ID", () => {
        const combinationId = "combinationId-1";
        const state = {
          betting: {
            sportsbookBetting: {
              validations: {
                combinations: {
                  "combinationId-1": ["validationId-1"],
                },
              },
            },
          },
        };

        const validations = createSportsbookCombinationValidationsSelector()(state, combinationId);

        expect(validations.length).toBe(1);
        expect(validations).toEqual(["validationId-1"]);
      });
    });

    describe("when there are no validations for the combination ID", () => {
      it("should return an empty validations array", () => {
        const combinationId = "combinationId-1";
        const state = {
          betting: {
            sportsbookBetting: { validations: { combinations: {} } },
          },
        };

        const validations = createSportsbookCombinationValidationsSelector()(state, combinationId);

        expect(validations.length).toBe(0);
      });
    });
  });

  describe("createSportsbookBettingRunnerSelector", () => {
    describe("when there is no sportsbook betting runner", () => {
      it("should return undefined", () => {
        const state = {
          betting: {
            sportsbookBetting: {
              runners: {
                "runner:1": "runner 1",
                "runner:2": "another runner",
              },
            },
          },
        };

        expect(createSportsbookBettingRunnerSelector()(state.betting.sportsbookBetting.runners, "runner:3")).toBe(
          undefined,
        );
      });
    });
    describe("when there is sportsbook betting runner", () => {
      it("should return the corresponding sportsbook betting runner", () => {
        const state = {
          betting: {
            sportsbookBetting: {
              runners: {
                "runner:1": "runner 1",
                "runner:2": "another runner",
              },
            },
          },
        };

        expect(createSportsbookBettingRunnerSelector()(state.betting.sportsbookBetting.runners, "runner:2")).toEqual(
          "another runner",
        );
      });
    });
  });

  describe("createGetCastGroupIdsSelector", () => {
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

      const castGroupsIds = ["924.1", "924.2"];

      const state = {
        betting: {
          sportsbookBetting: {
            legs: {
              "L:1": { runners: ["R:1", "R:2"] },
              "L:2": { runners: ["R:3", "R:4"] },
            },
            runners: {
              "R:1": { order: 1 },
              "R:2": { order: 2 },
              "R:3": {},
              "R:4": {},
            },
          },
        },
      };

      createBettingRunnersMetadataSelector().mockReturnValueOnce(metadata);
      groupCombinationsByMarketId.mockReturnValueOnce(combinationsByMarketId);
      generateCastGroupIds.mockReturnValueOnce(castGroupsIds);

      const combinationIds = createGetCastGroupIdsSelector()(state);

      expect(generateCastGroupIds).toHaveBeenCalledTimes(1);
      expect(generateCastGroupIds).toHaveBeenCalledWith(combinationsByMarketId, metadata);

      expect(combinationIds).toEqual(castGroupsIds);
    });
  });

  describe("getBettingResolvers", () => {
    describe("when no group is passed", () => {
      it("should return real metadata selector", () => {
        createBettingRunnersMetadataSelector().mockReturnValue("bettingRunnersMetadataSelector");
        expect(getBettingResolvers().getMetadata()).toEqual("bettingRunnersMetadataSelector");
      });

      it("should return real id association selector", () => {
        expect(getBettingResolvers().getMarketRunnerIdAssociation).toEqual("getMarketRunnerIdAssociationSelector");
      });

      it("should return real urn association selector", () => {
        expect(getBettingResolvers().getMarketRunnerURNAssociation).toEqual("getMarketRunnerURNAssociationSelector");
      });

      it("should return real add selections payload selector", () => {
        expect(getBettingResolvers().getAddSelectionsPayload).toEqual("getAddSelectionsPayloadSelector");
      });

      it("should return real payload selector", () => {
        expect(getBettingResolvers().getAddLegPayload).toEqual("getAddPayloadSelector");
      });
    });

    describe("when REAL group is passed", () => {
      it("should return real metadata selector", () => {
        createBettingRunnersMetadataSelector().mockReturnValue("bettingRunnersMetadataSelector");
        expect(getBettingResolvers("REAL").getMetadata()).toEqual("bettingRunnersMetadataSelector");
      });

      it("should return real id association selector", () => {
        expect(getBettingResolvers("REAL").getMarketRunnerIdAssociation).toEqual(
          "getMarketRunnerIdAssociationSelector",
        );
      });

      it("should return real urn association selector", () => {
        expect(getBettingResolvers("REAL").getMarketRunnerURNAssociation).toEqual(
          "getMarketRunnerURNAssociationSelector",
        );
      });

      it("should return real add selections payload selector", () => {
        expect(getBettingResolvers("REAL").getAddSelectionsPayload).toEqual("getAddSelectionsPayloadSelector");
      });

      it("should return real payload selector", () => {
        expect(getBettingResolvers("REAL").getAddLegPayload).toEqual("getAddPayloadSelector");
      });
    });

    describe("when VIRTUAL group is passed", () => {
      it("should return virtual metadata selector", () => {
        expect(getBettingResolvers("VIRTUAL").getMetadata).toEqual("virtualBettingRunnersMetadataSelector");
      });

      it("should return virtual id association selector", () => {
        expect(getBettingResolvers("VIRTUAL").getMarketRunnerIdAssociation).toEqual(
          "getVirtualMarketRunnerIdAssociationSelector",
        );
      });

      it("should return virtual urn association selector", () => {
        expect(getBettingResolvers("VIRTUAL").getMarketRunnerURNAssociation).toEqual(
          "getVirtualMarketRunnerURNAssociationSelector",
        );
      });

      it("should return virtual add selections payload selector", () => {
        expect(getBettingResolvers("VIRTUAL").getAddSelectionsPayload).toEqual(
          "getVirtualAddSelectionsPayloadSelector",
        );
      });

      it("should return virtual payload selector", () => {
        expect(getBettingResolvers("VIRTUAL").getAddLegPayload).toEqual("getVirtualAddPayloadSelector");
      });
    });
  });

  describe("createGetCastGroupSelector", () => {
    it("should return a cast group", () => {
      groupCombinationsByMarketId.mockReturnValue({
        "C:1": { id: "C:1" },
      });
      const bettingState = {
        betting: {
          sportsbookBetting: "sportsbookBetting",
        },
      };
      const castGroupId = "C:1";

      const castGroup = createGetCastGroupSelector()(bettingState, castGroupId);

      expect(castGroup).toEqual({ id: "C:1" });
    });
  });

  describe("createGetCombinationEligibleGenerosityWalletsSelector", () => {
    describe("when there's no betslip state", () => {
      it("should return an empty wallets map", () => {
        const state = {
          betting: {
            sportsbookBetting: {
              wallets: { WALLET_1: {} },
              combinations: {
                COMBINATION_ID_1: {},
              },
            },
          },
        };

        const combinationEligibleGenerosityWallets = createGetCombinationEligibleGenerosityWalletsSelector()(state);

        expect(combinationEligibleGenerosityWallets).toEqual({});
      });
    });

    describe("when there's no betslip selectedCombinationId", () => {
      it("should return an empty wallets map", () => {
        const state = {
          betting: {
            sportsbookBetting: {
              wallets: { WALLET_1: {} },
              combinations: {
                COMBINATION_ID_1: {},
              },
            },
          },
          betslip: {},
        };

        const combinationEligibleGenerosityWallets = createGetCombinationEligibleGenerosityWalletsSelector()(state);

        expect(combinationEligibleGenerosityWallets).toEqual({});
      });
    });

    describe("when there's no applicableWallets, priceBoostOffers or accaInsuranceOffers in the combination", () => {
      it("should return an empty wallets map", () => {
        const state = {
          betting: {
            sportsbookBetting: {
              wallets: { WALLET_1: {} },
              combinations: {
                COMBINATION_ID_1: {},
              },
            },
          },
          betslip: {
            selectedCombinationId: "COMBINATION_ID_1",
          },
        };

        const combinationEligibleGenerosityWallets = createGetCombinationEligibleGenerosityWalletsSelector()(state);

        expect(combinationEligibleGenerosityWallets).toEqual({});
      });
    });

    describe("when there's applicableWallets, priceBoostOffers, accaInsuranceOffers and ghostLegOffers in the combination", () => {
      const state = {
        betting: {
          sportsbookBetting: {
            wallets: {
              WALLET_1: { walletId: "WALLET_1", prop1: 1 },
              WALLET_2: { walletId: "WALLET_2", prop2: 2 },
              WALLET_3: { walletId: "WALLET_3", prop3: 3 },
            },
            combinations: {
              COMBINATION_ID_1: {
                id: "COMBINATION_ID_1",
                applicableWallets: ["WALLET_1", "WALLET_2"],
                priceBoostOffers: [
                  { tokenId: "WALLET_3", generosity: 10 },
                  { tokenId: "WALLET_4", generosity: 15 },
                ],
                accaInsuranceOffers: [
                  { tokenId: "WALLET_5", numberOfLegs: 3, maxStake: 10 },
                  { tokenId: "WALLET_6", numberOfLegs: 1, maxStake: 15 },
                ],
                moneyBackOffers: [
                  { tokenId: "WALLET_7", numberOfPlaces: 3 },
                  { tokenId: "WALLET_8", numberOfPlaces: 4 },
                ],
                ghostLegOffers: [{ tokenId: "WALLET_9" }, { tokenId: "WALLET_10" }],
              },
            },
          },
        },
        betslip: {
          selectedCombinationId: "COMBINATION_ID_1",
        },
      };

      it("should return the combination eligible wallets map", () => {
        const combinationEligibleGenerosityWallets = createGetCombinationEligibleGenerosityWalletsSelector()(state);

        expect(combinationEligibleGenerosityWallets).toEqual({
          WALLET_1: { prop1: 1, walletId: "WALLET_1", type: WalletTypes.BonusCash },
          WALLET_2: { prop2: 2, walletId: "WALLET_2", type: WalletTypes.BonusCash },
          WALLET_3: { tokenId: "WALLET_3", walletId: "WALLET_3", generosity: 10, type: "PRICE_BOOST_TOKEN" },
          WALLET_4: { tokenId: "WALLET_4", walletId: "WALLET_4", generosity: 15, type: "PRICE_BOOST_TOKEN" },
          WALLET_5: {
            tokenId: "WALLET_5",
            walletId: "WALLET_5",
            numberOfLegs: 3,
            maxStake: 10,
            type: "ACCA_INSURANCE_TOKEN",
          },
          WALLET_6: {
            tokenId: "WALLET_6",
            walletId: "WALLET_6",
            numberOfLegs: 1,
            maxStake: 15,
            type: "ACCA_INSURANCE_TOKEN",
          },
          WALLET_7: {
            tokenId: "WALLET_7",
            walletId: "WALLET_7",
            numberOfPlaces: 3,
            type: "MONEY_BACK_TOKEN",
          },
          WALLET_8: {
            tokenId: "WALLET_8",
            walletId: "WALLET_8",
            numberOfPlaces: 4,
            type: "MONEY_BACK_TOKEN",
          },
          WALLET_9: {
            tokenId: "WALLET_9",
            walletId: "WALLET_9",
            type: "GHOST_LEG_TOKEN",
          },
          WALLET_10: {
            tokenId: "WALLET_10",
            walletId: "WALLET_10",
            type: "GHOST_LEG_TOKEN",
          },
        });
      });

      it("should not trigger when called multiple times with the same generosity items values, regardless of order", () => {
        createGetCombinationEligibleGenerosityWalletsSelector();

        const [_, hasGenerosityChangedFn] = createSelectorCreator.mock.calls[0];

        // All orders have been changed and some odds changed on the price boost
        const actualState = {
          betting: {
            sportsbookBetting: {
              wallets: {
                WALLET_3: { walletId: "WALLET_3", prop3: 3 },
                WALLET_2: { walletId: "WALLET_2", prop2: 2 },
                WALLET_1: { walletId: "WALLET_1", prop1: 1 },
              },
              combinations: {
                COMBINATION_ID_1: {
                  id: "COMBINATION_ID_1",
                  applicableWallets: ["WALLET_2", "WALLET_1"],
                  priceBoostOffers: [
                    { tokenId: "WALLET_4", generosity: 15, odds: 2.0 },

                    { tokenId: "WALLET_3", generosity: 10, odds: 2.0 },
                  ],
                  accaInsuranceOffers: [
                    { tokenId: "WALLET_6", numberOfLegs: 1, maxStake: 15 },
                    { tokenId: "WALLET_5", numberOfLegs: 3, maxStake: 10 },
                  ],
                  moneyBackOffers: [
                    { tokenId: "WALLET_8", numberOfPlaces: 4 },
                    { tokenId: "WALLET_7", numberOfPlaces: 3 },
                  ],
                  ghostLegOffers: [{ tokenId: "WALLET_10" }, { tokenId: "WALLET_9" }],
                },
              },
            },
          },
          betslip: {
            selectedCombinationId: "COMBINATION_ID_1",
          },
        };

        expect(
          hasGenerosityChangedFn(
            {
              wallets: state.betting.sportsbookBetting.wallets,
              combinations: state.betting.sportsbookBetting.combinations,
              selectedCombinationId: state.betslip?.selectedCombinationId,
            },
            {
              wallets: actualState.betting.sportsbookBetting.wallets,
              combinations: actualState.betting.sportsbookBetting.combinations,
              selectedCombinationId: actualState.betslip?.selectedCombinationId,
            },
          ),
        ).toBe(true);
      });

      it("should trigger when a wallet change its data", () => {
        createGetCombinationEligibleGenerosityWalletsSelector();

        const [_, hasGenerosityChangedFn] = createSelectorCreator.mock.calls[0];

        // All orders have been changed
        const actualState = {
          betting: {
            sportsbookBetting: {
              wallets: {
                WALLET_1: { walletId: "WALLET_1", prop1: 1 },
                WALLET_2: { walletId: "WALLET_2", prop2: 2 },
                WALLET_3: { walletId: "WALLET_3", prop3: 4 }, // changed prop3 from 3 to 4
              },
              combinations: {
                COMBINATION_ID_1: {
                  id: "COMBINATION_ID_1",
                  applicableWallets: ["WALLET_2", "WALLET_1"],
                  priceBoostOffers: [
                    { tokenId: "WALLET_4", generosity: 15 },

                    { tokenId: "WALLET_3", generosity: 10 },
                  ],
                  accaInsuranceOffers: [
                    { tokenId: "WALLET_6", numberOfLegs: 1, maxStake: 15 },
                    { tokenId: "WALLET_5", numberOfLegs: 3, maxStake: 10 },
                  ],
                  moneyBackOffers: [
                    { tokenId: "WALLET_8", numberOfPlaces: 4 },
                    { tokenId: "WALLET_7", numberOfPlaces: 3 },
                  ],
                  ghostLegOffers: [{ tokenId: "WALLET_9" }, { tokenId: "WALLET_10" }],
                },
              },
            },
          },
          betslip: {
            selectedCombinationId: "COMBINATION_ID_1",
          },
        };

        expect(
          hasGenerosityChangedFn(
            {
              wallets: state.betting.sportsbookBetting.wallets,
              combinations: state.betting.sportsbookBetting.combinations,
              selectedCombinationId: state.betslip?.selectedCombinationId,
            },
            {
              wallets: actualState.betting.sportsbookBetting.wallets,
              combinations: actualState.betting.sportsbookBetting.combinations,
              selectedCombinationId: actualState.betslip?.selectedCombinationId,
            },
          ),
        ).toBe(false);
      });

      it("should trigger when a price boost token change its relevant data", () => {
        createGetCombinationEligibleGenerosityWalletsSelector();

        const [_, hasGenerosityChangedFn] = createSelectorCreator.mock.calls[0];

        // All orders have been changed
        const actualState = {
          betting: {
            sportsbookBetting: {
              wallets: {
                WALLET_1: { walletId: "WALLET_1", prop1: 1 },
                WALLET_2: { walletId: "WALLET_2", prop2: 2 },
                WALLET_3: { walletId: "WALLET_3", prop3: 3 },
              },
              combinations: {
                COMBINATION_ID_1: {
                  id: "COMBINATION_ID_1",
                  applicableWallets: ["WALLET_2", "WALLET_1"],
                  priceBoostOffers: [
                    { tokenId: "WALLET_4", generosity: 16 }, // changed generosity from 15 to 16

                    { tokenId: "WALLET_3", generosity: 10 },
                  ],
                  accaInsuranceOffers: [
                    { tokenId: "WALLET_6", numberOfLegs: 1, maxStake: 15 },
                    { tokenId: "WALLET_5", numberOfLegs: 3, maxStake: 10 },
                  ],
                  moneyBackOffers: [
                    { tokenId: "WALLET_8", numberOfPlaces: 4 },
                    { tokenId: "WALLET_7", numberOfPlaces: 3 },
                  ],
                  ghostLegOffers: [{ tokenId: "WALLET_9" }, { tokenId: "WALLET_10" }],
                },
              },
            },
          },
          betslip: {
            selectedCombinationId: "COMBINATION_ID_1",
          },
        };

        expect(
          hasGenerosityChangedFn(
            {
              wallets: state.betting.sportsbookBetting.wallets,
              combinations: state.betting.sportsbookBetting.combinations,
              selectedCombinationId: state.betslip?.selectedCombinationId,
            },
            {
              wallets: actualState.betting.sportsbookBetting.wallets,
              combinations: actualState.betting.sportsbookBetting.combinations,
              selectedCombinationId: actualState.betslip?.selectedCombinationId,
            },
          ),
        ).toBe(false);
      });
      it("should trigger when an acca insurance token change its data", () => {
        createGetCombinationEligibleGenerosityWalletsSelector();

        const [_, hasGenerosityChangedFn] = createSelectorCreator.mock.calls[0];

        // All orders have been changed
        const actualState = {
          betting: {
            sportsbookBetting: {
              wallets: {
                WALLET_1: { walletId: "WALLET_1", prop1: 1 },
                WALLET_2: { walletId: "WALLET_2", prop2: 2 },
                WALLET_3: { walletId: "WALLET_3", prop3: 3 },
              },
              combinations: {
                COMBINATION_ID_1: {
                  id: "COMBINATION_ID_1",
                  applicableWallets: ["WALLET_2", "WALLET_1"],
                  priceBoostOffers: [
                    { tokenId: "WALLET_4", generosity: 15 },

                    { tokenId: "WALLET_3", generosity: 10 },
                  ],
                  accaInsuranceOffers: [
                    { tokenId: "WALLET_6", numberOfLegs: 1, maxStake: 16 }, // changed maxStake from 15 to 16
                    { tokenId: "WALLET_5", numberOfLegs: 3, maxStake: 10 },
                  ],
                  moneyBackOffers: [
                    { tokenId: "WALLET_8", numberOfPlaces: 4 },
                    { tokenId: "WALLET_7", numberOfPlaces: 3 },
                  ],
                  ghostLegOffers: [{ tokenId: "WALLET_9" }, { tokenId: "WALLET_10" }],
                },
              },
            },
          },
          betslip: {
            selectedCombinationId: "COMBINATION_ID_1",
          },
        };

        expect(
          hasGenerosityChangedFn(
            {
              wallets: state.betting.sportsbookBetting.wallets,
              combinations: state.betting.sportsbookBetting.combinations,
              selectedCombinationId: state.betslip?.selectedCombinationId,
            },
            {
              wallets: actualState.betting.sportsbookBetting.wallets,
              combinations: actualState.betting.sportsbookBetting.combinations,
              selectedCombinationId: actualState.betslip?.selectedCombinationId,
            },
          ),
        ).toBe(false);
      });
      it("should trigger when a money back token change its data", () => {
        createGetCombinationEligibleGenerosityWalletsSelector();

        const [_, hasGenerosityChangedFn] = createSelectorCreator.mock.calls[0];

        // All orders have been changed
        const actualState = {
          betting: {
            sportsbookBetting: {
              wallets: {
                WALLET_1: { walletId: "WALLET_1", prop1: 1 },
                WALLET_2: { walletId: "WALLET_2", prop2: 2 },
                WALLET_3: { walletId: "WALLET_3", prop3: 3 },
              },
              combinations: {
                COMBINATION_ID_1: {
                  id: "COMBINATION_ID_1",
                  applicableWallets: ["WALLET_2", "WALLET_1"],
                  priceBoostOffers: [
                    { tokenId: "WALLET_4", generosity: 15 },

                    { tokenId: "WALLET_3", generosity: 10 },
                  ],
                  accaInsuranceOffers: [
                    { tokenId: "WALLET_6", numberOfLegs: 1, maxStake: 16 }, // changed maxStake from 15 to 16
                    { tokenId: "WALLET_5", numberOfLegs: 3, maxStake: 10 },
                  ],
                  moneyBackOffers: [
                    { tokenId: "WALLET_8", numberOfPlaces: 6 },
                    { tokenId: "WALLET_7", numberOfPlaces: 3 },
                  ],
                  ghostLegOffers: [{ tokenId: "WALLET_9" }, { tokenId: "WALLET_10" }],
                },
              },
            },
          },
          betslip: {
            selectedCombinationId: "COMBINATION_ID_1",
          },
        };

        expect(
          hasGenerosityChangedFn(
            {
              wallets: state.betting.sportsbookBetting.wallets,
              combinations: state.betting.sportsbookBetting.combinations,
              selectedCombinationId: state.betslip?.selectedCombinationId,
            },
            {
              wallets: actualState.betting.sportsbookBetting.wallets,
              combinations: actualState.betting.sportsbookBetting.combinations,
              selectedCombinationId: actualState.betslip?.selectedCombinationId,
            },
          ),
        ).toBe(false);
      });
      it("should trigger when a ghost leg token change its data", () => {
        createGetCombinationEligibleGenerosityWalletsSelector();

        const [_, hasGenerosityChangedFn] = createSelectorCreator.mock.calls[0];

        const actualState = {
          betting: {
            sportsbookBetting: {
              wallets: {
                WALLET_1: { walletId: "WALLET_1", prop1: 1 },
                WALLET_2: { walletId: "WALLET_2", prop2: 2 },
                WALLET_3: { walletId: "WALLET_3", prop3: 3 },
              },
              combinations: {
                COMBINATION_ID_1: {
                  id: "COMBINATION_ID_1",
                  applicableWallets: ["WALLET_2", "WALLET_1"],
                  priceBoostOffers: [
                    { tokenId: "WALLET_4", generosity: 15 },
                    { tokenId: "WALLET_3", generosity: 10 },
                  ],
                  accaInsuranceOffers: [
                    { tokenId: "WALLET_6", numberOfLegs: 1, maxStake: 15 },
                    { tokenId: "WALLET_5", numberOfLegs: 3, maxStake: 10 },
                  ],
                  moneyBackOffers: [
                    { tokenId: "WALLET_8", numberOfPlaces: 4 },
                    { tokenId: "WALLET_7", numberOfPlaces: 3 },
                  ],
                  ghostLegOffers: [
                    { tokenId: "WALLET_9" },
                    { tokenId: "WALLET_11" }, // changed from WALLET_10 to WALLET_11
                  ],
                },
              },
            },
          },
          betslip: {
            selectedCombinationId: "COMBINATION_ID_1",
          },
        };

        expect(
          hasGenerosityChangedFn(
            {
              wallets: state.betting.sportsbookBetting.wallets,
              combinations: state.betting.sportsbookBetting.combinations,
              selectedCombinationId: state.betslip?.selectedCombinationId,
            },
            {
              wallets: actualState.betting.sportsbookBetting.wallets,
              combinations: actualState.betting.sportsbookBetting.combinations,
              selectedCombinationId: actualState.betslip?.selectedCombinationId,
            },
          ),
        ).toBe(false);
      });
    });
  });
});

describe("createGetCombinationsSelectedWalletsAmounts", () => {
  describe("when there are no combinations", () => {
    it("should return an empty object", () => {
      const state = {
        betting: {
          sportsbookBetting: {
            wallets: { WALLET_1: {} },
            combinations: {},
          },
        },
      };

      const combinationsSelectedWalletsAmounts = createGetCombinationsSelectedWalletsAmounts()(
        state.betting.sportsbookBetting,
      );

      expect(combinationsSelectedWalletsAmounts).toEqual({});
    });
  });

  describe("when there is no combination with a selected bonus wallet", () => {
    it("should return an empty object", () => {
      const state = {
        betting: {
          sportsbookBetting: {
            wallets: {
              WALLET_1: { combinationId: "COMBINATION_ID_1" },
              WALLET_2: { combinationId: "COMBINATION_ID_2" },
              WALLET_3: { combinationId: "COMBINATION_ID_3" },
            },
            combinations: {
              COMBINATION_ID_4: {
                applicableWallets: ["WALLET_1", "WALLET_2"],
              },
            },
          },
        },
      };

      const combinationsSelectedWalletsAmounts = createGetCombinationsSelectedWalletsAmounts()(
        state.betting.sportsbookBetting,
      );

      expect(combinationsSelectedWalletsAmounts).toEqual({});
    });
  });

  describe("when are combinations for the selected bonus wallets", () => {
    it("should return the combinations with the amount sum and the number of lines", () => {
      const state = {
        betting: {
          sportsbookBetting: {
            wallets: {
              WALLET_1: { combinationId: "COMBINATION_ID_1", combinationAmount: 2 },
              WALLET_2: { combinationId: "COMBINATION_ID_1", combinationAmountPerLine: 15, combinationAmount: 30 },
              WALLET_3: { combinationId: "COMBINATION_ID_1", combinationAmountPerLine: 1 },
            },
            combinations: {
              COMBINATION_ID_1: {
                id: "COMBINATION_ID_1",
                applicableWallets: ["WALLET_1", "WALLET_2"],
                numLines: 2,
              },
            },
          },
        },
      };

      const combinationsSelectedWalletsAmounts = createGetCombinationsSelectedWalletsAmounts()(
        state.betting.sportsbookBetting,
      );

      expect(combinationsSelectedWalletsAmounts).toEqual({
        COMBINATION_ID_1: {
          combinationAmount: 32,
          combinationAmountPerLine: 16,
          numLines: 2,
        },
      });
    });

    describe("when the state changes", () => {
      it("should recompute the selector", () => {
        const state1 = {
          betting: {
            sportsbookBetting: {
              wallets: {
                WALLET_1: { combinationId: "COMBINATION_ID_1", combinationAmount: 2 },
                WALLET_2: { combinationId: "COMBINATION_ID_1", combinationAmountPerLine: 15, combinationAmount: 30 },
                WALLET_3: { combinationId: "COMBINATION_ID_1", combinationAmountPerLine: 1 },
              },
              combinations: {
                COMBINATION_ID_1: {
                  id: "COMBINATION_ID_1",
                  applicableWallets: ["WALLET_1", "WALLET_2"],
                  numLines: 2,
                },
              },
            },
          },
        };
        const state2 = {
          betting: {
            sportsbookBetting: {
              wallets: {
                WALLET_1: { combinationId: "COMBINATION_ID_1", combinationAmount: 2 },
                WALLET_2: {
                  combinationId: "COMBINATION_ID_1",
                  combinationAmountPerLine: 15,
                  combinationAmount: 30,
                },
              },
              combinations: {
                COMBINATION_ID_1: {
                  id: "COMBINATION_ID_1",
                  applicableWallets: ["WALLET_1", "WALLET_2"],
                  numLines: 2,
                },
              },
            },
          },
        };

        const getCombinationsSelectedWalletsAmounts = createGetCombinationsSelectedWalletsAmounts();
        getCombinationsSelectedWalletsAmounts(state1.betting.sportsbookBetting);
        getCombinationsSelectedWalletsAmounts(state2.betting.sportsbookBetting);

        expect(getCombinationsSelectedWalletsAmounts.recomputations()).toEqual(2);
      });
    });

    describe("when the state does not change", () => {
      it("should not recompute the selector", () => {
        const state = {
          betting: {
            sportsbookBetting: {
              wallets: {
                WALLET_1: { combinationId: "COMBINATION_ID_1", combinationAmount: 2 },
                WALLET_2: {
                  combinationId: "COMBINATION_ID_1",
                  combinationAmountPerLine: 15,
                  combinationAmount: 30,
                },
                WALLET_3: { combinationId: "COMBINATION_ID_1", combinationAmountPerLine: 1 },
              },
              combinations: {
                COMBINATION_ID_1: {
                  id: "COMBINATION_ID_1",
                  applicableWallets: ["WALLET_1", "WALLET_2"],
                  numLines: 2,
                },
              },
            },
          },
        };

        const getCombinationsSelectedWalletsAmounts = createGetCombinationsSelectedWalletsAmounts();
        getCombinationsSelectedWalletsAmounts(state.betting.sportsbookBetting);
        getCombinationsSelectedWalletsAmounts(state.betting.sportsbookBetting);

        expect(getCombinationsSelectedWalletsAmounts.recomputations()).toEqual(1);
      });
    });
  });

  describe("createQuickBetslipBetPickerSelector", () => {
    const FOOTBALL_ONLY_METADATA_MOCK = {
      "runner:1": { sportId: 1 },
    };

    const FOOTBALL_AND_TENNIS_METADATA_MOCK = {
      "runner:1": { sportId: 1 },
      "runner:2": { sportId: 2 },
    };

    function setupQuickBetslipBetPickerSelector({
      combinations,
      isThrottleActive,
      metadata = {},
      isLoggedIn = true,
      runnerFailures = {},
      hasInvalidCombinationFailure = false,
    }) {
      createBettingRunnersMetadataSelector().mockReturnValue(metadata);
      hasAnyInvalidCombinationFailure.mockReturnValue(hasInvalidCombinationFailure);

      return createQuickBetslipBetPickerSelector()({
        betting: {
          sportsbookBetting: {
            combinations,
            legs: {},
            failures: {
              imply: {
                runners: runnerFailures,
              },
            },
          },
        },
        entities: {
          throttles: {
            QUICK_BETSLIP: { isActive: isThrottleActive },
          },
          userdetails: {
            loggedIn: isLoggedIn,
          },
        },
      });
    }

    describe("when QUICK_BETSLIP throttle is inactive", () => {
      it("should return null even with a valid combination", () => {
        isSingle.mockReturnValue(true);
        isMultiple.mockReturnValue(false);
        isBetBuilder.mockReturnValue(false);
        isMultiBetBuilder.mockReturnValue(false);

        expect(
          setupQuickBetslipBetPickerSelector({
            combinations: {
              "COMB:1": {
                id: "COMB:1",
                numLines: 1,
                betType: BET_TYPES.SINGLE,
                odds: {
                  decimalOdds: 2.5,
                },
              },
            },
            isThrottleActive: false,
            metadata: FOOTBALL_ONLY_METADATA_MOCK,
          }),
        ).toBeNull();
      });
    });

    describe("when QUICK_BETSLIP throttle is active and there is a valid combination", () => {
      it("should return the quickBetslipBet with status valid and combinationId", () => {
        isSingle.mockReturnValue(true);
        isMultiple.mockReturnValue(false);
        isBetBuilder.mockReturnValue(false);
        isMultiBetBuilder.mockReturnValue(false);

        expect(
          setupQuickBetslipBetPickerSelector({
            combinations: {
              "COMB:1": {
                id: "COMB:1",
                numLines: 1,
                betType: BET_TYPES.SINGLE,
                odds: {
                  decimalOdds: 2.5,
                },
              },
            },
            isThrottleActive: true,
            metadata: FOOTBALL_ONLY_METADATA_MOCK,
          }),
        ).toEqual({
          status: "valid",
          combinationId: "COMB:1",
        });
      });
    });

    describe("when QUICK_BETSLIP throttle is active but there are no valid combinations", () => {
      it("should return fallback with invalid_combination reason", () => {
        isSingle.mockReturnValue(false);
        isMultiple.mockReturnValue(false);
        isBetBuilder.mockReturnValue(false);
        isMultiBetBuilder.mockReturnValue(false);

        expect(
          setupQuickBetslipBetPickerSelector({
            combinations: {
              "COMB:1": {
                id: "COMB:1",
                numLines: 1,
                betType: BET_TYPES.SINGLE,
              },
            },
            isThrottleActive: true,
            metadata: FOOTBALL_ONLY_METADATA_MOCK,
          }),
        ).toEqual({
          status: "fallback",
          reason: "invalid_combination",
        });
      });
    });

    describe("when QUICK_BETSLIP throttle is active but not all legs are from football", () => {
      it("should return fallback with non_football reason when some legs are from non-football sports", () => {
        isSingle.mockReturnValue(true);
        isMultiple.mockReturnValue(false);
        isBetBuilder.mockReturnValue(false);
        isMultiBetBuilder.mockReturnValue(false);

        expect(
          setupQuickBetslipBetPickerSelector({
            combinations: {
              "COMB:1": {
                id: "COMB:1",
                numLines: 1,
                betType: BET_TYPES.SINGLE,
                odds: {
                  decimalOdds: 2.5,
                },
              },
            },
            isThrottleActive: true,
            metadata: FOOTBALL_AND_TENNIS_METADATA_MOCK,
          }),
        ).toEqual({
          status: "fallback",
          reason: "non_football",
        });
      });
    });

    describe("when QUICK_BETSLIP throttle is active and runners contain INVALID_COMBINATION failure", () => {
      it("should return fallback with invalid_combination reason even if a combination exists", () => {
        isSingle.mockReturnValue(true);
        isMultiple.mockReturnValue(false);
        isBetBuilder.mockReturnValue(false);
        isMultiBetBuilder.mockReturnValue(false);

        expect(
          setupQuickBetslipBetPickerSelector({
            combinations: {
              "COMB:1": {
                id: "COMB:1",
                numLines: 1,
                betType: BET_TYPES.SINGLE,
                odds: {
                  decimalOdds: 2.5,
                },
              },
            },
            isThrottleActive: true,
            metadata: FOOTBALL_ONLY_METADATA_MOCK,
            runnerFailures: {
              "runner:1": [{ failureCode: RUNNER_FAILURE_CODES.INVALID_COMBINATION }],
            },
            hasInvalidCombinationFailure: true,
          }),
        ).toEqual({
          status: "fallback",
          reason: "invalid_combination",
        });
      });
    });

    describe("when QUICK_BETSLIP throttle is active and all legs are from football", () => {
      it("should return the quickBetslipBet with status valid and multiple football legs", () => {
        isSingle.mockReturnValue(true);
        isMultiple.mockReturnValue(false);
        isBetBuilder.mockReturnValue(false);
        isMultiBetBuilder.mockReturnValue(false);

        expect(
          setupQuickBetslipBetPickerSelector({
            combinations: {
              "COMB:1": {
                id: "COMB:1",
                numLines: 1,
                betType: BET_TYPES.SINGLE,
                odds: {
                  decimalOdds: 2.5,
                },
              },
            },
            isThrottleActive: true,
            metadata: FOOTBALL_ONLY_METADATA_MOCK,
          }),
        ).toEqual({
          status: "valid",
          combinationId: "COMB:1",
        });
      });
    });

    describe("when QUICK_BETSLIP throttle is active and there are no runners metadata", () => {
      it("should return null", () => {
        isSingle.mockReturnValue(true);
        isMultiple.mockReturnValue(false);
        isBetBuilder.mockReturnValue(false);
        isMultiBetBuilder.mockReturnValue(false);

        expect(
          setupQuickBetslipBetPickerSelector({
            combinations: {
              "COMB:1": {
                id: "COMB:1",
                numLines: 1,
                betType: BET_TYPES.SINGLE,
                odds: {
                  decimalOdds: 2.5,
                },
              },
            },
            isThrottleActive: true,
            metadata: {},
          }),
        ).toBeNull();
      });
    });

    describe("when user is not logged in", () => {
      it("should return null even with a valid football combination", () => {
        isSingle.mockReturnValue(true);
        isMultiple.mockReturnValue(false);
        isBetBuilder.mockReturnValue(false);
        isMultiBetBuilder.mockReturnValue(false);

        expect(
          setupQuickBetslipBetPickerSelector({
            combinations: {
              "COMB:1": {
                id: "COMB:1",
                numLines: 1,
                betType: BET_TYPES.SINGLE,
                odds: {
                  decimalOdds: 2.5,
                },
              },
            },
            isThrottleActive: true,
            metadata: FOOTBALL_ONLY_METADATA_MOCK,
            isLoggedIn: false,
          }),
        ).toBeNull();
      });
    });

    describe("when QUICK_BETSLIP throttle is active and there are multiple combinations", () => {
      it("should return the combination with the greatest odds", () => {
        isSingle.mockReturnValue(true);
        isMultiple.mockReturnValue(false);
        isBetBuilder.mockReturnValue(false);
        isMultiBetBuilder.mockReturnValue(false);

        expect(
          setupQuickBetslipBetPickerSelector({
            combinations: {
              "COMB:1": {
                id: "COMB:1",
                numLines: 1,
                betType: BET_TYPES.SINGLE,
                odds: {
                  decimalOdds: 2.5,
                },
              },
              "COMB:2": {
                id: "COMB:2",
                numLines: 1,
                betType: BET_TYPES.SINGLE,
                odds: {
                  decimalOdds: 5.0,
                },
              },
              "COMB:3": {
                id: "COMB:3",
                numLines: 1,
                betType: BET_TYPES.SINGLE,
                odds: {
                  decimalOdds: 4.0,
                },
              },
            },
            isThrottleActive: true,
            metadata: FOOTBALL_ONLY_METADATA_MOCK,
          }),
        ).toEqual({
          status: "valid",
          combinationId: "COMB:2",
        });
      });
    });
  });
});
