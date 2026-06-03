import setupSagaMocks from "../saga-jest-setup";
import { PAGE_LOAD_SUCCESS } from "../actions/catalogue";
import { getPageLoadEvent } from "./tagging-resolvers/page-load";
import { getExperimentLoadEvent } from "./tagging-resolvers/loop";
import { getExperimentEvents } from "./ga4-tagging-resolvers/experiments";
import { createGetThrottleSelector } from "../state/entities/throttles/throttles-selectors";

jest.mock("./ga4-tagging-resolvers/metadata", () => ({
  getMetaDataEvent: jest.fn(() => Promise.resolve("metaDataEventResult")),
}));
jest.mock("./tagging-resolvers/page-load", () => ({
  getPageLoadEvent: jest.fn(() => Promise.resolve("pageLoadEventResult")),
}));
jest.mock("./ga4-tagging-resolvers/experiments", () => ({
  getExperimentEvents: jest.fn(),
}));
jest.mock("./tagging-resolvers/loop", () => ({
  getExperimentLoadEvent: jest.fn(),
}));
jest.mock("../state/entities/throttles/throttles-selectors", () => {
  const getThrottle = jest.fn(() => null);

  return {
    createGetThrottleSelector: () => getThrottle,
  };
});

const collectMock = jest.fn();
const getCookie = jest.fn();
const platformType = "web";
const theme = "dark";
const appState = { entities: { throttles: "mock throtles" } };
const expEvents = ["event1", "event2"];

function setup() {
  let saga;

  jest.isolateModules(() => {
    ({ taggingSaga: saga } = require("./tagging-saga"));
  });

  return setupSagaMocks(() => saga(collectMock, getCookie, platformType, theme));
}

describe("taggingSaga", () => {
  beforeEach(jest.clearAllMocks);

  const pageLoadSuccessAction = {
    type: PAGE_LOAD_SUCCESS,
    payload: { urn: "card:urn" },
  };

  describe("When GA4 throttle is off", () => {
    beforeEach(() => {
      createGetThrottleSelector().mockReturnValueOnce({ isActive: false });
    });

    describe("when there are experiment events", () => {
      beforeEach(() => {
        getExperimentLoadEvent.mockReturnValue(expEvents);
      });

      it("should intercept PAGE_LOAD_SUCCESS and call collectorFn for pageload and experiment events", async () => {
        const { putActions, getState, dispatch, stopSaga, advanceTimersByTime } = setup();
        getState.mockReturnValue(appState);
        await putActions([pageLoadSuccessAction]);
        await advanceTimersByTime(0);

        expect(getPageLoadEvent).toHaveBeenCalledWith(appState, getCookie, platformType, theme);
        expect(getExperimentLoadEvent).toHaveBeenCalledWith(appState);
        expect(dispatch).not.toHaveBeenCalled();
        expect(collectMock).toHaveBeenCalledTimes(3);
        expect(collectMock).toHaveBeenNthCalledWith(1, "pageLoadEventResult");
        expect(collectMock).toHaveBeenNthCalledWith(2, expEvents[0]);
        expect(collectMock).toHaveBeenNthCalledWith(3, expEvents[1]);

        stopSaga();
      });
    });

    describe("when there are no experiment events", () => {
      beforeEach(() => {
        getExperimentLoadEvent.mockReturnValue([]);
      });

      it("should intercept PAGE_LOAD_SUCCESS and call collectorFn for pageload events only", async () => {
        const { putActions, getState, dispatch, stopSaga, advanceTimersByTime } = setup();
        getState.mockReturnValue(appState);
        await putActions([pageLoadSuccessAction]);
        await advanceTimersByTime(0);

        expect(getPageLoadEvent).toHaveBeenCalledWith(appState, getCookie, platformType, theme);
        expect(getExperimentLoadEvent).toHaveBeenCalledWith(appState);
        expect(dispatch).not.toHaveBeenCalled();
        expect(collectMock).toHaveBeenCalledTimes(1);
        expect(collectMock).toHaveBeenCalledWith("pageLoadEventResult");

        stopSaga();
      });
    });

    describe("When disable UA throttle is on", () => {
      beforeEach(() => {
        createGetThrottleSelector().mockReturnValueOnce({ isActive: true });
      });

      it("should not intercept events or call collectorFn", async () => {
        const { putActions, getState, dispatch, stopSaga, advanceTimersByTime } = setup();
        getState.mockReturnValue(appState);
        await putActions([pageLoadSuccessAction]);
        await advanceTimersByTime(0);

        expect(getPageLoadEvent).not.toHaveBeenCalled();
        expect(getExperimentLoadEvent).not.toHaveBeenCalled();
        expect(dispatch).not.toHaveBeenCalled();
        expect(collectMock).not.toHaveBeenCalled();

        stopSaga();
      });
    });
  });

  describe("When GA4 throttle is on", () => {
    beforeEach(() => {
      createGetThrottleSelector().mockReturnValueOnce({ isActive: true });
    });

    describe("when there are experiment events", () => {
      beforeEach(() => {
        getExperimentEvents.mockReturnValue(expEvents);
      });

      it("should intercept PAGE_LOAD_SUCCESS and call collectorFn for GA4 metadata and experiment events", async () => {
        const { putActions, getState, dispatch, stopSaga, advanceTimersByTime } = setup();
        getState.mockReturnValue(appState);
        await putActions([pageLoadSuccessAction]);
        await advanceTimersByTime(0);

        expect(getPageLoadEvent).toHaveBeenCalledWith(appState, getCookie, platformType, theme);
        expect(getExperimentEvents).toHaveBeenCalledWith(appState);
        expect(dispatch).not.toHaveBeenCalled();
        expect(collectMock).toHaveBeenCalledTimes(3);
        expect(collectMock).toHaveBeenNthCalledWith(1, "metaDataEventResult");
        expect(collectMock).toHaveBeenNthCalledWith(2, expEvents[0]);
        expect(collectMock).toHaveBeenNthCalledWith(3, expEvents[1]);

        stopSaga();
      });
    });

    describe("when there are no experiment events", () => {
      beforeEach(() => {
        getExperimentEvents.mockReturnValue([]);
      });

      it("should intercept PAGE_LOAD_SUCCESS and call collectorFn for GA4 pageload events only", async () => {
        const { putActions, getState, dispatch, stopSaga, advanceTimersByTime } = setup();
        getState.mockReturnValue(appState);
        await putActions([pageLoadSuccessAction]);
        await advanceTimersByTime(0);

        expect(getPageLoadEvent).toHaveBeenCalledWith(appState, getCookie, platformType, theme);
        expect(getExperimentEvents).toHaveBeenCalledWith(appState);
        expect(dispatch).not.toHaveBeenCalled();
        expect(collectMock).toHaveBeenCalledTimes(1);
        expect(collectMock).toHaveBeenCalledWith("metaDataEventResult");

        stopSaga();
      });
    });

    describe("When disable UA throttle is on", () => {
      beforeEach(() => {
        createGetThrottleSelector().mockReturnValueOnce({ isActive: true });
      });

      it("should not intercept events or call collectorFn", async () => {
        const { putActions, getState, stopSaga, advanceTimersByTime } = setup();
        getState.mockReturnValue(appState);
        await putActions([pageLoadSuccessAction]);
        await advanceTimersByTime(0);

        expect(getPageLoadEvent).not.toHaveBeenCalled();
        expect(getExperimentLoadEvent).not.toHaveBeenCalled();

        stopSaga();
      });
    });
  });
});
