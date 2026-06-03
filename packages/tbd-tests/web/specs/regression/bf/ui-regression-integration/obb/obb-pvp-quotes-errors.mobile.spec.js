const {
  ObbPvpCardPO,
  SportsbookBetButtonPO,
  AlertPO,
  AlertsPO,
  BetslipDrawerPO,
  MinimizedPO,
} = require("../../../../../page-objects");
const { getEventLayout, getObbQuotes, getObbImply } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const betslipDrawerPO = new BetslipDrawerPO();
const minimizedPO = new MinimizedPO();

const obbPvPCardPO = new ObbPvpCardPO();
const betButtonPO = new SportsbookBetButtonPO();
const alertsPO = new AlertsPO();
const alertPO = new AlertPO(alertsPO.element);

const mockService = new MockService();

const EVENT_ID = "33755137";

const bffResponse = {
  data: {
    View: {
      __typename: "EventView",
      urn: "ppb:tbd:view:event:33755137",
      url: "football/uefa-nations-league/north-macedonia-v-latvia/e-33755137",
      sportevent: {
        __typename: "SportsEvent",
        urn: "ppb:event:33755137",
        eventId: 33755137,
        name: "North Macedonia v Latvia",
        openDate: "2024-11-14T19:45:00.000Z",
        competition: {
          __typename: "Competition",
          urn: "ppb:competition:11984200",
          name: "UEFA Nations League",
          competitionId: 11984200,
          sport: {
            __typename: "Sport",
            urn: "ppb:eventType:1",
            name: "Football",
            shortName: null,
            sportId: 1,
          },
          logo: {},
          country: {
            urn: "",
            code: "",
            flag: {
              vector: "",
            },
          },
        },
      },
      leftSidebar: {
        __typename: "LeftSidebar",
        items: {
          edges: [],
        },
        pageInfo: null,
      },
      items: {
        pageInfo: {
          nextPageCursor: "TUFUQ0hfT0REUyxDT1JSRUNUX1NDT1JFLE9WRVJfVU5ERVJfMDUsT1ZFUl9VTkRFUl8xNQ==",
        },
        edges: [
          {
            node: {
              __typename: "ObbCardGroup",
              urn: "ppb:obb:cardgroup:ZylnFBIAAB8AKIpz/e/33755137",
              obbCardGroupTitle: {
                __typename: "DisplayNameTitle",
                name: "Match Ups",
              },
              event: {
                urn: "ppb:event:33755137",
                name: "North Macedonia v Latvia",
                openDate: "1985-02-05T19:30:00.000Z",
                eventId: 33755137,
              },
              bettingWindowOffset: 24,
              moreInfoLabel: {
                name: "More Info",
                __typename: "DisplayNameTitle",
              },
              moreInfo: {
                moreInfoDetails: [
                  {
                    type: "heading5",
                    text: "Rich Content Heading",
                    spans: null,
                    __typename: "RichText",
                  },
                  {
                    type: "paragraph",
                    text: "Rich content paragraph",
                    spans: null,
                    __typename: "RichText",
                  },
                  {
                    type: "url_link",
                    text: "Some url",
                    spans: [
                      {
                        start: 0,
                        end: 25,
                        style: "undefined",
                        viewLink: {
                          viewUrn: "ppb:tbd:view:external:external",
                          viewUrl: "https://www.betfair.com/betting/",
                          viewDisplayMode: "BLANK_INAPP",
                          __typename: "ViewLink",
                        },
                        __typename: "RichTextSpan",
                      },
                    ],

                    __typename: "RichText",
                  },
                ],
              },
              obbCardGroupSections: {
                edges: [
                  {
                    node: {
                      __typename: "ObbSection",
                      icon: {
                        id: "Two-Up-Early-Payout",
                        category: "Value",
                      },
                      obbSectionTitle: {
                        __typename: "DisplayNameTitle",
                        name: "Section Title Test 1",
                      },
                      urn: "ppb:obb:section:aQne5RIAACUAl7iV/e/33755137",
                      layouts: {
                        edges: [
                          {
                            node: {
                              __typename: "ObbCardsStackedLayout",
                              title: {
                                __typename: "DisplayNameTitle",
                                name: "Stacked title 1",
                              },
                              urn: "ppb:obb:cardslayout:stacked:ZylnFBIAAB8AKIpz/obb_cards_layout$b65dbf9d-53fd-4969-83ee-f59b444ec72a/e/33755137",
                              cards: {
                                edges: [
                                  {
                                    node: {
                                      __typename: "ObbPvpCard",
                                      urn: "ppb:obb:card:pvp:ZypHBBIAACAAKdvU/e/33755137",
                                      title: { name: "Match Ups" },
                                      event: { urn: "ppb:event:33755137", __typename: "SportsEvent" },
                                      participants: [
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:86724/e/33755137",
                                          player: {
                                            id: "19488",
                                            name: "Casemiro",
                                            position: null,
                                            shirtNumber: null,
                                            seasonStats: {
                                              matchesPlayed: 15,
                                              averages: {
                                                goals: 0.27,
                                                redCards: 0,
                                                yellowCards: 0.33,
                                                yellowRedCards: 0.07,
                                                shotsOnTarget: 0.4,
                                                totalShots: 1.6,
                                                fouls: 1.47,
                                                foulsWon: 0.93,
                                                assists: 0.07,
                                                passes: 38.93,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "13",
                                            name: "Man Utd",
                                            color: "DA291C",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/Man_Utd_Home_Jersey.png",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:102114/e/33755137",
                                          player: {
                                            id: "19489",
                                            name: "Bruno Fernandes",
                                            position: null,
                                            shirtNumber: null,
                                            seasonStats: {
                                              matchesPlayed: 15,
                                              averages: {
                                                goals: 0.27,
                                                redCards: 0,
                                                yellowCards: 0.33,
                                                yellowRedCards: 0.07,
                                                shotsOnTarget: 0.4,
                                                totalShots: 1.6,
                                                fouls: 1.47,
                                                foulsWon: 0.93,
                                                assists: 0.07,
                                                passes: 38.93,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "15",
                                            name: "Man Utd",
                                            color: "DA291D",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/Man_Utd_Home_Jersey.png",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:102115/e/33755137",
                                          player: {
                                            id: "19490",
                                            name: "Mason Mount",
                                            position: null,
                                            shirtNumber: null,
                                            seasonStats: {
                                              matchesPlayed: 15,
                                              averages: {
                                                goals: 0.27,
                                                redCards: 0,
                                                yellowCards: 0.33,
                                                yellowRedCards: 0.07,
                                                shotsOnTarget: 0.4,
                                                totalShots: 1.6,
                                                fouls: 1.47,
                                                foulsWon: 0.93,
                                                assists: 0.07,
                                                passes: 38.93,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "16",
                                            name: "Man Utd",
                                            color: "DA291E",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/Man_Utd_Home_Jersey.png",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                      ],

                                      participantInfo: {
                                        name: "This season's average stats per game for the selected competition.",
                                        __typename: "DisplayNameTitle",
                                      },
                                      incidentType: {
                                        id: "SHOTS_ON_TARGET_TIME_ADJUSTED",
                                        __typename: "ObbIncidentType",
                                      },
                                      defaultLegs: [
                                        {
                                          __typename: "ObbLeg",
                                          templateId: "playerVsPlayer",
                                          templateParams: {
                                            __typename: "ObbPvpParams",
                                            participantIdA: {
                                              __typename: "ObbFootballPlayer",
                                              urn: "ppb:obb:footballPlayer:102114/e/33755137",
                                            },
                                            participantIdB: {
                                              __typename: "ObbFootballPlayer",
                                              urn: "ppb:obb:footballPlayer:86724/e/33755137",
                                            },
                                            outcomeId: "SHOTS_ON_TARGET_TIME_ADJUSTED",
                                            timePeriodId: "MATCH",
                                          },
                                          quote: {
                                            __typename: "ObbQuoteSuccess",
                                            price: {
                                              decimal: 2,
                                              fractional: {
                                                numerator: 1,
                                                denominator: 1,
                                                __typename: "FractionalOdds",
                                              },
                                              __typename: "SportsbookOdds",
                                            },
                                          },
                                          event: {
                                            urn: "ppb:event:33755137",
                                            name: "North Macedonia v Latvia",
                                            eventId: 33755137,
                                            __typename: "SportsEvent",
                                          },
                                        },
                                        {
                                          __typename: "ObbLeg",
                                          templateId: "playerVsPlayer",
                                          templateParams: {
                                            __typename: "ObbPvpParams",
                                            participantIdA: {
                                              __typename: "ObbFootballPlayer",
                                              urn: "ppb:obb:footballPlayer:86724/e/33755137",
                                            },
                                            participantIdB: {
                                              __typename: "ObbFootballPlayer",
                                              urn: "ppb:obb:footballPlayer:102114/e/33755137",
                                            },
                                            outcomeId: "SHOTS_ON_TARGET_TIME_ADJUSTED",
                                            timePeriodId: "MATCH",
                                          },
                                          quote: {
                                            __typename: "ObbQuoteSuccess",
                                            price: {
                                              decimal: 2,
                                              fractional: {
                                                numerator: 1,
                                                denominator: 1,
                                                __typename: "FractionalOdds",
                                              },
                                              __typename: "SportsbookOdds",
                                            },
                                          },
                                          event: {
                                            urn: "ppb:event:33755137",
                                            name: "North Macedonia v Latvia",
                                            eventId: 33755137,
                                            __typename: "SportsEvent",
                                          },
                                        },
                                      ],
                                    },
                                    __typename: "ObbCardEdge",
                                  },
                                ],
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
      partialItems: {
        pageInfo: null,
        edges: [
          {
            node: {
              __typename: "ObbCardGroup",
              urn: "ppb:obb:cardgroup:ZylnFBIAAB8AKIpz/e/33755137",
            },
          },
        ],
      },
      bottomBar: {
        __typename: "BottomBar",
        tiles: [
          {
            tileType: "HOME",
            viewLink: {
              viewUrn: "ppb:tbd:view:generic:home",
              viewUrl: "",
            },
          },
          {
            tileType: "BROWSE",
            viewLink: {
              viewUrn: "ppb:tbd:view:browse:sports",
              viewUrl: "browse/b-sports",
            },
          },
          {
            tileType: "MY_BETS",
            viewLink: {
              viewUrn: "ppb:tbd:view:myBets:open",
              viewUrl: "mybets/mybets-open",
            },
          },
          {
            tileType: "GAMING",
            viewLink: {
              viewUrn: "ppb:tbd:view:gaming:1",
              viewUrl: "casino/gm-1",
            },
          },
        ],

        hasProductSwitcher: false,
      },
    },
  },
};

const implyBetsResponse = {
  betDefinitions: [
    {
      id: "6ea4f9a07f56312c",
      details: {
        price: {
          decimal: 2,
          fractional: {
            numerator: 1,
            denominator: 1,
            __typename: "FractionalOdds",
          },
          __typename: "SportsbookOdds",
        },
        maxStake: 1000,
        minStake: 0.01,
        minStakeIncrement: 0.01,
        maxPayout: 10000,
      },
      result: {
        resultCode: "SUCCESS",
        errorDetails: null,
      },
    },
  ],

  combinedBetDefinitions: [],
  result: {
    resultCode: "SUCCESS",
    errorDetails: null,
  },
};

function responseToTemplate(json) {
  return {
    urn: json.data.View.urn,
    url: json.data.View.url,
    sportevent: json.data.View.sportevent,
    edges: json.data.View.items.edges,
    partialEdges: json.data.View.partialItems.edges,
  };
}

const SUCCESSFUL_WAS_REQUEST = [{ walletName: "MAIN", amount: "123" }];

const BFF_MOCK = responseToTemplate(bffResponse);

describe("OBB - Quote Errors", () => {
  describe("when adding an OBB bet on a pvp card", () => {
    describe("And we got a quote error response", () => {
      beforeAll(async () => {
        const quoteResponseError = {
          quotes: {
            eventId: {
              id: "33755137",
              supplier: "SPORTEX",
            },
            prices: [
              {
                id: "6ea4f9a07f56312c",
                result: {
                  resultCode: "EVENT_SUSPENDED",
                },
              },
            ],
          },
        };

        await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
        const eventLayout = getEventLayout(BFF_MOCK);

        await mockService.mockHttpRequest(eventLayout);
        await mockService.mockHttpRequest(getObbImply(implyBetsResponse));
        await mockService.mockHttpRequest(getObbQuotes(quoteResponseError));
        await mockService.mockHttpRequest(getWallets(SUCCESSFUL_WAS_REQUEST));

        const url = routes.getEventViewUrl(EVENT_ID);
        await browser.url(url);

        await browser.waitUntilDisplayed(obbPvPCardPO.playerContainer);

        await betButtonPO.element.click();

        // this triggers the quotes call
        await betslipDrawerPO.header.click();
        await minimizedPO.element.click();
      });

      it("[PRPI-7114] we should see a error message", async () => {
        expect(await alertPO.message.getText()).toBe("Event suspended.");
      });
    });

    describe("And we got a GENERAL_FAILURE error response", () => {
      beforeAll(async () => {
        const quoteResponseError = {
          quotes: {
            eventId: {
              id: "33755137",
              supplier: "SPORTEX",
            },
            prices: [
              {
                id: "6ea4f9a07f56312c",
                result: {
                  resultCode: "GENERAL_FAILURE",
                },
              },
            ],
          },
        };

        await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
        const eventLayout = getEventLayout(BFF_MOCK);

        await mockService.mockHttpRequest(eventLayout);
        await mockService.mockHttpRequest(getObbImply(implyBetsResponse));
        await mockService.mockHttpRequest(getObbQuotes(quoteResponseError));
        await mockService.mockHttpRequest(getWallets(SUCCESSFUL_WAS_REQUEST));

        const url = routes.getEventViewUrl(EVENT_ID);
        await browser.url(url);

        await browser.waitUntilDisplayed(obbPvPCardPO.playerContainer);

        // this triggers the quotes call
        await betslipDrawerPO.header.click();
        await minimizedPO.element.click();
      });

      it("[PRPI-7115] we should not see a error message", async () => {
        expect(await alertPO.element.isDisplayed()).toBe(false);
      });
    });
  });
});
