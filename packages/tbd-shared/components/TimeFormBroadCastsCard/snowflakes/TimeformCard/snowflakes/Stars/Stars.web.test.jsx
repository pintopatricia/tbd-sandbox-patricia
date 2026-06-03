import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { Stars } from "./Stars.web";
import { TEST_ID as STARS, STAR_FILLED, STAR_OUTLINE } from "./Stars.web.selectors";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn((props) => <generic-icon-mock {...props} />),
}));

function renderStars({ filled, outline }) {
  return render(<Stars filled={filled} outline={outline} />);
}

describe("Stars", () => {
  it("should render the Stars", () => {
    const { container } = renderStars({ filled: 1, outline: 4 });
    expect(container.querySelector(STARS)).not.toBe(null);
  });

  it("should render one filled Star", () => {
    const { container } = renderStars({ filled: 1, outline: 4 });
    expect(container.querySelectorAll(STAR_FILLED).length).toBe(1);
  });

  it("should render four outline Star", () => {
    const { container } = renderStars({ filled: 1, outline: 4 });
    expect(container.querySelectorAll(STAR_OUTLINE).length).toBe(4);
  });

  describe("when the filled and outline stars are 0", () => {
    it("should not render any stars", () => {
      const { container } = renderStars({ filled: 0, outline: 0 });
      expect(container.querySelector(STAR_FILLED)).toBe(null);
      expect(container.querySelector(STAR_OUTLINE)).toBe(null);
    });
  });
});
