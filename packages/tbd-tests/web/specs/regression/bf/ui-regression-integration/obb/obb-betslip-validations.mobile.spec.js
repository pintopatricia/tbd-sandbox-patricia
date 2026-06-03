const {
  ObbPvpCardPO,
  ObbPlacePO,
  CurrencyNumberInputFieldPO,
  PrimaryButtonPO,
  AlertPO,
  AlertsPO,
  OddsMovementPO,
  ObbSingleCardPO,
  FixedNumberInputFieldPO,
  BetslipDrawerPO,
  BetControlsPO,
  MinimizedPO,
  SportsbookPlacePanelPO,
} = require("../../../../../page-objects");
const { getEventLayout, getObbImply, getObbQuotes } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

// OBB PLACE

const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();

const obbPvpBetCardFirst = new ObbSingleCardPO(sportsbookPlacePanelPO.obbSingles[0]);
const betControlsFirstBet = new BetControlsPO(obbPvpBetCardFirst.element);
const stakeInputFirstBet = new CurrencyNumberInputFieldPO(betControlsFirstBet.currencyInput);

const obbPvPCardPO = new ObbPvpCardPO();
const stakeInputFieldPO = new CurrencyNumberInputFieldPO();
const placePanelPO = new ObbPlacePO();
const placeButtonPO = new PrimaryButtonPO(placePanelPO.placeBtn);
const alertsPO = new AlertsPO();
const alertPO = new AlertPO(alertsPO.element);
const controlsPO = new BetControlsPO(placePanelPO.element);
const oddsInputFieldPO = new FixedNumberInputFieldPO(controlsPO.fixedInput);
const oddsMovementPO = new OddsMovementPO(oddsInputFieldPO.oddsMovement);
const betslipDrawerPO = new BetslipDrawerPO();
const minimazedPO = new MinimizedPO();

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

