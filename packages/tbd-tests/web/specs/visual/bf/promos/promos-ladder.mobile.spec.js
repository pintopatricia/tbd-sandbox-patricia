const { SportPagePO } = require("../../../../page-objects");

const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();

const SPORT_ID = 1;
const sportPagePO = new SportPagePO();

const SHORT_TITLE = "MY HEART";
const LONG_SUBTITLE = "He deals the cards to find the answer";
const SHORT_SUMMARY = "The hidden law of a probable outcome";
const LONG_TERMS = "Terms and Conditions and more. Just click here now and deal with it";

const LADDER_LEVEL_1 = [
  {
    fulfilled: false,
    levels: {
      current: 0,
      target: 10,
    },
  },
  {
    fulfilled: false,
    levels: {
      current: 0,
      target: 20,
    },
  },
  {
    fulfilled: false,
    levels: {
      current: 0,
      target: 30,
    },
  },
];

const LADDER_LEVEL_1_50_PERCENT = [
  {
    fulfilled: false,
    levels: {
      current: 5,
      target: 10,
    },
  },
  {
    fulfilled: false,
    levels: {
      current: 5,
      target: 20,
    },
  },
  {
    fulfilled: false,
    levels: {
      current: 5,
      target: 30,
    },
  },
];

const LADDER_LEVEL_1_FULFILLED = [
  {
    fulfilled: true,
    levels: {
      current: 10,
      target: 10,
    },
  },
  {
    fulfilled: false,
    levels: {
      current: 10,
      target: 20,
    },
  },
  {
    fulfilled: false,
    levels: {
      current: 10,
      target: 30,
    },
  },
];

const LADDER_LEVEL_2_FULFILLED = [
  {
    fulfilled: true,
    levels: {
      current: 10,
      target: 10,
    },
  },
  {
    fulfilled: true,
    levels: {
      current: 20,
      target: 20,
    },
  },
  {
    fulfilled: false,
    levels: {
      current: 20,
      target: 30,
    },
  },
];

const LADDER_LEVEL_3_FULFILLED = [
  {
    fulfilled: true,
    levels: {
      current: 10,
      target: 10,
    },
  },
  {
    fulfilled: true,
    levels: {
      current: 20,
      target: 20,
    },
  },
  {
    fulfilled: true,
    levels: {
      current: 30,
      target: 30,
    },
  },
];

const BET_OPPORTUNITY_PROMO_CARD_WITH_LADDER = {
  __typename: "BetOpportunityPromoCard",
  urn: "ppb:tbd:card:betOpportunityPromo:pph/B10G10ASCOTSTAT",
  theme: "DARK",
  title: SHORT_TITLE,
  subTitle: LONG_SUBTITLE,
  promoImage: {
    url: "https://pma-s3.betfair.com/cpp/bf/2023/6/9/mockedImage.jpg",
    __typename: "PromoImage",
  },
  ladderLevels: LADDER_LEVEL_1,
  betOpportunityAction: {
    link: {
      label: {
        __typename: "DisplayNameTitle",
        name: "Show More",
      },
      viewLink: {
        viewUrn: "ppb:tbd:view:external:external",
        viewUrl: "https://www.betfair.com/betting/",
        viewDisplayMode: "BLANK_INAPP",
      },
    },
  },
  termsAndConditions: {
    summary: SHORT_SUMMARY,
    link: {
      label: {
        __typename: "DisplayNameTitle",
        name: LONG_TERMS,
      },
      viewLink: {
        viewUrn: "ppb:tbd:view:external:external",
        viewUrl: "https://www.betfair.com/betting/",
        viewDisplayMode: "BLANK_INAPP",
      },
    },
  },
};

