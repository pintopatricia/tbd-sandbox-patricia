import React from "react";
import { render } from "@testing-library/react";
import { AvBFixture, AvBScoreboard } from "@ppb/the-wall-web";
import { ScoreboardViewMode, MatchStatus } from "@ppb/the-wall-common/types";
import DartsFixture from "./DartsFixture.web";
import { formatCouponScoreBoardData } from "./DartsFixture.helper";

jest.mock("@ppb/the-wall-web", () => ({
  AvBFixture: jest.fn(({ children }) => <div data-testid="AvBFixture">{children}</div>),
  AvBScoreboard: jest.fn(() => <div data-testid="AvBScoreboard" />),
}));

jest.mock("./DartsFixture.helper", () => ({
  isDartsFixtureEqual: jest.fn(() => false),
  formatCouponScoreBoardData: jest.fn(),
}));

describe("DartsFixture Web Component", () => {
  const mockProps = {
    competition: "Premier League",
    event: "Van Gerwen vs Price",
    date: "Today",
    dateTime: new Date("2025-01-01T20:00:00"),
    matchStatus: MatchStatus.IN_PLAY,
    scoreData: [{ home: 1, away: 2 }],
    showBottomSeparator: true,
    showEventDateBelow: false,
    teamA: { name: "Van Gerwen" },
    teamB: { name: "Price" },
    time: "20:00",
    viewMode: ScoreboardViewMode.DEFAULT,
    videoAvailable: true,
    labels: { inplay: "In Play" },
    currentSet: { number: 1, score: { home: 1, away: 0 } },
    isDartsCouponScoreboardEnabled: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    formatCouponScoreBoardData.mockImplementation((data) => data);
  });

  it("should render without crashing", () => {
    render(<DartsFixture {...mockProps} />);
    expect(AvBFixture).toHaveBeenCalled();
    expect(AvBScoreboard).toHaveBeenCalled();
  });

  describe("When Throttle is Enabled", () => {
    it("should call formatCouponScoreBoardData logic", () => {
      render(<DartsFixture {...mockProps} isDartsCouponScoreboardEnabled={true} />);

      expect(formatCouponScoreBoardData).toHaveBeenCalledWith(
        mockProps.scoreData,
        mockProps.viewMode,
        mockProps.currentSet,
        mockProps.matchStatus,
      );
    });
  });

  describe("When Throttle is Disabled", () => {
    it("should NOT call formatCouponScoreBoardData and pass undefined scoreData (hiding scoreboard)", () => {
      render(<DartsFixture {...mockProps} isDartsCouponScoreboardEnabled={false} />);

      expect(formatCouponScoreBoardData).not.toHaveBeenCalled();

      expect(AvBScoreboard).toHaveBeenCalledWith(
        expect.objectContaining({
          scoreData: undefined,
        }),
        undefined,
      );
    });
  });

  describe("View Mode: DEFAULT", () => {
    it("should pass competition info to AvBFixture", () => {
      render(<DartsFixture {...mockProps} viewMode={ScoreboardViewMode.DEFAULT} />);

      expect(AvBFixture).toHaveBeenCalledWith(
        expect.objectContaining({
          competitionLabel: mockProps.competition,
          icon: expect.any(String),
        }),
        undefined,
      );
    });
  });

  describe("View Mode: COUPON", () => {
    it("should NOT pass competition info to AvBFixture", () => {
      render(<DartsFixture {...mockProps} viewMode={ScoreboardViewMode.COUPON} />);

      expect(AvBFixture).toHaveBeenCalledWith(
        expect.objectContaining({
          competitionLabel: undefined,
          icon: undefined,
        }),
        undefined,
      );
    });

    it("should pass the formatted score data from the helper to AvBScoreboard (if throttle enabled)", () => {
      const formattedData = [{ home: 5, away: 5 }];
      formatCouponScoreBoardData.mockReturnValue(formattedData);

      render(<DartsFixture {...mockProps} viewMode={ScoreboardViewMode.COUPON} />);

      expect(AvBScoreboard).toHaveBeenCalledWith(
        expect.objectContaining({
          scoreData: formattedData,
        }),
        undefined,
      );
    });
  });
});
