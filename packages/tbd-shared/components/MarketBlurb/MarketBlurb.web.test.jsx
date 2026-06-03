import { render } from "@testing-library/react";

import { MarketPromo } from "@ppb/the-wall-web";

import MarketBlurb from "./MarketBlurb.web";

jest.mock("@ppb/the-wall-web", () => ({
  MarketPromo: jest.fn(({ props }) => <market-promo-mock {...props} />),
}));

const dispatchToggleDescriptionBlurbCard = jest.fn();
const dispatchExternalPushAction = jest.fn();
const dispatchMarketBlurbLinkClick = jest.fn();
const onMarketPromoClickMock = jest.fn();

const setup = (overwriteProps) => {
  const componentProps = {
    title: "Title",
    description: "Description",
    signposting: "NINETY_MINUTE_PAYOUT",
    i18nLabels: {
      termsConditions: "T&C",
    },
    termsAndConditionsURL: "termsAndConditionsURL",
    variant: "variant",
    dispatchToggleDescriptionBlurbCard,
    dispatchExternalPushAction,
    dispatchMarketBlurbLinkClick,
    onMarketPromoClick: onMarketPromoClickMock,
    ...overwriteProps,
  };

  return render(<MarketBlurb {...componentProps} />);
};

describe("MarketBlurb", () => {
  beforeEach(jest.clearAllMocks);

  describe("rendering", () => {
    describe("when missing required props", () => {
      it("should not render when both title and description are missing", () => {
        setup({ title: undefined, description: undefined });
        expect(MarketPromo).not.toHaveBeenCalled();
      });

      it("should render when only title is provided", () => {
        setup({ description: undefined });
        expect(MarketPromo).toHaveBeenCalled();
      });
    });

    describe("market promo", () => {
      it("should render with correct props", () => {
        setup();

        expect(MarketPromo).toHaveBeenCalledWith(
          {
            variant: "promotion",
            title: "Title",
            description: "Description",
            signposting: "NINETY_MINUTE_PAYOUT",
            isExpanded: undefined,
            linkText: "T&C",
            onMarketPromoClick: expect.any(Function),
            onLinkClick: expect.any(Function),
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
  });

  describe("interactions", () => {
    beforeEach(() => {
      setup();
    });
    describe("onMarketPromoClick", () => {
      it("should fire dispatchToggleDescriptionBlurbCard when MarketPromo is clicked", () => {
        MarketPromo.mock.calls[0][0].onMarketPromoClick();

        expect(dispatchToggleDescriptionBlurbCard).toHaveBeenCalledWith("Title", undefined, "variant");
      });
    });

    describe("onLinkClick", () => {
      beforeEach(() => {
        MarketPromo.mock.calls[0][0].onLinkClick();
      });

      it("should call both dispatch actions with correct params", () => {
        expect(dispatchExternalPushAction).toHaveBeenCalledWith("termsAndConditionsURL");
        expect(dispatchMarketBlurbLinkClick).toHaveBeenCalledWith("termsAndConditionsURL", "Title", "variant");
      });
    });
  });

  describe("marketPromoVariant", () => {
    it("should render with correct props", () => {
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