const BFF_SPORT_PAGE_MOCK_LADDER = {
  urn: `ppb:tbd:view:sport:${SPORT_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: `ppb:tbd:cardgroup:swimlane:X42sdBAAACEACzD1/s/${SPORT_ID}`,
        full: {
          edges: [
            {
              node: BET_OPPORTUNITY_PROMO_CARD_WITH_LADDER,
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "BetOpportunityPromoCard",
                urn: "ppb:tbd:card:betOpportunityPromo:pph/B10G10ASCOTSTAT",
                ladderLevels: LADDER_LEVEL_1,
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
        urn: `ppb:tbd:cardgroup:swimlane:X42sdBAAACEACzD1/s/${SPORT_ID}`,
      },
    },
  ],
};

const MODULE_NAME = "promos-ladder";

describe("Promotions with Ladder Levels", () => {
  beforeAll(async () => {
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(await getIndexHTML(BFF_SPORT_PAGE_MOCK_LADDER.urn));
    await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_MOCK_LADDER));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(`${routes.getSportViewUrl(SPORT_ID)}`);
    await browser.waitUntilDisplayed(sportPagePO.element);
    await browser.waitUntilImageEquals(
      `${MODULE_NAME}_[PRPI-10834]_should_display_bet_opportunity_promo_card_with_ladder_levels`,
    );
  });

  it("[PRPI-10834]_should_display_bet_opportunity_promo_card_with_ladder_levels", async () => {
    expect(
      await browser.checkScreen(
        `${MODULE_NAME}_[PRPI-10834]_should_display_bet_opportunity_promo_card_with_ladder_levels`,
      ),
    ).toEqual(0);
  });

  describe("Viewing the first level with 50% progress", () => {
    beforeAll(async () => {
      BET_OPPORTUNITY_PROMO_CARD_WITH_LADDER.ladderLevels = LADDER_LEVEL_1_50_PERCENT;
      BFF_SPORT_PAGE_MOCK_LADDER.edges[0].node.full.edges[0].node.ladderLevels = LADDER_LEVEL_1_50_PERCENT;
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(await getIndexHTML(BFF_SPORT_PAGE_MOCK_LADDER.urn));
      await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_MOCK_LADDER));
      await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
      await browser.url(`${routes.getSportViewUrl(SPORT_ID)}`);
      await browser.waitUntilDisplayed(sportPagePO.element);
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-10835]_should_show_three_levels_with_first_in_progress`);
    });

    it("[PRPI-10835]_should_show_three_levels_with_first_in_progress", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-10835]_should_show_three_levels_with_first_in_progress`),
      ).toEqual(0);
    });

    describe("Viewing the first level fulfilled", () => {
      beforeAll(async () => {
        BET_OPPORTUNITY_PROMO_CARD_WITH_LADDER.ladderLevels = LADDER_LEVEL_1_FULFILLED;
        BFF_SPORT_PAGE_MOCK_LADDER.edges[0].node.full.edges[0].node.ladderLevels = LADDER_LEVEL_1_FULFILLED;
        await mockService.mockFonts(getMockFonts());
        await mockService.mockHttpRequest(await getIndexHTML(BFF_SPORT_PAGE_MOCK_LADDER.urn));
        await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_MOCK_LADDER));
        await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
        await browser.url(`${routes.getSportViewUrl(SPORT_ID)}`);
        await browser.waitUntilDisplayed(sportPagePO.element);
        await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-10836]_should_show_three_levels_with_first_fulfilled`);
      });

      it("[PRPI-10836]_should_show_three_levels_with_first_fulfilled", async () => {
        expect(
          await browser.checkScreen(`${MODULE_NAME}_[PRPI-10836]_should_show_three_levels_with_first_fulfilled`),
        ).toEqual(0);
      });

      describe("Viewing the second level fulfilled", () => {
        beforeAll(async () => {
          BET_OPPORTUNITY_PROMO_CARD_WITH_LADDER.ladderLevels = LADDER_LEVEL_2_FULFILLED;
          BFF_SPORT_PAGE_MOCK_LADDER.edges[0].node.full.edges[0].node.ladderLevels = LADDER_LEVEL_2_FULFILLED;
          await mockService.mockFonts(getMockFonts());
          await mockService.mockHttpRequest(await getIndexHTML(BFF_SPORT_PAGE_MOCK_LADDER.urn));
          await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_MOCK_LADDER));
          await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
          await browser.url(`${routes.getSportViewUrl(SPORT_ID)}`);
          await browser.waitUntilDisplayed(sportPagePO.element);
          await browser.waitUntilImageEquals(
            `${MODULE_NAME}_[PRPI-10837]_should_show_three_levels_with_second_fulfilled`,
          );
        });

        it("[PRPI-10837]_should_show_three_levels_with_second_fulfilled", async () => {
          expect(
            await browser.checkScreen(`${MODULE_NAME}_[PRPI-10837]_should_show_three_levels_with_second_fulfilled`),
          ).toEqual(0);
        });

        describe("Viewing the ladder stages are scrolled to the last level and verify that it is fulfilled", () => {
          beforeAll(async () => {
            BET_OPPORTUNITY_PROMO_CARD_WITH_LADDER.ladderLevels = LADDER_LEVEL_3_FULFILLED;
            BFF_SPORT_PAGE_MOCK_LADDER.edges[0].node.full.edges[0].node.ladderLevels = LADDER_LEVEL_3_FULFILLED;
            await mockService.mockFonts(getMockFonts());
            await mockService.mockHttpRequest(await getIndexHTML(BFF_SPORT_PAGE_MOCK_LADDER.urn));
            await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_MOCK_LADDER));
            await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
            await browser.url(`${routes.getSportViewUrl(SPORT_ID)}`);
            await browser.waitUntilDisplayed(sportPagePO.element);
            await browser.waitUntilImageEquals(
              `${MODULE_NAME}_[PRPI-10838]_should_show_three_levels_with_final_fulfilled_and_scrolled_to_end`,
            );
          });

          it("[PRPI-10838]_should_show_three_levels_with_final_fulfilled_and_scrolled_to_end", async () => {
            expect(
              await browser.checkScreen(
                `${MODULE_NAME}_[PRPI-10838]_should_show_three_levels_with_final_fulfilled_and_scrolled_to_end`,
              ),
            ).toEqual(0);
          });
        });
      });
    });
  });
});
