import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { HeadToHeadResultViewMode, RecentFormCaptionContentType } from "@ppb/the-wall-common/types";
import { RecentFormCaption } from "@ppb/the-wall-web";

import { TEST_ID, CAPTION } from "./HeadToHeadDetailed.web.selectors";
import styles from "./HeadToHeadDetailed.web.css";
import { HeadToHeadDetailed } from "./HeadToHeadDetailed.web";

jest.mock("@ppb/the-wall-common/types", () => ({
  HeadToHeadResultViewMode: {
    EXTENDED: "EXTENDED",
    MIN: "MIN",
  },
  RecentFormCaptionContentType: {
    W: "W",
    D: "D",
    L: "L",
    A: "A",
    H: "H",
    AET: "AET",
    PEN: "PEN",
  },
}));

jest.mock("@ppb/the-wall-web", () => ({
  RecentFormCaption: jest.fn(() => <team-colors-mock />),
}));

const i18n = {
  [RecentFormCaptionContentType.W]: { leftLabel: "W", rightLabel: "Winner" },
  [RecentFormCaptionContentType.D]: { leftLabel: "D", rightLabel: "Draw" },
  [RecentFormCaptionContentType.L]: { leftLabel: "L", rightLabel: "Lose" },
  [RecentFormCaptionContentType.A]: { leftLabel: "A", rightLabel: "Away" },
  [RecentFormCaptionContentType.H]: { leftLabel: "H", rightLabel: "Home" },
  [RecentFormCaptionContentType.AET]: { leftLabel: "AET", rightLabel: "After Extra Time" },
  [RecentFormCaptionContentType.PEN]: { leftLabel: "PEN", rightLabel: "Penalties" },
};

function renderHead2HeadDetailed(head2headDetailed) {
  const { container } = render(<HeadToHeadDetailed headToHeadDetailedProps={head2headDetailed} captionI18n={i18n} />);
  return container.querySelector(TEST_ID);
}

describe("HeadToHead Detailed view", () => {
  describe("Simple Result", () => {
    it("response has the main score only", () => {
      const head2headResults = [
        {
          key: "0",
          homeTeamName: "Team name 1",
          awayTeamName: "Team name 2",
          homeTeamCrest: "https://www.flashscore.com/res/image/data/W4N0OQZA-jPU1meWN.png",
          awayTeamCrest: "https://www.flashscore.com/res/image/data/zDuImRwS-hUScfdXD.png",
          score: "2 - 1",
          competition: "Competition",
          date: "12 Jul 2019",
          i18n: { penalties: "P", aet: "AET" },
          viewMode: HeadToHeadResultViewMode.EXTENDED,
        },
        {
          key: "1",
          homeTeamName: "Team name 2",
          awayTeamName: "Team name 1",
          homeTeamCrest: "https://www.flashscore.com/res/image/data/zDuImRwS-hUScfdXD.png",
          awayTeamCrest: "https://www.flashscore.com/res/image/data/W4N0OQZA-jPU1meWN.png",
          score: "3 - 5",
          competition: "Competition2",
          date: "12 Jul 2019",
          i18n: { penalties: "P", aet: "AET" },
          viewMode: HeadToHeadResultViewMode.EXTENDED,
        },
      ];

      const head2headResult = renderHead2HeadDetailed(head2headResults);
      expect(head2headResult).toHaveClass(styles.container);
    });
  });
  describe("Render Caption", () => {
    it("Render caption", () => {
      const head2headResultsWithCaption = [
        {
          key: "0",
          homeTeamName: "Team name 1",
          awayTeamName: "Team name 2",
          homeTeamCrest: "https://www.flashscore.com/res/image/data/W4N0OQZA-jPU1meWN.png",
          awayTeamCrest: "https://www.flashscore.com/res/image/data/zDuImRwS-hUScfdXD.png",
          score: "2 - 1",
          competition: "Competition",
          date: "12 Jul 2019",
          i18n: { penalties: "P", aet: "AET" },
          viewMode: HeadToHeadResultViewMode.EXTENDED,
        },
        {
          key: "1",
          homeTeamName: "Team name 2",
          awayTeamName: "Team name 1",
          homeTeamCrest: "https://www.flashscore.com/res/image/data/zDuImRwS-hUScfdXD.png",
          awayTeamCrest: "https://www.flashscore.com/res/image/data/W4N0OQZA-jPU1meWN.png",
          score: "3 - 5",
          competition: "Competition2",
          afterExtraTime: true,
          date: "12 Jul 2019",
          i18n: { penalties: "P", aet: "AET" },
          viewMode: HeadToHeadResultViewMode.EXTENDED,
        },
      ];

      const head2headResultContainer = renderHead2HeadDetailed(head2headResultsWithCaption);
      const captionResult = head2headResultContainer.querySelector(CAPTION);
      expect(captionResult).toBeDefined();
    });
  });

  describe("Render Caption with Content", () => {
    it("Caption with AET", () => {
      const head2headResultsWithCaption = [
        {
          key: "0",
          homeTeamName: "Team name 1",
          awayTeamName: "Team name 2",
          homeTeamCrest: "https://www.flashscore.com/res/image/data/W4N0OQZA-jPU1meWN.png",
          awayTeamCrest: "https://www.flashscore.com/res/image/data/zDuImRwS-hUScfdXD.png",
          score: "2 - 1",
          competition: "Competition",
          date: "12 Jul 2019",
          i18n: { penalties: "P", aet: "AET" },
          viewMode: HeadToHeadResultViewMode.EXTENDED,
        },
        {
          key: "1",
          homeTeamName: "Team name 2",
          awayTeamName: "Team name 1",
          homeTeamCrest: "https://www.flashscore.com/res/image/data/zDuImRwS-hUScfdXD.png",
          awayTeamCrest: "https://www.flashscore.com/res/image/data/W4N0OQZA-jPU1meWN.png",
          score: "3 - 5",
          competition: "Competition2",
          afterExtraTime: true,
          date: "12 Jul 2019",
          i18n: { penalties: "P", aet: "AET" },
          viewMode: HeadToHeadResultViewMode.EXTENDED,
        },
      ];

      renderHead2HeadDetailed(head2headResultsWithCaption);
      expect(RecentFormCaption.mock.calls[1][0]).toEqual({
        content: ["AET"],
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
