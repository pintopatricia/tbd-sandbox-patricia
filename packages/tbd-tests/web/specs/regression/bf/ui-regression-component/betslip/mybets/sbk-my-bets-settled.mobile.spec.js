const SportsbookExpandableLegCardGroupPO = require("@ppb/tbd-shared/components/SportsbookExpandableLegCardGroup/SportsbookExpandableLegCardGroup.web.po");
const SportsbookBetLegCardGroupPO = require("@ppb/tbd-shared/components/SportsbookBetLegCardGroup/SportsbookBetLegCardGroup.web.po");
const BetCardGroupPO = require("@ppb/tbd-shared/components/BetCardGroup/BetCardGroup.web.po");
const SportsbookBetCardPO = require("@ppb/tbd-shared/components/SportsbookBetCard/SportsbookBetCard.web.po");

const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const {
  MyBetsPagePO,
  SportsbookBetPanelPO,
  CardPO,
  BetSelectionDetailsPO,
  BetInfoPO,
  BetInfoItemPO,
  OddsPO,
  StatusLabelPO,
  InfoLabelPO,
  LabelPO,
  BetSegmentsPO,
  PNLAndWhatIfPO,
  FootballScoreboardPO,
  AvBScoreboardPO,
  CopyToClipboardPO,
} = require("../../../../../../page-objects");

const routes = require("../../../../../../../utils/routes");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../../mock-essentials/mocking-service");
const { HEADER_ITEMS_MOCK, GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsPO = new MyBetsPagePO();

const betCardGroupPO = new BetCardGroupPO(myBetsPO.betCardGroups[0]);
const sportsbookBetCardPO = new SportsbookBetCardPO(betCardGroupPO.groupItems[0]);

const sbkBetPanelPO = new SportsbookBetPanelPO(myBetsPO.betCardGroups[0]);

const firstInfoLabelPO = new InfoLabelPO(sbkBetPanelPO.infoLabels[0]);
const secondInfoLabelPO = new InfoLabelPO(sbkBetPanelPO.infoLabels[1]);
const thirdInfoLabelPO = new InfoLabelPO(sbkBetPanelPO.infoLabels[2]);

const infoLabelOddsPO = new OddsPO(firstInfoLabelPO.odds);

const betSegmentsPO = new BetSegmentsPO(myBetsPO.betCardGroups[0]);
const betSegmentsReturnsPO = new PNLAndWhatIfPO(betSegmentsPO.rightValue);

const betPanelStatusLabelPO = new StatusLabelPO(sbkBetPanelPO.element);

const cardPO = new CardPO();

const sportsbookExpandableLegCardGroupPO = new SportsbookExpandableLegCardGroupPO();
const firstSportsbookBetLegCardGroupPO = new SportsbookBetLegCardGroupPO(sportsbookExpandableLegCardGroupPO.cards[0]);
const secondSportsbookBetLegCardGroupPO = new SportsbookBetLegCardGroupPO(sportsbookExpandableLegCardGroupPO.cards[1]);
const thirdSportsbookBetLegCardGroupPO = new SportsbookBetLegCardGroupPO(sportsbookExpandableLegCardGroupPO.cards[2]);

// 1st bet leg card group
const firstEventFirstBetSelectionDetailsPO = new BetSelectionDetailsPO(firstSportsbookBetLegCardGroupPO.cards[0]);
const firstEventFirstBetSelectionDetailsLabelPO = new LabelPO(firstEventFirstBetSelectionDetailsPO.racingLabel);
const firstEventFirstBetSelectionDetailsStatusLabelPO = new StatusLabelPO(firstEventFirstBetSelectionDetailsPO.element);
const firstEventFirstBetSelectionDetailsOddsPO = new OddsPO(firstEventFirstBetSelectionDetailsPO.element);

// 2nd bet leg card group
const secondEventFirstBetSelectionDetailsPO = new BetSelectionDetailsPO(secondSportsbookBetLegCardGroupPO.cards[0]);
const secondEventFirstBetSelectionDetailsStatusLabelPO = new StatusLabelPO(
  secondEventFirstBetSelectionDetailsPO.element,
);

// 3rd bet leg card group
const thirdEventFirstBetSelectionDetailsPO = new BetSelectionDetailsPO(thirdSportsbookBetLegCardGroupPO.cards[0]);
const thirdEventFirstBetSelectionDetailsStatusLabelPO = new StatusLabelPO(thirdEventFirstBetSelectionDetailsPO.element);

const betInfoPO = new BetInfoPO();
const firstBetInfoItemPO = new BetInfoItemPO(betInfoPO.infoItems[0]);
const secondBetInfoItemPO = new BetInfoItemPO(betInfoPO.infoItems[1]);
const thirdBetInfoItemPO = new BetInfoItemPO(betInfoPO.infoItems[2]);
const fourthBetInfoItemPO = new BetInfoItemPO(betInfoPO.infoItems[3]);

const firstCopyToClipboardPO = new CopyToClipboardPO(firstBetInfoItemPO.element);
const secondCopyToClipboardPO = new CopyToClipboardPO(secondBetInfoItemPO.element);
const thirdCopyToClipboardPO = new CopyToClipboardPO(thirdBetInfoItemPO.element);
const fourthCopyToClipboardPO = new CopyToClipboardPO(fourthBetInfoItemPO.element);

const footballScoreboardPO = new FootballScoreboardPO();
const avbScoreboardPO = new AvBScoreboardPO();

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

              eventHeader: {
                date: "2023-05-10T13:05:00.000Z",
                sportId: "7",
                tertiaryTitle: "CHESTER",
                title: "14:05 HANDICAP 0m 5f 15y",
              },
            },
          ],
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

