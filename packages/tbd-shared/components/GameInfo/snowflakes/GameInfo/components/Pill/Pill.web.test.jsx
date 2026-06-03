import { render } from "@testing-library/react";
import { Pill } from "./Pill.web";
import styles from "./Pill.web.css";

describe("Pill component", () => {
  it("renders the label correctly", () => {
    const { getByText } = render(<Pill label="Megaways" />);
    expect(getByText("Megaways")).not.toBeNull();
  });

  it("applies the default wrapper class without dot", () => {
    const { container } = render(<Pill label="Slot" />);
    const wrapper = container.firstChild;
    expect(wrapper.className.includes(styles.pillWrapper)).toBe(true);
    expect(wrapper.className.includes(styles.withDot)).toBe(false);
  });

  it("applies the dot class when showDot is true", () => {
    const { container } = render(<Pill label="High Volatility" showDot />);
    const wrapper = container.firstChild;
    expect(wrapper.className.includes(styles.pillWrapper)).toBe(true);
    expect(wrapper.className.includes(styles.withDot)).toBe(true);
  });

  it("renders empty span if label is undefined", () => {
    const { container } = render(<Pill label={undefined} />);
    const span = container.querySelector(`.${styles.label}`);
    expect(span.textContent).toBe("");
  });
});
