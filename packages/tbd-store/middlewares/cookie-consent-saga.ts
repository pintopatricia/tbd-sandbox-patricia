import { call, put, take, takeLatest } from "redux-saga/effects";
import { EventChannel, SagaIterator, eventChannel } from "redux-saga";
import { CookieConsentInstanceInterface } from "cookie-consent/dist/interfaces";
import { getInstance } from "cookie-consent";
import { CookieConsentCategoriedChangedAction, COOKIE_CONSENT__CATEGORIES_CHANGED } from "../actions/cookie-consent";
import { PAGE_LOAD_SUCCESS } from "../actions/catalogue";

let cookieConsentInstance: CookieConsentInstanceInterface | null = null;
let channel: EventChannel<CookieConsentCategoriedChangedAction>;

export function createCookieConsentEventChannel(): EventChannel<CookieConsentCategoriedChangedAction> | null {
  return eventChannel((emitter) => {
    cookieConsentInstance?.listenToCategoryChange((categories) =>
      emitter({
        type: COOKIE_CONSENT__CATEGORIES_CHANGED,
        payload: categories,
      }),
    );

    return () => {
      cookieConsentInstance = null;
    };
  });
}

export function* initCookieConsent(): SagaIterator {
  cookieConsentInstance = getInstance({ scope: window });

  yield put({
    type: COOKIE_CONSENT__CATEGORIES_CHANGED,
    payload: cookieConsentInstance.getActiveCategories(),
  });

  channel = yield call(createCookieConsentEventChannel);

  while (cookieConsentInstance) {
    const socketAction = yield take(channel);

    yield put(socketAction);
  }
}

export function* cookieConsentSaga(): SagaIterator {
  if (window?.document?.cookie) {
    yield takeLatest(PAGE_LOAD_SUCCESS, initCookieConsent);
  }
}
