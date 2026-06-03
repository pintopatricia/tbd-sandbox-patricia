const { MyBetsPagePO, CardPO, SportsbookBetPanelPO, BetSelectionDetailsPO } = require("../../../../page-objects");
const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const SportsbookExpandableLegCardGroupPO = require("@ppb/tbd-shared/components/SportsbookExpandableLegCardGroup/SportsbookExpandableLegCardGroup.web.po");
const SportsbookBetLegCardGroupPO = require("@ppb/tbd-shared/components/SportsbookBetLegCardGroup/SportsbookBetLegCardGroup.web.po");

const routes = require("../../../../../utils/routes");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { HEADER_ITEMS_MOCK, GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const cardPO = new CardPO();
const myBetsPO = new MyBetsPagePO();
const firstSbkBetPanelPO = new SportsbookBetPanelPO(myBetsPO.betCardGroups[0]);

const sportsbookExpandableLegCardGroupPO = new SportsbookExpandableLegCardGroupPO();
const firstSportsbookBetLegCardGroupPO = new SportsbookBetLegCardGroupPO(sportsbookExpandableLegCardGroupPO.cards[0]);
const firstEventFirstBetSelectionDetailsPO = new BetSelectionDetailsPO(firstSportsbookBetLegCardGroupPO.cards[1]);

const MODULE_NAME = "my_bets_sbk";

const SBK_BET_CARDS_LEGS = [
  {
    __typename: "BetLeg",
    urn: "ppb:sbkBetLeg:1145047264/0",
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
        marketBetUrn: "ppb:marketBet:924.237747664",
        eventDescription: "Empoli v Cosenza",
        eventMarketDescription: "Match Odds",
        selectionName: "Empoli",
        startTime: "2020-07-27T19:00:00Z",
      },
    ],
  },
  {
    __typename: "BetLeg",
    urn: "ppb:sbkBetLeg:1145047264/1",
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
        priceType: "GUARANTEED",
        marketBetUrn: "ppb:marketBet:924.237747664",
        eventDescription: "14:45 HANDICAP HURDLE 1m 7f 169y",
        eventMarketDescription: "Each Way",
        selectionName: "Bignorm",
        startTime: "2020-07-27T19:00:00Z",
        eachwayPlaces: 4,
        eachwayFactor: {
          numerator: 1,
          denominator: 5,
        },
      },
    ],
  },
  {
    __typename: "BetLeg",
    urn: "ppb:sbkBetLeg:1145047264/2",
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
        marketBetUrn: "ppb:marketBet:924.237747664",
        eventDescription: "Cittadella v Venezia",
        eventMarketDescription: "Match Odds",
        selectionName: "Cittadella",
        startTime: "2020-07-27T19:00:00Z",
      },
    ],
  },
];

const SBK_BET_CARDS_FULL = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:1145047264",
    navigationLinks: [
      {
        marketBetUrn: "ppb:marketBet:924.237747664",
      },
    ],

    bet: {
      urn: "ppb:sbkBet:1145047264",
      betReceiptId: "O/4275336/0021303",
      profitAndLoss: 5.3,
      id: "1145047264",
      isSettled: false,
      betType: "TBL",
      currentSize: 1,
      result: null,
      betPrice: {
        decimal: 2.29,
        fractional: {
          numerator: 129,
          denominator: 100,
        },
      },
      legs: SBK_BET_CARDS_LEGS,
    },
  },
};

const SBK_BET_CARDS_PARTIALS = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:1145047264",
  },
};

