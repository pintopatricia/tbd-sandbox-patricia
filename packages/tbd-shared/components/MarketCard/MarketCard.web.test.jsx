import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import MarketCard from "./MarketCard.web";
import ConnectedMarket from "../Market";
import { Market } from "../Market/Market.web";

jest.mock("../Market", () => jest.fn(() => <connected-market-mock />));
jest.mock("../Market/Market.web", () => ({ Market: jest.fn().mockReturnValue(<market-mock />) }));

function setup(props) {
  return render(<MarketCard {...props} />);
}

describe("Market card web", () => {
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

    it("should render connected market", () => {
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
