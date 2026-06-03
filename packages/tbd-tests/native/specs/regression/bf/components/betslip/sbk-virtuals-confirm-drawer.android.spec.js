const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;

const {
  getAppContext,
  getGenericLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MarketSO = require("@ppb/tbd-shared/components/Market/Market.so");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

const MockService = require("../../../../../mock-essentials/mocking-service");

const {
  MinimizedSO,
  VirtualRunnerSO,
  SportsbookPlacePanelSO,
  SportsbookMarketSO,
  RunnerSO,
  SportsbookBetButtonSO,
  BetslipDrawerSO,
  ConfirmDrawerSO,
  BetDetailsSO,
} = require("../../../../../screen-objects");

const confirmDrawerSO = new ConfirmDrawerSO();
const minimizedSO = new MinimizedSO();
const marketSO = new MarketSO();
const realMarketSO = new SportsbookMarketSO(marketSO.element);
const realRunnerSO = new RunnerSO(realMarketSO.runnerList[0]);
const realBetButtonSO = new SportsbookBetButtonSO(realRunnerSO.sbkBetButtons[0]);
const virtualRunnerSO = new VirtualRunnerSO();
const virtualBetButtonPO = new SportsbookBetButtonSO(virtualRunnerSO.sbkBetButtons[0]);
const placePanelSO = new SportsbookPlacePanelSO();
const betDetailsSO = new BetDetailsSO(placePanelSO.element);

const betslipDrawerSO = new BetslipDrawerSO();

const mockService = new MockService();

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

const VIRTUAL_SPORT = {
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
  openDate: "2022-01-23T19:00:00.000Z",
  venue: null,
  distance: null,
  sport: VIRTUAL_SPORT,
};

const CATALOGUE_MOCK = {
  urn: "ppb:tbd:view:generic:virtuals",
  title: "Virtuals",
  url: "view/d-virtuals",
  edges: [
    {
      name: "Virtual Match Odds",
      node: {
        __typename: "VirtualMarketCard",
        urn: "ppb:tbd:card:virtualMarket:924.309735402",
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
            sport: VIRTUAL_SPORT,
            event: VIRTUAL_EVENT,
            runners: [
              {
                __typename: "VirtualRunner",
                name: "Porto FC",
                odds: { decimal: 4, fractional: { denominator: 2, numerator: 1 } },
                runnerURN: "ppb:virtualRunner:24001",
                selectionId: 24001,
              },
            ],
          },
        },
      },
    },
    {
      name: "Real Match Odds",
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:market:924.1",
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              eventId: 12345,
              urn: "ppb:sbkMarket:924.1",
              name: "Match Odds",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  urn: `ppb:event:${12345}`,
                },
              },
              runners: [
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.1/1",
                  name: "Chelsea",
                  selectionId: 1,
                  handicap: 0,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.1/2",
                  name: "Draw",
                  selectionId: 2,
                  handicap: 0,
                },
              ],
            },
            runners: [{ runnerURN: "ppb:sbkRunner:924.1/1" }, { runnerURN: "ppb:sbkRunner:924.1/2" }],
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      name: "Virtual Match Odds",
      node: {
        __typename: "VirtualMarketCard",
        urn: "ppb:tbd:card:virtualMarket:924.309735402",
      },
    },
    {
      name: "Real Match Odds",
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:market:924.1",
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
      legCombinations: [{ runners: [{ marketId: "924.1", selectionId: 1 }] }],
    },
  ],

  runnerOdds: [
    {
      runner: { marketId: "924.1", selectionId: 1 },
      odds: {
        decimalDisplayOdds: { decimalOdds: 4 },
        trueOdds: { decimalOdds: { decimalOdds: 4 } },
      },
    },
  ],
};

