import setupSagaMocks from "../saga-jest-setup";
import { SUBSCRIBE_JACKPOT, UNSUBSCRIBE_JACKPOT, FETCH_CATALOGUE_SUCCESS } from "../actions/catalogue";
import { getInterval } from "../config";
import catalogueService from "../services/catalogue/catalogue-service";

jest.mock("../services/catalogue/catalogue-service", () => ({
  getCards: jest.fn(() => "cards"),
}));

jest.mock("../config", () => ({
  getInterval: jest.fn(() => 10),
}));

const OVERRIDEN_THROTTLES = {
  throttlesOn: ["1", "2"],
  throttlesOff: ["3"],
};

jest.mock("../state/entities/throttles/throttles-selectors", () => ({
  getOverridenThrottles: jest.fn(() => OVERRIDEN_THROTTLES),
}));

const routerMock = { currentView: "" };

function setup() {
  let saga;
  jest.isolateModules(() => {
    ({ gamingJackpotSaga: saga } = require("./gaming-jackpot-saga"));
  });
  const setupSaga = setupSagaMocks(saga);

  setupSaga.getState.mockReturnValue({ entities: {}, router: routerMock });

  return setupSaga;
}

describe("gamingJackpotSaga", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when SUBSCRIBE_JACKPOT is dispatched", () => {
    it("should dispatch FETCH_CATALOGUE_SUCCESS with correct payload after 60 seconds", async () => {
      const { putActions, dispatch, advanceTimersByTime, stopSaga } = setup();
      catalogueService.getCards.mockReturnValueOnce("cards");
      await putActions([
        {
          type: SUBSCRIBE_JACKPOT,
          payload: {
            urn: "12345",
          },
        },
      ]);

      expect(catalogueService.getCards).not.toHaveBeenCalled();
      await advanceTimersByTime(60000);
      expect(catalogueService.getCards).toHaveBeenCalledWith(
        ["12345"],
        undefined,
        undefined,
        undefined,
        undefined,
        OVERRIDEN_THROTTLES,
        routerMock,
        undefined,
        undefined,
      );
      expect(dispatch).toHaveBeenCalledWith({
        payload: "cards",
        type: FETCH_CATALOGUE_SUCCESS,
      });
      stopSaga();
    });

    it("should dispatch another FETCH_CATALOGUE_SUCCESS after a specific interval", async () => {
      const { putActions, dispatch, advanceTimersByTime, stopSaga } = setup();

      catalogueService.getCards.mockReturnValueOnce("initial").mockReturnValueOnce("updated");

      getInterval.mockReturnValue(60000);

      await putActions([
        {
          type: SUBSCRIBE_JACKPOT,
          payload: {
            urn: "12345",
          },
        },
      ]);
      await advanceTimersByTime(0);

      await advanceTimersByTime(59999);
      expect(catalogueService.getCards).toHaveBeenCalledTimes(0);

      await advanceTimersByTime(1);
      expect(catalogueService.getCards).toHaveBeenCalledTimes(1);
      expect(dispatch.mock.calls[0][0]).toEqual({
        type: FETCH_CATALOGUE_SUCCESS,
        payload: "initial",
      });
      await advanceTimersByTime(60000);
      expect(catalogueService.getCards).toHaveBeenCalledTimes(2);
      expect(dispatch.mock.calls[1][0]).toEqual({
        type: FETCH_CATALOGUE_SUCCESS,
        payload: "updated",
      });
      stopSaga();
    });
  });

  describe("when 'UNSUBSCRIBE_JACKPOT' action is dispatched", () => {
    it("should clear all subscribed", async () => {
      const { putActions, advanceTimersByTime, stopSaga } = setup();
      getInterval.mockReturnValue(60000);

      await putActions([
        {
          type: SUBSCRIBE_JACKPOT,
          payload: {
            urn: "12345",
          },
        },
      ]);
      await advanceTimersByTime(60000);

      expect(catalogueService.getCards).toHaveBeenCalledTimes(1);

      await advanceTimersByTime(60000);
      expect(catalogueService.getCards).toHaveBeenCalledTimes(2);

      await putActions([
        {
          type: UNSUBSCRIBE_JACKPOT,
          payload: {
            urn: "12345",
          },
        },
      ]);
      await advanceTimersByTime(60000);
      expect(catalogueService.getCards).toHaveBeenCalledTimes(2);
      stopSaga();
    });
  });
});
