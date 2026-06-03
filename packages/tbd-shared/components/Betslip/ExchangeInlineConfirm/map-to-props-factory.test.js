import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import {
  UI__BETSLIP_EXC_CONFIRM_PANEL_BACK_CLICK,
  UI__BETSLIP_EXC_CONFIRM_BET_CLICK,
  UI__BETSLIP_CLOSE_CLICK,
} from "@ppb/tbd-store/actions/betslip";
import { getBetslipExchangeContext, getIsFreeBetsSelected } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import {
  getExchangeRunnerTree,
  createExcRunnerPotentialBetsByRunnerURNSelector,
} from "@ppb/tbd-store/state/entities/entities-selectors";
import {
  getExchangeEligibleBonusByMarketId,
  getRunnerPotentialBetWithBonus,
} from "@ppb/tbd-store/state/betting/exchange-betting-bonus/exchange-betting-bonus-selectors";
import { BETTING__DEPOSIT_TO_PLACE_BET } from "@ppb/tbd-store/actions/betting";
import { PUSH } from "@ppb/tbd-store/actions/router";

import { ExchangeSide } from "@ppb/tbd-store/state/constants";
import { getCurrencySymbol } from "../../../formatters/currency-formatters";
import {
  buildExchangeTransactionalError,
  buildFreeBetsLabel,
  getBetData,
  getPotentialExposure,
} from "../betslip-formatters";
import { getInlineBetslipTitle } from "../../../helpers/exchange-betslip-title-helper";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors");
jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors");
jest.mock("@ppb/tbd-store/state/entities/entities-selectors");
jest.mock("@ppb/tbd-store/state/betting/exchange-betting-bonus/exchange-betting-bonus-selectors");
jest.mock("../../../formatters/currency-formatters");
jest.mock("../betslip-formatters");
jest.mock("../../../helpers/exchange-betslip-title-helper");
jest.mock("../../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

const dispatch = jest.fn();

describe("Exchange Confirm View Model Builder", () => {
  function setupMockState(betslip = {}) {
    return { betslip };
  }

  function setupUserDetails(userDetails) {
    getUserDetails.mockReturnValue(userDetails);
  }

  function setupCurrencySymbol(currencySymbol) {
    getCurrencySymbol.mockReturnValue(currencySymbol);
  }

  function setupRunnerTree(runnerTree) {
    getExchangeRunnerTree.mockReturnValue(runnerTree);
  }

  function setupBetslipExchangeContext(betslipContext) {
    getBetslipExchangeContext.mockReturnValue(betslipContext);
  }

  function setupIsFreeBetsSelected(isFreeBetsSelected) {
    getIsFreeBetsSelected.mockReturnValue(isFreeBetsSelected);
  }

  function setupExchangeEligibleBonusByMarketId(eligibleBonus) {
    getExchangeEligibleBonusByMarketId.mockReturnValue(eligibleBonus);
  }

  function setupRunnerPotentialBets(runnerPotentialBets) {
    createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => runnerPotentialBets);
  }

  function setupProfitOrLiabilityData(value) {
    getBetData.mockReturnValue(value);
  }

  function setupFreeBetsLabel(bonus) {
    buildFreeBetsLabel.mockReturnValue(`Using ${bonus} Free Bet`);
  }

  function setupGetPotentialExposure(value) {
    getPotentialExposure.mockReturnValue(value);
  }

  function setupError(error) {
    buildExchangeTransactionalError.mockReturnValue(error);
  }

  function setupPotentialBetWithBonus(potentialBetWithBonus) {
    getRunnerPotentialBetWithBonus.mockReturnValue(potentialBetWithBonus);
  }

  beforeEach(jest.clearAllMocks);
  beforeEach(() => {
    getInlineBetslipTitle.mockReturnValue("inline title");
  });

  it("should retrieve user details", () => {
    const mockState = setupMockState();

    makeMapStateToProps()(mockState);

    expect(getUserDetails).toHaveBeenCalledWith(mockState);
  });

  it("should retrieve the user currency symbol", () => {
    const mockState = setupMockState();

    setupUserDetails({ userDetail: "detailsPls" });
    makeMapStateToProps()(mockState);

    expect(getCurrencySymbol).toHaveBeenCalledWith({ userDetail: "detailsPls" });
  });

  describe("when `getUserDetails` throws", () => {
    const GET_USER_DETAILS_ERROR = "GET_USER_DETAILS_ERROR";

    beforeEach(() => {
      getUserDetails.mockImplementationOnce(() => {
        throw new Error(GET_USER_DETAILS_ERROR);
      });
    });

    it("should call console.error with the error thrown from `getUserDetails`", () => {
      const mockState = setupMockState();

      makeMapStateToProps()(mockState);

      expect(global.console.error).toHaveBeenCalledWith(new Error("GET_USER_DETAILS_ERROR"));
    });

    it("should return an empty object", () => {
      const mockState = setupMockState();

      expect(makeMapStateToProps()(mockState)).toEqual({});
    });
  });

  describe("when there is no betslip context", () => {
    it("should return an empty state", () => {
      const mockState = setupMockState();
      setupBetslipExchangeContext(undefined);

      expect(makeMapStateToProps()(mockState)).toEqual({
        confirm: "",
        loading: "",
        profitLabel: "",
        profitValue: "",
        profitRawValue: 0,
        title: "",
        labels: {
          edit: "I18N.BETSLIP.EDIT_BET",
          price: "I18N.BETSLIP.ODDS",
          size: "I18N.BETSLIP.STAKE",
        },
        isDepositRequired: false,
        isFreeBetsSelected: false,
      });
    });
  });

  describe("when betslip is undefined", () => {
    it("should return an empty object", () => {
      const mockState = { betslip: undefined };

      expect(makeMapStateToProps()(mockState)).toEqual({});
    });
  });

  describe("when there are no potential bets", () => {
    it("should return an empty state", () => {
      const mockState = setupMockState();
      setupBetslipExchangeContext({ context: "betslip" });
      setupCurrencySymbol("currencySymbol");
      setupRunnerPotentialBets([]);

      expect(makeMapStateToProps()(mockState)).toEqual({
        confirm: "",
        loading: "",
        profitLabel: "",
        profitValue: "",
        profitRawValue: 0,
        title: "",
        labels: {
          edit: "I18N.BETSLIP.EDIT_BET",
          price: "I18N.BETSLIP.ODDS",
          size: "I18N.BETSLIP.STAKE",
        },
        isDepositRequired: false,
        isFreeBetsSelected: false,
      });
    });
  });

  describe("when the runner tree cannot be resolved", () => {
    it("should return an empty state", () => {
      setupRunnerTree(null);
      setupBetslipExchangeContext({ runner: "runner:urn" });
      setupCurrencySymbol("currencySymbol");
      setupRunnerPotentialBets([{ side: ExchangeSide.BACK }]);

      const mockState = setupMockState([{ side: ExchangeSide.BACK }]);

      expect(makeMapStateToProps()(mockState)).toEqual({
        confirm: "",
        loading: "",
        profitLabel: "",
        profitValue: "",
        profitRawValue: 0,
        title: "",
        labels: {
          edit: "I18N.BETSLIP.EDIT_BET",
          price: "I18N.BETSLIP.ODDS",
          size: "I18N.BETSLIP.STAKE",
        },
        isDepositRequired: false,
        isFreeBetsSelected: false,
      });
    });
  });

  describe("when there is all data for mapping the props", () => {
    function setupAllData({ error, isFreeBetsSelected = false, eligibleBonus = 0, potentialBetWithBonus = {} }) {
      setupUserDetails({ countryCode: "GB", currencyCode: "EUR", localeCode: "GB" });
      setupCurrencySymbol("currencySymbol");
      setupBetslipExchangeContext({ side: ExchangeSide.LAY });
      setupRunnerPotentialBets([
        {
          size: 10.1,
          price: 15.15,
          side: ExchangeSide.LAY,
        },
      ]);
      setupProfitOrLiabilityData({
        label: "Profit:",
        value: "111",
        rawValue: 111,
      });
      setupError({ message: "Place Error" });
      setupRunnerTree({
        runner: {
          urn: "runner:urn",
          selectionId: "selectionId",
        },
        marketRunner: {},
        market: {
          betDelay: 1,
          marketId: "marketId",
          marketType: "marketType",
          bettingType: "bettingType",
        },
        event: {},
      });
      setupIsFreeBetsSelected(isFreeBetsSelected);
      setupExchangeEligibleBonusByMarketId(eligibleBonus);
      setupFreeBetsLabel(eligibleBonus);
      setupGetPotentialExposure(2);
      setupPotentialBetWithBonus(potentialBetWithBonus);

      const mockState = setupMockState({ exchangePlaceError: error, isFreeBetsSelected });
      return makeMapStateToProps()(mockState);
    }

    it("should return a mapped out view model from state", () => {
      const vm = setupAllData({});

      expect(vm).toEqual({
        betDelay: 1,
        title: "inline title",
        titlePrefix: "I18N.BETSLIP.LAY_BET_AGAINST",
        currencySymbol: "currencySymbol",
        error: undefined,
        price: 15.15,
        profitLabel: "Profit:",
        profitValue: "111",
        profitRawValue: 111,
        urn: "runner:urn",
        side: "LAY",
        size: 10.1,
        isFreeBetsSelected: false,
        isDepositRequired: false,
        freeBets: undefined,
        confirm: "I18N.BETSLIP.CONFIRM_BET",
        loading: "I18N.BETSLIP.PLACING_BET",
        labels: {
          edit: "I18N.BETSLIP.EDIT_BET",
          price: "I18N.BETSLIP.ODDS",
          size: "I18N.BETSLIP.STAKE",
        },
      });
    });

    describe("when there is no place error", () => {
      it("should not call buildExchangeTransactionalError", () => {
        setupAllData({});

        expect(buildExchangeTransactionalError).not.toHaveBeenCalled();
      });

      it("should return error as undefined", () => {
        const { error } = setupAllData({});

        expect(error).toEqual(undefined);
      });
    });

    describe("when there is a place error", () => {
      it("should call buildExchangeTransactionalError", () => {
        setupAllData({ error: "some error" });

        expect(buildExchangeTransactionalError).toHaveBeenCalledWith("some error", "currencySymbol");
        expect(buildExchangeTransactionalError).toHaveBeenCalledTimes(1);
      });

      it("should return error", () => {
        const { error } = setupAllData({ error: "some error" });

        expect(error).toEqual({ message: "Place Error" });
      });
    });

    describe("when freebets are available", () => {
      describe("and the user selected to use bonus", () => {
        const isFreeBetsSelected = true;

        it("should call getExchangeEligibleBonusByMarketId", () => {
          setupAllData({ isFreeBetsSelected, eligibleBonus: 10 });
          const appState = setupMockState({ isFreeBetsSelected });

          expect(getExchangeEligibleBonusByMarketId).toHaveBeenCalledTimes(1);
          expect(getExchangeEligibleBonusByMarketId).toHaveBeenCalledWith(
            appState,
            "marketId",
            "selectionId",
            "marketType",
            "bettingType",
          );
        });

        it("should call buildFreeBetsLabel", () => {
          setupAllData({ isFreeBetsSelected, eligibleBonus: 10 });

          expect(buildFreeBetsLabel).toHaveBeenCalledTimes(1);
          expect(buildFreeBetsLabel).toHaveBeenCalledWith(
            "I18N.BETSLIP.USING_BONUS",
            { countryCode: "GB", currencyCode: "EUR", localeCode: "GB" },
            2,
          );
        });

        it("should use the potentialBetWithBonus to build profitLabel", () => {
          setupAllData({ isFreeBetsSelected, eligibleBonus: 10 });
          const appState = setupMockState({ isFreeBetsSelected });

          expect(getBetData).toHaveBeenCalledTimes(1);
          expect(getBetData).toHaveBeenCalledWith(
            {
              side: ExchangeSide.LAY,
            },
            {
              countryCode: "GB",
              currencyCode: "EUR",
              localeCode: "GB",
            },
            false,
          );
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
        });
      });

      describe("and the user doesn't have bonus", () => {
        it("should not set the freebets label", () => {
          const setup = setupAllData({ isFreeBetsSelected: true, eligibleBonus: 0 });

          expect(setup.bonusLabel).toBe(undefined);
        });
      });

      describe("and the user doesn't have selected to use bonus", () => {
        it("should not set the freebets label", () => {
          const setup = setupAllData({ isFreeBetsSelected: false });

          expect(setup.bonusLabel).toBe(undefined);
        });

        it("should use the potentialBet to build profitLabel", () => {
          setupAllData({ isFreeBetsSelected: false, eligibleBonus: 5 });

          expect(getBetData).toHaveBeenCalledTimes(1);
          expect(getBetData).toHaveBeenCalledWith(
            {
              size: 10.1,
              price: 15.15,
              side: ExchangeSide.LAY,
            },
            {
              countryCode: "GB",
              currencyCode: "EUR",
              localeCode: "GB",
            },
            false,
          );

          expect(getRunnerPotentialBetWithBonus).toHaveBeenCalledTimes(0);
        });
      });
    });

    describe("when bet side is Back", () => {
      it("should return Back title prefix", () => {
        setupUserDetails({ countryCode: "GB", currencyCode: "EUR", localeCode: "GB" });
        setupCurrencySymbol("currencySymbol");
        setupBetslipExchangeContext({ side: ExchangeSide.BACK });
        setupRunnerPotentialBets([
          {
            size: 10.1,
            price: 15.15,
            side: ExchangeSide.BACK,
          },
        ]);
        setupProfitOrLiabilityData({ label: "Profit:", value: "111", rawValue: 111 });
        setupRunnerTree({
          runner: { urn: "runner:urn", selectionId: "selectionId" },
          marketRunner: {},
          market: { betDelay: 1, marketId: "marketId", marketType: "marketType", bettingType: "bettingType" },
          event: {},
        });
        setupIsFreeBetsSelected(false);

        const mockState = setupMockState({});
        const vm = makeMapStateToProps()(mockState);

        expect(vm.titlePrefix).toBe("I18N.BETSLIP.BACK_BET_FOR");
      });
    });

    describe("when potentialExposure is greater than eligibleBonus", () => {
      it("should use eligibleBonus as bonusUsed", () => {
        setupUserDetails({ countryCode: "GB", currencyCode: "EUR", localeCode: "GB" });
        setupCurrencySymbol("currencySymbol");
        setupBetslipExchangeContext({ side: ExchangeSide.LAY });
        setupRunnerPotentialBets([
          {
            size: 10.1,
            price: 15.15,
            side: ExchangeSide.LAY,
          },
        ]);
        setupProfitOrLiabilityData({ label: "Profit:", value: "111", rawValue: 111 });
        setupRunnerTree({
          runner: { urn: "runner:urn", selectionId: "selectionId" },
          marketRunner: {},
          market: { betDelay: 1, marketId: "marketId", marketType: "marketType", bettingType: "bettingType" },
          event: {},
        });
        setupIsFreeBetsSelected(true);
        setupExchangeEligibleBonusByMarketId(5);
        setupGetPotentialExposure(20);
        setupPotentialBetWithBonus({});

        const mockState = setupMockState({ isFreeBetsSelected: true });
        makeMapStateToProps()(mockState);

        expect(buildFreeBetsLabel).toHaveBeenCalledWith(
          "I18N.BETSLIP.USING_BONUS",
          { countryCode: "GB", currencyCode: "EUR", localeCode: "GB" },
          5,
        );
      });
    });

    describe("when there is an INSUFFICIENT_FUNDS error", () => {
      it("should return no loading label", () => {
        const vm = setupAllData({ error: { errorCode: "INSUFFICIENT_FUNDS" } });

        expect(vm.loading).toEqual("");
      });

      it("should return deposit to place bet confirm label", () => {
        const vm = setupAllData({ error: { errorCode: "INSUFFICIENT_FUNDS" } });

        expect(vm.confirm).toEqual("I18N.BETSLIP.DEPOSIT_TO_PLACE_BET");
      });

      it("should return deposit required", () => {
        const vm = setupAllData({ error: { errorCode: "INSUFFICIENT_FUNDS" } });

        expect(vm.isDepositRequired).toEqual(true);
      });
    });
  });

  describe("mapDispatchToProps", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("confirm should dispatch proper action", () => {
      const runner = "test";
      const { dispatchConfirmBet } = mapDispatchToProps(dispatch);

      dispatchConfirmBet(runner);
      expect(dispatch).toHaveBeenCalledWith({
        type: UI__BETSLIP_EXC_CONFIRM_BET_CLICK,
        payload: { runner },
      });
    });

    it("edit should dispatch proper action", () => {
      const { dispatchEdit } = mapDispatchToProps(dispatch);

      dispatchEdit();
      expect(dispatch).toHaveBeenCalledWith({
        type: UI__BETSLIP_EXC_CONFIRM_PANEL_BACK_CLICK,
      });
    });

    it("close should dispatch proper action", () => {
      const { dispatchClose } = mapDispatchToProps(dispatch);

      dispatchClose();
      expect(dispatch).toHaveBeenCalledWith({
        type: UI__BETSLIP_CLOSE_CLICK,
      });
    });

    it("redirect should dispatch proper action", () => {
      const { dispatchDepositRedirect } = mapDispatchToProps(dispatch);

      dispatchDepositRedirect();
      expect(dispatch).toHaveBeenCalledWith({
        type: BETTING__DEPOSIT_TO_PLACE_BET,
      });
    });

    it("navigate should dispatch proper action", () => {
      const { dispatchNavigate } = mapDispatchToProps(dispatch);

      dispatchNavigate("viewUrn", "viewUrl");
      expect(dispatch).toHaveBeenCalledWith({
        type: PUSH,
        payload: {
          viewUrn: "viewUrn",
          viewUrl: "viewUrl",
        },
      });
    });
  });
});
