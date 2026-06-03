import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { FixtureTeamSide, FixtureOutcome, RecentFormCaptionContentType } from "@ppb/the-wall-common/types";
import { RecentFormResult } from "./RecentFormResult.web";
import {
  TEST_ID,
  FORM_PENALTIES_SCORE,
  FORM_SCORE,
  FORM_OPPONENT_NAME,
  FORM_DATE,
  FORM_COMPETITION,
} from "./RecentFormResult.web.selectors";
import styles from "./RecentFormResult.web.module.css";

import { RecentFormResultAlignment } from "./RecentFormResult.types";

const TEAM_NAME = "Liverpool";
const COMPETITION_NAME = "Competition";
const score = {
  home: 4,
  away: 0,
};
const penaltyScore = {
  home: 5,
  away: 4,
};
const translations = {
  [FixtureOutcome.WIN]: "W",
  [FixtureOutcome.DRAW]: "D",
  [FixtureOutcome.LOSE]: "L",
  [RecentFormCaptionContentType.PEN]: "PEN",
  [RecentFormCaptionContentType.AET]: "AET",
  [FixtureTeamSide.HOME]: "H",
  [FixtureTeamSide.AWAY]: "A",
};
function renderRecentFormResult(
  footballScore,
  opponent,
  date,
  side,
  outcome,
  alignment,
  i18n,
  isExtraTimeScore,
  footballPenaltyScore,
  competitionName,
) {
  const { container } = render(
    <RecentFormResult
      score={footballScore}
      isExtraTimeScore={isExtraTimeScore}
      penaltyScore={footballPenaltyScore}
      opponent={opponent}
      competition={competitionName}
      date={date}
      side={side}
      outcome={outcome}
      alignment={alignment}
      translations={i18n}
    />,
  );
  return container.querySelector(TEST_ID);
}
const relativeFixtureResultLeft = [
  score,
  TEAM_NAME,
  "29 Oct 2019",
  FixtureTeamSide.HOME,
  FixtureOutcome.WIN,
  RecentFormResultAlignment.LEFT,
  translations,
];
const relativeFixtureResultRight = [
  score,
  TEAM_NAME,
  "29 Oct 2019",
  FixtureTeamSide.HOME,
  FixtureOutcome.WIN,
  RecentFormResultAlignment.RIGHT,
  translations,
];

