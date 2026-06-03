import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import FixtureCardPlaceholder from "./FixtureCardPlaceholder.web";
import styles from "./FixtureCardPlaceholder.web.css";
import { PLACEHOLDER } from "./FixtureCard.web.selectors";

describe("FixtureCardPlaceholder component", () => {
  beforeEach(jest.clearAllMocks);

  it("should render a section", () => {
    const { container } = render(<FixtureCardPlaceholder />);

    expect(container.querySelector(PLACEHOLDER)).toHaveClass(styles.container);
  });
});
