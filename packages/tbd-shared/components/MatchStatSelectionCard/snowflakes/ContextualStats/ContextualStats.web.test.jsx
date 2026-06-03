import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { ContextualStats } from "./ContextualStats.web";
import { TEST_ID, CONTEXTUAL_STATS_TEXT, CONTEXTUAL_STATS_ICON } from "./ContextualStats.web.selectors";
import styles from "./ContextualStats.web.css";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock data-testid="GenericIconMock" />),
}));

const CONTEXTUAL_STATS_TEXT_VALUE = "Bukayo Saka scored 2 goals";

function renderContextualStats(text = "", showIcon = true) {
  return render(<ContextualStats text={text} showIcon={showIcon} />);
}

describe("ContextualStats", () => {
  it("renders ContextualStats correctly", () => {
    const result = renderContextualStats(CONTEXTUAL_STATS_TEXT_VALUE, true);
    const { container } = result;

    const contextualStats = container.querySelector(TEST_ID);
    expect(contextualStats).not.toBeNull();
    expect(contextualStats).toHaveClass(styles.contextualStatsContainer);
  });

  it("renders Contextual Stats text correctly", async () => {
    const result = renderContextualStats(CONTEXTUAL_STATS_TEXT_VALUE, true);
    const { container } = result;

    const contextualStatsText = container.querySelector(CONTEXTUAL_STATS_TEXT);
    expect(contextualStatsText).not.toBeNull();
    expect(contextualStatsText).toHaveClass(styles.contextualStatsText);
    expect(contextualStatsText).toHaveTextContent(CONTEXTUAL_STATS_TEXT_VALUE);
  });

  it("renders the icon when passed through", () => {
    const result = renderContextualStats(CONTEXTUAL_STATS_TEXT_VALUE, true);
    const { container } = result;

    const contextualStatsIcon = container.querySelector(CONTEXTUAL_STATS_ICON);

    expect(contextualStatsIcon).not.toBeNull();
    expect(contextualStatsIcon).toHaveClass(styles.icon);
  });

  it("does not render the icon when not passed through", () => {
    const result = renderContextualStats(CONTEXTUAL_STATS_TEXT_VALUE, false);
    const { container } = result;

    const contextualStatsIcon = container.querySelector(CONTEXTUAL_STATS_ICON);
    expect(contextualStatsIcon).toBeNull();
  });
});
