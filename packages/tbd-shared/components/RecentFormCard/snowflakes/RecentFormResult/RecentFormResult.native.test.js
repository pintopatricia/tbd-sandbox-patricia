import { render } from "@testing-library/react-native";

import { FixtureTeamSide, FixtureOutcome, RecentFormCaptionContentType } from "@ppb/the-wall-common/types";
import { RecentFormResult } from "./RecentFormResult.native";
import {
  RECENT_FORM_SCORE,
  RECENT_FORM_EXTRA_TIME,
  RECENT_FORM_OPPONENT,
  RECENT_FORM_DATE,
  RECENT_FORM_SCORE_PENALTIES,
  RECENT_FORM_COMPETITION,
  RECENT_FORM_PENALTIES,
} from "./RecentFormResult.native.selectors";
import { RecentFormResultAlignment } from "./RecentFormResult.types";

jest.mock("@ppb/the-wall-native/components/RecentForm/RecentFormIcon/RecentFormIcon", () => ({
  RecentFormIcon: jest.fn(() => <icon-mock testID="recent-form-icon" />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  spacings: {},
  typography: {},
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

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
  opponent,
  date,
  side,
  outcome,
  alignment,
  i18n,
  footballScore,
  isExtraTimeScore,
  footballPenaltyScore,
  competition,
) {
  return render(
    <RecentFormResult
      score={footballScore}
      isExtraTimeScore={isExtraTimeScore}
      penaltyScore={footballPenaltyScore}
      opponent={opponent}
      competition={competition}
      date={date}
      side={side}
      outcome={outcome}
      alignment={alignment}
      translations={i18n}
    />,
  );
}
const relativeFixtureResult = [
  TEAM_NAME,
  "29 Oct 2019",
  FixtureTeamSide.HOME,
  FixtureOutcome.WIN,
  RecentFormResultAlignment.LEFT,
  translations,
];

describe("RecentFormResult", () => {
  describe("When only Opponent and Date are provided", () => {
    let dateComponent;
    let opponentComponent;
    let scoreComponent;
    let extraTimeComponent;
    let competitionNameComponent;
    let iconComponent;
    let penaltyScoreComponent;
    let penaltiesComponent;
    beforeEach(() => {
      const { queryByTestId } = renderRecentFormResult(...relativeFixtureResult);

      dateComponent = queryByTestId(RECENT_FORM_DATE);
      opponentComponent = queryByTestId(RECENT_FORM_OPPONENT);
      scoreComponent = queryByTestId(RECENT_FORM_SCORE);
      competitionNameComponent = queryByTestId(RECENT_FORM_COMPETITION);
      extraTimeComponent = queryByTestId(RECENT_FORM_EXTRA_TIME);
      penaltyScoreComponent = queryByTestId(RECENT_FORM_SCORE_PENALTIES);
      penaltiesComponent = queryByTestId(RECENT_FORM_PENALTIES);
      iconComponent = queryByTestId("recent-form-icon");
    });

    it("should render the correct date", () => {
      expect(dateComponent).toHaveTextContent("29 Oct 2019");
    });

    it("should render the correct oppponent name and side", () => {
      expect(opponentComponent).toHaveTextContent("Liverpool (H)");
    });

    it("should render the recent form icon", () => {
      expect(iconComponent).toBeDefined();
    });

    it("should not render score", () => {
      expect(scoreComponent).toBeNull();
    });

    it("should not render extraTime", () => {
      expect(extraTimeComponent).toBeNull();
    });

    it("should not render penalty score", () => {
      expect(penaltyScoreComponent).toBeNull();
    });

    it("should not render penalties", () => {
      expect(penaltiesComponent).toBeNull();
    });

    it("should not render competition", () => {
      expect(competitionNameComponent).toBeNull();
    });
  });

  describe("When score is provided", () => {
    let scoreComponent;
    let extraTimeComponent;
    beforeEach(() => {
      const { queryByTestId } = renderRecentFormResult(...relativeFixtureResult, score);

      scoreComponent = queryByTestId(RECENT_FORM_SCORE);
      extraTimeComponent = queryByTestId(RECENT_FORM_EXTRA_TIME);
    });

    it("should render the correct score", () => {
      expect(scoreComponent).toHaveTextContent("4 - 0");
    });

    it("should not render extraTime", () => {
      expect(extraTimeComponent).toBeNull();
    });
  });

  describe("When score and extraTime is provided", () => {
    let extraTimeComponent;
    beforeEach(() => {
      const { queryByTestId } = renderRecentFormResult(...relativeFixtureResult, score, true);

      extraTimeComponent = queryByTestId(RECENT_FORM_EXTRA_TIME);
    });

    it("should render extraTime", () => {
      expect(extraTimeComponent).toHaveTextContent("AET");
    });
  });

  describe("When PenaltyScore is provided", () => {
    let penaltyScoreComponent;
    let penaltiesComponent;
    beforeEach(() => {
      const { queryByTestId } = renderRecentFormResult(...relativeFixtureResult, null, null, penaltyScore);

      penaltyScoreComponent = queryByTestId(RECENT_FORM_SCORE_PENALTIES);
      penaltiesComponent = queryByTestId(RECENT_FORM_PENALTIES);
    });

    it("should render penaltyScore", () => {
      expect(penaltyScoreComponent).toHaveTextContent("5 - 4");
    });

    it("should render penaltiesComponent", () => {
      expect(penaltiesComponent).toHaveTextContent("PEN");
    });
  });

  describe("When competition is provided", () => {
    let competitionNameComponent;
    beforeEach(() => {
      const { queryByTestId } = renderRecentFormResult(...relativeFixtureResult, null, null, null, COMPETITION_NAME);

      competitionNameComponent = queryByTestId(RECENT_FORM_COMPETITION);
    });

    it("should render the correct competition name", () => {
      expect(competitionNameComponent).toHaveTextContent(COMPETITION_NAME);
    });
  });
});
