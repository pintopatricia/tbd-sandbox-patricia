import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { CONTEXTUAL_STATS_TEXT_CONTAINER } from "./ContextualStatsComparison.web.selectors";
import { ContextualStatsComparison } from "./ContextualStatsComparison.web";
import styles from "./ContextualStatsComparison.web.css";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock data-testid="GenericIconMock" />),
}));

const CONTEXTUAL_STATS_TEXT_VALUE = "Avarage shots on target, combined";

describe("ContextualStatsComparison", () => {
  it("renders ContextualStatsComparison correctly", () => {
    const result = render(
      <ContextualStatsComparison text={CONTEXTUAL_STATS_TEXT_VALUE} leftValue={"5.1"} rightValue={"5.2"} />,
    );
    const { container } = result;

    const contextualStatsText = container.querySelector(CONTEXTUAL_STATS_TEXT_CONTAINER);
    expect(contextualStatsText).not.toBeNull();
    expect(contextualStatsText).toHaveClass(styles.contextualTextContainer);
    expect(contextualStatsText).toHaveTextContent(CONTEXTUAL_STATS_TEXT_VALUE);
  });
});
