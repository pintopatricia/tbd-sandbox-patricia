import { View } from "react-native";
import { render } from "@testing-library/react-native";
import DefaultPlaceholder from "./DefaultPlaceholder.native";

jest.mock("react-native", () => {
  const { StyleSheet } = jest.requireActual("react-native");

  return {
    StyleSheet,
    View: jest.fn((props) => <view-mock {...props} />),
  };
});

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: { PlaceholderBackgroundColour: "#232325" },
}));

describe("DefaultPlaceholder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render a view with correct style", () => {
    render(<DefaultPlaceholder />);

    expect(View).toHaveBeenCalledWith(
      {
        style: {
          width: "100%",
          height: 200,

          backgroundColor: "#232325",
          borderRadius: 4,
        },
      },
      undefined,
    );
    expect(View).toHaveBeenCalledTimes(1);
  });
});
