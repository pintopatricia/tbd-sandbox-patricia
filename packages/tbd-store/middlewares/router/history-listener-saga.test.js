import setupSagaMocks from "../../saga-jest-setup";
import { LOCATION_KEY, PUSH } from "../../actions/router";

function setupSaga({ historyListenSpy = jest.fn(), historyReplaceSpy = jest.fn() } = {}) {
  let createHistoryListenerSaga;

  jest.isolateModules(() => {
    ({ createHistoryListenerSaga } = require("./history-listener-saga"));
  });

  const history = {
    listen: historyListenSpy,
    replace: historyReplaceSpy,
    location: {
      pathname: "fakePathname",
      key: "fakeKey",
      search: "search",
      state: {
        viewUrl: "viewUrl",
        viewUrn: "viewUrn",
      },
    },
  };
  return setupSagaMocks(() =>
    createHistoryListenerSaga(history, {
      router: {
        currentUrn: "fakeUrn",
        currentUrl: "fakeUrl",
        viewUrl: "fakeViewUrl",
      },
    })(),
  );
}

function triggerUrlChange(listenSpy, search = "some search", state = "some state", type = "some type") {
  const listenCallback = listenSpy.mock.calls[0][0];
  listenCallback(
    {
      key: "randomKey",
      search,
      state,
    },
    type,
  );
}

describe("createHistoryListener", () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  it("should update current state on initialization", () => {
    const historyListenSpy = jest.fn(() => jest.fn());
    const historyReplaceSpy = jest.fn();
    const { dispatch, stopSaga, advanceTimersByTime } = setupSaga({ historyListenSpy, historyReplaceSpy });

    advanceTimersByTime(0);
    stopSaga();

    expect(historyReplaceSpy).toHaveBeenCalledWith(
      { pathname: "fakePathname", search: "search" },
      {
        viewUrl: "fakeUrl",
        viewUrn: "fakeUrn",
      },
    );
    expect(dispatch).toHaveBeenCalledWith({
      payload: "fakeKey",
      type: LOCATION_KEY,
    });
  });

  describe("when the url changes", () => {
    it("should update the location key", () => {
      const historyListenSpy = jest.fn(() => jest.fn());
      const historyReplaceSpy = jest.fn();
      const { dispatch, stopSaga, advanceTimersByTime } = setupSaga({ historyListenSpy, historyReplaceSpy });

      advanceTimersByTime(0);
      triggerUrlChange(historyListenSpy, "some search", "some state", "PUSH");
      stopSaga();

      expect(dispatch).toHaveBeenCalledWith({
        payload: "randomKey",
        type: LOCATION_KEY,
      });
    });

    describe("when the type is POP", () => {
      it("should push new route", () => {
        const historyListenSpy = jest.fn(() => jest.fn());
        const historyReplaceSpy = jest.fn();
        const { dispatch, stopSaga, advanceTimersByTime } = setupSaga({ historyListenSpy, historyReplaceSpy });

        advanceTimersByTime(0);
        const stateMock = {
          currentUrn: "fakeUrn",
          currentUrl: "fakeUrl",
        };
        triggerUrlChange(historyListenSpy, "some search", stateMock, "POP");
        stopSaga();

        expect(dispatch).toHaveBeenCalledWith({
          payload: stateMock,
          type: PUSH,
        });
      });

      it("should dispatch UI__BACK_BUTTON_CLICK action", () => {
        const historyListenSpy = jest.fn(() => jest.fn());
        const historyReplaceSpy = jest.fn();
        const { dispatch, stopSaga, advanceTimersByTime } = setupSaga({ historyListenSpy, historyReplaceSpy });

        advanceTimersByTime(0);
        const stateMock = {
          currentUrn: "fakeUrn",
          currentUrl: "fakeUrl",
          viewUrl: "fakeViewUrl",
        };
        triggerUrlChange(historyListenSpy, "some state", stateMock, "POP");
        stopSaga();

        expect(dispatch).toHaveBeenCalledWith({
          payload: {
            url: "fakeViewUrl",
            text: "back",
            module: "header",
          },
          type: "UI__BACK_BUTTON_CLICK",
        });
      });

      describe("and url is equal to search param", () => {
        it("should dispatch UI__BACK_BUTTON_CLICK action with an empty string", () => {
          const historyListenSpy = jest.fn(() => jest.fn());
          const historyReplaceSpy = jest.fn();
          const { dispatch, stopSaga, advanceTimersByTime } = setupSaga({ historyListenSpy, historyReplaceSpy });

          advanceTimersByTime(0);
          const stateMock = {
            currentUrn: "fakeUrn",
            currentUrl: "fakeUrl",
            viewUrl: "fakeViewUrl",
          };
          triggerUrlChange(historyListenSpy, stateMock.viewUrl, stateMock, "POP");
          stopSaga();

          expect(dispatch).toHaveBeenCalledWith({
            payload: {
              url: "",
              text: "back",
              module: "header",
            },
            type: "UI__BACK_BUTTON_CLICK",
          });
        });
      });
    });
  });
});
