const {
  SportPagePO,
  ScrollableSwimlanePO,
  ExchangeMarketPO,
  CardPO,
  SportsbookMarketPO,
} = require("../../../../../page-objects");
const { getSportsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const sportPagePO = new SportPagePO();
const thirdPrimarySwimlane = new ScrollableSwimlanePO(sportPagePO.scrollableSwimlanes[2]);
const fourthPrimarySwimlane = new ScrollableSwimlanePO(sportPagePO.scrollableSwimlanes[3]);
const marketCardFromSecondSwimlane = new CardPO(thirdPrimarySwimlane.scrollItems[0]);
const marketCardFromThirdSwimlane = new CardPO(fourthPrimarySwimlane.scrollItems[0]);
const sportsbookMarketFromThirdSwimlane = new SportsbookMarketPO(marketCardFromSecondSwimlane.sportsbookMarket);
const exchangeMarketFromFourthSwimlane = new ExchangeMarketPO(marketCardFromThirdSwimlane.exchangeMarket);

const mockService = new MockService();

const EVENT_TYPE_ID = 1;

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:X2C4vxIAACkAb1uO/s/1",
        cardGroupTitle: "Bet Now",
        full: {
          edges: [
            {
              node: {
                __typename: "MarketViewLinkCard",
                urn: "ppb:tbd:card:marketViewLink:1.171034359",
                market: {
                  name: "Winner 2020/21",
                },
                badge: "CUP",
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "MarketViewLinkCard",
                urn: "ppb:tbd:card:marketViewLink:1.171034359",
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:Xz628RIAACQAJMYA/s/1",
        cardGroupTitle: "Today Events",
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29979322",
                title: "Match Odds",
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.172610105",
                      marketType: "MATCH_ODDS",
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          urn: "ppb:competition:11201",
                        },
                        sportevent: {
                          urn: "ppb:event:29979322",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:excRunner:1.172610105/5774350/0",
                          name: "Bayern Munich",
                          selectionId: 5774350,
                        },
                        {
                          runnerURN: "ppb:excRunner:1.172610105/44508/0",
                          name: "Sevilla",
                          selectionId: 44508,
                        },
                        {
                          runnerURN: "ppb:excRunner:1.172610105/58805/0",
                          name: "The Draw",
                          selectionId: 58805,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.172610105/5774350/0" },
                      { runnerURN: "ppb:excRunner:1.172610105/44508/0" },
                      { runnerURN: "ppb:excRunner:1.172610105/58805/0" },
                    ],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29979322",
                  home: {
                    name: "Bayern Munich",
                  },
                  away: {
                    name: "Sevilla",
                  },
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29979322",
              },
            },
          ],
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:X2C4vxIAACkAb1uO/s/1",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:Xz628RIAACQAJMYA/s/1",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:X2DWXhIAACYAb-bI/s/1",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:X2CgNBIAACgAbuqh/s/1",
      },
    },
  ],
};

