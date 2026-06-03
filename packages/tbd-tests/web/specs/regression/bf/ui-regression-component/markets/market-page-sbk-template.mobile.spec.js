const {
  EventPagePO,
  CardPO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
  SportsbookMarketPO,
  MarketPromoPO,
  ActionLinkPO,
  PebblePO,
} = require("../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getMarketLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);

const inlineSportsbookMarketPO = new InlineSportsbookMarketPO(firstCardPO.inlineSportsbookMarket);
const firstInlineRunnerButtonPO = new SportsbookBetButtonPO(inlineSportsbookMarketPO.betButtons[0]);
const secondInlineRunnerButtonPO = new SportsbookBetButtonPO(inlineSportsbookMarketPO.betButtons[1]);
const thirdInlineRunnerButtonPO = new SportsbookBetButtonPO(inlineSportsbookMarketPO.betButtons[2]);

const sportsbookMarketPO = new SportsbookMarketPO(firstCardPO.sportsbookMarket);
const firstSportsbookButtonPO = new SportsbookBetButtonPO(sportsbookMarketPO.runnerList[0]);
const firstRunnerBetButton = new SportsbookBetButtonPO(firstSportsbookButtonPO.sportsbookBetButton);
const secondSportsbookButtonPO = new SportsbookBetButtonPO(sportsbookMarketPO.runnerList[1]);
const secondRunnerBetButton = new SportsbookBetButtonPO(secondSportsbookButtonPO.sportsbookBetButton);
const thirdSportsbookButtonPO = new SportsbookBetButtonPO(sportsbookMarketPO.runnerList[2]);
const thirdRunnerBetButton = new SportsbookBetButtonPO(thirdSportsbookButtonPO.sportsbookBetButton);

const marketPromoPO = new MarketPromoPO();
const pebblesPO = new PebblePO();
const termsConditionsButtonPO = new ActionLinkPO(marketPromoPO.termsButtonPromoContainer);

const mockService = new MockService();
const SPORTSBOOK_MARKET_ID = "924.222615412";
const EVENT_ID = "29682729";
const URN = `ppb:tbd:view:event:${EVENT_ID}`;
const BLURB_LINK = "https://betting.betfair.com/bet-calculator/double/";

const getBFFMock = (template = "DEFAULT", marketType = "MATCH_ODDS") => ({
  urn: URN,
  sportevent: {
    urn: `ppb:event:${EVENT_ID}`,
    name: "Chelsea v Tottenham",
  },
  edges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: "ppb:tbd:card:fixture:29682729|viewLink",
        sportevent: {
          __typename: "SportsEvent",
          urn: "ppb:event:29682729",
        },
        fixture: {
          urn: "ppb:fixture:29682729",
          home: {
            name: "Chelsea",
            color: null,
            crest: null,
          },
          away: {
            name: "Tottenham",
            color: null,
            crest: null,
          },
          scheduledAt: "2020-02-22T12:30",
          duration: {
            period: "REGULAR",
            status: "PRE_MATCH",
          },
          penaltyShootout: null,
        },
        fixtureEventViewLink: {
          viewUrn: `ppb:tbd:view:event:${EVENT_ID}`,
          viewUrl: `/soccer/english-premier-league/wolves-v-man-utd/e-${EVENT_ID}`,
        },
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: `ppb:tbd:card:marketcard##${SPORTSBOOK_MARKET_ID}`,
        cardTitle: "Match Odds",
        displayRunners: {
          exchange: null,
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              eventId: EVENT_ID,
              urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID}`,
              name: "Match Odds",
              marketType,
              liveData: {
                inplay: false,
              },
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "Chelsea v Tottenham",
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  __typename: "Runner",
                  runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/55190`,
                  name: "Chelsea",
                  selectionId: 55190,
                  handicap: 0,
                },
                {
                  __typename: "Runner",
                  runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48224`,
                  name: "Tottenham",
                  selectionId: 48224,
                  handicap: 0,
                },
                {
                  __typename: "Runner",
                  runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/58805`,
                  name: "The Draw",
                  selectionId: 58805,
                  handicap: 0,
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
                viewUrl: BLURB_LINK,
                viewDisplayMode: "BLANK_INAPP",
                __typename: "ViewLink",
              },
            },
          },
        ],

        runnerViewLinks: [],
        template,
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
              viewUrl: routes.getEventViewUrl(EVENT_ID),
            },
          },
        ],
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:allMarkets:1",
      },
    },
  ],
});

