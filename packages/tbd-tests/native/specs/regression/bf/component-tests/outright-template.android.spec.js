const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;

const { getMarketLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const MockService = require("../../../../mock-essentials/mocking-service");
const {
  SportsbookBetButtonSO,
  ShowMoreSO,
  SwitchSO,
  RunnerSO,
  SportsbookMarketSO,
  MarketPromoSO,
} = require("../../../../screen-objects");

const mockService = new MockService();

const sportsbookMarketSO = new SportsbookMarketSO();
const marketPromoSO = new MarketPromoSO();
const runnerSO = new RunnerSO(sportsbookMarketSO.element);
const showMoreSO = new ShowMoreSO();
const switchSO = new SwitchSO();
const firstRunner = new SportsbookBetButtonSO(runnerSO.sbkBetButtons[0]);
const secondRunner = new SportsbookBetButtonSO(runnerSO.sbkBetButtons[1]);
const thirdRunner = new SportsbookBetButtonSO(runnerSO.sbkBetButtons[2]);
const fourthRunner = new SportsbookBetButtonSO(runnerSO.sbkBetButtons[3]);

const SPORTSBOOK_MARKET_ID = "924.222615412";
const EVENT_ID = "29682729";

const BASE_BFF_MARKET_RUNNERS = [
  {
    runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48044`,
    selectionId: 48044,
    name: "Rory McIlroy",
  },
  {
    runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/58805`,
    selectionId: 58805,
    name: "Tom Kim",
  },
  {
    runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48351`,
    selectionId: 48351,
    name: "Tiger Woods",
  },
  {
    runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/45877`,
    selectionId: 45877,
    name: "Phil Mickelson",
  },
];

const BASE_BFF_SBK_RUNNERS = [
  {
    runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48044`,
  },
  {
    runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/58805`,
  },
  {
    runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48351`,
  },
  {
    runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/45877`,
  },
];

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    urn: `ppb:event:${EVENT_ID}`,
  },
  edges: [
    {
      node: {
        __typename: "PebbleCardGroup",
        urn: `ppb:tbd:cardgroup:pebble:marketTemplateEvent:${SPORTSBOOK_MARKET_ID}`,
        pebbleCardGroupTitle: {
          translated: "Win",
          translate: null,
        },
        pebbleExpanded: true,
        selectedItemUrn: `ppb:tbd:card:market:${SPORTSBOOK_MARKET_ID}|0|true|false|true|0`,
        full: {
          edges: [
            {
              name: "Match Odds",
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:market:${SPORTSBOOK_MARKET_ID}|0|true|false|true|0`,
                defaultIndex: 0,
                displayRunners: {
                  exchange: null,
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      eventId: EVENT_ID,
                      urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID}`,
                      name: "Match Odds",
                      marketType: "BOTH_TEAMS_TO_SCORE",
                      marketTypeName: null,
                      bettingType: "ODDS",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [...BASE_BFF_MARKET_RUNNERS],
                    },
                    runners: [...BASE_BFF_SBK_RUNNERS],
                  },
                },
                runnerViewLinks: [],
                isRunnerExpandable: null,
                template: "OUTRIGHT",
                numberOfItemsToDisplay: 2,
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              name: "Win",
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:market:${SPORTSBOOK_MARKET_ID}|0|true|false|true|0`,
              },
            },
          ],
        },
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: SPORTSBOOK_MARKET_ID,
      numberOfPlaces: 3,
      placeFraction: { numerator: 1, denominator: 5 },
      eachwayAvailable: true,
      runnerDetails: [
        {
          selectionId: 48044,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 6.5 },
          },
        },
        {
          selectionId: 58805,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
          },
        },
        {
          selectionId: 48351,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.9 },
          },
        },
        {
          selectionId: 45877,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 4.2 },
          },
        },
      ],
    },
  ],
};

describe("Market Card Component - Outright Template", () => {
  describe("When user goes to a market card with outright template", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await mockService.mockHttpRequest(getMarketLayout(BFF_MOCK));
      const url = `golf/whiskas/saquetas/e-${EVENT_ID}`;
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilDisplayed(sportsbookMarketSO.blurbs);
      await browser.waitUntilEquals(marketPromoSO.title, "Each Way: 1/5 Odds, 3 Places");
    });

    it("[PRPI-2363] The market promo component should be displayed", async () => {
      expect(await marketPromoSO.title.getText()).toBe("Each Way: 1/5 Odds, 3 Places");
    });

    it("[PRPI-2364] The A-Z switcher should be displayed", async () => {
      expect(await switchSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-2365] The Show More should be displayed", async () => {
      expect(await showMoreSO.element.isDisplayed()).toBe(true);
      expect(await showMoreSO.text.getText()).toBe("Show More");
    });

    it("[PRPI-2366] The number of runners should be 2", async () => {
      expect(await runnerSO.sbkBetButtons.length).toBe(2);
    });

    it("[PRPI-2367] The first runner to have the correct name and odd", async () => {
      expect(await firstRunner.secondaryLabel.getText()).toBe("RORY MCILROY");
      expect(await firstRunner.odd.getText()).toBe("6.5");
    });

    it("[PRPI-2368] The second runner to have the correct name and odd", async () => {
      expect(await secondRunner.secondaryLabel.getText()).toBe("TOM KIM");
      expect(await secondRunner.odd.getText()).toBe("1.2");
    });

    describe("When user clicks on Show More", () => {
      beforeAll(async () => {
        await showMoreSO.element.click();
        await browser.waitUntilEquals(thirdRunner.secondaryLabel, "TIGER WOODS");
      });

      it("[PRPI-2369] The third runner to have the correct name and odd", async () => {
        expect(await thirdRunner.secondaryLabel.getText()).toBe("TIGER WOODS");
        expect(await thirdRunner.odd.getText()).toBe("2.9");
      });

      it("[PRPI-2370] The fourth runner to have the correct name and odd", async () => {
        expect(await fourthRunner.secondaryLabel.getText()).toBe("PHIL MICKELSON");
        expect(await fourthRunner.odd.getText()).toBe("4.2");
      });

      it("[PRPI-2371] The Show More should be displayed", async () => {
        expect(await showMoreSO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-2372] The number of runners should be 4", async () => {
        expect(await runnerSO.sbkBetButtons.length).toBe(4);
      });

      describe("When user clicks on A-Z Switch", () => {
        beforeAll(async () => {
          await switchSO.element.click();
          await browser.waitUntilEquals(firstRunner.secondaryLabel, "PHIL MICKELSON");
        });

        it("[PRPI-2373] The first runner should be now Phil Mickelson", async () => {
          expect(await firstRunner.secondaryLabel.getText()).toBe("PHIL MICKELSON");
          expect(await firstRunner.odd.getText()).toBe("4.2");
        });

        it("[PRPI-2374] The second runner should be now Rory McIlroy", async () => {
          expect(await secondRunner.secondaryLabel.getText()).toBe("RORY MCILROY");
          expect(await secondRunner.odd.getText()).toBe("6.5");
        });

        it("[PRPI-2375] The third runner should be now Tiger Woods", async () => {
          expect(await thirdRunner.secondaryLabel.getText()).toBe("TIGER WOODS");
          expect(await thirdRunner.odd.getText()).toBe("2.9");
        });

        it("[PRPI-2376] The fourth runner should be now Tom Kim", async () => {
          expect(await fourthRunner.secondaryLabel.getText()).toBe("TOM KIM");
          expect(await fourthRunner.odd.getText()).toBe("1.2");
        });
      });
    });
  });
});
