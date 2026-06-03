import setupSagaMocks from "../saga-jest-setup";
import { UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE } from "../actions/betslip";
import { getUSPPreferenceMapper, getUSPStorage } from "./preference-storage-handlers";
import catalogueService from "../services/catalogue/catalogue-service";
import {
  UI__PREFERENCE_SINGLE_CHOICE_CLICK,
  UPDATE_LAST_VIEWED_PRODUCT_PREFERENCE,
  UPDATE_LAST_VIEWED_PRODUCT_PREFERENCE_SUCCESS,
} from "../actions/preferences";
import {
  UPDATE_PREFERENCE_FAILURE,
  UPDATE_PREFERENCE_IN_PROGRESS,
  UPDATE_PREFERENCE_SUCCESS,
} from "../actions/catalogue";
import { getEventRegistry } from "eventemitter3-singleton";

jest.mock("../actions/betslip", () => ({
  UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE: "FAKE_UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE",
}));
jest.mock("../actions/catalogue", () => ({}));
jest.mock("../actions/preferences", () => ({
  UI__PREFERENCE_SINGLE_CHOICE_CLICK: "FAKE_UI__PREFERENCE_SINGLE_CHOICE_CLICK",
  UPDATE_LAST_VIEWED_PRODUCT_PREFERENCE: "FAKE_UPDATE_LAST_VIEWED_PRODUCT_PREFERENCE",
}));
jest.mock("../actions/user-profile", () => ({
  UI__USER_PROFILE_EYE_ICON_CLICK: "FAKE_UI__USER_PROFILE_EYE_ICON_CLICK",
}));

const getSettingsPreferenceMock = jest.fn();
const getUserPreferencesMock = jest.fn();

jest.mock("./preference-storage-handlers", () => ({
  getUSPPreferenceMapper: jest.fn(),
  getUSPStorage: jest.fn(),
}));
jest.mock("../services/catalogue/catalogue-service", () => ({
  setSingleChoicePreference: jest.fn(),
  setExchangeDefaultProductPreference: jest.fn(),
  setConfirmCashoutPreference: jest.fn(),
  setDefaultProductPreference: jest.fn(),
  setLastViewedProductPreference: jest.fn(),
  setUserProductsPreference: jest.fn(),
}));
jest.mock("../state/entities/settings-preferences/settings-preferences-selectors", () => ({
  createSettingsPreferenceSelector: jest.fn(() => getSettingsPreferenceMock),
}));
jest.mock("../state/entities/user-preferences/user-preferences-selectors", () => ({
  createUserPreferencesWithProductSwitcherSelector: jest.fn(() => getUserPreferencesMock),
}));

const nameMock = "randomPreferenceInUSP";
const valueMock = "randomPreferenceInUSP_value";
const identifierMock = "randomPreferenceTBD";
const identifierValueMock = "randomPreferenceTBD_value";
const preferenceMock = {
  name: nameMock,
  value: valueMock,
  identifier: identifierMock,
  identifierValue: identifierValueMock,
};
const singleChoicePreferenceMock = { urn: "fakeUrn", value: "fakeValue" };
const setSingleChoicePreferenceMock = {
  settingsPreferences: {
    "ppb:tbd:preference:singleChoice:sportsbookOddsDisplay": {
      urn: "ppb:tbd:preference:singleChoice:sportsbookOddsDisplay",
      preferenceKey: "sportsbookOddsDisplay",
      preferenceValues: [
        {
          value: "FRACTIONAL",
          translationKey: "I18N.PREFERENCES.SPORTSBOOK_ODDS_DISPLAY.FRACTIONAL",
        },
        {
          value: "DECIMAL",
          translationKey: "I18N.PREFERENCES.SPORTSBOOK_ODDS_DISPLAY.DECIMAL",
        },
      ],
      selectedValueIndex: 1,
      typename: "PreferenceSingleChoice",
    },
  },
  userPreferences: {
    sportsbookOddsDisplay: "DECIMAL",
  },
};

const exchangeDefaultProductPreferenceMock = { urn: "fakeUrn:exchangeDefaultProduct", value: "neme" };
const setExchangeDefaultProductPreferenceMock = {
  settingsPreferences: {
    "ppb:tbd:preference:singleChoice:exchangeDefaultProduct": {
      urn: "ppb:tbd:preference:singleChoice:exchangeDefaultProduct",
      preferenceKey: "exchangeDefaultProduct",
      preferenceValues: [
        {
          value: "ems",
          translationKey: "ems",
        },
        {
          value: "neme",
          translationKey: "neme",
        },
      ],
      selectedValueIndex: 1,
      typename: "PreferenceSingleChoice",
    },
  },
  userPreferences: {
    exchangeDefaultProduct: "neme",
  },
};

