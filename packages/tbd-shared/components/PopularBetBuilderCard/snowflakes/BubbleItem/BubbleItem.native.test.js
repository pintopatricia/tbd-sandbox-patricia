import { render } from "@testing-library/react-native";
import { TBDImage } from "@ppb/the-wall-native";

import { TITLE, CIRCLE, LINE, DESCRIPTION, ICON_CONTAINER, SUB_DESCRIPTION } from "./BubbleItem.native.selectors";
import { BubbleItem } from "./BubbleItem.native";
import styles from "./BubbleItem.native.styles";

jest.mock("@ppb/the-wall-native", () => ({
  TBDImage: jest.fn(() => <silk-image />),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {
    BubbleItemLinePadding: {},
  },
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
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

describe("BubbleItem component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when the TitleIcon is defined", () => {
    it("should render the bubble item with a titleIcon if it's valid icon", () => {
      const { getByTestId } = renderBubbleItem({ titleIcon: TITLE_ICON_MOCK, titleIconFallback: "FileMock" });
      const iconContainer = getByTestId(ICON_CONTAINER);

      expect(iconContainer).toHaveStyle(styles.iconContainer);

      expect(TBDImage.mock.calls[0][0]).toEqual({
        source: TITLE_ICON_MOCK,
        style: styles.icon,
        resizeMode: "contain",
        fallbackSource: "FileMock",
      });
    });
  });

  it("should draw a circle", () => {
    const { getByTestId } = renderBubbleItem({});
    const listCircle = getByTestId(CIRCLE);

    expect(listCircle).not.toBeNull();
  });

  it("should draw a line with the expected style", () => {
    const { getByTestId } = renderBubbleItem({});
    const listLine = getByTestId(LINE);

    expect(listLine).not.toBeNull();
  });

  it("should render title prop accordingly", () => {
    const { getByTestId } = renderBubbleItem({});
    const itemTitle = getByTestId(TITLE);

    expect(itemTitle).toHaveTextContent("TITLE_BOLD - TITLE_REGULAR");
    expect(itemTitle).toHaveStyle([styles.titleInfo]);
  });

  it("should render description prop accordingly with the expected style", () => {
    const { getByTestId } = renderBubbleItem({});
    const itemDescription = getByTestId(DESCRIPTION);

    expect(itemDescription).toHaveTextContent("DESCRIPTION");
    expect(itemDescription).toHaveStyle(styles.textInfo);
  });

  it("should render subDescription prop accordingly with the expected style", () => {
    const { getByTestId } = renderBubbleItem({});
    const itemSubDescription = getByTestId(SUB_DESCRIPTION);

    expect(itemSubDescription).toHaveTextContent("SUB_DESCRIPTION");
    expect(itemSubDescription).toHaveStyle(styles.textInfo);
  });
});
