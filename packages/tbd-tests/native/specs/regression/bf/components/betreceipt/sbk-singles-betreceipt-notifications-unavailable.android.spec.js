import { getAppContext } from "@ppb/tbd-shared/mocks/bff/bff.controller";

const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getSportsLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getNSSRegister, getNSSSubscribeUnavailable } = require("@ppb/tbd-shared/mocks/nss/nss.controller");
const { hideKeyboard } = require("../../../../../helpers/gestures");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

const MockService = require("../../../../../mock-essentials/mocking-service");

const {
  GenericScreenSO,
  SportsbookPlacePanelSO,
  SingleSO,
  CardSO,
  InlineSportsbookMarketSO,
  SportsbookBetButtonSO,
  CurrencyNumberInputFieldSO,
  BetControlsSO,
  ReceiptTitleSO,
  SwitchSO,
  OptionSO,
  BetDetailsSO,
  SportsbookReceiptPanelSO,
  PrimaryButtonSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const firstCardSO = new CardSO(genericScreenSO.cards[0]);
const firstSportsbookMarketSO = new InlineSportsbookMarketSO(firstCardSO.contentWrapper);
const firstRunnerSO = new SportsbookBetButtonSO(firstSportsbookMarketSO.sbkBetButtons[0]);

// place screen objects
const sportsbookPlaceSO = new SportsbookPlacePanelSO();
const singleSO = new SingleSO(sportsbookPlaceSO.element);
const singleControlsSO = new BetControlsSO(singleSO.controls);
const sportsbookSinglesPlaceSizeInputField = new CurrencyNumberInputFieldSO(singleControlsSO.currencyInput);
const placeButtonSO = new PrimaryButtonSO();

// receipt screen objects
const betDetailsSO = new BetDetailsSO();
const sportsbookReceiptPanelSO = new SportsbookReceiptPanelSO();
const receiptTitleSO = new ReceiptTitleSO();
const optionSO = new OptionSO(sportsbookReceiptPanelSO.element);
const switchSO = new SwitchSO(optionSO.toggle);

const EVENT_TYPE_ID = 1;
const EVENT_ID = 29359895;
const MARKET_ID = "924.193270252";

const SMP_MOCK = {
  markets: [
    {
      marketId: MARKET_ID,
      runnerDetails: [
        {
          selectionId: 48044,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 6.5 },
            },
            decimalDisplayOdds: { decimalOdds: 6.5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
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

const SPB_MOCK_SUCCESS = {
  result: [
    {
      betPrice: {
        decimalDisplayOdds: { decimalOdds: 6.5 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      runners: [
        {
          runner: { marketId: MARKET_ID, selectionId: 48044 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 6.5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: MARKET_ID, selectionId: 48044 } }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 6.5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],

      totalPotentialWin: 2,
    },
  ],
};

const SINGLE_EVENT_ID = 29359895;

const SINGLE_NSS_MOCK = {
  topics: [
    {
      topicId: SINGLE_EVENT_ID,
      eventType: "FOOTBALL",
      incidentTypes: [
        "FOOTBALL_KICK_OFF",
        "FOOTBALL_HALF_TIME",
        "FOOTBALL_FINAL_SCORE",
        "FOOTBALL_RED_CARD",
        "FOOTBALL_SCORE_CHANGE",
      ],
    },
  ],

  applicationTypeId: "applicationTypeIdTest",
  deviceId: "deviceIdTest",
  locale: "en_GB",
};

const placeSingleBet = async () => {
  await browser.waitUntilClickableNative(firstRunnerSO.element);
  await firstRunnerSO.element.click();
  await browser.waitUntilDisplayed(sportsbookPlaceSO.element, "Waiting for Sportsbook single place panel element");

  // place stake
  await sportsbookSinglesPlaceSizeInputField.numberField.setValue(0.1);
  await hideKeyboard();

  // place bet
  await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK_SUCCESS));
  await placeButtonSO.element.click();
  await browser.waitUntilDisplayed(sportsbookReceiptPanelSO.element, "Waiting for Sportsbook confirm panel");
};

const togglePush = async () => {
  await browser.waitUntilDisplayed(switchSO.switch);
  await browser.waitUntilClickableNative(switchSO.switch);
  await switchSO.switch.click();
  await optionSO.toggle.waitForDisplayed({ reverse: true });
};

describe("Betreceipt Notifications", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext());
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getNSSRegister());
    await mockService.mockHttpRequest(getNSSSubscribeUnavailable(SINGLE_NSS_MOCK));

    const HOME_VIEW_LINK = getStartViewLink("football/s-1");
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
  });

  describe("When the user places a bet in a single, with notifications unavailable", () => {
    beforeAll(async () => {
      await placeSingleBet();
    });

    it("[PRPI-3291] The toggle should be displayed disabled", async () => {
      expect(await optionSO.toggle.isDisplayed()).toBe(true);
      expect(await switchSO.switch.getAttribute("selected")).toBe("false");
      expect(await optionSO.title.getText()).toBe("Receive Live Alerts");
    });

    it("[PRPI-3292] shouldn't show the notification unavailable icon in BetDetails", async () => {
      expect(await betDetailsSO.notificationsUnavblIcon.isDisplayed()).toBe(false);
    });

    describe("When the user turns notifications on for an event without notifications supported", () => {
      beforeAll(async () => {
        await togglePush();
      });

      it("[PRPI-3293] The toggle should not be displayed", async () => {
        expect(await optionSO.toggle.isExisting()).toBe(false);
      });

      it("[PRPI-3294] should show the notification unavailable icon in BetDetails", async () => {
        expect(await betDetailsSO.notificationsUnavblIcon.isDisplayed()).toBe(true);
      });

      describe("When the user closes the bet receipt and places a bet again on the same events", () => {
        beforeAll(async () => {
          await receiptTitleSO.dismissButton.click();
          await placeSingleBet();
        });

        it("[PRPI-3295] The toggle should not be displayed", async () => {
          expect(await optionSO.toggle.isExisting()).toBe(false);
        });

        it("[PRPI-3295] should show the notification unavailable icon in BetDetails", async () => {
          expect(await betDetailsSO.notificationsUnavblIcon.isDisplayed()).toBe(true);
        });
      });
    });
  });
});
