import { render } from "@testing-library/react-native";
import { ContextualStatsComparison } from "./ContextualStatsComparison.native";
import {
  CONTEXTUAL_STATS_CONTAINER,
  CONTEXTUAL_STATS_ICON,
  CONTEXTUAL_STATS_TEXT,
} from "./ContextualStatsComparison.native.selectors";
import styles from "./ContextualStatsComparison.native.styles";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

const CONTEXTUAL_STATS_TEXT_VALUE = "Avarage shots on target, combined";

function renderContextualStatsComparison(props) {
  const { queryByTestId } = render(<ContextualStatsComparison {...props} />);

  return {
    container: queryByTestId(CONTEXTUAL_STATS_CONTAINER),
    icon: queryByTestId(CONTEXTUAL_STATS_ICON),
    text: queryByTestId(CONTEXTUAL_STATS_TEXT),
  };
}

describe("ContextualStatsComparison", () => {
  it("renders ContextualStatsComparison correctly", async () => {
    const component = renderContextualStatsComparison({
      text: CONTEXTUAL_STATS_TEXT_VALUE,
      leftValue: "5.1",
      rightValue: "5.2",
    });

    expect(component.container).toBeDefined();
    expect(component.container).toHaveStyle(styles.contextualStatsComparisonContainer);
  });
});
