import { render } from "@testing-library/react-native";

import { codecs } from "@ppb/tbd-urn-codecs";
import MarketExtendedCard from "./MarketExtendedCard.native";
import ConnectedMarket from "../Market";
import { Market } from "../Market/Market.native";
import { MARKET_EXTENDED, MARKET_EXTENDED_CARD } from "./MarketExtendedCard.native.selectors";

jest.mock("../Market", () => jest.fn(() => <connected-dual-usage-market />));
jest.mock("../Market/Market.native", () => jest.fn(() => <dual-usage-market-mock />));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  spacings: {},
  typography: {},
}));

const marketExtendedCardMock = {
  title: "title",
  cardUrn: "cardURn",
  runnerViewLinks: {
    runnerUrn: {
      viewUrn: "viewUrn",
      viewUrl: "viewUrl",
    },
  },
  isCashoutQuoteAvailable: true,
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
  numberOfItemsToDisplay: 2,
  marketPromo: {
    title: "market title",
    description: "market description",
    signposting: "EXTRA_PLACES",
  },
};

function renderMarketCard(props) {
  const result = render(<MarketExtendedCard {...props} />);
  return {
    view: props ? result.getByTestId(MARKET_EXTENDED) : null,
    card: props?.cardUrn ? result.getByTestId(MARKET_EXTENDED_CARD) : null,
  };
}

describe("Market Extended card component", () => {
  let result;
  beforeEach(() => {
    jest.clearAllMocks();
    result = renderMarketCard(marketExtendedCardMock);
  });

  it("should render card", () => {
    expect(result.card).toBeDefined();
  });

  it("should render Dual Usage Market Extended card", () => {
    expect(result.view).toBeDefined();
    expect(ConnectedMarket).toHaveBeenCalledTimes(1);
    expect(ConnectedMarket).toHaveBeenCalledWith(
      {
        cardUrn: "cardURn",
        title: "title",
        runnerViewLinks: {
          runnerUrn: {
            viewUrn: "viewUrn",
            viewUrl: "viewUrl",
          },
        },
        component: Market,
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
        numberOfItemsToDisplay: 2,
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
