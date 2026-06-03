import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { CountdownType } from "./Countdown.types";
import { Countdown } from "./Countdown.web";
import { TEST_ID } from "./Countdown.web.selectors";
import styles from "./Countdown.web.css";

describe("Countdown", () => {
  let countdown;
  const mockText = "foo";

  describe("when component is rendered", () => {
    describe("and the type is default", () => {
      beforeEach(() => {
        const { container } = render(<Countdown text={mockText} />);

        countdown = container.querySelector(TEST_ID);
      });

      it("should render the provided text", () => {
        expect(countdown).toHaveTextContent(mockText);
      });

      it("should have only 'countdown' style", () => {
        expect(countdown).toHaveClass(styles.countdown);
        expect(countdown).not.toHaveClass(styles.alert);
      });
    });

    describe("and the type is alert", () => {
      beforeEach(() => {
        const { container } = render(<Countdown text={mockText} type={CountdownType.ALERT} />);

        countdown = container.querySelector(TEST_ID);
      });

      it("should render the provided text", () => {
        expect(countdown).toHaveTextContent(mockText);
      });

      it("should also have 'alert' style", () => {
        expect(countdown).toHaveClass(styles.countdown);
        expect(countdown).toHaveClass(styles.alert);
      });
    });
  });
});
