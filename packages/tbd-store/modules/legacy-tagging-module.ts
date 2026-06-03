import { ISagaModule } from "redux-dynamic-modules-saga";
import { createLegacyTaggingMiddleware } from "../middlewares/legacy-tagging";
import { ApplicationState } from "../state/ApplicationState.types";
import { GtmCollectorFn } from "./critical-tagging-module";

export const getLegacyTaggingModule = ({
  collectorFn,
}: {
  collectorFn: GtmCollectorFn;
}): ISagaModule<ApplicationState> => ({
  id: "legacy-tagging-module",
  reducerMap: {} as any,
  middlewares: [createLegacyTaggingMiddleware(collectorFn)],
});
