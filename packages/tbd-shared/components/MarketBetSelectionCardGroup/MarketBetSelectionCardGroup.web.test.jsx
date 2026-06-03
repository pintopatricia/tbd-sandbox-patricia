import { Divider } from "@ppb/the-wall-web";
import { render } from "@testing-library/react";
import ConnectedCard from "../Card";
import Card from "../Card/Card.web";
import MarketBetSelectionCardGroup from "./MarketBetSelectionCardGroup.web";

jest.mock("../Card", () => jest.fn(({ props }) => <connected-card-mock {...props} />));
jest.mock("../Card/Card.web", () => ({ Card: jest.fn().mockReturnValue(<card-mock />) }));

jest.mock("@ppb/the-wall-web", () => ({
  Divider: jest.fn(() => <divider-mock />),
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

describe("Market Bet Selection Card Group web component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when props doesn't has items", () => {
    it("should not render ConnectedCard component", () => {
      renderMarketBetSelectionCardGroup({ ...defaultProps, items: [] });

      expect(ConnectedCard).not.toHaveBeenCalled();
    });
  });

  describe("items", () => {
    it("should render ConnectedCard components", () => {
      renderMarketBetSelectionCardGroup({ ...defaultProps });

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
