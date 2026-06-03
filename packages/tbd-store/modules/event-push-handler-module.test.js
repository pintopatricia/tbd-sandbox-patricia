import { getEventPushHandlerModule } from "./event-push-handler-module";

jest.mock("../middlewares/event-push-handler-saga", () => ({
  pushHandlerSaga: "push-handler-saga",
}));

describe("getEventPushHandlerModule", () => {
  it("should return the event push handler module", () => {
    const eventPushHandlerModule = getEventPushHandlerModule();

    expect(eventPushHandlerModule).toEqual({
      id: "event-push-handler-module",
      middlewares: [],
      reducerMap: {},
      sagas: ["push-handler-saga"],
    });
  });
});
