import { render } from "@testing-library/react-native";
import { FlatList } from "react-native";
import { ScrollableSwimlane } from "@ppb/the-wall-native";
import { InlineExchangeMarket } from "./InlineExchangeMarket.native";
import { SNAP_GROUP, INLINE_EXCHANGE_MARKET } from "./InlineExchangeMarket.native.selectors";
import styles from "./InlineExchangeMarket.native.styles";

// initial num to render breaks tests since the cards appear after the first render
jest.mock("@ppb/the-wall-native/helpers/flatlist-props", () => ({
  FLAT_LIST_DEFAULTS: {
    initialNumToRender: undefined,
    windowSize: undefined,
    maxToRenderPerBatch: undefined,
    removeClippedSubviews: undefined,
  },
}));

jest.mock("react-native", () => {
  const { View, StyleSheet } = jest.requireActual("react-native");
  return {
    View,
    StyleSheet,
    FlatList: jest.fn(),
  };
});

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("@ppb/the-wall-native", () => ({
  ExchangeBetButton: jest.fn(() => <exchange-bet-button-mock></exchange-bet-button-mock>),
  ScrollableSwimlane: jest.fn(({ children, ...props }) => <scrollable-mock {...props}>{children}</scrollable-mock>),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  spacings: {},
  heights: { "inline-market-small-max-width": 101, "bet-button-width": 48 },
}));

const EXCHANGE_MARKET = {
  marketURN: "market:urn",
  runners: [
    {
      urn: "urn:catalogue:runner:1.166528788:19:0",
      name: "Runner 1",
      isSelected: false,
    },
    {
      urn: "urn:catalogue:runner:1.166528788:21:0",
      name: "Runner 2",
      isSelected: true,
    },
    {
      urn: "urn:catalogue:runner:1.166528788:20:0",
      name: "Runner 3",
      isSelected: false,
    },
    {
      urn: "urn:catalogue:runner:1.166528788:22:0",
      name: "Runner 1",
      isSelected: false,
    },
    {
      urn: "urn:catalogue:runner:1.166528788:23:0",
      name: "Runner 2",
      isSelected: false,
    },
    {
      urn: "urn:catalogue:runner:1.166528788:24:0",
      name: "Runner 3",
      isSelected: false,
    },
  ],
};

const renderBetBtnsMock = jest.fn();
const mockRenderItem = { item: EXCHANGE_MARKET.runners };

function renderInlineExchangeMarket({ market = EXCHANGE_MARKET } = {}) {
  const container = render(<InlineExchangeMarket {...market} renderExcBetButtons={renderBetBtnsMock} />);

  return {
    inlineExchangeMarket: container.queryByTestId(INLINE_EXCHANGE_MARKET),
    snapGroup: container.queryAllByTestId(SNAP_GROUP),
  };
}

describe("InlineExchangeMarket", () => {
  beforeEach(jest.clearAllMocks);

  describe("render component", () => {
    let result;
    beforeEach(() => {
      result = renderInlineExchangeMarket({});
    });

    it("should render the inline market", () => {
      const { inlineExchangeMarket } = result;
      expect(inlineExchangeMarket).toBeDefined();
    });

    it("should render scrollable swimlane", () => {
      expect(ScrollableSwimlane).toHaveBeenCalledWith({ children: expect.any(Object) }, undefined);
    });

    describe("when there are only 2 runners", () => {
      const [first, second, , fourth, fifth, ,] = EXCHANGE_MARKET.runners;
      beforeEach(() => {
        jest.clearAllMocks();

        result = renderInlineExchangeMarket({
          disabled: true,
          market: { ...EXCHANGE_MARKET, runners: [first, second, fourth, fifth] },
        });
      });

      it("should set small style on containerExchangeBetButton", () => {
        expect(result.inlineExchangeMarket).toHaveStyle(styles.inlineExchangeMarketSmall);
      });

      it("should render eight betButton containers", () => {
        const renderItem = FlatList.mock.calls[0][0].renderItem({
          item: [first, second, fourth, fifth],
        });

        expect(renderItem.props.children.length).toBe(2);

        expect(renderBetBtnsMock).toHaveBeenNthCalledWith(1, "urn:catalogue:runner:1.166528788:19:0", "BACK");
        expect(renderBetBtnsMock).toHaveBeenNthCalledWith(2, "urn:catalogue:runner:1.166528788:21:0", "BACK");
        expect(renderBetBtnsMock).toHaveBeenNthCalledWith(3, "urn:catalogue:runner:1.166528788:22:0", "BACK");
        expect(renderBetBtnsMock).toHaveBeenNthCalledWith(4, "urn:catalogue:runner:1.166528788:23:0", "BACK");
        expect(renderBetBtnsMock).toHaveBeenNthCalledWith(5, "urn:catalogue:runner:1.166528788:19:0", "LAY");
        expect(renderBetBtnsMock).toHaveBeenNthCalledWith(6, "urn:catalogue:runner:1.166528788:21:0", "LAY");
        expect(renderBetBtnsMock).toHaveBeenNthCalledWith(7, "urn:catalogue:runner:1.166528788:22:0", "LAY");
        expect(renderBetBtnsMock).toHaveBeenNthCalledWith(8, "urn:catalogue:runner:1.166528788:23:0", "LAY");
      });
    });

    describe("when there more than 2 runners", () => {
      const index = 0;

      beforeEach(() => {
        jest.clearAllMocks();

        result = renderInlineExchangeMarket({
          disabled: true,
          market: { ...EXCHANGE_MARKET, runners: EXCHANGE_MARKET.runners },
        });
      });

      it("shouldn't set small style on containerExchangeBetButton", () => {
        expect(result.inlineExchangeMarket).not.toHaveStyle(styles.inlineExchangeMarketSmall);
      });

      it("should call renderItem", () => {
        const resultItem = FlatList.mock.calls[0][0].renderItem(mockRenderItem);

        expect(resultItem.props.children.length).toBe(2);
      });

      it("should call getItemLayout", () => {
        const itemLayout = FlatList.mock.calls[0][0].getItemLayout(null, index);

        expect(itemLayout.index).toBe(0);
        expect(itemLayout.offset).toBe(0);
        expect(itemLayout.length).toBe(48);
      });

      it("key extractor should create unique key", () => {
        const keyExtractor = FlatList.mock.calls[0][0].keyExtractor(null, index);

        expect(keyExtractor).toBe("inline-exchange-market-0");
      });
    });
  });
});
