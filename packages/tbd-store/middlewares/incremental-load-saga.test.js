/**
 * @jest-environment jsdom
 */

import setupSagaMocks from "../saga-jest-setup";
import { getViewbyURN } from "../state/layout/views/event-view/event-view-selectors";
import { FETCH_CATALOGUE_SUCCESS, FETCH_CARDS } from "../actions/catalogue";

const STATE = {
  router: {
    currentUrn: "viewURN",
  },
  layouts: {
    views: "views",
  },
  entities: {
    sportsbookmarkets: [{ marketId: "924.1" }],
    exchangemarkets: [{ marketId: "1.1" }],
  },
};

function setup() {
  let saga;
  jest.isolateModules(() => {
    ({ incrementalLoadSaga: saga } = require("./incremental-load-saga"));
  });
  return setupSagaMocks(saga);
}

jest.mock("../services/catalogue/catalogue-service", () => ({
  getCards: jest.fn(() => "cards"),
}));

jest.mock("../state/layout/views/view-selectors", () => {
  const getViewItemByURN = jest.fn(() => null);
  return {
    createFindViewItemByURNSelector: () => getViewItemByURN,
  };
});

jest.mock("../state/layout/views/event-view/event-view-selectors", () => ({
  getViewbyURN: jest.fn(() => ({
    urn: "viewURN",
    items: [{ urn: "card:urn:1" }, { urn: "card:urn:2" }, { urn: "card:urn:3" }],
  })),
}));

jest.mock("../state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => ({
    localeCode: "localeCode",
    currencyCode: "currencyCode",
  })),
}));

jest.mock("../services/exchange-market-service", () => ({
  getPrices: jest.fn(),
}));

jest.mock("../services/sportsbook-market-service", () => ({
  getPrices: jest.fn(),
}));

describe("fetchCardsSaga", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when FETCH_CATALOGUE_SUCCESS is dispatched", () => {
    it("should call getViewbyURN with the correct arguments", async () => {
      const { putActions, stopSaga, getState } = setup();

      const action = { type: FETCH_CATALOGUE_SUCCESS, payload: "payload" };

      getState.mockReturnValue(STATE);

      await putActions([action]);

      expect(getViewbyURN).toHaveBeenCalledWith("views", "viewURN");

      stopSaga();
    });

    describe("when there are items to fetch", () => {
      it("should dispatch the FETCH_CARDS_FROM_LIST action once", async () => {
        const { putActions, stopSaga, getState, dispatch } = setup();

        const action = { type: FETCH_CATALOGUE_SUCCESS, payload: "payload" };

        getState.mockReturnValue(STATE);

        await putActions([action]);

        expect(dispatch).toHaveBeenCalledWith({
          payload: {
            urns: ["card:urn:1", "card:urn:2", "card:urn:3"],
          },
          type: FETCH_CARDS,
        });

        stopSaga();
      });
    });

    describe("when there are no cards to fetch", () => {
      it("should not dispatch the FETCH_CARDS_FROM_LIST action", async () => {
        const { putActions, stopSaga, getState, dispatch } = setup();

        const action = { type: FETCH_CATALOGUE_SUCCESS, payload: "payload" };

        getState.mockReturnValue(STATE);

        getViewbyURN.mockReturnValue(null);

        await putActions([action]);

        expect(dispatch).not.toHaveBeenCalled();

        stopSaga();
      });
    });

    it("should set prerender flag to true after 2 seconds", async () => {
      const { putActions, stopSaga, getState, advanceTimersByTime } = setup();

      const action = { type: FETCH_CATALOGUE_SUCCESS, payload: "payload" };

      getState.mockReturnValue(STATE);

      await putActions([action]);

      await advanceTimersByTime(2000);

      expect(window.prerenderReady).toEqual(true);

      stopSaga();
    });
  });
});
