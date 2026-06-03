import { call, put, select, takeLeading } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import { codecs } from "@ppb/tbd-urn-codecs";
import { ApplicationState } from "../state/ApplicationState.types";
import { OPTIN_LOYALTY_PROMOTION_SUCCESS, OptinLoyaltyPromotionSuccessAction } from "../actions/catalogue";
import catalogueService from "../services/catalogue/catalogue-service";
import { LoyaltyPromotionLegacyFragment } from "../clients/catalogue/catalogue-response-types";
import { TransformedLayout } from "../services/catalogue/catalogue-types";
import { getOverridenThrottles } from "../state/entities/throttles/throttles-selectors";
import { OPTIN_PROMOTION, OptInPromotionAction } from "../actions/loyalty-promotion";

// TODO FIX ME
function buildOptedInPromotionStateLayout(optinCppPromo: LoyaltyPromotionLegacyFragment): TransformedLayout {
  if ("urn" in optinCppPromo) {
    return {
      data: {
        LoyaltyPromotion: [
          {
            typename: "LoyaltyPromotion",
            ...optinCppPromo,
          },
        ],
      },
    };
  }

  return {
    data: {},
  };
}

function* optinLoyaltyPromotion(action: OptInPromotionAction): SagaIterator {
  try {
    const promotionUrn = codecs.parse(action.payload.urn);

    if (promotionUrn && codecs.loyaltyPromotion.isValid(promotionUrn)) {
      const throttleOverrides = yield select((state: ApplicationState) => getOverridenThrottles(state.entities));
      const response = yield call(catalogueService.optinCppPromotion, action.payload.urn, throttleOverrides);
      if (response?.optinCppPromo) {
        yield put<OptinLoyaltyPromotionSuccessAction>({
          type: OPTIN_LOYALTY_PROMOTION_SUCCESS,
          payload: {
            layout: buildOptedInPromotionStateLayout(response?.optinCppPromo),
          },
        });
      }
    }
  } catch {
    // TODO
    // US - https://ppb.tpondemand.com/entity/1202529-ci-loyalty-signposting-opt-in-error
  }
}

export function* loyaltyPromotionSaga(): SagaIterator {
  yield takeLeading(OPTIN_PROMOTION, optinLoyaltyPromotion);
}
