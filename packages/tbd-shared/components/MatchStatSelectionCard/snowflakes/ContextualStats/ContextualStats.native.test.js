import { render } from "@testing-library/react-native";
import { ContextualStats } from "./ContextualStats.native";
import {
  CONTEXTUAL_STATS_CONTAINER,
  CONTEXTUAL_STATS_ICON,
  CONTEXTUAL_STATS_TEXT,
} from "./ContextualStats.native.selectors";
import styles from "./ContextualStats.native.styles";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

const CONTEXTUAL_STATS_TEXT_VALUE = "Bukayo Saka scored 2 goals";

function renderContextualStats(props) {
  const { queryByTestId } = render(<ContextualStats {...props} />);

  return {
    container: queryByTestId(CONTEXTUAL_STATS_CONTAINER),
    icon: queryByTestId(CONTEXTUAL_STATS_ICON),
    text: queryByTestId(CONTEXTUAL_STATS_TEXT),
  };
}

describe("ContextualStats", () => {
  it("renders Contextual Stats correctly", async () => {
    const component = renderContextualStats({ text: "", showIcon: true });

    expect(component.container).toBeDefined();
    expect(component.container).toHaveStyle(styles.container);
  });

  it("renders Contextual Stats text correctly", () => {
    const component = renderContextualStats({ text: CONTEXTUAL_STATS_TEXT_VALUE, showIcon: true });

    expect(component.text).toBeDefined();
    expect(component.text).toHaveStyle(styles.text);
    expect(component.text).toHaveTextContent(CONTEXTUAL_STATS_TEXT_VALUE);
  });

  it("renders the icon when passed through", () => {
    const component = renderContextualStats({ text: CONTEXTUAL_STATS_TEXT_VALUE, showIcon: true });

    expect(component.icon).toBeDefined();
    expect(component.icon).toHaveStyle(styles.icon);
  });

  it("does not render the icon when not passed through", () => {
    const component = renderContextualStats({ text: CONTEXTUAL_STATS_TEXT_VALUE, showIcon: false });

    expect(component.icon).toBeNull();
  });
});
