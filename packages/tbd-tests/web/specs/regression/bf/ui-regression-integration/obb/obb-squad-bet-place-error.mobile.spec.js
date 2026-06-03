const { getEventLayout, getObbImply, getObbQuotes } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const {
  ObbBetButtonsCarouselPO,
  CurrencyNumberInputFieldPO,
  AlertPO,
  AlertsPO,
  BetslipDrawerPO,
  MinimizedPO,
} = require("../../../../../page-objects");

const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const obbBetButtonsCarouselPO = new ObbBetButtonsCarouselPO();
const stakeInputFieldPO = new CurrencyNumberInputFieldPO();
const alertsPO = new AlertsPO();
const alertPO = new AlertPO(alertsPO.element);
const betslipDrawerPO = new BetslipDrawerPO();
const minimizedPO = new MinimizedPO();

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
                eventId: 33755137,
                name: "North Macedonia v Latvia",
                openDate: "1985-02-05T19:30:00.000Z",
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
                                      __typename: "ObbSquadBetCard",
                                      urn: "ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/33755137",
                                      title: {
                                        __typename: "DisplayNameTitle",
                                        name: "Race To X Points",
                                      },
                                      outcomesLabel: {
                                        __typename: "DisplayNameTitle",
                                        name: "Race To X Points",
                                      },
                                      statsLabel: {
                                        __typename: "DisplayNameTitle",
                                        name: "Race To X Points",
                                      },
                                      event: {
                                        __typename: "SportsEvent",
                                        urn: "ppb:event:33755137",
                                        name: "North Macedonia v Latvia",
                                        eventId: 33755137,
                                      },
                                      eventParticipants: [
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:11111/e/33755137",
                                          player: {
                                            id: "11111",
                                            name: "Cole Palmer",
                                            position: null,
                                            seasonStats: {
                                              matchesPlayed: 25,
                                              averages: {
                                                goals: 0.61,
                                                redCards: 0,
                                                yellowCards: 0.23,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 1.31,
                                                totalShots: 3.31,
                                                fouls: 1.2,
                                                foulsWon: 0.8,
                                                assists: 0.3,
                                                passes: 42.5,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "56085",
                                            name: "North Macedonia",
                                            color: "#FF0000",
                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:22222/e/33755137",
                                          player: {
                                            id: "22222",
                                            name: "Nicolas Jackson",
                                            position: null,
                                            seasonStats: {
                                              matchesPlayed: 28,
                                              averages: {
                                                goals: 0.61,
                                                redCards: 0,
                                                yellowCards: 0.31,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 1.54,
                                                totalShots: 2.38,
                                                fouls: 1.5,
                                                foulsWon: 1.1,
                                                assists: 0.4,
                                                passes: 38.7,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "56085",
                                            name: "North Macedonia",
                                            color: "#FF0000",
                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:33333/e/33755137",
                                          player: {
                                            id: "33333",
                                            name: "Radamel Falcao",
                                            position: null,
                                            seasonStats: {
                                              matchesPlayed: 18,
                                              averages: {
                                                goals: 0.1,
                                                redCards: 0,
                                                yellowCards: 0.31,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 1.22,
                                                totalShots: 1.54,
                                                fouls: 0.9,
                                                foulsWon: 0.7,
                                                assists: 0.2,
                                                passes: 29.3,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "56085",
                                            name: "North Macedonia",
                                            color: "#FF0000",
                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                      ],

                                      squadParticipants: [
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:11111/e/33755137",
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:22222/e/33755137",
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:33333/e/33755137",
                                        },
                                      ],

                                      incidentType: {
                                        id: "GOALS_TIME_ADJUSTED",
                                        __typename: "ObbIncidentType",
                                      },
                                      defaultLegs: [
                                        {
                                          __typename: "ObbLeg",
                                          templateId: "participantsCombined",
                                          templateParams: {
                                            __typename: "ObbSquadBetParams",
                                            participantIds: [
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:11111/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:22222/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:33333/e/33755137",
                                              },
                                            ],

                                            outcomeIds: ["GOALS"],
                                            value: 1,
                                            timePeriodId: "MATCH",
                                            quantifier: "AT_LEAST",
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
                                            __typename: "SportsEvent",
                                            urn: "ppb:event:33755137",
                                            name: "North Macedonia v Latvia",
                                            eventId: 33755137,
                                          },
                                        },
                                        {
                                          __typename: "ObbLeg",
                                          templateId: "participantsCombined",
                                          templateParams: {
                                            __typename: "ObbSquadBetParams",
                                            participantIds: [
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:11111/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:22222/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:33333/e/33755137",
                                              },
                                            ],

                                            outcomeIds: ["GOALS"],
                                            value: 2,
                                            timePeriodId: "MATCH",
                                            quantifier: "AT_LEAST",
                                          },
                                          quote: {
                                            __typename: "ObbQuoteSuccess",
                                            price: {
                                              decimal: 3.5,
                                              fractional: {
                                                numerator: 5,
                                                denominator: 2,
                                                __typename: "FractionalOdds",
                                              },
                                              __typename: "ObbOdds",
                                            },
                                          },
                                          event: {
                                            __typename: "SportsEvent",
                                            urn: "ppb:event:33755137",
                                            name: "North Macedonia v Latvia",
                                            eventId: 33755137,
                                          },
                                        },
                                        {
                                          __typename: "ObbLeg",
                                          templateId: "participantsCombined",
                                          templateParams: {
                                            __typename: "ObbSquadBetParams",
                                            participantIds: [
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:11111/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:22222/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:33333/e/33755137",
                                              },
                                            ],

                                            outcomeIds: ["GOALS"],
                                            value: 3,
                                            timePeriodId: "MATCH",
                                            quantifier: "AT_LEAST",
                                          },
                                          quote: {
                                            __typename: "ObbQuoteSuccess",
                                            price: {
                                              decimal: 6.0,
                                              fractional: {
                                                numerator: 5,
                                                denominator: 1,
                                                __typename: "FractionalOdds",
                                              },
                                              __typename: "ObbOdds",
                                            },
                                          },
                                          event: {
                                            __typename: "SportsEvent",
                                            urn: "ppb:event:33755137",
                                            name: "North Macedonia v Latvia",
                                            eventId: 33755137,
                                          },
                                        },
                                        {
                                          __typename: "ObbLeg",
                                          templateId: "participantsCombined",
                                          templateParams: {
                                            __typename: "ObbSquadBetParams",
                                            participantIds: [
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:11111/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:22222/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:33333/e/33755137",
                                              },
                                            ],

                                            outcomeIds: ["GOALS"],
                                            value: 4,
                                            timePeriodId: "MATCH",
                                            quantifier: "AT_LEAST",
                                          },
                                          quote: {
                                            __typename: "ObbQuoteSuccess",
                                            price: {
                                              decimal: 10.0,
                                              fractional: {
                                                numerator: 9,
                                                denominator: 1,
                                                __typename: "FractionalOdds",
                                              },
                                              __typename: "ObbOdds",
                                            },
                                          },
                                          event: {
                                            __typename: "SportsEvent",
                                            urn: "ppb:event:33755137",
                                            name: "North Macedonia v Latvia",
                                            eventId: 33755137,
                                          },
                                        },
                                        {
                                          __typename: "ObbLeg",
                                          templateId: "participantsCombined",
                                          templateParams: {
                                            __typename: "ObbSquadBetParams",
                                            participantIds: [
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:11111/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:22222/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:33333/e/33755137",
                                              },
                                            ],

                                            outcomeIds: ["GOALS"],
                                            value: 5,
                                            timePeriodId: "MATCH",
                                            quantifier: "AT_LEAST",
                                          },
                                          quote: {
                                            __typename: "ObbQuoteSuccess",
                                            price: {
                                              decimal: 20.0,
                                              fractional: {
                                                numerator: 19,
                                                denominator: 1,
                                                __typename: "FractionalOdds",
                                              },
                                              __typename: "ObbOdds",
                                            },
                                          },
                                          event: {
                                            __typename: "SportsEvent",
                                            urn: "ppb:event:33755137",
                                            name: "North Macedonia v Latvia",
                                            eventId: 33755137,
                                          },
                                        },
                                      ],

                                      defaultOutcomeIndex: 0,
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
      id: "92d7fa3a976b4ffb",
      details: {
        minStake: 0.1,
        maxStake: 11.83,
        maxPayout: 100000,
        minStakeIncrement: 0.01,
        currency: "GBP",
        price: {
          fractional: {
            numerator: 5,
            denominator: 2,
          },
          decimal: 3.5,
        },
      },
      result: {
        resultCode: "SUCCESS",
        errorDetails: null,
      },
    },
  ],

  combinedBetDefinitions: [],
};

