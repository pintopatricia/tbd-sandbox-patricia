import { View } from "react-native";
import { render } from "@testing-library/react-native";
import { Placeholder } from "@ppb/the-wall-native";
import FixtureCardPlaceholder from "./FixtureCardPlaceholder.native";

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
  tokens: { EventHeaderPadding: { paddingTop: 8, paddingRight: 8, paddingBottom: 8, paddingLeft: 8 } },
}));

describe("FixturecardPlaceholder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render a view with correct style", () => {
    render(<FixtureCardPlaceholder />);

    expect(View).toHaveBeenCalledWith(
      {
        style: {
          height: 100,
          paddingTop: 8,
          paddingRight: 8,
          paddingBottom: 8,
          paddingLeft: 8,
        },
        children: expect.any(Object),
      },
      undefined,
    );

    expect(Placeholder).toHaveBeenCalled();
  });
});
