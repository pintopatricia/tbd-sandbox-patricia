import { Middleware } from "redux";

import { codecs } from "@ppb/tbd-urn-codecs";
import { ProductsOption } from "../state/entities";

import { NETWORK__FETCH_APP_CONTEXT_SUCCESS, FetchAppContextSuccessAction } from "../actions/app-context";
import { PAGE_LOAD_SUCCESS, PageLoadSuccessAction } from "../actions/catalogue";
import {
  UPDATE_LAST_VIEWED_PRODUCT_PREFERENCE,
  UPDATE_PRODUCT_PREFERENCE,
  UpdateLastViewedProductPreferenceAction,
  UpdateProductPreferenceAction,
} from "../actions/preferences";
import { createGetThrottleSelector } from "../state/entities/throttles/throttles-selectors";
import {
  createLastViewedProductPreferencesSelector,
  createProductPreferenceWithProductSwitcherSelector,
  createUserPreferencesProductsSelector,
} from "../state/entities/user-preferences/user-preferences-selectors";
import { mapProductsOptionToLastViewedProductOption } from "../helpers/preferences";
import { ApplicationState } from "../state/ApplicationState.types";

type ActionTypes = PageLoadSuccessAction | FetchAppContextSuccessAction;

export const preferencesMiddleware: Middleware<Record<string, never>, ApplicationState> =
  ({ dispatch, getState }) =>
  (next) =>
  (action: ActionTypes) => {
    const state = getState();

    switch (action.type) {
      case PAGE_LOAD_SUCCESS: {
        const getThrottle = createGetThrottleSelector();
        const isThrottleActive = getThrottle(state.entities.throttles, "EXC_ONBOARDING_JOURNEY")?.isActive;

        if (!isThrottleActive) {
          break;
        }

        const getLastViewedProduct = createLastViewedProductPreferencesSelector();
        const getProductPreference = createProductPreferenceWithProductSwitcherSelector();
        const lastViewedProduct = getLastViewedProduct(state.entities.preferences);
        const activeProduct = getProductPreference(state.entities.preferences);

        const mappedActiveProduct = mapProductsOptionToLastViewedProductOption(activeProduct);

        if (!mappedActiveProduct || mappedActiveProduct === lastViewedProduct) {
          break;
        }

        dispatch<UpdateLastViewedProductPreferenceAction>({
          type: UPDATE_LAST_VIEWED_PRODUCT_PREFERENCE,
          payload: {
            urn: codecs.preference.lastViewedProduct.encode().uid,
            value: mappedActiveProduct,
          },
        });

        break;
      }
      case NETWORK__FETCH_APP_CONTEXT_SUCCESS: {
        const getThrottle = createGetThrottleSelector();
        const isThrottleActive = getThrottle(state.entities.throttles, "EXC_ONBOARDING_JOURNEY")?.isActive;

        if (!isThrottleActive) {
          break;
        }

        const getUserPreferencesProducts = createUserPreferencesProductsSelector();
        const userProducts = getUserPreferencesProducts(action.payload.initialState.entities.preferences);
        const product = userProducts?.includes(ProductsOption.sportsbook)
          ? ProductsOption.sportsbook
          : ProductsOption.exchange;

        dispatch<UpdateProductPreferenceAction>({
          type: UPDATE_PRODUCT_PREFERENCE,
          payload: {
            productSwitcherPreference: product,
          },
        });

        break;
      }
      default:
        break;
    }

    return next(action);
  };
