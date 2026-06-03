import { View } from "react-native";
import { render } from "@testing-library/react-native";
import { Placeholder } from "@ppb/the-wall-native";
import RaceByTimeRangeCardPlaceholder from "./RaceByTimeRangeCardPlaceholder.native";

jest.mock("react-native", () => {
  const { StyleSheet } = jest.requireActual("react-native");

  return {
    StyleSheet,
    View: jest.fn((props) => <view-mock {...props} />),
  };
});

jest.mock("@ppb/the-wall-native", () => ({
  Placeholder: jest.fn(() => <placeholder-mock />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {},
}));

describe("RaceByTimeRangeCardPlaceholder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render a view with correct style", () => {
    render(<RaceByTimeRangeCardPlaceholder />);

    expect(View).toHaveBeenCalledWith(
      {
        style: {
          height: 54,
          width: 64,
        },
        children: expect.any(Object),
      },
      undefined,
    );

    expect(Placeholder).toHaveBeenCalled();
  });
});
