const {
  MyBetsPagePO,
  SportsbookBetPanelPO,
  BetSegmentsPO,
  CardPO,
  RaceDetailsPO,
  BetSelectionDetailsPO,
  BetInfoPO,
  BetInfoItemPO,
  LabelPO,
  SnackbarPO,
  InfoLabelPO,
  OddsPO,
  PNLAndWhatIfPO,
  TeamsPO,
  CopyToClipboardPO,
  CouponPO,
  DurationPO,
} = require("../../../../../page-objects");
const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const routes = require("../../../../../../utils/routes");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsPO = new MyBetsPagePO();
const sbkBetPanelPO = new SportsbookBetPanelPO(myBetsPO.betCardGroups[0]);
const betSegmentsPO = new BetSegmentsPO();
const betSegmentReturnsPO = new PNLAndWhatIfPO(betSegmentsPO.rightValue);
const cardPO = new CardPO();
const raceDetailsPO = new RaceDetailsPO();
const betSelectionDetailsPO = new BetSelectionDetailsPO();
const labelPO = new LabelPO(betSelectionDetailsPO.racingLabel);
const betInfoPO = new BetInfoPO();
const firstBetInfoItemPO = new BetInfoItemPO(betInfoPO.infoItems[0]);
const secondBetInfoItemPO = new BetInfoItemPO(betInfoPO.infoItems[1]);
const thirdBetInfoItemPO = new BetInfoItemPO(betInfoPO.infoItems[2]);

const firstCopyToClipboardPO = new CopyToClipboardPO(firstBetInfoItemPO.element);
const secondCopyToClipboardPO = new CopyToClipboardPO(secondBetInfoItemPO.element);
const thirdCopyToClipboardPO = new CopyToClipboardPO(thirdBetInfoItemPO.element);

const snackbarPO = new SnackbarPO();
const infoLabelPO = new InfoLabelPO();
const infoLabelOddsPO = new OddsPO(infoLabelPO.odds);
const betSelectionDetailsOddsPO = new OddsPO(betSelectionDetailsPO.element);

const eventHeaderPO = new CouponPO();
const teamsPO = new TeamsPO(eventHeaderPO.teams);
const durationPO = new DurationPO(eventHeaderPO.duration);

const buildPrice = (price) => ({
  decimal: price,
  fractional: {
    numerator: price * 100,
    denominator: 100,
  },
});

const SBK_SINGLE_RACING_WITH_EACH_WAY_BOG_AND_FREE_BET_MOCK = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    isOpen: true,
    bonus: 0.1,
    currentSize: 0.1,
    profitAndLoss: 0.16,
    edges: {
      legCardGroups: [
        {
          legs: [
            {
              parts: [
                {
                  priceType: "GUARANTEED",
                  eachwayPlaces: 3,
                  price: buildPrice(1.61),
                  originalPrice: buildPrice(1.61),
                },
              ],
            },
          ],

          raceDetails: {
            showMeetingInfo: true,
            raceName: "6f Mdn Stks",
            meetingName: "Southwell 11th May",
            venue: "Southwell",
          },
        },
      ],

      betInfo: {
        betReceiptId: "O/11037374/0002965",
        placedDate: "2023-04-21T09:45:41.000Z",
        regulatorBetId: "bc000000001c17979f05",
      },
    },
  },
]);

const SBK_SINGLE_SPECIAL_WITH_ODDS_BOOST_MOCK = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    isOpen: true,
    currentSize: 0.11,
    profitAndLoss: 0.15,
    originalPotentialWin: 0.14,
    isOddsBoosted: true,
    edges: {
      legCardGroups: [
        {
          legs: [
            {
              parts: [
                {
                  price: buildPrice(1.4),
                  originalPrice: buildPrice(1.36),
                },
              ],
            },
          ],

          eventHeader: {
            title: "Cheltenham Antepost Doubles",
            tertiaryTitle: "#WhatOddsPaddy",
            date: "2023-04-15T15:50:00.000Z",
          },
        },
      ],

      betInfo: {
        betReceiptId: "O/11037374/0002965",
        placedDate: "2023-03-13T11:13:24.000Z",
      },
    },
  },
]);

