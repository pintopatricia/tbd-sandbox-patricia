import { ISagaModule } from "redux-dynamic-modules-saga";
import { ApplicationState } from "../state/ApplicationState.types";
import { combinationsListSaga } from "../middlewares/sportsbook-betting-combinations-list-saga";
import { sportsbookBettingMiddleware } from "../middlewares/sportsbook-betting";
import { sportsbookBettingLoaderSaga } from "../middlewares/sportsbook-betting-loader-saga";
import { sportsbookBettingCombinatorSaga } from "../middlewares/sportsbook-betting-combinator-saga";
import { placeSportsbookBetsSaga } from "../middlewares/sportsbook-betting-transactional-saga";
import betslipReducer from "../state/betslip/betslip-card-reducer";
import { StorageModule } from "./StorageModule.types";
import { StorageState } from "../helpers/storage";
import { obbBettingMiddleware } from "../middlewares/obb-betting";
import { obbBettingSaga } from "../middlewares/obb-betting-saga";
import { obbBettingLoaderSaga } from "../middlewares/obb-betting-loader-saga";
import { obbTaggingMiddleware } from "../middlewares/obb-tagging";

export const getSportsbookBettingModule = <M extends StorageModule<S>, S extends StorageState>(
  storage?: S extends StorageState ? StorageModule<S> : M,
): ISagaModule<ApplicationState> => ({
  id: "sbk-betting-module",
  reducerMap: { betslip: betslipReducer } as any,
  middlewares: [sportsbookBettingMiddleware, obbBettingMiddleware, obbTaggingMiddleware],
  sagas: [
    () => sportsbookBettingLoaderSaga(storage),
    () => obbBettingLoaderSaga(storage),
    sportsbookBettingCombinatorSaga,
    placeSportsbookBetsSaga,
    combinationsListSaga,
    obbBettingSaga,
  ],
  initialActions: [],
});
