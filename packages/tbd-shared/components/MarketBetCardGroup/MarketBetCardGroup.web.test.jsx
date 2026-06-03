import { render } from "@testing-library/react";
import ConnectedCard from "../Card";
import Card from "../Card/Card.web";
import MarketBetCardGroup from "./MarketBetCardGroup.web";

jest.mock("../Card", () => jest.fn(({ props }) => <connected-card-mock {...props} />));
jest.mock("../Card/Card.web", () => ({ Card: jest.fn().mockReturnValue(<card-mock />) }));

const defaultProps = {
  items: [
    {
      typename: "MarketBetCard",
      urn: "market-bet-card-mock-urn",
    },
    {
      typename: "MarketBetExpandableCardGroup",
      urn: "market-bet-expandable-card-group-mock-urn",
    },
  ],
};

function renderMarketBetCardGroup(props) {
  return render(<MarketBetCardGroup {...props} />);
}

describe("Market Bet Card Group web component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when doesn't has items", () => {
    it("should not render any component", () => {
      renderMarketBetCardGroup({});

      expect(ConnectedCard).not.toHaveBeenCalled();
    });
  });

  describe("when has items", () => {
    it("should render ConnectedCard component properly", async () => {
      renderMarketBetCardGroup({ ...defaultProps });

      expect(ConnectedCard).toHaveBeenNthCalledWith(
        1,
        {
          urn: "market-bet-card-mock-urn",
          component: Card,
          typename: "MarketBetCard",
        },
        undefined,
      );
      expect(ConnectedCard).toHaveBeenNthCalledWith(
        2,
        {
          urn: "market-bet-expandable-card-group-mock-urn",
          component: Card,
          typename: "MarketBetExpandableCardGroup",
        },
        undefined,
      );
    });
  });
});
