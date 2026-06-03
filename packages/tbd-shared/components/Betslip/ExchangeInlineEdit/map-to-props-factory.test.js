import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { getExchangeRunnerTree } from "@ppb/tbd-store/state/entities/entities-selectors";
import {
  getBetslipExchangeContext,
  getBetslipExchangeEdit,
  getEditingBetState,
} from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import {
  UI__BETSLIP_EXC_UNMATCHED_CANCEL_CLICK,
  UI__BETSLIP_EXC_UNMATCHED_DONE_CLICK,
  UI__BETSLIP_EXC_UNMATCHED_PERSISTENCE_LIST_CLICK,
  UI__BETSLIP_EXC_UNMATCHED_UPDATE_CLICK,
  UI__BETSLIP_EXC_UNMATCHED_PERSISTENCE_ITEM_CLICK,
  UI__BETSLIP_EXC_UNMATCHED_PRICE_INPUT_CHANGE,
  UI__BETSLIP_EXC_UNMATCHED_PRICE_INPUT_BLUR,
  UI__BETSLIP_EXC_UNMATCHED_SIZE_INPUT_CHANGE,
  UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_UP,
  UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_DOWN,
} from "@ppb/tbd-store/actions/betslip";
import {
  BETTING__EXC_UNMATCHED_UPDATE,
  BETTING__DEPOSIT_TO_PLACE_BET,
  BETTING__NUDGE_DOWN_UNMATCHED_BET_ACTION,
  BETTING__NUDGE_UP_UNMATCHED_BET_ACTION,
  BETTING__UPDATE_UNMATCHED_BET_ACTION,
} from "@ppb/tbd-store/actions/betting";
import { PUSH } from "@ppb/tbd-store/actions/router";
import { ExchangeMarketStatus } from "@ppb/tbd-store/state/entities/exchange-markets/ExchangeMarket.types";

import { ExchangeSide } from "@ppb/tbd-store/state/constants";
import { getCurrencySymbol } from "../../../formatters/currency-formatters";
import { getEndpoint } from "../../../config/endpoints";
import { buildMarketError, buildPlaceError, buildPriceError, buildSizeError } from "../betslip-mapper";
import { getBetData } from "../betslip-formatters";
import { getInlineBetslipTitle } from "../../../helpers/exchange-betslip-title-helper";

