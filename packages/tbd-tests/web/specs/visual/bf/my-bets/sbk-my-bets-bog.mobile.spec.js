const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { CardPO, TabsGroupPO } = require("../../../../page-objects");
const routes = require("../../../../../utils/routes");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { HEADER_ITEMS_MOCK, GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const MODULE_NAME = "my_bets_sbk";

const mockService = new MockService();
const cardPO = new CardPO();
const tabsGroupPO = new TabsGroupPO();

// Open SBK Bet
const OPEN_FIXTURE_CARD = {
  node: {
    __typename: "FixtureCard",
    urn: "ppb:tbd:card:fixture:2022802|viewLink|0",
    sportevent: { urn: "ppb:event:2022802", name: "Spezia v Entella" },
    scheduledAt: "2020-07-27T19:00:00Z",
    fixtureEventViewLink: {
      viewUrn: "ppb:tbd:view:event:2022802",
      viewUrl: "football/argentinian-reserves/ca-lanus-(res)-v-ca-union-santa-fe-(res)/e-30744688",
    },
    fixture: {
      urn: "ppb:fixture:2022802",
      home: { name: "Spezia" },
      away: { name: "Entella" },
    },
  },
};

const OPEN_BET_LEG_DATA = {
  type: "SS",

  parts: [
    {
      price: {
        decimal: 1.86,
        fractional: {
          numerator: 43,
          denominator: 50,
        },
      },
      priceType: "GUARANTEED",
      marketBetUrn: "ppb:marketBet:924.237747664",
      eventDescription: "Spezia v Entella",
      eventMarketDescription: "Match Odds",
      selectionName: "Spezia",
      startTime: "2020-07-27T19:00:00Z",
    },
  ],
};

const OPEN_BET_LEG = {
  __typename: "BetLeg",
  urn: "ppb:sbkBetLeg:926229536/0",
  ...OPEN_BET_LEG_DATA,
};

const OPEN_BET_CARD = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:926229536",
    navigationLinks: [
      {
        marketBetUrn: "ppb:marketBet:924.237747664",
      },
    ],

    bet: {
      urn: "ppb:sbkBet:926229536",
      betReceiptId: "O/4275336/0021305",
      id: "926229536",
      isSettled: false,
      profitAndLoss: 0.22,
      betType: "SGL",
      currentSize: 0.12,
      numLines: 1,
      betPrice: null,
      legs: [
        {
          ...OPEN_BET_LEG_DATA,
        },
      ],

      bonus: 5,
    },
  },
};

const OPEN_FIXTURE_CARD_PARTIAL = {
  node: {
    __typename: "FixtureCard",
    urn: "ppb:tbd:card:fixture:2022802|viewLink|0",
  },
};

const BET_INFO_CARD_PARTIAL = {
  node: {
    __typename: "SportsbookBetInfoCard",
    urn: "ppb:tbd:card:sbkBetInfo:1179447017",
  },
};

const OPEN_BET_CARDS_EXPANDABLE = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: "ppb:tbd:card:group:sbkExpandableLeg:926229536",
    full: {
      edges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
            full: {
              edges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
                    betUrn: "ppb:sbkBet:926229536",
                    leg: OPEN_BET_LEG,
                  },
                },
                {
                  ...OPEN_FIXTURE_CARD,
                },
              ],
            },
            partials: {
              partialEdges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
                  },
                },
                {
                  ...OPEN_FIXTURE_CARD_PARTIAL,
                },
              ],
            },
          },
        },
        {
          node: {
            ...BET_INFO_CARD_PARTIAL.node,
            betReceiptId: "O/4275336/0021305",
          },
        },
      ],
    },
    partials: {
      partialEdges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
          },
        },
        {
          ...BET_INFO_CARD_PARTIAL,
        },
      ],
    },
  },
};

const OPEN_BET_CARDS_EXPANDABLE_PARTIAL = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: "ppb:tbd:card:group:sbkExpandableLeg:926229536",
  },
};

const OPEN_BET_CARD_PARTIAL = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:926229536",
  },
};

const OPEN_BET_CARD_GROUP = {
  node: {
    __typename: "BetCardGroup",
    urn: "ppb:tbd:card:bet:group:926229536",
    full: {
      edges: [OPEN_BET_CARD, OPEN_BET_CARDS_EXPANDABLE],
    },
    partials: {
      partialEdges: [OPEN_BET_CARD_PARTIAL, OPEN_BET_CARDS_EXPANDABLE_PARTIAL],
    },
  },
};

