import { render } from "@testing-library/react-native";
import { TabsGroup } from "@ppb/the-wall-native";
import { MarketRules } from "./MarketRules.native";
import { buildMarketRulesContent } from "./MarketRulesContent/MarketRulesContent.native";

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  spacings: {},
  typography: {},
}));

jest.mock("@ppb/the-wall-native", () => ({
  TabsGroup: jest.fn(({ props, children }) => <tabs {...props}>{children}</tabs>),
}));

jest.mock("./MarketRulesContent/MarketRulesContent.native", () => ({
  buildMarketRulesContent: jest.fn().mockReturnValue("marketRulesContent"),
}));

jest.mock("../../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

jest.mock("@ppb/tbd-router/native", () => ({
  goBack: jest.fn(() => {}),
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

function renderMarketRules({
  marketRules = undefined,
  locale = "locale",
  timezone = "timezone",
  discountRateUrl = "discountRateUrl",
  onDiscountRateLinkPress = () => {},
} = {}) {
  return render(
    <MarketRules
      marketRules={marketRules}
      locale={locale}
      timezone={timezone}
      discountRateUrl={discountRateUrl}
      onDiscountRateLinkPress={onDiscountRateLinkPress}
    />,
  );
}

describe("Market Rules component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when marketRules are not defined", () => {
    it("should not render TabsGroup component", () => {
      renderMarketRules();
      expect(TabsGroup).not.toHaveBeenCalled();
    });
  });

  describe("when marketRules are defined", () => {
    it("should render TabsGroup component", () => {
      renderMarketRules({ marketRules: marketRulesMock });

      expect(TabsGroup).toHaveBeenCalledTimes(1);
      expect(TabsGroup).toHaveBeenCalledWith(
        {
          background: false,
          defaultTab: "exchange",
          label: "Market Rules Tabs",
          onTabSwitch: expect.any(Function),
          headers: [
            {
              id: "exchange",
              title: "I18N.EXCHANGE",
            },
          ],
          contents: "marketRulesContent",
          shouldShowIndicator: true,
        },
        undefined,
      );
    });

    it("should call buildMarketRulesContent properly", () => {
      renderMarketRules({
        marketRules: marketRulesMock,
        onDiscountRateLinkPress: jest.fn(),
      });

      expect(buildMarketRulesContent).toHaveBeenCalledTimes(1);
      expect(buildMarketRulesContent).toHaveBeenCalledWith(
        marketRulesMock,
        "locale",
        "timezone",
        "discountRateUrl",
        expect.any(Function),
      );
    });
  });
});
