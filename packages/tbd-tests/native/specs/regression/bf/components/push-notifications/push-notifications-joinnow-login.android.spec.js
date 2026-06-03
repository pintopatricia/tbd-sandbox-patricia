const NotificationSubscriptionSO = require("@ppb/tbd-shared/components/NotificationsSubscription/NotificationSubscription.so");
const {
  getAppContext,
  getGenericLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getNSSRegister, getNSSSubscribe } = require("@ppb/tbd-shared/mocks/nss/nss.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");

const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");
const { NotificationPromptSO } = require("../../../../../screen-objects");
const MockService = require("../../../../../mock-essentials/mocking-service");

const mockService = new MockService();

const notificationSubscriptionSO = new NotificationSubscriptionSO();
const notificationPromptSO = new NotificationPromptSO();

const EVENT_ID = "29682729";

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    eventId: EVENT_ID,
    name: "Ukraine v Portugal",
    competition: { urn: "ppb:competition:12345", name: "English Premier League" },
  },
  edges: [
    {
      node: {
        __typename: "GenericSwitcherCard",
        urn: `ppb:tbd:card:genericswitcher:sport:${EVENT_ID}`,
        sport: {
          __typename: "SportsEvent",
          urn: `ppb:event:${EVENT_ID}`,
          name: "Football Fixture",
        },
      },
    },
    {
      node: {
        __typename: "FixtureCard",
        availableToSubscribe: true,
        urn: `ppb:tbd:card:fixture:${EVENT_ID}|0|availableToSubscribe`,
        away: "Portugal",
        home: "Ukraine",
        sportevent: {
          __typename: "SportsEvent",
          name: "Ukraine v Portugal",
          openDate: "2010-10-14T18:45Z",
          urn: `ppb:event:${EVENT_ID}`,
          competition: { urn: "ppb:competition:12345", name: "English Premier League" },
        },
        fixture: {
          __typename: "FootballFixture",
          urn: `ppb:fixture:${EVENT_ID}`,
          home: { name: "Ukraine" },
          away: { name: "Portugal" },
          scheduledAt: "2010-10-14T18:45Z",
          duration: {},
          firstLegScore: {
            home: 1,
            away: 0,
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "GenericSwitcherCard",
        urn: `ppb:tbd:card:genericswitcher:sport:${EVENT_ID}`,
      },
    },
    {
      node: {
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture:${EVENT_ID}|0|availableToSubscribe`,
      },
    },
  ],
};

const APP_CONTEXT_MOCK = {
  loggedIn: "false",
};

describe("pushnotification join login settings", () => {
  describe("When the user open the app on an event", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getScaResponse({}));
      await mockService.mockHttpRequest(getAppContext(APP_CONTEXT_MOCK));
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getNSSRegister());
      await mockService.mockHttpRequest(getNSSSubscribe({}));
      const url = "sport/competition/event/e-29682729";
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilDisplayed(notificationSubscriptionSO.notificationsSubscriptionPressable);
    });

    it("[PRPI-3300] the bell icon should be shown", async () => {
      expect(await notificationSubscriptionSO.notificationsSubscriptionPressable.isDisplayed()).toBe(true);
    });

    describe("When the user subscribe to an event", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(notificationSubscriptionSO.notificationsSubscriptionPressable);
        await notificationSubscriptionSO.notificationsSubscriptionPressable.click();
        await browser.waitUntilDisplayed(notificationPromptSO.element);
      });

      it("[PRPI-3301] The app notification to login or join should be shown", async () => {
        expect(await notificationPromptSO.title.getText()).toBe("Login or Join Now");
        expect(await notificationPromptSO.closeButton.isDisplayed()).toEqual(true);
        expect(await notificationPromptSO.bellIconContainer.isDisplayed()).toBe(true);
        expect(await notificationPromptSO.primaryButton.isDisplayed()).toBe(true);
        expect(await notificationPromptSO.secondaryButton.isDisplayed()).toBe(true);
        expect(await notificationPromptSO.description.getText()).toBe(
          "Sorry, to receive alerts on an event you need to be logged in.",
        );
      });
    });
  });
});
