import { View } from "react-native";
import { render } from "@testing-library/react-native";
import { Placeholder } from "@ppb/the-wall-native";
import RaceMarketCardPlaceholder from "./RaceMarketCardPlaceholder.native";

jest.mock("@ppb/the-wall-native", () => ({
  Placeholder: jest.fn(() => <placeholder-mock />),
}));
jest.mock("react-native", () => {
  const { StyleSheet } = jest.requireActual("react-native");

  return {
    StyleSheet,
    View: jest.fn((props) => <view-mock {...props} />),
  };
});

describe("RaceMarketCardPlaceholder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render a view with correct style", () => {
    render(<RaceMarketCardPlaceholder />);

    expect(View).toHaveBeenCalledWith(
      {
        style: {
          height: 300,
        },
        children: expect.any(Object),
      },
      undefined,
    );

    expect(Placeholder).toHaveBeenCalled();
  });
});
