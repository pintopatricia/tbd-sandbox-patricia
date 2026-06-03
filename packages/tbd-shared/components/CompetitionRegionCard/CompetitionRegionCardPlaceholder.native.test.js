import { View } from "react-native";
import { render } from "@testing-library/react-native";
import { Placeholder } from "@ppb/the-wall-native";
import CompetitionRegionCardPlaceholder from "./CompetitionRegionCardPlaceholder.native";

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

describe("CompetitionRegionCardPlaceholder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render a view with correct style", () => {
    render(<CompetitionRegionCardPlaceholder />);

    expect(View).toHaveBeenCalledWith(
      {
        style: {
          height: 600,
          width: "100%",
        },
        children: expect.any(Object),
      },
      undefined,
    );

    expect(Placeholder).toHaveBeenCalled();
  });
});
