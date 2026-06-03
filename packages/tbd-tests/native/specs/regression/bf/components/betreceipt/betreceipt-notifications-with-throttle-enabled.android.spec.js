const RaceMarketCardSO = require("@ppb/tbd-shared/components/RaceMarketCard/RaceMarketCard.native.so");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const {
  getAppContext,
  getSportsLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getNSSRegister, getNSSSubscribeSuccessWithHR } = require("@ppb/tbd-shared/mocks/nss/nss.controller");
const { swipeUp, hideKeyboard } = require("../../../../../helpers/gestures");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

const MockService = require("../../../../../mock-essentials/mocking-service");

const {
  SingleSO,
  CardSO,
  BetslipDrawerSO,
  InlineSportsbookMarketSO,
  SportsbookBetButtonSO,
  PrimaryButtonSO,
  CurrencyNumberInputFieldSO,
  BetControlsSO,
  ReceiptTitleSO,
  SwitchSO,
  OptionSO,
  SnackbarSO,
  HorseRacingRunnerSO,
  BetSelectionsSO,
  BetSelectionDetailsSO,
  GenericScreenSO,
  MultiplesCardSO,
  MinimizedSO,
  SportsbookPlacePanelSO,
  SportsbookReceiptPanelSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const firstCardSO = new CardSO(genericScreenSO.cards[0]);
const thirdCardSO = new RaceMarketCardSO();
const firstSportsbookMarketSO = new InlineSportsbookMarketSO(firstCardSO.contentWrapper);
const firstRunnerSO = new SportsbookBetButtonSO(firstSportsbookMarketSO.sbkBetButtons[0]);
const thirdSbkRunnerSO = new HorseRacingRunnerSO(thirdCardSO.runners[0]);
const betslipDrawerSO = new BetslipDrawerSO();
const minimizedSO = new MinimizedSO();

// place screen objects
const sportsbookPlacePanelSO = new SportsbookPlacePanelSO(betslipDrawerSO.element);
const multiplesCardSO = new MultiplesCardSO(sportsbookPlacePanelSO.element);
const multipleControlsSO = new BetControlsSO(multiplesCardSO.element);
const multipleStakeInputFieldSO = new CurrencyNumberInputFieldSO(multipleControlsSO.currencyInput);
const placeButtonSO = new PrimaryButtonSO();

// receipt screen objects
const sportsbookReceiptPanelSO = new SportsbookReceiptPanelSO();
const receiptTitleSO = new ReceiptTitleSO();
const optionSO = new OptionSO(sportsbookReceiptPanelSO.element);
const switchSO = new SwitchSO(optionSO.toggle);

const multiplesSelectionsSO = new BetSelectionsSO();
const firstBetSelectionSO = new BetSelectionDetailsSO(multiplesSelectionsSO.selections[0]);
const secondBetSelectionSO = new BetSelectionDetailsSO(multiplesSelectionsSO.selections[1]);

const singleSO = new SingleSO(sportsbookPlacePanelSO.element);
const singleControlsSO = new BetControlsSO(singleSO.controls);
const sportsbookSinglePlaceSizeInputField = new CurrencyNumberInputFieldSO(singleControlsSO.currencyInput);

const snackbarSO = new SnackbarSO();

const placeDoubleBet = async () => {
  // Fist selection
  await browser.waitUntilClickableNative(firstRunnerSO.element);
  await firstRunnerSO.element.click();
  await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "Waiting for Sportsbook single place panel element");

  // Second Selection
  await browser.waitUntilClickableNative(betslipDrawerSO.header);
  await betslipDrawerSO.header.click();
  await browser.waitUntilNotDisplayed(sportsbookPlacePanelSO.element, "Singles panel hasn't been minimized");
  await swipeUp(0.5); // swipe to the bottom of the screen to reveal last card
  await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK_WITH_HR));
  await browser.waitUntilDisplayed(thirdSbkRunnerSO.sbkBetButtons[0], "Third runner bet button not visible");
  await browser.waitUntilClickableNative(thirdSbkRunnerSO.sbkBetButtons[0]);

  await thirdSbkRunnerSO.sbkBetButtons[0].click();

  await browser.waitUntilEquals(minimizedSO.counter, "2");
  await browser.waitUntilClickableNative(minimizedSO.element);
  await minimizedSO.element.click();

  // multiples stake
  await browser.waitUntilDisplayed(multipleStakeInputFieldSO.element, "Waiting for multiple stake input field");
  await multipleStakeInputFieldSO.numberField.setValue(0.1);
  await hideKeyboard();

  // place bet
  await mockService.mockHttpRequest(getPlaceBet(PLACE_SUCCESS_WITH_HR));
  await browser.waitUntilClickableNative(placeButtonSO.element);
  await placeButtonSO.element.click();
  await browser.waitUntilDisplayed(sportsbookReceiptPanelSO.element, "Waiting for Sportsbook confirm panel");
  await browser.waitUntil(async () => (await switchSO.switch.getAttribute("selected")) === "false");
};

