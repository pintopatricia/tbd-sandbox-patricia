import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import PageHeaderPlaceholder from "./PageHeaderPlaceholder.web";
import styles from "./PageHeaderPlaceholder.web.css";
import { PLACEHOLDER, TEST_ID } from "./PageHeaderPlaceholder.web.selectors";

describe("PageHeaderPlaceholder component", () => {
  beforeEach(jest.clearAllMocks);

  it("should render a section", () => {
    const { container } = render(<PageHeaderPlaceholder />);
    expect(container.querySelector(TEST_ID)).toHaveClass(styles.placeholderContainer);
    expect(container.querySelector(PLACEHOLDER)).toHaveClass(styles.placeholder);
  });
});
