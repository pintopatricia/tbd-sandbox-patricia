import { render } from "@testing-library/react-native";
import MarketCard from "./MarketCard.native";
import ConnectedMarket from "../Market";
import { Market } from "../Market/Market.native";

jest.mock("../Market", () => jest.fn((props) => <connected-market {...props} />));
jest.mock("../Market/Market.native", () => ({ Market: jest.fn(() => <market />) }));

function setup(props) {
  return render(<MarketCard {...props} />);
}

describe("Market card native", () => {
  afterEach(jest.clearAllMocks);

  describe("when initializing the component", () => {
    const DEFAULT_PROPS = {
      title: "Title",
      cardUrn: "cardUrn",
      marketViewLinks: [],
      runnerViewLinks: {
        "ppb:excRunner:1.174853945/27157516/0": {
          runnerUrn: "ppb:excRunner:1.174853945/27157516/0",
          viewUrl: "Not Implemented",
          viewUrn: "ppb:tbd:view:runner:1.174853945/27157516/0",
        },
      },
      displayRunners: {
        exchange: {
          markets: "ppb:excMarket:1",
          runners: ["runner1Urn", "runner2Urn"],
        },
        sportsbook: {
          markets: "ppb:sbkMarket:1",
          runners: ["runner1Urn", "runner2Urn"],
        },
      },
      template: "DEFAULT",
      numberOfItemsToDisplay: 2,
      marketPromo: {
        title: "market title",
        description: "market description",
        signposting: "EXTRA_PLACES",
      },
    };

    it("should render connected market with native component", () => {
      setup(DEFAULT_PROPS);
      expect(ConnectedMarket).toHaveBeenCalledWith(
        {
          ...DEFAULT_PROPS,
          component: Market,
        },
        undefined,
      );
    });
  });
});
