import { FETCH_CATALOGUE_SUCCESS } from "../actions";
import {
  DELETE_FAVOURITE_MARKETS_NAVIGATION_TABS,
  SET_FAVOURITE_MARKET_MUTATION_FAILURE,
  SET_FAVOURITE_MARKET_MUTATION_IN_PROGRESS,
  SET_FAVOURITE_MARKET_MUTATION_SUCCESS,
  UI__FAVOURITE_MARKETS_LIMIT_REACHED,
  UI__FAVOURITE_MARKETS_LIMIT_REACHED_MESSAGE_CLOSE,
  UI__FAVOURITE_MARKETS_TOGGLE_FAVOURITE,
} from "../actions/favourite-markets";
import { UI__MESSAGING_REMOVE } from "../actions/messaging";
import setupSagaMocks from "../saga-jest-setup";
import catalogueService from "../services/catalogue/catalogue-service";
import { MessageCode } from "../state";

jest.mock("../services/catalogue/catalogue-service", () => ({
  setFavouriteMarket: jest.fn(),
}));

const OVERRIDDEN_THROTTLES = {
  throttlesOn: ["1", "2"],
};

jest.mock("../state", () => ({
  ...jest.requireActual("../state/constants"),
  getActiveThrottles: jest.fn(() => []),
  getOverridenThrottles: jest.fn(() => OVERRIDDEN_THROTTLES),
}));

const setup = () => {
  let saga;
  jest.isolateModules(() => {
    ({ favouriteMarketsSaga: saga } = require("./favourite-markets-saga"));
  });
  const sagaMocks = setupSagaMocks(saga);

  sagaMocks.getState.mockReturnValue({ entities: {} });

  return sagaMocks;
};

const PAYLOAD_MOCK = {
  data: {
    FavouriteMarketsCountMetadata: [
      {
        currentCount: 1,
        limit: 5,
      },
      {
        currentCount: 3,
        limit: 5,
      },
    ],
  },
};

const PAYLOAD_MOCK_LIMIT = {
  data: {
    FavouriteMarketsCountMetadata: [
      {
        currentCount: 5,
        limit: 5,
      },
      {
        currentCount: 3,
        limit: 5,
      },
    ],
  },
};