const SBK_BET_CARDS_EXPANDABLE = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: "ppb:tbd:card:group:sbkExpandableLeg:1145047264",
    full: {
      edges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:1145047264/0",
            full: {
              edges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:1145047264/0",
                    betUrn: "ppb:sbkBet:1145047264",
                    leg: SBK_BET_CARDS_LEGS[0],
                  },
                },
                {
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
                },
              ],
            },
            partials: {
              partialEdges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:1145047264/0",
                  },
                },
                {
                  node: {
                    __typename: "FixtureCard",
                    urn: "ppb:tbd:card:fixture:2022802|viewLink|0",
                  },
                },
              ],
            },
          },
        },
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:1145047264/1",
            full: {
              edges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:1145047264/1",
                    betUrn: "ppb:sbkBet:1145047264",
                    leg: SBK_BET_CARDS_LEGS[1],
                  },
                },
                {
                  node: {
                    __typename: "RaceDetailsCard",
                    urn: "ppb:tbd:card:raceDetails:30819268.1605|true",
                    numberOfRunners: 14,
                    showMeetingInfo: true,
                    race: {
                      __typename: "Race",
                      urn: "ppb:race:29901908.1410",
                      startTime: "2020-07-13T14:40:00Z",
                      name: "Aintree",
                      details: {
                        distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 40, yards: 50 },
                        going: "GOOD_FIRM",
                        type: "FLAT",
                      },
                      meeting: {
                        __typename: "Meeting",
                        urn: "ppb:meeting:29901908",
                        name: "Wind 13th Jul",
                        country: "GB",
                        countryFlag: {
                          medium: "http://example.test.com/mockedImage/image.png",
                        },
                        venue: "Aintree",
                      },
                    },
                  },
                },
              ],
            },
            partials: {
              partialEdges: [
                {
                  node: {
                    __typename: "RaceDetailsCard",
                    urn: "ppb:tbd:card:raceDetails:30819268.1605|true",
                  },
                },
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:1145047264/1",
                  },
                },
              ],
            },
          },
        },
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:1145047264/2",
            full: {
              edges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:1145047264/2",
                    betUrn: "ppb:sbkBet:1145047264",
                    leg: SBK_BET_CARDS_LEGS[2],
                  },
                },
              ],
            },
            partials: {
              partialEdges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:1145047264/2",
                  },
                },
              ],
            },
          },
        },
        {
          node: {
            __typename: "SportsbookBetInfoCard",
            urn: "ppb:tbd:card:sbkBetInfo:1179447017",
            betReceiptId: "O/4275336/0021303",
          },
        },
      ],
    },
    partials: {
      partialEdges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:1145047264/0",
          },
        },
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:1145047264/1",
          },
        },
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:1145047264/2",
          },
        },
        {
          node: {
            __typename: "SportsbookBetInfoCard",
            urn: "ppb:tbd:card:sbkBetInfo:1179447017",
          },
        },
      ],
    },
  },
};

const SBK_BET_CARDS_EXPANDABLE_PARTIALS = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: "ppb:tbd:card:group:sbkExpandableLeg:1145047264",
  },
};

const BETCARD_GROUP_CARDS = {
  node: {
    __typename: "BetCardGroup",
    urn: "ppb:tbd:card:bet:group:1145047264",
    full: {
      edges: [SBK_BET_CARDS_FULL, SBK_BET_CARDS_EXPANDABLE],
    },
    partials: {
      partialEdges: [SBK_BET_CARDS_PARTIALS, SBK_BET_CARDS_EXPANDABLE_PARTIALS],
    },
  },
};

const BFF_MY_BETS_MOCK = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:open",
  url: routes.getMyBetsViewUrl("open"),
  edges: [BETCARD_GROUP_CARDS],
  headerItems: HEADER_ITEMS_MOCK,
};

/* BET LEGS Mocks */
const BET_LEGS = [
  {
    urn: "ppb:sbkBetLeg:1176090450/0",
    type: "SS",
    result: "WON",
    parts: [
      {
        rule4Deductions: 5,
        price: {
          decimal: 1.75,
          fractional: {
            numerator: 3,
            denominator: 4,
          },
        },
        priceType: "LIVE",
        marketBetUrn: "ppb:marketBet:924.237747664",
        eventDescription: "Empoli v Cosenza",
        eventMarketDescription: "Match Odds",
        selectionName: "Empoli",
        startTime: "2020-07-27T19:00:00",
      },
    ],
  },
  {
    urn: "ppb:sbkBetLeg:1176090450/2",
    type: "SS",
    result: null,
    parts: [
      {
        price: {
          decimal: 1.75,
          fractional: {
            numerator: 3,
            denominator: 4,
          },
        },
        priceType: "LIVE",
        marketBetUrn: "ppb:marketBet:924.237747666",
        eventDescription: "FC Porto vs Marco 09",
        eventMarketDescription: "Match Odds",
        selectionName: "FC Porto",
        startTime: "2020-07-27T19:00:00",
      },
    ],
  },
];

const FIRST_LEG_CARD_GROUP_ID = {
  __typename: "SportsbookBetLegCardGroup",
  urn: "ppb:tbd:cardgroup:sbkBetLeg:926228962/0",
};

const SECOND_LEG_CARD_GROUP_ID = {
  __typename: "SportsbookBetLegCardGroup",
  urn: "ppb:tbd:cardgroup:sbkBetLeg:926228962/1",
};

const BET_LEG_CARD_FIRST_ID = {
  __typename: "BetLegCard",
  urn: "ppb:tbd:card:sbkBetLeg:926228962/0",
};

const BET_LEG_CARD_FIRST = {
  ...BET_LEG_CARD_FIRST_ID,
  betUrn: "ppb:sbkBet:926228962",
  leg: BET_LEGS[0],
};

