import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { ComponentTheme, ForbiddenCardSize } from "@ppb/the-wall-common/types";
import { ForbiddenContent } from "./ForbiddenContent.web";
import { TEST_ID, LABEL } from "./ForbiddenContent.web.selectors";
import styles from "./ForbiddenContent.web.css";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("@ppb/the-wall-common/types", () => ({
  ComponentTheme: {
    Dark: "dark",
    Light: "light",
    LightTransparent: "LightTransparent",
    DarkTransparent: "DarkTransparent",
  },
  ForbiddenCardSize: {
    Default: "Default",
    Regular: "Regular",
    Small: "Small",
  },
}));

function renderForbiddenContent({ theme, children, size }) {
  const { container } = render(
    <ForbiddenContent theme={theme} size={size}>
      {children}
    </ForbiddenContent>,
  );
  return container;
}

describe("ForbiddenContent", () => {
  describe("theme", () => {
    let theme;

    describe("when theme is undefined", () => {
      it("should display dark theme", () => {
        const container = renderForbiddenContent({});
        const forbiddenContent = container.querySelector(TEST_ID);

        expect(forbiddenContent).toHaveClass(styles.dark);
      });
    });

    describe("when theme is light", () => {
      beforeAll(() => {
        theme = ComponentTheme.Light;
      });

      it("should display light theme", () => {
        const container = renderForbiddenContent({ theme });
        const forbiddenContent = container.querySelector(TEST_ID);

        expect(forbiddenContent).toHaveClass(styles.light);
      });
    });

    describe("when theme is light transparent", () => {
      beforeAll(() => {
        theme = ComponentTheme.LightTransparent;
      });

      it("should display light transparent theme", () => {
        const container = renderForbiddenContent({ theme });
        const forbiddenContent = container.querySelector(TEST_ID);

        expect(forbiddenContent).toHaveClass(styles.light, styles.transparent);
      });
    });

    describe("when theme is dark transparent", () => {
      beforeAll(() => {
        theme = ComponentTheme.DarkTransparent;
      });

      it("should display light transparent theme", () => {
        const container = renderForbiddenContent({ theme });
        const forbiddenContent = container.querySelector(TEST_ID);

        expect(forbiddenContent).toHaveClass(styles.dark, styles.transparent);
      });
    });
  });

  describe("size", () => {
    describe("when size is default", () => {
      it("should set the card default theme size", () => {
        const container = renderForbiddenContent({ size: ForbiddenCardSize.Default });
        const forbiddenContent = container.querySelector(TEST_ID);

        expect(forbiddenContent).toHaveClass(styles.default);
      });
    });

    describe("when size is small", () => {
      it("should set the card small theme size", () => {
        const container = renderForbiddenContent({ size: ForbiddenCardSize.Small });
        const forbiddenContent = container.querySelector(TEST_ID);

        expect(forbiddenContent).toHaveClass(styles.small);
      });
    });
  });

  describe("children", () => {
    it("should display given text", () => {
      const container = renderForbiddenContent({ children: <span>Log In or Join Now to see My Bets</span> });
      const forbiddenContent = container.querySelector(LABEL);
      expect(forbiddenContent).toHaveTextContent("Log In or Join Now to see My Bets");
    });

    it("should display text with proper style", () => {
      const container = renderForbiddenContent({ children: <span>Log In or Join Now to see My Bets</span> });
      const forbiddenContent = container.querySelector(LABEL);
      expect(forbiddenContent).toHaveClass(styles.label);
    });
  });
});
