const NavigationTabsSO = require("@ppb/tbd-shared/components/NavigationTabsList/NavigationTabsList.so");
const VirtualEventRaceDetailsSO = require("@ppb/tbd-shared/components/VirtualEventDetailsCard/VirtualEventDetailsCard.native.so");
const BroadcastsCardSO = require("@ppb/tbd-shared/components/BroadcastsCard/BroadcastsCard.so");
const {
  getGenericLayout,
  getHomeLayoutWithViewLink,
  getCardResults,
  getAppContext,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;

const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const { hideKeyboard } = require("../../../../helpers/gestures");

const {
  GenericScreenSO,
  SportsbookPlacePanelSO,
  SelectableItemsSO,
  SupportingContentButtonSO,
  LiveStreamSO,
  CardSO,
  SportsbookMarketSO,
  RunnerSO,
  SportsbookBetButtonSO,
  BetDetailsSO,
  FixedNumberInputFieldSO,
  CurrencyNumberInputFieldSO,
  BetSegmentsSO,
  OddsSO,
  PNLAndWhatIfSO,
  SportsbookReceiptPanelSO,
  SelectionSegmentSO,
  RaceTimeSO,
  PrimaryButtonSO,
  BetsSummarySO,
} = require("../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const navigationTabsSO = new NavigationTabsSO();
const broadcastsCardSO = new BroadcastsCardSO();
const broadcastsSupportingContentSO = new SupportingContentButtonSO(broadcastsCardSO.element);
const liveStreamSO = new LiveStreamSO();
const liveStreamWebviewSO = liveStreamSO.webviews[0];
const virtualEventRaceDetailsSO = new VirtualEventRaceDetailsSO();
const selectableItemsSO = new SelectableItemsSO();
const firstRaceTimeSO = new RaceTimeSO(selectableItemsSO.races[0]);
const secondRaceTimeSO = new RaceTimeSO(selectableItemsSO.races[1]);
const cardSO = new CardSO();
const marketSO = new SportsbookMarketSO(cardSO.sportsbookMarket);
const runnerSO = new RunnerSO(marketSO.runnerList[0]);
const betButtonSO = new SportsbookBetButtonSO(runnerSO.sportsbookBetButton);
const betsSummarySO = new BetsSummarySO();
const singlePanelSO = new SportsbookPlacePanelSO();
const betDetailsSO = new BetDetailsSO(singlePanelSO.element);
const placeButtonSO = new PrimaryButtonSO();
const oddsFieldSO = new FixedNumberInputFieldSO(singlePanelSO.fixedInput);
const stakeFieldSO = new CurrencyNumberInputFieldSO(singlePanelSO.currencyInput);
const receiptPanelSO = new SportsbookReceiptPanelSO();
const receiptBetDetailsSO = new BetDetailsSO(receiptPanelSO.element);
const firstSingleSegmentsSO = new BetSegmentsSO(receiptPanelSO.singles[0]);
const oddsSegmentContainer = new SelectionSegmentSO(firstSingleSegmentsSO.leftSegment);
const oddsSegment = new OddsSO(firstSingleSegmentsSO.leftSegment);
const stakeSegmentContainer = new SelectionSegmentSO(firstSingleSegmentsSO.midSegment);
const stakeSegment = new OddsSO(firstSingleSegmentsSO.midSegment);
const profitSegmentContainer = new SelectionSegmentSO(firstSingleSegmentsSO.rightSegment);
const profitSegment = new PNLAndWhatIfSO(firstSingleSegmentsSO.rightSegment);

const SPORT = {
  __typename: "VirtualSport",
  name: {
    translationKey: "I18N.VIRTUAL_SPORT.HORSES_FLAT",
  },
  kind: "RACING",
  sportId: 0,
  urn: "ppb:virtualSport:0",
};

const FIRST_VIRTUAL_EVENT = {
  __typename: "VirtualEvent",
  urn: "ppb:virtualEvent:1",
  openDate: "2050-01-27T15:00:00.000Z",
  venue: "First venue",
  distance: "First distance",
  sport: SPORT,
};
const SECOND_MARKET_ID = "924.307595995";

const SECOND_VIRTUAL_EVENT = {
  __typename: "VirtualEvent",
  urn: "ppb:virtualEvent:2",
  openDate: "2050-01-27T15:05:00.000Z",
  venue: "Second venue",
  distance: "Second distance",
  sport: SPORT,
};

const FIRST_RUNNERS = [
  {
    __typename: "VirtualRunner",
    name: "Princess Mia",
    odds: {
      decimal: 4.33,
      fractional: {
        numerator: 10,
        denominator: 3,
      },
    },
    runnerURN: "ppb:virtualRunner:24620036",
    selectionId: 24620036,
  },
];

const SECOND_RUNNERS = [
  {
    __typename: "VirtualRunner",
    name: "Badjoras",
    odds: {
      decimal: 6,
      fractional: {
        numerator: 15,
        denominator: 6,
      },
    },
    runnerURN: "ppb:virtualRunner:24620037",
    selectionId: 24620037,
  },
];

const SELECTABLE_ITEMS_CARD_GROUP_MOCK = {
  __typename: "SelectableItemsCardGroup",
  urn: "ppb:tbd:cardgroup:selectableItems:0?=v=cHBiOnRiZDp2aWV3OnZpcnR1YWxOYXZpZ2F0aW9uVGFiOnZpcnR1YWxzPz10YWJJZD0xMDA%3D",
  cardGroupTitle: null,
  selectableItemsCardGroupType: "TIMELINE",
  filter: null,
  full: {
    edges: [
      {
        __typename: "VirtualCardGroupItemEdge",
        startTime: "1985-02-05T15:00:00.000Z",
        isClosed: "false",
        isDisabled: "false",
        node: {
          __typename: "VirtualCardGroup",
          urn: "ppb:tbd:cardgroup:virtualCardGroup:virtuals|13537254?=tabId=0",
          items: {
            edges: [
              {
                node: {
                  __typename: "VirtualEventDetailsCard",
                  urn: "ppb:tbd:card:virtualEventDetails:virtuals|13537254?=tabId=0",
                  virtualEvent: FIRST_VIRTUAL_EVENT,
                },
                __typename: "ViewItemEdge",
              },
              {
                node: {
                  __typename: "VirtualMarketCard",
                  urn: "ppb:tbd:card:virtualMarket:924.307595994",
                  title: "Win or Each Way",
                  marketHierarchy: {
                    __typename: "VirtualEventHierarchy",
                    virtualEvent: FIRST_VIRTUAL_EVENT,
                  },
                  displayRunners: {
                    market: {
                      __typename: "VirtualMarket",
                      urn: "ppb:tbd:card:virtualMarket:924.307595994",
                      marketId: "924.307595994",
                      name: "Win or Each Way",
                      sport: SPORT,
                      event: FIRST_VIRTUAL_EVENT,
                      runners: FIRST_RUNNERS,
                      marketType: "WIN",
                      hasEachWay: true,
                      eachWayPlaces: 3,
                      eachWayFraction: 4,
                    },
                  },
                },
                __typename: "ViewItemEdge",
              },
            ],

            __typename: "ViewItemsConnection",
          },
        },
      },
    ],

    __typename: "SelectableItemsCardGroupItemsConnection",
  },
  partials: {
    edges: [
      {
        __typename: "VirtualCardGroupItemEdge",
        startTime: "1985-02-05T15:00:00.000Z",
        isClosed: "false",
        isDisabled: "false",
        node: {
          urn: `ppb:tbd:cardgroup:virtualCardGroup:virtuals|13537254?=tabId=0`,
          __typename: "VirtualCardGroup",
        },
      },
      {
        __typename: "VirtualCardGroupItemEdge",
        startTime: "1985-02-05T15:05:00.000Z",
        isClosed: "false",
        isDisabled: "false",
        node: {
          urn: `ppb:tbd:cardgroup:virtualCardGroup:virtuals|13537255?=tabId=0`,
          __typename: "VirtualCardGroup",
        },
      },
    ],

    __typename: "SelectableItemsCardGroupItemsConnection",
  },
};

const NAVIGATION_TABS_LIST_MOCK = {
  node: {
    __typename: "NavigationTabsList",
    urn: "ppb:tbd:card:virtualNavigationTabsList:virtuals",
    full: {
      edges: [
        {
          node: {
            __typename: "NavigationTab",
            urn: "ppb:tbd:view:virtualNavigationTab:virtuals?=tabId=0",
            tabTitle: {
              translate: {
                key: "I18N.VIRTUAL_SPORT.HORSES_FLAT",
              },
            },
            full: {
              edges: [
                {
                  node: {
                    __typename: "BroadcastsCard",
                    urn: "ppb:tbd:card:virtualBroadcasts:0",
                    isCollapsed: false,
                    broadcasts: {
                      dataVizUrl: null,
                      liveVideoUrl: "https://example.com",
                    },
                  },
                  __typename: "NavigationTabItemsEdge",
                },
                {
                  node: SELECTABLE_ITEMS_CARD_GROUP_MOCK,
                  __typename: "NavigationTabItemsEdge",
                },
              ],
            },
            partials: {
              partialEdges: [
                {
                  node: {
                    __typename: "BroadcastsCard",
                    urn: "ppb:tbd:card:virtualBroadcasts:0",
                  },
                  __typename: "NavigationTabItemsEdge",
                },
                {
                  node: {
                    __typename: "SelectableItemsCardGroup",
                    urn: "ppb:tbd:cardgroup:selectableItems:0?=v=cHBiOnRiZDp2aWV3OnZpcnR1YWxOYXZpZ2F0aW9uVGFiOnZpcnR1YWxzPz10YWJJZD0xMDA%3D",
                  },
                  __typename: "NavigationTabItemsEdge",
                },
              ],
            },
          },
        },
      ],
    },
    partials: {
      edges: [
        {
          node: {
            __typename: "NavigationTab",
            urn: "ppb:tbd:view:virtualNavigationTab:virtuals?=tabId=0",
            tabTitle: {
              translate: {
                key: "I18N.VIRTUAL_SPORT.HORSES_FLAT",
              },
            },
          },
        },
        {
          node: {
            __typename: "NavigationTab",
            urn: "ppb:tbd:view:virtualNavigationTab:virtuals?=tabId=100",
            tabTitle: {
              translate: {
                key: "I18N.VIRTUAL_SPORT.HORSES_JUMPS",
              },
            },
          },
        },
      ],
    },
  },
};

const NAVIGATION_TABS_LIST_PARTIAL = {
  node: {
    urn: "ppb:tbd:card:virtualNavigationTabsList:virtuals",
    __typename: "NavigationTabsList",
  },
};

const BFF_BOTTOM_BAR_PROPERTY = {
  tiles: [
    {
      tileType: "HOME",
      viewLink: {
        viewUrn: "ppb:tbd:view:generic:home",
        viewUrl: "",
      },
    },
  ],
};

const VIRTUALS_VIEW_MOCK = {
  urn: "ppb:tbd:view:generic:virtuals",
  url: "view/d-virtuals",
  title: "Virtuals",
  edges: [NAVIGATION_TABS_LIST_MOCK],
  partialEdges: [NAVIGATION_TABS_LIST_PARTIAL],
  bottomBar: BFF_BOTTOM_BAR_PROPERTY,
};

const SECOND_VIRTUAL_CARD_GROUP_MOCK = {
  __typename: "VirtualCardGroup",
  urn: "ppb:tbd:cardgroup:virtualCardGroup:virtuals|13537255?=tabId=0",
  items: {
    edges: [
      {
        node: {
          __typename: "VirtualEventDetailsCard",
          urn: "ppb:tbd:card:virtualEventDetails:virtuals|13537255?=tabId=0",
          virtualEvent: SECOND_VIRTUAL_EVENT,
        },
        __typename: "ViewItemEdge",
      },
      {
        node: {
          __typename: "VirtualMarketCard",
          urn: "ppb:tbd:card:virtualMarket:924.307595995",
          title: "Win or Each Way",
          marketHierarchy: {
            __typename: "VirtualEventHierarchy",
            virtualEvent: SECOND_VIRTUAL_EVENT,
          },
          displayRunners: {
            market: {
              __typename: "VirtualMarket",
              urn: "ppb:virtualMarket:924.307595995",
              marketId: SECOND_MARKET_ID,
              name: "Win or Each Way",
              sport: SPORT,
              event: SECOND_VIRTUAL_EVENT,
              runners: SECOND_RUNNERS,
              marketType: "WIN",
              hasEachWay: true,
              eachWayPlaces: 3,
              eachWayFraction: 4,
            },
          },
        },
        __typename: "ViewItemEdge",
      },
    ],

    __typename: "ViewItemsConnection",
  },
};

const SINGLE_MOCK = {
  betCombinations: [
    {
      legCombinations: [{ runners: [{ marketId: SECOND_MARKET_ID, selectionId: SECOND_RUNNERS[0].selectionId }] }],
    },
  ],

  runnerOdds: [
    {
      runner: { marketId: SECOND_MARKET_ID, selectionId: SECOND_RUNNERS[0].selectionId },
      odds: {
        decimalDisplayOdds: { decimalOdds: 4 },
        trueOdds: { decimalOdds: { decimalOdds: 4 } },
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: SECOND_MARKET_ID,
      runnerDetails: [
        {
          selectionId: SECOND_RUNNERS[0].selectionId,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 4 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "24002",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "24003",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
  ],
};

const SPB_MOCK_SUCCESS = {
  result: [
    {
      runners: [{ runner: { marketId: SECOND_MARKET_ID, selectionId: SECOND_RUNNERS[0].selectionId } }],
      legs: [
        {
          leg: { betRunners: [{ runner: { marketId: SECOND_MARKET_ID, selectionId: SECOND_RUNNERS[0].selectionId } }] },
          winOdds: { decimalDisplayOdds: { decimalOdds: 4 } },
        },
      ],

      totalPotentialWin: 4,
    },
  ],
};

const BFF_SELECTABLE_ITEMS_CARDS_MOCK = { cards: [SELECTABLE_ITEMS_CARD_GROUP_MOCK] };
const BFF_CARDS_MOCK = { cards: [SECOND_VIRTUAL_CARD_GROUP_MOCK] };

describe("Virtual sports", () => {
  describe("When virtual sports page opens with disabled race", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        getAppContext({
          throttles: {
            VIRTUALS_VIEW: {
              isActive: true,
            },
          },
        }),
      );
      await mockService.mockHttpRequest(getGenericLayout(VIRTUALS_VIEW_MOCK));
      await mockService.mockHttpRequest(getCardResults(BFF_SELECTABLE_ITEMS_CARDS_MOCK));
      const url = "view/d-virtuals";
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await browser.waitUntilDisplayed(navigationTabsSO.element);
      await browser.waitUntilDisplayed(virtualEventRaceDetailsSO.meetingTime);
    });

    it("[PRPI-3243] The expanded broadcasts chevron should be displayed", async () => {
      expect(await broadcastsSupportingContentSO.chevronExpanded.isDisplayed()).toBe(true);
    });

    it("[PRPI-3244] The live stream broadcasts iframe should be displayed", async () => {
      expect(await liveStreamWebviewSO.isDisplayed()).toBe(true);
    });

    describe("When the user clicks on broadcasts accordion", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(broadcastsSupportingContentSO.chevronExpanded);
        await broadcastsSupportingContentSO.chevronExpanded.click();
        await browser.waitUntilDisplayed(broadcastsSupportingContentSO.chevronCollapsed);
      });

      it("[PRPI-3245] The chevron should be collapsed", async () => {
        expect(await broadcastsSupportingContentSO.chevronCollapsed.isDisplayed()).toBe(true);
      });

      it("[PRPI-3246] The live stream iframe should not be displayed", async () => {
        expect(await liveStreamSO.element.isExisting()).toBe(false);
      });

      describe("when the 15:35 race is selected", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getCardResults(BFF_CARDS_MOCK));
          await browser.waitUntilClickableNative(secondRaceTimeSO.element);
          await secondRaceTimeSO.element.click();
          await browser.waitUntilDisplayed(virtualEventRaceDetailsSO.meetingTime);
        });

        it("[PRPI-3247] The 15:35 race should be selected", async () => {
          expect(await secondRaceTimeSO.selectedRace.getText()).toBe("15:05");
        });

        it("[PRPI-3248] The 15:30 race should not be selected", async () => {
          expect(await firstRaceTimeSO.selectedRace.isDisplayed()).toBe(false);
        });

        it("[PRPI-3249] The race details time should be displayed", async () => {
          expect(await virtualEventRaceDetailsSO.meetingTime.getText()).toBe("15:05");
        });

        it("[PRPI-3250] The race details name should be displayed", async () => {
          expect(await virtualEventRaceDetailsSO.meetingName.getText()).toBe("Second venue");
        });

        describe("When a virtuals bet button is pressed", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));

            await browser.waitUntilDisplayed(betButtonSO.element);
            await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));

            await browser.waitUntilClickableNative(betButtonSO.element);
            await betButtonSO.element.click();
            await browser.waitUntilDisplayed(singlePanelSO.element, "First selection hasn't been added");
          });

          it("[PRPI-3251] the betslip single panel should open", async () => {
            expect(await singlePanelSO.element.isDisplayed()).toBe(true);
          });

          it("[PRPI-3252] the bet details should display the selection name", async () => {
            expect(await betDetailsSO.title.getText()).toBe("Badjoras");
          });

          it("[PRPI-3253] the bet details should display the market type and event name", async () => {
            expect(await betDetailsSO.subtitle.getText()).toBe("Win or Each Way - 15:05 Second venue");
          });

          it("[PRPI-3254] the odds field should display 4", async () => {
            expect(await oddsFieldSO.numberField.getText()).toBe("4");
          });

          it("[PRPI-3255] the stake field should be empty", async () => {
            expect(await stakeFieldSO.numberField.getText()).toBe("");
          });

          it("[PRPI-3256] the place button should have the text 'Please Enter Stake'", async () => {
            expect(await placeButtonSO.label.getText()).toBe("Please Enter Stake");
          });

          describe("and the stake field is updated to 1", () => {
            beforeAll(async () => {
              await browser.waitUntilClickableNative(stakeFieldSO.numberField);
              await stakeFieldSO.numberField.click();
              await stakeFieldSO.numberField.setValue("1");
              await hideKeyboard();
            });

            it("[PRPI-3257] should display the return value", async () => {
              expect(await betsSummarySO.totalReturnsLabel.getText()).toBe("Total Returns");
              expect(await betsSummarySO.totalReturnsValue.getText()).toBe("$4.00");
            });

            it("[PRPI-3258] the place button should be enabled", async () => {
              expect(await placeButtonSO.element.isEnabled()).toBe(true);
            });

            describe("and the place button is pressed", () => {
              beforeAll(async () => {
                await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK_SUCCESS));
                await browser.waitUntilClickableNative(placeButtonSO.element);
                await placeButtonSO.element.click();
              });

              it("[PRPI-3259] the receipt details should display the selection name", async () => {
                expect(await receiptBetDetailsSO.title.getText()).toBe("Badjoras");
              });

              it("[PRPI-3259] the receipt details should display the market type and event name", async () => {
                expect(await receiptBetDetailsSO.subtitle.getText()).toBe("Win or Each Way - 15:05 Second venue");
              });

              it("[PRPI-3259] the odds should be 4", async () => {
                expect(await oddsSegmentContainer.term.getText()).toBe("Odds");
                expect(await oddsSegment.odds.getText()).toBe("4");
              });

              it("[PRPI-3259] the stake should be $1", async () => {
                expect(await stakeSegmentContainer.term.getText()).toBe("Stake");
                expect(await stakeSegment.odds.getText()).toBe("$1.00");
              });

              it("[PRPI-3259] the returns should be $4", async () => {
                expect(await profitSegmentContainer.term.getText()).toBe("Returns");
                expect(await profitSegment.pnl.getText()).toBe("$4.00");
              });
            });
          });
        });
      });
    });
  });
});
