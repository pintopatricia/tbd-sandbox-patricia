import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { CustomLogo, buildSrcSet } from "./CustomLogo.web";
import { TEST_ID, CUSTOM_LOGO_SOURCE } from "./CustomLogo.web.selectors";
import styles from "./CustomLogo.web.css";

function renderCustomLogo(props) {
  const { container } = render(<CustomLogo {...props} />);
  return container.querySelector(TEST_ID);
}

const image = {
  url: "https://example.com/img.jpg?auto=compress&w=120&h=89",
  dimensions: {
    height: 120,
    width: 120,
  },
  alt: null,
};

const logo = {
  name: "Play Game Custom Logo",
  image: {
    url: "https://example.com/test",
    dimensions: {
      height: 120,
      width: 120,
    },
    alt: null,
  },
};

const customLogoForGameTile = {
  customLogo: logo,
  isGameInfo: false,
  sizes: [
    { size: 34, mediaValue: 400, mediaType: "max-width" },
    { size: 36, mediaValue: 736, mediaType: "max-width" },
    { size: 40, mediaValue: 737, mediaType: "min-width" },
  ],
};

const customLogoForGameInfo = {
  customLogo: logo,
  isGameInfo: true,
  sizes: [{ size: 80, mediaValue: 736, mediaType: "max-width" }],
};

describe("Custom Logo", () => {
  describe("Custom Logo for game tile", () => {
    it("should render custom logo", () => {
      const customLogo = renderCustomLogo(customLogoForGameTile);
      expect(customLogo).toHaveClass(styles.customLogo);
    });

    it("should have srcset", () => {
      const smallCustomLogoUrl = "https://example.com/test?w=auto&h=34";
      const mediumCustomLogoUrl = "https://example.com/test?w=auto&h=68";
      const largeCustomLogoUrl = "https://example.com/test?w=auto&h=102";

      const customLogo = renderCustomLogo(customLogoForGameTile);
      const customLogoSource = customLogo.querySelector(CUSTOM_LOGO_SOURCE);

      const expected = `${smallCustomLogoUrl} 1x, ${mediumCustomLogoUrl} 2x, ${largeCustomLogoUrl} 3x`;
      expect(customLogoSource.getAttribute("srcset")).toBe(expected);
    });
  });

  describe("Custom Logo for game info", () => {
    it("should render custom logo", () => {
      const customLogo = renderCustomLogo(customLogoForGameInfo);
      expect(customLogo).toHaveClass(styles.customLogo);
      expect(customLogo).toHaveClass(styles.gameInfo);
    });

    it("should have srcset", () => {
      const smallCustomLogoUrl = "https://example.com/test?w=auto&h=80";
      const mediumCustomLogoUrl = "https://example.com/test?w=auto&h=120";

      const gameTile = renderCustomLogo(customLogoForGameInfo);
      const customLogo = gameTile.querySelector(CUSTOM_LOGO_SOURCE);
      const expected = `${smallCustomLogoUrl} 1x, ${mediumCustomLogoUrl} 2x`;

      expect(customLogo.getAttribute("srcset")).toBe(expected);
    });
  });
});

describe("buildSrcSet", () => {
  describe("when height multiplied by 1-2-3 does not exceed 120", () => {
    it("should return 3 sources with increasing heights and pixel density", () => {
      const srcset = buildSrcSet(image, 26);

      expect(srcset).toEqual([
        "https://example.com/img.jpg?auto=compress&w=auto&h=26 1x",
        "https://example.com/img.jpg?auto=compress&w=auto&h=52 2x",
        "https://example.com/img.jpg?auto=compress&w=auto&h=78 3x",
      ]);
    });
  });

  describe("when height multiplied by 2 exceeds 120", () => {
    it("should return 2 sources with increasing heights (max 120) and pixel density", () => {
      const srcset = buildSrcSet(image, 80);

      expect(srcset).toEqual([
        "https://example.com/img.jpg?auto=compress&w=auto&h=80 1x",
        "https://example.com/img.jpg?auto=compress&w=auto&h=120 2x",
      ]);
    });
  });
});