const BET_LEG_CARD_SECOND_ID = {
  __typename: "BetLegCard",
  urn: "ppb:tbd:card:sbkBetLeg:926228962/2",
};

const BET_LEG_CARD_SECOND = {
  ...BET_LEG_CARD_SECOND_ID,
  betUrn: "ppb:sbkBet:926228962",
  leg: BET_LEGS[1],
};

/* FIXTURE CARDS Mocks */
const FIRST_FIXTURE_ID = {
  __typename: "FixtureCard",
  urn: "ppb:tbd:card:fixture:2022801|viewLink|0",
};

const FIRST_FIXTURE = {
  ...FIRST_FIXTURE_ID,
  sportevent: { urn: "ppb:event:2022801", name: "Spezia v Entella" },
  scheduledAt: "2020-07-27T19:00:00Z",
  fixtureEventViewLink: {
    viewUrn: "ppb:tbd:view:event:2022801",
    viewUrl: "football/argentinian-reserves/ca-lanus-v-ca-union-santa-fe/e-30744688",
  },
  fixture: {
    __typename: "FootballFixture",
    urn: "ppb:fixture:2022801",
    home: { name: "Spezia" },
    away: { name: "Entella" },
  },
};

const SECOND_FIXTURE_ID = {
  __typename: "FixtureCard",
  urn: "ppb:tbd:card:fixture:2022802|viewLink|0",
};

const SECOND_FIXTURE = {
  ...SECOND_FIXTURE_ID,
  sportevent: { urn: "ppb:event:2022802", name: "FC Porto v Marco 09" },
  scheduledAt: "2020-07-27T19:00:00Z",
  fixtureEventViewLink: {
    viewUrn: "ppb:tbd:view:event:2022802",
    viewUrl: "football/argentinian-reserves/ca-lanus-v-ca-union-santa-fe/e-30744689",
  },
  fixture: {
    __typename: "FootballFixture",
    urn: "ppb:fixture:2022802",
    home: { name: "FC Porto" },
    away: { name: "Marco 09" },
  },
};

/* MULTIPLE BET Mocks */
const SBK_MULTIPLE_CARD_ID = { __typename: "SportsbookBetCard", urn: "ppb:tbd:card:sbkBet:926228962" };

const SBK_MULTIPLE_CARD = {
  ...SBK_MULTIPLE_CARD_ID,
  navigationLinks: [
    {
      marketBetUrn: "ppb:marketBet:924.926228962",
    },
  ],

  bet: {
    urn: "ppb:sbkBet:926228962",
    betReceiptId: "O/4275336/0021303",
    id: "926228962",
    profitAndLoss: 0.24,
    betType: "DBL",
    currentSize: 0.12,
    result: "CASHED_OUT",
    numLines: 1,
    betPrice: {
      decimal: 2,
      fractional: {
        numerator: 3,
        denominator: 1,
      },
    },
    legs: [BET_LEGS[0], BET_LEGS[1]],
    bonus: 1,
    edges: [{ reason: "ACCA_INSURANCE", status: "ACTIVE" }],
  },
};

const BET_EXPANDABLE_TWO_LEGS_ID = {
  __typename: "SportsbookExpandableLegCardGroup",
  urn: "ppb:tbd:cardgroup:sbkExpandableLeg:926228962",
};

const BET_EXPANDABLE_TWO_LEGS = {
  ...BET_EXPANDABLE_TWO_LEGS_ID,
  full: {
    edges: [
      {
        node: {
          ...FIRST_LEG_CARD_GROUP_ID,
          full: {
            edges: [{ node: BET_LEG_CARD_FIRST }, { node: FIRST_FIXTURE }],
          },
          partials: {
            partialEdges: [{ node: BET_LEG_CARD_FIRST_ID }, { node: FIRST_FIXTURE_ID }],
          },
        },
      },
      {
        node: {
          ...SECOND_LEG_CARD_GROUP_ID,
          full: {
            edges: [{ node: BET_LEG_CARD_SECOND }, { node: SECOND_FIXTURE }],
          },
          partials: {
            partialEdges: [{ node: BET_LEG_CARD_SECOND_ID }, { node: SECOND_FIXTURE_ID }],
          },
        },
      },
      {
        node: {
          __typename: "SportsbookBetInfoCard",
          urn: "ppb:tbd:card:sbkBetInfo:1179447017",
          betReceiptId: "O/4275336/0021303",
        },
      },
    ],
  },
  partials: {
    partialEdges: [
      { node: FIRST_LEG_CARD_GROUP_ID },
      { node: SECOND_LEG_CARD_GROUP_ID },
      {
        node: {
          __typename: "SportsbookBetInfoCard",
          urn: "ppb:tbd:card:sbkBetInfo:1179447017",
        },
      },
    ],
  },
};

