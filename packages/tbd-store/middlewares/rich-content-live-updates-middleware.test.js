import RichContentUpdatesObservable from "./rich-content-updates-observable";
import { richContentMiddleware } from "./rich-content-live-updates-middleware";

const dispatchSpy = jest.fn();
const getStateSpy = jest.fn(() => ({ entities: {} }));
const nextSpy = jest.fn();

const subscribeSpy = jest.fn(() => "");
const addEventSpy = jest.fn(() => {});
const removeEventSpy = jest.fn(() => {});
const resetEventsSpy = jest.fn(() => {});

jest.mock("./rich-content-updates-observable", () => ({
  getInstance: jest.fn(() => ({
    subscribe: jest.fn(() => ""),
  })),
}));

describe("Rich Content Live Updates middleware", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    RichContentUpdatesObservable.getInstance.mockReturnValue({
      subscribe: subscribeSpy,
      addEvent: addEventSpy,
      removeEvent: removeEventSpy,
      resetEvents: resetEventsSpy,
    });

    const action = {
      type: "",
      payload: {},
    };
    await richContentMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(nextSpy)(action);
  });

  it("should subscribe to the richContentUpdatesObservable to be notified whenever there are updates", () => {
    expect(subscribeSpy).toHaveBeenCalled();
  });

  describe("and action type is 'SUBSCRIBE_FIXTURE_UPDATES'", () => {
    beforeEach(async () => {
      const action = {
        type: "SUBSCRIBE_FIXTURE_UPDATES",
        payload: {
          urn: "fixture1",
          typename: "FootballFixture",
        },
      };

      await richContentMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(nextSpy)(action);
    });

    it("should add the new subscription to the richContentUpdatesObservable", () => {
      expect(addEventSpy).toHaveBeenCalledWith({
        urn: "fixture1",
        typename: "FootballFixture",
      });
    });
  });

  describe("and action type is 'SUBSCRIBE_RACE_UPDATES'", () => {
    beforeEach(async () => {
      const action = {
        type: "SUBSCRIBE_RACE_UPDATES",
        payload: {
          urn: "fixture2",
          typename: "Race",
        },
      };

      await richContentMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(nextSpy)(action);
    });

    it("should add the new subscription to the richContentUpdatesObservable", () => {
      expect(addEventSpy).toHaveBeenCalledWith({
        urn: "fixture2",
        typename: "Race",
      });
    });
  });

  describe("and action type is 'UNSUBSCRIBE_FIXTURE_UPDATES'", () => {
    beforeEach(async () => {
      const action = {
        type: "UNSUBSCRIBE_FIXTURE_UPDATES",
        payload: {
          urn: "fixture1",
        },
      };

      await richContentMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(nextSpy)(action);
    });

    it("should remove the subscription to the richContentUpdatesObservable", () => {
      expect(removeEventSpy).toHaveBeenCalledWith("fixture1");
    });
  });

  describe("and action type is 'UNSUBSCRIBE_RACE_UPDATES'", () => {
    beforeEach(async () => {
      const action = {
        type: "UNSUBSCRIBE_RACE_UPDATES",
        payload: {
          urn: "race1",
        },
      };

      await richContentMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(nextSpy)(action);
    });

    it("should remove the subscription to the richContentUpdatesObservable", () => {
      expect(removeEventSpy).toHaveBeenCalledWith("race1");
    });
  });

  describe("and action type is 'Router/push'", () => {
    beforeEach(async () => {
      const action = {
        type: "Router/push",
        payload: {},
      };

      await richContentMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(nextSpy)(action);
    });

    it("should remove the subscription to the richContentUpdatesObservable", () => {
      expect(resetEventsSpy).toHaveBeenCalled();
    });
  });
});