const BFF_INLINE_MARKET_MOCK = {
  ...getBFFMock("INLINE", "MATCH_ODDS_90"),
  urn: `ppb:tbd:view:market:${SPORTSBOOK_MARKET_ID}`,
  mainMarket: { urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID}` },
  __typename: "SportsbookMarket",
};

const BFF_DEFAULT_MARKET_MOCK = {
  ...getBFFMock(),
  urn: `ppb:tbd:view:market:${SPORTSBOOK_MARKET_ID}`,
  mainMarket: { urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID}` },
  __typename: "SportsbookMarket",
};

const BFF_INLINE_MARKET_BLURB_MOCK = {
  ...getBFFMock("INLINE"),
  urn: `ppb:tbd:view:market:${SPORTSBOOK_MARKET_ID}`,
  mainMarket: { urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID}` },
  __typename: "SportsbookMarket",
};

const BFF_OUTRIGHT_MARKET_BLURB_MOCK = {
  ...getBFFMock("OUTRIGHT"),
  urn: `ppb:tbd:view:market:${SPORTSBOOK_MARKET_ID}`,
  mainMarket: { urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID}` },
  __typename: "SportsbookMarket",
};

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

describe("Given I am on the Sportsbook Football Market Page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(URN));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
  });

  describe("when the market template is inline", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(`ppb:tbd:view:market:${SPORTSBOOK_MARKET_ID}`, {
          currentUrl: routes.getMarketViewUrl(SPORTSBOOK_MARKET_ID),
        }),
      );
      await mockService.mockHttpRequest(getMarketLayout(BFF_INLINE_MARKET_MOCK));

      await browser.url(routes.getMarketViewUrl(SPORTSBOOK_MARKET_ID));
      await browser.waitUntilEquals(firstInlineRunnerButtonPO.odd, "1.1");
    });

    it("[PRPI-6131] the first button should have odds", async () => {
      expect(await firstInlineRunnerButtonPO.odd.getText()).toBe("1.1");
    });

    it("[PRPI-6132] the first button should have the runner name", async () => {
      expect(await firstInlineRunnerButtonPO.secondaryLabel.getText()).toBe("Chelsea");
    });

    it("[PRPI-6133] the second button should have odds", async () => {
      expect(await secondInlineRunnerButtonPO.odd.getText()).toBe("1.2");
    });

    it("[PRPI-6134] the second button should have the runner name", async () => {
      expect(await secondInlineRunnerButtonPO.secondaryLabel.getText()).toBe("Tottenham");
    });

    it("[PRPI-6135] the third button should have odds", async () => {
      expect(await thirdInlineRunnerButtonPO.odd.getText()).toBe("1.2");
    });

    it("[PRPI-6136] the third button should have the runner name", async () => {
      expect(await thirdInlineRunnerButtonPO.secondaryLabel.getText()).toBe("The Draw");
    });

    it("[PRPI-6137] shouldn't display any peble", async () => {
      expect(await pebblesPO.element.isExisting()).toBe(false);
    });

    it("[PRPI-6138] the 90 min blurb as correct title", async () => {
      expect(await marketPromoPO.title.getText()).toBe("Minute Guarantee (Match Odds 90)");
    });

    describe("and I click the 90 minute blurb", () => {
      beforeAll(async () => {
        await marketPromoPO.element.click();
      });

      it("[PRPI-6139] the 90 min blurb as correct description", async () => {
        const expectedDescription =
          "All pre match bets placed on Match Odds 90 markets will be paid out early if" +
          " winning at 90:00 regardless of the full-time result. To find out more, visit our FAQ page";

        expect(await marketPromoPO.description.getText()).toBe(expectedDescription);
      });

      describe("and I click the T&C link", () => {
        beforeAll(async () => {
          await termsConditionsButtonPO.element.click();
          // Wait for the new tab to appear (optional, but good to avoid flakiness)
          await browser.waitUntil(async () => (await browser.getWindowHandles()).length === 2, {
            timeout: 5000,
            timeoutMsg: "Expected a new tab to open",
          });
          const newWindows = await browser.getWindowHandles();
          await browser.switchToWindow(newWindows[1]);
          await browser.waitUntilBrowserUrlContains("support.betfair.com");
        });

        afterAll(async () => {
          const newWindows = await browser.getWindowHandles();
          await browser.switchToWindow(newWindows[0]);
        });

        it("[PRPI-6140] user navigates to support page", async () => {
          expect(await browser.getUrl()).toContain("support.betfair.com");
        });
      });
    });
  });

  describe("when the market template is default", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(`ppb:tbd:view:market:${SPORTSBOOK_MARKET_ID}`, {
          currentUrl: routes.getMarketViewUrl(SPORTSBOOK_MARKET_ID),
        }),
      );
      await mockService.mockHttpRequest(getMarketLayout(BFF_DEFAULT_MARKET_MOCK));

      await browser.url(routes.getMarketViewUrl(SPORTSBOOK_MARKET_ID));
      await browser.waitUntilEquals(firstRunnerBetButton.odd, "1.1");
    });

    it("[PRPI-6141] the first button should have odds", async () => {
      expect(await firstRunnerBetButton.odd.getText()).toBe("1.1");
    });

    it("[PRPI-6142] the second button should have odds", async () => {
      expect(await secondRunnerBetButton.odd.getText()).toBe("1.2");
    });

    it("[PRPI-6143] the third button should have odds", async () => {
      expect(await thirdRunnerBetButton.odd.getText()).toBe("1.2");
    });

    describe("and it has a 'informative blurb' with 'expand/collapse' control", () => {
      it("[PRPI-5143]when the user clicks on 'collapse chevron' the blurb is collapsed", async () => {
        await marketPromoPO.element.click();

        expect(await marketPromoPO.description.isDisplayed()).toBe(false);
      });
      it("[PRPI-5144]when the user clicks 'expand chevron' the blurb is expanded", async () => {
        await marketPromoPO.element.click();

        expect(await marketPromoPO.description.isDisplayed()).toBe(true);
      });
    });
  });

  describe("when the market template is outright", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(`ppb:tbd:view:market:${SPORTSBOOK_MARKET_ID}`, {
          currentUrl: routes.getMarketViewUrl(SPORTSBOOK_MARKET_ID),
        }),
      );
      await mockService.mockHttpRequest(getMarketLayout(BFF_OUTRIGHT_MARKET_BLURB_MOCK));
      await browser.url(routes.getMarketViewUrl(SPORTSBOOK_MARKET_ID));
    });

    describe("and it has a 'informative blurb' with 'expand/collapse' control", () => {
      it("[PRPI-5145]when the user clicks on 'collapse chevron' the blurb is collapsed", async () => {
        await marketPromoPO.element.click();

        expect(await marketPromoPO.description.isDisplayed()).toBe(false);
      });
      it("[PRPI-5146]when the user clicks 'expand chevron' the blurb is expanded", async () => {
        await marketPromoPO.element.click();

        expect(await marketPromoPO.description.isDisplayed()).toBe(true);
      });
    });
  });

  describe("when the market template is inline", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(`ppb:tbd:view:market:${SPORTSBOOK_MARKET_ID}`, {
          currentUrl: routes.getMarketViewUrl(SPORTSBOOK_MARKET_ID),
        }),
      );
      await mockService.mockHttpRequest(getMarketLayout(BFF_INLINE_MARKET_BLURB_MOCK));
      await browser.url(routes.getMarketViewUrl(SPORTSBOOK_MARKET_ID));
    });

    describe("and it has a 'informative blurb' with 'expand/collapse' control", () => {
      it("[PRPI-5147]when the user clicks on 'collapse chevron' the blurb is collapsed", async () => {
        await marketPromoPO.element.click();

        expect(await marketPromoPO.description.isDisplayed()).toBe(false);
      });

      it("[PRPI-5148]when the user clicks 'expand chevron' the blurb is expanded", async () => {
        await marketPromoPO.element.click();

        expect(await marketPromoPO.description.isDisplayed()).toBe(true);
      });

      it("[PRPI-5149]when the user clicks on blurb link it opens on a new tab", async () => {
        await marketPromoPO.termsButtonPromoContainer.click();
        await browser.switchWindow(BLURB_LINK);

        expect(await browser.getUrl()).toContain(BLURB_LINK);
      });
    });
  });
});
