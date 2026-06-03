const RaceDetailsSO = require("@ppb/tbd-shared/components/RaceDetailsCard/RaceDetailsCard.native.so");

const { getMyBetsLayout, getAppContext, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const SportsbookExpandableLegCardGroupSO = require("@ppb/tbd-shared/components/SportsbookExpandableLegCardGroup/SportsbookExpandableLegCardGroup.native.so");
const { startApp } = require("../../../../helpers/urls");
const { swipeDownElementFullscreen } = require("../../../../helpers/gestures");

const MockService = require("../../../../mock-essentials/mocking-service");

const {
  MyBetsScreenSO,
  BottomBarSO,
  SportsbookBetPanelSO,
  BetSegmentsSO,
  CardSO,
  BetSelectionDetailsSO,
  BetInfoSO,
  SnackbarSO,
  InfoLabelSO,
  OddsSO,
  EventHeaderSO,
  PNLAndWhatIfSO,
  TeamsSO,
  DurationSO,
  TeamSO,
  BetInfoItemSO,
  CopyToClipboardSO,
  SelectionSegmentSO,
} = require("../../../../screen-objects");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsSO = new MyBetsScreenSO();
const sbkBetPanelSO = new SportsbookBetPanelSO(myBetsSO.betCardGroups[0]);
const betSegmentsSO = new BetSegmentsSO(myBetsSO.betCardGroups[0]);

const midSelectionSegmentSO = new SelectionSegmentSO(betSegmentsSO.midSegment);
const midSelectionSegmentStakeSO = new OddsSO(betSegmentsSO.midSegment);
const rightSelectionSegmentSO = new SelectionSegmentSO(betSegmentsSO.rightSegment);
const rightSelectionSegmentProfitSO = new PNLAndWhatIfSO(betSegmentsSO.rightSegment);

const sportsbookExpandableLegCardGroupSO = new SportsbookExpandableLegCardGroupSO();
const cardSO = new CardSO(sportsbookExpandableLegCardGroupSO.element);
const raceDetailsSO = new RaceDetailsSO();
const betSelectionDetailsSO = new BetSelectionDetailsSO();
const betInfoSO = new BetInfoSO();
const firstBetInfoItemSO = new BetInfoItemSO(betInfoSO.infoItems[0]);
const secondBetInfoItemSO = new BetInfoItemSO(betInfoSO.infoItems[1]);
const thirdBetInfoItemSO = new BetInfoItemSO(betInfoSO.infoItems[2]);

const firstCopyToClipboardSO = new CopyToClipboardSO(firstBetInfoItemSO.element);
const secondCopyToClipboardSO = new CopyToClipboardSO(secondBetInfoItemSO.element);
const thirdCopyToClipboardSO = new CopyToClipboardSO(thirdBetInfoItemSO.element);

const snackbarSO = new SnackbarSO();
const infoLabelSO = new InfoLabelSO();
const infoLabelOddsSO = new OddsSO(infoLabelSO.odds);
const betSelectionDetailsOddsSO = new OddsSO(betSelectionDetailsSO.element);

const eventHeaderSO = new EventHeaderSO();
const teamsSO = new TeamsSO();
const durationSO = new DurationSO();
const firstTeam = new TeamSO(teamsSO.firstTeam);
const secondTeam = new TeamSO(teamsSO.secondTeam);

const buildPrice = (price) => ({
  decimal: price,
  fractional: {
    numerator: price * 100,
    denominator: 100,
  },
});

const SBK_MATCH_ODDS_90_SINGLE = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    isOpen: true,
    profitAndLoss: 0.52,
    currentSize: 0.1,
    betPrice: buildPrice(1.95),
    edges: {
      legCardGroups: [
        {
          legs: [
            {
              parts: [
                {
                  price: buildPrice(1.95),
                  originalPrice: buildPrice(1.95),
                  eventDescription: "Newcastle v Brighton",
                  eventMarketDescription: "Match Odds 90",
                  marketType: "MATCH_ODDS_90",
                  selectionName: "Newcastle",
                },
              ],
            },
          ],

          footballFixture: {
            homeName: "Newcastle",
            awayName: "Brighton",
            scheduledAt: "2023-05-18T18:30:00.000Z",
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

let firstLoad = true;

const browseToMyBets = async (MOCK) => {
  await mockService.mockHttpRequest(getAppContext());
  await mockService.mockHttpRequest(getMyBetsLayout(MOCK));
  await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));

  if (firstLoad) {
    firstLoad = false;
    await startApp("home", { pullToRefresh: true });
    await browser.waitUntilClickableNative(BottomBarSO.myBets);
    await BottomBarSO.myBets.click();
  } else {
    await swipeDownElementFullscreen(sbkBetPanelSO.element);
  }

  await browser.waitUntilDisplayed(cardSO.element);
};

describe("My Bets - SBK Singles", () => {
  describe("When the user has a racing single bet with Each Way, BOG and was placed with free bets", () => {
    beforeAll(async () => {
      await browseToMyBets(SBK_SINGLE_RACING_WITH_EACH_WAY_BOG_AND_FREE_BET_MOCK);
    });

    it("[PRPI-3182] should display the title header as 'Single @ 1.61'", async () => {
      expect(await sbkBetPanelSO.panelTitle.isDisplayed()).toEqual(true);
      expect(await sbkBetPanelSO.panelTitle.getText()).toEqual("Single @ 1.61");
    });

    it("[PRPI-3183] should display the expected supportingText", async () => {
      expect(await sbkBetPanelSO.sbkBetPanelSupportingText.getText()).toEqual("Gitche Gumee");
    });

    it("[PRPI-3184] should display the market blurb with 'BOG'", async () => {
      expect(await sbkBetPanelSO.bog.getText()).toEqual("BOG");
    });

    it("[PRPI-3185] should display the bet segments", async () => {
      expect(await betSegmentsSO.element.isDisplayed()).toEqual(true);
    });

    it("[PRPI-3186] should display the stake label", async () => {
      expect(await midSelectionSegmentSO.term.getText()).toEqual("Stake");
    });

    it("[PRPI-3187] should display the returns label", async () => {
      expect(await rightSelectionSegmentSO.term.getText()).toEqual("Returns");
    });

    it("[PRPI-3188] should display the stake value with '$0.10'", async () => {
      expect(await midSelectionSegmentStakeSO.odds.getText()).toEqual("$0.10");
    });

    it("[PRPI-3189] should display the returns value with '$0.16'", async () => {
      expect(await rightSelectionSegmentProfitSO.pnl.getText()).toEqual("$0.16");
    });

    it("[PRPI-3190] should display the free bets icon", async () => {
      expect(await infoLabelSO.icon.isDisplayed()).toEqual(true);
    });

    it("[PRPI-3191] should display the free bets with 'Used $0.10 Free Bet'", async () => {
      expect(await infoLabelSO.label.getText()).toEqual("Used $0.10 Free Bet");
    });

    it("[PRPI-3192] should display the card with show indication", async () => {
      expect(await cardSO.element.isDisplayed()).toEqual(true);
      await browser.waitUntilEquals(cardSO.title, "Show Selection Info", {
        errorMessage: `Card title is ${cardSO.title.getText()}`,
      });
    });

    it("[PRPI-3193] should display the card chevron as collapsed", async () => {
      expect(await cardSO.header.isDisplayed()).toEqual(true);
      expect(await cardSO.contentWrapper.isDisplayed()).toEqual(false);
    });

    describe("and the user clicks on card", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(cardSO.header);
        await cardSO.header.click();
        await browser.waitUntilDisplayed(cardSO.contentWrapper);
        await browser.waitUntilDisplayed(raceDetailsSO.element);
      });

      it("[PRPI-3194] should display the card with hide indication", async () => {
        expect(await cardSO.title.getText()).toEqual("Hide Selection Info");
      });

      it("[PRPI-3195] should display the card chevron as expanded", async () => {
        expect(await cardSO.contentWrapper.isDisplayed()).toEqual(true);
      });

      it("[PRPI-3196] should display the race details", async () => {
        expect(await raceDetailsSO.element.isDisplayed()).toEqual(true);
      });

      it("[PRPI-3197] should display the bet selection details", async () => {
        expect(await betSelectionDetailsSO.element.isDisplayed()).toEqual(true);
      });

      it("[PRPI-3198] should display the selection name with 'Gitche Gumee'", async () => {
        expect(await betSelectionDetailsSO.title.getText()).toEqual("Gitche Gumee");
      });

      it("[PRPI-3199] should display the BOG label", async () => {
        expect(await betSelectionDetailsSO.racingLabel.isDisplayed()).toEqual(true);
        expect(await betSelectionDetailsSO.racingLabel.getText()).toEqual("BOG");
      });

      it("[PRPI-3200] should display the odds value with '@ 1.61'", async () => {
        expect(await betSelectionDetailsOddsSO.odds.getText()).toEqual("@ 1.61");
      });

      it("[PRPI-3201] should display the market name with 'Each Way'", async () => {
        expect(await betSelectionDetailsSO.subtitle.getText()).toEqual("Each Way");
      });

      it("[PRPI-3202] should display the information as 'Each Way: 1/5 Odds, 3 Places'", async () => {
        expect(await betSelectionDetailsSO.tertiaryTitle.getText()).toEqual("Each Way: 1/5 Odds, 3 Places");
      });

      it("[PRPI-3203] should display the bet info with 3 lines", async () => {
        expect(await betInfoSO.element.isDisplayed()).toEqual(true);
        expect(await betInfoSO.infoItems.length).toEqual(3);
      });

      it("[PRPI-3204] should display the betfair ID with in first line with the correct data", async () => {
        expect(await firstBetInfoItemSO.label.getText()).not.toEqual("I18N.MYBETS.BETID");
        expect(await firstBetInfoItemSO.contentText.isDisplayed()).toEqual(false);
        expect(await firstCopyToClipboardSO.contentLabel.getText()).toEqual("O/11037374/0002965");
      });

      it("[PRPI-3205] should display the betfair regulatory ID in the second line with the correct data", async () => {
        expect(await secondBetInfoItemSO.label.getText()).toEqual("ID");
        expect(await secondBetInfoItemSO.contentText.isDisplayed()).toEqual(false);
        expect(await secondCopyToClipboardSO.contentLabel.getText()).toEqual("bc000000001c17979f05");
      });

      it("[PRPI-3206] should display the place date in the third line with the correct data", async () => {
        expect(await thirdBetInfoItemSO.label.getText()).toEqual("Placed");
        // iOS vs Android
        expect(["April 21, 2023 at 10:45", "April 21, 2023, 10:45"]).toContain(
          await thirdBetInfoItemSO.contentText.getText(),
        );

        expect(await thirdCopyToClipboardSO.contentLabel.isDisplayed()).toEqual(false);
      });

      xdescribe("and the user clicks on betfair ID", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(firstCopyToClipboardSO.contentLabel);
          await firstCopyToClipboardSO.contentLabel.click();
          await browser.waitUntilDisplayed(snackbarSO.element);
        });

        it("[PRPI-3207] should display the snack bar with copied to clipboard info", async () => {
          expect(await snackbarSO.element.isDisplayed()).toEqual(true);
          expect(await snackbarSO.title.getText()).toEqual("Betfair ID has been copied to clipboard.");
        });
      });
    });
  });

  describe("When the user has a 90 minute bet", () => {
    beforeAll(async () => {
      await browseToMyBets(SBK_MATCH_ODDS_90_SINGLE);
    });

    it("[PRPI-3208] should display the card with show indication", async () => {
      expect(await cardSO.element.isDisplayed()).toEqual(true);
      await browser.waitUntilEquals(cardSO.title, "Show Selection Info", {
        errorMessage: `Card title is ${cardSO.title.getText()}`,
      });
    });

    describe("and the user clicks on card", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(cardSO.header);
        await cardSO.header.click();
        await browser.waitUntilDisplayed(cardSO.contentWrapper);
      });

      it("[PRPI-3209] should display the bet selection details", async () => {
        expect(await betSelectionDetailsSO.element.isDisplayed()).toEqual(true);
      });

      it("[PRPI-3210] should display the selection name with 'Newcastle'", async () => {
        expect(await betSelectionDetailsSO.title.getText()).toEqual("Newcastle");
      });

      it("[PRPI-3211] should display the market name with 'Match Odds 90'", async () => {
        expect(await betSelectionDetailsSO.subtitle.getText()).toEqual("Match Odds 90");
      });

      it("[PRPI-3212] should display the Ninety minute icon", async () => {
        expect(await betSelectionDetailsSO.icon90Min.isDisplayed()).toEqual(true);
      });
    });
  });

  describe("When the user has a special bet from a non SCA sport with boost", () => {
    beforeAll(async () => {
      await browseToMyBets(SBK_SINGLE_SPECIAL_WITH_ODDS_BOOST_MOCK);
    });

    it("[PRPI-3213] should display the title header with 'Single @ 1.4'", async () => {
      expect(await sbkBetPanelSO.panelTitle.isDisplayed()).toEqual(true);
      expect(await sbkBetPanelSO.panelTitle.getText()).toEqual("Single @ 1.4");
    });

    it("[PRPI-3214] should display the previous returns value with '$0.14'", async () => {
      expect(await rightSelectionSegmentProfitSO.previousPnl.getText()).toEqual("$0.14");
    });

    it("[PRPI-3215] should display the returns value with '$0.15'", async () => {
      expect(await rightSelectionSegmentProfitSO.pnl.getText()).toEqual("$0.15");
    });

    it("[PRPI-3216] should display the boost icon", async () => {
      expect(await infoLabelSO.icon.isDisplayed()).toEqual(true);
    });

    it("[PRPI-3217] should display the boost label with 'Bet Boost Applied'", async () => {
      expect(await infoLabelSO.label.getText()).toEqual("Bet Boost Applied");
    });

    it("[PRPI-3218] should display the previous odds with '1.36'", async () => {
      expect(await infoLabelOddsSO.previousOdds.getText()).toEqual("1.36");
    });

    it("[PRPI-3219] should display the odds with '1.4'", async () => {
      expect(await infoLabelOddsSO.odds.getText()).toEqual("1.4");
    });

    describe("and the user clicks on card", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(cardSO.header);
        await cardSO.header.click();
        await browser.waitUntilDisplayed(cardSO.contentWrapper);
        await browser.waitUntilDisplayed(eventHeaderSO.element);
      });

      it("[PRPI-3220] should display the event header", async () => {
        expect(await eventHeaderSO.element.isDisplayed()).toEqual(true);
      });

      it("[PRPI-3221] should display the competition name with '#WhatOddsPaddy'", async () => {
        expect(await firstTeam.name.getText()).toEqual("#WhatOddsPaddy");
      });

      it("[PRPI-3222] should display the event name with 'Cheltenham Antepost Doubles'", async () => {
        expect(await secondTeam.name.getText()).toEqual("Cheltenham Antepost Doubles");
      });

      it("[PRPI-3223] should display the event formatted date", async () => {
        expect(await durationSO.date.getText()).toEqual("Apr 15");
        expect(await durationSO.time.getText()).toEqual("16:50");
      });

      it("[PRPI-3224] should display the selection name with 'Gitche Gumee'", async () => {
        expect(await betSelectionDetailsSO.title.getText()).toEqual("Gitche Gumee");
      });

      it("[PRPI-3225] should display the previous odds value with '1.36'", async () => {
        expect(await betSelectionDetailsOddsSO.previousOdds.isDisplayed()).toEqual(true);
        expect(await betSelectionDetailsOddsSO.previousOdds.getText()).toEqual("1.36");
      });

      it("[PRPI-3226] should display the odds value with '@ 1.4'", async () => {
        expect(await betSelectionDetailsOddsSO.odds.isDisplayed()).toEqual(true);
        expect(await betSelectionDetailsOddsSO.odds.getText()).toEqual("@ 1.4");
      });

      it("[PRPI-3227] should display the market name with 'Win'", async () => {
        expect(await betSelectionDetailsSO.subtitle.getText()).toEqual("Win");
      });

      it("[PRPI-3228] should display the bet info with 2 lines", async () => {
        expect(await betInfoSO.element.isDisplayed()).toEqual(true);
        expect(await betInfoSO.infoItems.length).toEqual(2);
      });

      it("[PRPI-3229] should display the betfair ID with in first line with the correct data", async () => {
        expect(await firstBetInfoItemSO.label.getText()).not.toEqual("I18N.MYBETS.BETID");
        expect(await firstBetInfoItemSO.contentText.isDisplayed()).toEqual(false);
        expect(await firstCopyToClipboardSO.contentLabel.getText()).toEqual("O/11037374/0002965");
      });

      it("[PRPI-3230] should display the place date in the second line with the correct data", async () => {
        expect(await secondBetInfoItemSO.label.getText()).toEqual("Placed");
        // iOS vs Android
        expect(["March 13, 2023 at 11:13", "March 13, 2023, 11:13"]).toContain(
          await secondBetInfoItemSO.contentText.getText(),
        );

        expect(await secondCopyToClipboardSO.contentLabel.isDisplayed()).toEqual(false);
      });
    });
  });

  describe("When the user has a Forecast bet", () => {
    beforeAll(async () => {
      await browseToMyBets(SBK_SINGLE_FORECAST_TRICAST_MOCK);
      await browser.waitUntilEquals(sbkBetPanelSO.panelTitle, "Single @ 2 Lines");
    });

    it("[PRPI-3231] should display the title header with 'Single @ 2 Lines'", async () => {
      expect(await sbkBetPanelSO.panelTitle.getText()).toEqual("Single @ 2 Lines");
    });

    it("[PRPI-3232] should display the supportingText with 'Book Of Tales / Kilcummin'", async () => {
      expect(await sbkBetPanelSO.sbkBetPanelSupportingText.getText()).toEqual("Book Of Tales / Kilcummin");
    });

    it("[PRPI-3233] should display the returns value with 'TBD'", async () => {
      expect(await rightSelectionSegmentProfitSO.pnl.getText()).toEqual("TBD");
    });

    describe("and the user clicks on card", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(cardSO.header);
        await cardSO.header.click();
        await browser.waitUntilDisplayed(cardSO.contentWrapper);
        await browser.waitUntilDisplayed(raceDetailsSO.element);
      });

      it("[PRPI-3234] should display the race details", async () => {
        expect(await raceDetailsSO.element.isDisplayed()).toEqual(true);
      });

      it("[PRPI-3235] should display the selection name with 'Book Of Tales / Kilcummin'", async () => {
        expect(await betSelectionDetailsSO.title.getText()).toEqual("Book Of Tales / Kilcummin");
      });

      it("[PRPI-3236] should not display the odds value", async () => {
        expect(await betSelectionDetailsOddsSO.odds.isDisplayed()).toEqual(false);
      });

      it("[PRPI-3237] should display the market name with 'Reverse Forecast'", async () => {
        expect(await betSelectionDetailsSO.subtitle.getText()).toEqual("Reverse Forecast");
      });

      it("[PRPI-3238] should display the bet info", async () => {
        expect(await betInfoSO.element.isDisplayed()).toEqual(true);
        expect(await betInfoSO.infoItems.length).toEqual(2);
      });
    });
  });
});
