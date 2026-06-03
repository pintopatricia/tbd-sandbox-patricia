import { BET_TYPES } from "@ppb/betslip-core";

import betslipReducer from "./betslip-card-reducer";
import handicapMovementReducer from "./betslip-handicap-movement-reducer";

import {
  UI__BETSLIP_EXC_RECEIPT_PANEL_DONE_CLICK,
  UI__BETSLIP_EXC_UNMATCHED_DONE_CLICK,
  UI__BETSLIP_EXC_CONFIRM_PANEL_BACK_CLICK,
  NETWORK__PLACE_EXC_BET_IN_PROGRESS,
  NETWORK__PLACE_EXC_BET_SUCCESS,
  NETWORK__PLACE_EXC_BET_FAILURE,
  NETWORK__UPDATE_EXC_BET_IN_PROGRESS,
  NETWORK__UPDATE_EXC_BET_SUCCESS,
  NETWORK__UPDATE_EXC_BET_FAILURE,
  NETWORK__PLACE_SBK_BET_IN_PROGRESS,
  NETWORK__PLACE_SBK_BET_SUCCESS,
  NETWORK__PLACE_SBK_BET_FAILURE,
  UI__BETSLIP_EXC_REPORT_EDIT_BET_CLICK,
  UI__BETSLIP_EXC_UNMATCHED_PERSISTENCE_LIST_CLICK,
  NETWORK__SEARCH_EXC_ORDERS_SUCCESS,
  NETWORK__CANCEL_EXC_BET_IN_PROGRESS,
  NETWORK__CANCEL_EXC_BET_SUCCESS,
  NETWORK__CANCEL_EXC_BET_FAILURE,
  UI__BETSLIP_SBK_MULTIPLE_BET_TYPE_CLICK,
  UI__BETSLIP_EXC_BONUS_CHANGE,
  UI__BETSLIP_EXC_REMOVE_POTENTIAL_BET_CLICK,
  UI__BETSLIP_SBK_REMOVE_LEG_CLICK,
  UI__BETSLIP_CLOSE_CLICK,
  UI__BETSLIP_SBK_RE_ADD_SELECTIONS_CLICK,
  UI__BETSLIP_SET_COLLAPSE_ACTION,
  UI__BETSLIP_DISMISS_BET_BUILDER_MULTIS_NOTIFICATION_ACTION,
  UI__BETSLIP_EXC_SIZE_INPUT_CHANGE,
  UI__BETSLIP_EXC_PRICE_INPUT_CHANGE,
  UI__BETSLIP_EXC_PRICE_NUDGE_UP,
  UI__BETSLIP_EXC_PRICE_NUDGE_DOWN,
  UI__BETSLIP_EXC_INCREMENT_SIZE_ACTION,
  UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_DOWN,
  UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_UP,
  UI__BETSLIP_EXC_UNMATCHED_PRICE_INPUT_CHANGE,
  UI__BETSLIP_EXC_UNMATCHED_SIZE_INPUT_CHANGE,
  UI__BETSLIP_MAX_PAYOUT_NOTIFICATION_ACCEPTED,
  UI__BETSLIP_SBK_CONFIRM_CAST_BET_CHANGE,
  NETWORK__OBB_PLACE_BET_SUCCESS,
  UI__BETSLIP_OBB_RECEIPT_PANEL_DONE_CLICK,
  NETWORK__OBB_PLACE_BET_FAILURE,
  NETWORK__SBK_COMBINATIONS_UPDATE_SUCCESS,
  UI__BETSLIP_COLLAPSE_ACTION,
  UI__BETSLIP_SET_LAST_SUCCESSFUL_STAKE,
  UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE,
} from "../../actions/betslip";
import {
  UI__MARKET_EXC_BET_BUTTON_CLICK,
  UI__MARKET_SBK_BET_BUTTON_CLICK,
  BETTING__DEPOSIT_TO_PLACE_BET,
  BETTING__DEPOSIT_TO_PLACE_CANCEL,
  BETTING__EXC_PLACE_BETS,
  BETTING__SBK_PLACE_BETS,
  BETTING__SBK_CREATE_SPORTSBOOK_CONFIRMATION,
  BETTING__SBK_REMOVE_SPORTSBOOK_CONFIRMATION,
  BETTING__SBK_CONFIRMATION_ODDS_MOVEMENT,
  BETTING__ADD_POTENTIAL_BET_ACTION,
  BETTING__SBK_STATE_UPDATE,
  BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS,
  BETTING__SBK_LOAD_STORAGE_SUCCESS,
  BETTING__SBK_CLEAR_ACTION,
  BETTING__BETSLIP_LOAD_MAX_PAYOUT_INFO,
  BETTING__SBK_ADD_SELECTION_TAGGING,
  BETTING__SBK_CONFIRM_BETS,
  BETTING__SBK_EDIT_BETS,
  BETTING__SBK_UPDATE_SPORTSBOOK_CONFIRMATION_FAILURES,
  BETTING__OBB_UPDATE_ODDS_MOVEMENT,
  UI__OBB_BET_BUTTON_CLICK,
  BETTING__OBB_TOGGLE_LEG_ACTION,
  BETTING__SBK_TOGGLE_LEG_ACTION,
  BETTING__SPORTSBOOK_GENEROSITY_WALLET_BET_ACTION,
  BETTING__SPORTSBOOK_GENEROSITY_WALLETS_CLOSE_ACTION,
  BETTING_UPDATE_OBB_TAGGING_METADATA,
  BETTING__SPORTSBOOK_FREE_BETS_WALLETS_APPLY_ACTION,
  BETTING__SBK_TOGGLE_ONE_LINE_LEG_ACTION,
  BETTING__SPORTSBOOK_REMOVE_ALL_COMBINATION_FREE_BETS_WALLETS_ACTION,
  BETTING__SBK_ACCA_INSURANCE_TOGGLE,
  BETTING__SBK_MONEY_BACK_TOGGLE,
  BETTING__SBK_PRICE_BOOST_TOGGLE,
  BETTING__SBK_GHOST_LEG_TOGGLE,
  BETTING__SBK_PLACE_FAILED_UPDATE,
} from "../../actions/betting";
import { BOTTOM_BAR_PUSH, PUSH } from "../../actions";
import { FETCH_USER_WALLETS_SUCCESS } from "../../actions/user-wallets";
import {
  NETWORK__CASHOUT_TAKE_FAILURE,
  NETWORK__CASHOUT_TAKE_FAILURE_SBK,
  NETWORK__CASHOUT_TAKE_SUCCESS,
} from "../../actions/cashout";
import {
  UI__MY_BETS_EXC_EDIT_BET_PRESS,
  UI__MY_BETS_EXC_EDIT_BET_CLOSE,
  UI__MY_BETS_SBK_ADD_PREVIOUS_SELECTIONS_CLICK,
} from "../../actions/my-bets";

import { groupCombinationsByMarketId, isMultiple } from "../../helpers/sportsbook-betting";
import { ExchangeSide } from "../constants";
import { obbOddsMovementReducer, sbkOddsMovementReducer } from "./betslip-odds-movement-reducer";
import { UI__NAVIGATION_TAB_CLICK } from "../../actions/interface";
import { UI__SWITCH_PRODUCT_PREFERENCE } from "../../actions/preferences";
import { ProductsOption } from "../entities/user-preferences/UserPreferences.types";
import {
  NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE,
  NETWORK__FETCH_APP_CONTEXT_SUCCESS,
  NETWORK__INVALID_SESSION,
} from "../../actions/app-context";

jest.mock("../../helpers/sportsbook-betting", () => ({
  isMultiple: jest.fn(),
  groupCombinationsByMarketId: jest.fn().mockReturnValue({}),
}));

jest.mock("./betslip-odds-movement-reducer", () => ({
  __esModule: true,
  sbkOddsMovementReducer: jest.fn().mockReturnValue({ oddsMovement: "state" }),
  obbOddsMovementReducer: jest.fn().mockReturnValue({ oddsMovement: "state" }),
}));

jest.mock("./betslip-handicap-movement-reducer", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({}),
}));

