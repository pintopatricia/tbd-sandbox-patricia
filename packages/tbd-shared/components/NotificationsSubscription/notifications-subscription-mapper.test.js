import {
  createPushNotificationsDataBuilderFromReport,
  createPushNotificationsDataFromUrn,
  createPushNotificationsDataFromSportsbookBet,
  createLiveActivityPayload,
} from "./notifications-subscription-mapper";

jest.mock("@ppb/tbd-store/helpers/sportsbook-betting");
jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors");
jest.mock("@ppb/tbd-store/helpers/formatters", () => ({
  formatOdds: jest.fn().mockReturnValue("Formatted Display Odds"),
}));
jest.mock("reselect", () => ({
  createSelector: jest.fn((_deps, selector) => selector),
  createSelectorCreator: jest.fn(() => jest.fn((selector) => selector)),
}));
jest.mock("../../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn().mockReturnValue("Formatted Currency"),
}));
jest.mock("../../helpers/dates", () => ({
  formatTime: jest.fn((n) => n),
}));
jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));
jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getSportsbookReport: jest.fn().mockReturnValue({ result: {} }),
}));

jest.mock("@ppb/tbd-store/state/layout/layout-selectors", () => ({
  createViewTypeSelector: jest.fn(() => jest.fn().mockReturnValue("NotificationsSubscription")),
}));

jest.mock("@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors", () => ({
  createGetSportsbookMarketByHierarchySelector: jest.fn(() => jest.fn().mockReturnValue(null)),
}));

jest.mock("react-native", () => ({
  NativeModules: {
    ScoresLiveActivityModule: {},
  },
}));

// Then mock device-info
jest.mock("react-native-device-info", () => ({
  getSystemVersion: jest.fn(() => "26.0"),
}));

