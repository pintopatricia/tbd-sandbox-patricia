const {
  AppPO,
  EventPagePO,
  SportsbookPlacePanelPO,
  SportsbookReceiptPanelPO,
  RunnerPO,
  CardPO,
  CurrencyNumberInputFieldPO,
  PrimaryButtonPO,
  SportsbookMarketPO,
  BetControlsPO,
} = require("../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");
const { addStake } = require("../../../../helpers/betslip.util");

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const sportsbookMarketPO = new SportsbookMarketPO(firstCardPO.sportsbookMarket);
const firstRunnerSportsbookPO = new RunnerPO(sportsbookMarketPO.runnerList[0]);
const placePanelPO = new SportsbookPlacePanelPO();
const controlsPO = new BetControlsPO(placePanelPO.element);
const sportsbookReceiptPanelPO = new SportsbookReceiptPanelPO();
const stakeInputFieldPO = new CurrencyNumberInputFieldPO(controlsPO.currencyInput);
const placeButtonPO = new PrimaryButtonPO(placePanelPO.place);

const mockService = new MockService();

const EVENT_ID = "29359895";

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    sport: {
      name: "Football",
      urn: "ppb:eventType:1",
    },
  },
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:1",
        partials: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:29436223:MATCH_ODDS",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:29436223:MATCH_ODDS",
                cardTitle: "Match Odds",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.193270252",
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Man Utd v Wolves",
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/48044",
                          selectionId: 48044,
                          name: "Wolves",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/58805",
                          selectionId: 58805,
                          name: "The Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/48351",
                          selectionId: 48351,
                          name: "Man Utd",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.193270252/48044" },
                      { runnerURN: "ppb:sbkRunner:924.193270252/58805" },
                      { runnerURN: "ppb:sbkRunner:924.193270252/48351" },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:allMarkets:1",
        quickLinksTitle: "All Markets",
        links: [
          {
            label: "View All Markets",
            target: "_self",
            icon: null,
            viewLink: {
              viewUrl: routes.getAllMarketsViewUrl(EVENT_ID),
            },
          },
        ],
      },
    },
  ],

  partialEdges: [
    { node: { urn: "ppb:tbd:cardgroup:swimlane:1", __typename: "SwimlaneCardGroup" } },
    { node: { urn: "ppb:tbd:card:quickLinks:allMarkets:1", __typename: "QuickLinksCard" } },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.193270252",
      runnerDetails: [
        {
          selectionId: "48044",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.1 },
            },
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "58805",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.2 },
            },
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "48351",
          noOdds: true,
        },
      ],
    },
  ],
};

const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.193270252",
          selectionId: 48044,
        },
      ],
    },
  ],
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.193270252",
    selectionId: 48044,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: { decimalOdds: 1.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SIB_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const SPB_SUCCESS_MOCK = {
  result: [
    {
      betPrice: {
        decimalDisplayOdds: { decimalOdds: 2 },
        fractionalDisplayOdds: { numerator: 1, denominator: 1 },
      },
      runners: [
        {
          runner: { marketId: "924.193270252", selectionId: 48044 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.193270252", selectionId: 48044 } }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
      ],

      totalPotentialWin: 2,
    },
  ],
};

const SPB_FAILURE_MOCK = {
  result: [
    {
      runners: [{ runner: { marketId: "924.193270252", selectionId: 48044 } }],
      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.193270252", selectionId: 48044 } }],
          },
        },
      ],
    },
  ],

  respCode: "GENERAL_FAILURE",
};

