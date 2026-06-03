const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const { getMyBetsLayout, getGenericLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");

const { SharePO, SportsbookBetPanelPO, BottomSheetPO, SupportingContentButtonPO } = require("../../../../page-objects");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const routes = require("../../../../../utils/routes");
const MockService = require("../../../../mock-essentials/mocking-service");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const MODULE_NAME = "my_bets_sbk";
const mockService = new MockService();

const sportsbookBetPanelPO = new SportsbookBetPanelPO();
const shareButtonPO = new SupportingContentButtonPO(sportsbookBetPanelPO.buttons[0]);
const sharePO = new SharePO();
const bottomSheetPO = new BottomSheetPO();

const buildPrice = (price) => ({
  decimal: price,
  fractional: {
    numerator: price * 100,
    denominator: 100,
  },
});

const EVENT_ID = "32953253";
const BET_ID = "2206169987";

const LEG_PARTS_1 = [
  {
    eventUrn: `ppb:event:${EVENT_ID}`,
    sportId: "1",
    price: buildPrice(2.6),
    originalPrice: buildPrice(2.6),
    eventDescription: "Newcastle v Brighton",
    eventMarketDescription: "Match Odds 90",
    marketType: "MATCH_ODDS_90",
    selectionName: "Brighton",
  },
];

const LEG_PARTS_2 = [
  {
    eventUrn: `ppb:event:${EVENT_ID}`,
    sportId: "1",
    price: buildPrice(10.0),
    originalPrice: buildPrice(10.0),
    eventDescription: "Newcastle v Brighton",
    eventMarketDescription: "Match Odds",
    marketType: "MATCH_ODDS",
    selectionName: "Brighton",
    competitionName: "Premier League",
  },
];

const SBK_BET_LEG_DATA_1 = {
  result: "LOST",
  parts: LEG_PARTS_1,
};

const SBK_BET_LEG_DATA_2 = {
  result: "LOST",
  parts: LEG_PARTS_2,
};

const SBK_BET_LEGS = [SBK_BET_LEG_DATA_1, SBK_BET_LEG_DATA_2];

const BET = {
  betId: BET_ID,
  betType: "SGL",
  product: "SPORTSBOOK",
  betSharingViewLink: {
    viewUrn: `ppb:tbd:view:generic:betSharing:${BET_ID}`,
  },
  legs: SBK_BET_LEGS,
  edges: {
    legCardGroups: [
      {
        footballFixture: {
          eventId: EVENT_ID,
        },
        legs: SBK_BET_LEGS,
      },
    ],
  },
};

const MY_BETS_VIEW_MOCK = getMyBetsSBKViewMock([BET], {
  hasBottomBar: true,
});

const BET_SHARING_GENERIC_VIEW_MOCK = {
  __typename: "GenericView",
  urn: `ppb:tbd:view:generic:betSharing:${BET_ID}`,
  url: `view/d-${BET_ID}`,
  category: "MODAL",
  viewHeader: {
    title: null,
  },
  edges: [
    {
      node: {
        __typename: "BetSharingCardGroup",
        urn: `ppb:tbd:cardgroup:betSharing:${BET_ID}`,
        bet: MY_BETS_VIEW_MOCK.edges[0].node.full.edges[0].node.bet,
        full: MY_BETS_VIEW_MOCK.edges[0].node.full.edges[1].node.full,
        partials: MY_BETS_VIEW_MOCK.edges[0].node.full.edges[1].node.partials,
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "BetSharingCardGroup",
        urn: `ppb:tbd:cardgroup:betSharing:${BET_ID}`,
      },
    },
  ],
};

const SCA_SETTLED_MOCK = {
  fixture: [
    {
      eventId: EVENT_ID,
      scheduledAt: "2023-07-14T13:00:00Z",
      score: {
        home: 4,
        away: 2,
      },
      duration: {
        period: "REGULAR",
        status: "END",
        stoppageMinutes: null,
        clock: {
          minute: 90,
          second: 59,
        },
      },
      penaltyShootout: null,
      stats: [
        {
          period: "REGULAR",
          periodStatus: "FULL",
          home: {
            goals: 4,
          },
          away: {
            goals: 2,
          },
        },
      ],
    },
  ],
};

describe("My bets - Share Bet", () => {
  describe("When a bet has the Share button available", () => {
    beforeAll(async () => {
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(
        await getIndexHTML(MY_BETS_VIEW_MOCK.urn, {
          products: ["sportsbook"],
          MY_BETS_WIN_LOSE_VOID: { isActive: true },
        }),
      );
      await mockService.mockHttpRequest(getMyBetsLayout(MY_BETS_VIEW_MOCK));
      await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
      await mockService.mockHttpRequest(getGenericLayout(BET_SHARING_GENERIC_VIEW_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_SETTLED_MOCK));

      await browser.url(routes.getMyBetsViewUrl("settled"));
    });

    describe("And the user presses the Share button", () => {
      beforeAll(async () => {
        await shareButtonPO.element.waitForClickable();
        await shareButtonPO.element.click();

        await browser.waitUntilDisplayed(sharePO.element, "Share element not displayed");
        await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1470]_sharing_component_with_multiple_legs`);
      });

      it("[PRPI-1470]_sharing_component_with_multiple_legs", async () => {
        expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1470]_sharing_component_with_multiple_legs`)).toBe(0);
      });

      describe("And when the user presses the Close button", () => {
        beforeAll(async () => {
          await bottomSheetPO.closeButton.click();
          await browser.waitUntilNotDisplayed(sharePO.element, "Share element still displayed");
        });

        it("[PRPI-1637] the Share module should no longer be visible", async () => {
          expect(await sharePO.element.isDisplayed()).toEqual(false);
        });
      });
    });
  });
});
