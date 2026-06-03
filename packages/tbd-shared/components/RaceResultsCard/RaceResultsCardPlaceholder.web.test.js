import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import RaceResultsCardPlaceholder from "./RaceResultsCardPlaceholder.web";
import styles from "./RaceResultsCardPlaceholder.web.css";
import { PLACEHOLDER } from "./RaceResultsCard.web.selectors";

describe("RaceResultsCardPlaceholder component", () => {
  beforeEach(jest.clearAllMocks);

  it("should render a section", () => {
    const { container } = render(<RaceResultsCardPlaceholder />);

    expect(container.querySelector(PLACEHOLDER)).toHaveClass(styles.container);
  });
});
