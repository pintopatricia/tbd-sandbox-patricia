import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { TabsGroup } from "@ppb/the-wall-web";
import MarketRules from "./MarketRules.web";
import { buildMarketRulesContent } from "./MarketRulesContent/MarketRulesContent.web";

jest.mock("@ppb/the-wall-web", () => ({
  TabsGroup: jest.fn(({ props, children }) => <tabs-mock {...props}>{children}</tabs-mock>),
  FullScreenModal: jest.fn(({ children }) => <full-screen-modal>{children}</full-screen-modal>),
  Link: jest.fn(() => <link-mock></link-mock>),
}));

jest.mock("./MarketRulesContent/MarketRulesContent.web", () => ({
  buildMarketRulesContent: jest.fn().mockReturnValue("marketRulesContent"),
}));

jest.mock("../../../helpers/i18n", () => ({
  i18n: ({ key }) => key,
}));

const marketRulesMock = {
  type: "MARKET_RULES_CARD",
  rules: {
    marketName: "Market Name",
    wallet: "Wallet",
    clarifications: "Clarifications",
    marketBaseRate: "10",
    discountAllowed: true,
    eventStartTime: "2020-01-02T12:15:00Z",
    sections: [
      {
        name: "Title",
        content: "Content",
      },
    ],
    footer: "footer",
  },
};

function renderMarketRules(
  marketRules,
  locale = "locale",
  timezone = "timezone",
  discountRateUrl = "discountRateUrl",
  onDiscountRateLinkClick = () => {},
) {
  return render(
    <MarketRules
      marketRules={marketRules}
      locale={locale}
      timezone={timezone}
      discountRateUrl={discountRateUrl}
      onDiscountRateLinkClick={onDiscountRateLinkClick}
    />,
  );
}

describe("Market Rules component", () => {
  beforeEach(jest.clearAllMocks);
  describe("when marketRules is defined", () => {
    it("should render TabsGroup component", () => {
      renderMarketRules(marketRulesMock);
      expect(TabsGroup).toHaveBeenCalledTimes(1);
      expect(TabsGroup).toHaveBeenCalledWith(
        {
          background: false,
          defaultTab: "exchange",
          label: "Market Rules Tabs",
          onTabSwitch: expect.any(Function),
          contents: "marketRulesContent",
          headers: [
            {
              id: "exchange",
              title: "I18N.EXCHANGE",
            },
          ],
        },
        undefined,
      );
    });

    it("should call buildMarketRulesContent properly", () => {
      renderMarketRules(marketRulesMock);

      expect(buildMarketRulesContent).toHaveBeenCalledTimes(1);
      expect(buildMarketRulesContent).toHaveBeenCalledWith(
        marketRulesMock,
        "locale",
        "timezone",
        "discountRateUrl",
        expect.any(Function),
      );
    });

    describe("when marketRules is not defined", () => {
      it("should not render TabsGroup component", () => {
        renderMarketRules(undefined, true);
        expect(TabsGroup).not.toHaveBeenCalled();
      });
    });
  });
});
