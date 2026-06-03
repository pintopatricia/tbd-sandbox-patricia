import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { EntityType } from "@ppb/tbd-urn-codecs";
import {
  CASHOUT__RESET_CONFIRMATION_STEP,
  NETWORK__CASHOUT_TAKE,
  UI__CASHOUT_BUTTON_TAP,
} from "@ppb/tbd-store/actions/cashout";
import { CashoutStep } from "@ppb/tbd-store/state/constants";
import { makeMapStateToProps, makeMapDispatchToProps } from "./map-to-props-factory";
import {
  getEmptyCashoutViewModel,
  getExchangeCashoutViewModel,
  getSportsbookCashoutViewModel,
} from "./cashout-view-model";

const excCashoutURN = `${EntityType.ExchangeCashoutQuote}:SOMETHING`;
const sbkCashoutURN = `${EntityType.SportsbookCashoutQuote}:SOMETHING`;

const excQuote = {
  marketURN: "marketURN",
  marketBetURN: "marketBetURN",
};

const getExchangeCashoutQuoteByURN = jest.fn(() => excQuote);
const getExchangeMarketByURN = jest.fn(() => "EXC_MARKET");
const getExchangeMarketBetByURN = jest.fn(() => "EXC_MARKET_BET");
const getSportsbookCashoutQuoteByURN = jest.fn(() => "SBK_QUOTE");
const getUserPreferencesWithProductSwitcher = jest.fn(() => ({
  confirmCashout: "confirmCashout",
}));

const getThrottle = jest.fn(() => ({ isActive: true }));

jest.mock("@ppb/tbd-store", () => ({
  createGetThrottleSelector: jest.fn(() => getThrottle),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/tbd-store/state/betting/exchange-cashouts/exchange-cashout-selectors", () => ({
  createExchangeCashoutQuoteSelector: jest.fn(() => getExchangeCashoutQuoteByURN),
}));

jest.mock("@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors", () => ({
  createExchangeMarketSelector: jest.fn(() => getExchangeMarketByURN),
}));

jest.mock("@ppb/tbd-store/state/betting/exchange-market-bets/exchange-market-bets-selectors", () => ({
  createExchangeMarketBetSelector: jest.fn(() => getExchangeMarketBetByURN),
}));

jest.mock("@ppb/tbd-store/state/betting/sportsbook-cashouts/sportsbook-cashout-selectors", () => ({
  createSportsbookCashoutQuoteSelector: jest.fn(() => getSportsbookCashoutQuoteByURN),
}));

jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  createUserPreferencesWithProductSwitcherSelector: jest.fn(() => getUserPreferencesWithProductSwitcher),
}));

const USER_DETAILS = { jurisdiction: { jurisdiction: "INTERNATIONAL" } };

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => USER_DETAILS),
}));

