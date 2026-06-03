const {
  ObbPvpCardPO,
  ObbPlayersGridPO,
  NumberInputFieldPO,
  SportsbookBetButtonPO,
  CurrencyNumberInputFieldPO,
  PrimaryButtonPO,
  ReceiptTitlePO,
  ObbPlayersListCardPO,
  BetDetailsPO,
  SportsbookReceiptPanelPO,
} = require("../../../../../page-objects");

const {
  getEventLayout,
  getObbImply,
  getObbPlaceBets,
  getObbQuotes,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const obbPvpCardPO = new ObbPvpCardPO();
const betDetailsPO = new BetDetailsPO();
const numberInputField = new NumberInputFieldPO();
const betButtonPO = new SportsbookBetButtonPO();
const stakeInputField = new CurrencyNumberInputFieldPO();
const placeButton = new PrimaryButtonPO();
const receiptTitle = new ReceiptTitlePO().element;
const obbPlayersGridPO = new ObbPlayersGridPO();
const firstObbPlayerListCardPO = new ObbPlayersListCardPO(obbPlayersGridPO.players[0]);
const secondObbPlayerListCardPO = new ObbPlayersListCardPO(obbPlayersGridPO.players[1]);

const betReceiptPO = new SportsbookReceiptPanelPO();
const singleSelectionPO = new BetDetailsPO(betReceiptPO.singles[0]);

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
                                      title: { name: "Title Pvp Card" },
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
                                                goals: 0.2,
                                                redCards: 0,
                                                yellowCards: 0.23,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 1.31,
                                                totalShots: 3.31,
                                                foulInvolvements: 1,
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
                                                goals: 0.6,
                                                redCards: 0,
                                                yellowCards: 0.31,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 1.54,
                                                totalShots: 2.38,
                                                foulInvolvements: 3,
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
                                                goals: 0.61,
                                                redCards: 0,
                                                yellowCards: 0.31,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 1.22,
                                                totalShots: 1.54,
                                                foulInvolvements: 4,
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
                                        id: "FOUL_INVOLVEMENTS_TIME_ADJUSTED",
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
                                            outcomeId: "FOUL_INVOLVEMENTS_TIME_ADJUSTED",
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
                                            outcomeId: "FOUL_INVOLVEMENTS_TIME_ADJUSTED",
                                            timePeriodId: "MATCH",
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
      id: "1de31088fb61e99c",
      details: {
        minStake: 0.1,
        maxStake: 11.83,
        maxPayout: 100000,
        minStakeIncrement: 0.01,
        price: {
          fractional: {
            numerator: 21,
            denominator: 10,
          },
          decimal: 3.22,
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

const placeBetsResponse = {
  betPlacementsResult: [
    {
      id: "SINGLE:[1de31088fb61e99c]",
      result: {
        resultCode: "SUCCESS",
        errorDetails: null,
        legResults: [
          {
            resultCode: "SUCCESS",
            errorDetails: null,
            __typename: "ObbResult",
          },
        ],

        __typename: "Result",
      },
      betDetails: {
        id: "urn:sbk:bet:bf:obb:01jd1xb2ncfq0917rvzncw16sm",
        receiptId: "o:01jd1xb2ncf5bsfp02vx0qkw1v",
        betType: "SINGLE",
        placedDate: "2024-11-19T09:51:28.428386001Z",
        price: {
          fractional: {
            numerator: 21,
            denominator: 10,
            __typename: "FractionalOdds",
          },
          decimal: 2.22,
          __typename: "SportsbookOdds",
        },
        stake: 1,
        potentialPayout: 2.22,
        currency: "EUR",
        outcomeBasedLegs: [
          {
            eventId: {
              id: "33755137",
              supplier: "SPORTEX",
              __typename: "EventId",
            },
            price: {
              fractional: {
                numerator: 21,
                denominator: 10,
                __typename: "FractionalOdds",
              },
              decimal: 2.22,
              __typename: "ObbOdds",
            },
            __typename: "OutcomeBasedLeg",
          },
        ],

        __typename: "BetDetails",
      },
      __typename: "BetPlacementDetails",
    },
  ],

  result: {
    resultCode: "SUCCESS",
    errorDetails: null,
    __typename: "ObbResult",
  },
  __typename: "PlaceBetResponse",
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
        id: "7f5e860cc17c1b8",
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
        id: "7f5e860cc17c1b8",
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
        id: "d58341e8e2816327",
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
        id: "b0026410dc43ee70",
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
        id: "31358820a3f68e54",
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
        id: "1de31088fb61e99c",
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

describe("OBB - PvP - Bet Placement", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    const eventLayout = getEventLayout(BFF_MOCK);
    await mockService.mockHttpRequest(eventLayout);
    await mockService.mockHttpRequest(getObbQuotes(cardQuotes));
    await mockService.mockHttpRequest(getObbPlaceBets(placeBetsResponse));
    await mockService.mockHttpRequest(getObbImply(implyBetsResponse));
    const url = routes.getEventViewUrl(EVENT_ID);
    await browser.url(url);

    await browser.waitUntilDisplayed(obbPvpCardPO.playerContainer);
  });

  describe("When change the player", () => {
    describe("when open the first player list", () => {
      beforeAll(async () => {
        await obbPvpCardPO.playerParticipants[0].click();
        await browser.waitUntilDisplayed(obbPlayersGridPO.element);
      });

      it("[PRPI-7104] should display with the default player selected", async () => {
        expect(await secondObbPlayerListCardPO.firstName.getText()).toBe("NICOLAS");
        expect(await secondObbPlayerListCardPO.lastName.getText()).toBe("JACKSON");
      });
    });

    describe("When I click on the first player", () => {
      beforeAll(async () => {
        await firstObbPlayerListCardPO.element.click();
      });

      it("[PRPI-7105] should not display player list", async () => {
        expect(await obbPlayersGridPO.element.isDisplayed()).toBe(false);
      });

      it("[PRPI-7106] should change the selected player to the chosen one", async () => {
        expect(await obbPvpCardPO.playerParticipants[0].getText()).toContain("RADAMEL\nFALCAO");
      });

      it("[PRPI-7107] should display the new odd on add to betslip", async () => {
        expect(await betButtonPO.element.getText()).toBe("R. Falcao\n2.25");
      });
    });
  });

  describe("When clicking on Cole Palmer bet button", () => {
    beforeAll(async () => {
      await obbPvpCardPO.secondBetButton.click();
    });

    it("[PRPI-7108] the selected OBB bet is added to betslip", async () => {
      const titleText = await betDetailsPO.title.getText();
      const subtitleText = await betDetailsPO.subtitle.getText();

      const expectedString =
        "Cole Palmer To Have More Foul Involvements Than Radamel Falcao During Regular Time - North Macedonia v Latvia";
      const resultString = `${titleText} ${subtitleText}`;

      expect(resultString).toBe(expectedString);
    });

    it("[PRPI-7109] the player to win name is displayed", async () => {
      expect(await betDetailsPO.title.getText()).toBe("Cole Palmer");
    });

    it("[PRPI-7110] the outcome is displayed with the name of the other player", async () => {
      expect(await betDetailsPO.subtitle.getText()).toContain("Radamel Falcao");
    });

    it("[PRPI-7111] the odd is displayed", async () => {
      expect(await numberInputField.numberField.getValue()).toBe("3.22");
    });
  });

  describe("When bet is placed", () => {
    beforeAll(async () => {
      await stakeInputField.setValue("1");
      await placeButton.element.click();
      await browser.waitUntilDisplayed(receiptTitle);
    });

    it("[PRPI-7112] the player to win name is displayed on the bet receipt", async () => {
      expect(await singleSelectionPO.title.getText()).toContain("Cole Palmer");
    });

    it("[PRPI-7113] the outcome is displayed with the name of the other player", async () => {
      expect(await singleSelectionPO.subtitle.getText()).toContain(
        "To Have More Foul Involvements Than Radamel Falcao During Regular Time - North Macedonia v Latvia",
      );
    });
  });
});
