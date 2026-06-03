import { render, act } from "@testing-library/react-native";
import SportsbookMarket from "./SportsbookMarket.native";

import CouponTemplate from "./CouponTemplate/CouponTemplate.native";
import DefaultTemplate from "./DefaultTemplate/DefaultTemplate.native";
import InlineTemplate from "./InlineTemplate/InlineTemplate.native";
import OutrightTemplate from "./OutrightTemplate/OutrightTemplate.native";

const dispatchMarketUpdatesSubscribe = jest.fn();
const dispatchMarketUpdatesUnsubscribe = jest.fn();
const dispatchAzSwitchClick = jest.fn();
const onMarketPromoClick = jest.fn();

jest.mock("./CouponTemplate/CouponTemplate.native", () => jest.fn(() => <coupon-template />));
jest.mock("./InlineTemplate/InlineTemplate.native", () => jest.fn(() => <inline-template />));
jest.mock("./DefaultTemplate/DefaultTemplate.native", () => jest.fn(() => <default-template />));
jest.mock("./OutrightTemplate/OutrightTemplate.native", () => jest.fn(() => <outright-template />));
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
    isRaceMarket: false,
    cardUrn: "cardUrn",
    marketName: "marketName",
    marketUrn: "marketUrn",
    runnerViewLinks: {
      urn1: { viewUrn: "runnerViewUrn" },
    },
    eventViewLink: { viewUrl: "eventViewUrl", viewUrn: "eventViewUrn" },
    isRunnerExpandable: true,
    template: "DEFAULT",
    isItemsListCollapsed: true,
    isShowMoreAvailable: true,
    numberOfItemsToDisplay: 4,
    show90MinBlurb: true,
    visible: false,
    dispatchMarketUpdatesSubscribe,
    dispatchMarketUpdatesUnsubscribe,
    dispatchAzSwitchClick,
    onMarketPromoClick,
    infoBlurbs: undefined,
    marketPromo: undefined,
    onLinkClick: undefined,
    ...overwriteProps,
  };

  return render(<SportsbookMarket marketId={marketId} {...componentProps} />);
}

