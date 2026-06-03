import {
  buildBetPlacement,
  buildCustomerReference,
  buildPlacedBetResults,
  buildWalletAllocationType,
} from "@ppb/betslip-core";
import { getEventRegistry } from "eventemitter3-singleton";

import { placeBets, SportsbookTransactionalError } from "../services/sportsbook-bet-service";
import setupSagaMocks from "../saga-jest-setup";
import {
  NETWORK__PLACE_SBK_BET_IN_PROGRESS,
  NETWORK__PLACE_SBK_BET_SUCCESS,
  NETWORK__PLACE_SBK_BET_FAILURE,
  NETWORK__PLACE_SBK_BET_AUTH_FAILURE,
  UI__BETSLIP_SET_COLLAPSE_ACTION,
} from "../actions/betslip";
import {
  BETTING__SBK_PLACE_BETS,
  BETTING__SBK_DEPOSIT_SUCCESSFUL,
  BETTING__DEPOSIT_TO_PLACE_CANCEL,
} from "../actions/betting";
import {
  getBettingResolvers,
  getSportsbookBettingState,
  createQuickBetslipBetPickerSelector,
} from "../state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { refreshWallet } from "./wallet-saga";
import { isHttpUnauthorizedError } from "../helpers/error-parsing";
import { createCustomerRefBuilder } from "../helpers/betting";
import { getBettingTelemetricFacility } from "../helpers/telemetry/betting-telemetry";
import { trace } from "@opentelemetry/api";

const placeResult = {
  placeProps: "placeData",
};

const mockGetPreferencesWithProductSwitcherSelector = jest.fn();

let windowSpy;

beforeEach(() => {
  windowSpy = jest.spyOn(window, "window", "get");
});

afterEach(() => {
  windowSpy.mockRestore();
});

jest.mock("../services/sportsbook-bet-service", () => ({
  placeBets: jest.fn(() => placeResult),
  SportsbookTransactionalError: jest.fn(),
}));

jest.mock("@ppb/betslip-core", () => ({
  buildBetPlacement: jest.fn(),
  buildPlacedBetResults: jest.fn(),
  buildCustomerReference: jest.fn().mockReturnValue("ref"),
  buildWalletAllocationType: jest.fn(),
}));

jest.mock("../state/betting/sportsbook-betting/sportsbook-betting-selectors", () => {
  const quickBetslipBetSelector = jest.fn(() => null);
  return {
    getSportsbookBettingState: jest.fn(),
    getBettingResolvers: jest.fn().mockReturnValue(() => ({
      getMetadata: jest.fn().mockReturnValue("bettingRunnersMetadata"),
    })),
    createQuickBetslipBetPickerSelector: jest.fn(() => quickBetslipBetSelector),
  };
});

jest.mock("../state/entities/user-preferences/user-preferences-selectors", () => ({
  createUserPreferencesWithProductSwitcherSelector: jest.fn(() => mockGetPreferencesWithProductSwitcherSelector),
}));

jest.mock("./wallet-saga", () => ({
  refreshWallet: jest.fn(() => ({})),
}));

jest.mock("../helpers/error-parsing", () => ({
  isHttpUnauthorizedError: jest.fn(() => false),
}));

jest.mock("eventemitter3-singleton", () => {
  const emit = jest.fn();

  return {
    getEventRegistry: jest.fn(() => ({
      emit,
    })),
  };
});

jest.mock("../helpers/betting", () => ({
  createCustomerRefBuilder: jest.fn(() => () => "customerRef mock"),
}));

jest.mock("../helpers/telemetry/betting-telemetry", () => ({
  getBasicSpan: jest.fn().mockReturnValue({
    setAttribute: jest.fn(),
    setAttributes: jest.fn(),
    recordException: jest.fn(),
    setStatus: jest.fn(),
    end: jest.fn(),
  }),
  getBettingTelemetricFacility: jest.fn().mockReturnValue({
    recordOperationalException: jest.fn(),
    recordAuthException: jest.fn(),
    recordTechnicalException: jest.fn(),
  }),
}));

