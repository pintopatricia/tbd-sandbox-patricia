import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { CounterColor } from "@ppb/the-wall-common/types";

import { Counter } from "@ppb/the-wall-web";
import { Minimized } from "./Minimized.web";
import { TEST_ID } from "./Minimized.web.selectors";
import styles from "./Minimized.web.css";

function setup({ title = "whatever", counter, color = CounterColor.Black } = {}) {
  return render(
    <Minimized counter={counter} color={color}>
      {title}
    </Minimized>,
  );
}

jest.mock("@ppb/the-wall-web", () => ({
  Counter: jest.fn(() => <counter-mock />),
}));

describe("MinimizedBetslip", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should render with container classes", () => {
    const { container } = setup();
    const minimizedEl = container.querySelector(TEST_ID);

    expect(minimizedEl).toHaveClass(styles.titleContainer);
  });

  describe("children", () => {
    it("should render children passed", () => {
      const title = "TITLE";
      const { queryByText } = setup({ title });

      const titleElem = queryByText(title);

      expect(titleElem).not.toBeNull();
    });

    it("should render with title class", () => {
      const title = "TITLE";
      const { queryByText } = setup({ title });

      const titleElem = queryByText(title);

      expect(titleElem).toHaveClass(styles.title);
    });
  });

  describe("counter", () => {
    it("should call Counter with the indicated counter value", () => {
      setup({ counter: 3 });

      expect(Counter).toHaveBeenCalledWith({ color: CounterColor.Black, value: 3 }, undefined);
    });
  });

  describe("color", () => {
    describe("when there is a color indicated", () => {
      it("should call Counter with the indicated color", () => {
        setup({ counter: 3, color: CounterColor.BlackAlternative });

        expect(Counter).toHaveBeenCalledWith({ color: CounterColor.BlackAlternative, value: 3 }, undefined);
      });
    });
  });
});
