const NotificationSubscriptionSO = require("@ppb/tbd-shared/components/NotificationsSubscription/NotificationSubscription.so");
const {
  getAppContext,
  getGenericLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getNSSRegister, getNSSSubscribe, getNSSUnsubscribe } = require("@ppb/tbd-shared/mocks/nss/nss.controller");

const { SnackbarSO } = require("../../../../../screen-objects");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");
const MockService = require("../../../../../mock-essentials/mocking-service");

const mockService = new MockService();

const notificationSubscriptionSO = new NotificationSubscriptionSO();
const snackbarSO = new SnackbarSO();

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
          eventId: EVENT_ID,
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

// TODO: https://ppb.tpondemand.com/entity/1037246-android-push-notifications-tests-error
describe("Push notifications subscribe and unsubscribe", () => {
  describe("When the user open the app on an event", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getAppContext());
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getNSSRegister());
      await mockService.mockHttpRequest(getNSSSubscribe({}));
      await mockService.mockHttpRequest(getNSSUnsubscribe());
      const url = "sport/competition/event/e-29682729";
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilDisplayed(notificationSubscriptionSO.notificationsIconOff);
    });

    it("[PRPI-3296] the bell icon should be shown", async () => {
      expect(await notificationSubscriptionSO.element.isDisplayed()).toBe(true);
    });

    describe("and the user subscribe to an event", () => {
      beforeAll(async () => {
        await notificationSubscriptionSO.notificationsSubscriptionPressable.click();
        await browser.waitUntilDisplayed(snackbarSO.title);
      });

      it("[PRPI-3297] the bell icon should change to on state", async () => {
        expect(await notificationSubscriptionSO.notificationsIconOn.isDisplayed()).toBe(true);
      });

      it("[PRPI-3298] the success message should be shown", async () => {
        expect(await snackbarSO.title.getText()).toBe("Live Match Alerts");
        expect(await snackbarSO.description.getText()).toBe(
          "You’ve chosen to receive notifications for this event  (e.g. Goals scored, Injuries, Half Time etc) ",
        );
      });
    });

    describe("and the user unsubscribe to an event", () => {
      beforeAll(async () => {
        await notificationSubscriptionSO.notificationsSubscriptionPressable.click();
        await browser.waitUntilDisplayed(notificationSubscriptionSO.notificationsIconOff);
      });

      it("[PRPI-3299] the bell icon should change to off state", async () => {
        expect(await notificationSubscriptionSO.notificationsIconOff.isDisplayed()).toBe(true);
      });
    });
  });
});
