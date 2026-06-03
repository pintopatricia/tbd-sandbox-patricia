const {
  MinimizedPO,
  CompetitionPagePO,
  SinglesCardPO,
  SinglePO,
  BetLegsPO,
  MultiplesCardPO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
  BetslipDrawerPO,
  BetControlsPO,
  BetSelectionDetailsPO,
  CurrencyNumberInputFieldPO,
  FixedNumberInputFieldPO,
  PrimaryButtonPO,
  OddsMovementPO,
  AlertPO,
  AlertsPO,
  SportsbookPlacePanelPO,
} = require("../../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getCompetitionsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const CouponCardGroupPO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.web.po");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");
const { addStake } = require("../../../../../../helpers/betslip.util");
const mockService = new MockService();

// page
const competitionPage = new CompetitionPagePO();
const sportsbookMinimizedBetslip = new MinimizedPO();
// page markets
const eventMarketsCardCoupon = new CouponCardGroupPO(competitionPage.element);
const inlineSportsbookMarket = new InlineSportsbookMarketPO(eventMarketsCardCoupon.eventCoupons[0]);
const firstRunnerButton = new SportsbookBetButtonPO(inlineSportsbookMarket.betButtons[0]);
const secondInlineSportsbookMarket = new InlineSportsbookMarketPO(eventMarketsCardCoupon.eventCoupons[1]);
const secondRunnerButton = new SportsbookBetButtonPO(secondInlineSportsbookMarket.betButtons[0]);
// betslip
const betslipDrawerPO = new BetslipDrawerPO();
const sbkPlacePanel = new SportsbookPlacePanelPO();
const singlesPO = new SinglesCardPO(sbkPlacePanel.element);
const firstSinglePO = new SinglePO(singlesPO.singles[0]);
const secondSinglePO = new SinglePO(singlesPO.singles[1]);
const firstSingleControlsPO = new BetControlsPO(firstSinglePO.element);
const secondSingleControlsPO = new BetControlsPO(secondSinglePO.element);
const singleStakeInputFieldPO = new CurrencyNumberInputFieldPO(firstSingleControlsPO.currencyInput);
const singleFirstSelectionOddsField = new FixedNumberInputFieldPO(firstSingleControlsPO.fixedInput);
const singleFirstSelectionOddsMovement = new OddsMovementPO(singleFirstSelectionOddsField.oddsMovementContainer);
const secondSingleStakeFieldPO = new CurrencyNumberInputFieldPO(secondSingleControlsPO.currencyInput);
const firstSingleOddsFieldPO = new FixedNumberInputFieldPO(firstSingleControlsPO.fixedInput);
const secondSingleOddsFieldPO = new FixedNumberInputFieldPO(secondSingleControlsPO.fixedInput);
const firstOddsMovementPO = new OddsMovementPO(firstSingleOddsFieldPO.oddsMovement);
const secondOddsMovementPO = new OddsMovementPO(secondSingleOddsFieldPO.oddsMovement);
const multiplesCardPO = new MultiplesCardPO(sbkPlacePanel.element);
const multipleControlsPO = new BetControlsPO(multiplesCardPO.element);
const multipleStakeFieldPO = new CurrencyNumberInputFieldPO(multipleControlsPO.currencyInput);
const multiplesBetLegsPO = new BetLegsPO(sbkPlacePanel.element);
const multiplesFirstSelectionPO = new BetSelectionDetailsPO(multiplesBetLegsPO.selections[0]);
const firstSelectionOddsMovementPO = new OddsMovementPO(multiplesFirstSelectionPO.oddsMovement);
const multiplesSecondSelectionPO = new BetSelectionDetailsPO(multiplesBetLegsPO.selections[1]);
const secondSelectionOddsMovementPO = new OddsMovementPO(multiplesSecondSelectionPO.oddsMovement);
const placeButton = new PrimaryButtonPO(sbkPlacePanel.place);

