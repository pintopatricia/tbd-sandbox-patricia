import "jest-dom/extend-expect";
import { cleanup, render } from "@testing-library/react";
import { MarketTemplate } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import SportsbookMarket from "./SportsbookMarket.web";

import CouponTemplate from "./CouponTemplate/CouponTemplate.web";
import DefaultTemplate from "./DefaultTemplate/DefaultTemplate.web";
import InlineTemplate from "./InlineTemplate/InlineTemplate.web";
import OutrightTemplate from "./OutrightTemplate/OutrightTemplate.web";

const dispatchMarketUpdatesSubscribe = jest.fn();
const dispatchMarketUpdatesUnsubscribe = jest.fn();
const dispatchAzSwitchClick = jest.fn();
const onMarketPromoClick = jest.fn();
const onLinkClick = jest.fn();

jest.mock("./CouponTemplate/CouponTemplate.web", () => jest.fn(() => <coupon-template />));
jest.mock("./InlineTemplate/InlineTemplate.web", () => jest.fn(() => <inline-template />));
jest.mock("./DefaultTemplate/DefaultTemplate.web", () => jest.fn(() => <default-template />));
jest.mock("./OutrightTemplate/OutrightTemplate.web", () => jest.fn(() => <outright-template />));
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useId: () => "r:id",
}));

function setup(marketId, overwriteProps) {
  const componentProps = {
    status: "fake",
    runners: [
      { urn: "urn1", name: "runner1", handicapLabel: "runner1HandicapLabel" },
      { urn: "urn2", name: "runner2", handicapLabel: "runner2HandicapLabel" },
    ],
    guaranteedPriceAvailable: true,
    i18n: {
      suspended: "suspended",
      closed: "closed",
      bog: "BOG",
      nonRunnerTitle: "Non Runner",
    },
    eachWayTermsLabel: "terms",
    cardUrn: "cardUrn",
    marketUrn: "marketUrn",
    runnerViewLinks: {
      urn1: { viewUrn: "runnerViewUrn" },
    },
    runnerViewsTitles: {
      urn1: "Runner 1 Title",
    },
    eventViewLink: { viewUrl: "eventViewUrl", viewUrn: "eventViewUrn" },
    isRunnerExpandable: true,
    template: MarketTemplate.Default,
    isItemsListCollapsed: true,
    isShowMoreAvailable: true,
    numberOfItemsToDisplay: 4,
    marketPromo: {
      title: "market title",
      description: "market description",
      signposting: "EXTRA_PLACES",
    },
    infoBlurbs: [{ title: "Info 1", description: "Description 1" }],
    isUppercase: true,
    show90MinBlurb: true,
    dispatchMarketUpdatesSubscribe,
    dispatchMarketUpdatesUnsubscribe,
    dispatchAzSwitchClick,
    onMarketPromoClick,
    onLinkClick,
    ...overwriteProps,
  };

  return render(<SportsbookMarket marketId={marketId} {...componentProps} />);
}

