/**
 * @jest-environment jsdom
 */

import { BehaviourTracker } from "../services/behaviour-tracking";
import setupSagaMocks from "../saga-jest-setup";
import { createFindViewByURNSelector } from "../state/layout/views/view-selectors";

jest.mock("../services/behaviour-tracking");

jest.mock("../config/application-key", () => ({
  getApplicationKey: jest.fn(() => "fakeKey"),
}));

jest.mock("../state/layout/views/view-selectors", () => ({
  createFindViewByURNSelector: jest.fn(() => () => undefined),
}));

jest.mock("../services/client-factory", () => ({
  getHttpClientsConfig: jest.fn(() => ({
    ENDPOINTS: {
      CBS: "https://cbs-endpoint",
    },
    APP_KEY: "app-key",
    APP_USER_AGENT: "user-agent",
  })),
}));

jest.mock("../state/layout-snapshot", () => ({
  getLayoutMetadata: jest.fn(() => ({
    cardGroupUrn: "fakeCardGroup",
  })),
}));

const mockBehaviourTracker = {
  initLibrary: jest.fn(),
  triggerEvent: jest.fn(),
};
BehaviourTracker.mockImplementation(() => mockBehaviourTracker);

global.window = Object.create(window);
Object.defineProperty(window, "location", {
  value: {
    href: "https://www.betfair.com/betting",
  },
});

function setup() {
  let saga;
  jest.isolateModules(() => {
    ({ behaviourTrackingSaga: saga } = require("./behaviour-service-saga"));
  });
  return setupSagaMocks(() => saga("https://cbs-endpoint"));
}

