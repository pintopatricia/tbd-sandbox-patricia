const SportsbookExpandableLegCardGroupSO = require("@ppb/tbd-shared/components/SportsbookExpandableLegCardGroup/SportsbookExpandableLegCardGroup.native.so");
const SportsbookBetLegCardGroupSO = require("@ppb/tbd-shared/components/SportsbookBetLegCardGroup/SportsbookBetLegCardGroup.native.so");
const BetCardGroupSO = require("@ppb/tbd-shared/components/BetCardGroup/BetCardGroup.native.so");

const {
  getAppContext,
  getMyBetsLayout,
  getHomeLayoutWithViewLink,
  getCardResults,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const { startApp } = require("../../../../helpers/urls");
const { swipeUp, swipeDown, swipeDownElementFullscreen } = require("../../../../helpers/gestures");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const MY_BETS_SETTLED_URL = "mybets/settled/mb-736574746c6564";

const MockService = require("../../../../mock-essentials/mocking-service");

const {
  MyBetsScreenSO,
  SportsbookBetPanelSO,
  CardSO,
  BetSelectionDetailsSO,
  BetInfoSO,
  OddsSO,
  StatusLabelSO,
  InfoLabelSO,
  BetSegmentsSO,
  PNLAndWhatIfSO,
  BetInfoItemSO,
  CopyToClipboardSO,
  SportsbookBetCardSO,
} = require("../../../../screen-objects");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsSO = new MyBetsScreenSO();

const betCardGroupSO = new BetCardGroupSO(myBetsSO.betCardGroups[0]);
const sportsbookBetCardSO = new SportsbookBetCardSO(betCardGroupSO.groupItems[0]);

const sbkBetPanelSO = new SportsbookBetPanelSO(myBetsSO.betCardGroups[0]);

const firstInfoLabelSO = new InfoLabelSO(sbkBetPanelSO.infoLabels[0]);
const secondInfoLabelSO = new InfoLabelSO(sbkBetPanelSO.infoLabels[2]);
const thirdInfoLabelSO = new InfoLabelSO(sbkBetPanelSO.infoLabels[4]);

const infoLabelOddsSO = new OddsSO(firstInfoLabelSO.odds);

const betSegmentsSO = new BetSegmentsSO(myBetsSO.betCardGroups[0]);
const rightSelectionSegmentProfitSO = new PNLAndWhatIfSO(betSegmentsSO.rightSegment);

const betPanelStatusLabelSO = new StatusLabelSO(sbkBetPanelSO.element);

const cardSO = new CardSO();

const sportsbookExpandableLegCardGroupSO = new SportsbookExpandableLegCardGroupSO();
const firstSportsbookBetLegCardGroupSO = new SportsbookBetLegCardGroupSO(sportsbookExpandableLegCardGroupSO.cards[0]);
const secondSportsbookBetLegCardGroupSO = new SportsbookBetLegCardGroupSO(sportsbookExpandableLegCardGroupSO.cards[1]);
const thirdSportsbookBetLegCardGroupSO = new SportsbookBetLegCardGroupSO(sportsbookExpandableLegCardGroupSO.cards[2]);

// 1st bet leg card group
const firstEventFirstBetSelectionDetailsSO = new BetSelectionDetailsSO(firstSportsbookBetLegCardGroupSO.cards[0]);
const firstEventFirstBetSelectionDetailsStatusLabelSO = new StatusLabelSO(firstEventFirstBetSelectionDetailsSO.element);
const firstEventFirstBetSelectionDetailsOddsSO = new OddsSO(firstEventFirstBetSelectionDetailsSO.element);

// 2nd bet leg card group
const secondEventFirstBetSelectionDetailsSO = new BetSelectionDetailsSO(secondSportsbookBetLegCardGroupSO.cards[0]);
const secondEventFirstBetSelectionDetailsStatusLabelSO = new StatusLabelSO(
  secondEventFirstBetSelectionDetailsSO.element,
);

// 3rd bet leg card group
const thirdEventFirstBetSelectionDetailsSO = new BetSelectionDetailsSO(thirdSportsbookBetLegCardGroupSO.cards[0]);
const thirdEventFirstBetSelectionDetailsStatusLabelSO = new StatusLabelSO(thirdEventFirstBetSelectionDetailsSO.element);

const betInfoSO = new BetInfoSO();
const firstBetInfoItemSO = new BetInfoItemSO(betInfoSO.infoItems[0]);
const secondBetInfoItemSO = new BetInfoItemSO(betInfoSO.infoItems[1]);
const thirdBetInfoItemSO = new BetInfoItemSO(betInfoSO.infoItems[2]);
const fourthBetInfoItemSO = new BetInfoItemSO(betInfoSO.infoItems[3]);

const firstCopyToClipboardSO = new CopyToClipboardSO(firstBetInfoItemSO.element);
const secondCopyToClipboardSO = new CopyToClipboardSO(secondBetInfoItemSO.element);
const thirdCopyToClipboardSO = new CopyToClipboardSO(thirdBetInfoItemSO.element);
const fourthCopyToClipboardSO = new CopyToClipboardSO(fourthBetInfoItemSO.element);

const buildPrice = (price) => ({
  decimal: price,
  fractional: {
    numerator: price * 100,
    denominator: 100,
  },
});

const SBK_SINGLE_RACING_WITH_EACH_WAY_BOG_AND_RULE4_MOCK = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    currentSize: 0.1,
    profitAndLoss: "0",
    isOpen: false,
    isSettled: true,
    result: "CASHED_OUT",
    edges: {
      legCardGroups: [
        {
          raceDetails: {
            showMeetingInfo: true,
            raceName: "6f Mdn Stks",
            meetingName: "Southwell 11th May",
            venue: "Southwell",
          },
          legs: [
            {
              result: "LOST",
              parts: [
                {
                  rule4Deductions: 5,
                  priceType: "GUARANTEED",
                  eachwayPlaces: 3,
                  price: buildPrice(1.61),
                  originalPrice: buildPrice(1.61),
                },
              ],
            },
          ],
        },
      ],

      betInfo: {
        betReceiptId: "O/11037374/0002965",
        placedDate: "2023-04-21T09:45:41.000Z",
        regulatorBetId: "bc000000001c17979f05",
        settledDate: "2023-04-21T09:55:41.000Z",
      },
    },
  },
]);

