import { FixtureTeamSide, PenaltyStatus } from "@ppb/tbd-store/state/entities/football-fixture/FootballFixture.types";
import { PenaltiesKick } from "@ppb/the-wall-common/types";
import { getOpponentsNames } from "@ppb/tbd-store/helpers/fixture";

import { formatDateWithToday, formatTime } from "../helpers/dates";

import { createPropsForScoreboardVm } from "./scoreboard";

jest.mock("../helpers/i18n", () => ({
  i18n: ({ key }) => key,
}));

jest.mock("../helpers/dates", () => ({
  formatDateWithToday: jest.fn(() => "MOCKED_DATE"),
  formatTime: jest.fn(() => "MOCKED_TIME"),
}));

jest.mock("@ppb/tbd-store/helpers/fixture", () => ({
  getOpponentsNames: jest.fn(),
}));

global.Date.now = jest.fn(() => new Date("2019-12-23T12:15:00Z"));

const USER_DETAILS = {
  localeCodeBcp47: "locale",
  timezone: "timezone",
};

describe("scoreboard view model factory", () => {
  let footballFixture;
  beforeEach(() => {
    footballFixture = {
      urn: "ppb:footballfixture:29601422",
      scheduledAt: new Date("2019-12-23T12:15:00Z"),
      home: {
        name: "Aston Villa",
        color: "",
        crest: {
          vector: "http://sca.qa.internal/Assets/Team%20Logo/English%20Premier%20League/Aston%20Villa.svg",
          small: "http://sca.qa.internal/Assets/logo/small/40.png",
          medium: "http://sca.qa.internal/Assets/logo/medium/40.png",
          large: "http://sca.qa.internal/Assets/logo/big/40.png",
        },
      },
      away: {
        name: "Leeds",
        color: "",
        crest: {
          small: "http://sca.qa.internal/Assets/logo/small/34.png",
          medium: "http://sca.qa.internal/Assets/logo/medium/34.png",
          large: "http://sca.qa.internal/Assets/logo/big/34.png",
        },
      },
      duration: {
        period: "EXTRA",
        status: "PENALTY_SHOOTOUT",
        clock: {
          minute: 24,
          second: 48,
        },
        stoppageMinutes: 0,
      },
      score: {
        home: 2,
        away: 1,
      },
      penaltyShootout: {
        firstTeamToShoot: FixtureTeamSide.HOME,
        nextTeamToShoot: FixtureTeamSide.HOME,
        penaltyFormat: "ABAB",
        penaltyScores: [
          {
            penaltyNumber: 4,
            side: FixtureTeamSide.AWAY,
            shotResult: PenaltyStatus.SCORE,
          },
          {
            penaltyNumber: 3,
            side: FixtureTeamSide.HOME,
            shotResult: PenaltyStatus.MISS,
          },
          {
            penaltyNumber: 2,
            side: FixtureTeamSide.AWAY,
            shotResult: PenaltyStatus.SCORE,
          },
          {
            penaltyNumber: 1,
            side: FixtureTeamSide.HOME,
            shotResult: PenaltyStatus.SCORE,
          },
        ],
      },
      stats: [{ period: undefined, periodStatus: "FULL", home: { redCards: 2 }, away: { redCards: 5 } }],
    };
  });

  it("should return the correct view model", () => {
    expect(createPropsForScoreboardVm()(footballFixture, USER_DETAILS, false)).toEqual({
      away: {
        color: "",
        crestUrl: "http://sca.qa.internal/Assets/logo/big/34.png",
        name: "Leeds",
      },
      date: "MOCKED_DATE",
      dateTime: new Date("2019-12-23T12:15:00.000Z"),
      duration: {
        clock: 25,
        extraTime: 0,
        period: "EXTRA",
        status: "PENALTY_SHOOTOUT",
      },
      firstLegScore: undefined,
      inplay: false,
      home: {
        color: "",
        crestUrl: "http://sca.qa.internal/Assets/Team%20Logo/English%20Premier%20League/Aston%20Villa.svg",
        name: "Aston Villa",
      },
      score: {
        away: 1,
        home: 2,
      },
      time: "MOCKED_TIME",
      penaltyScore: {
        home: 1,
        away: 2,
      },
      penaltyShootout: [
        [PenaltiesKick.GOAL, PenaltiesKick.MISS, PenaltiesKick.INPLAY, PenaltiesKick.PREPLAY, PenaltiesKick.PREPLAY],
        [PenaltiesKick.GOAL, PenaltiesKick.GOAL, PenaltiesKick.PREPLAY, PenaltiesKick.PREPLAY, PenaltiesKick.PREPLAY],
      ],
      translations: {
        i18n: {
          error: "I18N.FOOTBALL_SCOREBOARD.ERROR",
          firstLeg: "I18N.FOOTBALL_SCOREBOARD.FIRST_LEG",
          full: "I18N.FOOTBALL_SCOREBOARD.FULL",
          half: "I18N.FOOTBALL_SCOREBOARD.HALF",
          penalties: "I18N.FOOTBALL_SCOREBOARD.PENALTIES",
          pen: "I18N.RECENT_FORM.PEN",
          versus: "I18N.FOOTBALL_SCOREBOARD.VERSUS",
          extraTime: "I18N.FOOTBALL_SCOREBOARD.EXTRA_TIME",
          inplay: "I18N.SPORT_EVENT.IN_PLAY",
        },
      },
      redCards: { home: 2, away: 5 },
    });

    expect(formatTime).toHaveBeenCalledWith(expect.any(Date), "locale", "timezone");
    expect(formatDateWithToday).toHaveBeenCalledWith(expect.any(Date), "locale", "timezone");
  });

  describe("when there are runnerNames", () => {
    it("should return those home and away names", () => {
      getOpponentsNames.mockReturnValue({ teamA: "Team A", teamB: "Team B" });

      expect(createPropsForScoreboardVm()(footballFixture, USER_DETAILS).home.name).toEqual("Team A");
      expect(createPropsForScoreboardVm()(footballFixture, USER_DETAILS).away.name).toEqual("Team B");
    });
  });

  it("should return the correct date when isToday returns true", () => {
    formatDateWithToday.mockReturnValueOnce("I18N.DATE.TODAY");

    expect(createPropsForScoreboardVm()(footballFixture, USER_DETAILS).date).toEqual("I18N.DATE.TODAY");
  });

  it("should return only group of 5 penalties if there are more than 5 penalties", () => {
    footballFixture.penaltyShootout = {
      firstTeamToShoot: FixtureTeamSide.HOME,
      nextTeamToShoot: FixtureTeamSide.AWAY,
      penaltyFormat: "ABAB",
      penaltyScores: [
        {
          penaltyNumber: 12,
          side: FixtureTeamSide.AWAY,
          shotResult: PenaltyStatus.MISS,
        },
        {
          penaltyNumber: 11,
          side: FixtureTeamSide.HOME,
          shotResult: PenaltyStatus.SCORE,
        },
        {
          penaltyNumber: 10,
          side: FixtureTeamSide.AWAY,
          shotResult: PenaltyStatus.SCORE,
        },
        {
          penaltyNumber: 9,
          side: FixtureTeamSide.HOME,
          shotResult: PenaltyStatus.MISS,
        },
        {
          penaltyNumber: 8,
          side: FixtureTeamSide.AWAY,
          shotResult: PenaltyStatus.SCORE,
        },
        {
          penaltyNumber: 7,
          side: FixtureTeamSide.HOME,
          shotResult: PenaltyStatus.SCORE,
        },
        {
          penaltyNumber: 6,
          side: FixtureTeamSide.AWAY,
          shotResult: PenaltyStatus.MISS,
        },
        {
          penaltyNumber: 5,
          side: FixtureTeamSide.HOME,
          shotResult: PenaltyStatus.SCORE,
        },
        {
          penaltyNumber: 4,
          side: FixtureTeamSide.AWAY,
          shotResult: PenaltyStatus.SCORE,
        },
        {
          penaltyNumber: 3,
          side: FixtureTeamSide.HOME,
          shotResult: PenaltyStatus.MISS,
        },
        {
          penaltyNumber: 2,
          side: FixtureTeamSide.AWAY,
          shotResult: PenaltyStatus.SCORE,
        },
        {
          penaltyNumber: 1,
          side: FixtureTeamSide.HOME,
          shotResult: PenaltyStatus.SCORE,
        },
      ],
    };

    const propsForScoreboard = createPropsForScoreboardVm()(footballFixture, USER_DETAILS);
    expect(propsForScoreboard.penaltyScore).toEqual({
      home: 4,
      away: 4,
    });
    expect(propsForScoreboard.penaltyShootout).toEqual([
      [PenaltiesKick.GOAL, PenaltiesKick.PREPLAY, PenaltiesKick.PREPLAY, PenaltiesKick.PREPLAY, PenaltiesKick.PREPLAY],
      [PenaltiesKick.MISS, PenaltiesKick.INPLAY, PenaltiesKick.PREPLAY, PenaltiesKick.PREPLAY, PenaltiesKick.PREPLAY],
    ]);
  });

  it("should round up the minute", () => {
    footballFixture.duration = {
      clock: {
        minute: 0,
        second: 1,
      },
    };

    const propsForScoreboard = createPropsForScoreboardVm()(footballFixture, USER_DETAILS);
    expect(propsForScoreboard.duration.clock).toBe(1);
  });

  describe("when clock is missing", () => {
    it("should return clock as undefined", () => {
      delete footballFixture.duration.clock;

      const propsForScoreboard = createPropsForScoreboardVm()(footballFixture, USER_DETAILS);
      expect(propsForScoreboard.duration.clock).toBeUndefined();
    });
  });

  describe("when there's no Full match stats with undefined period", () => {
    it("should return red cards with values as 0", () => {
      footballFixture.stats = [
        { period: "REGULAR", periodStatus: "FULL", home: { redCards: 2 }, away: { redCards: 5 } },
        { period: "REGULAR", periodStatus: "INPLAY_FIRST_HALF", home: { redCards: 1 }, away: { redCards: 4 } },
        { period: "REGULAR", periodStatus: "INPLAY_SECOND_HALF", home: { redCards: 1 }, away: { redCards: 1 } },
      ];

      const propsForScoreboard = createPropsForScoreboardVm()(footballFixture, USER_DETAILS);
      expect(propsForScoreboard.redCards).toEqual({ home: 0, away: 0 });
    });
  });
});
