import { fireEvent, render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { BubbleItem } from "./BubbleItem.web";
import {
  ICON,
  DOT,
  LINE,
  ICON_CONTAINER,
  TITLE_BOLD,
  TITLE_REGULAR,
  DESCRIPTION,
  SUB_DESCRIPTION,
} from "./BubbleItem.web.selectors";
import styles from "./BubbleItem.web.css";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

const TITLE_MOCK = {
  bold: "TITLE_BOLD",
  regular: "TITLE_REGULAR",
};
const TITLE_ICON_MOCK = "ICON_URL";
const DESCRIPTION_MOCK = "DESCRIPTION";
const SUB_DESCRIPTION_MOCK = "SUB_DESCRIPTION";

const renderBubbleItem = (overwrites = {}) => {
  const { children, ...otherProps } = overwrites;
  const componentProps = {
    title: TITLE_MOCK,
    description: DESCRIPTION_MOCK,
    subDescription: SUB_DESCRIPTION_MOCK,
    ...otherProps,
  };

  return render(<BubbleItem {...componentProps}>{children}</BubbleItem>);
};

describe("BubbleItem", () => {
  afterEach(jest.clearAllMocks);

  describe("and the TitleIcon is defined", () => {
    it("should render the bubble item with a titleIcon if it's valid icon", () => {
      const { container } = renderBubbleItem({ titleIcon: TITLE_ICON_MOCK });
      const icon = container.querySelector(ICON);
      const iconContainer = container.querySelector(ICON_CONTAINER);

      expect(icon.getAttribute("src")).toBe(TITLE_ICON_MOCK);
      expect(iconContainer).toHaveClass(styles.iconContainer);
    });

    it("should render the bubble list with the titleIconFallback if it's not valid icon", () => {
      const { container } = renderBubbleItem({
        titleIcon: TITLE_ICON_MOCK,
        titleIconFallback: <span data-testid="mock"></span>,
      });
      const icon = container.querySelector(ICON);
      const iconContainer = container.querySelector(ICON_CONTAINER);

      expect(icon.getAttribute("src")).toBe(TITLE_ICON_MOCK);
      expect(iconContainer).toHaveClass(styles.iconContainer);

      fireEvent.error(icon);

      const iconAfterError = container.querySelector(ICON);
      const iconContainerAfterError = container.querySelector(ICON_CONTAINER);
      const fallbackIcon = container.querySelector(`span[data-testid="mock"]`);

      expect(iconAfterError).toBeNull();
      expect(fallbackIcon).not.toBeNull();
      expect(iconContainerAfterError).not.toBeNull();
    });
  });

  describe("and the TitleIcon is not defined", () => {
    it("should not render the titleIcon", () => {
      const { container } = renderBubbleItem();

      expect(container.querySelector(ICON_CONTAINER)).toBeNull();
    });
  });

  it("should draw a dot for each item with the expected class", () => {
    const { container } = renderBubbleItem();
    const dot = container.querySelector(DOT);

    expect(dot).toHaveClass(styles.dot);
  });

  it("should draw a line for each item with the expected class", () => {
    const { container } = renderBubbleItem();
    const line = container.querySelector(LINE);

    expect(line).toHaveClass(styles.line);
  });

  describe("when rendering the title", () => {
    describe("and there is a bold title but no regular title", () => {
      it("should render a bold title with the expected typography", () => {
        const { container } = renderBubbleItem({
          title: {
            regular: undefined,
            bold: TITLE_MOCK.bold,
          },
        });
        const regularTitle = container.querySelector(TITLE_REGULAR);
        const boldTitle = container.querySelector(TITLE_BOLD);

        expect(regularTitle).toBeNull();
        expect(boldTitle).toHaveClass(styles.titleText);
        expect(boldTitle).toHaveTextContent(TITLE_MOCK.bold);
      });
    });

    describe("and there is a bold title and a regular title", () => {
      it("should render a bold title with the expected typography", () => {
        const { container } = renderBubbleItem();
        const regularTitle = container.querySelector(TITLE_REGULAR);
        const boldTitle = container.querySelector(TITLE_BOLD);

        expect(boldTitle).toHaveClass(styles.titleText);
        expect(boldTitle).toHaveTextContent(TITLE_MOCK.bold);

        expect(regularTitle).toHaveClass(styles.regularText);
        expect(regularTitle).toHaveTextContent(TITLE_MOCK.regular);
      });
    });
  });

  it("should render description prop accordingly for each item", () => {
    const { container } = renderBubbleItem();
    const description = container.querySelector(DESCRIPTION);

    expect(description).toHaveClass(styles.description);
    expect(description).toHaveTextContent(DESCRIPTION_MOCK);
  });

  it("should render subDescription prop accordingly for each item", () => {
    const { container } = renderBubbleItem();
    const subDescription = container.querySelector(SUB_DESCRIPTION);

    expect(subDescription).toHaveClass(styles.subDescription);
    expect(subDescription).toHaveTextContent(SUB_DESCRIPTION_MOCK);
  });

  it("should render children when provided", () => {
    const { container } = renderBubbleItem({
      children: <span data-testid="we-are-the-world">{"We are the children"}</span>,
    });
    const childrenElement = container.querySelector(`span[data-testid="we-are-the-world"]`);

    expect(childrenElement).toHaveTextContent("We are the children");
  });
});
