const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");

const SportsbookExpandableLegCardGroupPO = require("@ppb/tbd-shared/components/SportsbookExpandableLegCardGroup/SportsbookExpandableLegCardGroup.web.po");
const SportsbookBetLegCardGroupPO = require("@ppb/tbd-shared/components/SportsbookBetLegCardGroup/SportsbookBetLegCardGroup.web.po");
const {
  MyBetsPagePO,
  SportsbookBetPanelPO,
  CardPO,
  MyBetsHeaderPO,
  BetSelectionDetailsPO,
  BetInfoItemPO,
} = require("../../../../page-objects");

const MockService = require("../../../../mock-essentials/mocking-service");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");

const routes = require("../../../../../utils/routes");
const { HEADER_ITEMS_MOCK, GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsPagePO = new MyBetsPagePO();
const firstSbkBetPanelSO = new SportsbookBetPanelPO(myBetsPagePO.betCardGroups[0]);
const myBetsHeaderPO = new MyBetsHeaderPO(myBetsPagePO.header);
const cardPO = new CardPO();

const sportsbookExpandableLegCardGroupPO = new SportsbookExpandableLegCardGroupPO();
const firstSportsbookBetLegCardGroupPO = new SportsbookBetLegCardGroupPO(sportsbookExpandableLegCardGroupPO.cards[0]);
const firstEventFirstBetSelectionDetailsPO = new BetSelectionDetailsPO(firstSportsbookBetLegCardGroupPO.cards[0]);
const betInfoPO = new BetInfoItemPO();

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
        eventMarketDescription: "Full Time Result - 2 Up",
        marketType: "FULL_TIME_RESULT_-_2_UP",
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
        eventMarketDescription: "Full Time Result - 2 Up",
        marketType: "FULL_TIME_RESULT_-_2_UP",
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

const BET_INFO_ID = {
  __typename: "SportsbookBetInfoCard",
  urn: "ppb:tbd:card:sbkBetInfo:1179447017",
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
          ...BET_INFO_ID,
          betReceiptId: "O/4275336/0021303",
        },
      },
    ],
  },
  partials: {
    partialEdges: [{ node: FIRST_LEG_CARD_GROUP_ID }, { node: SECOND_LEG_CARD_GROUP_ID }, { node: BET_INFO_ID }],
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
  pageInfo: {
    hasNextPage: "true",
    endCursor: "NA==",
  },
  headerItems: HEADER_ITEMS_MOCK,
};

const CARD_NAME = "my_bets_page";

describe("My Bets Page - Selection type icon", () => {
  describe("When the user opens My Bets page with one multiple bet with selection type icon", () => {
    beforeAll(async () => {
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_MY_BETS_MULTIPLE_MOCK.urn, {
          products: ["sportsbook"],
          brandSettings: {
            SHOW_SELECTION_TYPE_ICON: true,
          },
        }),
      );

      await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MULTIPLE_MOCK));
      await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
      await mockService.mockHttpRequest(getScaResponse({}));

      await browser.url(routes.getHomeViewUrl());

      await browser.waitUntilDisplayed(myBetsHeaderPO.element, "My bets screen title is not displayed");
      await browser.waitUntilDisplayed(firstSbkBetPanelSO.element);
    });

    describe("and then clicks on card", () => {
      beforeAll(async () => {
        await cardPO.element.waitForClickable();
        await cardPO.element.click();
        await browser.flushFakeClockTimers();

        await browser.waitUntilDisplayed(cardPO.content, "The card button is not expanded");
        await browser.waitUntilDisplayed(firstEventFirstBetSelectionDetailsPO.element);

        await browser.waitUntilStopsMoving(firstSportsbookBetLegCardGroupPO.element);

        await firstSportsbookBetLegCardGroupPO.element.scrollIntoView({ block: "start" });

        await browser.waitUntilStopsMoving(betInfoPO.element);

        await browser.waitUntilImageEquals(
          `${CARD_NAME}_[PRPI-1469]_the_bet_legs_information_and_the_selection_type_icon_should_be_displayed`,
        );
      });

      it("[PRPI-1469]_the_bet_legs_information_and_the_selection_type_icon_should_be_displayed", async () => {
        expect(
          await browser.checkScreen(
            `${CARD_NAME}_[PRPI-1469]_the_bet_legs_information_and_the_selection_type_icon_should_be_displayed`,
          ),
        ).toBe(0);
      });
    });
  });
});
