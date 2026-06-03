import { render } from "@testing-library/react-native";
import { HighlightedSelectionCard } from "./HighlightedSelectionCard.native";
import styles from "./HighlightedSelectionCard.native.styles";
import {
  HIGHLIGHTED_SELECTION_CARD,
  HIGHLIGHTED_SELECTION_CARD_TEXT,
  HIGHLIGHTED_SELECTION_CARD_BUTTON,
} from "./HighlightedSelectionCard.native.selectors";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  typography: {},
  spacings: {},
  heights: {},
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

function renderHighlightedSelectionCard({ text, isMarketClosed, children }) {
  const selectors = render(
    <HighlightedSelectionCard text={text} isMarketClosed={isMarketClosed}>
      {children}
    </HighlightedSelectionCard>,
  );
  const { queryByTestId } = selectors;

  return {
    highlightedSelectionCard: queryByTestId(HIGHLIGHTED_SELECTION_CARD),
    text: queryByTestId(HIGHLIGHTED_SELECTION_CARD_TEXT),
    button: queryByTestId(HIGHLIGHTED_SELECTION_CARD_BUTTON),
  };
}

describe("HighlightedSelectionCard", () => {
  const baseSetupValues = {
    text: "TEXT",
    isMarketClosed: false,
    children: "CHILDREN",
  };

  afterEach(jest.clearAllMocks);

  describe("highlighted selection card container", () => {
    it("should render the highlighted selection card container with the correct styling", () => {
      const { highlightedSelectionCard } = renderHighlightedSelectionCard(baseSetupValues);
      expect(highlightedSelectionCard).toHaveStyle(styles.highlightedSelectionCard);
    });
  });

  describe("text", () => {
    it("should render the text with the correct styling and content", () => {
      const { text } = renderHighlightedSelectionCard(baseSetupValues);
      expect(text).toHaveStyle(styles.text);
      expect(text).toHaveTextContent(baseSetupValues.text);
    });
  });

  describe("button", () => {
    it("should render the button container with the correct styling and content", () => {
      const { button } = renderHighlightedSelectionCard(baseSetupValues);
      expect(button).toHaveStyle(styles.button);
      expect(button).toHaveTextContent(baseSetupValues.children);
    });
  });

  describe("and market is closed", () => {
    const closedWithIconSetupValues = {
      ...baseSetupValues,
      isMarketClosed: true,
    };

    it("should apply closed styling to the highlightedselectioncard container", () => {
      const { highlightedSelectionCard } = renderHighlightedSelectionCard(closedWithIconSetupValues);
      expect(highlightedSelectionCard).toHaveStyle([styles.highlightedSelectionCard, styles.closedBackground]);
    });

    it("should apply closed styling to the text", () => {
      const { text } = renderHighlightedSelectionCard(closedWithIconSetupValues);
      expect(text).toHaveStyle([styles.text, styles.closedOpacity]);
    });
  });
});