const placeSingleBet = async () => {
  await browser.waitUntilDisplayed(thirdSbkRunnerSO.sbkBetButtons[0], "Third runner bet button not visible");

  // Fist selection
  await browser.waitUntilClickableNative(thirdSbkRunnerSO.sbkBetButtons[0]);
  await thirdSbkRunnerSO.sbkBetButtons[0].click();

  // single stake
  await sportsbookSinglePlaceSizeInputField.numberField.setValue(1);
  await hideKeyboard();

  // place bet
  await mockService.mockHttpRequest(getPlaceBet(PLACE_SINGLE_SUCCESS_WITH_HR));
  await placeButtonSO.element.click();
  await browser.waitUntilDisplayed(sportsbookReceiptPanelSO.element, "Waiting for receipt panel element");
};

const togglePush = async (subscribeStatus) => {
  await browser.waitUntilDisplayed(switchSO.switch);
  await browser.waitUntilClickableNative(switchSO.switch);
  await switchSO.switch.click();
  await browser.waitUntil(async () => (await switchSO.switch.getAttribute("selected")) === subscribeStatus);
  await browser.waitUntilDisplayed(snackbarSO.element);
};

const EVENT_TYPE_ID = 1;
const FIRST_EVENT_ID = 31947807;
const SECOND_MARKET_ID = "924.338039536";
const THIRD_RACE_ID = "29901908.1410";
const FIRST_MARKET_ID = "924.337797045";
const THIRD_MARKET_ID = "924.3";

const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: FIRST_MARKET_ID,
          selectionId: 19,
        },
      ],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: { decimalOdds: 1.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: FIRST_MARKET_ID,
    selectionId: 19,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: { decimalOdds: 1.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const THIRD_RUNNER = { marketId: THIRD_MARKET_ID, selectionId: 1 };

const THIRD_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [THIRD_RUNNER],
    },
  ],
};

