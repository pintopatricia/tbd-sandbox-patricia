const BetCardGroupPO = require("@ppb/tbd-shared/components/BetCardGroup/BetCardGroup.web.po");
const MarketBetSelectionCardGroupPO = require("@ppb/tbd-shared/components/MarketBetSelectionCardGroup/MarketBetSelectionCardGroup.web.po");
const MarketBetSelectionCardPO = require("@ppb/tbd-shared/components/MarketBetSelectionCard/MarketBetSelectionCard.web.po");

const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsEXCViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const {
  BetSegmentsPO,
  CardPO,
  InfoLabelPO,
  StatusLabelPO,
  BetSelectionDetailsPO,
} = require("../../../../page-objects");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");

const routes = require("../../../../../utils/routes");
const MockService = require("../../../../mock-essentials/mocking-service");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();

const betCardGroupPO = new BetCardGroupPO();
const betSegmentsPO = new BetSegmentsPO();
const cardPO = new CardPO();
const marketBetSelectionCardGroupPO = new MarketBetSelectionCardGroupPO();
const firstMarketBetSelectionCardPO = new MarketBetSelectionCardPO(marketBetSelectionCardGroupPO.groupItems[0]);
const secondMarketBetSelectionCardPO = new MarketBetSelectionCardPO(marketBetSelectionCardGroupPO.groupItems[1]);
const firstBetSegmentsPO = new BetSegmentsPO(firstMarketBetSelectionCardPO.betSegments);
const secondBetSegmentsPO = new BetSegmentsPO(secondMarketBetSelectionCardPO.betSegments);
const firstBetDetailPO = new BetSelectionDetailsPO(firstMarketBetSelectionCardPO.element);
const secondBetDetailPO = new BetSelectionDetailsPO(secondMarketBetSelectionCardPO.element);
const infoLabelPO = new InfoLabelPO(firstMarketBetSelectionCardPO.element);
const firstBetPanelStatusLabelPO = new StatusLabelPO(firstMarketBetSelectionCardPO.element);
const secondBetPanelStatusLabelPO = new StatusLabelPO(secondMarketBetSelectionCardPO.element);

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
      await mockService.mockHttpRequest(await getIndexHTML(VIEW_EXC_SETTLED_MOCK.urn));
      await mockService.mockHttpRequest(getMyBetsLayout(VIEW_EXC_SETTLED_MOCK));
      await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
      await browser.url(routes.getMyBetsViewUrl("settled"));
      await browser.waitUntilDisplayed(betCardGroupPO.element, "Bet Card Group not visible");
      await browser.waitUntilNotDisplayed(cardPO.content, "The accordion is not visible");
    });

    it("[PRPI-5566] should display the gross profit label with '--' value on market card", async () => {
      expect(await betSegmentsPO.leftLabel.getText()).toBe("Gross Profit");
      expect(await betSegmentsPO.leftValue.getText()).toBe("--");
    });

    it("[PRPI-5567] should display the commission label with '--' value on market card", async () => {
      expect(await betSegmentsPO.midLabel.getText()).toBe("Commission");
      expect(await betSegmentsPO.midValue.getText()).toBe("--");
    });

    it("[PRPI-5568] should display the net profit label with '-$0.14' value on market card", async () => {
      expect(await betSegmentsPO.rightLabel.getText()).toBe("Net Profit");
      expect(await betSegmentsPO.rightValue.getText()).toBe("-$0.14");
    });

    it("[PRPI-5569] should display the collapsed accordion", async () => {
      expect(await cardPO.content.isDisplayed()).toBe(false);
    });

    describe("When the user clicks on accordion to expand bets", () => {
      beforeAll(async () => {
        await cardPO.header.waitForClickable();
        await cardPO.header.click();
        await browser.waitUntilDisplayed(cardPO.content, "The accordion is not expanded");
        await browser.waitUntilDisplayed(infoLabelPO.label, "Bet placed as a result of you cashing out");
      });

      describe("the lay bet", () => {
        it("[PRPI-5570] should display the label 'Bet placed as a result of you cashing out'", async () => {
          expect(await infoLabelPO.label.getText()).toBe("Bet placed as a result of you cashing out");
        });

        it("[PRPI-5571] should display the 'LAY' label", async () => {
          expect(await firstBetDetailPO.side.getText()).toEqual("LAY");
        });

        it("[PRPI-5572] should display the 'Lost' label", async () => {
          expect(await firstBetPanelStatusLabelPO.text.getText()).toEqual("Lost");
        });

        it("[PRPI-10517] should display the cash out info label", async () => {
          expect(await firstMarketBetSelectionCardPO.infoLabel.isDisplayed()).toBe(true);
          expect(await firstMarketBetSelectionCardPO.infoLabel.getText()).toBe(
            "Bet placed as a result of you cashing out",
          );
        });

        it("[PRPI-10518] should display the odds, stake, liability and profit", async () => {
          expect(await firstBetSegmentsPO.leftLabel.getText()).toBe("Odds");
          expect(await firstBetSegmentsPO.leftValue.getText()).toBe("4.1");
          expect(await firstBetSegmentsPO.midLabel.getText()).toBe("Backer's Stake");
          expect(await firstBetSegmentsPO.midValue.getText()).toBe("$0.86");
          expect(await firstBetSegmentsPO.midRightLabel.getText()).toBe("Liability");
          expect(await firstBetSegmentsPO.midRightValue.getText()).toBe("$2.60");
          expect(await firstBetSegmentsPO.rightLabel.getText()).toBe("Profit");
          expect(await firstBetSegmentsPO.rightValue.getText()).toBe("$0.86");
        });
      });

      describe("the back bet", () => {
        it("[PRPI-5573] should display the 'BACK' label", async () => {
          expect(await secondBetDetailPO.side.getText()).toEqual("BACK");
        });

        it("[PRPI-5574] should display the 'Won' label", async () => {
          expect(await secondBetPanelStatusLabelPO.text.getText()).toEqual("Won");
        });

        it("[PRPI-10519] should not display the cash out info label", async () => {
          expect(await secondMarketBetSelectionCardPO.infoLabel.isDisplayed()).toBe(false);
        });

        it("[PRPI-10520] should display the odds, stake and profit and no liability", async () => {
          expect(await secondBetSegmentsPO.leftLabel.getText()).toBe("Odds");
          expect(await secondBetSegmentsPO.leftValue.getText()).toBe("3.55");
          expect(await secondBetSegmentsPO.midLabel.getText()).toBe("Stake");
          expect(await secondBetSegmentsPO.midValue.getText()).toBe("$1.00");
          expect(await secondBetSegmentsPO.rightLabel.getText()).toBe("Profit");
          expect(await secondBetSegmentsPO.rightValue.getText()).toBe("-$1.00");
          expect(await secondBetSegmentsPO.midRightLabel.isExisting()).toBe(false);
          expect(await secondBetSegmentsPO.midRightValue.isExisting()).toBe(false);
        });
      });
    });
  });
});
