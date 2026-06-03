const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { CardPO, SupportingContentButtonPO } = require("../../../../page-objects");
const StatsSupportingContentButtonsCardGroupPO = require("@ppb/tbd-shared/components/StatsSupportingContentButtonsCardGroup/view/StatsSupportingContentButtonsCardGroup.po");
const SportsbookExpandableLegCardGroupPO = require("@ppb/tbd-shared/components/SportsbookExpandableLegCardGroup/SportsbookExpandableLegCardGroup.web.po");

const routes = require("../../../../../utils/routes");
const MockService = require("../../../../mock-essentials/mocking-service");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const { HEADER_ITEMS_MOCK, GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const MODULE_NAME = "my_bets_sbk";
const mockService = new MockService();

const sportsbookExpandableLegCardGroupPO = new SportsbookExpandableLegCardGroupPO();
const collapsibleCard = new CardPO(sportsbookExpandableLegCardGroupPO.collapsibleCard);
const statsSupportingContentButtonsCardGroupPO = new StatsSupportingContentButtonsCardGroupPO();
const supportingContentButtons = statsSupportingContentButtonsCardGroupPO.buttons;
const racingResultsButtonPO = new SupportingContentButtonPO(supportingContentButtons[0]);

const BET_ID = 123;
const MEETING_ID = 567352;
const RACE_ID = 567352.1015;

const silkImageUrl = "http://example.test.com/mockedImage/image.png";

const SBK_BET_INFO_CARD_PARTIAL = {
  __typename: "SportsbookBetInfoCard",
  urn: "ppb:tbd:card:sbkBetInfo:1179447017",
};

const SBK_BET_LEG = {
  __typename: "BetLeg",
  urn: `ppb:sbkBetLeg:${BET_ID}/0`,
  leg: {
    type: "SS",
    result: "LOSING",
    resultType: "POTENTIAL",
    parts: [
      {
        price: {
          decimal: 1.86,
          fractional: {
            numerator: 43,
            denominator: 50,
          },
        },
        marketBetUrn: "ppb:marketBet:924.237747664",
        eventDescription: "AD Marco 09 v Vitória SC B",
        eventMarketDescription: "Match Odds",
        selectionName: "AD Marco 09",
        startTime: "2020-07-27T19:00:00.000Z",
        priceType: "LIVE",
      },
    ],
  },
};

const STATS_RACE_RESULTS_CARD = {
  displayName: {
    translationKey: "I18N.MYBETS_RESULTS_BUTTON",
    __typename: "DisplayNameTranslationKey",
  },
  node: {
    __typename: "StatsRaceResultsCard",
    urn: `ppb:tbd:stats:card:raceResults:${RACE_ID}`,
    runners: [
      {
        horse: {
          name: "SUPER SEIXAS",
          performance: {
            positionOfficial: 1,
            positionStatusCode: null,
          },
        },
        details: {
          saddleCloth: "7",
          silk: silkImageUrl,
        },
        isBetSelection: false,
      },
      {
        horse: {
          name: "CHICO GENIAL",
          performance: {
            positionOfficial: 2,
            positionStatusCode: null,
          },
        },
        details: {
          saddleCloth: "8",
        },
        isBetSelection: false,
      },
      {
        horse: {
          name: "RICARDO IS LATE",
          performance: {
            positionOfficial: 3,
            positionStatusCode: null,
          },
        },
        details: {
          saddleCloth: "9",
          silk: silkImageUrl,
        },
        isBetSelection: false,
      },
      {
        horse: {
          name: "LURDINHA'S SURPRISE",
          performance: {
            positionOfficial: 4,
            positionStatusCode: null,
          },
        },
        details: {
          saddleCloth: "4",
          silk: silkImageUrl,
        },
        isBetSelection: true,
      },
    ],
  },
  __typename: "StatsSupportingContentButtonsCardEdge",
};

const STATS_SUPPORTING_CONTENT_BUTTONS = {
  __typename: "StatsSupportingContentButtonsCardGroup",
  urn: "ppb:tbd:stats:cardgroup:supportingContentButtons:1|1|my-bets",
  full: {
    edges: [STATS_RACE_RESULTS_CARD],
    __typename: "StatsSupportingContentButtonsLayoutItemsConnection",
  },
  partials: {
    edges: [STATS_RACE_RESULTS_CARD],
    __typename: "StatsSupportingContentButtonsLayoutItemsConnection",
  },
};

const SBK_BET_CARDS_EXPANDABLE_PARTIAL_MOCK = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: `ppb:tbd:card:group:sbkExpandableLeg:${BET_ID}`,
  },
};

const SBK_BET_CARD_FULL_MOCK = {
  node: {
    __typename: "SportsbookBetCard",
    urn: `ppb:tbd:card:sbkBet:${BET_ID}`,
    navigationLinks: [
      {
        marketBetUrn: "ppb:marketBet:924.237747664",
      },
    ],

    bet: {
      urn: `ppb:sbkBet:${BET_ID}`,
      betReceiptId: "O/4275336/0021305",
      profitAndLoss: 0.22,
      isSettled: false,
      betType: "SGL",
      currentSize: 0.12,
      result: "CASHED_OUT",
      legs: [SBK_BET_LEG],
    },
  },
};