const COMPETITION_ID = "228";
const FIRST_MARKET_ID = "924.1";
const FIRST_SELECTION_ID = 1;
const SECOND_MARKET_ID = "924.2";
const SECOND_SELECTION_ID = 2;

const BFF_MOCK = {
  urn: "ppb:tbd:view:competition:228",
  url: routes.getCompetitionViewUrl(COMPETITION_ID),
  competition: {
    urn: "ppb:competition:228",
    name: "UEFA Champions League",
    competitionId: COMPETITION_ID,
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
                      urn: `ppb:sbkMarket:${FIRST_MARKET_ID}`,
                      liveData: {
                        inplay: false,
                      },
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
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/1`,
                          name: "Man City",
                          selectionId: FIRST_SELECTION_ID,
                          resultType: "HOME",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/2426`,
                          name: "Real Madrid",
                          selectionId: 2426,
                          resultType: "AWAY",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/58805`,
                          name: "The Draw",
                          selectionId: 58805,
                          resultType: "DRAW",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/1` },
                      { runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/2426` },
                      { runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/58805` },
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
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
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
                      urn: `ppb:sbkMarket:${SECOND_MARKET_ID}`,
                      liveData: {
                        inplay: false,
                      },
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
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/2`,
                          name: "Juventus",
                          selectionId: SECOND_SELECTION_ID,
                          resultType: "HOME",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/55271`,
                          name: "Lyon",
                          selectionId: 55271,
                          resultType: "AWAY",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/58805`,
                          name: "The Draw",
                          selectionId: 58805,
                          resultType: "DRAW",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/2` },
                      { runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/55271` },
                      { runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/58805` },
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
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
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
                      urn: "ppb:sbkMarket:924.3234184334",
                      liveData: {
                        inplay: false,
                      },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          urn: "ppb:competition:228",
                          name: "UEFA Champions League",
                          competitionId: COMPETITION_ID,
                        },
                        sportevent: {
                          urn: "ppb:event:29899863",
                          name: "Bayern Munich v Chelsea",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.3234184334/3",
                          name: "Bayern Munich",
                          selectionId: 58813,
                          resultType: "HOME",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.3234184334/55190",
                          name: "Chelsea",
                          selectionId: 55190,
                          resultType: "AWAY",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.3234184334/58805",
                          name: "The Draw",
                          selectionId: 58805,
                          resultType: "DRAW",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.3234184334/3" },
                      { runnerURN: "ppb:sbkRunner:924.3234184334/55190" },
                      { runnerURN: "ppb:sbkRunner:924.3234184334/58805" },
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
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
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
      marketId: FIRST_MARKET_ID,
      runnerDetails: [
        {
          selectionId: FIRST_SELECTION_ID,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 2.1 },
              fractionalDisplayOdds: { numerator: 8, denominator: 11 },
            },
            decimalDisplayOdds: { decimalOdds: 2.1 },
            fractionalDisplayOdds: { numerator: 8, denominator: 11 },
          },
        },
        {
          selectionId: 58805,
          noOdds: true,
        },
        {
          selectionId: 2426,
          noOdds: true,
        },
      ],
    },
    {
      marketId: SECOND_MARKET_ID,
      runnerDetails: [
        {
          selectionId: SECOND_SELECTION_ID,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 3 },
              fractionalDisplayOdds: { numerator: 8, denominator: 11 },
            },
            decimalDisplayOdds: { decimalOdds: 3 },
            fractionalDisplayOdds: { numerator: 2, denominator: 5 },
          },
        },
        {
          selectionId: 58805,
          noOdds: true,
        },
        {
          selectionId: 55271,
          noOdds: true,
        },
      ],
    },
    {
      marketId: "924.3234184334",
      runnerDetails: [
        {
          selectionId: 58813,
          noOdds: true,
        },
        {
          selectionId: 58805,
          noOdds: true,
        },
        {
          selectionId: 55190,
          noOdds: true,
        },
      ],
    },
  ],
};

