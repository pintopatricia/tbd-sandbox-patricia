import { render } from "@testing-library/react-native";
import { Placeholder } from "@ppb/the-wall-native";
import SportViewLinkCardPlaceholder from "./SportViewLinkCardPlaceholder.native";

jest.mock("react-native", () => {
  const { StyleSheet } = jest.requireActual("react-native");

  return {
    StyleSheet,
    View: jest.fn(({ props, children }) => <view-mock {...props}>{children}</view-mock>),
  };
});

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  spacings: { "spacing-1": 4 },
  colors: { NeutralsBackgroundElevation2: "#232325" },
}));

jest.mock("@ppb/the-wall-native", () => ({
  Placeholder: jest.fn(() => <placeholder-mock />),
}));

describe("SportViewLinkCardPlaceholder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render a view with correct style", () => {
    render(<SportViewLinkCardPlaceholder />);

    expect(Placeholder).toHaveBeenCalledWith(
      {
        style: {
          width: 94,
          height: 52,
          marginHorizontal: 6,

          borderRadius: 4,
        },
      },
      undefined,
    );
    expect(Placeholder).toHaveBeenCalledTimes(1);
  });
});