const SBK_BET_CARD_PARTIAL_MOCK = {
  node: {
    __typename: "SportsbookBetCard",
    urn: `ppb:tbd:card:sbkBet:${BET_ID}`,
  },
};

const RACE_DETAILS_CARD = {
  __typename: "RaceDetailsCard",
  urn: `ppb:tbd:card:raceDetails:${RACE_ID}|true`,
  numberOfRunners: 14,
  showMeetingInfo: true,
  race: {
    __typename: "Race",
    urn: `ppb:race:${RACE_ID}`,
    startTime: "2020-07-13T14:40:00Z",
    name: "Aintree",
    details: {
      distance: {
        totalFurlongs: 1,
        totalMeters: 1,
        miles: 10,
        furlongs: 40,
        yards: 50,
      },
      going: "GOOD_FIRM",
      type: "FLAT",
    },
    meeting: {
      __typename: "Meeting",
      urn: `ppb:meeting:${MEETING_ID}`,
      name: "Wind 13th Jul",
      country: "GB",
      countryFlag: {
        medium: "http://example.test.com/mockedImage/image.png",
      },
      venue: "Aintree",
    },
  },
};

const SBK_BET_CARD_EXPANDABLE = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: `ppb:tbd:card:group:sbkExpandableLeg:${BET_ID}`,
    full: {
      edges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: `ppb:tbd:card:sbkBetLeg:${BET_ID}/0`,
            full: {
              edges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: `ppb:tbd:card:sbkBetLeg:${BET_ID}/0`,
                    betUrn: `ppb:sbkBet:${BET_ID}`,
                    leg: SBK_BET_LEG,
                  },
                },
                RACE_DETAILS_CARD,
                { node: STATS_SUPPORTING_CONTENT_BUTTONS },
              ],
            },
            partials: {
              partialEdges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: `ppb:tbd:card:sbkBetLeg:${BET_ID}/0`,
                  },
                },
                {
                  node: {
                    __typename: "RaceDetailsCard",
                    urn: `ppb:tbd:card:raceDetails:${RACE_ID}|true`,
                  },
                },
                {
                  node: {
                    __typename: "StatsSupportingContentButtonsCardGroup",
                    urn: `ppb:tbd:stats:cardgroup:supportingContentButtons:1|1|my-bets`,
                  },
                },
              ],
            },
          },
        },
        {
          node: {
            ...SBK_BET_INFO_CARD_PARTIAL,
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
            urn: `ppb:tbd:card:sbkBetLeg:${BET_ID}/0`,
          },
        },
        { node: SBK_BET_INFO_CARD_PARTIAL },
      ],
    },
  },
};

const BFF_MY_BETS_MOCK = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:settled",
  url: routes.getMyBetsViewUrl("settled"),
  filters: {
    orderType: {
      items: ["OPEN", "SETTLED"],
      defaultIndex: 1,
    },
  },
  edges: [
    {
      node: {
        __typename: "BetCardGroup",
        urn: `ppb:tbd:card:bet:group:${BET_ID}|sbk`,
        full: {
          edges: [SBK_BET_CARD_FULL_MOCK, SBK_BET_CARD_EXPANDABLE],
        },
        partials: {
          partialEdges: [SBK_BET_CARD_PARTIAL_MOCK, SBK_BET_CARDS_EXPANDABLE_PARTIAL_MOCK],
        },
      },
    },
  ],
  headerItems: HEADER_ITEMS_MOCK,
};

describe("My Bets Page - Race Results", () => {
  describe("when the user has an Horse Racing settled bet with Results available", () => {
    describe("and the user clicks on Results button", () => {
      beforeAll(async () => {
        await mockService.mockFonts(getMockFonts());
        await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
        await mockService.mockHttpRequest(await getIndexHTML(BFF_MY_BETS_MOCK.urn, { products: ["sportsbook"] }));
        await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK));
        await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
        await browser.url(routes.getMyBetsViewUrl("settled"));

        // open accordion
        await browser.waitUntilInViewport(collapsibleCard.header);
        await collapsibleCard.header.click();

        // click on Results button
        await racingResultsButtonPO.element.waitForClickable();
        await racingResultsButtonPO.element.click();

        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1466]_should_be_displayed_the_race_results_with_top_3_runners_and_the_placed_horse`,
        );
      });

      it("[PRPI-1466]_should_be_displayed_the_race_results_with_top_3_runners_and_the_placed_horse", async () => {
        expect(
          await browser.checkScreen(
            `${MODULE_NAME}_[PRPI-1466]_should_be_displayed_the_race_results_with_top_3_runners_and_the_placed_horse`,
          ),
        ).toBe(0);
      });
    });
  });
});
