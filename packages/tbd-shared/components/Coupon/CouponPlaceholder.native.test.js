import { View } from "react-native";
import { render } from "@testing-library/react-native";
import { Placeholder } from "@ppb/the-wall-native";
import CouponPlaceholder from "./CouponPlaceholder.native";

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
  tokens: {
    CouponSupportingContentButtonBorderRadius: {},
    CouponPadding: { paddingTop: 12, paddingBottom: 12, paddingLeft: 0, paddingRight: 12 },
    CouponHorizontalGapPrimary: { gap: 8 },
    StatsBackgroundColour: "#FCFCFC",
    NeutralsBorderElevation1: "#E0E0E0",
  },
  spacings: {
    "spacing-half": 4,
  },
  heights: {},
}));

describe("CouponPlaceholder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render with correct number of placeholders", () => {
    render(<CouponPlaceholder />);

    expect(View).toHaveBeenCalledTimes(9);

    expect(Placeholder).toHaveBeenCalledTimes(6);
  });
});
