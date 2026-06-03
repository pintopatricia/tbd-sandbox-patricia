import { render } from "@testing-library/react-native";

import { ValueIconName } from "@ppb/the-wall-icons";
import { MarketPromo } from "@ppb/the-wall-native";
import { navigate } from "@ppb/tbd-router/native";
import { DisplayMode } from "@ppb/the-wall-common/types/ViewLink.types";

import MarketBlurb from "./MarketBlurb.native";

jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(),
}));

jest.mock("@ppb/the-wall-native", () => ({
  MarketPromo: jest.fn(({ props }) => <market-promo-mock {...props}></market-promo-mock>),
}));

const dispatchToggleDescriptionBlurbCard = jest.fn();
const dispatchMarketBlurbLinkClick = jest.fn();
const onMarketPromoClickMock = jest.fn();

const setup = (overwriteProps) => {
  const componentProps = {
    title: "Title",
    description: "Description",
    signposting: ValueIconName.NINETY_MINUTE_PAYOUT,
    i18nLabels: {
      viewMore: "View more",
      viewLess: "View less",
      termsConditions: "T&C",
    },
    termsAndConditionsURL: "termsAndConditionsURL",
    variant: "variant",
    dispatchToggleDescriptionBlurbCard,
    dispatchMarketBlurbLinkClick,
    onMarketPromoClick: onMarketPromoClickMock,
    ...overwriteProps,
  };

  return render(<MarketBlurb {...componentProps} />);
};

describe("MarketBlurb", () => {
  beforeEach(jest.clearAllMocks);

  describe("without title and description", () => {
    it("should not render MarketPromo", () => {
      setup({ title: undefined, description: undefined });

      expect(MarketPromo).not.toHaveBeenCalled();
    });
  });

  describe("with only title", () => {
    it("should render MarketPromo", () => {
      setup({ description: undefined });

      expect(MarketPromo).toHaveBeenCalled();
    });
  });

  describe("with only description", () => {
    it("should render MarketPromo", () => {
      setup({ title: undefined });

      expect(MarketPromo).toHaveBeenCalled();
    });
  });

  describe("with title and description", () => {
    it("should render MarketPromo", () => {
      setup();

      expect(MarketPromo).toHaveBeenCalledWith(
        {
          description: "Description",
          linkText: "T&C",
          onLinkClick: expect.any(Function),
          onMarketPromoClick: expect.any(Function),
          signposting: ValueIconName.NINETY_MINUTE_PAYOUT,
          title: "Title",
          variant: "promotion",
          isExpanded: undefined,
        },
        undefined,
      );
    });

    it("should render with isExpanded prop when provided", () => {
      setup({ isExpanded: true });

      expect(MarketPromo).toHaveBeenCalledWith(
        expect.objectContaining({
          isExpanded: true,
        }),
        undefined,
      );
    });
  });

  describe("onMarketPromoClick", () => {
    beforeEach(() => {
      setup();
      MarketPromo.mock.calls[0][0].onMarketPromoClick();
    });

    it("should fire dispatchToggleDescriptionBlurbCard when MarketPromo is clicked", () => {
      expect(dispatchToggleDescriptionBlurbCard).toHaveBeenCalledWith("Title", undefined, "variant");
    });
  });

  describe("onLinkClick", () => {
    beforeEach(() => {
      setup();
      MarketPromo.mock.calls[0][0].onLinkClick();
    });

    it("should call both dispatch actions with correct params", () => {
      expect(dispatchMarketBlurbLinkClick).toHaveBeenCalledWith("termsAndConditionsURL", "Title", "variant");
      expect(navigate).toHaveBeenCalledWith({
        viewUrn: "ppb:tbd:view:external",
        viewUrl: "termsAndConditionsURL",
        viewDisplayMode: DisplayMode.BlankInapp,
      });
    });
  });

  describe("marketPromoVariant", () => {
    it("should render with correct props when provided", () => {
      setup({ marketPromoVariant: "info" });

      expect(MarketPromo).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: "info",
        }),
        undefined,
      );
    });

    it("should render with correct props when not provided", () => {
      setup();

      expect(MarketPromo).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: "promotion",
        }),
        undefined,
      );
    });
  });
});