const BFF_MY_BETS_OPEN_MOCK = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:open",
  url: routes.getMyBetsViewUrl("open"),
  edges: [OPEN_BET_CARD_GROUP],
  headerItems: HEADER_ITEMS_MOCK,
};

const SETTLED_BET_LEG_DATA = {
  type: "CF",
  result: "PLACED",
  parts: [
    {
      eventDescription: "17:05 FLAT 2m 0f 125y",
      eventMarketDescription: "Win",
      marketBetUrn: "ppb:marketBet:924.258204896",
      price: { decimal: 2.2, fractional: { numerator: 6, denominator: 5 } },
      priceType: "GUARANTEED",
      selectionName: "Doctor Ken",
      startTime: "2021-03-24T17:05:00Z",
      rule4Deductions: 1,
    },
    {
      eventDescription: "17:05 FLAT 2m 0f 125y",
      eventMarketDescription: "Win",
      marketBetUrn: "ppb:marketBet:924.258204896",
      price: { decimal: 4.2, fractional: { numerator: 6, denominator: 5 } },
      priceType: "GUARANTEED",
      selectionName: "Doc Barbie",
      startTime: "2021-03-24T17:05:00Z",
      rule4Deductions: 2,
    },
  ],
};

// Settled SBK Bet
const SETTLED_BET_LEG = {
  __typename: "BetLeg",
  urn: "ppb:sbkBetLeg:1053675438/0",
  ...SETTLED_BET_LEG_DATA,
};

const SETTLED_EVENT_HEADER_CARD_PARTIAL = {
  node: {
    __typename: "EventHeaderCard",
    urn: "ppb:tbd:card:eventHeader:1053675438/0",
  },
};

const SETTLED_EVENT_HEADER_CARD = {
  node: {
    __typename: "EventHeaderCard",
    urn: "ppb:tbd:card:eventHeader:1053675438/0",
    title: "17:05 FLAT 2m 0f 125y",
    subtitle: "Win",
    tertiaryTitle: "Special",
    sportId: "7",
    date: "2021-03-24T17:05:00Z",
  },
};

const SETTLED_BET_CARD = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:1053675438",
    navigationLinks: [
      {
        marketBetUrn: "ppb:marketBet:924.1053675438",
      },
    ],

    bet: {
      urn: "ppb:sbkBet:1053675438",
      betReceiptId: "O/11037374/0000372",
      id: "1053675438",
      profitAndLoss: "0",
      betType: "SGL",
      currentSize: 0.66,
      numLines: 6,
      isOpen: false,
      isSettled: true,
      legs: [SETTLED_BET_LEG],
      result: "WIN",
      cashoutQuote: null,
    },
  },
};

const SETTLED_BET_CARD_PARTIAL = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:1053675438",
  },
};

const SETTLED_BET_CARDS_EXPANDABLE = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: "ppb:tbd:card:group:sbkExpandableLeg:1053675438",
    full: {
      edges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:1053675438/0",
            full: {
              edges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:1053675438/0",
                    betUrn: "ppb:sbkBet:1053675438",
                    leg: SETTLED_BET_LEG,
                  },
                },
                {
                  ...SETTLED_EVENT_HEADER_CARD,
                },
              ],
            },
            partials: {
              partialEdges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:1053675438/0",
                  },
                },
                {
                  ...SETTLED_EVENT_HEADER_CARD_PARTIAL,
                },
              ],
            },
          },
        },
        {
          node: {
            ...BET_INFO_CARD_PARTIAL.node,
            betReceiptId: "O/11037374/0000372",
          },
        },
      ],
    },
    partials: {
      partialEdges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:1053675438/0",
          },
        },
        BET_INFO_CARD_PARTIAL,
      ],
    },
  },
};

const SETTLED_BET_CARDS_EXPANDABLE_PARTIAL = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: "ppb:tbd:card:group:sbkExpandableLeg:1053675438",
  },
};

const SETTLED_BET_CARD_GROUP = {
  node: {
    __typename: "BetCardGroup",
    urn: "ppb:tbd:card:bet:group:1000000005",
    full: {
      edges: [SETTLED_BET_CARD, SETTLED_BET_CARDS_EXPANDABLE],
    },
    partials: {
      partialEdges: [SETTLED_BET_CARD_PARTIAL, SETTLED_BET_CARDS_EXPANDABLE_PARTIAL],
    },
  },
};

const BFF_MY_BETS_SETTLED_MOCK = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:settled",
  url: routes.getMyBetsViewUrl("settled"),
  edges: [SETTLED_BET_CARD_GROUP],
  headerItems: HEADER_ITEMS_MOCK,
};

