const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getSportsLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { hideKeyboard } = require("../../../../../helpers/gestures");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

// mock controllers
const MockService = require("../../../../../mock-essentials/mocking-service");

const {
  GenericScreenSO,
  SingleSO,
  InlineSportsbookMarketSO,
  CardSO,
  SportsbookBetButtonSO,
  CurrencyNumberInputFieldSO,
  OptionSO,
  BetControlsSO,
  SportsbookPlacePanelSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const cardSO = new CardSO(genericScreenSO.element);
const sportsbookMarketSO = new InlineSportsbookMarketSO(cardSO.contentWrapper);
const firstRunnerSO = new SportsbookBetButtonSO(sportsbookMarketSO.sbkBetButtons[0]);
const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();
const optionSO = new OptionSO(sportsbookPlacePanelSO.element);
const singleSO = new SingleSO(sportsbookPlacePanelSO.element);
const singleControlsSO = new BetControlsSO(singleSO.controls);
const sportsbookSinglePlaceSizeInputField = new CurrencyNumberInputFieldSO(singleControlsSO.currencyInput);

const EVENT_TYPE_ID = 1;
const EVENT_ID = 29359895;
const MARKET_ID = "924.193270252";

const SMP_MOCK = {
  markets: [
    {
      marketId: MARKET_ID,
      eachwayAvailable: true,
      numberOfPlaces: 3,
      placeFraction: {
        numerator: 1,
        denominator: 5,
      },
      runnerDetails: [
        {
          selectionId: 48044,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 2 },
            },
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: {
                decimalOdds: 1.5,
              },
            },
            decimalDisplayOdds: { decimalOdds: 1.5 },
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
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
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
    {
      node: {
        __typename: "SwimlaneCardGroup",
        cardGroupTitle: "Second Card",
        urn: "ppb:tbd:card:group:topEventsInSport:2",
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
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:2",
      },
    },
  ],
};

describe("Betslip - SBK single bet with each way placement", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    const url = "football/s-1";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(genericScreenSO.element);
    await browser.waitUntilDisplayed(firstRunnerSO.element);
  });

  describe("when the user taps on a given bet button", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(firstRunnerSO.element);
      await firstRunnerSO.element.click();
      await browser.waitUntilDisplayed(
        sportsbookPlacePanelSO.element,
        "Waiting for Sportsbook single place panel element",
      );
    });

    it("[PRPI-3511] should show the each way title", async () => {
      expect(await optionSO.title.getText()).toBe("Each Way");
    });

    it("[PRPI-3512] should show the each way subtitle", async () => {
      expect(await optionSO.subtitle.getText()).toBe("1/5 Odds, 3 Places");
    });

    it("[PRPI-3513] should show the each way checkbox unselected", async () => {
      expect(await optionSO.checkbox.getAttribute("wdSelected")).toBe("false");
    });

    describe("when the user sets a stake value", () => {
      beforeAll(async () => {
        await sportsbookSinglePlaceSizeInputField.numberField.setValue(2);
        await hideKeyboard();
      });

      it("[PRPI-3514] should show the total returns as $4", async () => {
        expect(await singleControlsSO.returns.getText()).toBe("Returns $4.00");
      });

      describe("when the user taps each way checkbox", () => {
        beforeAll(async () => {
          await optionSO.checkbox.click();

          await browser.pause(5000);
        });

        it("[PRPI-3515] should show the each way checkbox selected", async () => {
          expect(await optionSO.checkbox.getAttribute("wdSelected")).toBe("true");
        });

        it("[PRPI-3516] should show the multiplier 2x on the input stake field", async () => {
          expect(await sportsbookSinglePlaceSizeInputField.multiplier.getText()).toBe("2x");
        });

        it("[PRPI-3517] should update the total returns to $6", async () => {
          expect(await singleControlsSO.returns.getText()).toBe("Returns $6.00");
        });

        describe("when the user taps again on the each way checkbox", () => {
          beforeAll(async () => {
            await optionSO.checkbox.click();
            await browser.waitUntil(async () => (await optionSO.checkbox.getAttribute("wdSelected")) === "false");
          });
          it("[PRPI-3518] should show the each way checkbox unselected", async () => {
            expect(await optionSO.checkbox.getAttribute("wdSelected")).toBe("false");
          });

          it("[PRPI-3519] should not show the multiplier on the input stake field", async () => {
            expect(await sportsbookSinglePlaceSizeInputField.multiplier.isDisplayed()).toBe(false);
          });

          it("[PRPI-3520] should update the total returns to $4", async () => {
            expect(await singleControlsSO.returns.getText()).toBe("Returns $4.00");
          });
        });
      });
    });
  });
});