const defaultProductPreferenceMock = { urn: "fakeUrn:defaultProduct", value: "sportsbook" };
const setDefaultProductPreferenceMock = {
  settingsPreferences: {
    "ppb:tbd:preference:singleChoice:defaultProduct": {
      urn: "ppb:tbd:preference:singleChoice:defaultProduct",
      preferenceKey: "defaultProduct",
      preferenceValues: [
        {
          value: "last_viewed",
          translationKey: "I18N.PREFERENCES.DEFAULT_PRODUCT.LAST_VIEWED",
        },
        {
          value: "sportsbook",
          translationKey: "I18N.PREFERENCES.DEFAULT_PRODUCT.SPORTSBOOK",
        },
        {
          value: "exchange",
          translationKey: "I18N.PREFERENCES.DEFAULT_PRODUCT.EXCHANGE",
        },
      ],
      selectedValueIndex: 1,
      typename: "PreferenceSingleChoice",
    },
  },
  userPreferences: {
    defaultProduct: "sportsbook",
  },
};

const lastViewedProductPreferenceMock = { urn: "fakeUrn:lastViewedProduct", value: "sportsbook" };
const setLastViewedProductPreferenceMock = {
  settingsPreferences: {
    "ppb:tbd:preference:singleChoice:lastViewedProduct": {
      urn: "ppb:tbd:preference:singleChoice:lastViewedProduct",
      preferenceKey: "lastViewedProduct",
      preferenceValues: [
        {
          value: "sportsbook",
          translationKey: "I18N.PREFERENCES.DEFAULT_PRODUCT.SPORTSBOOK",
        },
        {
          value: "exchange",
          translationKey: "I18N.PREFERENCES.DEFAULT_PRODUCT.EXCHANGE",
        },
      ],
      selectedValueIndex: 1,
      typename: "PreferenceSingleChoice",
    },
  },
  userPreferences: {
    lastViewedProduct: "sportsbook",
  },
};

const userProductsPreferenceMock = { urn: "fakeUrn:products", value: "sportsbook" };
const setUserProductsPreferenceMock = {
  settingsPreferences: {
    "ppb:tbd:preference:singleChoice:products": {
      urn: "ppb:tbd:preference:singleChoice:products",
      preferenceKey: "products",
      preferenceValues: [
        {
          value: "sportsbook",
          translationKey: "I18N.SPORTSBOOK",
        },
        {
          value: "exchange",
          translationKey: "I18N.EXCHANGE",
        },
      ],
      selectedValueIndex: 0,
      typename: "PreferenceSingleChoice",
    },
  },
  userPreferences: {
    products: ["sportsbook", "games"],
  },
};

const confirmCashoutPreferenceMock = { urn: "fakeUrn:confirmCashout", value: "ON" };
const setConfirmCashoutPreferenceMock = {
  settingsPreferences: {
    "ppb:tbd:preference:singleChoice:confirmCashout": {
      urn: "ppb:tbd:preference:singleChoice:confirmCashout",
      preferenceKey: "confirmCashout",
      preferenceValues: [{ value: "ON" }, { value: "OFF" }],
      selectedValueIndex: 0,
    },
  },
  userPreferences: {
    confirmCashout: true,
  },
};

const exchangeDefaultProductSettingsMock = {
  urn: "fakeUrn:exchangeDefaultProduct",
  preferenceKey: "exchangeDefaultProduct",
  selectedValueIndex: 0,
  preferenceValues: [{ value: "neme" }, { value: "ems" }],
};

const defaultProductSettingsMock = {
  urn: "fakeUrn:defaultProduct",
  preferenceKey: "defaultProduct",
  selectedValueIndex: 1,
  preferenceValues: [
    {
      value: "last_viewed",
      translationKey: "I18N.PREFERENCES.DEFAULT_PRODUCT.LAST_VIEWED",
    },
    {
      value: "sportsbook",
      translationKey: "I18N.PREFERENCES.DEFAULT_PRODUCT.SPORTSBOOK",
    },
    {
      value: "exchange",
      translationKey: "I18N.PREFERENCES.DEFAULT_PRODUCT.EXCHANGE",
    },
  ],
};

const userProductsSettingsMock = {
  urn: "fakeUrn:products",
  preferenceKey: "products",
  selectedValueIndex: 0,
  preferenceValues: [{ value: "sportsbook" }, { value: "exchange" }],
};

const userProductsPreferencesMock = {
  products: ["sportsbook"],
};

const stateMock = {
  entities: {
    settingspreferences: {
      "fakeUrn:exchangeDefaultProduct": exchangeDefaultProductSettingsMock,
      "fakeUrn:defaultProduct": defaultProductSettingsMock,
      "fakeUrn:lastViewedProduct": lastViewedProductPreferenceMock,
      "fakeUrn:products": userProductsSettingsMock,
    },
    throttles: {},
  },
};

const OVERRIDEN_THROTTLES = {
  throttlesOn: ["1", "2"],
  throttlesOff: ["3"],
};

jest.mock("eventemitter3-singleton", () => {
  const emit = jest.fn();
  return {
    getEventRegistry: jest.fn().mockReturnValue({ emit: emit }),
  };
});

