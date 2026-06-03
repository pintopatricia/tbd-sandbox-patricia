import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { OngoingBadge } from "./OngoingBadge.web";
import styles from "./OngoingBadge.web.css";
import { TEST_ID } from "./OngoingBadge.web.selectors";

jest.mock("../OngoingPromoBadge/OngoingPromoCardBadge.web", () => ({
  OngoingPromoCardBadge: jest.fn(() => <mock-ongoing-promo-card-badge />),
}));

function renderOngoingBadge({ label = "Ongoing" }) {
  const { container } = render(<OngoingBadge label={label} />);
  return container.querySelector(TEST_ID);
}

describe("OngoingBadge", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("render component", () => {
    it("should have the render with correct css class", () => {
      const badge = renderOngoingBadge({});
      expect(badge).toHaveClass(styles.promoBadge);
    });

    it("should have the correct label", () => {
      const badge = renderOngoingBadge({});
      expect(badge).toHaveTextContent("Ongoing");
    });
  });
});
