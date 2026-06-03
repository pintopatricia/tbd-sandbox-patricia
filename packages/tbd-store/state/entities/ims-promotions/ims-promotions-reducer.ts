import { ImsPromotions } from "./ImsPromotion";
import { FETCH_CATALOGUE_SUCCESS, FetchCatalogueSuccessAction } from "../../../actions/catalogue";
import {
  ADD_INTERACTIVE_RESPONSE_ERROR,
  AddInteractiveResponseError,
  CLEAR_ERROR_MESSAGE,
  ClearErrorMessage,
} from "../../../actions/promotion";

type ActionTypes = AddInteractiveResponseError | FetchCatalogueSuccessAction | ClearErrorMessage;

/** **********************
 *  ims promotion reducer  *
 *********************** */

export default (currentState: undefined | ImsPromotions, action: ActionTypes): ImsPromotions => {
  const state = currentState || {};

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const entities = action.payload.data.ImsPromotion || [];

      const validPromotions = entities.filter((promo) => promo && promo.urn && promo.layout !== undefined);

      return validPromotions.reduce<ImsPromotions>(
        (acc, promotion) => ({
          ...acc,
          [promotion.urn]: {
            ...state[promotion.urn],
            ...(promotion.layout !== undefined ? promotion : {}),
          },
        }),
        { ...state },
      );
    }
    case ADD_INTERACTIVE_RESPONSE_ERROR:
      return {
        ...state,
        [action.payload.urn]: {
          ...state[action.payload.urn],
          interactiveResponseError: {
            responseCode: action.payload.data.responseCode,
            responseMessage: action.payload.data.responseMessage,
          },
        },
      };
    case CLEAR_ERROR_MESSAGE:
      return {
        ...state,
        [action.payload.urn]: {
          ...state[action.payload.urn],
          interactiveResponseError: undefined,
        },
      };
    default:
      return state;
  }
};
