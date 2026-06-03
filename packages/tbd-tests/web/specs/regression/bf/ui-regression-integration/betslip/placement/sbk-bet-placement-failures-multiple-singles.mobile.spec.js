const {
  CompetitionPagePO,
  MinimizedPO,
  SinglesCardPO,
  SinglePO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
  BetslipDrawerPO,
  BetControlsPO,
  CurrencyNumberInputFieldPO,
  PrimaryButtonPO,
  AlertPO,
  SportsbookPlacePanelPO,
} = require("../../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getCompetitionsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const CouponCardGroupPO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.web.po");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");

const mockService = new MockService();

// page
const competitionPagePO = new CompetitionPagePO();
const sportsbookMinimizedBetslipPO = new MinimizedPO();

// page markets
const eventMarketsCardCouponPO = new CouponCardGroupPO(competitionPagePO.element);
const inlineSportsbookMarketPO = new InlineSportsbookMarketPO(eventMarketsCardCouponPO.eventCoupons[0]);
const firstRunnerButtonPO = new SportsbookBetButtonPO(inlineSportsbookMarketPO.betButtons[0]);
const secondInlineSportsbookMarketPO = new InlineSportsbookMarketPO(eventMarketsCardCouponPO.eventCoupons[1]);
const secondRunnerButtonPO = new SportsbookBetButtonPO(secondInlineSportsbookMarketPO.betButtons[0]);

// betslip
const betslipDrawerPO = new BetslipDrawerPO();
const placePanelPO = new SportsbookPlacePanelPO();
const placeMultipleControlsPO = new BetControlsPO(placePanelPO.element);
const placeMultipleStakeField = new CurrencyNumberInputFieldPO(placeMultipleControlsPO.currencyInput);
const singlesCardsPO = new SinglesCardPO(placePanelPO.element);
const firstSingle = new SinglePO(singlesCardsPO.singles[0]);
const firstControls = new BetControlsPO(firstSingle.element);
const firstSingleStakeField = new CurrencyNumberInputFieldPO(firstControls.currencyInput);
const placeButton = new PrimaryButtonPO(placePanelPO.place);
const placePanelAlert = new AlertPO(placePanelPO.element);

const COMPETITION_ID = "228";

