const { MyBetsPagePO, SportsbookBetPanelPO, MyBetsHeaderPO } = require("../../../../../page-objects");
const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const routes = require("../../../../../../utils/routes");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsPO = new MyBetsPagePO();
const sbkBetPanelPO = new SportsbookBetPanelPO(myBetsPO.betCardGroups[0]);
const myBetsHeaderPO = new MyBetsHeaderPO(myBetsPO.header);

const buildPrice = (price) => ({
  decimal: price,
  fractional: { numerator: price * 100, denominator: 100 },
});

const SBK_LEG_CARD_GROUPS_LEG = {
  type: "SIMPLE_SELECTION",
  legNumber: 1,
  parts: [
    {
      priceType: "GUARANTEED",
      eachwayPlaces: 4,
      selectionName: "El Cairos",
      eventDescription: "14:55 2M HURDLE 1m 7f 179y",
      eventMarketDescription: "Each Way",
      marketType: "WIN",
      selectionId: 68391742,
      price: buildPrice(1.2),
      originalPrice: buildPrice(1.2),
      eachwayFactor: {
        numerator: 1,
        denominator: 5,
      },
    },
  ],
};

const SBK_LEG_CARD_GROUPS_EVENT_HEADER = {
  title: "2m Mdn Hrd",
  tertiaryTitle: "Thurles 29th Jan",
  date: "2026-01-09T14:19:47.000Z",
};

const SBK_LEG_CARD_GROUPS_RACE_DETAILS = {
  showMeetingInfo: true,
  raceName: "2m Mdn Hrd",
  meetingName: "Thurles 29th Jan",
  venue: "Thurles",
};

const BET_INFO = {
  betReceiptId: "O/11037374/0008843",
  placedDate: "2026-01-09T14:19:47.000Z",
  regulatorBetId: "bc000000001c17979f05",
};

const SBK_LEG_CARD_GROUPS = {
  legs: [SBK_LEG_CARD_GROUPS_LEG],
  eventHeader: SBK_LEG_CARD_GROUPS_EVENT_HEADER,
  raceDetails: SBK_LEG_CARD_GROUPS_RACE_DETAILS,
};

const SBK_SINGLE_WITH_EACH_WAY = {
  profitAndLoss: 0.41,
  betType: "SGL",
  betId: "1111111111",
  isOpen: true,
  currentSize: 0.2,
  potentialWinForPlace: "0.14",
  edges: {
    legCardGroups: [SBK_LEG_CARD_GROUPS],
    betInfo: BET_INFO,
  },
};

const SBK_SINGLE_WITH_EACH_WAY_2_PLACES = {
  ...SBK_SINGLE_WITH_EACH_WAY,
  edges: {
    legCardGroups: [
      {
        legs: [
          {
            parts: [
              {
                eachwayPlaces: 2,
              },
            ],
          },
        ],
      },
    ],
  },
};

const SBK_SINGLE_WITH_EACH_WAY_3_PLACES = {
  ...SBK_SINGLE_WITH_EACH_WAY,
  edges: {
    legCardGroups: [
      {
        legs: [
          {
            parts: [
              {
                eachwayPlaces: 3,
              },
            ],
          },
        ],
      },
    ],
  },
};

const SBK_SINGLE_WITH_EACH_WAY_5_PLACES = {
  ...SBK_SINGLE_WITH_EACH_WAY,
  edges: {
    legCardGroups: [
      {
        legs: [
          {
            parts: [
              {
                eachwayPlaces: 5,
              },
            ],
          },
        ],
      },
    ],
  },
};

const SBK_MULTIPLE_EACH_WAY = {
  ...SBK_SINGLE_WITH_EACH_WAY,
  betType: "DBL",
};

const SBK_SINGLE_RACING_EACH_WAY_SP = {
  ...SBK_SINGLE_WITH_EACH_WAY,
  edges: {
    legCardGroups: [
      {
        legs: [
          {
            parts: [
              {
                priceType: "STARTING_PRICE",
              },
            ],
          },
        ],
      },
    ],
  },
};

const SBK_SINGLE_RACING_EACH_WAY_WITH_BOOST = {
  ...SBK_SINGLE_WITH_EACH_WAY,
  isOddsBoosted: true,
};

const SBK_SETTLED_EACH_WAY = {
  ...SBK_SINGLE_WITH_EACH_WAY,
  isOpen: false,
  isSettled: true,
  result: "WON",
  resultType: "WIN",
  edges: {
    legCardGroups: [
      {
        legs: [
          {
            parts: [
              {
                type: "SIMPLE_SELECTION",
                legNumber: 1,
                result: "WON",
                resultType: "WIN",
              },
            ],
          },
        ],
      },
    ],
  },
};

const browseToMyBets = async (MOCK) => {
  await mockService.mockHttpRequest(await getIndexHTML(MOCK.urn));
  await mockService.mockHttpRequest(getMyBetsLayout(MOCK));
  await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
  await browser.url(routes.getMyBetsViewUrl("open"));
  await browser.waitUntilDisplayed(myBetsHeaderPO.header);
  await browser.waitUntilInViewport(sbkBetPanelPO.element);
};

