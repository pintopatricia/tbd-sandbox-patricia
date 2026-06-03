import {
  UI__BETSLIP_EXC_BONUS_CHANGE,
  UI__BETSLIP_EXC_INCREMENT_SIZE_ACTION,
  UI__BETSLIP_EXC_PLACE_BET_CLICK,
  UI__BETSLIP_EXC_PRICE_INPUT_BLUR,
  UI__BETSLIP_EXC_PRICE_INPUT_CHANGE,
  UI__BETSLIP_EXC_PRICE_NUDGE_DOWN,
  UI__BETSLIP_EXC_PRICE_NUDGE_UP,
  UI__BETSLIP_EXC_REMOVE_POTENTIAL_BET_CLICK,
  UI__BETSLIP_EXC_SIZE_INPUT_CHANGE,
  UI__BETSLIP_CLOSE_CLICK,
  UI__BETSLIP_EXC_LOGIN_TO_PLACE_BET_CLICK,
  UI__BETSLIP_EXC_PLACE_BET_CLICK_AUTO_CONFIRM,
} from "@ppb/tbd-store/actions/betslip";
import { EXTERNAL_PUSH, PUSH } from "@ppb/tbd-store/actions/router";
import {
  BETTING__EXC_INCREMENT_SIZE_ACTION,
  BETTING__NUDGE_DOWN_POTENTIAL_BET_ACTION,
  BETTING__NUDGE_UP_POTENTIAL_BET_ACTION,
  BETTING__REMOVE_POTENTIAL_BET_ACTION,
  BETTING__UPDATE_POTENTIAL_BET_ACTION,
  BETTING__BONUS_TOGGLE_BET_ACTION,
  BETTING__EXC_PLACE_BETS,
  BETTING__DEPOSIT_TO_PLACE_BET,
  BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION,
} from "@ppb/tbd-store/actions/betting";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { getBetslipExchangeContext } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import {
  getExchangeRunnerTree,
  createExcRunnerPotentialBetsByRunnerURNSelector,
} from "@ppb/tbd-store/state/entities/entities-selectors";
import {
  getExchangeEligibleBonusByMarketId,
  getRunnerPotentialBetWithBonus,
} from "@ppb/tbd-store/state/betting/exchange-betting-bonus/exchange-betting-bonus-selectors";
import { ExchangeMarketStatus } from "@ppb/tbd-store/state/entities/exchange-markets/ExchangeMarket.types";
import { getExchangePotentialState } from "@ppb/tbd-store/state/betting/exchange-betting-potential/exchange-betting-potential-selectors";
import { Product } from "@ppb/tbd-store/state/entities";

import { ExchangeSide } from "@ppb/tbd-store/state/constants";
import {
  buildMarketError,
  buildPlaceError,
  buildPriceError,
  buildSizeError,
  buildQuickStakesSelector,
} from "../betslip-mapper";
import { buildFreeBetsLabel, getBetData } from "../betslip-formatters";
import { getCurrencySymbol } from "../../../formatters/currency-formatters";
import { getInlineBetslipTitle } from "../../../helpers/exchange-betslip-title-helper";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({ getUserDetails: jest.fn() }));

jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getBetslipExchangeContext: jest.fn(),
}));

const getUserPreferencesWithProductSwitcher = jest.fn();
jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  createUserPreferencesWithProductSwitcherSelector: jest.fn(() => getUserPreferencesWithProductSwitcher),
}));

jest.mock("@ppb/tbd-store/state/entities/entities-selectors", () => ({
  getExchangeRunnerTree: jest.fn(),
  createExcRunnerPotentialBetsByRunnerURNSelector: jest.fn(() => jest.fn()),
}));

jest.mock("@ppb/tbd-store/state/betting/exchange-betting-potential/exchange-betting-potential-selectors");

jest.mock("@ppb/tbd-store/state/betting/exchange-betting-bonus/exchange-betting-bonus-selectors", () => ({
  getExchangeEligibleBonusByMarketId: jest.fn(),
  getRunnerPotentialBetWithBonus: jest.fn(),
}));

jest.mock("../../../formatters/currency-formatters", () => ({
  getCurrencySymbol: jest.fn(),
}));

