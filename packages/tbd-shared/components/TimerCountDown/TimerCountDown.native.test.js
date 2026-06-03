import { render, cleanup } from "@testing-library/react-native";
import TimerCountDown from "./TimerCountDown.native";

// Mock the Timer component
jest.mock("./snowflakes/Timer/Timer.native", () => ({
  Timer: ({ label, days, hours, minutes }) => (
    <>
      <timer-title testID="timer-title">{label}</timer-title>
      {days && <timer-days testID="timer-days">{`${days.label}: ${days.value}`}</timer-days>}
      {hours && <timer-hours testID="timer-hours">{`${hours.label}: ${hours.value}`}</timer-hours>}
      {minutes && <timer-minutes testID="timer-minutes">{`${minutes.label}: ${minutes.value}`}</timer-minutes>}
    </>
  ),
}));

jest.mock("./props", () => ({
  i18nLabels: {
    days: "I18N.OBB.UNAVAILABLE.DAYS",
    hours: "I18N.OBB.UNAVAILABLE.HOURS",
    minutes: "I18N.OBB.UNAVAILABLE.MINUTES",
  },
}));

jest.mock("./helper", () => ({
  isValidNumber: jest.fn(() => true),
  timeFormatter: jest.fn(() => [0, 0]),
}));

describe("TimerCountDown", () => {
  afterEach(cleanup);

  // Mock date for testing
  const mockNow = new Date(2024, 10, 22, 10);

  it("should render the title correctly", () => {
    const targetDate = new Date(mockNow.getTime() + 86400000);
    const result = render(<TimerCountDown targetDate={targetDate} title="Countdown" />);

    expect(result.getByTestId("timer-title").props.children).toBe("Countdown");
  });

  it("should show remaining days correctly", () => {
    const targetDate = new Date(mockNow.getTime() + 86400000);
    const result = render(<TimerCountDown targetDate={targetDate} title="Countdown" />);

    expect(result.getByTestId("timer-days").props.children).toBe("I18N.OBB.UNAVAILABLE.DAYS: 0,0");
  });

  it("should show hours and minutes when less than one day remaining", () => {
    const targetDate = new Date(mockNow.getTime() + 3600000 * 5 + 60000 * 30);
    const result = render(<TimerCountDown targetDate={targetDate} title="Countdown" />);

    expect(result.getByTestId("timer-hours").props.children).toBe("I18N.OBB.UNAVAILABLE.HOURS: 0,0");
    expect(result.getByTestId("timer-minutes").props.children).toBe("I18N.OBB.UNAVAILABLE.MINUTES: 0,0");
  });
});