describe("My Bets - Each Way Placed Returns", () => {
  describe("when the user is viewing open bets", () => {
    describe("and the user has a Singles Each Way bet", () => {
      beforeAll(async () => {
        await browseToMyBets(getMyBetsSBKViewMock([SBK_SINGLE_WITH_EACH_WAY]));
      });

      it("[PRPI-4106] displays the placed returns label in addition to potential returns", async () => {
        expect(await sbkBetPanelPO.potentialReturnsLabel.getText()).toEqual("Returns");
        expect(await sbkBetPanelPO.potentialReturns.getText()).toEqual("$0.41");

        expect(await sbkBetPanelPO.potentialPlaceReturnsLabel.getText()).toEqual("2nd - 4th Place Returns");
        expect(await sbkBetPanelPO.potentialPlaceReturns.getText()).toEqual("$0.14");
      });

      describe("and the bet has 2 places", () => {
        beforeAll(async () => {
          await browseToMyBets(getMyBetsSBKViewMock([SBK_SINGLE_WITH_EACH_WAY_2_PLACES]));
        });

        it("[PRPI-4107] displays '2nd returns' as the placed returns label", async () => {
          expect(await sbkBetPanelPO.potentialPlaceReturnsLabel.getText()).toEqual("2nd Place Returns");
          expect(await sbkBetPanelPO.potentialPlaceReturns.getText()).toEqual("$0.14");
        });
      });

      describe("and the bet has 3 places", () => {
        beforeAll(async () => {
          await browseToMyBets(getMyBetsSBKViewMock([SBK_SINGLE_WITH_EACH_WAY_3_PLACES]));
        });

        it("[PRPI-6856] displays '2nd-3rd returns' as the placed returns label", async () => {
          expect(await sbkBetPanelPO.potentialPlaceReturnsLabel.getText()).toEqual("2nd - 3rd Place Returns");
          expect(await sbkBetPanelPO.potentialPlaceReturns.getText()).toEqual("$0.14");
        });
      });

      describe("and the bet has more than 3 places", () => {
        beforeAll(async () => {
          await browseToMyBets(getMyBetsSBKViewMock([SBK_SINGLE_WITH_EACH_WAY_5_PLACES]));
        });

        it("[PRPI-6857] displays '2nd-nth returns' using the correct ordinal suffix", async () => {
          expect(await sbkBetPanelPO.potentialPlaceReturnsLabel.getText()).toEqual("2nd - 5th Place Returns");
          expect(await sbkBetPanelPO.potentialPlaceReturns.getText()).toEqual("$0.14");
        });
      });
    });

    describe("and the bet is a Multiple Each Way bet", () => {
      beforeAll(async () => {
        await browseToMyBets(getMyBetsSBKViewMock([SBK_MULTIPLE_EACH_WAY]));
      });

      it("[PRPI-4110] displays only the potential returns", async () => {
        expect(await sbkBetPanelPO.potentialReturnsLabel.getText()).toEqual("Returns");
      });

      it("[PRPI-4111] does not display the placed returns label", async () => {
        expect(await sbkBetPanelPO.potentialPlaceReturnsLabel.getElement()).toBeUndefined();
        expect(await sbkBetPanelPO.potentialPlaceReturns.getElement()).toBeUndefined();
      });
    });

    describe("and the Singles Each Way bet is an SP bet", () => {
      beforeAll(async () => {
        await browseToMyBets(getMyBetsSBKViewMock([SBK_SINGLE_RACING_EACH_WAY_SP]));
      });

      it("[PRPI-4112] displays only the potential returns", async () => {
        expect(await sbkBetPanelPO.potentialReturnsLabel.getText()).toEqual("Returns");
      });

      it("[PRPI-4113] does not display the placed returns label", async () => {
        expect(await sbkBetPanelPO.potentialPlaceReturnsLabel.getElement()).toBeUndefined();
        expect(await sbkBetPanelPO.potentialPlaceReturns.getElement()).toBeUndefined();
      });
    });

    describe("and the Singles Each Way bet uses a Boost Token", () => {
      beforeAll(async () => {
        await browseToMyBets(getMyBetsSBKViewMock([SBK_SINGLE_RACING_EACH_WAY_WITH_BOOST]));
      });

      it("[PRPI-4114] displays the potential returns value before boost and the boosted value", async () => {
        expect(await sbkBetPanelPO.previousValue.getText()).toEqual("$0.21");
        expect(await sbkBetPanelPO.boostedValue.getText()).toEqual("$0.41");
      });

      it("[PRPI-4115] displays the placed returns value without the boost value", async () => {
        expect(await sbkBetPanelPO.potentialPlaceReturnsLabel.getText()).toEqual("2nd - 4th Place Returns");
        expect(await sbkBetPanelPO.potentialPlaceReturns.getText()).toEqual("$0.14");
      });
    });
  });

  describe("when the user is viewing settled bets", () => {
    beforeAll(async () => {
      await browseToMyBets(getMyBetsSBKViewMock([SBK_SETTLED_EACH_WAY]));
    });

    describe("and the bet is a settled Singles Each Way bet", () => {
      it("[PRPI-4116] displays only the settled returns", async () => {
        expect(await sbkBetPanelPO.potentialReturnsLabel.getText()).toEqual("Returns");
        expect(await sbkBetPanelPO.potentialReturns.getText()).toEqual("$0.41");
      });

      it("[PRPI-4117] does not display the placed returns label", async () => {
        expect(await sbkBetPanelPO.potentialPlaceReturnsLabel.getElement()).toBeUndefined();
        expect(await sbkBetPanelPO.potentialPlaceReturns.getElement()).toBeUndefined();
      });
    });
  });
});
