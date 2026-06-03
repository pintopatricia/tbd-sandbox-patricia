import { BET_TYPES } from "@ppb/betslip-core";

import { createExcRunnerPotentialBetsByRunnerURNSelector } from "../entities/entities-selectors";
import { getUnmatchedBets } from "../betting/exchange-betting/exchange-betting-selectors";
import { getSportsbookBettingState } from "../betting/sportsbook-betting/sportsbook-betting-selectors";
import { getExchangeOrder } from "../betting/exchange-orders/exchange-order-selectors";
import { ExchangeSide } from "../constants";
import { isBetBuilder } from "../../helpers/sportsbook-betting";
import { createShallowEqualSelector } from "../../helpers/selectors";

import {
  getBetslipStep,
  getBetslipPlaceStatus,
  getBetslipVisibilityState,
  getBetslipExchangeContext,
  getBetslipExchangeEdit,
  getBetslipExchangeReportUnmatched,
  getEditingBetState,
  getBetslipCard,
  getCurrentMultipleContext,
  getSportsbookConfirmation,
  getSportsbookConfirmationCombinations,
  getSportsbookConfirmationIgnoredBets,
  getSportsbookConfirmationLegs,
  getSportsbookPlacedCombinations,
  getSportsbookReport,
  getIsFreeBetsSelected,
  getSportsbookPlacedCombination,
  getCastContext,
  getBetslipGroup,
  getSportsbookConfirmationCastContext,
  getSportsbookConfirmationAvailability,
  getSportsbookConfirmationFailures,
  getSportsbookConfirmationRunners,
  createGetBetBuilderConfirmationCombinationIdsSelector,
  getLastSuccessfulStake,
} from "./betslip-card-selectors";

jest.mock("@ppb/betslip-core");
jest.mock("../entities/entities-selectors");
jest.mock("../betting/exchange-betting/exchange-betting-selectors");
jest.mock("../betting/exchange-orders/exchange-order-selectors");
jest.mock("../betting/sportsbook-betting/sportsbook-betting-selectors");
jest.mock("../../helpers/sportsbook-betting");
jest.mock("../../helpers/selectors", () => ({
  createShallowEqualSelector: jest.fn(() => jest.fn(() => [])),
}));

