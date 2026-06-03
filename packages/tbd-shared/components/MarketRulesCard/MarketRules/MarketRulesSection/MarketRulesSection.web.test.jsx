import { render, screen } from "@testing-library/react";
import "jest-dom/extend-expect";

import { MarketRulesSection } from "./MarketRulesSection.web";

function renderMarketRulesSection(props) {
  return render(<MarketRulesSection {...props} />);
}

describe("Market Rules Section", () => {
  describe("render", () => {
    it("should have correct title", () => {
      renderMarketRulesSection({ name: "Title" });
      const title = screen.getByText("Title");

      expect(title).toBeInTheDocument();
    });

    it("should render children", () => {
      renderMarketRulesSection({
        name: "Title",
        children: <div>Child</div>,
      });
      const child = screen.getByText("Child");

      expect(child).toBeInTheDocument();
    });
  });
});