const THIRD_SINGLE_ODDS_MOCK = {
  runner: THIRD_RUNNER,
  odds: {
    decimalDisplayOdds: { decimalOdds: 1.1 },
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const BFF_MOCK_WITH_HR = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        cardGroupTitle: "First Card",
        urn: `ppb:tbd:card:group:topEventsInSport:1`,
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${FIRST_EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${FIRST_EVENT_ID}`,
                fixture: {
                  urn: `ppb:fixture:${FIRST_EVENT_ID}`,
                  home: {
                    name: "Portugal",
                  },
                  away: {
                    name: "Switzerland",
                  },
                },
                sportevent: {
                  name: "Portugal v Switzerland",
                  openDate: "2010-10-14T18:45Z",
                  urn: `ppb:event:${FIRST_EVENT_ID}`,
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:1234561",
                    name: "World Cup",
                  },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${FIRST_MARKET_ID}`,
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Portugal v Switzerland",
                          urn: `ppb:event:${FIRST_EVENT_ID}`,
                          eventId: FIRST_EVENT_ID,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/19`,
                          selectionId: 19,
                          name: "Portugal",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/58805`,
                          selectionId: 58805,
                          name: "The Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/15193`,
                          selectionId: 15193,
                          name: "Switzerland",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/19`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/58805`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/15193`,
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
        urn: "ppb:tbd:card:group:topEventsInSport:2",
        cardGroupTitle: "League",
        defaultLayout: "CARD_LIST",
        layouts: ["CARD_LIST", "COUPON"],
        partials: {
          edges: [
            {
              node: {
                __typename: "RaceMarketCard",
                urn: `ppb:tbd:card:raceMarket:${THIRD_RACE_ID};WIN|3`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "RaceMarketCard",
                numberOfRunners: 1,
                urn: `ppb:tbd:card:raceMarket:${THIRD_RACE_ID};WIN|3`,
                title: "Win",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${THIRD_MARKET_ID}`,
                      name: "1m2f Nov Stks",
                      marketType: "WIN",
                      marketTypeName: "Win",
                      liveData: {
                        inplay: false,
                        turnInPlayEnabled: false,
                        bspMarket: true,
                      },
                      sport: {
                        __typename: "Sport",
                        name: "Horse Racing",
                        sportId: 7,
                        urn: "ppb:eventType:7",
                      },
                      hierarchy: {
                        __typename: "RaceHierarchy",
                        race: {
                          __typename: "Race",
                          urn: `ppb:race:${THIRD_RACE_ID}`,
                          startTime: "2020-07-13T14:40:00",
                          name: "Windsor",
                          meeting: {
                            __typename: "Meeting",
                            urn: "ppb:meeting:30061949",
                            name: "Wind 13th Jul",
                            country: "GB",
                            countryFlag: {
                              vector: "http://example.test.com/mockedImage/image.png",
                            },
                            venue: "Windsor",
                          },
                        },
                        meeting: {
                          __typename: "Meeting",
                          urn: "ppb:meeting:30061949",
                          name: "Wind 13th Jul",
                          country: "GB",
                          countryFlag: {
                            vector: "http://example.test.com/mockedImage/image.png",
                          },
                          venue: "Windsor",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/1`,
                          name: "Shakalakaboomboom",
                          selectionId: 1,
                          handicap: 0,
                          resultType: null,
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/1`,
                      },
                    ],
                  },
                },
                race: {
                  __typename: "Race",
                  urn: `ppb:race:${THIRD_RACE_ID}`,
                  startTime: "2020-07-13T13:30:00.000Z",
                  name: "14:30 Windsor",
                  details: {
                    distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 4, yards: 5 },
                    going: "GOOD_FIRM",
                    status: "GOING_DOWN",
                    numberOfRunners: 14,
                  },
                  runners: [
                    {
                      __typename: "RaceRunner",
                      urn: `ppb:tbd:racerunner:${THIRD_RACE_ID}/1`,
                      raceURN: `ppb:race:${THIRD_RACE_ID}`,
                      selectionId: 1,
                      horse: {
                        name: "A",
                        sireName: "KODIAC",
                        damName: "SUPREME OCCASION (IRE)",
                        damSireName: "TEOFILO (IRE)",
                        age: 3,
                        color: "BAY",
                        sex: "COLT",
                      },
                      details: {
                        jockeyName: "John Velazquez",
                        trainerName: "Richard Hannon",
                        saddleCloth: 3,
                        silk: "http://example.test.com/mockedImage/image.png",
                        draw: 10,
                      },
                    },
                  ],

                  meeting: {
                    __typename: "Meeting",
                    urn: "ppb:meeting:30061949",
                    name: "Wind 13th Jul",
                    country: "GB",
                    countryFlag: {
                      vector: "http://example.test.com/mockedImage/image.png",
                    },
                    venue: "Windsor",
                  },
                },
                numberOfRunnersToDisplay: 1,
              },
            },
          ],
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