describe("behaviour service saga", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    BehaviourTracker.mockClear();
  });

  describe('when it intercepts a "UI__LAUNCH_GAME" action', () => {
    const launchGameAction = {
      type: "UI__LAUNCH_GAME",
      payload: {
        gameUrn: "game/test",
        viewUrn: "fakeView",
        cardUrn: "fakeCard",
        href: "fakeHref",
      },
    };

    it("should initialize the library first", async () => {
      const { putActions, getState, stopSaga } = setup();
      getState.mockReturnValue({
        router: {
          currentUrl: "fake-view-url",
          currentUrn: "fake-view-urn",
        },
        layouts: {
          views: {},
        },
      });
      await putActions([launchGameAction]);
      expect(mockBehaviourTracker.initLibrary).toHaveBeenCalledTimes(1);
      expect(mockBehaviourTracker.initLibrary).toHaveBeenCalledWith("https://cbs-endpoint", "fakeKey");
      stopSaga();
    });

    it("should call trigger event for page view", async () => {
      const { putActions, getState, stopSaga } = setup();
      createFindViewByURNSelector.mockReturnValue(() => ({ url: "testUrl" }));
      getState.mockReturnValue({
        router: {
          currentUrl: "fake-view-url",
          currentUrn: "fake-view-urn",
        },
        layouts: {
          views: {
            game: { fakeView: { url: "testUrl" } },
          },
        },
      });
      await putActions([launchGameAction]);
      expect(mockBehaviourTracker.triggerEvent).toHaveBeenCalledTimes(2);
      expect(mockBehaviourTracker.triggerEvent).toHaveBeenNthCalledWith(1, "pageView", {
        uri: "testUrl",
        urn: "fake-view-urn",
      });
      stopSaga();
    });

    it("should call trigger event for page view with the card urn", async () => {
      const launchGameActionNoViewUrn = {
        type: "UI__LAUNCH_GAME",
        payload: {
          gameUrn: "game/test",
          cardUrn: "fakeCard",
          href: "fakeHref",
        },
      };

      const { putActions, getState, stopSaga } = setup();
      createFindViewByURNSelector.mockReturnValue(() => ({ url: "testUrl" }));
      getState.mockReturnValue({
        router: {
          currentUrl: "fake-view-url",
          currentUrn: "fake-view-urn",
        },
        layouts: {
          views: {
            game: { fakeView: { url: "testUrl" } },
          },
        },
      });
      await putActions([launchGameActionNoViewUrn]);
      expect(mockBehaviourTracker.triggerEvent).toHaveBeenCalledTimes(2);
      expect(mockBehaviourTracker.triggerEvent).toHaveBeenNthCalledWith(1, "pageView", {
        uri: "testUrl",
        urn: "fake-view-urn",
      });
      stopSaga();
    });

    it("should call trigger event for game launch", async () => {
      const { putActions, getState, stopSaga } = setup();
      getState.mockReturnValue({
        router: {
          currentUrl: "fake-view-url",
          currentUrn: "fake-view-urn",
        },
        layouts: {
          views: {
            game: { fakeView: { url: "testUrl" } },
          },
        },
      });
      await putActions([launchGameAction]);
      expect(mockBehaviourTracker.triggerEvent).toHaveBeenCalledTimes(2);
      expect(mockBehaviourTracker.triggerEvent).toHaveBeenNthCalledWith(2, "launchGame", {
        gameId: "ppb:game:test",
        item: { urn: "ppb:game:test", container: "fakeCardGroup" },
      });
      stopSaga();
    });
  });

  describe('when it intercepts a "UI__NAVIGATE_TO_GAMING_CATEGORY_USING_CATEGORY_LINK_CARD" action', () => {
    const navigateAction = {
      type: "UI__NAVIGATE_TO_GAMING_CATEGORY_USING_CATEGORY_LINK_CARD",
      payload: { href: "href-test", cardUrn: "cardUrn-test", viewUrn: "fakeView" },
    };

    it("should initialize the library only for the first navigate action", async () => {
      const { putActions, getState, stopSaga } = setup();
      getState.mockReturnValue({
        router: {
          currentUrl: "fake-view-url",
          currentUrn: "fake-view-urn",
        },
        layouts: {
          views: {},
        },
      });
      await putActions([navigateAction]);
      expect(mockBehaviourTracker.initLibrary).toHaveBeenCalledTimes(1);
      expect(mockBehaviourTracker.initLibrary).toHaveBeenCalledWith("https://cbs-endpoint", "fakeKey");
      expect(mockBehaviourTracker.triggerEvent).toHaveBeenCalledTimes(2);
      await putActions([navigateAction]);
      expect(mockBehaviourTracker.initLibrary).toHaveBeenCalledTimes(1);
      expect(mockBehaviourTracker.triggerEvent).toHaveBeenCalledTimes(3);
      stopSaga();
    });

    it("should call trigger event for going to category", async () => {
      const { putActions, getState, stopSaga } = setup();
      getState.mockReturnValue({
        router: {
          currentUrl: "fake-view-url",
          currentUrn: "fake-view-urn",
        },
        layouts: {
          views: {},
        },
      });
      await putActions([navigateAction]);
      expect(mockBehaviourTracker.triggerEvent).toHaveBeenCalledTimes(2);
      expect(mockBehaviourTracker.triggerEvent).toHaveBeenNthCalledWith(2, "navigate", { uri: "href-test" });
      stopSaga();
    });
  });

  describe('when it intercepts a "PAGE_LOAD_SUCCESS" action', () => {
    const pageloadAction = {
      type: "PAGE_LOAD_SUCCESS",
    };

    it("should initialize the library only once", async () => {
      const { putActions, getState, stopSaga } = setup();
      getState.mockReturnValue({
        router: {
          currentUrl: "fake-view-url",
          currentUrn: "fake-view-urn",
        },
        layouts: {
          views: {},
        },
      });
      await putActions([pageloadAction]);
      await putActions([pageloadAction]);

      expect(mockBehaviourTracker.initLibrary).toHaveBeenCalledTimes(1);
      expect(mockBehaviourTracker.initLibrary).toHaveBeenCalledWith("https://cbs-endpoint", "fakeKey");

      stopSaga();
    });

    describe("and it is the home page", () => {
      it("should call trigger event for page view withouth an URN", async () => {
        const { putActions, getState, stopSaga } = setup();
        createFindViewByURNSelector.mockReturnValue(() => ({ url: "testUrl" }));
        getState.mockReturnValue({
          router: {
            currentUrl: "fake-view-url",
            currentUrn: "fake-view-urn",
          },
          layouts: {
            views: {
              generic: { fakeHomeView: { url: "testUrl" } },
            },
          },
        });
        await putActions([pageloadAction]);
        expect(mockBehaviourTracker.triggerEvent).toHaveBeenCalledTimes(1);
        expect(mockBehaviourTracker.triggerEvent).toHaveBeenCalledWith("pageView", {
          uri: "https://www.betfair.com/betting",
          urn: null,
        });
        stopSaga();
      });
    });

    describe("and it is a Sport page", () => {
      it("should call trigger event for page view with the sport URN", async () => {
        const { putActions, getState, stopSaga } = setup();
        createFindViewByURNSelector.mockReturnValue(() => ({
          typename: "SportView",
          url: "/fake-sport/sport:1",
          sport: "ppb:sport:1",
        }));
        getState.mockReturnValue({
          router: {
            currentUrl: "fake-view-url",
            currentUrn: "fake-view-urn",
          },
          layouts: {
            views: {
              sport: {
                "ppb:tbd:view:sport:1": {
                  typename: "SportView",
                  sport: "ppb:sport:1",
                  url: "/fake-sport/sport:1",
                },
              },
            },
          },
        });
        await putActions([pageloadAction]);
        expect(mockBehaviourTracker.triggerEvent).toHaveBeenCalledTimes(1);
        expect(mockBehaviourTracker.triggerEvent).toHaveBeenCalledWith("pageView", {
          uri: "https://www.betfair.com/betting",
          urn: "ppb:sport:1",
        });
        stopSaga();
      });
    });

    describe("and it is a Competition page", () => {
      it("should call trigger event for page view with the competition URN", async () => {
        const { putActions, getState, stopSaga } = setup();
        createFindViewByURNSelector.mockReturnValue(() => ({
          typename: "CompetitionView",
          url: "/fake-competition/competition:1",
          competition: "ppb:competition:1",
        }));
        getState.mockReturnValue({
          router: {
            currentUrl: "fake-view-url",
            currentUrn: "fake-view-urn",
          },
          layouts: {
            views: {
              competition: {
                "ppb:tbd:view:competition:1": {
                  typename: "CompetitionView",
                  competition: "ppb:competition:1",
                  url: "/fake-competition/competition:1",
                },
              },
            },
          },
        });
        await putActions([pageloadAction]);
        expect(mockBehaviourTracker.triggerEvent).toHaveBeenCalledTimes(1);
        expect(mockBehaviourTracker.triggerEvent).toHaveBeenCalledWith("pageView", {
          uri: "https://www.betfair.com/betting",
          urn: "ppb:competition:1",
        });
        stopSaga();
      });
    });

    describe("and it is an Event page", () => {
      it("should call trigger event for page view with the sport event URN", async () => {
        const { putActions, getState, stopSaga } = setup();
        createFindViewByURNSelector.mockReturnValue(() => ({
          typename: "EventView",
          url: "/fake-sport-event/sportevent:123",
          sportevent: "ppb:sportevent:123",
        }));
        getState.mockReturnValue({
          router: {
            currentUrl: "fake-view-url",
            currentUrn: "fake-view-urn",
          },
          layouts: {
            views: {
              sportevent: {
                "ppb:tbd:view:sportevent:123": {
                  typename: "EventView",
                  sportevent: "ppb:sportevent:123",
                  url: "/fake-sport-event/sportevent:123",
                },
              },
            },
          },
        });
        await putActions([pageloadAction]);
        expect(mockBehaviourTracker.triggerEvent).toHaveBeenCalledTimes(1);
        expect(mockBehaviourTracker.triggerEvent).toHaveBeenCalledWith("pageView", {
          uri: "https://www.betfair.com/betting",
          urn: "ppb:sportevent:123",
        });
        stopSaga();
      });
    });

    describe("and it is a Market page", () => {
      it("should call trigger event for page view with the sport event URN", async () => {
        const { putActions, getState, stopSaga } = setup();
        createFindViewByURNSelector.mockReturnValue(() => ({
          typename: "MarketView",
          url: "/fake-market/market:1.196097301",
          mainMarket: "ppb:excMarket:1.196097301",
        }));
        getState.mockReturnValue({
          router: {
            currentUrl: "fake-view-url",
            currentUrn: "fake-view-urn",
          },
          layouts: {
            views: {
              market: {
                "ppb:tbd:view:market:1.196097301": {
                  typename: "MarketView",
                  mainMarket: "ppb:excMarket:1.196097301",
                  url: "/fake-sport-event/sportevent:1.196097301",
                },
              },
            },
          },
        });
        await putActions([pageloadAction]);
        expect(mockBehaviourTracker.triggerEvent).toHaveBeenCalledTimes(1);
        expect(mockBehaviourTracker.triggerEvent).toHaveBeenCalledWith("pageView", {
          uri: "https://www.betfair.com/betting",
          urn: "ppb:excMarket:1.196097301",
        });
        stopSaga();
      });
    });

    describe("and it is a Race page", () => {
      it("should call trigger event for page view with the sport event URN", async () => {
        const { putActions, getState, stopSaga } = setup();
        createFindViewByURNSelector.mockReturnValue(() => ({
          typename: "RaceView",
          url: "/fake-race/race:123",
          race: "ppb:race:31301.1330",
        }));
        getState.mockReturnValue({
          router: {
            currentUrl: "fake-view-url",
            currentUrn: "fake-view-urn",
          },
          layouts: {
            views: {
              race: {
                "ppb:tbd:view:race:31301.1330": {
                  typename: "RaceView",
                  race: "ppb:race:31301.1330",
                  url: "/fake-race/race:123",
                },
              },
            },
          },
        });
        await putActions([pageloadAction]);
        expect(mockBehaviourTracker.triggerEvent).toHaveBeenCalledTimes(1);
        expect(mockBehaviourTracker.triggerEvent).toHaveBeenCalledWith("pageView", {
          uri: "https://www.betfair.com/betting",
          urn: "ppb:race:31301.1330",
        });
        stopSaga();
      });
    });

    describe("and it is a Runner View Modal", () => {
      it("should not call trigger event for page view", async () => {
        const { putActions, getState, stopSaga } = setup();
        createFindViewByURNSelector.mockReturnValue(() => ({
          typename: "RunnerView",
          url: "/fake-runner/runner:123",
          urn: "ppb:tbd:view:runner:31301.1330",
        }));
        getState.mockReturnValue({
          router: {
            currentUrl: "fake-view-url",
            currentUrn: "fake-view-urn",
          },
          layouts: {
            views: {
              runner: {
                "ppb:tbd:view:runner:31301.1330": {
                  typename: "RunnerView",
                  urn: "ppb:tbd:view:runner:31301.1330",
                  url: "/fake-race/race:123",
                },
              },
            },
          },
        });
        await putActions([pageloadAction]);
        expect(mockBehaviourTracker.triggerEvent).not.toHaveBeenCalled();
        stopSaga();
      });
    });

    describe("and it is a Settings View Modal", () => {
      it("should not call trigger event for page view", async () => {
        const { putActions, getState, stopSaga } = setup();
        createFindViewByURNSelector.mockReturnValue(() => ({
          typename: "SettingsView",
          urn: "ppb:tbd:view:settings:31301.1330",
          url: "/fake-settings/settings:123",
        }));
        getState.mockReturnValue({
          router: {
            currentUrl: "fake-view-url",
            currentUrn: "fake-view-urn",
          },
          layouts: {
            views: {
              runner: {
                "ppb:tbd:view:settings:31301.1330": {
                  typename: "SettingsView",
                  urn: "ppb:tbd:view:settings:31301.1330",
                  url: "/fake-settings/settings:123",
                },
              },
            },
          },
        });
        await putActions([pageloadAction]);
        expect(mockBehaviourTracker.triggerEvent).not.toHaveBeenCalled();
        stopSaga();
      });
    });

    describe("and it is a ImsPromotionView Modal", () => {
      it("should not call trigger event for page view", async () => {
        const { putActions, getState, stopSaga } = setup();
        createFindViewByURNSelector.mockReturnValue(() => ({
          typename: "ImsPromotionView",
          urn: "ppb:tbd:view:ims:31301.1330",
          url: "/fake-ims/ims:123",
        }));
        getState.mockReturnValue({
          router: {
            currentUrl: "fake-view-url",
            currentUrn: "fake-view-urn",
          },
          layouts: {
            views: {
              runner: {
                "ppb:tbd:view:ims:31301.1330": {
                  typename: "ImsPromotionView",
                  urn: "ppb:tbd:view:ims:31301.1330",
                  url: "/fake-ims/ims:123",
                },
              },
            },
          },
        });
        await putActions([pageloadAction]);
        expect(mockBehaviourTracker.triggerEvent).not.toHaveBeenCalled();
        stopSaga();
      });
    });
  });

  describe('when it intercepts a "LOYALTY__RECEIVE_MESSAGE" action', () => {
    const loyaltyReceivedAction = {
      type: "LOYALTY/RECEIVE_MESSAGE",
      payload: {
        content: {
          message: {
            urn: "ppb:tbd:view:generic:home",
          },
          correlationId: "generatedUUID1",
        },
      },
    };

    it("should initialize the library only once", async () => {
      const { putActions, stopSaga } = setup();
      await putActions([loyaltyReceivedAction]);

      expect(mockBehaviourTracker.initLibrary).toHaveBeenCalledTimes(1);
      expect(mockBehaviourTracker.initLibrary).toHaveBeenCalledWith("https://cbs-endpoint", "fakeKey");

      stopSaga();
    });

    it("should call trigger event for going to category", async () => {
      const { putActions, stopSaga } = setup();
      await putActions([loyaltyReceivedAction]);
      expect(mockBehaviourTracker.triggerEvent).toHaveBeenNthCalledWith(1, "expose", {
        urn: "ppb:tbd:view:generic:home",
        correlationId: "generatedUUID1",
      });
      stopSaga();
    });
  });
});
