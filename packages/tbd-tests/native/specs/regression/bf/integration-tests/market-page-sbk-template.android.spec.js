const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getEventLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { startApp, getInAppBrowserUrlDomain, openUrl } = require("../../../../helpers/urls");
const { getStartViewLinks } = require("../../../../helpers/view-link-start");

const MockService = require("../../../../mock-essentials/mocking-service");

const {
  GenericScreenSO,
  CardSO,
  InlineSportsbookMarketSO,
  SportsbookBetButtonSO,
  SportsbookMarketSO,
  RunnerSO,
  MarketPromoSO,
  ActionLinkSO,
} = require("../../../../screen-objects");

const sportsbookMarketSO = new SportsbookMarketSO();
const firstSportsbookRunnerSO = new RunnerSO(sportsbookMarketSO.runnerList[0]);
const firstSportsbookBetButtonSO = new SportsbookBetButtonSO(firstSportsbookRunnerSO.sbkBetButtons[0]);
const secondSportsbookRunnerSO = new RunnerSO(sportsbookMarketSO.runnerList[1]);
const secondSportsbookBetButtonSO = new SportsbookBetButtonSO(secondSportsbookRunnerSO.sbkBetButtons[0]);
const thirdSportsbookRunnerSO = new RunnerSO(sportsbookMarketSO.runnerList[2]);
const thirdSportsbookBetButtonSO = new SportsbookBetButtonSO(thirdSportsbookRunnerSO.sbkBetButtons[0]);

const genericScreenSOO = new GenericScreenSO();
const cardSO = new CardSO(genericScreenSOO.cards[0]);
const inlineSportsbookMarketSO = new InlineSportsbookMarketSO(cardSO.contentWrapper);
const firstInlineBetButton = new SportsbookBetButtonSO(inlineSportsbookMarketSO.sbkBetButtons[0]);
const secondInlineBetButton = new SportsbookBetButtonSO(inlineSportsbookMarketSO.sbkBetButtons[1]);
const thirdInlineBetButton = new SportsbookBetButtonSO(inlineSportsbookMarketSO.sbkBetButtons[2]);

const marketPromoSO = new MarketPromoSO();
const termsConditionsButtonSO = new ActionLinkSO(marketPromoSO.termsAndConditionsButton);
const secondMarketPromoSO = new MarketPromoSO(1);
const secondMarketPromoLinkSO = new ActionLinkSO(secondMarketPromoSO.termsAndConditionsButton);

const mockService = new MockService();
const SPORTSBOOK_MARKET_ID = "924.222615412";
const EVENT_ID = "29682729";
const EVENT_ID_INLINE = "29682730";

