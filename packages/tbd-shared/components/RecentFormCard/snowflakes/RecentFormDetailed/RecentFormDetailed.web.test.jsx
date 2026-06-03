import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { FixtureTeamSide, FixtureOutcome, RecentFormCaptionContentType } from "@ppb/the-wall-common/types";
import { RecentFormCaption } from "@ppb/the-wall-web";
import { RecentFormDetailed } from "./RecentFormDetailed.web";
import { TEST_ID } from "./RecentFormDetailed.web.selectors";
import styles from "./RecentFormDetailed.web.css";
import { RecentFormResultAlignment } from "../RecentFormResult/RecentFormResult.types";

const i18n = {
  recentFormResultI18n: {
    [FixtureOutcome.WIN]: "W",
    [FixtureOutcome.DRAW]: "D",
    [FixtureOutcome.LOSE]: "L",
    [RecentFormCaptionContentType.PEN]: "PEN",
    [RecentFormCaptionContentType.AET]: "AET",
    [FixtureTeamSide.HOME]: "H",
    [FixtureTeamSide.AWAY]: "A",
  },
  captionI18n: {
    [RecentFormCaptionContentType.W]: { leftLabel: "W", rightLabel: "Winner" },
    [RecentFormCaptionContentType.D]: { leftLabel: "D", rightLabel: "Draw" },
    [RecentFormCaptionContentType.L]: { leftLabel: "L", rightLabel: "Lose" },
    [RecentFormCaptionContentType.A]: { leftLabel: "A", rightLabel: "Away" },
    [RecentFormCaptionContentType.H]: { leftLabel: "H", rightLabel: "Home" },
    [RecentFormCaptionContentType.AET]: { leftLabel: "AET", rightLabel: "After Extra Time" },
    [RecentFormCaptionContentType.PEN]: { leftLabel: "PEN", rightLabel: "Penalties" },
  },
};

function renderRecentFormDetailed(relativeFixtureResult) {
  const { container } = render(<RecentFormDetailed relativeFixtureResult={relativeFixtureResult} i18n={i18n} />);
  return container.querySelector(TEST_ID);
}

jest.mock("@ppb/the-wall-web", () => ({
  RecentFormCaption: jest.fn(() => <recent-form-caption-mock />),
}));

jest.mock("../RecentFormResult/RecentFormResult.web", () => ({
  RecentFormResult: jest.fn(() => <recent-form-result-mock />),
}));

