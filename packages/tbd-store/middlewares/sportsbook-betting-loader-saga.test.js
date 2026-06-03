import { ProductsOption } from "../state/entities";
import { setupManagedSagaMocks } from "../saga-jest-setup";
import {
  BETTING__SBK_ADD_SELECTIONS,
  BETTING__SBK_ADD_SELECTIONS_SUCCESS,
  BETTING__SBK_ENSURE_SELECTION_DATA,
  BETTING__SBK_ENSURE_SELECTION_DATA_ERROR,
  BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS,
  BETTING__SBK_LOAD_STORAGE_SUCCESS,
  BETTING__SBK_LOAD_STORAGE_FAILED,
  BETTING__BETSLIP_LOAD_MAX_PAYOUT_INFO,
  BETTING__SBK_REMOVE_LEG_ACTION,
} from "../actions/betting";
import { UI__BETSLIP_BET_BUILDER_REMOVE_SELECTIONS, UI__BETSLIP_BET_BUILDER_ADD_SELECTIONS } from "../actions/betslip";
import {
  getBetslip,
  getSportsbookBettingData,
  getTaggingMetadata,
  resetTaggingMetadata,
  removeSportsbookBettingData,
} from "../helpers/storage";
import { getAllowLoadFromStorage } from "../state/boot/boot-selectors";
import { createUserPreferencesWithProductSwitcherSelector } from "../state/entities/user-preferences/user-preferences-selectors";
import { MODULES__SBK_BETTING_LOADED } from "../actions/modules";

jest.useFakeTimers("modern");
jest.setSystemTime(1000000000);

jest.mock("../helpers/betting", () => ({
  getUniqueId: jest.fn(() => "i1234567890"),
}));

jest.mock("../helpers/storage", () => ({
  getSportsbookBettingData: jest.fn(),
  getTaggingMetadata: jest.fn(),
  getBetslip: jest.fn().mockReturnValue("REAL"),
  resetTaggingMetadata: jest.fn(),
  removeSportsbookBettingData: jest.fn(),
}));

jest.mock("../state/boot/boot-selectors", () => ({
  getAllowLoadFromStorage: jest.fn(),
}));

jest.mock("../state/entities/user-preferences/user-preferences-selectors", () => ({
  createUserPreferencesWithProductSwitcherSelector: jest
    .fn()
    .mockReturnValue(jest.fn().mockReturnValue({ products: [ProductsOption.sportsbook] })),
}));

jest.mock("@ppb/betslip-core/src/schemas/group.json", () => ({}));

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
    ({ sportsbookBettingLoaderSaga: saga } = require("./sportsbook-betting-loader-saga"));
  });
  const sagaRunner = setupManagedSagaMocks(saga, { storage: () => {} });

  sagaRunner.getState.mockReturnValue({
    entities: {
      preferences: { products: [] },
      userdetails: {
        countryCode: "GB",
      },
    },
    betting: {
      sportsbookBetting: {
        legs: {},
      },
      popularBetting: {},
    },
  });

  const { stop } = sagaRunner.run();

  return { ...sagaRunner, stopSaga: stop };
}

