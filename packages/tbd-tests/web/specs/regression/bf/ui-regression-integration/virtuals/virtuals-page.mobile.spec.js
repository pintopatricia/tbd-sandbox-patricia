const {
  BroadcastsPO,
  SportsbookPlacePanelPO,
  SportsbookReceiptPanelPO,
  SupportingContentButtonPO,
  LiveStreamPO,
  RaceDetailsPO,
  SelectableItemsPO,
  CardPO,
  SportsbookBetButtonPO,
  QuickLinkPO,
  BetDetailsPO,
  ActionButtonPO,
  FixedNumberInputFieldPO,
  CurrencyNumberInputFieldPO,
  BetSegmentsPO,
  BetControlsPO,
  SingleTabPO,
  RaceTimePO,
  VirtualRunnerPO,
  BetsSummaryPO,
  MarketPromoPO,
} = require("../../../../../page-objects");
const { getGenericLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const NavigationTabsListPO = require("@ppb/tbd-shared/components/NavigationTabsList/NavigationTabsList.po");
const SelectableItemsCardGroupPO = require("@ppb/tbd-shared/components/SelectableItemsCardGroup/SelectableItemsCardGroup.web.po");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const navigationTabsListPO = new NavigationTabsListPO();
const firstTabPO = navigationTabsListPO.tabs[0];
const firstSingleTabPO = new SingleTabPO(firstTabPO);
const selectableItemsPO = new SelectableItemsPO();
const selectableItemsCardGroupPO = new SelectableItemsCardGroupPO();
const firstRaceTimePO = new RaceTimePO(selectableItemsPO.races[0]);
const secondRaceTimePO = new RaceTimePO(selectableItemsPO.races[1]);
const broadcastsPO = new BroadcastsPO();
const broadcastsSupportingContentPO = new SupportingContentButtonPO(broadcastsPO.element);
const liveStreamPO = new LiveStreamPO();
const liveStreamIframePO = liveStreamPO.iframeElements[0];
const raceDetailsPO = new RaceDetailsPO();
const cardPO = new CardPO(selectableItemsCardGroupPO.cardContainer);
const runnerPO = new VirtualRunnerPO();
const betButtonPO = new SportsbookBetButtonPO(runnerPO.sportsbookBetButton);
const marketPromoPO = new MarketPromoPO();
const quicklinkPO = new QuickLinkPO();
const singlePanelPO = new SportsbookPlacePanelPO();
const singleControlsPO = new BetControlsPO();
const betDetailsPO = new BetDetailsPO(singlePanelPO.element);
const placeActionButtonPO = new ActionButtonPO(singlePanelPO.place);
const oddsFieldPO = new FixedNumberInputFieldPO(singleControlsPO.fixedInput);
const stakeFieldPO = new CurrencyNumberInputFieldPO(singleControlsPO.currencyInput);
const receiptPanelPO = new SportsbookReceiptPanelPO();
const receiptBetDetailsPO = new BetDetailsPO(receiptPanelPO.element);
const firstSingleSegmentsPO = new BetSegmentsPO(receiptPanelPO.singles[0]);
const betsSummaryPO = new BetsSummaryPO(singlePanelPO.summary);

const mockService = new MockService();

const SECOND_MARKET_ID = "924.307595995";

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
  urn: "ppb:virtualEvent:0|13537254",
  openDate: "1985-02-05T15:00:00.000Z",
  venue: "First venue",
  distance: "First distance",
  sport: SPORT,
};

