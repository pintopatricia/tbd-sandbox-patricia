import { render } from "@testing-library/react-native";
import CardGroup from "../CardGroup/CardGroup.native";
import ConnectedCardGroup from "../CardGroup";
import MarketBetCardGroup from "./MarketBetCardGroup.native";

jest.mock("../CardGroup", () => jest.fn(({ props }) => <connected-card-group-mock {...props} />));
jest.mock("../CardGroup/CardGroup.native", () => ({ CardGroup: jest.fn(() => <card-group-mock />) }));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

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

describe("Market Bet Card Group native component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when doesn't has items", () => {
    it("should not render any component", () => {
      renderMarketBetCardGroup({});

      expect(ConnectedCardGroup).not.toHaveBeenCalled();
    });
  });

  describe("when has items", () => {
    it("should render ConnectedCardGroup component properly", async () => {
      renderMarketBetCardGroup({ ...defaultProps });

      expect(ConnectedCardGroup).toHaveBeenNthCalledWith(
        1,
        {
          urn: "market-bet-card-mock-urn",
          component: CardGroup,
          typename: "MarketBetCard",
        },
        undefined,
      );
      expect(ConnectedCardGroup).toHaveBeenNthCalledWith(
        2,
        {
          urn: "market-bet-expandable-card-group-mock-urn",
          component: CardGroup,
          typename: "MarketBetExpandableCardGroup",
        },
        undefined,
      );
    });
  });
});