describe("favouriteMarketsSaga", () => {
  beforeEach(jest.clearAllMocks);

  describe("on every UI__FAVOURITE_MARKETS_TOGGLE_FAVOURITE action", () => {
    const action = {
      type: UI__FAVOURITE_MARKETS_TOGGLE_FAVOURITE,
      payload: {
        contentSectionURN: "contentSectionURN",
        isFavourite: true,
        favouriteMarketsURN: "favouriteMarketsURN",
      },
    };

    describe("when the request is successful and there is result", () => {
      describe("when the metadatas currentCount is lower than the limit", () => {
        it("should dispatch the correct actions", async () => {
          const { putActions, dispatch, stopSaga } = setup();

          catalogueService.setFavouriteMarket.mockReturnValueOnce(PAYLOAD_MOCK);

          await putActions([action]);

          expect(catalogueService.setFavouriteMarket).toHaveBeenCalledWith(
            action.payload.contentSectionURN,
            action.payload.isFavourite,
            OVERRIDDEN_THROTTLES,
          );

          expect(dispatch).toHaveBeenCalledTimes(4);

          expect(dispatch).toHaveBeenNthCalledWith(1, {
            type: SET_FAVOURITE_MARKET_MUTATION_IN_PROGRESS,
          });

          expect(dispatch).toHaveBeenNthCalledWith(2, {
            type: DELETE_FAVOURITE_MARKETS_NAVIGATION_TABS,
          });

          expect(dispatch).toHaveBeenNthCalledWith(3, {
            type: FETCH_CATALOGUE_SUCCESS,
            payload: PAYLOAD_MOCK,
          });

          expect(dispatch).toHaveBeenNthCalledWith(4, {
            type: SET_FAVOURITE_MARKET_MUTATION_SUCCESS,
          });

          stopSaga();
        });
      });

      describe("when the metadatas currentCount is higher than the limit", () => {
        it("should dispatch the correct actions", async () => {
          const { putActions, dispatch, stopSaga } = setup();

          catalogueService.setFavouriteMarket.mockReturnValueOnce(PAYLOAD_MOCK_LIMIT);

          await putActions([action]);

          expect(catalogueService.setFavouriteMarket).toHaveBeenCalledWith(
            action.payload.contentSectionURN,
            action.payload.isFavourite,
            OVERRIDDEN_THROTTLES,
          );

          expect(dispatch).toHaveBeenCalledTimes(5);

          expect(dispatch).toHaveBeenNthCalledWith(1, {
            type: SET_FAVOURITE_MARKET_MUTATION_IN_PROGRESS,
          });

          expect(dispatch).toHaveBeenNthCalledWith(2, {
            type: DELETE_FAVOURITE_MARKETS_NAVIGATION_TABS,
          });

          expect(dispatch).toHaveBeenNthCalledWith(3, {
            type: FETCH_CATALOGUE_SUCCESS,
            payload: PAYLOAD_MOCK_LIMIT,
          });

          expect(dispatch).toHaveBeenNthCalledWith(4, {
            type: UI__FAVOURITE_MARKETS_LIMIT_REACHED,
          });

          expect(dispatch).toHaveBeenNthCalledWith(5, {
            type: SET_FAVOURITE_MARKET_MUTATION_SUCCESS,
          });

          stopSaga();
        });
      });

      describe("when there is a softError on the payload", () => {
        describe("and the softError is of type LIMIT_EXCEEDED", () => {
          it("should dispatch the correct actions", async () => {
            const { putActions, dispatch, stopSaga } = setup();

            catalogueService.setFavouriteMarket.mockReturnValueOnce({ ...PAYLOAD_MOCK, softError: "LIMIT_EXCEEDED" });

            await putActions([action]);

            expect(catalogueService.setFavouriteMarket).toHaveBeenCalledWith(
              action.payload.contentSectionURN,
              action.payload.isFavourite,
              OVERRIDDEN_THROTTLES,
            );

            expect(dispatch).toHaveBeenCalledTimes(5);

            expect(dispatch).toHaveBeenNthCalledWith(1, {
              type: SET_FAVOURITE_MARKET_MUTATION_IN_PROGRESS,
            });

            expect(dispatch).toHaveBeenNthCalledWith(2, {
              type: DELETE_FAVOURITE_MARKETS_NAVIGATION_TABS,
            });

            expect(dispatch).toHaveBeenNthCalledWith(3, {
              type: FETCH_CATALOGUE_SUCCESS,
              payload: {
                ...PAYLOAD_MOCK,
                softError: "LIMIT_EXCEEDED",
              },
            });

            expect(dispatch).toHaveBeenNthCalledWith(4, {
              type: UI__FAVOURITE_MARKETS_LIMIT_REACHED,
            });

            expect(dispatch).toHaveBeenNthCalledWith(5, {
              type: SET_FAVOURITE_MARKET_MUTATION_SUCCESS,
            });

            stopSaga();
          });
        });

        describe("and the softError is of an unknown type", () => {
          it("should dispatch the correct actions", async () => {
            const { putActions, dispatch, stopSaga } = setup();

            catalogueService.setFavouriteMarket.mockReturnValueOnce({ ...PAYLOAD_MOCK, softError: "UNKNOWN" });

            await putActions([action]);

            expect(catalogueService.setFavouriteMarket).toHaveBeenCalledWith(
              action.payload.contentSectionURN,
              action.payload.isFavourite,
              OVERRIDDEN_THROTTLES,
            );

            expect(dispatch).toHaveBeenCalledTimes(4);

            expect(dispatch).toHaveBeenNthCalledWith(1, {
              type: SET_FAVOURITE_MARKET_MUTATION_IN_PROGRESS,
            });

            expect(dispatch).toHaveBeenNthCalledWith(2, {
              type: DELETE_FAVOURITE_MARKETS_NAVIGATION_TABS,
            });

            expect(dispatch).toHaveBeenNthCalledWith(3, {
              type: FETCH_CATALOGUE_SUCCESS,
              payload: {
                ...PAYLOAD_MOCK,
                softError: "UNKNOWN",
              },
            });

            expect(dispatch).toHaveBeenNthCalledWith(4, {
              type: SET_FAVOURITE_MARKET_MUTATION_SUCCESS,
            });

            stopSaga();
          });
        });
      });
    });

    describe("when the request fails", () => {
      beforeEach(() => {
        catalogueService.setFavouriteMarket.mockRejectedValueOnce("Error");
      });

      describe("and the yielded action is only dispatched once", () => {
        it("should dispatch the correct actions", async () => {
          const { putActions, dispatch, stopSaga } = setup();

          await putActions([action]);

          expect(dispatch).toHaveBeenCalledTimes(3);

          expect(dispatch).toHaveBeenNthCalledWith(1, {
            type: SET_FAVOURITE_MARKET_MUTATION_IN_PROGRESS,
          });

          expect(dispatch).toHaveBeenNthCalledWith(2, {
            type: UI__FAVOURITE_MARKETS_TOGGLE_FAVOURITE,
            payload: {
              ...action.payload,
              isFavourite: !action.payload.isFavourite,
            },
          });

          expect(dispatch).toHaveBeenNthCalledWith(3, {
            type: SET_FAVOURITE_MARKET_MUTATION_FAILURE,
            payload: {
              error: "Error",
            },
          });

          stopSaga();
        });
      });

      describe("and the yielded action is dispatched twice", () => {
        it("should not dispatch the consecutive actions again (due to takeLeading)", async () => {
          const { putActions, dispatch, stopSaga } = setup();

          await putActions([action, action]);

          expect(dispatch).toHaveBeenCalledTimes(3);

          stopSaga();
        });
      });
    });

    describe("on every UI__MESSAGING_REMOVE action", () => {
      describe("when message code corresponds to limit reached", () => {
        it("should dispatch the correct actions", async () => {
          const { putActions, dispatch, stopSaga } = setup();

          await putActions([
            {
              type: UI__MESSAGING_REMOVE,
              payload: {
                code: MessageCode.FAVOURITE_MARKETS_LIMIT_REACHED,
              },
            },
          ]);

          expect(dispatch).toHaveBeenNthCalledWith(1, {
            type: UI__FAVOURITE_MARKETS_LIMIT_REACHED_MESSAGE_CLOSE,
          });

          stopSaga();
        });
      });

      describe("when message code is not supported", () => {
        it("should not dispatch any actions", async () => {
          const { putActions, dispatch, stopSaga } = setup();

          await putActions([
            {
              type: UI__MESSAGING_REMOVE,
              payload: {
                code: MessageCode.BET_INFO,
              },
            },
          ]);

          expect(dispatch).not.toHaveBeenCalled();

          stopSaga();
        });
      });
    });
  });
});
