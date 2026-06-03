import { SagaIterator } from "redux-saga";
import { all, AllEffect } from "redux-saga/effects";
import { fetchCatalogueSaga } from "./catalogue-saga";
import { exchangeMarketGraphSaga } from "./exchange-market-graph-saga";
import { userPreferenceSaga } from "./preferences-saga";
import { favouriteMarketsSaga } from "./favourite-markets-saga";
import { fetchSearchResultsSaga } from "./search-saga";
import { gamingJackpotSaga } from "./gaming-jackpot-saga";
import { exchangeCashoutSaga } from "./exchange-cashout-saga";
import { behaviourTrackingSaga } from "./behaviour-service-saga";
import { updatePhysicalTableResultSaga } from "./live-dealer-eventsource-service-saga";
import { bannerActionRequestSaga } from "./account-banners-saga";
import { appContextSaga } from "./app-context-saga";
import { fetchRunnersOrderUpdatesSaga } from "./runners-sorting-saga";
import { obbSaga } from "./obb-saga";
import { messageHubSaga, OutboundMessageMap } from "./messaging-hub-saga";
import { couponFilteredSaga } from "./coupon-filtering-saga";
import { imsPromotionSaga } from "./ims-promotion-saga";
import { raceRunnerSaga } from "./race-runner-saga";
import { pageLoadSaga } from "./page-load-saga";
import { loyaltyMessagingSaga } from "./loyalty-messaging-saga";
import { virtualsSaga } from "./virtuals-saga/virtuals-saga";
import { refreshCardSaga } from "./refresh-card-saga";
import { selectableItemsFilteredSaga } from "./selectable-items-filtering-saga";
import { cookieConsentSaga } from "./cookie-consent-saga";
import { loyaltyPromotionSaga } from "./loyalty-promotion-saga";
import { notificationCenterSaga } from "./notifications-center-saga";
import { fetchSearchBarResultsSaga } from "./search-bar-state-saga";
import { sportsbookBetslipConfirmSaga } from "./sportsbook-betslip-confirm-saga";
import { fetchGamingSearchResultsSaga } from "./gaming-search-saga";
import { betMutationsSaga } from "./bet-mutations-saga";

/**
 * Root saga that serves as an aggregation for all sagas available
 */
export function createRootSaga(messaging: OutboundMessageMap, sagas?: (() => SagaIterator<any>)[]) {
  return function* rootSaga(): IterableIterator<AllEffect<SagaIterator>> {
    const extra = sagas?.map((saga) => saga()) ?? [];

    yield all([
      betMutationsSaga(),
      fetchCatalogueSaga(),
      exchangeMarketGraphSaga(),
      fetchSearchResultsSaga(),
      fetchSearchBarResultsSaga(),
      fetchGamingSearchResultsSaga(),
      userPreferenceSaga(),
      favouriteMarketsSaga(),
      exchangeCashoutSaga(),
      behaviourTrackingSaga(),
      updatePhysicalTableResultSaga(),
      bannerActionRequestSaga(),
      appContextSaga(),
      gamingJackpotSaga(),
      fetchRunnersOrderUpdatesSaga(),
      messageHubSaga(messaging),
      couponFilteredSaga(),
      imsPromotionSaga(),
      raceRunnerSaga(),
      pageLoadSaga(),
      loyaltyMessagingSaga(),
      virtualsSaga(),
      refreshCardSaga(),
      selectableItemsFilteredSaga(),
      cookieConsentSaga(),
      loyaltyPromotionSaga(),
      notificationCenterSaga(),
      sportsbookBetslipConfirmSaga(),
      obbSaga(),
      ...extra,
    ]);
  };
}