const cardQuotesError = {
  quotes: {
    eventId: {
      id: "33755137",
      supplier: "SPORTEX",
      __typename: "EventId",
    },
    prices: [
      {
        id: "fb6cff2c87b30f78",
        price: null,
        result: {
          resultCode: "BETTING_IN_PLAY_NOT_ALLOWED",
          errorDetails: "Error",
          __typename: "ObbResult",
        },
        __typename: "ObbQuote",
      },
    ],
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

const SUCCESSFUL_WAS_REQUEST = [{ walletName: "MAIN", amount: "20" }];

const BFF_MOCK = responseToTemplate(bffResponse);

describe("OBB - Squad Bet Place Errors", () => {
  describe("Given I'm on an event page", () => {
    describe("And I have a squadbet card", () => {
      describe("And I already have a bet on betslip", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
          const eventLayout = getEventLayout(BFF_MOCK);

          await mockService.mockHttpRequest(eventLayout);
          await mockService.mockHttpRequest(getObbImply(implyBetsResponse));
          await mockService.mockHttpRequest(getObbQuotes(cardQuotesError));
          await mockService.mockHttpRequest(getWallets(SUCCESSFUL_WAS_REQUEST));

          const url = routes.getEventViewUrl(EVENT_ID);
          await browser.url(url);

          obbBetButtonsCarouselPO.betButtons[1].click();
        });

        describe("When the event changes to inplay", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getObbQuotes(cardQuotesError));
            await stakeInputFieldPO.setValue("1");
            await betslipDrawerPO.header.waitForClickable();
            await betslipDrawerPO.header.click();
            await minimizedPO.element.waitForClickable();
            await minimizedPO.element.click();
          });

          it("[PRPI-5193]And an error 'The game has kicked off' is displayed on the top of the betslip", async () => {
            expect(await alertPO.message.getText()).toBe("The game has kicked off. This bet is not available in-play.");
          });
        });
      });
    });
  });
});