const SMP_MOCK = {
  markets: [
    {
      marketId: SPORTSBOOK_MARKET_ID,
      runnerDetails: [
        {
          selectionId: "55190",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "48224",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
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
      ],
    },
  ],
};

function getBFFMock(eventId = "29682729", template = "DEFAULT", marketType = "MATCH_ODDS") {
  return {
    urn: `ppb:tbd:view:event:${eventId}`,
    edges: [
      {
        node: {
          urn: "ppb:tbd:card:29436223##MATCH_ODDS",
          typename: "MarketCard",
          template,
          cardTitle: "Match Odds",
          displayRunners: {
            exchange: null,
            sportsbook: {
              market: {
                __typename: "SportsbookMarket",
                urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID}`,
                noLiveData: true,
                name: "Match Odds",
                marketType,
                hierarchy: {
                  __typename: "EventHierarchy",
                  sportevent: {
                    urn: `ppb:event:${eventId}`,
                  },
                },
                runners: [
                  {
                    runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/55190`,
                    selectionId: 55190,
                    name: "Wolves",
                  },
                  {
                    runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48224`,
                    selectionId: 48224,
                    name: "The Draw",
                  },
                  {
                    runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/58805`,
                    selectionId: 58805,
                    name: "Man Utd",
                  },
                ],
              },
              runners: [
                { runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/55190` },
                { runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48224` },
                { runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/58805` },
              ],
            },
          },
          blurbs: [
            {
              __typename: "InformativeBlurb",
              title: {
                __typename: "DisplayNameTitle",
                name: "Calculate potential payouts for double bets.",
              },
              description: {
                __typename: "DisplayNameTitle",
                name: "Betfair double bet calculator makes it easy to calculate potential payouts for double bets",
              },
              isCollapsed: false,
              supplementaryInfo: {
                __typename: "SupplementaryInfo",
                label: {
                  __typename: "DisplayNameTitle",
                  name: "Betfair double bet calculator",
                },
                viewLink: {
                  viewUrl: "support.betfair.com",
                  viewDisplayMode: "BLANK_INAPP",
                  __typename: "ViewLink",
                },
              },
            },
          ],
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
                viewUrl: "1",
              },
            },
          ],
        },
      },
    ],

    partialEdges: [
      {
        node: {
          urn: "ppb:tbd:card:29436223##MATCH_ODDS",
          __typename: "MarketCard",
        },
      },
      {
        node: {
          __typename: "QuickLinksCard",
          urn: "ppb:tbd:card:quickLinks:allMarkets:1",
        },
      },
    ],
  };
}

const BFF_DEFAULT_SBK_MARKET_MOCK = getBFFMock(EVENT_ID);
const BFF_INLINE_SBK_MARKET_MOCK = getBFFMock(EVENT_ID_INLINE, "INLINE", "MATCH_ODDS_90");

describe("Given I am on the Sportsbook Football Market Page ", () => {
  const urls = [`sport/competition/event/e-${EVENT_ID}`, `sport/competition/event/e-${EVENT_ID_INLINE}`];
  const HOME_VIEW_LINKS = getStartViewLinks(urls);
  beforeAll(async () => {
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    await mockService.mockHttpRequest(getImplyBetsResponse({}, { ignoreLegsOrder: true }));
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINKS));
  });
  describe("when market template is default", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getEventLayout(BFF_DEFAULT_SBK_MARKET_MOCK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINKS });

      await browser.waitUntilEquals(firstSportsbookBetButtonSO.odd, "1.1");
      await browser.waitUntilEquals(secondSportsbookBetButtonSO.odd, "1.2");
      await browser.waitUntilEquals(thirdSportsbookBetButtonSO.odd, "1.2");
    });

    it("[PRPI-3044] the first button odd should be displayed", async () => {
      expect(await firstSportsbookBetButtonSO.odd.getText()).toBe("1.1");
    });

    it("[PRPI-3045] the second button need to be correct", async () => {
      expect(await secondSportsbookBetButtonSO.odd.getText()).toBe("1.2");
    });

    it("[PRPI-3046] the third button need to be correct", async () => {
      expect(await thirdSportsbookBetButtonSO.odd.getText()).toBe("1.2");
    });

    describe("and I click on the market blurb", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(marketPromoSO.element);
      });

      it("[PRPI-3047] collapses blurb when it is expanded", async () => {
        await marketPromoSO.element.click();
        await browser.waitUntilNotDisplayed(marketPromoSO.description);

        expect(await marketPromoSO.description.isDisplayed()).toBe(false);
      });

      it("[PRPI-3048] expands blurb when it is collapsed", async () => {
        await marketPromoSO.element.click();
        await browser.waitUntilDisplayed(marketPromoSO.description);

        expect(await marketPromoSO.description.isDisplayed()).toBe(true);
      });

      it("[PRPI-3049] has the correct navigation text", async () => {
        await browser.waitUntilClickableNative(termsConditionsButtonSO.element, "Link not clickable");

        expect(await termsConditionsButtonSO.text.getText()).toContain("Betfair double bet calculator");
      });
    });
  });

  describe("when market template is inline", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getEventLayout(BFF_INLINE_SBK_MARKET_MOCK));

      await openUrl(urls[1], { isViewLinkStartPage: !!HOME_VIEW_LINKS, nthViewLink: 1 });

      await browser.waitUntilEquals(firstInlineBetButton.odd, "1.1");
      await browser.waitUntilEquals(firstInlineBetButton.secondaryLabel, "Wolves");
      await browser.waitUntilEquals(secondInlineBetButton.odd, "1.2");
      await browser.waitUntilEquals(secondInlineBetButton.secondaryLabel, "The Draw");
      await browser.waitUntilEquals(thirdInlineBetButton.odd, "1.2");
      await browser.waitUntilEquals(thirdInlineBetButton.secondaryLabel, "Man Utd");
    });

    it("[PRPI-3050] the first button need to be correct", async () => {
      expect(await firstInlineBetButton.odd.getText()).toBe("1.1");
    });

    it("[PRPI-3051] the first button should have the runner name", async () => {
      expect(await firstInlineBetButton.secondaryLabel.getText()).toBe("Wolves");
    });

    it("[PRPI-3052] the second button need to be correct", async () => {
      expect(await secondInlineBetButton.odd.getText()).toBe("1.2");
    });

    it("[PRPI-3053] the second button should have the runner name", async () => {
      expect(await secondInlineBetButton.secondaryLabel.getText()).toBe("The Draw");
    });

    it("[PRPI-3054] the third button need to be correct", async () => {
      expect(await thirdInlineBetButton.odd.getText()).toBe("1.2");
    });

    it("[PRPI-3055] the third button should have the runner name", async () => {
      expect(await thirdInlineBetButton.secondaryLabel.getText()).toBe("Man Utd");
    });

    describe("and I click the 90 minute blurb followed by the T&C link", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(marketPromoSO.element);
        await marketPromoSO.element.click();

        await browser.waitUntilClickableNative(termsConditionsButtonSO.element);
        await termsConditionsButtonSO.element.click();
      });

      it("[PRPI-3056] the user navigates to support page", async () => {
        expect(await getInAppBrowserUrlDomain()).toContain("support.betfair.com");
      });
    });

    describe("and I click on the market blurb", () => {
      beforeAll(async () => {
        await driver.back();
        await browser.waitUntilClickableNative(secondMarketPromoSO.element);
      });

      it("[PRPI-3057] collapses blurb when it is expanded", async () => {
        await secondMarketPromoSO.element.click();
        await browser.waitUntilNotDisplayed(secondMarketPromoSO.description);

        expect(await secondMarketPromoSO.description.isDisplayed()).toBe(false);
      });

      it("[PRPI-3058] expands blurb when it is collapsed", async () => {
        await secondMarketPromoSO.element.click();
        await browser.waitUntilDisplayed(secondMarketPromoSO.description);

        expect(await secondMarketPromoSO.description.isDisplayed()).toBe(true);
      });

      it("[PRPI-3059] has the correct navigation text", async () => {
        await browser.waitUntilClickableNative(secondMarketPromoLinkSO.element, "Link not clickable");

        expect(await secondMarketPromoLinkSO.text.getText()).toContain("Betfair double bet calculator");
      });
    });
  });
});