const SBK_BET_CARD_FULL = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:926229536",
    bet: {
      urn: "ppb:sbkBet:926229536",
      betReceiptId: "O/4275336/0021305",
      profitAndLoss: 0.22,
      isSettled: true,
      betType: "SGL",
      currentSize: 0.12,
      result: "CASHED_OUT",
      legs: [
        {
          __typename: "BetLeg",
          result: "PLACED",
          parts: [
            {
              price: {
                decimal: 1.86,
              },
              marketBetUrn: "ppb:marketBet:924.237747664",
              startTime: "2020-07-27T19:00:00.000Z",
            },
          ],
        },
      ],
    },
  },
};

const SBK_BET_CARD_TENNIS_SCOREBOARD_INPLAY_EXPANDABLE = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: "ppb:tbd:card:group:sbkExpandableLeg:926229536",
    full: {
      edges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
            full: {
              edges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
                    betUrn: "ppb:sbkBet:926229536",
                    leg: {
                      result: "PLACED",
                      parts: [
                        {
                          price: {
                            decimal: 1.86,
                          },
                          startTime: "2020-07-27T19:00:00.000Z",
                        },
                      ],
                    },
                  },
                },
                {
                  node: {
                    __typename: "FixtureCard",
                    urn: "ppb:tbd:card:fixture:31111111|viewLink|0",
                    fixture: {
                      __typename: "TennisMatch",
                      urn: `ppb:fixture:31111111`,
                      runnerNames: {
                        home: "Reeves/OtherGuyFromTheMatrix",
                        away: "Keeves/GuyFromFriends",
                      },
                      scheduledStartTime: "2032-01-16T20:00:00Z",
                      matchStatus: {
                        status: "IN_RUNNING",
                        reason: null,
                      },
                      teamA: {
                        side: "HOME",
                        players: [{ name: "Keanu Reeves", rank: 420 }],
                      },
                      teamB: {
                        side: "AWAY",
                        players: [{ name: "Reanu Keeves", rank: 69 }],
                      },
                    },
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
            betReceiptId: "O/4275336/0021305",
          },
        },
      ],
    },
  },
};

const BFF_MY_BETS_MOCK_TENNIS_SCOREBOARD_IN_PLAY = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:settled",
  url: routes.getMyBetsViewUrl("settled"),
  edges: [
    {
      node: {
        __typename: "BetCardGroup",
        urn: "ppb:tbd:card:bet:group:926229536|sbk",
        full: {
          edges: [SBK_BET_CARD_FULL, SBK_BET_CARD_TENNIS_SCOREBOARD_INPLAY_EXPANDABLE],
        },
      },
    },
  ],
  headerItems: HEADER_ITEMS_MOCK,
};

const SBK_SINGLE_FOOTBALL_BET_MOCK = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    isOpen: false,
    isSettled: true,
    profitAndLoss: 0.52,
    currentSize: 0.1,
    betPrice: buildPrice(5.2),
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
                  eventMarketDescription: "Match Odds",
                  selectionName: "Newcastle",
                },
              ],
            },
          ],

          footballFixture: {
            homeName: "Newcastle",
            awayName: "Brighton",
            scheduledAt: "2023-05-18T18:30:00.000Z",
            score: { home: 2, away: 2 },
            duration: {
              period: "EXTRA",
              status: "HALF",
              clock: {
                minute: 114,
                second: 0,
              },
            },
          },
        },
      ],

      betInfo: {
        betReceiptId: "O/11037374/0002965",
        placedDate: "2023-04-21T09:45:41.000Z",
        deviceId: "Internet - Browser - Mac",
      },
    },
  },
]);

