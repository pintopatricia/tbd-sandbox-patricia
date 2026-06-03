const { ObbPvpCardPO, ObbPlayersGridPO } = require("../../../../page-objects");
const { getEventLayout, getObbQuotes } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");

const routes = require("../../../../../utils/routes");

const mockService = new MockService();

const obbPvpCardPO = new ObbPvpCardPO();
const obbPlayersGridPO = new ObbPlayersGridPO();

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
                              maxCardsToDisplay: 5,
                              urn: "ppb:obb:cardslayout:stacked:ZylnFBIAAB8AKIpz/obb_cards_layout$b65dbf9d-53fd-4969-83ee-f59b444ec72a/e/33755137",
                              cards: {
                                edges: [
                                  {
                                    node: {
                                      __typename: "ObbPvpCard",
                                      urn: "ppb:obb:card:pvp:ZypHBBIAACAAKdvU1/e/33755137",
                                      title: {
                                        __typename: "DisplayNameTitle",
                                        name: "Stacked title 1",
                                      },
                                      filterTags: [
                                        {
                                          label: {
                                            __typename: "DisplayNameTitle",
                                            name: "Goals",
                                          },
                                          type: "TAG",
                                          __typename: "FilterTag",
                                        },
                                        {
                                          label: {
                                            __typename: "DisplayNameTitle",
                                            name: "Shots",
                                          },
                                          type: "TAG",
                                          __typename: "FilterTag",
                                        },
                                      ],

                                      event: { urn: "ppb:event:33755137", __typename: "SportsEvent" },
                                      teams: {
                                        home: {
                                          id: 56085,
                                          name: "North Macedonia",
                                          color: null,
                                          crest: null,
                                          squad: null,
                                        },
                                        away: {
                                          id: 56086,
                                          name: "Latvia",
                                          color: null,
                                          crest: null,
                                          squad: null,
                                        },
                                      },
                                      participants: [
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:11111/e/33755137",
                                          player: {
                                            id: "11111",
                                            name: "Cole Palmer",
                                            position: "ad carry",
                                            seasonStats: {
                                              averages: {
                                                goals: 0.61,
                                                redCards: 0,
                                                yellowCards: 0.23,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 1.31,
                                                totalShots: 3.31,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: 56085,
                                            name: "North Macedonia",
                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:22222/e/33755137",
                                          player: {
                                            id: "22222",
                                            name: "Nicolas Jackson",
                                            position: "top laner",
                                            seasonStats: {
                                              averages: {
                                                goals: 0.61,
                                                redCards: 0,
                                                yellowCards: 0.31,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 1.54,
                                                totalShots: 2.38,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: 56085,
                                            name: "North Macedonia",
                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:33333/e/33755137",
                                          player: {
                                            id: "33333",
                                            name: "Radamel Falcao",
                                            position: "jungler",
                                            seasonStats: {
                                              averages: {
                                                goals: 0.1,
                                                redCards: 0,
                                                yellowCards: 0.31,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 1.22,
                                                totalShots: 1.54,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: { id: 56086, name: "Latvia", __typename: "FootballTeamDetails" },
                                        },
                                      ],

                                      participantInfo: {
                                        name: "This season's average stats per game for the selected competition.",
                                        __typename: "DisplayNameTitle",
                                      },
                                      incidentType: {
                                        id: "GOALS_TIME_ADJUSTED",
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
                                              urn: "ppb:obb:footballPlayer:22222/e/33755137",
                                            },
                                            participantIdB: {
                                              __typename: "ObbFootballPlayer",
                                              urn: "ppb:obb:footballPlayer:11111/e/33755137",
                                            },
                                            outcomeId: "GOALS_TIME_ADJUSTED",
                                            timePeriodId: "MATCH",
                                          },
                                          quote: {
                                            __typename: "ObbQuoteSuccess",
                                            price: {
                                              decimal: 2.22,
                                              fractional: {
                                                numerator: 4,
                                                denominator: 6,
                                                __typename: "FractionalOdds",
                                              },
                                              __typename: "ObbOdds",
                                            },
                                          },
                                          event: {
                                            urn: "ppb:event:33755137",
                                            name: " North Macedonia v Latvia",
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
                                              urn: "ppb:obb:footballPlayer:11111/e/33755137",
                                            },
                                            participantIdB: {
                                              __typename: "ObbFootballPlayer",
                                              urn: "ppb:obb:footballPlayer:22222/e/33755137",
                                            },
                                            outcomeId: "GOALS_TIME_ADJUSTED",
                                            timePeriodId: "MATCH",
                                          },
                                          quote: {
                                            __typename: "ObbQuoteSuccess",
                                            price: {
                                              decimal: 1.67,
                                              fractional: {
                                                numerator: 4,
                                                denominator: 6,
                                                __typename: "FractionalOdds",
                                              },
                                              __typename: "ObbOdds",
                                            },
                                          },
                                          event: {
                                            urn: "ppb:event:33755137",
                                            name: " North Macedonia v Latvia",
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

const cardQuotes = {
  quotes: {
    eventId: {
      id: "33755137",
      supplier: "SPORTEX",
      __typename: "EventId",
    },
    prices: [
      {
        id: "3c9a9de88816a64f",
        price: {
          decimal: 1,
          fractional: {
            numerator: 1,
            denominator: 1,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
        result: {
          resultCode: "SUCCESS",
          errorDetails: null,
          __typename: "ObbResult",
        },
        __typename: "ObbQuote",
      },
      {
        id: "3c9a9de88816a64f",
        price: {
          decimal: 1,
          fractional: {
            numerator: 1,
            denominator: 1,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
        result: {
          resultCode: "SUCCESS",
          errorDetails: null,
          __typename: "ObbResult",
        },
        __typename: "ObbQuote",
      },
      {
        id: "c5a35bb87fc24d18",
        price: {
          decimal: 2,
          fractional: {
            numerator: 1,
            denominator: 1,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
        result: {
          resultCode: "SUCCESS",
          errorDetails: null,
          __typename: "ObbResult",
        },
        __typename: "ObbQuote",
      },
      {
        id: "43776dd42d290040",
        price: {
          decimal: 2.23,
          fractional: {
            numerator: 1,
            denominator: 1,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
        result: {
          resultCode: "SUCCESS",
          errorDetails: null,
          __typename: "ObbResult",
        },
        __typename: "ObbQuote",
      },
      {
        id: "a62cc2e09c986014",
        price: {
          decimal: 2.25,
          fractional: {
            numerator: 1,
            denominator: 1,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
        result: {
          resultCode: "SUCCESS",
          errorDetails: null,
          __typename: "ObbResult",
        },
        __typename: "ObbQuote",
      },
      {
        id: "fd2fc080180da89b",
        price: {
          decimal: 2.22,
          fractional: {
            numerator: 1,
            denominator: 1,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
        result: {
          resultCode: "SUCCESS",
          errorDetails: null,
          __typename: "ObbResult",
        },
        __typename: "ObbQuote",
      },
    ],
  },
};

const BFF_MOCK = {
  urn: bffResponse.data.View.urn,
  url: bffResponse.data.View.url,
  sportevent: bffResponse.data.View.sportevent,
  edges: bffResponse.data.View.items.edges,
  partialEdges: bffResponse.data.View.partialItems.edges,
};

const MODULE_NAME = "obb_pvp_card";

describe("OBB - Pvp Players Grid", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getObbQuotes(cardQuotes));

    await browser.url(routes.getEventViewUrl(EVENT_ID));

    await obbPvpCardPO.playerParticipants[0].click();

    await browser.waitUntilDisplayed(obbPlayersGridPO.element);
    await browser.waitUntilDisplayed(obbPvpCardPO.playerContainer);
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1483]_should_render_players_grid_correctly`);
  });

  it("[PRPI-1483]_should_render_players_grid_correctly", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1483]_should_render_players_grid_correctly`)).toBe(0);
  });
});
