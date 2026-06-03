import { render } from "@testing-library/react-native";
import { HeadToHeadResultViewMode, RecentFormCaptionContentType } from "@ppb/the-wall-common/types";
import { HeadToHeadResult } from "@ppb/the-wall-native/components/HeadToHead/HeadToHeadResult/HeadToHeadResult";
import { RecentFormCaption } from "@ppb/the-wall-native/components/RecentForm/RecentFormCaption/RecentFormCaption";
import {
  HEAD_TO_HEAD_DETAILED,
  HEAD_TO_HEAD_DETAILED_CAPTION,
  HEAD_TO_HEAD_DETAILED_RESULTS,
} from "./HeadToHeadDetailed.native.selectors";
import styles from "./HeadToHeadDetailed.native.styles";
import { HeadToHeadDetailed } from "./HeadToHeadDetailed.native";

jest.mock("@ppb/the-wall-native/components/HeadToHead/HeadToHeadResult/HeadToHeadResult", () => ({
  HeadToHeadResult: jest.fn(() => <head-to-head-result-mock />),
}));

jest.mock("@ppb/the-wall-native/components/RecentForm/RecentFormCaption/RecentFormCaption", () => ({
  RecentFormCaption: jest.fn(() => <recent-form-caption-mock />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  spacings: {},
}));

const i18n = {
  [RecentFormCaptionContentType.AET]: { leftLabel: "AET", rightLabel: "After Extra Time" },
  [RecentFormCaptionContentType.PEN]: { leftLabel: "PEN", rightLabel: "Penalties" },
};

function renderHead2HeadDetailed(headToHeadDetailedProps) {
  const selectors = render(<HeadToHeadDetailed headToHeadDetailedProps={headToHeadDetailedProps} captionI18n={i18n} />);
  const { queryByTestId, queryAllByTestId } = selectors;

  return {
    headToHeadDetailed: queryByTestId(HEAD_TO_HEAD_DETAILED),
    results: queryAllByTestId(HEAD_TO_HEAD_DETAILED_RESULTS),
    caption: queryByTestId(HEAD_TO_HEAD_DETAILED_CAPTION),
  };
}

describe("HeadToHeadDetailed", () => {
  afterEach(jest.clearAllMocks);

  describe("when the component is called with no details", () => {
    const NO_DETAILS = [];

    it("should not render the component", () => {
      const { headToHeadDetailed } = renderHead2HeadDetailed(NO_DETAILS);
      expect(headToHeadDetailed).toBeNull();
    });
  });

  describe("Head to Head results with caption", () => {
    it("should render caption", () => {
      const headToHeadResultsWithCaption = [
        {
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
          homeTeamName: "Team name 2",
          awayTeamName: "Team name 1",
          homeTeamCrest: "https://www.flashscore.com/res/image/data/zDuImRwS-hUScfdXD.png",
          awayTeamCrest: "https://www.flashscore.com/res/image/data/W4N0OQZA-jPU1meWN.png",
          score: "3 - 5",
          competition: "Competition2",
          afterExtraTime: true,
          date: "12 Jul 2019",
          i18n: { penalties: "PEN", aet: "AET" },
          viewMode: HeadToHeadResultViewMode.EXTENDED,
        },
      ];

      const { headToHeadDetailed, results, caption } = renderHead2HeadDetailed(headToHeadResultsWithCaption);
      expect(headToHeadDetailed).toHaveStyle(styles.headToHeadDetailedContainer);

      expect(caption).toHaveStyle(styles.caption);
      expect(RecentFormCaption).toHaveBeenCalledWith(
        {
          i18n,
          content: [RecentFormCaptionContentType.AET],
        },
        undefined,
      );

      expect(results[0]).toHaveStyle(styles.headToHeadResultContainer);
      expect(HeadToHeadResult).toHaveBeenNthCalledWith(1, headToHeadResultsWithCaption[0], undefined);
      expect(HeadToHeadResult).toHaveBeenNthCalledWith(2, headToHeadResultsWithCaption[1], undefined);
    });
  });

  describe("Head to Head results without caption", () => {
    it("should not render caption", () => {
      const headToHeadResultsNoCaption = [
        {
          homeTeamName: "Team name 1",
          awayTeamName: "Team name 2",
          homeTeamCrest: "https://www.flashscore.com/res/image/data/W4N0OQZA-jPU1meWN.png",
          awayTeamCrest: "https://www.flashscore.com/res/image/data/zDuImRwS-hUScfdXD.png",
          score: "2 - 1",
          competition: "Competition",
          date: "12 Jul 2019",
          i18n: { penalties: "PEN", aet: "AET" },
          viewMode: HeadToHeadResultViewMode.EXTENDED,
        },
        {
          homeTeamName: "Team name 2",
          awayTeamName: "Team name 1",
          homeTeamCrest: "https://www.flashscore.com/res/image/data/zDuImRwS-hUScfdXD.png",
          awayTeamCrest: "https://www.flashscore.com/res/image/data/W4N0OQZA-jPU1meWN.png",
          score: "3 - 5",
          competition: "Competition2",
          date: "12 Jul 2019",
          i18n: { penalties: "PEN", aet: "AET" },
          viewMode: HeadToHeadResultViewMode.EXTENDED,
        },
      ];

      const { headToHeadDetailed, results, caption } = renderHead2HeadDetailed(headToHeadResultsNoCaption);
      expect(headToHeadDetailed).toHaveStyle(styles.headToHeadDetailedContainer);

      expect(caption).toBeNull();
      expect(RecentFormCaption).not.toHaveBeenCalled();

      expect(results[0]).toHaveStyle(styles.headToHeadResultContainer);
      expect(HeadToHeadResult).toHaveBeenNthCalledWith(1, headToHeadResultsNoCaption[0], undefined);
      expect(HeadToHeadResult).toHaveBeenNthCalledWith(2, headToHeadResultsNoCaption[1], undefined);
    });
  });
});
