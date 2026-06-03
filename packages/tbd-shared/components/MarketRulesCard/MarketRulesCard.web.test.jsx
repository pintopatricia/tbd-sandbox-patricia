import { render, act } from "@testing-library/react";
import MarketRules from "./MarketRulesCard.web";
import MarketRulesComponent from "./MarketRules/MarketRules.web";

jest.mock("./MarketRules/MarketRules.web", () => jest.fn(({ ...props }) => <market-rules-component {...props} />));

function renderMarketRules({
  marketRules,
  localeCodeBcp47 = "locale",
  timezone = "timezone",
  discountRateUrl = "discountRateUrl",
  dispatchNavigateToDiscountRateExplainedAction,
}) {
  return render(
    <MarketRules
      marketRules={marketRules}
      localeCodeBcp47={localeCodeBcp47}
      timezone={timezone}
      discountRateUrl={discountRateUrl}
      dispatchNavigateToDiscountRateExplainedAction={dispatchNavigateToDiscountRateExplainedAction}
    />,
  );
}

describe("MarketRulesCard.web", () => {
  afterEach(() => {
    MarketRulesComponent.mockClear();
  });

  it("should invoke the MarketRulesCard component", () => {
    renderMarketRules({
      marketRules: { theMarketRules: {} },
      dispatchNavigateToDiscountRateExplainedAction: jest.fn(),
    });

    expect(MarketRulesComponent).toHaveBeenCalledWith(
      {
        marketRules: { theMarketRules: {} },
        onDiscountRateLinkClick: expect.any(Function),
        locale: "locale",
        timezone: "timezone",
        discountRateUrl: "discountRateUrl",
      },
      undefined,
    );
    expect(MarketRulesComponent).toHaveBeenCalledTimes(1);
  });

  it("should invoke the MarketRulesCard component inside its main container", () => {
    renderMarketRules({
      marketRules: { theMarketRules: {} },

      dispatchNavigateToDiscountRateExplainedAction: jest.fn(),
    });

    expect(MarketRulesComponent).toHaveBeenCalled();
  });

  describe("when handleDiscountRateLinkClick is called", () => {
    let dispatchNavigateToDiscountRateExplainedActionSpy;
    let unmountCb;

    beforeEach(() => {
      dispatchNavigateToDiscountRateExplainedActionSpy = jest.fn();
      const { unmount } = renderMarketRules({
        dispatchNavigateToDiscountRateExplainedAction: dispatchNavigateToDiscountRateExplainedActionSpy,
      });
      unmountCb = unmount;
      act(() => {
        MarketRulesComponent.mock.calls[0][0].onDiscountRateLinkClick({ target: { text: "text", href: "href" } });
      });
    });

    afterEach(() => {
      unmountCb();
      dispatchNavigateToDiscountRateExplainedActionSpy.mockClear();
    });

    it("should dispatch navigate to discount rate explained action", () => {
      expect(dispatchNavigateToDiscountRateExplainedActionSpy).toHaveBeenCalledWith("text", "href");
      expect(dispatchNavigateToDiscountRateExplainedActionSpy).toHaveBeenCalledTimes(1);
    });
  });
});
