import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { MarketBlurbs } from "@ppb/the-wall-web";
import useOnIntersect from "@ppb/the-wall-web/hooks/useOnIntersect";
import { ExchangeMarket } from "./ExchangeMarket.web";

jest.mock("@ppb/the-wall-web", () => ({
  MarketBlurbs: jest.fn(() => <market-blurbs-mock />),
}));

jest.mock("@ppb/the-wall-web/hooks/useOnIntersect", () => jest.fn(() => ({})));

const onRunnerClickMock = jest.fn();
const onMarketPromoClickMock = jest.fn();

const I18N_LABELS = {
  back: "Back",
  lay: "Lay",
  marketClosed: "Closed",
  marketDepth: "Market Depth",
  marketSuspended: "Suspended",
  matched: "Matched",
};

const EXCHANGE_MARKET = {
  marketURN: "urn:market:1.23",
  onRunnerClick: onRunnerClickMock,
  liquidity: "6",
  status: "OPEN",
  runners: [
    {
      urn: "urn:catalogue:runner:1.166528788:19:0",
      name: "Some other Team A",
      selectionId: 19,
    },
    {
      urn: "urn:catalogue:runner:1.166528788:21:0",
      name: "Some other Draw",
      selectionId: 21,
    },
    {
      urn: "urn:catalogue:runner:1.166528788:20:0",
      name: "Some other Team B",
      selectionId: 20,
    },
  ],
  i18nLabels: I18N_LABELS,
  turnInPlayEnabled: true,
  inplay: false,
};

const EXCHANGE_MARKET_CLOSED = {
  ...EXCHANGE_MARKET,
  status: "CLOSED",
};

const EXCHANGE_MARKET_WITH_MARKET_DEPTH = {
  ...EXCHANGE_MARKET,
  isMarketDepthActive: true,
  bookPercentage: { back: 1.014, lay: 0.982 },
  runners: [
    {
      urn: "urn:catalogue:runner:1.166528788:19:0",
      name: "Some other Team A",
      selectionId: 10,
    },
    {
      urn: "urn:catalogue:runner:1.166528788:21:0",
      name: "Some other Draw",
      selectionId: 21,
    },
    {
      urn: "urn:catalogue:runner:1.166528788:20:0",
      name: "Some other Team B",
      selectionId: 20,
    },
  ],
};

const EXCHANGE_MARKET_WITH_MARKET_RULES = {
  ...EXCHANGE_MARKET,
  hasMarketRules: true,
  onMarketRulesButtonTap: jest.fn(),
};

const EXCHANGE_MARKET_WITH_MARKET_GRAPH = {
  ...EXCHANGE_MARKET,
  hasMarketGraph: true,
  onMarketGraphButtonTap: jest.fn(),
};

const ChildrenMock = jest.fn(() => <children-mock />);

function renderMarket(exchangeMarket, isIntersecting, renderBetslip) {
  useOnIntersect.mockReturnValue({ isIntersecting });
  return render(
    <ExchangeMarket {...exchangeMarket} renderBetslip={renderBetslip}>
      <ChildrenMock />
    </ExchangeMarket>,
  );
}

beforeEach(jest.clearAllMocks);

describe("when initializing", () => {
  it("should render its children", () => {
    renderMarket(EXCHANGE_MARKET);

    expect(ChildrenMock).toHaveBeenCalled();
  });

  it("should render market blurbs", () => {
    renderMarket(EXCHANGE_MARKET);

    expect(MarketBlurbs).toHaveBeenCalledTimes(1);
    expect(MarketBlurbs).toHaveBeenCalledWith(
      {
        columns: ["Back", "Lay"],
        text: "Matched: 6",
        marketDepthActive: false,
        inplay: false,
        turnInPlayEnabled: true,
      },
      undefined,
    );
  });

  describe("and market depth is active", () => {
    it("should call market blurbs with columns as empty", () => {
      renderMarket(EXCHANGE_MARKET_WITH_MARKET_DEPTH);

      expect(MarketBlurbs).toHaveBeenCalledWith(expect.objectContaining({ columns: [] }), undefined);
    });
  });
});

describe("when rendering Exchange header", () => {
  describe("when market is OPEN", () => {
    it("should call market blurb without market status", () => {
      renderMarket(EXCHANGE_MARKET);

      expect(MarketBlurbs).toHaveBeenCalledWith(
        expect.objectContaining({
          marketStatus: undefined,
        }),
        undefined,
      );
    });

    describe("and market depth is active", () => {
      it("should call market blurb without market status", () => {
        renderMarket(EXCHANGE_MARKET_WITH_MARKET_DEPTH);

        expect(MarketBlurbs).toHaveBeenCalledWith(
          expect.objectContaining({
            marketStatus: undefined,
          }),
          undefined,
        );
      });
    });
  });

  describe("when market is CLOSED/SUSPENDED", () => {
    it("should call market blurb with market status", () => {
      renderMarket(EXCHANGE_MARKET_CLOSED);

      expect(MarketBlurbs).toHaveBeenCalledWith(
        expect.objectContaining({
          marketStatus: "Closed",
        }),
        undefined,
      );
    });
  });

  describe("when market rules is available", () => {
    it("should call market blurbs with correct props", () => {
      renderMarket(EXCHANGE_MARKET_WITH_MARKET_RULES);

      expect(MarketBlurbs).toHaveBeenCalledWith(
        expect.objectContaining({
          marketInfoCallback: expect.any(Function),
        }),
        undefined,
      );
    });
  });

  describe("when market graph is available", () => {
    it("should call market blurbs with correct props", () => {
      renderMarket(EXCHANGE_MARKET_WITH_MARKET_GRAPH);

      expect(MarketBlurbs).toHaveBeenCalledWith(
        {
          text: "Matched: 6",
          marketDepthActive: false,
          marketGraphCallback: expect.any(Function),
          columns: ["Back", "Lay"],
          turnInPlayEnabled: true,
          inplay: false,
        },
        undefined,
      );
    });
  });

  describe("when marketPromo is available", () => {
    it("should call market blurbs with correct props", () => {
      renderMarket({
        ...EXCHANGE_MARKET,
        marketPromo: {
          title: "market title",
          description: "market description",
          signposting: "EXTRA_PLACES",
        },
        onMarketPromoClick: onMarketPromoClickMock,
      });

      expect(MarketBlurbs).toHaveBeenCalledWith(
        expect.objectContaining({
          marketPromo: {
            title: "market title",
            description: "market description",
            signposting: "EXTRA_PLACES",
          },
          onMarketPromoClick: onMarketPromoClickMock,
        }),
        undefined,
      );
    });
  });
});

describe("Exchange Market on intersect", () => {
  describe("when callback is defined", () => {
    it("should invoke on intersect callback", () => {
      const onIntersectCallback = jest.fn();
      renderMarket({ ...EXCHANGE_MARKET, onIntersectCallback }, true);

      expect(onIntersectCallback).toHaveBeenCalledTimes(1);
      expect(onIntersectCallback).toHaveBeenCalledWith(true);
    });
  });
});
