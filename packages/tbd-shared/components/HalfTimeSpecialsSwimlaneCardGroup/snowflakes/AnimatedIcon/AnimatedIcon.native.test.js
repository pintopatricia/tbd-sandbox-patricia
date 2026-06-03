import { render } from "@testing-library/react-native";
import AnimatedIcon from "./AnimatedIcon.native";
import { ANIMATED_ICON_CONTAINER, ANIMATED_ICON_TEXT } from "./AnimatedIcon.native.selectors";
import styles from "./AnimatedIcon.native.styles";

jest.mock("react-native-reanimated", () => require("react-native-reanimated/mock"));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

describe("AnimatedIcon Component", () => {
  it("should render the container with the correct test ID", () => {
    const { queryByTestId } = render(<AnimatedIcon />);
    const container = queryByTestId(ANIMATED_ICON_CONTAINER);
    expect(container).toHaveStyle(styles.iconContainer);
  });

  it("should render the text element with the correct test ID and content", () => {
    const { queryByTestId } = render(<AnimatedIcon />);
    const text = queryByTestId(ANIMATED_ICON_TEXT);
    expect(text).toHaveStyle(styles.iconText);
    expect(text).toHaveTextContent("NEW");
  });
});
