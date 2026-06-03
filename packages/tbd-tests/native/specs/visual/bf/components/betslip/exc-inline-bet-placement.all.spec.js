const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getImplyBetResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").ETX;
const { getAppContext, getGenericLayout, getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const {
  ExchangeInlinePlacePanelSO,
  ExchangeMarketSO,
  FreeBetsSO,
  NudgesNumberInputFieldSO,
  RunnerSO,
} = require("../../../../../screen-objects");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");

const mockService = new MockService();
const exchangeMarketSO = new ExchangeMarketSO();
const firstRunnerSO = new RunnerSO(exchangeMarketSO.runnerList[0]);
const exchangeInlinePlacePanelSO = new ExchangeInlinePlacePanelSO();
const freeBetsSO = new FreeBetsSO(exchangeInlinePlacePanelSO.freeBets);
const stakeInputFieldSO = new NudgesNumberInputFieldSO(exchangeInlinePlacePanelSO.inputs[1]);

const MODULE_NAME = "inline-betslip";

async function getBlockOuts(element) {
  const position = await element.getLocation();
  const size = await element.getSize();
  const pixelRatio = driver.capabilities.pixelRatio || 1;

  return [
    {
      x: position.x * pixelRatio,
      y: position.y * pixelRatio,
      width: size.width * pixelRatio,
      height: size.height * pixelRatio,
    },
  ];
}

const EVENT_ID = "29359895";
const MARKET_ID = "1.160337355";

const ERO_MOCK = [
  {
    marketId: MARKET_ID,
    runners: [
      {
        selectionId: 48044,
        availableToBack: [{ price: 3, size: 100 }],
        availableToLay: [{ price: 3.25, size: 110 }],
      },
      {
        selectionId: 48351,
        availableToBack: [{ price: 2.1, size: 200 }],
        availableToLay: [{ price: 2.2, size: 210 }],
      },
    ],
  },
];

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    eventId: EVENT_ID,
    name: "Wolves v Man Utd",
    competition: { urn: "ppb:competition:12345", name: "English Premier League" },
  },
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223##MATCH_ODDS",
        __typename: "MarketCard",
        cardTitle: "Match Odds - Wolves v Man Utd",
        displayRunners: {
          exchange: {
            runners: [
              {
                runnerURN: `ppb:excRunner:${MARKET_ID}/48044/0`,
              },
              {
                runnerURN: `ppb:excRunner:${MARKET_ID}/48351/0`,
              },
            ],
            market: {
              __typename: "ExchangeMarket",
              urn: `ppb:excMarket:${MARKET_ID}`,
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
                  name: "Wolves",
                  runnerURN: `ppb:excRunner:${MARKET_ID}/48044/0`,
                  selectionId: 48044,
                },
                {
                  name: "Man Utd",
                  runnerURN: `ppb:excRunner:${MARKET_ID}/48351/0`,
                  selectionId: 48351,
                },
              ],
            },
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

const HOME_MOCK = {
  __typename: "GenericView",
  urn: "ppb:tbd:view:generic:home",
  url: "view/generic:home",
  edges: [...BFF_MOCK.edges],
  partialEdges: [...BFF_MOCK.partialEdges],
};

const IMPLY_MOCK = {
  hasBonusMoney: true,
  wallets: [
    {
      amount: 20,
      conditions: [],
      walletType: "BONUS_CASH",
    },
  ],
};

const APP_CONTEXT_MOCK = {
  exchangeConfirmBetPlacement: true,
};

xdescribe("Inline Betslip - Bet placement", () => {
  // FIXME: This test is failing because of a blinking cursor on the stake input field, it will be fixed in the US #https://jira.services.flutteruki.com/browse/SLBY-712
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext(APP_CONTEXT_MOCK));
    await mockService.mockHttpRequest(getGenericLayout(HOME_MOCK));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
    await mockService.mockHttpRequest(getImplyBetResponse(IMPLY_MOCK));

    await startApp("home");

    await browser.waitUntilDisplayed(firstRunnerSO.betButtons[0], "Exchange bet button was not displayed");
  });

  describe("when the user clicks on a back bet button", () => {
    beforeAll(async () => {
      await browser.waitUntilClickableNative(firstRunnerSO.betButtons[0]);
      await firstRunnerSO.betButtons[0].click();

      await browser.waitUntilDisplayed(exchangeInlinePlacePanelSO.element, "Place panel wasn't displayed");
      await browser.waitUntilDisplayed(freeBetsSO.element, "Free bets component wasn't displayed");

      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-10435]_should_display_the_inline_betslip_in_the_place_step_with_back_bet_selected`,
      );
    });

    it("[PRPI-10435]_should_display_the_inline_betslip_in_the_place_step_with_back_bet_selected", async () => {
      expect(
        (
          await browser.compareScreen(
            `${MODULE_NAME}_[PRPI-10435]_should_display_the_inline_betslip_in_the_place_step_with_back_bet_selected`,
            {
              blockOuts: await getBlockOuts(stakeInputFieldSO.numberField),
            },
          )
        ).misMatchPercentage,
      ).toEqual(0);
    });
  });

  describe("when the user clicks on a lay bet button", () => {
    beforeAll(async () => {
      await browser.waitUntilClickableNative(firstRunnerSO.betButtons[1]);
      await firstRunnerSO.betButtons[1].click();

      await browser.waitUntilDisplayed(exchangeInlinePlacePanelSO.element, "Place panel wasn't displayed");
      await browser.waitUntilDisplayed(freeBetsSO.element, "Free bets component wasn't displayed");

      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-10436]_should_display_the_inline_betslip_in_the_place_step_with_lay_bet_selected`,
      );
    });

    it("[PRPI-10436]_should_display_the_inline_betslip_in_the_place_step_with_lay_bet_selected", async () => {
      expect(
        (
          await browser.compareScreen(
            `${MODULE_NAME}_[PRPI-10436]_should_display_the_inline_betslip_in_the_place_step_with_lay_bet_selected`,
            {
              blockOuts: await getBlockOuts(stakeInputFieldSO.numberField),
            },
          )
        ).misMatchPercentage,
      ).toEqual(0);
    });

    describe("when the user enters a stake", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(stakeInputFieldSO.numberField);
        await stakeInputFieldSO.numberField.click();
        await stakeInputFieldSO.setValue("2");

        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-10437]_should_display_the_place_button_as_active_after_entering_a_stake`,
        );
      });

      it("[PRPI-10437]_should_display_the_place_button_as_active_after_entering_a_stake", async () => {
        expect(
          (
            await browser.compareScreen(
              `${MODULE_NAME}_[PRPI-10437]_should_display_the_place_button_as_active_after_entering_a_stake`,
              {
                blockOuts: await getBlockOuts(stakeInputFieldSO.numberField),
              },
            )
          ).misMatchPercentage,
        ).toEqual(0);
      });
    });
  });
});
