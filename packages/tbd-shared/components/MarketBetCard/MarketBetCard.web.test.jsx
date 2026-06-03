import { BetSegments, Divider, Link, useOnIntersect } from "@ppb/the-wall-web";
import { render, waitFor, act } from "@testing-library/react";
import "jest-dom/extend-expect";
import ConnectedCashout from "../Cashout";
import MarketBetCard from "./MarketBetCard.web";
import { CounterAggregator } from "./snowflakes/CounterAggregator/CounterAggregator.web";

jest.mock("@ppb/the-wall-web", () => ({
  BetSegments: jest.fn(({ props }) => <bet-segments-mock {...props} />),
  Divider: jest.fn(() => <divider-mock />),
  Link: jest.fn(({ children }) => <link-mock onClick={(link) => jest.fn(link)}>{children}</link-mock>),
  useOnIntersect: jest.fn(() => ({ isIntersecting: true })),
}));

jest.mock("./snowflakes/CounterAggregator/CounterAggregator.web", () => ({
  CounterAggregator: jest.fn(({ props }) => <counter-aggregator-mock {...props} />),
}));

jest.mock("../Cashout", () => jest.fn(({ props }) => <connected-cashout-mock {...props} />));

jest.mock("../Cashout/Cashout.web", () => ({ Cashout: jest.fn().mockReturnValue(<cashout-mock />) }));

const defaultProps = {
  urn: "URN",
  title: "title-mock",
  numOfBets: 1,
  numOfUnmatched: "number-of-unmatched-mock",
  marketId: "market-id-mock",
  liability: 1,
  liabilityLabel: "liability-label-mock",
  isUnmatched: false,
  isOpen: true,
  aggregatorDescription: "aggregator-description-mock",
  cancelAllLabel: "cancel-all-label-mock",
  marketBetCardGroupURN: "market-bet-card-group-urn-mock",
  exchangeLightMarketViewLink: {
    viewUrn: "light-market-view-mock-urn",
    viewUrl: "light-market-view-mock-url",
  },
  commission: 2,
  commissionLabel: "commission-label-mock",
  profit: 3,
  profitLabel: "profit-label-mock",
  netProfit: 4,
  netProfitRaw: 5,
  netProfitLabel: "netProfit-label-mock",
  dispatchSubscribeCardUpdates: jest.fn(),
  dispatchUnsubscribeCardUpdates: jest.fn(),
  dispatchCancelAllPress: jest.fn(),
  dispatchMyBetsBottomSheetOpenPress: jest.fn(),
};

const propsWithCashout = {
  ...defaultProps,
  cashoutQuotesURNs: [
    {
      urn: "excCashoutQuoteMockURN",
      marketURN: "excMarketMockURN",
      marketBetURN: "marketBetMockURN",
      status: "UNAVAILABLE",
    },
  ],
};

function renderMarketBetCard(props) {
  return render(<MarketBetCard {...props} />);
}

