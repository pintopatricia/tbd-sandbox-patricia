const {
  HighlightedSelectionCardPO,
  SportPagePO,
  SportsbookPlacePanelPO,
  ScrollableSwimlanePO,
  SportsbookBetButtonPO,
} = require("../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;

const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();

const sportPagePO = new SportPagePO();
const oddsOnThatSwimlanePO = new ScrollableSwimlanePO(sportPagePO.scrollableSwimlanes[0]);
const oddsOnThatFirstCard = new HighlightedSelectionCardPO(oddsOnThatSwimlanePO.scrollItems[0]);
const oddsOnThatSecondCard = new HighlightedSelectionCardPO(oddsOnThatSwimlanePO.scrollItems[1]);
const oddsOnThatThirdCard = new HighlightedSelectionCardPO(oddsOnThatSwimlanePO.scrollItems[2]);
const oddsOnThatFirstCardBetButtonPO = new SportsbookBetButtonPO(oddsOnThatFirstCard.button);
const placePanelPO = new SportsbookPlacePanelPO();

const EVENT_TYPE_ID = 1;

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:1",
        cardGroupTitle: "OddsOnThat",
        full: {
          edges: [
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:924.1/1",
                title: "Any uncapped player to start Stephen Kenny first game in charge",
                market: {
                  __typename: "SportsbookMarket",
                  urn: "ppb:sbkMarket:924.1",
                  name: "Stephen Kenny Ireland Specials",
                  marketType: "PRE_MATCH_COMBO_-_FEATURED",
                  hierarchy: {
                    __typename: "EventHierarchy",
                    sportevent: {
                      urn: `ppb:event:12345`,
                    },
                  },
                  runners: [
                    {
                      runnerURN: "ppb:sbkRunner:924.1/1",
                      selectionId: 1,
                    },
                  ],

                  isOddsboostMarketType: true,
                },
                runner: {
                  runnerURN: "ppb:sbkRunner:924.1/1",
                },
              },
            },
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:924.2/2",
                title: "To manage an English professional club before December 31st 2022",
                market: {
                  __typename: "SportsbookMarket",
                  urn: "ppb:sbkMarket:924.2",
                  name: "Stephen Kenny Ireland Specials",
                  marketType: "PRE_MATCH_COMBO_-_FEATURED",
                  hierarchy: {
                    __typename: "EventHierarchy",
                    sportevent: {
                      urn: `ppb:event:12345`,
                    },
                  },
                  runners: [
                    {
                      runnerURN: "ppb:sbkRunner:924.2/2",
                      selectionId: 2,
                    },
                  ],

                  isOddsboostMarketType: true,
                },
                runner: {
                  runnerURN: "ppb:sbkRunner:924.2/2",
                },
              },
            },
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:924.3/3",
                title: "Glenn Whelan to start a competitive game under Stephen Kenny",
                market: {
                  __typename: "SportsbookMarket",
                  urn: "ppb:sbkMarket:924.3",
                  name: "Stephen Kenny Ireland Specials",
                  marketType: "PRE_MATCH_COMBO_-_FEATURED",
                  hierarchy: {
                    __typename: "EventHierarchy",
                    sportevent: {
                      urn: `ppb:event:12345`,
                    },
                  },
                  runners: [
                    {
                      runnerURN: "ppb:sbkRunner:924.3/3",
                      selectionId: 3,
                    },
                  ],

                  isOddsboostMarketType: true,
                },
                runner: {
                  runnerURN: "ppb:sbkRunner:924.3/3",
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:924.1/1",
              },
            },
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:924.2/2",
              },
            },
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:924.3/3",
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
        urn: "ppb:tbd:cardgroup:swimlane:1",
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.1",
      runnerDetails: [
        {
          selectionId: "1",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
          },
        },
      ],
    },
    {
      marketId: "924.2",
      runnerDetails: [
        {
          selectionId: "2",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
          },
        },
      ],
    },
  ],
};

describe("OddsOnThat markets swimlane", () => {
  describe("When the user is on sports view and there are OddsOnThat markets available", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
      await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
      await browser.waitUntilDisplayed(oddsOnThatFirstCardBetButtonPO.odd);
    });

    it("[PRPI-6234] the swimlane for OddsOnThat markets should be displayed", async () => {
      expect(await oddsOnThatSwimlanePO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-6235] the swimlane for OddsOnThat markets should have a title:'OddsOnThat'", async () => {
      expect(await oddsOnThatSwimlanePO.title.getText()).toBe("OddsOnThat");
    });

    it("[PRPI-6236] the swimlane for OddsOnThat markets should display 3 cards", async () => {
      expect(await oddsOnThatSwimlanePO.scrollItems.length).toBe(3);
    });

    it("[PRPI-6237] the 1st and the 2nd cards should be displayed on viewport", async () => {
      expect(await oddsOnThatFirstCard.element.isDisplayedInViewport()).toBe(true);
      expect(await oddsOnThatSecondCard.element.isDisplayedInViewport()).toBe(true);
      expect(await oddsOnThatThirdCard.element.isDisplayedInViewport()).toBe(false);
    });

    it("[PRPI-6238] the 1st card\xA0should display the runner name:'Any uncapped player to start Stephen Kenny first game in charge'", async () => {
      expect(await oddsOnThatFirstCard.text.getText()).toBe(
        "Any uncapped player to start Stephen Kenny first game in charge",
      );
    });

    it("[PRPI-6239] the 1st card should have a bet button", async () => {
      expect(await oddsOnThatFirstCardBetButtonPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-6240] the 1st card bet button should only display the odds value", async () => {
      expect(await oddsOnThatFirstCardBetButtonPO.odd.isDisplayed()).toBe(true);
      expect(await oddsOnThatFirstCardBetButtonPO.secondaryLabel.isDisplayed()).toBe(false);
    });

    it("[PRPI-6241] the 1st card odds value should be 1.1", async () => {
      expect(await oddsOnThatFirstCardBetButtonPO.odd.getText()).toBe("1.1");
    });

    describe("[704990] And the user clicks on bet button of an OddsOnThat market", () => {
      beforeAll(async () => {
        await oddsOnThatFirstCardBetButtonPO.element.click();
        await browser.waitUntilDisplayed(placePanelPO.element);
      });

      it("[PRPI-6242] the betslip should be displayed", async () => {
        expect(await placePanelPO.element.isDisplayed()).toBe(true);
      });
    });
  });
});
