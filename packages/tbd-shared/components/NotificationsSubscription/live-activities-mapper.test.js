import { createLiveActivityViewModel } from "./live-activities-mapper";

jest.mock("reselect", () => ({
  createSelector: jest.fn((_deps, selector) => selector),
}));

jest.mock("@ppb/tbd-store/state/entities/sport-events/sport-event-selectors", () => ({
  createSportEventByURNSelector: jest.fn(() => jest.fn()),
}));

jest.mock("@ppb/tbd-store/state/layout/views/view-selectors", () => ({
  createViewByURNSelector: jest.fn(() => jest.fn()),
}));

jest.mock("@ppb/tbd-store/state/layout/URN", () => ({}));

jest.mock("@ppb/tbd-store/state/entities/notifications/notifications-selectors", () => ({
  createGetNotificationsDeviceSelector: jest.fn(() => jest.fn()),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => jest.fn()),
}));

jest.mock("@ppb/tbd-store", () => ({
  FixtureTeamSide: { HOME: "HOME", AWAY: "AWAY" },
  FootballMatchPeriod: { REGULAR: "regular", EXTRA: "extra" },
  FootballMatchStatus: { PRE_MATCH: "preMatch", IN_PLAY_FIRST_HALF: "inPlayFirstHalf" },
  PenaltyStatus: { SCORE: "SCORE", MISS: "MISS" },
}));

const DEVICE_INFO = { applicationTypeId: "appType", deviceId: "device" };
const USER_DETAILS = { localeCode: "en-GB" };

const baseEvent = { eventId: 123, openDate: "2026-05-21T15:00:00Z" };
const baseFixture = {
  home: { name: "Home FC", crest: { small: "home-crest" } },
  away: { name: "Away FC", crest: { small: "away-crest" } },
  duration: {
    status: "inPlayFirstHalf",
    period: "regular",
    clock: { minute: 23, second: 45 },
  },
  score: { home: 1, away: 2 },
};

describe("createLiveActivityViewModel", () => {
  it("should return null when the event is missing", () => {
    const selector = createLiveActivityViewModel();
    expect(selector(undefined, baseFixture, DEVICE_INFO, USER_DETAILS)).toBeNull();
  });

  it("should return null when the football fixture is missing", () => {
    const selector = createLiveActivityViewModel();
    expect(selector(baseEvent, undefined, DEVICE_INFO, USER_DETAILS)).toBeNull();
  });

  it("should return null when device info has no applicationTypeId", () => {
    const selector = createLiveActivityViewModel();
    expect(selector(baseEvent, baseFixture, { deviceId: "device" }, USER_DETAILS)).toBeNull();
  });

  it("should return null when device info has no deviceId", () => {
    const selector = createLiveActivityViewModel();
    expect(selector(baseEvent, baseFixture, { applicationTypeId: "appType" }, USER_DETAILS)).toBeNull();
  });

  it("should return null when user details has no localeCode", () => {
    const selector = createLiveActivityViewModel();
    expect(selector(baseEvent, baseFixture, DEVICE_INFO, {})).toBeNull();
  });

  it("should return null when the event has no eventId", () => {
    const selector = createLiveActivityViewModel();
    expect(selector({ openDate: "2026-05-21T15:00:00Z" }, baseFixture, DEVICE_INFO, USER_DETAILS)).toBeNull();
  });

  it("should return null when the event has no openDate", () => {
    const selector = createLiveActivityViewModel();
    expect(selector({ eventId: 123 }, baseFixture, DEVICE_INFO, USER_DETAILS)).toBeNull();
  });

  it("should return a fully populated view model when all inputs are present", () => {
    const selector = createLiveActivityViewModel();

    const result = selector(baseEvent, baseFixture, DEVICE_INFO, USER_DETAILS);

    expect(result).toEqual({
      applicationTypeId: "appType",
      deviceId: "device",
      locale: "en-GB",
      eventId: "123",
      startTime: "2026-05-21T15:00:00Z",
      matchStatus: "inPlayFirstHalf",
      matchPeriod: "regular",
      teams: {
        home: { name: "Home FC", crest: "home-crest" },
        away: { name: "Away FC", crest: "away-crest" },
      },
      score: { home: 1, away: 2 },
      penaltyScore: undefined,
      clock: { minutes: 23, seconds: 45 },
    });
  });

  it("should fall back to default match status, period, names and clock values", () => {
    const selector = createLiveActivityViewModel();

    const result = selector(
      baseEvent,
      {
        home: {},
        away: {},
      },
      DEVICE_INFO,
      USER_DETAILS,
    );

    expect(result.matchStatus).toBe("preMatch");
    expect(result.matchPeriod).toBe("regular");
    expect(result.teams.home).toEqual({ name: "-", crest: undefined });
    expect(result.teams.away).toEqual({ name: "-", crest: undefined });
    expect(result.clock).toEqual({ minutes: 0, seconds: 0 });
  });

  it("should compute penaltyScore from penalty shootout shots", () => {
    const selector = createLiveActivityViewModel();

    const fixtureWithPenalties = {
      ...baseFixture,
      penaltyShootout: {
        penaltyScores: [
          { side: "HOME", shotResult: "SCORE" },
          { side: "AWAY", shotResult: "MISS" },
          { side: "HOME", shotResult: "SCORE" },
          { side: "AWAY", shotResult: "SCORE" },
        ],
      },
    };

    const result = selector(baseEvent, fixtureWithPenalties, DEVICE_INFO, USER_DETAILS);

    expect(result.penaltyScore).toEqual({ home: 2, away: 1 });
  });

  it("should return penaltyScore as zero-zero when no shots have SCORE status", () => {
    const selector = createLiveActivityViewModel();

    const fixtureWithMisses = {
      ...baseFixture,
      penaltyShootout: {
        penaltyScores: [
          { side: "HOME", shotResult: "MISS" },
          { side: "AWAY", shotResult: "MISS" },
        ],
      },
    };

    const result = selector(baseEvent, fixtureWithMisses, DEVICE_INFO, USER_DETAILS);

    expect(result.penaltyScore).toEqual({ home: 0, away: 0 });
  });

  it("should return undefined penaltyScore when the penalty shootout is missing", () => {
    const selector = createLiveActivityViewModel();

    const result = selector(baseEvent, baseFixture, DEVICE_INFO, USER_DETAILS);

    expect(result.penaltyScore).toBeUndefined();
  });
});