const SBK_MULTIPLE_CARD_GROUP = {
  __typename: "BetCardGroup",
  urn: "ppb:tbd:card:bet:group:926228962|sbk",
  full: {
    edges: [{ node: SBK_MULTIPLE_CARD }, { node: BET_EXPANDABLE_TWO_LEGS }],
  },
  partials: {
    partialEdges: [{ node: SBK_MULTIPLE_CARD_ID }, { node: BET_EXPANDABLE_TWO_LEGS_ID }],
  },
};

/* BFF MY BETS Mock */
const BFF_MY_BETS_MULTIPLE_MOCK = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:open",
  url: "mybets/myBets-open",
  edges: [{ node: SBK_MULTIPLE_CARD_GROUP }],
  headerItems: HEADER_ITEMS_MOCK,
};

describe("My Bets Page - SBK Multiples Card", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
  });

  describe("when the user opens the my bets page and has a multiple sbk card", () => {
    beforeAll(async () => {
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MY_BETS_MOCK.urn, { products: ["sportsbook"] }));
      await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK));
      await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getScaResponse({}));

      await browser.url(routes.getMyBetsViewUrl("open"));
      await browser.waitUntilInViewport(cardPO.element);
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1460]_should_see_my_bets_page_with_the_multiples_card_accordion_button_collapsed`,
      );
    });

    it("[PRPI-1460]_should_see_my_bets_page_with_the_multiples_card_accordion_button_collapsed", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1460]_should_see_my_bets_page_with_the_multiples_card_accordion_button_collapsed`,
        ),
      ).toBe(0);
    });

    describe("And the user clicks on the card to expand", () => {
      beforeAll(async () => {
        await cardPO.header.scrollIntoView({ block: "start" });
        await browser.waitUntilInViewport(cardPO.header);
        await cardPO.header.click();
        await browser.waitUntilDisplayed(cardPO.content);
        await firstSbkBetPanelPO.element.scrollIntoView({ block: "start" });
        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1461]_should_see_my_bets_page_with_the_multiples_card_accordion_button_expanded_and_each_leg_info_for_each_bet`,
        );
      });

      it("[PRPI-1461]_should_see_my_bets_page_with_the_multiples_card_accordion_button_expanded_and_each_leg_info_for_each_bet", async () => {
        expect(
          await browser.checkScreen(
            `${MODULE_NAME}_[PRPI-1461]_should_see_my_bets_page_with_the_multiples_card_accordion_button_expanded_and_each_leg_info_for_each_bet`,
          ),
        ).toBeLessThanOrEqual(0.001);
      });
    });
  });

  describe("When the user opens My Bets page with one multiple bet with Acca Insurance", () => {
    beforeAll(async () => {
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_MY_BETS_MULTIPLE_MOCK.urn, { products: ["sportsbook"] }),
      );
      await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MULTIPLE_MOCK));
      await mockService.mockHttpRequest(getScaResponse({}));

      await browser.url(routes.getMyBetsViewUrl("open"));
      await browser.waitUntilInViewport(cardPO.element);
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1462]_the_multiple_bet_card_group_should_be_displayed_with_acca_insurance_signpost`,
      );
    });

    it("[PRPI-1462]_the_multiple_bet_card_group_should_be_displayed_with_acca_insurance_signpost", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1462]_the_multiple_bet_card_group_should_be_displayed_with_acca_insurance_signpost`,
        ),
      ).toBe(0);
    });

    describe("and then clicks on card", () => {
      beforeAll(async () => {
        await browser.waitUntilInViewport(cardPO.header);
        await cardPO.header.click();
        await browser.waitUntilDisplayed(cardPO.content);
        await browser.waitUntilDisplayed(firstEventFirstBetSelectionDetailsPO.element);
        await firstEventFirstBetSelectionDetailsPO.element.scrollIntoView({ block: "start" });

        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1463]_the_bet_legs_information_and_the_scoreboards_should_be_displayed`,
        );
      });

      it("[PRPI-1463]_the_bet_legs_information_and_the_scoreboards_should_be_displayed", async () => {
        expect(
          await browser.checkScreen(
            `${MODULE_NAME}_[PRPI-1463]_the_bet_legs_information_and_the_scoreboards_should_be_displayed`,
          ),
        ).toBeLessThanOrEqual(0.001);
      });
    });
  });
});