describe("Market Bet Card web component", () => {
  beforeEach(jest.clearAllMocks);

  describe("cashoutQuotesURNs", () => {
    describe("when props doesn't exists", () => {
      it("should not render ConnectedCashout component", () => {
        renderMarketBetCard(defaultProps);

        expect(ConnectedCashout).not.toHaveBeenCalled();
      });
    });

    describe("when props exists", () => {
      describe("when is open", () => {
        it("should render BetSegments component", async () => {
          const { container } = renderMarketBetCard({ ...propsWithCashout });

          await waitFor(() => expect(container.querySelector("bet-segments-mock")).toBeInTheDocument());

          expect(BetSegments).toHaveBeenCalledWith(
            {
              leftLabel: "liability-label-mock",
              leftValue: 1,
            },
            undefined,
          );
        });

        it("should render ConnectedCashout component", async () => {
          const { container } = renderMarketBetCard({ ...propsWithCashout });

          await waitFor(() => expect(container.querySelector("connected-cashout-mock")).toBeInTheDocument());

          expect(ConnectedCashout).toHaveBeenCalledWith(
            {
              cashoutURN: {
                marketBetURN: "marketBetMockURN",
                marketURN: "excMarketMockURN",
                status: "UNAVAILABLE",
                urn: "excCashoutQuoteMockURN",
              },
              component: expect.any(Object),
            },
            undefined,
          );
        });
      });

      describe("when is not open", () => {
        it("should render BetSegments component with correct props", async () => {
          renderMarketBetCard({ ...propsWithCashout, isOpen: false });

          expect(BetSegments).toHaveBeenCalledWith(
            {
              leftLabel: "profit-label-mock",
              leftValue: 3,
              midLabel: "commission-label-mock",
              midValue: 2,
              rightLabel: "netProfit-label-mock",
              rightValue: 4,
              rightRawValue: 5,
            },
            undefined,
          );

          expect(BetSegments).toHaveBeenCalledTimes(1);
          expect(Divider).toHaveBeenCalledTimes(2);
        });

        it("should not render ConnectedCashout component", async () => {
          renderMarketBetCard({ ...propsWithCashout, isOpen: false });

          expect(ConnectedCashout).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe("dispatchSubscribeCardUpdates", () => {
    describe("when isUnmatched is truthy", () => {
      it("should not call dispatchSubscribeCardUpdates", () => {
        renderMarketBetCard({ ...defaultProps, isUnmatched: true });

        expect(defaultProps.dispatchSubscribeCardUpdates).not.toHaveBeenCalled();
      });
    });

    describe("when useOnIntersect is truthy", () => {
      it("should call dispatchSubscribeCardUpdates", () => {
        renderMarketBetCard(defaultProps);

        expect(defaultProps.dispatchSubscribeCardUpdates).toHaveBeenCalledWith(defaultProps.urn);
      });
    });

    describe("when useOnIntersect is falsy", () => {
      it("should not call dispatchSubscribeCardUpdates", () => {
        useOnIntersect.mockReturnValueOnce({});
        renderMarketBetCard(defaultProps);

        expect(defaultProps.dispatchSubscribeCardUpdates).not.toHaveBeenCalled();
      });
    });
  });

  describe("dispatchUnsubscribeCardUpdates", () => {
    describe("when isUnmatched is truthy", () => {
      it("should not call dispatchUnsubscribeCardUpdates", () => {
        renderMarketBetCard({ ...defaultProps, isUnmatched: true });

        expect(defaultProps.dispatchUnsubscribeCardUpdates).not.toHaveBeenCalled();
      });
    });

    describe("when useOnIntersect is truthy", () => {
      it("should not call dispatchUnsubscribeCardUpdates", () => {
        renderMarketBetCard(defaultProps);

        expect(defaultProps.dispatchUnsubscribeCardUpdates).not.toHaveBeenCalled();
      });
    });

    describe("when useOnIntersect is falsy", () => {
      it("should call dispatchUnsubscribeCardUpdates", () => {
        useOnIntersect.mockReturnValueOnce({});
        renderMarketBetCard(defaultProps);

        expect(defaultProps.dispatchUnsubscribeCardUpdates).toHaveBeenCalledWith(defaultProps.urn);
      });
    });

    describe("when on unmount", () => {
      it("should call dispatchUnsubscribeCardUpdates", () => {
        const { unmount } = renderMarketBetCard(defaultProps);

        act(() => {
          unmount();
        });

        expect(defaultProps.dispatchUnsubscribeCardUpdates).toHaveBeenCalledWith(defaultProps.urn);
      });

      describe("when isUnmatched is truthy", () => {
        it("should not call dispatchUnsubscribeCardUpdates", () => {
          const { unmount } = renderMarketBetCard({ ...defaultProps, isUnmatched: true });

          act(() => {
            unmount();
          });

          expect(defaultProps.dispatchUnsubscribeCardUpdates).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe("dispatchCancelAllPress", () => {
    it("should call dispatchCancelAllPress when counter aggregator button is clicked", () => {
      renderMarketBetCard({
        ...defaultProps,
        showCancelAll: true,
      });
      expect(defaultProps.dispatchCancelAllPress).toHaveBeenCalledTimes(0);

      CounterAggregator.mock.calls[0][0].onButtonTap();
      expect(defaultProps.dispatchCancelAllPress).toHaveBeenCalledTimes(1);
      expect(defaultProps.dispatchCancelAllPress).toHaveBeenCalledWith(
        "market-id-mock",
        "title-mock",
        "number-of-unmatched-mock",
        "market-bet-card-group-urn-mock",
        "aggregator-description-mock",
      );
    });
  });
});