// add first selection
const FIRST_COMBINATION = {
  legCombinations: [
    {
      runners: [
        {
          marketId: FIRST_MARKET_ID,
          selectionId: FIRST_SELECTION_ID,
        },
      ],
    },
  ],

  averageOdds: 2.1,
  winAverageOdds: 2.1,
  betType: "SINGLE",
};

const FIRST_COMBINATION_ODDS = {
  runner: {
    marketId: FIRST_MARKET_ID,
    selectionId: FIRST_SELECTION_ID,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2.1 },
      fractionalDisplayOdds: { numerator: 8, denominator: 11 },
    },
    decimalDisplayOdds: { decimalOdds: 2.1 },
    fractionalDisplayOdds: { numerator: 8, denominator: 11 },
  },
};

const SIB_SINGLE_MOCK = {
  betCombinations: [FIRST_COMBINATION],
  runnerOdds: [FIRST_COMBINATION_ODDS],
};

// first odd change
const FIRST_COMBINATION_MOVEMENT = {
  ...FIRST_COMBINATION,
  averageOdds: 4,
  winAverageOdds: 4,
};

const FIRST_COMBINATION_ODDS_MOVEMENT = {
  ...FIRST_COMBINATION_ODDS,
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 4 },
      fractionalDisplayOdds: { numerator: 8, denominator: 11 },
    },
    decimalDisplayOdds: { decimalOdds: 4 },
    fractionalDisplayOdds: { numerator: 8, denominator: 11 },
  },
};

const SMP_MOCK_FIRST_MOVEMENT = {
  markets: [
    {
      marketId: FIRST_MARKET_ID,
      runnerDetails: [
        {
          selectionId: FIRST_SELECTION_ID,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 4 },
              fractionalDisplayOdds: { numerator: 8, denominator: 11 },
            },
            decimalDisplayOdds: { decimalOdds: 4 },
            fractionalDisplayOdds: { numerator: 8, denominator: 11 },
          },
        },
        {
          selectionId: 58805,
          noOdds: true,
        },
        {
          selectionId: 2426,
          noOdds: true,
        },
      ],
    },
    {
      marketId: SECOND_MARKET_ID,
      runnerDetails: [
        {
          selectionId: SECOND_SELECTION_ID,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 3 },
              fractionalDisplayOdds: { numerator: 8, denominator: 11 },
            },
            decimalDisplayOdds: { decimalOdds: 3 },
            fractionalDisplayOdds: { numerator: 2, denominator: 5 },
          },
        },
        {
          selectionId: 58805,
          noOdds: true,
        },
        {
          selectionId: 55271,
          noOdds: true,
        },
      ],
    },
    {
      marketId: "924.3234184334",
      runnerDetails: [
        {
          selectionId: 58813,
          noOdds: true,
        },
        {
          selectionId: 58805,
          noOdds: true,
        },
        {
          selectionId: 55190,
          noOdds: true,
        },
      ],
    },
  ],
};

const SIB_SINGLE_MOCK_MOVEMENT = {
  betCombinations: [FIRST_COMBINATION_MOVEMENT],
  runnerOdds: [FIRST_COMBINATION_ODDS_MOVEMENT],
};

// add second selection
const SECOND_COMBINATION = {
  legCombinations: [
    {
      runners: [
        {
          marketId: SECOND_MARKET_ID,
          selectionId: SECOND_SELECTION_ID,
        },
      ],

      legType: "SIMPLE_SELECTION",
    },
  ],

  betMinStake: 0.1,
  betMaxStake: 500,
  averageOdds: 3,
  winAverageOdds: 3,
  betType: "SINGLE",
};