describe("SportsbookMarket", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  describe("initialization", () => {
    it("should render empty component when marketId is missing", () => {
      const component = setup(null);
      expect(component.container.innerHTML).toEqual("");
    });

    describe("COUPON template", () => {
      it("should render CouponTemplate with correct props", () => {
        setup("924.123456789", { template: "COUPON" });

        expect(CouponTemplate).toHaveBeenCalledWith(
          expect.objectContaining({
            cardUrn: "cardUrn",
            marketUrn: "marketUrn",
            onIntersectCallback: expect.any(Function),
            runners: [
              { handicapLabel: "runner1HandicapLabel", name: "runner1", urn: "urn1" },
              { handicapLabel: "runner2HandicapLabel", name: "runner2", urn: "urn2" },
            ],
            status: "fake",
          }),
          undefined,
        );
      });
    });

    describe("DEFAULT template", () => {
      it("should render DefaultTemplate with correct props", () => {
        setup("924.123456789", { template: MarketTemplate.Default });

        expect(DefaultTemplate).toHaveBeenCalledWith(
          expect.objectContaining({
            cardUrn: "cardUrn",
            marketUrn: "marketUrn",
            onIntersectCallback: expect.any(Function),
            runners: [
              { urn: "urn1", name: "runner1", handicapLabel: "runner1HandicapLabel" },
              { urn: "urn2", name: "runner2", handicapLabel: "runner2HandicapLabel" },
            ],
            status: "fake",
            guaranteedPriceAvailable: true,
            i18n: {
              suspended: "suspended",
              closed: "closed",
              bog: "BOG",
              nonRunnerTitle: "Non Runner",
            },
            eventViewLink: { viewUrl: "eventViewUrl", viewUrn: "eventViewUrn" },
            isRunnerExpandable: true,
            marketPromo: {
              title: "market title",
              description: "market description",
              signposting: "EXTRA_PLACES",
            },
            infoBlurbs: [
              {
                title: "Info 1",
                description: "Description 1",
              },
            ],
            runnerViewLinks: {
              urn1: { viewUrn: "runnerViewUrn" },
            },
            runnerViewsTitles: {
              urn1: "Runner 1 Title",
            },
            onMarketPromoClick: expect.any(Function),
            onLinkClick: expect.any(Function),
          }),
          undefined,
        );

        const { onMarketPromoClick: passedPromoClick, onLinkClick: passedLinkClick } = DefaultTemplate.mock.calls[0][0];
        expect(passedPromoClick).toBe(onMarketPromoClick);
        expect(passedLinkClick).toBe(onLinkClick);
      });

      it("should not include eachWayTerms in infoBlurbs when eachWayTermsLabel is missing", () => {
        setup("924.123456789", {
          template: MarketTemplate.Default,
          eachWayTermsLabel: undefined,
        });

        expect(DefaultTemplate).toHaveBeenCalledWith(
          expect.objectContaining({
            infoBlurbs: [{ title: "Info 1", description: "Description 1" }],
          }),
          undefined,
        );
      });
    });

    describe("INLINE template", () => {
      it("should render InlineTemplate with correct props", () => {
        setup("924.123456789", { template: MarketTemplate.Inline });

        expect(InlineTemplate).toHaveBeenCalledWith(
          expect.objectContaining({
            cardUrn: "cardUrn",
            marketUrn: "marketUrn",
            onIntersectCallback: expect.any(Function),
            runners: expect.any(Array),
            status: "fake",
            isUppercase: true,
            show90MinBlurb: true,
            marketPromo: expect.any(Object),
            infoBlurbs: expect.any(Array),
            onMarketPromoClick,
            onLinkClick,
          }),
          undefined,
        );
      });
    });

    describe("OUTRIGHT template", () => {
      it("should render OutrightTemplate with correct props", () => {
        setup("924.123456789", { template: MarketTemplate.Outright });

        expect(OutrightTemplate).toHaveBeenCalledWith(
          expect.objectContaining({
            cardUrn: "cardUrn",
            marketUrn: "marketUrn",
            runners: expect.any(Array),
            onIntersectCallback: expect.any(Function),
            i18n: expect.any(Object),
            numberOfItemsToDisplay: 4,
            isItemsListCollapsed: true,
            isShowMoreAvailable: true,
            dispatchAzSwitchClick,
          }),
          undefined,
        );
      });
    });
  });

  describe("market updates subscription", () => {
    it("should subscribe when component intersects", () => {
      setup("924.123456789");
      const { onIntersectCallback } = DefaultTemplate.mock.calls[0][0];

      onIntersectCallback(true);
      expect(dispatchMarketUpdatesSubscribe).toHaveBeenCalledWith("924.123456789", "r:id");
    });

    it("should unsubscribe when component stops intersecting", () => {
      setup("924.123456789");
      const { onIntersectCallback } = DefaultTemplate.mock.calls[0][0];

      onIntersectCallback(false);
      expect(dispatchMarketUpdatesUnsubscribe).toHaveBeenCalledWith("924.123456789", "r:id");
    });

    it("should not subscribe/unsubscribe when marketId is missing", () => {
      setup(null);

      expect(DefaultTemplate).not.toHaveBeenCalled();
      expect(dispatchMarketUpdatesSubscribe).not.toHaveBeenCalled();
      expect(dispatchMarketUpdatesUnsubscribe).not.toHaveBeenCalled();
    });
  });
});
