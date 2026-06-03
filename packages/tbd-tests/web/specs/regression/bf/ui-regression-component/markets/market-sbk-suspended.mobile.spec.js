const { EventPagePO, CardPO, RunnerPO, SportsbookMarketPO, SnackbarPO } = require("../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const sportsbookMarketPO = new SportsbookMarketPO(firstCardPO.sportsbookMarket);

const firstRunnerSportsbookPO = new RunnerPO(sportsbookMarketPO.runnerList[0]);
const secondRunnerSportsbookPO = new RunnerPO(sportsbookMarketPO.runnerList[1]);
const thirdRunnerSportsbookPO = new RunnerPO(sportsbookMarketPO.runnerList[2]);

const snackbarPO = new SnackbarPO();

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
            decimalDisplayOdds: { decimalOdds: 1.1 },
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
        {
          selectionId: "48351",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
  ],
};

const SUSPENDED_SBK_MARKET = {
  markets: [{ marketId: "924.193270252", runnerDetails: SMP_MOCK.markets[0].runnerDetails, marketStatus: "SUSPENDED" }],
};

const SUSPENDED_SBK_RUNNER = {
  markets: [
    {
      marketId: "924.193270252",
      runnerDetails: [
        {
          selectionId: "48044",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "58805",
          runnerStatus: "SUSPENDED",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "48351",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
  ],
};

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223:MATCH_ODDS",
        title: "Match Odds",
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

  partialEdges: [{ node: { urn: "ppb:tbd:card:29436223:MATCH_ODDS", __typename: "MarketCard" } }],
};

describe("when a user gets to a sportsbook OPEN market", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    await browser.url(routes.getEventViewUrl(EVENT_ID));
    await browser.waitUntilDisplayed(eventPagePO.element);
    await browser.waitUntilDisplayed(firstCardPO.element);

    await browser.waitUntilDisplayed(firstCardPO.sportsbookMarket);
  });

  it("[PRPI-6165] the bet buttons are enabled", async () => {
    expect(await firstRunnerSportsbookPO.sportsbookBetButton.isEnabled()).toBe(true);
    expect(await secondRunnerSportsbookPO.sportsbookBetButton.isEnabled()).toBe(true);
    expect(await thirdRunnerSportsbookPO.sportsbookBetButton.isEnabled()).toBe(true);
  });

  describe("and there's a SMP update (SUSPENDED)", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMarketPrices(SUSPENDED_SBK_MARKET));
      await browser.tickFakeClock();
      await browser.waitUntilEquals(await firstRunnerSportsbookPO.sportsbookBetButton, "-");
    });

    it("[PRPI-6166] the bet buttons no longer present odds", async () => {
      const firstRunnerSportsbookButton = await firstRunnerSportsbookPO.sportsbookBetButton;
      const secondRunnerSportsbookButton = await secondRunnerSportsbookPO.sportsbookBetButton;
      const thirdRunnerSportsbookButton = await thirdRunnerSportsbookPO.sportsbookBetButton;

      expect(await firstRunnerSportsbookButton.getText()).toEqual("-");
      expect(await secondRunnerSportsbookButton.getText()).toEqual("-");
      expect(await thirdRunnerSportsbookButton.getText()).toEqual("-");
    });

    it("[PRPI-6167] The bet buttons are clickable", async () => {
      expect(await firstRunnerSportsbookPO.sportsbookBetButton.waitForClickable()).toBe(true);
      expect(await secondRunnerSportsbookPO.sportsbookBetButton.waitForClickable()).toBe(true);
      expect(await thirdRunnerSportsbookPO.sportsbookBetButton.waitForClickable()).toBe(true);
    });

    describe("When the user taps one of the suspended bet buttons", () => {
      beforeAll(async () => {
        await firstRunnerSportsbookPO.sportsbookBetButton.click();
        await browser.waitUntilEquals(snackbarPO.title, "Suspended");
      });

      it("[PRPI-6168] The toast message should be displayed: 'Suspended'", async () => {
        expect(await snackbarPO.title.getText()).toBe("Suspended");
      });
    });

    describe("and there's a SMP update (OPEN)", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
        await browser.tickFakeClock();
        await browser.waitUntilEquals(await firstRunnerSportsbookPO.sportsbookBetButton, "1.1");
      });

      it("[PRPI-6169] the bet buttons are enabled", async () => {
        expect(await firstRunnerSportsbookPO.sportsbookBetButton.getText()).toEqual("1.1");
        expect(await secondRunnerSportsbookPO.sportsbookBetButton.getText()).toEqual("1.2");
        expect(await thirdRunnerSportsbookPO.sportsbookBetButton.getText()).toEqual("1.3");
      });
    });
  });
});

describe("when a user gets to a sportsbook market", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    await browser.url(routes.getEventViewUrl(EVENT_ID));
    await browser.waitUntilDisplayed(eventPagePO.element);
    await browser.waitUntilDisplayed(firstCardPO.element);

    await browser.waitUntilDisplayed(firstCardPO.sportsbookMarket);
  });

  it("[PRPI-6170] the bet buttons are enabled", async () => {
    expect(await firstRunnerSportsbookPO.sportsbookBetButton.getText()).not.toEqual("-");
    expect(await secondRunnerSportsbookPO.sportsbookBetButton.getText()).not.toEqual("-");
    expect(await thirdRunnerSportsbookPO.sportsbookBetButton.getText()).not.toEqual("-");
  });

  describe("and there's a SMP update (SUSPENDED) for a runner", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMarketPrices(SUSPENDED_SBK_RUNNER));
      await browser.tickFakeClock();
      await browser.waitUntilEquals(await secondRunnerSportsbookPO.sportsbookBetButton, "-");
    });

    it("[PRPI-6171] the second bet button no longer presents odd", async () => {
      expect(await firstRunnerSportsbookPO.sportsbookBetButton.getText()).toEqual("1.1");
      expect(await secondRunnerSportsbookPO.sportsbookBetButton.getText()).toEqual("-");
      expect(await thirdRunnerSportsbookPO.sportsbookBetButton.getText()).toEqual("1.3");
    });

    it("[PRPI-6172] The second runner's button is clickable", async () => {
      expect(await secondRunnerSportsbookPO.sportsbookBetButton.waitForClickable()).toBe(true);
    });

    it("[PRPI-6173] The other runner's buttons are clickable", async () => {
      expect(await firstRunnerSportsbookPO.sportsbookBetButton.waitForClickable()).toBe(true);
      expect(await thirdRunnerSportsbookPO.sportsbookBetButton.waitForClickable()).toBe(true);
    });

    describe("When the user taps on the second bet button", () => {
      beforeAll(async () => {
        await secondRunnerSportsbookPO.sportsbookBetButton.click();
        await browser.waitUntilEquals(snackbarPO.title, "Suspended");
      });

      it("[PRPI-6174] The toast message should be displayed: 'Suspended'", async () => {
        expect(await snackbarPO.title.getText()).toBe("Suspended");
      });
    });

    describe("and there's a SMP update (ACTIVE) for all runners", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
        await browser.tickFakeClock();
        await browser.waitUntilEquals(await secondRunnerSportsbookPO.sportsbookBetButton, "1.2");
      });

      it("[PRPI-6175] the bet buttons are enabled", async () => {
        expect(await firstRunnerSportsbookPO.sportsbookBetButton.getText()).toEqual("1.1");
        expect(await secondRunnerSportsbookPO.sportsbookBetButton.getText()).toEqual("1.2");
        expect(await thirdRunnerSportsbookPO.sportsbookBetButton.getText()).toEqual("1.3");
      });
    });
  });
});
