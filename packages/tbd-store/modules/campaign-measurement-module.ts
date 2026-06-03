import { ISagaModule } from "redux-dynamic-modules-saga";

import { PlatformType } from "../state/tagging/AnalyticsConstants";
import { ApplicationState } from "../state/ApplicationState.types";

import { campaignMeasurementSaga } from "../middlewares/campaign-measurement-saga";

export type CampaignMeasurementConfig = {
  collectorFn: (payload: any) => void;
  platformType: PlatformType;
  initialUrlFn?: () => Promise<string | null>;
};

export const getCampaignMeasurementModule = ({
  collectorFn,
  platformType,
  initialUrlFn,
}: CampaignMeasurementConfig): ISagaModule<ApplicationState> => ({
  id: "campaign-measurement-module",
  reducerMap: {} as any,
  middlewares: [],
  sagas: [() => campaignMeasurementSaga(collectorFn, platformType, initialUrlFn)],
});