const browseToMyBets = async (MOCK, MOCK_OBJECT = {}) => {
  const mockOptions = { products: ["sportsbook"], SUPER_SUB_SIGNPOSTING: { isActive: true }, ...MOCK_OBJECT };

  await mockService.mockHttpRequest(await getIndexHTML(MOCK.urn, mockOptions));
  await mockService.mockHttpRequest(getMyBetsLayout(MOCK));
  await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
  await browser.url(routes.getMyBetsViewUrl("open"));
  await browser.waitUntilInViewport(cardPO.element);
};

describe("My bets - Settled bets", () => {
  beforeAll(async () => {
    await browseToMyBets(SBK_SINGLE_RACING_WITH_EACH_WAY_BOG_AND_RULE4_MOCK);
  });

  describe("When a cashed out, single lost bet, with BOG, Each Way, and Rule4 deduction is available", () => {
    it("[PRPI-8287] should not display the status label icon", async () => {
      expect(await betPanelStatusLabelPO.icon.isDisplayed()).toEqual(false);
    });

    it("[PRPI-8288] should display the status label with 'Cashed Out'", async () => {
      expect(await betPanelStatusLabelPO.text.getText()).toEqual("Cashed Out");
    });

    it("[PRPI-8289] should display the BOG label on bet panel", async () => {
      expect(await sbkBetPanelPO.bog.getText()).toEqual("BOG");
    });

    it("[PRPI-8290] should display the info label with 'Rule 4, 5% Deduction.'", async () => {
      expect(await firstInfoLabelPO.label.getText()).toEqual("Rule 4, 5% Deduction.");
    });

    describe("and the user clicks on card", () => {
      beforeAll(async () => {
        await cardPO.header.waitForClickable();
        await cardPO.header.click();
        await browser.waitUntilDisplayed(cardPO.content);
        await browser.waitUntilDisplayed(betInfoPO.element);
      });

      it("[PRPI-8291] should display the BOG label on bet selection", async () => {
        expect(await firstEventFirstBetSelectionDetailsLabelPO.element.getText()).toEqual("BOG");
      });

      it("[PRPI-8292] should not display the status label icon", async () => {
        expect(await firstEventFirstBetSelectionDetailsStatusLabelPO.icon.isDisplayed()).toEqual(false);
      });

      it("[PRPI-8293] should display the status label with 'Lost'", async () => {
        expect(await firstEventFirstBetSelectionDetailsStatusLabelPO.text.getText()).toEqual("Lost");
      });

      it("[PRPI-8294] should display the bet selection details with 'Each Way: 1/5 Odds, 3 Places | Rule 4, 5% Deduction.'", async () => {
        expect(await firstEventFirstBetSelectionDetailsPO.tertiaryTitle.getText()).toEqual(
          "Each Way: 1/5 Odds, 3 Places | Rule 4, 5% Deduction.",
        );
      });

      it("[PRPI-8295] should display the bet info with 4 lines", async () => {
        expect(await betInfoPO.element.isDisplayed()).toEqual(true);
        expect(await betInfoPO.infoItems.length).toEqual(4);
      });

      it("[PRPI-8296] should display the betfair ID with in first line with the correct data", async () => {
        expect(await firstBetInfoItemPO.label.getText()).not.toEqual("I18N.MYBETS.BETID");
        expect(await firstBetInfoItemPO.contentText.isDisplayed()).toEqual(false);
        expect(await firstCopyToClipboardPO.contentLabel.getText()).toEqual("O/11037374/0002965");
      });

      it("[PRPI-8297] should display the betfair regulatory ID in the second line with the correct data", async () => {
        expect(await secondBetInfoItemPO.label.getText()).toEqual("ID");
        expect(await secondBetInfoItemPO.contentText.isDisplayed()).toEqual(false);
        expect(await secondCopyToClipboardPO.contentLabel.getText()).toEqual("bc000000001c17979f05");
      });

      it("[PRPI-8298] should display the place date in the third line with the correct data", async () => {
        expect(await thirdBetInfoItemPO.label.getText()).toEqual("Placed");
        expect(await thirdBetInfoItemPO.contentText.getText()).toEqual("April 21, 2023 at 10:45");
        expect(await thirdCopyToClipboardPO.contentLabel.isDisplayed()).toEqual(false);
      });

      it("[PRPI-8299] should display the settled date in the fourth line with the correct data", async () => {
        expect(await fourthBetInfoItemPO.label.getText()).toEqual("Settled");
        expect(await fourthBetInfoItemPO.contentText.getText()).toEqual("April 21, 2023 at 10:55");
        expect(await fourthCopyToClipboardPO.contentLabel.isDisplayed()).toEqual(false);
      });
    });
  });

  describe("When a won single bet, with free bets, odds boost and acca insurance token is available", () => {
    beforeAll(async () => {
      await browseToMyBets(SBK_SINGLE_SPECIAL_WITH_ODDS_BOOST_FREE_BETS_AND_ACCA_INSURANCE_TOKEN_MOCK);
    });

    it("[PRPI-4708] should not display the previous returns value", async () => {
      expect(await betSegmentsReturnsPO.previousPnl.isDisplayed()).toEqual(false);
    });

    it("[PRPI-4709] should display the status label with 'Won'", async () => {
      expect(await betPanelStatusLabelPO.text.getText()).toEqual("Won");
    });

    it("[PRPI-8300] should display the boost icon", async () => {
      expect(await firstInfoLabelPO.icon.isDisplayed()).toEqual(true);
    });

    it("[PRPI-8301] should display the boost label with 'Bet Boost Applied'", async () => {
      expect(await firstInfoLabelPO.label.getText()).toEqual("Bet Boost Applied");
    });

    it("[PRPI-8302] should display the previous odds with '1.36'", async () => {
      expect(await infoLabelOddsPO.previousValue.getText()).toEqual("1.36");
    });

    it("[PRPI-8303] should display the odds with '1.4'", async () => {
      expect(await infoLabelOddsPO.value.getText()).toEqual("1.4");
    });

    it("[PRPI-4710] should display the returns value with '$0.15'", async () => {
      expect(await betSegmentsReturnsPO.pnl.getText()).toEqual("$0.15");
    });

    it("[PRPI-4711] should display the free bets icon", async () => {
      expect(await secondInfoLabelPO.icon.isDisplayed()).toEqual(true);
    });

    it("[PRPI-4712] should display the free bets with 'Used $0.11 Free Bet'", async () => {
      expect(await secondInfoLabelPO.label.getText()).toEqual("Used $0.11 Free Bet");
    });

    it("[PRPI-4713] should display the acca insurance token icon", async () => {
      expect(await thirdInfoLabelPO.icon.isDisplayed()).toEqual(true);
    });

    it("[PRPI-4714] should display the acca insurance token label with 'Second Chance Applied'", async () => {
      expect(await thirdInfoLabelPO.label.getText()).toEqual("Second Chance Applied");
    });

    it("[PRPI-8304] should display the super sub icon", async () => {
      expect(await sportsbookBetCardPO.superSubIconContainer.isDisplayed()).toEqual(true);
    });

    describe("When the user clicks on card", () => {
      beforeAll(async () => {
        await cardPO.header.waitForClickable();
        await cardPO.header.click();
        await browser.waitUntilDisplayed(cardPO.content);
        await browser.waitUntilDisplayed(betInfoPO.element);
      });

      it("[PRPI-8305] should display the previous odds value with '1.36'", async () => {
        expect(await firstEventFirstBetSelectionDetailsOddsPO.previousValue.isDisplayed()).toEqual(true);
        expect(await firstEventFirstBetSelectionDetailsOddsPO.previousValue.getText()).toEqual("1.36");
      });

      it("[PRPI-8306] should display the odds value with '@ 1.4'", async () => {
        expect(await firstEventFirstBetSelectionDetailsOddsPO.value.isDisplayed()).toEqual(true);
        expect(await firstEventFirstBetSelectionDetailsOddsPO.value.getText()).toEqual("@ 1.4");
      });

      it("[PRPI-8307] should not display the status label icon", async () => {
        expect(await firstEventFirstBetSelectionDetailsStatusLabelPO.icon.isDisplayed()).toEqual(false);
      });

      it("[PRPI-8308] should display the status label 'Won'", async () => {
        expect(await firstEventFirstBetSelectionDetailsStatusLabelPO.text.getText()).toEqual("Won");
      });

      it("[PRPI-8309] should display the bet info with 3 lines", async () => {
        expect(await betInfoPO.element.isDisplayed()).toEqual(true);
        expect(await betInfoPO.infoItems.length).toEqual(3);
      });
    });
  });

  describe("When a cashed out multiple bet with Rule4 deduction is available", () => {
    beforeAll(async () => {
      await browseToMyBets(SBK_MULTIPLE_RULE4_MOCK);
    });

    it("[PRPI-8310] should display the status label with 'Cashed Out'", async () => {
      expect(await betPanelStatusLabelPO.text.getText()).toEqual("Cashed Out");
    });

    it("[PRPI-8311] should display the info label with 'Rule 4 - Deduction.'", async () => {
      expect(await firstInfoLabelPO.label.getText()).toEqual("Rule 4 - Deduction.");
    });

    describe("When the user clicks on card", () => {
      beforeAll(async () => {
        await cardPO.header.waitForClickable();
        await cardPO.header.click();
        await browser.waitUntilDisplayed(cardPO.content);
        await betInfoPO.element.scrollIntoView({ block: "center" });
        await browser.waitUntilDisplayed(betInfoPO.element);
      });

      describe("and on first card group", () => {
        it("[PRPI-8312] should display the status label with 'Void'", async () => {
          expect(await firstEventFirstBetSelectionDetailsStatusLabelPO.text.getText()).toEqual("Void");
        });
      });

      describe("and on second card group", () => {
        it("[PRPI-8313] should display the status label with 'Placed'", async () => {
          expect(await secondEventFirstBetSelectionDetailsStatusLabelPO.text.getText()).toEqual("Placed");
        });
      });

      describe("and on third card group", () => {
        it("[PRPI-8314] should display the status label with 'Won'", async () => {
          expect(await thirdEventFirstBetSelectionDetailsStatusLabelPO.text.getText()).toEqual("Won");
        });

        it("[PRPI-8315] should display the bet selection details with 'Rule 4, 25% Deduction.'", async () => {
          expect(await thirdEventFirstBetSelectionDetailsPO.tertiaryTitle.getText()).toEqual("Rule 4, 25% Deduction.");
        });
      });

      it("[PRPI-8316] should display the bet info with 3 lines", async () => {
        expect(await betInfoPO.element.isDisplayed()).toEqual(true);
        expect(await betInfoPO.infoItems.length).toEqual(3);
      });
    });
  });

  describe("when is BRAZIL jurisdiction", () => {
    describe("and the bet is football", () => {
      beforeAll(async () => {
        await browseToMyBets(SBK_SINGLE_FOOTBALL_BET_MOCK, { jurisdiction: "BRAZIL" });

        await cardPO.header.waitForClickable();
        await cardPO.header.click();
        await browser.waitUntilDisplayed(cardPO.content);
        await betInfoPO.element.scrollIntoView({ block: "center" });
        await browser.waitUntilDisplayed(betInfoPO.element);
      });

      it("[PRPI-8317] should display the date and time of the event", async () => {
        expect(await footballScoreboardPO.dateTime.getText()).toBe("May 18, 19:30");
      });

      it("[PRPI-8318] should display the bet info with 3 lines", async () => {
        expect(await betInfoPO.element.isDisplayed()).toEqual(true);
        expect(await betInfoPO.infoItems.length).toEqual(3);
      });

      it("[PRPI-8319] should display the device ID in the third line with the correct data", async () => {
        expect(await thirdBetInfoItemPO.label.getText()).not.toEqual("I18N.MYBETS.DEVICE_ID");
        expect(await thirdBetInfoItemPO.contentText.isDisplayed()).toEqual(false);
        expect(await thirdCopyToClipboardPO.contentLabel.getText()).toEqual("Internet - Browser - Mac");
      });
    });

    describe("and the bet is tennis", () => {
      beforeAll(async () => {
        await browseToMyBets(BFF_MY_BETS_MOCK_TENNIS_SCOREBOARD_IN_PLAY, { jurisdiction: "BRAZIL" });

        await cardPO.header.waitForClickable();
        await cardPO.header.click();
        await browser.waitUntilDisplayed(cardPO.content);
        await betInfoPO.element.scrollIntoView({ block: "center" });
        await browser.waitUntilDisplayed(betInfoPO.element);
      });

      it("[PRPI-8320] should display the date and time of the event", async () => {
        expect(await avbScoreboardPO.dateTime.getText()).toBe("Jan 16, 20:00");
      });
    });
  });
});
