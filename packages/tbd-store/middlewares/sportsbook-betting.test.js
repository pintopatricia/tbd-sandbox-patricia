import {
  addLeg,
  incrementStake,
  init,
  LEG_TYPES,
  removeLeg,
  updateStake,
  clearPlaceFailures,
  updateCombinations,
  updateBonusWallets,
  updatePlaceFailures,
  updateBonusUse,
  updateEachWay,
  updatePriceBoost,
  updateAccaInsurance,
  updateOrder,
  updateSP,
  generateRunnerId,
  generateLegId,
  updateCombinationReview,
  updateGroupOptions,
  clearBonusWallets,
  updateMoneyBack,
  updateCombinationsWithPlace,
  updateState,
  UPDATE_ACTIONS,
} from "@ppb/betslip-core";

import { getSportsbookReport } from "../state/betslip/betslip-card-selectors";
import {
  getBettingResolvers,
  getSportsbookBettingCombinations,
  createGetGreatestOddCombinationSelector,
  pickGreatestOddCombination,
} from "../state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { createGetExperimentSelector } from "../state/entities/experiments/experiments-selectors";
import {
  BETTING__SBK_ADD_SELECTIONS,
  BETTING__SBK_ADD_SELECTIONS_SUCCESS,
  BETTING__SBK_CLEAR_ACTION,
  BETTING__SBK_INCREMENT_STAKE_ACTION,
  BETTING__SBK_TOGGLE_LEG_ACTION,
  BETTING__SBK_TOGGLE_ONE_LINE_LEG_ACTION,
  BETTING__SBK_UPDATE_COMBINATION_STAKE_ACTION,
  BETTING__SBK_STATE_UPDATE,
  BETTING__SBK_COMBINATIONS_OUTDATED,
  BETTING__SBK_VALIDATE_STAKE,
  BETTING__SBK_REMOVE_LEG_ACTION,
  BETTING__SBK_REMOVE_BOOSTED_COMBINATION_ACTION,
  BETTING__SBK_PLACE_FAILED_UPDATE,
  BETTING__SBK_BONUS_TOGGLE_ACTION,
  BETTING__SBK_EACH_WAY_TOGGLE,
  BETTING__SBK_PRICE_BOOST_TOGGLE,
  BETTING__SBK_ACCA_INSURANCE_TOGGLE,
  BETTING__SBK_GHOST_LEG_TOGGLE,
  BETTING__SBK_ORDER_CHANGE,
  BETTING__SBK_INVALID_LEGS_AMOUNT,
  BETTING__SBK_LOAD_STORAGE_SUCCESS,
  BETTING__SBK_SWITCH_GROUP,
  BETTING__SBK_STARTING_PRICE_TOGGLE,
  UI__MARKET_SBK_BET_BUTTON_CLICK,
  BETTING__SBK_ADD_SELECTION_TAGGING,
  BETTING__OBB_CLEAR_ACTION,
  BETTING__SPORTSBOOK_FREE_BETS_WALLETS_APPLY_ACTION,
  BETTING__OBB_SBK_CLEAR_ACTION,
  BETTING__SPORTSBOOK_REMOVE_ALL_FREE_BETS_WALLETS_ACTION,
  BETTING__SPORTSBOOK_REMOVE_ALL_COMBINATION_FREE_BETS_WALLETS_ACTION,
  BETTING__SBK_MONEY_BACK_TOGGLE,
} from "../actions/betting";
import {
  NETWORK__SBK_COMBINATIONS_UPDATE_SUCCESS,
  NETWORK__PLACE_SBK_BET_IN_PROGRESS,
  NETWORK__PLACE_SBK_BET_FAILURE,
  NETWORK__PLACE_SBK_BET_SUCCESS,
  UI__BETSLIP_SBK_RE_ADD_SELECTIONS_CLICK,
  UI__BETSLIP_SET_COLLAPSE_ACTION,
  UI__BETSLIP_SET_LAST_SUCCESSFUL_STAKE,
  NETWORK__FETCH_COMBINATIONS_LIST_SUCCESS,
} from "../actions/betslip";
import { MODULES__SBK_BETTING_LOADED } from "../actions/modules";
import { UI__ACTION_CONFIRMATION } from "../actions/confirmation";
import {
  NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE,
  NETWORK__FETCH_APP_CONTEXT_SUCCESS,
  NETWORK__INVALID_SESSION,
} from "../actions/app-context";
import { findSingleCombinationFromLegId, getSimpleSelectionLegs } from "../helpers/sportsbook-betting";
import { getBasicSpan } from "../helpers/telemetry/betting-telemetry";
import { UI__SWITCH_PRODUCT_PREFERENCE } from "../actions/preferences";
import { UI__MY_BETS_SBK_ADD_PREVIOUS_SELECTIONS_CLICK } from "../actions/my-bets";
import { productConfiguration } from "../config/product-configuration";
import { ProductsOption } from "../state";

import { sportsbookBettingMiddleware } from "./sportsbook-betting";

jest.mock("../state/entities/user-wallets/user-wallets-selectors");
jest.mock("../state/entities/sportsbook-runners/sportsbook-runner-selectors");
jest.mock("../state/entities/sportsbook-runners/sportsbook-runners-reducer");

const mockQuickBetConfig = { current: undefined };

jest.mock("../state/betting/sportsbook-betting/sportsbook-betting-selectors", () => {
  const actual = jest.createMockFromModule("../state/betting/sportsbook-betting/sportsbook-betting-selectors");
  const mockGetGreatestOddCombination = jest.fn();
  return {
    ...actual,
    createGetGreatestOddCombinationSelector: jest.fn(() => mockGetGreatestOddCombination),
    createQuickBetslipBetPickerSelector: jest.fn(() => () => mockQuickBetConfig.current),
    pickGreatestOddCombination: jest.fn(),
  };
});

const mockExperimentConfig = { current: undefined };

jest.mock("../state/entities/experiments/experiments-selectors", () => ({
  createGetExperimentSelector: jest.fn().mockImplementation(() => () => mockExperimentConfig.current),
}));
jest.mock("../state/betslip/betslip-card-selectors");
jest.mock("../helpers/sportsbook-betting");
jest.mock("../config/product-configuration", () => ({
  productConfiguration: {
    getPayoutLimit: jest.fn(),
    getPayoutLimitTermsUrl: jest.fn(),
  },
}));
jest.mock("@ppb/betslip-core");

const mockThrottleConfig = { current: {} };

jest.mock("@ppb/tbd-store/state/entities/throttles/throttles-selectors", () => ({
  createGetThrottleSelector: jest.fn().mockImplementation(() => () => mockThrottleConfig.current),
}));

jest.mock("../state/betslip/betslip-popular-bets-selectors", () => ({
  createGetPopularCombination: jest.fn(() =>
    jest.fn(() => ({ bettingOpportunityId: "1", bettingOpportunityType: "POPULAR" })),
  ),
}));

jest.mock("../helpers/telemetry/betting-telemetry", () => ({
  getBasicSpan: jest.fn().mockReturnValue({
    setAttribute: jest.fn(),
    end: jest.fn(),
  }),
}));

jest.mock("@opentelemetry/api", () => ({
  trace: {
    getTracer: jest.fn().mockReturnValue({}),
  },
  SpanStatusCode: {
    ERROR: 2,
  },
}));

function setupCompleteMocks({ odds, bspMarket = false } = {}) {
  generateRunnerId.mockReturnValue("RUNNER:1");
  generateLegId.mockReturnValue("LEG:1");
  getSimpleSelectionLegs.mockImplementation((legs) => legs);
  getBettingResolvers.mockReturnValue({
    getMarketRunnerIdAssociation: jest.fn().mockReturnValue({ marketId: "1.1", selectionId: 1, handicap: -2.5 }),
    getMarketRunnerURNAssociation: jest
      .fn()
      .mockReturnValue([{ marketUrn: "marketUrn:1", runnerUrn: "runnerUrn:1/1" }]),
    getAddSelectionsPayload: jest.fn().mockReturnValue({ SIMPLE: { selections: [] } }),
    getAddLegPayload: jest.fn().mockReturnValue({
      legType: LEG_TYPES.SIMPLE_SELECTION,
      runners: [{ marketId: "1.1", selectionId: 1, handicap: -2.5 }],
      odds: { decimalOdds: 1.23 },
      displayOdds: { decimalOdds: 1.23 },
      combinationDefaults: {
        eachWayOdds: { decimalOdds: 1.23 },
        eachWayPlaces: "3",
        eachWayPlacesFraction: "1/5",
        stake: null,
        isEachWayAvailable: true,
        isSPAvailable: bspMarket,
        isSPSelected: bspMarket && !odds,
      },
    }),
  });
}

function setupNoPayload() {
  getBettingResolvers.mockReturnValue({
    getMarketRunnerIdAssociation: jest.fn().mockReturnValue({ marketId: "1.1", selectionId: 1, handicap: -2.5 }),
    getMarketRunnerURNAssociation: jest
      .fn()
      .mockReturnValue([{ marketUrn: "marketUrn:1", runnerUrn: "runnerUrn:1/1" }]),
    getAddSelectionsPayload: jest.fn().mockReturnValue({ SIMPLE: { selections: [] } }),
    getAddLegPayload: () => undefined,
  });
}

function setup(
  action,
  sportsbookBetting = { legs: {} },
  nextSpy = jest.fn(),
  dispatchSpy = jest.fn(),
  userDetails = {},
  brandSettings = {},
  obbBetting = { legs: {} },
) {
  const state = {
    betting: {
      sportsbookBetting,
      obbBetting,
    },
    betslip: {
      group: "REAL",
    },
    entities: {
      userdetails: userDetails,
      brandSettings,
    },
  };

  productConfiguration.getPayoutLimit.mockReturnValue({ hardCap: 50, softCap: 25, hardCapKey: "TRANSLATION_KEY" });
  productConfiguration.getPayoutLimitTermsUrl.mockReturnValue("https://some.url");

  const store = {
    getState: jest.fn().mockReturnValue(state),
    dispatch: dispatchSpy,
  };

  return sportsbookBettingMiddleware(store)(nextSpy)(action);
}

function setupWithQuickBetslip({
  action,
  sportsbookBetting = { legs: {}, combinations: {}, runners: {} },
  nextSpy = jest.fn(),
  dispatchSpy = jest.fn(),
  isCollapsed = false,
  experimentActive = true,
  quickBet = { status: "valid", combinationId: "COMBINATION:1" },
  obbBetting = { legs: {} },
} = {}) {
  if (experimentActive) {
    mockExperimentConfig.current = { variant: "quick-betslip-variant-a" };
  }
  mockQuickBetConfig.current = quickBet;

  const state = {
    betting: {
      sportsbookBetting,
      obbBetting,
    },
    betslip: {
      group: "REAL",
      isCollapsed,
    },
    entities: {
      userdetails: {},
      brandSettings: {},
      experiments: experimentActive ? { "quick-betslip": { variant: "quick-betslip-variant-a" } } : {},
    },
  };

  productConfiguration.getPayoutLimit.mockReturnValue({ hardCap: 50, softCap: 25, hardCapKey: "TRANSLATION_KEY" });
  productConfiguration.getPayoutLimitTermsUrl.mockReturnValue("https://some.url");

  const store = {
    getState: jest.fn().mockReturnValue(state),
    dispatch: dispatchSpy,
  };

  return sportsbookBettingMiddleware(store)(nextSpy)(action);
}