/* EACH WAT BET Mocks */
const SBK_BET_CARD_EACH_WAY_RACE_CARD_DETAILS = {
  node: {
    __typename: "RaceDetailsCard",
    urn: "ppb:tbd:card:raceDetails:30819268.1605|true",
    numberOfRunners: 14,
    showMeetingInfo: true,
    race: {
      __typename: "Race",
      urn: "ppb:race:29901908.1410",
      startTime: "2020-07-13T14:40:00Z",
      name: "1m7f Hcap Hrd",
      details: {
        distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 40, yards: 50 },
        going: "GOOD_SOFT",
        status: "DORMANT",
        type: "HURDLE",
      },
      runners: [],
      meeting: {
        __typename: "Meeting",
        urn: "ppb:meeting:29901908",
        name: "Ohi 5th Dec",
        country: "GB",
        venue: "Ohi",
      },
    },
    raceViewLink: {
      viewUrn: "ppb:tbd:view:race:7|30819268.1605",
      viewUrl: "horse-racing/chepstow-25th-mar/2m-nov-hrd/r-924.258298128",
    },
  },
};

const SBK_BET_CARD_EACH_WAY_FULL = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:1072954805",
    navigationLinks: [
      {
        marketBetUrn: "ppb:marketBet:924.258298128",
        viewUrl: "horse-racing/chepstow-25th-mar/r-7%7C30376076.1300",
      },
    ],

    bet: {
      urn: "ppb:sbkBet:1072954805",
      betReceiptId: "O/11037374/0000500",
      id: "1072954805",
      isSettled: false,
      profitAndLoss: 0.27,
      originalPotentialWin: 0.19,
      betType: "SGL",
      currentSize: 0.22,
      numLines: 2,
      isOddsBoosted: true,
      betPrice: {
        decimal: 2.29,
        fractional: {
          numerator: 129,
          denominator: 100,
        },
      },
      legs: [
        {
          type: "SS",
          result: null,
          parts: [
            {
              marketBetUrn: "ppb:marketBet:924.258298128",
              originalPrice: {
                decimal: 1.7,
                fractional: {
                  numerator: 3,
                  denominator: 4,
                },
              },
              price: {
                decimal: 2.75,
                fractional: {
                  numerator: 3,
                  denominator: 4,
                },
              },
              priceType: "GUARANTEED",
              eventDescription: "13:00 NOVICES HURDLE 2m 0f 11y",
              eventMarketDescription: "Each Way",
              selectionName: "Galice Macalo ",
              startTime: "2021-03-25T13:00:00Z",
              eachwayPlaces: 3,
              eachwayFactor: {
                numerator: 1,
                denominator: 5,
              },
            },
          ],
        },
      ],
    },
  },
};

const SBK_BET_CARD_EACH_WAY_RACE_CARD_DETAILS_PARTIALS = {
  node: {
    __typename: "RaceDetailsCard",
    urn: "ppb:tbd:card:raceDetails:30819268.1605|true",
  },
};

const SBK_BET_CARD_EACH_WAY_PARTIALS = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:1072954805",
  },
};

const BET_LEG_CARD_FIRST_EACH_WAY_PARTIAL = {
  __typename: "BetLegCard",
  urn: "ppb:tbd:card:sbkBetLeg:1072954805/0",
};

const BET_LEG_CARD_FIRST_EACH_WAY = {
  ...BET_LEG_CARD_FIRST_EACH_WAY_PARTIAL,
  betUrn: "ppb:sbkBet:1072954805",
  leg: SBK_BET_CARD_EACH_WAY_FULL.node.bet.legs[0],
};

const FIRST_LEG_CARD_GROUP_EACH_WAY_PARTIAL = {
  __typename: "SportsbookBetLegCardGroup",
  urn: "ppb:tbd:cardgroup:sbkBetLeg:1072954805/0",
};

const BET_EXPANDABLE_LEGS_EACH_WAY_PARTIAL = {
  __typename: "SportsbookExpandableLegCardGroup",
  urn: "ppb:tbd:cardgroup:sbkExpandableLeg:1072954805",
};

const BET_EXPANDABLE_LEGS_EACH_WAY = {
  ...BET_EXPANDABLE_LEGS_EACH_WAY_PARTIAL,
  full: {
    edges: [
      {
        node: {
          ...FIRST_LEG_CARD_GROUP_EACH_WAY_PARTIAL,
          full: {
            edges: [{ node: BET_LEG_CARD_FIRST_EACH_WAY }, SBK_BET_CARD_EACH_WAY_RACE_CARD_DETAILS],
          },
          partials: {
            partialEdges: [
              { node: BET_LEG_CARD_FIRST_EACH_WAY_PARTIAL },
              SBK_BET_CARD_EACH_WAY_RACE_CARD_DETAILS_PARTIALS,
            ],
          },
        },
      },
      {
        node: {
          ...BET_INFO_CARD_PARTIAL.node,
          betReceiptId: "O/11037374/0000500",
        },
      },
    ],
  },
  partials: {
    partialEdges: [{ node: FIRST_LEG_CARD_GROUP_EACH_WAY_PARTIAL }, BET_INFO_CARD_PARTIAL],
  },
};

