import { render } from "@testing-library/react-native";
import { DisplayMode } from "@ppb/tbd-store/state/layout/views/ViewLink.types";
import { navigate } from "@ppb/tbd-router/native";
import MarketRulesCard from "./MarketRulesCard.native";
import { MarketRules } from "./MarketRules/MarketRules.native";

jest.mock("./MarketRules/MarketRules.native", () => ({
  MarketRules: jest.fn((props) => <market-rules-component {...props} />),
}));

jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(() => {}),
  DisplayModeTypes: { InApp: "InApp" },
}));

function renderMarketRules({
  marketRules,
  localeCodeBcp47 = "locale",
  timezone = "timezone",
  discountRateUrl = "discountRateUrl",
  dispatchNavigateToDiscountRateExplainedAction,
}) {
  return render(
    <MarketRulesCard
      marketRules={marketRules}
      localeCodeBcp47={localeCodeBcp47}
      timezone={timezone}
      discountRateUrl={discountRateUrl}
      dispatchNavigateToDiscountRateExplainedAction={dispatchNavigateToDiscountRateExplainedAction}
    />,
  );
}

describe("MarketRulesCard.native", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the MarketRules component", () => {
    renderMarketRules({
      marketRules: { theMarketRules: {} },
      dispatchNavigateToDiscountRateExplainedAction: jest.fn(),
    });

    expect(MarketRules).toHaveBeenCalledWith(
      {
        marketRules: { theMarketRules: {} },
        onDiscountRateLinkPress: expect.any(Function),
        locale: "locale",
        timezone: "timezone",
        discountRateUrl: "discountRateUrl",
      },
      undefined,
    );
    expect(MarketRules).toHaveBeenCalledTimes(1);
  });

  describe("when handleDiscountRateLinkPress is called", () => {
    let dispatchNavigateToDiscountRateExplainedActionSpy;

    beforeEach(() => {
      dispatchNavigateToDiscountRateExplainedActionSpy = jest.fn();
      renderMarketRules({
        dispatchNavigateToDiscountRateExplainedAction: dispatchNavigateToDiscountRateExplainedActionSpy,
      });

      MarketRules.mock.calls[0][0].onDiscountRateLinkPress("text", "href");
    });

    it("should dispatch navigate to discount rate explained action", () => {
      expect(dispatchNavigateToDiscountRateExplainedActionSpy).toHaveBeenCalledWith("text", "href");
      expect(dispatchNavigateToDiscountRateExplainedActionSpy).toHaveBeenCalledTimes(1);
    });

    it("should call navigate", () => {
      expect(navigate).toHaveBeenCalledWith({
        viewUrn: "ppb:tbd:view:external",
        viewUrl: "http:href",
        viewDisplayMode: DisplayMode.BlankInapp,
      });
    });
  });
});
