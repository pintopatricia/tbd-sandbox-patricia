import { ISagaModule } from "redux-dynamic-modules-saga";
import { ApplicationState } from "../state/ApplicationState.types";
import { incrementalLoadSaga } from "../middlewares/incremental-load-saga";
import { incrementalLoadPricesSaga } from "../middlewares/incremental-load-prices-saga";
import { cardsCatalogueSaga } from "../middlewares/catalogue-cards-saga";

export const getIncrementalLoadModule = (): ISagaModule<ApplicationState> => ({
  id: "incremental-load-module",
  reducerMap: {} as any,
  middlewares: [],
  sagas: [incrementalLoadSaga, cardsCatalogueSaga, incrementalLoadPricesSaga],
});
