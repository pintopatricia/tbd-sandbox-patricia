import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { codecs } from "@ppb/tbd-urn-codecs";
import MarketExtendedCard from "./MarketExtendedCard.web";
import ConnectedMarket from "../Market";
import { Market } from "../Market/Market.web";

jest.mock("../Market", () => jest.fn(() => <connected-market-card-mock />));

jest.mock("../Market/Market.web", () => jest.fn(() => <connected-market-card-mock />));

const marketExtendedCardMock = {
  title: "title",
  cardUrn: "cardURn",
  isCashoutQuoteAvailable: true,
  runnerViewLinks: {
    "ppb:runnerUrn": {
      viewUrn: "runnerViewURN",
      viewUrl: "runnerViewURL",
    },
  },
  displayRunners: {
    exchange: {
      market: "ppb:excMarket:1",
      runners: ["runner1Urn", "runner2Urn"],
    },
    sportsbook: {
      market: "ppb:sbkMarket:1",
      runners: ["runner1Urn", "runner2Urn"],
    },
  },
  eventViewLink: {
    viewUrl: "race/url",
    viewUrn: codecs.raceView.encode("1", "1"),
  },
  numberOfItemsToDisplay: 4,
  marketPromo: {
    title: "market title",
    description: "market description",
    signposting: "EXTRA_PLACES",
  },
};

function renderMarketCard(props) {
  return render(<MarketExtendedCard {...props} />);
}

describe("Market Extended card component", () => {
  beforeEach(jest.clearAllMocks);

  it("must render Dual Usage Market Extended card", () => {
    renderMarketCard(marketExtendedCardMock);

    expect(ConnectedMarket).toHaveBeenCalledWith(
      {
        cardUrn: "cardURn",
        component: Market,
        title: "title",
        runnerViewLinks: {
          "ppb:runnerUrn": {
            viewUrn: "runnerViewURN",
            viewUrl: "runnerViewURL",
          },
        },
        displayRunners: {
          exchange: {
            market: "ppb:excMarket:1",
            runners: ["runner1Urn", "runner2Urn"],
          },
          sportsbook: {
            market: "ppb:sbkMarket:1",
            runners: ["runner1Urn", "runner2Urn"],
          },
        },
        eventViewLink: {
          viewUrl: "race/url",
          viewUrn: codecs.raceView.encode("1", "1"),
        },
        template: "DEFAULT",
        numberOfItemsToDisplay: 4,
        marketPromo: {
          title: "market title",
          description: "market description",
          signposting: "EXTRA_PLACES",
        },
      },
      undefined,
    );
  });
});
