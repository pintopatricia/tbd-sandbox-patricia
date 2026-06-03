import edit, { ETXMethod } from "@ppb/etx-edit-orchestrator/src/edit";
import { calc } from "@ppb/bet-engine";
import { implyBet, placeBet, updateBet, cancelBet, replaceBet } from "../services/exchange-bet-service";
import {
  mapPlaceExecutionToInstructionReport,
  mapCancelExecutionToInstructionReport,
  mapUpdateExecutionToInstructionReport,
  mapReplaceExecutionToInstructionReport,
} from "../services/exchange-bet-service-mapper";
import { getPlaceBetData } from "./exchange-betting-saga-selectors";
import { getUnmatchedBets } from "../state/betting/exchange-betting/exchange-betting-selectors";
import { getExchangeRunnerTree } from "../state/entities/entities-selectors";
import setupSagaMocks from "../saga-jest-setup";
import {
  NETWORK__PLACE_EXC_BET_IN_PROGRESS,
  NETWORK__PLACE_EXC_BET_FAILURE,
  NETWORK__PLACE_EXC_BET_SUCCESS,
  NETWORK__CANCEL_EXC_BET_IN_PROGRESS,
  NETWORK__CANCEL_EXC_BET_SUCCESS,
  NETWORK__CANCEL_EXC_BET_FAILURE,
  NETWORK__UPDATE_EXC_BET_IN_PROGRESS,
  NETWORK__UPDATE_EXC_BET_SUCCESS,
  NETWORK__UPDATE_EXC_BET_FAILURE,
  NETWORK__IMPLY_EXC_BET_IN_PROGRESS,
  NETWORK__IMPLY_EXC_BET_SUCCESS,
  NETWORK__IMPLY_EXC_BET_FAILURE,
  NETWORK__IMPLY_EXC_BET_AUTH_FAILURE,
  NETWORK__PLACE_EXC_BET_AUTH_FAILURE,
} from "../actions/betslip";
import {
  BETTING__EXC_PLACE_BETS,
  BETTING__EXC_UNMATCHED_UPDATE,
  BETTING__EXC_PLACE_DEPOSIT_SUCCESSFUL,
  BETTING__EXC_EDIT_DEPOSIT_SUCCESSFUL,
  BETTING__DEPOSIT_TO_PLACE_CANCEL,
} from "../actions/betting";
import { getExchangeOrder } from "../state/betting/exchange-orders/exchange-order-selectors";
import { getEditingBetState, getIsFreeBetsSelected } from "../state/betslip/betslip-card-selectors";
import { SUBSCRIBE_EXCHANGE_MARKET_UPDATES } from "../actions/exchange-markets";
import { calculateUsedBonus, calculateBonusLeft } from "../helpers/free-bets";
import { createExchangeMarketSelector } from "../state/entities/exchange-markets/exchange-market-selectors";
import {
  NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_FAILURE,
  NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_SUCCESS,
  NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BETS_FAILURE,
  NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BETS_IN_PROGRESS,
  NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BET_SUCCESS,
} from "../actions/my-bets";
import { FETCH_CARDS } from "../actions/catalogue";

import { refreshWallet } from "./wallet-saga";
import { isHttpUnauthorizedError } from "../helpers/error-parsing";
import { ExchangeSide } from "../state/constants";

jest.mock("@ppb/bet-engine", () => ({
  __esModule: true,
  calc: {
    profit: jest.fn(() => 1337),
    liability: jest.fn(() => 999),
    payout: jest.fn(() => 100),
  },
}));

jest.mock("../helpers/error-parsing", () => ({
  isHttpUnauthorizedError: jest.fn(() => false),
}));

const placeExecutionReport = {
  placeProps: "placeData",
  instructionReports: [
    {
      betId: "betId 1",
    },
    {
      betId: "betId 2",
    },
  ],
};

const updateExecutionReport = {
  updateProps: "updateData",
};

const cancelExecutionReport = {
  cancelProps: "cancelData",
};

const replaceExecutionReport = {
  replaceProps: "replaceData",
};

const implyExecutionReport = {
  implyProps: "implyData",
  marketId: "some marketId",
};

jest.mock("../services/exchange-bet-service", () => ({
  placeBet: jest.fn(() => placeExecutionReport),
  updateBet: jest.fn(() => updateExecutionReport),
  cancelBet: jest.fn(() => cancelExecutionReport),
  replaceBet: jest.fn(() => replaceExecutionReport),
  implyBet: jest.fn(() => implyExecutionReport),
}));

jest.mock("../services/exchange-bet-service-mapper", () => ({
  mapPlaceExecutionToInstructionReport: jest.fn(),
  mapCancelExecutionToInstructionReport: jest.fn(),
  mapUpdateExecutionToInstructionReport: jest.fn(),
  mapReplaceExecutionToInstructionReport: jest.fn(),
}));

jest.mock("./exchange-betting-saga-selectors", () => ({
  getPlaceBetData: jest.fn(),
}));

jest.mock("../state/entities/entities-selectors", () => ({
  getExchangeRunnerTree: jest.fn(),
}));

jest.mock("../state/betting/exchange-betting/exchange-betting-selectors", () => ({
  getUnmatchedBets: jest.fn(),
}));

jest.mock("../state/betting/exchange-orders/exchange-order-selectors", () => ({
  getExchangeOrder: jest.fn(),
}));

jest.mock("../state/betslip/betslip-card-selectors", () => ({
  getEditingBetState: jest.fn(),
  getIsFreeBetsSelected: jest.fn(),
}));

jest.mock("../helpers/free-bets", () => ({
  calculateUsedBonus: jest.fn(),
  calculateEligibleBonus: jest.fn(),
  calculateBonusLeft: jest.fn(),
}));

jest.mock("@ppb/etx-edit-orchestrator/src/edit", () => ({
  __esModule: true,
  default: jest.fn(),
  ETXMethod: {
    Place: "place",
    Replace: "replace",
    Cancel: "cancel",
    Update: "update",
  },
}));

jest.mock("../state/entities/exchange-markets/exchange-market-selectors", () => ({
  createExchangeMarketSelector: jest.fn(() => jest.fn()),
}));

jest.mock("./wallet-saga", () => ({
  refreshWallet: jest.fn(() => ({})),
}));

function setup() {
  let saga;
  jest.isolateModules(() => {
    ({ exchangeBettingSaga: saga } = require("./exchange-betting-saga"));
  });
  return setupSagaMocks(saga);
}

const stateMock = {
  entities: {
    exchangemarkets: {},
  },
};
const placeBetDataMock = {
  marketId: "some marketId",
  selectionId: 123,
  handicap: 0,
  side: ExchangeSide.BACK,
  orderType: "LIMIT",
  limitOrder: {
    price: 1.01,
    size: 2,
    persistenceType: "LAPSE",
  },
  urn: "place-bet-data:urn",
};
const runnerTreeMock = {
  runner: {
    urn: "runner:urn",
  },
  market: {
    marketId: "1.111",
    urn: "market:urn",
    type: "some market type",
    bettingType: "some betting type",
  },
};
const exchangeOrderMock = {
  side: ExchangeSide.BACK,
  price: 1.01,
  size: 3,
  sizeRemaining: 2,
  betId: "betId",
  marketId: "some marketId",
  selectionId: "some selectionId",
  handicap: "some handicap",
  orderType: "some orderType",
  persistenceType: "some persistenceType",
};
const editStateMock = {
  price: 10,
  size: 20,
  persistenceType: "some newPersistenceType",
};
const exchangeMarketMock = {
  marketType: "some marketType",
  bettingType: "some bettingType",
};
const placeBetMock = {
  mock: "some report",
};
const cancelBetMock = {
  mock: "some report",
};
const betButtonClickMock = {
  marketId: "some marketId",
};