import { makeMapStateToProps, makeMapDispatchToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors");
jest.mock("@ppb/tbd-store/state/entities/exchange-runners/exchange-runners-reducer");
jest.mock("@ppb/tbd-store/state/entities/entities-selectors");
jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors");
jest.mock("@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors");
jest.mock("@ppb/tbd-store/state/entities/sport-events/sport-event-selectors");
jest.mock("../../../formatters/currency-formatters");
jest.mock("../betslip-formatters");
jest.mock("../betslip-mapper");
jest.mock("../../../helpers/exchange-betslip-title-helper");
jest.mock("../../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));
jest.mock("../../../config/endpoints");
jest.mock("@ppb/tbd-store/state/entities/user-wallets/user-wallets-selectors");

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

describe("ExchangeInlineEdit map-to-props-factory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getInlineBetslipTitle.mockReturnValue("inline title");
  });

  describe("makeMapStateToProps", () => {
    const baseState = {
      isPersistenceTypeMenuExpanded: false,
      isPriceDisabled: false,
      isSizeDisabled: false,
      isUpdateButtonDisabled: false,
      persistenceListTypes: [
        {
          id: "LAPSE",
          text: "I18N.BETSLIP.CANCEL_BET",
        },
        {
          id: "PERSIST",
          text: "I18N.BETSLIP.KEEP_BET",
        },
      ],
      labels: {
        cancel: "I18N.BETSLIP.CANCEL_BET",
        price: "I18N.BETSLIP.ODDS",
        size: "I18N.BETSLIP.STAKE",
        persistence: "I18N.BETSLIP.AT_IN_PLAY",
      },
      placeLabel: "I18N.BETSLIP.UPDATE_BET",
      loadingLabel: "I18N.BETSLIP.PLACING_BET",
      isDepositRequired: false,
      title: "",
    };

    function getConnectedBetslipMappedState(
      betslipState = { exchangeContext: {}, exchangeEdit: {} },
      entitiesState = {},
    ) {
      const state = {
        entities: {
          ...entitiesState,
        },
        betslip: {
          ...betslipState,
        },
      };
      return makeMapStateToProps()(state);
    }

    const market = {
      urn: "some market urn",
      name: "some market name",
      sportevent: "some sportevent",
      betDelay: 15,
      bettingType: "some bettingType",
      marketType: "some marketType",
      status: ExchangeMarketStatus.Open,
    };
    const exchangeRunner = {
      urn: "some runner urn",
      market: market.urn,
    };
    const exchangeMarketRunner = { urn: "some runner urn", name: "some runner name" };
    const event = { name: "some event name" };
    const editingBetState = {
      price: 1.23,
      size: 3.21,
      profit: 4,
      liability: 8,
      side: ExchangeSide.BACK,
      persistenceType: "LAPSE",
      isValid: true,
      hasPriceChanged: false,
      hasSizeChanged: false,
      hasPersistenceTypeChanged: false,
      priceValidation: "somePriceValidation",
      sizeValidation: "someSizeValidation",
    };

    function setupCompleteDataMocks() {
      getUserDetails.mockReturnValue("some user details");
      getCurrencySymbol.mockReturnValue("some currencySymbol");
      getBetslipExchangeEdit.mockReturnValue({ betId: "42", isPersistenceTypeMenuExpanded: false });
      getBetslipExchangeContext.mockReturnValue({ runner: "some runner urn", side: ExchangeSide.BACK });
      getExchangeRunnerTree.mockReturnValue({
        market,
        runner: exchangeRunner,
        marketRunner: exchangeMarketRunner,
        event,
      });
      getEditingBetState.mockReturnValue(editingBetState);
      getBetData.mockReturnValue({
        label: "Profit:",
        value: "111",
        rawValue: 111,
      });
      getEndpoint.mockReturnValue("some_endpoint");
      buildMarketError.mockReturnValue("buildMarketError mock");
      buildPlaceError.mockReturnValue("buildPlaceError mock");
      buildPriceError.mockReturnValue("buildPriceError mock");
      buildSizeError.mockReturnValue("buildSizeError mock");
    }

    describe("when there is no betslip exchange context", () => {
      function setup() {
        setupCompleteDataMocks();

        getBetslipExchangeContext.mockReturnValue(undefined);
      }

      it("should return the base state", () => {
        setup();
        const mappedProps = getConnectedBetslipMappedState();

        expect(mappedProps).toEqual(baseState);
      });

      it("should call getBetslipExchangeContext selector with the app state", () => {
        setup();
        getConnectedBetslipMappedState({ exchangeEdit: {} });

        expect(getBetslipExchangeContext).toHaveBeenCalledWith({
          entities: {},
          betslip: { exchangeEdit: {} },
        });
      });
    });

    describe("when there is no betslip exchange edit", () => {
      function setup() {
        setupCompleteDataMocks();
        getBetslipExchangeEdit.mockReturnValue(undefined);
      }

      it("should return the base state", () => {
        setup();
        const mappedProps = getConnectedBetslipMappedState({ exchangeContext: {} });

        expect(mappedProps).toEqual(baseState);
      });

      it("should call getBetslipExchangeEdit selector with the app state", () => {
        setup();
        getConnectedBetslipMappedState({ exchangeContext: {} });

        expect(getBetslipExchangeEdit).toHaveBeenCalledWith({
          entities: {},
          betslip: { exchangeContext: {} },
        });
      });
    });

    describe("when it cant resolve the runner tree", () => {
      function setup() {
        setupCompleteDataMocks();
        getExchangeRunnerTree.mockReturnValue(null);
      }

      it("should return the base state", () => {
        setup();
        const mappedProps = getConnectedBetslipMappedState();

        expect(mappedProps).toEqual(baseState);
      });

      it("should call getExchangeRunnerTree selector with the app state and the runner URN", () => {
        setup();
        getConnectedBetslipMappedState({ exchangeEdit: {} }, {});

        expect(getExchangeRunnerTree).toHaveBeenCalledWith({}, "some runner urn");
        expect(getExchangeRunnerTree).toHaveBeenCalledTimes(1);
      });
    });

    describe("when there is all data for mapping", () => {
      it("should build edit button data", () => {
        setupCompleteDataMocks();
        getConnectedBetslipMappedState({}, {});

        expect(getBetData).toHaveBeenCalledWith(editingBetState, "some user details", false);
        expect(getBetData).toHaveBeenCalledTimes(1);
      });

      it("should return the total state", () => {
        setupCompleteDataMocks();
        const mappedProps = getConnectedBetslipMappedState({ exchangeEdit: { side: ExchangeSide.BACK } }, {});

        expect(mappedProps).toEqual({
          title: "inline title",
          titlePrefix: "I18N.BETSLIP.BACK_BET_FOR",
          profitLabel: "Profit:",
          profitValue: "111",
          profitRawValue: 111,
          price: 1.23,
          size: 3.21,
          side: ExchangeSide.BACK,
          runner: "some runner urn",
          market: "some market urn",
          currencySymbol: "some currencySymbol",
          betDelay: 15,
          betId: "42",
          isPersistenceTypeMenuExpanded: false,
          isPriceDisabled: false,
          isSizeDisabled: false,
          isUpdateButtonDisabled: true,
          persistenceListSelectedKey: "LAPSE",
          persistenceListTypes: [
            {
              id: "LAPSE",
              text: "I18N.BETSLIP.CANCEL_BET",
            },
            {
              id: "PERSIST",
              text: "I18N.BETSLIP.KEEP_BET",
            },
          ],
          labels: {
            cancel: "I18N.BETSLIP.CANCEL_BET",
            price: "I18N.BETSLIP.ODDS",
            size: "I18N.BETSLIP.STAKE",
            persistence: "I18N.BETSLIP.AT_IN_PLAY",
          },
          placeLabel: "I18N.BETSLIP.UPDATE_BET",
          loadingLabel: "I18N.BETSLIP.PLACING_BET",
          isDepositRequired: false,
          placeError: "buildPlaceError mock",
          priceError: "buildPriceError mock",
          sizeError: "buildSizeError mock",
          marketError: "buildMarketError mock",
        });
      });

      describe("notifications", () => {
        it("should call buildMarketError", () => {
          setupCompleteDataMocks();
          getConnectedBetslipMappedState({ exchangeEdit: {} }, {});

          expect(buildMarketError).toHaveBeenCalledWith(ExchangeMarketStatus.Open);
        });

        it("should call buildPlaceError", () => {
          setupCompleteDataMocks();
          getConnectedBetslipMappedState({ exchangePlaceError: "some error" }, {});

          expect(buildPlaceError).toHaveBeenCalledWith(ExchangeMarketStatus.Open, "some error", "some currencySymbol");
        });

        it("should call buildPriceError", () => {
          setupCompleteDataMocks();
          getConnectedBetslipMappedState({ exchangeEdit: {} }, {});

          expect(buildPriceError).toHaveBeenCalledWith(ExchangeMarketStatus.Open, "somePriceValidation", 1.23);
        });

        it("should call buildSizeError", () => {
          setupCompleteDataMocks();
          getConnectedBetslipMappedState({ exchangeEdit: {} }, {});

          expect(buildSizeError).toHaveBeenCalledWith(
            ExchangeMarketStatus.Open,
            "some user details",
            "someSizeValidation",
          );
        });
      });

      describe("and `getUserDetails` throws", () => {
        it("should call console.error with the error thrown from `getUserDetails`", () => {
          setupCompleteDataMocks();
          const GET_USER_DETAILS_ERROR = "GET_USER_DETAILS_ERROR";
          getUserDetails.mockImplementationOnce(() => {
            throw new Error(GET_USER_DETAILS_ERROR);
          });

          getConnectedBetslipMappedState({ exchangeEdit: {} }, {});

          expect(global.console.error).toHaveBeenCalledWith(new Error("GET_USER_DETAILS_ERROR"));
        });

        it("should return an empty object", () => {
          setupCompleteDataMocks();
          const GET_USER_DETAILS_ERROR = "GET_USER_DETAILS_ERROR";
          getUserDetails.mockImplementationOnce(() => {
            throw new Error(GET_USER_DETAILS_ERROR);
          });

          expect(getConnectedBetslipMappedState({ exchangeEdit: {} }, {})).toEqual({});
        });
      });

      describe("isDepositRequired", () => {
        describe("when there is no INSUFFICIENT_FUNDS error", () => {
          it("should return false", () => {
            setupCompleteDataMocks();
            const { isDepositRequired } = getConnectedBetslipMappedState({}, {});

            expect(isDepositRequired).toEqual(false);
          });
        });

        describe("when there is an INSUFFICIENT_FUNDS error", () => {
          it("should return true", () => {
            setupCompleteDataMocks();
            const { isDepositRequired } = getConnectedBetslipMappedState(
              { exchangePlaceError: { errorCode: "INSUFFICIENT_FUNDS" } },
              {},
            );

            expect(isDepositRequired).toEqual(true);
          });
        });
      });

      describe("placeLabel", () => {
        describe("when isDepositRequired is true", () => {
          it("should return deposit to place bet label", () => {
            setupCompleteDataMocks();

            const { placeLabel } = getConnectedBetslipMappedState(
              { exchangePlaceError: { errorCode: "INSUFFICIENT_FUNDS" } },
              {},
            );

            expect(placeLabel).toEqual("I18N.BETSLIP.DEPOSIT_TO_PLACE_BET");
          });
        });
      });

      describe("loadingLabel", () => {
        describe("when isDepositRequired is true", () => {
          it("should return empty string", () => {
            setupCompleteDataMocks();

            const { loadingLabel } = getConnectedBetslipMappedState(
              { exchangePlaceError: { errorCode: "INSUFFICIENT_FUNDS" } },
              {},
            );

            expect(loadingLabel).toEqual("");
          });
        });
      });

      describe("and none of price, size or persistenceType were changed", () => {
        it("should return the expected state where all fields are enabled and update button disabled", () => {
          setupCompleteDataMocks();
          getEditingBetState.mockReturnValue({
            persistenceType: "LAPSE",
            isValid: true,
            hasPriceChanged: false,
            hasSizeChanged: false,
            hasPersistenceTypeChanged: false,
          });

          const mappedProps = getConnectedBetslipMappedState();

          expect(mappedProps.isPriceDisabled).toBe(false);
          expect(mappedProps.isSizeDisabled).toBe(false);
          expect(mappedProps.isUpdateButtonDisabled).toBe(true);
        });
      });

      describe("and price field was changed", () => {
        it("should return the expected state with size and update button enabled and all others disabled", () => {
          setupCompleteDataMocks();
          getEditingBetState.mockReturnValue({
            persistenceType: "LAPSE",
            isValid: true,
            hasPriceChanged: true,
            hasSizeChanged: false,
            hasPersistenceTypeChanged: false,
          });

          const mappedProps = getConnectedBetslipMappedState();

          expect(mappedProps.isPriceDisabled).toBe(false);
          expect(mappedProps.isSizeDisabled).toBe(true);
          expect(mappedProps.isUpdateButtonDisabled).toBe(false);
        });
      });

      describe("and persistenceType field was changed", () => {
        it("should return the expected state with persistenceType and update button enabled and all others disabled", () => {
          setupCompleteDataMocks();
          getEditingBetState.mockReturnValue({
            persistenceType: "LAPSE",
            isValid: true,
            hasPriceChanged: false,
            hasSizeChanged: false,
            hasPersistenceTypeChanged: true,
          });

          const mappedProps = getConnectedBetslipMappedState();

          expect(mappedProps.isPriceDisabled).toBe(true);
          expect(mappedProps.isSizeDisabled).toBe(true);
          expect(mappedProps.isUpdateButtonDisabled).toBe(false);
        });
      });
    });

    describe("and betting state is not valid", () => {
      it("should return the expected state with update button disabled", () => {
        setupCompleteDataMocks();
        getEditingBetState.mockReturnValue({
          persistenceType: "LAPSE",
          isValid: false,
          hasPriceChanged: false,
          hasSizeChanged: false,
          hasPersistenceTypeChanged: false,
        });

        const mappedProps = getConnectedBetslipMappedState();

        expect(mappedProps.isPriceDisabled).toBe(false);
        expect(mappedProps.isSizeDisabled).toBe(false);
        expect(mappedProps.isUpdateButtonDisabled).toBe(true);
      });
    });

    describe("when betslip is undefined", () => {
      it("should return an empty object", () => {
        setupCompleteDataMocks();

        const state = {
          entities: {},
          betslip: undefined,
        };

        expect(makeMapStateToProps()(state)).toEqual({});
      });
    });

    describe("when editingBetState is null", () => {
      it("should return the base state", () => {
        setupCompleteDataMocks();
        getEditingBetState.mockReturnValue(null);

        const mappedProps = getConnectedBetslipMappedState();

        expect(mappedProps).toEqual(baseState);
      });
    });

    describe("titlePrefix", () => {
      it("should return LAY title prefix when side is LAY", () => {
        setupCompleteDataMocks();
        getEditingBetState.mockReturnValue({
          ...editingBetState,
          side: ExchangeSide.LAY,
        });

        const mappedProps = getConnectedBetslipMappedState();

        expect(mappedProps.titlePrefix).toBe("I18N.BETSLIP.LAY_BET_AGAINST");
      });
    });

    describe("persistenceListSelectedKey", () => {
      it("should return empty string when persistence type is not in options", () => {
        setupCompleteDataMocks();
        getEditingBetState.mockReturnValue({
          ...editingBetState,
          persistenceType: "UNKNOWN_TYPE",
        });

        const mappedProps = getConnectedBetslipMappedState();

        expect(mappedProps.persistenceListSelectedKey).toBe("");
      });
    });
  });

  describe("makeMapDispatchToProps", () => {
    it("should return the expected dispatchers", () => {
      const dispatchers = makeMapDispatchToProps();

      expect(Object.keys(dispatchers)).toEqual([
        "dispatchUnmatchedCancel",
        "dispatchUnmatchedUpdate",
        "dispatchUnmatchedDone",
        "dispatchUnmatchedPersistenceItemClick",
        "dispatchUnmatchedPersistenceListClick",
        "dispatchEditPriceInputChange",
        "dispatchEditPriceInputBlur",
        "dispatchEditSizeInputChange",
        "dispatchEditSizeInputBlur",
        "dispatchEditPriceNudgeUp",
        "dispatchEditPriceNudgeDown",
        "dispatchEditSizeNudgeUp",
        "dispatchEditSizeNudgeDown",
        "dispatchDepositRedirect",
        "dispatchNavigate",
      ]);
    });

    describe("dispatchUnmatchedCancel", () => {
      it("should dispatch UI__BETSLIP_EXC_UNMATCHED_CANCEL_CLICK", () => {
        const dispatchMock = jest.fn();
        const { dispatchUnmatchedCancel } = makeMapDispatchToProps(dispatchMock);

        dispatchUnmatchedCancel(["betId"], "runner1");

        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith({
          type: UI__BETSLIP_EXC_UNMATCHED_CANCEL_CLICK,
          payload: {
            instructions: { betIds: ["betId"], runner: "runner1" },
          },
        });
      });
    });

    describe("dispatchUnmatchedUpdate", () => {
      it("should dispatch UI__BETSLIP_EXC_UNMATCHED_UPDATE_CLICK", () => {
        const dispatchMock = jest.fn();
        const { dispatchUnmatchedUpdate } = makeMapDispatchToProps(dispatchMock);

        dispatchUnmatchedUpdate("betId", "market1", "runner1", "some url");

        expect(dispatchMock).toHaveBeenNthCalledWith(1, {
          type: UI__BETSLIP_EXC_UNMATCHED_UPDATE_CLICK,
          payload: {
            betId: "betId",
            market: "market1",
            runner: "runner1",
            betOriginURL: "some url",
          },
        });
      });

      it("should dispatch BETTING__EXC_UNMATCHED_UPDATE", () => {
        const dispatchMock = jest.fn();
        const { dispatchUnmatchedUpdate } = makeMapDispatchToProps(dispatchMock);

        dispatchUnmatchedUpdate("betId", "market1", "runner1", "some url");

        expect(dispatchMock).toHaveBeenNthCalledWith(2, {
          type: BETTING__EXC_UNMATCHED_UPDATE,
          payload: {
            betId: "betId",
            market: "market1",
            runner: "runner1",
            betOriginURL: "some url",
          },
        });
      });
    });

    describe("dispatchUnmatchedDone", () => {
      it("should dispatch UI__BETSLIP_EXC_UNMATCHED_DONE_CLICK", () => {
        const dispatchMock = jest.fn();
        const { dispatchUnmatchedDone } = makeMapDispatchToProps(dispatchMock);

        dispatchUnmatchedDone();

        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith({
          type: UI__BETSLIP_EXC_UNMATCHED_DONE_CLICK,
        });
      });
    });

    describe("dispatchUnmatchedPersistenceItemClick", () => {
      it("should dispatch UI__BETSLIP_EXC_UNMATCHED_PERSISTENCE_ITEM_CLICK", () => {
        const dispatchMock = jest.fn();
        const { dispatchUnmatchedPersistenceItemClick } = makeMapDispatchToProps(dispatchMock);

        dispatchUnmatchedPersistenceItemClick("betId007", "some persistenceType");

        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith({
          type: UI__BETSLIP_EXC_UNMATCHED_PERSISTENCE_ITEM_CLICK,
          payload: { betId: "betId007", persistenceType: "some persistenceType" },
        });
      });
    });

    describe("dispatchUnmatchedPersistenceListClick", () => {
      it("should dispatch UI__BETSLIP_EXC_UNMATCHED_PERSISTENCE_LIST_CLICK", () => {
        const dispatchMock = jest.fn();
        const { dispatchUnmatchedPersistenceListClick } = makeMapDispatchToProps(dispatchMock);

        dispatchUnmatchedPersistenceListClick("betId007", false);

        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith({
          type: UI__BETSLIP_EXC_UNMATCHED_PERSISTENCE_LIST_CLICK,
          payload: {
            betId: "betId007",
            isPersistenceTypeMenuExpanded: false,
          },
        });
      });
    });

    describe("dispatchEditPriceInputChange", () => {
      it("should dispatch UI__BETSLIP_EXC_UNMATCHED_PRICE_INPUT_CHANGE & BETTING__UPDATE_UNMATCHED_BET_ACTION", () => {
        const dispatchMock = jest.fn();

        const { dispatchEditPriceInputChange } = makeMapDispatchToProps(dispatchMock);

        dispatchEditPriceInputChange("some runner", "some betId", "some side", "some price", "some size");

        expect(dispatchMock).toHaveBeenCalledTimes(2);
        expect(dispatchMock).toHaveBeenCalledWith({
          type: UI__BETSLIP_EXC_UNMATCHED_PRICE_INPUT_CHANGE,
          payload: {
            runner: "some runner",
            side: "some side",
            price: "some price",
            size: "some size",
          },
        });
        expect(dispatchMock).toHaveBeenCalledWith({
          type: BETTING__UPDATE_UNMATCHED_BET_ACTION,
          payload: {
            runner: "some runner",
            betId: "some betId",
            price: "some price",
            size: "some size",
            side: "some side",
          },
        });
      });
    });

    describe("dispatchEditPriceInputBlur", () => {
      it("should dispatch UI__BETSLIP_EXC_UNMATCHED_PRICE_INPUT_BLUR & BETTING__UPDATE_UNMATCHED_BET_ACTION", () => {
        const dispatchMock = jest.fn();

        const { dispatchEditPriceInputBlur } = makeMapDispatchToProps(dispatchMock);

        dispatchEditPriceInputBlur("some runner", "some betId", "some side", "some price", "some size");

        expect(dispatchMock).toHaveBeenCalledTimes(2);
        expect(dispatchMock).toHaveBeenCalledWith({
          type: UI__BETSLIP_EXC_UNMATCHED_PRICE_INPUT_BLUR,
          payload: {
            runner: "some runner",
            side: "some side",
            price: "some price",
            size: "some size",
          },
        });
        expect(dispatchMock).toHaveBeenCalledWith({
          type: BETTING__UPDATE_UNMATCHED_BET_ACTION,
          payload: {
            runner: "some runner",
            betId: "some betId",
            price: "some price",
            size: "some size",
            side: "some side",
          },
        });
      });
    });

    describe("dispatchEditSizeInputChange", () => {
      it("should dispatch UI__BETSLIP_EXC_UNMATCHED_SIZE_INPUT_CHANGE & BETTING__UPDATE_UNMATCHED_BET_ACTION", () => {
        const dispatchMock = jest.fn();

        const { dispatchEditSizeInputChange } = makeMapDispatchToProps(dispatchMock);

        dispatchEditSizeInputChange("some runner", "some betId", "some side", "some size", "some price");

        expect(dispatchMock).toHaveBeenCalledWith({
          type: UI__BETSLIP_EXC_UNMATCHED_SIZE_INPUT_CHANGE,
          payload: {
            runner: "some runner",
            side: "some side",
            size: "some size",
            price: "some price",
          },
        });
        expect(dispatchMock).toHaveBeenCalledWith({
          type: BETTING__UPDATE_UNMATCHED_BET_ACTION,
          payload: {
            runner: "some runner",
            betId: "some betId",
            price: "some price",
            size: "some size",
            side: "some side",
          },
        });
      });
    });

    describe("dispatchEditSizeInputBlur", () => {
      it("should dispatch BETTING__UPDATE_UNMATCHED_BET_ACTION", () => {
        const dispatchMock = jest.fn();

        const { dispatchEditSizeInputBlur } = makeMapDispatchToProps(dispatchMock);

        dispatchEditSizeInputBlur("some runner", "some betId", "some side", "some price", "some size");

        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith({
          type: BETTING__UPDATE_UNMATCHED_BET_ACTION,
          payload: {
            runner: "some runner",
            betId: "some betId",
            price: "some price",
            size: "some size",
            side: "some side",
          },
        });
      });
    });

    describe("dispatchEditPriceNudgeUp", () => {
      it("should UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_UP & BETTING__NUDGE_UP_UNMATCHED_BET_ACTION", () => {
        const dispatchMock = jest.fn();

        const { dispatchEditPriceNudgeUp } = makeMapDispatchToProps(dispatchMock);

        dispatchEditPriceNudgeUp("some runner", "some betId", "some side");

        expect(dispatchMock).toHaveBeenCalledTimes(2);
        expect(dispatchMock).toHaveBeenCalledWith({
          type: UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_UP,
          payload: {
            runner: "some runner",
            betId: "some betId",
            side: "some side",
          },
        });
        expect(dispatchMock).toHaveBeenCalledWith({
          type: BETTING__NUDGE_UP_UNMATCHED_BET_ACTION,
          payload: {
            runner: "some runner",
            betId: "some betId",
            input: "price",
          },
        });
      });
    });

    describe("dispatchEditPriceNudgeDown", () => {
      it("should UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_DOWN & BETTING__NUDGE_DOWN_UNMATCHED_BET_ACTION", () => {
        const dispatchMock = jest.fn();

        const { dispatchEditPriceNudgeDown } = makeMapDispatchToProps(dispatchMock);

        dispatchEditPriceNudgeDown("some runner", "some betId", "some side");

        expect(dispatchMock).toHaveBeenCalledTimes(2);
        expect(dispatchMock).toHaveBeenCalledWith({
          type: UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_DOWN,
          payload: {
            runner: "some runner",
            betId: "some betId",
            side: "some side",
          },
        });
        expect(dispatchMock).toHaveBeenCalledWith({
          type: BETTING__NUDGE_DOWN_UNMATCHED_BET_ACTION,
          payload: {
            runner: "some runner",
            betId: "some betId",
            input: "price",
          },
        });
      });
    });

    describe("dispatchEditSizeNudgeUp", () => {
      it("BETTING__NUDGE_UP_UNMATCHED_BET_ACTION", () => {
        const dispatchMock = jest.fn();

        const { dispatchEditSizeNudgeUp } = makeMapDispatchToProps(dispatchMock);

        dispatchEditSizeNudgeUp("some runner", "some betId");

        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith({
          type: BETTING__NUDGE_UP_UNMATCHED_BET_ACTION,
          payload: {
            runner: "some runner",
            betId: "some betId",
            input: "size",
          },
        });
      });
    });

    describe("dispatchEditSizeNudgeDown", () => {
      it("BETTING__NUDGE_DOWN_UNMATCHED_BET_ACTION", () => {
        const dispatchMock = jest.fn();

        const { dispatchEditSizeNudgeDown } = makeMapDispatchToProps(dispatchMock);

        dispatchEditSizeNudgeDown("some runner", "some betId");

        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith({
          type: BETTING__NUDGE_DOWN_UNMATCHED_BET_ACTION,
          payload: {
            runner: "some runner",
            betId: "some betId",
            input: "size",
          },
        });
      });
    });

    describe("dispatchDepositRedirect", () => {
      it("should dispatch BettingDepositToPlaceBetAction", () => {
        const dispatch = jest.fn();
        const { dispatchDepositRedirect } = makeMapDispatchToProps(dispatch);

        dispatchDepositRedirect();

        expect(dispatch).toHaveBeenCalledWith({ type: BETTING__DEPOSIT_TO_PLACE_BET });
      });
    });

    describe("dispatchNavigate", () => {
      it("should dispatch PushAction", () => {
        const dispatch = jest.fn();
        const { dispatchNavigate } = makeMapDispatchToProps(dispatch);

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
});