describe("betslip-card-selectors", () => {
  beforeEach(jest.clearAllMocks);

  describe("getCurrentMultipleContext", () => {
    it("should return the current multiple context", () => {
      const state = {
        betslip: { sportsbookMultipleContext: "C:1" },
      };
      expect(getCurrentMultipleContext(state)).toBe("C:1");
    });
  });

  describe("getCastContext", () => {
    it("should return the current cast context", () => {
      const state = { sportsbookCastContext: { "1:1": "C:1" } };

      expect(getCastContext(state)).toEqual({ "1:1": "C:1" });
    });
  });

  describe("getBetslipStep", () => {
    it("should return betslip card", () => {
      const state = {
        betslip: { step: "REPORT" },
      };
      expect(getBetslipStep(state)).toBe("REPORT");
    });
  });

  describe("getBetslipPlaceStatus", () => {
    it("should return the place status when it exists", () => {
      const state = {
        betslip: { placeStatus: "INPROGRESS" },
      };
      expect(getBetslipPlaceStatus(state)).toBe("INPROGRESS");
    });

    it("should return undefined when betslip does not exist", () => {
      const state = {};
      expect(getBetslipPlaceStatus(state)).toBeUndefined();
    });

    it("should return undefined when placeStatus does not exist", () => {
      const state = {
        betslip: {},
      };
      expect(getBetslipPlaceStatus(state)).toBeUndefined();
    });

    it("should return FAILURE status", () => {
      const state = {
        betslip: { placeStatus: "FAILURE" },
      };
      expect(getBetslipPlaceStatus(state)).toBe("FAILURE");
    });

    it("should return SUCCESS status", () => {
      const state = {
        betslip: { placeStatus: "SUCCESS" },
      };
      expect(getBetslipPlaceStatus(state)).toBe("SUCCESS");
    });

    it("should return NONE status", () => {
      const state = {
        betslip: { placeStatus: "NONE" },
      };
      expect(getBetslipPlaceStatus(state)).toBe("NONE");
    });
  });

  describe("getIsFreeBetsSelected", () => {
    it("should return betslip card", () => {
      const state = {
        betslip: { isFreeBetsSelected: true },
      };
      expect(getIsFreeBetsSelected(state)).toBe(true);
    });
  });

  describe("getBetslipVisibilityState", () => {
    const setupAppState = (context) => ({
      betslip: {
        exchangeContext: context,
      },
    });

    describe("when betslip exchange context does NOT exist", () => {
      describe("and zero SBK combinations exist", () => {
        beforeEach(() => {
          getSportsbookBettingState.mockReturnValueOnce({ combinations: {} });
        });

        it("should return false (closed state)", () => {
          const state = setupAppState();
          expect(getBetslipVisibilityState(state)).toBe(false);
          expect(createExcRunnerPotentialBetsByRunnerURNSelector).not.toHaveBeenCalled();
          expect(getSportsbookBettingState).toHaveBeenCalledWith(state);
        });
      });

      describe("and there's at least a SBK combination", () => {
        beforeEach(() => {
          getSportsbookBettingState.mockReturnValueOnce({ combinations: { foo: "some_truthy_value" } });
        });

        it("should return false (closed state)", () => {
          const state = setupAppState();
          expect(getBetslipVisibilityState(state)).toBe(true);
          expect(createExcRunnerPotentialBetsByRunnerURNSelector).not.toHaveBeenCalled();
          expect(getSportsbookBettingState).toHaveBeenCalledWith(state);
        });
      });
    });

    describe("when zero EXC potential bets and zero SBK combinations exist", () => {
      const getExcRunnerPotentialBetsByRunnerURN = jest.fn(() => []);
      beforeEach(() => {
        createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValueOnce(getExcRunnerPotentialBetsByRunnerURN);
        getSportsbookBettingState.mockReturnValueOnce({ combinations: {} });
      });

      it("should return false (closed state)", () => {
        const state = setupAppState({ runner: "runner:urn" });
        expect(getBetslipVisibilityState(state)).toBe(false);
        expect(getExcRunnerPotentialBetsByRunnerURN).toHaveBeenCalledWith(state, "runner:urn");
        expect(getSportsbookBettingState).toHaveBeenCalledWith(state);
      });
    });

    describe("when there's at least an EXC potential bet", () => {
      const getExcRunnerPotentialBetsByRunnerURN = jest.fn(() => ["some_truthy_value"]);
      beforeEach(() => {
        createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValueOnce(getExcRunnerPotentialBetsByRunnerURN);
        getSportsbookBettingState.mockReturnValueOnce({ combinations: {} });
      });

      it("should return true (opened state)", () => {
        const state = setupAppState({ runner: "runner:urn" });
        expect(getBetslipVisibilityState(state)).toBe(true);
        expect(getExcRunnerPotentialBetsByRunnerURN).toHaveBeenCalledWith(state, "runner:urn");
        expect(getSportsbookBettingState).toHaveBeenCalledWith(state);
      });
    });

    describe("when there's at least a SBK combination", () => {
      const getExcRunnerPotentialBetsByRunnerURN = jest.fn(() => []);
      beforeEach(() => {
        createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValueOnce(getExcRunnerPotentialBetsByRunnerURN);
        getSportsbookBettingState.mockReturnValueOnce({ combinations: { foo: "some_truthy_value" } });
      });

      it("should return true (opened state)", () => {
        const state = setupAppState({ runner: "runner:urn" });
        expect(getBetslipVisibilityState(state)).toBe(true);
        expect(getExcRunnerPotentialBetsByRunnerURN).toHaveBeenCalledWith(state, "runner:urn");
        expect(getSportsbookBettingState).toHaveBeenCalledWith(state);
      });
    });
  });

  describe("getBetslipCard", () => {
    it("should return betslip card", () => {
      const state = {
        betslip: { exchangeContext: "foo" },
      };
      expect(getBetslipCard(state)).toBe(state.betslip);
    });
  });

  describe("getBetslipGroup", () => {
    it("should return betting group", () => {
      const state = {
        betslip: { group: "foo" },
      };
      expect(getBetslipGroup(state)).toBe(state.betslip.group);
    });
  });

  describe("getLastSuccessfulStake", () => {
    it("should return lastSuccessfulStake when it exists", () => {
      const state = {
        betslip: { lastSuccessfulStake: 10 },
      };
      expect(getLastSuccessfulStake(state)).toBe(10);
    });

    it("should return undefined when lastSuccessfulStake does not exist", () => {
      const state = {
        betslip: {},
      };
      expect(getLastSuccessfulStake(state)).toBe(undefined);
    });

    it("should return undefined when betslip does not exist", () => {
      const state = {};
      expect(getLastSuccessfulStake(state)).toBe(undefined);
    });
  });

  describe("getSportsbookPlacedCombinations", () => {
    describe("when there are combinations", () => {
      it("should return the combinations", () => {
        const state = {
          betslip: { sportsbookReport: { result: { combinations: "combinations" } } },
        };
        expect(getSportsbookPlacedCombinations(state)).toBe(state.betslip.sportsbookReport.result.combinations);
      });
    });

    describe("when there is no result in the report", () => {
      it("should return undefined", () => {
        const state = {
          betslip: { sportsbookReport: {} },
        };
        expect(getSportsbookPlacedCombinations(state)).toBe(undefined);
      });
    });

    describe("when there is no report", () => {
      it("should return undefined", () => {
        const state = {
          betslip: {},
        };
        expect(getSportsbookPlacedCombinations(state)).toBe(undefined);
      });
    });
  });

  describe("getSportsbookReport", () => {
    describe("when there is a report", () => {
      it("should return the report", () => {
        const state = {
          betslip: { sportsbookReport: {} },
        };
        expect(getSportsbookReport(state)).toBe(state.betslip.sportsbookReport);
      });
    });

    describe("when there is no report", () => {
      it("should return undefined", () => {
        const state = {
          betslip: {},
        };
        expect(getSportsbookReport(state)).toBe(undefined);
      });
    });
  });

  describe("getBetslipExchangeContext", () => {
    describe("when betslip exchange context exists", () => {
      it("should return betslip exchange context", () => {
        const state = {
          betslip: { exchangeContext: "foo" },
        };
        expect(getBetslipExchangeContext(state)).toBe(state.betslip.exchangeContext);
      });
    });

    describe("when betslip exchange context does NOT exist", () => {
      it("should return undefined", () => {
        const state = {
          betslip: {},
        };
        expect(getBetslipExchangeContext(state)).toBe(undefined);
      });
    });
  });

  describe("getBetslipExchangeEdit", () => {
    describe("when betslip exchange edit exists", () => {
      it("should return betslip exchange edit", () => {
        const state = {
          betslip: { exchangeEdit: "bar" },
        };
        expect(getBetslipExchangeEdit(state)).toBe(state.betslip.exchangeEdit);
      });
    });

    describe("when betslip exchange edit does NOT exist", () => {
      it("should return undefined", () => {
        const state = {
          betslip: {},
        };
        expect(getBetslipExchangeEdit(state)).toBe(undefined);
      });
    });
  });

  describe("getEditingBetState", () => {
    const APP_STATE = {
      entities: "entities",
      betslip: {},
    };

    function setup({ unmatchedBet = null, order = null }) {
      getUnmatchedBets.mockReturnValue([unmatchedBet]);
      getExchangeOrder.mockReturnValue(order);
    }

    describe("when there's no edit", () => {
      it("should return null", () => {
        const editState = getEditingBetState(APP_STATE, "urn:market", "some betId");

        expect(editState).toEqual(null);
      });
    });

    describe("when unmatched bet does not exist", () => {
      it("should return null", () => {
        setup({ unmatchedBet: null });

        expect(getEditingBetState(APP_STATE, "urn:market", "some betId")).toEqual(null);
      });
    });

    describe("when order does not exist", () => {
      it("should return null", () => {
        setup({ unmatchedBet: {}, order: null });

        expect(getEditingBetState(APP_STATE, "urn:market", "some betId")).toEqual(null);
      });
    });

    describe("when unmatched bet and order exist", () => {
      it("should use getUnmatchedBets selector", () => {
        getUnmatchedBets.mockReturnValueOnce([{}]);
        getExchangeOrder.mockReturnValueOnce({});
        const state = {
          betslip: {
            exchangeEdit: {
              betId: "some betId",
              order: undefined,
            },
          },
        };

        getEditingBetState(state, "urn:market", "some betId");

        expect(getUnmatchedBets).toHaveBeenCalledWith(state, "urn:market", ["some betId"]);
        expect(getUnmatchedBets).toHaveBeenCalledTimes(1);
      });

      it("should use getExchangeOrder selector", () => {
        getUnmatchedBets.mockReturnValueOnce([{}]);
        getExchangeOrder.mockReturnValueOnce({});
        const state = {
          betslip: {
            exchangeEdit: {
              betId: "some betId",
              order: undefined,
            },
          },
        };

        getEditingBetState(state, "urn:market", "some betId");

        expect(getExchangeOrder).toHaveBeenCalledWith(state, "urn:market", "some betId");
        expect(getExchangeOrder).toHaveBeenCalledTimes(1);
      });

      it("should return originalPrice", () => {
        getUnmatchedBets.mockReturnValueOnce([{}]);
        getExchangeOrder.mockReturnValueOnce({ price: 123 });
        const state = {
          betslip: {
            exchangeEdit: {
              betId: "some betId",
              order: undefined,
            },
          },
        };

        const { originalPrice } = getEditingBetState(state, "urn:market", "some betId");

        expect(originalPrice).toBe(123);
      });

      it("should return originalSize", () => {
        getUnmatchedBets.mockReturnValueOnce([{ size: 123 }]);
        getExchangeOrder.mockReturnValueOnce({});

        const state = {
          betslip: {
            exchangeEdit: {
              betId: "some betId",
              order: undefined,
            },
          },
        };

        const { originalSize } = getEditingBetState(state, "urn:market", "some betId");

        expect(originalSize).toBe(123);
      });

      describe("and order edit does not exist", () => {
        it("should return isValid as true", () => {
          getUnmatchedBets.mockReturnValueOnce([{}]);
          getExchangeOrder.mockReturnValueOnce({});
          const state = {
            betslip: {
              exchangeEdit: {
                betId: "some betId",
                order: undefined,
              },
            },
          };

          const { isValid } = getEditingBetState(state, "urn:market", "some betId");

          expect(isValid).toBe(true);
        });
      });

      describe("and it's a back order", () => {
        it("should return side as Back", () => {
          getUnmatchedBets.mockReturnValueOnce([{}]);
          getExchangeOrder.mockReturnValueOnce({ side: ExchangeSide.BACK });
          const state = {
            betslip: {
              exchangeEdit: {
                betId: "some betId",
                order: undefined,
              },
            },
          };

          const { side } = getEditingBetState(state, "urn:market", "some betId");

          expect(side).toBe(ExchangeSide.BACK);
        });
      });

      describe("and it's a lay order", () => {
        it("should return side as Lay", () => {
          getUnmatchedBets.mockReturnValueOnce([{}]);
          getExchangeOrder.mockReturnValueOnce({ side: ExchangeSide.LAY });
          const state = {
            betslip: {
              exchangeEdit: {
                betId: "some betId",
                order: undefined,
              },
            },
          };

          const { side } = getEditingBetState(state, "urn:market", "some betId");

          expect(side).toBe(ExchangeSide.LAY);
        });
      });

      describe("and price", () => {
        describe("was edited", () => {
          describe("and it is null", () => {
            const state = {
              betslip: {
                exchangeEdit: {
                  betId: "some betId",
                  order: {
                    price: null,
                    validations: {},
                  },
                },
              },
            };

            it("should return edited price as undefined", () => {
              getUnmatchedBets.mockReturnValueOnce([{}]);
              getExchangeOrder.mockReturnValueOnce({});

              const { price } = getEditingBetState(state, "urn:market", "some betId");

              expect(price).toBe(undefined);
            });

            it("should return hasPriceChanged as true", () => {
              getUnmatchedBets.mockReturnValueOnce([{}]);
              getExchangeOrder.mockReturnValueOnce({ price: 2 });

              const { hasPriceChanged } = getEditingBetState(state, "urn:market", "some betId");

              expect(hasPriceChanged).toBe(true);
            });

            it("should return isValid as false", () => {
              getUnmatchedBets.mockReturnValueOnce([{}]);
              getExchangeOrder.mockReturnValueOnce({});

              const { isValid } = getEditingBetState(state, "urn:market", "some betId");

              expect(isValid).toBe(false);
            });
          });

          describe("and it is not null", () => {
            const state = {
              betslip: {
                exchangeEdit: {
                  betId: "some betId",
                  order: {
                    price: 10,
                    validations: {},
                  },
                },
              },
            };

            it("should return edited price", () => {
              getUnmatchedBets.mockReturnValueOnce([{}]);
              getExchangeOrder.mockReturnValueOnce({});

              const { price } = getEditingBetState(state, "urn:market", "some betId");

              expect(price).toBe(10);
            });

            it("should return hasPriceChanged as true", () => {
              getUnmatchedBets.mockReturnValueOnce([{}]);
              getExchangeOrder.mockReturnValueOnce({ price: 2 });

              const { hasPriceChanged } = getEditingBetState(state, "urn:market", "some betId");

              expect(hasPriceChanged).toBe(true);
            });
          });
        });

        describe("was not edited", () => {
          const state = {
            betslip: {
              exchangeEdit: {
                betId: "some betId",
                order: {
                  price: undefined,
                  validations: {},
                },
              },
            },
          };

          it("should return original price", () => {
            getUnmatchedBets.mockReturnValueOnce([{}]);
            getExchangeOrder.mockReturnValueOnce({ price: 2 });

            const { price } = getEditingBetState(state, "urn:market", "some betId");

            expect(price).toBe(2);
          });

          it("should return hasPriceChanged as false", () => {
            getUnmatchedBets.mockReturnValueOnce([{}]);
            getExchangeOrder.mockReturnValueOnce({ price: 2 });

            const { hasPriceChanged } = getEditingBetState(state, "urn:market", "some betId");

            expect(hasPriceChanged).toBe(false);
          });
        });
      });

      describe("and size", () => {
        describe("was edited", () => {
          describe("and it is null", () => {
            const state = {
              betslip: {
                exchangeEdit: {
                  betId: "some betId",
                  order: {
                    size: null,
                    validations: {},
                  },
                },
              },
            };

            it("should return edited size as undefined", () => {
              getUnmatchedBets.mockReturnValueOnce([{}]);
              getExchangeOrder.mockReturnValueOnce({});

              const { size } = getEditingBetState(state, "urn:market", "some betId");

              expect(size).toBe(undefined);
            });

            it("should return hasSizeChanged as true", () => {
              getUnmatchedBets.mockReturnValueOnce([{ size: 2 }]);
              getExchangeOrder.mockReturnValueOnce({});

              const { hasSizeChanged } = getEditingBetState(state, "urn:market", "some betId");
              expect(hasSizeChanged).toBe(true);
            });

            it("should return isValid as false", () => {
              getUnmatchedBets.mockReturnValueOnce([{}]);
              getExchangeOrder.mockReturnValueOnce({});

              const { isValid } = getEditingBetState(state, "urn:market", "some betId");
              expect(isValid).toBe(false);
            });
          });

          describe("and it is not null", () => {
            const state = {
              betslip: {
                exchangeEdit: {
                  betId: "some betId",
                  order: {
                    size: 20,
                    validations: {},
                  },
                },
              },
            };

            it("should return edited size", () => {
              getUnmatchedBets.mockReturnValueOnce([{}]);
              getExchangeOrder.mockReturnValueOnce({});

              const { size } = getEditingBetState(state, "urn:market", "some betId");
              expect(size).toBe(20);
            });

            it("should return hasSizeChanged as true", () => {
              getUnmatchedBets.mockReturnValueOnce([{ size: 2 }]);
              getExchangeOrder.mockReturnValueOnce({});

              const { hasSizeChanged } = getEditingBetState(state, "urn:market", "some betId");
              expect(hasSizeChanged).toBe(true);
            });
          });
        });

        describe("was not edited", () => {
          const state = {
            betslip: {
              exchangeEdit: {
                betId: "some betId",
                order: {
                  size: undefined,
                  validations: {},
                },
              },
            },
          };

          it("should return original size", () => {
            getUnmatchedBets.mockReturnValueOnce([{ size: 2 }]);
            getExchangeOrder.mockReturnValueOnce({});

            const { size } = getEditingBetState(state, "urn:market", "some betId");

            expect(size).toBe(2);
          });
          it("should return hasSizeChanged as false", () => {
            getUnmatchedBets.mockReturnValueOnce([{ size: 2 }]);
            getExchangeOrder.mockReturnValueOnce({});

            const { hasSizeChanged } = getEditingBetState(state, "urn:market", "some betId");

            expect(hasSizeChanged).toBe(false);
          });
        });
      });

      describe("and persistenceType", () => {
        const state = {
          betslip: {
            exchangeEdit: {
              betId: "some betId",
              order: {
                validations: {},
                persistenceType: "PERSIST",
              },
            },
          },
        };

        describe("was edited", () => {
          it("should return hasPersistenceTypeChanged", () => {
            getUnmatchedBets.mockReturnValueOnce([{}]);
            getExchangeOrder.mockReturnValueOnce({ persistenceType: "LAPSE" });

            const { persistenceType } = getEditingBetState(state, "urn:market", "some betId");

            expect(persistenceType).toBe("PERSIST");
          });

          it("should return edited persistenceType", () => {
            getUnmatchedBets.mockReturnValueOnce([{}]);
            getExchangeOrder.mockReturnValueOnce({ persistenceType: "LAPSE" });

            const { hasPersistenceTypeChanged } = getEditingBetState(state, "urn:market", "some betId");

            expect(hasPersistenceTypeChanged).toBe(true);
          });
        });

        describe("was not edited", () => {
          it("should return original persistenceType", () => {
            getUnmatchedBets.mockReturnValueOnce([{}]);
            getExchangeOrder.mockReturnValueOnce({ persistenceType: "PERSIST" });

            const { persistenceType } = getEditingBetState(state, "urn:market", "some betId");

            expect(persistenceType).toBe("PERSIST");
          });
        });
      });

      describe("and has priceValidationError", () => {
        const state = {
          betslip: {
            exchangeEdit: {
              betId: "some betId",
              order: {
                validations: {
                  price: { data: "some error" },
                },
              },
            },
          },
        };

        it("should return priceValidation data", () => {
          getUnmatchedBets.mockReturnValueOnce([{}]);
          getExchangeOrder.mockReturnValueOnce({});

          const { priceValidation } = getEditingBetState(state, "urn:market", "some betId");
          expect(priceValidation).toBe("some error");
        });

        it("should return isValid as false", () => {
          getUnmatchedBets.mockReturnValueOnce([{}]);
          getExchangeOrder.mockReturnValueOnce({});

          const { isValid } = getEditingBetState(state, "urn:market", "some betId");

          expect(isValid).toBe(false);
        });
        it("should return profit as undefined", () => {
          getUnmatchedBets.mockReturnValueOnce([{}]);
          getExchangeOrder.mockReturnValueOnce({});

          const { profit } = getEditingBetState(state, "urn:market", "some betId");

          expect(profit).toBeUndefined();
        });
        it("should return liability as undefined", () => {
          getUnmatchedBets.mockReturnValueOnce([{}]);
          getExchangeOrder.mockReturnValueOnce({});

          const { liability } = getEditingBetState(state, "urn:market", "some betId");

          expect(liability).toBeUndefined();
        });
        it("should return payout as undefined", () => {
          getUnmatchedBets.mockReturnValueOnce([{}]);
          getExchangeOrder.mockReturnValueOnce({});

          const { payout } = getEditingBetState(state, "urn:market", "some betId");

          expect(payout).toBeUndefined();
        });

        it("should return priceValidation with validation details", () => {
          getUnmatchedBets.mockReturnValueOnce([{}]);
          getExchangeOrder.mockReturnValueOnce({});

          const { priceValidation } = getEditingBetState(state, "urn:market", "some betId");

          expect(priceValidation).toBe("some error");
        });
      });

      describe("and has sizeValidationError", () => {
        const state = {
          betslip: {
            exchangeEdit: {
              betId: "some betId",
              order: {
                validations: {
                  size: { data: "some error" },
                },
              },
            },
          },
        };

        it("should return isValid as false", () => {
          getUnmatchedBets.mockReturnValueOnce([{}]);
          getExchangeOrder.mockReturnValueOnce({});

          const { isValid } = getEditingBetState(state, "urn:market", "some betId");

          expect(isValid).toBe(false);
        });
        it("should return profit as undefined", () => {
          getUnmatchedBets.mockReturnValueOnce([{}]);
          getExchangeOrder.mockReturnValueOnce({});

          const { profit } = getEditingBetState(state, "urn:market", "some betId");

          expect(profit).toBeUndefined();
        });
        it("should return liability as undefined", () => {
          getUnmatchedBets.mockReturnValueOnce([{}]);
          getExchangeOrder.mockReturnValueOnce({});

          const { liability } = getEditingBetState(state, "urn:market", "some betId");

          expect(liability).toBeUndefined();
        });
        it("should return payout as undefined", () => {
          getUnmatchedBets.mockReturnValueOnce([{}]);
          getExchangeOrder.mockReturnValueOnce({});

          const { payout } = getEditingBetState(state, "urn:market", "some betId");

          expect(payout).toBeUndefined();
        });

        it("should return priceValidation data", () => {
          getUnmatchedBets.mockReturnValueOnce([{}]);
          getExchangeOrder.mockReturnValueOnce({});

          const { sizeValidation } = getEditingBetState(state, "urn:market", "some betId");

          expect(sizeValidation).toBe("some error");
        });
      });

      describe("and does not have priceValidationError neither sizeValidationError", () => {
        const state = {
          betslip: {
            exchangeEdit: {
              betId: "some betId",
              order: {
                validations: {},
              },
            },
          },
        };

        it("should return isValid as true", () => {
          getUnmatchedBets.mockReturnValueOnce([{ profit: 123, liability: 456, payout: 789 }]);
          getExchangeOrder.mockReturnValueOnce({});

          const { isValid } = getEditingBetState(state, "urn:market", "some betId");
          expect(isValid).toBe(true);
        });

        it("should return unmatchedBet profit", () => {
          getUnmatchedBets.mockReturnValueOnce([{ profit: 123, liability: 456, payout: 789 }]);
          getExchangeOrder.mockReturnValueOnce({});

          const { profit } = getEditingBetState(state, "urn:market", "some betId");
          expect(profit).toBe(123);
        });

        it("should return unmatchedBet liability", () => {
          getUnmatchedBets.mockReturnValueOnce([{ profit: 123, liability: 456, payout: 789 }]);
          getExchangeOrder.mockReturnValueOnce({});

          const { liability } = getEditingBetState(state, "urn:market", "some betId");
          expect(liability).toBe(456);
        });

        it("should return unmatchedBet payout", () => {
          getUnmatchedBets.mockReturnValueOnce([{ profit: 123, liability: 456, payout: 789 }]);
          getExchangeOrder.mockReturnValueOnce({});

          const { payout } = getEditingBetState(state, "urn:market", "some betId");
          expect(payout).toBe(789);
        });
      });
    });
  });

  describe("getSportsbookPlacedCombination", () => {
    describe("when there is a combination", () => {
      it("should return the combinations", () => {
        const sportsbookReport = {
          result: {
            combinations: {
              "C:1": "combination 1",
              "C:2": "combination 2",
            },
          },
        };
        expect(getSportsbookPlacedCombination(sportsbookReport, "C:1")).toBe(
          sportsbookReport.result.combinations["C:1"],
        );
      });
    });

    describe("when the combinationId doesn't exist", () => {
      it("should return undefined", () => {
        const sportsbookReport = {
          result: {
            combinations: {
              "C:1": "combination 1",
              "C:2": "combination 2",
            },
          },
        };
        expect(getSportsbookPlacedCombination(sportsbookReport, "C:3")).toBe(undefined);
      });
    });

    describe("when there is no report", () => {
      it("should return undefined", () => {
        expect(getSportsbookPlacedCombination(undefined, "C:1")).toBe(undefined);
      });
    });
  });

  describe("getBetslipExchangeReportUnmatched", () => {
    describe("when there is exchange report", () => {
      it("should return unmatched info", () => {
        const state = {
          betslip: { exchangeReport: { unmatched: "unmatched" } },
        };
        expect(getBetslipExchangeReportUnmatched(state)).toBe(state.betslip.exchangeReport.unmatched);
      });
    });

    describe("when there is no exchange report", () => {
      it("should return undefined", () => {
        const state = {
          betslip: {},
        };
        expect(getBetslipExchangeReportUnmatched(state)).toBe(undefined);
      });
    });
  });

  describe("Sportsbook Confirmation Selectors", () => {
    const sportsbookConfirmationMock = {
      combinations: { combinationId: {} },
      ignoredBets: [{ id: "failureId", hasStake: true }],
      failures: { notification: {} },
      legs: { legId: {} },
      runners: { runnerId: {} },
      castContext: { cast: "context" },
      availabilityChanged: true,
    };
    const state = {
      betslip: {
        sportsbookConfirmation: sportsbookConfirmationMock,
      },
    };
    const emptyState = {
      betslip: {},
    };

    describe("when state contains Sportsbook Confirmation", () => {
      describe("getSportsbookConfirmation", () => {
        it("should return sportsbookConfirmation", () => {
          expect(getSportsbookConfirmation(state)).toBe(state.betslip.sportsbookConfirmation);
        });
      });

      describe("getSportsbookConfirmationCastContext", () => {
        it("should return sportsbookConfirmation cast context", () => {
          expect(getSportsbookConfirmationCastContext(state)).toBe(state.betslip.sportsbookConfirmation.castContext);
        });
      });

      describe("getSportsbookConfirmationCombinations", () => {
        it("should return sportsbookConfirmation combinations", () => {
          expect(getSportsbookConfirmationCombinations(state)).toBe(state.betslip.sportsbookConfirmation.combinations);
        });
      });

      describe("getSportsbookConfirmationIgnoredBets", () => {
        it("should return sportsbookConfirmation failures ids", () => {
          expect(getSportsbookConfirmationIgnoredBets(state)).toBe(state.betslip.sportsbookConfirmation.ignoredBets);
        });
      });

      describe("getSportsbookConfirmationLegs", () => {
        it("should return sportsbookConfirmation legs", () => {
          expect(getSportsbookConfirmationLegs(state)).toBe(state.betslip.sportsbookConfirmation.legs);
        });
      });

      describe("getSportsbookConfirmationRunners", () => {
        it("should return sportsbookConfirmation runners", () => {
          expect(getSportsbookConfirmationRunners(state)).toBe(state.betslip.sportsbookConfirmation.runners);
        });
      });

      describe("getSportsbookConfirmationAvailability", () => {
        it("should return sportsbookConfirmation availabilityChanged", () => {
          expect(getSportsbookConfirmationAvailability(state)).toEqual(
            state.betslip.sportsbookConfirmation.availabilityChanged,
          );
        });
      });

      describe("getSportsbookConfirmationFailures", () => {
        it("should return sportsbookConfirmation failures", () => {
          expect(getSportsbookConfirmationFailures(state)).toEqual(state.betslip.sportsbookConfirmation.failures);
        });
      });

      describe("createGetBetBuilderConfirmationCombinationIdsSelector", () => {
        it("should return bet builder ids", () => {
          const appState = {
            betslip: {
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
          };
          isBetBuilder.mockReturnValue(true);
          createShallowEqualSelector.mockReturnValueOnce(({ betslip }) =>
            Object.values(betslip.combinations).map(({ id }) => id),
          );

          const ids = createGetBetBuilderConfirmationCombinationIdsSelector()(appState);

          expect(ids).toEqual(["C:1", "C:2"]);
        });
      });
    });

    describe("when state does not contain Sportsbook Confirmation", () => {
      describe("getSportsbookConfirmation", () => {
        it("should return undefined", () => {
          expect(getSportsbookConfirmation(emptyState)).toBeUndefined();
        });
      });

      describe("getSportsbookConfirmationCastContext", () => {
        it("should return an empty object", () => {
          expect(getSportsbookConfirmationCastContext(emptyState)).toBeUndefined();
        });
      });

      describe("getSportsbookConfirmationCombinations", () => {
        it("should return an empty object", () => {
          expect(getSportsbookConfirmationCombinations(emptyState)).toEqual({});
        });
      });

      describe("getSportsbookConfirmationIgnoredBets", () => {
        it("should return undefined", () => {
          expect(getSportsbookConfirmationIgnoredBets(emptyState)).toEqual([]);
        });
      });

      describe("getSportsbookConfirmationLegs", () => {
        it("should return an empty object", () => {
          expect(getSportsbookConfirmationLegs(emptyState)).toEqual({});
        });
      });

      describe("getSportsbookConfirmationRunners", () => {
        it("should return an empty object", () => {
          expect(getSportsbookConfirmationRunners(emptyState)).toEqual({});
        });
      });

      describe("getSportsbookConfirmationAvailability", () => {
        it("should return false", () => {
          expect(getSportsbookConfirmationAvailability(emptyState)).toEqual(false);
        });
      });

      describe("getSportsbookConfirmationFailures", () => {
        it("should return an empty object", () => {
          expect(getSportsbookConfirmationFailures(emptyState)).toEqual({});
        });
      });

      describe("createGetBetBuilderConfirmationCombinationIdsSelector", () => {
        it("should return an empty array", () => {
          const ids = createGetBetBuilderConfirmationCombinationIdsSelector()({});

          expect(ids).toEqual([]);
        });
      });
    });
  });
});