describe("sportsbookBettingLoaderSaga", () => {
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
        type: MODULES__SBK_BETTING_LOADED,
      });

      stopSaga();
    });
  });

  describe("when getAllowLoadFromStorage is false", () => {
    it("should not call getSportsbookBettingData", () => {
      getAllowLoadFromStorage.mockReturnValueOnce(false);
      const { stopSaga } = setup();

      expect(getSportsbookBettingData).not.toHaveBeenCalled();

      stopSaga();
    });
  });

  describe("on latest BETTING__SBK_ADD_SELECTIONS action", () => {
    const bettingSportsbookAddSelectionAction = {
      type: BETTING__SBK_ADD_SELECTIONS,
      payload: {
        selections: [{ marketUrn: "ppb:sbkMarket:1", runnerUrn: "ppb:sbkRunner:1/1" }],
      },
    };

    it("should dispatch BETTING__SBK_ENSURE_SELECTION_DATA", async () => {
      const { putActions, dispatch, stopSaga } = setup();

      await putActions([bettingSportsbookAddSelectionAction]);

      expect(dispatch).toHaveBeenNthCalledWith(2, {
        type: BETTING__SBK_ENSURE_SELECTION_DATA,
        payload: bettingSportsbookAddSelectionAction.payload,
      });

      stopSaga();
    });

    it("should dispatch BETTING__SBK_REMOVE_LEG_ACTION when all legs exist on betslip state", async () => {
      const { putActions, dispatch, stopSaga, getState } = setup();

      getState.mockReturnValue({
        betting: {
          sportsbookBetting: {
            legs: {
              "SIMPLE_SELECTION:[1-1]": {
                legId: "SIMPLE_SELECTION:[1-1]",
              },
            },
          },
          popularBetting: {},
        },
      });

      await putActions([bettingSportsbookAddSelectionAction]);

      expect(dispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({
          type: BETTING__SBK_ADD_SELECTIONS_SUCCESS,
        }),
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: BETTING__SBK_REMOVE_LEG_ACTION,
        payload: {
          legId: "SIMPLE_SELECTION:[1-1]",
        },
      });

      stopSaga();
    });

    it("should dispatch UI__BETSLIP_BET_BUILDER_REMOVE_SELECTIONS for all removed selections", async () => {
      const bettingSportsbookRemoveSelectionAction = {
        type: BETTING__SBK_ADD_SELECTIONS,
        payload: {
          selections: [
            { marketUrn: "ppb:sbkMarket:1", runnerUrn: "ppb:sbkRunner:1/1" },
            { marketUrn: "ppb:sbkMarket:2", runnerUrn: "ppb:sbkRunner:2/2" },
          ],
        },
      };

      const { putActions, dispatch, stopSaga, getState } = setup();

      getState.mockReturnValue({
        betting: {
          sportsbookBetting: {
            legs: {
              "SIMPLE_SELECTION:[1-1]": {
                legId: "SIMPLE_SELECTION:[1-1]",
              },
              "SIMPLE_SELECTION:[2-2]": {
                legId: "SIMPLE_SELECTION:[2-2]",
              },
            },
          },
          popularBetting: {},
        },
      });

      await putActions([bettingSportsbookRemoveSelectionAction]);

      expect(dispatch).toHaveBeenCalledWith({
        type: UI__BETSLIP_BET_BUILDER_REMOVE_SELECTIONS,
        payload: {
          cardUrn: "",
          selection: {
            marketUrn: "ppb:sbkMarket:1",
            runnerUrn: "ppb:sbkRunner:1/1",
            legId: "SIMPLE_SELECTION:[1-1]",
            uniqueId: "i1234567890",
          },
        },
      });

      expect(dispatch).toHaveBeenCalledWith({
        type: UI__BETSLIP_BET_BUILDER_REMOVE_SELECTIONS,
        payload: {
          cardUrn: "",
          selection: {
            marketUrn: "ppb:sbkMarket:2",
            runnerUrn: "ppb:sbkRunner:2/2",
            legId: "SIMPLE_SELECTION:[2-2]",
            uniqueId: "i1234567890",
          },
        },
      });

      stopSaga();
    });
    describe("on BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS action", () => {
      it("should dispatch BETTING__SBK_ADD_SELECTIONS_SUCCESS", async () => {
        const bettingSportsbookEnsureSelectionDataSuccess = {
          type: BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS,
          payload: bettingSportsbookAddSelectionAction.payload,
        };

        const { putActions, dispatch, stopSaga } = setup();

        await putActions([bettingSportsbookAddSelectionAction, bettingSportsbookEnsureSelectionDataSuccess]);

        expect(dispatch).toHaveBeenNthCalledWith(4, {
          type: BETTING__SBK_ADD_SELECTIONS_SUCCESS,
          payload: {
            bettingOpportunityId: undefined,
            bettingOpportunityType: undefined,
            group: undefined,
            options: undefined,
            selections: [
              {
                legId: "SIMPLE_SELECTION:[1-1]",
                marketUrn: "ppb:sbkMarket:1",
                runnerUrn: "ppb:sbkRunner:1/1",
                uniqueId: "i1234567890",
              },
            ],
          },
        });

        stopSaga();
      });

      it("should dispatch UI__BETSLIP_BET_BUILDER_ADD_SELECTIONS for all added selections", async () => {
        const bettingSportsbookEnsureSelectionDataSuccess = {
          type: BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS,
          payload: bettingSportsbookAddSelectionAction.payload,
        };

        const { putActions, dispatch, stopSaga } = setup();

        await putActions([bettingSportsbookAddSelectionAction, bettingSportsbookEnsureSelectionDataSuccess]);

        expect(dispatch).toHaveBeenCalledWith({
          type: UI__BETSLIP_BET_BUILDER_ADD_SELECTIONS,
          payload: {
            cardUrn: "",
            odds: undefined,
            selection: {
              legId: "SIMPLE_SELECTION:[1-1]",
              marketUrn: "ppb:sbkMarket:1",
              runnerUrn: "ppb:sbkRunner:1/1",
              uniqueId: "i1234567890",
            },
          },
        });

        stopSaga();
      });
    });

    describe("on BETTING__SBK_ENSURE_SELECTION_DATA_ERROR action", () => {
      it("should not dispatch BETTING__SBK_ADD_SELECTIONS_SUCCESS", async () => {
        const { putActions, dispatch, stopSaga } = setup();

        await putActions([
          bettingSportsbookAddSelectionAction,
          {
            type: BETTING__SBK_ENSURE_SELECTION_DATA_ERROR,
          },
        ]);

        expect(dispatch).not.toHaveBeenCalledWith(
          expect.objectContaining({
            type: BETTING__SBK_ADD_SELECTIONS_SUCCESS,
          }),
        );

        stopSaga();
      });
    });
  });

  describe("on latest BETTING__SBK_LOAD_STORAGE_FAILED action", () => {
    it("should call removeSportsbookBettingData", async () => {
      const { putActions, stopSaga } = setup();
      await putActions([
        {
          type: BETTING__SBK_LOAD_STORAGE_FAILED,
          payload: { errors: ["some error"] },
        },
      ]);

      expect(removeSportsbookBettingData).toHaveBeenCalledWith({ storage: expect.any(Function) });
      expect(removeSportsbookBettingData).toHaveBeenCalledTimes(1);

      stopSaga();
    });
  });

  describe("when getAllowLoadFromStorage is true", () => {
    beforeEach(() => {
      getAllowLoadFromStorage.mockReturnValueOnce(true);
    });

    describe("when getSportsbookBettingData returns falsy from storage", () => {
      it("should indicate module has loaded only", async () => {
        getSportsbookBettingData.mockReturnValueOnce(null);
        getBetslip.mockReturnValueOnce(undefined);
        getBetslip.mockReturnValueOnce({ group: "REAL" });

        const { dispatch, stopSaga } = setup();

        expect(dispatch).toHaveBeenCalledWith({ type: MODULES__SBK_BETTING_LOADED });

        stopSaga();
      });
    });

    describe("when getBetslip returns falsy from storage", () => {
      it("should indicate module has loaded only", async () => {
        getSportsbookBettingData.mockReturnValueOnce({});
        getBetslip.mockReturnValueOnce(undefined);
        getBetslip.mockReturnValueOnce(undefined);

        const { dispatch, stopSaga } = setup();

        expect(dispatch).toHaveBeenCalledWith({ type: MODULES__SBK_BETTING_LOADED });

        stopSaga();
      });
    });

    describe("when getSportsbookBettingData returns an invalid state", () => {
      it("should dispatch BettingSportsbookLoadStorageFailed action", () => {
        getSportsbookBettingData.mockReturnValueOnce({});
        getBetslip.mockReturnValueOnce(undefined);
        getBetslip.mockReturnValueOnce({ group: "REAL" });
        validateMock.mockReturnValueOnce({ valid: false, errors: ["some error"] });

        const { dispatch, stopSaga } = setup();

        expect(dispatch).toHaveBeenCalledWith({
          payload: { errors: ["some error"] },
          type: "BETTING/SBK_LOAD_STORAGE_FAILED",
        });
        expect(dispatch).toHaveBeenCalledTimes(2);

        stopSaga();
      });
    });

    describe("when getSportsbookBettingData returns valid betting state from storage", () => {
      const bettingState = {
        runners: {
          1: { marketId: "1", selectionId: 1.1 },
          2: { marketId: "2", selectionId: 2.2 },
        },
      };

      const selections = {
        selections: [
          {
            marketUrn: "ppb:sbkMarket:1",
            runnerUrn: "ppb:sbkRunner:1/1.1",
            uniqueId: "i1234567890",
          },
          {
            marketUrn: "ppb:sbkMarket:2",
            runnerUrn: "ppb:sbkRunner:2/2.2",
            uniqueId: "i1234567890",
          },
        ],
      };

      it("should call resetTaggingMetadata", () => {
        getSportsbookBettingData.mockReturnValueOnce(bettingState);
        getBetslip.mockReturnValueOnce(undefined);
        getBetslip.mockReturnValueOnce({ group: "REAL" });

        const { stopSaga } = setup();

        expect(resetTaggingMetadata).toHaveBeenCalledWith({ storage: expect.any(Function) });

        stopSaga();
      });

      describe("when real", () => {
        it("should dispatch BETTING__SBK_ENSURE_SELECTION_DATA with real selections", async () => {
          getSportsbookBettingData.mockReturnValueOnce(bettingState);
          getBetslip.mockReturnValueOnce(undefined);
          getBetslip.mockReturnValueOnce({ group: "REAL" });
          getTaggingMetadata.mockReturnValueOnce({
            selections: {
              "1-1.1": { uniqueId: "uniqueId1" },
              "2-2.2": { uniqueId: "uniqueId2" },
            },
          });
          const { dispatch, stopSaga } = setup();

          expect(dispatch).toHaveBeenNthCalledWith(1, {
            type: BETTING__SBK_ENSURE_SELECTION_DATA,
            payload: {
              ...selections,
              group: "REAL",
            },
          });

          stopSaga();
        });
      });

      describe("when virtual", () => {
        it("should dispatch BETTING__SBK_ENSURE_SELECTION_DATA with virtual selections", async () => {
          getSportsbookBettingData.mockReturnValueOnce(bettingState);
          getBetslip.mockReturnValueOnce(undefined);
          getBetslip.mockReturnValueOnce({ group: "VIRTUAL" });
          getTaggingMetadata.mockReturnValueOnce({
            selections: {
              "1-1.1": { uniqueId: "uniqueId1" },
              "2-2.2": { uniqueId: "uniqueId2" },
            },
          });
          const { dispatch, stopSaga } = setup();

          expect(dispatch).toHaveBeenNthCalledWith(1, {
            type: BETTING__SBK_ENSURE_SELECTION_DATA,
            payload: {
              selections: [
                { runnerUrn: "ppb:virtualRunner:1/1.1", marketUrn: "ppb:virtualMarket:1", uniqueId: "i1234567890" },
                { runnerUrn: "ppb:virtualRunner:2/2.2", marketUrn: "ppb:virtualMarket:2", uniqueId: "i1234567890" },
              ],
              group: "VIRTUAL",
            },
          });

          stopSaga();
        });
      });

      describe("on BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS action", () => {
        it("should dispatch BETTING__SBK_LOAD_STORAGE_SUCCESS with betting state from storage", async () => {
          getSportsbookBettingData.mockReturnValueOnce(bettingState);
          getBetslip.mockReturnValueOnce(undefined);
          getBetslip.mockReturnValueOnce({ group: "REAL" });

          const bettingSportsbookEnsureSelectionDataSuccess = {
            type: BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS,
            payload: { ...selections },
          };

          const { putActions, dispatch, stopSaga } = setup();

          await putActions([bettingSportsbookEnsureSelectionDataSuccess]);

          expect(dispatch).toHaveBeenNthCalledWith(2, {
            type: BETTING__SBK_LOAD_STORAGE_SUCCESS,
            payload: {
              storageBettingState: bettingState,
              betslip: { group: "REAL" },
            },
          });

          stopSaga();
        });
      });

      describe("when the betslip from storage has a lastSuccessfulStake", () => {
        const betslipWithStake = { group: "REAL", lastSuccessfulStake: 50 };

        describe("when the user is logged in", () => {
          it("should dispatch BETTING__SBK_LOAD_STORAGE_SUCCESS preserving lastSuccessfulStake", async () => {
            getSportsbookBettingData.mockReturnValueOnce(bettingState);
            getBetslip.mockReturnValueOnce(undefined);
            getBetslip.mockReturnValueOnce(betslipWithStake);

            const { getState, putActions, dispatch, stopSaga } = setup();

            getState.mockReturnValue({
              entities: {
                preferences: { products: [] },
                userdetails: { loggedIn: true, countryCode: "GB" },
              },
              betting: {
                sportsbookBetting: { legs: {} },
                popularBetting: {},
              },
            });

            await putActions([
              {
                type: BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS,
                payload: { ...selections },
              },
            ]);

            expect(dispatch).toHaveBeenCalledWith({
              type: BETTING__SBK_LOAD_STORAGE_SUCCESS,
              payload: {
                storageBettingState: bettingState,
                betslip: { group: "REAL", lastSuccessfulStake: 50 },
              },
            });

            stopSaga();
          });
        });

        describe("when the user is logged out", () => {
          it("should dispatch BETTING__SBK_LOAD_STORAGE_SUCCESS with lastSuccessfulStake sanitized to undefined", async () => {
            getSportsbookBettingData.mockReturnValueOnce(bettingState);
            getBetslip.mockReturnValueOnce(undefined);
            getBetslip.mockReturnValueOnce(betslipWithStake);

            const { getState, putActions, dispatch, stopSaga } = setup();

            getState.mockReturnValue({
              entities: {
                preferences: { products: [] },
                userdetails: { loggedIn: false, countryCode: "GB" },
              },
              betting: {
                sportsbookBetting: { legs: {} },
                popularBetting: {},
              },
            });

            await putActions([
              {
                type: BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS,
                payload: { ...selections },
              },
            ]);

            expect(dispatch).toHaveBeenCalledWith({
              type: BETTING__SBK_LOAD_STORAGE_SUCCESS,
              payload: {
                storageBettingState: bettingState,
                betslip: { group: "REAL", lastSuccessfulStake: undefined },
              },
            });

            stopSaga();
          });

          it("should preserve other betslip fields when sanitizing", async () => {
            getSportsbookBettingData.mockReturnValueOnce(bettingState);
            getBetslip.mockReturnValueOnce(undefined);
            getBetslip.mockReturnValueOnce({
              group: "REAL",
              lastSuccessfulStake: 50,
              showMaxPayoutNotification: true,
            });

            const { getState, putActions, dispatch, stopSaga } = setup();

            getState.mockReturnValue({
              entities: {
                preferences: { products: [] },
                userdetails: { loggedIn: false },
              },
              betting: {
                sportsbookBetting: { legs: {} },
                popularBetting: {},
              },
            });

            await putActions([
              {
                type: BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS,
                payload: { ...selections },
              },
            ]);

            expect(dispatch).toHaveBeenCalledWith({
              type: BETTING__SBK_LOAD_STORAGE_SUCCESS,
              payload: {
                storageBettingState: bettingState,
                betslip: {
                  group: "REAL",
                  lastSuccessfulStake: undefined,
                  showMaxPayoutNotification: true,
                },
              },
            });

            stopSaga();
          });
        });
      });

      describe("on BETTING__SBK_ENSURE_SELECTION_DATA_ERROR action", () => {
        it("should not dispatch BETTING__SBK_LOAD_STORAGE_SUCCESS with betting state from storage", async () => {
          getSportsbookBettingData.mockReturnValueOnce(bettingState);
          getBetslip.mockReturnValueOnce(undefined);
          getBetslip.mockReturnValueOnce({ group: "REAL" });

          const bettingSportsbookEnsureSelectionDataError = {
            type: BETTING__SBK_ENSURE_SELECTION_DATA_ERROR,
            payload: { ...selections },
          };

          const { putActions, dispatch, stopSaga } = setup();

          await putActions([bettingSportsbookEnsureSelectionDataError]);

          expect(dispatch).not.toHaveBeenCalledWith(
            expect.objectContaining({ type: BETTING__SBK_LOAD_STORAGE_SUCCESS }),
          );

          stopSaga();
        });
      });
    });

    describe("when user has only sportsbook preference", () => {
      it("should load no state from storage", () => {
        createUserPreferencesWithProductSwitcherSelector.mockReturnValue(
          jest.fn().mockReturnValue({ products: [ProductsOption.exchange] }),
        );

        const { stopSaga, dispatch } = setup();

        expect(dispatch).toHaveBeenCalledWith({ type: MODULES__SBK_BETTING_LOADED });
        expect(getSportsbookBettingData).not.toHaveBeenCalled();

        stopSaga();
      });
    });

    describe("and loadBettingStateFromStorage gives timeout", () => {
      it("should indicate module has loaded only", async () => {
        getSportsbookBettingData.mockReturnValueOnce({
          runners: {
            1: { marketId: "1", selectionId: 1.1 },
            2: { marketId: "2", selectionId: 2.2 },
          },
        });
        getBetslip.mockReturnValueOnce(undefined);
        getBetslip.mockReturnValueOnce({ group: "REAL" });
        getTaggingMetadata.mockReturnValueOnce({
          selections: {
            "1-1.1": { uniqueId: "uniqueId1" },
            "2-2.2": { uniqueId: "uniqueId2" },
          },
        });

        const { dispatch, stopSaga, advanceTimersByTime } = setup();

        await advanceTimersByTime(10000);
        expect(dispatch).toHaveBeenCalledWith({ type: MODULES__SBK_BETTING_LOADED });

        stopSaga();
      });
    });
  });
});
