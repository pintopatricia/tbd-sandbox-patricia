import { render } from "@testing-library/react-native";
import { Placeholder } from "@ppb/the-wall-native";

import { GenericViewPlaceholder } from "./GenericViewPlaceholder.native";

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
    "spacing-3": 10,
  },
}));

describe("GenericViewPlaceholder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the correct number of placeholders for the generic view", () => {
    render(<GenericViewPlaceholder />);

    expect(Placeholder).toHaveBeenCalledTimes(2);
  });

  it("should render the correct number of placeholders for the home view", () => {
    render(<GenericViewPlaceholder urn="ppb:tbd:view:generic:home" />);

    expect(Placeholder).toHaveBeenCalledTimes(3);
  });
});
