import { ISagaModule } from "redux-dynamic-modules-saga";

import { criticalTaggingMiddleware } from "../middlewares/critical-tagging";
import { taggingSaga } from "../middlewares/tagging-saga";
import { ApplicationState } from "../state";
import { ThemeType } from "../state/tagging";
import { PlatformType } from "../state/tagging/AnalyticsConstants";

export type GtmCollectorFn = (payload: any) => void;

export type GtmConfig = {
  collectorFn: GtmCollectorFn;
  getCookie: (cookieName: string) => Promise<string | null>;
  platformType: PlatformType;
  theme: ThemeType;
};

export const getCriticalTaggingModule = ({
  collectorFn,
  getCookie,
  platformType,
  theme,
}: GtmConfig): ISagaModule<ApplicationState> => ({
  id: "critical-tagging-module",
  reducerMap: {} as any,
  middlewares: [criticalTaggingMiddleware],
  sagas: [() => taggingSaga(collectorFn, getCookie, platformType, theme)],
});
