const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getEventLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const { SportsbookMarketSO, SportsbookBetButtonSO, RunnerSO, SnackbarSO } = require("../../../../screen-objects");

const mockService = new MockService();

const runnerSO = new RunnerSO();
const sportsbookMarketSO = new SportsbookMarketSO();

const SPORTSBOOK_MARKET_ID = "924.222615412";
const EVENT_ID = "29682729";

const firstSportsbookRunnerSO = new RunnerSO(sportsbookMarketSO.runnerList[0]);
const firstSportsbookBetButtonSO = new SportsbookBetButtonSO(firstSportsbookRunnerSO.sbkBetButtons[0]);

const snackbarSO = new SnackbarSO();

const BFF_MOCK = (withMarketPromo = false) => ({
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223##MATCH_ODDS",
        typename: "MarketCard",
        cardTitle: "Match Odds",
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID}`,
              noLiveData: true,
              name: "Match Odds",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48044`,
                  selectionId: 48044,
                  name: "Wolves",
                },
                {
                  runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/58805`,
                  selectionId: 58805,
                  name: "The Draw",
                },
                {
                  runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48351`,
                  selectionId: 48351,
                  name: "Man Utd",
                },
              ],
            },
            runners: [
              { runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48044` },
              { runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/58805` },
              { runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48351` },
            ],
          },
        },
        ...(withMarketPromo && {
          marketPromo: {
            title: "market title",
            description: "market description",
            signposting: "EXTRA_PLACES",
          },
          blurbs: [],
        }),
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
  ],
});

const SMP_MOCK = {
  markets: [
    {
      marketId: SPORTSBOOK_MARKET_ID,
      runnerDetails: [
        {
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.53 },
          },
          selectionId: "48044",
        },
        {
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
          },
          selectionId: "58805",
        },
        {
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
          },
          selectionId: "48351",
        },
      ],
    },
  ],
};

const SMP_MOCK_POLLING = {
  markets: [
    {
      marketId: SPORTSBOOK_MARKET_ID,
      runnerDetails: [
        {
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.65 },
          },
          selectionId: "48044",
        },
        {
          noOdds: true,
          selectionId: "48351",
        },
      ],
    },
  ],
};

const SMP_MOCK_SUSPENDED_MARKET = {
  markets: [
    { marketId: SPORTSBOOK_MARKET_ID, runnerDetails: SMP_MOCK.markets[0].runnerDetails, marketStatus: "SUSPENDED" },
  ],
};

const SMP_MOCK_CLOSED_MARKET = {
  markets: [{ marketId: SPORTSBOOK_MARKET_ID, marketStatus: "CLOSED" }],
};

const SUSPENDED_SBK_RUNNER = {
  markets: [
    {
      marketId: SPORTSBOOK_MARKET_ID,
      runnerDetails: [
        {
          runnerStatus: "SUSPENDED",
          selectionId: "48044",
        },
      ],
    },
  ],
};

describe("Sportsbook Market Card Component", () => {
  describe("When user enters event view", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK()));
      const url = `sport/competition/event/e-${EVENT_ID}`;
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, pullToRefresh: true });
      await browser.waitUntilDisplayed(snackbarSO.element);
      await snackbarSO.closeButton.click();
      await browser.waitUntilEquals(runnerSO.runnerName, "Wolves");
    });

    it("[PRPI-2530] The runners should be displayed", async () => {
      expect(await sportsbookMarketSO.runnerList.length).toBe(3);
    });

    it("[PRPI-2531] The first runner name should be correct", async () => {
      expect(await runnerSO.runnerName.getText()).toBe("Wolves");
    });

    it("[PRPI-2532] The first bet button should have the correct odd", async () => {
      // ensure prices loaded for price check
      await browser.waitUntilEquals(firstSportsbookBetButtonSO.odd, "1.53");

      expect(await firstSportsbookBetButtonSO.odd.getText()).toBe("1.53");
    });

    describe("And the odd of the first runner is updated", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_POLLING));
        await browser.waitUntilEquals(firstSportsbookBetButtonSO.odd, "2.65");
      });

      it("[PRPI-2533] The first bet button should have the odd updated", async () => {
        expect(await firstSportsbookBetButtonSO.odd.getText()).toBe("2.65");
      });

      describe("And the first runner is updated and gets suspended", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getMarketPrices(SUSPENDED_SBK_RUNNER));
          await browser.waitUntilEquals(await firstSportsbookBetButtonSO.odd, "-");
        });

        it("[PRPI-2534] The first bet button should present no odds", async () => {
          expect(await firstSportsbookBetButtonSO.odd.getText()).toBe("-");
        });

        describe("When the user taps on the suspended bet button", () => {
          beforeAll(async () => {
            await firstSportsbookBetButtonSO.element.click();
            await browser.waitUntilDisplayed(snackbarSO.title);
          });

          it("[PRPI-4225] The toast message should be displayed: 'Suspended'", async () => {
            expect(await snackbarSO.title.getText()).toBe("Suspended");
          });

          describe("And the market suspends", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_SUSPENDED_MARKET));
              await browser.waitUntilEquals(firstSportsbookBetButtonSO.odd, "-");
            });

            it("[PRPI-2535] The bet button should present no odds", async () => {
              expect(await firstSportsbookBetButtonSO.odd.getText()).toBe("-");
            });

            describe("When the user taps one of the suspended bet buttons", () => {
              beforeAll(async () => {
                await firstSportsbookBetButtonSO.element.click();
                await browser.waitUntilDisplayed(snackbarSO.title);
              });

              it("[PRPI-4226] The toast message should be displayed: 'Suspended'", async () => {
                expect(await snackbarSO.title.getText()).toBe("Suspended");
              });
            });

            describe("And the market opens", () => {
              beforeAll(async () => {
                await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_POLLING));
                await browser.waitUntilEquals(firstSportsbookBetButtonSO.odd, "2.65");
              });

              it("[PRPI-2536] The first bet button should have the odd updated", async () => {
                expect(await firstSportsbookBetButtonSO.odd.getText()).toBe("2.65");
              });
            });

            describe("And the market closes", () => {
              beforeAll(async () => {
                await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_CLOSED_MARKET));
                await browser.waitUntilEquals(firstSportsbookBetButtonSO.odd, "-");
              });

              it("[PRPI-2536] The bet button should present no odds", async () => {
                expect(await firstSportsbookBetButtonSO.odd.getText()).toBe("-");
              });

              describe("When the user taps one of the closed bet buttons", () => {
                beforeAll(async () => {
                  await firstSportsbookBetButtonSO.element.click();
                  await browser.waitUntilDisplayed(snackbarSO.title);
                });

                it("[PRPI-2536] The toast message should be displayed: 'Closed'", async () => {
                  expect(await snackbarSO.title.getText()).toBe("Closed");
                });
              });
            });
          });
        });
      });
    });
  });
});
