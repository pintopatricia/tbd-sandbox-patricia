const { SportPagePO, ScrollableSwimlanePO, PromoCardPO } = require("../../../../page-objects");

const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();

const SPORT_ID = 1;

const sportPagePO = new SportPagePO();
const promoFirstSwimlanePO = new ScrollableSwimlanePO(sportPagePO.scrollableSwimlanes[0]);
const promoSecondSwimlanePO = new ScrollableSwimlanePO(sportPagePO.scrollableSwimlanes[1]);
const promoFirstSwimlaneSecondCard = new PromoCardPO(promoFirstSwimlanePO.scrollItems[1]);
const promoSecondSwimlaneSecondCard = new PromoCardPO(promoSecondSwimlanePO.scrollItems[1]);

const SHORT_TITLE = "MY HEART";
const MEDIUM_TITLE = "HE DEALS THE CARDS AS A MEDITATION";
const LONG_TITLE =
  "I KNOW THAT THE SPADES ARE THE SWORDS OF A SOLDIER, I KNOW THAT THE CLUBS ARE WEAPONS OF WAR, I KNOW THAT DIAMONDS MEAN MONEY FOR THIS ART";

const SHORT_SUBTITLE = "Shape of my Heart";
const LONG_SUBTITLE = "He deals the cards to find the answer";

const SHORT_SUMMARY = "The hidden law of a probable outcome";
const LONG_SUMMARY =
  "He may play the jack of diamonds, he may lay the queen of spades, he may conceal a king in his hand, while the memory of it fades";

const SHORT_TERMS = "Terms and Conditions";
const LONG_TERMS = "Terms and Conditions and more. Just click here now and deal with it";

const BET_OPPORTUNITY_PROMO_CARD_1 = {
  __typename: "BetOpportunityPromoCard",
  urn: "ppb:tbd:card:betOpportunityPromo:pph/B10G10ASCOTSTAT",
  theme: "LIGHT",
  title: SHORT_TITLE,
  subTitle: LONG_SUBTITLE,
  promoImage: {
    url: "https://pma-s3.betfair.com/cpp/bf/2023/6/9/mockedImage.jpg",
  },
  ladderLevels: null,
  betOpportunityAction: {
    link: {
      label: {
        __typename: "DisplayNameTitle",
        name: "Show More",
      },
      viewLink: {
        viewUrn: "ppb:tbd:view:external:external",
        viewUrl: "https://www.betfair.com/betting/",
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
      },
    },
  },
};

const BET_OPPORTUNITY_PROMO_CARD_2 = {
  __typename: "BetOpportunityPromoCard",
  urn: "ppb:tbd:card:betOpportunityPromo:pph/B10G10ASCOTSTAT2",
  title: LONG_TITLE,
  subTitle: SHORT_SUBTITLE,
  theme: "DARK",
  promoImage: {
    url: "https://pma-s3.betfair.com/cpp/bf/2023/6/9/mockedImage.jpg",
  },
  ladderLevels: null,
  betOpportunityAction: {
    link: {
      label: { translationKey: "I18N.PROMO.OPTIN" },
      viewLink: {
        viewUrn: "ppb:tbd:view:external:external",
        viewUrl: "https://www.betfair.com/betting/",
      },
    },
  },
  termsAndConditions: {
    summary: LONG_SUMMARY,
    link: {
      label: {
        __typename: "DisplayNameTitle",
        name: SHORT_TERMS,
      },
      viewLink: {
        viewUrn: "ppb:tbd:view:external:external",
        viewUrl: "https://www.betfair.com/betting/",
      },
    },
  },
};

