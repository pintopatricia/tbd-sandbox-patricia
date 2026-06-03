import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { HighlightedSelectionCard } from "./HighlightedSelectionCard.web";
import { TEST_ID, TEXT, BUTTON } from "./HighlightedSelectionCard.web.selectors";
import styles from "./HighlightedSelectionCard.web.css";

function renderHighlightedSelectionCard({ text = "", isMarketClosed = false }, children = "") {
  return render(
    <HighlightedSelectionCard text={text} isMarketClosed={isMarketClosed}>
      {children}
    </HighlightedSelectionCard>,
  );
}

describe("HighlightedSelectionCard", () => {
  it("should render the card with the correct styling", () => {
    const { container } = renderHighlightedSelectionCard({ text: "MarketName" });
    const highlightedSelectionCard = container.querySelector(TEST_ID);

    expect(highlightedSelectionCard).not.toBeNull();
    expect(highlightedSelectionCard).toHaveClass(styles.highlightedSelectionCard);
    expect(highlightedSelectionCard).not.toHaveClass(styles.closed);
  });

  it("should display the text with the correct styling", () => {
    const { container } = renderHighlightedSelectionCard({ text: "MarketName" });
    const text = container.querySelector(TEXT);

    expect(text).toBeVisible();
    expect(text).toHaveTextContent("MarketName");
    expect(text).toHaveClass(styles.text);
  });

  it("should render sportsbook bet button with the correct styling and content", () => {
    const childrenMock = "any button";
    const { container } = renderHighlightedSelectionCard({ text: "MarketName" }, childrenMock);
    const buttonContainer = container.querySelector(BUTTON);

    expect(buttonContainer).toHaveTextContent("any button");
    expect(buttonContainer).toHaveClass(styles.button);
  });

  describe("when the market is closed", () => {
    it("should render the card with the correct styling", () => {
      const { container } = renderHighlightedSelectionCard({ text: "MarketName", isMarketClosed: true });
      const highlightedSelectionCard = container.querySelector(TEST_ID);

      expect(highlightedSelectionCard).not.toBeNull();
      expect(highlightedSelectionCard).toHaveClass(styles.highlightedSelectionCard, styles.closed);
    });
  });
});
