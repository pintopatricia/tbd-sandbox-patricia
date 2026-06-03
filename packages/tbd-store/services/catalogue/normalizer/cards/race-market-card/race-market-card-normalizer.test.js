import { DisplayMode } from "../../../../../clients/catalogue/catalogue-response-types";
import normalizeRaceMarketCardFragmentIntoRaceMarketCard from "./race-market-card-normalizer";

const BFF_RESPONSE = {
  __typename: "RaceMarketCard",
  urn: "ppb:tbd:card:raceMarket:1.175293571|5",
  raceViewLink: {
    viewUrn: "ppb:tbd:view:race:7|30114553.1030",
    viewUrl: "horse-racing/wagg-(aus)-10th-nov/r-7%7C30114553.1030",
  },
  title: "Win",
  displayRunners: {
    exchange: {
      market: {
        __typename: "ExchangeMarket",
        urn: "ppb:excMarket:1.175293571",
      },
      runners: [
        {
          runnerURN: "ppb:excRunner:1.175293571/36710835/0",
        },
        {
          runnerURN: "ppb:excRunner:1.175293571/36710836/0",
        },
      ],
    },
    sportsbook: {
      market: {
        __typename: "SportsbookMarket",
        urn: "ppb:sbkMarket:924.175293571",
      },
      runners: [
        {
          runnerURN: "ppb:sbkRunner:924.175293571/36710835/0",
        },
        {
          runnerURN: "ppb:sbkRunner:924.175293571/36710836/0",
        },
      ],
    },
  },
  numberOfRunners: 6,
  race: {
    __typename: "Race",
    urn: "ppb:race:30114553.1030",
  },
  runnerViewLinks: [
    {
      runnerUrn: "ppb:excRunner:1.175293571/36710835/0",
      viewUrl: "Not Implemented",
      viewUrn: "ppb:tbd:view:runner:1.175293571/36710835/0",
    },
    {
      runnerUrn: "ppb:excRunner:1.175293571/36710836/0",
      viewUrl: "Not Implemented",
      viewUrn: "ppb:tbd:view:runner:1.175293571/36710836/0",
    },
  ],
  isRunnerExpandable: true,
  marketPromo: {
    title: "market title",
    description: "market description",
    signposting: "EXTRA_PLACES",
  },
  blurbs: [
    null,
    {
      isCollapsed: false,
      title: {
        __typename: "DisplayNameTitle",
        name: "header Name",
      },
      description: {
        __typename: "DisplayNameTitle",
        name: "body Name",
      },
      supplementaryInfo: {
        label: {
          __typename: "DisplayNameTitle",
          name: "link label",
        },
        viewLink: {
          viewUrn: "view urn",
          viewUrl: "view url",
          viewDisplayMode: DisplayMode.SelfBrowser,
        },
      },
    },
    {
      title: {
        __typename: "DisplayNameTitle",
        name: "header Name",
      },
      description: {
        __typename: "DisplayNameTitle",
        name: "body Name",
      },
    },
    {
      title: {
        __typename: "DisplayNameTitle",
        name: "header Name",
      },
    },
  ],
};

describe("RaceMarketCard normalizer", () => {
  describe("normalizeRaceMarketCardFragmentIntoRaceMarketCard", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeRaceMarketCardFragmentIntoRaceMarketCard(BFF_RESPONSE);

      expect(data).toEqual({
        numberOfRunners: 6,
        race: "ppb:race:30114553.1030",
        raceViewLink: {
          viewUrl: "horse-racing/wagg-(aus)-10th-nov/r-7%7C30114553.1030",
          viewUrn: "ppb:tbd:view:race:7|30114553.1030",
        },
        runnerViewLinks: {
          "ppb:excRunner:1.175293571/36710835/0": {
            runnerUrn: "ppb:excRunner:1.175293571/36710835/0",
            viewUrl: "Not Implemented",
            viewUrn: "ppb:tbd:view:runner:1.175293571/36710835/0",
          },
          "ppb:excRunner:1.175293571/36710836/0": {
            runnerUrn: "ppb:excRunner:1.175293571/36710836/0",
            viewUrl: "Not Implemented",
            viewUrn: "ppb:tbd:view:runner:1.175293571/36710836/0",
          },
        },
        title: "Win",
        typename: "RaceMarketCard",
        urn: "ppb:tbd:card:raceMarket:1.175293571|5",
        displayRunners: {
          exchange: {
            market: "ppb:excMarket:1.175293571",
            runners: [{ urn: "ppb:excRunner:1.175293571/36710835/0" }, { urn: "ppb:excRunner:1.175293571/36710836/0" }],
          },
          sportsbook: {
            market: "ppb:sbkMarket:924.175293571",
            runners: [
              { urn: "ppb:sbkRunner:924.175293571/36710835/0" },
              { urn: "ppb:sbkRunner:924.175293571/36710836/0" },
            ],
          },
        },
        isRunnerExpandable: true,
        marketPromo: {
          title: "market title",
          description: "market description",
          signposting: "EXTRA_PLACES",
          isExpanded: false,
        },
        infoBlurbs: [
          {
            title: "header Name",
            description: "body Name",
            isExpanded: true,
            link: {
              text: "link label",
              url: "view url",
              displayMode: DisplayMode.SelfBrowser,
            },
            signposting: "MARKET_RULES",
          },
          {
            title: "header Name",
            description: "body Name",
            isExpanded: false,
            link: undefined,
            signposting: "MARKET_RULES",
          },
          {
            title: "header Name",
            description: undefined,
            isExpanded: false,
            link: undefined,
            signposting: "MARKET_RULES",
          },
        ],
      });
    });

    it("should correctly transform and return the data object with undefined variables", () => {
      const { data } = normalizeRaceMarketCardFragmentIntoRaceMarketCard({
        ...BFF_RESPONSE,
        marketPromo: undefined,
        blurbs: [],
      });

      expect(data).toEqual({
        numberOfRunners: 6,
        race: "ppb:race:30114553.1030",
        raceViewLink: {
          viewUrl: "horse-racing/wagg-(aus)-10th-nov/r-7%7C30114553.1030",
          viewUrn: "ppb:tbd:view:race:7|30114553.1030",
        },
        runnerViewLinks: {
          "ppb:excRunner:1.175293571/36710835/0": {
            runnerUrn: "ppb:excRunner:1.175293571/36710835/0",
            viewUrl: "Not Implemented",
            viewUrn: "ppb:tbd:view:runner:1.175293571/36710835/0",
          },
          "ppb:excRunner:1.175293571/36710836/0": {
            runnerUrn: "ppb:excRunner:1.175293571/36710836/0",
            viewUrl: "Not Implemented",
            viewUrn: "ppb:tbd:view:runner:1.175293571/36710836/0",
          },
        },
        title: "Win",
        typename: "RaceMarketCard",
        urn: "ppb:tbd:card:raceMarket:1.175293571|5",
        displayRunners: {
          exchange: {
            market: "ppb:excMarket:1.175293571",
            runners: [{ urn: "ppb:excRunner:1.175293571/36710835/0" }, { urn: "ppb:excRunner:1.175293571/36710836/0" }],
          },
          sportsbook: {
            market: "ppb:sbkMarket:924.175293571",
            runners: [
              { urn: "ppb:sbkRunner:924.175293571/36710835/0" },
              { urn: "ppb:sbkRunner:924.175293571/36710836/0" },
            ],
          },
        },
        isRunnerExpandable: true,
        marketPromo: undefined,
        infoBlurbs: [],
      });
    });
  });
});
