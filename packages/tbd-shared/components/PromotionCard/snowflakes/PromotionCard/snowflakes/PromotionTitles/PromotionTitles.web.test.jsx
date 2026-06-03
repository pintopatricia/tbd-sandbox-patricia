import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { PromotionTitles } from "./PromotionTitles.web";
import styles from "./PromotionTitles.web.css";
import { TEST_ID, TITLE, SUBTITLE } from "./PromotionTitles.web.selectors";

function renderPromotionTitles({ titleLabel, subtitleLabel }) {
  const { container } = render(<PromotionTitles title={titleLabel} subtitle={subtitleLabel} />);

  const promotionTitles = container.querySelector(TEST_ID);
  const title = container.querySelector(TITLE);
  const subtitle = container.querySelector(SUBTITLE);

  return { promotionTitles, title, subtitle };
}

describe("Promotion Titles", () => {
  describe("When both title and subtitle have non-empty values and is not an IMS promo", () => {
    const { title, subtitle } = renderPromotionTitles({
      titleLabel: "Test Title",
      subtitleLabel: "Test Subtitle",
    });

    it("should show title with correct style", () => {
      expect(title).toHaveTextContent("Test Title");
      expect(title).toHaveClass(styles.title, styles.promotionTitles, "typography-h158");
    });

    it("should show subtitle with correct style", () => {
      expect(subtitle).toHaveTextContent("Test Subtitle");
      expect(subtitle).toHaveClass(styles.promotionTitles, styles.subtitle, "typography-h180");
    });
  });

  describe("When the subtitle has an empty value", () => {
    const { subtitle } = renderPromotionTitles({
      titleLabel: "Test Title",
      subtitleLabel: "",
    });

    it("should not show subtitle", () => {
      expect(subtitle).toBe(null);
    });
  });
});