const SBK_SINGLE_SPECIAL_WITH_ODDS_BOOST_FREE_BETS_AND_ACCA_INSURANCE_TOKEN_MOCK = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    currentSize: 0.11,
    bonus: 0.11,
    profitAndLoss: 0.15,
    originalPotentialWin: 0.14,
    isOpen: false,
    isSettled: true,
    isOddsBoosted: true,
    result: "WON",
    isAccaInsuranceReward: true,
    edges: {
      legCardGroups: [
        {
          legs: [
            {
              result: "WON",
              parts: [
                {
                  price: buildPrice(1.4),
                  originalPrice: buildPrice(1.36),
                  isSuperSub: true,
                },
              ],
            },
          ],

          eventHeader: {
            title: "Cheltenham Antepost Doubles",
            tertiaryTitle: "#WhatOddsPaddy",
            date: "2023-04-21T09:55:00.000Z",
          },
        },
      ],

      betInfo: {
        betReceiptId: "O/11037374/0002965",
        placedDate: "2023-04-21T09:45:41.000Z",
        settledDate: "2023-04-21T09:55:00.000Z",
      },
    },
  },
]);

const SBK_SINGLE_90_MIN_MARKET = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    currentSize: 10,
    bonus: 0,
    profitAndLoss: 19.09,
    originalPotentialWin: null,
    isOpen: false,
    isSettled: true,
    isOddsBoosted: false,
    isSGM: false,
    isSGMMulti: false,
    has90MinBet: true,
    result: "WON",
    edges: {
      legCardGroups: [
        {
          legs: [
            {
              result: "WON",
              parts: [
                {
                  price: {
                    decimal: 1.9,
                    fractional: {},
                  },
                  eventDescription: "Spezia v Entella",
                  eventMarketDescription: "Match Odds 90",
                  marketType: "MATCH_ODDS_90",
                  selectionName: "Spezia",
                  handicap: null,
                  eachwayPlaces: null,
                  eachwayFactor: null,
                  rule4Deductions: 0,
                },
              ],
            },
          ],

          eventHeader: {
            title: "Spezia v Entella",
            tertiaryTitle: "Match Odds 90",
            date: "2023-06-16T11:00:00.000Z",
          },
        },
      ],

      betInfo: {
        betReceiptId: "O/11037374/0002965",
        placedDate: "2023-04-21T09:45:41.000Z",
        settledDate: "2023-06-15T12:48:03.000Z",
      },
    },
  },
]);

