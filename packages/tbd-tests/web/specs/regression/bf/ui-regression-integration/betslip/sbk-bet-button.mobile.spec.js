const {
  CardPO,
  SportsbookBetButtonPO,
  SportsbookMarketPO,
  BetDetailsPO,
  EventPagePO,
  MinimizedPO,
  BetslipDrawerPO,
  RunnerPO,
  SportsbookPlacePanelPO,
  PlaceFooterPO,
} = require("../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const selectionPO = new BetDetailsPO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const sportsbookMarketPO = new SportsbookMarketPO(firstCardPO.sportsbookMarket);
const firstRunnerSportsbookPO = new RunnerPO(sportsbookMarketPO.runnerList[0]);
const firstRunnerBetButton = new SportsbookBetButtonPO(firstRunnerSportsbookPO.sportsbookBetButton);
const secondRunnerSportsbookPO = new RunnerPO(sportsbookMarketPO.runnerList[1]);
const secondRunnerBetButton = new SportsbookBetButtonPO(secondRunnerSportsbookPO.sportsbookBetButton);
const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const betslipDrawerPO = new BetslipDrawerPO();
const sportsbookMinimizedPO = new MinimizedPO();
const placeFooterPO = new PlaceFooterPO();
const mockService = new MockService();

const EVENT_ID = "29359895";

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.193270252",
      runnerDetails: [
        {
          selectionId: "48044",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.1 },
            },
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "58805",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.1 },
            },
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "48351",
          noOdds: true,
        },
      ],
    },
  ],
};

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    sport: {
      name: "Football",
      urn: "ppb:eventType:1",
    },
    name: "Wolves v Man Utd",
  },
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223##MATCH_ODDS",
        __typename: "MarketCard",
        cardTitle: "Match Odds",
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.193270252",
              noLiveData: true,
              name: "Match Odds",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "Wolves v Man Utd",
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  runnerURN: "ppb:sbkRunner:924.193270252/48044",
                  selectionId: 48044,
                  name: "Wolves",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.193270252/58805",
                  selectionId: 58805,
                  name: "The Draw",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.193270252/48351",
                  selectionId: 48351,
                  name: "Man Utd",
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:sbkRunner:924.193270252/48044" },
              { runnerURN: "ppb:sbkRunner:924.193270252/58805" },
              { runnerURN: "ppb:sbkRunner:924.193270252/48351" },
            ],
          },
        },
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
};