const SECOND_VIRTUAL_EVENT = {
  __typename: "VirtualEvent",
  urn: "ppb:virtualEvent:0|13537255",
  openDate: "1985-02-05T15:05:00.000Z",
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
const BFF_CARDS_MOCK = { cards: [SECOND_VIRTUAL_CARD_GROUP_MOCK] };

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

const BFF_SELECTABLE_ITEMS_CARDS_MOCK = { cards: [SELECTABLE_ITEMS_CARD_GROUP_MOCK] };

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

const VIRTUALS_VIEW_MOCK = {
  urn: "ppb:tbd:view:generic:virtuals",
  url: "view/d-virtuals",
  title: "Virtuals",
  edges: [NAVIGATION_TABS_LIST_MOCK],
  partialEdges: [NAVIGATION_TABS_LIST_PARTIAL],
  bottomBar: BFF_BOTTOM_BAR_PROPERTY,
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

describe("Virtual sports", () => {
  describe("When virtual sports page opens", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(VIRTUALS_VIEW_MOCK.urn));
      await mockService.mockHttpRequest(getGenericLayout(VIRTUALS_VIEW_MOCK));
      await mockService.mockHttpRequest(getCardResults(BFF_SELECTABLE_ITEMS_CARDS_MOCK));
      await browser.url(routes.getGenericViewUrl("virtuals"));
      await browser.waitUntilDisplayed(navigationTabsListPO.element);
      await browser.waitUntilDisplayed(raceDetailsPO.raceTime);
      await browser.waitUntilDisplayed(liveStreamIframePO);
    });

    it("[PRPI-7424] The first sport tab should be selected by default", async () => {
      expect(await browser.containsClass(firstTabPO, NavigationTabsListPO.states.selected)).toBe(true);
    });

    it("[PRPI-7425] The first sport tab should read 'Horses - Flat'", async () => {
      expect(await firstSingleTabPO.title.getText()).toBe("Horses - Flat");
    });

    it("[PRPI-7426] The first race selector should be selected and read '15:00'", async () => {
      expect(await firstRaceTimePO.activeRaceContent.getText()).toBe("15:00");
    });

    it("[PRPI-7427] The race details time should be displayed", async () => {
      expect(await raceDetailsPO.raceTime.getText()).toBe("15:00");
    });

    it("[PRPI-7428] The race details name should be displayed", async () => {
      expect(await raceDetailsPO.meetingName.getText()).toBe("First venue");
    });

    it("[PRPI-7429] The expanded broadcasts chevron should be displayed", async () => {
      expect(await broadcastsSupportingContentPO.icon.isDisplayed()).toBe(true);
    });

    it("[PRPI-7430] The live stream broadcasts iframe should be displayed", async () => {
      expect(await liveStreamIframePO.isDisplayed()).toBe(true);
    });

    it("[PRPI-7431] The market card should have the market title", async () => {
      expect(await cardPO.title.getText()).toBe("Win or Each Way");
    });

    it("[PRPI-7432] The market card should have the each way terms", async () => {
      expect(await marketPromoPO.title.getText()).toBe("Each Way: 1/4 Odds, 3 Places");
    });

    it("[PRPI-7433] The market card should have runners", async () => {
      expect(await runnerPO.name.getText()).toBe("Princess Mia");
    });

    it("[PRPI-7434] The market card should have bet buttons", async () => {
      expect(await betButtonPO.element.isDisplayed()).toBe(true);
      expect(await betButtonPO.odd.getText()).toBe("4.33");
    });

    it("[PRPI-7435] The game rules quicklink should have the correct href", async () => {
      expect(await quicklinkPO.element.isDisplayed()).toBe(true);
      expect(await quicklinkPO.element.getAttribute("href")).toBe(
        "https://support.betfair.com/app/answers/detail/a_id/5977/",
      );
    });

    describe("When the user clicks on broadcasts accordion", () => {
      beforeAll(async () => {
        await broadcastsSupportingContentPO.expandIcon.waitForClickable();
        await broadcastsSupportingContentPO.expandIcon.click();
      });

      it("[PRPI-7436] The live stream iframe should not be displayed", async () => {
        expect(await liveStreamPO.element.isExisting()).toBe(false);
      });

      describe("when the 15:05 race is selected", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getCardResults(BFF_CARDS_MOCK));
          await secondRaceTimePO.element.click();
          await browser.waitUntilDisplayed(raceDetailsPO.raceTime);
        });

        it("[PRPI-7437] The 15:05 race should be selected", async () => {
          expect(await secondRaceTimePO.activeRaceContent.getText()).toBe("15:05");
        });

        it("[PRPI-7438] The 15:00 race should not be selected", async () => {
          expect(await firstRaceTimePO.activeRaceContent.isDisplayed()).toBe(false);
        });

        it("[PRPI-7439] The race details time should be displayed", async () => {
          expect(await raceDetailsPO.raceTime.getText()).toBe("15:05");
        });

        it("[PRPI-7440] The race details name should be displayed", async () => {
          expect(await raceDetailsPO.meetingName.getText()).toBe("Second venue");
        });

        describe("Virtuals - place single bet", () => {
          describe("When a virtuals bet button is pressed", () => {
            beforeAll(async () => {
              await browser.waitUntilDisplayed(betButtonPO.element);

              await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
              await betButtonPO.element.waitForClickable();
              await betButtonPO.element.click();
              await browser.waitUntilDisplayed(singlePanelPO.element, "First selection hasn't been added");
            });

            it("[PRPI-7441] the betslip single panel should open", async () => {
              expect(await singlePanelPO.element.isDisplayed()).toBe(true);
            });

            it("[PRPI-7442] the bet details should display the selection name", async () => {
              expect(await betDetailsPO.title.getText()).toBe("Badjoras");
            });

            it("[PRPI-7443] the bet details should display the market type and event name", async () => {
              expect(await betDetailsPO.subtitle.getText()).toBe("Win or Each Way - 15:05 Second venue");
            });

            it("[PRPI-7444] the odds field should display 4", async () => {
              expect(await oddsFieldPO.numberField.getValue()).toBe("4");
            });

            it("[PRPI-7445] the stake field should be empty", async () => {
              expect(await stakeFieldPO.numberField.getValue()).toBe("");
            });

            it("[PRPI-7446] the place button should be disabled", async () => {
              expect(await placeActionButtonPO.element.isEnabled()).toBe(false);
            });

            describe("and the stake field is updated to 1", () => {
              beforeAll(async () => {
                await stakeFieldPO.setValue("1");
              });

              it("[PRPI-7447] should display the return value", async () => {
                expect(await betsSummaryPO.totalReturnsLabel.getText()).toBe("Total Returns");
                expect(await betsSummaryPO.totalReturnsValue.getText()).toBe("$4.00");
              });

              it("[PRPI-7448] the place button should be enabled", async () => {
                expect(await singlePanelPO.place.isEnabled()).toBe(true);
              });

              describe("and the place button is pressed", () => {
                beforeAll(async () => {
                  await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK_SUCCESS));
                  await singlePanelPO.place.waitForClickable();
                  await singlePanelPO.place.click();
                });

                it("[PRPI-7449] the receipt details should display the selection name", async () => {
                  expect(await receiptBetDetailsPO.title.getText()).toBe("Badjoras");
                });

                it("[PRPI-7449] the receipt details should display the market type and event name", async () => {
                  expect(await receiptBetDetailsPO.subtitle.getText()).toBe("Win or Each Way - 15:05 Second venue");
                });

                it("[PRPI-7449] the odds should be 4", async () => {
                  expect(await firstSingleSegmentsPO.leftLabel.getText()).toBe("Odds");
                  expect(await firstSingleSegmentsPO.leftValue.getText()).toBe("4");
                });

                it("[PRPI-7449] the stake should be $1", async () => {
                  expect(await firstSingleSegmentsPO.midLabel.getText()).toBe("Stake");
                  expect(await firstSingleSegmentsPO.midValue.getText()).toBe("$1.00");
                });

                it("[PRPI-7449] the returns should be $4", async () => {
                  expect(await firstSingleSegmentsPO.rightLabel.getText()).toBe("Returns");
                  expect(await firstSingleSegmentsPO.rightValue.getText()).toBe("$4.00");
                });
              });
            });
          });
        });
      });
    });
  });
});