describe("exchangeBettingSaga", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(global.console, "warn").mockReturnValue("mocked!");

    placeBet.mockResolvedValue(placeExecutionReport);
    updateBet.mockResolvedValue(updateExecutionReport);
    cancelBet.mockResolvedValue(cancelExecutionReport);
    replaceBet.mockResolvedValue(replaceExecutionReport);
    implyBet.mockResolvedValue(implyExecutionReport);
  });

  describe("UI__MARKET_EXC_BET_BUTTON_CLICK", () => {
    async function setupImplySaga(betButtonClick = betButtonClickMock) {
      const sagaSetup = setup();
      sagaSetup.getState.mockReturnValue(stateMock);

      await sagaSetup.putActions([
        {
          type: "UI/MARKET_EXC_BET_BUTTON_CLICK",
          payload: {
            marketId: betButtonClick.marketId,
          },
        },
      ]);
      return sagaSetup;
    }

    describe("when there is no market id", () => {
      it("should not dispatch any action", async () => {
        const { stopSaga, dispatch } = await setupImplySaga({ marketId: undefined });

        expect(dispatch).not.toHaveBeenCalled();

        stopSaga();
      });
    });

    describe("when marketId is defined", () => {
      it("should put NETWORK__IMPLY_EXC_BET_IN_PROGRESS", async () => {
        const { stopSaga, dispatch } = await setupImplySaga();

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__IMPLY_EXC_BET_IN_PROGRESS,
        });

        stopSaga();
      });

      it("should call the implyBet", async () => {
        const { stopSaga } = await setupImplySaga();

        expect(implyBet).toHaveBeenCalledWith("some marketId");
        expect(implyBet).toHaveBeenCalledTimes(1);

        stopSaga();
      });

      describe("when implyBet fails with a non HTTP unauthorized error", () => {
        it("should dispatch FAILURE with error", async () => {
          implyBet.mockRejectedValue("some error");

          const { stopSaga, dispatch } = await setupImplySaga();

          expect(dispatch).toHaveBeenCalledWith({
            type: NETWORK__IMPLY_EXC_BET_FAILURE,
            payload: {
              error: "some error",
            },
          });

          stopSaga();
        });
      });

      describe("when placeBet fails with a HTTP unauthorized error", () => {
        it("should dispatch NETWORK__IMPLY_EXC_BET_AUTH_FAILURE", async () => {
          isHttpUnauthorizedError.mockReturnValueOnce(true);
          const errorMock = new Error("HTTP unauthorized error");
          implyBet.mockImplementation(() => {
            throw errorMock;
          });

          const { stopSaga, dispatch } = await setupImplySaga();

          expect(dispatch).toHaveBeenCalledWith({
            type: NETWORK__IMPLY_EXC_BET_AUTH_FAILURE,
          });

          stopSaga();
        });
      });

      describe("when implyBet succeeds", () => {
        it("should dispatch SUCCESS with the report", async () => {
          const { dispatch, stopSaga, hasDispatchedAction } = await setupImplySaga();
          await hasDispatchedAction(NETWORK__IMPLY_EXC_BET_SUCCESS);

          expect(dispatch).toHaveBeenCalledWith({
            type: NETWORK__IMPLY_EXC_BET_SUCCESS,
            payload: {
              ...implyExecutionReport,
            },
          });

          stopSaga();
        });
      });

      describe("when the marketId that implyBet returns doesn't match the requested", () => {
        it("should not dispatch any action", async () => {
          implyBet.mockResolvedValue({
            implyProps: "implyData",
            marketId: "other marketId",
          });

          const { stopSaga, dispatch } = await setupImplySaga();

          expect(implyBet).toHaveBeenCalledWith("some marketId");
          expect(implyBet).toHaveBeenCalledTimes(1);
          expect(dispatch).not.toHaveBeenCalledWith({
            type: NETWORK__IMPLY_EXC_BET_SUCCESS,
            payload: {
              ...implyExecutionReport,
            },
          });

          stopSaga();
        });
      });
    });
  });

  describe("BETTING__EXC_PLACE_BETS", () => {
    async function setupPlaceSaga(confirmFirst = false, runnerTree = runnerTreeMock) {
      const sagaSetup = setup();
      sagaSetup.getState.mockReturnValue(stateMock);
      getExchangeRunnerTree.mockReturnValue(runnerTree);
      await sagaSetup.putActions([
        {
          type: "BETTING/EXC_PLACE_BETS",
          payload: {
            runner: "runner:urn",
            confirmFirst,
          },
        },
      ]);
      return sagaSetup;
    }

    describe("when there is no runner tree", () => {
      it("should not dispatch any action", async () => {
        const { stopSaga, dispatch } = await setupPlaceSaga(false, undefined);

        expect(dispatch).not.toHaveBeenCalled();

        stopSaga();
      });
    });

    describe("when confirmFirst is true", () => {
      it("should not build bet data for placement", async () => {
        const { stopSaga } = await setupPlaceSaga(true);

        expect(getPlaceBetData).not.toHaveBeenCalled();

        stopSaga();
      });
      it("should not place bet", async () => {
        const { stopSaga, dispatch } = await setupPlaceSaga(true);

        expect(placeBet).not.toHaveBeenCalled();
        expect(dispatch).not.toHaveBeenCalled();

        stopSaga();
      });
    });

    describe("when confirmFirst is false", () => {
      it("should build bet data for placement", async () => {
        const { stopSaga } = await setupPlaceSaga(false);

        expect(getPlaceBetData).toHaveBeenCalledWith(stateMock, "runner:urn");
        expect(getPlaceBetData).toHaveBeenCalledTimes(1);

        stopSaga();
      });

      it("should put NETWORK__PLACE_EXC_BET_IN_PROGRESS", async () => {
        getPlaceBetData.mockReturnValue(placeBetDataMock);
        mapPlaceExecutionToInstructionReport.mockReturnValue(placeBetMock);

        const { stopSaga, dispatch } = await setupPlaceSaga(false);

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__PLACE_EXC_BET_IN_PROGRESS,
        });

        stopSaga();
      });

      it("should place bet", async () => {
        getPlaceBetData.mockReturnValue(placeBetDataMock);
        mapPlaceExecutionToInstructionReport.mockResolvedValue(placeBetMock);
        getIsFreeBetsSelected.mockReturnValue(false);

        const { stopSaga } = await setupPlaceSaga(false);

        expect(placeBet).toHaveBeenCalledWith(
          {
            side: ExchangeSide.BACK,
            selectionId: 123,
            handicap: 0,
            orderType: "LIMIT",
            limitOrder: {
              price: 1.01,
              size: 2,
              persistenceType: "LAPSE",
            },
          },
          "some marketId",
          {
            price: 1.01,
            size: 2,
          },
          {
            useAvailableBonus: false,
          },
        );
        expect(placeBet).toHaveBeenCalledTimes(1);

        expect(mapPlaceExecutionToInstructionReport).toHaveBeenCalledWith(placeExecutionReport);
        expect(mapPlaceExecutionToInstructionReport).toHaveBeenCalledTimes(1);
        stopSaga();
      });

      describe("when placeBet fails with a non HTTP unauthorized error", () => {
        it("should dispatch FAILURE with error", async () => {
          getPlaceBetData.mockReturnValue(placeBetDataMock);
          placeBet.mockRejectedValue("some error");

          const { stopSaga, dispatch } = await setupPlaceSaga(false);

          expect(dispatch).toHaveBeenCalledWith({
            type: NETWORK__PLACE_EXC_BET_FAILURE,
            payload: {
              error: "some error",
              side: ExchangeSide.BACK,
            },
          });

          stopSaga();
        });
      });

      describe("when placeBet fails with a HTTP unauthorized error", () => {
        it("should dispatch NETWORK__PLACE_EXC_BET_AUTH_FAILURE", async () => {
          getPlaceBetData.mockReturnValue(placeBetDataMock);

          isHttpUnauthorizedError.mockReturnValueOnce(true);
          const errorMock = new Error("HTTP unauthorized error");
          placeBet.mockImplementation(() => {
            throw errorMock;
          });

          const { stopSaga, dispatch } = await setupPlaceSaga(false);

          expect(dispatch).toHaveBeenCalledWith({
            type: NETWORK__PLACE_EXC_BET_AUTH_FAILURE,
          });

          stopSaga();
        });
      });

      describe("when placeBet succeeds", () => {
        let dispatch;
        let stopSaga;
        let hasDispatchedAction;

        beforeEach(async () => {
          getPlaceBetData.mockReturnValue(placeBetDataMock);
          mapPlaceExecutionToInstructionReport.mockReturnValue({
            side: ExchangeSide.BACK,
            matched: {
              size: 10,
              price: 5,
            },
            unmatched: {
              size: 10,
              price: 5,
            },
            betIds: ["betIdmatched", "betIdunmatched"],
            availableBonus: 10,
          });
          getIsFreeBetsSelected.mockReturnValue(true);
          calculateUsedBonus.mockReturnValue(5);

          ({ dispatch, stopSaga, hasDispatchedAction } = await setupPlaceSaga(false));

          await hasDispatchedAction(NETWORK__PLACE_EXC_BET_SUCCESS);
        });

        afterEach(() => {
          stopSaga();
        });

        it("should dispatch SUBSCRIBE_EXCHANGE_MARKET_UPDATES", async () => {
          expect(dispatch).toHaveBeenCalledWith({
            type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
            payload: {
              marketId: "some marketId",
            },
          });
        });

        it("should dispatch SUCCESS with metadata and report", async () => {
          expect(calc.profit).toHaveBeenCalledWith(ExchangeSide.BACK, 10, 5, "some betting type", "some market type");
          expect(calc.liability).toHaveBeenCalledWith(
            ExchangeSide.BACK,
            10,
            5,
            "some betting type",
            "some market type",
          );
          expect(calc.liability).toHaveBeenCalledWith(
            ExchangeSide.BACK,
            10,
            5,
            "some betting type",
            "some market type",
            { bonus: 10 },
          );

          expect(calculateBonusLeft).toHaveBeenCalledWith(5, 10);

          expect(dispatch).toHaveBeenCalledWith({
            type: NETWORK__PLACE_EXC_BET_SUCCESS,
            payload: {
              betId: "betId 1",
              report: {
                betIds: ["betIdmatched", "betIdunmatched"],
                metadata: {
                  runnerTree: runnerTreeMock,
                },
                runner: "place-bet-data:urn",
                side: ExchangeSide.BACK,
                matched: {
                  size: 10,
                  price: 5,
                  liability: 999,
                  profit: 1337,
                  totalBonusUsed: 5,
                },
                unmatched: {
                  size: 10,
                  price: 5,
                  liability: 999,
                  profit: 1337,
                  totalBonusUsed: 5,
                },
                availableBonus: 10,
              },
            },
          });
        });
      });
    });
  });

  describe("UI__BETSLIP_EXC_CONFIRM_BET_CLICK", () => {
    async function setupConfirmSaga(runnerTree = runnerTreeMock) {
      const sagaSetup = setup();
      sagaSetup.getState.mockReturnValue(stateMock);
      getExchangeRunnerTree.mockReturnValue(runnerTree);
      await sagaSetup.putActions([
        {
          type: "UI/BETSLIP_EXC_CONFIRM_BET_CLICK",
          payload: {
            runner: "runner:urn",
          },
        },
      ]);
      return sagaSetup;
    }

    it("should build bet data for placement", async () => {
      const { stopSaga } = await setupConfirmSaga();

      expect(getPlaceBetData).toHaveBeenCalledWith(stateMock, "runner:urn");
      expect(getPlaceBetData).toHaveBeenCalledTimes(1);

      stopSaga();
    });

    it("should put NETWORK__PLACE_EXC_BET_IN_PROGRESS", async () => {
      getPlaceBetData.mockReturnValue(placeBetDataMock);
      mapPlaceExecutionToInstructionReport.mockReturnValue(placeBetMock);

      const { stopSaga, dispatch } = await setupConfirmSaga();

      expect(dispatch).toHaveBeenCalledWith({
        type: NETWORK__PLACE_EXC_BET_IN_PROGRESS,
      });

      stopSaga();
    });

    it("should place bet", async () => {
      getPlaceBetData.mockReturnValue(placeBetDataMock);
      mapPlaceExecutionToInstructionReport.mockReturnValue(placeBetMock);
      getIsFreeBetsSelected.mockReturnValue(false);

      const { stopSaga } = await setupConfirmSaga();

      expect(placeBet).toHaveBeenCalledWith(
        {
          side: ExchangeSide.BACK,
          selectionId: 123,
          handicap: 0,
          orderType: "LIMIT",
          limitOrder: {
            price: 1.01,
            size: 2,
            persistenceType: "LAPSE",
          },
        },
        "some marketId",
        {
          price: 1.01,
          size: 2,
        },
        { useAvailableBonus: false },
      );
      expect(placeBet).toHaveBeenCalledTimes(1);

      expect(mapPlaceExecutionToInstructionReport).toHaveBeenCalledWith(placeExecutionReport);
      expect(mapPlaceExecutionToInstructionReport).toHaveBeenCalledTimes(1);

      stopSaga();
    });

    describe("when placeBet fails", () => {
      it("should dispatch FAILURE error", async () => {
        getPlaceBetData.mockReturnValue(placeBetDataMock);
        placeBet.mockRejectedValue("some error");

        const { stopSaga, dispatch } = await setupConfirmSaga();

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__PLACE_EXC_BET_FAILURE,
          payload: {
            error: "some error",
            side: ExchangeSide.BACK,
          },
        });

        stopSaga();
      });
    });

    describe("when placeBet succeeds", () => {
      it("should dispatch SUCCESS with metadata and report", async () => {
        getPlaceBetData.mockReturnValue(placeBetDataMock);
        mapPlaceExecutionToInstructionReport.mockReturnValue(placeBetMock);

        const { stopSaga, dispatch } = await setupConfirmSaga();

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__PLACE_EXC_BET_SUCCESS,
          payload: {
            betId: "betId 1",
            report: {
              metadata: {
                runnerTree: runnerTreeMock,
              },
              mock: "some report",
              runner: "place-bet-data:urn",
            },
          },
        });

        stopSaga();
      });
    });
  });

  describe("BETTING__EXC_UNMATCHED_UPDATE", () => {
    const getExchangeMarket = jest.fn(() => exchangeMarketMock);

    async function setupUpdateSaga({ updateImplMock, placeImplMock, cancelImplMock, replaceImplMock }) {
      const sagaSetup = setup();
      sagaSetup.getState.mockReturnValue(stateMock);
      getExchangeOrder.mockReturnValue(exchangeOrderMock);
      getEditingBetState.mockReturnValue(editStateMock);
      createExchangeMarketSelector.mockReturnValue(getExchangeMarket);

      getExchangeRunnerTree.mockReturnValue(runnerTreeMock);
      getUnmatchedBets.mockReturnValue([{ unmatchedBetProps: "unmatchedBetData" }]);

      mapUpdateExecutionToInstructionReport.mockImplementation(updateImplMock);
      mapPlaceExecutionToInstructionReport.mockImplementation(placeImplMock);
      mapCancelExecutionToInstructionReport.mockImplementation(cancelImplMock);
      mapReplaceExecutionToInstructionReport.mockImplementation(replaceImplMock);

      calculateUsedBonus.mockReturnValue(0);

      await sagaSetup.putActions([
        {
          type: "BETTING/EXC_UNMATCHED_UPDATE",
          payload: {
            market: "urn:market",
            betId: "betId",
            runner: "runner:urn",
            betOriginURL: "http://localhost/",
          },
        },
      ]);

      return sagaSetup;
    }

    it("should build bet data for update using exchange order, editing state and exchange market", async () => {
      const { stopSaga } = await setupUpdateSaga({
        placeMock: () => placeBetMock,
      });

      expect(getExchangeOrder).toHaveBeenCalledWith(stateMock, "urn:market", "betId");
      expect(getExchangeOrder).toHaveBeenCalledTimes(1);

      expect(getEditingBetState).toHaveBeenCalledWith(stateMock, "urn:market");
      expect(getEditingBetState).toHaveBeenCalledTimes(1);

      expect(getExchangeMarket).toHaveBeenCalledWith(stateMock.entities.exchangemarkets, "urn:market");
      expect(getExchangeMarket).toHaveBeenCalledTimes(1);

      stopSaga();
    });

    it("should put NETWORK__UPDATE_EXC_BET_IN_PROGRESS", async () => {
      const { stopSaga, dispatch } = await setupUpdateSaga({
        placeImplMock: () => placeBetMock,
      });

      expect(dispatch).toHaveBeenCalledWith({
        type: NETWORK__UPDATE_EXC_BET_IN_PROGRESS,
      });

      stopSaga();
    });

    it("should delegate to edit orchestrator", async () => {
      edit.mockReturnValue({
        instruction: {
          betId: "betId",
          newPersistenceType: "LAPSE",
        },
        method: ETXMethod.Update,
      });

      const { stopSaga } = await setupUpdateSaga({
        placeImplMock: () => placeBetMock,
      });

      expect(edit).toHaveBeenCalledWith(
        expect.objectContaining({
          betId: "betId",
          selectionId: "some selectionId",
          orderType: "some orderType",
          side: ExchangeSide.BACK,
          handicap: "some handicap",
          limitOrder: {
            persistenceType: "some newPersistenceType",
            size: 20,
            price: 10,
          },
        }),
        {
          limitOrder: {
            persistenceType: "some persistenceType",
            size: 2,
            price: 1.01,
          },
          betId: "betId",
          selectionId: "some selectionId",
          orderType: "some orderType",
          side: ExchangeSide.BACK,
          handicap: "some handicap",
        },
      );
      expect(edit).toHaveBeenCalledTimes(1);

      stopSaga();
    });

    describe("when instruction is Update", () => {
      async function setupUpdateInstruction() {
        edit.mockReturnValue({
          instruction: {
            updateInstructionProps: "updateInstructionData",
          },
          method: ETXMethod.Update,
        });

        return setupUpdateSaga({
          updateImplMock: () => ({
            side: ExchangeSide.BACK,
            unmatched: {
              size: 10,
              price: 5,
            },
            betIds: ["betIdunmatched"],
          }),
        });
      }

      it("should call updateBet", async () => {
        const { stopSaga } = await setupUpdateInstruction();

        expect(updateBet).toHaveBeenCalledWith(
          {
            updateInstructionProps: "updateInstructionData",
          },
          "some marketId",
        );
        expect(updateBet).toHaveBeenCalledTimes(1);

        expect(mapUpdateExecutionToInstructionReport).toHaveBeenCalledWith(
          updateExecutionReport,
          {
            unmatchedBetProps: "unmatchedBetData",
          },
          { marketType: "some marketType", bettingType: "some bettingType" },
        );
        expect(mapUpdateExecutionToInstructionReport).toHaveBeenCalledTimes(1);

        stopSaga();
      });

      it("should dispatch SUBSCRIBE_EXCHANGE_MARKET_UPDATES", async () => {
        const { stopSaga, dispatch, hasDispatchedAction } = await setupUpdateInstruction();

        await hasDispatchedAction(NETWORK__UPDATE_EXC_BET_SUCCESS);

        expect(dispatch).toHaveBeenCalledWith({
          type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
          payload: {
            marketId: "some marketId",
          },
        });

        stopSaga();
      });

      it("should dispatch NETWORK__UPDATE_EXC_BET_SUCCESS", async () => {
        const { stopSaga, dispatch, hasDispatchedAction } = await setupUpdateInstruction();

        await hasDispatchedAction(NETWORK__UPDATE_EXC_BET_SUCCESS);

        expect(calc.profit).toHaveBeenCalledWith(ExchangeSide.BACK, 10, 5, "some betting type", "some market type");
        expect(calc.liability).toHaveBeenCalledWith(ExchangeSide.BACK, 10, 5, "some betting type", "some market type");

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__UPDATE_EXC_BET_SUCCESS,
          payload: {
            betOriginURL: "http://localhost/",
            report: {
              metadata: {
                runnerTree: runnerTreeMock,
              },
              priceAtSelection: 1.01,
              runner: "runner:urn",
              cancelled: undefined,
              matched: undefined,
              side: ExchangeSide.BACK,
              unmatched: {
                liability: 999,
                price: 5,
                profit: 1337,
                size: 10,
                totalBonusUsed: 0,
              },
              betIds: ["betIdunmatched"],
            },
          },
        });

        stopSaga();
      });
    });

    describe("when instruction is Place", () => {
      async function setupPlaceInstruction() {
        edit.mockReturnValue({
          instruction: {
            placeInstructionProps: "placeInstructionData",
          },
          method: ETXMethod.Place,
        });

        return setupUpdateSaga({
          placeImplMock: () => ({
            side: ExchangeSide.BACK,
            unmatched: {
              size: 10,
              price: 5,
            },
          }),
        });
      }

      it("should call placeBet", async () => {
        const { stopSaga } = await setupPlaceInstruction();

        expect(placeBet).toHaveBeenCalledWith(
          {
            placeInstructionProps: "placeInstructionData",
          },
          "some marketId",
          {
            price: 1.01,
            size: 3,
          },
          { useAvailableBonus: false },
        );
        expect(placeBet).toHaveBeenCalledTimes(1);

        expect(mapPlaceExecutionToInstructionReport).toHaveBeenCalledWith(placeExecutionReport);
        expect(mapPlaceExecutionToInstructionReport).toHaveBeenCalledTimes(1);

        stopSaga();
      });

      it("should dispatch SUBSCRIBE_EXCHANGE_MARKET_UPDATES", async () => {
        const { stopSaga, dispatch, hasDispatchedAction } = await setupPlaceInstruction();

        await hasDispatchedAction(NETWORK__UPDATE_EXC_BET_SUCCESS);

        expect(dispatch).toHaveBeenCalledWith({
          type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
          payload: {
            marketId: "some marketId",
          },
        });

        stopSaga();
      });

      it("should dispatch NETWORK__UPDATE_EXC_BET_SUCCESS", async () => {
        const { stopSaga, dispatch, hasDispatchedAction } = await setupPlaceInstruction();

        await hasDispatchedAction(NETWORK__UPDATE_EXC_BET_SUCCESS);

        expect(calc.profit).toHaveBeenCalledWith(ExchangeSide.BACK, 10, 5, "some betting type", "some market type");
        expect(calc.liability).toHaveBeenCalledWith(ExchangeSide.BACK, 10, 5, "some betting type", "some market type");

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__UPDATE_EXC_BET_SUCCESS,
          payload: {
            betOriginURL: "http://localhost/",
            report: {
              metadata: {
                runnerTree: runnerTreeMock,
              },
              priceAtSelection: 1.01,
              runner: "runner:urn",
              cancelled: undefined,
              matched: undefined,
              side: ExchangeSide.BACK,
              unmatched: {
                liability: 999,
                price: 5,
                profit: 1337,
                size: 10,
                totalBonusUsed: 0,
              },
            },
          },
        });

        stopSaga();
      });
    });

    describe("when instruction is Cancel", () => {
      async function setupCancelInstruction() {
        edit.mockReturnValue({
          instruction: {
            cancelInstructionProps: "cancelInstructionData",
          },
          method: ETXMethod.Cancel,
        });

        return setupUpdateSaga({
          cancelImplMock: () => ({
            side: ExchangeSide.BACK,
            unmatched: {
              size: 10,
              price: 5,
            },
          }),
        });
      }

      it("should call cancelBet", async () => {
        const { stopSaga } = await setupCancelInstruction();

        expect(cancelBet).toHaveBeenCalledWith(
          [
            {
              cancelInstructionProps: "cancelInstructionData",
            },
          ],
          "some marketId",
        );
        expect(cancelBet).toHaveBeenCalledTimes(1);

        expect(mapCancelExecutionToInstructionReport).toHaveBeenCalledWith(
          cancelExecutionReport,
          [{ unmatchedBetProps: "unmatchedBetData" }],
          "some persistenceType",
          { marketType: "some marketType", bettingType: "some bettingType" },
        );
        expect(mapCancelExecutionToInstructionReport).toHaveBeenCalledTimes(1);

        stopSaga();
      });

      it("should dispatch SUBSCRIBE_EXCHANGE_MARKET_UPDATES", async () => {
        const { stopSaga, dispatch, hasDispatchedAction } = await setupCancelInstruction();

        await hasDispatchedAction(NETWORK__UPDATE_EXC_BET_SUCCESS);

        expect(dispatch).toHaveBeenCalledWith({
          type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
          payload: {
            marketId: "some marketId",
          },
        });

        stopSaga();
      });

      it("should dispatch NETWORK__UPDATE_EXC_BET_SUCCESS", async () => {
        const { stopSaga, dispatch, hasDispatchedAction } = await setupCancelInstruction();

        await hasDispatchedAction(NETWORK__UPDATE_EXC_BET_SUCCESS);

        expect(calc.profit).toHaveBeenCalledWith(ExchangeSide.BACK, 10, 5, "some betting type", "some market type");
        expect(calc.liability).toHaveBeenCalledWith(ExchangeSide.BACK, 10, 5, "some betting type", "some market type");

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__UPDATE_EXC_BET_SUCCESS,
          payload: {
            betOriginURL: "http://localhost/",
            report: {
              metadata: {
                runnerTree: runnerTreeMock,
              },
              priceAtSelection: 1.01,
              runner: "runner:urn",
              cancelled: undefined,
              matched: undefined,
              side: ExchangeSide.BACK,
              unmatched: {
                liability: 999,
                price: 5,
                profit: 1337,
                size: 10,
                totalBonusUsed: 0,
              },
            },
          },
        });

        stopSaga();
      });
    });

    describe("when instruction is Replace", () => {
      async function setupReplaceInstruction() {
        edit.mockReturnValue({
          instruction: {
            replaceInstructionProps: "replaceInstructionData",
          },
          method: ETXMethod.Replace,
        });

        return setupUpdateSaga({
          replaceImplMock: () => ({
            side: ExchangeSide.BACK,
            unmatched: {
              size: 10,
              price: 5,
            },
          }),
        });
      }

      it("should call replaceBet", async () => {
        const { stopSaga } = await setupReplaceInstruction();

        expect(replaceBet).toHaveBeenCalledWith(
          {
            replaceInstructionProps: "replaceInstructionData",
          },
          "some marketId",
          {
            price: 1.01,
            size: 3,
          },
        );
        expect(replaceBet).toHaveBeenCalledTimes(1);

        expect(mapReplaceExecutionToInstructionReport).toHaveBeenCalledWith(replaceExecutionReport);
        expect(mapReplaceExecutionToInstructionReport).toHaveBeenCalledTimes(1);

        stopSaga();
      });

      it("should dispatch SUBSCRIBE_EXCHANGE_MARKET_UPDATES", async () => {
        const { stopSaga, dispatch, hasDispatchedAction } = await setupReplaceInstruction();

        await hasDispatchedAction(NETWORK__UPDATE_EXC_BET_SUCCESS);

        expect(dispatch).toHaveBeenCalledWith({
          type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
          payload: {
            marketId: "some marketId",
          },
        });

        stopSaga();
      });

      it("should dispatch NETWORK__UPDATE_EXC_BET_SUCCESS", async () => {
        const { stopSaga, dispatch, hasDispatchedAction } = await setupReplaceInstruction();

        await hasDispatchedAction(NETWORK__UPDATE_EXC_BET_SUCCESS);

        expect(calc.profit).toHaveBeenCalledWith(ExchangeSide.BACK, 10, 5, "some betting type", "some market type");
        expect(calc.liability).toHaveBeenCalledWith(ExchangeSide.BACK, 10, 5, "some betting type", "some market type");

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__UPDATE_EXC_BET_SUCCESS,
          payload: {
            betOriginURL: "http://localhost/",
            report: {
              metadata: {
                runnerTree: runnerTreeMock,
              },
              priceAtSelection: 1.01,
              runner: "runner:urn",
              cancelled: undefined,
              matched: undefined,
              side: ExchangeSide.BACK,
              unmatched: {
                liability: 999,
                price: 5,
                profit: 1337,
                size: 10,
                totalBonusUsed: 0,
              },
            },
          },
        });

        stopSaga();
      });
    });

    async function setupFailInstruction(method) {
      edit.mockReturnValue({
        instruction: {
          instructionProps: "instructionData",
        },
        method,
      });

      placeBet.mockImplementation(() => Promise.reject(Error("some place error")));
      updateBet.mockImplementation(() => Promise.reject(Error("some update error")));
      cancelBet.mockImplementation(() => Promise.reject(Error("some cancel error")));
      replaceBet.mockImplementation(() => Promise.reject(Error("some replace error")));

      return setupUpdateSaga({
        placeImplMock: () => ({}),
        updateImplMock: () => ({}),
        cancelImplMock: () => ({}),
        replaceImplMock: () => ({}),
      });
    }

    describe("when placeBet fails", () => {
      it("should dispatch NETWORK__UPDATE_EXC_BET_FAILURE", async () => {
        const { stopSaga, dispatch } = await setupFailInstruction(ETXMethod.Place);

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__UPDATE_EXC_BET_FAILURE,
          payload: {
            error: Error("some place error"),
          },
        });

        stopSaga();
      });
    });

    describe("when updateBet fails", () => {
      it("should dispatch NETWORK__UPDATE_EXC_BET_FAILURE", async () => {
        const { stopSaga, dispatch } = await setupFailInstruction(ETXMethod.Update);

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__UPDATE_EXC_BET_FAILURE,
          payload: {
            error: Error("some update error"),
          },
        });

        stopSaga();
      });
    });

    describe("when cancelBet fails", () => {
      it("should dispatch NETWORK__UPDATE_EXC_BET_FAILURE", async () => {
        const { stopSaga, dispatch } = await setupFailInstruction(ETXMethod.Cancel);

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__UPDATE_EXC_BET_FAILURE,
          payload: {
            error: Error("some cancel error"),
          },
        });

        stopSaga();
      });
    });

    describe("when replaceBet fails", () => {
      it("should dispatch NETWORK__UPDATE_EXC_BET_FAILURE", async () => {
        const { stopSaga, dispatch } = await setupFailInstruction(ETXMethod.Replace);

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__UPDATE_EXC_BET_FAILURE,
          payload: {
            error: Error("some replace error"),
          },
        });

        stopSaga();
      });
    });

    describe("When a nonexistent method is sent", () => {
      it("should dispatch NETWORK__UPDATE_EXC_BET_FAILURE", async () => {
        const { stopSaga, dispatch } = await setupFailInstruction("nonexistent method");

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__UPDATE_EXC_BET_FAILURE,
          payload: {
            error: Error("Expected a possible bet edition, but no edit can be made. nonexistent method"),
          },
        });

        stopSaga();
      });
    });
  });

  describe("UI__BETSLIP_EXC_UNMATCHED_CANCEL_CLICK", () => {
    async function setupCancelSaga(unmatchedBets, runnerTree) {
      const sagaSetup = setup();

      sagaSetup.getState.mockReturnValue(stateMock);
      getExchangeRunnerTree.mockReturnValue(runnerTree);
      getUnmatchedBets.mockReturnValue(unmatchedBets);

      return sagaSetup;
    }

    describe("when there is no runner tree", () => {
      it("should not dispatch any action", async () => {
        const { stopSaga, dispatch, putActions } = await setupCancelSaga(["UnmatchedBet"], null);

        await putActions([
          {
            type: "UI/BETSLIP_EXC_UNMATCHED_CANCEL_CLICK",
            payload: {
              instructions: { betIds: ["betId"], runner: "runner:urn" },
            },
          },
        ]);

        expect(dispatch).not.toHaveBeenCalled();

        stopSaga();
      });
    });

    describe("when there is no unmatched bet", () => {
      it("should not dispatch any action", async () => {
        const { stopSaga, dispatch, putActions } = await setupCancelSaga([], runnerTreeMock);

        await putActions([
          {
            type: "UI/BETSLIP_EXC_UNMATCHED_CANCEL_CLICK",
            payload: {
              instructions: { betIds: ["betId"], runner: "runner:urn" },
            },
          },
        ]);

        expect(dispatch).not.toHaveBeenCalled();

        stopSaga();
      });
    });

    describe("when there is all data", () => {
      it("should build bet data for cancellation", async () => {
        mapCancelExecutionToInstructionReport.mockReturnValue(cancelBetMock);

        const { stopSaga, putActions } = await setupCancelSaga(
          [
            { price: 1.23, side: ExchangeSide.BACK },
            { price: 1.23, side: ExchangeSide.BACK },
          ],
          runnerTreeMock,
        );

        await putActions([
          {
            type: "UI/BETSLIP_EXC_UNMATCHED_CANCEL_CLICK",
            payload: {
              instructions: { betIds: ["betId 1", "betId 2"], runner: "runner:urn" },
            },
          },
        ]);

        expect(getExchangeRunnerTree).toHaveBeenCalledWith(stateMock.entities, "runner:urn");
        expect(getUnmatchedBets).toHaveBeenCalledWith(stateMock, "market:urn", ["betId 1", "betId 2"]);

        stopSaga();
      });

      it("should put NETWORK__CANCEL_EXC_BET_IN_PROGRESS", async () => {
        mapCancelExecutionToInstructionReport.mockReturnValue(cancelBetMock);

        const { stopSaga, putActions, dispatch } = await setupCancelSaga(
          [{ price: 1.23, side: ExchangeSide.BACK }],
          runnerTreeMock,
        );

        await putActions([
          {
            type: "UI/BETSLIP_EXC_UNMATCHED_CANCEL_CLICK",
            payload: {
              instructions: { betIds: ["betId"], runner: "runner:urn" },
            },
          },
        ]);

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__CANCEL_EXC_BET_IN_PROGRESS,
        });

        stopSaga();
      });

      it("should cancel bet", async () => {
        mapCancelExecutionToInstructionReport.mockReturnValue(cancelBetMock);

        const { stopSaga, putActions } = await setupCancelSaga(
          [
            { price: 1.23, side: ExchangeSide.BACK },
            { price: 1.23, side: ExchangeSide.BACK },
          ],
          runnerTreeMock,
        );

        await putActions([
          {
            type: "UI/BETSLIP_EXC_UNMATCHED_CANCEL_CLICK",
            payload: {
              instructions: { betIds: ["betId 1", "betId 2"], runner: "runner:urn" },
            },
          },
        ]);

        expect(cancelBet).toHaveBeenCalledWith(
          [
            {
              betId: "betId 1",
            },
            {
              betId: "betId 2",
            },
          ],
          "1.111",
        );
        expect(cancelBet).toHaveBeenCalledTimes(1);

        expect(mapCancelExecutionToInstructionReport).toHaveBeenCalledWith(cancelExecutionReport, [
          { price: 1.23, side: ExchangeSide.BACK },
          { price: 1.23, side: ExchangeSide.BACK },
        ]);
        expect(mapCancelExecutionToInstructionReport).toHaveBeenCalledTimes(1);

        stopSaga();
      });
    });

    describe("when cancelBet fails", () => {
      it("should dispatch FAILURE with error", async () => {
        cancelBet.mockRejectedValue("some error");

        const { stopSaga, putActions, dispatch } = await setupCancelSaga(
          [{ price: 1.23, side: ExchangeSide.BACK }],
          runnerTreeMock,
        );

        await putActions([
          {
            type: "UI/BETSLIP_EXC_UNMATCHED_CANCEL_CLICK",
            payload: {
              instructions: { betIds: ["betId 1"], runner: "runner:urn" },
            },
          },
        ]);

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__CANCEL_EXC_BET_FAILURE,
          payload: {
            error: "some error",
          },
        });

        stopSaga();
      });
    });

    describe("when cancelBet succeeds", () => {
      let stopSaga;
      let putActions;
      let hasDispatchedAction;
      let dispatch;

      beforeEach(async () => {
        mapCancelExecutionToInstructionReport.mockReturnValue({
          side: ExchangeSide.BACK,
          cancelled: {
            size: 10,
            price: 1.23,
            liability: 999,
            profit: 1337,
            totalBonusUsed: 20,
          },
          betIds: ["betIdsunmatched"],
        });
        calculateUsedBonus.mockReturnValue(20);

        ({ stopSaga, putActions, hasDispatchedAction, dispatch } = await setupCancelSaga(
          [
            {
              price: 1.23,
              side: ExchangeSide.BACK,
            },
          ],
          runnerTreeMock,
        ));

        await putActions([
          {
            type: "UI/BETSLIP_EXC_UNMATCHED_CANCEL_CLICK",
            payload: {
              instructions: { betIds: ["betId"], runner: "runner:urn" },
            },
          },
        ]);

        await hasDispatchedAction(NETWORK__CANCEL_EXC_BET_SUCCESS);
      });

      afterEach(() => {
        stopSaga();
      });

      it("should dispatch SUBSCRIBE_EXCHANGE_MARKET_UPDATES", async () => {
        expect(dispatch).toHaveBeenCalledWith({
          type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
          payload: {
            marketId: "1.111",
          },
        });
      });

      it("should dispatch SUCCESS with metadata and report", async () => {
        expect(calc.profit).toHaveBeenCalledWith(ExchangeSide.BACK, 10, 1.23, "some betting type", "some market type");
        expect(calc.liability).toHaveBeenCalledWith(
          ExchangeSide.BACK,
          10,
          1.23,
          "some betting type",
          "some market type",
        );
        expect(calculateUsedBonus).toHaveBeenCalledWith(999, 20);
        expect(calculateUsedBonus).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__CANCEL_EXC_BET_SUCCESS,
          payload: {
            report: {
              metadata: {
                runnerTree: runnerTreeMock,
              },
              runner: "runner:urn",
              side: ExchangeSide.BACK,
              cancelled: {
                size: 10,
                price: 1.23,
                liability: 999,
                profit: 1337,
                totalBonusUsed: 20,
              },
              betIds: ["betIdsunmatched"],
            },
          },
        });
      });
    });
  });

  describe("UI__MY_BETS_CANCEL_ALL_UNMATCHED_PRESS", () => {
    it("should put NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BETS_IN_PROGRESS", async () => {
      const { stopSaga, dispatch, putActions } = await setup();

      await putActions([
        {
          type: "UI/MY_BETS_CANCEL_ALL_UNMATCHED_PRESS",
          payload: {
            marketId: "fakeMarketId",
          },
        },
      ]);

      expect(dispatch).toHaveBeenCalledWith({
        type: NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BETS_IN_PROGRESS,
      });

      stopSaga();
    });

    it("should call cancel bet", async () => {
      const { stopSaga, putActions } = await setup();

      await putActions([
        {
          type: "UI/MY_BETS_CANCEL_ALL_UNMATCHED_PRESS",
          payload: {
            marketId: "fakeMarketId",
          },
        },
      ]);

      expect(cancelBet).toHaveBeenCalledWith([], "fakeMarketId");

      stopSaga();
    });

    describe("when cancelBet fails", () => {
      it("should dispatch FAILURE with error receipt", async () => {
        cancelBet.mockRejectedValue({ errorCode: "some error" });

        const { stopSaga, putActions, dispatch } = await setup();

        await putActions([
          {
            type: "UI/MY_BETS_CANCEL_ALL_UNMATCHED_PRESS",
            payload: {
              marketId: "fakeMarketId",
            },
          },
        ]);

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_FAILURE,
          payload: {
            receipt: {
              entityURN: "fakeMarketId",
              receiptTitle: {
                translate: {
                  key: "I18N.GENERIC_RECEIPT.BET_CANCELED_ERROR",
                },
              },
              errorMessage: {
                translate: {
                  key: "I18N.GENERIC_RECEIPT.ERROR_MESSAGE_TITLE",
                },
              },
              errorDetail: {
                translate: {
                  key: "I18N.GENERIC_RECEIPT.BET_CANCELLED_ERROR_SUB_TITLE",
                },
              },
            },
            errorCode: "some error",
          },
        });

        stopSaga();
      });
    });

    describe("when cancelBet succeeds", () => {
      it("should dispatch NETWORK/MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_SUCCESS with market bets ids, marketName, numberOfBets and event on payload", async () => {
        const { stopSaga, putActions, dispatch } = await setup();

        await putActions([
          {
            type: "UI/MY_BETS_CANCEL_ALL_UNMATCHED_PRESS",
            payload: {
              marketId: "fakeMarketId",
              marketName: "fakeMarketName",
              numberOfBets: "fakeNumberOfBets",
              event: "fakeEvent",
              marketBetCardGroupURN: ["marketBetCardGroupURN"],
            },
          },
        ]);

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_SUCCESS,
          payload: {
            marketName: "fakeMarketName",
            numberOfBets: "fakeNumberOfBets",
            event: "fakeEvent",
          },
        });

        expect(dispatch).toHaveBeenCalledWith({
          type: FETCH_CARDS,
          payload: {
            urns: ["marketBetCardGroupURN"],
            forceRefresh: true,
          },
        });

        stopSaga();
      });
    });
  });

  describe("UI__MY_BETS_CANCEL_UNMATCHED_BET_PRESS", () => {
    it("should put NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BETS_IN_PROGRESS", async () => {
      const { stopSaga, dispatch, putActions } = await setup();

      await putActions([
        {
          type: "UI/MY_BETS_CANCEL_UNMATCHED_BET_PRESS",
          payload: {
            marketId: "fakeMarketId",
            betIds: [{ betId: "fakeBetsIds" }],
          },
        },
      ]);

      expect(dispatch).toHaveBeenCalledWith({
        type: NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BETS_IN_PROGRESS,
      });

      stopSaga();
    });

    it("should call cancel bet", async () => {
      const { stopSaga, putActions } = await setup();

      await putActions([
        {
          type: "UI/MY_BETS_CANCEL_UNMATCHED_BET_PRESS",
          payload: {
            marketId: "fakeMarketId",
            betId: "fakeBetsId",
            selectionName: "fakeSelectionName",
          },
        },
      ]);

      expect(cancelBet).toHaveBeenCalledWith([{ betId: "fakeBetsId" }], "fakeMarketId");

      stopSaga();
    });

    describe("when cancelBet fails with a non HTTP unauthorized error", () => {
      it("should dispatch FAILURE with error receipt", async () => {
        cancelBet.mockRejectedValue({ errorCode: "some error" });

        const { stopSaga, putActions, dispatch } = await setup();

        await putActions([
          {
            type: "UI/MY_BETS_CANCEL_UNMATCHED_BET_PRESS",
            payload: {
              marketId: "fakeMarketId",
              betIds: ["fakeBetsIds"],
              side: ExchangeSide.LAY,
            },
          },
        ]);

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BETS_FAILURE,
          payload: {
            errorCode: "some error",
            side: ExchangeSide.LAY,
            receipt: {
              entityURN: "fakeMarketId",
              receiptTitle: {
                translate: {
                  key: "I18N.GENERIC_RECEIPT.BET_CANCELED_ERROR",
                },
              },
              errorMessage: {
                translate: {
                  key: "I18N.GENERIC_RECEIPT.ERROR_MESSAGE_TITLE",
                },
              },
              errorDetail: {
                translate: {
                  key: "I18N.GENERIC_RECEIPT.BET_CANCELLED_ERROR_SUB_TITLE",
                },
              },
            },
          },
        });

        stopSaga();
      });
    });

    describe("when cancelBet succeeds", () => {
      it("should dispatch NETWORK/MY_BETS_CANCEL_UNMATCHED_EXC_BET_SUCCESS with market bets ids and selection name on payload", async () => {
        const { stopSaga, putActions, dispatch } = await setup();

        await putActions([
          {
            type: "UI/MY_BETS_CANCEL_UNMATCHED_BET_PRESS",
            payload: {
              marketId: "fakeMarketId",
              betId: "fakeBetsId",
              selectionName: "fakeSelectionName",
              marketBetCardGroupURN: "marketBetCardGroupURN",
            },
          },
        ]);

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BET_SUCCESS,
          payload: {
            selectionName: "fakeSelectionName",
            betId: "fakeBetsId",
          },
        });

        expect(dispatch).toHaveBeenCalledWith({
          type: FETCH_CARDS,
          payload: {
            urns: ["marketBetCardGroupURN"],
            forceRefresh: true,
          },
        });

        stopSaga();
      });
    });
  });

  describe("BETTING__EXC_PLACE_DEPOSIT_SUCCESSFUL", () => {
    const setupPlaceDepositSuccessful = async () => {
      const { dispatch, putActions, stopSaga } = await setup();
      putActions([
        {
          type: BETTING__EXC_PLACE_DEPOSIT_SUCCESSFUL,
          payload: { runner: "any", confirmFirst: false },
        },
      ]);

      return { dispatch, putActions, stopSaga };
    };

    it("should call refreshWallet", async () => {
      const { stopSaga } = await setupPlaceDepositSuccessful();

      expect(refreshWallet).toHaveBeenCalledWith();
      expect(refreshWallet).toHaveBeenCalledTimes(1);

      stopSaga();
    });

    describe("when failure is returned from refreshWallet", () => {
      it("should put BETTING__DEPOSIT_TO_PLACE_CANCEL", async () => {
        refreshWallet.mockReturnValueOnce({ failure: "oops" });
        const { dispatch, stopSaga } = await setupPlaceDepositSuccessful();

        expect(dispatch).toHaveBeenCalledWith({
          type: BETTING__DEPOSIT_TO_PLACE_CANCEL,
        });

        stopSaga();
      });

      it("should not put BETTING__EXC_PLACE_BETS", async () => {
        refreshWallet.mockReturnValueOnce({ failure: "oops" });
        const { dispatch, stopSaga } = await setupPlaceDepositSuccessful();

        expect(dispatch).not.toHaveBeenCalledWith({
          type: BETTING__EXC_PLACE_BETS,
          payload: { runner: "any", confirmFirst: false },
        });

        stopSaga();
      });
    });

    describe("when success is returned from refreshWallet", () => {
      it("should put BETTING__EXC_PLACE_BETS", async () => {
        refreshWallet.mockReturnValueOnce({ success: "yay" });
        const { dispatch, stopSaga } = await setupPlaceDepositSuccessful();

        expect(dispatch).toHaveBeenCalledWith({
          type: BETTING__EXC_PLACE_BETS,
          payload: { runner: "any", confirmFirst: false },
        });

        stopSaga();
      });
    });
  });

  describe("BETTING__EXC_EDIT_DEPOSIT_SUCCESSFUL", () => {
    const setupEditDepositSuccessful = async () => {
      const { dispatch, putActions, stopSaga } = await setup();
      putActions([
        {
          type: BETTING__EXC_EDIT_DEPOSIT_SUCCESSFUL,
          payload: { runner: "runner", betId: "betId", market: "market" },
        },
      ]);

      return { dispatch, putActions, stopSaga };
    };

    it("should call refreshWallet", async () => {
      const { stopSaga } = await setupEditDepositSuccessful();

      expect(refreshWallet).toHaveBeenCalledWith();
      expect(refreshWallet).toHaveBeenCalledTimes(1);

      stopSaga();
    });

    describe("when failure is returned from refreshWallet", () => {
      it("should put BETTING__DEPOSIT_TO_PLACE_CANCEL", async () => {
        refreshWallet.mockReturnValueOnce({ failure: "oops" });
        const { dispatch, stopSaga } = await setupEditDepositSuccessful();

        expect(dispatch).toHaveBeenCalledWith({
          type: BETTING__DEPOSIT_TO_PLACE_CANCEL,
        });

        stopSaga();
      });

      it("should not put BETTING__EXC_UNMATCHED_UPDATE", async () => {
        refreshWallet.mockReturnValueOnce({ failure: "oops" });
        const { dispatch, stopSaga } = await setupEditDepositSuccessful();

        expect(dispatch).not.toHaveBeenCalledWith({
          type: BETTING__EXC_UNMATCHED_UPDATE,
          payload: { runner: "runner", betId: "betId", market: "market", betOriginURL: null },
        });

        stopSaga();
      });
    });

    describe("when success is returned from refreshWallet", () => {
      it("should put BETTING__EXC_UNMATCHED_UPDATE", async () => {
        refreshWallet.mockReturnValueOnce({ success: "yay" });
        const { dispatch, stopSaga } = await setupEditDepositSuccessful();

        expect(dispatch).toHaveBeenCalledWith({
          type: BETTING__EXC_UNMATCHED_UPDATE,
          payload: { runner: "runner", betId: "betId", market: "market", betOriginURL: null },
        });

        stopSaga();
      });
    });
  });
});
