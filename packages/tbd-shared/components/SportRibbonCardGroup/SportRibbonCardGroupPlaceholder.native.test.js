import { View } from "react-native";
import { render } from "@testing-library/react-native";
import { Placeholder } from "@ppb/the-wall-native";
import SportRibbonCardGroupPlaceholder from "./SportRibbonCardGroupPlaceholder.native";

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
  tokens: {
    SportsRibbonPlaceholderHeightSizing: 10,
    SportsRibbonPlaceholderHorizontalGap: { gap: 2 },
  },
}));

describe("SportRibbonCardGroupPlaceholder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render a view with correct number of placeholders", () => {
    render(<SportRibbonCardGroupPlaceholder />);
    expect(View).toHaveBeenCalledTimes(7);

    expect(Placeholder).toHaveBeenCalledTimes(6);
  });
});