const legsQuotes = {
  quotes: {
    eventId: {
      id: "33755137",
      supplier: "SPORTEX",
      __typename: "EventId",
    },
    prices: [
      {
        id: "c5a35bb87fc24d18",
        price: {
          decimal: 5,
          fractional: {
            numerator: 5,
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

const implyBetsResponse = {
  betDefinitions: [
    {
      id: "c5a35bb87fc24d18",
      details: {
        minStake: 0.1,
        maxStake: 11.83,
        maxPayout: 100000,
        minStakeIncrement: 0.01,
        price: {
          fractional: {
            numerator: 10,
            denominator: 11,
          },
          decimal: 1.91,
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

const secondImplyBetsResponse = {
  betDefinitions: [
    {
      id: "c5a35bb87fc24d18",
      details: {
        minStake: 0.1,
        maxStake: 11.83,
        maxPayout: 100000,
        minStakeIncrement: 0.01,
        price: {
          fractional: {
            numerator: 10,
            denominator: 11,
          },
          decimal: 5,
        },
      },
      result: {
        resultCode: "SUCCESS",
        errorDetails: null,
      },
    },
    {
      id: "43776dd42d290040",
      details: {
        minStake: 0.1,
        maxStake: 11.83,
        maxPayout: 100000,
        minStakeIncrement: 0.01,
        price: {
          fractional: {
            numerator: 10,
            denominator: 11,
          },
          decimal: 5,
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

describe("OBB - Betslip validations", () => {
  describe("when placing an OBB bet on a pvp card", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { oddsMovement: "false" }));
      const eventLayout = getEventLayout(BFF_MOCK);

      await mockService.mockHttpRequest(eventLayout);
      await mockService.mockHttpRequest(getObbImply(implyBetsResponse));
      await mockService.mockHttpRequest(getWallets(SUCCESSFUL_WAS_REQUEST));

      const url = routes.getEventViewUrl(EVENT_ID);
      await browser.url(url);

      await browser.waitUntilDisplayed(obbPvPCardPO.playerContainer);

      // clicks on Add to Betslip button, waits for betslip to show up
      await obbPvPCardPO.firstBetButton.click();
      await browser.waitUntilDisplayed(stakeInputFieldPO.element);
    });

    describe("and the stake is higher than max stake (11.83)", () => {
      beforeAll(async () => {
        await stakeInputFieldPO.setValue("11.84");
        await browser.waitUntilDisplayed(alertPO.element, "Notification was not displayed");
      });

      it("[PRPI-6945] should see a max stake warning message", async () => {
        expect(await alertPO.items[0].getText()).toBe("Maximum stake is $11.83");
      });

      it("[PRPI-6946] place button should be disabled", async () => {
        expect(await placeButtonPO.element.isEnabled()).toBe(false);
      });

      describe("and when I tap on the message", () => {
        beforeAll(async () => {
          await alertPO.element.waitForClickable();
          await alertPO.element.click();
          await browser.waitUntilNotDisplayed(alertPO.element, "Notification was not removed");
        });

        it("[PRPI-6947] the stake field should update to 11.83", async () => {
          expect(await stakeInputFieldPO.numberField.getValue()).toBe("11.83");
        });

        it("[PRPI-6948] the max stake warning message should disappear", async () => {
          expect(await alertPO.element.isDisplayed()).toBe(false);
        });

        it("[PRPI-6949] place button should be enabled", async () => {
          expect(await placeButtonPO.element.isEnabled()).toBe(true);
        });
      });
    });

    describe("and the stake is lower than min stake (0.1)", () => {
      beforeAll(async () => {
        await stakeInputFieldPO.setValue("0.01");
        await browser.waitUntilDisplayed(alertPO.element, "Notification was not displayed");
      });

      it("[PRPI-6950] should see a max stake warning message", async () => {
        expect(await alertPO.items[0].getText()).toBe("Minimum stake is $0.10");
      });

      it("[PRPI-6951] place button should be disabled", async () => {
        expect(await placeButtonPO.element.isEnabled()).toBe(false);
      });

      describe("and when I tap on the message", () => {
        beforeAll(async () => {
          await alertPO.element.waitForClickable();
          await alertPO.element.click();
          await browser.waitUntilNotDisplayed(alertPO.element, "Notification was not removed (2)");
        });

        it("[PRPI-6952] the stake field should update to 0.1", async () => {
          expect(await stakeInputFieldPO.numberField.getValue()).toBe("0.1");
        });

        it("[PRPI-6953] the min stake warning message should disappear", async () => {
          expect(await alertPO.element.isDisplayed()).toBe(false);
        });

        it("[PRPI-6954] place button should be enabled", async () => {
          expect(await placeButtonPO.element.isEnabled()).toBe(true);
        });
      });
    });

    describe("and the stake is higher than available funds (123)", () => {
      beforeAll(async () => {
        await stakeInputFieldPO.setValue("124");
        await browser.waitUntilDisplayed(alertPO.element, "Notification was not displayed");
      });

      it("[PRPI-6955] should see a max stake and a insufficient funds warning message", async () => {
        expect(await alertsPO.items[0].getText()).toBe("Not enough money in your main wallet.");
        expect(await alertsPO.items[1].getText()).toBe("Maximum stake is $11.83\nTap to update stake");
      });

      it("[PRPI-6956] place button should be disabled and labeled Deposit", async () => {
        expect(await placeButtonPO.element.isEnabled()).toBe(false);
        expect(await placeButtonPO.element.getText()).toBe("Deposit to Place $124.00 Bet");
      });

      describe("and when I tap on the message", () => {
        beforeAll(async () => {
          await alertPO.element.waitForClickable();
          await alertPO.element.click();
          await browser.waitUntilNotDisplayed(alertPO.element, "Notification was not removed (3)");
        });

        it("[PRPI-6957] the stake field should update to 11.83", async () => {
          expect(await stakeInputFieldPO.numberField.getValue()).toBe("11.83");
        });

        it("[PRPI-6958] both warning messages should disappear", async () => {
          expect(await alertPO.element.isDisplayed()).toBe(false);
        });

        it("[PRPI-6959] place button should be enabled", async () => {
          expect(await placeButtonPO.element.isEnabled()).toBe(true);
          expect(await placeButtonPO.element.getText()).toBe("Place $11.83 Bet");
        });
      });
    });

    describe("and there's odds movement", () => {
      beforeAll(async () => {
        // adding a new stake
        await stakeInputFieldPO.setValue("1");

        implyBetsResponse.betDefinitions[0].details.price.decimal = 5;
        implyBetsResponse.betDefinitions[0].details.price.fractional.numerator = 5;
        implyBetsResponse.betDefinitions[0].details.price.fractional.denominator = 1;

        await mockService.mockHttpRequest(getObbQuotes(legsQuotes));
        await mockService.mockHttpRequest(getObbImply(implyBetsResponse));

        // close and open betslip again to trigger quotes call
        await betslipDrawerPO.header.click();
        await minimazedPO.element.waitForClickable();
        await minimazedPO.element.click();

        await browser.waitUntilEquals(alertPO.message, "Odds have changed");
      });

      it("[PRPI-6960] the 'Odds have changed' notification is displayed", async () => {
        expect(await alertPO.icon.isDisplayed()).toBe(true);
        expect(await alertPO.message.getText()).toBe("Odds have changed");
      });

      it("[PRPI-6961] the place button text changes to 'Accept odds change and Place $1.00 Bet' and is enabled", async () => {
        expect(await placeButtonPO.element.getText()).toBe("Place $1.00 Bet\nAccept odds change and");
        expect(await placeButtonPO.element.isEnabled()).toBe(true);
      });

      it("[PRPI-6962] an arrow appears in the odds field", async () => {
        await browser.waitUntilDisplayed(oddsMovementPO.arrow, "Arrow not displayed");
        expect(await oddsMovementPO.arrow.isDisplayed()).toBe(true);
      });
    });

    describe("(betslip returns) and another selection is added", () => {
      beforeAll(async () => {
        await stakeInputFieldPO.setValue("0");
        await mockService.mockHttpRequest(getObbImply(secondImplyBetsResponse));
        await betslipDrawerPO.header.click(); // closes betslip
        await obbPvPCardPO.secondBetButton.click(); // ads another selection
        await minimazedPO.element.click(); // opens betslip
      });

      it("[PRPI-6963] should display total returns selection returns as 0.00", async () => {
        expect(await betControlsFirstBet.returns.getText()).toBe("Returns\n$0.00");
      });

      describe("[SHMRCK-397] and when I fill the stake with 1, the returns are calculated", () => {
        beforeAll(async () => {
          await stakeInputFirstBet.setValue("1");
        });

        it("[PRPI-6964] should display total returns selection returns as 0.00", async () => {
          expect(await betControlsFirstBet.returns.getText()).toBe("Returns\n$5.00");
        });

        it("[PRPI-6965] and if I clear the stake, the returns are 0", async () => {
          await stakeInputFirstBet.setValue("0");

          expect(await betControlsFirstBet.returns.getText()).toBe("Returns\n$0.00");
        });
      });
    });
  });
});