const BFF_MOCK = {
  urn: "ppb:tbd:view:competition:228",
  url: "football/uefa-champions-league/competition:228",
  competition: {
    urn: "ppb:competition:228",
    name: "UEFA Champions League",
    competitionId: 228,
  },
  edges: [
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:card:group:topEventsByCompetition:228",
        filteredCouponTitle: "UEFA Champions League",
        has90Min: false,
        filterOptions: {
          sortOption: {
            defaultOption: "RANK",
            availableOptions: ["RANK", "TIME"],
          },
          dateRangeFilter: {},
          marketTypeFilter: {},
          competitionsFilter: {},
        },
        full: {
          edges: [
            {
              node: {
                __typename: "CouponHeaderCard",
                urn: "ppb:tbd:card:couponheader:YIA8mBEAACMAMOhA/s/1|228",
                competition: {
                  __typename: "Competition",
                  urn: "ppb:competition:228",
                  name: "Friendly Matches",
                  competitionId: 228,
                  sport: {
                    __typename: "Sport",
                    urn: "ppb:eventType:1",
                    name: "Football",
                    sportId: 1,
                  },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29899897",
                eventViewLink: {
                  viewUrn: "ppb:tbd:view:event:29899897",
                  viewUrl: routes.getEventViewUrl("29899897"),
                },
                title: "Match Odds",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.1",
                      liveData: { inplay: false },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          urn: "ppb:competition:228",
                          name: "UEFA Champions League",
                          competitionId: 228,
                        },
                        sportevent: {
                          urn: "ppb:event:29899897",
                          name: "Man City v Real Madrid",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.1/1",
                          name: "Man City",
                          selectionId: 1,
                          resultType: "HOME",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/2426",
                          name: "Real Madrid",
                          selectionId: 2426,
                          resultType: "AWAY",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/58805",
                          name: "The Draw",
                          selectionId: 58805,
                          resultType: "DRAW",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.1/1" },
                      { runnerURN: "ppb:sbkRunner:924.1/2426" },
                      { runnerURN: "ppb:sbkRunner:924.1/58805" },
                    ],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29899897",
                  home: { name: "Man City" },
                  away: { name: "Real Madrid" },
                  scheduledAt: "2020-08-07T19:00:00Z",
                },
                sportevent: {
                  name: "Man City v Real Madrid",
                  openDate: "2020-08-07T19:00:00Z",
                  urn: "ppb:event:29899897",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29899869",
                eventViewLink: {
                  viewUrn: "ppb:tbd:view:event:29899869",
                  viewUrl: routes.getEventViewUrl("29899869"),
                },
                title: "Match Odds",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.2",
                      liveData: { inplay: false },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          urn: "ppb:competition:228",
                          name: "UEFA Champions League",
                          competitionId: 228,
                        },
                        sportevent: {
                          urn: "ppb:event:29899869",
                          name: "Juventus v Lyon",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.2/2",
                          name: "Juventus",
                          selectionId: 2,
                          resultType: "HOME",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.2/55271",
                          name: "Lyon",
                          selectionId: 55271,
                          resultType: "AWAY",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.2/58805",
                          name: "The Draw",
                          selectionId: 58805,
                          resultType: "DRAW",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.2/2" },
                      { runnerURN: "ppb:sbkRunner:924.2/55271" },
                      { runnerURN: "ppb:sbkRunner:924.2/58805" },
                    ],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29899869",
                  home: { name: "Juventus" },
                  away: { name: "Lyon" },
                  scheduledAt: "2020-08-07T19:00:00Z",
                },
                sportevent: {
                  name: "Juventus v Lyon",
                  openDate: "2020-08-07T19:00:00Z",
                  urn: "ppb:event:29899869",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29899863",
                eventViewLink: {
                  viewUrn: "ppb:tbd:view:event:29899863",
                  viewUrl: routes.getEventViewUrl("29899863"),
                },
                title: "Match Odds",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.3",
                      liveData: { inplay: false },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          urn: "ppb:competition:228",
                          name: "UEFA Champions League",
                          competitionId: 228,
                        },
                        sportevent: {
                          urn: "ppb:event:29899863",
                          name: "Bayern Munich v Chelsea",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.3/3",
                          name: "Bayern Munich",
                          selectionId: 3,
                          resultType: "HOME",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.3/55190",
                          name: "Chelsea",
                          selectionId: 55190,
                          resultType: "AWAY",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.3/58805",
                          name: "The Draw",
                          selectionId: 58805,
                          resultType: "DRAW",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.3/3" },
                      { runnerURN: "ppb:sbkRunner:924.3/55190" },
                      { runnerURN: "ppb:sbkRunner:924.3/58805" },
                    ],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29899863",
                  home: { name: "Bayern Munich" },
                  away: { name: "Chelsea" },
                  scheduledAt: "2020-08-08T19:00:00Z",
                },
                sportevent: {
                  name: "Bayern Munich v Chelsea",
                  openDate: "2020-08-07T19:00:00Z",
                  urn: "ppb:event:29899863",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
              },
            },
          ],
        },
        partials: {
          partialEdges: [
            {
              node: {
                __typename: "CouponHeaderCard",
                urn: "ppb:tbd:card:couponheader:YIA8mBEAACMAMOhA/s/1|228",
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29899897",
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29899869",
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29899863",
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
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:card:group:topEventsByCompetition:228",
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.1",
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.73 },
            fractionalDisplayOdds: { numerator: 4, denominator: 6 },
          },
        },
        {
          selectionId: 58805,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 4.33 },
            fractionalDisplayOdds: { numerator: 10, denominator: 3 },
          },
        },
        {
          selectionId: 2426,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 4.2 },
            fractionalDisplayOdds: { numerator: 16, denominator: 5 },
          },
        },
      ],
    },
    {
      marketId: "924.2",
      runnerDetails: [
        {
          selectionId: 2,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.4 },
            fractionalDisplayOdds: { numerator: 2, denominator: 5 },
          },
        },
        {
          selectionId: 58805,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 4.5 },
            fractionalDisplayOdds: { numerator: 7, denominator: 2 },
          },
        },
        {
          selectionId: 55271,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 7.5 },
            fractionalDisplayOdds: { numerator: 13, denominator: 2 },
          },
        },
      ],
    },
  ],
};