const SBK_SINGLE_FORECAST_TRICAST_MOCK = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    isOpen: true,
    currentSize: 0.1,
    numLines: 2,
    betPrice: null,
    edges: {
      legCardGroups: [
        {
          legs: [
            {
              type: "RF",
              parts: [
                {
                  eventDescription: "17:20 HANDICAP 1m 4f 23y",
                  eventMarketDescription: "Win",
                  selectionName: "Book Of Tales",
                  priceType: "DIVIDEND",
                  price: null,
                  originalPrice: null,
                },
                {
                  eventDescription: "17:20 HANDICAP 1m 4f 23y",
                  eventMarketDescription: "Win",
                  selectionName: "Kilcummin",
                  priceType: "DIVIDEND",
                  price: null,
                  originalPrice: null,
                },
              ],
            },
          ],

          raceDetails: {
            showMeetingInfo: true,
            raceName: "6f Mdn Stks",
            meetingName: "Southwell 11th May",
            venue: "Southwell",
          },
        },
      ],

      betInfo: {
        betReceiptId: "O/11037374/0002965",
        placedDate: "2023-04-21T09:45:41.000Z",
      },
    },
  },
]);

const BET_MOCK_SUPER_SUB_SKELETON = {
  betType: "SGL",
  isOpen: true,
  betId: "32483335",
  currentSize: 0.1,
  profitAndLoss: 0.17,
  navigationLinks: [
    {
      marketBetUrn: "ppb:marketBet:924.333333333",
    },
  ],

  edges: {
    legCardGroups: [
      {
        legs: [
          {
            type: "SS",
            parts: [
              {
                price: buildPrice(1.65),
                originalPrice: buildPrice(1.65),
                priceType: "LIVE",
                eventUrn: "ppb:event:32483335",
                eventDescription: "Man Utd v Chelsea",
                eventMarketDescription: "To Score Or To Be Shown A Card",
                selectionName: "Bruno Fernandes",
                isSuperSub: true,
              },
            ],
          },
        ],
      },
    ],

    betInfo: {
      betReceiptId: "O/11037374/0002965",
      placedDate: "2023-04-21T09:45:41.000Z",
    },
  },
};

const SBK_SUPER_SUB_MOCK = {
  ...BET_MOCK_SUPER_SUB_SKELETON,
  edges: {
    ...BET_MOCK_SUPER_SUB_SKELETON.edges,
    legCardGroups: [
      {
        ...BET_MOCK_SUPER_SUB_SKELETON.edges.legCardGroups[0],
        legs: [
          {
            ...BET_MOCK_SUPER_SUB_SKELETON.edges.legCardGroups[0].legs[0],
            parts: [
              {
                ...BET_MOCK_SUPER_SUB_SKELETON.edges.legCardGroups[0].legs[0].parts[0],
                eventMarketDescription: "Over/Under Total Goals 3.5",
                selectionName: "Man Utd",
                isSuperSub: true,
              },
            ],
          },
        ],
      },
    ],
  },
};

const SBK_SINGLE_SUPER_SUB_MOCK = getMyBetsSBKViewMock([SBK_SUPER_SUB_MOCK]);

const browseToMyBets = async (MOCK, initialState = {}) => {
  await mockService.mockHttpRequest(await getIndexHTML(MOCK.urn, initialState));
  await mockService.mockHttpRequest(getMyBetsLayout(MOCK));
  await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
  await browser.url(routes.getMyBetsViewUrl("open"));
  await browser.waitUntilInViewport(cardPO.element);
};

