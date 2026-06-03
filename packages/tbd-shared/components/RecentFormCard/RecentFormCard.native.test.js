import { render } from "@testing-library/react-native";

import { RecentFormDetailed } from "./snowflakes/RecentFormDetailed/RecentFormDetailed.native";
import { RECENT_FORM_CONTAINER } from "./RecentFormCard.native.selectors";

import ConnectedRecentFormCard from "./RecentFormCard.native";

jest.mock("./snowflakes/RecentFormDetailed/RecentFormDetailed.native", () => ({
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
  },
};

function setup(props) {
  return render(<ConnectedRecentFormCard {...props} />);
}

describe("Recent Form Card", () => {
  afterEach(jest.clearAllMocks);

  describe("when recent form props are not defined", () => {
    it("should return null when home is not defined", () => {
      const { queryByTestId } = setup({ ...recentFormProps, home: "" });
      expect(queryByTestId(RECENT_FORM_CONTAINER)).toBe(null);
    });

    it("should return null when away is not defined", () => {
      const { queryByTestId } = setup({ ...recentFormProps, away: "" });
      expect(queryByTestId(RECENT_FORM_CONTAINER)).toBe(null);
    });
  });

  describe("when recent form props are  defined", () => {
    it("should call RecentFormDetailed component with the correct props", () => {
      setup({ ...recentFormProps });
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