describe("RecentFormDetailed", () => {
  describe("results", () => {
    it("should display all results", () => {
      const homeTeamRecentResults = [
        {
          score: {
            home: 2,
            away: 1,
          },
          isExtraTimeScore: true,
          penaltyScore: {
            home: 5,
            away: 4,
          },
          opponent: "Liverpool",
          date: "29 Oct 2019",
          side: FixtureTeamSide.HOME,
          outcome: FixtureOutcome.WIN,
          alignment: RecentFormResultAlignment.LEFT,
          translations: i18n.recentFormResultI18n,
        },
        {
          score: {
            home: 2,
            away: 1,
          },
          isExtraTimeScore: true,
          penaltyScore: {
            home: 5,
            away: 4,
          },
          opponent: "Liverpool",
          date: "29 Oct 2019",
          side: FixtureTeamSide.HOME,
          outcome: FixtureOutcome.WIN,
          alignment: RecentFormResultAlignment.LEFT,
          translations: i18n.recentFormResultI18n,
        },
        {
          score: {
            home: 2,
            away: 1,
          },
          isExtraTimeScore: true,
          penaltyScore: {
            home: 5,
            away: 4,
          },
          opponent: "Liverpool",
          date: "29 Oct 2019",
          side: FixtureTeamSide.HOME,
          outcome: FixtureOutcome.WIN,
          alignment: RecentFormResultAlignment.LEFT,
          translations: i18n.recentFormResultI18n,
        },
        {
          score: {
            home: 2,
            away: 1,
          },
          isExtraTimeScore: true,
          penaltyScore: {
            home: 5,
            away: 4,
          },
          opponent: "Liverpool",
          date: "29 Oct 2019",
          side: FixtureTeamSide.HOME,
          outcome: FixtureOutcome.WIN,
          alignment: RecentFormResultAlignment.LEFT,
          translations: i18n.recentFormResultI18n,
        },
        {
          score: {
            home: 2,
            away: 1,
          },
          isExtraTimeScore: true,
          penaltyScore: {
            home: 5,
            away: 4,
          },
          opponent: "Liverpool",
          date: "29 Oct 2019",
          side: FixtureTeamSide.HOME,
          outcome: FixtureOutcome.WIN,
          alignment: RecentFormResultAlignment.LEFT,
          translations: i18n.recentFormResultI18n,
        },
      ];
      const awayTeamRecentResults = [
        {
          score: {
            home: 2,
            away: 1,
          },
          isExtraTimeScore: true,
          penaltyScore: {
            home: 5,
            away: 4,
          },
          opponent: "Liverpool",
          date: "29 Oct 2019",
          side: FixtureTeamSide.HOME,
          outcome: FixtureOutcome.WIN,
          alignment: RecentFormResultAlignment.RIGHT,
          translations: i18n.recentFormResultI18n,
        },
        {
          score: {
            home: 2,
            away: 1,
          },
          isExtraTimeScore: true,
          penaltyScore: {
            home: 5,
            away: 4,
          },
          opponent: "Liverpool",
          date: "29 Oct 2019",
          side: FixtureTeamSide.HOME,
          outcome: FixtureOutcome.WIN,
          alignment: RecentFormResultAlignment.RIGHT,
          translations: i18n.recentFormResultI18n,
        },
        {
          score: {
            home: 2,
            away: 1,
          },
          isExtraTimeScore: true,
          penaltyScore: {
            home: 5,
            away: 4,
          },
          opponent: "Liverpool",
          date: "29 Oct 2019",
          side: FixtureTeamSide.HOME,
          outcome: FixtureOutcome.WIN,
          alignment: RecentFormResultAlignment.RIGHT,
          translations: i18n.recentFormResultI18n,
        },
        {
          score: {
            home: 2,
            away: 1,
          },
          isExtraTimeScore: true,
          penaltyScore: {
            home: 5,
            away: 4,
          },
          opponent: "Liverpool",
          date: "29 Oct 2019",
          side: FixtureTeamSide.HOME,
          outcome: FixtureOutcome.WIN,
          alignment: RecentFormResultAlignment.RIGHT,
          translations: i18n.recentFormResultI18n,
        },
        {
          score: {
            home: 2,
            away: 1,
          },
          isExtraTimeScore: true,
          penaltyScore: {
            home: 5,
            away: 4,
          },
          opponent: "Liverpool",
          date: "29 Oct 2019",
          side: FixtureTeamSide.HOME,
          outcome: FixtureOutcome.WIN,
          alignment: RecentFormResultAlignment.RIGHT,
          translations: i18n.recentFormResultI18n,
        },
      ];
      const recentFormDetailedComponent = renderRecentFormDetailed([homeTeamRecentResults, awayTeamRecentResults]);
      expect(recentFormDetailedComponent).toHaveClass(styles.container);
    });
  });
  describe("when teams have less than 5 results", () => {
    it("should display AET on caption", () => {
      const homeTeamRecentResults = [
        {
          score: {
            home: 2,
            away: 1,
          },
          isExtraTimeScore: false,
          penaltyScore: null,
          opponent: "Liverpool",
          date: "29 Oct 2019",
          side: FixtureTeamSide.HOME,
          outcome: FixtureOutcome.WIN,
          alignment: RecentFormResultAlignment.LEFT,
        },
        {
          score: {
            home: 2,
            away: 1,
          },
          isExtraTimeScore: true,
          penaltyScore: null,
          opponent: "Liverpool",
          date: "29 Oct 2019",
          side: FixtureTeamSide.HOME,
          outcome: FixtureOutcome.WIN,
          alignment: RecentFormResultAlignment.LEFT,
        },
      ];
      const awayTeamRecentResults = [
        {
          score: {
            home: 2,
            away: 1,
          },
          isExtraTimeScore: true,
          penaltyScore: null,
          opponent: "Liverpool",
          date: "29 Oct 2019",
          side: FixtureTeamSide.HOME,
          outcome: FixtureOutcome.WIN,
          alignment: RecentFormResultAlignment.RIGHT,
        },
      ];
      renderRecentFormDetailed([homeTeamRecentResults, awayTeamRecentResults]);
      expect(RecentFormCaption.mock.calls[1][0]).toEqual({
        content: ["W", "D", "L", "A", "H", "AET"],
        i18n: {
          A: {
            leftLabel: "A",
            rightLabel: "Away",
          },
          AET: {
            leftLabel: "AET",
            rightLabel: "After Extra Time",
          },

          D: {
            leftLabel: "D",
            rightLabel: "Draw",
          },
          H: {
            leftLabel: "H",
            rightLabel: "Home",
          },
          L: {
            leftLabel: "L",
            rightLabel: "Lose",
          },
          PEN: {
            leftLabel: "PEN",
            rightLabel: "Penalties",
          },
          W: {
            leftLabel: "W",
            rightLabel: "Winner",
          },
        },
      });
    });
    it("should display PEN on caption", () => {
      const homeTeamRecentResults = [
        {
          score: {
            home: 2,
            away: 1,
          },
          isExtraTimeScore: true,
          penaltyScore: {
            home: 5,
            away: 4,
          },
          opponent: "Liverpool",
          date: "29 Oct 2019",
          side: FixtureTeamSide.HOME,
          outcome: FixtureOutcome.WIN,
          alignment: RecentFormResultAlignment.LEFT,
        },
        {
          score: {
            home: 2,
            away: 1,
          },
          isExtraTimeScore: true,
          penaltyScore: {
            home: 5,
            away: 4,
          },
          opponent: "Liverpool",
          date: "29 Oct 2019",
          side: FixtureTeamSide.HOME,
          outcome: FixtureOutcome.WIN,
          alignment: RecentFormResultAlignment.LEFT,
        },
      ];
      const awayTeamRecentResults = [
        {
          score: {
            home: 2,
            away: 1,
          },
          isExtraTimeScore: true,
          penaltyScore: {
            home: 5,
            away: 4,
          },
          opponent: "Liverpool",
          date: "29 Oct 2019",
          side: FixtureTeamSide.HOME,
          outcome: FixtureOutcome.WIN,
          alignment: RecentFormResultAlignment.RIGHT,
        },
      ];
      RecentFormCaption.mockClear();
      renderRecentFormDetailed([homeTeamRecentResults, awayTeamRecentResults]);
      expect(RecentFormCaption.mock.calls[0][0]).toEqual({
        content: ["W", "D", "L", "A", "H", "AET", "PEN"],
        i18n: {
          A: {
            leftLabel: "A",
            rightLabel: "Away",
          },
          AET: {
            leftLabel: "AET",
            rightLabel: "After Extra Time",
          },

          D: {
            leftLabel: "D",
            rightLabel: "Draw",
          },
          H: {
            leftLabel: "H",
            rightLabel: "Home",
          },
          L: {
            leftLabel: "L",
            rightLabel: "Lose",
          },
          PEN: {
            leftLabel: "PEN",
            rightLabel: "Penalties",
          },
          W: {
            leftLabel: "W",
            rightLabel: "Winner",
          },
        },
      });
    });
  });
});
