const {
  getSportsLayout,
  getMyBetsLayout,
  getHomeLayoutWithViewLink,
  getCardResults,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { GenericSwitcherCardSO, PageHeaderSO } = require("../../../../screen-objects");
const { BottomBarSO, MyBetsScreenSO, HeaderSO } = require("../../../../screen-objects");
const Gestures = require("../../../../helpers/gestures");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const MockService = require("../../../../mock-essentials/mocking-service");
const { HEADER_ITEMS_MOCK, GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();

const headerSO = new HeaderSO();
const myBetsScreenSO = new MyBetsScreenSO();
const pageHeaderSO = new PageHeaderSO();
const switcherCardSO = new GenericSwitcherCardSO();

const BFF_VIEW_MOCK = {
  __typename: "SportView",
  urn: "ppb:tbd:view:sport:1",
  title: "",
  edges: [
    {
      node: {
        __typename: "GenericSwitcherCard",
        urn: "ppb:tbd:card:genericswitcher:sport:1",
        filterTitle: {
          translated: null,
          translate: {
            key: "I18N.SWITCHER.SPORT.TITLE",
          },
        },
        selectedViewLink: {
          label: "Football",
          viewLink: {
            viewUrn: "ppb:tbd:view:sport:1",
            viewUrl: "football/s-1",
          },
        },
        headerTheming: null,
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsTodayInSport:1",
        cardGroupTitle: "Today",
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29753184",
                viewLink: {
                  viewUrn: "ppb:tbd:view:event:29753184",
                  viewUrl: "ppb:tbd:view:event:29753184",
                },
                title: "Match Odds",
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.170181973",
                      liveData: {
                        totalMatched: 21883.006497031536,
                        state: "SUSPENDED",
                        inplay: false,
                      },
                      name: "Match Odds",
                      marketType: "MATCH_ODDS",
                      bettingType: "ODDS",
                      eachWayDivisor: null,
                      numberOfWinners: 1,
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:1",
                        name: "Football",
                      },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          __typename: "Competition",
                          urn: "ppb:competition:12191691",
                          name: "Brazilian Brasiliense Matches",
                        },
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:29753184",
                          name: "Gama v Real Futebol Clube",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170181973/198140/0",
                          name: "Gama",
                          selectionId: 198140,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: "ppb:excRunner:1.170181973/198140/0",
                      },
                    ],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29753184",
                  home: {
                    name: "Gama",
                    color: null,
                    crest: null,
                  },
                  away: {
                    name: "Real Futebol Clube",
                    color: null,
                    crest: null,
                  },
                  scheduledAt: "2020-03-17T23:00:00Z",
                  startedAt: "2020-03-17T22:59:11Z",
                },
                sportevent: {
                  name: "Gama v Real Futebol Clube",
                  openDate: "2010-10-14T18:45Z",
                  urn: "ppb:event:29753184",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Brazilian Brasiliense Matches",
                  },
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29753184",
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
        __typename: "GenericSwitcherCard",
        urn: "ppb:tbd:card:genericswitcher:sport:1",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsTodayInSport:1",
      },
    },
  ],
};

const SBK_BET_CARD = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:926229536",
    navigationLinks: [
      {
        marketBetUrn: "ppb:marketBet:924.926229536",
      },
    ],

    bet: {
      urn: "ppb:sbkBet:926229536",
      betReceiptId: "O/4275336/0021305",
      profitAndLoss: "0.22",
      betType: "SGL",
      currentSize: 0.12,
      result: "CASHED_OUT",
      legs: [
        {
          type: "SS",
          result: "PLACED",
          parts: [
            {
              price: {
                decimal: 1.86,
                fractional: {
                  numerator: 43,
                  denominator: 50,
                },
              },
              eventDescription: "Spezia v Entella",
              eventMarketDescription: "Match Odds",
              selectionName: "Spezia",
              startTime: "2020-07-27T19:00:00",
            },
          ],
        },
      ],
    },
  },
};

const SBK_BET = {
  urn: "ppb:sbkBet:926228962",
  betReceiptId: "O/4275336/0021303",
  profitAndLoss: "5.30",
  betType: "TBL",
  currentSize: 1,
  result: "CASHED_OUT",
  legs: [
    {
      type: "SS",
      result: "WON",
      parts: [
        {
          price: {
            decimal: 1.75,
            fractional: {
              numerator: 3,
              denominator: 4,
            },
          },
          eventDescription: "Empoli v Cosenza",
          eventMarketDescription: "Match Odds",
          selectionName: "Empoli",
          startTime: "2020-07-27T19:00:00",
        },
      ],
    },
    {
      type: "SS",
      result: "LOST",
      parts: [
        {
          price: {
            decimal: 2.1,
            fractional: {
              numerator: 11,
              denominator: 10,
            },
          },
          eventDescription: "Pisa v Ascoli",
          eventMarketDescription: "Match Odds",
          selectionName: "Pisa",
          startTime: "2020-07-27T19:00:00",
        },
      ],
    },
    {
      type: "SS",
      result: "VOID",
      parts: [
        {
          price: {
            decimal: 2.3,
            fractional: {
              numerator: 13,
              denominator: 10,
            },
          },
          eventDescription: "Cittadella v Venezia",
          eventMarketDescription: "Match Odds",
          selectionName: "Cittadella",
          startTime: "2020-07-27T19:00:00",
        },
      ],
    },
  ],
};

