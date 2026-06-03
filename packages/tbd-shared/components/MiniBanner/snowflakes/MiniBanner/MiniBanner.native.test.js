import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { SystemIconName } from "@ppb/the-wall-icons";

import { BANNER, LEFT_ICON, RIGHT_CHEVRON, SUB_TEXT, TEST_ID } from "./MiniBanner.native.selectors";
import { MiniBanner } from "./MiniBanner.native";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => {
  const ReactNative = jest.requireActual("react-native");
  return {
    GenericIcon: ({ name }) => (
      <ReactNative.View accessibilityLabel={String(name)} testID={`mini-banner-icon-${String(name)}`} />
    ),
  };
});

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {
    PromoBannerVerticalGapPrimary: { gap: 4 },
    SmSpacingXSmall: 8,
    SmSpacingXxxSmall: 4,
    SmBorderRadiusDefault: { borderRadius: 4 },
    SmDropShadowSmall: {
      shadowColor: "#18181a",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    SmColoursSurfaceStaticBrandPrimaryBase: "#default",
    MiniBannerDefaultTitleColour: "#text-default",
    MiniBannerDefaultIconColour: "#icon-default",
    SmBodyMediumBrand: {
      fontFamily: "Arial",
      fontWeight: "700",
      fontSize: 13,
      lineHeight: 16,
      letterSpacing: 0,
      textTransform: "uppercase",
      textDecorationLine: "none",
    },
    SmBodySmallStrong: {
      fontFamily: "Arial",
      fontWeight: "700",
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0,
      textTransform: "none",
      textDecorationLine: "none",
    },
    SmCaptionMediumBase: {
      fontFamily: "Arial",
      fontWeight: "400",
      fontSize: 10,
      lineHeight: 16,
      letterSpacing: 0,
      textTransform: "none",
      textDecorationLine: "none",
    },
  },
}));

const mockProps = {
  brandTitle: "Brand title",
  title: "Banner title",
  subText: "Banner sub text",
  onMiniBannerTap: jest.fn(),
};

describe("MiniBanner", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders text and fixed icons", () => {
    const { getByText, getByTestId } = render(<MiniBanner {...mockProps} />);

    expect(getByText("Brand title")).toBeDefined();
    expect(getByText("Banner title")).toBeDefined();
    expect(getByText("Banner sub text")).toBeDefined();
    expect(getByTestId(`mini-banner-icon-${SystemIconName.NOTIFICATION_INFO}`)).toBeDefined();
    expect(getByTestId(`mini-banner-icon-${SystemIconName.CHEVRON_RIGHT}`)).toBeDefined();
    expect(getByTestId(LEFT_ICON)).toBeDefined();
    expect(getByTestId(RIGHT_CHEVRON)).toBeDefined();
  });

  it("renders only subText when other lines are omitted", () => {
    const { getByText, queryByText } = render(<MiniBanner subText="Only sub text" />);

    expect(getByText("Only sub text")).toBeDefined();
    expect(queryByText("Brand title")).toBeNull();
    expect(queryByText("Banner title")).toBeNull();
  });

  it("uses default background colour on the banner", () => {
    const { getByTestId } = render(<MiniBanner {...mockProps} />);
    const style = getByTestId(BANNER).props.style;
    const flattened = Array.isArray(style) ? Object.assign({}, ...style) : style;
    expect(flattened.backgroundColor).toBe("#default");
  });

  it("calls onMiniBannerTap when the banner is pressed", () => {
    const { getByTestId } = render(<MiniBanner {...mockProps} />);
    fireEvent.press(getByTestId(BANNER));
    expect(mockProps.onMiniBannerTap).toHaveBeenCalledTimes(1);
  });

  it("works without onMiniBannerTap callback", () => {
    const { getByTestId } = render(<MiniBanner brandTitle="A" subText="B" onMiniBannerTap={undefined} />);
    expect(() => fireEvent.press(getByTestId(BANNER))).not.toThrow();
  });

  it("renders the outer container with the expected test id", () => {
    const { getByTestId } = render(<MiniBanner {...mockProps} />);
    expect(getByTestId(TEST_ID)).toBeDefined();
  });

  it("omits sub text row when subText is not provided", () => {
    const { queryByTestId, getByText } = render(<MiniBanner brandTitle="A" title="B" />);
    expect(getByText("A")).toBeDefined();
    expect(getByText("B")).toBeDefined();
    expect(queryByTestId(SUB_TEXT)).toBeNull();
  });
});
