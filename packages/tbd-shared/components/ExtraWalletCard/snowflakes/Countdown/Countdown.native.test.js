import { render } from "@testing-library/react-native";
import { CountdownType } from "./Countdown.types";
import { Countdown } from "./Countdown.native";
import { COUNTDOWN } from "./Countdown.native.selectors";
import styles from "./Countdown.native.styles";

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  typography: {},
  spacings: {},
  tokens: {
    CountdownContentTextDefaultColour: "#1312",
    CountdownContentTextAlertColour: "#1213",
  },
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

const mockText = "foo";

describe("Countdown", () => {
  let countdown;

  describe("when component is rendered", () => {
    describe("and the type is default", () => {
      beforeEach(() => {
        const { queryByTestId } = render(<Countdown text={mockText} />);

        countdown = queryByTestId(COUNTDOWN);
      });

      it("should render the provided text", () => {
        expect(countdown).toHaveTextContent(mockText);
      });

      it("should have only 'countdown' style", () => {
        expect(countdown).toHaveStyle(styles.countdown);
        expect(countdown).not.toHaveStyle(styles.alert);
      });
    });

    describe("and the type is alert", () => {
      beforeEach(() => {
        const { queryByTestId } = render(<Countdown text={mockText} type={CountdownType.ALERT} />);

        countdown = queryByTestId(COUNTDOWN);
      });

      it("should render the provided text", () => {
        expect(countdown).toHaveTextContent(mockText);
      });

      it("should have only 'countdown' style", () => {
        expect(countdown).toHaveStyle(styles.alert);
      });
    });
  });
});
