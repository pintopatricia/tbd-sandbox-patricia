const {
  AppPO,
  EventPagePO,
  SportsbookPlacePanelPO,
  SkyBetClubTrackerPO,
  SportsbookReceiptPanelPO,
  CardPO,
  SportsbookMarketPO,
  RunnerPO,
  CurrencyNumberInputFieldPO,
  PrimaryButtonPO,
  BetControlsPO,
  BetslipDrawerPO,
} = require("../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getEventLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const firstSportsbookMarketPO = new SportsbookMarketPO(firstCardPO.sportsbookMarket);
const runnerFirstMarketSportsbookPO = new RunnerPO(firstSportsbookMarketPO.runnerList[0]);
const placePanelPO = new SportsbookPlacePanelPO();
const controlsPO = new BetControlsPO();
const stakeInputFieldPO = new CurrencyNumberInputFieldPO(controlsPO.currencyInput);
const placeButtonPO = new PrimaryButtonPO(placePanelPO.place);
const sportsbookReceiptPanelPO = new SportsbookReceiptPanelPO();
const betsDrawerPO = new BetslipDrawerPO();
const receiptTitle = betsDrawerPO.header;
const skyBetClubTrackerCardPO = new SkyBetClubTrackerPO();

const mockService = new MockService();

const EVENT_ID = "29359895";
const smpMock = {
  markets: [
    {
      marketId: "924.193270252",
      runnerDetails: [
        {
          selectionId: "48044",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "58805",
          runnerOdds: {
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

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    sport: {
      name: "Football",
      urn: "ppb:eventType:1",
    },
    name: "Wolves v Man Utd",
  },
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223:MATCH_ODDS",
        title: "Match Odds",
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
                  name: "Wolves v Man Utd",
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  runnerURN: "ppb:sbkRunner:924.193270252/48044",
                  selectionId: 48044,
                  name: "Selection A",
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

  partialEdges: [
    {
      node: { urn: "ppb:tbd:card:29436223:MATCH_ODDS", __typename: "MarketCard" },
    },
  ],
};

const spbMockSuccess = {
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
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SBC_MOCK = {
  __typename: "SkyBetClubTrackerCard",
  urn: "ppb:tbd:card:skyBetClubTracker:skyBetClubTracker",
  promotion: null,
  hasAccepted: false,
  current: "5.55",
  target: 30,
  fulfillmentEndDate: "1985-02-06T12:47:00.209Z",
};

describe("Sky Bet Club Tracker", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_MOCK.urn, {
        oddsMovement: "false",
        ENABLE_SKYBETCLUB_TRACKER: { isActive: true },
        brandSettings: {
          SKYBETCLUB: true,
        },
      }),
    );
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(smpMock, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getPlaceBet(spbMockSuccess));
    await mockService.mockHttpRequest(
      getImplyBetsResponse({ betCombinations: [FIRST_SINGLE_MOCK], runnerOdds: [FIRST_SINGLE_ODDS_MOCK] }),
    );

    await browser.url(routes.getEventViewUrl(EVENT_ID));
    await browser.waitUntil(AppPO.sportsbookRunnerBetButtonHasPrice({ market: eventPagePO.markets[0], price: 1.1 }));
    await runnerFirstMarketSportsbookPO.sportsbookBetButton.click();

    await browser.waitUntilDisplayed(placePanelPO.element);

    await stakeInputFieldPO.numberField.setValue(1);
    await mockService.mockHttpRequest(
      getCardResults({
        cards: [SBC_MOCK],
      }),
    );
    await placeButtonPO.element.click();
    await browser.waitUntilDisplayed(receiptTitle);
    await browser.waitUntilDisplayed(sportsbookReceiptPanelPO.element);
    await browser.waitUntilDisplayed(skyBetClubTrackerCardPO.element);
    await browser.waitUntil(async () =>
      (await skyBetClubTrackerCardPO.logoTextContainer.getText()).includes(`Join to unlock $5.55 towards a reward`),
    );
  });

  it("[PRPI-6385] should display the correct amount of money spent and the target", async () => {
    expect(await skyBetClubTrackerCardPO.element.getText()).toContain(`$5.55/$30`);
  });
});