jest.mock("../../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

jest.mock("../betslip-mapper", () => ({
  buildQuickStakesSelector: jest.fn(),
  buildMarketError: jest.fn(),
  buildPlaceError: jest.fn(),
  buildPriceError: jest.fn(),
  buildSizeError: jest.fn(),
}));

jest.mock("../betslip-formatters", () => ({
  getBetData: jest.fn(),
  buildFreeBetsLabel: jest.fn(),
}));
jest.mock("../../../helpers/exchange-betslip-title-helper", () => ({
  getInlineBetslipTitle: jest.fn(),
}));

jest.fn("@ppb/tbd-store/state/betting/exchange-betting-potential/exchange-betting-potential-selectors", () => ({
  getExchangePotentialState: jest.fn(),
}));

jest.fn("@ppb/tbd-store/middlewares/exchange-betting-selectors", () => ({
  mapBetEngineSideToExchangeSide: jest.fn(),
}));

jest.mock("../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

beforeEach(jest.clearAllMocks);
beforeEach(() => {
  getInlineBetslipTitle.mockReturnValue("inline title");
});

describe("makeMapStateToProps", () => {
  const BASE_VM = {
    pricePlaceholder: "I18N.BETSLIP.ODDS",
    sizePlaceholder: "I18N.BETSLIP.STAKE",
    loadingLabel: "I18N.BETSLIP.PLACING_BET",
    title: "",
    placeBtnLabel: "I18N.BETSLIP.PLACE_BET",
    isDepositRequired: false,
    isLoggedIn: false,
  };

  function setupMockState(betslip = {}) {
    return { betslip, entities: { preferences: {} } };
  }

  describe("when `getUserDetails` throws", () => {
    it("should call console.error with the error thrown from `getUserDetails`", () => {
      getUserDetails.mockImplementationOnce(() => {
        throw new Error("GET_USER_DETAILS_ERROR");
      });
      const mockState = setupMockState();

      makeMapStateToProps()(mockState);

      expect(consoleErrorSpy).toHaveBeenCalledWith(new Error("GET_USER_DETAILS_ERROR"));
    });

    it("should return the base state", () => {
      getUserDetails.mockImplementationOnce(() => {
        throw new Error("GET_USER_DETAILS_ERROR");
      });

      const mockState = setupMockState();

      expect(makeMapStateToProps()(mockState)).toEqual(BASE_VM);
    });
  });

  it("should retrieve user details", () => {
    const mockState = setupMockState();

    getUserDetails.mockReturnValue({ userDetail: "detailsPls" });
    makeMapStateToProps()(mockState);

    expect(getUserDetails).toHaveBeenCalledWith(mockState);
  });

  describe("when the betslip on appState is null", () => {
    it("should return empty object", () => {
      const mockState = setupMockState(null);

      expect(makeMapStateToProps()(mockState)).toEqual({});
    });
  });

  describe("when there is no betslip context", () => {
    it("should return the base state", () => {
      const mockState = setupMockState();
      getBetslipExchangeContext.mockReturnValue(undefined);

      expect(makeMapStateToProps()(mockState)).toEqual(BASE_VM);
    });
  });

  describe("when there are no potential bets", () => {
    it("should return the base state", () => {
      const mockState = setupMockState();
      getBetslipExchangeContext.mockReturnValue({ context: "betslip" });
      createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => []);

      expect(makeMapStateToProps()(mockState)).toEqual(BASE_VM);
    });
  });

  describe("when the runner tree cannot be resolved", () => {
    it("should return the base state", () => {
      createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => [{ a: "a" }]);
      getExchangeRunnerTree.mockReturnValue(null);

      const mockState = setupMockState([{ side: ExchangeSide.BACK }]);

      expect(makeMapStateToProps()(mockState)).toEqual(BASE_VM);
    });
  });

  describe("when there is all data for mapping the props", () => {
    function setupAllData({
      placeError,
      marketStatus = ExchangeMarketStatus.Open,
      potentialState = {},
      isFreeBetsSelected = false,
      eligibleBonus = 0,
      potentialBet = {
        size: 10.1,
        price: 15.15,
        side: "BACK",
      },
      userDetails = { userDetail: "detailsPls" },
    } = {}) {
      getUserDetails.mockReturnValue(userDetails);
      getCurrencySymbol.mockReturnValue("currencySymbol");
      getBetslipExchangeContext.mockReturnValue({ side: ExchangeSide.BACK });
      createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => [potentialBet]);
      getBetData.mockReturnValue({
        label: "Profit:",
        value: "111",
        rawValue: 111,
      });
      getUserPreferencesWithProductSwitcher.mockReturnValue({
        quickStakes: "QuickStakes",
        exchangeConfirmBetPlacement: true,
      });
      buildQuickStakesSelector.mockImplementation(() => jest.fn(() => [{ stake: 10.12, displayStake: "+10.12" }]));
      getExchangeRunnerTree.mockReturnValue({
        runner: {
          urn: "runner:urn",
          selectionId: "selectionId",
        },
        marketRunner: {},
        market: {
          betDelay: 1,
          status: marketStatus,
          marketId: "marketId",
          marketType: "marketType",
          bettingType: "bettingType",
        },
        event: {},
      });
      getExchangePotentialState.mockReturnValue(potentialState);
      getExchangeEligibleBonusByMarketId.mockReturnValue(eligibleBonus);
      buildFreeBetsLabel.mockReturnValue("freeBetsLabel");
      getRunnerPotentialBetWithBonus.mockReturnValue({});
      buildMarketError.mockReturnValue("buildMarketError mock");
      buildPlaceError.mockReturnValue("buildPlaceError mock");
      buildPriceError.mockReturnValue("buildPriceError mock");
      buildSizeError.mockReturnValue("buildSizeError mock");

      const mockState = setupMockState({ exchangePlaceError: placeError, isFreeBetsSelected });

      return makeMapStateToProps()(mockState);
    }

    it("should call getExchangeEligibleBonusByMarketId", () => {
      setupAllData();
      const appState = setupMockState({ exchangePlaceError: undefined, isFreeBetsSelected: false });

      expect(getExchangeEligibleBonusByMarketId).toHaveBeenCalledWith(
        appState,
        "marketId",
        "selectionId",
        "marketType",
        "bettingType",
      );
      expect(getExchangeEligibleBonusByMarketId).toHaveBeenCalledTimes(1);
    });

    describe("when freebets is available", () => {
      describe("and the user has bonus money", () => {
        it("should call getExchangeEligibleBonusByMarketId", () => {
          setupAllData({ eligibleBonus: 10 });
          const appState = setupMockState({ exchangePlaceError: undefined, isFreeBetsSelected: false });
          expect(getExchangeEligibleBonusByMarketId).toHaveBeenCalledTimes(1);
          expect(getExchangeEligibleBonusByMarketId).toHaveBeenCalledWith(
            appState,
            "marketId",
            "selectionId",
            "marketType",
            "bettingType",
          );
        });

        describe("and the selection side is Lay", () => {
          it("should have the respective label id", () => {
            setupAllData({
              eligibleBonus: 10,
              potentialBet: {
                size: 10.1,
                price: 15.15,
                side: "LAY",
              },
            });

            expect(buildFreeBetsLabel).toHaveBeenCalledTimes(1);
            expect(buildFreeBetsLabel).toHaveBeenCalledWith(
              "I18N.BETSLIP.USE_ELIGIBLE_BONUS_LAY",
              { userDetail: "detailsPls" },
              10,
            );
          });
        });
        describe("and the selection side is Back", () => {
          it("should have the respective label id", () => {
            setupAllData({ eligibleBonus: 10 });

            expect(buildFreeBetsLabel).toHaveBeenCalledTimes(1);
            expect(buildFreeBetsLabel).toHaveBeenCalledWith(
              "I18N.BETSLIP.USE_FREE_BET_BALANCE",
              { userDetail: "detailsPls" },
              10,
            );
          });
        });

        describe("when not using bonus", () => {
          it("should use the potentialBet to build profitLabel", () => {
            setupAllData({ isFreeBetsSelected: false, eligibleBonus: 5 });

            expect(getBetData).toHaveBeenCalledTimes(1);
            expect(getBetData).toHaveBeenCalledWith(
              {
                size: 10.1,
                price: 15.15,
                side: ExchangeSide.BACK,
              },
              {
                userDetail: "detailsPls",
              },
              false,
            );

            expect(getRunnerPotentialBetWithBonus).toHaveBeenCalledTimes(0);
          });
        });

        describe("when using the bonus", () => {
          it("should use the potentialBetWithBonus to build profitLabel", () => {
            setupAllData({
              eligibleBonus: 10,
              isFreeBetsSelected: true,
            });
            const appState = setupMockState({ exchangePlaceError: undefined, isFreeBetsSelected: true });

            expect(getRunnerPotentialBetWithBonus).toHaveBeenCalledTimes(1);
            expect(getRunnerPotentialBetWithBonus).toHaveBeenCalledWith(
              appState,
              {
                urn: "runner:urn",
                selectionId: "selectionId",
              },
              "marketId",
              "marketType",
              "bettingType",
            );

            expect(getBetData).toHaveBeenCalledTimes(1);
            expect(getBetData).toHaveBeenCalledWith(
              {
                side: ExchangeSide.BACK,
              },
              {
                userDetail: "detailsPls",
              },
              false,
            );
          });

          it("should have the freeBetsLabel defined", () => {
            const setup = setupAllData({
              eligibleBonus: 10,
              isFreeBetsSelected: true,
            });

            expect(setup.freeBetsLabel).toBe("freeBetsLabel");
          });
        });
      });

      describe("and the user doesn't have bonus money", () => {
        it("should not set the freebets label", () => {
          const setup = setupAllData({ eligibleBonus: 0 });

          expect(setup.freeBetsLabel).toBe(undefined);
        });
      });
    });

    it("should return a mapped out view model from state", () => {
      expect(setupAllData()).toEqual({
        ...BASE_VM,
        betDelay: 1,
        currencySymbol: "currencySymbol",
        placeError: "buildPlaceError mock",
        priceError: "buildPriceError mock",
        sizeError: "buildSizeError mock",
        marketError: "buildMarketError mock",
        price: 15.15,
        profitLabel: "Profit:",
        profitValue: "111",
        profitRawValue: 111,
        runner: "runner:urn",
        isPlacing: false,
        prefersConfirm: true,
        quickStakes: [
          {
            displayStake: "+10.12",
            stake: 10.12,
          },
        ],
        size: 10.1,
        eligibleBonus: 0,
        freeBetsLabel: undefined,
        loadingLabel: "",
        isLoggedIn: undefined,
        placeBtnLabel: "I18N.BETSLIP.LOGIN_PLACE_BET",
        hasFreeBets: false,
        isFreeBetsSelected: false,
        isDepositRequired: false,
        side: ExchangeSide.BACK,
        titlePrefix: "I18N.BETSLIP.BACK_BET_FOR",
        title: "inline title",
      });
    });

    describe("notifications", () => {
      it("should call buildMarketError", () => {
        setupAllData();

        expect(buildMarketError).toHaveBeenCalledWith(ExchangeMarketStatus.Open);
      });

      it("should call buildPlaceError", () => {
        setupAllData({ placeError: "some error" });

        expect(buildPlaceError).toHaveBeenCalledWith(ExchangeMarketStatus.Open, "some error", "currencySymbol");
      });

      it("should call buildPriceError", () => {
        setupAllData({
          potentialState: {
            priceValidation: "somePriceValidation",
            price: 1.23,
          },
        });

        expect(buildPriceError).toHaveBeenCalledWith(ExchangeMarketStatus.Open, "somePriceValidation", 1.23);
      });

      it("should call buildSizeError", () => {
        setupAllData({
          potentialState: {
            sizeValidation: "someSizeValidation",
          },
        });

        expect(buildSizeError).toHaveBeenCalledWith(
          ExchangeMarketStatus.Open,
          { userDetail: "detailsPls" },
          "someSizeValidation",
        );
      });
    });

    describe("isDepositRequired", () => {
      describe("when there is no INSUFFICIENT_FUNDS error", () => {
        it("should return false", () => {
          const { isDepositRequired } = setupAllData({
            placeError: { errorCode: "X" },
          });

          expect(isDepositRequired).toEqual(false);
        });
      });

      describe("when there is an INSUFFICIENT_FUNDS error", () => {
        it("should return true", () => {
          const { isDepositRequired } = setupAllData({
            placeError: { errorCode: "INSUFFICIENT_FUNDS" },
          });

          expect(isDepositRequired).toEqual(true);
        });
      });
    });

    describe("placeBtnLabel", () => {
      describe("when logged in", () => {
        describe("when isDepositRequired is true", () => {
          it("should return deposit to place bet label", () => {
            const { placeBtnLabel } = setupAllData({
              placeError: { errorCode: "INSUFFICIENT_FUNDS" },
              userDetails: { loggedIn: true },
            });

            expect(placeBtnLabel).toBe("I18N.BETSLIP.DEPOSIT_TO_PLACE_BET");
          });
        });

        describe("when isDepositRequired is false", () => {
          it("should return place bet label", () => {
            const { placeBtnLabel } = setupAllData({ userDetails: { loggedIn: true } });

            expect(placeBtnLabel).toBe("I18N.BETSLIP.PLACE_BET");
          });
        });
      });

      describe("when logged out", () => {
        it("should return login to place bet label", () => {
          const { placeBtnLabel } = setupAllData({ userDetails: { loggedIn: false } });

          expect(placeBtnLabel).toBe("I18N.BETSLIP.LOGIN_PLACE_BET");
        });

        describe("when isDepositRequired is true", () => {
          it("should return login to place bet label", () => {
            const { placeBtnLabel } = setupAllData({
              placeError: { errorCode: "INSUFFICIENT_FUNDS" },
              userDetails: { loggedIn: false },
            });

            expect(placeBtnLabel).toBe("I18N.BETSLIP.LOGIN_PLACE_BET");
          });
        });

        describe("when isAuthenticating is true", () => {
          it("should keep the login label and mark isPlacing as true to disable the panel", () => {
            const { placeBtnLabel, isPlacing } = setupAllData({
              userDetails: { loggedIn: false, isAuthenticating: true },
            });

            expect(placeBtnLabel).toBe("I18N.BETSLIP.LOGIN_PLACE_BET");
            expect(isPlacing).toBe(true);
          });
        });
      });
    });

    describe("loadingLabel", () => {
      describe("when isDepositRequired is true", () => {
        it("should return an empty string", () => {
          const { loadingLabel } = setupAllData({
            placeError: { errorCode: "INSUFFICIENT_FUNDS" },
            userDetails: { loggedIn: true },
          });

          expect(loadingLabel).toEqual("");
        });
      });

      describe("when isDepositRequired is false", () => {
        describe("and logged out", () => {
          it("should return an empty string", () => {
            const { loadingLabel } = setupAllData({
              isFreeBetsSelected: true,
              userDetails: { loggedIn: false },
            });

            expect(loadingLabel).toEqual("");
          });
        });

        describe("and logged in", () => {
          it("should return placing bet label", () => {
            const { loadingLabel } = setupAllData({
              isFreeBetsSelected: true,
              userDetails: { loggedIn: true },
            });

            expect(loadingLabel).toEqual("I18N.BETSLIP.PLACING_BET");
          });
        });
      });
    });

    describe("and side is back", () => {
      it("should return title prefix as Back bet", () => {
        const { titlePrefix } = setupAllData({
          potentialBet: {
            size: 40,
            price: 15.15,
            side: "BACK",
          },
        });

        expect(titlePrefix).toBe("I18N.BETSLIP.BACK_BET_FOR");
      });
    });

    describe("and side is lay", () => {
      it("should return title prefix as Lay bet", () => {
        const { titlePrefix } = setupAllData({
          potentialBet: {
            size: 40,
            price: 15.15,
            side: "LAY",
          },
        });

        expect(titlePrefix).toBe("I18N.BETSLIP.LAY_BET_AGAINST");
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  const dispatchSpy = jest.fn();

  describe("dispatchExchangePlaceBetAction", () => {
    it("should dispatch a BetslipExchangePlaceBetClickAction", () => {
      const { dispatchExchangePlaceBetAction } = mapDispatchToProps(dispatchSpy);
      dispatchExchangePlaceBetAction("runnerUrn", true);

      expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
        type: UI__BETSLIP_EXC_PLACE_BET_CLICK,
        payload: {
          runner: "runnerUrn",
          confirmFirst: true,
        },
      });
    });

    it("shouldn't dispatch a BetslipExchangePlaceBetClickAutoConfirm", () => {
      const { dispatchExchangePlaceBetAction } = mapDispatchToProps(dispatchSpy);
      dispatchExchangePlaceBetAction("runnerUrn", true);

      expect(dispatchSpy).not.toHaveBeenCalledWith({
        type: UI__BETSLIP_EXC_PLACE_BET_CLICK_AUTO_CONFIRM,
        payload: {
          runner: "runnerUrn",
        },
      });
    });

    it("should dispatch a BetslipExchangePlaceBetClickAutoConfirm when confirmFirst is falsy", () => {
      const { dispatchExchangePlaceBetAction } = mapDispatchToProps(dispatchSpy);
      dispatchExchangePlaceBetAction("runnerUrn", false);

      expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
        type: UI__BETSLIP_EXC_PLACE_BET_CLICK_AUTO_CONFIRM,
        payload: {
          runner: "runnerUrn",
        },
      });
    });

    it("should dispatch a BettingExchangePlaceBetsAction when confirmFirst is true", () => {
      const { dispatchExchangePlaceBetAction } = mapDispatchToProps(dispatchSpy);
      dispatchExchangePlaceBetAction("runnerUrn", true);

      expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
        type: BETTING__EXC_PLACE_BETS,
        payload: {
          runner: "runnerUrn",
          confirmFirst: true,
        },
      });
    });
  });

  describe("dispatchExchangePriceInputChangeAction", () => {
    it("should call dispatch twice", () => {
      const { dispatchExchangePriceInputChangeAction } = mapDispatchToProps(dispatchSpy);
      dispatchExchangePriceInputChangeAction("runnerUrn", ExchangeSide.BACK, 10, 20);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
    });

    it("should dispatch a BetslipExchangePriceInputChangeAction", () => {
      const { dispatchExchangePriceInputChangeAction } = mapDispatchToProps(dispatchSpy);
      dispatchExchangePriceInputChangeAction("runnerUrn", ExchangeSide.BACK, 10, 20);

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: UI__BETSLIP_EXC_PRICE_INPUT_CHANGE,
        payload: {
          runner: "runnerUrn",
          side: ExchangeSide.BACK,
          price: 10,
          size: 20,
        },
      });
    });

    it("should dispatch a UpdatePotentialBetAction", () => {
      const { dispatchExchangePriceInputChangeAction } = mapDispatchToProps(dispatchSpy);
      dispatchExchangePriceInputChangeAction("runnerUrn", ExchangeSide.BACK, 10, 20);

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING__UPDATE_POTENTIAL_BET_ACTION,
        payload: {
          runner: "runnerUrn",
          side: ExchangeSide.BACK,
          price: 10,
          size: 20,
        },
      });
    });
  });

  describe("dispatchExchangeSizeInputChangeAction", () => {
    it("should call dispatch twice", () => {
      const { dispatchExchangeSizeInputChangeAction } = mapDispatchToProps(dispatchSpy);
      dispatchExchangeSizeInputChangeAction("runnerUrn", ExchangeSide.BACK, 10, 20);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
    });

    it("should dispatch a BetslipExchangeSizeInputChangeAction", () => {
      const { dispatchExchangeSizeInputChangeAction } = mapDispatchToProps(dispatchSpy);
      dispatchExchangeSizeInputChangeAction("runnerUrn", ExchangeSide.BACK, 10, 20);

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: UI__BETSLIP_EXC_SIZE_INPUT_CHANGE,
        payload: {
          runner: "runnerUrn",
          side: ExchangeSide.BACK,
          price: 10,
          size: 20,
        },
      });
    });

    it("should dispatch a UpdatePotentialBetAction", () => {
      const { dispatchExchangeSizeInputChangeAction } = mapDispatchToProps(dispatchSpy);
      dispatchExchangeSizeInputChangeAction("runnerUrn", ExchangeSide.BACK, 10, 20);

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING__UPDATE_POTENTIAL_BET_ACTION,
        payload: {
          runner: "runnerUrn",
          side: ExchangeSide.BACK,
          price: 10,
          size: 20,
        },
      });
    });
  });

  describe("dispatchExchangePriceInputBlurAction", () => {
    it("should call dispatch twice", () => {
      const { dispatchExchangePriceInputBlurAction } = mapDispatchToProps(dispatchSpy);
      dispatchExchangePriceInputBlurAction("runnerUrn", ExchangeSide.BACK, 10, 20);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
    });

    it("should dispatch a BetslipExchangePriceInputBlurAction", () => {
      const { dispatchExchangePriceInputBlurAction } = mapDispatchToProps(dispatchSpy);
      dispatchExchangePriceInputBlurAction("runnerUrn", ExchangeSide.BACK, 10, 20);

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: UI__BETSLIP_EXC_PRICE_INPUT_BLUR,
        payload: {
          runner: "runnerUrn",
          side: ExchangeSide.BACK,
          price: 10,
          size: 20,
        },
      });
    });

    it("should dispatch a UpdatePotentialBetAction", () => {
      const { dispatchExchangePriceInputBlurAction } = mapDispatchToProps(dispatchSpy);
      dispatchExchangePriceInputBlurAction("runnerUrn", ExchangeSide.BACK, 10, 20);

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING__UPDATE_POTENTIAL_BET_ACTION,
        payload: {
          runner: "runnerUrn",
          side: ExchangeSide.BACK,
          price: 10,
          size: 20,
        },
      });
    });
  });

  describe("dispatchExchangeSizeInputBlurAction", () => {
    it("should dispatch a UpdatePotentialBetAction", () => {
      const { dispatchExchangeSizeInputBlurAction } = mapDispatchToProps(dispatchSpy);
      dispatchExchangeSizeInputBlurAction("runnerUrn", ExchangeSide.BACK, 10, 20);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING__UPDATE_POTENTIAL_BET_ACTION,
        payload: {
          runner: "runnerUrn",
          side: ExchangeSide.BACK,
          price: 10,
          size: 20,
        },
      });
    });
  });

  describe("dispatchExchangePriceNudgeUpAction", () => {
    it("should call dispatch twice", () => {
      const { dispatchExchangePriceNudgeUpAction } = mapDispatchToProps(dispatchSpy);
      dispatchExchangePriceNudgeUpAction("runnerUrn", ExchangeSide.BACK);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
    });

    it("should dispatch a BetslipExchangePriceNudgeUpClickAction", () => {
      const { dispatchExchangePriceNudgeUpAction } = mapDispatchToProps(dispatchSpy);
      dispatchExchangePriceNudgeUpAction("runnerUrn", ExchangeSide.BACK);

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: UI__BETSLIP_EXC_PRICE_NUDGE_UP,
        payload: {
          runner: "runnerUrn",
          side: ExchangeSide.BACK,
        },
      });
    });

    it("should dispatch a NudgeUpPotentialBetAction", () => {
      const { dispatchExchangePriceNudgeUpAction } = mapDispatchToProps(dispatchSpy);
      dispatchExchangePriceNudgeUpAction("runnerUrn", ExchangeSide.BACK);

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING__NUDGE_UP_POTENTIAL_BET_ACTION,
        payload: {
          runner: "runnerUrn",
          side: ExchangeSide.BACK,
          input: "price",
        },
      });
    });
  });

  describe("dispatchExchangePriceNudgeDownAction", () => {
    it("should call dispatch twice", () => {
      const { dispatchExchangePriceNudgeDownAction } = mapDispatchToProps(dispatchSpy);
      dispatchExchangePriceNudgeDownAction("runnerUrn", ExchangeSide.BACK);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
    });

    it("should dispatch a BetslipExchangePriceNudgeDownClickAction", () => {
      const { dispatchExchangePriceNudgeDownAction } = mapDispatchToProps(dispatchSpy);
      dispatchExchangePriceNudgeDownAction("runnerUrn", ExchangeSide.BACK);

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: UI__BETSLIP_EXC_PRICE_NUDGE_DOWN,
        payload: {
          runner: "runnerUrn",
          side: ExchangeSide.BACK,
        },
      });
    });

    it("should dispatch a NudgeDownPotentialBetAction", () => {
      const { dispatchExchangePriceNudgeDownAction } = mapDispatchToProps(dispatchSpy);
      dispatchExchangePriceNudgeDownAction("runnerUrn", ExchangeSide.BACK);

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING__NUDGE_DOWN_POTENTIAL_BET_ACTION,
        payload: {
          runner: "runnerUrn",
          side: ExchangeSide.BACK,
          input: "price",
        },
      });
    });
  });

  describe("dispatchExchangeSizeNudgeUpAction", () => {
    it("should call dispatch twice", () => {
      const { dispatchExchangeSizeNudgeUpAction } = mapDispatchToProps(dispatchSpy);
      dispatchExchangeSizeNudgeUpAction("runnerUrn", ExchangeSide.BACK);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
    });

    it("should dispatch a NudgeUpPotentialBetAction", () => {
      const { dispatchExchangeSizeNudgeUpAction } = mapDispatchToProps(dispatchSpy);
      dispatchExchangeSizeNudgeUpAction("runnerUrn", ExchangeSide.BACK);

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING__NUDGE_UP_POTENTIAL_BET_ACTION,
        payload: {
          runner: "runnerUrn",
          side: ExchangeSide.BACK,
          input: "size",
        },
      });
    });
  });

  describe("dispatchExchangeSizeNudgeDownAction", () => {
    it("should call dispatch twice", () => {
      const { dispatchExchangeSizeNudgeDownAction } = mapDispatchToProps(dispatchSpy);
      dispatchExchangeSizeNudgeDownAction("runnerUrn", ExchangeSide.BACK);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
    });

    it("should dispatch a NudgeDownPotentialBetAction", () => {
      const { dispatchExchangeSizeNudgeDownAction } = mapDispatchToProps(dispatchSpy);
      dispatchExchangeSizeNudgeDownAction("runnerUrn", ExchangeSide.BACK);

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING__NUDGE_DOWN_POTENTIAL_BET_ACTION,
        payload: {
          runner: "runnerUrn",
          side: ExchangeSide.BACK,
          input: "size",
        },
      });
    });
  });

  describe("dispatchIncrementByQuickStakeAction", () => {
    it("should call dispatch twice", () => {
      const { dispatchIncrementByQuickStakeAction } = mapDispatchToProps(dispatchSpy);
      dispatchIncrementByQuickStakeAction("runnerUrn", ExchangeSide.BACK, 50, "£");

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
    });

    it("should dispatch a BettingExchangeIncrementSizeAction", () => {
      const { dispatchIncrementByQuickStakeAction } = mapDispatchToProps(dispatchSpy);
      dispatchIncrementByQuickStakeAction("runnerUrn", ExchangeSide.BACK, 50, "£");

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING__EXC_INCREMENT_SIZE_ACTION,
        payload: {
          runner: "runnerUrn",
          side: ExchangeSide.BACK,
          increment: 50,
        },
      });
    });

    it("should dispatch a BetslipExchangeIncrementSizeAction", () => {
      const { dispatchIncrementByQuickStakeAction } = mapDispatchToProps(dispatchSpy);
      dispatchIncrementByQuickStakeAction("runnerUrn", ExchangeSide.BACK, 50, "£");

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: UI__BETSLIP_EXC_INCREMENT_SIZE_ACTION,
        payload: {
          increment: 50,
          currencySymbol: "£",
        },
      });
    });
  });

  describe("dispatchExchangeSelectionRemoveAction", () => {
    it("should call dispatch twice", () => {
      const { dispatchExchangeSelectionRemoveAction } = mapDispatchToProps(dispatchSpy);
      dispatchExchangeSelectionRemoveAction("runnerUrn", ExchangeSide.BACK);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
    });

    it("should dispatch a BetslipExchangeRemovePotentialBetClickAction", () => {
      const { dispatchExchangeSelectionRemoveAction } = mapDispatchToProps(dispatchSpy);
      dispatchExchangeSelectionRemoveAction("runnerUrn", ExchangeSide.BACK);

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: UI__BETSLIP_EXC_REMOVE_POTENTIAL_BET_CLICK,
        payload: {
          runner: "runnerUrn",
        },
      });
    });

    it("should dispatch a RemovePotentialBetAction", () => {
      const { dispatchExchangeSelectionRemoveAction } = mapDispatchToProps(dispatchSpy);
      dispatchExchangeSelectionRemoveAction("runnerUrn", ExchangeSide.BACK);

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING__REMOVE_POTENTIAL_BET_ACTION,
        payload: {
          runner: "runnerUrn",
          side: ExchangeSide.BACK,
        },
      });
    });
  });

  describe("dispatchExchangeBonusChangeAction", () => {
    it("should dispatch a BetslipExchangeBonusChangeAction", () => {
      const { dispatchExchangeBonusChangeAction } = mapDispatchToProps(dispatchSpy);
      dispatchExchangeBonusChangeAction(true);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: UI__BETSLIP_EXC_BONUS_CHANGE,
        payload: {
          isFreeBetsSelected: false,
          product: Product.Exchange,
        },
      });
    });

    it("should dispatch a BetslipExchangeBonusChangeAction", () => {
      const { dispatchExchangeBonusChangeAction } = mapDispatchToProps(dispatchSpy);
      dispatchExchangeBonusChangeAction(true, "runner:urn", 10);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING__BONUS_TOGGLE_BET_ACTION,
        payload: {
          isFreeBetsSelected: false,
          runner: "runner:urn",
          marketEligibleBonus: 10,
        },
      });
    });
  });

  describe("dispatchCloseAction", () => {
    it("should dispatch BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION and UI__BETSLIP_CLOSE_CLICK", () => {
      const { dispatchCloseAction } = mapDispatchToProps(dispatchSpy);

      dispatchCloseAction();

      expect(dispatchSpy).toHaveBeenNthCalledWith(1, { type: BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION });
      expect(dispatchSpy).toHaveBeenNthCalledWith(2, { type: UI__BETSLIP_CLOSE_CLICK });
      expect(dispatchSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe("dispatchDepositRedirect", () => {
    it("should dispatch BettingDepositToPlaceBetAction", () => {
      const { dispatchDepositRedirect } = mapDispatchToProps(dispatchSpy);

      dispatchDepositRedirect();

      expect(dispatchSpy).toHaveBeenCalledWith({ type: BETTING__DEPOSIT_TO_PLACE_BET });
    });
  });

  describe("dispatchNavigate", () => {
    it("should dispatch PushAction", () => {
      const { dispatchNavigate } = mapDispatchToProps(dispatchSpy);

      dispatchNavigate("viewUrn", "viewUrl");

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: PUSH,
        payload: {
          viewUrn: "viewUrn",
          viewUrl: "viewUrl",
        },
      });
    });
  });

  describe("dispatchLogin", () => {
    it("should dispatch EXTERNAL_PUSH", () => {
      const { dispatchLogin } = mapDispatchToProps(dispatchSpy);

      dispatchLogin("some_url");

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: EXTERNAL_PUSH,
        payload: {
          viewUrn: "",
          viewUrl: "some_url",
        },
      });
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("dispatchLoginToPlaceBetAction", () => {
    it("should dispatch UI__BETSLIP_EXC_LOGIN_TO_PLACE_BET_CLICK", () => {
      const { dispatchLoginToPlaceBetAction } = mapDispatchToProps(dispatchSpy);

      dispatchLoginToPlaceBetAction(ExchangeSide.LAY);

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: UI__BETSLIP_EXC_LOGIN_TO_PLACE_BET_CLICK,
        payload: {
          side: ExchangeSide.LAY,
        },
      });
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
    });
  });
});
