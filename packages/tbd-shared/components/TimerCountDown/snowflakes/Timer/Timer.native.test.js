import { render } from "@testing-library/react-native";

import { Timer } from "./Timer.native";
import { TIMER, TIMER_LABEL, TIMER_DAYS, TIMER_HOURS, TIMER_MINUTES } from "./Timer.native.selectors";
import { styles } from "./Timer.native.styles";
import { TimeUnit } from "../TimeUnit/TimeUnit.native";

jest.mock("../TimeUnit/TimeUnit.native", () => ({
  TimeUnit: jest.fn((props) => <time-unit-mock {...props} />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {
    TimerHorizontalGap: {
      gap: "gap",
    },
  },
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

function renderTimer({ label, days, hours, minutes } = {}) {
  return render(<Timer label={label} days={days} hours={hours} minutes={minutes} />);
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

  it("should render component", () => {
    expect(renderTimer().getByTestId(TIMER)).toBeDefined();
  });

  it("should display label with respective styles properly", () => {
    const timer = renderTimer({ label });
    const displayedLabel = timer.getByTestId(TIMER_LABEL);

    expect(displayedLabel).toHaveStyle(styles.timerTopLabel);
  });

  it("should call TimerUnit for days", () => {
    const timer = renderTimer({ days });

    expect(timer.getByTestId(TIMER_DAYS)).toBeDefined();
    expect(TimeUnit).toHaveBeenCalledWith(expect.objectContaining(days), undefined);
  });

  it("should call TimerUnit for hours", () => {
    const timer = renderTimer({ hours });

    expect(timer.getByTestId(TIMER_HOURS)).toBeDefined();
    expect(TimeUnit).toHaveBeenCalledWith(expect.objectContaining(hours), undefined);
  });

  it("should call TimerUnit for minutes", () => {
    const timer = renderTimer({ minutes });

    expect(timer.getByTestId(TIMER_MINUTES)).toBeDefined();
    expect(TimeUnit).toHaveBeenCalledWith(expect.objectContaining(minutes), undefined);
  });

  it("should call TimerUnit for days, hours and minutes", () => {
    renderTimer({ days, hours, minutes });

    expect(TimeUnit).toHaveBeenNthCalledWith(1, expect.objectContaining(days), undefined);
    expect(TimeUnit).toHaveBeenNthCalledWith(2, expect.objectContaining(hours), undefined);
    expect(TimeUnit).toHaveBeenNthCalledWith(3, expect.objectContaining(minutes), undefined);
  });
});
