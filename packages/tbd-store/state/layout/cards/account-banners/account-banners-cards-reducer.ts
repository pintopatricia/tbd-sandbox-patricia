import { AccountBannersCards } from "../Card.types";
import {
  FetchCatalogueSuccessAction,
  FETCH_CATALOGUE_SUCCESS,
  UPDATE_CURRENT_BANNER,
  UpdateCurrentBannerAction,
  SET_ERROR_BANNER,
  SetErrorBannerAction,
} from "../../../../actions/catalogue";

/** **********************
 *  Banners reducer  *
 *********************** */

type ActionTypes = FetchCatalogueSuccessAction | UpdateCurrentBannerAction | SetErrorBannerAction;

export default (currentState: undefined | AccountBannersCards, action: ActionTypes): AccountBannersCards => {
  const state = currentState || {};

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const cards = action.payload.data.AccountBannersCard;

      if (!cards) {
        return state;
      }

      return cards.reduce<AccountBannersCards>(
        (acc, accountBanners) => ({
          ...acc,
          [accountBanners.urn]: {
            ...state[accountBanners.urn],
            ...accountBanners,
          },
        }),
        { ...state },
      );
    }
    case UPDATE_CURRENT_BANNER: {
      const { urn, index } = action.payload;
      const accountBannersView = state[urn];

      if (index === accountBannersView.bannerDetails.length) {
        return {
          ...state,
          [urn]: {
            ...accountBannersView,
            currentBanner: null,
          },
        };
      }
      return {
        ...state,
        [urn]: {
          ...accountBannersView,
          currentBanner: accountBannersView.bannerDetails[index],
        },
      };
    }
    case SET_ERROR_BANNER: {
      const { urn, errorBanner } = action.payload;
      const accountBannersView = state[urn];

      return {
        ...state,
        [urn]: {
          ...accountBannersView,
          currentBanner: errorBanner,
        },
      };
    }
    default:
      return state;
  }
};