const CARDS_MOCK = {
  cards: [
    {
      __typename: "SwimlaneCardGroup",
      urn: "ppb:tbd:cardgroup:swimlane:X2DWXhIAACYAb-bI/s/1",
      cardGroupTitle: "Daily Acca",
      full: {
        edges: [
          {
            node: {
              __typename: "MarketCard",
              urn: "ppb:tbd:card:market:924.237138987/3",
              cardTitle: "Man City Multiple Trophies 2020/21",
              displayRunners: {
                sportsbook: {
                  market: {
                    __typename: "SportsbookMarket",
                    urn: "ppb:sbkMarket:924.237138987",
                    marketType: "MULTIPLE_TROPHIES",
                    hierarchy: {
                      __typename: "EventHierarchy",
                      sportevent: {
                        urn: `ppb:event:29979322`,
                      },
                    },
                    runners: [
                      {
                        runnerURN: "ppb:sbkRunner:924.237138987/3991990",
                        name: "No Trophies",
                        selectionId: 3991990,
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.237138987/13300481",
                        name: "EPL EFL Cup",
                        selectionId: 13300481,
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.237138987/13300478",
                        name: "EPL FA Cup",
                        selectionId: 13300478,
                      },
                    ],

                    isOddsboostMarketType: false,
                  },
                  runners: [
                    { runnerURN: "ppb:sbkRunner:924.237138987/3991990" },
                    { runnerURN: "ppb:sbkRunner:924.237138987/13300481" },
                  ],
                },
              },
            },
          },
        ],
      },
      partials: { edges: [{ node: { __typename: "MarketCard", urn: "ppb:tbd:card:market:924.237138987/3" } }] },
    },
    {
      __typename: "SwimlaneCardGroup",
      urn: "ppb:tbd:cardgroup:swimlane:X2CgNBIAACgAbuqh/s/1",
      cardGroupTitle: "The Best of Today Action",
      full: {
        edges: [
          {
            node: {
              __typename: "MarketCard",
              urn: "ppb:tbd:card:market:1.171034359/6",
              cardTitle: "Winner 2020/21",
              displayRunners: {
                exchange: {
                  market: {
                    __typename: "ExchangeMarket",
                    urn: "ppb:excMarket:1.171034359",
                    marketType: "WINNER",
                    hierarchy: {
                      __typename: "EventHierarchy",
                      sportevent: {
                        urn: `ppb:event:29979322`,
                      },
                    },
                    runners: [
                      {
                        runnerURN: "ppb:excRunner:1.171034359/47999/0",
                        name: "Man City",
                        selectionId: 47999,
                      },
                      {
                        runnerURN: "ppb:excRunner:1.171034359/56323/0",
                        name: "Liverpool",
                        selectionId: 56323,
                      },
                      {
                        runnerURN: "ppb:excRunner:1.171034359/55190/0",
                        name: "Chelsea",
                        selectionId: 55190,
                      },
                      {
                        runnerURN: "ppb:excRunner:1.171034359/1096/0",
                        name: "Arsenal",
                        selectionId: 1096,
                      },
                      {
                        runnerURN: "ppb:excRunner:1.171034359/48351/0",
                        name: "Man Utd",
                        selectionId: 48351,
                      },
                      {
                        runnerURN: "ppb:excRunner:1.171034359/48224/0",
                        name: "Tottenham",
                        selectionId: 48224,
                      },
                      {
                        runnerURN: "ppb:excRunner:1.171034359/56343/0",
                        name: "Everton",
                        selectionId: 56343,
                      },
                    ],
                  },
                  runners: [
                    { runnerURN: "ppb:excRunner:1.171034359/47999/0" },
                    { runnerURN: "ppb:excRunner:1.171034359/56323/0" },
                    { runnerURN: "ppb:excRunner:1.171034359/55190/0" },
                    { runnerURN: "ppb:excRunner:1.171034359/1096/0" },
                    { runnerURN: "ppb:excRunner:1.171034359/48351/0" },
                    { runnerURN: "ppb:excRunner:1.171034359/48224/0" },
                  ],
                },
              },
            },
          },
        ],
      },
      partials: {
        edges: [{ node: { __typename: "MarketCard", urn: "ppb:tbd:card:market:1.171034359/6" } }],
      },
    },
  ],
};

describe("Outrights and Specials", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
    await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getCardResults(CARDS_MOCK));
    await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
    await browser.waitUntilDisplayed(sportPagePO.scrollableSwimlanes[0]);
    await sportPagePO.cardGroups[2].scrollIntoView();
    await browser.waitUntilEquals(thirdPrimarySwimlane.title, "Daily Acca");
  });

  it("[PRPI-6129] should draw only the defined number of runners on Exchange Market", async () => {
    // exchange market has 7 runners but only shows 6 (numberOfRunnersToDisplay)
    expect(await exchangeMarketFromFourthSwimlane.runnerList.length).toEqual(6);
  });

  it("[PRPI-6130] should draw only the defined number of runners on Sportsbook Market", async () => {
    // sportsbook market has 3 runners but only shows 2 (numberOfRunnersToDisplay)
    expect(await sportsbookMarketFromThirdSwimlane.runnerList.length).toEqual(2);
  });
});
