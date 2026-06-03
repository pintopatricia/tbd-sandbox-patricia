import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { TEST_ID, TIME_UNIT_VALUES, TIME_UNIT_TEXT } from "./TimeUnit.web.selectors";
import styles from "./TimeUnit.web.css";
import { TimeUnit } from "./TimeUnit.web";

function renderTimeUnit({ label, value }) {
  const { container } = render(<TimeUnit label={label} value={value} />);
  return container.querySelector(TEST_ID);
}

describe("TimeUnit", () => {
  const timeUnit = {
    label: "days",
    value: [0, 2],
  };

  it("should display all digits with respective styles properly", () => {
    const timer = renderTimeUnit(timeUnit);
    const displayedDigits = timer.querySelectorAll(TIME_UNIT_VALUES);

    expect(displayedDigits[0]).toHaveClass(styles.timerBorder);
    expect(displayedDigits[1]).toHaveClass(styles.timerBorder);
  });

  it("should show text container for timer with respective styles properly", () => {
    const timer = renderTimeUnit(timeUnit);
    const timerTextValue = timer.querySelector(TIME_UNIT_TEXT);

    expect(timerTextValue).toHaveClass(styles.text);
  });
});