jest.mock("./cashout-view-model", () => ({
  getEmptyCashoutViewModel: jest.fn(() => "EMPTY_CASHOUT_VIEW_MODEL"),
  getExchangeCashoutViewModel: jest.fn(() => "EXC_CASHOUT_VIEW_MODEL"),
  getSportsbookCashoutViewModel: jest.fn(() => "SBK_CASHOUT_VIEW_MODEL"),
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

const STATE = {
  betting: {
    exchangecashouts: "exchangecashouts_ENTITY",
    exchangemarketbets: "exchangemarketbets_ENTITY",
    sportsbookcashouts: "sportsbookcashouts_ENTITY",
  },
  entities: {
    exchangemarkets: "exchangemarkets_ENTITY",
    preferences: "preferences",
    throttles: "throttles",
  },
};

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  const setupMakeMapStateToProps = ({ state = STATE, ownProps = { cashoutURN: undefined } } = {}) =>
    makeMapStateToProps()(state, ownProps);

  describe("when cashoutURN is defined", () => {
    describe("when `getUserDetails` throws", () => {
      const GET_USER_DETAILS_ERROR = "GET_USER_DETAILS_ERROR";

      it("should call console.error with the error thrown from `getUserDetails`", () => {
        getUserDetails.mockImplementationOnce(() => {
          throw new Error(GET_USER_DETAILS_ERROR);
        });
        setupMakeMapStateToProps({ ownProps: { cashoutURN: excCashoutURN } });

        expect(global.console.error).toHaveBeenCalledWith(new Error("GET_USER_DETAILS_ERROR"));
      });

      it("should return an empty object", () => {
        getUserDetails.mockImplementationOnce(() => {
          throw new Error(GET_USER_DETAILS_ERROR);
        });
        const props = setupMakeMapStateToProps({ ownProps: { cashoutURN: excCashoutURN } });

        expect(props).toEqual({});
      });
    });

    describe("when `getUserDetails` does not throw", () => {
      describe("when cashoutURN EntityType is ExchangeCashoutQuote", () => {
        describe("and there is no quote", () => {
          const setupWithoutExchangeCashoutQuote = () => {
            getExchangeCashoutQuoteByURN.mockReturnValueOnce(undefined);
            return setupMakeMapStateToProps({ ownProps: { cashoutURN: excCashoutURN } });
          };

          it("should not call getThrottle", () => {
            setupWithoutExchangeCashoutQuote();
            expect(getThrottle).not.toHaveBeenCalled();
          });

          it("should get confirmCashout preference", () => {
            setupWithoutExchangeCashoutQuote();
            expect(getUserPreferencesWithProductSwitcher).toHaveBeenCalledWith("preferences");
          });

          it("should get userDetails", () => {
            setupWithoutExchangeCashoutQuote();
            expect(getUserDetails).toHaveBeenCalledWith(STATE);
          });

          it("should try to get the quote", () => {
            setupWithoutExchangeCashoutQuote();
            expect(getExchangeCashoutQuoteByURN).toHaveBeenCalledWith(STATE.betting.exchangecashouts, excCashoutURN);
          });

          it("should call the getEmptyCashoutViewModel function", () => {
            setupWithoutExchangeCashoutQuote();
            expect(getEmptyCashoutViewModel).toHaveBeenCalled();
          });

          it("should return a empty view model", () => {
            const props = setupWithoutExchangeCashoutQuote();
            expect(props).toEqual("EMPTY_CASHOUT_VIEW_MODEL");
          });
        });

        describe("and the quote exists", () => {
          describe('and the step is not "HIDE"', () => {
            it("should not call getThrottle", () => {
              setupMakeMapStateToProps({ ownProps: { cashoutURN: excCashoutURN } });
              expect(getThrottle).not.toHaveBeenCalled();
            });

            it("should get confirmCashout preference", () => {
              setupMakeMapStateToProps({ ownProps: { cashoutURN: excCashoutURN } });
              expect(getUserPreferencesWithProductSwitcher).toHaveBeenCalledWith("preferences");
            });

            it("should get userDetails", () => {
              setupMakeMapStateToProps({ ownProps: { cashoutURN: excCashoutURN } });
              expect(getUserDetails).toHaveBeenCalledWith(STATE);
            });

            it("should try to get the quote", () => {
              setupMakeMapStateToProps({ ownProps: { cashoutURN: excCashoutURN } });
              expect(getExchangeCashoutQuoteByURN).toHaveBeenCalledWith(STATE.betting.exchangecashouts, excCashoutURN);
            });

            it("should get the associated market entity", () => {
              setupMakeMapStateToProps({ ownProps: { cashoutURN: excCashoutURN } });
              expect(getExchangeMarketByURN).toHaveBeenCalledWith(STATE.entities.exchangemarkets, excQuote.marketURN);
            });

            it("should get the associated marketBet entity", () => {
              setupMakeMapStateToProps({ ownProps: { cashoutURN: excCashoutURN } });
              expect(getExchangeMarketBetByURN).toHaveBeenCalledWith(STATE, excQuote.marketBetURN);
            });

            it("should call the getExchangeCashoutViewModel function", () => {
              setupMakeMapStateToProps({ ownProps: { cashoutURN: excCashoutURN } });
              expect(getExchangeCashoutViewModel).toHaveBeenCalledWith(
                excCashoutURN,
                "confirmCashout",
                USER_DETAILS,
                excQuote,
                "EXC_MARKET",
                "EXC_MARKET_BET",
              );
            });

            it("should return the exchange cashout button view model", () => {
              const props = setupMakeMapStateToProps({ ownProps: { cashoutURN: excCashoutURN } });
              expect(props).toEqual("EXC_CASHOUT_VIEW_MODEL");
            });

            describe("confirmCashout", () => {
              describe("when it is 'BRAZIL' jurisdiction", () => {
                it("should return true", () => {
                  getUserDetails.mockReturnValueOnce({ jurisdiction: { jurisdiction: "BRAZIL" } });
                  setupMakeMapStateToProps({ ownProps: { cashoutURN: excCashoutURN } });

                  expect(getExchangeCashoutViewModel).toHaveBeenCalledTimes(1);
                  expect(getExchangeCashoutViewModel).toHaveBeenCalledWith(
                    "ppb:excCashoutQuote:SOMETHING",
                    true,
                    { jurisdiction: { jurisdiction: "BRAZIL" } },
                    { marketBetURN: "marketBetURN", marketURN: "marketURN" },
                    "EXC_MARKET",
                    "EXC_MARKET_BET",
                  );
                });
              });

              describe("when it is other jurisdiction", () => {
                it("should fallback to the user preferences ", () => {
                  getUserDetails.mockReturnValueOnce({ jurisdiction: { jurisdiction: "INTERNATIONAL" } });
                  setupMakeMapStateToProps({ ownProps: { cashoutURN: excCashoutURN } });

                  expect(getExchangeCashoutViewModel).toHaveBeenCalledTimes(1);
                  expect(getExchangeCashoutViewModel).toHaveBeenCalledWith(
                    "ppb:excCashoutQuote:SOMETHING",
                    "confirmCashout",
                    { jurisdiction: { jurisdiction: "INTERNATIONAL" } },
                    { marketBetURN: "marketBetURN", marketURN: "marketURN" },
                    "EXC_MARKET",
                    "EXC_MARKET_BET",
                  );
                });
              });
            });
          });

          describe('and the step is "HIDE"', () => {
            it("should call the getEmptyCashoutViewModel function", () => {
              getExchangeCashoutQuoteByURN.mockReturnValueOnce({ ...excQuote, step: CashoutStep.HIDE });
              setupMakeMapStateToProps({ ownProps: { cashoutURN: excCashoutURN } });

              expect(getEmptyCashoutViewModel).toHaveBeenCalled();
            });

            it("should return a empty view model", () => {
              getExchangeCashoutQuoteByURN.mockReturnValueOnce({ ...excQuote, step: CashoutStep.HIDE });
              const props = setupMakeMapStateToProps({ ownProps: { cashoutURN: excCashoutURN } });

              expect(props).toEqual("EMPTY_CASHOUT_VIEW_MODEL");
            });
          });
        });
      });

      describe("when cashoutURN EntityType is SportsbookCashoutQuote", () => {
        describe("and there is no quote", () => {
          const setupWithoutSportsbookCashoutQuote = () => {
            getSportsbookCashoutQuoteByURN.mockReturnValueOnce(undefined);
            return setupMakeMapStateToProps({ ownProps: { cashoutURN: sbkCashoutURN } });
          };

          it("should not call getThrottle", () => {
            setupWithoutSportsbookCashoutQuote();
            expect(getThrottle).not.toHaveBeenCalled();
          });

          it("should get confirmCashout preference", () => {
            setupWithoutSportsbookCashoutQuote();
            expect(getUserPreferencesWithProductSwitcher).toHaveBeenCalledWith("preferences");
          });

          it("should get userDetails", () => {
            setupWithoutSportsbookCashoutQuote();
            expect(getUserDetails).toHaveBeenCalledWith(STATE);
          });

          it("should try to get the quote", () => {
            setupWithoutSportsbookCashoutQuote();
            expect(getSportsbookCashoutQuoteByURN).toHaveBeenCalledWith(
              STATE.betting.sportsbookcashouts,
              sbkCashoutURN,
            );
          });

          it("should call the getEmptyCashoutViewModel function", () => {
            setupWithoutSportsbookCashoutQuote();
            expect(getEmptyCashoutViewModel).toHaveBeenCalled();
          });

          it("should return a empty view model", () => {
            const props = setupWithoutSportsbookCashoutQuote();
            expect(props).toEqual("EMPTY_CASHOUT_VIEW_MODEL");
          });
        });

        describe("and the quote exists", () => {
          describe('and the step is not "HIDE"', () => {
            it("should call getThrottle", () => {
              setupMakeMapStateToProps({ ownProps: { cashoutURN: sbkCashoutURN } });
              expect(getThrottle).toHaveBeenCalledWith(STATE.entities.throttles, "CASHOUT_SUSPENSION_REASONS");
            });

            it("should get confirmCashout preference", () => {
              setupMakeMapStateToProps({ ownProps: { cashoutURN: sbkCashoutURN } });
              expect(getUserPreferencesWithProductSwitcher).toHaveBeenCalledWith("preferences");
            });

            it("should get userDetails", () => {
              setupMakeMapStateToProps({ ownProps: { cashoutURN: sbkCashoutURN } });
              expect(getUserDetails).toHaveBeenCalledWith(STATE);
            });

            it("should try to get the quote", () => {
              setupMakeMapStateToProps({ ownProps: { cashoutURN: sbkCashoutURN } });
              expect(getSportsbookCashoutQuoteByURN).toHaveBeenCalledWith(
                STATE.betting.sportsbookcashouts,
                sbkCashoutURN,
              );
            });

            it("should call the getSportsbookCashoutViewModel function", () => {
              setupMakeMapStateToProps({ ownProps: { cashoutURN: sbkCashoutURN } });
              expect(getSportsbookCashoutViewModel).toHaveBeenCalledWith(
                sbkCashoutURN,
                "confirmCashout",
                USER_DETAILS,
                "SBK_QUOTE",
                true,
              );
            });

            it("should return the sportsbook cashout button view model", () => {
              const props = setupMakeMapStateToProps({ ownProps: { cashoutURN: sbkCashoutURN } });
              expect(props).toEqual("SBK_CASHOUT_VIEW_MODEL");
            });

            describe("confirmCashout", () => {
              describe("when it is 'BRAZIL' jurisdiction", () => {
                it("should return true", () => {
                  getUserDetails.mockReturnValueOnce({ jurisdiction: { jurisdiction: "BRAZIL" } });
                  setupMakeMapStateToProps({ ownProps: { cashoutURN: sbkCashoutURN } });

                  expect(getSportsbookCashoutViewModel).toHaveBeenCalledTimes(1);
                  expect(getSportsbookCashoutViewModel).toHaveBeenCalledWith(
                    sbkCashoutURN,
                    true,
                    { jurisdiction: { jurisdiction: "BRAZIL" } },
                    "SBK_QUOTE",
                    true,
                  );
                });
              });

              describe("when it is other jurisdiction", () => {
                it("should fallback to the user preferences ", () => {
                  getUserDetails.mockReturnValueOnce({ jurisdiction: { jurisdiction: "INTERNATIONAL" } });
                  setupMakeMapStateToProps({ ownProps: { cashoutURN: sbkCashoutURN } });

                  expect(getSportsbookCashoutViewModel).toHaveBeenCalledTimes(1);
                  expect(getSportsbookCashoutViewModel).toHaveBeenCalledWith(
                    sbkCashoutURN,
                    "confirmCashout",
                    USER_DETAILS,
                    "SBK_QUOTE",
                    true,
                  );
                });
              });
            });
          });

          describe('and the step is "HIDE"', () => {
            it("should call the getEmptyCashoutViewModel function", () => {
              getSportsbookCashoutQuoteByURN.mockReturnValueOnce({ step: CashoutStep.HIDE });
              setupMakeMapStateToProps({ ownProps: { cashoutURN: sbkCashoutURN } });

              expect(getEmptyCashoutViewModel).toHaveBeenCalled();
            });

            it("should return a empty view model", () => {
              getSportsbookCashoutQuoteByURN.mockReturnValueOnce({ step: CashoutStep.HIDE });
              const props = setupMakeMapStateToProps({ ownProps: { cashoutURN: sbkCashoutURN } });
              expect(props).toEqual("EMPTY_CASHOUT_VIEW_MODEL");
            });
          });
        });
      });
    });

    describe("when cashoutURN is not defined", () => {
      it("should call the correct view model function", () => {
        setupMakeMapStateToProps({ state: {} });
        expect(getEmptyCashoutViewModel).toHaveBeenCalled();
      });

      it("should return a empty view model", () => {
        const props = setupMakeMapStateToProps({ state: {} });
        expect(props).toEqual("EMPTY_CASHOUT_VIEW_MODEL");
      });
    });
  });
});

describe("makeMapDispatchToProps", () => {
  const setupMakeMapDispatchToProps = ({ dispatch = jest.fn() } = {}) => makeMapDispatchToProps(dispatch);

  describe("dispatchCashoutTap", () => {
    describe("when confirmCashout is true", () => {
      it("should call dispatch with UI__CASHOUT_BUTTON_TAP", () => {
        const dispatch = jest.fn();
        const { dispatchCashoutTap } = setupMakeMapDispatchToProps({ dispatch });

        dispatchCashoutTap("ppb:excCashoutQuote:1.23/0", true);

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenNthCalledWith(1, {
          type: UI__CASHOUT_BUTTON_TAP,
          payload: {
            cashoutUrn: "ppb:excCashoutQuote:1.23/0",
            confirmCashout: true,
          },
        });
      });
    });

    describe("when confirmCashout is false", () => {
      it("should call dispatch with UI__CASHOUT_BUTTON_TAP and UI__CASHOUT_BUTTON_TAP_AUTO_CONFIRM", () => {
        const dispatch = jest.fn();
        const { dispatchCashoutTap } = setupMakeMapDispatchToProps({ dispatch });

        dispatchCashoutTap("ppb:excCashoutQuote:1.23/0", false);

        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenNthCalledWith(1, {
          type: UI__CASHOUT_BUTTON_TAP,
          payload: {
            cashoutUrn: "ppb:excCashoutQuote:1.23/0",
            confirmCashout: false,
          },
        });
        expect(dispatch).toHaveBeenNthCalledWith(2, {
          type: "UI/CASHOUT_BUTTON_TAP_AUTO_CONFIRM",
          payload: { cashoutUrn: "ppb:excCashoutQuote:1.23/0" },
        });
      });
    });
  });

  describe("dispatchCashoutTransaction", () => {
    it("should call dispatch NETWORK__CASHOUT_TAKE", () => {
      const dispatch = jest.fn();
      const { dispatchCashoutTransaction } = setupMakeMapDispatchToProps({ dispatch });

      dispatchCashoutTransaction("ppb:excCashoutQuote:1.23/0");

      expect(dispatch).toHaveBeenCalledWith({
        type: NETWORK__CASHOUT_TAKE,
        payload: {
          cashoutUrn: "ppb:excCashoutQuote:1.23/0",
        },
      });
    });
  });

  describe("dispatchUndoConfirm", () => {
    it("should call dispatch CASHOUT__RESET_CONFIRMATION_STEP", () => {
      const dispatch = jest.fn();
      const { dispatchUndoConfirm } = setupMakeMapDispatchToProps({ dispatch });

      dispatchUndoConfirm("ppb:excCashoutQuote:1.23/0");

      expect(dispatch).toHaveBeenCalledWith({
        type: CASHOUT__RESET_CONFIRMATION_STEP,
        payload: {
          cashoutUrn: "ppb:excCashoutQuote:1.23/0",
        },
      });
    });
  });
});
