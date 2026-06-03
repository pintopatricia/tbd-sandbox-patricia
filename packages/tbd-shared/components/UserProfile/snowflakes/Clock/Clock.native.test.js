import { act, cleanup, render } from "@testing-library/react-native";

import { Clock } from "./Clock.native";
import { CLOCK, CLOCK_TEXT } from "./Clock.native.selectors";

const TIME_ZONE_MOCK = "Europe/London";

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

const renderClock = (timeZone = TIME_ZONE_MOCK) => render(<Clock timeZone={timeZone} />);

describe("Clock", () => {
  let clockItem;
  let clockText;
  beforeEach(jest.clearAllMocks);
  afterEach(cleanup);

  it("should render the clock and text container", () => {
    const { queryByTestId } = renderClock();
    clockItem = queryByTestId(CLOCK);
    clockText = queryByTestId(CLOCK_TEXT);

    expect(clockItem).not.toBeNull();
    expect(clockText).not.toBeNull();
  });

  describe("when the time is updated", () => {
    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(new Date("2023-05-08T14:30:00.000Z"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should render the clock item with the correct time", async () => {
      const { queryByTestId } = renderClock();
      clockText = queryByTestId(CLOCK_TEXT);

      expect(clockText).toHaveTextContent("15:30");

      await act(async () => {
        jest.advanceTimersByTime(60000);
      });

      expect(clockText).toHaveTextContent("15:31");
    });
  });
});