const SBK_MULTIPLE_RULE4_MOCK = getMyBetsSBKViewMock([
  {
    betType: "TBL",
    isOpen: false,
    isSettled: true,
    result: "CASHED_OUT",
    profitAndLoss: "0",
    currentSize: 0.1,
    betPrice: buildPrice(9506.25),
    edges: {
      legCardGroups: [
        {
          legs: [
            {
              type: "SS",
              result: "VOID",
              parts: [
                {
                  marketBetUrn: "ppb:marketBet:924.361523814",
                  price: buildPrice(15),
                  originalPrice: buildPrice(15),
                  priceType: "LIVE",
                  eventDescription: "15:35 EVENT 1m 2f 56y",
                  eventMarketDescription: "Win",
                  selectionName: "Soul Sister",
                },
              ],
            },
          ],

          eventHeader: {
            title: "15:35 EVENT 1m 2f 56y",
            tertiaryTitle: "YORK",
            sportId: "7",
            date: "2023-05-17T14:35:00.000Z",
          },
        },
        {
          legs: [
            {
              type: "SS",
              result: "PLACED",
              parts: [
                {
                  price: buildPrice(3.75),
                  originalPrice: buildPrice(3.75),
                  priceType: "LIVE",
                  eventDescription: "14:05 HANDICAP 0m 5f 15y",
                  eventMarketDescription: "Each Way",
                  selectionName: "Jer Batt",
                  eachwayPlaces: 3,
                  eachwayFactor: {
                    numerator: 1,
                    denominator: 5,
                  },
                },
              ],
            },
          ],

          eventHeader: {
            date: "2023-05-10T13:05:00.000Z",
            sportId: "7",
            tertiaryTitle: "CHESTER",
            title: "14:05 HANDICAP 0m 5f 15y",
          },
        },
        {
          legs: [
            {
              type: "SS",
              result: "WON",
              parts: [
                {
                  marketBetUrn: "ppb:marketBet:924.361523786",
                  price: buildPrice(7.5),
                  originalPrice: buildPrice(7.5),
                  priceType: "LIVE",
                  eventDescription: "13:50 HANDICAP 1m 3f 188y",
                  eventMarketDescription: "Win",
                  selectionName: "Thundering",
                  rule4Deductions: 25,
                },
              ],
            },
          ],

          eventHeader: {
            title: "13:50 HANDICAP 1m 3f 188y",
            tertiaryTitle: "YORK",
            sportId: "7",
            date: "2023-05-17T12:50:00.000Z",
          },
        },
      ],

      betInfo: {
        betReceiptId: "O/11037374/0002965",
        placedDate: "2023-04-21T09:45:41.000Z",
        settledDate: "2023-04-21T09:55:00.000Z",
      },
    },
  },
]);

let firstLoad = true;