describe("Notifications Subscription Mapper", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("createPushNotificationsDataBuilderFromReport", () => {
    describe("when there is no report", () => {
      it("should return no push notifications data", () => {
        expect(createPushNotificationsDataBuilderFromReport()(undefined, {}, {}, [], [])).toEqual(null);
      });
    });

    describe("when the report has legs and metadata", () => {
      function setupPushNotificationsData() {
        return createPushNotificationsDataBuilderFromReport()(
          {
            result: {
              legs: {
                "LEG:1": {
                  id: "LEG:1",
                  runners: ["RUNNER:1"],
                },
                "LEG:2": {
                  id: "LEG:2",
                  runners: ["RUNNER:2"],
                },
              },
            },
            metadata: {
              "RUNNER:1": {
                runnerUrn: "RUNNER:1",
                sportId: 1,
                eventUrn: "ppb:event:12345",
              },
              "RUNNER:2": {
                runnerUrn: "RUNNER:2",
                sportId: 7,
                racing: {
                  urn: "ppb:race:67890",
                },
              },
            },
          },
          { localeCode: "localeCode" },
          {
            applicationTypeId: "applicationTypeId",
            deviceId: "deviceId",
            registerOptions: { notificationPreferences: { globalNotifications: true } },
          },
          ["12345"],
          ["67890"],
        );
      }
      it("should return push notifications data", () => {
        const pushNotificationsData = setupPushNotificationsData();

        expect(pushNotificationsData).toEqual({
          applicationTypeId: "applicationTypeId",
          deviceId: "deviceId",
          isSystemPushEnabled: true,
          showNotificationsToggle: true,
          areAllEventsSubscribed: true,
          isNotificationsUnavailable: false,
          isNotificationsSelected: true,
          locale: "localeCode",
          topics: [
            {
              topicId: "12345",
              eventType: "FOOTBALL",
              incidentTypes: [
                "FOOTBALL_KICK_OFF",
                "FOOTBALL_HALF_TIME",
                "FOOTBALL_FINAL_SCORE",
                "FOOTBALL_RED_CARD",
                "FOOTBALL_SCORE_CHANGE",
                "FOOTBALL_PENALTY_SHOOTOUT",
              ],
            },
            {
              topicId: "67890",
              eventType: "HORSE_RACE",
              incidentTypes: ["HORSE_RACE_KICK_OFF", "HORSE_RACE_NON_RUNNER", "HORSE_RACE_FINAL_RESULT"],
            },
          ],
          unsupportedTopics: [],
        });
      });
    });
  });

  describe("createPushNotificationsDataFromUrn", () => {
    describe("when there is no Urn", () => {
      it("should return no push notifications data", () => {
        expect(createPushNotificationsDataFromUrn()({}, {}, {}, null)).toEqual(null);
      });
    });

    describe("when there is URN", () => {
      function setupPushNotificationsData() {
        return createPushNotificationsDataFromUrn()(
          {
            localeCode: "en",
            loggedIn: true,
            localeCodeBcp47: "locale",
            timezone: "timezone",
          },
          {
            applicationTypeId: "applicationTypeId",
            deviceId: "deviceId",
            registerOptions: { notificationPreferences: { globalNotifications: true } },
          },
          {
            layouts: {
              views: {
                event: {
                  "ppb:tbd:view:event:32333764": {
                    typename: "EventView",
                    urn: "ppb:tbd:view:event:32333764",
                    url: "football/english-premier-league/newcastle-v-brighton/e-32333764",
                    canonicalUrl: "/sport/football/english-premier-league/newcastle-v-brighton/32333764",
                    sportevent: "ppb:event:32333764",
                  },
                },
                race: {},
              },
            },
            entities: {
              sportevents: {
                "ppb:event:32333764": {
                  typename: "SportsEvent",
                  urn: "ppb:event:32333764",
                  eventId: 32333764,
                  name: "Newcastle v Brighton",
                  openDate: "2023-05-18T18:30:00.000Z",
                  competition: "ppb:competition:10932509",
                },
              },
              races: {},
              competitions: {
                "ppb:competition:10932509": {
                  typename: "Competition",
                  urn: "ppb:competition:10932509",
                  name: "English Premier League",
                  sport: "ppb:eventType:1",
                  competitionId: 10932509,
                },
              },
              sports: {
                "ppb:eventType:1": {
                  typename: "Sport",
                  urn: "ppb:eventType:1",
                  name: "Football",
                  sportId: 1,
                },
              },
            },
            notifications: {
              subscribedEventIds: [],
            },
          },
          "ppb:tbd:view:event:32333764",
        );
      }

      it("should return push notifications data with pre_match ", () => {
        const pushNotificationsData = setupPushNotificationsData();

        expect(pushNotificationsData).toEqual({
          applicationTypeId: "applicationTypeId",
          deviceId: "deviceId",
          isSystemPushEnabled: true,
          areAllEventsSubscribed: false,
          locale: "en",
          moduleName:
            "NotificationsSubscription - notifications - Football - English Premier League - Newcastle v Brighton - pre_match",
          topics: [
            {
              topicId: "32333764",
              eventType: "FOOTBALL",
              incidentTypes: [
                "FOOTBALL_KICK_OFF",
                "FOOTBALL_HALF_TIME",
                "FOOTBALL_FINAL_SCORE",
                "FOOTBALL_RED_CARD",
                "FOOTBALL_SCORE_CHANGE",
                "FOOTBALL_PENALTY_SHOOTOUT",
              ],
            },
          ],
          unsupportedTopics: [],
          events: [
            {
              id: "32333764",
              isSubscribed: false,
              name: "",
            },
          ],
        });
      });

      it("should return push notifications data with in_play ", () => {
        const {
          createGetSportsbookMarketByHierarchySelector,
        } = require("@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors");
        createGetSportsbookMarketByHierarchySelector.mockImplementation(() =>
          jest.fn().mockReturnValue({ inplay: true }),
        );

        const pushNotificationsData = createPushNotificationsDataFromUrn()(
          {
            localeCode: "en",
            loggedIn: true,
            localeCodeBcp47: "locale",
            timezone: "timezone",
          },
          {
            applicationTypeId: "applicationTypeId",
            deviceId: "deviceId",
            registerOptions: { notificationPreferences: { globalNotifications: true } },
          },
          {
            layouts: {
              views: {
                event: {
                  "ppb:tbd:view:event:32333764": {
                    typename: "EventView",
                    urn: "ppb:tbd:view:event:32333764",
                    url: "football/english-premier-league/newcastle-v-brighton/e-32333764",
                    canonicalUrl: "/sport/football/english-premier-league/newcastle-v-brighton/32333764",
                    sportevent: "ppb:event:32333764",
                  },
                },
                race: {},
              },
            },
            entities: {
              sportevents: {
                "ppb:event:32333764": {
                  typename: "SportsEvent",
                  urn: "ppb:event:32333764",
                  eventId: 32333764,
                  name: "Newcastle v Brighton",
                  openDate: "2023-05-18T18:30:00.000Z",
                  competition: "ppb:competition:10932509",
                },
              },
              races: {},
              competitions: {
                "ppb:competition:10932509": {
                  typename: "Competition",
                  urn: "ppb:competition:10932509",
                  name: "English Premier League",
                  sport: "ppb:eventType:1",
                  competitionId: 10932509,
                },
              },
              sports: {
                "ppb:eventType:1": {
                  typename: "Sport",
                  urn: "ppb:eventType:1",
                  name: "Football",
                  sportId: 1,
                },
              },
              sportsbookmarkets: {
                "market:1": {
                  inplay: true,
                },
              },
            },
            notifications: {
              subscribedEventIds: [],
            },
          },
          "ppb:tbd:view:event:32333764",
          true,
        );

        expect(pushNotificationsData.moduleName).toBe(
          "NotificationsSubscription - notifications - Football - English Premier League - Newcastle v Brighton - in_play",
        );
      });
    });
  });

  describe("createPushNotificationsDataFromSportsbookBet", () => {
    const USER_DETAILS = { localeCode: "en" };
    const DEVICE_INFO = {
      applicationTypeId: "applicationTypeId",
      deviceId: "deviceId",
      registerOptions: { notificationPreferences: { globalNotifications: true } },
    };

    describe("when there is no bet", () => {
      it("should return null", () => {
        expect(
          createPushNotificationsDataFromSportsbookBet()(null, {}, USER_DETAILS, DEVICE_INFO, [], [], true, true),
        ).toEqual(null);
      });
    });

    describe("when the bet is settled", () => {
      it("should return null", () => {
        const settledBet = { isSettled: true, legs: [] };
        expect(
          createPushNotificationsDataFromSportsbookBet()(settledBet, {}, USER_DETAILS, DEVICE_INFO, [], [], true, true),
        ).toEqual(null);
      });
    });

    describe("when MYBETS_BELL throttle is not active", () => {
      it("should return null", () => {
        const bet = { isSettled: false, legs: ["leg1"] };
        expect(
          createPushNotificationsDataFromSportsbookBet()(bet, {}, USER_DETAILS, DEVICE_INFO, [], [], true, false),
        ).toEqual(null);
      });
    });

    describe("when the bet has no leg parts", () => {
      it("should return null", () => {
        const bet = { isSettled: false, legs: ["leg1"] };
        const sportsbookbetlegs = {};
        expect(
          createPushNotificationsDataFromSportsbookBet()(
            bet,
            sportsbookbetlegs,
            USER_DETAILS,
            DEVICE_INFO,
            [],
            [],
            true,
            true,
          ),
        ).toEqual(null);
      });
    });

    describe("when the bet has football events", () => {
      function setupPushNotificationsData({ subscribedEventIds = [], unsupportedEventIds = [] } = {}) {
        const bet = { isSettled: false, betType: "SGL", legs: ["ppb:sportsbookbetleg:123"] };
        const sportsbookbetlegs = {
          "ppb:sportsbookbetleg:123": {
            urn: "ppb:sportsbookbetleg:123",
            parts: [
              {
                eventUrn: "ppb:event:12345",
                sportId: "1",
                eventDescription: "Team A vs Team B",
              },
            ],
          },
        };

        return createPushNotificationsDataFromSportsbookBet()(
          bet,
          sportsbookbetlegs,
          USER_DETAILS,
          DEVICE_INFO,
          subscribedEventIds,
          unsupportedEventIds,
          true,
          true,
        );
      }

      it("should return push notifications data with football topic", () => {
        const pushNotificationsData = setupPushNotificationsData();

        expect(pushNotificationsData).toEqual({
          applicationTypeId: "applicationTypeId",
          deviceId: "deviceId",
          isSystemPushEnabled: true,
          locale: "en",
          isNotificationsSelected: false,
          isNotificationsUnavailable: false,
          areAllEventsSubscribed: false,
          topics: [
            {
              topicId: "12345",
              eventType: "FOOTBALL",
              incidentTypes: [
                "FOOTBALL_KICK_OFF",
                "FOOTBALL_HALF_TIME",
                "FOOTBALL_FINAL_SCORE",
                "FOOTBALL_RED_CARD",
                "FOOTBALL_SCORE_CHANGE",
                "FOOTBALL_PENALTY_SHOOTOUT",
              ],
            },
          ],
          unsupportedTopics: [],
          events: [
            {
              id: "12345",
              name: "Team A vs Team B",
              isSubscribed: false,
              sportId: "1",
            },
          ],
          betType: "SGL",
          sportId: "1",
        });
      });

      it("should mark event as subscribed when already subscribed", () => {
        const pushNotificationsData = setupPushNotificationsData({ subscribedEventIds: ["12345"] });

        expect(pushNotificationsData.areAllEventsSubscribed).toBe(true);
        expect(pushNotificationsData.isNotificationsSelected).toBe(true);
        expect(pushNotificationsData.events[0].isSubscribed).toBe(true);
      });
    });

    describe("when the bet has racing events", () => {
      function setupPushNotificationsData({
        subscribedEventIds = [],
        unsupportedEventIds = [],
        isHRThrottleActive = true,
      } = {}) {
        const bet = { isSettled: false, betType: "SGL", legs: ["ppb:sportsbookbetleg:456"] };
        const sportsbookbetlegs = {
          "ppb:sportsbookbetleg:456": {
            urn: "ppb:sportsbookbetleg:456",
            parts: [
              {
                raceUrn: "ppb:race:67890.123",
                sportId: "7",
                eventDescription: "15:30 Ascot",
              },
            ],
          },
        };

        return createPushNotificationsDataFromSportsbookBet()(
          bet,
          sportsbookbetlegs,
          USER_DETAILS,
          DEVICE_INFO,
          subscribedEventIds,
          unsupportedEventIds,
          isHRThrottleActive,
          true,
        );
      }

      it("should return push notifications data with horse race topic when HR throttle is not active", () => {
        const pushNotificationsData = setupPushNotificationsData({ isHRThrottleActive: false });

        expect(pushNotificationsData).toEqual({
          applicationTypeId: "applicationTypeId",
          deviceId: "deviceId",
          isSystemPushEnabled: true,
          locale: "en",
          isNotificationsSelected: false,
          isNotificationsUnavailable: false,
          areAllEventsSubscribed: false,
          topics: [
            {
              topicId: "67890.123",
              eventType: "HORSE_RACE",
              incidentTypes: ["HORSE_RACE_KICK_OFF", "HORSE_RACE_NON_RUNNER", "HORSE_RACE_FINAL_RESULT"],
            },
          ],
          unsupportedTopics: [],
          events: [
            {
              id: "67890.123",
              name: "15:30 Ascot",
              isSubscribed: false,
              sportId: "7",
            },
          ],
          betType: "SGL",
          sportId: "7",
        });
      });

      it("should add race to unsupported topics when HR throttle is active", () => {
        const pushNotificationsData = setupPushNotificationsData({ isHRThrottleActive: true });

        expect(pushNotificationsData.topics).toEqual([]);
        expect(pushNotificationsData.unsupportedTopics).toEqual(["67890.123"]);
      });
    });

    describe("when the bet has multiple events", () => {
      function setupPushNotificationsData({ subscribedEventIds = [], unsupportedEventIds = [] } = {}) {
        const bet = {
          isSettled: false,
          betType: "DBL",
          legs: ["ppb:sportsbookbetleg:123", "ppb:sportsbookbetleg:456"],
        };
        const sportsbookbetlegs = {
          "ppb:sportsbookbetleg:123": {
            urn: "ppb:sportsbookbetleg:123",
            parts: [
              {
                eventUrn: "ppb:event:11111",
                sportId: "1",
                eventDescription: "Match 1",
              },
            ],
          },
          "ppb:sportsbookbetleg:456": {
            urn: "ppb:sportsbookbetleg:456",
            parts: [
              {
                eventUrn: "ppb:event:22222",
                sportId: "1",
                eventDescription: "Match 2",
              },
            ],
          },
        };

        return createPushNotificationsDataFromSportsbookBet()(
          bet,
          sportsbookbetlegs,
          USER_DETAILS,
          DEVICE_INFO,
          subscribedEventIds,
          unsupportedEventIds,
          true,
          true,
        );
      }

      it("should return push notifications data with multiple topics", () => {
        const pushNotificationsData = setupPushNotificationsData();

        expect(pushNotificationsData.topics).toHaveLength(2);
        expect(pushNotificationsData.events).toHaveLength(2);
        expect(pushNotificationsData.areAllEventsSubscribed).toBe(false);
        expect(pushNotificationsData.betType).toBe("DBL");
        expect(pushNotificationsData.sportId).toBe("1");
      });

      it("should mark all events as subscribed when all are subscribed", () => {
        const pushNotificationsData = setupPushNotificationsData({ subscribedEventIds: ["11111", "22222"] });

        expect(pushNotificationsData.areAllEventsSubscribed).toBe(true);
        expect(pushNotificationsData.isNotificationsSelected).toBe(true);
      });

      it("should not mark all events as subscribed when only some are subscribed", () => {
        const pushNotificationsData = setupPushNotificationsData({ subscribedEventIds: ["11111"] });

        expect(pushNotificationsData.areAllEventsSubscribed).toBe(false);
        expect(pushNotificationsData.isNotificationsSelected).toBe(false);
      });
    });

    describe("when first leg is an unsupported sport but subsequent legs have supported sports", () => {
      it("should return sportId from the first supported sport (football), not from the first leg (tennis)", () => {
        const bet = {
          isSettled: false,
          betType: "TBL",
          legs: ["ppb:sportsbookbetleg:tennis", "ppb:sportsbookbetleg:football", "ppb:sportsbookbetleg:cricket"],
        };
        const sportsbookbetlegs = {
          "ppb:sportsbookbetleg:tennis": {
            urn: "ppb:sportsbookbetleg:tennis",
            parts: [
              {
                eventUrn: "ppb:event:11111",
                sportId: "5", // Tennis - unsupported
                eventDescription: "Tennis Match",
              },
            ],
          },
          "ppb:sportsbookbetleg:football": {
            urn: "ppb:sportsbookbetleg:football",
            parts: [
              {
                eventUrn: "ppb:event:22222",
                sportId: "1", // Football - supported
                eventDescription: "Football Match",
              },
            ],
          },
          "ppb:sportsbookbetleg:cricket": {
            urn: "ppb:sportsbookbetleg:cricket",
            parts: [
              {
                eventUrn: "ppb:event:33333",
                sportId: "10", // Cricket - unsupported
                eventDescription: "Cricket Match",
              },
            ],
          },
        };

        const pushNotificationsData = createPushNotificationsDataFromSportsbookBet()(
          bet,
          sportsbookbetlegs,
          USER_DETAILS,
          DEVICE_INFO,
          [],
          ["11111", "33333"],
          true,
          true,
        );

        expect(pushNotificationsData.sportId).toBe("1"); // Should be football, not tennis
        expect(pushNotificationsData.topics).toHaveLength(1); // Only football should be in topics
        expect(pushNotificationsData.unsupportedTopics).toHaveLength(2); // Tennis and cricket are unsupported
        expect(pushNotificationsData.betType).toBe("TBL");
      });
    });

    describe("when all events are unsupported", () => {
      it("should return isNotificationsUnavailable as true", () => {
        const bet = { isSettled: false, betType: "SGL", legs: ["ppb:sportsbookbetleg:123"] };
        const sportsbookbetlegs = {
          "ppb:sportsbookbetleg:123": {
            urn: "ppb:sportsbookbetleg:123",
            parts: [
              {
                eventUrn: "ppb:event:99999",
                sportId: "99",
                eventDescription: "Unsupported Event",
              },
            ],
          },
        };

        const pushNotificationsData = createPushNotificationsDataFromSportsbookBet()(
          bet,
          sportsbookbetlegs,
          USER_DETAILS,
          DEVICE_INFO,
          [],
          ["99999"],
          true,
          true,
        );

        expect(pushNotificationsData.isNotificationsUnavailable).toBe(true);
        expect(pushNotificationsData.unsupportedTopics).toContain("99999");
        expect(pushNotificationsData.betType).toBe("SGL");
        expect(pushNotificationsData.sportId).toBe(undefined);
      });
    });

    describe("when system push is disabled", () => {
      it("should return isNotificationsSelected as false even when all events are subscribed", () => {
        const bet = { isSettled: false, betType: "SGL", legs: ["ppb:sportsbookbetleg:123"] };
        const sportsbookbetlegs = {
          "ppb:sportsbookbetleg:123": {
            urn: "ppb:sportsbookbetleg:123",
            parts: [
              {
                eventUrn: "ppb:event:12345",
                sportId: "1",
                eventDescription: "Team A vs Team B",
              },
            ],
          },
        };
        const deviceInfoWithPushDisabled = {
          ...DEVICE_INFO,
          registerOptions: { notificationPreferences: { globalNotifications: false } },
        };

        const pushNotificationsData = createPushNotificationsDataFromSportsbookBet()(
          bet,
          sportsbookbetlegs,
          USER_DETAILS,
          deviceInfoWithPushDisabled,
          ["12345"],
          [],
          true,
          true,
        );

        expect(pushNotificationsData.isSystemPushEnabled).toBe(false);
        expect(pushNotificationsData.areAllEventsSubscribed).toBe(true);
        expect(pushNotificationsData.isNotificationsSelected).toBe(false);
        expect(pushNotificationsData.betType).toBe("SGL");
        expect(pushNotificationsData.sportId).toBe("1");
      });
    });
  });

  describe("createLiveActivityPayload", () => {
    const EVENT_URN = "ppb:event:32333764";
    const VIEW_URN = "ppb:tbd:view:event:32333764";
    const FIXTURE_KEY = "ppb:fixture:32333764";

    const baseEvent = {
      typename: "SportsEvent",
      urn: EVENT_URN,
      eventId: 32333764,
      openDate: "2026-05-21T15:00:00Z",
    };

    const baseFixture = {
      home: { name: "Home FC", jerseys: [{ url: "home-crest" }] },
      away: { name: "Away FC", jerseys: [{ url: "away-crest" }] },
      duration: {
        status: "IN_PLAY_FIRST_HALF",
        period: "EXTRA",
        clock: { minute: 23, second: 45 },
      },
      score: { home: 1, away: 2 },
    };

    const buildState = ({ event = baseEvent, fixture = baseFixture, includeView = true } = {}) => ({
      layouts: {
        views: {
          event: includeView ? { [VIEW_URN]: { typename: "EventView", urn: VIEW_URN, sportevent: EVENT_URN } } : {},
          race: {},
        },
      },
      entities: {
        sportevents: event ? { [EVENT_URN]: event } : {},
        footballfixtures: fixture ? { [FIXTURE_KEY]: fixture } : {},
      },
    });

    it("should return null when the viewUrn is missing", () => {
      expect(createLiveActivityPayload()(buildState(), undefined)).toBeNull();
    });

    it("should return null when no event view matches the URN", () => {
      expect(createLiveActivityPayload()(buildState({ includeView: false }), VIEW_URN)).toBeNull();
    });

    it("should return null when the sport event has no eventId", () => {
      const eventWithoutId = { ...baseEvent, eventId: undefined };
      expect(createLiveActivityPayload()(buildState({ event: eventWithoutId }), VIEW_URN)).toBeNull();
    });

    it("should return null when the sport event has no openDate", () => {
      const eventWithoutDate = { ...baseEvent, openDate: undefined };
      expect(createLiveActivityPayload()(buildState({ event: eventWithoutDate }), VIEW_URN)).toBeNull();
    });

    it("should return null when there is no football fixture for the event", () => {
      expect(createLiveActivityPayload()(buildState({ fixture: null }), VIEW_URN)).toBeNull();
    });

    it("should return a fully populated payload when all data is present", () => {
      const result = createLiveActivityPayload()(buildState(), VIEW_URN);

      expect(result).toEqual({
        eventId: "32333764",
        startTime: "2026-05-21T15:00:00Z",
        matchStatus: "IN_PLAY_FIRST_HALF",
        matchPeriod: "EXTRA",
        teams: {
          home: { name: "Home FC", crest: "home-crest" },
          away: { name: "Away FC", crest: "away-crest" },
        },
        score: { home: 1, away: 2 },
        penaltyScore: undefined,
        clock: { minutes: 23, seconds: 45 },
      });
    });

    it("should fall back to defaults when the fixture is minimal", () => {
      const minimalFixture = { home: {}, away: {} };
      const result = createLiveActivityPayload()(buildState({ fixture: minimalFixture }), VIEW_URN);

      expect(result.matchStatus).toBe("PRE_MATCH");
      expect(result.matchPeriod).toBe("REGULAR");
      expect(result.teams.home).toEqual({ name: "-", crest: undefined });
      expect(result.teams.away).toEqual({ name: "-", crest: undefined });
      expect(result.clock).toEqual({ minutes: 0, seconds: 0 });
    });
  });
});
