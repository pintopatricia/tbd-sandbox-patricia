const {
  SportPagePO,
  SportsbookPlacePanelPO,
  CardPO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
  BetslipDrawerPO,
  AlertPO,
  AlertsPO,
  PrimaryButtonPO,
  MinimizedPO,
} = require("../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const EventMarketCardPO = require("@ppb/tbd-shared/components/EventMarketCard/EventMarketCard.po");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const sportPagePO = new SportPagePO();
const firstEventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[0]);
const firstMatchOddsCard = new CardPO(firstEventMarketCardPO.market);
const firstSbkMarketPO = new InlineSportsbookMarketPO(firstMatchOddsCard.inlineSportsbookMarket);
const firstSbkRunnerPO = new SportsbookBetButtonPO(firstSbkMarketPO.betButtons[0]);
const placePanelPO = new SportsbookPlacePanelPO();
const alertsPO = new AlertsPO();
const alertPO = new AlertPO(alertsPO.element);
const betslipDrawerPO = new BetslipDrawerPO();
const placeButtonPO = new PrimaryButtonPO(placePanelPO.element);
const sportbookMinimizedBetslipPO = new MinimizedPO();

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
  maxPayout: 100000,
};

describe("Max Payout Message", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_MOCK.urn, {
        countryCode: "US",
      }),
    );
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await browser.url(`${routes.getEventViewUrl(EVENT_TYPE_ID)}`);
    await browser.waitUntilDisplayed(sportPagePO.actionLink[0]);
    await browser.waitUntilEquals(firstSbkRunnerPO.odd, "10");
    await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
  });
  describe("When a user opens the betslip with a single selection", () => {
    beforeAll(async () => {
      await firstSbkRunnerPO.sportsbookBetButton.waitForClickable();
      await firstSbkRunnerPO.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(placePanelPO.element, "First selection hasn't been added");
      await browser.waitUntilDisplayed(alertPO.element, "Notification was not displayed");
    });
    it("[PRPI-6365] The message 'Maximum payout limits may be applied' should be visible", async () => {
      expect(await alertPO.message.getText()).toBe("Maximum payout limits may be applied");
    });
    it("[PRPI-6366] The detail 'Bets are subject to Betfair's Terms & Conditions, including maximum payout limits. See T&C\u2019s.' should be visible", async () => {
      const detailText = await alertPO.detail.getText();
      const linkText = await alertPO.link.getText();
      const expectedText = `${detailText} ${linkText}`;

      expect(expectedText).toBe(
        "Bets are subject to Betfair's Terms & Conditions, including maximum payout limits. See T&C’s.",
      );
    });
    it("[PRPI-6367] The warning icon should be displayed", async () => {
      expect(await alertPO.icon.isDisplayed()).toBe(true);
    });
    it("[PRPI-6368] The url extra detail info 'See T&C\u2019s.' should be displayed", async () => {
      expect(await alertPO.link.getText()).toBe("See T&C’s.");
      expect(await alertPO.link.getAttribute("href")).toBe(
        "https://www.betfair.com/en/aboutUs/Sportsbook.Rules.And.Regulations/#MaxWin",
      );
    });
    it("[PRPI-6369] The 'Accept' button should be visible", async () => {
      expect(await alertPO.actionLink.getText()).toBe("Accept");
    });
    it("[PRPI-6370] The place bet button should be enabled", async () => {
      expect(await placeButtonPO.element.isEnabled()).toBe(true);
    });

    describe("When the user taps 'Accept' button", () => {
      beforeAll(async () => {
        await browser.waitUntilDisplayed(placePanelPO.element, "Place panel hasn't been loaded");
        await alertPO.actionLink.waitForClickable();
        await alertPO.actionLink.click();
      });
      it("[PRPI-6371] The notification should be dismissed", async () => {
        expect(await alertPO.element.isExisting()).toBe(false);
      });

      describe("When the user closes the betslip and then opens it with a single selection", () => {
        beforeAll(async () => {
          await betslipDrawerPO.header.waitForClickable();
          await betslipDrawerPO.header.click();
          await browser.waitUntilNotDisplayed(placePanelPO.element, "Singles panel hasn't been minimized");
          await sportbookMinimizedBetslipPO.element.waitForClickable();
          await sportbookMinimizedBetslipPO.element.click();
          await browser.waitUntilDisplayed(placePanelPO.element, "Singles panel hasn't been maximized");
        });
        it("[PRPI-6372] The notification should not be visible", async () => {
          expect(await alertPO.element.isExisting()).toBe(false);
        });
      });
    });
  });
});
