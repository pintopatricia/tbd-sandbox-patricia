import { ISagaModule } from "redux-dynamic-modules-saga";
import { ApplicationState } from "../state/ApplicationState.types";
import { createTaggingMiddleware } from "../middlewares/tagging";
import { GtmCollectorFn } from "./critical-tagging-module";

export const getTaggingModule = ({ collectorFn }: { collectorFn: GtmCollectorFn }): ISagaModule<ApplicationState> => ({
  id: "tagging-module",
  reducerMap: {} as any,
  middlewares: [createTaggingMiddleware(collectorFn)],
});
