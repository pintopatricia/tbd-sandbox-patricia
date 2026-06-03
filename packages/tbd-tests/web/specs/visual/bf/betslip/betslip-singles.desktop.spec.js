const {
  SportPagePO,
  SportsbookPlacePanelPO,
  SportsbookReceiptPanelPO,
  CardPO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
  BetControlsPO,
  CurrencyNumberInputFieldPO,
} = require("../../../../page-objects");
const { getSSCv1Content, getSSCHeaderCSS } = require("@ppb/tbd-shared/mocks/ssc/ssc.controller");
const { SMP, SIB, SPB } = require("@flutter-global/uki-channels-http-clients/mock-index");
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const EventMarketCardPO = require("@ppb/tbd-shared/components/EventMarketCard/EventMarketCard.po");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { getSportViewUrl } = require("../../../../../utils/routes");
const { addStake } = require("../../../../helpers/betslip.util");

const { getMarketPrices } = SMP;
const { getImplyBetsResponse } = SIB;
const { getPlaceBet } = SPB;

const MODULE_NAME = "betslip_singles";
const sportPagePO = new SportPagePO();
const eventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[0]);
const matchOddsCard = new CardPO(eventMarketCardPO.market);
const sbkMarketPO = new InlineSportsbookMarketPO(matchOddsCard.inlineSportsbookMarket);
const sbkRunnerPO = new SportsbookBetButtonPO(sbkMarketPO.betButtons[0]);

const placePanelPO = new SportsbookPlacePanelPO();
const controlsPO = new BetControlsPO(placePanelPO.element);
const sportsbookStakeInputPO = new CurrencyNumberInputFieldPO(controlsPO.currencyInput);
const sportsbookReceiptPanelPO = new SportsbookReceiptPanelPO();

const mockService = new MockService();

const EVENT_TYPE_ID = 1;

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.1",
      runnerDetails: [
        {
          selectionId: "1",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "2",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "3",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
  ],
};

const BFF_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        cardGroupTitle: "League",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
                title: "Team A vs Team Batatoon e companhia limitada dos Underlords",
                fixture: {
                  urn: "ppb:fixture:29359895",
                  home: {
                    name: "Team Batatoon e companhia limitada dos Underlords",
                  },
                  away: {
                    name: "Team A",
                  },
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
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.1",
                      marketType: "MATCH_ODDS",
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team Batatoon e companhia limitada dos Underlords v Team A",
                          urn: "ppb:event:29359895",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.1/1",
                          selectionId: 1,
                          name: "Team Batatoon e companhia limitada dos Underlords",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/2",
                          selectionId: 2,
                          name: "Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/3",
                          selectionId: 3,
                          name: "Team A",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.1/1" },
                      { runnerURN: "ppb:sbkRunner:924.1/2" },
                      { runnerURN: "ppb:sbkRunner:924.1/3" },
                    ],
                  },
                },
              },
            },
          ],
        },
        viewAll: {
          icon: null,
          label: "View All",
          viewLink: { viewUrn: "ppb:tbd:view:external:external", viewUrl: "https://betfair.com" },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
      },
    },
  ],
};

const SINGLE_MOCK = {
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

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.1",
    selectionId: 1,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SIB_MOCK = {
  betCombinations: [SINGLE_MOCK],
  runnerOdds: [SINGLE_ODDS_MOCK],
};

const SPB_MOCK = {
  result: [
    {
      totalStake: 2,
      runners: [
        {
          runner: { marketId: SINGLE_ODDS_MOCK.runner.marketId, selectionId: SINGLE_ODDS_MOCK.runner.selectionId },
          odds: {
            decimalDisplayOdds: { decimalOdds: SINGLE_MOCK.averageOdds },
          },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [
              {
                runner: {
                  marketId: SINGLE_ODDS_MOCK.runner.marketId,
                  selectionId: SINGLE_ODDS_MOCK.runner.selectionId,
                },
              },
            ],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: SINGLE_MOCK.averageOdds },
          },
        },
      ],

      totalPotentialWin: 2.2,
    },
  ],
};

describe("Betslip - Singles", () => {
  describe("when adding a selection to the Betslip", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getSSCHeaderCSS());
      await mockService.mockHttpRequest(getSSCv1Content());
      await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK));

      await browser.url(getSportViewUrl(EVENT_TYPE_ID));
      await browser.waitUntilDisplayed(sportPagePO.actionLink[0]);
      await browser.waitUntilEquals(sbkRunnerPO.odd, "1.1");

      await sbkRunnerPO.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(placePanelPO.element, "Selection hasn't been added");

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1271]_should_see_populated_betslip_with_single`);
    });

    it("[PRPI-1271]_should_see_populated_betslip_with_single", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1271]_should_see_populated_betslip_with_single`)).toBe(0);
    });
  });

  describe("when inputing a stake value", () => {
    beforeAll(async () => {
      await addStake(sportsbookStakeInputPO, "2");

      await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK));

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1272]_should_input_value_and_enabled_place_button`);
    });

    it("[PRPI-1272]_should_input_value_and_enabled_place_button", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1272]_should_input_value_and_enabled_place_button`),
      ).toBeLessThanOrEqual(0.001);
    });
  });

  describe("when placing the bet", () => {
    beforeAll(async () => {
      await placePanelPO.place.click();
      await browser.waitUntilDisplayed(sportsbookReceiptPanelPO.element);

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1273]_should_see_betreceipt_with_single`);
    });

    it("[PRPI-1273]_should_see_betreceipt_with_single", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1273]_should_see_betreceipt_with_single`)).toBe(0);
    });
  });

  describe("when clicking on reuse selection", () => {
    beforeAll(async () => {
      await sportsbookReceiptPanelPO.reUseSelectionsContainer.click();
      await browser.waitUntilDisplayed(placePanelPO.element);

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1274]_should_see_betslip_single_again`);
    });

    it("[PRPI-1274]_should_see_betslip_single_again", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1274]_should_see_betslip_single_again`)).toBe(0);
    });
  });
});
