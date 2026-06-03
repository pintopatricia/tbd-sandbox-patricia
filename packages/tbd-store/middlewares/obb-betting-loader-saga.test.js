import { ProductsOption } from "../state/entities";
import { setupManagedSagaMocks } from "../saga-jest-setup";
import {
  BETTING__BETSLIP_LOAD_MAX_PAYOUT_INFO,
  BETTING__OBB_LOADED,
  BETTING__OBB_LOAD_STORAGE_FAILURE,
  BETTING__OBB_STATE_UPDATE,
  BETTING__OBB_UPDATE_QUOTES,
} from "../actions/betting";
import { getBetslip, getObbBettingData, removeObbBettingData, resetTaggingMetadata } from "../helpers/storage";
import { getAllowLoadFromStorage } from "../state/boot/boot-selectors";
import { createUserPreferencesWithProductSwitcherSelector } from "../state/entities/user-preferences/user-preferences-selectors";

jest.useFakeTimers("modern");
jest.setSystemTime(1000000000);

jest.mock("../helpers/storage", () => ({
  getBetslip: jest.fn().mockReturnValue("REAL"),
  getObbBettingData: jest.fn(),
  getObbTaggingMetadata: jest.fn(),
  removeObbBettingData: jest.fn(),
  getTaggingMetadata: jest.fn(),
  resetTaggingMetadata: jest.fn(),
  resetObbTaggingMetadata: jest.fn(),
}));

jest.mock("../state/boot/boot-selectors", () => ({
  getAllowLoadFromStorage: jest.fn(),
}));

jest.mock("../state/entities/user-preferences/user-preferences-selectors", () => ({
  createUserPreferencesWithProductSwitcherSelector: jest
    .fn()
    .mockReturnValue(jest.fn().mockReturnValue({ products: [ProductsOption.sportsbook] })),
}));

const validateMock = jest.fn().mockReturnValue({ valid: true, errors: [] });

jest.mock("jsonschema", () => {
  function Validator() {
    this.validate = validateMock;
  }

  return { Validator };
});

function setup() {
  let saga;
  jest.isolateModules(() => {
    ({ obbBettingLoaderSaga: saga } = require("./obb-betting-loader-saga"));
  });
  const sagaRunner = setupManagedSagaMocks(saga, { storage: () => {} });

  sagaRunner.getState.mockReturnValue({ entities: { preferences: { products: [] } } });

  const { stop } = sagaRunner.run();

  return { ...sagaRunner, stopSaga: stop };
}

