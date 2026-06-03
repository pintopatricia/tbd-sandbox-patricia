import React from "react";
import { render } from "@testing-library/react-native";
import { ScoreboardViewMode, MatchStatus } from "@ppb/the-wall-common/types";
import { AvBFixture, AvBScoreboard } from "@ppb/the-wall-native";
import DartsFixture from "./DartsFixture.native";
import { formatCouponScoreBoardData } from "./DartsFixture.helper";

jest.mock("@ppb/the-wall-native", () => ({
  AvBScoreboard: jest.fn(() => <avb-scoreboard-mock testID="scoreboard" />),
  AvBFixture: jest.fn(({ children }) => <avb-fixture-mock testID="fixture">{children}</avb-fixture-mock>),
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("@ppb/the-wall-icons", () => ({
  SportsIconName: { DARTS: "DartsIcon" },
  SystemIconName: { NOTIFICATION_OFF: "NOTIFICATION_OFF" },
}));

jest.mock("@ppb/the-wall-common/types", () => ({
  ScoreboardViewMode: { DEFAULT: "DEFAULT", COUPON: "COUPON", SMALL: "SMALL" },
  MatchStatus: { PRE_MATCH: "PRE_MATCH", IN_PLAY: "IN_PLAY", END: "END" },
}));

jest.mock("./DartsFixture.helper", () => ({
  isDartsFixtureEqual: jest.fn(() => false),
  formatCouponScoreBoardData: jest.fn(),
}));

function renderDartsFixture(dartsFixtureProps) {
  return render(<DartsFixture {...dartsFixtureProps} />);
}

const COMPETITION_NAME = "Premier League";
const DATE = "tomorrow";
const DATE_TIME = new Date("2022-06-11 21:00:00");
const ICON = "icon";
const MATCH_STATUS = MatchStatus.IN_PLAY;
const NOTIFICATIONS_SUBSCRIPTION = false;
const SCORE_DATA = [
  {
    home: 1,
    away: 2,
    style: "BORDER",
  },
  {
    home: 3,
    away: 4,
    style: "GREY_BACKGROUND",
  },
];
const SHOW_BOTTOM_SEPARATOR = "bottomSeparator";
const TEAM_A = { name: "Player A" };
const TEAM_B = { name: "Player B" };
const TIME = "21:00";
const VIEW_MODE = ScoreboardViewMode.SMALL;
const CURRENT_SET = { number: 1, score: { home: 1, away: 0 } };

const dartsFixtureProps = {
  competition: COMPETITION_NAME,
  date: DATE,
  dateTime: DATE_TIME,
  icon: ICON,
  matchStatus: MATCH_STATUS,
  notificationsSubscription: NOTIFICATIONS_SUBSCRIPTION,
  scoreData: SCORE_DATA,
  showBottomSeparator: SHOW_BOTTOM_SEPARATOR,
  showEventDateBelow: true,
  showHorizontalDuration: true,
  teamA: TEAM_A,
  teamB: TEAM_B,
  time: TIME,
  viewMode: VIEW_MODE,
  videoAvailable: true,
  labels: { inplay: "inplayz" },
  currentSet: CURRENT_SET,
  isDartsCouponScoreboardEnabled: true,
};

describe("DartsFixture", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    formatCouponScoreBoardData.mockImplementation((data) => data);
  });

  let container;

  describe("When Throttle is Enabled", () => {
    it("should call formatCouponScoreBoardData logic", () => {
      renderDartsFixture({ ...dartsFixtureProps, isDartsCouponScoreboardEnabled: true });

      expect(formatCouponScoreBoardData).toHaveBeenCalledWith(
        dartsFixtureProps.scoreData,
        dartsFixtureProps.viewMode,
        dartsFixtureProps.currentSet,
        dartsFixtureProps.matchStatus,
      );
    });
  });

  describe("When Throttle is Disabled", () => {
    it("should pass undefined scoreData (Hiding scoreboard entirely)", () => {
      renderDartsFixture({ ...dartsFixtureProps, isDartsCouponScoreboardEnabled: false });

      expect(formatCouponScoreBoardData).not.toHaveBeenCalled();

      expect(AvBScoreboard).toHaveBeenCalledWith(
        expect.objectContaining({
          scoreData: undefined,
        }),
        undefined,
      );
    });
  });
  // ---------------------------

  describe("when matchStatus is PRE_MATCH", () => {
    beforeEach(() => {
      container = renderDartsFixture({
        ...dartsFixtureProps,
        matchStatus: MatchStatus.PRE_MATCH,
      });
    });

    it("should call AvBScoreboard with undefined scoreData (Hides 0-0, Shows Time)", () => {
      expect(AvBScoreboard).toHaveBeenCalledWith(
        expect.objectContaining({
          scoreData: undefined,
        }),
        undefined,
      );
    });

    it("should NOT call formatCouponScoreBoardData helper", () => {
      expect(formatCouponScoreBoardData).not.toHaveBeenCalled();
    });
  });

  describe("when viewMode is COUPON", () => {
    beforeEach(() => {
      formatCouponScoreBoardData.mockReturnValue([SCORE_DATA[0]]);

      container = renderDartsFixture({
        ...dartsFixtureProps,
        viewMode: ScoreboardViewMode.COUPON,
      });
    });

    it("should render AvBFixture and AvBScoreboard components", () => {
      const { queryByTestId } = container;
      const fixture = queryByTestId("fixture");
      const scoreboard = queryByTestId("scoreboard");
      expect(fixture).not.toBeNull();
      expect(scoreboard).not.toBeNull();
    });

    it("should call AvBFixture with correct arguments", () => {
      expect(AvBFixture).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: undefined,
          showBottomSeparator: SHOW_BOTTOM_SEPARATOR,
          competitionLabel: undefined,
          notificationsSubscription: undefined,
          viewMode: ScoreboardViewMode.COUPON,
        }),
        undefined,
      );
    });

    it("should call formatCouponScoreBoardData helper correctly", () => {
      expect(formatCouponScoreBoardData).toHaveBeenCalledWith(
        SCORE_DATA,
        ScoreboardViewMode.COUPON,
        CURRENT_SET,
        MATCH_STATUS,
      );
    });

    it("should call AvBScoreboard with correct arguments from helper", () => {
      expect(AvBScoreboard).toHaveBeenCalledWith(
        expect.objectContaining({
          scoreData: [SCORE_DATA[0]],
          showEventDateBelow: dartsFixtureProps.showEventDateBelow,
          showHorizontalDuration: dartsFixtureProps.showHorizontalDuration,
          statusLabel: undefined,
        }),
        undefined,
      );
    });
  });

  describe("when viewMode is SMALL", () => {
    beforeEach(() => {
      container = renderDartsFixture({
        ...dartsFixtureProps,
        viewMode: ScoreboardViewMode.SMALL,
      });
    });

    it("should call AvBScoreboard with correct arguments", () => {
      expect(AvBScoreboard).toHaveBeenCalledWith(
        expect.objectContaining({
          scoreData: SCORE_DATA,
        }),
        undefined,
      );
    });
  });

  describe("when viewMode is DEFAULT", () => {
    beforeEach(() => {
      container = renderDartsFixture({
        ...dartsFixtureProps,
        viewMode: ScoreboardViewMode.DEFAULT,
      });
    });

    it("should call AvBScoreboard with correct arguments", () => {
      expect(AvBScoreboard).toHaveBeenCalledWith(
        expect.objectContaining({
          scoreData: SCORE_DATA,
        }),
        undefined,
      );
    });

    describe("when there is a notificationSubscriptionIcon", () => {
      beforeEach(() => {
        container = renderDartsFixture({
          ...dartsFixtureProps,
          notificationsSubscription: true,
          viewMode: ScoreboardViewMode.DEFAULT,
        });
      });

      it("should call AvBFixture with correct arguments", () => {
        expect(AvBFixture).toHaveBeenCalledWith(
          expect.objectContaining({
            notificationsSubscription: expect.anything(),
          }),
          undefined,
        );
      });
    });
  });

  describe("when viewMode is undefined", () => {
    beforeEach(() => {
      container = renderDartsFixture({
        ...dartsFixtureProps,
        viewMode: undefined,
      });
    });

    it("should call AvBFixture with correct arguments", () => {
      expect(AvBFixture).toHaveBeenCalledWith(
        expect.objectContaining({
          viewMode: ScoreboardViewMode.DEFAULT,
        }),
        undefined,
      );
    });

    it("should call AvBScoreboard with correct arguments", () => {
      expect(AvBScoreboard).toHaveBeenCalledWith(
        expect.objectContaining({
          viewMode: ScoreboardViewMode.DEFAULT,
          showEventDateBelow: dartsFixtureProps.showEventDateBelow,
        }),
        undefined,
      );
    });
  });

  describe("when icon is undefined", () => {
    beforeEach(() => {
      container = renderDartsFixture({ ...dartsFixtureProps, icon: undefined });
    });

    it("should call AvBFixture with correct arguments (Default Icon)", () => {
      expect(AvBFixture).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "DartsIcon",
        }),
        undefined,
      );
    });
  });
});
