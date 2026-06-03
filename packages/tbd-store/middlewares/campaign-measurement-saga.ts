import { SagaIterator } from "redux-saga";
import { call, select, takeLatest } from "redux-saga/effects";

import { CampaignMeasurementEvent } from "../state/tagging/CampaignMeasurement.types";

import { PlatformType } from "./tagging-resolvers/AnalyticsConstants";
import { CAMPAIGN_MEASUREMENT } from "../actions/campaign-measurement";
import { getCampaignMeasurementEvent } from "./tagging-resolvers/campaign-measurement";

function sendEvent(collectorFn: (data: unknown) => void, event: CampaignMeasurementEvent | null): void {
  if (event) {
    collectorFn(event);
  }
}

function* campaignMeasurement(
  collectorFn: (data: unknown) => void,
  initialUrlFn: () => Promise<string | null>,
): SagaIterator {
  const url = yield call(initialUrlFn);
  const event: ReturnType<typeof getCampaignMeasurementEvent> = yield select((state) =>
    getCampaignMeasurementEvent(state, url),
  );

  yield call(sendEvent, collectorFn, event);
}

/**
 *
 * Saga that runs campaign measurement tracking for Native apps
 *
 * This saga is run when the `CAMPAIGN_MEASUREMENT` action is dispatched,
 * which happens when connected BottomBar is rendered with items.
 *
 * @see [Linking.getInitialURL](https://reactnative.dev/docs/linking#getinitialurl)
 * @see [@ppb/tbd-shared/gtm/tagging-collector.native.ts](../../../packages/tbd-shared/gtm/tagging-collector.native.ts)
 *
 * @param collectorFn Collector function
 * @param platformType Platform type (Web / Native / Wrapper)
 * @param initialUrlFn Initial URL function
 * @returns
 */
export function* campaignMeasurementSaga(
  collectorFn: (data: unknown) => void,
  platformType: PlatformType,
  initialUrlFn?: () => Promise<string | null>,
): SagaIterator {
  if (platformType !== PlatformType.Native || !initialUrlFn) {
    return;
  }

  yield takeLatest(CAMPAIGN_MEASUREMENT, campaignMeasurement, collectorFn, initialUrlFn);
}