const browseToMyBets = async (MOCK) => {
  await mockService.mockHttpRequest(getMyBetsLayout(MOCK));
  await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));

  if (firstLoad) {
    firstLoad = false;
    const HOME_VIEW_LINK = getStartViewLink(MY_BETS_SETTLED_URL);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, pullToRefresh: true });
  } else {
    await swipeDownElementFullscreen(sbkBetPanelSO.element);
  }

  await browser.waitUntilDisplayed(cardSO.element);
};

describe("My bets - Settled bets", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      getAppContext({ products: ["SPORTSBOOK"], throttles: { SUPER_SUB_SIGNPOSTING: { isActive: true } } }),
    );
  });

  describe("When a cashed out, single lost bet, with BOG, Each Way, and Rule4 deduction is available", () => {
    beforeAll(async () => {
      await browseToMyBets(SBK_SINGLE_RACING_WITH_EACH_WAY_BOG_AND_RULE4_MOCK);
    });

    it("[PRPI-3148] should not display the status label icon", async () => {
      expect(await betPanelStatusLabelSO.icon.isDisplayed()).toEqual(false);
    });

    it("[PRPI-3149] should display the status label with 'Cashed Out'", async () => {
      expect(await betPanelStatusLabelSO.text.getText()).toEqual("Cashed Out");
    });

    it("[PRPI-3150] should display the BOG label on bet panel", async () => {
      expect(await sbkBetPanelSO.bog.getText()).toEqual("BOG");
    });

    it("[PRPI-3151] should display the info label with 'Rule 4, 5% Deduction.'", async () => {
      expect(await firstInfoLabelSO.label.getText()).toEqual("Rule 4, 5% Deduction.");
    });

    describe("and the user clicks on card", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(cardSO.header);
        await cardSO.header.click();
        await browser.waitUntilDisplayed(cardSO.contentWrapper);

        if (driver.isAndroid) {
          await swipeUp();
          await browser.waitUntilDisplayed(fourthBetInfoItemSO.element);
        }
      });

      afterAll(async () => {
        if (driver.isAndroid) {
          await swipeDown();
        }
      });

      it("[PRPI-3152] should display the BOG label on bet selection", async () => {
        expect(await firstEventFirstBetSelectionDetailsSO.racingLabel.getText()).toEqual("BOG");
      });

      it("[PRPI-3153] should not display the status label icon", async () => {
        expect(await firstEventFirstBetSelectionDetailsStatusLabelSO.icon.isDisplayed()).toEqual(false);
      });

      it("[PRPI-3154] should display the status label with 'Lost'", async () => {
        expect(await firstEventFirstBetSelectionDetailsStatusLabelSO.text.getText()).toEqual("Lost");
      });

      it("[PRPI-3155] should display the bet selection details with 'Each Way: 1/5 Odds, 3 Places | Rule 4, 5% Deduction.'", async () => {
        expect(await firstEventFirstBetSelectionDetailsSO.tertiaryTitle.getText()).toEqual(
          "Each Way: 1/5 Odds, 3 Places | Rule 4, 5% Deduction.",
        );
      });

      it("[PRPI-3156] should display the bet info with 4 lines", async () => {
        expect(await betInfoSO.element.isDisplayed()).toEqual(true);
        expect(await betInfoSO.infoItems.length).toEqual(4);
      });

      it("[PRPI-3157] should display the betfair ID with in first line with the correct data", async () => {
        expect(await firstBetInfoItemSO.label.getText()).not.toEqual("I18N.MYBETS.BETID");
        expect(await firstBetInfoItemSO.contentText.isDisplayed()).toEqual(false);
        expect(await firstCopyToClipboardSO.contentLabel.getText()).toEqual("O/11037374/0002965");
      });

      it("[PRPI-3158] should display the betfair regulatory ID in the second line with the correct data", async () => {
        expect(await secondBetInfoItemSO.label.getText()).toEqual("ID");
        expect(await secondBetInfoItemSO.contentText.isDisplayed()).toEqual(false);
        expect(await secondCopyToClipboardSO.contentLabel.getText()).toEqual("bc000000001c17979f05");
      });

      it("[PRPI-3159] should display the place date in the third line with the correct data", async () => {
        expect(await thirdBetInfoItemSO.label.getText()).toEqual("Placed");
        // iOS vs Android
        expect(["April 21, 2023 at 10:45", "April 21, 2023, 10:45"]).toContain(
          await thirdBetInfoItemSO.contentText.getText(),
        );

        expect(await thirdCopyToClipboardSO.contentLabel.isDisplayed()).toEqual(false);
      });

      it("[PRPI-3160] should display the settled date in the fourth line with the correct data", async () => {
        expect(await fourthBetInfoItemSO.label.getText()).toEqual("Settled");
        // iOS vs Android
        expect(["April 21, 2023 at 10:55", "April 21, 2023, 10:55"]).toContain(
          await fourthBetInfoItemSO.contentText.getText(),
        );

        expect(await fourthCopyToClipboardSO.contentLabel.isDisplayed()).toEqual(false);
      });
    });
  });

  describe("When a won single bet, with free bets, odds boost and acca insurance token is available", () => {
    beforeAll(async () => {
      await browseToMyBets(SBK_SINGLE_SPECIAL_WITH_ODDS_BOOST_FREE_BETS_AND_ACCA_INSURANCE_TOKEN_MOCK);
      await browser.waitUntilEquals(betPanelStatusLabelSO.text, "Won");
    });

    it("[PRPI-4709] should display the status label with 'Won'", async () => {
      expect(await betPanelStatusLabelSO.text.getText()).toEqual("Won");
    });

    it("[PRPI-4708] should not display the previous returns value", async () => {
      expect(await rightSelectionSegmentProfitSO.previousPnl.isDisplayed()).toEqual(false);
    });

    it("[PRPI-4710] should display the returns value with '$0.15'", async () => {
      expect(await rightSelectionSegmentProfitSO.pnl.getText()).toEqual("$0.15");
    });

    it("[PRPI-3164] should display the boost icon", async () => {
      expect(await firstInfoLabelSO.icon.isDisplayed()).toEqual(true);
    });

    it("[PRPI-3165] should display the boost label with 'Bet Boost Applied'", async () => {
      expect(await firstInfoLabelSO.label.getText()).toEqual("Bet Boost Applied");
    });

    it("[PRPI-3166] should display the previous odds with '1.36'", async () => {
      expect(await infoLabelOddsSO.previousOdds.getText()).toEqual("1.36");
    });

    it("[PRPI-3167] should display the odds with '1.4'", async () => {
      expect(await infoLabelOddsSO.odds.getText()).toEqual("1.4");
    });

    it("[PRPI-4711] should display the free bets icon", async () => {
      expect(await secondInfoLabelSO.icon.isDisplayed()).toEqual(true);
    });

    it("[PRPI-4712] should display the free bets with 'Used $0.11 Free Bet'", async () => {
      expect(await secondInfoLabelSO.label.getText()).toEqual("Used $0.11 Free Bet");
    });

    it("[PRPI-4713] should display the acca insurance token icon", async () => {
      expect(await thirdInfoLabelSO.icon.isDisplayed()).toEqual(true);
    });

    it("[PRPI-4714] should display the acca insurance token label with 'Second Chance Applied'", async () => {
      expect(await thirdInfoLabelSO.label.getText()).toEqual("Second Chance Applied");
    });

    it("[PRPI-3756] should display the super sub icon", async () => {
      expect(await sportsbookBetCardSO.superSubIconContainer.isDisplayed()).toEqual(true);
    });

    describe("When the user clicks on card", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(cardSO.header);
        await cardSO.header.click();
        await browser.waitUntilDisplayed(cardSO.contentWrapper);
      });

      it("[PRPI-3168] should display the previous odds value with '1.36'", async () => {
        expect(await firstEventFirstBetSelectionDetailsOddsSO.previousOdds.isDisplayed()).toEqual(true);
        expect(await firstEventFirstBetSelectionDetailsOddsSO.previousOdds.getText()).toEqual("1.36");
      });

      it("[PRPI-3169] should display the odds value with '@ 1.4'", async () => {
        expect(await firstEventFirstBetSelectionDetailsOddsSO.odds.isDisplayed()).toEqual(true);
        expect(await firstEventFirstBetSelectionDetailsOddsSO.odds.getText()).toEqual("@ 1.4");
      });

      it("[PRPI-3170] should not display the status label icon", async () => {
        expect(await firstEventFirstBetSelectionDetailsStatusLabelSO.icon.isDisplayed()).toEqual(false);
      });

      it("[PRPI-3171] should display the status label 'Won'", async () => {
        expect(await firstEventFirstBetSelectionDetailsStatusLabelSO.text.getText()).toEqual("Won");
      });

      it("[PRPI-3172] should display the bet info with 3 lines", async () => {
        expect(await betInfoSO.element.isDisplayed()).toEqual(true);
        expect(await betInfoSO.infoItems.length).toEqual(3);
      });
    });
  });

  describe("When a won single bet, with 90 minute match odds market", () => {
    beforeAll(async () => {
      await browseToMyBets(SBK_SINGLE_90_MIN_MARKET);
    });

    it("[PRPI-3173] should display the status label 'Won'", async () => {
      expect(await betPanelStatusLabelSO.text.getText()).toEqual("Won");
    });

    it("[PRPI-3174] should display the 90-minute guarantee label", async () => {
      expect(await firstInfoLabelSO.label.getText()).toEqual("90 Minute Guarantee");
    });
  });

  describe("When a cashed out multiple bet with Rule4 deduction is available", () => {
    beforeAll(async () => {
      await browseToMyBets(SBK_MULTIPLE_RULE4_MOCK);
      await browser.waitUntilEquals(betPanelStatusLabelSO.text, "Cashed Out");
    });

    it("[PRPI-3175] should display the status label with 'Cashed Out'", async () => {
      expect(await betPanelStatusLabelSO.text.getText()).toEqual("Cashed Out");
    });

    it("[PRPI-3176] should display the info label with 'Rule 4 - Deduction.'", async () => {
      expect(await firstInfoLabelSO.label.getText()).toEqual("Rule 4 - Deduction.");
    });

    describe("When the user clicks on card", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(cardSO.header);
        await cardSO.header.click();
        await browser.waitUntilDisplayed(cardSO.contentWrapper);
        await swipeUp();
        await browser.waitUntilDisplayed(betInfoSO.element);
      });

      describe("and on first card group", () => {
        it("[PRPI-3177] should display the status label with 'Void'", async () => {
          expect(await firstEventFirstBetSelectionDetailsStatusLabelSO.text.getText()).toEqual("Void");
        });
      });

      describe("and on second card group", () => {
        it("[PRPI-3178] should display the status label with 'Placed'", async () => {
          expect(await secondEventFirstBetSelectionDetailsStatusLabelSO.text.getText()).toEqual("Placed");
        });
      });

      describe("and on third card group", () => {
        it("[PRPI-3179] should display the status label with 'Won'", async () => {
          expect(await thirdEventFirstBetSelectionDetailsStatusLabelSO.text.getText()).toEqual("Won");
        });

        it("[PRPI-3180] should display the bet selection details with 'Rule 4, 25% Deduction.'", async () => {
          expect(await thirdEventFirstBetSelectionDetailsSO.tertiaryTitle.getText()).toEqual("Rule 4, 25% Deduction.");
        });
      });

      it("[PRPI-3181] should display the bet info with 3 lines", async () => {
        expect(await betInfoSO.element.isDisplayed()).toEqual(true);
        expect(await betInfoSO.infoItems.length).toEqual(3);
      });
    });
  });
});
