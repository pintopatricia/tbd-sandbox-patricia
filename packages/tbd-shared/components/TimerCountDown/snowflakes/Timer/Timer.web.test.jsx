import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { TEST_ID, TIMER_LABEL } from "./Timer.web.selectors";
import styles from "./Timer.web.css";
import { Timer } from "./Timer.web";
import { TimeUnit } from "../TimeUnit/TimeUnit.web";

jest.mock("../TimeUnit/TimeUnit.web", () => ({
  TimeUnit: jest.fn(({ props }) => <time-unit-mock {...props} />),
}));

function renderTimer({ label, days, hours, minutes }) {
  const { container } = render(<Timer label={label} days={days} hours={hours} minutes={minutes} />);
  return container.querySelector(TEST_ID);
}

describe("Timer", () => {
  const label = "some label";
  const days = {
    label: "days",
    value: [0, 2],
  };
  const hours = {
    label: "hours",
    value: [1, 2],
  };
  const minutes = {
    label: "minutes",
    value: [5, 4],
  };

  beforeEach(jest.clearAllMocks);

  it("should display label with respective styles properly", () => {
    const timer = renderTimer({ label });
    const displayedLabel = timer.querySelector(TIMER_LABEL);

    expect(displayedLabel).toHaveClass(styles.timerTopLabel);
  });

  it("should call TimerUnit for days", () => {
    renderTimer({ days });

    expect(TimeUnit).toHaveBeenCalledWith(days, undefined);
  });

  it("should call TimerUnit for hours", () => {
    renderTimer({ hours });

    expect(TimeUnit).toHaveBeenCalledWith(hours, undefined);
  });

  it("should call TimerUnit for minutes", () => {
    renderTimer({ minutes });

    expect(TimeUnit).toHaveBeenCalledWith(minutes, undefined);
  });

  it("should call TimerUnit for days, hours and minutes", () => {
    renderTimer({ days, hours, minutes });

    expect(TimeUnit).toHaveBeenNthCalledWith(1, days, undefined);
    expect(TimeUnit).toHaveBeenNthCalledWith(2, hours, undefined);
    expect(TimeUnit).toHaveBeenNthCalledWith(3, minutes, undefined);
  });
});