describe("My Bets - SBK Singles", () => {
  describe("When the user has a racing single bet with Each Way, BOG and was placed with free bets", () => {
    beforeAll(async () => {
      await browseToMyBets(SBK_SINGLE_RACING_WITH_EACH_WAY_BOG_AND_FREE_BET_MOCK);
    });

    it("[PRPI-6867] should display the title header as 'Single @ 1.61'", async () => {
      expect(await sbkBetPanelPO.panelTitle.isDisplayed()).toEqual(true);
      expect(await sbkBetPanelPO.panelTitle.getText()).toEqual("Single @ 1.61");
    });

    it("[PRPI-6868] should display the expected supportingText", async () => {
      expect(await sbkBetPanelPO.panelSupportingText.getText()).toEqual("Gitche Gumee");
    });

    it("[PRPI-6869] should display the market blurb with 'BOG'", async () => {
      expect(await sbkBetPanelPO.bog.getText()).toEqual("BOG");
    });

    it("[PRPI-6870] should display the bet segments", async () => {
      expect(await betSegmentsPO.element.isDisplayed()).toEqual(true);
    });

    it("[PRPI-6871] should display the stake label", async () => {
      expect(await betSegmentsPO.midLabel.getText()).toEqual("Stake");
    });

    it("[PRPI-6872] should display the returns label", async () => {
      expect(await betSegmentsPO.rightLabel.getText()).toEqual("Returns");
    });

    it("[PRPI-6873] should display the stake value with '$0.10'", async () => {
      expect(await betSegmentsPO.midValue.getText()).toEqual("$0.10");
    });

    it("[PRPI-6874] should display the returns value with '$0.16'", async () => {
      expect(await betSegmentReturnsPO.pnl.getText()).toEqual("$0.16");
    });

    it("[PRPI-6875] should display the free bets icon", async () => {
      expect(await infoLabelPO.icon.isDisplayed()).toEqual(true);
    });

    it("[PRPI-6876] should display the free bets with 'Used $0.10 Free Bet'", async () => {
      expect(await infoLabelPO.label.getText()).toEqual("Used $0.10 Free Bet");
    });

    it("[PRPI-6877] should display the card with show indication", async () => {
      expect(await cardPO.element.isDisplayed()).toEqual(true);
      expect(await cardPO.header.getText()).toEqual("Show Selection Info");
    });

    it("[PRPI-6878] should display the card chevron as collapsed", async () => {
      expect(await cardPO.header.isDisplayed()).toEqual(true);
      expect(await cardPO.content.isDisplayed()).toEqual(false);
    });

    describe("and the user clicks on card", () => {
      beforeAll(async () => {
        await cardPO.header.waitForClickable();
        await cardPO.header.click();
        await browser.waitUntilDisplayed(cardPO.content);
        await browser.waitUntilDisplayed(raceDetailsPO.element);
      });

      it("[PRPI-6879] should display the card with hide indication", async () => {
        expect(await cardPO.header.getText()).toEqual("Hide Selection Info");
      });

      it("[PRPI-6880] should display the card chevron as expanded", async () => {
        expect(await cardPO.content.isDisplayed()).toEqual(true);
      });

      it("[PRPI-6881] should display the race details", async () => {
        expect(await raceDetailsPO.element.isDisplayed()).toEqual(true);
      });

      it("[PRPI-6882] should display the bet selection details", async () => {
        expect(await betSelectionDetailsPO.element.isDisplayed()).toEqual(true);
      });

      it("[PRPI-6883] should display the selection name with 'Gitche Gumee'", async () => {
        expect(await betSelectionDetailsPO.title.getText()).toEqual("Gitche Gumee");
      });

      it("[PRPI-6884] should display the BOG label", async () => {
        expect(await labelPO.element.isDisplayed()).toEqual(true);
        expect(await labelPO.element.getText()).toEqual("BOG");
      });

      it("[PRPI-6885] should display the odds value with '@ 1.61'", async () => {
        expect(await betSelectionDetailsOddsPO.value.getText()).toEqual("@ 1.61");
      });

      it("[PRPI-6886] should display the market name with 'Each Way'", async () => {
        expect(await betSelectionDetailsPO.subtitle.getText()).toEqual("Each Way");
      });

      it("[PRPI-6887] should display the information as 'Each Way: 1/5 Odds, 3 Places'", async () => {
        expect(await betSelectionDetailsPO.tertiaryTitle.getText()).toEqual("Each Way: 1/5 Odds, 3 Places");
      });

      it("[PRPI-6888] should display the bet info with 3 lines", async () => {
        expect(await betInfoPO.element.isDisplayed()).toEqual(true);
        expect(await betInfoPO.infoItems.length).toEqual(3);
      });

      it("[PRPI-6889] should display the betfair ID with in first line with the correct data", async () => {
        expect(await firstBetInfoItemPO.label.getText()).not.toEqual("I18N.MYBETS.BETID");
        expect(await firstBetInfoItemPO.contentText.isDisplayed()).toEqual(false);
        expect(await firstCopyToClipboardPO.contentLabel.getText()).toEqual("O/11037374/0002965");
      });

      it("[PRPI-6890] should display the betfair regulatory ID in the second line with the correct data", async () => {
        expect(await secondBetInfoItemPO.label.getText()).toEqual("ID");
        expect(await secondBetInfoItemPO.contentText.isDisplayed()).toEqual(false);
        expect(await secondCopyToClipboardPO.contentLabel.getText()).toEqual("bc000000001c17979f05");
      });

      it("[PRPI-6891] should display the place date in the third line with the correct data", async () => {
        expect(await thirdBetInfoItemPO.label.getText()).toEqual("Placed");
        expect(await thirdBetInfoItemPO.contentText.getText()).toEqual("April 21, 2023 at 10:45");
        expect(await thirdCopyToClipboardPO.contentLabel.isDisplayed()).toEqual(false);
      });

      describe("and the user clicks on betfair ID", () => {
        beforeAll(async () => {
          await firstCopyToClipboardPO.contentLabel.waitForClickable();
          await firstCopyToClipboardPO.contentLabel.click();
          await browser.waitUntilDisplayed(snackbarPO.element);
        });

        it("[PRPI-6892] should display the snack bar with copied to clipboard info", async () => {
          expect(await snackbarPO.title.getText()).toEqual("Betfair ID has been copied to clipboard.");
        });
      });
    });
  });

  describe("When the user has a special bet from a non SCA sport with boost", () => {
    beforeAll(async () => {
      await browseToMyBets(SBK_SINGLE_SPECIAL_WITH_ODDS_BOOST_MOCK);
    });

    it("[PRPI-6893] should display the title header with 'Single @ 1.4'", async () => {
      expect(await sbkBetPanelPO.panelTitle.isDisplayed()).toEqual(true);
      expect(await sbkBetPanelPO.panelTitle.getText()).toEqual("Single @ 1.4");
    });

    it("[PRPI-6894] should display the previous returns value with '$0.14'", async () => {
      expect(await betSegmentReturnsPO.previousPnl.getText()).toEqual("$0.14");
    });

    it("[PRPI-6895] should display the returns value with '$0.15'", async () => {
      expect(await betSegmentReturnsPO.pnl.getText()).toEqual("$0.15");
    });

    it("[PRPI-6896] should display the boost icon", async () => {
      expect(await infoLabelPO.icon.isDisplayed()).toEqual(true);
    });

    it("[PRPI-6897] should display the boost label with 'Bet Boost Applied'", async () => {
      expect(await infoLabelPO.label.getText()).toEqual("Bet Boost Applied");
    });
    it("[PRPI-6898] should display the previous odds with '1.36'", async () => {
      expect(await infoLabelOddsPO.previousValue.getText()).toEqual("1.36");
    });

    it("[PRPI-6899] should display the odds with '1.4'", async () => {
      expect(await infoLabelOddsPO.value.getText()).toEqual("1.4");
    });

    describe("and the user clicks on card", () => {
      beforeAll(async () => {
        await cardPO.header.waitForClickable();
        await cardPO.header.click();
        await browser.waitUntilDisplayed(cardPO.content);
        await browser.waitUntilDisplayed(eventHeaderPO.element);
      });

      it("[PRPI-6900] should display the event header", async () => {
        expect(await eventHeaderPO.element.isDisplayed()).toEqual(true);
      });

      it("[PRPI-6901] should display the competition name with '#WhatOddsPaddy'", async () => {
        expect(await teamsPO.firstTeam.getText()).toEqual("#WhatOddsPaddy");
      });

      it("[PRPI-6902] should display the event name with 'Cheltenham Antepost Doubles'", async () => {
        expect(await teamsPO.secondTeam.getText()).toEqual("Cheltenham Antepost Doubles");
      });

      it("[PRPI-6903] should display the event formatted date", async () => {
        expect(await durationPO.datetime.getText()).toEqual("Apr 15\n16:50");
      });

      it("[PRPI-6904] should display the selection name with 'Gitche Gumee'", async () => {
        expect(await betSelectionDetailsPO.title.getText()).toEqual("Gitche Gumee");
      });

      it("[PRPI-6905] should display the previous odds value with '1.36'", async () => {
        expect(await betSelectionDetailsOddsPO.previousValue.isDisplayed()).toEqual(true);
        expect(await betSelectionDetailsOddsPO.previousValue.getText()).toEqual("1.36");
      });

      it("[PRPI-6906] should display the odds value with '@ 1.4'", async () => {
        expect(await betSelectionDetailsOddsPO.value.isDisplayed()).toEqual(true);
        expect(await betSelectionDetailsOddsPO.value.getText()).toEqual("@ 1.4");
      });

      it("[PRPI-6907] should display the market name with 'Win'", async () => {
        expect(await betSelectionDetailsPO.subtitle.getText()).toEqual("Win");
      });

      it("[PRPI-6908] should display the bet info with 2 lines", async () => {
        expect(await betInfoPO.element.isDisplayed()).toEqual(true);
        expect(await betInfoPO.infoItems.length).toEqual(2);
      });

      it("[PRPI-6909] should display the betfair ID with in first line with the correct data", async () => {
        expect(await firstBetInfoItemPO.label.getText()).not.toEqual("I18N.MYBETS.BETID");
        expect(await firstBetInfoItemPO.contentText.isDisplayed()).toEqual(false);
        expect(await firstCopyToClipboardPO.contentLabel.getText()).toEqual("O/11037374/0002965");
      });

      it("[PRPI-6910] should display the place date in the second line with the correct data", async () => {
        expect(await secondBetInfoItemPO.label.getText()).toEqual("Placed");
        expect(await secondBetInfoItemPO.contentText.getText()).toEqual("March 13, 2023 at 11:13");
        expect(await secondCopyToClipboardPO.contentLabel.isDisplayed()).toEqual(false);
      });
    });
  });

  describe("When the user has a Forecast bet", () => {
    beforeAll(async () => {
      await browseToMyBets(SBK_SINGLE_FORECAST_TRICAST_MOCK);
    });

    it("[PRPI-6911] should display the title header with 'Single @ 2 Lines'", async () => {
      expect(await sbkBetPanelPO.panelTitle.getText()).toEqual("Single @ 2 Lines");
    });

    it("[PRPI-6912] should display the supportingText with 'Book Of Tales / Kilcummin'", async () => {
      expect(await sbkBetPanelPO.panelSupportingText.getText()).toEqual("Book Of Tales / Kilcummin");
    });

    it("[PRPI-6913] should display the returns value with 'TBD'", async () => {
      expect(await betSegmentsPO.rightValue.getText()).toEqual("TBD");
    });

    describe("and the user clicks on card", () => {
      beforeAll(async () => {
        await cardPO.header.waitForClickable();
        await cardPO.header.click();
        await browser.waitUntilDisplayed(cardPO.content);
        await browser.waitUntilDisplayed(raceDetailsPO.element);
      });

      it("[PRPI-6914] should display the race details", async () => {
        expect(await raceDetailsPO.element.isDisplayed()).toEqual(true);
      });

      it("[PRPI-6915] should display the selection name with 'Book Of Tales / Kilcummin'", async () => {
        expect(await betSelectionDetailsPO.title.getText()).toEqual("Book Of Tales / Kilcummin");
      });

      it("[PRPI-6916] should not display the odds value", async () => {
        expect(await betSelectionDetailsOddsPO.value.isDisplayed()).toEqual(false);
      });

      it("[PRPI-6917] should display the market name with 'Reverse Forecast'", async () => {
        expect(await betSelectionDetailsPO.subtitle.getText()).toEqual("Reverse Forecast");
      });

      it("[PRPI-6918] should display the bet info", async () => {
        expect(await betInfoPO.element.isDisplayed()).toEqual(true);
        expect(await betInfoPO.infoItems.length).toEqual(2);
      });
    });
  });

  describe("When the user has a SuperSub bet", () => {
    beforeAll(async () => {
      await browseToMyBets(SBK_SINGLE_SUPER_SUB_MOCK, {
        brandSettings: {
          SHOW_SELECTION_TYPE_ICON: true,
        },
      });
    });

    describe("and the user clicks on card", () => {
      beforeAll(async () => {
        await cardPO.header.waitForClickable();
        await cardPO.header.click();

        await browser.waitUntilDisplayed(cardPO.content);
      });

      it("[PRPI-6919] should include 'Safe Sub' in the bet selection subtitle", async () => {
        expect(await betSelectionDetailsPO.subtitle.getText()).toContain("Safe Sub");
      });

      it("[PRPI-6920] should include the SuperSub icon", async () => {
        expect(await betSelectionDetailsPO.selectionTypeIcon.isDisplayed()).toBe(true);
      });
    });
  });
});
