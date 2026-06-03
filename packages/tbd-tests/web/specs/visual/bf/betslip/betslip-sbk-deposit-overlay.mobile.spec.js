const {
  CardPO,
  AlertPO,
  OverlayPO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
  CurrencyNumberInputFieldPO,
  BetControlsPO,
  SportPagePO,
  SportsbookPlacePanelPO,
  SuccessfulDepositContentPO,
  UserProfileHeaderPO,
} = require("../../../../page-objects");
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const EventMarketCardPO = require("@ppb/tbd-shared/components/EventMarketCard/EventMarketCard.po");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const { getPaymentsWebGateway } = require("../../../../mock-essentials/controllers/html/html-controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const { triggerPaymentsWebEvent } = require("../../../../helpers/paymentsWeb.util");
const routes = require("../../../../../utils/routes");
const { addStake } = require("../../../../helpers/betslip.util");

const sportPagePO = new SportPagePO();
const firstEventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[0]);
const firstMatchOddsCard = new CardPO(firstEventMarketCardPO.market);
const firstSbkMarketPO = new InlineSportsbookMarketPO(firstMatchOddsCard.inlineSportsbookMarket);
const firstSbkRunnerPO = new SportsbookBetButtonPO(firstSbkMarketPO.betButtons[0]);
const placePanelPO = new SportsbookPlacePanelPO();
const controlsPo = new BetControlsPO(placePanelPO.element);
const singleAlertPO = new AlertPO(placePanelPO.element);
const stakeInputFieldPO = new CurrencyNumberInputFieldPO(controlsPo.currencyInput);
const overlayPO = new OverlayPO();
const userProfileHeaderPO = new UserProfileHeaderPO();
const successfulDepositContentPO = new SuccessfulDepositContentPO(overlayPO.element);

const mockService = new MockService();

const EVENT_TYPE_ID = 1;

const BFF_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        cardGroupTitle: "League",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
                title: "Team A vs Team B",
                fixture: {
                  urn: "ppb:fixture:29359895",
                  home: {
                    name: "Team B",
                  },
                  away: {
                    name: "Team A",
                  },
                },
                sportevent: {
                  name: "Team A vs Team B ",
                  urn: "ppb:event:29359895",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.1",
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team B v Team A",
                          urn: "ppb:event:29359895",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.1/1",
                          selectionId: 1,
                          name: "Team B",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/2",
                          selectionId: 2,
                          name: "Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/3",
                          selectionId: 3,
                          name: "Team A",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.1/1" },
                      { runnerURN: "ppb:sbkRunner:924.1/2" },
                      { runnerURN: "ppb:sbkRunner:924.1/3" },
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
  ],
};

const WAS_MOCK = [
  { amount: "5.00", walletName: "MAIN" },
  { amount: "0.00", walletName: "SPORTSBOOK_BONUS_WAGERING" },
];

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

const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.1",
          selectionId: 1,
        },
      ],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.1",
    selectionId: 1,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: {
      decimalOdds: 1.1,
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SIB_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const MODULE_NAME = "betslip_sbk";

describe("Betslip - Sportsbook Successful Deposit Overlay", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getWallets(WAS_MOCK));
    await mockService.mockHttpRequest(getPaymentsWebGateway());
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK));
    await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));

    await browser.waitUntilDisplayed(sportPagePO.actionLink[0], "ActionLink not visible");
    await browser.waitUntilEquals(firstSbkRunnerPO.odd, "1.1");

    await firstSbkRunnerPO.sportsbookBetButton.waitForClickable();
    await firstSbkRunnerPO.sportsbookBetButton.click();
    await browser.waitUntilDisplayed(placePanelPO.element, "Sportsbook single Betslip not displayed");

    await addStake(stakeInputFieldPO, "6");

    await browser.waitUntilDisplayed(singleAlertPO.icon, "Error notification not displayed");
    await browser.waitUntilEquals(placePanelPO.place, "Deposit to Place $6.00 Bet");

    await placePanelPO.place.waitForClickable();
    await placePanelPO.place.click();
    await browser.waitUntilDisplayed(overlayPO.element, "Overlay not displayed");
    await browser.waitUntilDisplayed(userProfileHeaderPO.element, "User profile not displayed");
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1249]_should_open_payments_web_iframe_with_full_size`);
  });

  it("[PRPI-1249]_should_open_payments_web_iframe_with_full_size", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1249]_should_open_payments_web_iframe_with_full_size`)).toBe(
      0,
    );
  });

  describe("When user does a successful deposit", () => {
    beforeAll(async () => {
      await triggerPaymentsWebEvent({ action: "DEPOSIT_SUCCESS" });
      await browser.waitUntilDisplayed(
        successfulDepositContentPO.element,
        "Successful deposit content overlay not displayed",
      );
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1250]_should_see_successful_deposit_overlay`);
    });

    it("[PRPI-1250]_should_see_successful_deposit_overlay", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1250]_should_see_successful_deposit_overlay`)).toBe(0);
    });
  });
});
