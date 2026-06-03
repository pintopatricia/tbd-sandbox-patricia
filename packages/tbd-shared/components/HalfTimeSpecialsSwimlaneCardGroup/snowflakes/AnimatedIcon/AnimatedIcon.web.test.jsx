import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import AnimatedIcon from "./AnimatedIcon.web";
import { TEXT, ICON } from "./AnimatedIcon.web.selectors";
import styles from "./AnimatedIcon.web.css";

describe("AnimatedIcon Component", () => {
  it("should render the container with the correct class", () => {
    const { container } = render(<AnimatedIcon />);
    const icon = container.querySelector(ICON);
    expect(icon).toHaveClass(styles.icon);
  });

  it("should render the text element with the correct class and content", () => {
    const { container } = render(<AnimatedIcon />);
    const text = container.querySelector(TEXT);
    expect(text).toHaveClass(styles.text);
    expect(text).toHaveTextContent("NEW");
  });
});
