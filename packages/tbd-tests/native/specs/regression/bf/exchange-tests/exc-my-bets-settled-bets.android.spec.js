const {
  getAppContext,
  getMyBetsLayout,
  getHomeLayoutWithViewLink,
  getCardResults,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsEXCViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const MarketBetSelectionCardGroupSO = require("@ppb/tbd-shared/components/MarketBetSelectionCardGroup/MarketBetSelectionCardGroup.native.so");
const MarketBetSelectionCardSO = require("@ppb/tbd-shared/components/MarketBetSelectionCard/MarketBetSelectionCard.native.so");

const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const MY_BETS_SETTLED_URL = "mybets/settled/mb-736574746c6564";
const MockService = require("../../../../mock-essentials/mocking-service");

const {
  MyBetsScreenSO,
  CardSO,
  OddsSO,
  StatusLabelSO,
  InfoLabelSO,
  BetSegmentsSO,
  PNLAndWhatIfSO,
  BetSelectionDetailsSO,
  SelectionSegmentSO,
} = require("../../../../screen-objects");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsSO = new MyBetsScreenSO();

const cardSO = new CardSO();
const betSegmentsSO = new BetSegmentsSO(myBetsSO.element);
const betGrossSO = new SelectionSegmentSO(betSegmentsSO.leftSegment);
const betOddsSO = new OddsSO(betSegmentsSO.leftSegment);
const betSegmentCommissionSO = new SelectionSegmentSO(betSegmentsSO.midSegment);
const betCommissionSO = new OddsSO(betSegmentsSO.midSegment);
const betProfitSO = new SelectionSegmentSO(betSegmentsSO.rightSegment);
const betSegmentPnlSO = new PNLAndWhatIfSO(betSegmentsSO.rightSegment);
const infoLabelSO = new InfoLabelSO();
const marketBetSelectionCardGroupSO = new MarketBetSelectionCardGroupSO();
const firstMarketBetSelectionCardSO = new MarketBetSelectionCardSO(marketBetSelectionCardGroupSO.groupItems[0]);
const firstBetPanelStatusLabelSO = new StatusLabelSO(marketBetSelectionCardGroupSO.groupItems[0]);
const firstBetSelectionDetailsSO = new BetSelectionDetailsSO(firstMarketBetSelectionCardSO.betSelectionDetails);
const firstBetInfoLabelSO = new InfoLabelSO(firstMarketBetSelectionCardSO.infoLabel);
const firstBetSegmentsSO = new BetSegmentsSO(firstMarketBetSelectionCardSO.betSegments);
const firstBetLeftSegmentSO = new SelectionSegmentSO(firstBetSegmentsSO.leftSegment);
const firstBetLeftOddsSO = new OddsSO(firstBetSegmentsSO.leftSegment);
const firstBetMidSegmentSO = new SelectionSegmentSO(firstBetSegmentsSO.midSegment);
const firstBetMidOddsSO = new OddsSO(firstBetSegmentsSO.midSegment);
const firstBetMidRightSegmentSO = new SelectionSegmentSO(firstBetSegmentsSO.midRightSegment);
const firstBetMidRightOddsSO = new OddsSO(firstBetSegmentsSO.midRightSegment);
const firstBetRightSegmentSO = new SelectionSegmentSO(firstBetSegmentsSO.rightSegment);
const firstBetRightPnlSO = new PNLAndWhatIfSO(firstBetSegmentsSO.rightSegment);
const secondMarketBetSelectionCardSO = new MarketBetSelectionCardSO(marketBetSelectionCardGroupSO.groupItems[1]);
const secondBetPanelStatusLabelSO = new StatusLabelSO(marketBetSelectionCardGroupSO.groupItems[1]);
const secondBetSelectionDetailsSO = new BetSelectionDetailsSO(secondMarketBetSelectionCardSO.betSelectionDetails);
const secondBetSegmentsSO = new BetSegmentsSO(secondMarketBetSelectionCardSO.betSegments);
const secondBetLeftSegmentSO = new SelectionSegmentSO(secondBetSegmentsSO.leftSegment);
const secondBetLeftOddsSO = new OddsSO(secondBetSegmentsSO.leftSegment);
const secondBetMidSegmentSO = new SelectionSegmentSO(secondBetSegmentsSO.midSegment);
const secondBetMidOddsSO = new OddsSO(secondBetSegmentsSO.midSegment);
const secondBetRightSegmentSO = new SelectionSegmentSO(secondBetSegmentsSO.rightSegment);
const secondBetRightPnlSO = new PNLAndWhatIfSO(secondBetSegmentsSO.rightSegment);

const EXC_SETTLED_FOOTBALL_EVENT_MOCK = [
  {
    __typename: "BetCardGroup",
    urn: "ppb:tbd:card:bet:group:32660950|exc",
    aggregatorId: "32660950",
    aggregatorDesc: "Benfica v Porto",
    edges: [
      {
        __typename: "FixtureCard",
        homeName: "Benfica",
        awayName: "Porto",
      },
      {
        __typename: "MarketBetCardGroup",
        edges: [
          {
            __typename: "MarketBetCard",
            description: "Match Odds",
            commission: "0",
            profit: -0.14,
            netProfit: -0.14,
          },
          {
            __typename: "MarketBetExpandableCardGroup",
            edges: [
              {
                __typename: "MarketBetSelectionCardGroup",
                edges: [
                  {
                    __typename: "MarketBetSelectionCard",
                    id: "322688455269",
                    price: 4.1,
                    runnerDesc: "Porto",
                    side: "LAY",
                    isCashout: true,
                    isUnmatched: null,
                    size: 0.86,
                    liability: 2.6,
                    profit: 0.86,
                    result: "LOST",
                    priceMatched: 4.1,
                  },
                  {
                    __typename: "MarketBetSelectionCard",
                    id: "322673399531",
                    price: 3.55,
                    runnerDesc: "Porto",
                    side: "BACK",
                    isCashout: false,
                    isUnmatched: null,
                    size: 1,
                    profit: -1,
                    result: "WON",
                    priceMatched: 3.55,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

const VIEW_EXC_SETTLED_MOCK = getMyBetsEXCViewMock(EXC_SETTLED_FOOTBALL_EVENT_MOCK, {
  isOpen: false,
  hasFooter: true,
});

describe("My Bets Page - EXC Settled bets", () => {
  describe("when the user opens My bets and has two settled bets on Match Odds market", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getAppContext());
      await mockService.mockHttpRequest(getMyBetsLayout(VIEW_EXC_SETTLED_MOCK));
      await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
      const HOME_VIEW_LINK = getStartViewLink(MY_BETS_SETTLED_URL);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

      await browser.waitUntilDisplayed(myBetsSO.header, "My bets screen title is not displayed");
      await browser.waitUntilNotDisplayed(cardSO.contentWrapper, "The collapse is not visible");
    });

    it("[PRPI-1860] should display the gross profit label with '--' value on market card", async () => {
      expect(await betGrossSO.term.getText()).toBe("Gross Profit");
      expect(await betOddsSO.odds.getText()).toBe("--");
    });

    it("[PRPI-1861] should display the commission label with '--' value on market card", async () => {
      expect(await betSegmentCommissionSO.term.getText()).toBe("Commission");
      expect(await betCommissionSO.odds.getText()).toBe("--");
    });

    it("[PRPI-1862] should display the net profit label with '-$0.14' value on market card", async () => {
      expect(await betProfitSO.term.getText()).toBe("Net Profit");
      expect(await betSegmentPnlSO.pnl.getText()).toBe("-$0.14");
    });

    it("[PRPI-1863] should display the collapsed collapse", async () => {
      expect(await cardSO.contentWrapper.isDisplayed()).toBe(false);
    });

    describe("When the user clicks on accordion to expand bets", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(cardSO.header);
        await cardSO.header.click();
        await browser.waitUntilDisplayed(cardSO.contentWrapper, "The collapse is not expanded");
        await browser.waitUntilDisplayed(infoLabelSO.label, "Bet placed as a result of you cashing out");
      });

      describe("the lay bet", () => {
        it("[PRPI-1864] should display the label 'Bet placed as a result of you cashing out'", async () => {
          expect(await infoLabelSO.label.getText()).toBe("Bet placed as a result of you cashing out");
        });

        it("[PRPI-1865] should display the 'LAY' label", async () => {
          expect(await firstBetSelectionDetailsSO.side.getText()).toEqual("LAY");
        });

        it("[PRPI-1866] should display the 'Lost' label", async () => {
          expect(await firstBetPanelStatusLabelSO.text.getText()).toEqual("Lost");
        });

        it("[PRPI-10517] should display the cash out info label", async () => {
          expect(await firstMarketBetSelectionCardSO.infoLabel.isDisplayed()).toBe(true);
          expect(await firstBetInfoLabelSO.label.getText()).toBe("Bet placed as a result of you cashing out");
        });

        it("[PRPI-10518] should display the odds, stake, liability and profit", async () => {
          expect(await firstBetLeftSegmentSO.term.getText()).toBe("Odds");
          expect(await firstBetLeftOddsSO.odds.getText()).toBe("4.1");
          expect(await firstBetMidSegmentSO.term.getText()).toBe("Backer's Stake");
          expect(await firstBetMidOddsSO.odds.getText()).toBe("$0.86");
          expect(await firstBetMidRightSegmentSO.term.getText()).toBe("Liability");
          expect(await firstBetMidRightOddsSO.odds.getText()).toBe("$2.60");
          expect(await firstBetRightSegmentSO.term.getText()).toBe("Profit");
          expect(await firstBetRightPnlSO.pnl.getText()).toBe("$0.86");
        });
      });

      describe("the back bet", () => {
        it("[PRPI-1867] should display the 'BACK' label", async () => {
          expect(await secondBetSelectionDetailsSO.side.getText()).toEqual("BACK");
        });

        it("[PRPI-1868] should display the 'Won' label", async () => {
          expect(await secondBetPanelStatusLabelSO.text.getText()).toEqual("Won");
        });

        it("[PRPI-10519] should not display the cash out info label", async () => {
          expect(await secondMarketBetSelectionCardSO.infoLabel.isDisplayed()).toBe(false);
        });

        it("[PRPI-10520] should display the odds, stake and profit and no liability", async () => {
          expect(await secondBetLeftSegmentSO.term.getText()).toBe("Odds");
          expect(await secondBetLeftOddsSO.odds.getText()).toBe("3.55");
          expect(await secondBetMidSegmentSO.term.getText()).toBe("Stake");
          expect(await secondBetMidOddsSO.odds.getText()).toBe("$1.00");
          expect(await secondBetRightSegmentSO.term.getText()).toBe("Profit");
          expect(await secondBetRightPnlSO.pnl.getText()).toBe("-$1.00");
          expect(await secondBetSegmentsSO.midRightSegment.isExisting()).toBe(false);
        });
      });
    });
  });
});
