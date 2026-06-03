import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import RaceMarketCardPlaceholder from "./RaceMarketCardPlaceholder.web";
import styles from "./RaceMarketCardPlaceholder.web.css";
import { PLACEHOLDER } from "./RaceMarketCard.web.selectors";

describe("RaceMarketCardPlaceholder component", () => {
  beforeEach(jest.clearAllMocks);

  it("should render a section", () => {
    const { container } = render(<RaceMarketCardPlaceholder />);

    expect(container.querySelector(PLACEHOLDER)).toHaveClass(styles.container);
  });
});
