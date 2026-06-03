import setupSagaMocks from "../saga-jest-setup";
import { COOKIE_CONSENT__CATEGORIES_CHANGED } from "../actions/cookie-consent";
import { PAGE_LOAD_SUCCESS } from "../actions/catalogue";

const getActiveCategories = jest.fn();
const listenToCategoryChange = jest.fn();

const getInstance = jest.fn(() => ({
  getActiveCategories,
  listenToCategoryChange,
}));

jest.mock("cookie-consent", () => ({
  getInstance,
}));

const cookieConsentCategoriesChangedAction = {
  type: COOKIE_CONSENT__CATEGORIES_CHANGED,
  payload: ["C0001", "C0002", "C0003", "C0004"],
};

const pageloadAction = {
  type: PAGE_LOAD_SUCCESS,
};

function setup() {
  let saga;

  jest.isolateModules(() => {
    ({ cookieConsentSaga: saga } = require("./cookie-consent-saga"));
  });

  return setupSagaMocks(saga);
}

describe("cookieConsentSaga", () => {
  beforeEach(jest.clearAllMocks);

  describe("when PAGE_LOAD_SUCCESS is dispatched", () => {
    describe("and window is not defined", () => {
      it("should not call cookie-consent lib", async () => {
        global.window = undefined;

        const { putActions, stopSaga } = setup();

        await putActions([pageloadAction]);

        expect(getInstance).not.toHaveBeenCalled();

        stopSaga();
      });
    });

    describe("and window.document.cookie is not defined", () => {
      it("should not call cookie-consent lib", async () => {
        global.window = Object.create({});

        const { putActions, stopSaga } = setup();

        await putActions([pageloadAction]);

        expect(getInstance).not.toHaveBeenCalled();

        stopSaga();
      });
    });

    describe("and window.document.cookie is defined", () => {
      it("should instantiate cookie-consent lib", async () => {
        global.window.document.cookie = "myCookieData";

        const { putActions, stopSaga, getState, dispatch } = setup();

        getState.mockReturnValue({ cookieConsent: { activeCategories: [] } });
        getActiveCategories.mockReturnValue(["C0001", "C0002", "C0003", "C0004"]);

        await putActions([pageloadAction]);

        expect(getInstance).toHaveBeenCalledWith({ scope: global.window });
        expect(getActiveCategories).toHaveBeenCalled();

        expect(dispatch).toHaveBeenCalledWith(cookieConsentCategoriesChangedAction);

        expect(listenToCategoryChange).toHaveBeenCalled();

        stopSaga();
      });
    });
  });
});
