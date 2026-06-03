import { Divider } from "@ppb/the-wall-native";
import { render } from "@testing-library/react-native";
import ConnectedCard from "../Card";
import Card from "../Card/Card.native";
import MarketBetSelectionCardGroup from "./MarketBetSelectionCardGroup.native";

jest.mock("../Card", () => jest.fn(({ props }) => <connected-card-mock {...props} />));
jest.mock("../Card/Card.native", () => ({ Card: jest.fn(() => <card-mock />) }));

jest.mock("@ppb/the-wall-native", () => ({
  Divider: jest.fn(() => <divider-mock />),
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

const defaultProps = {
  items: [
    {
      typename: "MarketBetSelectionCard",
      urn: "market-bet-selection-card-urn:1",
    },
    {
      typename: "MarketBetSelectionCard",
      urn: "market-bet-selection-card-urn:2",
    },
  ],
};

function renderMarketBetSelectionCardGroup(props) {
  return render(<MarketBetSelectionCardGroup {...props} />);
}

describe("Market Bet Selection Card Group native component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when props doesn't has items", () => {
    it("should not render ConnectedCard component", () => {
      renderMarketBetSelectionCardGroup({ ...defaultProps, itemsUnmatched: [], items: [] });

      expect(ConnectedCard).not.toHaveBeenCalled();
    });
  });

  describe("items", () => {
    it("should render ConnectedCard and Divider components", () => {
      renderMarketBetSelectionCardGroup(defaultProps);

      expect(ConnectedCard).toHaveBeenNthCalledWith(
        1,
        {
          urn: "market-bet-selection-card-urn:1",
          component: Card,
          typename: "MarketBetSelectionCard",
        },
        undefined,
      );

      expect(ConnectedCard).toHaveBeenNthCalledWith(
        2,
        {
          urn: "market-bet-selection-card-urn:2",
          component: Card,
          typename: "MarketBetSelectionCard",
        },
        undefined,
      );

      expect(Divider).toHaveReturnedTimes(1);
    });

    describe("when has only one item", () => {
      it("should render ConnectedCard component", () => {
        renderMarketBetSelectionCardGroup({
          items: [defaultProps.items[0]],
        });

        expect(ConnectedCard).toHaveBeenNthCalledWith(
          1,
          {
            urn: "market-bet-selection-card-urn:1",
            component: Card,
            typename: "MarketBetSelectionCard",
          },
          undefined,
        );

        expect(Divider).not.toHaveBeenCalled();
      });
    });
  });
});
