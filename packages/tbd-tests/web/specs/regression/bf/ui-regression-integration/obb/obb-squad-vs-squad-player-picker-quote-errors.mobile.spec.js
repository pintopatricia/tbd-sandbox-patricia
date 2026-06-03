const { getEventLayout, getObbQuotes, getObbEventParticipants } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const {
  ObbSquadVsSquadCardPO,
  MicroPlayerPO,
  ActionLinkPO,
  ObbSquadVsSquadPlayerPickerPO,
  AlertPO,
} = require("../../../../../page-objects");

const MockService = require("../../../../../mock-essentials/mocking-service");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const routes = require("../../../../../../utils/routes");

const obbSquadVsSquadCardPO = new ObbSquadVsSquadCardPO();
const firstMicroPlayerPO = new MicroPlayerPO(obbSquadVsSquadCardPO.firstMicroPlayer);
const secondMicroPlayerPO = new MicroPlayerPO(obbSquadVsSquadCardPO.secondMicroPlayer);
const firstEditSquadLinkPO = new ActionLinkPO(obbSquadVsSquadCardPO.firstEditSquadLink);

const obbSquadVsSquadPlayerPickerPO = new ObbSquadVsSquadPlayerPickerPO();
const alertPO = new AlertPO();

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
                              title: null,
                              urn: "ppb:obb:cardslayout:stacked:ZylnFBIAAB8AKIpz/obb_cards_layout$b65dbf9d-53fd-4969-83ee-f59b444ec72a/e/33755137",
                              cards: {
                                edges: [
                                  {
                                    node: {
                                      __typename: "ObbSquadVsSquadCard",
                                      urn: "ppb:obb:card:squadVsSquad:aAZWeREAACAAel7O/e/33755137",
                                      showModalEntryPoint: true,
                                      title: {
                                        __typename: "DisplayNameTitle",
                                        name: "Race To X Points",
                                      },
                                      outcomesText: {
                                        __typename: "DisplayNameTitle",
                                        name: "How many goals between them?",
                                      },
                                      statsText: {
                                        __typename: "DisplayNameTitle",
                                        name: "Avg goals combined",
                                      },
                                      participantInfo: {
                                        __typename: "DisplayNameTitle",
                                        name: "This season's average stats per game for the selected competition. No stats available for the first match of each competition.",
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
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:44444/e/33755137",
                                          player: {
                                            id: "44444",
                                            name: "Osmande Diomande",
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
                                            id: "16085",
                                            name: "Latvia",
                                            color: "#FF0000",
                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:55555/e/33755137",
                                          player: {
                                            id: "55555",
                                            name: "Luis Suarez",
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
                                            id: "16085",
                                            name: "Latvia",
                                            color: "#FF0000",
                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:66666/e/33755137",
                                          player: {
                                            id: "66666",
                                            name: "Geny Catamo",
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
                                            id: "16085",
                                            name: "Latvia",
                                            color: "#FF0000",
                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                      ],

                                      firstSquadParticipants: [
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:11111/e/33755137",
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:22222/e/33755137",
                                        },
                                      ],

                                      secondSquadParticipants: [
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:44444/e/33755137",
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:55555/e/33755137",
                                        },
                                      ],

                                      incidentType: {
                                        id: "GOALS_TIME_ADJUSTED",
                                        __typename: "ObbIncidentType",
                                      },
                                      defaultLegs: [
                                        {
                                          __typename: "ObbLeg",
                                          templateId: "squadVsSquad",
                                          templateParams: {
                                            __typename: "ObbSquadVsSquadParams",
                                            squadAParticipantIds: [
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:11111/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:22222/e/33755137",
                                              },
                                            ],

                                            squadBParticipantIds: [
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:44444/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:55555/e/33755137",
                                              },
                                            ],

                                            outcomeIds: ["GOALS_TIME_ADJUSTED"],
                                            timePeriodId: "MATCH",
                                            quantifier: "GREATER_THAN",
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
                                          templateId: "squadVsSquad",
                                          templateParams: {
                                            __typename: "ObbSquadVsSquadParams",
                                            squadAParticipantIds: [
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:11111/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:22222/e/33755137",
                                              },
                                            ],

                                            squadBParticipantIds: [
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:44444/e/33755137",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:55555/e/33755137",
                                              },
                                            ],

                                            outcomeIds: ["GOALS_TIME_ADJUSTED"],
                                            timePeriodId: "MATCH",
                                            quantifier: "LESS_THAN",
                                          },
                                          quote: {
                                            __typename: "ObbQuoteSuccess",
                                            price: {
                                              __typename: "ObbOdds",
                                              decimal: 6.5,
                                              fractional: {
                                                __typename: "FractionalOdds",
                                                numerator: 11,
                                                denominator: 2,
                                              },
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

const eventParticipants = {
  eventParticipants: [
    {
      urn: "ppb:obb:footballPlayer:11111/e/33755137",
      incidentTypes: [
        {
          id: "GOALS_TIME_ADJUSTED",
          resultType: {
            max: 3,
            min: 0,
            __typename: "ObbRangeResultType",
          },
          __typename: "ObbIncidentType",
        },
      ],

      __typename: "ObbFootballPlayer",
    },
    {
      urn: "ppb:obb:footballPlayer:22222/e/33755137",
      incidentTypes: [
        {
          id: "GOALS_TIME_ADJUSTED",
          resultType: {
            max: 6,
            min: 0,
            __typename: "ObbRangeResultType",
          },
          __typename: "ObbIncidentType",
        },
      ],

      __typename: "ObbFootballPlayer",
    },
    {
      urn: "ppb:obb:footballPlayer:33333/e/33755137",
      incidentTypes: [
        {
          id: "GOALS_TIME_ADJUSTED",
          resultType: {
            max: 9,
            min: 0,
            __typename: "ObbRangeResultType",
          },
          __typename: "ObbIncidentType",
        },
      ],

      __typename: "ObbFootballPlayer",
    },
    {
      urn: "ppb:obb:footballPlayer:44444/e/33755137",
      incidentTypes: [
        {
          id: "GOALS_TIME_ADJUSTED",
          resultType: {
            max: 6,
            min: 0,
            __typename: "ObbRangeResultType",
          },
          __typename: "ObbIncidentType",
        },
      ],

      __typename: "ObbFootballPlayer",
    },
    {
      urn: "ppb:obb:footballPlayer:55555/e/33755137",
      incidentTypes: [
        {
          id: "GOALS_TIME_ADJUSTED",
          resultType: {
            max: 6,
            min: 0,
            __typename: "ObbRangeResultType",
          },
          __typename: "ObbIncidentType",
        },
      ],

      __typename: "ObbFootballPlayer",
    },
    {
      urn: "ppb:obb:footballPlayer:66666/e/33755137",
      incidentTypes: [
        {
          id: "GOALS_TIME_ADJUSTED",
          resultType: {
            max: 6,
            min: 0,
            __typename: "ObbRangeResultType",
          },
          __typename: "ObbIncidentType",
        },
      ],

      __typename: "ObbFootballPlayer",
    },
  ],

  __typename: "ObbQuery",
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
        id: "ff715c20d4544158",
        price: {
          decimal: 2.22,
          fractional: {
            numerator: 4,
            denominator: 6,
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
        id: "add090742b7f843b",
        price: {
          decimal: 6.5,
          fractional: {
            numerator: 11,
            denominator: 2,
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

const cardQuotesWithOneImpossibleObbChoice = {
  ...cardQuotes,
  quotes: {
    ...cardQuotes.quotes,
    prices: [
      {
        ...cardQuotes.quotes.prices[0],
        price: null,
        result: { resultCode: "IMPOSSIBLE_OBB_CHOICE", errorDetails: null, __typename: "ObbResult" },
      },
      cardQuotes.quotes.prices[1],
    ],
  },
};

function overrideQuotes(newQuote) {
  const newLegs = cardQuotes.quotes.prices.map((leg) => ({
    ...leg,
    ...newQuote,
  }));

  return {
    ...cardQuotes,
    quotes: {
      ...cardQuotes.quotes,
      prices: newLegs,
    },
  };
}

function responseToTemplate(json) {
  return {
    urn: json.data.View.urn,
    url: json.data.View.url,
    sportevent: json.data.View.sportevent,
    edges: json.data.View.items.edges,
    partialEdges: json.data.View.partialItems.edges,
  };
}

const BFF_MOCK = responseToTemplate(bffResponse);

describe("OBB - Squad Vs Squad - Player Picker - Quote Errors", () => {
  describe("Given I'm on an event page", () => {
    beforeEach(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      const eventLayout = getEventLayout(BFF_MOCK);
      await mockService.mockHttpRequest(eventLayout);
      await mockService.mockHttpRequest(getObbEventParticipants(eventParticipants));
      await mockService.mockHttpRequest(getObbQuotes(cardQuotes));

      const url = routes.getEventViewUrl(EVENT_ID);
      await browser.url(url);
    });

    describe("And I have a Squad Vs Squad Card", () => {
      beforeEach(async () => {
        await browser.waitUntilDisplayed(firstEditSquadLinkPO.element);
      });

      it("[PRPI-7159] should have the correct players selected", async () => {
        expect(await firstMicroPlayerPO.microPlayerNameContainer.getText()).toBe("Cole Palmer, Nicolas Jackson");
        expect(await secondMicroPlayerPO.microPlayerNameContainer.getText()).toBe("Osmande Diomande, Luis Suarez");
      });

      describe("When I click on Edit Squad 1 button", () => {
        async function clickEditSquad() {
          await browser.waitUntilDisplayed(firstEditSquadLinkPO.element);
          await firstEditSquadLinkPO.element.click();
          await browser.waitUntilDisplayed(obbSquadVsSquadPlayerPickerPO.element);
        }

        describe("And the event changes to in-play", () => {
          beforeEach(async () => {
            await mockService.mockHttpRequest(
              getObbQuotes(
                overrideQuotes({
                  price: null,
                  result: {
                    resultCode: "BETTING_IN_PLAY_NOT_ALLOWED",
                    errorDetails: null,
                    __typename: "ObbResult",
                  },
                }),
              ),
            );

            await clickEditSquad();
          });

          it("[PRPI-7160] Then an error message is displayed 'Only available before kick-off. To Match Ups please try other matches'", async () => {
            expect(await alertPO.message.getText()).toBe("Only available before kick-off");
            expect(await alertPO.detail.getText()).toBe("To Match Ups please try other matches");
          });
        });

        describe("And the event changes to event suspended", () => {
          beforeEach(async () => {
            await mockService.mockHttpRequest(
              getObbQuotes(
                overrideQuotes({
                  price: null,
                  result: {
                    resultCode: "EVENT_SUSPENDED",
                    errorDetails: null,
                    __typename: "ObbResult",
                  },
                }),
              ),
            );

            await clickEditSquad();
          });

          it("[PRPI-7161] Then an error message is displayed 'Event suspended'", async () => {
            expect(await alertPO.message.getText()).toBe("Event suspended");
          });
        });

        describe("And one of the players is suspended", () => {
          beforeEach(async () => {
            await mockService.mockHttpRequest(
              getObbQuotes(
                overrideQuotes({
                  price: null,
                  result: {
                    resultCode: "OUTCOME_DEFINITION_SUSPENDED",
                    errorDetails: null,
                    __typename: "ObbResult",
                  },
                }),
              ),
            );

            await clickEditSquad();
          });

          it("[PRPI-7162] Then an error message is displayed 'This bet is suspended'", async () => {
            expect(await alertPO.message.getText()).toBe("This bet is suspended");
          });
        });

        describe("And a quoting error occurs", () => {
          beforeEach(async () => {
            await mockService.mockHttpRequest(
              getObbQuotes(
                overrideQuotes({
                  price: null,
                  result: {
                    resultCode: "INVALID_BET_DEFINITION",
                    errorDetails: null,
                    __typename: "ObbResult",
                  },
                }),
              ),
            );

            await clickEditSquad();
          });

          it("[PRPI-7163] Then an error message is displayed 'This bet is not possible. Update your choices to try again'", async () => {
            expect(await alertPO.message.getText()).toBe("This bet is not possible");
            expect(await alertPO.detail.getText()).toBe("Update your choices to try again");
          });
        });

        describe("And an internal error is received", () => {
          beforeEach(async () => {
            await mockService.mockHttpRequest(
              getObbQuotes(
                overrideQuotes({
                  price: null,
                  result: {
                    resultCode: "GENERAL_FAILURE",
                    errorDetails: null,
                    __typename: "ObbResult",
                  },
                }),
              ),
            );

            await clickEditSquad();
          });

          it("[PRPI-7164] Then an error message is displayed 'An internal error has occurred. Please try again'", async () => {
            expect(await alertPO.message.getText()).toBe("An internal error has occurred");
            expect(await alertPO.detail.getText()).toBe("Please try again");
          });
        });

        describe("And an impossible choice error is received", () => {
          beforeEach(async () => {
            await mockService.mockHttpRequest(
              getObbQuotes(
                overrideQuotes({
                  price: null,
                  result: {
                    resultCode: "IMPOSSIBLE_OBB_CHOICE",
                    errorDetails: null,
                    __typename: "ObbResult",
                  },
                }),
              ),
            );

            await clickEditSquad();
          });

          it("[PRPI-7165] Then an error message is displayed 'This bet is not possible. Update your choices to try again'", async () => {
            expect(await alertPO.message.getText()).toBe("This bet is not possible");
            expect(await alertPO.detail.getText()).toBe("Update your choices to try again");
          });
        });

        describe("And an impossible choice error is received on only one leg", () => {
          beforeEach(async () => {
            await mockService.mockHttpRequest(getObbQuotes(cardQuotesWithOneImpossibleObbChoice));

            await clickEditSquad();
          });

          it("[PRPI-7166] Then no error message is displayed", async () => {
            expect(await alertPO.element.isDisplayed()).toBe(false);
          });
        });
      });
    });
  });
});