const SPB_ITALY_MOCK = {
  result: [
    {
      betReceiptId: "O/6400262/0",
      regulatorId: "df0797979",
      betPrice: {
        decimalDisplayOdds: { decimalOdds: 2 },
        fractionalDisplayOdds: { numerator: 1, denominator: 1 },
      },
      totalStake: 2,
      runners: [
        {
          runner: { marketId: "924.193270252", selectionId: 48044 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.193270252", selectionId: 48044 } }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
      ],

      totalPotentialWin: 4,
    },
  ],
};

const MODULE_NAME = "betslip_sbk";

describe("Sportsbook Bet Placement", () => {
  xdescribe("when opening the betslip with a sportsbook bet", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK));
      await mockService.mockHttpRequest(getPlaceBet(SPB_SUCCESS_MOCK));

      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntil(AppPO.sportsbookRunnerBetButtonHasPrice({ market: eventPagePO.markets[0], price: 1.1 }));

      await browser.waitUntilDisplayed(
        firstRunnerSportsbookPO.sportsbookBetButton,
        "First Sportsbook bet button not displayed",
      );

      await firstRunnerSportsbookPO.sportsbookBetButton.waitForClickable();
      await firstRunnerSportsbookPO.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(placePanelPO.element, "Sportsbook singles betslip not displayed");
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1227]_should_render_open_betslip`);
    });

    it("[PRPI-1227]_should_render_open_betslip", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1227]_should_render_open_betslip`)).toBe(0);
    });

    describe("and user inputs a stake of 1$", () => {
      beforeAll(async () => {
        await addStake(stakeInputFieldPO, "1");
        await placeButtonPO.element.waitForClickable();
        await placeButtonPO.element.click();
        await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1228]_should_show_bet_placed_message`);
      });

      it("[PRPI-1228]_should_show_bet_placed_message", async () => {
        expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1228]_should_show_bet_placed_message`)).toBe(0);
      });

      describe("when placing a bet of 1$ with failure", () => {
        beforeAll(async () => {
          await sportsbookReceiptPanelPO.dismissButton.waitForClickable();
          await sportsbookReceiptPanelPO.dismissButton.click();
          await browser.waitUntilNotDisplayed(
            sportsbookReceiptPanelPO.element,
            "Sportsbook receipt panel still displayed",
          );
          await browser.waitUntilDisplayed(
            firstRunnerSportsbookPO.sportsbookBetButton,
            "First Sportsbook bet button not displayed",
          );

          await firstRunnerSportsbookPO.sportsbookBetButton.waitForClickable();
          await firstRunnerSportsbookPO.sportsbookBetButton.click();
          await browser.waitUntilDisplayed(placePanelPO.element, "Sportsbook singles betslip not displayed");

          await mockService.mockHttpRequest(getPlaceBet(SPB_FAILURE_MOCK));
          await addStake(stakeInputFieldPO, "1");
          await placeButtonPO.element.waitForClickable();
          await placeButtonPO.element.click();
          await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1229]_should_show_bet_place_error_message`);
        });

        it("[PRPI-1229]_should_show_bet_place_error_message", async () => {
          expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1229]_should_show_bet_place_error_message`)).toBe(0);
        });
      });
    });
  });

  describe("when an Italian user adds a selection to the betslip", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_MOCK.urn, {
          jurisdiction: "ITALY",
          countryCode: "IT",
          localeCode: "it",
          localeCodeBcp47: "it",
        }),
      );
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK));
      await mockService.mockHttpRequest(getPlaceBet(SPB_ITALY_MOCK));

      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntil(AppPO.sportsbookRunnerBetButtonHasPrice({ market: eventPagePO.markets[0], price: 1.1 }));

      await browser.waitUntilDisplayed(
        firstRunnerSportsbookPO.sportsbookBetButton,
        "First Sportsbook bet button not displayed",
      );

      await firstRunnerSportsbookPO.sportsbookBetButton.waitForClickable();
      await firstRunnerSportsbookPO.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(placePanelPO.element, "Sportsbook singles betslip not displayed");
    });
    describe("and  adds 2$ to the stake field and presses the Place Bet button", () => {
      beforeAll(async () => {
        await addStake(stakeInputFieldPO, "2");
        await placeButtonPO.element.waitForClickable();
        await placeButtonPO.element.click();
        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1230]_should_show_bet_receipt_with_bet_and_regulator_ids`,
        );
      });

      it("[PRPI-1230]_should_show_bet_receipt_with_bet_and_regulator_ids", async () => {
        expect(
          await browser.checkScreen(`${MODULE_NAME}_[PRPI-1230]_should_show_bet_receipt_with_bet_and_regulator_ids`),
        ).toBe(0);
      });
    });
  });
});