const SECOND_COMBINATION_ODDS = {
  runner: {
    marketId: SECOND_MARKET_ID,
    selectionId: SECOND_SELECTION_ID,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 3 },
      fractionalOdds: { numerator: 2, denominator: 5 },
    },
    decimalDisplayOdds: { decimalOdds: 3 },
    fractionalDisplayOdds: { numerator: 2, denominator: 5 },
  },
};

const DOUBLE_ONELINE_COMBINATION = {
  legCombinations: [],
  numLines: 1,
  averageOdds: 10,
  winAverageOdds: 10,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 10 } },
    decimalDisplayOdds: { decimalOdds: 10 },
  },
  betType: "DOUBLE",
};

const SIB_DOUBLE_MOCK = {
  betCombinations: [FIRST_COMBINATION_MOVEMENT, SECOND_COMBINATION, DOUBLE_ONELINE_COMBINATION],
  runnerOdds: [FIRST_COMBINATION_ODDS_MOVEMENT, SECOND_COMBINATION_ODDS],
};

// odds change on second selection
const SECOND_COMBINATION_MOVEMENT = {
  ...SECOND_COMBINATION,
  averageOdds: 1.5,
  winAverageOdds: 1.5,
};

const SECOND_COMBINATION_ODDS_MOVEMENT = {
  ...SECOND_COMBINATION_ODDS,
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.50000000001 },
      fractionalDisplayOdds: { numerator: 8, denominator: 11 },
    },
    decimalDisplayOdds: { decimalOdds: 1.5 },
    fractionalDisplayOdds: { numerator: 8, denominator: 11 },
  },
};

const DOUBLE_ONELINE_COMBINATION_MOVEMENT = {
  ...DOUBLE_ONELINE_COMBINATION,
  averageOdds: 5.5,
  winAverageOdds: 5.5,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 5.5 } },
    decimalDisplayOdds: { decimalOdds: 5.5 },
  },
};

const SMP_MOCK_SECOND_MOVEMENT = {
  markets: [
    {
      marketId: FIRST_MARKET_ID,
      runnerDetails: [
        {
          selectionId: FIRST_SELECTION_ID,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 4 },
              fractionalDisplayOdds: { numerator: 8, denominator: 11 },
            },
            decimalDisplayOdds: { decimalOdds: 4 },
            fractionalDisplayOdds: { numerator: 8, denominator: 11 },
          },
        },
        {
          selectionId: 58805,
          noOdds: true,
        },
        {
          selectionId: 2426,
          noOdds: true,
        },
      ],
    },
    {
      marketId: SECOND_MARKET_ID,
      runnerDetails: [
        {
          selectionId: SECOND_SELECTION_ID,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
              fractionalDisplayOdds: { numerator: 8, denominator: 11 },
            },
            decimalDisplayOdds: { decimalOdds: 1.5 },
            fractionalDisplayOdds: { numerator: 2, denominator: 5 },
          },
        },
        {
          selectionId: 58805,
          noOdds: true,
        },
        {
          selectionId: 55271,
          noOdds: true,
        },
      ],
    },
    {
      marketId: "924.3234184334",
      runnerDetails: [
        {
          selectionId: 58813,
          noOdds: true,
        },
        {
          selectionId: 58805,
          noOdds: true,
        },
        {
          selectionId: 55190,
          noOdds: true,
        },
      ],
    },
  ],
};

const SIB_DOUBLE_MOCK_MOVEMENT = {
  betCombinations: [FIRST_COMBINATION_MOVEMENT, SECOND_COMBINATION_MOVEMENT, DOUBLE_ONELINE_COMBINATION_MOVEMENT],
  runnerOdds: [FIRST_COMBINATION_ODDS_MOVEMENT, SECOND_COMBINATION_ODDS_MOVEMENT],
};

const getNotifications = () => {
  const alertsPO = new AlertsPO(sbkPlacePanel.element);
  const firstAlert = new AlertPO(alertsPO.items[0]);
  const secondAlert = new AlertPO(alertsPO.items[0]);

  return [firstAlert, secondAlert];
};