describe("[631977] - Bet Button", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    await mockService.mockHttpRequest(getImplyBetsResponse({}));
    await browser.url(`${routes.getEventViewUrl(EVENT_ID)}`);
    await browser.waitUntilDisplayed(firstCardPO.sportsbookMarket);
  });

  afterAll(async () => {
    // Remove selections from the betslip
    await browser.waitUntilDisplayed(placeFooterPO.removeAllButton, "Remove all button is not displayed");
    await placeFooterPO.removeAllButton.click();

    await browser.waitUntilDisplayed(firstRunnerBetButton.element, "First runner bet button is not displayed");
    await browser.waitUntilDisplayed(secondRunnerBetButton.element, "Second runner bet button is not displayed");

    await browser.waitUntil(async () => {
      const isFirstRunnerSelected = await browser.containsClass(
        firstRunnerBetButton.element,
        SportsbookBetButtonPO.states.selected,
      );

      const isSecondRunnerSelected = await browser.containsClass(
        secondRunnerBetButton.element,
        SportsbookBetButtonPO.states.selected,
      );

      return !isFirstRunnerSelected && !isSecondRunnerSelected;
    });
  });

  it("[PRPI-5170]should not have first bet button selected", async () => {
    expect(await browser.containsClass(firstRunnerBetButton.element, SportsbookBetButtonPO.states.selected)).toBe(
      false,
    );
  });

  it("[PRPI-5171]should not have second bet button selected", async () => {
    expect(await browser.containsClass(secondRunnerBetButton.element, SportsbookBetButtonPO.states.selected)).toBe(
      false,
    );
  });

  describe("when the user clicks on a Sportsbook bet button", () => {
    beforeAll(async () => {
      await firstRunnerSportsbookPO.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element);
    });

    it("[PRPI-5172]should open the betslip in the singles experience", async () => {
      expect(await sportsbookPlacePanelPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-5173]should have the bet button selected", async () => {
      expect(await browser.containsClass(firstRunnerBetButton.element, SportsbookBetButtonPO.states.selected)).toBe(
        true,
      );
    });

    describe("when user taps on betslip collapsable", () => {
      beforeAll(async () => {
        await betslipDrawerPO.header.waitForClickable();
        await betslipDrawerPO.header.click();
        await browser.waitUntilNotDisplayed(sportsbookPlacePanelPO.element);
      });

      it("[PRPI-5174]should collapse Betslip", async () => {
        expect(await sportsbookMinimizedPO.element.isDisplayed()).toBe(true);
        expect(await sportsbookPlacePanelPO.element.isDisplayed()).toBe(false);
      });

      describe("when the user clicks on a second non-combinable Sportsbook bet button", () => {
        beforeAll(async () => {
          await secondRunnerSportsbookPO.sportsbookBetButton.click();
          await browser.waitUntilEquals(sportsbookMinimizedPO.counter, "2");
        });

        it("[PRPI-5175]should have the Betslip collapsed", async () => {
          expect(await sportsbookMinimizedPO.element.isDisplayed()).toBe(true);
          expect(await sportsbookPlacePanelPO.element.isDisplayed()).toBe(false);
        });

        it("[PRPI-5176]should have the first bet button selected", async () => {
          expect(await browser.containsClass(firstRunnerBetButton.element, SportsbookBetButtonPO.states.selected)).toBe(
            true,
          );
        });

        it("[PRPI-5177]should have the second bet button selected", async () => {
          expect(
            await browser.containsClass(secondRunnerBetButton.element, SportsbookBetButtonPO.states.selected),
          ).toBe(true);
        });

        describe("when the user expands Betslip", () => {
          beforeAll(async () => {
            await sportsbookMinimizedPO.element.click();
            await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element);
            await browser.waitUntilDisplayed(sportsbookPlacePanelPO.actions[0]);
          });

          it("[PRPI-5178]should show a place button", async () => {
            expect(await sportsbookPlacePanelPO.element.isDisplayed()).toBe(true);
            expect(await sportsbookPlacePanelPO.actions.length).toBe(1);
          });
        });
      });
    });
  });
});

describe("[649089] - Removes Runner - Given I have a selection in the betslip", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_MOCK.urn, { currencyCode: "USD", localeCodeBcp47: "en-US" }),
    );
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    await mockService.mockHttpRequest(getImplyBetsResponse({}));
    await browser.url(`${routes.getEventViewUrl(EVENT_ID)}`);
    await browser.waitUntilDisplayed(firstCardPO.sportsbookMarket);

    await firstRunnerSportsbookPO.sportsbookBetButton.waitForClickable();
    await firstRunnerSportsbookPO.sportsbookBetButton.click();
    await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element);
  });

  describe("when I click on the selection trash icon", () => {
    beforeAll(async () => {
      await selectionPO.remove.waitForClickable();
      await selectionPO.remove.click();
      await browser.waitUntil(async () => {
        const isSelected = await browser.containsClass(
          firstRunnerBetButton.element,
          SportsbookBetButtonPO.states.selected,
        );

        return !isSelected;
      });
    });

    it("[PRPI-5179]The betslip should close", async () => {
      expect(await sportsbookPlacePanelPO.element.isDisplayedInViewport()).toBe(false);
    });

    it("[PRPI-5180]And the bet button should not be selected", async () => {
      expect(await browser.containsClass(firstRunnerBetButton.element, SportsbookBetButtonPO.states.selected)).toBe(
        false,
      );
    });
  });
});
