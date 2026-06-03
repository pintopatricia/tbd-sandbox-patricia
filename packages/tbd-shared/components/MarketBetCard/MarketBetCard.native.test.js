import { BetSegments, Divider } from "@ppb/the-wall-native";
import { render, act } from "@testing-library/react-native";
import { Pressable } from "react-native";

import { CounterAggregator } from "./snowflakes/CounterAggregator/CounterAggregator.native";
import ConnectedCashout from "../Cashout";
import MarketBetCard from "./MarketBetCard.native";

const mockNavigate = jest.fn();

jest.mock("react-native", () => {
  const { StyleSheet, View } = jest.requireActual("react-native");

  return {
    StyleSheet,
    View,
    Pressable: jest.fn((props) => <pressable-mock {...props} />),
  };
});

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  spacings: { "spacing-1": 4 },
  colors: { NeutralsBackgroundElevation2: "#232325" },
}));

jest.mock("@ppb/the-wall-native", () => ({
  BetSegments: jest.fn(({ props }) => <bet-segments-mock {...props} />),
  Divider: jest.fn(() => <divider-mock />),
}));

jest.mock("./snowflakes/CounterAggregator/CounterAggregator.native", () => ({
  CounterAggregator: jest.fn(({ props }) => <counter-aggregator-mock {...props} />),
}));

jest.mock("../Cashout", () => jest.fn(({ props }) => <connected-cashout-mock {...props} />));
jest.mock("../Cashout/Cashout.native", () => ({ Cashout: jest.fn(() => <cashout-mock />) }));

jest.mock("@ppb/tbd-router/native", () => ({ navigate: (viewLink) => mockNavigate(viewLink) }));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

const defaultProps = {
  urn: "URN",
  title: "title-mock",
  numOfBets: 1,
  numOfUnmatched: "number-of-unmatched-mock",
  showCancelAll: false,
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

describe("Market Bet Card native component", () => {
  beforeEach(jest.clearAllMocks);

  it("should render BetSegments component", async () => {
    renderMarketBetCard({ ...propsWithCashout });

    expect(BetSegments).toHaveBeenCalledWith(
      {
        leftLabel: "liability-label-mock",
        leftValue: 1,
      },
      undefined,
    );

    expect(BetSegments).toHaveBeenCalledTimes(1);
  });

  describe("cashoutQuotesURNs", () => {
    describe("when props doesn't exists", () => {
      it("should not render ConnectedCashout component", () => {
        renderMarketBetCard(defaultProps);

        expect(ConnectedCashout).not.toHaveBeenCalled();
      });
    });

    describe("when props exists", () => {
      describe("when is open", () => {
        it("should render ConnectedCashout component", async () => {
          renderMarketBetCard({ ...propsWithCashout });

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
        });

        it("should not render ConnectedCashout component", async () => {
          renderMarketBetCard({ ...propsWithCashout, isOpen: false });

          expect(ConnectedCashout).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe("dispatchSubscribeCardUpdates", () => {
    it("should call dispatchSubscribeCardUpdates on mount", () => {
      renderMarketBetCard(defaultProps);

      expect(defaultProps.dispatchSubscribeCardUpdates).toHaveBeenCalledWith(defaultProps.urn);
    });

    describe("when isUnmatched is truthy", () => {
      it("should not call dispatchSubscribeCardUpdates on mount", () => {
        renderMarketBetCard({ ...defaultProps, isUnmatched: true });

        expect(defaultProps.dispatchSubscribeCardUpdates).not.toHaveBeenCalled();
      });
    });
  });

  describe("dispatchUnsubscribeCardUpdates", () => {
    it("should call dispatchUnsubscribeCardUpdates on unmount", () => {
      const { unmount } = renderMarketBetCard(defaultProps);

      act(() => {
        unmount();
      });

      expect(defaultProps.dispatchUnsubscribeCardUpdates).toHaveBeenCalledWith(defaultProps.urn);
    });

    describe("when isUnmatched is truthy", () => {
      it("should not call dispatchUnsubscribeCardUpdates on unmount", () => {
        const { unmount } = renderMarketBetCard({ ...defaultProps, isUnmatched: true });

        act(() => {
          unmount();
        });

        expect(defaultProps.dispatchUnsubscribeCardUpdates).not.toHaveBeenCalled();
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
