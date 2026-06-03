import { View } from "react-native";
import { render } from "@testing-library/react-native";
import HighlightedSelectionCardPlaceholder from "./HighlightedSelectionCardPlaceholder.native";

jest.mock("react-native", () => {
  const { StyleSheet } = jest.requireActual("react-native");

  return {
    StyleSheet,
    View: jest.fn((props) => <view-mock {...props} />),
  };
});

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: { NeutralsBackgroundElevation2: "#232325" },
}));

describe("HighlightedSelectionCardPlaceholder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render a view with correct style", () => {
    render(<HighlightedSelectionCardPlaceholder />);

    expect(View).toHaveBeenCalledWith(
      {
        style: {
          width: "100%",
          backgroundColor: "#232325",
          borderRadius: 4,
          minHeight: 64,
        },
      },
      undefined,
    );
    expect(View).toHaveBeenCalledTimes(1);
  });
});