const BETCARD_GROUP_CARDS_EACH_WAY = {
  node: {
    __typename: "BetCardGroup",
    urn: "ppb:tbd:card:bet:group:1072954805|sbk",
    full: {
      edges: [SBK_BET_CARD_EACH_WAY_FULL, { node: BET_EXPANDABLE_LEGS_EACH_WAY }],
    },
    partials: {
      partialEdges: [SBK_BET_CARD_EACH_WAY_PARTIALS, { node: BET_EXPANDABLE_LEGS_EACH_WAY_PARTIAL }],
    },
  },
};

const BFF_MY_BETS_MOCK_EACH_WAY = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:open",
  url: "mybets/myBets-open",
  filters: {
    orderType: {
      items: ["OPEN", "SETTLED"],
      defaultIndex: 0,
    },
    productType: {
      items: ["SPORTSBOOK"],
      defaultIndex: 1,
    },
  },
  edges: [BETCARD_GROUP_CARDS_EACH_WAY],
  pageInfo: {
    hasNextPage: "true",
    endCursor: "NA==",
  },
  headerItems: HEADER_ITEMS_MOCK,
};

describe("My Bets Page - SBK - Best Odds Guaranteed (BOG)", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MY_BETS_OPEN_MOCK.urn, { products: ["sportsbook"] }));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_OPEN_MOCK));
    await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
    await mockService.mockHttpRequest(getScaResponse({}));

    await browser.url(routes.getMyBetsViewUrl("open"));

    await cardPO.header.scrollIntoView({ block: "start" });
    await browser.waitUntilInViewport(cardPO.header);
    await cardPO.header.click();
    await browser.waitUntilDisplayed(cardPO.content);

    await browser.waitUntilImageEquals(
      `${MODULE_NAME}_[PRPI-1440]_should_see_my_bets_page_with_open_sportsbook_bet_with_bog_signposting`,
    );
  });

  describe("When on My Bets 'Open Bets' view and a bet with BOG is open", () => {
    it("[PRPI-1440]_should_see_my_bets_page_with_open_sportsbook_bet_with_bog_signposting", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1440]_should_see_my_bets_page_with_open_sportsbook_bet_with_bog_signposting`,
        ),
      ).toBe(0);
    });
  });

  describe("When the user opens My Bets page with one each way bet with BOG and BOOST", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_MY_BETS_MOCK_EACH_WAY.urn, { products: ["sportsbook"] }),
      );
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK_EACH_WAY));
      await mockService.mockHttpRequest(getScaResponse({}));

      await browser.url(routes.getMyBetsViewUrl("open"));

      await cardPO.header.scrollIntoView({ block: "start" });
      await browser.waitUntilInViewport(cardPO.header);
      await cardPO.header.click();
      await browser.waitUntilDisplayed(cardPO.content);

      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1441]_the_bet_card_group_should_be_displayed_with_BOG_icon_and_BOOST_label_and_icon`,
      );
    });

    it("[PRPI-1441]_the_bet_card_group_should_be_displayed_with_BOG_icon_and_BOOST_label_and_icon", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1441]_the_bet_card_group_should_be_displayed_with_BOG_icon_and_BOOST_label_and_icon`,
        ),
      ).toBe(0);
    });
  });

  xdescribe("When on My Bets 'Settled Bets' view and a bet with BOG is settled", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MY_BETS_SETTLED_MOCK.urn, { products: ["sportsbook"] }));
      await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_SETTLED_MOCK));
      await tabsGroupPO.tabs[1].click();

      await cardPO.header.scrollIntoView({ block: "start" });
      await browser.waitUntilInViewport(cardPO.header);
      await cardPO.header.click();
      await browser.waitUntilDisplayed(cardPO.content);

      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1442]_should_see_my_bets_page_with_settled_sportsbook_bet_with_bog_signposting`,
      );
    });

    it("[PRPI-1442]_should_see_my_bets_page_with_settled_sportsbook_bet_with_bog_signposting", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1442]_should_see_my_bets_page_with_settled_sportsbook_bet_with_bog_signposting`,
        ),
      ).toBe(0);
    });
  });
});
