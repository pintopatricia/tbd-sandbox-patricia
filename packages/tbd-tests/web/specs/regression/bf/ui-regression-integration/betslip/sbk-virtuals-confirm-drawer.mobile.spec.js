const {
  SportsbookMarketPO,
  SportsbookBetButtonPO,
  ConfirmDrawerPO,
  BetslipDrawerPO,
  BetDetailsPO,
  MinimizedPO,
  SportsbookPlacePanelPO,
  RunnerPO,
  VirtualRunnerPO,
} = require("../../../../../page-objects");
const { getEventsDetailsForMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").SER;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const {
  getMarketPrices,
} = require("@flutter-global/uki-channels-http-clients/src/clients/SportsbookMarketPrices/mock-controller/smp-controller");
const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MarketPO = require("@ppb/tbd-shared/components/Market/Market.po");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const betslipDrawerPO = new BetslipDrawerPO();
const minimizedPO = new MinimizedPO();
const marketPO = new MarketPO();
const realMarketPO = new SportsbookMarketPO(marketPO.element);
const realRunnerPO = new RunnerPO(realMarketPO.runnerList[0]);
const virtualRunnerPO = new VirtualRunnerPO();
const virtualBetButtonPO = new SportsbookBetButtonPO(virtualRunnerPO.sportsbookBetButton);
const betButtonPO = new SportsbookBetButtonPO(realRunnerPO.sportsbookBetButton);
const placePanelPO = new SportsbookPlacePanelPO();
const betDetailsPO = new BetDetailsPO(placePanelPO.element);
const confirmDrawerPO = new ConfirmDrawerPO();

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

const SER_MOCK = [{ markets: [{ marketId: "924.1", marketStatus: "OPEN" }] }];

describe("Virtuals", () => {
  describe("When betslip is populated with real sports selections", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(CATALOGUE_MOCK.urn));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await mockService.mockHttpRequest(getGenericLayout(CATALOGUE_MOCK));
      await mockService.mockHttpRequest(getEventsDetailsForMarkets(SER_MOCK));
      await browser.url(routes.getGenericViewUrl("virtuals"));
      await browser.waitUntilDisplayed(betButtonPO.element);

      await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
      await betButtonPO.element.waitForClickable();
      await betButtonPO.element.click();
      await browser.waitUntilDisplayed(placePanelPO.element, "First selection hasn't been added");
    });

    describe("And a virtual bet button is pressed", () => {
      beforeAll(async () => {
        await betslipDrawerPO.header.waitForClickable();
        await betslipDrawerPO.header.click();
        await virtualBetButtonPO.element.waitForClickable();
        await virtualBetButtonPO.element.click();
      });

      it("[PRPI-6496] the confirm drawer should display title 'Clear Betslip?'", async () => {
        expect(await confirmDrawerPO.title.getText()).toBe("Clear Betslip?");
      });

      it("[PRPI-6497] the confirm drawer should display subtitle 'Virtual bets and Sports bets cannot be combined in the same betslip'", async () => {
        expect(await confirmDrawerPO.subtitle.getText()).toBe(
          "Virtual bets and Sports bets cannot be combined in the same betslip",
        );
      });

      it("[PRPI-6498] the confirm drawer should display refuse option as 'Continue with sport bet'", async () => {
        expect(await confirmDrawerPO.refuseButton.getText()).toBe("Continue with sport bet");
      });

      it("[PRPI-6499] the confirm drawer should display accept option as 'Clear Betslip'", async () => {
        expect(await confirmDrawerPO.acceptButton.getText()).toBe("Clear Betslip");
      });

      describe("When I press 'Continue with the sport bet'", () => {
        beforeAll(async () => {
          await confirmDrawerPO.refuseButton.waitForClickable();
          await confirmDrawerPO.refuseButton.click();
        });

        it("[PRPI-6500] The banner should be dismissed", async () => {
          expect(await confirmDrawerPO.element.isDisplayed()).toBe(false);
        });

        it("[PRPI-6501] The betslip should still be populated", async () => {
          expect(await minimizedPO.counter.getText()).toBe("1");
        });

        describe("When I press the virtual bet button again and accept", () => {
          beforeAll(async () => {
            await virtualBetButtonPO.element.waitForClickable();
            await virtualBetButtonPO.element.click();
            await confirmDrawerPO.acceptButton.waitForClickable();
            await confirmDrawerPO.acceptButton.click();
          });

          it("[PRPI-6502] The betslip should clear the real sport selection and the virtual bet should be added", async () => {
            expect(await betDetailsPO.title.getText()).toBe("Porto FC");
          });

          describe("When I press the real bet button again", () => {
            beforeAll(async () => {
              await betslipDrawerPO.header.waitForClickable();
              await betslipDrawerPO.header.click();
              await betButtonPO.element.waitForClickable();
              await betButtonPO.element.click();
            });

            it("[PRPI-6503] the confirm drawer should display refuse option as 'Continue with virtual bet'", async () => {
              expect(await confirmDrawerPO.refuseButton.getText()).toBe("Continue with virtual bet");
            });

            describe("When I press 'Continue with real bet'", () => {
              beforeAll(async () => {
                await confirmDrawerPO.refuseButton.waitForClickable();
                await confirmDrawerPO.refuseButton.click();
                await minimizedPO.element.waitForClickable();
                await minimizedPO.element.click();
              });

              it("[PRPI-6503] the banner should be dismissed", async () => {
                expect(await confirmDrawerPO.element.isDisplayed()).toBe(false);
              });

              it("[PRPI-6503] the betslip should stay populated with virtual", async () => {
                expect(await betDetailsPO.title.getText()).toBe("Porto FC");
              });
            });
          });
        });
      });
    });
  });
});
