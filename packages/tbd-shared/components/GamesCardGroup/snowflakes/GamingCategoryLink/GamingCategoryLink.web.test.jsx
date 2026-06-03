import { render, fireEvent } from "@testing-library/react";
import "jest-dom/extend-expect";

import { GamingCategoryLink } from "./GamingCategoryLink.web";
import styles from "./GamingCategoryLink.web.css";
import { TEST_ID, LABEL, BUTTON, ICON } from "./GamingCategoryLink.web.selectors";

jest.mock("@ppb/the-wall-web", () => ({
  HighlightedLinkCardIcon: { SLOTS: "slotsMock" },
}));

const viewLinkMock = {
  viewUrl: "viewUrlMock",
  viewUrn: "viewUrnMock",
};

function renderGamingCategory({
  viewLink = viewLinkMock,
  label = "Label",
  buttonText = "See All",
  cardIcon,
  gamingZoneTitle = "Gaming zone title",
  onClick = () => {},
}) {
  return render(
    <GamingCategoryLink
      viewLink={viewLink}
      gamingZoneTitle={gamingZoneTitle}
      label={label}
      cardIcon={cardIcon}
      buttonText={buttonText}
      onClick={onClick}
    />,
  );
}

describe("GamingCategory", () => {
  beforeEach(jest.clearAllMocks);

  it("should have the 'gamingCategory' class", () => {
    const { container } = renderGamingCategory({});
    const gamingCategory = container.querySelector(TEST_ID);

    expect(gamingCategory).toHaveClass(styles.gamingCategory);
  });

  it("should have the provided link", () => {
    const { container } = renderGamingCategory({});
    const gamingCategory = container.querySelector(TEST_ID);
    const cardHrefAttribute = gamingCategory.getAttribute("href");

    expect(cardHrefAttribute).toBe("viewUrlMock");
  });

  it("should display the label", () => {
    const { container } = renderGamingCategory({});
    const label = container.querySelector(LABEL);

    expect(label).toHaveTextContent("Label");
  });

  describe("when button text is defined", () => {
    it("should render gaming category button", () => {
      const { container } = renderGamingCategory({ buttonText: "Button" });
      const buttonSelector = container.querySelector(BUTTON);

      expect(buttonSelector).toHaveClass(styles.categoryButton);
      expect(buttonSelector).toHaveTextContent("Button");
    });
  });

  describe("icon", () => {
    it("should render slots icon", () => {
      const { container } = renderGamingCategory({ cardIcon: "SLOTS" });
      const icon = container.querySelector(ICON);
      expect(icon).toBeDefined();
      expect(icon).toHaveClass(styles.icon);
      expect(icon).toHaveTextContent("slotsMock");
    });

    it("should not render slots icon if cardIcon is undefined", () => {
      const { container } = renderGamingCategory({ cardIcon: undefined });
      const icon = container.querySelector(ICON);
      expect(icon).toBe(null);
    });
  });

  describe("and onClick callback provided", () => {
    it("should call onClick handler on click event", () => {
      const onClickMock = jest.fn().mockImplementation((ev) => ev.preventDefault());
      const { container } = renderGamingCategory({ onClick: onClickMock });
      const gamingCategoryCard = container.querySelector(TEST_ID);
      fireEvent.click(gamingCategoryCard);

      expect(onClickMock).toHaveBeenCalledTimes(1);
      expect(onClickMock).toHaveBeenCalledWith(expect.any(Object), viewLinkMock, "Label", "Gaming zone title");
    });
  });
});
