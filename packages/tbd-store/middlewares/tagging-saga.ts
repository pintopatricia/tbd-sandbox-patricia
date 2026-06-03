import { SagaIterator } from "redux-saga";
import { takeEvery, select, call } from "redux-saga/effects";
import { ExperimentsEvent } from "tagging-library";
import { ExperimentLoadEvent, ThemeType } from "../state/tagging/PageLoad.types";
import { ApplicationState } from "../state/ApplicationState.types";
import { PlatformType } from "./tagging-resolvers/AnalyticsConstants";
import { PAGE_LOAD_SUCCESS } from "../actions/catalogue";
import { getPageLoadEvent } from "./tagging-resolvers/page-load";
import { getMetaDataEvent } from "./ga4-tagging-resolvers/metadata";
import { getExperimentLoadEvent } from "./tagging-resolvers/loop";
import { createGetThrottleSelector } from "../state/entities/throttles/throttles-selectors";
import { getExperimentEvents } from "./ga4-tagging-resolvers/experiments";

const getThrottle = createGetThrottleSelector();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function sendEvent(collectorFn: (data: any) => void, event: Promise<any>): Promise<void> {
  const data = await event;

  collectorFn(data);
}

/**
 * Send gtm tag for a page load and experiment load events
 * @param collectorFn The sendEvent method to collect analytics
 * @param getCookie The method to retrieve cookies
 * @param platformType e.g: "web"
 * @param theme e.g: "dark"
 */
function* pageLoad(
  collectorFn: (data: any) => void,
  getCookie: (cookieName: string) => Promise<string | null>,
  platformType: PlatformType,
  theme: ThemeType,
): SagaIterator {
  const appState: ApplicationState = yield select((state: ApplicationState) => state);

  const isGA4Active = getThrottle(appState.entities.throttles, "ENABLE_GA4")?.isActive;
  const isUADisabled = getThrottle(appState.entities.throttles, "DISABLE_UA")?.isActive;

  if (isGA4Active) {
    const metaDataEvent = getMetaDataEvent(appState, getCookie, platformType, theme);
    const expEvents: ExperimentsEvent[] = getExperimentEvents(appState);

    yield call(sendEvent, collectorFn, metaDataEvent);
    expEvents.forEach((expEvent: ExperimentsEvent) => collectorFn(expEvent));
  }

  // not sending GTM UA events when Native because we don't have dual tagging (UA + GA4) in Native as in Web.
  // this should be removed when removing all UA related code from our codebase
  if (platformType !== PlatformType.Native && !isUADisabled) {
    const pageLoadEvent: ReturnType<typeof getPageLoadEvent> = getPageLoadEvent(
      appState,
      getCookie,
      platformType,
      theme,
    );
    const expEvents: ExperimentLoadEvent[] = getExperimentLoadEvent(appState);

    yield call(sendEvent, collectorFn, pageLoadEvent);
    expEvents.forEach((expEvent: ExperimentLoadEvent) => collectorFn(expEvent));
  }
}

/**
 * Use this tagging saga when you need to perform actions AFTER reducers updating
 * the store. Middlewares run before reducers and Sagas run after.
 */
export function* taggingSaga(
  collectorFn: (data: any) => void,
  getCookie: (cookieName: string) => Promise<string | null>,
  platformType: PlatformType,
  theme: ThemeType,
): SagaIterator {
  yield takeEvery(PAGE_LOAD_SUCCESS, pageLoad, collectorFn, getCookie, platformType, theme);
}
