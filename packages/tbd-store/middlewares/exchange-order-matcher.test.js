import { calc } from "@ppb/bet-engine";
import { NETWORK__SEARCH_EXC_ORDERS_SUCCESS } from "../actions/betslip";
import { exchangeOrderMatcher } from "./exchange-order-matcher";

jest.mock("@ppb/bet-engine", () => ({
  __esModule: true,
  calc: {
    profit: jest.fn(() => 1337),
    liability: jest.fn(() => 999),
    payout: jest.fn(() => 100),
  },
}));

jest.mock("../state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => ({
    exchangeSettings: {
      discount: "getUserDetailsDiscountMock",
    },
  })),
}));

const storeMock = { getState: jest.fn(() => "getStateMock") };

function setup(nextSpy = jest.fn()) {
  return {
    dispatch: (actionType, payload = {}) =>
      exchangeOrderMatcher(storeMock)(nextSpy)({
        type: actionType,
        payload,
      }),
  };
}

describe("Exchange Order Matcher Middleware", () => {
  afterEach(jest.clearAllMocks);

  describe("when the store receives it's first action", () => {
    it("should pass through a random action", async () => {
      const nextSpy = jest.fn().mockReturnValue("nextReturnValue");
      await setup(nextSpy).dispatch("ANY_ACTION", {
        metadata: {
          runnerTree: {
            market: {
              bettingType: "ODDS",
              marketType: "EACH_WAY",
            },
          },
        },
        fake: "payload",
      });

      expect(nextSpy).toHaveBeenCalledWith({
        type: "ANY_ACTION",
        payload: {
          metadata: {
            runnerTree: {
              market: {
                bettingType: "ODDS",
                marketType: "EACH_WAY",
              },
            },
          },
          fake: "payload",
        },
      });
      expect(nextSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("when action type is NETWORK__SEARCH_EXC_ORDERS_SUCCESS", () => {
    describe("and both report.matched and report.unmatched is undefined", () => {
      describe("and store state is empty", () => {
        beforeEach(() => {
          storeMock.getState.mockReturnValue({
            betslip: {},
          });
        });

        it("should propagate action with same payload report and with store values as undefined", async () => {
          const nextSpy = jest.fn().mockReturnValue("nextReturnValue");
          const payload = {
            report: {
              metadata: {
                runnerTree: {
                  market: {
                    bettingType: "ODDS",
                    marketType: "EACH_WAY",
                  },
                },
              },
              fake: "report",
            },
          };
          const retValue = await setup(nextSpy).dispatch(NETWORK__SEARCH_EXC_ORDERS_SUCCESS, payload);

          expect(nextSpy).toHaveBeenCalledWith({
            type: NETWORK__SEARCH_EXC_ORDERS_SUCCESS,
            payload: {
              report: payload.report,
              step: undefined,
              exchangeEdit: undefined,
            },
          });
          expect(nextSpy).toHaveBeenCalledTimes(1);
          expect(retValue).toBe("nextReturnValue");
        });
      });

      describe("and store state is not empty", () => {
        beforeEach(() => {
          storeMock.getState.mockReturnValue({
            betslip: {
              step: "STATE",
              exchangeEdit: "EDIT",
              exchangeReport: "REPORT",
            },
          });
        });

        it("should propagate action with same payload report and with store values defined", async () => {
          const nextSpy = jest.fn().mockReturnValue("nextReturnValue");
          const payload = {
            report: {
              metadata: {
                runnerTree: {
                  market: {
                    bettingType: "ODDS",
                    marketType: "EACH_WAY",
                  },
                },
              },
              fake: "report",
            },
          };

          const retValue = await setup(nextSpy).dispatch(NETWORK__SEARCH_EXC_ORDERS_SUCCESS, payload);

          expect(nextSpy).toHaveBeenCalledWith({
            type: NETWORK__SEARCH_EXC_ORDERS_SUCCESS,
            payload: {
              report: payload.report,
              exchangeEdit: "EDIT",
              step: "STATE",
            },
          });
          expect(nextSpy).toHaveBeenCalledTimes(1);
          expect(retValue).toBe("nextReturnValue");
        });
      });
    });

    describe("and report.matched is defined", () => {
      it("should calculate profit using bet-engine", async () => {
        const nextSpy = jest.fn();

        await setup(nextSpy).dispatch(NETWORK__SEARCH_EXC_ORDERS_SUCCESS, {
          report: {
            metadata: {
              runnerTree: {
                market: {
                  bettingType: "ODDS",
                  marketType: "EACH_WAY",
                },
              },
            },
            side: "LAY",
            matched: {
              price: 1.23,
              size: 2,
            },
          },
        });

        expect(calc.profit).toHaveBeenCalledWith("LAY", 2, 1.23, "ODDS", "EACH_WAY");
        expect(calc.profit).toHaveBeenCalledTimes(1);
      });

      it("should calculate liability using bet-engine", async () => {
        await setup(jest.fn()).dispatch(NETWORK__SEARCH_EXC_ORDERS_SUCCESS, {
          report: {
            metadata: {
              runnerTree: {
                market: {
                  bettingType: "ODDS",
                  marketType: "EACH_WAY",
                },
              },
            },
            side: "LAY",
            matched: {
              price: 1.23,
              size: 2,
            },
          },
        });

        expect(calc.liability).toHaveBeenCalledTimes(1);
        expect(calc.liability).toHaveBeenCalledWith("LAY", 2, 1.23, "ODDS", "EACH_WAY", {
          bonus: 0,
        });
      });

      describe("when store matched values are the same", () => {
        it("should propagate action with profit and liability and previous state", async () => {
          storeMock.getState.mockReturnValue({
            betslip: {
              step: "STATE",
              exchangeEdit: "EDIT",
              exchangeReport: {
                matched: {
                  price: 1.23,
                  size: 2,
                },
              },
            },
          });
          const nextSpy = jest.fn().mockReturnValue("nextReturnValue");
          const retValue = await setup(nextSpy).dispatch(NETWORK__SEARCH_EXC_ORDERS_SUCCESS, {
            report: {
              metadata: {
                runnerTree: {
                  market: {
                    bettingType: "ODDS",
                    marketType: "EACH_WAY",
                  },
                },
              },
              side: "BACK",
              matched: {
                price: 1.23,
                size: 2,
              },
            },
          });

          expect(nextSpy).toHaveBeenCalledWith({
            type: NETWORK__SEARCH_EXC_ORDERS_SUCCESS,
            payload: {
              report: {
                metadata: {
                  runnerTree: {
                    market: {
                      bettingType: "ODDS",
                      marketType: "EACH_WAY",
                    },
                  },
                },
                side: "BACK",
                matched: {
                  price: 1.23,
                  size: 2,
                  profit: 1337,
                  liability: 999,
                  totalBonusUsed: 0,
                },
              },
              step: "STATE",
              exchangeEdit: "EDIT",
            },
          });
          expect(nextSpy).toHaveBeenCalledTimes(1);
          expect(retValue).toBe("nextReturnValue");
        });
      });

      describe("when store matched values are different", () => {
        describe("when a place error does not exist", () => {
          it("should propagate action with profit and liability and REPORT state", async () => {
            storeMock.getState.mockReturnValue({
              betslip: {
                step: "EDIT_UNMATCHED",
                exchangeReport: {
                  matched: {
                    price: 1.23,
                    size: 2,
                  },
                },
                exchangeEdit: "edit",
              },
            });
            const nextSpy = jest.fn().mockReturnValue("nextReturnValue");
            const retValue = await setup(nextSpy).dispatch(NETWORK__SEARCH_EXC_ORDERS_SUCCESS, {
              report: {
                metadata: {
                  runnerTree: {
                    market: {
                      bettingType: "ODDS",
                      marketType: "EACH_WAY",
                    },
                  },
                },
                side: "BACK",
                matched: {
                  price: 1.23,
                  size: 4,
                },
              },
            });

            expect(nextSpy).toHaveBeenCalledWith({
              type: NETWORK__SEARCH_EXC_ORDERS_SUCCESS,
              payload: {
                report: {
                  metadata: {
                    runnerTree: {
                      market: {
                        bettingType: "ODDS",
                        marketType: "EACH_WAY",
                      },
                    },
                  },
                  side: "BACK",
                  matched: {
                    price: 1.23,
                    size: 4,
                    profit: 1337,
                    liability: 999,
                    totalBonusUsed: 0,
                  },
                },
                step: "REPORT",
                exchangeEdit: undefined,
              },
            });
            expect(nextSpy).toHaveBeenCalledTimes(1);
            expect(retValue).toBe("nextReturnValue");
          });
        });

        describe("when a place error exists", () => {
          it("should propagate action with profit and liability and previous step", async () => {
            storeMock.getState.mockReturnValue({
              betslip: {
                step: "EDIT_UNMATCHED",
                exchangeReport: {
                  matched: {
                    price: 1.23,
                    size: 2,
                  },
                },
                exchangeEdit: "edit",
                exchangePlaceError: {
                  errorCode: "some_error",
                },
              },
            });
            const nextSpy = jest.fn().mockReturnValue("nextReturnValue");
            const retValue = await setup(nextSpy).dispatch(NETWORK__SEARCH_EXC_ORDERS_SUCCESS, {
              report: {
                metadata: {
                  runnerTree: {
                    market: {
                      bettingType: "ODDS",
                      marketType: "EACH_WAY",
                    },
                  },
                },
                side: "BACK",
                matched: {
                  price: 1.23,
                  size: 4,
                },
              },
            });

            expect(nextSpy).toHaveBeenCalledWith({
              type: NETWORK__SEARCH_EXC_ORDERS_SUCCESS,
              payload: {
                report: {
                  metadata: {
                    runnerTree: {
                      market: {
                        bettingType: "ODDS",
                        marketType: "EACH_WAY",
                      },
                    },
                  },
                  side: "BACK",
                  matched: {
                    price: 1.23,
                    size: 4,
                    profit: 1337,
                    liability: 999,
                    totalBonusUsed: 0,
                  },
                },
                step: "EDIT_UNMATCHED",
                exchangeEdit: "edit",
              },
            });
            expect(nextSpy).toHaveBeenCalledTimes(1);
            expect(retValue).toBe("nextReturnValue");
          });
        });
      });
    });

    describe("and report.unmatched is defined", () => {
      it("should calculate profit using bet-engine", async () => {
        const nextSpy = jest.fn();
        await setup(nextSpy).dispatch(NETWORK__SEARCH_EXC_ORDERS_SUCCESS, {
          report: {
            metadata: {
              runnerTree: {
                market: {
                  bettingType: "ODDS",
                  marketType: "EACH_WAY",
                },
              },
            },
            side: "LAY",
            unmatched: {
              price: 1.23,
              size: 2,
            },
          },
        });

        expect(calc.profit).toHaveBeenCalledWith("LAY", 2, 1.23, "ODDS", "EACH_WAY");
        expect(calc.profit).toHaveBeenCalledTimes(1);
      });
      it("should calculate liability using bet-engine", async () => {
        await setup(jest.fn()).dispatch(NETWORK__SEARCH_EXC_ORDERS_SUCCESS, {
          report: {
            metadata: {
              runnerTree: {
                market: {
                  bettingType: "ODDS",
                  marketType: "EACH_WAY",
                },
              },
            },
            side: "LAY",
            unmatched: {
              price: 1.23,
              size: 2,
            },
          },
        });

        expect(calc.liability).toHaveBeenCalledTimes(1);
        expect(calc.liability).toHaveBeenCalledWith("LAY", 2, 1.23, "ODDS", "EACH_WAY", {
          bonus: 0,
        });
      });

      describe("when store unmatched values are the same", () => {
        it("should propagate action with profit and liability and previous state", async () => {
          storeMock.getState.mockReturnValue({
            betslip: {
              step: "STATE",
              exchangeEdit: "EDIT",
              exchangeReport: {
                unmatched: {
                  price: 1.23,
                  size: 2,
                },
              },
            },
          });
          const nextSpy = jest.fn().mockReturnValue("nextReturnValue");
          const retValue = await setup(nextSpy).dispatch(NETWORK__SEARCH_EXC_ORDERS_SUCCESS, {
            report: {
              metadata: {
                runnerTree: {
                  market: {
                    bettingType: "ODDS",
                    marketType: "EACH_WAY",
                  },
                },
              },
              side: "BACK",
              unmatched: {
                price: 1.23,
                size: 2,
              },
            },
          });

          expect(nextSpy).toHaveBeenCalledWith({
            type: NETWORK__SEARCH_EXC_ORDERS_SUCCESS,
            payload: {
              report: {
                metadata: {
                  runnerTree: {
                    market: {
                      bettingType: "ODDS",
                      marketType: "EACH_WAY",
                    },
                  },
                },
                side: "BACK",
                unmatched: {
                  price: 1.23,
                  size: 2,
                  profit: 1337,
                  liability: 999,
                  totalBonusUsed: 0,
                },
              },
              step: "STATE",
              exchangeEdit: "EDIT",
            },
          });
          expect(nextSpy).toHaveBeenCalledTimes(1);
          expect(retValue).toBe("nextReturnValue");
        });
      });

      describe("when store unmatched values are different", () => {
        it("should propagate action with profit and liability and REPORT state", async () => {
          storeMock.getState.mockReturnValue({
            betslip: {
              step: "EDIT_UNMATCHED",
              exchangeReport: {
                unmatched: {
                  price: 1.23,
                  size: 2,
                },
              },
              exchangeEdit: "edit",
            },
          });
          const nextSpy = jest.fn().mockReturnValue("nextReturnValue");
          const retValue = await setup(nextSpy).dispatch(NETWORK__SEARCH_EXC_ORDERS_SUCCESS, {
            report: {
              metadata: {
                runnerTree: {
                  market: {
                    bettingType: "ODDS",
                    marketType: "EACH_WAY",
                  },
                },
              },
              side: "BACK",
              unmatched: {
                price: 1.23,
                size: 4,
              },
            },
          });

          expect(nextSpy).toHaveBeenCalledWith({
            type: NETWORK__SEARCH_EXC_ORDERS_SUCCESS,
            payload: {
              report: {
                metadata: {
                  runnerTree: {
                    market: {
                      bettingType: "ODDS",
                      marketType: "EACH_WAY",
                    },
                  },
                },
                side: "BACK",
                unmatched: {
                  price: 1.23,
                  size: 4,
                  profit: 1337,
                  liability: 999,
                  totalBonusUsed: 0,
                },
              },
              step: "REPORT",
              exchangeEdit: undefined,
            },
          });
          expect(nextSpy).toHaveBeenCalledTimes(1);
          expect(retValue).toBe("nextReturnValue");
        });
      });
    });

    describe("and report.matched + report.unmatched are defined", () => {
      it("should calculate profit using bet-engine", async () => {
        const nextSpy = jest.fn();
        await setup(nextSpy).dispatch(NETWORK__SEARCH_EXC_ORDERS_SUCCESS, {
          report: {
            metadata: {
              runnerTree: {
                market: {
                  bettingType: "ODDS",
                  marketType: "EACH_WAY",
                },
              },
            },
            side: "LAY",
            matched: {
              price: 1.23,
              size: 3,
            },
            unmatched: {
              price: 4.56,
              size: 7,
            },
          },
        });

        expect(calc.profit).toHaveBeenCalledWith("LAY", 3, 1.23, "ODDS", "EACH_WAY");
        expect(calc.profit).toHaveBeenCalledWith("LAY", 7, 4.56, "ODDS", "EACH_WAY");
        expect(calc.profit).toHaveBeenCalledTimes(2);
      });
      it("should calculate liability using bet-engine", async () => {
        await setup(jest.fn()).dispatch(NETWORK__SEARCH_EXC_ORDERS_SUCCESS, {
          report: {
            metadata: {
              runnerTree: {
                market: {
                  bettingType: "ODDS",
                  marketType: "EACH_WAY",
                },
              },
            },
            side: "LAY",
            matched: {
              price: 1.23,
              size: 3,
            },
            unmatched: {
              price: 4.56,
              size: 7,
            },
          },
        });

        expect(calc.liability).toHaveBeenCalledTimes(2);
        expect(calc.liability).toHaveBeenCalledWith("LAY", 3, 1.23, "ODDS", "EACH_WAY", {
          bonus: 0,
        });
        expect(calc.liability).toHaveBeenCalledWith("LAY", 7, 4.56, "ODDS", "EACH_WAY", {
          bonus: 0,
        });
      });

      it("should propagate action with profit and liability", async () => {
        const nextSpy = jest.fn().mockReturnValue("nextReturnValue");
        const retValue = await setup(nextSpy).dispatch(NETWORK__SEARCH_EXC_ORDERS_SUCCESS, {
          report: {
            metadata: {
              runnerTree: {
                market: {
                  bettingType: "ODDS",
                  marketType: "EACH_WAY",
                },
              },
            },
            side: "BACK",
            matched: {
              price: 1.23,
              size: 3,
            },
            unmatched: {
              price: 4.56,
              size: 7,
            },
          },
        });

        expect(nextSpy).toHaveBeenCalledWith({
          type: NETWORK__SEARCH_EXC_ORDERS_SUCCESS,
          payload: {
            report: {
              metadata: {
                runnerTree: {
                  market: {
                    bettingType: "ODDS",
                    marketType: "EACH_WAY",
                  },
                },
              },
              side: "BACK",
              matched: {
                price: 1.23,
                size: 3,
                profit: 1337,
                liability: 999,
                totalBonusUsed: 0,
              },
              unmatched: {
                price: 4.56,
                size: 7,
                profit: 1337,
                liability: 999,
                totalBonusUsed: 0,
              },
            },
            step: "REPORT",
            exchangeEdit: undefined,
          },
        });
        expect(nextSpy).toHaveBeenCalledTimes(1);
        expect(retValue).toBe("nextReturnValue");
      });

      describe("when it was used bonus to place the bet", () => {
        it("should calculate total bonus used and liability using bet-engine", async () => {
          const nextSpy = jest.fn();
          await setup(nextSpy).dispatch(NETWORK__SEARCH_EXC_ORDERS_SUCCESS, {
            report: {
              metadata: {
                runnerTree: {
                  market: {
                    bettingType: "ODDS",
                    marketType: "EACH_WAY",
                  },
                },
              },
              side: "LAY",
              matched: {
                price: 1.23,
                size: 3,
                totalBonusUsed: 3,
              },
              unmatched: {
                price: 4.56,
                size: 7,
                totalBonusUsed: 2,
              },
            },
          });

          expect(calc.liability).toHaveBeenCalledTimes(4);

          // matched part
          expect(calc.liability).toHaveBeenCalledWith("LAY", 3, 1.23, "ODDS", "EACH_WAY");
          expect(calc.liability).toHaveBeenCalledWith("LAY", 3, 1.23, "ODDS", "EACH_WAY", {
            bonus: 999, // mock return value from calc.liability
          });

          // unmatched part
          expect(calc.liability).toHaveBeenCalledWith("LAY", 2, 4.56, "ODDS", "EACH_WAY");
          expect(calc.liability).toHaveBeenCalledWith("LAY", 7, 4.56, "ODDS", "EACH_WAY", {
            bonus: 999, // mock return value from calc.liability
          });
        });
      });
    });

    describe("and hasPriceAndSize is false", () => {
      it("should not calculate liability or profit", async () => {
        const nextSpy = jest.fn();
        await setup(nextSpy).dispatch(NETWORK__SEARCH_EXC_ORDERS_SUCCESS, {
          report: {
            metadata: {
              runnerTree: {
                market: {
                  bettingType: "ODDS",
                  marketType: "EACH_WAY",
                },
              },
            },
            side: "LAY",
            matched: {
              price: 0,
              size: 2,
              totalBonusUsed: 0,
            },
          },
        });

        expect(calc.liability).not.toHaveBeenCalled();
        expect(calc.profit).not.toHaveBeenCalled();

        expect(nextSpy).toHaveBeenCalledWith({
          type: NETWORK__SEARCH_EXC_ORDERS_SUCCESS,
          payload: {
            report: {
              metadata: {
                runnerTree: {
                  market: {
                    bettingType: "ODDS",
                    marketType: "EACH_WAY",
                  },
                },
              },
              side: "LAY",
              matched: {
                price: 0,
                size: 2,
                profit: undefined,
                liability: undefined,
                totalBonusUsed: 0,
              },
            },
            step: "REPORT",
            exchangeEdit: undefined,
          },
        });
      });

      it("should propagate action with profit and liability undefined", async () => {
        const nextSpy = jest.fn();
        await setup(nextSpy).dispatch(NETWORK__SEARCH_EXC_ORDERS_SUCCESS, {
          report: {
            metadata: {
              runnerTree: {
                market: {
                  bettingType: "ODDS",
                  marketType: "EACH_WAY",
                },
              },
            },
            side: "LAY",
            matched: {
              price: 0,
              size: 2,
              totalBonusUsed: 0,
            },
          },
        });

        expect(nextSpy).toHaveBeenCalledWith({
          type: NETWORK__SEARCH_EXC_ORDERS_SUCCESS,
          payload: {
            report: {
              metadata: {
                runnerTree: {
                  market: {
                    bettingType: "ODDS",
                    marketType: "EACH_WAY",
                  },
                },
              },
              side: "LAY",
              matched: {
                price: 0,
                size: 2,
                profit: undefined,
                liability: undefined,
                totalBonusUsed: 0,
              },
            },
            step: "REPORT",
            exchangeEdit: undefined,
          },
        });
      });
    });
  });
});
