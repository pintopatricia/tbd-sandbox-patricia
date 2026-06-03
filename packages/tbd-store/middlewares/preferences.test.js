import { LastViewedProductOption, ProductsOption } from "../state/entities";

import { NETWORK__FETCH_APP_CONTEXT_SUCCESS } from "../actions/app-context";
import { PAGE_LOAD_SUCCESS } from "../actions/catalogue";
import { UPDATE_LAST_VIEWED_PRODUCT_PREFERENCE, UPDATE_PRODUCT_PREFERENCE } from "../actions/preferences";
import { mapProductsOptionToLastViewedProductOption } from "../helpers/preferences";

import { preferencesMiddleware } from "./preferences";

const getThrottle = jest.fn();
const getLastViewedProduct = jest.fn();
const getProductPreference = jest.fn();
const getUserPreferencesProducts = jest.fn();

jest.mock("../actions/catalogue", () => ({
  PAGE_LOAD_SUCCESS: "FAKE_PAGE_LOAD_SUCCESS",
}));

jest.mock("../actions/preferences", () => ({
  UPDATE_LAST_VIEWED_PRODUCT_PREFERENCE: "FAKE_UPDATE_LAST_VIEWED_PRODUCT_PREFERENCE",
  UPDATE_PRODUCT_PREFERENCE: "FAKE_UPDATE_PRODUCT_PREFERENCE",
}));

jest.mock("../actions/app-context", () => ({
  NETWORK__FETCH_APP_CONTEXT_SUCCESS: "FAKE_NETWORK__FETCH_APP_CONTEXT_SUCCESS",
}));

jest.mock("../state/entities/throttles/throttles-selectors", () => ({
  createGetThrottleSelector: jest.fn(() => getThrottle),
}));

jest.mock("../state/entities/user-preferences/user-preferences-selectors", () => ({
  createLastViewedProductPreferencesSelector: jest.fn(() => getLastViewedProduct),
  createProductPreferenceWithProductSwitcherSelector: jest.fn(() => getProductPreference),
  createUserPreferencesProductsSelector: jest.fn(() => getUserPreferencesProducts),
}));

jest.mock("../helpers/preferences", () => ({
  mapProductsOptionToLastViewedProductOption: jest.fn(),
}));

const stateMock = {
  entities: {},
};

const dispatchSpy = jest.fn();
const getStateSpy = jest.fn(() => stateMock);
const nextSpy = jest.fn();
const actionMock = {
  type: "some action",
  payload: "some payload",
};

const setup = ({ dispatch = dispatchSpy, getState = getStateSpy, next = nextSpy, action = actionMock } = {}) =>
  preferencesMiddleware({ dispatch, getState })(next)(action);

describe("preferences middleware", () => {
  beforeEach(jest.clearAllMocks);

  describe("when action type is unknown", () => {
    it("should not call the dispatch function and forward action to next middlewares", () => {
      setup();

      expect(dispatchSpy).not.toHaveBeenCalled();

      expect(nextSpy).toHaveBeenCalledTimes(1);
      expect(nextSpy).toHaveBeenCalledWith(actionMock);
    });
  });

  describe("when the action type is PAGE_LOAD_SUCCESS", () => {
    const action = {
      type: PAGE_LOAD_SUCCESS,
      payload: "some urn",
    };

    describe("when the throttle EXC_ONBOARDING_JOURNEY is off", () => {
      beforeAll(() => {
        getThrottle.mockReturnValue({ isActive: false });
      });

      it("should not call the dispatch function and forward action to next middlewares", () => {
        setup({ action });

        expect(dispatchSpy).not.toHaveBeenCalled();

        expect(nextSpy).toHaveBeenCalledTimes(1);
        expect(nextSpy).toHaveBeenCalledWith(action);
      });
    });

    describe("when the throttle EXC_ONBOARDING_JOURNEY is on", () => {
      beforeAll(() => {
        getThrottle.mockReturnValue({ isActive: true });
      });

      describe("and the active product is different from the lastViewedProduct", () => {
        it("should call dispatch with the right parameters", () => {
          mapProductsOptionToLastViewedProductOption.mockReturnValue(LastViewedProductOption.sportsbook);
          getLastViewedProduct.mockReturnValue(LastViewedProductOption.exchange);

          setup({ action });

          expect(dispatchSpy).toHaveBeenCalledTimes(1);
          expect(dispatchSpy).toHaveBeenCalledWith({
            type: UPDATE_LAST_VIEWED_PRODUCT_PREFERENCE,
            payload: {
              urn: "ppb:tbd:preference:lastViewedProduct:LastViewedProduct",
              value: LastViewedProductOption.sportsbook,
            },
          });
        });
      });

      describe("and the active product is equal to the lastViewedProduct", () => {
        it("should not call the dispatch function and forward action to next middlewares", () => {
          mapProductsOptionToLastViewedProductOption.mockReturnValue(LastViewedProductOption.sportsbook);
          getLastViewedProduct.mockReturnValue(LastViewedProductOption.sportsbook);

          setup({ action });

          expect(dispatchSpy).not.toHaveBeenCalled();

          expect(nextSpy).toHaveBeenCalledTimes(1);
          expect(nextSpy).toHaveBeenCalledWith(action);
        });
      });
    });
  });

  describe("when the action type is NETWORK__FETCH_APP_CONTEXT_SUCCESS", () => {
    const action = {
      type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
      payload: {
        initialState: {
          entities: {},
        },
      },
    };

    describe("when the throttle EXC_ONBOARDING_JOURNEY is off", () => {
      beforeAll(() => {
        getThrottle.mockReturnValue({ isActive: false });
      });

      it("should not call the dispatch function and forward action to next middlewares", () => {
        setup({ action });

        expect(dispatchSpy).not.toHaveBeenCalled();

        expect(nextSpy).toHaveBeenCalledTimes(1);
        expect(nextSpy).toHaveBeenCalledWith(action);
      });
    });

    describe("when the throttle EXC_ONBOARDING_JOURNEY is on", () => {
      beforeAll(() => {
        getThrottle.mockReturnValue({ isActive: true });
      });

      describe("when the user products includes sportsbook", () => {
        beforeAll(() => {
          getUserPreferencesProducts.mockReturnValue([ProductsOption.sportsbook, ProductsOption.games]);
        });

        it("should call dispatch with the right parameters", () => {
          setup({ action });

          expect(dispatchSpy).toHaveBeenCalledTimes(1);
          expect(dispatchSpy).toHaveBeenCalledWith({
            type: UPDATE_PRODUCT_PREFERENCE,
            payload: {
              productSwitcherPreference: ProductsOption.sportsbook,
            },
          });
        });
      });

      describe("when the user products includes exchange", () => {
        beforeAll(() => {
          getUserPreferencesProducts.mockReturnValue([ProductsOption.exchange, ProductsOption.games]);
        });

        it("should call dispatch with the right parameters", () => {
          setup({ action });

          expect(dispatchSpy).toHaveBeenCalledTimes(1);
          expect(dispatchSpy).toHaveBeenCalledWith({
            type: UPDATE_PRODUCT_PREFERENCE,
            payload: {
              productSwitcherPreference: ProductsOption.exchange,
            },
          });
        });
      });
    });
  });
});