describe("Virtuals - Confirm Drawer", () => {
  describe("When betslip is populated with real sports selections", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getAppContext());
      await mockService.mockHttpRequest(getGenericLayout(CATALOGUE_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
      const url = "view/d-virtuals";
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

      await browser.waitUntilDisplayed(realBetButtonSO.element);
      await browser.waitUntilClickableNative(realBetButtonSO.element);
      await realBetButtonSO.element.click();

      await browser.waitUntilDisplayed(placePanelSO.element, "First selection hasn't been added");
      await browser.waitUntilStopsMoving(betslipDrawerSO.header);
      await browser.waitUntilClickableNative(betslipDrawerSO.header);
      await betslipDrawerSO.header.click();
      await browser.waitUntilNotDisplayed(placePanelSO.element);
    });

    describe("And a virtual bet button is pressed", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(virtualBetButtonPO.element);
        await virtualBetButtonPO.element.click();
        await browser.waitUntilEquals(confirmDrawerSO.title, "Clear Betslip?");
      });

      it("[PRPI-3571] the confirm drawer should display title 'Clear Betslip?'", async () => {
        expect(await confirmDrawerSO.title.getText()).toBe("Clear Betslip?");
      });

      it("[PRPI-3572] the confirm drawer should display subtitle 'Virtual bets and Sports bets cannot be combined in the same betslip'", async () => {
        expect(await confirmDrawerSO.subtitle.getText()).toBe(
          "Virtual bets and Sports bets cannot be combined in the same betslip",
        );
      });

      it("[PRPI-3573] the confirm drawer should display refuse option as 'Continue with sport bet'", async () => {
        expect(await confirmDrawerSO.refuseLabel.getText()).toBe("Continue with sport bet");
      });

      it("[PRPI-3574] the confirm drawer should display accept option as 'Clear Betslip'", async () => {
        expect(await confirmDrawerSO.acceptLabel.getText()).toBe("Clear Betslip");
      });

      describe("When I press 'Continue with the sport bet'", () => {
        beforeAll(async () => {
          await browser.waitUntilStopsMoving(confirmDrawerSO.refuseButton);
          await browser.waitUntilClickableNative(confirmDrawerSO.refuseButton);
          await confirmDrawerSO.refuseButton.click();
          await browser.waitUntilNotDisplayed(confirmDrawerSO.element);
        });

        it("[PRPI-3575] The banner should be dismissed", async () => {
          expect(await confirmDrawerSO.element.isDisplayed()).toBe(false);
        });

        it("[PRPI-3576] The betslip should still be populated", async () => {
          expect(await minimizedSO.counter.getText()).toBe("1");
        });

        describe("When I press the virtual bet button again and accept", () => {
          beforeAll(async () => {
            await browser.waitUntilClickableNative(virtualBetButtonPO.element);
            await virtualBetButtonPO.element.click();
            await browser.waitUntilStopsMoving(confirmDrawerSO.acceptButton);
            await browser.waitUntilClickableNative(confirmDrawerSO.acceptButton);
            await confirmDrawerSO.acceptButton.click();
          });

          it("[PRPI-3577] The betslip should clear the real sport selection and the virtual bet should be added", async () => {
            expect(await betDetailsSO.title.getText()).toBe("Porto FC");
          });

          describe("When I press the real bet button again", () => {
            beforeAll(async () => {
              await browser.waitUntilClickableNative(betslipDrawerSO.header);
              await betslipDrawerSO.header.click();
              await browser.waitUntilNotDisplayed(placePanelSO.element);
              await browser.waitUntilClickableNative(realBetButtonSO.element);
              await realBetButtonSO.element.click();
              await browser.waitUntilDisplayed(confirmDrawerSO.refuseLabel);
            });

            it("[PRPI-3578] the confirm drawer should display refuse option as 'Continue with virtual bet'", async () => {
              expect(await confirmDrawerSO.refuseLabel.getText()).toBe("Continue with virtual bet");
            });

            describe("When I press 'Continue with real bet'", () => {
              beforeAll(async () => {
                await browser.waitUntilStopsMoving(confirmDrawerSO.refuseButton);
                await browser.waitUntilClickableNative(confirmDrawerSO.refuseButton);
                await confirmDrawerSO.refuseButton.click();
                await browser.waitUntilNotDisplayed(confirmDrawerSO.element);

                await browser.waitUntilClickableNative(minimizedSO.element);
                await minimizedSO.element.click();
              });

              it("[PRPI-3578] the banner should be dismissed", async () => {
                expect(await confirmDrawerSO.element.isDisplayed()).toBe(false);
              });

              it("[PRPI-3578] the betslip should stay populated with virtual", async () => {
                expect(await betDetailsSO.title.getText()).toBe("Porto FC");
              });
            });
          });
        });
      });
    });
  });
});
