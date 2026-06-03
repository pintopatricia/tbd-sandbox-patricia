import { View } from "react-native";
import { render } from "@testing-library/react-native";
import { Placeholder } from "@ppb/the-wall-native";
import CompetitionViewLinkCardPlaceholder from "./CompetitionViewLinkCardPlaceholder.native";

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
  spacings: {
    "spacing-2": 16,
  },
}));

describe("CompetitionViewLinkCardPlaceholder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render a view with correct style", () => {
    render(<CompetitionViewLinkCardPlaceholder />);

    expect(View).toHaveBeenCalledWith(
      {
        style: {
          height: 68,
          width: 88,
          padding: 16,
        },
        children: expect.any(Object),
      },
      undefined,
    );

    expect(Placeholder).toHaveBeenCalled();
  });
});