describe("RecentFormResult", () => {
  describe("score, penaltyScore, opponent, date, side, outcome", () => {
    it("should render the score correctly as home against away teams", () => {
      const recentFormResultComponent = renderRecentFormResult(...relativeFixtureResultLeft, true, penaltyScore);
      const recentFormResultScore = recentFormResultComponent.querySelector(FORM_SCORE);
      expect(recentFormResultScore).toHaveTextContent("4 - 0");
    });
    it("should render the penalty score correctly as home against away teams", () => {
      const recentFormResultComponent = renderRecentFormResult(...relativeFixtureResultLeft, true, penaltyScore);
      const recentFormPenaltiesResultScore = recentFormResultComponent.querySelector(FORM_PENALTIES_SCORE);
      expect(recentFormPenaltiesResultScore).toHaveTextContent("5 - 4");
    });
    it("should render the opponent name correctly", () => {
      const recentFormResultComponent = renderRecentFormResult(...relativeFixtureResultLeft, true, penaltyScore);
      const recentFormOpponentName = recentFormResultComponent.querySelector(FORM_OPPONENT_NAME);
      expect(recentFormOpponentName).toHaveTextContent("Liverpool");
    });
    it("should render the side correctly", () => {
      const recentFormResultComponent = renderRecentFormResult(...relativeFixtureResultLeft, true, penaltyScore);
      const recentFormOpponentName = recentFormResultComponent.querySelector(FORM_OPPONENT_NAME);
      expect(recentFormOpponentName).toHaveTextContent("(H)");
    });
    it("should render the date correctly", () => {
      const recentFormResultComponent = renderRecentFormResult(...relativeFixtureResultLeft, true, penaltyScore);
      const recentFormDate = recentFormResultComponent.querySelector(FORM_DATE);
      expect(recentFormDate).toHaveTextContent("29 Oct 2019");
    });
  });
  describe("AET and penalties", () => {
    it("should render component with left alignment and have container class", () => {
      const recentFormResultComponent = renderRecentFormResult(...relativeFixtureResultLeft, true, penaltyScore);
      expect(recentFormResultComponent).toHaveClass(styles.container);
      expect(recentFormResultComponent).not.toHaveClass(styles.right);
    });
    it("should render component with left alignment and have AET and P text", () => {
      const recentFormResultComponent = renderRecentFormResult(...relativeFixtureResultLeft, true, penaltyScore);
      expect(recentFormResultComponent).toHaveTextContent("AET");
      expect(recentFormResultComponent).toHaveTextContent("P");
    });
    it("should render component with right alignment and right class", () => {
      const recentFormResultComponent = renderRecentFormResult(...relativeFixtureResultRight, true, penaltyScore);
      expect(recentFormResultComponent).toHaveClass(styles.right);
    });
    it("should render component with right alignment and AET and P text", () => {
      const recentFormResultComponent = renderRecentFormResult(...relativeFixtureResultRight, true, penaltyScore);
      expect(recentFormResultComponent).toHaveTextContent("AET");
      expect(recentFormResultComponent).toHaveTextContent("P");
    });
  });
  describe("AET and no penalties", () => {
    it("should render component with left alignment and container without right class", () => {
      const recentFormResultComponent = renderRecentFormResult(...relativeFixtureResultLeft, true, null);
      expect(recentFormResultComponent).toHaveClass(styles.container);
      expect(recentFormResultComponent).not.toHaveClass(styles.right);
    });
    it("should render component with left alignment and AET without penalties", () => {
      const recentFormResultComponent = renderRecentFormResult(...relativeFixtureResultLeft, true, null);
      expect(recentFormResultComponent).toHaveTextContent("AET");
      expect(recentFormResultComponent).not.toHaveTextContent("P");
    });
    it("should render component with right alignment and right class", () => {
      const recentFormResultComponent = renderRecentFormResult(...relativeFixtureResultRight, true, null);
      expect(recentFormResultComponent).toHaveClass(styles.right);
    });
    it("should render component with right alignment and AET without penalties", () => {
      const recentFormResultComponent = renderRecentFormResult(...relativeFixtureResultRight, true, null);
      expect(recentFormResultComponent).toHaveTextContent("AET");
      expect(recentFormResultComponent).not.toHaveTextContent("P");
    });
  });
  describe("no AET but with penalties", () => {
    it("should render component with left alignment without right class", () => {
      const recentFormResultComponent = renderRecentFormResult(...relativeFixtureResultLeft, false, penaltyScore);
      expect(recentFormResultComponent).toHaveClass(styles.container);
      expect(recentFormResultComponent).not.toHaveClass(styles.right);
    });
    it("should render component with left alignment and no AET but with penalties", () => {
      const recentFormResultComponent = renderRecentFormResult(...relativeFixtureResultLeft, false, penaltyScore);
      expect(recentFormResultComponent).not.toHaveTextContent("AET");
      expect(recentFormResultComponent).toHaveTextContent("P");
    });
    it("should render component with right alignment and right class", () => {
      const recentFormResultComponent = renderRecentFormResult(...relativeFixtureResultRight, false, penaltyScore);
      expect(recentFormResultComponent).toHaveClass(styles.right);
    });
    it("should render component with right alignment and no AET but with penalties", () => {
      const recentFormResultComponent = renderRecentFormResult(...relativeFixtureResultRight, false, penaltyScore);
      expect(recentFormResultComponent).not.toHaveTextContent("AET");
      expect(recentFormResultComponent).toHaveTextContent("P");
    });
  });
  describe("no AET and no penalties", () => {
    it("should render component with left alignment and no right class", () => {
      const recentFormResultComponent = renderRecentFormResult(...relativeFixtureResultLeft, false, null);
      expect(recentFormResultComponent).toHaveClass(styles.container);
      expect(recentFormResultComponent).not.toHaveClass(styles.right);
    });
    it("should render component with left alignment and no penalties or AET", () => {
      const recentFormResultComponent = renderRecentFormResult(...relativeFixtureResultLeft, false, null);
      expect(recentFormResultComponent).not.toHaveTextContent("AET");
      expect(recentFormResultComponent).not.toHaveTextContent("P");
    });
    it("should render component with right alignment and right class", () => {
      const recentFormResultComponent = renderRecentFormResult(...relativeFixtureResultRight, false, null);
      expect(recentFormResultComponent).toHaveClass(styles.right);
    });
    it("should render component with right alignment and no penalties or AET", () => {
      const recentFormResultComponent = renderRecentFormResult(...relativeFixtureResultRight, false, null);
      expect(recentFormResultComponent).not.toHaveTextContent("AET");
      expect(recentFormResultComponent).not.toHaveTextContent("P");
    });
  });
  describe("competition", () => {
    it("should render the correct competition name", () => {
      const recentFormResultComponent = renderRecentFormResult(
        ...relativeFixtureResultLeft,
        true,
        penaltyScore,
        COMPETITION_NAME,
      );
      const recentFormCompetition = recentFormResultComponent.querySelector(FORM_COMPETITION);
      expect(recentFormCompetition).toHaveTextContent(COMPETITION_NAME);
    });
  });
});
