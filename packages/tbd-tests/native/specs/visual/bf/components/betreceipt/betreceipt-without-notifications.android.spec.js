const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const {
  getAppContext,
  getGenericLayout,
  getCardResults,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");
const { hideKeyboard } = require("../../../../../helpers/gestures");

const {
  SportsbookReceiptPanelSO,
  VirtualRunnerSO,
  SportsbookPlacePanelSO,
  SportsbookBetButtonSO,
  CurrencyNumberInputFieldSO,
  PrimaryButtonSO,
} = require("../../../../../screen-objects");

const virtualRunnerSO = new VirtualRunnerSO();
const betButtonSO = new SportsbookBetButtonSO(virtualRunnerSO.sbkBetButtons[0]);
const sportsbookReceiptPanelSO = new SportsbookReceiptPanelSO();
const singlePanelSO = new SportsbookPlacePanelSO();
const placeButton = new PrimaryButtonSO();
const stakeFieldSO = new CurrencyNumberInputFieldSO(singlePanelSO.currencyInput);

const mockService = new MockService();

const CARD_NAME = "betreceipt-card";

const SPORT = {
  __typename: "VirtualSport",
  name: {
    translationKey: "I18N.VIRTUAL_SPORT.CLUB_FOOTBALL",
  },
  kind: "FOOTBALL",
  sportId: 4,
  urn: "ppb:virtualSport:4",
};

const VIRTUAL_EVENT = {
  __typename: "VirtualEvent",
  name: "Porto FC vs Marco 09",
  urn: "ppb:virtualEvent:0|13544362",
  openDate: "2035-01-23T19:00:00.000Z",
  venue: null,
  distance: null,
  sport: SPORT,
};

const NAVIGATION_TAB_MOCK = {
  __typename: "NavigationTab",
  urn: "ppb:tbd:view:virtualNavigationTab:0",
  tabTitle: {
    translate: {
      key: "I18N.VIRTUAL_SPORT.CLUB_FOOTBALL",
    },
  },
  full: {
    edges: [
      {
        node: {
          __typename: "VirtualMarketCard",
          urn: "ppb:tbd:card:virtualMarket:924.1",
          title: "Match Odds",
          marketHierarchy: {
            __typename: "VirtualEventHierarchy",
            virtualEvent: VIRTUAL_EVENT,
          },
          displayRunners: {
            market: {
              __typename: "VirtualMarket",
              urn: "ppb:virtualMarket:924.1",
              marketId: "924.1",
              name: "Match Odds",
              marketType: "MATCH_ODDS",
              sport: SPORT,
              event: VIRTUAL_EVENT,
              runners: [
                {
                  __typename: "VirtualRunner",
                  name: "Porto FC",
                  odds: { decimal: 4, fractional: { denominator: 2, numerator: 1 } },
                  runnerURN: "ppb:virtualRunner:24001",
                  selectionId: 24001,
                },
                {
                  __typename: "VirtualRunner",
                  name: "The Draw",
                  runnerURN: "ppb:virtualRunner:24002",
                  selectionId: 24002,
                },
                {
                  __typename: "VirtualRunner",
                  name: "Marco 09",
                  runnerURN: "ppb:virtualRunner:24003",
                  selectionId: 24003,
                },
              ],
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
          __typename: "VirtualMarketCard",
          urn: "ppb:tbd:card:virtualMarket:924.1",
        },
      },
    ],
  },
};

const CATALOGUE_MOCK = {
  urn: "ppb:tbd:view:generic:virtuals",
  title: "Virtuals",
  url: "view/d-virtuals",
  edges: [
    {
      node: {
        __typename: "NavigationTabsList",
        urn: "ppb:tbd:card:virtualNavigationTabsList:virtuals",
        full: {
          edges: [
            {
              node: NAVIGATION_TAB_MOCK,
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "NavigationTab",
                urn: "ppb:tbd:view:virtualNavigationTab:0",
                tabTitle: {
                  translate: {
                    key: "I18N.VIRTUAL_SPORT.CLUB_FOOTBALL",
                  },
                },
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
        urn: "ppb:tbd:card:virtualNavigationTabsList:virtuals",
        __typename: "NavigationTabsList",
      },
    },
  ],

  bottomBar: {
    tiles: [
      {
        tileType: "HOME",
        viewLink: {
          viewUrn: "ppb:tbd:view:generic:home",
          viewUrl: "",
        },
      },
    ],
  },
};

const SINGLE_MOCK = {
  betCombinations: [
    {
      legCombinations: [{ runners: [{ marketId: "924.1", selectionId: 24001 }] }],
    },
  ],

  runnerOdds: [
    {
      runner: { marketId: "924.1", selectionId: 24001 },
      odds: {
        decimalDisplayOdds: { decimalOdds: 4 },
        trueOdds: { decimalOdds: { decimalOdds: 4 } },
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
          selectionId: "24001",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 4 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "24002",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "24003",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
  ],
};

const SPB_MOCK_SUCCESS = {
  result: [
    {
      runners: [{ runner: { marketId: "924.1", selectionId: 24001 } }],
      legs: [
        {
          leg: { betRunners: [{ runner: { marketId: "924.1", selectionId: 24001 } }] },
          winOdds: { decimalDisplayOdds: { decimalOdds: 4 } },
        },
      ],

      totalPotentialWin: 4,
      wallets: [{ amount: 1, type: "DEPOSITS" }],
    },
  ],
};

const BFF_CARDS_MOCK = { cards: [NAVIGATION_TAB_MOCK] };

describe("Betreceipt Notifications", () => {
  describe("When the user places a bet in a event without push", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getAppContext({}));
      await mockService.mockHttpRequest(getGenericLayout(CATALOGUE_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await mockService.mockHttpRequest(getCardResults(BFF_CARDS_MOCK));

      const HOME_VIEW_LINK = getStartViewLink("view/d-virtuals");
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

      await browser.waitUntilDisplayed(betButtonSO.element);
      await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));

      await browser.waitUntilClickableNative(betButtonSO.element);
      await betButtonSO.element.click();
      await browser.waitUntilDisplayed(singlePanelSO.element, "First selection hasn't been added");

      await browser.waitUntilClickableNative(stakeFieldSO.numberField);
      await stakeFieldSO.numberField.click();
      await stakeFieldSO.numberField.setValue("1");
      await hideKeyboard();

      await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK_SUCCESS));
      await browser.waitUntilClickableNative(placeButton.element);
      await placeButton.element.click();
      await browser.waitUntilDisplayed(sportsbookReceiptPanelSO.element, "Waiting for Sportsbook confirm panel");
    });

    it("[PRPI-4878]_should_not_have_notifications_toggle_displayed", async () => {
      expect(
        (await browser.compareScreen(`${CARD_NAME}_[PRPI-4878]_should_not_have_notifications_toggle_displayed`))
          .misMatchPercentage,
      ).toEqual(0);
    });
  });
});
