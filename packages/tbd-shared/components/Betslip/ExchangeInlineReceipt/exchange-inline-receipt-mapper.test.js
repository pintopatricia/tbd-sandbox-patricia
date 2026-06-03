import { roundDown, roundUp } from "@ppb/tbd-store/helpers/formatters";
import { AlertType } from "@ppb/the-wall-common/types";

import { ExchangeSide } from "@ppb/tbd-store/state/constants";
import { currencyFormatWithDecimalPlaces } from "../../../formatters/currency-formatters";
import { buildFreeBetsLabel } from "../betslip-formatters";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { getIsFreeBetsSelected } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { getInlineBetslipTitle } from "../../../helpers/exchange-betslip-title-helper";

import { buildExchangeInlineReceipt } from "./exchange-inline-receipt-mapper";

jest.mock("@ppb/tbd-store/helpers/formatters", () => ({
  roundDown: jest.fn().mockReturnValue("rounded down value"),
  roundUp: jest.fn().mockReturnValue("rounded up value"),
}));

jest.mock("../../../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn().mockReturnValue("formatted currency value"),
}));

jest.mock("../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("../betslip-formatters", () => ({
  buildFreeBetsLabel: jest.fn().mockReturnValue("formatted bonus label"),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors");
jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors");
jest.mock("../../../helpers/exchange-betslip-title-helper");

const setup = ({ report, hasFreeBets = false, userDetails = { mock: "userDetails" } } = {}) => {
  const defaultReport = {
    side: ExchangeSide.BACK,
  };
  const receiptReport = report || defaultReport;

  getUserDetails.mockReturnValue(userDetails);
  getIsFreeBetsSelected.mockReturnValue(hasFreeBets);
  getInlineBetslipTitle.mockReturnValue("market - runner");

  return buildExchangeInlineReceipt({
    betslip: { exchangeReport: receiptReport },
    entities: {},
  });
};

const setupMatched = ({ report, hasFreeBets, userDetails } = {}) => {
  const defaultReport = {
    side: ExchangeSide.BACK,
    matched: {
      price: 10,
      size: 20,
      profit: 30,
      totalBonusUsed: 5,
    },
  };
  return setup({ report: report || defaultReport, hasFreeBets, userDetails });
};

const setupUnmatched = ({ report, hasFreeBets, userDetails, unmatchedBet } = {}) => {
  const defaultReport = {
    side: ExchangeSide.BACK,
    unmatched: {
      price: 10,
      size: 20,
      profit: 30,
      totalBonusUsed: 5,
    },
  };
  return setup({ report: report || defaultReport, hasFreeBets, userDetails, unmatchedBet });
};

const setupCancelled = ({ report, hasFreeBets, userDetails } = {}) => {
  const defaultReport = {
    side: ExchangeSide.BACK,
    cancelled: {
      price: 10,
      size: 20,
      profit: 30,
      totalBonusUsed: 5,
    },
  };
  return setup({ report: report || defaultReport, hasFreeBets, userDetails });
};

describe("Exchange Inline Receipt Mapper", () => {
  beforeEach(jest.clearAllMocks);

  describe("buildExchangeInlineReceipt", () => {
    describe("title", () => {
      describe("when bet side is Back", () => {
        it("should return Back title", () => {
          const receipt = setup({
            report: {
              side: ExchangeSide.BACK,
            },
          });

          expect(receipt.title).toBe("market - runner");
        });
      });

      describe("when bet side is Lay", () => {
        it("should return Lay title", () => {
          const receipt = setup({
            report: {
              side: ExchangeSide.LAY,
            },
          });

          expect(receipt.title).toBe("market - runner");
        });
      });
    });

    describe("side", () => {
      describe("when bet side is Back", () => {
        it("should return Back side", () => {
          const receipt = setup({
            report: {
              side: ExchangeSide.BACK,
            },
          });

          expect(receipt.side).toBe("BACK");
        });
      });

      describe("when bet side is Lay", () => {
        it("should return Lay side", () => {
          const receipt = setup({
            report: {
              side: ExchangeSide.LAY,
            },
          });

          expect(receipt.side).toBe("LAY");
        });
      });
    });

    describe("matched", () => {
      describe("when the report doesn't have matched bets", () => {
        it("shouldn't return matched bets info", () => {
          const receipt = setupMatched({
            report: {
              side: ExchangeSide.BACK,
            },
          });

          expect(receipt.matched).toBeUndefined();
        });
      });

      describe("when the report has matched bets", () => {
        describe("type", () => {
          it("should return MATCHED type", () => {
            const { matched } = setupMatched();

            expect(matched.type).toBe("MATCHED");
          });
        });

        describe("price", () => {
          describe("when bet side is Back", () => {
            it("should call roundDown", () => {
              setupMatched();

              expect(roundDown).toHaveBeenCalledWith(10);
            });

            it("should return rounded down value", () => {
              const { matched } = setupMatched();

              expect(matched.price).toBe("rounded down value");
            });
          });

          describe("when bet side is Lay", () => {
            it("should call roundDown", () => {
              setupMatched({
                report: {
                  side: ExchangeSide.LAY,
                  matched: { price: 11 },
                },
              });

              expect(roundUp).toHaveBeenCalledWith(11);
            });

            it("should return rounded down value", () => {
              const { matched } = setupMatched({
                report: {
                  side: ExchangeSide.LAY,
                  matched: { price: 11 },
                },
              });

              expect(matched.price).toBe("rounded up value");
            });
          });
        });

        describe("stake", () => {
          it("should call currencyFormatWithDecimalPlaces", () => {
            setupMatched();

            expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
              mock: "userDetails",
              value: 20,
              decimalPlaces: 2,
            });
          });

          it("should return formatted stake", () => {
            const { matched } = setupMatched();

            expect(matched.stake).toBe("formatted currency value");
          });
        });

        describe("profit", () => {
          describe("when profit is negative", () => {
            it("should return formatted negative profit value", () => {
              const { matched } = setupMatched({
                report: {
                  side: ExchangeSide.BACK,
                  matched: { profit: -30 },
                },
              });

              expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
                mock: "userDetails",
                value: -30,
                decimalPlaces: 2,
              });
              expect(matched.profit).toBe("formatted currency value");
            });
          });

          describe("when profit is undefined", () => {
            it("should return formatted zero profit value", () => {
              const { matched } = setupMatched({
                report: {
                  side: ExchangeSide.BACK,
                  matched: { profit: undefined },
                },
              });

              expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
                mock: "userDetails",
                value: 0,
                decimalPlaces: 2,
              });
              expect(matched.profit).toBe("formatted currency value");
            });
          });

          describe("when bet side is Back", () => {
            it("should call currencyFormatWithDecimalPlaces", () => {
              setupMatched();

              expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
                mock: "userDetails",
                value: 30,
                decimalPlaces: 2,
              });
            });

            it("should return formatted profit value", () => {
              const { matched } = setupMatched();

              expect(matched.profit).toBe("formatted currency value");
            });
          });

          describe("when bet side is Lay", () => {
            it("should call currencyFormatWithDecimalPlaces", () => {
              setupMatched({
                report: {
                  side: ExchangeSide.LAY,
                  matched: { profit: 30 },
                },
              });

              expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
                mock: "userDetails",
                value: 30,
                decimalPlaces: 2,
              });
            });

            it("should return formatted profit value", () => {
              const { matched } = setupMatched();

              expect(matched.profit).toBe("formatted currency value");
            });
          });
        });

        describe("liability", () => {
          describe("when bet side is Back", () => {
            it("should return undefined liability", () => {
              const { matched } = setupMatched();

              expect(matched.liability).toBeUndefined();
            });
          });

          describe("when bet side is Lay", () => {
            describe("when liability is positive", () => {
              it("should call currencyFormatWithDecimalPlaces", () => {
                setupMatched({
                  report: {
                    side: ExchangeSide.LAY,
                    matched: { liability: 40 },
                  },
                });

                expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
                  mock: "userDetails",
                  value: 40,
                  decimalPlaces: 2,
                });
              });

              it("should return formatted liability value", () => {
                const { matched } = setupMatched({
                  report: {
                    side: ExchangeSide.LAY,
                    matched: { liability: 40 },
                  },
                });

                expect(matched.liability).toBe("formatted currency value");
              });
            });

            describe("when liability is negative", () => {
              it("should call currencyFormatWithDecimalPlaces with zero value", () => {
                setupMatched({
                  report: {
                    side: ExchangeSide.LAY,
                    matched: { liability: -40 },
                  },
                });

                expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
                  mock: "userDetails",
                  value: 0,
                  decimalPlaces: 2,
                });
              });

              it("should return formatted liability value", () => {
                const { matched } = setupMatched({
                  report: {
                    side: ExchangeSide.LAY,
                    matched: { liability: -40 },
                  },
                });

                expect(matched.liability).toBe("formatted currency value");
              });
            });

            describe("when liability is undefined", () => {
              it("should not return formatted liability value", () => {
                const { matched } = setupMatched({
                  report: {
                    side: ExchangeSide.LAY,
                    matched: { liability: undefined },
                  },
                });

                expect(matched.liability).toBeUndefined();
              });
            });
          });
        });

        describe("bonus", () => {
          describe("when hasFreeBets is false", () => {
            it("should return empty bonus", () => {
              const { matched } = setupMatched({ hasFreeBets: false });

              expect(matched.bonus).toBe("");
            });
          });

          describe("when totalBonusUsed is not defined", () => {
            it("should return empty bonus", () => {
              const { matched } = setupMatched({
                report: {
                  side: ExchangeSide.LAY,
                  matched: { totalBonusUsed: undefined },
                },
                hasFreeBets: true,
              });

              expect(matched.bonus).toBe("");
            });
          });

          describe("when hasFreeBets is true and totalBonusUsed is defined", () => {
            it("should call buildFreeBetsLabel", () => {
              setupMatched({ hasFreeBets: true });

              expect(buildFreeBetsLabel).toHaveBeenCalledWith("I18N.BETSLIP.USED_BONUS", { mock: "userDetails" }, 5);
            });

            it("should return formatted bonus label", () => {
              const { matched } = setupMatched({ hasFreeBets: true });

              expect(matched.bonus).toBe("formatted bonus label");
            });
          });
        });

        describe("hasFreeBets", () => {
          describe("when hasFreeBets is true", () => {
            it("should return true", () => {
              const { matched } = setupMatched({ hasFreeBets: true });

              expect(matched.hasFreeBets).toBe(true);
            });
          });

          describe("when hasFreeBets is false", () => {
            it("should return false", () => {
              const { matched } = setupMatched();

              expect(matched.hasFreeBets).toBe(false);
            });
          });
        });

        describe("labels", () => {
          it("should return name label", () => {
            const {
              matched: {
                labels: { name },
              },
            } = setupMatched();

            expect(name).toBe("I18N.BETSLIP.BET_MATCHED");
          });

          it("should return price label", () => {
            const {
              matched: {
                labels: { price },
              },
            } = setupMatched();

            expect(price).toBe("I18N.BETSLIP.ODDS");
          });

          it("should return stake label", () => {
            const {
              matched: {
                labels: { stake },
              },
            } = setupMatched();

            expect(stake).toBe("I18N.BETSLIP.STAKE");
          });

          it("should return profit label", () => {
            const {
              matched: {
                labels: { profit },
              },
            } = setupMatched();

            expect(profit).toBe("I18N.BETSLIP.PROFIT");
          });

          describe("liability label", () => {
            describe("when bet side is Back", () => {
              it("should return liability label", () => {
                const {
                  matched: {
                    labels: { liability },
                  },
                } = setupMatched();

                expect(liability).toBe("I18N.BETSLIP.LIABILITY");
              });

              it("should return profit label", () => {
                const {
                  matched: {
                    labels: { profit },
                  },
                } = setupMatched();

                expect(profit).toBe("I18N.BETSLIP.PROFIT");
              });
            });

            describe("when bet side is Lay", () => {
              it("should return liability label", () => {
                const {
                  matched: {
                    labels: { liability },
                  },
                } = setupMatched({
                  report: {
                    side: ExchangeSide.LAY,
                    matched: {},
                  },
                });

                expect(liability).toBe("I18N.BETSLIP.LIABILITY");
              });

              it("should return profit label", () => {
                const {
                  matched: {
                    labels: { profit },
                  },
                } = setupMatched({
                  report: {
                    side: ExchangeSide.LAY,
                    matched: {},
                  },
                });

                expect(profit).toBe("I18N.BETSLIP.PROFIT");
              });
            });
          });
        });
      });
    });

    describe("unmatched", () => {
      describe("when the report doesn't have unmatched bets", () => {
        it("shouldn't return unmatched bets info", () => {
          const receipt = setupUnmatched({
            report: {
              side: ExchangeSide.BACK,
            },
          });

          expect(receipt.unmatched).toBeUndefined();
        });
      });

      describe("when the report has unmatched bets", () => {
        describe("type", () => {
          it("should return UNMATCHED type", () => {
            const { unmatched } = setupUnmatched();

            expect(unmatched.type).toBe("UNMATCHED");
          });
        });

        describe("price", () => {
          describe("when bet side is Back", () => {
            it("should call roundDown", () => {
              setupUnmatched();

              expect(roundDown).toHaveBeenCalledWith(10);
            });

            it("should return rounded down value", () => {
              const { unmatched } = setupUnmatched();

              expect(unmatched.price).toBe("rounded down value");
            });
          });

          describe("when bet side is Lay", () => {
            it("should call roundDown", () => {
              setupUnmatched({
                report: {
                  side: ExchangeSide.LAY,
                  unmatched: { price: 11 },
                },
              });

              expect(roundUp).toHaveBeenCalledWith(11);
            });

            it("should return rounded down value", () => {
              const { unmatched } = setupUnmatched({
                report: {
                  side: ExchangeSide.LAY,
                  unmatched: { price: 11 },
                },
              });

              expect(unmatched.price).toBe("rounded up value");
            });
          });
        });

        describe("stake", () => {
          it("should call currencyFormatWithDecimalPlaces", () => {
            setupUnmatched();

            expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
              mock: "userDetails",
              value: 20,
              decimalPlaces: 2,
            });
          });

          it("should return formatted stake", () => {
            const { unmatched } = setupUnmatched();

            expect(unmatched.stake).toBe("formatted currency value");
          });
        });

        describe("profit", () => {
          describe("when bet side is Back", () => {
            it("should call currencyFormatWithDecimalPlaces", () => {
              setupUnmatched();

              expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
                mock: "userDetails",
                value: 30,
                decimalPlaces: 2,
              });
            });

            it("should return formatted profit value", () => {
              const { unmatched } = setupUnmatched();

              expect(unmatched.profit).toBe("formatted currency value");
            });
          });

          describe("when bet side is Lay", () => {
            it("should call currencyFormatWithDecimalPlaces", () => {
              setupUnmatched({
                report: {
                  side: ExchangeSide.LAY,
                  unmatched: { profit: 30 },
                },
              });

              expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
                mock: "userDetails",
                value: 30,
                decimalPlaces: 2,
              });
            });

            it("should return formatted profit value", () => {
              const { unmatched } = setupUnmatched({
                report: {
                  side: ExchangeSide.LAY,
                  unmatched: { profit: 30 },
                },
              });

              expect(unmatched.profit).toBe("formatted currency value");
            });
          });
        });

        describe("liability", () => {
          describe("when bet side is Back", () => {
            it("should return undefined liability", () => {
              const { unmatched } = setupUnmatched();

              expect(unmatched.liability).toBeUndefined();
            });
          });

          describe("when bet side is Lay", () => {
            describe("when liability is positive", () => {
              it("should call currencyFormatWithDecimalPlaces", () => {
                setupUnmatched({
                  report: {
                    side: ExchangeSide.LAY,
                    unmatched: { liability: 40 },
                  },
                });

                expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
                  mock: "userDetails",
                  value: 40,
                  decimalPlaces: 2,
                });
              });

              it("should return formatted liability value", () => {
                const { unmatched } = setupUnmatched({
                  report: {
                    side: ExchangeSide.LAY,
                    unmatched: { liability: 40 },
                  },
                });

                expect(unmatched.liability).toBe("formatted currency value");
              });
            });

            describe("when liability is negative", () => {
              it("should call currencyFormatWithDecimalPlaces with zero value", () => {
                setupUnmatched({
                  report: {
                    side: ExchangeSide.LAY,
                    unmatched: { liability: -40 },
                  },
                });

                expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
                  mock: "userDetails",
                  value: 0,
                  decimalPlaces: 2,
                });
              });

              it("should return formatted liability value", () => {
                const { unmatched } = setupUnmatched({
                  report: {
                    side: ExchangeSide.LAY,
                    unmatched: { liability: -40 },
                  },
                });

                expect(unmatched.liability).toBe("formatted currency value");
              });
            });

            describe("when liability is undefined", () => {
              it("should return undefined liability", () => {
                const { unmatched } = setupUnmatched({
                  report: {
                    side: ExchangeSide.LAY,
                    unmatched: { liability: undefined },
                  },
                });

                expect(unmatched.liability).toBeUndefined();
              });
            });
          });
        });

        describe("bonus", () => {
          describe("when hasFreeBets is false", () => {
            it("should return empty bonus", () => {
              const { unmatched } = setupUnmatched({ hasFreeBets: false });

              expect(unmatched.bonus).toBe("");
            });
          });

          describe("when totalBonusUsed is not defined", () => {
            it("should return empty bonus", () => {
              const { unmatched } = setupUnmatched({
                report: {
                  side: ExchangeSide.LAY,
                  unmatched: { totalBonusUsed: undefined },
                },
                hasFreeBets: true,
              });

              expect(unmatched.bonus).toBe("");
            });
          });

          describe("when hasFreeBets is true and totalBonusUsed is defined", () => {
            it("should call buildFreeBetsLabel", () => {
              setupUnmatched({ hasFreeBets: true });

              expect(buildFreeBetsLabel).toHaveBeenCalledWith("I18N.BETSLIP.USED_BONUS", { mock: "userDetails" }, 5);
            });

            it("should return formatted bonus label", () => {
              const { unmatched } = setupUnmatched({ hasFreeBets: true });

              expect(unmatched.bonus).toBe("formatted bonus label");
            });
          });
        });

        describe("hasFreeBets", () => {
          describe("when hasFreeBets is true", () => {
            it("should return true", () => {
              const { unmatched } = setupUnmatched({ hasFreeBets: true });

              expect(unmatched.hasFreeBets).toBe(true);
            });
          });

          describe("when hasFreeBets is false", () => {
            it("should return false", () => {
              const { unmatched } = setupUnmatched();

              expect(unmatched.hasFreeBets).toBe(false);
            });
          });
        });

        describe("labels", () => {
          it("should return name label", () => {
            const {
              unmatched: {
                labels: { name },
              },
            } = setupUnmatched();

            expect(name).toBe("I18N.BETSLIP.BET_UNMATCHED");
          });

          it("should return price label", () => {
            const {
              unmatched: {
                labels: { price },
              },
            } = setupUnmatched();

            expect(price).toBe("I18N.BETSLIP.ODDS");
          });

          it("should return stake label", () => {
            const {
              unmatched: {
                labels: { stake },
              },
            } = setupUnmatched();

            expect(stake).toBe("I18N.BETSLIP.STAKE");
          });

          it("should return cancel label", () => {
            const {
              unmatched: {
                labels: { cancel },
              },
            } = setupUnmatched();

            expect(cancel).toBe("I18N.BETSLIP.CANCEL_BET");
          });

          it("should return edit label", () => {
            const {
              unmatched: {
                labels: { confirm },
              },
            } = setupUnmatched();

            expect(confirm).toBe("I18N.BETSLIP.EDIT_BET");
          });

          it("should return profit label", () => {
            const {
              unmatched: {
                labels: { profit },
              },
            } = setupUnmatched();

            expect(profit).toBe("I18N.BETSLIP.PROFIT");
          });

          describe("liability label", () => {
            describe("when bet side is Back", () => {
              it("should return liability label", () => {
                const {
                  unmatched: {
                    labels: { liability },
                  },
                } = setupUnmatched();

                expect(liability).toBe("I18N.BETSLIP.LIABILITY");
              });
            });

            describe("when bet side is Lay", () => {
              it("should return liability label", () => {
                const {
                  unmatched: {
                    labels: { liability },
                  },
                } = setupUnmatched({
                  report: {
                    side: ExchangeSide.LAY,
                    unmatched: {},
                  },
                });

                expect(liability).toBe("I18N.BETSLIP.LIABILITY");
              });
            });
          });
        });

        describe("notifications", () => {
          describe("when hasFreeBets is false", () => {
            it("should return empty array", () => {
              const { unmatched } = setupUnmatched({ hasFreeBets: false });

              expect(unmatched.notifications).toEqual([]);
            });
          });

          describe("when hasFreeBets is true", () => {
            it("should return unable to edit bet with bonus notification", () => {
              const { unmatched } = setupUnmatched({ hasFreeBets: true });

              expect(unmatched.notifications).toEqual([
                {
                  detail: "I18N.BETSLIP.EXC.ERROR.SUBTITLE.UNABLE_TO_EDIT_BONUS_BET",
                  message: "I18N.BETSLIP.EXC.ERROR.UNABLE_TO_EDIT_BONUS_BET",
                  type: AlertType.Warning,
                },
              ]);
            });
          });
        });
      });
    });

    describe("cancelled", () => {
      describe("when the report doesn't have cancelled bets", () => {
        it("shouldn't return cancelled bets info", () => {
          const receipt = setupCancelled({
            report: {
              side: ExchangeSide.BACK,
            },
          });

          expect(receipt.unmatched).toBeUndefined();
        });
      });

      describe("when the report has cancelled bets", () => {
        describe("price", () => {
          describe("when bet side is Back", () => {
            it("should call roundDown", () => {
              setupCancelled();

              expect(roundDown).toHaveBeenCalledWith(10);
            });

            it("should return rounded down value", () => {
              const { unmatched } = setupCancelled();

              expect(unmatched.price).toBe("rounded down value");
            });
          });

          describe("when bet side is Lay", () => {
            it("should call roundDown", () => {
              setupCancelled({
                report: {
                  side: ExchangeSide.LAY,
                  cancelled: { price: 11 },
                },
              });

              expect(roundUp).toHaveBeenCalledWith(11);
            });

            it("should return rounded down value", () => {
              const { unmatched } = setupCancelled({
                report: {
                  side: ExchangeSide.LAY,
                  cancelled: { price: 11 },
                },
              });

              expect(unmatched.price).toBe("rounded up value");
            });
          });
        });

        describe("stake", () => {
          it("should call currencyFormatWithDecimalPlaces", () => {
            setupCancelled();

            expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
              mock: "userDetails",
              value: 20,
              decimalPlaces: 2,
            });
          });

          it("should return formatted stake", () => {
            const { unmatched } = setupCancelled();

            expect(unmatched.stake).toBe("formatted currency value");
          });
        });

        describe("profit", () => {
          describe("when bet side is Back", () => {
            it("should call currencyFormatWithDecimalPlaces", () => {
              setupCancelled();

              expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
                mock: "userDetails",
                value: 30,
                decimalPlaces: 2,
              });
            });

            it("should return formatted profit value", () => {
              const { unmatched } = setupCancelled();

              expect(unmatched.profit).toBe("formatted currency value");
            });
          });

          describe("when bet side is Lay", () => {
            it("should call currencyFormatWithDecimalPlaces", () => {
              setupCancelled({
                report: {
                  side: ExchangeSide.LAY,
                  cancelled: { profit: 30 },
                },
              });

              expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
                mock: "userDetails",
                value: 30,
                decimalPlaces: 2,
              });
            });

            it("should return formatted profit value", () => {
              const { unmatched } = setupCancelled({
                report: {
                  side: ExchangeSide.LAY,
                  cancelled: { profit: 30 },
                },
              });

              expect(unmatched.profit).toBe("formatted currency value");
            });
          });
        });

        describe("liability", () => {
          describe("when bet side is Back", () => {
            it("should return undefined liability", () => {
              const { unmatched } = setupCancelled();

              expect(unmatched.liability).toBeUndefined();
            });
          });

          describe("when bet side is Lay", () => {
            describe("when liability is positive", () => {
              it("should call currencyFormatWithDecimalPlaces", () => {
                setupCancelled({
                  report: {
                    side: ExchangeSide.LAY,
                    cancelled: { liability: 40 },
                  },
                });

                expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
                  mock: "userDetails",
                  value: 40,
                  decimalPlaces: 2,
                });
              });

              it("should return formatted liability value", () => {
                const { unmatched } = setupCancelled({
                  report: {
                    side: ExchangeSide.LAY,
                    cancelled: { liability: 40 },
                  },
                });

                expect(unmatched.liability).toBe("formatted currency value");
              });
            });

            describe("when liability is negative", () => {
              it("should call currencyFormatWithDecimalPlaces with zero value", () => {
                setupCancelled({
                  report: {
                    side: ExchangeSide.LAY,
                    cancelled: { liability: -40 },
                  },
                });

                expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
                  mock: "userDetails",
                  value: 0,
                  decimalPlaces: 2,
                });
              });

              it("should return formatted liability value", () => {
                const { unmatched } = setupCancelled({
                  report: {
                    side: ExchangeSide.LAY,
                    cancelled: { liability: -40 },
                  },
                });

                expect(unmatched.liability).toBe("formatted currency value");
              });
            });

            describe("when liability is undefined", () => {
              it("should return undefined liability", () => {
                const { unmatched } = setupCancelled({
                  report: {
                    side: ExchangeSide.LAY,
                    cancelled: { liability: undefined },
                  },
                });

                expect(unmatched.liability).toBeUndefined();
              });
            });
          });
        });

        describe("bonus", () => {
          describe("when hasFreeBets is false", () => {
            it("should return empty bonus", () => {
              const { unmatched } = setupCancelled({ hasFreeBets: false });

              expect(unmatched.bonus).toBe("");
            });
          });

          describe("when totalBonusUsed is not defined", () => {
            it("should return empty bonus", () => {
              const { unmatched } = setupCancelled({
                report: {
                  side: ExchangeSide.LAY,
                  cancelled: { totalBonusUsed: undefined },
                },
                hasFreeBets: true,
              });

              expect(unmatched.bonus).toBe("");
            });
          });

          describe("when hasFreeBets is true and totalBonusUsed is defined", () => {
            it("should call buildFreeBetsLabel", () => {
              setupCancelled({ hasFreeBets: true });

              expect(buildFreeBetsLabel).toHaveBeenCalledWith(
                "I18N.BETSLIP.CANCELLED_BONUS",
                { mock: "userDetails" },
                5,
              );
            });

            it("should return formatted bonus label", () => {
              const { unmatched } = setupCancelled({ hasFreeBets: true });

              expect(unmatched.bonus).toBe("formatted bonus label");
            });
          });
        });

        describe("hasFreeBets", () => {
          describe("when hasFreeBets is true", () => {
            it("should return true", () => {
              const { unmatched } = setupCancelled({ hasFreeBets: true });

              expect(unmatched.hasFreeBets).toBe(true);
            });
          });

          describe("when hasFreeBets is false", () => {
            it("should return false", () => {
              const { unmatched } = setupCancelled();

              expect(unmatched.hasFreeBets).toBe(false);
            });
          });
        });

        describe("labels", () => {
          describe("when the bet is cancelled", () => {
            it("should not return a name", () => {
              const {
                unmatched: {
                  labels: { name },
                },
              } = setupCancelled();

              expect(name).toBeUndefined();
            });
          });

          it("should return price label", () => {
            const {
              unmatched: {
                labels: { price },
              },
            } = setupCancelled();

            expect(price).toBe("I18N.BETSLIP.ODDS");
          });

          it("should return stake label", () => {
            const {
              unmatched: {
                labels: { stake },
              },
            } = setupCancelled();

            expect(stake).toBe("I18N.BETSLIP.STAKE");
          });

          it("should return profit label", () => {
            const {
              unmatched: {
                labels: { profit },
              },
            } = setupCancelled();

            expect(profit).toBe("I18N.BETSLIP.PROFIT");
          });

          describe("liability label", () => {
            describe("when bet side is Back", () => {
              it("should return liability label", () => {
                const {
                  unmatched: {
                    labels: { liability },
                  },
                } = setupCancelled();

                expect(liability).toBe("I18N.BETSLIP.LIABILITY");
              });
            });

            describe("when bet side is Lay", () => {
              it("should return liability label", () => {
                const {
                  unmatched: {
                    labels: { liability },
                  },
                } = setupCancelled({
                  report: {
                    side: ExchangeSide.LAY,
                    cancelled: {},
                  },
                });

                expect(liability).toBe("I18N.BETSLIP.LIABILITY");
              });
            });
          });
        });

        describe("notifications", () => {
          it("should return bet cancelled notification", () => {
            const { unmatched } = setupCancelled({ hasFreeBets: true });

            expect(unmatched.notifications).toEqual([
              {
                detail: "I18N.BETSLIP.EXC.ERROR.SUBTITLE.UNABLE_TO_EDIT_BONUS_BET",
                message: "I18N.BETSLIP.EXC.ERROR.UNABLE_TO_EDIT_BONUS_BET",
                type: AlertType.Warning,
              },
            ]);
          });
        });

        describe("mode", () => {
          it("should return mode as `undefined`", () => {
            const { unmatched } = setupCancelled();

            expect(unmatched.mode).toBeUndefined();
          });
        });
      });
    });
  });
});