const DOUBLE_MOCK_WITH_HR = {
  betCombinations: [
    FIRST_SINGLE_MOCK,
    THIRD_SINGLE_MOCK,
    {
      betType: "DOUBLE",
      legCombinations: [],
      betMinStake: 0.1,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 1.23,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 1.23 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

const PLACE_SUCCESS_WITH_HR = {
  result: [
    {
      betPrice: {
        decimalDisplayOdds: { decimalOdds: 1.23 },
      },
      betType: "DOUBLE",
      runners: [
        {
          runner: { marketId: FIRST_MARKET_ID, selectionId: 19 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
        {
          runner: { marketId: THIRD_MARKET_ID, selectionId: 1 },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: FIRST_MARKET_ID, selectionId: 19 } }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
        {
          leg: {
            betRunners: [{ runner: { marketId: THIRD_MARKET_ID, selectionId: 1 } }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
      ],

      totalStake: 0.1,
      totalPotentialWin: 0.12,
    },
  ],
};

const NSS_MOCK_WITH_HR = {
  topics: [
    {
      topicId: FIRST_EVENT_ID,
      eventType: "FOOTBALL",
      incidentTypes: [
        "FOOTBALL_KICK_OFF",
        "FOOTBALL_HALF_TIME",
        "FOOTBALL_FINAL_SCORE",
        "FOOTBALL_RED_CARD",
        "FOOTBALL_SCORE_CHANGE",
      ],
    },
    {
      topicId: THIRD_RACE_ID,
      eventType: "HORSE_RACE",
      incidentTypes: ["HORSE_RACE_KICK_OFF", "HORSE_RACE_NON_RUNNER", "HORSE_RACE_FINAL_RESULT"],
    },
  ],

  applicationTypeId: "applicationTypeIdTest",
  deviceId: "deviceIdTest",
  locale: "en_GB",
};

const SMP_MOCK = {
  markets: [
    {
      marketId: FIRST_MARKET_ID,
      runnerDetails: [
        {
          selectionId: "19",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.9 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "58805",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 3.9 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "15193",
          noOdds: true,
        },
      ],
    },
    {
      marketId: SECOND_MARKET_ID,
      runnerDetails: [
        {
          selectionId: "27",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 6.5 },
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
          selectionId: "24",
          noOdds: true,
        },
      ],
    },
    {
      marketId: THIRD_MARKET_ID,
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 2,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 3,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
  ],
};

const SINGLE_IMPLY_BET_MOCK = {
  betCombinations: [THIRD_SINGLE_MOCK],
  runnerOdds: [THIRD_SINGLE_ODDS_MOCK],
};

const PLACE_SINGLE_SUCCESS_WITH_HR = {
  result: [
    {
      betPrice: {
        decimalDisplayOdds: { decimalOdds: 1.23 },
      },
      runners: [
        {
          runner: { marketId: THIRD_MARKET_ID, selectionId: 1 },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: THIRD_MARKET_ID, selectionId: 1 } }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
      ],

      totalStake: 0.1,
      totalPotentialWin: 0.12,
    },
  ],
};

describe("Betreceipt Notifications - Throttle enabled", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      getAppContext({
        throttles: {
          HR_PUSH_NOTIFICATIONS_SUPPORT: {
            isActive: true,
          },
        },
      }),
    );
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK_WITH_HR));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getNSSRegister());
    await mockService.mockHttpRequest(getNSSSubscribeSuccessWithHR(NSS_MOCK_WITH_HR));

    const HOME_VIEW_LINK = getStartViewLink("football/s-1");
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
  });

  describe("When the user places a bet on 2 events, one in Football the other in HR", () => {
    beforeAll(async () => {
      await placeDoubleBet();
    });

    it("[PRPI-3279] The toggle should be displayed disabled", async () => {
      expect(await optionSO.toggle.isDisplayed()).toBe(true);
      expect(await switchSO.switch.getAttribute("selected")).toBe("false");
      expect(await optionSO.title.getText()).toBe("Receive Live Alerts");
    });

    describe("When the user turns notifications on", () => {
      beforeAll(async () => {
        await togglePush("true");
      });

      it("[PRPI-3280] The toggle should be displayed enabled", async () => {
        expect(await optionSO.toggle.isDisplayed()).toBe(true);
        expect(await switchSO.switch.getAttribute("selected")).toBe("true");
      });

      it("[PRPI-3281] The toast message should be displayed", async () => {
        expect(await snackbarSO.icon.isDisplayed()).toBe(true);
        expect(await snackbarSO.title.getText()).toBe("Partial Live Alerts");
        expect(await snackbarSO.description.getText()).toBe("Some of the events have notifications unavailable.");
      });

      it("[PRPI-3282] Should show the notification unavailable icon in HR BetSummary", async () => {
        expect(await firstBetSelectionSO.notificationsUnavblIcon.isDisplayed()).toBe(false);
        expect(await secondBetSelectionSO.notificationsUnavblIcon.isDisplayed()).toBe(true);
      });

      describe("When the user closes the bet receipt and places a bet again only in a HR event ", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_IMPLY_BET_MOCK));
          await browser.waitUntilClickableNative(receiptTitleSO.dismissButton);
          await receiptTitleSO.dismissButton.click();
          await placeSingleBet();
        });

        it("[PRPI-3283] The toggle shouldn't be displayed", async () => {
          expect(await optionSO.toggle.isDisplayed()).toBe(false);
        });
      });
    });
  });
});