describe("Connected sportsbook market", () => {
  afterEach(jest.clearAllMocks);

  describe("when the card is not visible", () => {
    it("should call dispatchMarketUpdatesUnsubscribe on mount", () => {
      setup("924.123456789", { visible: false });

      expect(dispatchMarketUpdatesUnsubscribe).toHaveBeenCalledWith("924.123456789", "r:id");
    });

    it("should call dispatchMarketUpdatesUnsubscribe on unmount", () => {
      const { unmount } = setup("924.123456789");

      act(() => {
        unmount();
      });

      expect(dispatchMarketUpdatesUnsubscribe).toHaveBeenCalledWith("924.123456789", "r:id");
    });
  });

  describe("when the card is visible", () => {
    it("should call dispatchMarketUpdatesSubscribe on mount", () => {
      setup("924.123456789", { visible: true });

      expect(dispatchMarketUpdatesSubscribe).toHaveBeenCalledWith("924.123456789", "r:id");
    });
  });

  describe("when initializing without a marketId", () => {
    it("should not call any template", () => {
      setup("924.123456789", { marketId: null });

      expect(CouponTemplate).not.toHaveBeenCalled();
      expect(DefaultTemplate).not.toHaveBeenCalled();
      expect(InlineTemplate).not.toHaveBeenCalled();
      expect(OutrightTemplate).not.toHaveBeenCalled();
    });

    it("should not call dispatchMarketUpdatesSubscribe on mount", () => {
      setup(undefined);

      expect(dispatchMarketUpdatesSubscribe).not.toHaveBeenCalled();
    });

    it("should not call dispatchMarketUpdatesUnsubscribe on unmount", () => {
      const { unmount } = setup(undefined);

      act(() => {
        unmount();
      });

      expect(dispatchMarketUpdatesUnsubscribe).not.toHaveBeenCalled();
    });
  });

  describe("when initializing COUPON template", () => {
    it("should render CouponTemplate", () => {
      setup("924.123456789", { template: "COUPON" });

      expect(CouponTemplate).toHaveBeenCalledWith(
        {
          cardUrn: "cardUrn",
          marketUrn: "marketUrn",
          runners: [
            { handicapLabel: "runner1HandicapLabel", name: "runner1", urn: "urn1" },
            { handicapLabel: "runner2HandicapLabel", name: "runner2", urn: "urn2" },
          ],
          status: "fake",
        },
        undefined,
      );
    });
  });

  describe("when initializing DEFAULT template", () => {
    it("should render DefaultTemplate with blurb props", () => {
      const infoBlurbs = [{ id: 1, text: "Info blurb" }];
      const marketPromo = { id: 1, text: "Market promo" };

      setup("924.123456789", {
        template: "DEFAULT",
        infoBlurbs,
        marketPromo,
        onMarketPromoClick,
        onLinkClick: jest.fn(),
      });

      expect(DefaultTemplate).toHaveBeenCalledWith(
        {
          cardUrn: "cardUrn",
          eachWayTermsLabel: "terms",
          eventViewLink: {
            viewUrl: "eventViewUrl",
            viewUrn: "eventViewUrn",
          },
          guaranteedPriceAvailable: true,
          i18n: {
            bog: "BOG",
            closed: "closed",
            nonRunnerTitle: "Non Runner",
            suspended: "suspended",
          },
          infoBlurbs: [{ id: 1, text: "Info blurb" }],
          isRunnerExpandable: true,
          marketPromo: { id: 1, text: "Market promo" },
          marketUrn: "marketUrn",
          onLinkClick: expect.any(Function),
          onMarketPromoClick: expect.any(Function),
          runnerViewLinks: {
            urn1: { viewUrn: "runnerViewUrn" },
          },
          runners: [
            { handicapLabel: "runner1HandicapLabel", name: "runner1", urn: "urn1" },
            { handicapLabel: "runner2HandicapLabel", name: "runner2", urn: "urn2" },
          ],
          status: "fake",
        },
        undefined,
      );
    });
  });

  describe("when initializing INLINE template", () => {
    it("should render InlineTemplate", () => {
      setup("924.123456789", {
        template: "INLINE",
        runners: [
          { handicapLabel: "runner1HandicapLabel", name: "runner1", urn: "urn1" },
          { handicapLabel: "runner2HandicapLabel", name: "runner2", urn: "urn2" },
          { handicapLabel: "runner3HandicapLabel", name: "runner3", urn: "urn3" },
        ],
      });

      expect(InlineTemplate).toHaveBeenCalledWith(
        {
          cardUrn: "cardUrn",
          marketUrn: "marketUrn",
          runners: [
            { handicapLabel: "runner1HandicapLabel", name: "runner1", urn: "urn1" },
            { handicapLabel: "runner2HandicapLabel", name: "runner2", urn: "urn2" },
            { handicapLabel: "runner3HandicapLabel", name: "runner3", urn: "urn3" },
          ],
          status: "fake",
          show90MinBlurb: true,
          infoBlurbs: undefined,
          onMarketPromoClick: expect.any(Function),
          onLinkClick: undefined,
          isUppercase: undefined,
        },
        undefined,
      );
    });
  });

  describe("when initializing OUTRIGHT template", () => {
    it("should render OutrightTemplate", () => {
      const infoBlurbs = [{ id: 1, text: "Info blurb" }];
      const marketPromo = { id: 1, text: "Market promo" };

      setup("924.123456789", {
        template: "OUTRIGHT",
        infoBlurbs,
        marketPromo,
        onMarketPromoClick,
        onLinkClick: jest.fn(),
      });

      expect(OutrightTemplate).toHaveBeenCalledWith(
        {
          cardUrn: "cardUrn",
          marketUrn: "marketUrn",
          eachWayTermsLabel: "terms",
          i18n: {
            bog: "BOG",
            closed: "closed",
            nonRunnerTitle: "Non Runner",
            suspended: "suspended",
          },
          runners: [
            {
              handicapLabel: "runner1HandicapLabel",
              name: "runner1",
              urn: "urn1",
            },
            {
              handicapLabel: "runner2HandicapLabel",
              name: "runner2",
              urn: "urn2",
            },
          ],
          numberOfItemsToDisplay: 4,
          isItemsListCollapsed: true,
          isShowMoreAvailable: true,
          dispatchAzSwitchClick,
          infoBlurbs,
          marketPromo,
          onMarketPromoClick: expect.any(Function),
          onLinkClick: expect.any(Function),
        },
        undefined,
      );
    });
  });
});
