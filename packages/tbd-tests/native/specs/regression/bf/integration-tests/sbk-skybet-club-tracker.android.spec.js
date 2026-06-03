const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const {
  getAppContext,
  getSportsLayout,
  getCardResults,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const {
  InlineSportsbookMarketSO,
  CardSO,
  SportsbookBetButtonSO,
  CurrencyNumberInputFieldSO,
  SportsbookReceiptPanelSO,
  SportsbookPlacePanelSO,
  BetControlsSO,
  SkyBetClubTrackerSO,
  PrimaryButtonSO,
  GenericSO,
  SingleSO,
} = require("../../../../screen-objects");

const { hideKeyboard } = require("../../../../helpers/gestures");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const MockService = require("../../../../mock-essentials/mocking-service");

const mockService = new MockService();
const genericScreenSO = new GenericSO();
const cardSO = new CardSO(genericScreenSO.element);
const sportsbookMarketSO = new InlineSportsbookMarketSO(cardSO.contentWrapper);
const firstRunnerSO = new SportsbookBetButtonSO(sportsbookMarketSO.sbkBetButtons[0]);
const sportsbookSinglePlacePanelSO = new SportsbookPlacePanelSO();
const sportsbookReceiptPanelSO = new SportsbookReceiptPanelSO();
const singleSO = new SingleSO(sportsbookSinglePlacePanelSO.element);
const singleControlsSO = new BetControlsSO(singleSO.controls);
const sportsbookSinglePlaceSizeInputField = new CurrencyNumberInputFieldSO(singleControlsSO.currencyInput);
const skyBetClubTrackerCardSO = new SkyBetClubTrackerSO();
const singlePlaceButtonSO = new PrimaryButtonSO();

const EVENT_ID = 29359895;
const MARKET_ID = "924.193270252";

const SMP_MOCK = {
  markets: [
    {
      marketId: MARKET_ID,
      runnerDetails: [
        {
          selectionId: 48044,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 6.5 },
            },
            decimalDisplayOdds: { decimalOdds: 6.5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 58805,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.2 },
            },
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 48351,
          noOdds: true,
        },
      ],
    },
  ],
};

const BFF_MOCK = {
  urn: "ppb:tbd:view:sport:1",
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        cardGroupTitle: "First Card",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID}`,
                fixture: {
                  urn: `ppb:fixture:${EVENT_ID}`,
                  home: {
                    name: "Sporting",
                  },
                  away: {
                    name: "Man Utd",
                  },
                },
                sportevent: {
                  name: "Sporting v Man Utd",
                  openDate: "2010-10-14T18:45Z",
                  urn: `ppb:event:${EVENT_ID}`,
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:1234561",
                    name: "English Premier League",
                  },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${MARKET_ID}`,
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Sporting v Man Utd",
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/48044`,
                          selectionId: 48044,
                          name: "Sporting",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/58805`,
                          selectionId: 58805,
                          name: "The Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/48351`,
                          selectionId: 48351,
                          name: "Man Utd",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/48044`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/58805`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/48351`,
                      },
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

const SPB_MOCK_SUCCESS = {
  result: [
    {
      betReceiptId: "O/6400262/0",
      regulatorId: "df0797979",
      betPrice: {
        decimalDisplayOdds: { decimalOdds: 6.5 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      totalStake: 2,
      runners: [
        {
          runner: { marketId: MARKET_ID, selectionId: 48044 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 6.5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: MARKET_ID, selectionId: 48044 } }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 6.5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],

      totalPotentialWin: 13,
    },
  ],
};

const APP_CONTEXT_MOCK = {
  throttles: {
    ENABLE_SKYBETCLUB_TRACKER: { isActive: true },
  },
  brandSettings: {
    SKYBETCLUB: true,
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

const setup = async () => {
  await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
  await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
  const HOME_VIEW_LINK = getStartViewLink("football/s-1");
  await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

  await mockService.mockHttpRequest(getAppContext(APP_CONTEXT_MOCK));
  await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
  await browser.waitUntilDisplayed(genericScreenSO.element);
  await browser.waitUntilDisplayed(firstRunnerSO.element);

  // tracker setup
  await firstRunnerSO.element.click();
  await mockService.mockHttpRequest(
    getCardResults({
      cards: [SBC_MOCK],
    }),
  );
  await browser.waitUntilDisplayed(
    sportsbookSinglePlacePanelSO.element,
    "Waiting for Sportsbook single place panel element",
  );
  await sportsbookSinglePlaceSizeInputField.numberField.setValue(2);
  await hideKeyboard();
  await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK_SUCCESS));
  await singlePlaceButtonSO.element.click();
  await browser.waitUntilDisplayed(sportsbookReceiptPanelSO.element, "Bet Placed");
};

describe("Sky Bet Club Tracker", () => {
  describe("After the user successfully places a bet", () => {
    beforeAll(async () => {
      await setup();
    });

    it("[PRPI-3988] should be visible", async () => {
      expect(await skyBetClubTrackerCardSO.element.isDisplayed()).toBe(true);
    });
  });
});