describe("Sportsbook Betting Middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockThrottleConfig.current = {};
    mockExperimentConfig.current = undefined;
    mockQuickBetConfig.current = undefined;
  });

  describe("when action type is BETTING__SBK_STATE_UPDATE", () => {
    describe("when the action is intercepted", () => {
      it("should not dispatch another BETTING__SBK_STATE_UPDATE", () => {
        const dispatchSpy = jest.fn();

        setupWithQuickBetslip({
          action: {
            type: BETTING__SBK_STATE_UPDATE,
            payload: { state: { combinations: {}, legs: {} }, group: "REAL", intercepted: true },
          },
          isCollapsed: true,
          dispatchSpy,
        });

        expect(dispatchSpy).not.toHaveBeenCalled();
      });
    });

    describe("when the betslip is not collapsed", () => {
      it("should not dispatch another BETTING__SBK_STATE_UPDATE", () => {
        const dispatchSpy = jest.fn();

        setupWithQuickBetslip({
          action: {
            type: BETTING__SBK_STATE_UPDATE,
            payload: { state: { combinations: {}, legs: {} }, group: "REAL" },
          },
          isCollapsed: false,
          dispatchSpy,
        });

        expect(dispatchSpy).not.toHaveBeenCalled();
      });
    });

    describe("when the quick betslip experiment is not active", () => {
      it("should not dispatch another BETTING__SBK_STATE_UPDATE", () => {
        const dispatchSpy = jest.fn();

        setupWithQuickBetslip({
          action: {
            type: BETTING__SBK_STATE_UPDATE,
            payload: { state: { combinations: {}, legs: {} }, group: "REAL" },
          },
          isCollapsed: true,
          experimentActive: false,
          dispatchSpy,
        });

        expect(dispatchSpy).not.toHaveBeenCalled();
      });
    });

    describe("when experiment is active, betslip is collapsed and action is not intercepted", () => {
      it("should not dispatch if resetStake returns the same state reference", () => {
        const dispatchSpy = jest.fn();
        const nextBettingState = { combinations: {}, legs: {} };

        pickGreatestOddCombination.mockReturnValue(undefined);

        setupWithQuickBetslip({
          action: {
            type: BETTING__SBK_STATE_UPDATE,
            payload: { state: nextBettingState, group: "REAL" },
          },
          isCollapsed: true,
          dispatchSpy,
        });

        expect(dispatchSpy).not.toHaveBeenCalled();
      });

      it("should dispatch intercepted BETTING__SBK_STATE_UPDATE when resetStake produces a different state", () => {
        const dispatchSpy = jest.fn();
        const nextBettingState = {
          combinations: {
            "COMBINATION:1": { id: "COMBINATION:1", stake: 5 },
          },
          legs: {},
        };
        const resetBettingState = {
          combinations: {
            "COMBINATION:1": { id: "COMBINATION:1", stake: 10 },
          },
          legs: {},
        };
        const oldGreatestCombination = { id: "COMBINATION:OLD", stake: 10 };
        const newGreatestCombination = { id: "COMBINATION:1", stake: undefined };

        pickGreatestOddCombination
          .mockReturnValueOnce(oldGreatestCombination)
          .mockReturnValueOnce(newGreatestCombination);
        updateStake.mockReturnValue(resetBettingState);

        setupWithQuickBetslip({
          action: {
            type: BETTING__SBK_STATE_UPDATE,
            payload: { state: nextBettingState, group: "REAL" },
          },
          isCollapsed: true,
          dispatchSpy,
          sportsbookBetting: {
            combinations: {
              "COMBINATION:OLD": { id: "COMBINATION:OLD", stake: 10 },
            },
            legs: {},
            runners: {},
          },
        });

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: resetBettingState,
            group: "REAL",
            intercepted: true,
          },
        });
      });
    });
  });

  describe("when action type is UI__BETSLIP_SET_COLLAPSE_ACTION", () => {
    describe("when the quick betslip experiment is not active", () => {
      it("should not dispatch BETTING__SBK_STATE_UPDATE", () => {
        const dispatchSpy = jest.fn();

        setupWithQuickBetslip({
          action: {
            type: UI__BETSLIP_SET_COLLAPSE_ACTION,
            payload: { collapse: true },
          },
          isCollapsed: false,
          experimentActive: false,
          dispatchSpy,
        });

        expect(dispatchSpy).not.toHaveBeenCalled();
      });
    });

    describe("when collapsing (Normal -> Quick transition)", () => {
      it("should dispatch BETTING__SBK_STATE_UPDATE with reset state preserving greatest odd stake", () => {
        const dispatchSpy = jest.fn();
        const greatestCombination = { id: "COMBINATION:1", stake: 5 };
        const finalState = { combinations: { "COMBINATION:1": { stake: 5 } }, legs: {} };

        pickGreatestOddCombination.mockReturnValue(greatestCombination);
        clearBonusWallets.mockImplementation((state) => state);
        updateBonusUse.mockImplementation((state) => state);
        clearPlaceFailures.mockImplementation((state) => state);
        updateStake.mockReturnValue(finalState);

        const sportsbookBetting = {
          combinations: {
            "COMBINATION:1": {
              id: "COMBINATION:1",
              stake: 5,
              isEachWaySelected: false,
              isSPSelected: false,
              isPriceBoostSelected: false,
              isAccaInsuranceSelected: false,
              isMoneyBackSelected: false,
            },
          },
          legs: {},
          runners: {},
          isBonusSelected: false,
        };

        setupWithQuickBetslip({
          action: {
            type: UI__BETSLIP_SET_COLLAPSE_ACTION,
            payload: { collapse: true },
          },
          isCollapsed: false,
          sportsbookBetting,
          dispatchSpy,
        });

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: finalState,
            group: "REAL",
          },
        });
      });

      it("should call clearBonusWallets and clearPlaceFailures as part of resetState", () => {
        const greatestCombination = { id: "COMBINATION:1", stake: 5 };

        pickGreatestOddCombination.mockReturnValue(greatestCombination);
        clearBonusWallets.mockImplementation((state) => state);
        updateBonusUse.mockImplementation((state) => state);
        clearPlaceFailures.mockImplementation((state) => state);
        updateStake.mockImplementation((state) => state);

        const sportsbookBetting = {
          combinations: {
            "COMBINATION:1": {
              id: "COMBINATION:1",
              stake: 5,
              isEachWaySelected: false,
              isSPSelected: false,
              isPriceBoostSelected: false,
              isAccaInsuranceSelected: false,
              isMoneyBackSelected: false,
            },
          },
          legs: {},
          runners: {},
          isBonusSelected: false,
        };

        setupWithQuickBetslip({
          action: {
            type: UI__BETSLIP_SET_COLLAPSE_ACTION,
            payload: { collapse: true },
          },
          isCollapsed: false,
          sportsbookBetting,
        });

        expect(clearBonusWallets).toHaveBeenCalled();
        expect(clearPlaceFailures).toHaveBeenCalled();
      });

      it("should call updateStake to clear combination stake as part of resetState when stake is defined", () => {
        const greatestCombination = { id: "COMBINATION:1", stake: 5 };

        pickGreatestOddCombination.mockReturnValue(greatestCombination);
        clearBonusWallets.mockImplementation((state) => state);
        clearPlaceFailures.mockImplementation((state) => state);
        updateStake.mockImplementation((state) => state);

        const sportsbookBetting = {
          combinations: {
            "COMBINATION:1": {
              id: "COMBINATION:1",
              stake: 5,
              isEachWaySelected: false,
              isSPSelected: false,
              isPriceBoostSelected: false,
              isAccaInsuranceSelected: false,
              isMoneyBackSelected: false,
            },
          },
          legs: {},
          runners: {},
          isBonusSelected: false,
        };

        setupWithQuickBetslip({
          action: {
            type: UI__BETSLIP_SET_COLLAPSE_ACTION,
            payload: { collapse: true },
          },
          isCollapsed: false,
          sportsbookBetting,
        });

        expect(updateStake).toHaveBeenCalledWith(expect.anything(), {
          combinationId: "COMBINATION:1",
          stake: undefined,
        });
      });

      it("should not dispatch when betslip was already collapsed", () => {
        const dispatchSpy = jest.fn();

        pickGreatestOddCombination.mockReturnValue(undefined);
        clearBonusWallets.mockImplementation((state) => state);
        clearPlaceFailures.mockImplementation((state) => state);

        const sportsbookBetting = {
          combinations: {},
          legs: {},
          runners: {},
          isBonusSelected: false,
        };

        setupWithQuickBetslip({
          action: {
            type: UI__BETSLIP_SET_COLLAPSE_ACTION,
            payload: { collapse: true },
          },
          isCollapsed: true,
          sportsbookBetting,
          dispatchSpy,
        });

        expect(dispatchSpy).not.toHaveBeenCalled();
      });
    });

    describe("when expanding (Quick -> Normal transition)", () => {
      it("should not dispatch BETTING__SBK_STATE_UPDATE", () => {
        const dispatchSpy = jest.fn();

        setupWithQuickBetslip({
          action: {
            type: UI__BETSLIP_SET_COLLAPSE_ACTION,
            payload: { collapse: false },
          },
          isCollapsed: true,
          dispatchSpy,
        });

        expect(dispatchSpy).not.toHaveBeenCalled();
      });
    });

    describe("when collapsing and there is no greatest odd combination", () => {
      it("should dispatch BETTING__SBK_STATE_UPDATE with reset state without carrying stake", () => {
        const dispatchSpy = jest.fn();
        const resetState = { combinations: {}, legs: {} };

        pickGreatestOddCombination.mockReturnValue(undefined);
        clearBonusWallets.mockReturnValue(resetState);
        clearPlaceFailures.mockReturnValue(resetState);

        const sportsbookBetting = {
          combinations: {},
          legs: {},
          runners: {},
          isBonusSelected: false,
        };

        setupWithQuickBetslip({
          action: {
            type: UI__BETSLIP_SET_COLLAPSE_ACTION,
            payload: { collapse: true },
          },
          isCollapsed: false,
          sportsbookBetting,
          dispatchSpy,
        });

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: resetState,
            group: "REAL",
          },
        });
        expect(updateStake).not.toHaveBeenCalled();
      });
    });

    describe("when collapsing with experiment on and quick bet valid", () => {
      function buildCombination(overrides = {}) {
        return {
          id: "COMBINATION:1",
          stake: undefined,
          isEachWaySelected: false,
          isSPSelected: false,
          isPriceBoostSelected: false,
          isAccaInsuranceSelected: false,
          isMoneyBackSelected: false,
          ...overrides,
        };
      }

      function triggerCollapseWith(sportsbookBetting) {
        pickGreatestOddCombination.mockReturnValue(undefined);
        clearBonusWallets.mockImplementation((state) => state);
        clearPlaceFailures.mockImplementation((state) => state);
        updateBonusUse.mockImplementation((state) => state);
        updateStake.mockImplementation((state) => state);
        updateEachWay.mockImplementation((state) => state);
        updateSP.mockImplementation((state) => state);
        updatePriceBoost.mockImplementation((state) => state);
        updateAccaInsurance.mockImplementation((state) => state);
        updateMoneyBack.mockImplementation((state) => state);

        setupWithQuickBetslip({
          action: {
            type: UI__BETSLIP_SET_COLLAPSE_ACTION,
            payload: { collapse: true },
          },
          isCollapsed: false,
          sportsbookBetting,
        });
      }

      it("should clear each-way selection when isEachWaySelected is true", () => {
        triggerCollapseWith({
          combinations: { "COMBINATION:1": buildCombination({ isEachWaySelected: true }) },
          legs: {},
          runners: {},
          isBonusSelected: false,
        });

        expect(updateEachWay).toHaveBeenCalledWith(expect.anything(), {
          combinationId: "COMBINATION:1",
          isEachWaySelected: false,
        });
      });

      it("should not clear each-way when isEachWaySelected is false", () => {
        triggerCollapseWith({
          combinations: { "COMBINATION:1": buildCombination() },
          legs: {},
          runners: {},
          isBonusSelected: false,
        });

        expect(updateEachWay).not.toHaveBeenCalled();
      });

      it("should clear starting price selection when isSPSelected is true", () => {
        triggerCollapseWith({
          combinations: { "COMBINATION:1": buildCombination({ isSPSelected: true }) },
          legs: {},
          runners: {},
          isBonusSelected: false,
        });

        expect(updateSP).toHaveBeenCalledWith(expect.anything(), {
          combinationId: "COMBINATION:1",
          isSPSelected: false,
        });
      });

      it("should clear price boost selection when isPriceBoostSelected is true", () => {
        triggerCollapseWith({
          combinations: { "COMBINATION:1": buildCombination({ isPriceBoostSelected: true }) },
          legs: {},
          runners: {},
          isBonusSelected: false,
        });

        expect(updatePriceBoost).toHaveBeenCalledWith(expect.anything(), {
          combinationId: "COMBINATION:1",
          selectedTokenId: undefined,
          isPriceBoostSelected: false,
        });
      });

      it("should clear acca insurance selection when isAccaInsuranceSelected is true", () => {
        triggerCollapseWith({
          combinations: { "COMBINATION:1": buildCombination({ isAccaInsuranceSelected: true }) },
          legs: {},
          runners: {},
          isBonusSelected: false,
        });

        expect(updateAccaInsurance).toHaveBeenCalledWith(expect.anything(), {
          combinationId: "COMBINATION:1",
          selectedTokenId: undefined,
          isAccaInsuranceSelected: false,
        });
      });

      it("should clear money back selection when isMoneyBackSelected is true", () => {
        triggerCollapseWith({
          combinations: { "COMBINATION:1": buildCombination({ isMoneyBackSelected: true }) },
          legs: {},
          runners: {},
          isBonusSelected: false,
        });

        expect(updateMoneyBack).toHaveBeenCalledWith(expect.anything(), {
          combinationId: "COMBINATION:1",
          selectedTokenId: undefined,
          isMoneyBackSelected: false,
        });
      });

      it("should turn off bonus use when isBonusSelected is true", () => {
        triggerCollapseWith({
          combinations: { "COMBINATION:1": buildCombination() },
          legs: {},
          runners: {},
          isBonusSelected: true,
        });

        expect(updateBonusUse).toHaveBeenCalledWith(expect.anything(), { isBonusSelected: false });
      });

      it("should not turn off bonus use when isBonusSelected is false", () => {
        triggerCollapseWith({
          combinations: { "COMBINATION:1": buildCombination() },
          legs: {},
          runners: {},
          isBonusSelected: false,
        });

        expect(updateBonusUse).not.toHaveBeenCalled();
      });

      it("should run every cleanup step for a fully selected combination", () => {
        triggerCollapseWith({
          combinations: {
            "COMBINATION:1": buildCombination({
              stake: 7,
              isEachWaySelected: true,
              isSPSelected: true,
              isPriceBoostSelected: true,
              isAccaInsuranceSelected: true,
              isMoneyBackSelected: true,
            }),
          },
          legs: {},
          runners: {},
          isBonusSelected: true,
        });

        expect(updateStake).toHaveBeenCalledWith(expect.anything(), {
          combinationId: "COMBINATION:1",
          stake: undefined,
        });
        expect(updateEachWay).toHaveBeenCalled();
        expect(updateSP).toHaveBeenCalled();
        expect(updatePriceBoost).toHaveBeenCalled();
        expect(updateAccaInsurance).toHaveBeenCalled();
        expect(updateMoneyBack).toHaveBeenCalled();
        expect(clearBonusWallets).toHaveBeenCalled();
        expect(updateBonusUse).toHaveBeenCalledWith(expect.anything(), { isBonusSelected: false });
        expect(clearPlaceFailures).toHaveBeenCalled();
      });
    });

    describe("when collapsing with experiment on but quick bet is not valid", () => {
      it("should not run any cleanup when quick bet is null", () => {
        const dispatchSpy = jest.fn();

        setupWithQuickBetslip({
          action: {
            type: UI__BETSLIP_SET_COLLAPSE_ACTION,
            payload: { collapse: true },
          },
          isCollapsed: false,
          quickBet: null,
          sportsbookBetting: {
            combinations: { "COMBINATION:1": { id: "COMBINATION:1", stake: 5, isEachWaySelected: true } },
            legs: {},
            runners: {},
            isBonusSelected: true,
          },
          dispatchSpy,
        });

        expect(dispatchSpy).not.toHaveBeenCalled();
        expect(updateStake).not.toHaveBeenCalled();
        expect(updateEachWay).not.toHaveBeenCalled();
        expect(clearBonusWallets).not.toHaveBeenCalled();
        expect(clearPlaceFailures).not.toHaveBeenCalled();
      });

      it("should not run any cleanup when quick bet status is fallback", () => {
        const dispatchSpy = jest.fn();

        setupWithQuickBetslip({
          action: {
            type: UI__BETSLIP_SET_COLLAPSE_ACTION,
            payload: { collapse: true },
          },
          isCollapsed: false,
          quickBet: { status: "fallback", reason: "non_football" },
          sportsbookBetting: {
            combinations: { "COMBINATION:1": { id: "COMBINATION:1", stake: 5, isEachWaySelected: true } },
            legs: {},
            runners: {},
            isBonusSelected: true,
          },
          dispatchSpy,
        });

        expect(dispatchSpy).not.toHaveBeenCalled();
        expect(updateStake).not.toHaveBeenCalled();
        expect(updateEachWay).not.toHaveBeenCalled();
      });
    });
  });

  describe("when action type is BETTING__SBK_TOGGLE_LEG_ACTION", () => {
    it("should call clearPlaceFailures with current state", async () => {
      const bettingState = { legs: { "LEG:1": {} } };

      removeLeg.mockReturnValue(bettingState);
      addLeg.mockReturnValue(bettingState);
      setupCompleteMocks({ sbkRunner: { odds: { decimal: 1.23, fractional: { numerator: 1, denominator: 2 } } } });
      setup(
        {
          type: BETTING__SBK_TOGGLE_LEG_ACTION,
          payload: {
            urn: "URN:1",
            group: "REAL",
          },
        },
        bettingState,
      );

      expect(clearPlaceFailures).toHaveBeenCalledWith(bettingState);
    });

    describe("when the current group is different from the added one", () => {
      describe("when there are already legs", () => {
        it("should dispatch CONFIRMATION/ACTION with BETTING__SBK_SWITCH_GROUP", async () => {
          const dispatchSpy = jest.fn();

          setupCompleteMocks({ sbkRunner: { odds: 1.23 } });
          setup(
            { type: BETTING__SBK_TOGGLE_LEG_ACTION, payload: { group: "VIRTUAL", urn: "urn" } },
            { legs: { "LEG:1": {} } },
            jest.fn(),
            dispatchSpy,
          );

          expect(dispatchSpy).toHaveBeenCalledWith({
            type: UI__ACTION_CONFIRMATION,
            payload: {
              id: "BETTING_GROUP_SWITCH",
              acceptActions: [
                {
                  type: BETTING__SBK_SWITCH_GROUP,
                  payload: {
                    group: "VIRTUAL",
                    urn: "urn",
                  },
                },
              ],
              refuseActions: [],
            },
          });
        });
      });

      describe("when there are no legs", () => {
        it("should update the state", async () => {
          const dispatchSpy = jest.fn();

          setupCompleteMocks({ sbkRunner: { odds: 1.23 } });
          setup(
            { type: BETTING__SBK_TOGGLE_LEG_ACTION, payload: { group: "VIRTUAL" } },
            { legs: {} },
            jest.fn(),
            dispatchSpy,
          );

          expect(dispatchSpy).toHaveBeenCalledWith({
            type: BETTING__SBK_STATE_UPDATE,
            payload: {
              state: {
                legs: { "LEG:1": {} },
              },
              group: "VIRTUAL",
            },
          });
        });
      });
    });

    describe("when the runner association does not exist", () => {
      it("should ignore the action", async () => {
        const dispatchSpy = jest.fn();

        setupCompleteMocks({ sbkRunner: { odds: 1.23 } });
        setup(
          { type: BETTING__SBK_TOGGLE_LEG_ACTION, payload: { group: "REAL" } },
          { legs: {} },
          jest.fn(),
          dispatchSpy,
        );

        expect(dispatchSpy).not.toHaveBeenCalledWith({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            group: "REAL",
          },
        });
      });
    });

    describe("when the leg is already present in the betting state", () => {
      it("should dispatch BETTING__SBK_STATE_UPDATE with the new state", async () => {
        const bettingState = { legs: { "LEG:1": {} } };
        const dispatchSpy = jest.fn();
        const nextSpy = jest.fn();

        clearPlaceFailures.mockReturnValue({ legs: { "LEG:1": {} } });
        removeLeg.mockReturnValue(bettingState);

        setupCompleteMocks({ sbkRunner: { odds: { decimal: 1.23, fractional: { numerator: 1, denominator: 2 } } } });
        setup(
          {
            type: BETTING__SBK_TOGGLE_LEG_ACTION,
            payload: { urn: "URN:1", group: "REAL" },
          },
          bettingState,
          nextSpy,
          dispatchSpy,
        );

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: bettingState,
            group: "REAL",
          },
        });
      });

      it("should dispatch BETTING__SBK_COMBINATIONS_OUTDATED", async () => {
        const bettingState = { legs: { "LEG:1": {} } };
        const dispatchSpy = jest.fn();
        const nextSpy = jest.fn();

        clearPlaceFailures.mockReturnValue("Cleared Place Failures State");
        removeLeg.mockReturnValue(bettingState);

        setupCompleteMocks({ sbkRunner: { odds: { decimal: 1.23, fractional: { numerator: 1, denominator: 2 } } } });
        setup(
          {
            type: BETTING__SBK_TOGGLE_LEG_ACTION,
            payload: { urn: "URN:1", group: "REAL" },
          },
          bettingState,
          nextSpy,
          dispatchSpy,
        );

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__SBK_COMBINATIONS_OUTDATED,
        });
      });

      it("should call removeLeg with the id on the cleared failures state", async () => {
        const bettingState = { legs: { "LEG:1": {} } };

        clearPlaceFailures.mockReturnValue("Cleared Place Failures State");

        setupCompleteMocks({ sbkRunner: { odds: { decimal: 1.23, fractional: { numerator: 1, denominator: 2 } } } });
        setup(
          {
            type: BETTING__SBK_TOGGLE_LEG_ACTION,
            payload: {
              urn: "URN:1",
              group: "REAL",
            },
          },
          bettingState,
        );

        expect(removeLeg).toHaveBeenCalledWith("Cleared Place Failures State", { legId: "LEG:1" });
      });

      describe("and bonus toggle is selected", () => {
        it("should call updateBonusUse", async () => {
          const bettingState = { legs: { "LEG:1": {} } };
          const newBettingState = { legs: {}, isBonusSelected: true };

          removeLeg.mockReturnValue(newBettingState);
          updateBonusUse.mockReturnValue(newBettingState);

          setupCompleteMocks({ sbkRunner: { odds: { decimal: 1.23, fractional: { numerator: 1, denominator: 2 } } } });
          setup(
            {
              type: BETTING__SBK_TOGGLE_LEG_ACTION,
              payload: {
                urn: "URN:1",
                group: "REAL",
              },
            },
            bettingState,
          );

          expect(updateBonusUse).toHaveBeenCalledWith(newBettingState, { isBonusSelected: false });
        });
      });
    });

    describe("when the leg is not in the betting state", () => {
      it("should dispatch BETTING__SBK_STATE_UPDATE with the new state", async () => {
        const bettingState = { legs: { "LEG:1": {}, "LEG:2": {} } };
        const dispatchSpy = jest.fn();
        const nextSpy = jest.fn();

        const odds = { decimalOdds: 1.23 };
        const sbkRunner = {
          odds: { decimal: 1.23, fractional: { numerator: 1, denominator: 2 } },
          eachWayOdds: {
            trueOdds: {
              decimal: 42.2,
              fractional: {
                numerator: 1,
                denominator: 1,
              },
            },
          },
        };
        addLeg.mockReturnValue(bettingState);
        setupCompleteMocks({ sbkRunner, odds });

        setup(
          {
            type: BETTING__SBK_TOGGLE_LEG_ACTION,
            payload: { urn: "URN:1", group: "REAL" },
          },
          { legs: { "LEG:2": {} } },
          nextSpy,
          dispatchSpy,
        );

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: bettingState,
            group: "REAL",
          },
        });
      });

      it("should dispatch BETTING__SBK_COMBINATIONS_OUTDATED", async () => {
        const bettingState = { legs: { "LEG:1": {}, "LEG:2": {} } };
        const dispatchSpy = jest.fn();
        const nextSpy = jest.fn();

        addLeg.mockReturnValue(bettingState);

        setupCompleteMocks({ sbkRunner: { odds: { decimal: 1.23, fractional: { numerator: 1, denominator: 2 } } } });
        setup(
          {
            type: BETTING__SBK_TOGGLE_LEG_ACTION,
            payload: { urn: "URN:1", group: "REAL" },
          },
          { legs: { "LEG:2": {} } },
          nextSpy,
          dispatchSpy,
        );

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__SBK_COMBINATIONS_OUTDATED,
        });
      });

      it("should call addLeg and add the new leg to the existing one", async () => {
        const bettingState = { legs: { "LEG:2": {} } };
        const odds = { decimalOdds: 1.23 };

        clearPlaceFailures.mockImplementation((state) => state);
        addLeg.mockReturnValue(bettingState);
        setupCompleteMocks({
          sbkRunner: {
            odds: { decimal: 1.23, fractional: { numerator: 1, denominator: 2 } },
            eachWayOdds: {
              trueOdds: {
                decimal: 42.2,
                fractional: {
                  numerator: 1,
                  denominator: 1,
                },
              },
            },
          },
          odds,
        });
        setup(
          {
            type: BETTING__SBK_TOGGLE_LEG_ACTION,
            payload: {
              urn: "URN:1",
              group: "REAL",
            },
          },
          bettingState,
          jest.fn(),
        );

        expect(addLeg).toHaveBeenCalledWith(bettingState, {
          legType: LEG_TYPES.SIMPLE_SELECTION,
          runners: [{ selectionId: 1, marketId: "1.1", handicap: -2.5 }],
          odds: {
            decimalOdds: 1.23,
          },
          displayOdds: {
            decimalOdds: 1.23,
          },
          combinationDefaults: {
            isEachWayAvailable: true,
            eachWayPlaces: "3",
            eachWayPlacesFraction: "1/5",
            eachWayOdds: {
              decimalOdds: 1.23,
            },
            stake: null,
            isSPAvailable: false,
            isSPSelected: false,
          },
        });
        expect(addLeg).toHaveBeenCalledTimes(1);
      });

      it("should not call updateBonusUse", async () => {
        const bettingState = { legs: { "LEG:2": {} } };

        clearPlaceFailures.mockImplementation((state) => state);
        setupCompleteMocks({ odds: { decimal: 1.23, fractional: { numerator: 1, denominator: 2 } } });

        addLeg.mockReturnValue(bettingState);

        setup(
          {
            type: BETTING__SBK_TOGGLE_LEG_ACTION,
            payload: {
              urn: "URN:1",
            },
          },
          bettingState,
          jest.fn(),
        );

        expect(updateBonusUse).not.toHaveBeenCalled();
      });
    });

    describe("when there is an invalid amount of legs", () => {
      it("should dispatch BETTING__SBK_INVALID_LEGS_AMOUNT", async () => {
        const bettingState = {
          legs: {
            "LEG:2": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:3": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:4": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:5": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:6": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:7": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:8": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:9": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:10": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:11": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:12": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:13": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:14": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:15": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:16": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:17": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:18": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:19": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:20": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:21": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:22": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:23": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:24": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:25": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:26": { legType: LEG_TYPES.SIMPLE_SELECTION },
          },
        };
        const dispatchSpy = jest.fn();
        const nextSpy = jest.fn();

        setupCompleteMocks({ sbkRunner: { odds: { decimal: 1.23, fractional: { numerator: 1, denominator: 2 } } } });
        setup(
          {
            type: BETTING__SBK_TOGGLE_LEG_ACTION,
            payload: { urn: "URN:1", group: "REAL" },
          },
          bettingState,
          nextSpy,
          dispatchSpy,
        );

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__SBK_INVALID_LEGS_AMOUNT,
          payload: { limit: 25 },
        });
      });
    });

    describe("when there is no add leg payload", () => {
      it("should not dispatch BETTING__SBK_STATE_UPDATE", async () => {
        const bettingState = {
          legs: {
            "LEG:2": { legType: LEG_TYPES.SIMPLE_SELECTION },
          },
        };
        const dispatchSpy = jest.fn();
        const nextSpy = jest.fn();

        setupNoPayload();
        setup(
          {
            type: BETTING__SBK_TOGGLE_LEG_ACTION,
            payload: { urn: "URN:1", group: "REAL" },
          },
          bettingState,
          nextSpy,
          dispatchSpy,
        );

        expect(dispatchSpy).not.toHaveBeenCalledWith(expect.objectContaining({ type: BETTING__SBK_STATE_UPDATE }));
      });
    });

    describe("when it ends up with one leg and MINIMIZE_BETSLIP is false", () => {
      it("should dispatch UI__BETSLIP_SET_COLLAPSE_ACTION with collapse as false", async () => {
        const bettingState = { legs: { someLeg: {} } };
        const dispatchSpy = jest.fn();
        const nextSpy = jest.fn();

        addLeg.mockReturnValue(bettingState);

        setupCompleteMocks({ sbkRunner: { odds: { decimal: 1.23, fractional: { numerator: 1, denominator: 2 } } } });
        setup(
          {
            type: BETTING__SBK_TOGGLE_LEG_ACTION,
            payload: { urn: "URN:1", group: "REAL" },
          },
          bettingState,
          nextSpy,
          dispatchSpy,
          {},
          {
            MINIMIZE_BETSLIP: false,
          },
        );

        expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
          type: UI__BETSLIP_SET_COLLAPSE_ACTION,
          payload: {
            collapse: false,
          },
        });
      });
    });

    describe("when it ends up with two legs and MINIMIZE_BETSLIP is false", () => {
      it("should dispatch UI__BETSLIP_SET_COLLAPSE_ACTION", async () => {
        const bettingState = { legs: { someLeg: {}, anotherLeg: {} } };
        const dispatchSpy = jest.fn();
        const nextSpy = jest.fn();

        addLeg.mockReturnValue(bettingState);

        setupCompleteMocks({ sbkRunner: { odds: { decimal: 1.23, fractional: { numerator: 1, denominator: 2 } } } });
        setup(
          {
            type: BETTING__SBK_TOGGLE_LEG_ACTION,
            payload: { urn: "URN:1", group: "REAL" },
          },
          bettingState,
          nextSpy,
          dispatchSpy,
          {},
          {
            MINIMIZE_BETSLIP: false,
          },
        );

        expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
          type: UI__BETSLIP_SET_COLLAPSE_ACTION,
          payload: {
            collapse: true,
          },
        });
      });
    });

    describe("when there are legs on the obbBetslip", () => {
      it("should dispatch UI__ACTION_CONFIRMATION", async () => {
        const dispatchSpy = jest.fn();

        setup(
          {
            type: BETTING__SBK_TOGGLE_LEG_ACTION,
            payload: { urn: "URN:1", group: "REAL", metadata: { cardUrn: "cardUrn1" } },
          },
          {},
          jest.fn(),
          dispatchSpy,
          {},
          {},
          { legs: { "LEG:1": {} } },
        );

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: UI__ACTION_CONFIRMATION,
          payload: {
            id: "BETTING_BETSLIP_TYPE_SWITCH",
            cardUrn: "cardUrn1",
            group: "REAL",
            runnerUrn: "URN:1",
            refuseActions: [
              {
                payload: {
                  cardUrn: "cardUrn1",
                  clickedOutside: false,
                  group: "REAL",
                  runnerUrn: "URN:1",
                },
                type: "BETTING/OBB_SBK_KEEP_ACTION",
              },
            ],
            acceptActions: [
              {
                type: BETTING__OBB_CLEAR_ACTION,
              },
              {
                payload: {
                  cardUrn: "cardUrn1",
                  group: "REAL",
                  runnerUrn: "URN:1",
                },
                type: BETTING__OBB_SBK_CLEAR_ACTION,
              },
              {
                type: BETTING__SBK_SWITCH_GROUP,
                payload: { urn: "URN:1", group: "REAL" },
              },
            ],
          },
        });
      });
    });
  });

  describe("when action type is BETTING__SBK_TOGGLE_ONE_LINE_LEG_ACTION", () => {
    describe("when selectionIds is empty", () => {
      it("should not dispatch any action", async () => {
        const dispatchSpy = jest.fn();

        setup(
          {
            type: BETTING__SBK_TOGGLE_ONE_LINE_LEG_ACTION,
            payload: {
              urn: "URN:1",
              group: "REAL",
              marketUrns: ["marketUrn:1"],
              marketIds: ["1.1"],
              selectionIds: [],
            },
          },
          { legs: {} },
          jest.fn(),
          dispatchSpy,
        );

        expect(dispatchSpy).not.toHaveBeenCalled();
      });
    });

    describe("when switching betslip type with OBB legs present", () => {
      it("should dispatch CONFIRMATION/ACTION with betslip type switch", async () => {
        const dispatchSpy = jest.fn();
        const obbBetting = { legs: { "OBB_LEG:1": {} } };

        generateRunnerId.mockReturnValue("RUNNER:1");
        generateLegId.mockReturnValue("LEG:1");
        getSimpleSelectionLegs.mockImplementation((legs) => legs);
        getBettingResolvers.mockReturnValue({
          getAddOneLinePayload: jest.fn().mockReturnValue({ legType: "ONE_LINE_BET" }),
        });

        setup(
          {
            type: BETTING__SBK_TOGGLE_ONE_LINE_LEG_ACTION,
            payload: {
              urn: "cardUrn:1",
              group: "REAL",
              marketUrns: ["marketUrn:1"],
              marketIds: ["1.1"],
              selectionIds: [1, 2],
            },
          },
          { legs: {} },
          jest.fn(),
          dispatchSpy,
          {},
          {},
          obbBetting,
        );

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: UI__ACTION_CONFIRMATION,
          payload: {
            id: "BETTING_BETSLIP_TYPE_SWITCH",
            cardUrn: "cardUrn:1",
            group: "REAL",
            refuseActions: [],
            acceptActions: [
              { type: BETTING__OBB_CLEAR_ACTION },
              {
                type: BETTING__SBK_TOGGLE_ONE_LINE_LEG_ACTION,
                payload: {
                  marketUrns: ["marketUrn:1"],
                  marketIds: ["1.1"],
                  selectionIds: [1, 2],
                  group: "REAL",
                  urn: "cardUrn:1",
                },
              },
            ],
          },
        });
      });
    });

    describe("when switching group with existing legs", () => {
      it("should dispatch CONFIRMATION/ACTION with group switch", async () => {
        const dispatchSpy = jest.fn();

        generateRunnerId.mockReturnValue("RUNNER:1");
        generateLegId.mockReturnValue("LEG:1");
        getSimpleSelectionLegs.mockImplementation((legs) => legs);
        getBettingResolvers.mockReturnValue({
          getAddOneLinePayload: jest.fn().mockReturnValue({ legType: "ONE_LINE_BET" }),
        });

        setup(
          {
            type: BETTING__SBK_TOGGLE_ONE_LINE_LEG_ACTION,
            payload: {
              urn: "URN:1",
              group: "VIRTUAL",
              marketUrns: ["marketUrn:1"],
              marketIds: ["1.1"],
              selectionIds: [1, 2],
            },
          },
          { legs: { "LEG:1": {} } },
          jest.fn(),
          dispatchSpy,
        );

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: UI__ACTION_CONFIRMATION,
          payload: {
            id: "BETTING_GROUP_SWITCH",
            refuseActions: [],
            acceptActions: [
              { type: BETTING__SBK_CLEAR_ACTION },
              {
                type: BETTING__SBK_TOGGLE_ONE_LINE_LEG_ACTION,
                payload: {
                  marketUrns: ["marketUrn:1"],
                  marketIds: ["1.1"],
                  selectionIds: [1, 2],
                  group: "VIRTUAL",
                  urn: "URN:1",
                },
              },
            ],
          },
        });
      });
    });

    describe("when adding new one-line legs", () => {
      it("should dispatch BETTING__SBK_STATE_UPDATE with new betting state", async () => {
        const dispatchSpy = jest.fn();
        const bettingState = { legs: {} };
        const newBettingState = { legs: { "LEG:1": {} } };

        generateRunnerId.mockReturnValue("RUNNER:1");
        generateLegId.mockReturnValue("LEG:1");
        getSimpleSelectionLegs.mockImplementation((legs) => legs);
        clearPlaceFailures.mockReturnValue(bettingState);
        addLeg.mockReturnValue(newBettingState);
        getBettingResolvers.mockReturnValue({
          getAddOneLinePayload: jest.fn().mockReturnValue({ legType: "ONE_LINE_BET" }),
        });

        setup(
          {
            type: BETTING__SBK_TOGGLE_ONE_LINE_LEG_ACTION,
            payload: {
              urn: "URN:1",
              group: "REAL",
              marketUrns: ["marketUrn:1"],
              marketIds: ["1.1"],
              selectionIds: [1, 2],
            },
          },
          bettingState,
          jest.fn(),
          dispatchSpy,
        );

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: newBettingState,
            group: "REAL",
          },
        });
      });

      it("should dispatch BETTING__SBK_COMBINATIONS_OUTDATED", async () => {
        const dispatchSpy = jest.fn();
        const bettingState = { legs: {} };

        generateRunnerId.mockReturnValue("RUNNER:1");
        generateLegId.mockReturnValue("LEG:1");
        getSimpleSelectionLegs.mockImplementation((legs) => legs);
        clearPlaceFailures.mockReturnValue(bettingState);
        addLeg.mockReturnValue(bettingState);
        getBettingResolvers.mockReturnValue({
          getAddOneLinePayload: jest.fn().mockReturnValue({ legType: "ONE_LINE_BET" }),
        });

        setup(
          {
            type: BETTING__SBK_TOGGLE_ONE_LINE_LEG_ACTION,
            payload: {
              urn: "URN:1",
              group: "REAL",
              marketUrns: ["marketUrn:1"],
              marketIds: ["1.1"],
              selectionIds: [1, 2],
            },
          },
          bettingState,
          jest.fn(),
          dispatchSpy,
        );

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__SBK_COMBINATIONS_OUTDATED,
        });
      });
    });

    describe("when leg already exists", () => {
      it("should remove the existing leg", async () => {
        const dispatchSpy = jest.fn();
        const bettingState = { legs: { "LEG:1": {} }, isBonusSelected: false };
        const newBettingState = { legs: {}, isBonusSelected: false };

        generateRunnerId.mockReturnValue("RUNNER:1");
        generateLegId.mockReturnValue("LEG:1");
        getSimpleSelectionLegs.mockReturnValue({});
        clearPlaceFailures.mockReturnValue(bettingState);
        removeLeg.mockReturnValue(newBettingState);
        getBettingResolvers.mockReturnValue({
          getAddOneLinePayload: jest.fn().mockReturnValue({ legType: "ONE_LINE_BET" }),
        });

        setup(
          {
            type: BETTING__SBK_TOGGLE_ONE_LINE_LEG_ACTION,
            payload: {
              urn: "URN:1",
              group: "REAL",
              marketUrns: ["marketUrn:1"],
              marketIds: ["1.1"],
              selectionIds: [1, 2],
            },
          },
          bettingState,
          jest.fn(),
          dispatchSpy,
        );

        expect(removeLeg).toHaveBeenCalledWith(bettingState, { legId: "LEG:1" });
      });
    });
  });

  describe("when MINIMIZE_BETSLIP is true", () => {
    it("should dispatch UI__BETSLIP_SET_COLLAPSE_ACTION with collapse as true", async () => {
      const bettingState = { legs: { someLeg: {} } };
      const dispatchSpy = jest.fn();
      const nextSpy = jest.fn();

      addLeg.mockReturnValue(bettingState);

      setupCompleteMocks({ sbkRunner: { odds: { decimal: 1.23, fractional: { numerator: 1, denominator: 2 } } } });
      setup(
        {
          type: BETTING__SBK_TOGGLE_LEG_ACTION,
          payload: { urn: "URN:1", group: "REAL" },
        },
        bettingState,
        nextSpy,
        dispatchSpy,
        {},
        {
          MINIMIZE_BETSLIP: true,
        },
      );

      expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
        type: UI__BETSLIP_SET_COLLAPSE_ACTION,
        payload: {
          collapse: true,
        },
      });
    });
  });

  describe("when action type is BETTING__SBK_SWITCH_GROUP", () => {
    it("should call init", async () => {
      const bettingState = { legs: { "LEG:1": {} } };

      init.mockReturnValue(bettingState);
      addLeg.mockReturnValue(bettingState);
      setupCompleteMocks({ sbkRunner: { odds: { decimal: 1.23, fractional: { numerator: 1, denominator: 2 } } } });
      setup(
        {
          type: BETTING__SBK_SWITCH_GROUP,
          payload: {
            urn: "URN:1",
            group: "VIRTUAL",
          },
        },
        bettingState,
      );

      expect(init).toHaveBeenCalled();
    });

    describe("when the runner association does not exist", () => {
      it("should ignore the action", async () => {
        const dispatchSpy = jest.fn();

        setupCompleteMocks({ sbkRunner: { odds: 1.23 } });
        setup({ type: BETTING__SBK_SWITCH_GROUP, payload: { group: "REAL" } }, { legs: {} }, jest.fn(), dispatchSpy);

        expect(dispatchSpy).not.toHaveBeenCalledWith({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            group: "REAL",
          },
        });
      });
    });

    describe("when there is no add leg payload", () => {
      it("should not dispatch BETTING__SBK_STATE_UPDATE", async () => {
        const bettingState = {
          legs: {
            "LEG:2": { legType: LEG_TYPES.SIMPLE_SELECTION },
          },
        };
        const dispatchSpy = jest.fn();
        const nextSpy = jest.fn();

        setupNoPayload();
        setup(
          {
            type: BETTING__SBK_SWITCH_GROUP,
            payload: { urn: "URN:1", group: "REAL" },
          },
          bettingState,
          nextSpy,
          dispatchSpy,
        );

        expect(dispatchSpy).not.toHaveBeenCalledWith(expect.objectContaining({ type: BETTING__SBK_STATE_UPDATE }));
      });
    });

    describe("when it ends up with one leg", () => {
      it("should dispatch UI__BETSLIP_SET_COLLAPSE_ACTION with collapse as false", async () => {
        const bettingState = { legs: { someLeg: {} } };
        const dispatchSpy = jest.fn();
        const nextSpy = jest.fn();

        addLeg.mockReturnValue(bettingState);

        setupCompleteMocks({ sbkRunner: { odds: { decimal: 1.23, fractional: { numerator: 1, denominator: 2 } } } });
        setup(
          {
            type: BETTING__SBK_SWITCH_GROUP,
            payload: { urn: "URN:1", group: "REAL" },
          },
          bettingState,
          nextSpy,
          dispatchSpy,
        );

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: UI__BETSLIP_SET_COLLAPSE_ACTION,
          payload: {
            collapse: false,
          },
        });
      });
    });

    describe("when it ends up with two legs", () => {
      it("should dispatch UI__BETSLIP_SET_COLLAPSE_ACTION", async () => {
        const bettingState = { legs: { someLeg: {}, anotherLeg: {} } };
        const dispatchSpy = jest.fn();
        const nextSpy = jest.fn();

        addLeg.mockReturnValue(bettingState);

        setupCompleteMocks({ sbkRunner: { odds: { decimal: 1.23, fractional: { numerator: 1, denominator: 2 } } } });
        setup(
          {
            type: BETTING__SBK_SWITCH_GROUP,
            payload: { urn: "URN:1", group: "REAL" },
          },
          bettingState,
          nextSpy,
          dispatchSpy,
        );

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: UI__BETSLIP_SET_COLLAPSE_ACTION,
          payload: {
            collapse: true,
          },
        });
      });
    });
  });

  describe("when action type is BETTING__SBK_ADD_SELECTIONS", () => {
    describe("when betslip has reached selection limit", () => {
      it("should dispatch BETTING__SBK_INVALID_LEGS_AMOUNT", () => {
        const bettingState = {
          legs: {
            "LEG:1": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:2": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:3": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:4": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:5": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:6": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:7": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:8": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:9": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:10": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:11": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:12": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:13": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:14": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:15": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:16": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:17": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:18": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:19": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:20": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:21": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:22": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:23": { legType: LEG_TYPES.SIMPLE_SELECTION },
            "LEG:24": { legType: LEG_TYPES.SIMPLE_SELECTION },
          },
        };
        const action = {
          type: BETTING__SBK_ADD_SELECTIONS,
          payload: {
            selections: [
              { runnerUrn: "runnerurn:1", marketUrn: "marketurn:1" },
              { runnerUrn: "runnerurn:2", marketUrn: "marketurn:2" },
            ],
            timestamp: 42,
          },
        };
        const dispatchSpy = jest.fn();

        setup(action, bettingState, undefined, dispatchSpy);

        expect(dispatchSpy).toHaveBeenCalledWith({ type: BETTING__SBK_INVALID_LEGS_AMOUNT, payload: { limit: 25 } });
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("when action type is BETTING__SBK_ADD_SELECTIONS_SUCCESS", () => {
    it("should call clearPlaceFailures", () => {
      const bettingState = { legs: {} };
      const action = {
        type: BETTING__SBK_ADD_SELECTIONS_SUCCESS,
        payload: { selections: [{ runnerUrn: "runnerurn:1", marketUrn: "marketurn:1" }], timestamp: 42 },
      };
      setupCompleteMocks();

      setup(action, bettingState);

      expect(clearPlaceFailures).toHaveBeenCalledWith(bettingState);
      expect(clearPlaceFailures).toHaveBeenCalledTimes(1);
    });

    it("should call addLeg for each selection", () => {
      const bettingState = { legs: {} };
      const action = {
        type: BETTING__SBK_ADD_SELECTIONS_SUCCESS,
        payload: {
          selections: [{ runnerUrn: "runnerurn:1", marketUrn: "marketurn:1" }],
          timestamp: 42,
          group: "REAL",
        },
      };
      setupCompleteMocks({ sbkRunner: { odds: { decimal: 1.23, fractional: { numerator: 1, denominator: 2 } } } });
      clearPlaceFailures.mockReturnValue(bettingState);

      setup(action, bettingState);

      expect(addLeg).toHaveBeenCalledWith(bettingState, {
        combinationDefaults: {
          eachWayOdds: { decimalOdds: 1.23 },
          eachWayPlaces: "3",
          eachWayPlacesFraction: "1/5",
          isEachWayAvailable: true,
          isSPAvailable: false,
          isSPSelected: false,
          stake: null,
        },
        displayOdds: { decimalOdds: 1.23 },
        legType: "SIMPLE_SELECTION",
        odds: { decimalOdds: 1.23 },
        runners: [{ handicap: -2.5, marketId: "1.1", selectionId: 1 }],
      });
      expect(addLeg).toHaveBeenCalledTimes(1);
    });

    describe("when boostedIdentification is defined", () => {
      it("should invoke getAddLegPayload with correct params", () => {
        const bettingState = { legs: {} };
        const action = {
          type: BETTING__SBK_ADD_SELECTIONS_SUCCESS,
          payload: {
            selections: [{ runnerUrn: "runnerurn:1", marketUrn: "marketurn:1" }],
            timestamp: 42,
            group: "REAL",
            options: { isBoostedLeg: true, groupId: "groupId" },
          },
        };
        setupCompleteMocks({ sbkRunner: { odds: { decimal: 1.23, fractional: { numerator: 1, denominator: 2 } } } });

        setup(action, bettingState);
        expect(getBettingResolvers("REAL").getAddLegPayload).toHaveBeenCalledWith(
          {
            userdetails: {},
            brandSettings: {},
          },
          "runnerurn:1",
          {
            isBoostedLeg: true,
            groupId: "groupId",
          },
        );
        expect(getBettingResolvers("REAL").getAddLegPayload).toHaveBeenCalledTimes(1);
      });
    });

    describe("when deeplink is defined", () => {
      it("should dispatch BETTING__SBK_ADD_SELECTION_TAGGING", () => {
        const bettingState = { legs: {} };
        const action = {
          type: BETTING__SBK_ADD_SELECTIONS_SUCCESS,
          payload: {
            selections: [{ runnerUrn: ["runnerurn:1"], marketUrn: ["marketurn:1"] }],
            group: "REAL",
            deeplink: { isBetSharing: false },
          },
        };
        const dispatchSpy = jest.fn();

        setup(action, bettingState, undefined, dispatchSpy);

        expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
          type: BETTING__SBK_ADD_SELECTION_TAGGING,
          payload: {
            urn: ["runnerurn:1"],
            betOriginURL: "",
            cardUrn: "",
            deeplink: { isBetSharing: false },
            group: "REAL",
            uniqueId: "",
          },
        });
        expect(dispatchSpy).toHaveBeenCalledTimes(3);
      });
    });

    it("should dispatch BETTING__SBK_STATE_UPDATE", () => {
      const bettingState = { legs: {} };
      const action = {
        type: BETTING__SBK_ADD_SELECTIONS_SUCCESS,
        payload: { selections: [{ runnerUrn: "runnerurn:1", marketUrn: "marketurn:1" }], timestamp: 42 },
      };
      addLeg.mockReturnValue(bettingState);
      setupCompleteMocks({ sbkRunner: { odds: { decimal: 1.23, fractional: { numerator: 1, denominator: 2 } } } });
      const dispatchSpy = jest.fn();

      setup(action, bettingState, undefined, dispatchSpy);

      expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
        type: BETTING__SBK_STATE_UPDATE,
        payload: {
          state: bettingState,
        },
      });
      expect(dispatchSpy).toHaveBeenCalledTimes(2);
    });

    it("should dispatch BETTING__SBK_COMBINATIONS_OUTDATED", () => {
      const bettingState = { legs: {} };
      const action = {
        type: BETTING__SBK_ADD_SELECTIONS_SUCCESS,
        payload: { selections: [{ runnerUrn: "runnerurn:1", marketUrn: "marketurn:1" }], timestamp: 42 },
      };
      setupCompleteMocks({ sbkRunner: { odds: { decimal: 1.23, fractional: { numerator: 1, denominator: 2 } } } });
      const dispatchSpy = jest.fn();

      setup(action, bettingState, undefined, dispatchSpy);

      expect(dispatchSpy).toHaveBeenNthCalledWith(2, { type: BETTING__SBK_COMBINATIONS_OUTDATED });
      expect(dispatchSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe("when action type is BETTING__SBK_LOAD_STORAGE_SUCCESS", () => {
    it("should dispatch BETTING__SBK_STATE_UPDATE", () => {
      const bettingState = { legs: {} };
      const action = {
        type: BETTING__SBK_LOAD_STORAGE_SUCCESS,
        payload: {
          storageBettingState: "some betting group state",
          betslip: { group: "REAL" },
        },
      };
      const dispatchSpy = jest.fn();

      setup(action, bettingState, undefined, dispatchSpy);

      expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
        type: BETTING__SBK_STATE_UPDATE,
        payload: {
          state: "some betting group state",
          group: "REAL",
        },
      });
      expect(dispatchSpy).toHaveBeenCalledTimes(2);
    });

    it("should dispatch BETTING__SBK_COMBINATIONS_OUTDATED", () => {
      const bettingState = { legs: {} };
      const action = {
        type: BETTING__SBK_LOAD_STORAGE_SUCCESS,
        payload: { storageBettingState: "some betting group state", betslip: {} },
      };
      const dispatchSpy = jest.fn();

      setup(action, bettingState, undefined, dispatchSpy);

      expect(dispatchSpy).toHaveBeenNthCalledWith(2, { type: BETTING__SBK_COMBINATIONS_OUTDATED });
      expect(dispatchSpy).toHaveBeenCalledTimes(2);
    });

    describe("when betslip is collapsed and quick betslip experiment is active", () => {
      it("should dispatch BETTING__SBK_STATE_UPDATE with resetStateWithGreatestOddStake result", () => {
        const dispatchSpy = jest.fn();
        const storageBettingState = {
          combinations: {
            "COMBINATION:1": {
              id: "COMBINATION:1",
              stake: 10,
              isEachWaySelected: false,
              isSPSelected: false,
              isPriceBoostSelected: false,
              isAccaInsuranceSelected: false,
              isMoneyBackSelected: false,
            },
          },
          legs: {},
          runners: {},
          isBonusSelected: false,
        };
        const greatestCombination = { id: "COMBINATION:1", stake: 10 };
        const resetResult = { combinations: { "COMBINATION:1": { stake: 10 } }, legs: {} };

        pickGreatestOddCombination.mockReturnValue(greatestCombination);
        clearBonusWallets.mockImplementation((state) => state);
        clearPlaceFailures.mockImplementation((state) => state);
        updateStake.mockReturnValue(resetResult);

        setupWithQuickBetslip({
          action: {
            type: BETTING__SBK_LOAD_STORAGE_SUCCESS,
            payload: {
              storageBettingState,
              betslip: { group: "REAL", isCollapsed: true },
            },
          },
          isCollapsed: false,
          sportsbookBetting: { legs: {}, combinations: {}, runners: {} },
          dispatchSpy,
        });

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: resetResult,
            group: "REAL",
          },
        });
      });
    });

    describe("when betslip is not collapsed", () => {
      it("should dispatch BETTING__SBK_STATE_UPDATE with the original storageBettingState", () => {
        const dispatchSpy = jest.fn();

        setupWithQuickBetslip({
          action: {
            type: BETTING__SBK_LOAD_STORAGE_SUCCESS,
            payload: {
              storageBettingState: "original state",
              betslip: { group: "REAL", isCollapsed: false },
            },
          },
          isCollapsed: false,
          dispatchSpy,
        });

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: "original state",
            group: "REAL",
          },
        });
      });
    });

    describe("when quick betslip experiment is not active", () => {
      it("should dispatch BETTING__SBK_STATE_UPDATE with the original storageBettingState", () => {
        const dispatchSpy = jest.fn();

        setupWithQuickBetslip({
          action: {
            type: BETTING__SBK_LOAD_STORAGE_SUCCESS,
            payload: {
              storageBettingState: "original state",
              betslip: { group: "REAL", isCollapsed: true },
            },
          },
          isCollapsed: false,
          experimentActive: false,
          dispatchSpy,
        });

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: "original state",
            group: "REAL",
          },
        });
      });
    });

    describe("when betslip is collapsed, experiment is on and quick bet is valid", () => {
      function loadStorageWith(storageBettingState) {
        pickGreatestOddCombination.mockReturnValue(undefined);
        clearBonusWallets.mockImplementation((state) => state);
        clearPlaceFailures.mockImplementation((state) => state);
        updateBonusUse.mockImplementation((state) => state);
        updateStake.mockImplementation((state) => state);
        updateEachWay.mockImplementation((state) => state);
        updateSP.mockImplementation((state) => state);
        updatePriceBoost.mockImplementation((state) => state);
        updateAccaInsurance.mockImplementation((state) => state);
        updateMoneyBack.mockImplementation((state) => state);

        setupWithQuickBetslip({
          action: {
            type: BETTING__SBK_LOAD_STORAGE_SUCCESS,
            payload: {
              storageBettingState,
              betslip: { group: "REAL", isCollapsed: true },
            },
          },
        });
      }

      it("should clear stake, each-way, SP, price boost, acca insurance and money back on selected combinations", () => {
        loadStorageWith({
          combinations: {
            "COMBINATION:1": {
              id: "COMBINATION:1",
              stake: 12,
              isEachWaySelected: true,
              isSPSelected: true,
              isPriceBoostSelected: true,
              isAccaInsuranceSelected: true,
              isMoneyBackSelected: true,
            },
          },
          legs: {},
          runners: {},
          isBonusSelected: false,
        });

        expect(updateStake).toHaveBeenCalledWith(expect.anything(), {
          combinationId: "COMBINATION:1",
          stake: undefined,
        });
        expect(updateEachWay).toHaveBeenCalledWith(expect.anything(), {
          combinationId: "COMBINATION:1",
          isEachWaySelected: false,
        });
        expect(updateSP).toHaveBeenCalledWith(expect.anything(), {
          combinationId: "COMBINATION:1",
          isSPSelected: false,
        });
        expect(updatePriceBoost).toHaveBeenCalledWith(expect.anything(), {
          combinationId: "COMBINATION:1",
          selectedTokenId: undefined,
          isPriceBoostSelected: false,
        });
        expect(updateAccaInsurance).toHaveBeenCalledWith(expect.anything(), {
          combinationId: "COMBINATION:1",
          selectedTokenId: undefined,
          isAccaInsuranceSelected: false,
        });
        expect(updateMoneyBack).toHaveBeenCalledWith(expect.anything(), {
          combinationId: "COMBINATION:1",
          selectedTokenId: undefined,
          isMoneyBackSelected: false,
        });
      });

      it("should clear bonus wallets, bonus use and place failures", () => {
        loadStorageWith({
          combinations: {
            "COMBINATION:1": {
              id: "COMBINATION:1",
              isEachWaySelected: false,
              isSPSelected: false,
              isPriceBoostSelected: false,
              isAccaInsuranceSelected: false,
              isMoneyBackSelected: false,
            },
          },
          legs: {},
          runners: {},
          isBonusSelected: true,
        });

        expect(clearBonusWallets).toHaveBeenCalled();
        expect(updateBonusUse).toHaveBeenCalledWith(expect.anything(), { isBonusSelected: false });
        expect(clearPlaceFailures).toHaveBeenCalled();
      });
    });

    describe("when betslip is collapsed and experiment is on but quick bet is not valid", () => {
      it("should dispatch BETTING__SBK_STATE_UPDATE with the original storageBettingState", () => {
        const dispatchSpy = jest.fn();

        setupWithQuickBetslip({
          action: {
            type: BETTING__SBK_LOAD_STORAGE_SUCCESS,
            payload: {
              storageBettingState: "original state",
              betslip: { group: "REAL", isCollapsed: true },
            },
          },
          quickBet: { status: "fallback", reason: "non_football" },
          dispatchSpy,
        });

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: "original state",
            group: "REAL",
          },
        });
        expect(updateStake).not.toHaveBeenCalled();
        expect(clearBonusWallets).not.toHaveBeenCalled();
      });
    });
  });

  describe("when action type is BETTING__SBK_UPDATE_COMBINATION_STAKE_ACTION", () => {
    it("should dispatch BETTING__SBK_STATE_UPDATE with updated state", async () => {
      const dispatchSpy = jest.fn();
      const nextSpy = jest.fn();

      updateStake.mockReturnValue("State with updated stake");

      setup(
        {
          type: BETTING__SBK_UPDATE_COMBINATION_STAKE_ACTION,
          payload: {
            combinationId: "COMBINATION:1",
            stake: 1.23,
          },
        },
        "Betting State",
        nextSpy,
        dispatchSpy,
      );

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING__SBK_STATE_UPDATE,
        payload: { state: "State with updated stake", group: "REAL" },
      });
    });

    it("should call updateStake with the betting state and the payload", async () => {
      setup(
        {
          type: BETTING__SBK_UPDATE_COMBINATION_STAKE_ACTION,
          payload: {
            combinationId: "COMBINATION:1",
            stake: 1.23,
          },
        },
        "Betting State",
      );

      expect(updateStake).toHaveBeenCalledWith("Betting State", { combinationId: "COMBINATION:1", stake: 1.23 });
    });
  });

  describe("when action type is BETTING__SBK_REMOVE_LEG_ACTION", () => {
    it("should dispatch BETTING__SBK_STATE_UPDATE with updated state", async () => {
      const bettingState = { legs: { "LEG:1": {} } };
      const dispatchSpy = jest.fn();
      const nextSpy = jest.fn();

      removeLeg.mockReturnValue(bettingState);

      setup(
        {
          type: BETTING__SBK_REMOVE_LEG_ACTION,
          payload: {
            legId: "LEG:1",
          },
        },
        bettingState,
        nextSpy,
        dispatchSpy,
      );

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING__SBK_STATE_UPDATE,
        payload: { state: bettingState, group: "REAL" },
      });
    });

    it("should dispatch BETTING__SBK_COMBINATIONS_OUTDATED", async () => {
      const bettingState = { legs: { "LEG:1": {} } };
      const dispatchSpy = jest.fn();
      const nextSpy = jest.fn();

      removeLeg.mockReturnValue(bettingState);

      setup(
        {
          type: BETTING__SBK_REMOVE_LEG_ACTION,
          payload: {
            legId: "LEG:1",
          },
        },
        bettingState,
        nextSpy,
        dispatchSpy,
      );

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING__SBK_COMBINATIONS_OUTDATED,
      });
    });

    it("should call removeLeg with the betting state and the payload", async () => {
      const bettingState = { legs: { "LEG:1": {} } };

      setup(
        {
          type: BETTING__SBK_REMOVE_LEG_ACTION,
          payload: {
            legId: "LEG:1",
          },
        },
        bettingState,
      );

      expect(removeLeg).toHaveBeenCalledWith(bettingState, { legId: "LEG:1" });
    });

    describe("when bonus is selected", () => {
      describe("and there are no legs", () => {
        it("should call updateBonusUse", async () => {
          const bettingState = { legs: { "LEG:1": {} } };
          const newBettingState = { legs: {}, isBonusSelected: true };
          const newBettingStateAfterUpdate = { legs: {}, isBonusSelected: false };
          const dispatchSpy = jest.fn();
          const nextSpy = jest.fn();

          removeLeg.mockReturnValue(newBettingState);
          updateBonusUse.mockReturnValue(newBettingStateAfterUpdate);
          setup(
            {
              type: BETTING__SBK_REMOVE_LEG_ACTION,
              payload: {
                legId: "LEG:1",
              },
            },
            bettingState,
            nextSpy,
            dispatchSpy,
          );

          expect(updateBonusUse).toHaveBeenCalledWith(newBettingState, { isBonusSelected: false });

          expect(dispatchSpy).toHaveBeenCalledWith({
            type: BETTING__SBK_STATE_UPDATE,
            payload: {
              state: newBettingStateAfterUpdate,
              group: "REAL",
            },
          });
        });
      });
    });
  });

  describe("when action type is BETTING__SBK_REMOVE_BOOSTED_COMBINATION_ACTION", () => {
    it("should dispatch BETTING__SBK_STATE_UPDATE with updated state", async () => {
      const bettingState = { legs: { "LEG:1": {}, "LEG:2": {} } };
      const dispatchSpy = jest.fn();
      const nextSpy = jest.fn();

      removeLeg.mockReturnValue(bettingState);

      setup(
        {
          type: BETTING__SBK_REMOVE_BOOSTED_COMBINATION_ACTION,
          payload: {
            legIds: ["LEG:1", "LEG:2"],
          },
        },
        bettingState,
        nextSpy,
        dispatchSpy,
      );

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING__SBK_STATE_UPDATE,
        payload: { state: bettingState, group: "REAL" },
      });
    });

    it("should dispatch BETTING__SBK_REMOVE_BOOSTED_COMBINATION_ACTION", async () => {
      const bettingState = { legs: { "LEG:1": {}, "LEG:2": {} } };
      const dispatchSpy = jest.fn();
      const nextSpy = jest.fn();

      removeLeg.mockReturnValue(bettingState);

      setup(
        {
          type: BETTING__SBK_REMOVE_BOOSTED_COMBINATION_ACTION,
          payload: {
            legIds: ["LEG:1", "LEG:2"],
          },
        },
        "Betting State",
        nextSpy,
        dispatchSpy,
      );

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING__SBK_COMBINATIONS_OUTDATED,
      });
    });

    it("should call removeLeg twice with the betting state and the payload", async () => {
      const BETTING_STATE_MOCK = { legs: { "LEG:1": {}, "LEG:2": {} } };

      removeLeg.mockReturnValue(BETTING_STATE_MOCK);

      setup(
        {
          type: BETTING__SBK_REMOVE_BOOSTED_COMBINATION_ACTION,
          payload: {
            legIds: ["LEG:1", "LEG:2"],
          },
        },
        BETTING_STATE_MOCK,
      );

      expect(removeLeg).toHaveBeenCalledWith(BETTING_STATE_MOCK, { legId: "LEG:1" });
      expect(removeLeg).toHaveBeenCalledWith(BETTING_STATE_MOCK, { legId: "LEG:2" });
      expect(removeLeg).toHaveBeenCalledTimes(2);
    });
  });

  describe("when action type is BETTING__SBK_INCREMENT_STAKE_ACTION", () => {
    const combinationsMock = {
      "COMBINATION:1": {
        id: "COMBINATION:1",
        odds: "1.23",
        stake: 1,
      },
    };
    const sportsbookBettingMock = { combinations: combinationsMock };

    it("should dispatch BETTING__SBK_STATE_UPDATE with updated state", async () => {
      const dispatchSpy = jest.fn();
      const nextSpy = jest.fn();

      incrementStake.mockReturnValue("State with updated stake");

      setup(
        {
          type: BETTING__SBK_INCREMENT_STAKE_ACTION,
          payload: {
            combinationId: "COMBINATION:1",
            increment: 20,
          },
        },
        sportsbookBettingMock,
        nextSpy,
        dispatchSpy,
      );

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING__SBK_STATE_UPDATE,
        payload: { state: "State with updated stake", group: "REAL" },
      });
    });

    it("should call incrementStake with the increment", async () => {
      setup(
        {
          type: BETTING__SBK_INCREMENT_STAKE_ACTION,
          payload: {
            combinationId: "COMBINATION:1",
            increment: 10,
          },
        },
        sportsbookBettingMock,
      );

      expect(incrementStake).toHaveBeenCalledWith(
        { combinations: combinationsMock },
        { combinationId: "COMBINATION:1", increment: 10 },
      );
    });
  });

  describe("when action type is BETTING__SBK_CLEAR_ACTION", () => {
    const dispatchSpy = jest.fn();
    const nextSpy = jest.fn();

    describe("when there is a limit", () => {
      it("should dispatch BETTING__SBK_STATE_UPDATE with updated group options with values from that currency", async () => {
        mockThrottleConfig.current = { isActive: true };
        const options = {
          maxPayoutLimits: { warning: 25, error: 50 },
        };
        init.mockReturnValue({ options });
        const bettingState = { legs: { "LEG:1": {} } };
        setup(
          {
            type: BETTING__SBK_CLEAR_ACTION,
          },
          bettingState,
          nextSpy,
          dispatchSpy,
          { accountId: "onlineUser", currencyCode: "USD" },
        );

        expect(init).toHaveBeenCalledWith(options);
        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__SBK_STATE_UPDATE,
          payload: { state: { options }, group: "REAL" },
        });
      });
    });

    describe("when there is no limit", () => {
      it("should call init", async () => {
        mockThrottleConfig.current = { isActive: false };
        setup({ type: BETTING__SBK_CLEAR_ACTION, payload: {} });

        expect(init).toHaveBeenCalledWith();
      });

      it("should dispatch BETTING__SBK_STATE_UPDATE with empty state", async () => {
        productConfiguration.getPayoutLimit.mockReturnValue(undefined);
        mockThrottleConfig.current = { isActive: false };
        init.mockReturnValue("Init State");
        const bettingState = { legs: { "LEG:1": {} } };

        setup({ type: BETTING__SBK_CLEAR_ACTION, payload: {} }, bettingState, nextSpy, dispatchSpy);

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__SBK_STATE_UPDATE,
          payload: { state: "Init State", group: "REAL" },
        });
      });
    });

    describe("when the user is offline", () => {
      it("should dispatch BETTING__SBK_STATE_UPDATE with updated group options with default values", async () => {
        mockThrottleConfig.current = { isActive: true };
        const options = {
          maxPayoutLimits: { warning: 25, error: 50 },
        };
        init.mockReturnValue({ options });
        const bettingState = { legs: { "LEG:1": {} } };

        setup(
          {
            type: BETTING__SBK_CLEAR_ACTION,
          },
          bettingState,
          nextSpy,
          dispatchSpy,
          { currencyCode: "USD" },
        );

        expect(init).toHaveBeenCalledWith(options);
      });
    });

    describe("when the throttle is not active", () => {
      it("should call init", async () => {
        mockThrottleConfig.current = { isActive: false };
        setup({ type: BETTING__SBK_CLEAR_ACTION, payload: {} });

        expect(init).toHaveBeenCalledWith();
      });

      it("should dispatch BETTING__SBK_STATE_UPDATE with empty state", async () => {
        mockThrottleConfig.current = { isActive: false };
        init.mockReturnValue("Init State");
        const bettingState = { legs: { "LEG:1": {} } };
        setup({ type: BETTING__SBK_CLEAR_ACTION, payload: {} }, bettingState, nextSpy, dispatchSpy);

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__SBK_STATE_UPDATE,
          payload: { state: "Init State", group: "REAL" },
        });
      });
    });
  });

  describe("when action type is NETWORK__PLACE_SBK_BET_SUCCESS", () => {
    const dispatchSpy = jest.fn();
    const nextSpy = jest.fn();

    describe("when there is a limit", () => {
      it("should dispatch BETTING__SBK_STATE_UPDATE with updated group options with values from that currency", async () => {
        mockThrottleConfig.current = { isActive: true };
        const options = {
          maxPayoutLimits: { warning: 25, error: 50 },
        };
        init.mockReturnValue({ options });
        const bettingState = { legs: { "LEG:1": {} } };
        setup(
          {
            type: NETWORK__PLACE_SBK_BET_SUCCESS,
          },
          bettingState,
          nextSpy,
          dispatchSpy,
          { accountId: "onlineUser", currencyCode: "USD" },
        );

        expect(init).toHaveBeenCalledWith(options);
        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__SBK_STATE_UPDATE,
          payload: { state: { options }, group: "REAL" },
        });
      });
    });

    describe("when there is no limit", () => {
      it("should call init", async () => {
        mockThrottleConfig.current = { isActive: false };
        init.mockReturnValue("Init State");
        setup({ type: NETWORK__PLACE_SBK_BET_SUCCESS, payload: {} });

        expect(init).toHaveBeenCalledWith();
      });

      it("should dispatch BETTING__SBK_STATE_UPDATE with empty state", async () => {
        const bettingState = { legs: { "LEG:1": {} } };

        setup({ type: NETWORK__PLACE_SBK_BET_SUCCESS, payload: {} }, bettingState, nextSpy, dispatchSpy);
        init.mockReturnValue("Init State");
        mockThrottleConfig.current = { isActive: false };

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__SBK_STATE_UPDATE,
          payload: { state: "Init State", group: "REAL" },
        });
      });
    });

    describe("when the user is offline", () => {
      it("should dispatch BETTING__SBK_STATE_UPDATE with updated group options with default values", async () => {
        mockThrottleConfig.current = { isActive: true };
        const options = {
          maxPayoutLimits: { warning: 25, error: 50 },
        };
        init.mockReturnValue({ options });
        const bettingState = { legs: { "LEG:1": {} } };

        setup(
          {
            type: NETWORK__PLACE_SBK_BET_SUCCESS,
          },
          bettingState,
          nextSpy,
          dispatchSpy,
          { currencyCode: "USD" },
        );

        expect(init).toHaveBeenCalledWith(options);
        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__SBK_STATE_UPDATE,
          payload: { state: { options }, group: "REAL" },
        });
      });
    });

    describe("when the throttle is not active", () => {
      it("should call init", async () => {
        mockThrottleConfig.current = { isActive: false };
        init.mockReturnValue("Init State");
        setup({ type: NETWORK__PLACE_SBK_BET_SUCCESS, payload: {} });

        expect(init).toHaveBeenCalledWith();
      });

      it("should dispatch BETTING__SBK_STATE_UPDATE with empty state", async () => {
        const bettingState = { legs: { "LEG:1": {} } };

        setup({ type: NETWORK__PLACE_SBK_BET_SUCCESS, payload: {} }, bettingState, nextSpy, dispatchSpy);
        init.mockReturnValue("Init State");
        mockThrottleConfig.current = { isActive: false };

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__SBK_STATE_UPDATE,
          payload: { state: "Init State", group: "REAL" },
        });
      });
    });

    describe("when the greatest odd combination has a stake", () => {
      it("should dispatch UI__BETSLIP_SET_LAST_SUCCESSFUL_STAKE with the stake", () => {
        const getGreatestOddCombination = createGetGreatestOddCombinationSelector();
        getGreatestOddCombination.mockReturnValue({ stake: 5.5 });
        mockThrottleConfig.current = { isActive: false };
        init.mockReturnValue("Init State");

        setup({ type: NETWORK__PLACE_SBK_BET_SUCCESS, payload: {} }, { legs: {} }, nextSpy, dispatchSpy);

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: UI__BETSLIP_SET_LAST_SUCCESSFUL_STAKE,
          payload: { stake: 5.5 },
        });
      });
    });

    describe("when the greatest odd combination has no stake", () => {
      it("should not dispatch UI__BETSLIP_SET_LAST_SUCCESSFUL_STAKE", () => {
        const getGreatestOddCombination = createGetGreatestOddCombinationSelector();
        getGreatestOddCombination.mockReturnValue({ stake: undefined });
        mockThrottleConfig.current = { isActive: false };
        init.mockReturnValue("Init State");

        setup({ type: NETWORK__PLACE_SBK_BET_SUCCESS, payload: {} }, { legs: {} }, nextSpy, dispatchSpy);

        expect(dispatchSpy).not.toHaveBeenCalledWith(
          expect.objectContaining({ type: UI__BETSLIP_SET_LAST_SUCCESSFUL_STAKE }),
        );
      });
    });

    describe("when there is no greatest odd combination", () => {
      it("should not dispatch UI__BETSLIP_SET_LAST_SUCCESSFUL_STAKE", () => {
        const getGreatestOddCombination = createGetGreatestOddCombinationSelector();
        getGreatestOddCombination.mockReturnValue(undefined);
        mockThrottleConfig.current = { isActive: false };
        init.mockReturnValue("Init State");

        setup({ type: NETWORK__PLACE_SBK_BET_SUCCESS, payload: {} }, { legs: {} }, nextSpy, dispatchSpy);

        expect(dispatchSpy).not.toHaveBeenCalledWith(
          expect.objectContaining({ type: UI__BETSLIP_SET_LAST_SUCCESSFUL_STAKE }),
        );
      });
    });
  });

  describe("when action type is BETTING__SBK_VALIDATE_STAKE", () => {
    describe("and when I have validations", () => {
      describe("and when I have a BELOW_MIN_STAKE validation", () => {
        it("should trigger next BETTING__SBK_STATE_UPDATE with stake 0 when suggestedStake is undefined", async () => {
          updateStake.mockReturnValue("State with updated minStake");

          const action = {
            type: BETTING__SBK_VALIDATE_STAKE,
            payload: { combinationId: "combinationId-1" },
          };
          const sportsbookBettingMock = {
            validations: {
              combinations: {
                "combinationId-1": [
                  {
                    data: {
                      currentStake: 0.11,
                      max: 4422.76,
                      min: 0.12,
                    },
                    type: "BELOW_MIN_STAKE",
                  },
                ],
              },
            },
          };
          const dispatchSpy = jest.fn();
          const nextSpy = jest.fn();

          setup(action, sportsbookBettingMock, nextSpy, dispatchSpy);

          expect(updateStake).toHaveBeenCalledWith(sportsbookBettingMock, {
            combinationId: "combinationId-1",
            stake: 0,
          });
          expect(dispatchSpy).toHaveBeenCalledWith({
            type: BETTING__SBK_STATE_UPDATE,
            payload: {
              state: "State with updated minStake",
              group: "REAL",
            },
          });
        });

        it("should trigger next BETTING__SBK_STATE_UPDATE with suggestedStake when it is defined", async () => {
          updateStake.mockReturnValue("State with updated minStake");

          const action = {
            type: BETTING__SBK_VALIDATE_STAKE,
            payload: { combinationId: "combinationId-1" },
          };
          const sportsbookBettingMock = {
            validations: {
              combinations: {
                "combinationId-1": [
                  {
                    data: {
                      currentStake: 0.11,
                      max: 4422.76,
                      min: 0.12,
                      suggestedStake: 0.11,
                    },
                    type: "BELOW_MIN_STAKE",
                  },
                ],
              },
            },
          };
          const dispatchSpy = jest.fn();
          const nextSpy = jest.fn();

          setup(action, sportsbookBettingMock, nextSpy, dispatchSpy);

          expect(updateStake).toHaveBeenCalledWith(sportsbookBettingMock, {
            combinationId: "combinationId-1",
            stake: 0.11,
          });
          expect(dispatchSpy).toHaveBeenCalledWith({
            type: BETTING__SBK_STATE_UPDATE,
            payload: {
              state: "State with updated minStake",
              group: "REAL",
            },
          });
        });
      });

      describe("and when I have an ABOVE_MAX_STAKE validation", () => {
        it("should trigger next BETTING__SBK_STATE_UPDATE with stake 0 when suggestedStake is undefined", async () => {
          updateStake.mockReturnValue("State with updated maxStake");

          const action = {
            type: BETTING__SBK_VALIDATE_STAKE,
            payload: { combinationId: "combinationId-1" },
          };
          const sportsbookBettingMock = {
            validations: {
              combinations: {
                "combinationId-1": [
                  {
                    data: {
                      currentStake: 0.11,
                      max: 4422.76,
                      min: 0.12,
                    },
                    type: "ABOVE_MAX_STAKE",
                  },
                ],
              },
            },
          };
          const dispatchSpy = jest.fn();
          const nextSpy = jest.fn();

          setup(action, sportsbookBettingMock, nextSpy, dispatchSpy);

          expect(updateStake).toHaveBeenCalledWith(sportsbookBettingMock, {
            combinationId: "combinationId-1",
            stake: 0,
          });
          expect(dispatchSpy).toHaveBeenCalledWith({
            type: BETTING__SBK_STATE_UPDATE,
            payload: {
              state: "State with updated maxStake",
              group: "REAL",
            },
          });
        });

        it("should trigger next BETTING__SBK_STATE_UPDATE with suggestedStake when it is defined", async () => {
          updateStake.mockReturnValue("State with updated maxStake");

          const action = {
            type: BETTING__SBK_VALIDATE_STAKE,
            payload: { combinationId: "combinationId-1" },
          };
          const sportsbookBettingMock = {
            validations: {
              combinations: {
                "combinationId-1": [
                  {
                    data: {
                      currentStake: 5000,
                      max: 4422.76,
                      min: 0.12,
                      suggestedStake: 4422.75,
                    },
                    type: "ABOVE_MAX_STAKE",
                  },
                ],
              },
            },
          };
          const dispatchSpy = jest.fn();
          const nextSpy = jest.fn();

          setup(action, sportsbookBettingMock, nextSpy, dispatchSpy);

          expect(updateStake).toHaveBeenCalledWith(sportsbookBettingMock, {
            combinationId: "combinationId-1",
            stake: 4422.75,
          });
          expect(dispatchSpy).toHaveBeenCalledWith({
            type: BETTING__SBK_STATE_UPDATE,
            payload: {
              state: "State with updated maxStake",
              group: "REAL",
            },
          });
        });
      });

      describe("and when I have an INCREMENT_OUT_OF_RANGE validation", () => {
        it("should trigger next BETTING__SBK_STATE_UPDATE with updated max stake", async () => {
          updateStake.mockReturnValue("State with updated closest increment");

          const action = {
            type: BETTING__SBK_VALIDATE_STAKE,
            payload: { combinationId: "combinationId-1" },
          };
          const sportsbookBettingMock = {
            validations: {
              combinations: {
                "combinationId-1": [
                  {
                    data: {
                      currentStake: 0.155,
                      closest: 0.15,
                      prev: 0.14,
                      next: 0.16,
                    },
                    type: "INCREMENT_OUT_OF_RANGE",
                  },
                ],
              },
            },
          };
          const dispatchSpy = jest.fn();
          const nextSpy = jest.fn();

          setup(action, sportsbookBettingMock, nextSpy, dispatchSpy);

          expect(updateStake).toHaveBeenCalledWith(sportsbookBettingMock, {
            combinationId: "combinationId-1",
            stake: 0.15,
          });
          expect(dispatchSpy).toHaveBeenCalledWith({
            type: BETTING__SBK_STATE_UPDATE,
            payload: {
              state: "State with updated closest increment",
              group: "REAL",
            },
          });
        });
      });

      describe("and when I have an unsupported validation", () => {
        it("should trigger next BETTING__SBK_STATE_UPDATE with the last state", async () => {
          updateStake.mockReturnValue("State with updated closest increment");

          const action = {
            type: BETTING__SBK_VALIDATE_STAKE,
            payload: { combinationId: "combinationId-1" },
          };
          const sportsbookBettingMock = {
            validations: {
              combinations: {
                "combinationId-1": [
                  {
                    data: {
                      currentStake: 0.155,
                      closest: 0.15,
                      prev: 0.14,
                      next: 0.16,
                    },
                    type: "SOMETHING",
                  },
                ],
              },
            },
          };
          const dispatchSpy = jest.fn();
          const nextSpy = jest.fn();

          setup(action, sportsbookBettingMock, nextSpy, dispatchSpy);

          expect(dispatchSpy).toHaveBeenCalledWith({
            type: BETTING__SBK_STATE_UPDATE,
            payload: {
              state: sportsbookBettingMock,
              group: "REAL",
            },
          });
        });
      });
    });

    describe("and when I do not have validations", () => {
      it("should ignore the action", async () => {
        updateStake.mockClear();

        const action = {
          type: BETTING__SBK_VALIDATE_STAKE,
          payload: { combinationId: "combinationId-1" },
        };
        const sportsbookBettingMock = {
          validations: {
            combinations: {},
          },
        };
        const nextSpy = jest.fn();
        const dispatchSpy = jest.fn();

        setup(action, sportsbookBettingMock, nextSpy, dispatchSpy);

        expect(updateStake).not.toHaveBeenCalled();
        expect(nextSpy).toHaveBeenCalledWith({
          type: BETTING__SBK_VALIDATE_STAKE,
          payload: { combinationId: "combinationId-1" },
        });
      });
    });
  });

  describe("when action type is BETTING__SBK_BONUS_TOGGLE_ACTION", () => {
    it("should dispatch BETTING__SBK_STATE_UPDATE with updated bonus use", async () => {
      const dispatchSpy = jest.fn();
      const nextSpy = jest.fn();

      updateBonusUse.mockReturnValue("Updated Bonus Use");

      setup(
        {
          type: BETTING__SBK_BONUS_TOGGLE_ACTION,
          payload: {
            isFreeBetsSelected: "isFreeBetsSelected",
          },
        },
        null,
        nextSpy,
        dispatchSpy,
      );

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING__SBK_STATE_UPDATE,
        payload: { state: "Updated Bonus Use", group: "REAL" },
      });
    });

    it("should call updateBonusUse", async () => {
      setup({
        type: BETTING__SBK_BONUS_TOGGLE_ACTION,
        payload: {
          isFreeBetsSelected: "isFreeBetsSelected",
        },
      });
      expect(updateBonusUse).toHaveBeenCalledWith({ legs: {} }, { isBonusSelected: "isFreeBetsSelected" });
    });
  });

  describe("when action type is BETTING__SBK_BONUS_EACHWAY_TOGGLE", () => {
    it("should dispatch BETTING__SBK_STATE_UPDATE with updated each way use", async () => {
      const dispatchSpy = jest.fn();
      const nextSpy = jest.fn();

      updateEachWay.mockReturnValue("Updated each way");

      setup(
        {
          type: BETTING__SBK_EACH_WAY_TOGGLE,
          payload: {
            combinationId: "cid",
            isSelected: "isSelected",
          },
        },
        null,
        nextSpy,
        dispatchSpy,
      );

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING__SBK_STATE_UPDATE,
        payload: { state: "Updated each way", group: "REAL" },
      });
    });
  });

  describe("when action type is BETTING__SBK_STARTING_PRICE_TOGGLE", () => {
    describe("and starting price is available", () => {
      describe("when toggling a single", () => {
        it("should dispatch BETTING__SBK_STATE_UPDATE with updated starting price", () => {
          const dispatchSpy = jest.fn();
          const nextSpy = jest.fn();
          const single = { id: "cid", isSPSelected: false, isSPAvailable: true, legs: ["LEG:1"] };

          findSingleCombinationFromLegId.mockReturnValue(single);
          getSportsbookBettingCombinations.mockReturnValue({ cid: single });
          updateSP.mockReturnValue("Updated starting price");

          setup(
            {
              type: BETTING__SBK_STARTING_PRICE_TOGGLE,
              payload: {
                combinationId: "cid",
                isSelected: true,
              },
            },
            null,
            nextSpy,
            dispatchSpy,
          );

          expect(updateSP).toHaveBeenNthCalledWith(1, expect.any(Object), {
            combinationId: "cid",
            isSPSelected: true,
          });
          expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
            type: BETTING__SBK_STATE_UPDATE,
            payload: { state: "Updated starting price", group: "REAL" },
          });

          expect(updateSP).toHaveBeenCalledTimes(1);
          expect(dispatchSpy).toHaveBeenCalledTimes(1);
        });
      });

      describe("when toggling a multiple", () => {
        it("should dispatch BETTING__SBK_STATE_UPDATE with updated starting price", () => {
          const dispatchSpy = jest.fn();
          const nextSpy = jest.fn();
          const singleOne = { id: "sOne", legs: ["LEG:1"] };
          const singleTwo = { id: "sTwo", legs: ["LEG:2"] };
          const multOne = { id: "mOne", legs: ["LEG:1", "LEG:2"] };

          findSingleCombinationFromLegId.mockReturnValueOnce(singleOne);
          findSingleCombinationFromLegId.mockReturnValueOnce(singleTwo);
          getSportsbookBettingCombinations.mockReturnValue({
            sOne: singleOne,
            sTwo: singleTwo,
            mOne: multOne,
          });
          updateSP.mockReturnValue("Updated starting price");

          setup(
            {
              type: BETTING__SBK_STARTING_PRICE_TOGGLE,
              payload: {
                combinationId: "mOne",
                isSelected: true,
              },
            },
            null,
            nextSpy,
            dispatchSpy,
          );

          expect(updateSP).toHaveBeenNthCalledWith(1, expect.any(Object), {
            combinationId: "sOne",
            isSPSelected: true,
          });

          expect(updateSP).toHaveBeenNthCalledWith(2, "Updated starting price", {
            combinationId: "sTwo",
            isSPSelected: true,
          });
          expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
            type: BETTING__SBK_STATE_UPDATE,
            payload: { state: "Updated starting price", group: "REAL" },
          });

          expect(updateSP).toHaveBeenCalledTimes(2);
          expect(dispatchSpy).toHaveBeenCalledTimes(1);
        });
      });

      describe("when acca insurance is selected and does not have a token in any combinations", () => {
        it("should call updateAccaInsurance with the correct arguments", () => {
          const dispatchSpy = jest.fn();
          const nextSpy = jest.fn();
          const single = {
            isSPSelected: false,
            isSPAvailable: true,
            legs: ["LEG:1"],
          };

          updateSP.mockReturnValue("Updated starting price");
          updateAccaInsurance.mockReturnValue("Updated acca insurance");
          findSingleCombinationFromLegId.mockReturnValue(single);
          getSportsbookBettingCombinations.mockReturnValue({
            spCid: single,
            accaCid: {
              id: "accaCid",
              isAccaInsuranceSelected: true,
              accaInsuranceTokenId: undefined,
            },
          });

          setup(
            {
              type: BETTING__SBK_STARTING_PRICE_TOGGLE,
              payload: {
                combinationId: "spCid",
                isSelected: "isSelected",
              },
            },
            "sportsbookBettingStateMock",
            nextSpy,
            dispatchSpy,
          );

          expect(updateAccaInsurance).toHaveBeenCalledWith("sportsbookBettingStateMock", {
            combinationId: "accaCid",
            isAccaInsuranceSelected: false,
          });
        });
      });

      describe("when acca insurance is selected and has a token in any combinations", () => {
        it("should not call updateAccaInsurance", () => {
          const dispatchSpy = jest.fn();
          const nextSpy = jest.fn();
          const single = {
            isSPSelected: false,
            isSPAvailable: true,
            legs: ["LEG:1"],
          };

          updateSP.mockReturnValue("Updated starting price");
          updateAccaInsurance.mockReturnValue("Updated acca insurance");
          findSingleCombinationFromLegId.mockReturnValue(single);
          getSportsbookBettingCombinations.mockReturnValue({
            spCid: single,
            accaCid: {
              id: "accaCid",
              isAccaInsuranceSelected: true,
              accaInsuranceTokenId: "tokenId",
            },
          });

          setup(
            {
              type: BETTING__SBK_STARTING_PRICE_TOGGLE,
              payload: {
                combinationId: "spCid",
                isSelected: "isSelected",
              },
            },
            "sportsbookBettingStateMock",
            nextSpy,
            dispatchSpy,
          );

          expect(updateAccaInsurance).not.toHaveBeenCalled();
        });
      });

      describe("when acca insurance is not selected in any combinations", () => {
        it("should not call updateAccaInsurance", () => {
          const dispatchSpy = jest.fn();
          const nextSpy = jest.fn();

          const single = {
            isSPSelected: false,
            isSPAvailable: true,
            legs: ["LEG:1"],
          };

          updateSP.mockReturnValue("Updated starting price");
          updateAccaInsurance.mockReturnValue("Updated acca insurance");
          findSingleCombinationFromLegId.mockReturnValue(single);
          getSportsbookBettingCombinations.mockReturnValue({
            spCid: single,
            accaCid: {
              id: "accaCid",
              isAccaInsuranceSelected: false,
              accaInsuranceTokenId: undefined,
            },
          });

          setup(
            {
              type: BETTING__SBK_STARTING_PRICE_TOGGLE,
              payload: {
                combinationId: "spCid",
                isSelected: "isSelected",
              },
            },
            "sportsbookBettingStateMock",
            nextSpy,
            dispatchSpy,
          );

          expect(updateAccaInsurance).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe("when action type is BETTING__SBK_PRICE_BOOST_TOGGLE", () => {
    describe("and price boost is available", () => {
      it("should dispatch BETTING__SBK_STATE_UPDATE with updated selectedTokenId", async () => {
        const dispatchSpy = jest.fn();
        const nextSpy = jest.fn();

        updatePriceBoost.mockReturnValue("Updated boost token");
        getSportsbookBettingCombinations.mockReturnValue({
          cid: { isPriceBoostAvailable: true },
        });

        setup(
          {
            type: BETTING__SBK_PRICE_BOOST_TOGGLE,
            payload: {
              combinationId: "cid",
              selectedTokenId: "selectedTokenId",
            },
          },
          "sportsbookBettingStateMock",
          nextSpy,
          dispatchSpy,
        );

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__SBK_STATE_UPDATE,
          payload: { state: "Updated boost token", group: "REAL" },
        });

        expect(updatePriceBoost).toHaveBeenCalledWith("sportsbookBettingStateMock", {
          combinationId: "cid",
          selectedTokenId: "selectedTokenId",
          isPriceBoostSelected: true,
        });
      });
    });

    describe("and there are no tokens available", () => {
      describe("and price boost is not available", () => {
        it("should not dispatch BETTING__SBK_STATE_UPDATE", async () => {
          const dispatchSpy = jest.fn();
          const nextSpy = jest.fn();

          updatePriceBoost.mockReturnValue("Updated boost token");
          getSportsbookBettingCombinations.mockReturnValue({ cid: { isPriceBoostAvailable: false } });

          setup(
            {
              type: BETTING__SBK_PRICE_BOOST_TOGGLE,
              payload: {
                combinationId: "cid",
              },
            },
            "sportsbookBettingStateMock",
            nextSpy,
            dispatchSpy,
          );

          expect(dispatchSpy).not.toHaveBeenCalled();
          expect(updatePriceBoost).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe("when action type is BETTING__SBK_ACCA_INSURANCE_TOGGLE", () => {
    describe("and there is selectedTokenId", () => {
      it("should dispatch BETTING__SBK_STATE_UPDATE with updated acca insurance selectedTokenId", async () => {
        const dispatchSpy = jest.fn();
        const nextSpy = jest.fn();

        updateAccaInsurance.mockReturnValue("Updated acca insurance");
        getSportsbookBettingCombinations.mockReturnValue({ cid: { isAccaInsuranceSelected: false } });

        setup(
          {
            type: BETTING__SBK_ACCA_INSURANCE_TOGGLE,
            payload: {
              combinationId: "cid",
              selectedTokenId: "selectedTokenId",
            },
          },
          "sportsbookBettingStateMock",
          nextSpy,
          dispatchSpy,
        );

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__SBK_STATE_UPDATE,
          payload: { state: "Updated acca insurance", group: "REAL" },
        });

        expect(updateAccaInsurance).toHaveBeenCalledWith("sportsbookBettingStateMock", {
          combinationId: "cid",
          isAccaInsuranceSelected: true,
          selectedTokenId: "selectedTokenId",
        });
      });
    });
    describe("and there is no selectedTokenId", () => {
      it("should dispatch BETTING__SBK_STATE_UPDATE to toggle the acca insurance", async () => {
        const dispatchSpy = jest.fn();
        const nextSpy = jest.fn();

        updateAccaInsurance.mockReturnValue("Updated acca insurance");
        getSportsbookBettingCombinations.mockReturnValue({ cid: { isAccaInsuranceSelected: false } });

        setup(
          {
            type: BETTING__SBK_ACCA_INSURANCE_TOGGLE,
            payload: {
              combinationId: "cid",
            },
          },
          "sportsbookBettingStateMock",
          nextSpy,
          dispatchSpy,
        );

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__SBK_STATE_UPDATE,
          payload: { state: "Updated acca insurance", group: "REAL" },
        });

        expect(updateAccaInsurance).toHaveBeenCalledWith("sportsbookBettingStateMock", {
          combinationId: "cid",
          isAccaInsuranceSelected: true,
        });
      });
    });
  });

  describe("when action type is BETTING__SBK_MONEY_BACK_TOGGLE", () => {
    describe("and there is selectedTokenId", () => {
      it("should dispatch BETTING__SBK_STATE_UPDATE with updated money back selectedTokenId", async () => {
        const dispatchSpy = jest.fn();
        const nextSpy = jest.fn();

        updateMoneyBack.mockReturnValue("Updated money back");
        getSportsbookBettingCombinations.mockReturnValue({ cid: { isMoneyBackSelected: false } });

        setup(
          {
            type: BETTING__SBK_MONEY_BACK_TOGGLE,
            payload: {
              combinationId: "cid",
              selectedTokenId: "selectedTokenId",
            },
          },
          "sportsbookBettingStateMock",
          nextSpy,
          dispatchSpy,
        );

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__SBK_STATE_UPDATE,
          payload: { state: "Updated money back", group: "REAL" },
        });

        expect(updateMoneyBack).toHaveBeenCalledWith("sportsbookBettingStateMock", {
          combinationId: "cid",
          isMoneyBackSelected: true,
          selectedTokenId: "selectedTokenId",
        });
      });
    });
    describe("and there is no selectedTokenId", () => {
      it("should dispatch BETTING__SBK_STATE_UPDATE to toggle the money back", async () => {
        const dispatchSpy = jest.fn();
        const nextSpy = jest.fn();

        updateMoneyBack.mockReturnValue("Updated money back");
        getSportsbookBettingCombinations.mockReturnValue({ cid: { isMoneyBackSelected: false } });

        setup(
          {
            type: BETTING__SBK_MONEY_BACK_TOGGLE,
            payload: {
              combinationId: "cid",
            },
          },
          "sportsbookBettingStateMock",
          nextSpy,
          dispatchSpy,
        );

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__SBK_STATE_UPDATE,
          payload: { state: "Updated money back", group: "REAL" },
        });

        expect(updateMoneyBack).toHaveBeenCalledWith("sportsbookBettingStateMock", {
          combinationId: "cid",
          isMoneyBackSelected: true,
        });
      });
    });
  });

  describe("when action type is BETTING__SBK_GHOST_LEG_TOGGLE", () => {
    describe("and there is selectedTokenId", () => {
      it("should dispatch BETTING__SBK_STATE_UPDATE with updated ghost leg selectedTokenId", async () => {
        const dispatchSpy = jest.fn();
        const nextSpy = jest.fn();

        updateState.mockReturnValue("Updated ghost leg");

        setup(
          {
            type: BETTING__SBK_GHOST_LEG_TOGGLE,
            payload: {
              combinationId: "cid",
              selectedTokenId: "selectedTokenId",
            },
          },
          "sportsbookBettingStateMock",
          nextSpy,
          dispatchSpy,
        );

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__SBK_STATE_UPDATE,
          payload: { state: "Updated ghost leg", group: "REAL" },
        });

        expect(updateState).toHaveBeenCalledWith("sportsbookBettingStateMock", UPDATE_ACTIONS.UPDATE_GHOST_LEG, {
          combinationId: "cid",
          isGhostLegSelected: true,
          selectedTokenId: "selectedTokenId",
        });
      });
    });
    describe("and there is no selectedTokenId", () => {
      it("should dispatch BETTING__SBK_STATE_UPDATE to toggle the ghost leg", async () => {
        const dispatchSpy = jest.fn();
        const nextSpy = jest.fn();

        updateState.mockReturnValue("Updated ghost leg");

        setup(
          {
            type: BETTING__SBK_GHOST_LEG_TOGGLE,
            payload: {
              combinationId: "cid",
            },
          },
          "sportsbookBettingStateMock",
          nextSpy,
          dispatchSpy,
        );

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__SBK_STATE_UPDATE,
          payload: { state: "Updated ghost leg", group: "REAL" },
        });

        expect(updateState).toHaveBeenCalledWith("sportsbookBettingStateMock", UPDATE_ACTIONS.UPDATE_GHOST_LEG, {
          combinationId: "cid",
          isGhostLegSelected: false,
        });
      });
    });
  });

  describe("when action type is BETTING__SBK_ORDER_CHANGE", () => {
    it("should dispatch BETTING__SBK_STATE_UPDATE with updated order", async () => {
      const dispatchSpy = jest.fn();
      const nextSpy = jest.fn();

      updateOrder.mockReturnValue("Updated order");

      setup(
        {
          type: BETTING__SBK_ORDER_CHANGE,
          payload: {
            order: ["R:1", "R:2"],
          },
        },
        null,
        nextSpy,
        dispatchSpy,
      );

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING__SBK_STATE_UPDATE,
        payload: { state: "Updated order", group: "REAL" },
      });
    });
  });

  describe("when action type is NETWORK__SBK_COMBINATIONS_UPDATE_SUCCESS", () => {
    it("should dispatch BETTING__SBK_STATE_UPDATE with updated combinations", async () => {
      const dispatchSpy = jest.fn();
      const nextSpy = jest.fn();

      updateCombinations.mockReturnValue("Updated Combinations");

      setup(
        {
          type: NETWORK__SBK_COMBINATIONS_UPDATE_SUCCESS,
          payload: {
            combinations: "combinations",
          },
        },
        null,
        nextSpy,
        dispatchSpy,
      );

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING__SBK_STATE_UPDATE,
        payload: { state: "Updated Combinations", group: "REAL" },
      });
    });

    it("should call updateCombinations", async () => {
      setup({
        type: NETWORK__SBK_COMBINATIONS_UPDATE_SUCCESS,
        payload: {
          combinations: "combinations",
        },
      });

      expect(updateCombinations).toHaveBeenCalledWith(
        { legs: {} },
        {
          responses: "combinations",
        },
      );
    });
  });

  describe("when action type is BETTING__SPORTSBOOK_FREE_BETS_WALLETS_APPLY_ACTION", () => {
    it("should dispatch BETTING__SBK_STATE_UPDATE with updated wallets", async () => {
      const dispatchSpy = jest.fn();
      const nextSpy = jest.fn();

      updateBonusWallets.mockReturnValue("Updated Bonus Wallets");

      setup(
        {
          type: BETTING__SPORTSBOOK_FREE_BETS_WALLETS_APPLY_ACTION,
          payload: {
            combinationId: "combinationId_mock",
            selectedWallets: [1, 2],
          },
        },
        null,
        nextSpy,
        dispatchSpy,
      );

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING__SBK_STATE_UPDATE,
        payload: { state: "Updated Bonus Wallets", group: "REAL" },
      });
    });

    it("should call updateBonusWallets", async () => {
      setup({
        type: BETTING__SPORTSBOOK_FREE_BETS_WALLETS_APPLY_ACTION,
        payload: {
          combinationId: "combinationId_mock",
          selectedWallets: [1, 2],
        },
      });

      expect(updateBonusWallets).toHaveBeenCalledWith(
        { legs: {} },
        {
          combinationId: "combinationId_mock",
          selectedWallets: [1, 2],
        },
      );
    });
  });

  describe("when action type is NETWORK__PLACE_SBK_BET_IN_PROGRESS", () => {
    it("should dispatch BETTING__SBK_STATE_UPDATE with cleared place failures", async () => {
      const dispatchSpy = jest.fn();
      const nextSpy = jest.fn();

      clearPlaceFailures.mockReturnValue("Cleared Place State");

      setup({ type: NETWORK__PLACE_SBK_BET_IN_PROGRESS, payload: {} }, null, nextSpy, dispatchSpy);

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING__SBK_STATE_UPDATE,
        payload: { state: "Cleared Place State", group: "REAL" },
      });
    });

    it("should call clearPlaceFailures", async () => {
      setup({ type: NETWORK__PLACE_SBK_BET_IN_PROGRESS, payload: {} });

      expect(clearPlaceFailures).toHaveBeenCalled();
    });
  });

  describe("when action type is NETWORK__PLACE_SBK_BET_FAILURE", () => {
    describe("when the error is non technical", () => {
      it("should call updatePlaceFailures", async () => {
        setup({
          type: NETWORK__PLACE_SBK_BET_FAILURE,
          payload: {
            error: { definitions: "definitions", combinations: "combinations", operation: "operation" },
          },
        });

        expect(updatePlaceFailures).toHaveBeenCalledWith(
          { legs: {} },
          { placement: { definitions: "definitions", combinations: "combinations" }, operation: "operation" },
        );
      });

      describe("when the SBK_PLACE_FAILURE_PRICE_INFERRAL throttle is active", () => {
        it("should dispatch BETTING__SBK_PLACE_FAILED_UPDATE with updateCombinationsWithPlace result", async () => {
          const dispatchSpy = jest.fn();
          const nextSpy = jest.fn();

          mockThrottleConfig.current = { isActive: true };
          updatePlaceFailures.mockReturnValue("Updated Place State");
          updateCombinationsWithPlace.mockReturnValue("Updated Combinations With Place");

          setup(
            {
              type: NETWORK__PLACE_SBK_BET_FAILURE,
              payload: { error: { definitions: "definitions", combinations: "combinations", operation: "operation" } },
            },
            null,
            nextSpy,
            dispatchSpy,
          );

          expect(dispatchSpy).toHaveBeenCalledWith({
            type: BETTING__SBK_PLACE_FAILED_UPDATE,
            payload: { state: "Updated Combinations With Place" },
          });
        });

        it("should call updateCombinationsWithPlace with updated state and operation", async () => {
          mockThrottleConfig.current = { isActive: true };
          updatePlaceFailures.mockReturnValue("Updated Place State");
          updateCombinationsWithPlace.mockReturnValue("Updated Combinations With Place");

          setup({
            type: NETWORK__PLACE_SBK_BET_FAILURE,
            payload: {
              error: { definitions: "definitions", combinations: "combinations", operation: "operation" },
            },
          });

          expect(updateCombinationsWithPlace).toHaveBeenCalledWith("Updated Place State", {
            operation: "operation",
          });
        });

        it("should call getBasicSpan with correct arguments", async () => {
          mockThrottleConfig.current = { isActive: true };
          updatePlaceFailures.mockReturnValue("Updated Place State");
          updateCombinationsWithPlace.mockReturnValue("Updated Combinations With Place");

          setup({
            type: NETWORK__PLACE_SBK_BET_FAILURE,
            payload: {
              error: { definitions: "definitions", combinations: "combinations", operation: "operation" },
            },
          });

          expect(getBasicSpan).toHaveBeenCalledWith(
            expect.anything(),
            "betting.placeBet.exception.operational.inferral",
            undefined,
            "betting.placeBet",
          );
        });

        it("should set span attribute wasUpdated to true when state was updated", async () => {
          const mockSpan = { setAttribute: jest.fn(), end: jest.fn() };

          mockThrottleConfig.current = { isActive: true };
          updatePlaceFailures.mockReturnValue("Updated Place State");
          updateCombinationsWithPlace.mockReturnValue("Different Updated State");
          getBasicSpan.mockReturnValue(mockSpan);

          setup({
            type: NETWORK__PLACE_SBK_BET_FAILURE,
            payload: {
              error: { definitions: "definitions", combinations: "combinations", operation: "operation" },
            },
          });

          expect(mockSpan.setAttribute).toHaveBeenCalledWith("betting.state.wasUpdated", true);
        });

        it("should set span attribute wasUpdated to false when state was not updated", async () => {
          const sameState = "Same State Reference";
          const mockSpan = { setAttribute: jest.fn(), end: jest.fn() };

          mockThrottleConfig.current = { isActive: true };
          updatePlaceFailures.mockReturnValue(sameState);
          updateCombinationsWithPlace.mockReturnValue(sameState);
          getBasicSpan.mockReturnValue(mockSpan);

          setup({
            type: NETWORK__PLACE_SBK_BET_FAILURE,
            payload: {
              error: { definitions: "definitions", combinations: "combinations", operation: "operation" },
            },
          });

          expect(mockSpan.setAttribute).toHaveBeenCalledWith("betting.state.wasUpdated", false);
        });

        it("should end the span", async () => {
          const mockSpan = { setAttribute: jest.fn(), end: jest.fn() };

          mockThrottleConfig.current = { isActive: true };
          updatePlaceFailures.mockReturnValue("Updated Place State");
          updateCombinationsWithPlace.mockReturnValue("Updated Combinations With Place");
          getBasicSpan.mockReturnValue(mockSpan);

          setup({
            type: NETWORK__PLACE_SBK_BET_FAILURE,
            payload: {
              error: { definitions: "definitions", combinations: "combinations", operation: "operation" },
            },
          });

          expect(mockSpan.end).toHaveBeenCalled();
        });

        describe("when updateCombinationsWithPlace throws an error", () => {
          it("should set span attribute with stringified operation", async () => {
            const mockSpan = {
              setAttribute: jest.fn(),
              setStatus: jest.fn(),
              recordException: jest.fn(),
              end: jest.fn(),
            };
            const testError = new Error("Test error message");

            mockThrottleConfig.current = { isActive: true };
            updatePlaceFailures.mockReturnValue("Updated Place State");
            updateCombinationsWithPlace.mockImplementation(() => {
              throw testError;
            });
            getBasicSpan.mockReturnValue(mockSpan);

            setup({
              type: NETWORK__PLACE_SBK_BET_FAILURE,
              payload: {
                error: { definitions: "definitions", combinations: "combinations", operation: { some: "operation" } },
              },
            });

            expect(mockSpan.setAttribute).toHaveBeenCalledWith(
              "betting.state.inferral.operation",
              JSON.stringify({ some: "operation" }),
            );
          });

          it("should set span status with error code and message", async () => {
            const mockSpan = {
              setAttribute: jest.fn(),
              setStatus: jest.fn(),
              recordException: jest.fn(),
              end: jest.fn(),
            };
            const testError = new Error("Test error message");

            mockThrottleConfig.current = { isActive: true };
            updatePlaceFailures.mockReturnValue("Updated Place State");
            updateCombinationsWithPlace.mockImplementation(() => {
              throw testError;
            });
            getBasicSpan.mockReturnValue(mockSpan);

            setup({
              type: NETWORK__PLACE_SBK_BET_FAILURE,
              payload: {
                error: { definitions: "definitions", combinations: "combinations", operation: "operation" },
              },
            });

            expect(mockSpan.setStatus).toHaveBeenCalledWith({ code: 2, message: "Test error message" });
          });

          it("should record exception on span", async () => {
            const mockSpan = {
              setAttribute: jest.fn(),
              setStatus: jest.fn(),
              recordException: jest.fn(),
              end: jest.fn(),
            };
            const testError = new Error("Test error message");

            mockThrottleConfig.current = { isActive: true };
            updatePlaceFailures.mockReturnValue("Updated Place State");
            updateCombinationsWithPlace.mockImplementation(() => {
              throw testError;
            });
            getBasicSpan.mockReturnValue(mockSpan);

            setup({
              type: NETWORK__PLACE_SBK_BET_FAILURE,
              payload: {
                error: { definitions: "definitions", combinations: "combinations", operation: "operation" },
              },
            });

            expect(mockSpan.recordException).toHaveBeenCalledWith(testError);
          });

          it("should still end the span in finally block", async () => {
            const mockSpan = {
              setAttribute: jest.fn(),
              setStatus: jest.fn(),
              recordException: jest.fn(),
              end: jest.fn(),
            };
            const testError = new Error("Test error message");

            mockThrottleConfig.current = { isActive: true };
            updatePlaceFailures.mockReturnValue("Updated Place State");
            updateCombinationsWithPlace.mockImplementation(() => {
              throw testError;
            });
            getBasicSpan.mockReturnValue(mockSpan);

            setup({
              type: NETWORK__PLACE_SBK_BET_FAILURE,
              payload: {
                error: { definitions: "definitions", combinations: "combinations", operation: "operation" },
              },
            });

            expect(mockSpan.end).toHaveBeenCalled();
          });

          it("should dispatch with updatePlaceFailures state when error occurs", async () => {
            const dispatchSpy = jest.fn();
            const nextSpy = jest.fn();
            const mockSpan = {
              setAttribute: jest.fn(),
              setStatus: jest.fn(),
              recordException: jest.fn(),
              end: jest.fn(),
            };
            const testError = new Error("Test error message");

            mockThrottleConfig.current = { isActive: true };
            updatePlaceFailures.mockReturnValue("Updated Place State Before Error");
            updateCombinationsWithPlace.mockImplementation(() => {
              throw testError;
            });
            getBasicSpan.mockReturnValue(mockSpan);

            setup(
              {
                type: NETWORK__PLACE_SBK_BET_FAILURE,
                payload: {
                  error: { definitions: "definitions", combinations: "combinations", operation: "operation" },
                },
              },
              null,
              nextSpy,
              dispatchSpy,
            );

            expect(dispatchSpy).toHaveBeenCalledWith({
              type: BETTING__SBK_PLACE_FAILED_UPDATE,
              payload: { state: "Updated Place State Before Error" },
            });
          });

          it("should not call setStatus or recordException when error is not an Error instance", async () => {
            const mockSpan = {
              setAttribute: jest.fn(),
              setStatus: jest.fn(),
              recordException: jest.fn(),
              end: jest.fn(),
            };

            mockThrottleConfig.current = { isActive: true };
            updatePlaceFailures.mockReturnValue("Updated Place State");
            updateCombinationsWithPlace.mockImplementation(() => {
              throw "string error";
            });
            getBasicSpan.mockReturnValue(mockSpan);

            setup({
              type: NETWORK__PLACE_SBK_BET_FAILURE,
              payload: {
                error: { definitions: "definitions", combinations: "combinations", operation: "operation" },
              },
            });

            expect(mockSpan.setAttribute).toHaveBeenCalledWith(
              "betting.state.inferral.operation",
              JSON.stringify("operation"),
            );
            expect(mockSpan.setStatus).not.toHaveBeenCalled();
            expect(mockSpan.recordException).not.toHaveBeenCalled();
          });
        });
      });

      describe("when the SBK_PLACE_FAILURE_PRICE_INFERRAL throttle is not active", () => {
        it("should dispatch BETTING__SBK_PLACE_FAILED_UPDATE with updatePlaceFailures result", async () => {
          const dispatchSpy = jest.fn();
          const nextSpy = jest.fn();

          mockThrottleConfig.current = { isActive: false };
          updatePlaceFailures.mockReturnValue("Updated Place State");

          setup(
            {
              type: NETWORK__PLACE_SBK_BET_FAILURE,
              payload: { error: { definitions: "definitions", combinations: "combinations", operation: "operation" } },
            },
            null,
            nextSpy,
            dispatchSpy,
          );

          expect(dispatchSpy).toHaveBeenCalledWith({
            type: BETTING__SBK_PLACE_FAILED_UPDATE,
            payload: { state: "Updated Place State" },
          });
        });

        it("should not call updateCombinationsWithPlace", async () => {
          mockThrottleConfig.current = { isActive: false };
          updatePlaceFailures.mockReturnValue("Updated Place State");

          setup({
            type: NETWORK__PLACE_SBK_BET_FAILURE,
            payload: {
              error: { definitions: "definitions", combinations: "combinations", operation: "operation" },
            },
          });

          expect(updateCombinationsWithPlace).not.toHaveBeenCalled();
        });

        it("should not call getBasicSpan", async () => {
          mockThrottleConfig.current = { isActive: false };
          updatePlaceFailures.mockReturnValue("Updated Place State");

          setup({
            type: NETWORK__PLACE_SBK_BET_FAILURE,
            payload: {
              error: { definitions: "definitions", combinations: "combinations", operation: "operation" },
            },
          });

          expect(getBasicSpan).not.toHaveBeenCalled();
        });
      });
    });

    describe("when the error is technical", () => {
      it("should next the network failure", async () => {
        const nextSpy = jest.fn();
        const dispatchSpy = jest.fn();

        updatePlaceFailures.mockReturnValue("Updated Place State");

        setup(
          {
            type: NETWORK__PLACE_SBK_BET_FAILURE,
            payload: { isTechnical: true, error: "Some Technical Error" },
          },
          null,
          nextSpy,
          dispatchSpy,
        );

        expect(nextSpy).toHaveBeenCalledWith({
          type: NETWORK__PLACE_SBK_BET_FAILURE,
          payload: { isTechnical: true, error: "Some Technical Error" },
        });
      });

      it("should not call updatePlaceFailures", async () => {
        setup({
          type: NETWORK__PLACE_SBK_BET_FAILURE,
          payload: { isTechnical: true, error: "Some Technical Error" },
        });

        expect(updatePlaceFailures).not.toHaveBeenCalled();
      });
    });
  });

  describe("when action type is NETWORK__FETCH_COMBINATIONS_LIST_SUCCESS", () => {
    it("should dispatch BETTING__SBK_STATE_UPDATE with updated reviews", async () => {
      const dispatchSpy = jest.fn();
      const nextSpy = jest.fn();
      updateCombinationReview.mockReturnValue("combinationReviewUpdate");
      const actionPayload = {
        combinationId: "cid",
        response: {
          combinations: "combinations",
          status: "hooray",
          statusDescription: "something",
        },
      };

      setup(
        {
          type: NETWORK__FETCH_COMBINATIONS_LIST_SUCCESS,
          payload: actionPayload,
        },
        "sportsbookBettingStateMock",
        nextSpy,
        dispatchSpy,
      );

      expect(updateCombinationReview).toHaveBeenCalledWith("sportsbookBettingStateMock", {
        combinationId: actionPayload.combinationId,
        combinationsResponse: { ...actionPayload.response, status: "SUCCESS" },
      });
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING__SBK_STATE_UPDATE,
        payload: { state: "combinationReviewUpdate", group: "REAL" },
      });
    });
  });

  describe("when action type is NETWORK__FETCH_APP_CONTEXT_SUCCESS", () => {
    const dispatchSpy = jest.fn();
    const nextSpy = jest.fn();
    updateGroupOptions.mockReturnValue("groupOptionsUpdate");

    describe("when there is a payout limit", () => {
      it("should dispatch BETTING__SBK_STATE_UPDATE with updated group options with values from that currency", async () => {
        mockThrottleConfig.current = { isActive: true };
        const actionPayload = {
          initialState: {
            entities: {
              userdetails: { accountId: "onlineUser", currencyCode: "USD" },
            },
          },
        };

        setup(
          {
            type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
            payload: actionPayload,
          },
          "sportsbookBettingStateMock",
          nextSpy,
          dispatchSpy,
        );

        expect(updateGroupOptions).toHaveBeenCalledWith("sportsbookBettingStateMock", {
          maxPayoutLimits: { warning: 25, error: 50 },
        });
        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__SBK_STATE_UPDATE,
          payload: { state: "groupOptionsUpdate", group: "REAL" },
        });
      });
    });

    describe("when there is no payout limit", () => {
      it("should not dispatch BETTING__SBK_STATE_UPDATE", async () => {
        mockThrottleConfig.current = { isActive: false };
        const actionPayload = {
          initialState: {
            entities: {
              userdetails: { currencyCode: "USD" },
            },
          },
        };

        setup(
          {
            type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
            payload: actionPayload,
          },
          "sportsbookBettingStateMock",
          nextSpy,
          dispatchSpy,
        );

        expect(updateGroupOptions).toHaveBeenCalledTimes(0);
        expect(dispatchSpy).toHaveBeenCalledTimes(0);
      });
    });

    describe("when the user is offline", () => {
      it("should dispatch BETTING__SBK_STATE_UPDATE with updated group options with default values", async () => {
        mockThrottleConfig.current = { isActive: true };

        const actionPayload = {
          initialState: {
            entities: {
              userdetails: { currencyCode: "USD" },
            },
          },
        };

        setup(
          {
            type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
            payload: actionPayload,
          },
          "sportsbookBettingStateMock",
          nextSpy,
          dispatchSpy,
        );

        expect(updateGroupOptions).toHaveBeenCalledWith("sportsbookBettingStateMock", {
          maxPayoutLimits: { warning: 25, error: 50 },
        });
        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__SBK_STATE_UPDATE,
          payload: { state: "groupOptionsUpdate", group: "REAL" },
        });
      });
    });

    describe("when the throttle is not active", () => {
      it("should not dispatch BETTING__SBK_STATE_UPDATE", async () => {
        mockThrottleConfig.current = { isActive: false };
        const actionPayload = {
          initialState: {
            entities: {
              userdetails: { currencyCode: "USD" },
            },
          },
        };

        setup(
          {
            type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
            payload: actionPayload,
          },
          "sportsbookBettingStateMock",
          nextSpy,
          dispatchSpy,
        );

        expect(updateGroupOptions).toHaveBeenCalledTimes(0);
        expect(dispatchSpy).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe("when action type is NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE", () => {
    const dispatchSpy = jest.fn();
    const nextSpy = jest.fn();

    it("should dispatch BETTING__SBK_STATE_UPDATE with init state", async () => {
      const bettingState = { legs: { "LEG:1": {} } };

      init.mockReturnValue("init state");
      setup(
        {
          type: NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE,
        },
        bettingState,
        nextSpy,
        dispatchSpy,
      );

      expect(init).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING__SBK_STATE_UPDATE,
        payload: { state: "init state", group: "REAL" },
      });
    });
  });

  describe("when action type is NETWORK__INVALID_SESSION", () => {
    const dispatchSpy = jest.fn();
    const nextSpy = jest.fn();

    it("should dispatch BETTING__SBK_STATE_UPDATE with init state", async () => {
      const bettingState = { legs: { "LEG:1": {} } };

      init.mockReturnValue("init state");
      setup(
        {
          type: NETWORK__INVALID_SESSION,
        },
        bettingState,
        nextSpy,
        dispatchSpy,
      );

      expect(init).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING__SBK_STATE_UPDATE,
        payload: { state: "init state", group: "REAL" },
      });
    });
  });

  describe("when action type is MODULES__SBK_BETTING_LOADED", () => {
    const dispatchSpy = jest.fn();
    const nextSpy = jest.fn();
    updateGroupOptions.mockReturnValue("groupOptionsUpdate");

    describe("when there is a limit", () => {
      it("should dispatch BETTING__SBK_STATE_UPDATE with updated group options with values from that currency", async () => {
        mockThrottleConfig.current = { isActive: true };
        setup(
          {
            type: MODULES__SBK_BETTING_LOADED,
          },
          "sportsbookBettingStateMock",
          nextSpy,
          dispatchSpy,
          { accountId: "onlineUser", currencyCode: "USD" },
        );

        expect(updateGroupOptions).toHaveBeenCalledWith("sportsbookBettingStateMock", {
          maxPayoutLimits: { warning: 25, error: 50 },
        });
        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__SBK_STATE_UPDATE,
          payload: { state: "groupOptionsUpdate", group: "REAL" },
        });
      });
    });

    describe("when there is no limit", () => {
      it("should not dispatch BETTING__SBK_STATE_UPDATE", async () => {
        mockThrottleConfig.current = { isActive: false };

        setup(
          {
            type: MODULES__SBK_BETTING_LOADED,
          },
          "sportsbookBettingStateMock",
          nextSpy,
          dispatchSpy,
          { currencyCode: "USD" },
        );

        expect(updateGroupOptions).toHaveBeenCalledTimes(0);
        expect(dispatchSpy).toHaveBeenCalledTimes(0);
      });
    });

    describe("when the user is offline", () => {
      it("should dispatch BETTING__SBK_STATE_UPDATE with updated group options with default values", async () => {
        mockThrottleConfig.current = { isActive: true };

        setup(
          {
            type: MODULES__SBK_BETTING_LOADED,
          },
          "sportsbookBettingStateMock",
          nextSpy,
          dispatchSpy,
          { currencyCode: "USD" },
        );

        expect(updateGroupOptions).toHaveBeenCalledWith("sportsbookBettingStateMock", {
          maxPayoutLimits: { warning: 25, error: 50 },
        });
        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__SBK_STATE_UPDATE,
          payload: { state: "groupOptionsUpdate", group: "REAL" },
        });
      });
    });

    describe("when the throttle is not active", () => {
      it("should not dispatch BETTING__SBK_STATE_UPDATE", async () => {
        mockThrottleConfig.current = { isActive: false };

        setup(
          {
            type: MODULES__SBK_BETTING_LOADED,
          },
          "sportsbookBettingStateMock",
          nextSpy,
          dispatchSpy,
          { currencyCode: "USD" },
        );

        expect(updateGroupOptions).toHaveBeenCalledTimes(0);
        expect(dispatchSpy).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe("when action type is UI__BETSLIP_SBK_RE_ADD_SELECTIONS_CLICK", () => {
    describe("when the report does not exist", () => {
      it("should ignore the action", async () => {
        const nextSpy = jest.fn();

        getSportsbookReport.mockReturnValue(undefined);
        setup({ type: UI__BETSLIP_SBK_RE_ADD_SELECTIONS_CLICK, payload: {} }, { legs: {} }, nextSpy);

        expect(nextSpy).toHaveBeenCalledWith({
          type: UI__BETSLIP_SBK_RE_ADD_SELECTIONS_CLICK,
          payload: {},
        });
      });
    });

    describe("when the report exists", () => {
      it("should call UI__BETSLIP_SBK_RE_ADD_SELECTIONS_CLICK for each selection group", () => {
        const nextSpy = jest.fn();
        const dispatchSpy = jest.fn();
        const sportsbookReport = {
          result: {
            runners: {
              1: {
                selectionId: "1",
                marketId: "1",
              },
            },
          },
        };

        setupCompleteMocks();

        getSportsbookReport.mockReturnValue(sportsbookReport);
        getBettingResolvers("REAL").getAddSelectionsPayload.mockReturnValue({
          123: {
            selections: [
              { marketUrn: "market:urn", runnerUrn: "runner:urn" },
              { marketUrn: "market:urn:2", runnerUrn: "runner:urn:2" },
            ],
            bettingOpportunityId: "1",
            bettingOpportunityType: "POPULAR",
          },
          SIMPLE: {
            selections: [
              { marketUrn: "market:urn", runnerUrn: "runner:urn" },
              { marketUrn: "market:urn:2", runnerUrn: "runner:urn:2" },
            ],
          },
        });

        setup({ type: UI__BETSLIP_SBK_RE_ADD_SELECTIONS_CLICK, payload: {} }, { legs: {} }, nextSpy, dispatchSpy);

        expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
          type: BETTING__SBK_ADD_SELECTIONS,
          payload: {
            group: "REAL",
            selections: [
              { marketUrn: "market:urn", runnerUrn: "runner:urn" },
              { marketUrn: "market:urn:2", runnerUrn: "runner:urn:2" },
            ],
            bettingOpportunityId: "1",
            bettingOpportunityType: "POPULAR",
          },
        });
        expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
          type: BETTING__SBK_ADD_SELECTIONS,
          payload: {
            group: "REAL",
            bettingOpportunityId: "1",
            bettingOpportunityType: "POPULAR",
            selections: [
              { marketUrn: "market:urn", runnerUrn: "runner:urn" },
              { marketUrn: "market:urn:2", runnerUrn: "runner:urn:2" },
            ],
          },
        });
        expect(dispatchSpy).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("when action type is UI__MY_BETS_SBK_ADD_PREVIOUS_SELECTIONS_CLICK", () => {
    const nextSpy = jest.fn();
    const dispatchSpy = jest.fn();

    it("should dispatch BETTING__SBK_ADD_SELECTIONS with its payload", () => {
      const payload = {
        selections: [
          {
            marketUrn: "marketUrn:1",
            runnerUrn: "runnerUrn:1/1",
          },
        ],
        group: "REAL",
        ensureSelectionsFromStore: false,
      };

      setup({ type: UI__MY_BETS_SBK_ADD_PREVIOUS_SELECTIONS_CLICK, payload }, { legs: {} }, nextSpy, dispatchSpy);

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING__SBK_ADD_SELECTIONS,
        payload: {
          selections: [{ marketUrn: "marketUrn:1", runnerUrn: "runnerUrn:1/1" }],
          group: "REAL",
          ensureSelectionsFromStore: false,
        },
      });
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("when action type is UI__MARKET_SBK_BET_BUTTON_CLICK", () => {
    const nextSpy = jest.fn();
    const dispatchSpy = jest.fn();

    it("should dispatch BETTING__SBK_ADD_SELECTION_TAGGING, with its payload", () => {
      const payload = {
        selections: [
          {
            marketUrn: "marketUrn:1",
            runnerUrn: "runnerUrn:1/1",
          },
        ],
        group: "REAL",
        deeplink: {
          isBetSharing: "true",
        },
      };

      setup({ type: UI__MARKET_SBK_BET_BUTTON_CLICK, payload }, { legs: {} }, nextSpy, dispatchSpy);

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING__SBK_ADD_SELECTION_TAGGING,
        payload: {
          selections: [{ marketUrn: "marketUrn:1", runnerUrn: "runnerUrn:1/1" }],
          group: "REAL",
          deeplink: {
            isBetSharing: "true",
          },
        },
      });
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("when action type is BETTING__SPORTSBOOK_REMOVE_ALL_FREE_BETS_WALLETS_ACTION", () => {
    const nextSpy = jest.fn();
    const dispatchSpy = jest.fn();

    beforeEach(() => {
      clearBonusWallets.mockReturnValue("sportsbookBettingStateMockUPDATED");

      setup(
        { type: BETTING__SPORTSBOOK_REMOVE_ALL_FREE_BETS_WALLETS_ACTION },
        "sportsbookBettingStateMock",
        nextSpy,
        dispatchSpy,
      );
    });

    it("should call clearBonusWallets from betslip core", () => {
      expect(clearBonusWallets).toHaveBeenCalledWith("sportsbookBettingStateMock");
    });

    it("should dispatch BETTING__SBK_STATE_UPDATE, with its payload", () => {
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING__SBK_STATE_UPDATE,
        payload: {
          state: "sportsbookBettingStateMockUPDATED",
          group: "REAL",
        },
      });
    });
  });

  describe("when action type is BETTING__SPORTSBOOK_REMOVE_ALL_COMBINATION_FREE_BETS_WALLETS_ACTION", () => {
    const nextSpy = jest.fn();
    const dispatchSpy = jest.fn();

    beforeEach(() => {
      updateBonusWallets.mockReturnValue("sportsbookBettingStateMockUPDATED");

      setup(
        {
          type: BETTING__SPORTSBOOK_REMOVE_ALL_COMBINATION_FREE_BETS_WALLETS_ACTION,
          payload: { combinationId: "combinationId" },
        },
        "sportsbookBettingStateMock",
        nextSpy,
        dispatchSpy,
      );
    });

    it("should call clearBonusWallets from betslip core", () => {
      expect(updateBonusWallets).toHaveBeenCalledWith("sportsbookBettingStateMock", {
        combinationId: "combinationId",
        selectedWallets: [],
      });
    });

    it("should dispatch BETTING__SBK_STATE_UPDATE, with its payload", () => {
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING__SBK_STATE_UPDATE,
        payload: {
          state: "sportsbookBettingStateMockUPDATED",
          group: "REAL",
        },
      });
    });
  });

  describe("when action type does not match", () => {
    it("should ignore the action", async () => {
      const nextSpy = jest.fn();

      setup({ type: "SOMETHING" }, null, nextSpy);

      expect(nextSpy).toHaveBeenCalledWith({
        type: "SOMETHING",
      });
    });
  });
});