const SBK_BET_CARDS_TREBLE = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:926228962",
    navigationLinks: [
      {
        marketBetUrn: "ppb:marketBet:924.926228962",
      },
    ],

    bet: SBK_BET,
  },
};

const SBK_BET_CARDS_SECOND_TREBLE = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:926228963",
    navigationLinks: [
      {
        marketBetUrn: "ppb:marketBet:924.926228963",
      },
    ],

    bet: SBK_BET,
  },
};

const BFF_MY_BETS_MOCK = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:open",
  url: "mybets/myBets-open",
  filters: {
    orderType: {
      items: ["OPEN", "SETTLED"],
      defaultIndex: 0,
    },
    productType: {
      items: ["EXCHANGE", "SPORTSBOOK"],
      defaultIndex: 1,
    },
  },
  edges: [SBK_BET_CARD, SBK_BET_CARDS_TREBLE, SBK_BET_CARDS_SECOND_TREBLE],
  headerItems: HEADER_ITEMS_MOCK,
};

describe("Navigation - Header", () => {
  describe("When the user taps to navigate a given Sports screen", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
      const url = "football/s-1";
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilDisplayed(switcherCardSO.element);
    });

    it("[PRPI-2958] The back button should be visible", async () => {
      expect(await headerSO.backButton.isDisplayed()).toBe(true);
    });

    it("[PRPI-2959] The screen title should be visible on the screen: 'Football'", async () => {
      expect(await pageHeaderSO.pageHeaderTitle.getText()).toBe("Football");
    });

    it("[PRPI-3743] The Betfair logo should be visible", async () => {
      expect(await headerSO.betfairLogo.isDisplayed()).toBe(true);
    });

    it("[PRPI-2960] The My Account icon should be visible", async () => {
      expect(await headerSO.userProfile.isDisplayed()).toBe(true);
    });

    it("[PRPI-2961] The wallet amount should be visible", async () => {
      expect(await headerSO.balance.isDisplayed()).toBe(true);
    });
  });

  describe("When the user scrolls down", () => {
    beforeAll(async () => {
      await Gestures.swipeUp();
    });

    it("[PRPI-2962] The back button should be visible", async () => {
      expect(await headerSO.backButton.isDisplayed()).toBe(true);
    });

    it("[PRPI-3744] The Betfair logo should be visible", async () => {
      expect(await headerSO.betfairLogo.isDisplayed()).toBe(true);
    });

    it("[PRPI-2963] The My Account icon should be visible", async () => {
      expect(await headerSO.userProfile.isDisplayed()).toBe(true);
    });

    it("[PRPI-2964] The wallet amount should be visible", async () => {
      expect(await headerSO.balance.isDisplayed()).toBe(true);
    });
  });

  describe("When the user scrolls up till the header", () => {
    beforeAll(async () => {
      await Gestures.swipeDown();
    });

    it("[PRPI-2965] The back button should be visible", async () => {
      expect(await headerSO.backButton.isDisplayed()).toBe(true);
    });

    it("[PRPI-2966] The screen title should be visible on the screen: 'Football'", async () => {
      expect(await pageHeaderSO.pageHeaderTitle.getText()).toBe("Football");
    });

    it("[PRPI-3745] The Betfair logo should be visible", async () => {
      expect(await headerSO.betfairLogo.isDisplayed()).toBe(true);
    });

    it("[PRPI-2967] The My Account icon should be visible", async () => {
      expect(await headerSO.userProfile.isDisplayed()).toBe(true);
    });

    it("[PRPI-2968] The wallet amount should be visible", async () => {
      expect(await headerSO.balance.isDisplayed()).toBe(true);
    });
  });

  describe("When the user taps on 'My Bets' tab bar", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK));
      await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
      await browser.waitUntilClickableNative(BottomBarSO.myBets);
      await BottomBarSO.myBets.click();
      await browser.waitUntilDisplayed(myBetsScreenSO.header);
    });

    it("[PRPI-2969] The Betfair logo should be visible", async () => {
      expect(await headerSO.betfairLogo.isDisplayed()).toBe(true);
    });

    it("[PRPI-2970] The My Account icon should be visible", async () => {
      expect(await headerSO.userProfile.isDisplayed()).toBe(true);
    });

    it("[PRPI-2971] The wallet amount should be visible", async () => {
      expect(await headerSO.balance.isDisplayed()).toBe(true);
    });
  });

  describe("And the user scrolls down", () => {
    beforeAll(async () => {
      await Gestures.swipeUp();
    });

    it("[PRPI-2972] The Betfair logo should be visible", async () => {
      expect(await headerSO.betfairLogo.isDisplayed()).toBe(true);
    });

    it("[PRPI-2973] The My Account icon should be visible", async () => {
      expect(await headerSO.userProfile.isDisplayed()).toBe(true);
    });

    it("[PRPI-2974] The wallet amount should be visible", async () => {
      expect(await headerSO.balance.isDisplayed()).toBe(true);
    });
  });
});
