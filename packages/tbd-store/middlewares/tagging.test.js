import { UI__NAVIGATE_TO_COMPETITION_VIEW } from "../actions/navigation";
import { UI__OPEN_PREDICTS } from "../actions/predicts";

import { getCompetitionLinkClickEvent } from "./ga4-tagging-resolvers/navigation";
import { getOpenPredictsEvent } from "./ga4-tagging-resolvers/interface";
import { createTaggingMiddleware } from "./tagging";

jest.mock("tagging-library", () => jest.fn());
jest.mock("./ga4-tagging-resolvers/betslip", () => jest.fn());
jest.mock("./ga4-tagging-resolvers/account", () => jest.fn());
jest.mock("./ga4-tagging-resolvers/game-interactions", () => jest.fn());
jest.mock("./ga4-tagging-resolvers/game-launch", () => jest.fn());
jest.mock("./ga4-tagging-resolvers/my-bets", () => jest.fn());
jest.mock("./ga4-tagging-resolvers/banner", () => jest.fn());
jest.mock("./ga4-tagging-resolvers/video-saw", () => jest.fn());
jest.mock("./ga4-tagging-resolvers/navigation", () => ({
  getCompetitionLinkClickEvent: jest.fn().mockReturnValue("getCompetitionLinkClickEvent"),
}));
jest.mock("./ga4-tagging-resolvers/notification", () => jest.fn());
jest.mock("./ga4-tagging-resolvers/banner", () => jest.fn());
jest.mock("./ga4-tagging-resolvers/added-selection", () => jest.fn());
jest.mock("./ga4-tagging-resolvers/betslip", () => jest.fn());
jest.mock("./ga4-tagging-resolvers/bet-placed-fail", () => jest.fn());
jest.mock("./ga4-tagging-resolvers/account", () => jest.fn());
jest.mock("./ga4-tagging-resolvers/click-search-results", () => jest.fn());
jest.mock("./ga4-tagging-resolvers/interface", () => ({
  getOpenPredictsEvent: jest.fn().mockReturnValue("getOpenPredictsEvent"),
}));
jest.mock("./ga4-tagging-resolvers/game-interactions", () => jest.fn());
jest.mock("./ga4-tagging-resolvers/game-launch", () => jest.fn());
jest.mock("./ga4-tagging-resolvers/promotions", () => jest.fn());
jest.mock("./ga4-tagging-resolvers/video-saw", () => jest.fn());
jest.mock("./ga4-tagging-resolvers/deposit-success", () => jest.fn());
jest.mock("./ga4-tagging-resolvers/deposit-flow", () => jest.fn());
jest.mock("./ga4-tagging-resolvers/first-deposit-success", () => jest.fn());
jest.mock("./ga4-tagging-resolvers/experiments", () => jest.fn());

const APPLICATION_STATE = {
  layouts: { views: "views" },
  router: { currentUrn: "currentViewUrn" },
};

const sendEventSpy = jest.fn();
const getStateSpy = jest.fn().mockReturnValue(APPLICATION_STATE);
const nextSpy = jest.fn();

const setup = async ({ sendEvent = sendEventSpy, getState = getStateSpy, next = nextSpy, action }) =>
  createTaggingMiddleware(sendEvent)({ getState })(next)(action);

describe("Tagging Middleware", () => {
  afterEach(jest.clearAllMocks);

  describe("when is an action not defined", () => {
    it("should propagate action", async () => {
      await setup({ action: { type: "NOT_DEFINED" } });

      expect(nextSpy).toHaveBeenCalledWith({
        type: "NOT_DEFINED",
      });
      expect(nextSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe.each([
    [
      "UI__NAVIGATE_TO_COMPETITION_VIEW",
      "getCompetitionLinkClickEvent",
      UI__NAVIGATE_TO_COMPETITION_VIEW,
      getCompetitionLinkClickEvent,
    ],
  ])("when action type is `%s`", (actionName, eventBuilderName, ACTION, eventBuilderFn) => {
    it(`should call ${eventBuilderName} and sendEvent with correct parameters`, async () => {
      await setup({
        action: {
          type: ACTION,
          payload: {},
        },
      });

      expect(eventBuilderFn).toHaveBeenCalledWith(
        {
          type: ACTION,
          payload: {},
        },
        APPLICATION_STATE,
      );
      expect(sendEventSpy).toHaveBeenCalledTimes(1);
      expect(sendEventSpy).toHaveBeenCalledWith(eventBuilderName);
    });
  });

  describe("when action type is `UI__OPEN_PREDICTS`", () => {
    it("should call getOpenPredictsEvent and send the resulting event", async () => {
      const action = { type: UI__OPEN_PREDICTS };
      await setup({ action });

      expect(getOpenPredictsEvent).toHaveBeenCalledTimes(1);
      expect(getOpenPredictsEvent).toHaveBeenCalledWith(action, APPLICATION_STATE);
      expect(sendEventSpy).toHaveBeenCalledTimes(1);
      expect(sendEventSpy).toHaveBeenCalledWith("getOpenPredictsEvent");
    });
  });

  describe("when event builder function returns null", () => {
    it("shouldn't call sendEvent", async () => {
      getCompetitionLinkClickEvent.mockReturnValueOnce(null);

      await setup({
        action: {
          type: UI__NAVIGATE_TO_COMPETITION_VIEW,
          payload: {},
        },
      });

      expect(sendEventSpy).not.toHaveBeenCalled();
    });
  });

  describe("when event builder function returns an array with 2 GTM events", () => {
    it("should call sendEvent twice", async () => {
      getCompetitionLinkClickEvent.mockReturnValueOnce(["event1", "event2"]);

      await setup({
        action: {
          type: UI__NAVIGATE_TO_COMPETITION_VIEW,
          payload: {},
        },
      });

      expect(sendEventSpy).toHaveBeenCalledTimes(2);
      expect(sendEventSpy).toHaveBeenNthCalledWith(1, "event1");
      expect(sendEventSpy).toHaveBeenNthCalledWith(2, "event2");
    });
  });

  describe("when event builder function returns an array with 1 GTM event and a null", () => {
    it("shouldn call sendEvent once", async () => {
      getCompetitionLinkClickEvent.mockReturnValueOnce(["event1", null]);

      await setup({
        action: {
          type: UI__NAVIGATE_TO_COMPETITION_VIEW,
          payload: {},
        },
      });

      expect(sendEventSpy).toHaveBeenCalledTimes(1);
      expect(sendEventSpy).toHaveBeenCalledWith("event1");
    });
  });
});
