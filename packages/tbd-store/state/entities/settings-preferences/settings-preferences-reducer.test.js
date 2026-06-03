import settingsPreferencesReducer from "./settings-preferences-reducer";

const stateMock = {
  "ppb:tbd:preference:singleChoice:sportsbookOddsDisplay": {
    urn: "ppb:tbd:preference:singleChoice:sportsbookOddsDisplay",
    selectedIndex: 0,
  },
};

describe("`settingsPreferences` reducer", () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the current state", () => {
      const state = settingsPreferencesReducer(stateMock, {});
      expect(state).toEqual(stateMock);
    });
  });

  describe("when no state is provided", () => {
    it("should return initial state", () => {
      const state = settingsPreferencesReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    it('must return the new state with "settingsPreferences"', () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            PreferenceSingleChoice: [
              {
                urn: "ppb:tbd:preference:singleChoice:otherSetting",
                selectedIndex: 32,
              },
            ],
          },
        },
      };
      const state = settingsPreferencesReducer(stateMock, action);
      expect(state).toEqual({
        "ppb:tbd:preference:singleChoice:sportsbookOddsDisplay": {
          urn: "ppb:tbd:preference:singleChoice:sportsbookOddsDisplay",
          selectedIndex: 0,
        },
        "ppb:tbd:preference:singleChoice:otherSetting": {
          urn: "ppb:tbd:preference:singleChoice:otherSetting",
          selectedIndex: 32,
        },
      });
    });
  });

  describe('when action type is "UPDATE_PREFERENCE_SUCCESS"', () => {
    it('must return the new state with "settingsPreferences"', () => {
      const action = {
        type: "UPDATE_PREFERENCE_SUCCESS",
        payload: {
          settingsPreferences: {
            "ppb:tbd:preference:singleChoice:otherSetting": {
              urn: "ppb:tbd:preference:singleChoice:otherSetting",
              selectedIndex: 32,
            },
          },
        },
      };
      const state = settingsPreferencesReducer(stateMock, action);
      expect(state).toEqual({
        "ppb:tbd:preference:singleChoice:sportsbookOddsDisplay": {
          urn: "ppb:tbd:preference:singleChoice:sportsbookOddsDisplay",
          selectedIndex: 0,
        },
        "ppb:tbd:preference:singleChoice:otherSetting": {
          urn: "ppb:tbd:preference:singleChoice:otherSetting",
          selectedIndex: 32,
        },
      });
    });
  });

  describe('when action type is "UI/BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE"', () => {
    it("must return the new state with updated odds movement preference", () => {
      const action = {
        type: "UI/BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE",
        payload: {
          isOddsMovementAccepted: false,
        },
      };
      const initialState = {
        ...stateMock,
        "ppb:tbd:preference:singleChoice:oddsMovement": {
          urn: "ppb:tbd:preference:singleChoice:oddsMovement",
          preferenceValues: [{ value: "ON" }, { value: "OFF" }],
          selectedValueIndex: 0,
        },
      };
      const state = settingsPreferencesReducer(initialState, action);
      expect(state).toEqual({
        ...stateMock,
        "ppb:tbd:preference:singleChoice:oddsMovement": {
          urn: "ppb:tbd:preference:singleChoice:oddsMovement",
          preferenceValues: [{ value: "ON" }, { value: "OFF" }],
          selectedValueIndex: 1,
        },
      });
    });

    it("must return the current state if odds movement preference does not exist", () => {
      const action = {
        type: "UI/BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE",
        payload: {
          isOddsMovementAccepted: true,
        },
      };
      const state = settingsPreferencesReducer(stateMock, action);
      expect(state).toEqual(stateMock);
    });
  });
});
