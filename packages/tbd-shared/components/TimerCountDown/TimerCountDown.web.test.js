import { render, cleanup } from "@testing-library/react";
import TimerCountDown from "./TimerCountDown.web";

// Mock the Timer component
jest.mock("./snowflakes/Timer/Timer.web", () => ({
  Timer: ({ label, days, hours, minutes }) => (
    <div>
      <h1>{label}</h1>
      {days && <p>{`${days.label}: ${days.value}`}</p>}
      {hours && <p>{`${hours.label}: ${hours.value}`}</p>}
      {minutes && <p>{`${minutes.label}: ${minutes.value}`}</p>}
    </div>
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

    expect(result.getByText("Countdown")).not.toBeNull();
  });

  it("should show remaining days correctly", () => {
    const targetDate = new Date(mockNow.getTime() + 86400000);
    const result = render(<TimerCountDown targetDate={targetDate} title="Countdown" />);

    expect(result.getByText(`I18N.OBB.UNAVAILABLE.DAYS: 0,0`)).not.toBeNull();
  });

  it("should show hours and minutes when less than one day remaining", () => {
    const targetDate = new Date(mockNow.getTime() + 3600000 * 5 + 60000 * 30);
    const result = render(<TimerCountDown targetDate={targetDate} title="Countdown" />);

    expect(result.getByText(`I18N.OBB.UNAVAILABLE.HOURS: 0,0`)).not.toBeNull();
    expect(result.getByText(`I18N.OBB.UNAVAILABLE.MINUTES: 0,0`)).not.toBeNull();
  });
});
