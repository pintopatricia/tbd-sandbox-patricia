import { render } from "@testing-library/react-native";

import { RecentFormDetailed } from "./RecentFormDetailed.native";

import {
  RECENT_FORM_DETAILED,
  RECENT_FORM_DETAILED_HOME,
  RECENT_FORM_DETAILED_AWAY,
  RECENT_FORM_DETAILED_CAPTION,
} from "./RecentFormDetailed.native.selectors";

import styles from "./RecentFormDetailed.native.styles";

jest.mock("../RecentFormResult/RecentFormResult.native", () => ({
  RecentFormResult: jest.fn(() => <recent-form-result />),
}));

jest.mock("@ppb/the-wall-native/components/RecentForm/RecentFormCaption/RecentFormCaption", () => ({
  RecentFormCaption: jest.fn(() => <recent-form-caption />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  spacings: {},
}));

const i18n = {
  recentFormResultI18n: "mocked",
};

const homeTeamRecentResults = ["home1", "home2"];

const awayTeamRecentResults = ["away1", "away2"];

function renderRecentFormDetailed(relativeFixtureResult) {
  return render(<RecentFormDetailed relativeFixtureResult={relativeFixtureResult} i18n={i18n} />);
}

describe("RecentFormDetailed", () => {
  let detailedComponent;
  let homeResultContainers;
  let awayResultContainers;
  let captionComponent;

  beforeEach(() => {
    const { queryByTestId, queryAllByTestId } = renderRecentFormDetailed([
      homeTeamRecentResults,
      awayTeamRecentResults,
    ]);

    detailedComponent = queryByTestId(RECENT_FORM_DETAILED);
    homeResultContainers = queryAllByTestId(RECENT_FORM_DETAILED_HOME);
    awayResultContainers = queryAllByTestId(RECENT_FORM_DETAILED_AWAY);
    captionComponent = queryByTestId(RECENT_FORM_DETAILED_CAPTION);
  });

  it("should render the recent form detailed component", () => {
    expect(detailedComponent).toBeDefined();
  });

  it("should render two recent form result home containers", () => {
    expect(homeResultContainers.length).toEqual(2);
  });

  it("should render two recent form result away containers", () => {
    expect(awayResultContainers.length).toEqual(2);
  });

  it("shoud apply innerContainerFirst style to the first home result component", () => {
    expect(homeResultContainers[0]).toHaveStyle(styles.innerContainerFirst);
  });

  it("shoud apply innerContainerLast style to the last home result component", () => {
    expect(homeResultContainers[1]).toHaveStyle(styles.innerContainerLast);
  });

  it("should render the caption component", () => {
    expect(captionComponent).toBeDefined();
  });
});
