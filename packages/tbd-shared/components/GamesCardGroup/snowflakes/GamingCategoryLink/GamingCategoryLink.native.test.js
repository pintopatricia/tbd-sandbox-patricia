import { render, fireEvent } from "@testing-library/react-native";
import { CardIconTypes } from "@ppb/the-wall-common/types";
import { GamingCategoryLink } from "./GamingCategoryLink.native";
import styles from "./GamingCategoryLink.native.styles";
import {
  GAMING_CATEGORY_LINK_CARD,
  GAMING_CATEGORY_LINK_CARD_ICON,
  GAMING_CATEGORY_LINK_CARD_LABEL,
  GAMING_CATEGORY_LINK_CARD_BUTTON_TEXT,
} from "./GamingCategoryLink.native.selectors";

const viewLinkMock = {
  viewUrl: "viewUrlMock",
  viewUrn: "viewUrnMock",
};

jest.mock("@ppb/the-wall-native/components/HighlightedLinkCard/HighlightedLinkCard", () => ({
  HighlightedLinkCardIcon: jest.fn(() => <highlighted-link-card-icon-mock />),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  typography: {},
  spacings: {},
  heights: {},
}));

function renderGamingCategoryLink(viewLink, label, buttonText, gamingZoneTitle, onClick, cardIcon) {
  const container = render(
    <GamingCategoryLink
      viewLink={viewLink}
      gamingZoneTitle={gamingZoneTitle}
      label={label}
      onClick={onClick}
      buttonText={buttonText}
      cardIcon={cardIcon}
    />,
  );

  return {
    gamingCategoryLinkCard: container.getByTestId(GAMING_CATEGORY_LINK_CARD),
    gamingCategoryLinkCardLabel: container.getByTestId(GAMING_CATEGORY_LINK_CARD_LABEL),
    gamingCategoryLinkCardIcon: cardIcon ? container.getByTestId(GAMING_CATEGORY_LINK_CARD_ICON) : null,
    gamingCategoryLinkCardButton: container.queryByTestId(GAMING_CATEGORY_LINK_CARD_BUTTON_TEXT),
  };
}

describe("GamingCategoryLinkCard", () => {
  let result;
  let mockClick;

  describe("with icon", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockClick = jest.fn();
      result = renderGamingCategoryLink(
        viewLinkMock,
        "Label",
        "See All",
        "Gaming zone title",
        mockClick,
        CardIconTypes.Specials,
      );
    });

    describe("Container", () => {
      it("should render container", () => {
        expect(result.gamingCategoryLinkCard).not.toBeNull();
      });

      it("should have style", () => {
        expect(result.gamingCategoryLinkCard).toHaveStyle(styles.container);
      });
    });

    describe("Icon", () => {
      it("should render icon", () => {
        expect(result.gamingCategoryLinkCardIcon).not.toBeNull();
      });

      it("should have style", () => {
        expect(result.gamingCategoryLinkCardIcon).toHaveStyle(styles.icon);
      });
    });

    describe("Label", () => {
      it("should render Label with text", () => {
        expect(result.gamingCategoryLinkCardLabel).toHaveTextContent("Label");
      });

      it("should have style", () => {
        expect(result.gamingCategoryLinkCardLabel).toHaveStyle(styles.label);
      });
    });

    describe("when button text is defined", () => {});
    it("should render gaming category button", () => {
      expect(result.gamingCategoryLinkCardButton).toHaveTextContent("See All");
    });

    it("should have style", () => {
      expect(result.gamingCategoryLinkCardButton).toHaveStyle(styles.buttonText);
    });

    describe("Tap action", () => {
      it("should perform an action", () => {
        expect(mockClick).not.toHaveBeenCalled();
        fireEvent.press(result.gamingCategoryLinkCard);
        expect(mockClick).toHaveBeenCalled();
      });
    });
  });

  describe("without icon", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockClick = jest.fn();
      result = renderGamingCategoryLink(viewLinkMock, "Label", "See All", "Gaming zone title", mockClick);
    });

    describe("Container", () => {
      it("should render container", () => {
        expect(result.gamingCategoryLinkCard).not.toBeNull();
      });

      it("should have style", () => {
        expect(result.gamingCategoryLinkCard).toHaveStyle(styles.container);
      });
    });

    describe("Icon", () => {
      it("should not render icon", () => {
        expect(result.gamingCategoryLinkCardIcon).toBeNull();
      });

      describe("Label", () => {
        it("should render Label with text", () => {
          expect(result.gamingCategoryLinkCardLabel).toHaveTextContent("Label");
        });

        it("should have style", () => {
          expect(result.gamingCategoryLinkCardLabel).toHaveStyle(styles.label);
        });
      });

      describe("when button text is defined", () => {
        it("should render gaming category button", () => {
          expect(result.gamingCategoryLinkCardButton).toHaveTextContent("See All");
        });

        it("should have style", () => {
          expect(result.gamingCategoryLinkCardButton).toHaveStyle(styles.buttonText);
        });
      });

      describe("Tap action", () => {
        it("should perform an action", () => {
          expect(mockClick).not.toHaveBeenCalled();
          fireEvent.press(result.gamingCategoryLinkCard);
          expect(mockClick).toHaveBeenCalled();
        });
      });
    });
  });
});