describe('betslip" reducer', () => {
  beforeEach(jest.clearAllMocks);

  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = betslipReducer(undefined, {});

      expect(state).toEqual({
        activeProduct: "NONE",
        obbTaggingMetadata: {},
        isCollapsed: false,
        isFreeBetsSelected: false,
        isBetBuilderMultisNotificationVisible: true,
        hasUserChangedOddsMovementPreference: false,
        step: "PLACE_POTENTIAL",
        placeStatus: "NONE",
        hasSportsbookTechnicalError: false,
        obbOddsMovement: {},
        sportsbookOddsMovement: {},
        sportsbookHandicapMovement: {},
        taggingMetadata: {
          selections: {},
        },
        group: "REAL",
        isDepositRedirect: false,
        showMaxPayoutNotification: true,
        keepOpenOnNavigation: false,
        lastSuccessfulStake: undefined,
      });
    });
  });

  describe("when action type is 'UI/BETSLIP_CLOSE_CLICK'", () => {
    it("should reset to the initial state", () => {
      const state = betslipReducer(
        {
          activeProduct: "EXCHANGE",
          exchangeContext: "some context",
          step: "CANCEL_BET",
        },
        {
          type: UI__BETSLIP_CLOSE_CLICK,
        },
      );

      expect(state).toEqual({
        activeProduct: "NONE",
        isCollapsed: false,
        isFreeBetsSelected: false,
        obbTaggingMetadata: {},
        isBetBuilderMultisNotificationVisible: true,
        hasSportsbookTechnicalError: false,
        step: "PLACE_POTENTIAL",
        placeStatus: "NONE",
        obbOddsMovement: {},
        sportsbookOddsMovement: {},
        sportsbookHandicapMovement: {},
        taggingMetadata: {
          selections: {},
        },
        group: "REAL",
        isDepositRedirect: false,
        exchangeEdit: {
          betId: "",
          isPersistenceTypeMenuExpanded: false,
        },
        showMaxPayoutNotification: true,
        hasUserChangedOddsMovementPreference: false,
        keepOpenOnNavigation: false,
        lastSuccessfulStake: undefined,
      });
    });

    describe("when clicked on bottom sheet", () => {
      it("should reset to the initial state witch correct exchangeEdit", () => {
        const state = betslipReducer(
          {
            activeProduct: "EXCHANGE",
            exchangeContext: "some context",
            step: "CANCEL_BET",
            exchangeEdit: {
              betId: "",
              isPersistenceTypeMenuExpanded: false,
            },
          },
          {
            type: UI__BETSLIP_CLOSE_CLICK,
          },
        );

        expect(state).toEqual({
          activeProduct: "NONE",
          isCollapsed: false,
          isFreeBetsSelected: false,
          obbTaggingMetadata: {},
          isBetBuilderMultisNotificationVisible: true,
          hasSportsbookTechnicalError: false,
          step: "PLACE_POTENTIAL",
          keepOpenOnNavigation: false,
          placeStatus: "NONE",
          obbOddsMovement: {},
          sportsbookOddsMovement: {},
          sportsbookHandicapMovement: {},
          taggingMetadata: {
            selections: {},
          },
          group: "REAL",
          isDepositRedirect: false,
          exchangeEdit: {
            betId: "",
            isPersistenceTypeMenuExpanded: false,
          },
          showMaxPayoutNotification: true,
          hasUserChangedOddsMovementPreference: false,
          lastSuccessfulStake: undefined,
        });
      });
    });
  });

  describe("when action type is 'BETTING/DEPOSIT_TO_PLACE_BET'", () => {
    it("should set isDepositRedirect to true", () => {
      const state = betslipReducer(
        {
          activeProduct: "SPORTSBOOK",
          step: "PLACE_POTENTIAL",
        },
        {
          type: BETTING__DEPOSIT_TO_PLACE_BET,
        },
      );

      expect(state.isDepositRedirect).toEqual(true);
    });

    it("should set exchangePlaceError as undefined", () => {
      const state = betslipReducer(
        {
          exchangePlaceError: {},
          activeProduct: "SPORTSBOOK",
          step: "PLACE_POTENTIAL",
        },
        {
          type: BETTING__DEPOSIT_TO_PLACE_BET,
        },
      );

      expect(state.exchangePlaceError).toEqual(undefined);
    });
  });

  describe("when action type is 'BETTING/DEPOSIT_TO_PLACE_CANCEL,'", () => {
    it("should set isDepositRedirect to true", () => {
      const state = betslipReducer({ isDepositRedirect: true }, { type: BETTING__DEPOSIT_TO_PLACE_CANCEL });

      expect(state).toEqual({ isDepositRedirect: false, hasUserChangedOddsMovementPreference: false });
    });
  });

  describe("when action type is 'BETTING/SBK_PLACE_BETS'", () => {
    it("should set isDepositRedirect to false", () => {
      const state = betslipReducer(
        {
          activeProduct: "SPORTSBOOK",
          step: "PLACE_POTENTIAL",
        },
        {
          type: BETTING__SBK_PLACE_BETS,
        },
      );

      expect(state).toEqual({
        activeProduct: "SPORTSBOOK",
        step: "PLACE_POTENTIAL",
        isDepositRedirect: false,
        hasUserChangedOddsMovementPreference: false,
      });
    });
  });

  describe("when action type is 'BETTING/SBK_CREATE_SPORTSBOOK_CONFIRMATION'", () => {
    it("should return new state with sportsbook confirmation filled", () => {
      const payloadMock = {
        combinations: "combinations mock",
        failures: {},
        legs: "legs mock",
        availabilityChanged: false,
        runners: {},
        castContext: {},
      };
      const { sportsbookConfirmation } = betslipReducer(
        {},
        {
          type: BETTING__SBK_CREATE_SPORTSBOOK_CONFIRMATION,
          payload: payloadMock,
        },
      );

      expect(sportsbookConfirmation).toEqual(payloadMock);
    });
  });

  describe("when action type is 'BETTING/SBK_REMOVE_SPORTSBOOK_CONFIRMATION'", () => {
    it("should return new state with sportsbook confirmation undefined", () => {
      const { sportsbookConfirmation } = betslipReducer(
        {
          sportsbookConfirmation: {
            combinations: "combinations mock",
            ignoredBets: [],
            legs: "legs mock",
          },
        },
        {
          type: BETTING__SBK_REMOVE_SPORTSBOOK_CONFIRMATION,
        },
      );

      expect(sportsbookConfirmation).toBe(undefined);
    });
  });

  describe("when action type is 'BETTING/SBK_CONFIRMATION_ODDS_MOVEMENT'", () => {
    it("should update sportsbook confirmation combinations", () => {
      const state = betslipReducer(
        {
          sportsbookConfirmation: {
            combinations: { combinationId: { id: "combinationId" }, potentialReturns: 10 },
            ignoredBets: ["failure"],
            failures: {},
            legs: {},
            availabilityChanged: false,
            castContext: { id: "id" },
          },
        },
        {
          type: BETTING__SBK_CONFIRMATION_ODDS_MOVEMENT,
          payload: {
            combinations: { combinationId: { id: "combinationId", potentialReturns: 20 } },
          },
        },
      );

      expect(state).toEqual({
        sportsbookConfirmation: {
          combinations: {
            combinationId: {
              id: "combinationId",
              potentialReturns: 20,
            },
          },
          ignoredBets: ["failure"],
          failures: {},
          legs: {},
          runners: {},
          availabilityChanged: false,
          castContext: { id: "id" },
        },
      });
    });
  });

  describe("when action type is BETTING__SBK_UPDATE_SPORTSBOOK_CONFIRMATION_FAILURES", () => {
    it("should return new state with the provided value", () => {
      const state = betslipReducer(
        {
          sportsbookConfirmation: {
            combinations: { combinationId: { id: "combinationId" } },
            ignoredBets: ["failure"],
            failures: {},
            legs: {},
            availabilityChanged: false,
            castContext: { id: "id" },
          },
        },
        {
          type: BETTING__SBK_UPDATE_SPORTSBOOK_CONFIRMATION_FAILURES,
          payload: {
            failures: {
              combinationId: [],
            },
            availabilityChanged: true,
          },
        },
      );

      expect(state).toEqual({
        sportsbookConfirmation: {
          combinations: {
            combinationId: {
              id: "combinationId",
            },
          },
          ignoredBets: ["failure"],
          legs: {},
          runners: {},
          castContext: { id: "id" },
          failures: {
            combinationId: [],
          },
          availabilityChanged: true,
        },
      });
    });
  });

  describe("when action type is 'UI__BETSLIP_SET_COLLAPSE_ACTION'", () => {
    describe('when "collapse" is true', () => {
      it('must return the new state with "isCollapsed" as true', () => {
        const { isCollapsed } = betslipReducer(
          { isCollapsed: true },
          {
            type: UI__BETSLIP_SET_COLLAPSE_ACTION,
            payload: { collapse: true },
          },
        );

        expect(isCollapsed).toEqual(true);
      });
    });

    describe('when "collapse" is false', () => {
      it('must return the new state with "isCollapsed" as false', () => {
        const { isCollapsed } = betslipReducer(
          { isCollapsed: true },
          {
            type: UI__BETSLIP_SET_COLLAPSE_ACTION,
            payload: { collapse: false },
          },
        );

        expect(isCollapsed).toEqual(false);
      });
    });
  });

  describe("when action type is 'UI/MARKET_EXC_BET_BUTTON_CLICK'", () => {
    it("return new state with 'activeProduct' as Exchange", () => {
      const { activeProduct } = betslipReducer(
        {
          isCollapsed: false,
          taggingMetadata: { selections: {} },
        },
        {
          type: UI__MARKET_EXC_BET_BUTTON_CLICK,
          payload: { urn: "dummy:urn", price: 42, side: ExchangeSide.BACK },
        },
      );

      expect(activeProduct).toEqual("EXCHANGE");
    });

    it("should return step set to PLACE_POTENTIAL", () => {
      const { step } = betslipReducer(
        {
          taggingMetadata: { selections: {} },
        },
        {
          type: UI__MARKET_EXC_BET_BUTTON_CLICK,
          payload: { urn: "dummy:urn", price: 42, side: ExchangeSide.BACK },
        },
      );

      expect(step).toEqual("PLACE_POTENTIAL");
    });

    it("should clear exchange context", () => {
      const { exchangeContext } = betslipReducer(
        {
          exchangeContext: {
            market: "some market",
            runner: "some runner",
            side: "some side",
            marketDepth: "some depth",
          },
          taggingMetadata: { selections: {} },
        },
        {
          type: UI__MARKET_EXC_BET_BUTTON_CLICK,
          payload: { urn: "dummy:urn", price: 42, side: ExchangeSide.BACK },
        },
      );

      expect(exchangeContext).toBeUndefined();
    });

    it("should clear any exchange place error", () => {
      const { exchangePlaceError } = betslipReducer(
        {
          exchangePlaceError: "some error",
          taggingMetadata: { selections: {} },
        },
        {
          type: UI__MARKET_EXC_BET_BUTTON_CLICK,
          payload: { urn: "dummy:urn", price: 42, side: ExchangeSide.BACK },
        },
      );

      expect(exchangePlaceError).toBeUndefined();
    });

    it("should clear exchange report", () => {
      const { exchangeReport } = betslipReducer(
        {
          exchangeReport: { result: {}, responseCode: "" },
          taggingMetadata: { selections: {} },
        },
        {
          type: UI__MARKET_EXC_BET_BUTTON_CLICK,
          payload: { urn: "dummy:urn", price: 42, side: ExchangeSide.BACK },
        },
      );

      expect(exchangeReport).toBeUndefined();
    });

    it("should clear exchange edit", () => {
      const { exchangeEdit } = betslipReducer(
        {
          exchangeEdit: { betId: "123456", isPersistenceTypeMenuExpanded: true },
          taggingMetadata: { selections: {} },
        },
        {
          type: UI__MARKET_EXC_BET_BUTTON_CLICK,
          payload: { urn: "dummy:urn", price: 42, side: ExchangeSide.BACK },
        },
      );

      expect(exchangeEdit).toEqual({
        betId: "",
        isPersistenceTypeMenuExpanded: false,
      });
    });

    it("should return isFreeBetsSelected set to false", () => {
      const { isFreeBetsSelected } = betslipReducer(
        {
          taggingMetadata: { selections: {} },
        },
        {
          type: UI__MARKET_EXC_BET_BUTTON_CLICK,
          payload: { urn: "dummy:urn", price: 42, isFreeBetsSelected: true },
        },
      );

      expect(isFreeBetsSelected).toBe(false);
    });

    it("should add a selection entry to the taggingMetadata", () => {
      const { taggingMetadata } = betslipReducer(
        {
          taggingMetadata: { selections: {} },
        },
        {
          type: UI__MARKET_EXC_BET_BUTTON_CLICK,
          payload: { urn: "dummy:urn", uniqueId: "uniqueId" },
        },
      );

      expect(taggingMetadata).toEqual({
        selections: { "dummy:urn": { urn: "dummy:urn", uniqueId: "uniqueId" } },
      });
    });

    describe("when the same selection is added to the Betslip", () => {
      it("should return the selection entry from taggingMetadata with the new uniqueId", () => {
        const { taggingMetadata } = betslipReducer(
          {
            taggingMetadata: { selections: { "dummy:urn": { urn: "dummy:urn", uniqueId: "uniqueId" } } },
          },
          {
            type: UI__MARKET_EXC_BET_BUTTON_CLICK,
            payload: { urn: "dummy:urn", uniqueId: "newUniqueId" },
          },
        );

        expect(taggingMetadata).toEqual({ selections: { "dummy:urn": { urn: "dummy:urn", uniqueId: "newUniqueId" } } });
      });
    });

    describe("when the click is on bottom sheet", () => {
      it("should have the correct exchange edit", () => {
        const { exchangeEdit } = betslipReducer(
          {
            exchangeEdit: {
              betId: "123456",
              isPersistenceTypeMenuExpanded: true,
            },
            taggingMetadata: { selections: {} },
          },
          {
            type: UI__MARKET_EXC_BET_BUTTON_CLICK,
            payload: { urn: "dummy:urn", price: 42, side: ExchangeSide.BACK },
          },
        );

        expect(exchangeEdit).toEqual({
          betId: "",
          isPersistenceTypeMenuExpanded: false,
        });
      });
    });
  });

  describe("when action type is 'BETTING/ADD_POTENTIAL_BET_ACTION'", () => {
    it("should return 'exchangeContext' with runner and side", () => {
      const { exchangeContext } = betslipReducer(null, {
        type: BETTING__ADD_POTENTIAL_BET_ACTION,
        payload: { marketURN: "market:urn", runner: "dummy:urn", side: ExchangeSide.BACK, marketDepth: 1 },
      });
      const { market, runner, side, marketDepth } = exchangeContext;

      expect(market).toEqual("market:urn");
      expect(runner).toEqual("dummy:urn");
      expect(side).toEqual(ExchangeSide.BACK);
      expect(marketDepth).toEqual(1);
    });
  });

  describe.each([BETTING__SBK_ADD_SELECTION_TAGGING, UI__MARKET_SBK_BET_BUTTON_CLICK])(
    "when action type is %s",
    (actionType) => {
      const actionMock = {
        type: actionType,
        payload: { urn: "dummy:urn", price: 42, side: ExchangeSide.BACK },
      };

      it("should return new state with 'activeProduct' as Sportsbook", () => {
        const { activeProduct } = betslipReducer(
          {
            isCollapsed: false,
            taggingMetadata: { selections: {} },
          },
          actionMock,
        );

        expect(activeProduct).toEqual("SPORTSBOOK");
      });

      it("should return new state with 'exchangeContext' cleared", () => {
        const { exchangeContext } = betslipReducer(
          {
            isCollapsed: false,
            exchangeContext: {},
            taggingMetadata: { selections: {} },
          },
          actionMock,
        );

        expect(exchangeContext).toEqual(undefined);
      });

      it("should return step set to PLACE_POTENTIAL", () => {
        const { step } = betslipReducer(
          {
            taggingMetadata: { selections: {} },
          },
          {
            type: actionType,
            payload: { urn: "dummy:urn" },
          },
        );

        expect(step).toEqual("PLACE_POTENTIAL");
      });

      it("should clear any sportsbook technical error", () => {
        const { hasSportsbookTechnicalError } = betslipReducer(
          {
            hasSportsbookTechnicalError: true,
            taggingMetadata: { selections: {} },
          },
          actionMock,
        );

        expect(hasSportsbookTechnicalError).toEqual(false);
      });

      it("should clear sportsbook report", () => {
        const { sportsbookReport } = betslipReducer(
          {
            sportsbookReport: { result: {}, responseCode: "" },
            taggingMetadata: { selections: {} },
          },
          actionMock,
        );

        expect(sportsbookReport).toBeUndefined();
      });

      it("should add a selection entry to the taggingMetadata", () => {
        const { taggingMetadata } = betslipReducer(
          {
            taggingMetadata: { selections: {} },
          },
          {
            type: actionType,
            payload: { urn: "dummy:urn", uniqueId: "uniqueId" },
          },
        );

        expect(taggingMetadata).toEqual({
          selections: { "dummy:urn": { urn: "dummy:urn", uniqueId: "uniqueId" } },
        });
      });

      describe("when the same selection is added to the Betslip", () => {
        it("should return the selection entry from taggingMetadata with the new uniqueId", () => {
          const { taggingMetadata } = betslipReducer(
            {
              taggingMetadata: { selections: { "dummy:urn": { urn: "dummy:urn", uniqueId: "uniqueId" } } },
            },
            {
              type: actionType,
              payload: { urn: "dummy:urn", uniqueId: "newUniqueId" },
            },
          );

          expect(taggingMetadata).toEqual({
            selections: { "dummy:urn": { urn: "dummy:urn", uniqueId: "newUniqueId" } },
          });
        });
      });

      describe("when there are already 25 selections in the Betslip and I add another one", () => {
        it("should not update the state with the new selection", () => {
          const selections = new Array(25).fill(null).reduce((acc, _, i) => {
            const urn = `runner:${i + 1}`;
            acc[urn] = { id: urn, timestamp: 1622138467422 };

            return acc;
          }, {});

          const { taggingMetadata } = betslipReducer(
            {
              taggingMetadata: { selections },
            },
            {
              type: actionType,
              payload: { urn: "urn:26" },
            },
          );

          expect(Object.keys(taggingMetadata.selections).length).toEqual(25);
        });
      });
    },
  );

  describe("when action type is 'UI/OBB_BET_BUTTON_CLICK'", () => {
    it("return new state with 'activeProduct' as Sportsbook", () => {
      const { activeProduct } = betslipReducer(
        {
          activeProduct: "NONE",
        },
        {
          type: UI__OBB_BET_BUTTON_CLICK,
        },
      );

      expect(activeProduct).toEqual("SPORTSBOOK");
    });

    it("should return step set to PLACE_POTENTIAL", () => {
      const { step } = betslipReducer(
        {
          step: "REPORT",
        },
        {
          type: UI__OBB_BET_BUTTON_CLICK,
        },
      );

      expect(step).toEqual("PLACE_POTENTIAL");
    });

    it("should clear any sportsbook technical error", () => {
      const { hasSportsbookTechnicalError } = betslipReducer(
        { hasSportsbookTechnicalError: true },
        {
          type: UI__OBB_BET_BUTTON_CLICK,
        },
      );

      expect(hasSportsbookTechnicalError).toBe(false);
    });

    it("should clear sportsbook report", () => {
      const { sportsbookReport } = betslipReducer(
        { sportsbookReport: { result: {}, responseCode: "" } },
        {
          type: UI__OBB_BET_BUTTON_CLICK,
        },
      );

      expect(sportsbookReport).toBeUndefined();
    });

    it("should return exchangeContext undefined", () => {
      const { exchangeContext } = betslipReducer(
        { exchangeContext: "some exchange context" },
        {
          type: UI__OBB_BET_BUTTON_CLICK,
        },
      );

      expect(exchangeContext).toBeUndefined();
    });
  });

  describe("when action type is 'BETTING/SBK_TOGGLE_ONE_LINE_LEG_ACTION'", () => {
    it("return new state with 'activeProduct' as Sportsbook", () => {
      const { activeProduct } = betslipReducer(
        {
          activeProduct: "NONE",
        },
        {
          type: BETTING__SBK_TOGGLE_ONE_LINE_LEG_ACTION,
        },
      );

      expect(activeProduct).toEqual("SPORTSBOOK");
    });

    it("should return step set to PLACE_POTENTIAL", () => {
      const { step } = betslipReducer(
        {
          step: "REPORT",
        },
        {
          type: BETTING__SBK_TOGGLE_ONE_LINE_LEG_ACTION,
        },
      );

      expect(step).toEqual("PLACE_POTENTIAL");
    });

    it("should clear any sportsbook technical error", () => {
      const { hasSportsbookTechnicalError } = betslipReducer(
        { hasSportsbookTechnicalError: true },
        {
          type: BETTING__SBK_TOGGLE_ONE_LINE_LEG_ACTION,
        },
      );

      expect(hasSportsbookTechnicalError).toBe(false);
    });

    it("should clear sportsbook report", () => {
      const { sportsbookReport } = betslipReducer(
        { sportsbookReport: { result: {}, responseCode: "" } },
        {
          type: BETTING__SBK_TOGGLE_ONE_LINE_LEG_ACTION,
        },
      );

      expect(sportsbookReport).toBeUndefined();
    });

    it("should return exchangeContext undefined", () => {
      const { exchangeContext } = betslipReducer(
        { exchangeContext: "some exchange context" },
        {
          type: BETTING__SBK_TOGGLE_ONE_LINE_LEG_ACTION,
        },
      );

      expect(exchangeContext).toBeUndefined();
    });
  });

  describe("when action type is 'BETTING/SBK_ENSURE_SELECTION_DATA_SUCCESS'", () => {
    it("should return 'activeProduct' as Sportsbook", () => {
      const { activeProduct } = betslipReducer(
        { taggingMetadata: { selections: {} } },
        {
          type: BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS,
          payload: { selections: [{ runnerUrn: "runner:urn", marketUrn: "market:urn" }], timestamp: 42 },
        },
      );

      expect(activeProduct).toEqual("SPORTSBOOK");
    });

    it("should return step set to PLACE_POTENTIAL", () => {
      const { step } = betslipReducer(
        { taggingMetadata: { selections: {} } },
        {
          type: BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS,
          payload: { selections: [{ runnerUrn: "runner:urn", marketUrn: "market:urn" }], timestamp: 42 },
        },
      );

      expect(step).toEqual("PLACE_POTENTIAL");
    });

    it("should update taggingMetadata", () => {
      const { taggingMetadata } = betslipReducer(
        { taggingMetadata: { selections: {} } },
        {
          type: BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS,
          payload: { selections: [{ runnerUrn: "runner:urn", marketUrn: "market:urn", uniqueId: "uniqueId" }] },
        },
      );

      expect(taggingMetadata).toEqual({ selections: { "runner:urn": { urn: "runner:urn", uniqueId: "uniqueId" } } });
    });

    it("should clear any sportsbook technical error", () => {
      const { hasSportsbookTechnicalError } = betslipReducer(
        { hasSportsbookTechnicalError: true, taggingMetadata: { selections: {} } },
        {
          type: BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS,
          payload: { selections: [{ runnerUrn: "runner:urn", marketUrn: "market:urn" }], timestamp: 42 },
        },
      );

      expect(hasSportsbookTechnicalError).toBe(false);
    });

    it("should clear sportsbook report", () => {
      const { sportsbookReport } = betslipReducer(
        { sportsbookReport: { result: {}, responseCode: "" }, taggingMetadata: { selections: {} } },
        {
          type: BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS,
          payload: { selections: [{ runnerUrn: "runner:urn", marketUrn: "market:urn" }], timestamp: 42 },
        },
      );

      expect(sportsbookReport).toBeUndefined();
    });

    it("should return exchangeContext undefined", () => {
      const { exchangeContext } = betslipReducer(
        { exchangeContext: "some exchange context", taggingMetadata: { selections: {} } },
        {
          type: BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS,
          payload: { selections: [{ runnerUrn: "runner:urn", marketUrn: "market:urn" }], timestamp: 42 },
        },
      );

      expect(exchangeContext).toBeUndefined();
    });
  });

  describe("when action type is 'UI/BETSLIP_EXC_MATCHED_PANEL_DONE_CLICK'", () => {
    it("return new state with 'isCollapsed' true", () => {
      const { isCollapsed } = betslipReducer(
        { isCollapsed: false },
        {
          type: UI__BETSLIP_EXC_RECEIPT_PANEL_DONE_CLICK,
        },
      );

      expect(isCollapsed).toEqual(true);
    });

    it("return new state with 'exchangeReport' empty", () => {
      const { exchangeReport } = betslipReducer(
        { exchangeReport: { result: {}, responseCode: "" } },
        {
          type: UI__BETSLIP_EXC_RECEIPT_PANEL_DONE_CLICK,
        },
      );

      expect(exchangeReport).toBeUndefined();
    });

    it("return new state with 'exchangeEdit' with default data", () => {
      const { exchangeEdit } = betslipReducer(
        { exchangeEdit: { betId: "123456", isPersistenceTypeMenuExpanded: true } },
        {
          type: UI__BETSLIP_EXC_RECEIPT_PANEL_DONE_CLICK,
        },
      );

      expect(exchangeEdit).toEqual({
        betId: "",
        isPersistenceTypeMenuExpanded: false,
      });
    });

    it("return new state with 'context' undefined", () => {
      const { exchangeContext } = betslipReducer(
        { exchangeContext: { runner: "dummy:urn" } },
        {
          type: UI__BETSLIP_EXC_RECEIPT_PANEL_DONE_CLICK,
        },
      );

      expect(exchangeContext).toBeUndefined();
    });

    describe("when the click is on bottom sheet", () => {
      it("should have the correct exchange edit", () => {
        const { exchangeEdit } = betslipReducer(
          {
            exchangeEdit: {
              betId: "123456",
              isPersistenceTypeMenuExpanded: true,
            },
            taggingMetadata: { selections: {} },
          },
          {
            type: UI__BETSLIP_EXC_RECEIPT_PANEL_DONE_CLICK,
          },
        );

        expect(exchangeEdit).toEqual({
          betId: "",
          isPersistenceTypeMenuExpanded: false,
        });
      });
    });
  });

  describe("when action type is 'UI/BETSLIP_SBK_CONFIRM_CAST_BET_CHANGE'", () => {
    const setup = ({
      currentState = {},
      payload = { castId: "XPTO", combinationId: "COMBINATION:1" },
      sportsbookConfirmation,
    } = {}) => {
      const defaultSportsbookConfirmation = {
        sportsbookConfirmation: {
          combinations: { combinationId: { id: "combinationId" } },
          ignoredBets: ["failure"],
          failures: {},
          legs: {},
          availabilityChanged: false,
          runners: ["C1"],
        },
      };

      const action = {
        type: UI__BETSLIP_SBK_CONFIRM_CAST_BET_CHANGE,
        payload,
      };

      return betslipReducer(
        {
          ...currentState,
          sportsbookConfirmation: sportsbookConfirmation
            ? {
                ...defaultSportsbookConfirmation,
                ...sportsbookConfirmation,
              }
            : undefined,
        },
        action,
      );
    };

    describe("state exists", () => {
      it("should return a state with current values", () => {
        const state = setup({ currentState: { XPTO: "XPTO" } });

        expect(state).toEqual({ XPTO: "XPTO" });
      });
    });

    describe("confirmation state does not exists", () => {
      it("should return a sportsbook confirmation as undefined", () => {
        const state = setup();

        expect(state.sportsbookConfirmation).toBeUndefined();
      });
    });

    describe("confirmation state exists", () => {
      it("should return a sportsbook confirmation with current values", () => {
        const { sportsbookConfirmation } = setup({ sportsbookConfirmation: { any: "any" } });

        expect(sportsbookConfirmation).toEqual({ ...sportsbookConfirmation, any: "any" });
      });

      it("should return a sportsbook confirmation with current cast context values", () => {
        const { sportsbookConfirmation } = setup({ sportsbookConfirmation: { any: "any" } });

        expect(sportsbookConfirmation).toEqual({ ...sportsbookConfirmation, any: "any" });
      });
    });

    describe("cast context does not have a value", () => {
      it("should return a new cast context value", () => {
        const { sportsbookConfirmation } = setup({
          sportsbookConfirmation: { castContext: undefined },
          payload: { castId: "XPTO", combinationId: "COMBINATION:1" },
        });

        expect(sportsbookConfirmation.castContext).toEqual({ XPTO: "COMBINATION:1" });
      });
    });

    describe("cast context has a value", () => {
      it("should return new state with actual castContext values", () => {
        const { sportsbookConfirmation } = setup({
          sportsbookConfirmation: { castContext: { XPTA: "COMBINATION:XPTA" } },
          payload: { castId: "XPTO", combinationId: "COMBINATION:1" },
        });

        expect(sportsbookConfirmation.castContext).toEqual({
          XPTA: "COMBINATION:XPTA",
          XPTO: "COMBINATION:1",
        });
      });
    });
  });

  describe("when action type is 'UI/BETSLIP_EXC_UNMATCHED_DONE_CLICK'", () => {
    it("return new state with 'isCollapsed' true", () => {
      const { isCollapsed } = betslipReducer(
        { isCollapsed: false },
        {
          type: UI__BETSLIP_EXC_UNMATCHED_DONE_CLICK,
        },
      );

      expect(isCollapsed).toEqual(true);
    });

    it("return new state with 'exchangeReport' empty", () => {
      const { exchangeReport } = betslipReducer(
        { exchangeReport: { result: {}, responseCode: "" } },
        {
          type: UI__BETSLIP_EXC_UNMATCHED_DONE_CLICK,
        },
      );

      expect(exchangeReport).toBeUndefined();
    });

    it("return new state with 'exchangeEdit' with default content", () => {
      const { exchangeEdit } = betslipReducer(
        { exchangeEdit: { betId: "123456", isPersistenceTypeMenuExpanded: true } },
        {
          type: UI__BETSLIP_EXC_UNMATCHED_DONE_CLICK,
        },
      );

      expect(exchangeEdit).toEqual({
        betId: "",
        isPersistenceTypeMenuExpanded: false,
      });
    });

    it("return new state with 'context' undefined", () => {
      const { exchangeContext } = betslipReducer(
        { exchangeContext: { runner: "dummy:urn" } },
        {
          type: UI__BETSLIP_EXC_UNMATCHED_DONE_CLICK,
        },
      );

      expect(exchangeContext).toBeUndefined();
    });

    describe("when the click is on bottom sheet", () => {
      it("should have the correct exchange edit", () => {
        const { exchangeEdit } = betslipReducer(
          {
            exchangeEdit: {
              betId: "123456",
              isPersistenceTypeMenuExpanded: true,
            },
            taggingMetadata: { selections: {} },
          },
          {
            type: UI__BETSLIP_EXC_UNMATCHED_DONE_CLICK,
          },
        );

        expect(exchangeEdit).toEqual({
          betId: "",
          isPersistenceTypeMenuExpanded: false,
        });
      });
    });
  });

  describe("when action types is 'UI/BETSLIP_EXC_CONFIRM_PANEL_BACK_CLICK'", () => {
    it("should return step set to PLACE_POTENTIAL", () => {
      const { step } = betslipReducer(null, {
        type: UI__BETSLIP_EXC_CONFIRM_PANEL_BACK_CLICK,
      });

      expect(step).toEqual("EDIT_POTENTIAL");
    });

    it("should not have a exchangePlaceError", () => {
      const { exchangePlaceError } = betslipReducer(null, {
        type: UI__BETSLIP_EXC_CONFIRM_PANEL_BACK_CLICK,
      });

      expect(exchangePlaceError).toBeUndefined();
    });
  });

  describe("when action types is 'BETTING/EXC_PLACE_BETS'", () => {
    it("should always return initial state", () => {
      const state = betslipReducer(
        {
          foo: 123,
          step: "foo",
        },
        {
          type: BETTING__EXC_PLACE_BETS,
          payload: {},
        },
      );

      expect(state).toEqual({
        foo: 123,
        step: "foo",
        isDepositRedirect: false,
      });
    });

    describe("when `confirmFirst` is `true` in the payload", () => {
      it("should return step set to CONFIRM_POTENTIAL", () => {
        const { step } = betslipReducer(null, {
          type: BETTING__EXC_PLACE_BETS,
          payload: {
            confirmFirst: true,
          },
        });

        expect(step).toEqual("CONFIRM_POTENTIAL");
      });
    });

    describe("when `confirmFirst` is `false` in the payload", () => {
      it("should return step set to initial state step", () => {
        const { step } = betslipReducer(
          {
            step: "foo",
          },
          {
            type: BETTING__EXC_PLACE_BETS,
            payload: {
              confirmFirst: false,
            },
          },
        );

        expect(step).toEqual("foo");
      });
    });
  });

  describe("when action type is 'BETTING/SBK_CONFIRM_BETS'", () => {
    it("should return new state with step set to CONFIRM_POTENTIAL", () => {
      const { step } = betslipReducer(
        {},
        {
          type: BETTING__SBK_CONFIRM_BETS,
        },
      );

      expect(step).toBe("CONFIRM_POTENTIAL");
    });
  });

  describe("when action type is 'BETTING/SBK_EDIT_BETS'", () => {
    it("should return new state with step set to PLACE_POTENTIAL", () => {
      const { step } = betslipReducer(
        {},
        {
          type: BETTING__SBK_EDIT_BETS,
        },
      );

      expect(step).toBe("PLACE_POTENTIAL");
    });
  });

  describe("when action type is 'UI/BETSLIP_EXC_REPORT_EDIT_BET_CLICK'", () => {
    it("return new state with step set to EDIT_UNMATCHED", () => {
      const { step } = betslipReducer(
        {},
        {
          type: UI__BETSLIP_EXC_REPORT_EDIT_BET_CLICK,
          payload: {
            betId: "betId",
            isPersistenceTypeMenuExpanded: true,
          },
        },
      );

      expect(step).toBe("EDIT_UNMATCHED");
    });

    it("return new state with 'exchangePlaceError' undefined", () => {
      const { exchangePlaceError } = betslipReducer(
        {},
        {
          type: UI__BETSLIP_EXC_REPORT_EDIT_BET_CLICK,
          payload: {
            betId: "betId",
            isPersistenceTypeMenuExpanded: true,
          },
        },
      );

      expect(exchangePlaceError).toBeUndefined();
    });

    describe("exchangeEdit", () => {
      it("return new state with 'betId'", () => {
        const { exchangeEdit } = betslipReducer(
          {},
          {
            type: UI__BETSLIP_EXC_REPORT_EDIT_BET_CLICK,
            payload: {
              betId: "betId",
              isPersistenceTypeMenuExpanded: true,
            },
          },
        );

        expect(exchangeEdit.betId).toBe("betId");
      });

      it("return new state with 'isPersistenceTypeMenuExpanded'", () => {
        const { exchangeEdit } = betslipReducer(
          {},
          {
            type: UI__BETSLIP_EXC_REPORT_EDIT_BET_CLICK,
            payload: {
              betId: "betId",
              isPersistenceTypeMenuExpanded: true,
            },
          },
        );

        expect(exchangeEdit.isPersistenceTypeMenuExpanded).toBe(true);
      });
    });
  });

  describe("when action type is 'UI/MY_BETS_EXC_EDIT_BET_PRESS'", () => {
    it("should return the new state in edit mode for an exchange unmatched bet", () => {
      const state = betslipReducer(
        { stateProps: "stateData" },
        {
          type: UI__MY_BETS_EXC_EDIT_BET_PRESS,
          payload: {
            betId: "betId",
            marketUrn: "marketUrn",
            runner: "runner",
            side: "side",
          },
        },
      );

      expect(state).toEqual({
        stateProps: "stateData",
        isCollapsed: false,
        activeProduct: "EXCHANGE",
        step: "EDIT_UNMATCHED",
        keepOpenOnNavigation: true,
        exchangeEdit: {
          betId: "betId",
          isPersistenceTypeMenuExpanded: false,
          order: undefined,
        },
        exchangeContext: {
          market: "marketUrn",
          runner: "runner",
          side: "side",
          marketDepth: 0,
        },
      });
    });
  });

  describe("when action type is 'UI__MY_BETS_EXC_EDIT_BET_CLOSE'", () => {
    it("should return the new state when close an edit bet for an exchange unmatched bet", () => {
      const state = betslipReducer(
        { stateProps: "stateData" },
        {
          type: UI__MY_BETS_EXC_EDIT_BET_CLOSE,
        },
      );

      expect(state).toEqual({
        stateProps: "stateData",
        exchangeEdit: undefined,
        exchangeContext: undefined,
      });
    });
  });

  describe("when action is BETTING__INVALID_UPDATE_UNMATCHED_BET_ACTION", () => {
    it("should replace exchangeEdit order", () => {
      const initialState = {
        exchangeEdit: {
          betId: "u:123",
          order: {
            price: 1,
            size: 2,
            validations: {},
          },
        },
      };
      const action = {
        type: "BETTING/INVALID_UPDATE_UNMATCHED_BET_ACTION",
        payload: {
          betId: "u:123",
          order: {
            price: 1.23,
            size: 33.33,
            validations: {
              price: undefined,
              size: { isValid: false },
            },
          },
        },
      };

      const state = betslipReducer(initialState, action);

      expect(state).toEqual({
        exchangeEdit: {
          betId: "u:123",
          isPersistenceTypeMenuExpanded: false,
          order: {
            price: 1.23,
            size: 33.33,
            validations: {
              price: undefined,
              size: { isValid: false },
            },
          },
        },
      });
    });

    it("should reset exchangePlaceError", () => {
      const initialState = {
        exchangeEdit: {
          betId: "u:123",
          order: {
            price: 1,
            size: 2,
            validations: {},
          },
        },
        exchangePlaceError: {},
      };
      const action = {
        type: "BETTING/INVALID_UPDATE_UNMATCHED_BET_ACTION",
        payload: {
          betId: "u:123",
          order: {
            price: 1.23,
            size: 33.33,
            validations: {
              price: undefined,
              size: { isValid: false },
            },
          },
        },
      };

      const state = betslipReducer(initialState, action);

      expect(state.exchangePlaceError).toEqual(undefined);
    });

    describe("when the click is on bottom sheet", () => {
      it("should have the correct exchange edit", () => {
        const initialState = {
          exchangeEdit: {
            betId: "u:123",
            order: {
              price: 1,
              size: 2,
              validations: {},
            },
          },
        };
        const action = {
          type: "BETTING/INVALID_UPDATE_UNMATCHED_BET_ACTION",
          payload: {
            betId: "u:123",
            order: {
              price: 1.23,
              size: 33.33,
              validations: {
                price: undefined,
                size: { isValid: false },
              },
            },
          },
        };

        const state = betslipReducer(initialState, action);

        expect(state).toEqual({
          exchangeEdit: {
            betId: "u:123",
            isPersistenceTypeMenuExpanded: false,
            order: {
              price: 1.23,
              size: 33.33,
              validations: {
                price: undefined,
                size: { isValid: false },
              },
            },
          },
        });
      });
    });
  });

  describe("when action is BETTING__VALID_UPDATE_UNMATCHED_BET_ACTION", () => {
    describe("when all fields are set", () => {
      it("should set the editing state", () => {
        const initialState = {
          exchangeEdit: {
            betId: "u:123",
            order: {
              price: 1.23,
              size: 33.33,
              validations: {
                price: undefined,
                size: { isValid: false },
              },
            },
          },
        };
        const action = {
          type: "BETTING/VALID_UPDATE_UNMATCHED_BET_ACTION",
          payload: {
            betId: "u:123",
            order: {
              price: 1.55,
              size: 11.11,
            },
          },
        };

        const state = betslipReducer(initialState, action);

        expect(state).toEqual({
          exchangeEdit: {
            betId: "u:123",
            isPersistenceTypeMenuExpanded: false,
            order: {
              price: 1.55,
              size: 11.11,
              validations: {},
            },
          },
        });
      });

      it("should reset exchangePlaceError", () => {
        const initialState = {
          exchangeEdit: {
            betId: "u:123",
            order: {
              price: 1.23,
              size: 33.33,
              validations: {
                price: undefined,
                size: { isValid: false },
              },
            },
          },
          exchangePlaceError: {},
        };
        const action = {
          type: "BETTING/VALID_UPDATE_UNMATCHED_BET_ACTION",
          payload: {
            betId: "u:123",
            order: {
              price: 1.55,
              size: 11.11,
            },
          },
        };

        const state = betslipReducer(initialState, action);

        expect(state.exchangePlaceError).toEqual(undefined);
      });

      describe("when the click is on bottom sheet", () => {
        it("should have the correct exchange edit", () => {
          const initialState = {
            exchangeEdit: {
              betId: "u:123",
              order: {
                price: 1.23,
                size: 33.33,
                validations: {
                  price: undefined,
                  size: { isValid: false },
                },
              },
            },
          };
          const action = {
            type: "BETTING/VALID_UPDATE_UNMATCHED_BET_ACTION",
            payload: {
              betId: "u:123",
              order: {
                price: 1.55,
                size: 11.11,
              },
            },
          };

          const state = betslipReducer(initialState, action);

          expect(state).toEqual({
            exchangeEdit: {
              betId: "u:123",
              isPersistenceTypeMenuExpanded: false,
              order: {
                price: 1.55,
                size: 11.11,
                validations: {},
              },
            },
          });
        });
      });
    });

    describe("when size is undefined", () => {
      it("should set the size as null", () => {
        const initialState = {
          exchangeEdit: {
            betId: "u:123",
            order: {
              price: 1.23,
              size: 33.33,
              validations: {
                price: undefined,
                size: { isValid: false },
              },
            },
          },
        };
        const action = {
          type: "BETTING/VALID_UPDATE_UNMATCHED_BET_ACTION",
          payload: {
            betId: "u:123",
            order: {
              price: 1.23,
            },
          },
        };

        const state = betslipReducer(initialState, action);

        expect(state).toEqual({
          exchangeEdit: {
            betId: "u:123",
            isPersistenceTypeMenuExpanded: false,
            order: {
              price: 1.23,
              size: null,
              validations: {},
            },
          },
        });
      });
    });

    describe("when price is undefined", () => {
      it("should set the price as null", () => {
        const initialState = {
          exchangeEdit: {
            betId: "u:123",
            order: {
              price: 1.23,
              size: 33.33,
              validations: {
                price: undefined,
                size: { isValid: false },
              },
            },
          },
        };
        const action = {
          type: "BETTING/VALID_UPDATE_UNMATCHED_BET_ACTION",
          payload: {
            betId: "u:123",
            order: {
              size: 1.23,
            },
          },
        };

        const state = betslipReducer(initialState, action);

        expect(state).toEqual({
          exchangeEdit: {
            betId: "u:123",
            isPersistenceTypeMenuExpanded: false,
            order: {
              price: null,
              size: 1.23,
              validations: {},
            },
          },
        });
      });
    });
  });

  describe("when action is UI__BETSLIP_EXC_UNMATCHED_PERSISTENCE_ITEM_CLICK", () => {
    it("should set the new persistenceType maintaining all other state", () => {
      const initialState = {
        exchangeEdit: {
          betId: "u:123",
          order: {
            price: 1.23,
            size: 33.33,
            persistenceType: "HELLO",
            validations: {
              price: undefined,
              size: { isValid: false },
            },
          },
        },
      };
      const action = {
        type: "UI/BETSLIP_EXC_UNMATCHED_PERSISTENCE_ITEM_CLICK",
        payload: {
          betId: "u:123",
          persistenceType: "LAPSE",
        },
      };

      const state = betslipReducer(initialState, action);

      expect(state).toEqual({
        exchangeEdit: {
          betId: "u:123",
          isPersistenceTypeMenuExpanded: false,
          order: {
            price: 1.23,
            size: 33.33,
            persistenceType: "LAPSE",
            validations: {
              price: undefined,
              size: { isValid: false },
            },
          },
        },
      });
    });
  });

  describe("when action type is 'UI/BETSLIP_EXC_UNMATCHED_PERSISTENCE_LIST_CLICK'", () => {
    it("return new state with 'isPersistenceTypeMenuExpanded'", () => {
      const { exchangeEdit } = betslipReducer(
        { exchangeEdit: {} },
        {
          type: UI__BETSLIP_EXC_UNMATCHED_PERSISTENCE_LIST_CLICK,
          payload: {
            isPersistenceTypeMenuExpanded: true,
          },
        },
      );

      expect(exchangeEdit.isPersistenceTypeMenuExpanded).toBe(true);
    });
  });

  describe("when action type is 'UI/BETSLIP_SBK_MULTIPLE_BET_TYPE_CLICK'", () => {
    it("should return sportsbookMultipleContext set to the combinationId", () => {
      isMultiple.mockReturnValue(true);

      const { sportsbookMultipleContext } = betslipReducer(null, {
        type: UI__BETSLIP_SBK_MULTIPLE_BET_TYPE_CLICK,
        payload: {
          combinationId: "combinationId",
        },
      });

      expect(sportsbookMultipleContext).toEqual("combinationId");
    });
  });

  describe("when action type is 'BETTING/SBK_STATE_UPDATE'", () => {
    describe("when there is already a multiple context", () => {
      describe("when the context is no longer valid", () => {
        it("should set sportsbookMultipleContext to the first valid accumulator", () => {
          sbkOddsMovementReducer.mockImplementationOnce((state) => state);
          isMultiple.mockReturnValue(true);

          const { sportsbookMultipleContext } = betslipReducer(
            {
              sportsbookMultipleContext: "C:1",
            },
            {
              type: BETTING__SBK_STATE_UPDATE,
              payload: {
                state: {
                  combinations: {
                    "C:2": {
                      id: "C:2",
                      betType: BET_TYPES.DOUBLE,
                      numLines: 1,
                    },
                  },
                },
              },
            },
          );

          expect(sportsbookMultipleContext).toEqual("C:2");
        });
      });

      describe("when the context is still valid", () => {
        it("should keep current sportsbookMultipleContext", () => {
          sbkOddsMovementReducer.mockImplementationOnce((state) => state);
          isMultiple.mockReturnValue(true);

          const { sportsbookMultipleContext } = betslipReducer(
            {
              sportsbookMultipleContext: "C:1",
            },
            {
              type: BETTING__SBK_STATE_UPDATE,
              payload: {
                state: {
                  combinations: {
                    "C:1": {
                      id: "C:1",
                      betType: BET_TYPES.DOUBLE,
                      numLines: 1,
                    },
                  },
                },
              },
            },
          );

          expect(sportsbookMultipleContext).toEqual("C:1");
        });
      });
    });

    describe("when there is no multiple context", () => {
      it("should set sportsbookMultipleContext to the first valid accumulator with lowest lines", () => {
        sbkOddsMovementReducer.mockImplementationOnce((state) => state);
        isMultiple.mockReturnValueOnce(false);
        isMultiple.mockReturnValueOnce(true);
        isMultiple.mockReturnValueOnce(true);

        const { sportsbookMultipleContext } = betslipReducer(
          {},
          {
            type: BETTING__SBK_STATE_UPDATE,
            payload: {
              state: {
                combinations: {
                  "C:1": {
                    id: "C:1",
                    betType: BET_TYPES.SINGLE,
                    numLines: 1,
                  },
                  "C:2": {
                    id: "C:2",
                    betType: BET_TYPES.DOUBLE,
                    numLines: 2,
                  },
                  "C:3": {
                    id: "C:3",
                    betType: BET_TYPES.TREBLE,
                    numLines: 3,
                  },
                },
              },
            },
          },
        );

        expect(sportsbookMultipleContext).toEqual("C:2");
      });
    });

    describe("when there is no multiple context and no accumulator", () => {
      it("should set sportsbookMultipleContext to undefined", () => {
        sbkOddsMovementReducer.mockImplementationOnce((state) => state);
        const { sportsbookMultipleContext } = betslipReducer(
          {},
          {
            type: BETTING__SBK_STATE_UPDATE,
            payload: {
              state: {
                combinations: {},
              },
            },
          },
        );

        expect(sportsbookMultipleContext).toEqual(undefined);
      });
    });

    describe("when there are no cast combinations", () => {
      it("should set a empty cast context", () => {
        sbkOddsMovementReducer.mockImplementationOnce((state) => state);
        groupCombinationsByMarketId.mockReturnValue({});

        const { sportsbookCastContext } = betslipReducer(
          {},
          {
            type: BETTING__SBK_STATE_UPDATE,
            payload: {
              state: {
                combinations: {},
              },
            },
          },
        );

        expect(sportsbookCastContext).toEqual({});
      });
    });

    describe("when there are new cast combinations", () => {
      it("should set the context with the first combination found", () => {
        sbkOddsMovementReducer.mockImplementationOnce((state) => state);
        groupCombinationsByMarketId.mockReturnValue({
          a1: { id: "a1", combinations: [{ id: "C:1" }, { id: "C:2" }] },
          a2: { id: "a2", combinations: [{ id: "C:3" }, { id: "C:4" }] },
        });

        const { sportsbookCastContext } = betslipReducer(
          {},
          {
            type: BETTING__SBK_STATE_UPDATE,
            payload: {
              state: {
                combinations: {},
              },
            },
          },
        );

        expect(sportsbookCastContext).toEqual({ a1: "C:1", a2: "C:3" });
      });
    });

    describe("when there are new cast combinations with other valid contexts", () => {
      it("should keep part of the context", () => {
        sbkOddsMovementReducer.mockImplementationOnce((state) => state);
        handicapMovementReducer.mockImplementationOnce((state) => state);
        groupCombinationsByMarketId.mockReturnValue({
          a1: { id: "a1", combinations: [{ id: "C:1" }, { id: "C:2" }] },
          a2: { id: "a2", combinations: [{ id: "C:3" }, { id: "C:4" }] },
        });

        const { sportsbookCastContext } = betslipReducer(
          { sportsbookCastContext: { a2: "C:4" } },
          {
            type: BETTING__SBK_STATE_UPDATE,
            payload: {
              state: {
                combinations: {},
              },
            },
          },
        );

        expect(sportsbookCastContext).toEqual({ a1: "C:1", a2: "C:4" });
      });
    });

    describe("when updating odds movement", () => {
      it("should reduce state using odds movement reducer", () => {
        groupCombinationsByMarketId.mockReturnValue({});
        const action = {
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: {
              combinations: {},
            },
          },
        };
        const newState = betslipReducer({}, action);

        expect(sbkOddsMovementReducer).toHaveBeenCalledWith(
          {
            sportsbookMultipleContext: undefined,
            sportsbookCastContext: {},
          },
          action,
        );
        expect(sbkOddsMovementReducer).toHaveBeenCalledTimes(1);
        expect(newState).toEqual(expect.objectContaining({ oddsMovement: "state" }));
      });
    });

    describe("when updating group", () => {
      it("should set group", () => {
        groupCombinationsByMarketId.mockReturnValue({});
        const action = {
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: {
              combinations: {},
            },
            group: "REAL",
          },
        };
        const newState = betslipReducer({}, action);
        expect(newState).toEqual(expect.objectContaining({ group: "REAL" }));
      });
    });
  });

  describe("when action type is 'BETTING/SBK_PLACE_FAILED_UPDATE'", () => {
    describe("when updating odds movement", () => {
      it("should reduce state using odds movement reducer", () => {
        groupCombinationsByMarketId.mockReturnValue({});
        const action = {
          type: BETTING__SBK_PLACE_FAILED_UPDATE,
          payload: {
            state: {
              combinations: {},
            },
          },
        };
        const newState = betslipReducer({}, action);

        expect(sbkOddsMovementReducer).toHaveBeenCalledWith(
          {
            sportsbookMultipleContext: undefined,
            sportsbookCastContext: {},
          },
          action,
        );
        expect(sbkOddsMovementReducer).toHaveBeenCalledTimes(1);
        expect(newState).toEqual(expect.objectContaining({ oddsMovement: "state" }));
      });
    });

    describe("when there are new cast combinations", () => {
      it("should set the context with the first combination found", () => {
        sbkOddsMovementReducer.mockImplementationOnce((state) => state);
        groupCombinationsByMarketId.mockReturnValue({
          a1: { id: "a1", combinations: [{ id: "C:1" }, { id: "C:2" }] },
          a2: { id: "a2", combinations: [{ id: "C:3" }, { id: "C:4" }] },
        });

        const { sportsbookCastContext } = betslipReducer(
          {},
          {
            type: BETTING__SBK_PLACE_FAILED_UPDATE,
            payload: {
              state: {
                combinations: {},
              },
            },
          },
        );

        expect(sportsbookCastContext).toEqual({ a1: "C:1", a2: "C:3" });
      });
    });

    describe("when updating group", () => {
      it("should keep existing group if not provided in payload", () => {
        groupCombinationsByMarketId.mockReturnValue({});
        const action = {
          type: BETTING__SBK_PLACE_FAILED_UPDATE,
          payload: {
            state: {
              combinations: {},
            },
          },
        };
        const newState = betslipReducer({ group: "REAL" }, action);
        expect(newState).toEqual(expect.objectContaining({ group: "REAL" }));
      });
    });
  });

  describe("when action type is 'BETTING/OBB_UPDATE_ODDS_MOVEMENT'", () => {
    it("should reduce state using odds movement reducer", () => {
      const action = {
        type: BETTING__OBB_UPDATE_ODDS_MOVEMENT,
        payload: {
          state: {
            potentialBets: {},
          },
        },
      };

      const newState = betslipReducer({}, action);

      expect(obbOddsMovementReducer).toHaveBeenCalledWith({}, action);
      expect(obbOddsMovementReducer).toHaveBeenCalledTimes(1);
      expect(newState).toEqual(expect.objectContaining({ oddsMovement: "state" }));
    });
  });

  describe("when action type is 'NETWORK__PLACE_EXC_BET_IN_PROGRESS'", () => {
    it("return new state with 'placeStatus' in progress", () => {
      const { placeStatus } = betslipReducer(
        { isCollapsed: false, placeStatus: "FAILURE", exchangeReport: {}, exchangePlaceError: {} },
        {
          type: NETWORK__PLACE_EXC_BET_IN_PROGRESS,
        },
      );

      expect(placeStatus).toEqual("INPROGRESS");
    });
    it("return new state without 'exchangePlaceError'", () => {
      const { exchangePlaceError } = betslipReducer(
        { isCollapsed: false, placeStatus: "FAILURE", exchangeReport: {}, exchangePlaceError: {} },
        {
          type: NETWORK__PLACE_EXC_BET_IN_PROGRESS,
        },
      );

      expect(exchangePlaceError).toBeUndefined();
    });
    it("return new state without 'exchangeReport'", () => {
      const { exchangeReport } = betslipReducer(
        { isCollapsed: false, placeStatus: "FAILURE", exchangeReport: {}, exchangePlaceError: {} },
        {
          type: NETWORK__PLACE_EXC_BET_IN_PROGRESS,
        },
      );

      expect(exchangeReport).toBeUndefined();
    });
  });

  describe("when action type is 'NETWORK__PLACE_EXC_BET_SUCCESS'", () => {
    it("return new state with step report", () => {
      const exchangeReportMock = {
        mock: "data",
      };
      const { step } = betslipReducer(
        {
          step: "PLACE_POTENTIAL",
          placeStatus: "FAILURE",
          exchangeReport: {},
          exchangePlaceError: {},
        },
        {
          type: NETWORK__PLACE_EXC_BET_SUCCESS,
          payload: {
            report: exchangeReportMock,
          },
        },
      );

      expect(step).toEqual("REPORT");
    });

    it("return new state with 'placeStatus' success", () => {
      const exchangeReportMock = {
        mock: "data",
      };
      const { placeStatus } = betslipReducer(
        {
          step: "PLACE_POTENTIAL",
          placeStatus: "FAILURE",
          exchangeReport: {},
          exchangePlaceError: {},
        },
        {
          type: NETWORK__PLACE_EXC_BET_SUCCESS,
          payload: {
            report: exchangeReportMock,
          },
        },
      );

      expect(placeStatus).toEqual("SUCCESS");
    });

    it("return new state without 'exchangePlaceError'", () => {
      const exchangeReportMock = {
        mock: "data",
      };
      const { exchangePlaceError } = betslipReducer(
        { isCollapsed: false, placeStatus: "FAILURE", exchangeReport: {}, exchangePlaceError: {} },
        {
          type: NETWORK__PLACE_EXC_BET_SUCCESS,
          payload: {
            report: exchangeReportMock,
          },
        },
      );

      expect(exchangePlaceError).toEqual(undefined);
    });

    it("return new state with given 'exchangeReport'", () => {
      const exchangeReportMock = {
        mock: "data",
      };
      const { exchangeReport: newExchangeReport } = betslipReducer(
        { isCollapsed: false, placeStatus: "FAILURE", exchangeReport: {}, exchangePlaceError: {} },
        {
          type: NETWORK__PLACE_EXC_BET_SUCCESS,
          payload: {
            report: exchangeReportMock,
          },
        },
      );

      expect(newExchangeReport).toBe(exchangeReportMock);
    });

    it("return new state with isCollapsed false", () => {
      const { isCollapsed } = betslipReducer(
        {
          isCollapsed: true,
          step: "PLACE_POTENTIAL",
          placeStatus: "FAILURE",
          exchangeReport: {},
          exchangePlaceError: {},
        },
        {
          type: NETWORK__PLACE_EXC_BET_SUCCESS,
          payload: {
            report: "data",
          },
        },
      );

      expect(isCollapsed).toBe(false);
    });

    it("return new state with taggingMetadata to initial state", () => {
      const { taggingMetadata } = betslipReducer(
        {
          isCollapsed: true,
          step: "PLACE_POTENTIAL",
          placeStatus: "FAILURE",
          exchangeReport: {},
          exchangePlaceError: {},
          taggingMetadata: { selections: { runnerUrn: { id: "runnerUrn", timestamp: 1622138467422 } } },
        },
        {
          type: NETWORK__PLACE_EXC_BET_SUCCESS,
          payload: {
            report: "data",
          },
        },
      );

      expect(taggingMetadata).toEqual({ selections: {} });
    });
  });

  describe("when action type is 'NETWORK__PLACE_EXC_BET_FAILURE'", () => {
    it("return new state with step placePotential", () => {
      const errorMock = {
        mock: "data",
      };
      const { step } = betslipReducer(
        {
          step: "PLACE_POTENTIAL",
          placeStatus: "INPROGRESS",
          exchangeReport: {},
          exchangePlaceError: {},
        },
        {
          type: NETWORK__PLACE_EXC_BET_FAILURE,
          payload: {
            error: errorMock,
          },
        },
      );

      expect(step).toEqual("PLACE_POTENTIAL");
    });
    it("return new state with 'placeStatus' failure", () => {
      const errorMock = {
        mock: "data",
      };
      const { placeStatus } = betslipReducer(
        {
          state: "PLACE_POTENTIAL",
          placeStatus: "FAILURE",
          exchangeReport: {},
          exchangePlaceError: {},
        },
        {
          type: NETWORK__PLACE_EXC_BET_FAILURE,
          payload: {
            error: errorMock,
          },
        },
      );

      expect(placeStatus).toEqual("FAILURE");
    });
    it("return new state with given 'exchangePlaceError'", () => {
      const errorMock = {
        mock: "data",
      };
      const { exchangePlaceError } = betslipReducer(
        { isCollapsed: false, placeStatus: "INPROGRESS", exchangeReport: {}, exchangePlaceError: {} },
        {
          type: NETWORK__PLACE_EXC_BET_FAILURE,
          payload: {
            error: errorMock,
          },
        },
      );

      expect(exchangePlaceError).toEqual(errorMock);
    });
    it("return new state without 'exchangeReport'", () => {
      const errorMock = {
        mock: "data",
      };
      const { exchangeReport: newExchangeReport } = betslipReducer(
        { isCollapsed: false, placeStatus: "INPROGRESS", exchangeReport: {}, exchangePlaceError: {} },
        {
          type: NETWORK__PLACE_EXC_BET_FAILURE,
          payload: {
            error: errorMock,
          },
        },
      );

      expect(newExchangeReport).toBe(undefined);
    });

    it("return new state with isCollapsed false", () => {
      const { isCollapsed } = betslipReducer(
        { isCollapsed: true, placeStatus: "INPROGRESS", exchangeReport: {}, exchangePlaceError: {} },
        {
          type: NETWORK__PLACE_EXC_BET_FAILURE,
          payload: {
            error: "data",
          },
        },
      );

      expect(isCollapsed).toBe(false);
    });
  });

  describe("when action type is 'NETWORK__UPDATE_EXC_BET_IN_PROGRESS'", () => {
    it("return new state with 'placeStatus' none", () => {
      const { placeStatus } = betslipReducer(
        { isCollapsed: false, placeStatus: "FAILURE", exchangeReport: {}, exchangePlaceError: {} },
        {
          type: NETWORK__UPDATE_EXC_BET_IN_PROGRESS,
        },
      );
      expect(placeStatus).toEqual("NONE");
    });

    it("return new state with 'updateStatus' in progress", () => {
      const { updateStatus } = betslipReducer(
        { isCollapsed: false, updateStatus: "FAILURE", exchangeReport: {}, exchangePlaceError: {} },
        {
          type: NETWORK__UPDATE_EXC_BET_IN_PROGRESS,
        },
      );
      expect(updateStatus).toEqual("INPROGRESS");
    });

    it("return new state with 'isCollapsed' true", () => {
      const { isCollapsed } = betslipReducer(
        { isCollapsed: false, updateStatus: "FAILURE", exchangeReport: {}, exchangePlaceError: {} },
        {
          type: NETWORK__UPDATE_EXC_BET_IN_PROGRESS,
        },
      );
      expect(isCollapsed).toEqual(true);
    });

    it("return new state without 'exchangeReport'", () => {
      const { exchangeReport } = betslipReducer(
        { isCollapsed: false, placeStatus: "FAILURE", exchangeReport: {}, exchangePlaceError: {} },
        {
          type: NETWORK__UPDATE_EXC_BET_IN_PROGRESS,
        },
      );

      expect(exchangeReport).toBeUndefined();
    });

    it("return new state without 'exchangePlaceError'", () => {
      const { exchangePlaceError } = betslipReducer(
        { isCollapsed: false, placeStatus: "FAILURE", exchangeReport: {}, exchangePlaceError: {} },
        {
          type: NETWORK__UPDATE_EXC_BET_IN_PROGRESS,
        },
      );

      expect(exchangePlaceError).toBeUndefined();
    });
  });

  describe("when action type is 'NETWORK__UPDATE_EXC_BET_SUCCESS'", () => {
    const exchangeReportMock = {
      mock: "data",
    };

    function setup() {
      return betslipReducer(
        {
          step: "PLACE_POTENTIAL",
          placeStatus: "FAILURE",
          exchangeReport: {},
          exchangePlaceError: {},
          isCollapsed: true,
          taggingMetadata: { selections: { runnerUrn: { id: "runnerUrn", timestamp: 1622138467422 } } },
        },
        {
          type: NETWORK__UPDATE_EXC_BET_SUCCESS,
          payload: {
            report: exchangeReportMock,
          },
        },
      );
    }

    it("return new state with step report", () => {
      const { step } = setup();

      expect(step).toEqual("REPORT");
    });

    it("return new state with 'updateStatus' success", () => {
      const { updateStatus } = setup();

      expect(updateStatus).toEqual("SUCCESS");
    });

    it("return new state with 'exchangeReport' as returned by the payload", () => {
      const { exchangeReport } = setup();

      expect(exchangeReport).toEqual(exchangeReportMock);
    });

    it("return new state with undefined exchangePlaceError", () => {
      const { exchangePlaceError } = setup();

      expect(exchangePlaceError).toEqual(undefined);
    });

    it("return new state with isCollapsed false", () => {
      const { isCollapsed } = setup();

      expect(isCollapsed).toBe(false);
    });

    it("return new state with taggingMetadata to initial state", () => {
      const { taggingMetadata } = setup();

      expect(taggingMetadata).toEqual({ selections: {} });
    });
  });

  describe("when action type is 'NETWORK__UPDATE_EXC_BET_FAILURE'", () => {
    it("return new state with 'updateStatus' failure", () => {
      const errorMock = {
        mock: "data",
      };
      const { updateStatus } = betslipReducer(
        {
          step: "PLACE_POTENTIAL",
          placeStatus: "NONE",
          updateStatus: "FAILURE",
          exchangeReport: {},
          exchangePlaceError: {},
        },
        {
          type: NETWORK__UPDATE_EXC_BET_FAILURE,
          payload: {
            error: errorMock,
          },
        },
      );

      expect(updateStatus).toEqual("FAILURE");
    });

    it("return new state with isCollapsed false", () => {
      const { isCollapsed } = betslipReducer(
        {
          step: "PLACE_POTENTIAL",
          placeStatus: "NONE",
          updateStatus: "FAILURE",
          exchangeReport: {},
          exchangePlaceError: {},
        },
        {
          type: NETWORK__UPDATE_EXC_BET_FAILURE,
          payload: {
            error: "data",
          },
        },
      );

      expect(isCollapsed).toBe(false);
    });

    it("return new state without 'exchangePlaceError'", () => {
      const { exchangeReport } = betslipReducer(
        {
          step: "PLACE_POTENTIAL",
          placeStatus: "NONE",
          updateStatus: "FAILURE",
          exchangeReport: {},
          exchangePlaceError: {},
        },
        {
          type: NETWORK__UPDATE_EXC_BET_FAILURE,
          payload: {
            error: "data",
          },
        },
      );

      expect(exchangeReport).toBeUndefined();
    });

    it("return new state with exchangePlaceError", () => {
      const { exchangePlaceError } = betslipReducer(
        {
          step: "PLACE_POTENTIAL",
          placeStatus: "NONE",
          updateStatus: "FAILURE",
          exchangeReport: {},
          exchangePlaceError: {},
        },
        {
          type: NETWORK__UPDATE_EXC_BET_FAILURE,
          payload: {
            error: "data",
          },
        },
      );

      expect(exchangePlaceError).toBe("data");
    });
  });

  describe("when action type is 'NETWORK__PLACE_SBK_BET_IN_PROGRESS'", () => {
    it("return new state with 'placeStatus' in progress", () => {
      const { placeStatus } = betslipReducer(
        {},
        {
          type: NETWORK__PLACE_SBK_BET_IN_PROGRESS,
        },
      );

      expect(placeStatus).toEqual("INPROGRESS");
    });

    it("return new state without with hasSportsbookTechnicalError as false", () => {
      const { hasSportsbookTechnicalError } = betslipReducer(
        {},
        {
          type: NETWORK__PLACE_SBK_BET_IN_PROGRESS,
        },
      );

      expect(hasSportsbookTechnicalError).toEqual(false);
    });

    it("return new state but keep the previous 'sportsbookReport'", () => {
      const sportsbookReportMock = {
        mock: "data",
      };

      const { sportsbookReport } = betslipReducer(
        {
          sportsbookReport: sportsbookReportMock,
        },
        {
          type: NETWORK__PLACE_SBK_BET_IN_PROGRESS,
        },
      );

      expect(sportsbookReport).toEqual(sportsbookReportMock);
    });
  });

  describe("when action type is 'NETWORK__PLACE_SBK_BET_SUCCESS'", () => {
    it("return new state with step report", () => {
      const sportsbookReportMock = {
        mock: "data",
      };
      const { step } = betslipReducer(
        {
          step: "PLACE_POTENTIAL",
          placeStatus: "INPROGRESS",
          sportsbookReport: {},
          hasSportsbookTechnicalError: false,
        },
        {
          type: NETWORK__PLACE_SBK_BET_SUCCESS,
          payload: {
            report: sportsbookReportMock,
          },
        },
      );

      expect(step).toEqual("REPORT");
    });

    it("return new state with 'placeStatus' success", () => {
      const sportsbookReportMock = {
        mock: "data",
      };
      const { placeStatus } = betslipReducer(
        {
          step: "PLACE_POTENTIAL",
          placeStatus: "INPROGRESS",
          sportsbookReport: {},
          hasSportsbookTechnicalError: false,
        },
        {
          type: NETWORK__PLACE_SBK_BET_SUCCESS,
          payload: {
            report: sportsbookReportMock,
          },
        },
      );

      expect(placeStatus).toEqual("SUCCESS");
    });

    it("return new state with 'hasSportsbookTechnicalError' as false", () => {
      const sportsbookReportMock = {
        mock: "data",
      };
      const { hasSportsbookTechnicalError } = betslipReducer(
        {
          isCollapsed: false,
          placeStatus: "FAILURE",
          sportsbookReport: {},
          hasSportsbookTechnicalError: false,
        },
        {
          type: NETWORK__PLACE_SBK_BET_SUCCESS,
          payload: {
            report: sportsbookReportMock,
          },
        },
      );

      expect(hasSportsbookTechnicalError).toEqual(false);
    });

    it("return new state with given 'sportsbookReport'", () => {
      const sportsbookReportMock = {
        mock: "data",
      };
      const { sportsbookReport: newSBKReport } = betslipReducer(
        {
          isCollapsed: false,
          placeStatus: "FAILURE",
          sportsbookReport: {},
          hasSportsbookTechnicalError: false,
        },
        {
          type: NETWORK__PLACE_SBK_BET_SUCCESS,
          payload: {
            report: sportsbookReportMock,
          },
        },
      );

      expect(newSBKReport).toBe(sportsbookReportMock);
    });

    it("return new state with isCollapsed false", () => {
      const { isCollapsed } = betslipReducer(
        {
          isCollapsed: true,
          placeStatus: "FAILURE",
          sportsbookReport: {},
          hasSportsbookTechnicalError: false,
        },
        {
          type: NETWORK__PLACE_SBK_BET_SUCCESS,
          payload: {
            report: "data",
          },
        },
      );

      expect(isCollapsed).toBe(false);
    });

    it("return new state with sportsbookOddsMovement empty", () => {
      const { sportsbookOddsMovement } = betslipReducer(
        {
          isCollapsed: true,
          placeStatus: "FAILURE",
          sportsbookReport: {},
          hasSportsbookTechnicalError: false,
        },
        {
          type: NETWORK__PLACE_SBK_BET_SUCCESS,
          payload: {
            report: "data",
          },
        },
      );

      expect(sportsbookOddsMovement).toEqual({});
    });

    it("return new state with sportsbookHandicapMovement empty", () => {
      const { sportsbookHandicapMovement } = betslipReducer(
        {
          isCollapsed: true,
          placeStatus: "FAILURE",
          sportsbookReport: {},
          hasSportsbookTechnicalError: false,
        },
        {
          type: NETWORK__PLACE_SBK_BET_SUCCESS,
          payload: {
            report: "data",
          },
        },
      );

      expect(sportsbookHandicapMovement).toEqual({});
    });

    it("return new state with taggingMetadata to initial state", () => {
      const { taggingMetadata } = betslipReducer(
        {
          isCollapsed: true,
          placeStatus: "FAILURE",
          sportsbookReport: {},
          hasSportsbookTechnicalError: false,
          taggingMetadata: { selections: { runnerUrn: { id: "runnerUrn", timestamp: 1622138467422 } } },
        },
        {
          type: NETWORK__PLACE_SBK_BET_SUCCESS,
          payload: {
            report: "data",
          },
        },
      );

      expect(taggingMetadata).toEqual({ selections: {} });
    });
  });

  describe("when action type is 'NETWORK__PLACE_SBK_BET_FAILURE'", () => {
    it("return new state with 'placeStatus' failure", () => {
      const errorMock = {
        mock: "data",
      };
      const { placeStatus } = betslipReducer(
        {
          step: "PLACE_POTENTIAL",
          placeStatus: "FAILURE",
          exchangeReport: {},
          hasSportsbookTechnicalError: false,
        },
        {
          type: NETWORK__PLACE_SBK_BET_FAILURE,
          payload: {
            error: errorMock,
          },
        },
      );

      expect(placeStatus).toEqual("FAILURE");
    });
    it("return new state with given 'hasSportsbookTechnicalError' based on isTechnical", () => {
      const errorMock = {
        mock: "data",
      };
      const { hasSportsbookTechnicalError } = betslipReducer(
        {
          isCollapsed: false,
          placeStatus: "INPROGRESS",
          sportsbookReport: {},
          hasSportsbookTechnicalError: false,
        },
        {
          type: NETWORK__PLACE_SBK_BET_FAILURE,
          payload: {
            isTechnical: true,
            error: errorMock,
          },
        },
      );

      expect(hasSportsbookTechnicalError).toEqual(true);
    });
    it("return new state without 'sportsbookReport'", () => {
      const errorMock = {
        mock: "data",
      };
      const { sportsbookReport: newSBKReport } = betslipReducer(
        {
          isCollapsed: false,
          placeStatus: "INPROGRESS",
          sportsbookReport: {},
          hasSportsbookTechnicalError: false,
        },
        {
          type: NETWORK__PLACE_SBK_BET_FAILURE,
          payload: {
            error: errorMock,
          },
        },
      );

      expect(newSBKReport).toBe(undefined);
    });

    it("return new state with isCollapsed false", () => {
      const { isCollapsed } = betslipReducer(
        {
          isCollapsed: true,
          placeStatus: "INPROGRESS",
          sportsbookReport: {},
          hasSportsbookTechnicalError: false,
        },
        {
          type: NETWORK__PLACE_SBK_BET_FAILURE,
          payload: {
            error: "data",
          },
        },
      );

      expect(isCollapsed).toBe(false);
    });
  });

  describe("when action type is 'NETWORK__OBB_PLACE_BET_FAILURE'", () => {
    it("return new state with 'placeStatus' failure", () => {
      const { placeStatus } = betslipReducer(
        {
          placeStatus: "INPROGRESS",
        },
        {
          type: NETWORK__OBB_PLACE_BET_FAILURE,
          payload: {
            betPlacementResponse: "someError",
          },
        },
      );

      expect(placeStatus).toEqual("FAILURE");
    });
  });

  describe("when action type is 'NETWORK__SEARCH_EXC_ORDERS_SUCCESS'", () => {
    describe("when payload does not have step property", () => {
      it("return same state of step and the payload report", () => {
        const exchangeReportMock = {
          side: "BACK",
          unmatched: {
            size: 2,
          },
        };
        const { step, exchangeEdit, exchangeReport } = betslipReducer(
          {
            step: "MOCK_STATE",
            exchangeReport: exchangeReportMock,
          },
          {
            type: NETWORK__SEARCH_EXC_ORDERS_SUCCESS,
            payload: {
              report: {
                unmatched: {
                  size: 2,
                },
              },
              exchangeEdit: "NEW_EDIT_STATE",
            },
          },
        );

        expect(step).toBe("MOCK_STATE");
        expect(exchangeEdit).toBe("NEW_EDIT_STATE");
        expect(exchangeReport).toEqual({
          unmatched: { size: 2 },
        });
      });
    });

    describe("when payload has step property", () => {
      it("return payload report", () => {
        const exchangeReportMock = {
          side: "BACK",
          unmatched: {
            size: 2,
          },
        };
        const { step, exchangeEdit, exchangeReport } = betslipReducer(
          {
            step: "MOCK_STATE",
            exchangeReport: exchangeReportMock,
          },
          {
            type: NETWORK__SEARCH_EXC_ORDERS_SUCCESS,
            payload: {
              report: {
                unmatched: {
                  size: 2,
                },
              },
              exchangeEdit: "NEW_EDIT_STATE",
              step: "NEW_MOCK_STATE",
            },
          },
        );

        expect(step).toBe("NEW_MOCK_STATE");
        expect(exchangeEdit).toBe("NEW_EDIT_STATE");
        expect(exchangeReport).toEqual({
          unmatched: { size: 2 },
        });
      });
    });
  });

  describe("when action type is 'NETWORK__CANCEL_EXC_BET_IN_PROGRESS'", () => {
    it("return new state with 'cancelStatus' in progress", () => {
      const { cancelStatus } = betslipReducer(
        { isCollapsed: false, cancelStatus: "FAILURE", exchangeReport: {}, exchangeCancelError: {} },
        {
          type: NETWORK__CANCEL_EXC_BET_IN_PROGRESS,
        },
      );

      expect(cancelStatus).toEqual("INPROGRESS");
    });
    it("return new state without 'exchangeCancelError'", () => {
      const { exchangeCancelError } = betslipReducer(
        { isCollapsed: false, cancelStatus: "FAILURE", exchangeReport: {}, exchangeCancelError: {} },
        {
          type: NETWORK__CANCEL_EXC_BET_IN_PROGRESS,
        },
      );

      expect(exchangeCancelError).toBeUndefined();
    });
    it("return new state without 'exchangeReport'", () => {
      const { exchangeReport } = betslipReducer(
        { isCollapsed: false, cancelStatus: "FAILURE", exchangeReport: {}, exchangeCancelError: {} },
        {
          type: NETWORK__CANCEL_EXC_BET_IN_PROGRESS,
        },
      );

      expect(exchangeReport).toBeUndefined();
    });
  });

  describe("when action type is 'NETWORK__CANCEL_EXC_BET_SUCCESS'", () => {
    it("return new state with step report", () => {
      const exchangeReportMock = {
        mock: "data",
      };
      const { step } = betslipReducer(
        {
          step: "REPORT",
          cancelStatus: "FAILURE",
          exchangeReport: {},
          exchangeCancelError: {},
        },
        {
          type: NETWORK__CANCEL_EXC_BET_SUCCESS,
          payload: {
            report: exchangeReportMock,
          },
        },
      );

      expect(step).toEqual("REPORT");
    });

    it("return new state with 'cancelStatus' success", () => {
      const exchangeReportMock = {
        mock: "data",
      };
      const { cancelStatus } = betslipReducer(
        {
          step: "REPORT",
          cancelStatus: "FAILURE",
          exchangeReport: {},
          exchangeCancelError: {},
        },
        {
          type: NETWORK__CANCEL_EXC_BET_SUCCESS,
          payload: {
            report: exchangeReportMock,
          },
        },
      );

      expect(cancelStatus).toEqual("SUCCESS");
    });

    it("return new state without 'exchangeCancelError'", () => {
      const exchangeReportMock = {
        mock: "data",
      };
      const { exchangeCancelError } = betslipReducer(
        { isCollapsed: false, cancelStatus: "FAILURE", exchangeReport: {}, exchangeCancelError: {} },
        {
          type: NETWORK__CANCEL_EXC_BET_SUCCESS,
          payload: {
            report: exchangeReportMock,
          },
        },
      );

      expect(exchangeCancelError).toEqual(undefined);
    });

    it("return new state with given 'exchangeReport'", () => {
      const exchangeReportMock = {
        mock: "data",
      };
      const { exchangeReport: newExchangeReport } = betslipReducer(
        { isCollapsed: false, cancelStatus: "FAILURE", exchangeReport: {}, exchangeCancelError: {} },
        {
          type: NETWORK__CANCEL_EXC_BET_SUCCESS,
          payload: {
            report: exchangeReportMock,
          },
        },
      );

      expect(newExchangeReport).toBe(exchangeReportMock);
    });

    it("return new state with isCollapsed false", () => {
      const { isCollapsed } = betslipReducer(
        { isCollapsed: false, cancelStatus: "FAILURE", exchangeReport: {}, exchangeCancelError: {} },
        {
          type: NETWORK__CANCEL_EXC_BET_SUCCESS,
          payload: {
            report: "data",
          },
        },
      );

      expect(isCollapsed).toBe(false);
    });

    it("return new state with taggingMetadata to initial state", () => {
      const { taggingMetadata } = betslipReducer(
        {
          isCollapsed: false,
          cancelStatus: "FAILURE",
          exchangeReport: {},
          exchangeCancelError: {},
          taggingMetadata: { selections: { runnerUrn: { id: "runnerUrn", timestamp: 1622138467422 } } },
        },
        {
          type: NETWORK__CANCEL_EXC_BET_SUCCESS,
          payload: {
            report: "data",
          },
        },
      );

      expect(taggingMetadata).toEqual({ selections: {} });
    });
  });

  describe("when action type is 'NETWORK__CANCEL_EXC_BET_FAILURE'", () => {
    it("return new state with step REPORT", () => {
      const errorMock = {
        mock: "data",
      };
      const { step } = betslipReducer(
        {
          step: "REPORT",
          cancelStatus: "INPROGRESS",
          exchangeReport: {},
          exchangeCancelError: {},
        },
        {
          type: NETWORK__CANCEL_EXC_BET_FAILURE,
          payload: {
            error: errorMock,
          },
        },
      );

      expect(step).toEqual("REPORT");
    });
    it("return new state with 'cancelStatus' failure", () => {
      const errorMock = {
        mock: "data",
      };
      const { cancelStatus } = betslipReducer(
        {
          step: "PLACE_POTENTIAL",
          cancelStatus: "FAILURE",
          exchangeReport: {},
          exchangeCancelError: {},
        },
        {
          type: NETWORK__CANCEL_EXC_BET_FAILURE,
          payload: {
            error: errorMock,
          },
        },
      );

      expect(cancelStatus).toEqual("FAILURE");
    });
    it("return new state with given 'exchangeCancelError'", () => {
      const errorMock = {
        mock: "data",
      };
      const { exchangeCancelError } = betslipReducer(
        { isCollapsed: false, cancelStatus: "INPROGRESS", exchangeReport: {}, exchangeCancelError: {} },
        {
          type: NETWORK__CANCEL_EXC_BET_FAILURE,
          payload: {
            error: errorMock,
          },
        },
      );

      expect(exchangeCancelError).toEqual(errorMock);
    });
    it("return new state without 'exchangeReport'", () => {
      const errorMock = {
        mock: "data",
      };
      const { exchangeReport: newExchangeReport } = betslipReducer(
        { isCollapsed: false, cancelStatus: "INPROGRESS", exchangeReport: {}, exchangeCancelError: {} },
        {
          type: NETWORK__CANCEL_EXC_BET_FAILURE,
          payload: {
            error: errorMock,
          },
        },
      );

      expect(newExchangeReport).toBe(undefined);
    });

    it("return new state with isCollapsed false", () => {
      const { isCollapsed } = betslipReducer(
        { isCollapsed: true, cancelStatus: "INPROGRESS", exchangeReport: {}, exchangeCancelError: {} },
        {
          type: NETWORK__CANCEL_EXC_BET_FAILURE,
          payload: {
            error: "data",
          },
        },
      );

      expect(isCollapsed).toBe(false);
    });
  });

  describe("when action type is 'UI__BETSLIP_EXC_BONUS_CHANGE'", () => {
    it("should return new state with the provided value", () => {
      const { isFreeBetsSelected } = betslipReducer(
        {
          step: "PLACE_POTENTIAL",
          isCollapsed: false,
          isFreeBetsSelected: false,
        },
        {
          type: UI__BETSLIP_EXC_BONUS_CHANGE,
          payload: {
            isFreeBetsSelected: true,
          },
        },
      );

      expect(isFreeBetsSelected).toBe(true);
    });

    it("should reset exchangePlaceError", () => {
      const { exchangePlaceError } = betslipReducer(
        {
          step: "PLACE_POTENTIAL",
          isCollapsed: false,
          isFreeBetsSelected: false,
          exchangePlaceError: {},
        },
        {
          type: UI__BETSLIP_EXC_BONUS_CHANGE,
          payload: {
            isFreeBetsSelected: true,
          },
        },
      );

      expect(exchangePlaceError).toBe(undefined);
    });
  });

  describe("when action type is 'UI__BETSLIP_EXC_SIZE_INPUT_CHANGE'", () => {
    it("should reset exchangePlaceError", () => {
      const { exchangePlaceError } = betslipReducer(
        {
          step: "PLACE_POTENTIAL",
          isCollapsed: false,
          isFreeBetsSelected: false,
          exchangePlaceError: {},
        },
        {
          type: UI__BETSLIP_EXC_BONUS_CHANGE,
          payload: {
            isFreeBetsSelected: true,
          },
        },
      );

      expect(exchangePlaceError).toBe(undefined);
    });
  });

  describe("when action type is 'UI/BETSLIP_EXC_REMOVE_POTENTIAL_BET_CLICK'", () => {
    it("should return new state with taggingMetadata to initial state", () => {
      const { taggingMetadata } = betslipReducer(
        {
          taggingMetadata: { selections: { urn: { id: "urn" } } },
        },
        {
          type: UI__BETSLIP_EXC_REMOVE_POTENTIAL_BET_CLICK,
        },
      );

      expect(taggingMetadata).toEqual({ selections: {} });
    });
  });

  describe("when action type is 'BETTING/SBK_CLEAR_ACTION'", () => {
    it("should return new state with taggingMetadata to initial state", () => {
      const { taggingMetadata } = betslipReducer(
        {
          taggingMetadata: { selections: { urn: { id: "urn" } } },
        },
        {
          type: BETTING__SBK_CLEAR_ACTION,
        },
      );

      expect(taggingMetadata).toEqual({ selections: {} });
    });
  });

  describe("when action type is 'UI/BETSLIP_SBK_REMOVE_LEG_CLICK'", () => {
    it("should return new state without removed taggingMetadata selection", () => {
      const { taggingMetadata } = betslipReducer(
        {
          taggingMetadata: {
            selections: {
              "urn:1": { id: "urn:1" },
              "urn:2": { id: "urn:2" },
            },
          },
        },
        {
          type: UI__BETSLIP_SBK_REMOVE_LEG_CLICK,
          payload: { legId: "legId", runnerUrn: "urn:1" },
        },
      );

      expect(taggingMetadata).toEqual({ selections: { "urn:2": { id: "urn:2" } } });
    });
  });

  describe("when action type is 'NETWORK__CASHOUT_TAKE_FAILURE_SBK'", () => {
    it("should return new state that reflects a closed betslip", () => {
      const { exchangeReport, exchangeEdit, exchangeContext, sportsbookReport, step } = betslipReducer(
        {
          step: "PLACE_POTENTIAL",
          isCollapsed: false,
          isFreeBetsSelected: false,
        },
        {
          type: NETWORK__CASHOUT_TAKE_FAILURE_SBK,
        },
      );

      expect(step).toBe("PLACE_POTENTIAL");
      expect(exchangeReport).toBe(undefined);
      expect(exchangeEdit).toBe(undefined);
      expect(exchangeContext).toBe(undefined);
      expect(sportsbookReport).toBe(undefined);
    });
  });
  describe("when action type is 'NETWORK__CASHOUT_TAKE_FAILURE'", () => {
    it("should return new state that reflects a closed betslip", () => {
      const { exchangeReport, exchangeEdit, exchangeContext, sportsbookReport, step } = betslipReducer(
        {
          step: "PLACE_POTENTIAL",
          isCollapsed: false,
          isFreeBetsSelected: false,
        },
        {
          type: NETWORK__CASHOUT_TAKE_FAILURE,
        },
      );

      expect(step).toBe("PLACE_POTENTIAL");
      expect(exchangeReport).toBe(undefined);
      expect(exchangeEdit).toBe(undefined);
      expect(exchangeContext).toBe(undefined);
      expect(sportsbookReport).toBe(undefined);
    });
  });

  describe("when action type is 'NETWORK__CASHOUT_TAKE_SUCCESS'", () => {
    it("should return new state that reflects a closed betslip", () => {
      const { exchangeReport, exchangeEdit, exchangeContext, sportsbookReport, step } = betslipReducer(
        {
          step: "REPORT",
          isCollapsed: false,
          isFreeBetsSelected: false,
        },
        {
          type: NETWORK__CASHOUT_TAKE_SUCCESS,
        },
      );

      expect(step).toBe("PLACE_POTENTIAL");
      expect(exchangeReport).toBe(undefined);
      expect(exchangeEdit).toBe(undefined);
      expect(exchangeContext).toBe(undefined);
      expect(sportsbookReport).toBe(undefined);
    });
  });

  describe("when action type is 'FETCH_USER_WALLETS_SUCCESS'", () => {
    describe("but no wallet exists", () => {
      it("state should remain the same", () => {
        const state = {};
        const stateResult = betslipReducer(state, { type: FETCH_USER_WALLETS_SUCCESS, payload: [] });

        expect(stateResult).toEqual(state);
      });
    });
  });

  describe("when action type is 'BETTING__SBK_LOAD_STORAGE_SUCCESS'", () => {
    it("should return new state with payload.betslip merged", () => {
      const currentState = {
        some: "prop",
        isCollapsed: false,
      };
      const state = betslipReducer(currentState, {
        type: BETTING__SBK_LOAD_STORAGE_SUCCESS,
        payload: {
          betslip: { group: "REAL", isCollapsed: true },
        },
      });

      expect(state).toEqual({
        group: "REAL",
        some: "prop",
        isCollapsed: true,
      });
    });
  });

  describe("when action type is 'UI__BETSLIP_DISMISS_BET_BUILDER_MULTIS_NOTIFICATION_ACTION'", () => {
    it("should change isBetBuilderMultisNotificationVisible to false", () => {
      const currentState = {
        some: "prop",
        isBetBuilderMultisNotificationVisible: true,
      };
      const state = betslipReducer(currentState, {
        type: UI__BETSLIP_DISMISS_BET_BUILDER_MULTIS_NOTIFICATION_ACTION,
      });

      expect(state).toEqual({
        some: "prop",
        isBetBuilderMultisNotificationVisible: false,
      });
    });
  });

  describe("when action type is 'UI__BETSLIP_SBK_RE_ADD_SELECTIONS_CLICK'", () => {
    describe("and numberOfSelections is 1", () => {
      it("should change isCollapsed to false", () => {
        const currentState = {
          some: "prop",
          isCollapsed: false,
        };
        const state = betslipReducer(currentState, {
          type: UI__BETSLIP_SBK_RE_ADD_SELECTIONS_CLICK,
          payload: {
            numberOfSelections: 1,
          },
        });

        expect(state).toEqual({
          some: "prop",
          isCollapsed: false,
        });
      });
    });
    describe("and numberOfSelections is greater than 1", () => {
      it("should change isCollapsed to true", () => {
        const currentState = {
          some: "prop",
          isCollapsed: false,
        };
        const state = betslipReducer(currentState, {
          type: UI__BETSLIP_SBK_RE_ADD_SELECTIONS_CLICK,
          payload: {
            numberOfSelections: 2,
          },
        });

        expect(state).toEqual({
          some: "prop",
          isCollapsed: true,
        });
      });
    });
  });

  describe("when action type is 'UI__BETSLIP_MAX_PAYOUT_NOTIFICATION_ACCEPTED'", () => {
    it("should set showMaxPayoutNotification to false", () => {
      const state = betslipReducer(
        {
          showMaxPayoutNotification: true,
        },
        {
          type: UI__BETSLIP_MAX_PAYOUT_NOTIFICATION_ACCEPTED,
        },
      );

      expect(state).toEqual({ showMaxPayoutNotification: false });
    });
  });

  describe("when action type is 'BETTING__BETSLIP_LOAD_MAX_PAYOUT_INFO'", () => {
    it("should return new state with the provided value", () => {
      const state = betslipReducer(
        {
          showMaxPayoutNotification: true,
        },
        {
          type: BETTING__BETSLIP_LOAD_MAX_PAYOUT_INFO,
          payload: false,
        },
      );

      expect(state).toEqual({ showMaxPayoutNotification: false });
    });
  });

  describe("when action type is BETTING__SPORTSBOOK_GENEROSITY_WALLET_BET_ACTION", () => {
    it("should return new state with the provided value", () => {
      const state = betslipReducer(
        {
          selectedCombinationId: undefined,
        },
        {
          type: BETTING__SPORTSBOOK_GENEROSITY_WALLET_BET_ACTION,
          payload: { combinationId: "123" },
        },
      );

      expect(state).toEqual({
        selectedCombinationId: "123",
      });
    });
  });
  describe("when action type is BETTING__SPORTSBOOK_GENEROSITY_WALLETS_CLOSE_ACTION", () => {
    it("should return new state with no selectedCombinationId", () => {
      const state = betslipReducer(
        {
          selectedCombinationId: "123",
        },
        {
          type: BETTING__SPORTSBOOK_GENEROSITY_WALLETS_CLOSE_ACTION,
        },
      );

      expect(state).toEqual({
        selectedCombinationId: undefined,
      });
    });
  });
  describe.each([
    BETTING__SPORTSBOOK_REMOVE_ALL_COMBINATION_FREE_BETS_WALLETS_ACTION,
    BETTING__SBK_ACCA_INSURANCE_TOGGLE,
    BETTING__SBK_MONEY_BACK_TOGGLE,
    BETTING__SBK_PRICE_BOOST_TOGGLE,
    BETTING__SBK_GHOST_LEG_TOGGLE,
    BETTING__SPORTSBOOK_FREE_BETS_WALLETS_APPLY_ACTION,
  ])("when action type is %s", (action) => {
    it("should return new state with no selectedCombinationId", () => {
      const state = betslipReducer(
        {
          selectedCombinationId: "123",
        },
        {
          type: action,
        },
      );

      expect(state).toEqual({
        selectedCombinationId: undefined,
      });
    });
  });

  describe("when clearing exchange place error", () => {
    describe.each([
      UI__BETSLIP_EXC_SIZE_INPUT_CHANGE,
      UI__BETSLIP_EXC_PRICE_INPUT_CHANGE,
      UI__BETSLIP_EXC_PRICE_NUDGE_UP,
      UI__BETSLIP_EXC_PRICE_NUDGE_DOWN,
      UI__BETSLIP_EXC_INCREMENT_SIZE_ACTION,
      UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_DOWN,
      UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_UP,
      UI__BETSLIP_EXC_UNMATCHED_PRICE_INPUT_CHANGE,
      UI__BETSLIP_EXC_UNMATCHED_SIZE_INPUT_CHANGE,
    ])("when %s", (action) => {
      it("should reset place error", () => {
        const { exchangePlaceError } = betslipReducer(
          {
            exchangePlaceError: {},
          },
          {
            type: action,
          },
        );

        expect(exchangePlaceError).toBe(undefined);
      });
    });
  });

  describe("when action type is 'NETWORK__OBB_PLACE_BET_SUCCESS'", () => {
    it("should return new state with the provided value", () => {
      const initialState = betslipReducer(undefined, { type: undefined });

      expect(initialState.obbReport).toBe(undefined);
      expect(initialState.step).not.toBe("REPORT");

      expect(
        betslipReducer(initialState, {
          type: NETWORK__OBB_PLACE_BET_SUCCESS,
          payload: {
            foo: "bar",
          },
        }),
      ).toEqual(expect.objectContaining({ obbReport: { foo: "bar" }, step: "REPORT" }));
    });
  });
  describe("when action type is 'UI__BETSLIP_OBB_RECEIPT_PANEL_DONE_CLICK'", () => {
    it("should return new state with the provided value", () => {
      expect(
        betslipReducer(
          { step: "REPORT", isCollapsed: false, obbReport: { foo: "bar" } },
          {
            type: UI__BETSLIP_OBB_RECEIPT_PANEL_DONE_CLICK,
          },
        ),
      ).toEqual(expect.objectContaining({ obbReport: undefined, step: "PLACE_POTENTIAL", isCollapsed: true }));
    });
  });

  describe("when action type is 'BETTING__OBB_TOGGLE_LEG_ACTION'", () => {
    it("should return new state with the provided value", () => {
      expect(
        betslipReducer(
          { step: "REPORT", isCollapsed: false, obbReport: { foo: "bar" } },
          {
            type: BETTING__OBB_TOGGLE_LEG_ACTION,
          },
        ),
      ).toEqual(expect.objectContaining({ obbReport: undefined, step: "PLACE_POTENTIAL", isCollapsed: false }));
    });
  });

  describe("when action type is 'BETTING__SBK_TOGGLE_LEG_ACTION'", () => {
    it("should return new state with the provided value", () => {
      expect(
        betslipReducer(
          { step: "REPORT", isCollapsed: false, obbReport: { foo: "bar" } },
          {
            type: BETTING__SBK_TOGGLE_LEG_ACTION,
          },
        ),
      ).toEqual(expect.objectContaining({ obbReport: undefined, step: "PLACE_POTENTIAL", isCollapsed: false }));
    });
  });

  describe("when action type is 'BETTING_UPDATE_OBB_TAGGING_METADATA'", () => {
    it("should return new state with the provided value", () => {
      expect(
        betslipReducer(
          { state: "some state" },
          {
            type: BETTING_UPDATE_OBB_TAGGING_METADATA,
            payload: {
              metadata: "obb tagging metadata",
            },
          },
        ),
      ).toEqual(
        expect.objectContaining({
          obbTaggingMetadata: "obb tagging metadata",
          state: "some state",
        }),
      );
    });
  });

  describe("when action type is 'NETWORK/COMBINE_SBK_BET_SUCCESS'", () => {
    describe("when first combination has at least one wallet", () => {
      describe("and doesn't have tokens", () => {
        it("should update the state with hasGenerosityWallets as true, hasGenerosityTokens as false and isGenerosityActive as true", () => {
          const state = betslipReducer(
            { state: "state" },
            {
              type: NETWORK__SBK_COMBINATIONS_UPDATE_SUCCESS,
              payload: {
                combinations: [{ wallets: [1, 2, 3], betCombinations: [] }],
              },
            },
          );

          expect(state).toEqual({
            state: "state",
            hasGenerosityWallets: true,
            hasGenerosityTokens: false,
            isGenerosityActive: true,
          });
        });
      });

      describe.each(["priceBoostTokens", "accaInsuranceTokens", "moneyBackTokens", "ghostLegTokens"])(
        "and has %s",
        (tokenKey) => {
          it("should update the state with hasGenerosityWallets, hasGenerosityTokens and isGenerosityActive as true", () => {
            const state = betslipReducer(
              { state: "state" },
              {
                type: NETWORK__SBK_COMBINATIONS_UPDATE_SUCCESS,
                payload: {
                  combinations: [{ wallets: [1, 2, 3], betCombinations: [{ tokens: { [tokenKey]: [1, 2, 3] } }] }],
                },
              },
            );

            expect(state).toEqual({
              state: "state",
              hasGenerosityWallets: true,
              hasGenerosityTokens: true,
              isGenerosityActive: true,
            });
          });
        },
      );
    });

    describe("when first combination does not have wallets", () => {
      describe("and doesn't have tokens", () => {
        it("should update the state with hasGenerosityWallets as false, hasGenerosityTokens as false and isGenerosityActive as false", () => {
          const state = betslipReducer(
            { state: "state" },
            {
              type: NETWORK__SBK_COMBINATIONS_UPDATE_SUCCESS,
              payload: {
                combinations: [{ betCombinations: [] }],
              },
            },
          );

          expect(state).toEqual({
            state: "state",
            hasGenerosityWallets: false,
            hasGenerosityTokens: false,
            isGenerosityActive: false,
          });
        });
      });

      describe.each(["priceBoostTokens", "accaInsuranceTokens", "moneyBackTokens", "ghostLegTokens"])(
        "and has %s",
        (tokenKey) => {
          it("should update the state with hasGenerosityWallets as false but hasGenerosityTokens and isGenerosityActive as true", () => {
            const state = betslipReducer(
              { state: "state" },
              {
                type: NETWORK__SBK_COMBINATIONS_UPDATE_SUCCESS,
                payload: {
                  combinations: [{ betCombinations: [{ tokens: { [tokenKey]: [1, 2, 3] } }] }],
                },
              },
            );

            expect(state).toEqual({
              state: "state",
              hasGenerosityWallets: false,
              hasGenerosityTokens: true,
              isGenerosityActive: true,
            });
          });
        },
      );
    });
  });

  describe("when action type is 'UI/BETSLIP_COLLAPSE_ACTION'", () => {
    describe("and step is report", () => {
      it("should update the state accordingly", () => {
        const state = betslipReducer(
          {
            state: "state",
            step: "REPORT",
            isCollapsed: false,
            sportsbookReport: "some report",
            obbReport: "some report",
          },
          {
            type: UI__BETSLIP_COLLAPSE_ACTION,
          },
        );

        expect(state).toEqual({
          state: "state",
          step: "PLACE_POTENTIAL",
          isCollapsed: true,
          sportsbookReport: undefined,
          obbReport: undefined,
        });
      });
    });

    describe("and step is not report", () => {
      it("should update the state accordingly", () => {
        const state = betslipReducer(
          { state: "state", step: "PLACE_POTENTIAL", isCollapsed: false },
          {
            type: UI__BETSLIP_COLLAPSE_ACTION,
          },
        );

        expect(state).toEqual({
          state: "state",
          step: "PLACE_POTENTIAL",
          isCollapsed: true,
        });
      });
    });
  });

  describe("when action type is 'BOTTOM_BAR_PUSH'", () => {
    describe("and step is report", () => {
      it("should update the state accordingly", () => {
        const state = betslipReducer(
          {
            state: "state",
            step: "REPORT",
            isCollapsed: false,
            sportsbookReport: "some report",
            obbReport: "some report",
          },
          {
            type: BOTTOM_BAR_PUSH,
          },
        );

        expect(state).toEqual({
          state: "state",
          step: "PLACE_POTENTIAL",
          isCollapsed: true,
          sportsbookReport: undefined,
          obbReport: undefined,
        });
      });
    });

    describe("and step is not report", () => {
      it("should update the state accordingly", () => {
        const state = betslipReducer(
          { state: "state", step: "PLACE_POTENTIAL", isCollapsed: false },
          {
            type: BOTTOM_BAR_PUSH,
          },
        );

        expect(state).toEqual({
          state: "state",
          step: "PLACE_POTENTIAL",
          isCollapsed: true,
        });
      });
    });
  });

  describe("when action type is UI__BETSLIP_SET_LAST_SUCCESSFUL_STAKE", () => {
    it("should set lastSuccessfulStake from payload", () => {
      const state = betslipReducer(
        {
          activeProduct: "SPORTSBOOK",
          lastSuccessfulStake: undefined,
        },
        {
          type: UI__BETSLIP_SET_LAST_SUCCESSFUL_STAKE,
          payload: { stake: 10 },
        },
      );

      expect(state.lastSuccessfulStake).toEqual(10);
    });

    it("should overwrite existing lastSuccessfulStake", () => {
      const state = betslipReducer(
        {
          activeProduct: "SPORTSBOOK",
          lastSuccessfulStake: 5,
        },
        {
          type: UI__BETSLIP_SET_LAST_SUCCESSFUL_STAKE,
          payload: { stake: 20 },
        },
      );

      expect(state.lastSuccessfulStake).toEqual(20);
    });
  });

  describe.each([NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE, NETWORK__INVALID_SESSION])(
    "when action type is %s",
    (actionType) => {
      it("should reset lastSuccessfulStake to undefined", () => {
        const state = betslipReducer(
          {
            activeProduct: "SPORTSBOOK",
            lastSuccessfulStake: 15,
          },
          {
            type: actionType,
          },
        );

        expect(state.lastSuccessfulStake).toEqual(undefined);
      });

      it("should not alter other state properties", () => {
        const state = betslipReducer(
          {
            activeProduct: "SPORTSBOOK",
            lastSuccessfulStake: 15,
            step: "PLACE_POTENTIAL",
          },
          {
            type: actionType,
          },
        );

        expect(state.activeProduct).toEqual("SPORTSBOOK");
        expect(state.step).toEqual("PLACE_POTENTIAL");
      });
    },
  );

  describe("when action type is NETWORK__FETCH_APP_CONTEXT_SUCCESS", () => {
    function buildAction(loggedIn) {
      return {
        type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
        payload: { initialState: { entities: { userdetails: { loggedIn } } } },
      };
    }

    it("should reset lastSuccessfulStake to undefined when the user is not logged in", () => {
      const state = betslipReducer(
        {
          activeProduct: "SPORTSBOOK",
          lastSuccessfulStake: 15,
        },
        buildAction(false),
      );

      expect(state.lastSuccessfulStake).toEqual(undefined);
    });

    it("should preserve lastSuccessfulStake when the user is logged in", () => {
      const state = betslipReducer(
        {
          activeProduct: "SPORTSBOOK",
          lastSuccessfulStake: 15,
        },
        buildAction(true),
      );

      expect(state.lastSuccessfulStake).toEqual(15);
    });

    it("should not alter other state properties when the user is not logged in", () => {
      const state = betslipReducer(
        {
          activeProduct: "SPORTSBOOK",
          lastSuccessfulStake: 15,
          step: "PLACE_POTENTIAL",
        },
        buildAction(false),
      );

      expect(state.activeProduct).toEqual("SPORTSBOOK");
      expect(state.step).toEqual("PLACE_POTENTIAL");
    });

    it("should return the same state reference when the user is logged in", () => {
      const initial = {
        activeProduct: "SPORTSBOOK",
        lastSuccessfulStake: 15,
        step: "PLACE_POTENTIAL",
      };
      const state = betslipReducer(initial, buildAction(true));

      expect(state).toBe(initial);
    });
  });

  describe("when action type is 'UI/BETSLIP_CLOSE_CLICK' with lastSuccessfulStake", () => {
    it("should preserve lastSuccessfulStake when betslip closes", () => {
      const state = betslipReducer(
        {
          activeProduct: "SPORTSBOOK",
          lastSuccessfulStake: 25,
        },
        {
          type: UI__BETSLIP_CLOSE_CLICK,
        },
      );

      expect(state.lastSuccessfulStake).toEqual(25);
    });
  });

  describe("when the product is Exchange", () => {
    describe("and action type is 'PUSH'", () => {
      it("should clear exchange context fields", () => {
        const state = betslipReducer(
          {
            activeProduct: "EXCHANGE",
            exchangeContext: "some context",
          },
          {
            type: PUSH,
          },
        );
        expect(state).toEqual({
          activeProduct: "EXCHANGE",
          exchangeContext: undefined,
          exchangeEdit: undefined,
          exchangePlaceError: undefined,
          exchangeReport: undefined,
        });
      });
    });

    describe("and the action is UI__NAVIGATION_TAB_CLICK", () => {
      it("should clear exchange context fields", () => {
        const state = betslipReducer(
          {
            activeProduct: "EXCHANGE",
            exchangeContext: "some context",
          },
          {
            type: UI__NAVIGATION_TAB_CLICK,
          },
        );
        expect(state).toEqual({
          activeProduct: "EXCHANGE",
          exchangeContext: undefined,
          exchangeEdit: undefined,
          exchangePlaceError: undefined,
          exchangeReport: undefined,
        });
      });
    });
  });

  describe("when the product is Sportsbook", () => {
    describe("and action type is 'PUSH'", () => {
      it("should not change state", () => {
        const state = betslipReducer(
          {
            activeProduct: "SPORTSBOOK",
            exchangeContext: "some context",
          },
          {
            type: PUSH,
          },
        );
        expect(state).toEqual({
          activeProduct: "SPORTSBOOK",
          exchangeContext: "some context",
        });
      });
    });

    describe("and the action is UI__NAVIGATION_TAB_CLICK", () => {
      it("should not change state", () => {
        const state = betslipReducer(
          {
            activeProduct: "SPORTSBOOK",
            exchangeContext: "some context",
          },
          {
            type: UI__NAVIGATION_TAB_CLICK,
          },
        );
        expect(state).toEqual({
          activeProduct: "SPORTSBOOK",
          exchangeContext: "some context",
        });
      });
    });
  });

  describe("when action type is 'UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE'", () => {
    it("should return new state with the provided oddsMovementPreference", () => {
      const state = betslipReducer(
        { stateProps: "stateData" },
        {
          type: UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE,
          payload: {
            isOddsMovementAccepted: true,
          },
        },
      );

      expect(state).toEqual({
        stateProps: "stateData",
        hasUserChangedOddsMovementPreference: true,
      });
    });
  });

  describe("when action type is 'UI__MY_BETS_SBK_ADD_PREVIOUS_SELECTIONS_CLICK'", () => {
    it("should set isCollapsed to false", () => {
      const state = betslipReducer(
        { state: "state", isCollapsed: true },
        {
          type: UI__MY_BETS_SBK_ADD_PREVIOUS_SELECTIONS_CLICK,
        },
      );

      expect(state).toEqual({
        state: "state",
        isCollapsed: false,
      });
    });

    it("should keep other state properties unchanged", () => {
      const state = betslipReducer(
        { step: "PLACE_POTENTIAL", activeProduct: "SPORTSBOOK", isCollapsed: true },
        {
          type: UI__MY_BETS_SBK_ADD_PREVIOUS_SELECTIONS_CLICK,
        },
      );

      expect(state).toEqual({
        step: "PLACE_POTENTIAL",
        activeProduct: "SPORTSBOOK",
        isCollapsed: false,
      });
    });
  });

  describe("when action type is 'UI__SWITCH_PRODUCT_PREFERENCE'", () => {
    describe("when switching to exchange", () => {
      it("should set activeProduct to EXCHANGE", () => {
        const state = betslipReducer(
          { activeProduct: "SPORTSBOOK", step: "PLACE_POTENTIAL" },
          {
            type: UI__SWITCH_PRODUCT_PREFERENCE,
            payload: { productSwitcherPreference: ProductsOption.exchange },
          },
        );

        expect(state.activeProduct).toEqual("EXCHANGE");
      });

      it("should set isCollapsed to true, step to 'PLACE_POTENTIAL'", () => {
        const state = betslipReducer(
          { activeProduct: "SPORTSBOOK", step: "REPORT", isCollapsed: false },
          {
            type: UI__SWITCH_PRODUCT_PREFERENCE,
            payload: { productSwitcherPreference: ProductsOption.exchange },
          },
        );

        expect(state).toEqual({
          activeProduct: "EXCHANGE",
          isCollapsed: true,
          step: "PLACE_POTENTIAL",
        });
      });
    });

    describe("when switching to sportsbook", () => {
      it("should set activeProduct to SPORTSBOOK", () => {
        const state = betslipReducer(
          { activeProduct: "EXCHANGE", step: "PLACE_POTENTIAL" },
          {
            type: UI__SWITCH_PRODUCT_PREFERENCE,
            payload: { productSwitcherPreference: ProductsOption.sportsbook },
          },
        );

        expect(state.activeProduct).toEqual("SPORTSBOOK");
      });

      it("should set isCollapsed to true, step to 'PLACE_POTENTIAL'", () => {
        const state = betslipReducer(
          {
            activeProduct: "EXCHANGE",
            step: "REPORT",
            isCollapsed: false,
          },
          {
            type: UI__SWITCH_PRODUCT_PREFERENCE,
            payload: { productSwitcherPreference: ProductsOption.sportsbook },
          },
        );

        expect(state).toEqual({
          activeProduct: "SPORTSBOOK",
          isCollapsed: true,
          step: "PLACE_POTENTIAL",
        });
      });
    });
  });
});