jest.mock("@opentelemetry/api", () => {
  const originalModule = jest.requireActual("@opentelemetry/api");

  return {
    ...originalModule,
    trace: {
      getTracer: jest.fn().mockReturnValue({
        startSpan: jest.fn().mockReturnValue({
          end: jest.fn(),
          setAttribute: jest.fn(),
          setAttributes: jest.fn(),
          recordException: jest.fn(),
        }),
      }),
    },
  };
});

function setup() {
  let saga;
  jest.isolateModules(() => {
    ({ placeSportsbookBetsSaga: saga } = require("./sportsbook-betting-transactional-saga"));
  });

  return setupSagaMocks(saga);
}

describe("sportsbookBettingTransactionalSaga", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    placeBets.mockResolvedValue(placeResult);
  });

  describe("BETTING__SBK_PLACE_BETS", () => {
    async function setupPlaceSaga({ sportsbookBetting }) {
      const getBettingRunnersMetadata = jest.fn().mockReturnValue("bettingRunnersMetadata");

      getBettingResolvers.mockReturnValue({ getMetadata: getBettingRunnersMetadata });

      const sagaSetup = setup();

      sagaSetup.getState.mockReturnValue({ entities: { throttles: {} }, result: "sportbookReporResult" });

      getSportsbookBettingState.mockReturnValue(sportsbookBetting);
      mockGetPreferencesWithProductSwitcherSelector.mockReturnValue({ oddsMovement: "oddsMovement" });
      buildBetPlacement.mockReturnValue({ definitions: [{ betNo: 0 }], combinations: [{ betNo: 0, id: "COMB:ID" }] });
      buildPlacedBetResults.mockReturnValue("placedBetResults");
      buildWalletAllocationType.mockReturnValue("mockBuildWalletAllocationType");

      await sagaSetup.putActions([
        {
          type: BETTING__SBK_PLACE_BETS,
        },
      ]);
      return sagaSetup;
    }

    it("should build bet definitions for placement", async () => {
      const { stopSaga } = await setupPlaceSaga({ sportsbookBetting: "sportsbookBettingState" });

      expect(buildBetPlacement).toHaveBeenCalledWith("sportsbookBettingState", false);
      expect(buildBetPlacement).toHaveBeenCalledTimes(1);

      stopSaga();
    });

    it("should put NETWORK__PLACE_SBK_BET_IN_PROGRESS", async () => {
      const { stopSaga, dispatch } = await setupPlaceSaga({
        sportsbookBetting: "sportsbookBettingState",
      });

      expect(dispatch).toHaveBeenCalledWith({
        type: NETWORK__PLACE_SBK_BET_IN_PROGRESS,
      });

      stopSaga();
    });

    it("should place bets", async () => {
      const customerRefBuilderSpy = jest.fn(() => "customerRef mock");
      createCustomerRefBuilder.mockReturnValueOnce(customerRefBuilderSpy);
      const { stopSaga } = await setupPlaceSaga({
        sportsbookBetting: { isBonusSelected: "useAvailableBonus" },
      });

      expect(placeBets).toHaveBeenCalledWith(
        { definitions: [{ betNo: 0 }], combinations: [{ betNo: 0, id: "COMB:ID" }] },
        {
          acceptLowerOdds: "oddsMovement",
          useAvailableBonus: "useAvailableBonus",
          dryRun: false,
          customerRef: "customerRef mock",
          walletAllocationType: "mockBuildWalletAllocationType",
        },
      );
      expect(placeBets).toHaveBeenCalledTimes(1);
      expect(customerRefBuilderSpy).toHaveBeenCalledTimes(1);

      stopSaga();
    });

    it("should record telemetry", async () => {
      const customerRefBuilderSpy = jest.fn(() => "customerRef mock");
      createCustomerRefBuilder.mockReturnValueOnce(customerRefBuilderSpy);
      const { stopSaga } = await setupPlaceSaga({
        sportsbookBetting: { isBonusSelected: "useAvailableBonus" },
      });

      const tracer = trace.getTracer();
      const span = tracer.startSpan.mock.results[0].value;

      expect(span.setAttributes).toHaveBeenCalledWith({
        "betting.placeBet.acceptLowerOdds": "oddsMovement",
        "betting.placeBet.customerRef": "customerRef mock",
      });
      expect(span.setAttributes).toHaveBeenCalledWith({
        "betting.placeBet.receiptId": "",
        "betting.placeBet.success": true,
      });

      stopSaga();
    });

    it("should call buildWalletAllocationType and use it to place bet", async () => {
      const mockWallets = "mockWallets";
      const { stopSaga } = await setupPlaceSaga({
        sportsbookBetting: { wallets: mockWallets },
      });

      expect(placeBets).toHaveBeenCalledWith(
        { definitions: [{ betNo: 0 }], combinations: [{ betNo: 0, id: "COMB:ID" }] },
        {
          acceptLowerOdds: "oddsMovement",
          dryRun: false,
          customerRef: "customerRef mock",
          walletAllocationType: "mockBuildWalletAllocationType",
        },
      );
      expect(buildWalletAllocationType).toHaveBeenCalledWith(mockWallets);
      expect(buildWalletAllocationType).toHaveBeenCalledTimes(1);

      stopSaga();
    });

    describe("when placeBets fails with a non HTTP unauthorized error", () => {
      it("should record operation exception", async () => {
        const thrownError = new SportsbookTransactionalError({ definitions: "definitions", operation: "operation" });
        placeBets.mockRejectedValue(thrownError);

        const { stopSaga, dispatch } = await setupPlaceSaga({
          sportsbookBetting: "sportsbookBettingState",
        });

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__PLACE_SBK_BET_FAILURE,
          payload: {
            error: thrownError,
            isTechnical: false,
          },
        });
        expect(getBettingTelemetricFacility().recordOperationalException).toHaveBeenCalledWith(thrownError);

        stopSaga();
      });

      it("should keep the betslip collapsed when the failed bet is eligible for the quick betslip view", async () => {
        const thrownError = new SportsbookTransactionalError({ definitions: "definitions", operation: "operation" });
        placeBets.mockRejectedValue(thrownError);
        createQuickBetslipBetPickerSelector().mockReturnValueOnce({ status: "valid", combinationId: "COMB:ID" });

        const { stopSaga, dispatch } = await setupPlaceSaga({
          sportsbookBetting: "sportsbookBettingState",
        });

        expect(dispatch).toHaveBeenCalledWith({
          type: UI__BETSLIP_SET_COLLAPSE_ACTION,
          payload: { collapse: true },
        });

        stopSaga();
      });

      it("should not force the betslip collapsed when the failed bet is not eligible for the quick betslip view", async () => {
        const thrownError = new SportsbookTransactionalError({ definitions: "definitions", operation: "operation" });
        placeBets.mockRejectedValue(thrownError);
        createQuickBetslipBetPickerSelector().mockReturnValueOnce(null);

        const { stopSaga, dispatch } = await setupPlaceSaga({
          sportsbookBetting: "sportsbookBettingState",
        });

        expect(dispatch).not.toHaveBeenCalledWith({
          type: UI__BETSLIP_SET_COLLAPSE_ACTION,
          payload: { collapse: true },
        });

        stopSaga();
      });
    });

    describe("when placeBets fails with a HTTP unauthorized error", () => {
      it("should dispatch NETWORK__PLACE_SBK_BET_AUTH_FAILURE", async () => {
        const thrownError = new Error("some error");

        placeBets.mockRejectedValue(thrownError);
        isHttpUnauthorizedError.mockReturnValueOnce(true);

        const { stopSaga, dispatch } = await setupPlaceSaga({
          sportsbookBetting: "sportsbookBettingState",
        });

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__PLACE_SBK_BET_AUTH_FAILURE,
        });
        expect(getBettingTelemetricFacility().recordAuthException).toHaveBeenCalledWith(thrownError);

        stopSaga();
      });
    });

    describe("when the generator fails", () => {
      it("should dispatch FAILURE with a tech failure", async () => {
        placeBets.mockRejectedValue("some error");

        const { stopSaga, dispatch } = await setupPlaceSaga({
          sportsbookBetting: "sportsbookBettingState",
        });

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__PLACE_SBK_BET_FAILURE,
          payload: {
            error: "some error",
            isTechnical: true,
          },
        });
        expect(getBettingTelemetricFacility().recordTechnicalException).toHaveBeenCalledWith("some error");

        stopSaga();
      });
    });

    describe("when placeBets succeeds", () => {
      it("should emit a SUCCESS event without payload", async () => {
        const { stopSaga } = await setupPlaceSaga({
          sportsbookBetting: { isBonusSelected: "isBonusSelected" },
        });

        expect(getEventRegistry().emit).toHaveBeenCalledWith("@@THE_BRIDGE/SBK_BET_PLACED", null);

        stopSaga();
      });

      it("should dispatch SUCCESS with metadata and result", async () => {
        const { dispatch, stopSaga } = await setupPlaceSaga({
          sportsbookBetting: { isBonusSelected: "isBonusSelected" },
        });

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__PLACE_SBK_BET_SUCCESS,
          payload: {
            report: {
              metadata: "bettingRunnersMetadata",
              isFreeBetsSelected: "isBonusSelected",
              result: "placedBetResults",
            },
          },
        });

        stopSaga();
      });

      it("should call buildPlacedBetResults", async () => {
        const { stopSaga } = await setupPlaceSaga({
          sportsbookBetting: "sportsbookBettingState",
        });

        expect(buildPlacedBetResults).toHaveBeenCalledWith("sportsbookBettingState", [], {
          definitions: [{ betNo: 0 }],
          combinations: [{ betNo: 0, id: "COMB:ID" }],
        });
        expect(buildPlacedBetResults).toHaveBeenCalledTimes(1);

        stopSaga();
      });
    });
  });

  describe("BETTING__SBK_DEPOSIT_SUCCESSFUL", () => {
    async function setupDepositSuccessfulSaga() {
      const sagaSetup = setup();

      await sagaSetup.putActions([
        {
          type: BETTING__SBK_DEPOSIT_SUCCESSFUL,
        },
      ]);
      return sagaSetup;
    }

    it("should call refreshWallet", async () => {
      const { stopSaga } = await setupDepositSuccessfulSaga();

      expect(refreshWallet).toHaveBeenCalledWith();
      expect(refreshWallet).toHaveBeenCalledTimes(1);

      stopSaga();
    });

    describe("when failure is returned from refreshWallet", () => {
      it("should put BETTING__DEPOSIT_TO_PLACE_CANCEL", async () => {
        refreshWallet.mockReturnValueOnce({ failure: "oops" });
        const { stopSaga, dispatch } = await setupDepositSuccessfulSaga();

        expect(dispatch).toHaveBeenCalledWith({
          type: BETTING__DEPOSIT_TO_PLACE_CANCEL,
        });

        stopSaga();
      });

      it("should not put BETTING__SBK_PLACE_BETS", async () => {
        refreshWallet.mockReturnValueOnce({ failure: "oops" });
        const { stopSaga, dispatch } = await setupDepositSuccessfulSaga();

        expect(dispatch).not.toHaveBeenCalledWith({
          type: BETTING__SBK_PLACE_BETS,
        });

        stopSaga();
      });
    });

    describe("when success is returned from refreshWallet", () => {
      it("should put BETTING__SBK_PLACE_BETS", async () => {
        refreshWallet.mockReturnValueOnce({ success: "yay" });
        const { stopSaga, dispatch } = await setupDepositSuccessfulSaga();

        expect(dispatch).toHaveBeenCalledWith({
          type: BETTING__SBK_PLACE_BETS,
        });

        stopSaga();
      });
    });
  });
});
