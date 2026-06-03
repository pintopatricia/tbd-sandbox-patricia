import { render } from "@testing-library/react-native";

import { TimeUnit } from "./TimeUnit.native";
import { TIME_UNIT, TIME_UNIT_TEXT, TIME_UNIT_VALUES } from "./TimeUnit.native.selectors";
import { styles } from "./TimeUnit.native.styles";

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

function renderTimeUnit({ label, value = [] } = {}) {
  return render(<TimeUnit label={label} value={value} />);
}

describe("TimeUnit", () => {
  const timeUnit = {
    label: "days",
    value: [0, 2],
  };

  it("should render component", () => {
    expect(renderTimeUnit().getByTestId(TIME_UNIT)).toBeDefined();
  });

  it("should display all digits with respective styles properly", () => {
    const timer = renderTimeUnit(timeUnit);
    const displayedDigits = timer.getAllByTestId(TIME_UNIT_VALUES);

    expect(displayedDigits[0]).toHaveStyle(styles.timerBorder);
    expect(displayedDigits[1]).toHaveStyle(styles.timerBorder);
  });

  it("should show text container for timer with respective styles properly", () => {
    const timer = renderTimeUnit(timeUnit);
    const timerTextValue = timer.getByTestId(TIME_UNIT_TEXT);

    expect(timerTextValue).toHaveStyle(styles.text);
  });
});
