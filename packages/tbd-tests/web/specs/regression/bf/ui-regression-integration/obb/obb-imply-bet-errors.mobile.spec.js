const {
  ObbPvpCardPO,
  SportsbookBetButtonPO,
  AlertPO,
  AlertsPO,
  BetslipDrawerPO,
  MinimizedPO,
} = require("../../../../../page-objects");
const { getEventLayout, getObbImply, getObbQuotes } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const obbPvPCardPO = new ObbPvpCardPO();

const firstBetButton = new SportsbookBetButtonPO(obbPvPCardPO.firstBetButton);
const secondBetButton = new SportsbookBetButtonPO(obbPvPCardPO.secondBetButton);
const betslipDrawerPO = new BetslipDrawerPO();
const minimizedPO = new MinimizedPO();

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
                                      event: { urn: "ppb:event:33755137", __typename: "SportsEvent" },
                                      participants: [
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:86724/e/33755137",
                                          player: {
                                            id: "86724",
                                            name: "Cole Palmer",
                                            position: null,
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
                                          team: { name: "North Macedonia", __typename: "FootballTeamDetails" },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:102114/e/33755137",
                                          player: {
                                            id: "102114",
                                            name: "Nicolas Jackson",
                                            position: null,
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
                                          team: { name: "Latvia", __typename: "FootballTeamDetails" },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:102115/e/33755137",
                                          player: {
                                            id: "102115",
                                            name: "Radamel Falcao",
                                            position: null,
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
                                          team: { name: "Latvia", __typename: "FootballTeamDetails" },
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

const legsQuotes = {
  quotes: {
    eventId: {
      id: "33755137",
      supplier: "SPORTEX",
    },
    prices: [
      {
        id: "6ea4f9a07f56312c",
        price: {
          decimal: 9.1,
          fractional: {
            numerator: 21,
            denominator: 10,
            __typename: "FractionalOdds",
          },
        },
        result: {
          resultCode: "SUCCESS",
        },
      },
    ],
  },
};

async function setupMockResponses(implyBetsResponseError) {
  await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
  const eventLayout = getEventLayout(BFF_MOCK);

  await mockService.mockHttpRequest(eventLayout);
  await mockService.mockHttpRequest(getObbImply(implyBetsResponseError));
  await mockService.mockHttpRequest(getObbQuotes(legsQuotes));
  await mockService.mockHttpRequest(getWallets(SUCCESSFUL_WAS_REQUEST));

  const url = routes.getEventViewUrl(EVENT_ID);
  await browser.url(url);

  await browser.waitUntilDisplayed(obbPvPCardPO.playerContainer);
}

describe("OBB - Imply Bet Errors", () => {
  describe("when adding an OBB bet on a pvp card", () => {
    describe("And we got a request level error", () => {
      beforeAll(async () => {
        const implyBetsResponseError = {
          betDefinitions: [
            {
              id: "6ea4f9a07f56312c",
              details: null,
              result: {
                resultCode: "ACCOUNT_LOCKED",
                errorDetails: null,
              },
            },
          ],

          combinedBetDefinitions: [],
          result: {
            resultCode: "ACCOUNT_LOCKED",
            errorDetails: null,
          },
        };

        await setupMockResponses(implyBetsResponseError);

        await firstBetButton.element.click();
      });

      it("[PRPI-7024] we should see a error message", async () => {
        expect(await alertPO.message.getText()).toBe(
          "Your account has been suspended. Please contact the Betfair helpdesk for more information.",
        );
      });
    });

    describe("And we got a bet level error", () => {
      beforeAll(async () => {
        const initialImplyBetsResponse = {
          betDefinitions: [
            {
              id: "6ea4f9a07f56312c",
              details: {
                maxStake: 100,
                minStake: 1,
                maxPayout: 1000,
                minStakeIncrement: 0.01,
                price: {
                  decimal: 9.1,
                  fractional: {
                    numerator: 21,
                    denominator: 10,
                    __typename: "FractionalOdds",
                  },
                },
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

        const implyBetsResponseError = {
          betDefinitions: [
            {
              id: "6ea4f9a07f56312c",
              details: {
                maxStake: 100,
                minStake: 1,
                maxPayout: 1000,
                minStakeIncrement: 0.01,
                price: {
                  decimal: 9.1,
                  fractional: {
                    numerator: 21,
                    denominator: 10,
                    __typename: "FractionalOdds",
                  },
                },
              },
              result: {
                resultCode: "SUCCESS",
                errorDetails: null,
              },
            },
            {
              id: "254b317f53db4c67",
              details: {
                maxStake: 100,
                minStake: 1,
                maxPayout: 1000,
                minStakeIncrement: 0.01,
                price: {
                  decimal: 9.1,
                  fractional: {
                    numerator: 21,
                    denominator: 10,
                    __typename: "FractionalOdds",
                  },
                },
              },
              result: {
                resultCode: "SUCCESS",
                errorDetails: null,
              },
            },
          ],

          combinedBetDefinitions: [
            {
              details: null,
              result: {
                resultCode: "STAKE_ABOVE_MAXIMUM_ALLOWED",
                errorDetails: null,
              },
              legs: [
                {
                  baseExpressionTemplateDefinitions: [
                    {
                      expressionTemplateId: "playerVsPlayer",
                    },
                    {
                      expressionTemplateId: "playerVsPlayer",
                    },
                  ],

                  betDefinitions: ["6ea4f9a07f56312c", "254b317f53db4c67"],
                  eventId: {
                    id: "33755137",
                    supplier: "SPORTEX",
                  },
                  expressionTemplateId: "xOfN",
                  expressionParams: {
                    baseBets: [
                      {
                        templateId: "playerVsPlayer",
                        params: {
                          outcomeId: "SHOTS_ON_TARGET_TIME_ADJUSTED",
                          timePeriodId: "MATCH",
                          participantIdA: "86724",
                          participantIdB: "102114",
                        },
                      },
                      {
                        templateId: "playerVsPlayer",
                        params: {
                          outcomeId: "SHOTS_ON_TARGET_TIME_ADJUSTED",
                          timePeriodId: "MATCH",
                          participantIdA: "102114",
                          participantIdB: "86724",
                        },
                      },
                    ],

                    x: 2,
                  },
                  result: {
                    resultCode: "STAKE_ABOVE_MAXIMUM_ALLOWED",
                    errorDetails: null,
                  },
                },
              ],
            },
          ],

          result: {
            resultCode: "SUCCESS",
            errorDetails: null,
          },
        };

        await setupMockResponses(initialImplyBetsResponse);

        await mockService.mockHttpRequest(getObbImply(implyBetsResponseError));
        await betslipDrawerPO.header.click();
        await secondBetButton.element.click();
        await minimizedPO.element.click();
      });

      it("[PRPI-7025] we should see a error message", async () => {
        expect(await alertPO.message.getText()).toBe("Your stake(s) exceeds the maximum limit.");
      });
    });

    describe("And we got a leg level error", () => {
      beforeAll(async () => {
        const implyBetsResponseError = {
          betDefinitions: [
            {
              id: "6ea4f9a07f56312c",
              details: null,
              result: {
                resultCode: "OUTCOME_DEFINITION_SUSPENDED",
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

        await setupMockResponses(implyBetsResponseError);

        // the imply request was not being triggered, and to maintain the old behaviour we remove the second bet (and trigger the imply)
        await mockService.mockHttpRequest(getObbImply(implyBetsResponseError));
        await betslipDrawerPO.header.click();
        await secondBetButton.element.click();
      });

      it("[PRPI-7026] we should see a error message", async () => {
        expect(await alertPO.message.getText()).toBe("This bet is suspended.");
      });
    });

    describe("And we got a blockList error", () => {
      beforeAll(async () => {
        const implyBetsResponseError = {
          betDefinitions: [
            {
              id: "6ea4f9a07f56312c",
              details: null,
              result: {
                resultCode: "GENERAL_FAILURE",
                errorDetails: null,
              },
            },
          ],

          combinedBetDefinitions: [],
          result: {
            resultCode: "GENERAL_FAILURE",
            errorDetails: null,
          },
        };

        await setupMockResponses(implyBetsResponseError);
      });

      it("[PRPI-7027] we should not see a error message", async () => {
        expect(await alertPO.element.isDisplayed()).toBe(false);
      });
    });
  });
});
