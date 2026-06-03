import { render } from "@testing-library/react-native";
import { ExchangeMarketStatus } from "@ppb/tbd-store";
import { MarketBlurbs } from "@ppb/the-wall-native";
import { ExchangeMarket } from "./ExchangeMarket.native";
import { EXCHANGE_MARKET, EXCHANGE_MARKET_BLURBS } from "./ExchangeMarket.native.selectors";
import styles from "./ExchangeMarket.native.styles";

jest.mock("@ppb/the-wall-native", () => ({
  MarketBlurbs: jest.fn(() => <market-blurbs-mock />),
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  spacings: {},
}));

const onMarketPromoClickMock = jest.fn();

function renderExchangeMarket(props) {
  return render(<ExchangeMarket {...props} />);
}

describe("ExchangeMarket", () => {
  const BASE_MOCK = {
    liquidity: "LIQUIDITY",
    status: "STATUS",
    i18nLabels: {
      marketSuspended: "MARKET_SUSPENDED",
      marketClosed: "MARKET_CLOSED",
      back: "BACK",
      lay: "LAY",
      matched: "MATCHED",
    },
    bookPercentage: {
      back: 0.81,
      lay: undefined,
    },
    turnInPlayEnabled: true,
    inplay: true,
    onMarketDepthButtonTap: () => {},
    onMarketRulesButtonTap: () => {},
    children: <children-mock />,
  };

  afterEach(jest.clearAllMocks);

  it("should render the exchange market container", () => {
    const { queryByTestId } = renderExchangeMarket(BASE_MOCK);

    expect(queryByTestId(EXCHANGE_MARKET)).not.toBeNull();
  });

  it("should render the exchange market blurbs container with the appropriate styling", () => {
    const { queryByTestId } = renderExchangeMarket(BASE_MOCK);

    expect(queryByTestId(EXCHANGE_MARKET_BLURBS)).toHaveStyle(styles.headerContainer);
  });

  describe("MarketBlurbs call", () => {
    describe("with the BASE_MOCK above", () => {
      it("should call MarketBlurbs with the correct parameters for the BASE_MOCK above", () => {
        renderExchangeMarket(BASE_MOCK);

        expect(MarketBlurbs).toHaveBeenCalledWith(
          {
            text: `${BASE_MOCK.i18nLabels.matched}: ${BASE_MOCK.liquidity}`,
            marketStatus: BASE_MOCK.i18nLabels.marketClosed,
            marketDepthActive: false,
            marketDepthCallback: expect.any(Function),
            marketInfoCallback: undefined,
            bookPercentage: undefined,
            columns: [BASE_MOCK.i18nLabels.back, BASE_MOCK.i18nLabels.lay],
            turnInPlayEnabled: true,
            inplay: true,
          },
          undefined,
        );
      });
    });

    describe("when marketStatus is OPEN", () => {
      it("should call MarketBlurbs with the correct parameters", () => {
        renderExchangeMarket({
          ...BASE_MOCK,
          status: ExchangeMarketStatus.Open,
        });

        expect(MarketBlurbs.mock.calls[0][0].marketStatus).toBe(undefined);
      });
    });

    describe("when marketStatus is SUSPENDED", () => {
      it("should call MarketBlurbs with the correct parameters", () => {
        renderExchangeMarket({
          ...BASE_MOCK,
          status: ExchangeMarketStatus.Suspended,
        });

        expect(MarketBlurbs.mock.calls[0][0].marketStatus).toBe(BASE_MOCK.i18nLabels.marketSuspended);
      });
    });

    describe("when marketDepthActive is true and bookPercentage is defined", () => {
      const marketDepthCallbackMock = jest.fn();

      beforeEach(() => {
        renderExchangeMarket({
          ...BASE_MOCK,
          isMarketDepthActive: true,
          onMarketDepthButtonTap: marketDepthCallbackMock,
        });
      });

      it("should call MarketBlurbs with the appropriate marketDepthActive", () => {
        expect(MarketBlurbs.mock.calls[0][0].marketDepthActive).toBe(true);
      });

      it("should call MarketBlurbs with the appropriate marketDepthCallback", () => {
        expect(MarketBlurbs.mock.calls[0][0].marketDepthCallback).toBe(marketDepthCallbackMock);
      });

      it("should call MarketBlurbs with the appropriate bookPercentage", () => {
        const EXPECTED_BOOK_PERCENTAGE = {
          back: {
            label: BASE_MOCK.i18nLabels.back,
            percentage: `81.0%`,
          },
          lay: {
            label: BASE_MOCK.i18nLabels.lay,
            percentage: "",
          },
        };

        expect(MarketBlurbs.mock.calls[0][0].bookPercentage).toEqual(EXPECTED_BOOK_PERCENTAGE);
      });

      it("should call MarketBlurbs with the appropriate columns", () => {
        expect(MarketBlurbs.mock.calls[0][0].columns).toEqual([]);
      });
    });

    describe("when hasMarketRules is true", () => {
      it("should call MarketBlurbs with the appropriate marketRulesCallback", () => {
        const marketRulesCallbackMock = jest.fn();

        renderExchangeMarket({
          ...BASE_MOCK,
          hasMarketRules: true,
          onMarketRulesButtonTap: marketRulesCallbackMock,
        });

        expect(MarketBlurbs.mock.calls[0][0].marketInfoCallback).toBe(marketRulesCallbackMock);
      });
    });

    describe("when hasMarketGraph is true", () => {
      it("should call MarketBlurbs with the appropriate marketGraphCallback", () => {
        const marketGraphCallbackMock = jest.fn();

        renderExchangeMarket({
          ...BASE_MOCK,
          hasMarketGraph: true,
          onMarketGraphButtonTap: marketGraphCallbackMock,
        });

        expect(MarketBlurbs.mock.calls[0][0].marketGraphCallback).toBe(marketGraphCallbackMock);
      });
    });

    describe("when marketPromo is available", () => {
      it("should call market blurbs with correct props", () => {
        renderExchangeMarket({
          ...BASE_MOCK,
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
});
