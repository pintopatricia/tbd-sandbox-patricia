const {
  ObbPvpCardPO,
  ObbPlacePO,
  CurrencyNumberInputFieldPO,
  PrimaryButtonPO,
  AlertPO,
  AlertsPO,
} = require("../../../../../page-objects");
const { getEventLayout, getObbImply, getObbPlaceBets } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const obbPvPCardPO = new ObbPvpCardPO();
const stakeInputFieldPO = new CurrencyNumberInputFieldPO();
const placePanelPO = new ObbPlacePO();
const placeButtonPO = new PrimaryButtonPO(placePanelPO.placeBtn);
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
                                          team: {
                                            id: 56085,
                                            name: "North Macedonia",
                                            __typename: "FootballTeamDetails",
                                          },
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
      id: "c5a35bb87fc24d18",
      details: {
        minStake: 0.1,
        maxStake: 300,
        maxPayout: 100000,
        minStakeIncrement: 0.01,
        price: {
          fractional: {
            numerator: 21,
            denominator: 10,
          },
          decimal: 9.1,
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

async function setupMockResponses(placeBetsResponseError) {
  await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
  const eventLayout = getEventLayout(BFF_MOCK);

  await mockService.mockHttpRequest(eventLayout);
  await mockService.mockHttpRequest(getObbPlaceBets(placeBetsResponseError));
  await mockService.mockHttpRequest(getObbImply(implyBetsResponse));
  await mockService.mockHttpRequest(getWallets(SUCCESSFUL_WAS_REQUEST));

  const url = routes.getEventViewUrl(EVENT_ID);
  await browser.url(url);

  await browser.waitUntilDisplayed(obbPvPCardPO.playerContainer);
}

describe("OBB - Bet Placement Errors", () => {
  describe("when placing an OBB bet on a pvp card", () => {
    describe("And we got a request level error", () => {
      beforeAll(async () => {
        const placeBetsResponseError = {
          betPlacementsResult: [
            {
              id: "SINGLE:[c5a35bb87fc24d18]",
              result: {
                resultCode: "BET_PLACEMENT_RUNNER_FAILURE",
                errorDetails: null,
                legResults: [],
                __typename: "Result",
              },
              betDetails: null,
              __typename: "BetPlacementDetails",
            },
          ],

          result: {
            resultCode: "ACCOUNT_LOCKED",
            errorDetails: null,
            __typename: "ObbResult",
          },
          __typename: "PlaceBetResponse",
        };

        setupMockResponses(placeBetsResponseError);

        // clicks on Add to Betslip button, waits for betslip to show up
        await obbPvPCardPO.firstBetButton.click();
        await browser.waitUntilDisplayed(stakeInputFieldPO.element);
        await stakeInputFieldPO.setValue("1");
        await placeButtonPO.element.click();
      });

      it("[PRPI-6925] we should see a error message", async () => {
        expect(await alertPO.message.getText()).toBe(
          "Your account has been suspended. Please contact the Betfair helpdesk for more information.",
        );
      });

      it("[PRPI-6926] place button should be enable to try to place again", async () => {
        expect(await placeButtonPO.element.isEnabled()).toBe(true);
      });
    });

    describe("And we got a bet level error", () => {
      beforeAll(async () => {
        const placeBetsResponseError = {
          betPlacementsResult: [
            {
              id: "SINGLE:[c5a35bb87fc24d18]",
              result: {
                resultCode: "STAKE_ABOVE_MAXIMUM_ALLOWED",
                errorDetails: null,
                legResults: [],
                __typename: "Result",
              },
              betDetails: null,
              __typename: "BetPlacementDetails",
            },
          ],

          result: {
            resultCode: "BET_PLACEMENT_FAILURE",
            errorDetails: null,
            __typename: "ObbResult",
          },
          __typename: "PlaceBetResponse",
        };

        await mockService.mockHttpRequest(getObbPlaceBets(placeBetsResponseError));

        // clicks to add stake and place bet
        await stakeInputFieldPO.setValue("1");
        await placeButtonPO.element.click();
      });

      it("[PRPI-6927] we should see a error message", async () => {
        expect(await alertPO.message.getText()).toBe("Your stake(s) exceeds the maximum limit.");
      });

      it("[PRPI-6928] place button should be enable to try to place again", async () => {
        expect(await placeButtonPO.element.isEnabled()).toBe(true);
      });
    });

    describe("And we got a leg level error", () => {
      beforeAll(async () => {
        const placeBetsResponseError = {
          betPlacementsResult: [
            {
              id: "SINGLE:[c5a35bb87fc24d18]",
              result: {
                resultCode: "BET_PLACEMENT_RUNNER_FAILURE",
                errorDetails: null,
                legResults: [
                  {
                    resultCode: "EVENT_SUSPENDED",
                    errorDetails: null,
                    __typename: "ObbResult",
                  },
                ],

                __typename: "Result",
              },
              betDetails: null,
              __typename: "BetPlacementDetails",
            },
          ],

          result: {
            resultCode: "BET_PLACEMENT_FAILURE",
            errorDetails: null,
            __typename: "ObbResult",
          },
          __typename: "PlaceBetResponse",
        };

        await mockService.mockHttpRequest(getObbPlaceBets(placeBetsResponseError));

        // clicks to add stake and place bet
        await stakeInputFieldPO.setValue("1");
        await placeButtonPO.element.click();
        await browser.waitUntil(async () => (await placeButtonPO.element.isEnabled()) === false);
      });

      it("[PRPI-6929] we should see a error message", async () => {
        expect(await alertPO.message.getText()).toBe("Event suspended.");
      });

      it("[PRPI-6930] and if is a suspended error the place button should be disabled", async () => {
        expect(await placeButtonPO.element.isEnabled()).toBe(false);
      });
    });
  });
});
