import { UNSUBSCRIBE_TO_UPDATE_GAME_FEED_RESULTS, SUBSCRIBE_TO_UPDATE_GAME_FEED_RESULTS } from "../actions/game-feeds";
import setupSagaMocks from "../saga-jest-setup";
import { PUSH } from "../actions/router";

const mapSetSpy = jest.spyOn(Map.prototype, "set");
const mapDeleteSpy = jest.spyOn(Map.prototype, "delete");
const mapClearSpy = jest.spyOn(Map.prototype, "clear");

function setup() {
  let saga;
  jest.isolateModules(() => {
    ({ updatePhysicalTableResultSaga: saga } = require("./live-dealer-eventsource-service-saga"));
  });
  return setupSagaMocks(saga);
}

describe("updatePhysicalTableResultSaga", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const subscribeToUpdateGameFeedResultsActionRouletteNumbersMock = {
    type: SUBSCRIBE_TO_UPDATE_GAME_FEED_RESULTS,
    payload: { urn: "fakeURN", tableNames: [], endpoint: "fake-endpoint.com", currencyCode: "GBP" },
  };

  const subscribeToUpdateGameFeedResultsActionAliasRouletteNumbersMock = {
    type: SUBSCRIBE_TO_UPDATE_GAME_FEED_RESULTS,
    payload: {
      urn: "aliasFakeURN",
      tableNames: ["rol_prestigerol"],
      endpoint: "fake-endpoint.com",
      currencyCode: "GBP",
    },
  };

  const unsubscribeToUpdateGameFeedResultsActionRouletteNumbersMock = {
    type: UNSUBSCRIBE_TO_UPDATE_GAME_FEED_RESULTS,
    payload: {
      urn: "aliasFakeURN",
      tableNames: ["rol_prestigerol"],
      endpoint: "fake-endpoint.com",
      currencyCode: "GBP",
    },
  };

  describe("when SUBSCRIBE_TO_UPDATE_GAME_FEED_RESULTS is dispatched", () => {
    it("should add action tableNames data to LIVE_DEALER_GAMES", async () => {
      const { putActions, stopSaga } = setup();

      await putActions([subscribeToUpdateGameFeedResultsActionAliasRouletteNumbersMock]);
      expect(mapSetSpy).toHaveBeenCalledWith("rol_prestigerol", "aliasFakeURN");
      stopSaga();
    });

    it("should init eventStream with correct endpoint", async () => {
      const { putActions, stopSaga } = setup();
      await putActions([subscribeToUpdateGameFeedResultsActionRouletteNumbersMock]);

      expect(window.EventSource).toHaveBeenCalledWith("fake-endpoint.com?currency=GBP");

      stopSaga();
    });
  });

  describe("when UNSUBSCRIBE_TO_UPDATE_GAME_FEED_RESULTS is dispatched", () => {
    it("should remove action tableNames data from LIVE_DEALER_GAMES", async () => {
      const { putActions, stopSaga } = setup();
      await putActions([subscribeToUpdateGameFeedResultsActionAliasRouletteNumbersMock]);
      expect(mapSetSpy).toHaveBeenCalledWith("rol_prestigerol", "aliasFakeURN");

      await putActions([unsubscribeToUpdateGameFeedResultsActionRouletteNumbersMock]);
      expect(mapDeleteSpy).toHaveBeenCalledWith("rol_prestigerol");
      stopSaga();
    });
  });

  describe("when ROUTER/PUSH is dispatched", () => {
    it("should clear table updates map", async () => {
      const { putActions, stopSaga } = setup();

      await putActions([
        {
          type: PUSH,
        },
      ]);
      expect(mapClearSpy).toHaveBeenCalledWith();
      stopSaga();
    });
  });
});