const FIRST_COMBINATION = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.1",
          selectionId: 1,
        },
      ],
    },
  ],

  averageOdds: 1.73,
  winAverageOdds: 1.73,
  betType: "SINGLE",
};

const FIRST_COMBINATION_ODDS = {
  runner: {
    marketId: "924.1",
    selectionId: 1,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.73 },
      fractionalDisplayOdds: { numerator: 8, denominator: 11 },
    },
    decimalDisplayOdds: { decimalOdds: 1.73 },
    fractionalDisplayOdds: { numerator: 8, denominator: 11 },
  },
};

const SECOND_COMBINATION = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.2",
          selectionId: 2,
        },
      ],

      legType: "SIMPLE_SELECTION",
    },
  ],

  averageOdds: 1.4,
  winAverageOdds: 1.4,
  betType: "SINGLE",
};

const SECOND_COMBINATION_ODDS = {
  runner: {
    marketId: "924.2",
    selectionId: 2,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.4 },
      fractionalOdds: { numerator: 2, denominator: 5 },
    },
    decimalDisplayOdds: { decimalOdds: 1.4 },
    fractionalDisplayOdds: { numerator: 2, denominator: 5 },
  },
};

const DOUBLE_1LINE_COMBINATION = {
  legCombinations: [],
  numLines: 1,
  averageOdds: 2.33,
  winAverageOdds: 2.33,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 2.33 } },
    decimalDisplayOdds: { decimalOdds: 2.33 },
  },
  betType: "DOUBLE",
};

const SIB_SINGLE_MOCK = {
  betCombinations: [FIRST_COMBINATION],
  runnerOdds: [FIRST_COMBINATION_ODDS],
};

const SIB_DOUBLE_MOCK = {
  betCombinations: [FIRST_COMBINATION, SECOND_COMBINATION, DOUBLE_1LINE_COMBINATION],
  runnerOdds: [FIRST_COMBINATION_ODDS, SECOND_COMBINATION_ODDS],
};

const SPB_STAKE_BELOW_FAILURE_MOCK = {
  result: [{ resultCode: "STAKE_BELOW_MINIMUM_ALLOWED" }],
  respCode: "BET_PLACEMENT_FAILURE",
};

const SPB_RUNNER_FAILURE_MOCK = {
  result: [
    {
      runners: [{ failureCode: "MARKET_SUSPENDED" }],
      resultCode: "BET_PLACEMENT_RUNNER_FAILURE",
    },
  ],

  respCode: "BET_PLACEMENT_FAILURE",
};

