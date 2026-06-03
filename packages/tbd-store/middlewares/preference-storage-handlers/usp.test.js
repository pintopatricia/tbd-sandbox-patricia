import { getUSPPreferenceMapper } from "./usp";
import { UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE } from "../../actions/betslip";
import { UI__USER_PROFILE_EYE_ICON_CLICK } from "../../actions/user-profile";
import setupSagaMocks from "../../saga-jest-setup";
import userSharedPreferencesService from "../../services/user-shared-preferences-service";
import { NETWORK__SET_USER_PREFERENCE_SUCCESS, NETWORK__SET_USER_PREFERENCE_FAILURE } from "../../actions/preferences";

jest.mock("../../services/user-shared-preferences-service", () => ({
  setPreference: jest.fn(() => "mockCardsResponse"),
}));

function getStorageSave() {
  let storage;
  jest.isolateModules(() => {
    storage = require("./usp").getUSPStorage();
  });
  return storage.save;
}

describe("USP Storage Handler", () => {
  beforeEach(jest.clearAllMocks);

  describe("getUSPStorage", () => {
    describe("and we successfully we update the preference", () => {
      it("should dispatch the NETWORK/SET_USER_PREFERENCE_SUCCESS actions with the correct payload", async () => {
        const preference = {
          name: "general.betAcceptance",
          value: "1",
          identifier: "oddsMovement",
          identifierValue: true,
        };
        const { dispatch, stopSaga } = setupSagaMocks(getStorageSave(), preference);

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__SET_USER_PREFERENCE_SUCCESS,
          payload: {
            identifier: "oddsMovement",
            identifierValue: true,
          },
        });

        stopSaga();
      });

      it("should call the usp setPreference service", async () => {
        const preference = {
          name: "general.betAcceptance",
          value: "1",
          identifier: "oddsMovement",
          identifierValue: true,
        };
        const { stopSaga } = setupSagaMocks(getStorageSave(), preference);

        expect(userSharedPreferencesService.setPreference).toHaveBeenCalledWith({
          "general.betAcceptance": "1",
        });

        stopSaga();
      });
    });

    describe("and we get an exception while updating the preference", () => {
      it("should dispatch NETWORK/SET_USER_PREFERENCE_FAILURE with the correct error", async () => {
        userSharedPreferencesService.setPreference.mockImplementation(() => {
          throw new Error("errorMessage");
        });
        const preference = {
          name: "general.betAcceptance",
          value: "1",
          identifier: "oddsMovement",
          identifierValue: true,
        };
        const { dispatch, stopSaga } = setupSagaMocks(getStorageSave(), preference);

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__SET_USER_PREFERENCE_FAILURE,
          error: "errorMessage",
          payload: {
            identifier: "oddsMovement",
            identifierValue: true,
          },
        });

        stopSaga();
      });
    });
  });

  describe("getUSPPreferenceMapper", () => {
    function setupPreferenceMapper(action) {
      const mapper = getUSPPreferenceMapper(action.type);

      return mapper(action);
    }

    describe("UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE", () => {
      function setupOddsMovementAction(isOddsMovementAccepted) {
        return {
          type: UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE,
          payload: {
            isOddsMovementAccepted,
          },
        };
      }

      describe("when isOddsMovementAccepted is true", () => {
        it("should map out the preference correctly", () => {
          const action = setupOddsMovementAction(true);
          const mappedPreference = setupPreferenceMapper(action);

          expect(mappedPreference).toEqual({
            name: "general.betAcceptance",
            value: "1",
            identifier: "oddsMovement",
            identifierValue: true,
          });
        });
      });

      describe("when isOddsMovementAccepted is false", () => {
        it("should map out the preference correctly", () => {
          const action = setupOddsMovementAction(false);
          const mappedPreference = setupPreferenceMapper(action);

          expect(mappedPreference).toEqual({
            name: "general.betAcceptance",
            value: "0",
            identifier: "oddsMovement",
            identifierValue: false,
          });
        });
      });
    });

    describe("UI__USER_PROFILE_EYE_ICON_CLICK", () => {
      function setupShowBalancesAction(showBalances) {
        return {
          type: UI__USER_PROFILE_EYE_ICON_CLICK,
          payload: {
            showBalances,
          },
        };
      }
      describe("when showBalances is true", () => {
        it("should map out the preference correctly", () => {
          const action = setupShowBalancesAction(true);
          const mappedPreference = setupPreferenceMapper(action);

          expect(mappedPreference).toEqual({
            name: "maw.show.balances",
            value: "1",
            identifier: "showBalances",
            identifierValue: true,
          });
        });
      });

      describe("when showBalances is false", () => {
        it("should map out the preference correctly", () => {
          const action = setupShowBalancesAction(false);
          const mappedPreference = setupPreferenceMapper(action);

          expect(mappedPreference).toEqual({
            name: "maw.show.balances",
            value: "0",
            identifier: "showBalances",
            identifierValue: false,
          });
        });
      });
    });
  });
});
