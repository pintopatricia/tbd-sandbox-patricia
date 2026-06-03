import { act, render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { Clock } from "./Clock.web";
import { TEST_ID, CLOCK_TEXT } from "./Clock.web.selectors";

const TIME_ZONE_MOCK = "Europe/London";

const setup = (timeZone = TIME_ZONE_MOCK) => render(<Clock timeZone={timeZone} />);

describe("Clock", () => {
  let clockItem;
  let clockText;
  beforeEach(jest.clearAllMocks);

  it("should render the clock and text container", () => {
    const { container } = setup();
    clockItem = container.querySelector(TEST_ID);
    clockText = container.querySelector(CLOCK_TEXT);

    expect(clockItem).not.toBe(null);
    expect(clockText).not.toBe(null);
  });

  describe("when the date is updated", () => {
    beforeAll(() => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(new Date(2020, 3, 1, 10, 30));
    });

    it("should render the clock item with the correct date", () => {
      const { container } = setup();
      clockText = container.querySelector(CLOCK_TEXT);

      expect(clockText).toHaveTextContent("30");

      act(() => {
        jest.advanceTimersByTime(60000);
      });

      expect(clockText).toHaveTextContent("31");
    });
  });
});
