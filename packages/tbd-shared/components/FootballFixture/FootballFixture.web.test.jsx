import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { AvBFixture as FootballFixtureComponent, FootballScoreboard } from "@ppb/the-wall-web";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { TEST_ID as FOOTBALL_FIXTURE } from "./FootballFixture.web.selectors";

import FootballFixture from "./FootballFixture.web";

jest.mock("@ppb/the-wall-web", () => ({
  FootballScoreboard: jest.fn(() => <scoreboard-mock id="scoreboard" />),
  AvBFixture: jest.fn(({ children }) => <fixture-component-mock>{children}</fixture-component-mock>),
}));

function renderFootballFixture(footballFixtureProps) {
  const { container } = render(<FootballFixture {...footballFixtureProps} />);
  return container.querySelector(FOOTBALL_FIXTURE);
}

describe("FootballFixture", () => {
  beforeEach(jest.clearAllMocks);

  const footballFixtureProps = {
    competition: "testCompetition",
    scoreboardProps: {
      fakeProp: "fakeProp",
    },
    viewMode: ScoreboardViewMode.DEFAULT,
    iconsList: [IconsList.NINETY_MINUTE_PAYOUT, IconsList.LIVE_VIDEO],
    showEventDateBelow: true,
    showHorizontalDuration: false,
  };

  let component;

  describe("when view mode is DEFAULT", () => {
    beforeEach(() => {
      component = renderFootballFixture({ ...footballFixtureProps, viewMode: ScoreboardViewMode.DEFAULT });
    });

    it("must render with a football fixture component and scoreboard", () => {
      expect(component).toBeVisible();
      expect(component.querySelector("#scoreboard")).toBeVisible();
    });

    it("must call the football fixture component with correct props", () => {
      expect(FootballFixtureComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          competitionLabel: "testCompetition",
          viewMode: "DEFAULT",
        }),
        undefined,
      );
    });

    it("must call the football scoreboard component with correct props", () => {
      expect(FootballScoreboard).toHaveBeenCalledWith(
        {
          fakeProp: "fakeProp",
          isHighlighted: true,
          iconsList: [IconsList.NINETY_MINUTE_PAYOUT, IconsList.LIVE_VIDEO],
          viewMode: "DEFAULT",
          showEventDateBelow: true,
          showHorizontalDuration: false,
        },
        undefined,
      );
    });
  });

  describe("when view mode is SMALL", () => {
    beforeEach(() => {
      component = renderFootballFixture({ ...footballFixtureProps, viewMode: ScoreboardViewMode.SMALL });
    });

    it("must render with a football fixture component and scoreboard", () => {
      expect(component).toBeVisible();
      expect(component.querySelector("#scoreboard")).toBeVisible();
    });

    it("must call the football fixture component with correct props", () => {
      expect(FootballFixtureComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          competitionLabel: undefined,
          viewMode: "SMALL",
        }),
        undefined,
      );
    });

    it("must call the football scoreboard component with correct props", () => {
      expect(FootballScoreboard).toHaveBeenCalledWith(
        {
          fakeProp: "fakeProp",
          isHighlighted: true,
          iconsList: [IconsList.NINETY_MINUTE_PAYOUT, IconsList.LIVE_VIDEO],
          viewMode: "SMALL",
          showEventDateBelow: true,
          showHorizontalDuration: false,
        },
        undefined,
      );
    });
  });

  describe("when view mode is COUPON", () => {
    beforeEach(() => {
      component = renderFootballFixture({ ...footballFixtureProps, viewMode: ScoreboardViewMode.COUPON });
    });

    it("must render with a football fixture component and scoreboard", () => {
      expect(component).toBeVisible();
      expect(component.querySelector("#scoreboard")).toBeVisible();
    });

    it("must call the football fixture component with correct props", () => {
      expect(FootballFixtureComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          competitionLabel: undefined,
          viewMode: "COUPON",
        }),
        undefined,
      );
    });

    it("must call the football scoreboard component with correct props", () => {
      expect(FootballScoreboard).toHaveBeenCalledWith(
        {
          fakeProp: "fakeProp",
          isHighlighted: false,
          iconsList: [IconsList.NINETY_MINUTE_PAYOUT, IconsList.LIVE_VIDEO],
          viewMode: "COUPON",
          showEventDateBelow: true,
          showHorizontalDuration: false,
        },
        undefined,
      );
    });
  });
});