describe("Sportsbook Multiples & Singles Bet Failures", () => {
  describe("On place panel, when placing the bet fails with stake below minimum", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getCompetitionsLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await browser.url(`${routes.getEventViewUrl(COMPETITION_ID)}`);

      await browser.waitUntilEquals(firstRunnerButtonPO.odd, "1.73");

      // add first selection
      await mockService.mockHttpRequest(getImplyBetsResponse(SIB_SINGLE_MOCK));
      await firstRunnerButtonPO.element.scrollIntoView({
        block: "center",
      });
      await firstRunnerButtonPO.element.click();
      await browser.waitUntilDisplayed(placePanelPO.element);

      // close betslip
      await betslipDrawerPO.header.click();
      await browser.waitUntilNotDisplayed(placePanelPO.element, "Singles panel hasn't been minimized");

      // add second selection
      await mockService.mockHttpRequest(getImplyBetsResponse(SIB_DOUBLE_MOCK));
      await secondRunnerButtonPO.element.scrollIntoView({
        block: "center",
      });
      await secondRunnerButtonPO.element.click();
      await browser.waitUntil(
        async () => {
          const title = await sportsbookMinimizedBetslipPO.title.getText();
          return title.includes("2.33");
        },
        {
          timeoutMsg: "2 Leg multiple was not combined",
        },
      );

      // open betslip
      await sportsbookMinimizedBetslipPO.element.click();
      await browser.waitUntilDisplayed(placePanelPO.element, "Place panel hasn't been expanded");

      // set stake on multiple
      await placeMultipleStakeField.element.waitForClickable();
      await placeMultipleStakeField.element.click();
      await placeMultipleStakeField.setValue("1");

      // set stake on single
      await firstSingleStakeField.element.scrollIntoView({ block: "center" });
      await firstSingleStakeField.numberField.waitForClickable();
      await firstSingleStakeField.numberField.click();
      await firstSingleStakeField.setValue("1");

      // try to place the bet
      await browser.waitUntilEquals(placeButton.label, "Place $2.00 Bet");
      await mockService.mockHttpRequest(getPlaceBet(SPB_STAKE_BELOW_FAILURE_MOCK));
      await placeButton.element.click();
      await browser.waitUntilDisplayed(placePanelAlert.element);
    });

    afterAll(async () => {
      await placePanelPO.removeAll.waitForClickable();
      await placePanelPO.removeAll.click();
    });

    it("[PRPI-8063] should have an error notification", async () => {
      expect(await placePanelAlert.icon.isDisplayed()).toBe(true);
    });

    it("[PRPI-8064] should display message on notification", async () => {
      expect(await placePanelAlert.message.getText()).toBe("Your stake(s) are below the minimum limit.");
    });
  });

  describe("On place panel, when placing the bet fails with suspended market", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getCompetitionsLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await browser.url(`${routes.getEventViewUrl(COMPETITION_ID)}`);

      await browser.waitUntilEquals(firstRunnerButtonPO.odd, "1.73");

      // add first selection
      await mockService.mockHttpRequest(getImplyBetsResponse(SIB_SINGLE_MOCK));
      await firstRunnerButtonPO.element.scrollIntoView({
        block: "center",
      });
      await firstRunnerButtonPO.element.click();
      await browser.waitUntilDisplayed(placePanelPO.element);

      // close betslip
      await betslipDrawerPO.header.click();
      await browser.waitUntilNotDisplayed(placePanelPO.element, "Singles panel hasn't been minimized");

      // add second selection
      await mockService.mockHttpRequest(getImplyBetsResponse(SIB_DOUBLE_MOCK));
      await secondRunnerButtonPO.element.scrollIntoView({
        block: "center",
      });
      await secondRunnerButtonPO.element.click();
      await browser.waitUntil(
        async () => {
          const title = await sportsbookMinimizedBetslipPO.title.getText();
          return title.includes("2.33");
        },
        {
          timeoutMsg: "2 Leg multiple was not combined",
        },
      );

      // open betslip
      await sportsbookMinimizedBetslipPO.element.click();
      await browser.waitUntilDisplayed(placePanelPO.element, "Place panel hasn't been expanded");

      // set stake on multiple
      await placeMultipleStakeField.element.waitForClickable();
      await placeMultipleStakeField.element.click();
      await placeMultipleStakeField.setValue("1");

      // set stake on single
      await firstSingleStakeField.element.scrollIntoView({ block: "center" });
      await firstSingleStakeField.numberField.waitForClickable();
      await firstSingleStakeField.numberField.click();
      await firstSingleStakeField.setValue("1");

      // try to place the bet
      await browser.waitUntilEquals(placeButton.label, "Place $2.00 Bet");
      await mockService.mockHttpRequest(getPlaceBet(SPB_RUNNER_FAILURE_MOCK));
      await placeButton.element.click();
      await browser.waitUntilDisplayed(placePanelAlert.element);
    });

    it("[PRPI-8065] should have an error notification", async () => {
      expect(await placePanelAlert.icon.isDisplayed()).toBe(true);
    });

    it("[PRPI-8066] should display message on notification", async () => {
      expect(await placePanelAlert.message.getText()).toBe("One of your markets is currently suspended.");
    });
  });
});