describe("Sportsbook Odds Movement", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { oddsMovement: "false" }));
    await mockService.mockHttpRequest(getCompetitionsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await browser.url(`${routes.getSportViewUrl(COMPETITION_ID)}`);
    await browser.waitUntilEquals(firstRunnerButton.odd, "2.1");

    // add first selection
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_SINGLE_MOCK));
    await firstRunnerButton.element.scrollIntoView({
      block: "center",
    });
    await firstRunnerButton.element.click();

    await mockService.mockHttpRequest(
      getMarketPrices(SMP_MOCK_FIRST_MOVEMENT, { ignoreRequestedMarketIdsMatch: true }),
    );
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_SINGLE_MOCK_MOVEMENT));

    await browser.waitUntilDisplayed(sbkPlacePanel.element);
  });

  describe("with one selection on single place panel, when odd changes", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(singleFirstSelectionOddsMovement.arrow);
      await browser.waitUntilDisplayed(placeButton.element);
      await addStake(singleStakeInputFieldPO, "2");
    });

    it("[PRPI-8045] should display an arrow on the odds input field", async () => {
      expect(await singleFirstSelectionOddsMovement.arrow.isDisplayed()).toBe(true);
    });

    it("[PRPI-8046] should display odds movement message on CTA", async () => {
      expect(await placeButton.secondaryLabel.getText()).toBe("Accept @4 &");
      expect(await placeButton.label.getText()).toBe("Place $2.00 Bet");
    });

    describe("adding another selection", () => {
      beforeAll(async () => {
        await addStake(singleStakeInputFieldPO, "");

        // close betslip
        await betslipDrawerPO.header.click();
        await browser.waitUntilNotDisplayed(sbkPlacePanel.element, "Single panel hasn't been minimized");

        // add second selection
        await mockService.mockHttpRequest(getImplyBetsResponse(SIB_DOUBLE_MOCK));
        await secondRunnerButton.element.scrollIntoView({
          block: "center",
        });
        await secondRunnerButton.element.click();
        await browser.waitUntil(
          async () => {
            const title = await sportsbookMinimizedBetslip.title.getText();
            return title.includes("10");
          },
          {
            timeoutMsg: "2 Leg multiple was not combined",
          },
        );

        // open betslip
        await sportsbookMinimizedBetslip.element.click();
        await browser.waitUntilDisplayed(sbkPlacePanel.element, "Place panel hasn't been expanded");

        // set stakes on multiple & single
        await addStake(multipleStakeFieldPO, "2");
        await browser.waitUntilEquals(placeButton.label, "Place $2.00 Bet");

        await browser.waitUntilEquals(multiplesFirstSelectionPO.title, "Man City");
      });

      it("[PRPI-8047] should display an arrow next to the collapse First selection", async () => {
        expect(await firstSelectionOddsMovementPO.arrow.isDisplayed()).toBe(true);
      });

      it("[PRPI-8048] should display an arrow on the First single odds input field", async () => {
        expect(await firstOddsMovementPO.arrow.isDisplayed()).toBe(true);
      });

      it("[PRPI-8049] should display odds movement notification", async () => {
        const [firstAlert] = getNotifications();

        expect(await firstAlert.message.getText()).toBe("Odds have changed");
      });

      it("[PRPI-8050] should display odds movement message on CTA", async () => {
        expect(await placeButton.secondaryLabel.getText()).toBe("Accept odds change and");
        expect(await placeButton.label.getText()).toBe("Place $2.00 Bet");
      });

      describe("when Second selection odds change", () => {
        beforeAll(async () => {
          // odd update
          await mockService.mockHttpRequest(
            getMarketPrices(SMP_MOCK_SECOND_MOVEMENT, { ignoreRequestedMarketIdsMatch: true }),
          );
          await mockService.mockHttpRequest(getImplyBetsResponse(SIB_DOUBLE_MOCK_MOVEMENT));
          await browser.tickFakeClock();
          await browser.waitUntilDisplayed(secondSelectionOddsMovementPO.arrow);
        });

        it("[PRPI-8051] should display an arrow next to the collapse Second selection", async () => {
          expect(await secondSelectionOddsMovementPO.arrow.isDisplayed()).toBe(true);
        });

        describe("scrolling down to view singles cards", () => {
          beforeAll(async () => {
            await secondSinglePO.element.scrollIntoView();
            await browser.waitUntilInViewport(secondSinglePO.element);
          });

          it("[PRPI-8052] should display an arrow on the Second single odds input field", async () => {
            expect(await secondOddsMovementPO.arrow.isDisplayed()).toBe(true);
          });

          describe("when setting a stake of 0.009 on Second selection", () => {
            beforeAll(async () => {
              await secondSingleStakeFieldPO.numberField.scrollIntoView();
              await addStake(secondSingleStakeFieldPO, "0.009");

              const alertsPO = new AlertsPO(sbkPlacePanel.element);
              await browser.waitUntilDisplayed(alertsPO.items[0]);
              await browser.waitUntilDisplayed(alertsPO.items[1]);
            });

            it("[PRPI-8053] should remove odds movement notification", async () => {
              const [firstAlert] = getNotifications();

              expect(await firstAlert.items[0].getText()).not.toBe("Odds have changed");
            });

            it("[PRPI-8053] should display min stake notification", async () => {
              const [firstAlert] = getNotifications();

              expect(await firstAlert.items[0].getText()).toBe("Minimum stake is $0.10");
            });

            describe("when tapping the min stake notification", () => {
              beforeAll(async () => {
                const [firstAlert] = getNotifications();

                await firstAlert.element.click();
                await browser.waitUntilEquals(firstAlert.message, "Odds have changed");
              });

              it("[PRPI-8053] should update the stake value to 0.1", async () => {
                expect(await secondSingleStakeFieldPO.numberField.getValue()).toBe("0.1");
              });

              it("[PRPI-8053] should remove min stake notification", async () => {
                const [firstAlert] = getNotifications();

                expect(await firstAlert.message.getText()).not.toBe("Minimum stake is $0.10");
              });

              it("[PRPI-8053] should display odds movement notification", async () => {
                const [firstAlert] = getNotifications();

                expect(await firstAlert.message.getText()).toBe("Odds have changed");
              });

              describe("when setting a stake of 521", () => {
                beforeAll(async () => {
                  await secondSingleStakeFieldPO.numberField.scrollIntoView();

                  await addStake(secondSingleStakeFieldPO, "521");
                });

                it("[PRPI-8053] should remove odds movement notification", async () => {
                  const [firstAlert] = getNotifications();

                  expect(await firstAlert.items[0].getText()).not.toBe("Odds have changed");
                });

                it("[PRPI-8053] should display max stake notification", async () => {
                  const [firstAlert] = getNotifications();

                  expect(await firstAlert.items[0].getText()).toBe("Maximum stake is $500.00");
                });

                describe("when tapping the max stake notification", () => {
                  beforeAll(async () => {
                    const [firstAlert] = getNotifications();

                    await firstAlert.element.click();
                    await browser.waitUntilEquals(firstAlert.message, "Odds have changed");
                  });

                  it("[PRPI-8053] should update the stake value to 500", async () => {
                    expect(await secondSingleStakeFieldPO.numberField.getValue()).toBe("500");
                  });

                  it("[PRPI-8053] should remove max stake notification", async () => {
                    const [firstAlert] = getNotifications();

                    expect(await firstAlert.message.getText()).not.toBe("Maximum stake is $500.00");
                  });

                  it("[PRPI-8053] should display odds movement notification", async () => {
                    const [firstAlert] = getNotifications();

                    expect(await firstAlert.message.getText()).toBe("Odds have changed");
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
