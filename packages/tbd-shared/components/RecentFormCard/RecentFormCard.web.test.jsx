import "jest-dom/extend-expect";
import { render } from "@testing-library/react";

import { RecentFormDetailed } from "./snowflakes/RecentFormDetailed/RecentFormDetailed.web";
import { TEST_ID } from "./RecentFormCard.web.selectors";
import ConnectedRecentFormCard from "./RecentFormCard.web";

jest.mock("./snowflakes/RecentFormDetailed/RecentFormDetailed.web", () => ({
  RecentFormDetailed: jest.fn(() => <recent-form-detailed-mock />),
}));

const recentFormProps = {
  home: {
    preview: {
      name: "Liverpool",
    },
    detailed: "DETAILED_HOME",
  },
  away: {
    preview: {
      name: "Chelsea",
    },
    detailed: "DETAILED_AWAY",
  },
  translations: {
    recentFormDetailedTranslations: "DETAILED TRANSLATIONS",
    title: "TITLE",
    previewTitle: "PREVIEW_TITLE",
  },
};

function setup(props) {
  return render(<ConnectedRecentFormCard {...props} />);
}

describe("Recent Form Card", () => {
  afterEach(jest.clearAllMocks);

  describe("when there are no home or away recent form information", () => {
    it("should not render RecentFormDetailed", () => {
      const component = setup({});

      expect(component.container.querySelector(TEST_ID)).toBeNull();
      expect(RecentFormDetailed).not.toHaveBeenCalled();
    });

    describe("when there are home or away recent form information", () => {
      it("should render RecentFormDetailed", () => {
        setup(recentFormProps);

        expect(RecentFormDetailed).toHaveBeenCalledWith(
          {
            relativeFixtureResult: ["DETAILED_HOME", "DETAILED_AWAY"],
            i18n: recentFormProps.translations.recentFormDetailedTranslations,
          },
          undefined,
        );
      });
    });
  });
});