jest.mock("../state/entities/throttles/throttles-selectors", () => ({
  getOverridenThrottles: jest.fn(() => OVERRIDEN_THROTTLES),
}));

function setup() {
  let saga;
  jest.isolateModules(() => {
    ({ userPreferenceSaga: saga } = require("./preferences-saga"));
  });
  const setupSaga = setupSagaMocks(saga);

  setupSaga.getState.mockReturnValue(stateMock);

  return setupSaga;
}

describe("preferencesSaga", () => {
  beforeEach(jest.clearAllMocks);

  describe("when a recognized action is dispatched", () => {
    describe("when the action is 'UI/BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE'", () => {
      it("should retrieve the mapper for the action", async () => {
        const { putActions, stopSaga } = setup();

        const setPreferenceAction = {
          type: UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE,
          payload: preferenceMock,
        };

        await putActions([setPreferenceAction]);

        expect(getUSPPreferenceMapper).toHaveBeenCalledWith(UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE);

        stopSaga();
      });

      it("should call save for usp storage with the preference", async () => {
        const mapperMock = jest.fn().mockReturnValue("mapped pref");
        const saveMock = jest.fn();
        getUSPPreferenceMapper.mockReturnValue(mapperMock);
        getUSPStorage.mockReturnValue({ save: saveMock });
        const { putActions, stopSaga } = setup();

        const setPreferenceAction = {
          type: UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE,
          payload: preferenceMock,
        };

        await putActions([setPreferenceAction]);

        expect(getUSPStorage).toHaveBeenCalled();
        expect(saveMock).toHaveBeenCalledWith("mapped pref");

        stopSaga();
      });
    });
  });

  describe("when the action is 'UI/PREFERENCE_SINGLE_CHOICE_CLICK'", () => {
    describe("when the single choice preference is generic", () => {
      it('should dispatch a "UPDATE_PREFERENCE_IN_PROGRESS" action', async () => {
        const { putActions, dispatch, stopSaga } = setup();

        const setSingleChoicePreferenceAction = {
          type: UI__PREFERENCE_SINGLE_CHOICE_CLICK,
          payload: singleChoicePreferenceMock,
        };

        await putActions([setSingleChoicePreferenceAction]);

        expect(dispatch).toHaveBeenCalledWith({
          payload: "fakeUrn",
          type: UPDATE_PREFERENCE_IN_PROGRESS,
        });
        stopSaga();
      });

      it("should call catalogue setSingleChoicePreference with correct values", async () => {
        const { putActions, stopSaga } = setup();

        const setSingleChoicePreferenceAction = {
          type: UI__PREFERENCE_SINGLE_CHOICE_CLICK,
          payload: singleChoicePreferenceMock,
        };

        await putActions([setSingleChoicePreferenceAction]);

        expect(catalogueService.setSingleChoicePreference).toHaveBeenCalledWith(
          "fakeUrn",
          "fakeValue",
          OVERRIDEN_THROTTLES,
        );

        stopSaga();
      });

      describe("when CatalogueService setSingleChoicePreference returns successfully", () => {
        describe("when the response has a preference item with all the fields", () => {
          it('should dispatch a "UPDATE_PREFERENCE_SUCCESS" action', async () => {
            catalogueService.setSingleChoicePreference.mockReturnValue(setSingleChoicePreferenceMock);
            const { putActions, dispatch, stopSaga } = setup();
            const { emit } = getEventRegistry();

            const setSingleChoicePreferenceAction = {
              type: UI__PREFERENCE_SINGLE_CHOICE_CLICK,
              payload: singleChoicePreferenceMock,
            };

            await putActions([setSingleChoicePreferenceAction]);

            expect(dispatch).toHaveBeenCalledWith({
              payload: {
                ...setSingleChoicePreferenceMock,
              },
              type: UPDATE_PREFERENCE_SUCCESS,
            });
            expect(emit).toHaveBeenCalledWith("@@SYNC/UPDATE_SINGLE_CHOICE_PREFERENCE", {});
            stopSaga();
          });
        });
      });

      describe("when CatalogueService setSingleChoicePreference throws an error", () => {
        it('should dispatch a "UPDATE_PREFERENCE_FAILURE" action', async () => {
          const { emit } = getEventRegistry();
          catalogueService.setSingleChoicePreference.mockRejectedValue(new Error("mock error"));
          const { putActions, dispatch, stopSaga } = setup();

          const setSingleChoicePreferenceAction = {
            type: UI__PREFERENCE_SINGLE_CHOICE_CLICK,
            payload: singleChoicePreferenceMock,
          };

          await putActions([setSingleChoicePreferenceAction]);

          expect(dispatch).toHaveBeenCalledWith({
            payload: {
              entityURN: "fakeUrn",
              errorDetail: {
                translate: {
                  key: "I18N.BETTING_PREFS.ERROR_MESSAGE_DESC",
                },
              },
              errorMessage: {
                translate: {
                  key: "I18N.BETTING_PREFS.ERROR_MESSAGE_TITLE",
                },
              },
            },
            type: UPDATE_PREFERENCE_FAILURE,
          });
          expect(emit).not.toHaveBeenCalled();
          stopSaga();
        });
      });

      describe("when CatalogueService setSingleChoicePreference does not retrieve a response", () => {
        describe("when urn and value are the same as previous call", () => {
          it("should call catalogue setSingleChoicePreference only once with correct values", async () => {
            const { putActions, stopSaga } = setup();

            const setSingleChoicePreferenceAction = {
              type: UI__PREFERENCE_SINGLE_CHOICE_CLICK,
              payload: singleChoicePreferenceMock,
            };

            await putActions([
              setSingleChoicePreferenceAction,
              setSingleChoicePreferenceAction,
              setSingleChoicePreferenceAction,
            ]);

            expect(catalogueService.setSingleChoicePreference).toHaveBeenCalledTimes(1);
            expect(catalogueService.setSingleChoicePreference).toHaveBeenCalledWith(
              "fakeUrn",
              "fakeValue",
              OVERRIDEN_THROTTLES,
            );
            stopSaga();
          });
        });

        describe("when urn and value are not the same as previous call", () => {
          it("should call catalogue setSingleChoicePreference only once with correct values", async () => {
            const { putActions, stopSaga } = setup();

            const setSingleChoicePreferenceAction = {
              type: UI__PREFERENCE_SINGLE_CHOICE_CLICK,
              payload: singleChoicePreferenceMock,
            };
            const setAnotherSingleChoicePreferenceAction = {
              type: UI__PREFERENCE_SINGLE_CHOICE_CLICK,
              payload: { urn: "fakeUrn", value: "anotherFakeValue" },
            };

            await putActions([
              setSingleChoicePreferenceAction,
              setSingleChoicePreferenceAction,
              setAnotherSingleChoicePreferenceAction,
              setAnotherSingleChoicePreferenceAction,
            ]);

            expect(catalogueService.setSingleChoicePreference).toHaveBeenCalledTimes(2);
            expect(catalogueService.setSingleChoicePreference).toHaveBeenCalledWith(
              "fakeUrn",
              "anotherFakeValue",
              OVERRIDEN_THROTTLES,
            );
            stopSaga();
          });
        });
      });
    });

    describe("when the single choice preference is exchangeDefaultProduct", () => {
      it('should dispatch a "UPDATE_PREFERENCE_IN_PROGRESS" action', async () => {
        const { putActions, dispatch, stopSaga } = setup();

        const setSingleChoicePreferenceAction = {
          type: UI__PREFERENCE_SINGLE_CHOICE_CLICK,
          payload: exchangeDefaultProductPreferenceMock,
        };

        await putActions([setSingleChoicePreferenceAction]);

        expect(dispatch).toHaveBeenCalledWith({
          payload: "fakeUrn:exchangeDefaultProduct",
          type: UPDATE_PREFERENCE_IN_PROGRESS,
        });
        stopSaga();
      });

      it("should call catalogue setExchangeDefaultProductPreference with correct values", async () => {
        const { putActions, stopSaga, getState } = setup();

        getSettingsPreferenceMock.mockImplementation((settingsPreferences, urn) => {
          if (urn.includes("exchangeDefaultProduct")) {
            return exchangeDefaultProductSettingsMock;
          }
          return userProductsSettingsMock;
        });
        getState.mockReturnValue(stateMock);
        const setSingleChoicePreferenceAction = {
          type: UI__PREFERENCE_SINGLE_CHOICE_CLICK,
          payload: exchangeDefaultProductPreferenceMock,
        };

        await putActions([setSingleChoicePreferenceAction]);

        expect(catalogueService.setExchangeDefaultProductPreference).toHaveBeenCalledWith(
          "ppb:tbd:preference:exchangeDefaultProduct:ExchangeDefaultProduct",
          "neme",
          {
            preferenceKey: "exchangeDefaultProduct",
            preferenceValues: [{ value: "neme" }, { value: "ems" }],
            selectedValueIndex: 0,
            urn: "fakeUrn:exchangeDefaultProduct",
          },
          OVERRIDEN_THROTTLES,
        );
        stopSaga();
      });

      describe("when CatalogueService setExchangeDefaultProductPreference returns successfully", () => {
        describe("when the response has a preference item with all the fields", () => {
          it('should dispatch a "UPDATE_PREFERENCE_SUCCESS" action', async () => {
            const { putActions, dispatch, getState, stopSaga } = setup();

            catalogueService.setExchangeDefaultProductPreference.mockReturnValue(
              setExchangeDefaultProductPreferenceMock,
            );
            getSettingsPreferenceMock.mockImplementation((settingsPreferences, urn) => {
              if (urn.includes("exchangeDefaultProduct")) {
                return exchangeDefaultProductSettingsMock;
              }
              return userProductsSettingsMock;
            });
            getState.mockReturnValue(stateMock);

            const setSingleChoicePreferenceAction = {
              type: UI__PREFERENCE_SINGLE_CHOICE_CLICK,
              payload: exchangeDefaultProductPreferenceMock,
            };

            await putActions([setSingleChoicePreferenceAction]);

            expect(dispatch).toHaveBeenCalledWith({
              payload: {
                ...setExchangeDefaultProductPreferenceMock,
              },
              type: UPDATE_PREFERENCE_SUCCESS,
            });
            stopSaga();
          });
        });
      });
    });

    describe("when the single choice preference is confirmCashout", () => {
      const setSingleChoicePreferenceAction = {
        type: UI__PREFERENCE_SINGLE_CHOICE_CLICK,
        payload: confirmCashoutPreferenceMock,
      };

      it('should dispatch a "UPDATE_PREFERENCE_IN_PROGRESS" action', async () => {
        const { putActions, dispatch, stopSaga } = setup();

        await putActions([setSingleChoicePreferenceAction]);

        expect(dispatch).toHaveBeenCalledWith({
          type: UPDATE_PREFERENCE_IN_PROGRESS,
          payload: "fakeUrn:confirmCashout",
        });

        stopSaga();
      });

      it("should call catalogue setConfirmCashoutPreference with correct values", async () => {
        const { putActions, stopSaga, getState } = setup();

        getSettingsPreferenceMock.mockReturnValue(confirmCashoutPreferenceMock);
        getState.mockReturnValue(stateMock);

        await putActions([setSingleChoicePreferenceAction]);

        expect(catalogueService.setConfirmCashoutPreference).toHaveBeenCalledWith(
          "ppb:tbd:preference:confirmCashout:confirmCashout",
          true,
          confirmCashoutPreferenceMock,
          OVERRIDEN_THROTTLES,
        );

        stopSaga();
      });

      describe("when CatalogueService setConfirmCashoutPreference returns successfully", () => {
        describe("when the response has a preference item with all the fields", () => {
          it('should dispatch a "UPDATE_PREFERENCE_SUCCESS" action', async () => {
            const { putActions, dispatch, stopSaga } = setup();

            catalogueService.setConfirmCashoutPreference.mockReturnValue(setConfirmCashoutPreferenceMock);

            await putActions([setSingleChoicePreferenceAction]);

            expect(dispatch).toHaveBeenCalledWith({
              payload: setConfirmCashoutPreferenceMock,
              type: UPDATE_PREFERENCE_SUCCESS,
            });
            stopSaga();
          });
        });
      });
    });

    describe("when the single choice preference is defaultProduct", () => {
      const setSingleChoicePreferenceAction = {
        type: UI__PREFERENCE_SINGLE_CHOICE_CLICK,
        payload: defaultProductPreferenceMock,
      };

      it('should dispatch a "UPDATE_PREFERENCE_IN_PROGRESS" action', async () => {
        const { putActions, dispatch, stopSaga } = setup();

        await putActions([setSingleChoicePreferenceAction]);

        expect(dispatch).toHaveBeenCalledWith({
          type: UPDATE_PREFERENCE_IN_PROGRESS,
          payload: "fakeUrn:defaultProduct",
        });

        stopSaga();
      });

      it("should call catalogue setDefaultProductPreference with correct values", async () => {
        const { putActions, stopSaga, getState } = setup();

        getSettingsPreferenceMock.mockReturnValue(defaultProductPreferenceMock);
        getState.mockReturnValue(stateMock);

        await putActions([setSingleChoicePreferenceAction]);

        expect(catalogueService.setDefaultProductPreference).toHaveBeenCalledWith(
          "ppb:tbd:preference:defaultProduct:DefaultProduct",
          "sportsbook",
          {
            urn: "fakeUrn:defaultProduct",
            value: "sportsbook",
          },
          OVERRIDEN_THROTTLES,
        );

        stopSaga();
      });

      describe("when CatalogueService setDefaultProductPreference returns successfully", () => {
        describe("when the response has a preference item with all the fields", () => {
          it('should dispatch a "UPDATE_PREFERENCE_SUCCESS" action', async () => {
            const { putActions, dispatch, getState, stopSaga } = setup();

            catalogueService.setDefaultProductPreference.mockReturnValue(setDefaultProductPreferenceMock);
            getState.mockReturnValue(stateMock);

            await putActions([setSingleChoicePreferenceAction]);

            expect(dispatch).toHaveBeenCalledWith({
              type: UPDATE_PREFERENCE_SUCCESS,
              payload: setDefaultProductPreferenceMock,
            });

            stopSaga();
          });
        });
      });
    });

    describe("when the single choice preference is lastViewedProduct", () => {
      const setLastViewedProductPreferenceAction = {
        type: UPDATE_LAST_VIEWED_PRODUCT_PREFERENCE,
        payload: lastViewedProductPreferenceMock,
      };

      it("should call catalogue setLastViewedProductPreference with correct values", async () => {
        const { putActions, stopSaga } = setup();

        await putActions([setLastViewedProductPreferenceAction]);

        expect(catalogueService.setLastViewedProductPreference).toHaveBeenCalledWith(
          lastViewedProductPreferenceMock.urn,
          lastViewedProductPreferenceMock.value,
          OVERRIDEN_THROTTLES,
        );

        stopSaga();
      });

      describe("when CatalogueService setLastViewedProductPreference returns successfully", () => {
        describe("when the response has a preference item with all the fields", () => {
          it('should dispatch a "UPDATE_LAST_VIEWED_PRODUCT_PREFERENCE_SUCCESS" action', async () => {
            const { putActions, dispatch, stopSaga } = setup();

            catalogueService.setLastViewedProductPreference.mockReturnValue(setLastViewedProductPreferenceMock);

            await putActions([setLastViewedProductPreferenceAction]);

            expect(dispatch).toHaveBeenCalledWith({
              type: UPDATE_LAST_VIEWED_PRODUCT_PREFERENCE_SUCCESS,
              payload: {
                lastViewedProductPreference: setLastViewedProductPreferenceMock,
              },
            });

            stopSaga();
          });
        });
      });
    });

    describe("when CatalogueService setExchangeDefaultProductPreference throws an error", () => {
      it('should dispatch a "UPDATE_PREFERENCE_FAILURE" action', async () => {
        const { putActions, dispatch, getState, stopSaga } = setup();

        catalogueService.setExchangeDefaultProductPreference.mockRejectedValue(new Error("mock error"));
        getSettingsPreferenceMock.mockReturnValue(exchangeDefaultProductSettingsMock);
        getState.mockReturnValue(stateMock);

        const setSingleChoicePreferenceAction = {
          type: UI__PREFERENCE_SINGLE_CHOICE_CLICK,
          payload: exchangeDefaultProductPreferenceMock,
        };

        await putActions([setSingleChoicePreferenceAction]);

        expect(dispatch).toHaveBeenCalledWith({
          payload: {
            entityURN: "fakeUrn:exchangeDefaultProduct",
            errorDetail: {
              translate: {
                key: "I18N.BETTING_PREFS.ERROR_MESSAGE_DESC",
              },
            },
            errorMessage: {
              translate: {
                key: "I18N.BETTING_PREFS.ERROR_MESSAGE_TITLE",
              },
            },
          },
          type: UPDATE_PREFERENCE_FAILURE,
        });
        stopSaga();
      });
    });

    describe("when CatalogueService setExchangeDefaultProductPreference does not retrieve a response", () => {
      describe("when urn and value are the same as previous call", () => {
        it("should call catalogue setExchangeDefaultProductPreference only once with correct values", async () => {
          const { putActions, getState, stopSaga } = setup();

          getSettingsPreferenceMock.mockImplementation((settingsPreferences, urn) => {
            if (urn.includes("exchangeDefaultProduct")) {
              return exchangeDefaultProductSettingsMock;
            }
            return userProductsSettingsMock;
          });
          getState.mockReturnValue(stateMock);

          const setSingleChoicePreferenceAction = {
            type: UI__PREFERENCE_SINGLE_CHOICE_CLICK,
            payload: exchangeDefaultProductPreferenceMock,
          };

          await putActions([
            setSingleChoicePreferenceAction,
            setSingleChoicePreferenceAction,
            setSingleChoicePreferenceAction,
          ]);

          expect(catalogueService.setExchangeDefaultProductPreference).toHaveBeenCalledTimes(1);
          expect(catalogueService.setExchangeDefaultProductPreference).toHaveBeenCalledWith(
            "ppb:tbd:preference:exchangeDefaultProduct:ExchangeDefaultProduct",
            "neme",
            {
              preferenceKey: "exchangeDefaultProduct",
              preferenceValues: [{ value: "neme" }, { value: "ems" }],
              selectedValueIndex: 0,
              urn: "fakeUrn:exchangeDefaultProduct",
            },
            OVERRIDEN_THROTTLES,
          );
          stopSaga();
        });
      });

      describe("when urn and value are not the same as previous call", () => {
        it("should call catalogue setExchangeDefaultProductPreference only once with correct values", async () => {
          const { putActions, getState, stopSaga } = setup();

          getSettingsPreferenceMock.mockImplementation((settingsPreferences, urn) => {
            if (urn.includes("exchangeDefaultProduct")) {
              return exchangeDefaultProductSettingsMock;
            }
            return userProductsSettingsMock;
          });
          getState.mockReturnValue(stateMock);

          const setSingleChoicePreferenceAction = {
            type: UI__PREFERENCE_SINGLE_CHOICE_CLICK,
            payload: exchangeDefaultProductPreferenceMock,
          };
          const setAnotherSingleChoicePreferenceAction = {
            type: UI__PREFERENCE_SINGLE_CHOICE_CLICK,
            payload: { urn: "fakeUrn:exchangeDefaultProduct", value: "ems" },
          };

          await putActions([setSingleChoicePreferenceAction, setSingleChoicePreferenceAction]);
          await putActions([setAnotherSingleChoicePreferenceAction, setAnotherSingleChoicePreferenceAction]);

          expect(catalogueService.setExchangeDefaultProductPreference).toHaveBeenCalledTimes(2);
          expect(catalogueService.setExchangeDefaultProductPreference).toHaveBeenCalledWith(
            "ppb:tbd:preference:exchangeDefaultProduct:ExchangeDefaultProduct",
            "neme",
            {
              preferenceKey: "exchangeDefaultProduct",
              preferenceValues: [{ value: "neme" }, { value: "ems" }],
              selectedValueIndex: 0,
              urn: "fakeUrn:exchangeDefaultProduct",
            },
            OVERRIDEN_THROTTLES,
          );
          expect(catalogueService.setExchangeDefaultProductPreference).toHaveBeenCalledWith(
            "ppb:tbd:preference:exchangeDefaultProduct:ExchangeDefaultProduct",
            "ems",
            {
              preferenceKey: "exchangeDefaultProduct",
              preferenceValues: [{ value: "neme" }, { value: "ems" }],
              selectedValueIndex: 0,
              urn: "fakeUrn:exchangeDefaultProduct",
            },
            OVERRIDEN_THROTTLES,
          );
          stopSaga();
        });
      });
    });

    describe("when the single choice preference is userProducts", () => {
      it('should dispatch a "UPDATE_PREFERENCE_IN_PROGRESS" action', async () => {
        const { putActions, dispatch, stopSaga } = setup();

        const setSingleChoicePreferenceAction = {
          type: UI__PREFERENCE_SINGLE_CHOICE_CLICK,
          payload: userProductsPreferenceMock,
        };

        await putActions([setSingleChoicePreferenceAction]);

        expect(dispatch).toHaveBeenCalledWith({
          payload: "fakeUrn:products",
          type: UPDATE_PREFERENCE_IN_PROGRESS,
        });
        stopSaga();
      });

      it("should call catalogue setUserProductsPreference with correct values", async () => {
        const { putActions, stopSaga, getState } = setup();

        getSettingsPreferenceMock.mockReturnValue(userProductsSettingsMock);
        getUserPreferencesMock.mockReturnValue(userProductsPreferencesMock);
        getState.mockReturnValue(stateMock);

        const setSingleChoicePreferenceAction = {
          type: UI__PREFERENCE_SINGLE_CHOICE_CLICK,
          payload: userProductsPreferenceMock,
        };

        await putActions([setSingleChoicePreferenceAction]);

        expect(catalogueService.setUserProductsPreference).toHaveBeenCalledWith(
          "ppb:tbd:preference:userProducts:UserProducts",
          "sportsbook",
          {
            preferenceKey: "products",
            preferenceValues: [{ value: "sportsbook" }, { value: "exchange" }],
            selectedValueIndex: 0,
            urn: "fakeUrn:products",
          },
          ["sportsbook"],
          OVERRIDEN_THROTTLES,
        );
        stopSaga();
      });

      describe("when CatalogueService setUserProductsPreference returns successfully", () => {
        describe("when the response has a preference item with all the fields", () => {
          it('should dispatch a "UPDATE_PREFERENCE_SUCCESS" action', async () => {
            const { putActions, dispatch, getState, stopSaga } = setup();

            catalogueService.setUserProductsPreference.mockReturnValue(setUserProductsPreferenceMock);
            getSettingsPreferenceMock.mockReturnValue(userProductsSettingsMock);
            getState.mockReturnValue(stateMock);

            const setSingleChoicePreferenceAction = {
              type: UI__PREFERENCE_SINGLE_CHOICE_CLICK,
              payload: userProductsPreferenceMock,
            };

            await putActions([setSingleChoicePreferenceAction]);

            expect(dispatch).toHaveBeenCalledWith({
              payload: {
                ...setUserProductsPreferenceMock,
              },
              type: UPDATE_PREFERENCE_SUCCESS,
            });
            stopSaga();
          });
        });
      });

      describe("when CatalogueService setUserProductsPreference throws an error", () => {
        it('should dispatch a "UPDATE_PREFERENCE_FAILURE" action', async () => {
          const { putActions, dispatch, getState, stopSaga } = setup();

          catalogueService.setUserProductsPreference.mockRejectedValue(new Error("mock error"));
          getSettingsPreferenceMock.mockReturnValue(userProductsSettingsMock);
          getState.mockReturnValue(stateMock);

          const setSingleChoicePreferenceAction = {
            type: UI__PREFERENCE_SINGLE_CHOICE_CLICK,
            payload: userProductsPreferenceMock,
          };

          await putActions([setSingleChoicePreferenceAction]);

          expect(dispatch).toHaveBeenCalledWith({
            payload: {
              entityURN: "fakeUrn:products",
              errorDetail: {
                translate: {
                  key: "I18N.BETTING_PREFS.ERROR_MESSAGE_DESC",
                },
              },
              errorMessage: {
                translate: {
                  key: "I18N.BETTING_PREFS.ERROR_MESSAGE_TITLE",
                },
              },
            },
            type: UPDATE_PREFERENCE_FAILURE,
          });
          stopSaga();
        });
      });

      describe("when CatalogueService setUserProductsPreference does not retrieve a response", () => {
        describe("when urn and value are the same as previous call", () => {
          it("should call catalogue setUserProductsPreference only once with correct values", async () => {
            const { putActions, getState, stopSaga } = setup();

            getSettingsPreferenceMock.mockReturnValue(userProductsSettingsMock);
            getState.mockReturnValue(stateMock);

            const setSingleChoicePreferenceAction = {
              type: UI__PREFERENCE_SINGLE_CHOICE_CLICK,
              payload: userProductsPreferenceMock,
            };

            await putActions([
              setSingleChoicePreferenceAction,
              setSingleChoicePreferenceAction,
              setSingleChoicePreferenceAction,
            ]);

            expect(catalogueService.setUserProductsPreference).toHaveBeenCalledTimes(1);
            expect(catalogueService.setUserProductsPreference).toHaveBeenCalledWith(
              "ppb:tbd:preference:userProducts:UserProducts",
              "sportsbook",
              {
                preferenceKey: "products",
                preferenceValues: [{ value: "sportsbook" }, { value: "exchange" }],
                selectedValueIndex: 0,
                urn: "fakeUrn:products",
              },
              ["sportsbook"],
              OVERRIDEN_THROTTLES,
            );
            stopSaga();
          });
        });

        describe("when urn and value are not the same as previous call", () => {
          it("should call catalogue setUserProductsPreference only once with correct values", async () => {
            const { putActions, getState, stopSaga } = setup();

            getSettingsPreferenceMock.mockReturnValue(userProductsSettingsMock);
            getState.mockReturnValue(stateMock);

            const setSingleChoicePreferenceAction = {
              type: UI__PREFERENCE_SINGLE_CHOICE_CLICK,
              payload: userProductsPreferenceMock,
            };
            const setAnotherSingleChoicePreferenceAction = {
              type: UI__PREFERENCE_SINGLE_CHOICE_CLICK,
              payload: { urn: "fakeUrn:products", value: "exchange" },
            };

            await putActions([setSingleChoicePreferenceAction, setSingleChoicePreferenceAction]);
            await putActions([setAnotherSingleChoicePreferenceAction, setAnotherSingleChoicePreferenceAction]);

            expect(catalogueService.setUserProductsPreference).toHaveBeenCalledTimes(2);
            expect(catalogueService.setUserProductsPreference).toHaveBeenCalledWith(
              "ppb:tbd:preference:userProducts:UserProducts",
              "sportsbook",
              {
                preferenceKey: "products",
                preferenceValues: [{ value: "sportsbook" }, { value: "exchange" }],
                selectedValueIndex: 0,
                urn: "fakeUrn:products",
              },
              ["sportsbook"],
              OVERRIDEN_THROTTLES,
            );
            expect(catalogueService.setUserProductsPreference).toHaveBeenCalledWith(
              "ppb:tbd:preference:userProducts:UserProducts",
              "exchange",
              {
                preferenceKey: "products",
                preferenceValues: [{ value: "sportsbook" }, { value: "exchange" }],
                selectedValueIndex: 0,
                urn: "fakeUrn:products",
              },
              ["sportsbook"],
              OVERRIDEN_THROTTLES,
            );
            stopSaga();
          });
        });
      });
    });
  });

  describe("when a unrecognized action is dispatched", () => {
    it("should retrieve the mapper for the action", async () => {
      getUSPPreferenceMapper.mockReturnValue(undefined);
      const { putActions, stopSaga } = setup();

      const setPreferenceAction = {
        type: UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE,
        payload: preferenceMock,
      };

      await putActions([setPreferenceAction]);

      expect(getUSPPreferenceMapper).toHaveBeenCalledWith(UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE);

      stopSaga();
    });

    it("should not call save for usp storage", async () => {
      const saveMock = jest.fn();
      getUSPPreferenceMapper.mockReturnValue(undefined);
      getUSPStorage.mockReturnValue({ save: saveMock });
      const { putActions, stopSaga } = setup();

      const setPreferenceAction = {
        type: UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE,
        payload: preferenceMock,
      };

      await putActions([setPreferenceAction]);

      expect(getUSPStorage).not.toHaveBeenCalled();
      expect(saveMock).not.toHaveBeenCalled();

      stopSaga();
    });
  });
});
