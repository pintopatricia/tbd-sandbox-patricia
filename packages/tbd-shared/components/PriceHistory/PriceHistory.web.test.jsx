import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import PriceHistory from "./PriceHistory.web";
import { TEST_ID } from "./PriceHistory.web.selectors";

function renderPriceHistory({ previousOdds }) {
  return render(<PriceHistory previousOdds={previousOdds} />);
}

describe("PriceHistory", () => {
  beforeEach(jest.clearAllMocks);

  it("should render correctly", () => {
    const { container } = renderPriceHistory({
      previousOdds: "1.33 ▸ 1.3 ▸ 1.29",
    });

    expect(container.querySelector(TEST_ID)).toHaveTextContent("");
  });
});