describe("obbBettingLoaderSaga", () => {
  beforeEach(jest.clearAllMocks);
  afterAll(() => jest.useRealTimers());

  describe("when getBetslip returns a showMaxPayoutNotification", () => {
    it("should dispatch BETTING__BETSLIP_LOAD_MAX_PAYOUT_INFO with showMaxPayoutNotification from storage", async () => {
      getAllowLoadFromStorage.mockReturnValueOnce(false);
      getBetslip.mockReturnValueOnce({ showMaxPayoutNotification: false });

      const bettingBetslipLoadMaxPayoutInfoAction = {
        type: BETTING__BETSLIP_LOAD_MAX_PAYOUT_INFO,
        payload: false,
      };

      const { putActions, dispatch, stopSaga } = setup();

      await putActions([bettingBetslipLoadMaxPayoutInfoAction]);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenCalledWith({
        type: BETTING__BETSLIP_LOAD_MAX_PAYOUT_INFO,
        payload: false,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: BETTING__OBB_LOADED,
      });

      stopSaga();
    });
  });

  describe("when getAllowLoadFromStorage is false", () => {
    it("should not call getObbBettingData", () => {
      getAllowLoadFromStorage.mockReturnValueOnce(false);
      const { stopSaga, dispatch } = setup();

      expect(dispatch).toHaveBeenCalledTimes(1);

      stopSaga();
    });

    it("should dispatch BETTING__OBB_LOADED", () => {
      getAllowLoadFromStorage.mockReturnValueOnce(false);
      const { stopSaga } = setup();

      expect(getObbBettingData).not.toHaveBeenCalled();

      stopSaga();
    });
  });

  describe("on latest BETTING__OBB_LOAD_STORAGE_FAILED action", () => {
    it("should call removeObbBettingData", async () => {
      const { putActions, stopSaga } = setup();
      await putActions([
        {
          type: BETTING__OBB_LOAD_STORAGE_FAILURE,
        },
      ]);

      expect(removeObbBettingData).toHaveBeenCalledWith({ storage: expect.any(Function) });
      expect(removeObbBettingData).toHaveBeenCalledTimes(1);

      stopSaga();
    });
  });

  describe("when getAllowLoadFromStorage is true", () => {
    beforeEach(() => {
      getAllowLoadFromStorage.mockReturnValueOnce(true);
    });

    describe("when user has only sportsbook preference", () => {
      it("should load no state from storage", () => {
        createUserPreferencesWithProductSwitcherSelector.mockReturnValueOnce(
          jest.fn().mockReturnValue({ products: [ProductsOption.exchange] }),
        );

        const { stopSaga, dispatch } = setup();

        expect(dispatch).toHaveBeenCalledWith({ type: BETTING__OBB_LOADED });
        expect(getObbBettingData).not.toHaveBeenCalled();

        stopSaga();
      });
    });

    describe("when getObbBettingData returns falsy from storage", () => {
      it("should indicate module has loaded only", async () => {
        getObbBettingData.mockReturnValueOnce(null);

        const { dispatch, stopSaga } = setup();

        expect(dispatch).toHaveBeenCalledWith({ type: BETTING__OBB_LOADED });
        expect(dispatch).not.toHaveBeenCalledWith({ type: BETTING__OBB_STATE_UPDATE });

        stopSaga();
      });
    });

    describe("when getObbBettingData returns an invalid state", () => {
      it("should dispatch BettingObbLoadStorageFailureAction action", () => {
        getObbBettingData.mockReturnValueOnce({});
        validateMock.mockReturnValueOnce({ valid: false });

        const { dispatch, stopSaga } = setup();

        expect(dispatch).toHaveBeenCalledWith({
          type: BETTING__OBB_LOAD_STORAGE_FAILURE,
        });
        expect(dispatch).toHaveBeenCalledTimes(2);

        stopSaga();
      });
    });

    describe("when getObbBettingData returns valid betting state from storage", () => {
      const obbBettingState = { some: "state" };

      it("should call resetTaggingMetadata", () => {
        getObbBettingData.mockReturnValueOnce(obbBettingState);
        validateMock.mockReturnValueOnce({ valid: true });

        const { stopSaga } = setup();

        expect(resetTaggingMetadata).toHaveBeenCalledWith({ storage: expect.any(Function) });

        stopSaga();
      });

      it("should dispatch BETTING__OBB_STATE_UPDATE and BETTING__OBB_UPDATE_QUOTES", () => {
        getObbBettingData.mockReturnValueOnce({
          potentialBets: {
            "bet:1": {
              legs: ["leg:1"],
              id: "bet:1",
              potentialReturns: null,
              stake: null,
            },
          },
          legs: {
            "leg:1": {
              params: {
                x: 3,
                n: 3,
              },
            },
          },
          failures: { potentialBets: { "bet:1": "ERROR1" }, legs: { "leg:1": "ERROR2" }, betslip: "ERROR3" },
        });

        const { stopSaga, dispatch } = setup();

        expect(dispatch).toHaveBeenNthCalledWith(1, {
          type: BETTING__OBB_STATE_UPDATE,
          payload: {
            state: {
              potentialBets: {
                "bet:1": {
                  id: "bet:1",
                  legs: ["leg:1"],
                  potentialReturns: null,
                  stake: null,
                },
              },
              legs: {
                "leg:1": {
                  params: {
                    n: 3,
                    x: 3,
                  },
                },
              },
              failures: {
                betslip: null,
                legs: {},
                potentialBets: {},
              },
            },
          },
        });
        expect(dispatch).toHaveBeenNthCalledWith(2, {
          type: BETTING__OBB_UPDATE_QUOTES,
          payload: { clearOnFailure: true },
        });

        stopSaga();
      });
    });
  });
});
