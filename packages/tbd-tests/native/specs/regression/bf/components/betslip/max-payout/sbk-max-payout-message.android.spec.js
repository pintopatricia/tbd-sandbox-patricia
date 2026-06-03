const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const {
  getAppContext,
  getSportsLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../../helpers/view-link-start");

const {
  GenericScreenSO,
  SportsbookPlacePanelSO,
  InlineSportsbookMarketSO,
  CardSO,
  SportsbookBetButtonSO,
  BetslipDrawerSO,
  MinimizedSO,
  AlertSO,
  PrimaryButtonSO,
} = require("../../../../../../screen-objects");

const mockService = new MockService(driver.capabilities.deviceName);
const genericScreenSO = new GenericScreenSO();
const firstCardSO = new CardSO(genericScreenSO.cards[0]);
const firstMarketSO = new InlineSportsbookMarketSO(firstCardSO.contentWrapper);
const firstRunnerSO = new SportsbookBetButtonSO(firstMarketSO.sbkBetButtons[0]);

const singlePanelSO = new SportsbookPlacePanelSO();
const alertSO = new AlertSO();

const betslipDrawerSO = new BetslipDrawerSO();
const minimizedSO = new MinimizedSO();
const placeButtonSO = new PrimaryButtonSO(singlePanelSO.element);

const EVENT_TYPE_ID = 1;

const APP_CONTEXT_MOCK = {
  currencyCode: "USD",
  countryCode: "US",
  loggedIn: "true",
  throttles: {
    DAILY_PAYOUT_LIMIT: { isActive: true },
  },
};

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.1",
      runnerDetails: [
        {
          selectionId: "1",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 10 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: "924.2",
      runnerDetails: [
        {
          selectionId: "1",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.4 },
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
        cardGroupTitle: "League 1",
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
                title: "Team A vs Team B",
                fixture: {
                  urn: "ppb:fixture:29359895",
                  home: {
                    name: "Team A",
                  },
                  away: {
                    name: "Team B",
                  },
                },
                sportevent: {
                  name: "Team A vs Team B",
                  urn: "ppb:event:29359895",
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
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team A v Team B",
                          urn: "ppb:event:29359895",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.1/1",
                          selectionId: 1,
                          name: "Team A",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/2",
                          selectionId: 2,
                          name: "Draw",
                        },
                      ],
                    },
                    runners: [{ runnerURN: "ppb:sbkRunner:924.1/1" }, { runnerURN: "ppb:sbkRunner:924.1/2" }],
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
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:2",
        cardGroupTitle: "League 2",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359896",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359896",
                title: "Team C vs Team D",
                fixture: {
                  urn: "ppb:fixture:29359896",
                  home: {
                    name: "Team C",
                  },
                  away: {
                    name: "Team D",
                  },
                },
                sportevent: {
                  name: "Team C vs Team D",
                  urn: "ppb:event:29359896",
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
                      urn: "ppb:sbkMarket:924.2",
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team C v Team D",
                          urn: "ppb:event:29359896",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.2/1",
                          selectionId: 1,
                          name: "Team C",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.2/2",
                          selectionId: 2,
                          name: "Draw",
                        },
                      ],
                    },
                    runners: [{ runnerURN: "ppb:sbkRunner:924.2/1" }, { runnerURN: "ppb:sbkRunner:924.2/2" }],
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
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:2",
      },
    },
  ],
};

const FIRST_SINGLE_MOCK = {
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

  betMinStake: 0.1,
  betMaxStake: 100000000,
  betMaxPayout: 100000,
  averageOdds: 10,
  winAverageOdds: 10,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 10 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.1",
    selectionId: 1,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 10 },
    },
    decimalDisplayOdds: {
      decimalOdds: 10,
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

describe("Max Payout Message", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext(APP_CONTEXT_MOCK));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
    const url = "football/s-1";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(genericScreenSO.element);
    await browser.waitUntilDisplayed(firstRunnerSO.element);
    await browser.waitUntilClickableNative(firstRunnerSO.element);
  });
  describe("When a user opens the betslip with a single selection", () => {
    beforeAll(async () => {
      await firstRunnerSO.element.click();
      await browser.waitUntilDisplayed(
        singlePanelSO.element,
        "Sportsbook single place panel element was not displayed",
      );
      await browser.waitUntilDisplayed(alertSO.element, "Alert was not displayed");
    });
    it("[PRPI-3595] The message 'Maximum payout limits may be applied' should be visible", async () => {
      expect(await alertSO.message.getText()).toBe("Maximum payout limits may be applied");
    });
    it("[PRPI-3596] The detail 'Bets are subject to Betfair's Terms & Conditions, including maximum payout limits. See T&C\u2019s.' should be visible", async () => {
      expect(await alertSO.detail.getText()).toBe(
        "Bets are subject to Betfair's Terms & Conditions, including maximum payout limits. See T&C’s.",
      );
    });
    it("[PRPI-3597] The warning icon should be displayed", async () => {
      expect(await alertSO.icon.isDisplayed()).toBe(true);
    });
    it("[PRPI-3598] The 'Accept' button should be visible", async () => {
      expect(await alertSO.actionLabel.getText()).toBe("Accept");
    });
    it("[PRPI-3599] The place bet button should have the text 'Please Enter Stake'", async () => {
      expect(await placeButtonSO.label.getText()).toBe("Please Enter Stake");
    });

    describe("When the user taps 'Accept' button", () => {
      beforeAll(async () => {
        await alertSO.action.click();
        await browser.waitUntilNotDisplayed(alertSO.element);
      });
      it("[PRPI-3600] The alert should be dismissed", async () => {
        expect(await alertSO.element.isExisting()).toBe(false);
      });
    });
    describe("When the user closes the betslip and then opens it with a single selection", () => {
      beforeAll(async () => {
        await betslipDrawerSO.header.click();
        await browser.waitUntilNotDisplayed(singlePanelSO.element, "Singles panel hasn't been minimized");
        await minimizedSO.element.click();
        await browser.waitUntilDisplayed(singlePanelSO.element, "Singles panel hasn't been maximized");
      });
      it("[PRPI-3601] The alert should not be visible", async () => {
        expect(await alertSO.element.isExisting()).toBe(false);
      });
    });
  });
});
