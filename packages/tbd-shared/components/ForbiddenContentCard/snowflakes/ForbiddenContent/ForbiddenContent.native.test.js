import { ComponentTheme } from "@ppb/the-wall-common/types";

import { render } from "@testing-library/react-native";
import { Text } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { ForbiddenCardSize } from "./ForbiddenContent.types";
import { ForbiddenContent } from "./ForbiddenContent.native";
import { FORBIDDEN_CONTENT, FORBIDDEN_CONTENT_LABEL_CONTAINER } from "./ForbiddenContent.native.selectors";
import styles, { darkTheme, lightTheme } from "./ForbiddenContent.native.styles";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <genericIconMock></genericIconMock>),
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  heights: {},
  tokens: {
    ForbiddenContentBorderRadius: {},
    ForbiddenContentVerticalGap: {},
  },
}));

const LABEL = "label";

function renderForbiddenContent({ theme, content, size }) {
  return render(<ForbiddenContent theme={theme} content={content} size={size} />);
}

const content = (labelStyles) => (
  <Text {...getTestProps(LABEL)} style={labelStyles}>
    Log In or Join Now to see My Bets
  </Text>
);

describe("ForbiddenContent", () => {
  describe("theme", () => {
    let theme;

    describe("when theme is undefined", () => {
      it("should display dark theme", () => {
        const forbiddenContent = renderForbiddenContent({ content });
        const container = forbiddenContent.getByTestId(FORBIDDEN_CONTENT);
        const label = forbiddenContent.getByTestId(LABEL);
        expect(container).toHaveStyle([styles.container, darkTheme.darkBg]);
        expect(label).toHaveStyle([styles.label, darkTheme.dark]);
      });
    });

    describe("when theme is light", () => {
      beforeAll(() => {
        theme = ComponentTheme.Light;
      });

      it("should display light theme", () => {
        const forbiddenContent = renderForbiddenContent({ content, theme });
        const container = forbiddenContent.getByTestId(FORBIDDEN_CONTENT);
        const label = forbiddenContent.getByTestId(LABEL);
        expect(container).toHaveStyle([styles.container, lightTheme.lightBg]);
        expect(label).toHaveStyle([styles.label, lightTheme.light]);
      });
    });

    describe("when theme is light transparent", () => {
      beforeAll(() => {
        theme = ComponentTheme.LightTransparent;
      });

      it("should display light transparent theme", () => {
        const forbiddenContent = renderForbiddenContent({ content, theme });
        const label = forbiddenContent.getByTestId(LABEL);
        expect(label).toHaveStyle([styles.label, lightTheme.light]);
      });
    });

    describe("when theme is dark transparent", () => {
      beforeAll(() => {
        theme = ComponentTheme.DarkTransparent;
      });

      it("should display light theme", () => {
        const forbiddenContent = renderForbiddenContent({ content, theme });
        const label = forbiddenContent.getByTestId(LABEL);
        expect(label).toHaveStyle([styles.label, darkTheme.dark]);
      });
    });
  });

  describe("size", () => {
    describe("when size is default", () => {
      it("should set the card default theme size", () => {
        const container = renderForbiddenContent({ content, size: ForbiddenCardSize.Default });
        const forbiddenContent = container.getByTestId(FORBIDDEN_CONTENT);

        expect(forbiddenContent).toHaveStyle(styles.Default);
      });
    });

    describe("when size is small", () => {
      it("should set the card small theme size", () => {
        const container = renderForbiddenContent({ content, size: ForbiddenCardSize.Small });
        const forbiddenContent = container.getByTestId(FORBIDDEN_CONTENT);

        expect(forbiddenContent).toHaveStyle(styles.Small);
      });
    });
  });

  describe("content", () => {
    it("should display given text", () => {
      const forbiddenContent = renderForbiddenContent({ content });
      expect(forbiddenContent.getByTestId(FORBIDDEN_CONTENT_LABEL_CONTAINER)).toHaveTextContent(
        "Log In or Join Now to see My Bets",
      );
    });
  });
});
