import { render } from "@testing-library/react-native";
import { Divider } from "@ppb/the-wall-native";
import { SkyBetStateIndicator } from "./SkyBetStateIndicator.native";
import styles from "./SkyBetStateIndicator.native.styles";
import {
  STATE_INDICATOR_VERSION,
  STATE_INDICATOR_TITLE,
  STATE_INDICATOR_EFL_IMAGE,
  STATE_INDICATOR_EFL_TEXT,
  STATE_INDICATOR_SAFER_GAMBLING_IMAGE,
} from "./SkyBetStateIndicator.native.selectors";

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: { LoadingViewBackgroundColour: "blue" },
  typography: {},
  colors: {},
  spacings: {},
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
  Divider: jest.fn(() => <divider-mock />),
}));

function renderLabel({ loadingTitle, version }) {
  return render(<SkyBetStateIndicator loadingTitle={loadingTitle} appVersion={version} />);
}

describe("Label", () => {
  beforeEach(jest.clearAllMocks);

  it("should render the component and apply styles to the elements", () => {
    const { queryByTestId } = renderLabel({ loadingTitle: "title", version: "v3.0.0" });

    expect(queryByTestId(STATE_INDICATOR_TITLE)).toBeTruthy();
    expect(queryByTestId(STATE_INDICATOR_TITLE)).toHaveStyle(styles.title);
    expect(queryByTestId(STATE_INDICATOR_TITLE)).toHaveTextContent("title");

    expect(queryByTestId(STATE_INDICATOR_EFL_IMAGE)).toBeTruthy();
    expect(queryByTestId(STATE_INDICATOR_EFL_TEXT)).toBeTruthy();
    expect(queryByTestId(STATE_INDICATOR_SAFER_GAMBLING_IMAGE)).toBeTruthy();

    expect(queryByTestId(STATE_INDICATOR_VERSION)).toBeTruthy();
    expect(queryByTestId(STATE_INDICATOR_VERSION)).toHaveStyle(styles.version);
    expect(queryByTestId(STATE_INDICATOR_VERSION)).toHaveTextContent("v3.0.0");

    expect(Divider).toHaveBeenCalledTimes(1);
  });
});