const MARKET_ID = "924.266233830";
const SELECTION_ID = "39879518";
const PROMO_ODDSBOOST_MARKET = {
  __typename: "SportsbookMarket",
  urn: `ppb:sbkMarket:${MARKET_ID}`,
  promotionName: "Daily Treble Boost",
  marketType: "COMMERCIAL_ODDSBOOST",
  hierarchy: {
    __typename: "EventCompetitionHierarchy",
    competition: {
      urn: "ppb:competition:2608550",
      name: "Specials",
      competitionId: 2608550,
    },
    sportevent: {
      urn: "ppb:event:26896160",
      name: "OddsBoost",
    },
  },
  runners: [
    {
      runnerURN: `ppb:sbkRunner:${MARKET_ID}/${SELECTION_ID}`,
      name: "Ciro Immobile, Lorenzo Insigne and Breel Embolo to have 1 or more shots on target each",
      selectionId: SELECTION_ID,
    },
  ],

  isOddsboostMarketType: true,
  liveData: {
    __typename: "SportsbookMarketLiveData",
    urn: `ppb:sbkMarket:${MARKET_ID}`,
    sportsbookMarketStatus: "OPEN",
    bspMarket: false,
    runners: [
      {
        urn: `ppb:tbd:sbkRunnerLiveData:${MARKET_ID}/${SELECTION_ID}`,
        runnerURN: `ppb:sbkRunner:${MARKET_ID}/${SELECTION_ID}`,
        runnerStatus: "ACTIVE",
        odds: {
          decimal: 1.3,
          fractional: {
            numerator: 11,
            denominator: 4,
            __typename: "FractionalOdds",
          },
          __typename: "SportsbookOdds",
        },
        displayOdds: {
          decimal: 1.3,
          fractional: {
            numerator: 11,
            denominator: 4,
            __typename: "FractionalOdds",
          },
          __typename: "SportsbookOdds",
        },
        previousOdds: [
          {
            odds: {
              decimal: 1.2,
              fractional: {
                numerator: 11,
                denominator: 4,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 1.2,
              fractional: {
                numerator: 11,
                denominator: 4,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
          },
        ],

        __typename: "SportsbookRunnerLiveData",
      },
    ],
  },
};

const SELECTION_PROMO_CARD = {
  __typename: "SelectionPromoCard",
  urn: "ppb:tbd:card:selectionPromo:pph/B10G10ASCOTSTAT3",
  title: MEDIUM_TITLE,
  subTitle: SHORT_SUBTITLE,
  theme: "DARK",
  termsAndConditions: {
    summary: SHORT_SUMMARY,
    link: {
      label: {
        __typename: "DisplayNameTitle",
        name: SHORT_TERMS,
      },
      viewLink: {
        viewUrn: "ppb:tbd:view:external:external",
        viewUrl: "https://www.betfair.com/betting/",
      },
    },
  },
  promoTag: {
    iconTag: "BOOST",
  },
  cta: {
    market: PROMO_ODDSBOOST_MARKET,
    runner: {
      runnerURN: `ppb:sbkRunner:${MARKET_ID}/${SELECTION_ID}`,
    },
    displayPreviousOdd: true,
  },
};

const EDITORIAL_PROMO_CARD = {
  __typename: "EditorialPromoCard",
  urn: "ppb:tbd:card:editorialPromo:pph/B10G10ASCOTSTAT3",
  title: MEDIUM_TITLE,
  subTitle: SHORT_SUBTITLE,
  theme: "LIGHT",
  promoImage: {
    url: "https://pma-s3.betfair.com/cpp/bf/2023/6/9/mockedImage.jpg",
  },
  promoTag: {
    label: "Promotion Tag",
  },
};

const EDITORIAL_PROMO_CARD_2 = {
  __typename: "EditorialPromoCard",
  urn: "ppb:tbd:card:editorialPromo:pph/B10G10ASCOTSTAT4",
  title: MEDIUM_TITLE,
  subTitle: SHORT_SUBTITLE,
  theme: "LIGHT",
  promoImage: {
    url: "https://pma-s3.betfair.com/cpp/bf/2023/6/9/mockedImage.jpg",
  },
  promoTag: {
    label: "RACINGPOST",
  },
};

const BFF_SPORT_PAGE_MOCK_1_CARD = {
  urn: `ppb:tbd:view:sport:${SPORT_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: `ppb:tbd:cardgroup:swimlane:X42sdBAAACEACzD1/s/${SPORT_ID}`,
        full: {
          edges: [
            {
              node: BET_OPPORTUNITY_PROMO_CARD_1,
            },
            {
              node: SELECTION_PROMO_CARD,
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "BetOpportunityPromoCard",
                urn: "ppb:tbd:card:betOpportunityPromo:pph/B10G10ASCOTSTAT",
                ladderLevels: null,
              },
            },
            {
              node: {
                __typename: "SelectionPromoCard",
                urn: "ppb:tbd:card:selectionPromo:pph/B10G10ASCOTSTAT3",
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: `ppb:tbd:cardgroup:swimlane:X41sdBAAACEACzD1/s/${SPORT_ID}`,
        full: {
          edges: [
            {
              node: BET_OPPORTUNITY_PROMO_CARD_2,
            },
            {
              node: EDITORIAL_PROMO_CARD_2,
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "BetOpportunityPromoCard",
                urn: "ppb:tbd:card:betOpportunityPromo:pph/B10G10ASCOTSTAT2",
                ladderLevels: null,
              },
            },
            {
              node: {
                __typename: "EditorialPromoCard",
                urn: "ppb:tbd:card:editorialPromo:pph/B10G10ASCOTSTAT4",
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: `ppb:tbd:cardgroup:swimlane:X40sdBAAACEACzD1/s/${SPORT_ID}`,
        full: {
          edges: [
            {
              node: EDITORIAL_PROMO_CARD,
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "EditorialPromoCard",
                urn: "ppb:tbd:card:editorialPromo:pph/B10G10ASCOTSTAT3",
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
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: `ppb:tbd:cardgroup:swimlane:X41sdBAAACEACzD1/s/${SPORT_ID}`,
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: `ppb:tbd:cardgroup:swimlane:X40sdBAAACEACzD1/s/${SPORT_ID}`,
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: MARKET_ID,
      runnerDetails: [
        {
          selectionId: SELECTION_ID,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 1.2 },
            },
          ],
        },
      ],
    },
  ],
};

const MODULE_NAME = "promos";

describe("Promotions", () => {
  beforeAll(async () => {
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(await getIndexHTML(BFF_SPORT_PAGE_MOCK_1_CARD.urn));
    await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_MOCK_1_CARD));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(`${routes.getSportViewUrl(SPORT_ID)}`);
    await browser.waitUntilDisplayed(sportPagePO.element);
    await browser.waitUntilImageEquals(
      `${MODULE_NAME}_[PRPI-1517]_should_display_two_swimlanes_with_multiple_promo_cards_and_another_with_a_single_promo_card`,
    );
  });

  it("[PRPI-1517]_should_display_two_swimlanes_with_multiple_promo_cards_and_another_with_a_single_promo_card", async () => {
    expect(
      await browser.checkScreen(
        `${MODULE_NAME}_[PRPI-1517]_should_display_two_swimlanes_with_multiple_promo_cards_and_another_with_a_single_promo_card`,
      ),
    ).toEqual(0);
  });

  describe("When user swipes to last card on both swimlanes and is oddsboost promo and editorial with icon tag", () => {
    beforeAll(async () => {
      await promoFirstSwimlaneSecondCard.element.scrollIntoView();
      await promoSecondSwimlaneSecondCard.element.scrollIntoView();
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1518]_should_not_use_all_the_width_available_and_display_oddsboost_bet_button_and_editorial_icon_tag`,
      );
    });

    it("[PRPI-1518]_should_not_use_all_the_width_available_and_display_oddsboost_bet_button_and_editorial_icon_tag", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1518]_should_not_use_all_the_width_available_and_display_oddsboost_bet_button_and_editorial_icon_tag`,
        ),
      ).toEqual(0);
    });
  });
});
