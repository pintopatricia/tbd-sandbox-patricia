import { View } from "react-native";
import { render } from "@testing-library/react-native";
import { Placeholder } from "@ppb/the-wall-native";
import CouponHeaderCardPlaceholder from "./CouponHeaderCardPlaceholder.native";

jest.mock("react-native", () => {
  const { StyleSheet, Platform } = jest.requireActual("react-native");

  return {
    Platform,
    StyleSheet,
    View: jest.fn((props) => <view-mock {...props} />),
  };
});

jest.mock("@ppb/the-wall-native", () => {
  const { getTestProps } = jest.requireActual("@ppb/the-wall-native/helpers/test-props");
  return {
    getTestProps,
    Placeholder: jest.fn(() => <placeholder-mock />),
  };
});

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {},
}));

describe("CouponHeaderCardPlaceholder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render with correct number of placeholders", () => {
    render(<CouponHeaderCardPlaceholder />);

    expect(View).toHaveBeenCalledTimes(2);

    expect(Placeholder).toHaveBeenCalledTimes(1);
  });
});
