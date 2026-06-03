import {
  createHydratedMatchStatsCardByURNSelector,
  createLayoutStructureByViewURNSelector,
  createGetRunnerViewTitlesFromRunnerViewLinksSelector,
  createHydratedCompetitionRegionSelector,
  createExchangeRunnerOddsWithPotentialBetsByURNSelector,
  createIsProductSwitcherActiveSelector,
  createIsProductSwitcherActiveNativeSelector,
} from "./application-state-selectors";
import { createCardGroupByURNSelector } from "./layout/cardgroups/cardgroups-selectors";
import { createCardByURNSelector, createFindCardbyURNSelector } from "./layout/cards/cards-selectors";
import { createFindViewByURNSelector } from "./layout/views/view-selectors";
import { createNavigationTabsListByURNSelector } from "./layout/navigation-tabs-list/navigation-tabs-list-selectors";
import { createNavigationTabByURNSelector } from "./layout/navigation-tabs/navigation-tabs-selectors";
import { createCompetitionSelector } from "./entities/competitions/competition-selectors";
import { createExchangeMarketRunnerByMarketAndRunnerURNsSelector } from "./entities/exchange-markets/exchange-market-selectors";
import { createExchangeRunnerOddsByURNSelector } from "./entities/exchange-runners/exchange-runner-selectors";
import { createMarketPotentialBetsSelector } from "./betting/exchange-betting/exchange-betting-selectors";
import { createExcRunnerPotentialBetsByRunnerURNSelector } from "./entities/entities-selectors";
import { createHasProductSwitcherSelector } from "./layout/cards/bottom-bar/bottom-bar-card-selectors";
import { ExchangeSide } from "./constants";

jest.mock("./layout/cardgroups/cardgroups-selectors");
jest.mock("./layout/cards/cards-selectors");
jest.mock("./layout/views/view-selectors", () => ({
  createFindViewByURNSelector: jest.fn(),
}));
jest.mock("./layout/navigation-tabs-list/navigation-tabs-list-selectors");
jest.mock("./layout/navigation-tabs/navigation-tabs-selectors");
jest.mock("./entities/races/race-selectors");
jest.mock("./entities/meetings/meeting-selectors");
jest.mock("./entities/entities-selectors", () => ({
  createExcRunnerPotentialBetsByRunnerURNSelector: jest.fn(() => jest.fn(() => [])),
}));
jest.mock("./entities/competitions/competition-selectors");
jest.mock("./entities/exchange-markets/exchange-market-selectors");
jest.mock("./entities/exchange-runners/exchange-runner-selectors");
jest.mock("./betting/exchange-betting/exchange-betting-selectors");
jest.mock("./layout/cards/bottom-bar/bottom-bar-card-selectors", () => ({
  createHasProductSwitcherSelector: jest.fn(),
}));

describe("state selectors", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("createHydratedMatchStatsCardByURNSelector", () => {
    describe("when no card with that URN exists", () => {
      let state;
      const setup = () => {
        state = {
          layouts: {
            cards: {
              matchstats: {
                "ppb:tbd:card:matchStats:29980518": {
                  urn: "ppb:tbd:card:matchStats:29980518",
                },
              },
            },
          },
          entities: {
            footballfixtures: {},
          },
        };

        createCardByURNSelector.mockReturnValue(() => undefined);
      };

      it("should return undefined", () => {
        setup();

        expect(createHydratedMatchStatsCardByURNSelector()(state, "card:3")).toEqual(undefined);
      });
    });

    describe("when there are no stats for the given card", () => {
      let state;
      const matchStatsCard = {
        urn: "ppb:tbd:card:matchStats:29980518",
        fixture: "ppb:fixture:29980518",
      };
      const fixture = {
        urn: "ppb:fixture:29980518",
      };
      const setup = () => {
        state = {
          layouts: {
            cards: {
              matchstats: {
                "ppb:tbd:card:matchStats:29980518": {
                  urn: "ppb:tbd:card:matchStats:29980518",
                  fixture: "ppb:fixture:29980518",
                },
              },
            },
          },
          entities: {
            footballfixtures: {
              "ppb:fixture:29980518": fixture,
            },
          },
        };

        createCardByURNSelector.mockReturnValue(() => matchStatsCard);
      };

      it("should return undefined", () => {
        setup();
        createCardByURNSelector.mockReturnValue(() => undefined);

        expect(createHydratedMatchStatsCardByURNSelector()(state, "fakeUrn")).toEqual(undefined);
      });
    });

    describe("when there are stats for the given card", () => {
      let state;
      const matchStatsCard = {
        urn: "ppb:tbd:card:matchStats:29980518",
        fixture: "ppb:fixture:29980518",
      };
      const fixture = {
        urn: "ppb:fixture:29980518",
        home: { name: "home" },
        away: { name: "away" },
        stats: [
          {
            periodStatus: "FULL",
            home: { corners: 4 },
            away: { corners: 5 },
          },
        ],
      };
      const setup = () => {
        state = {
          layouts: {
            cards: {
              matchstats: {
                "ppb:tbd:card:matchStats:29980518": matchStatsCard,
              },
            },
          },
          entities: {
            footballfixtures: {
              "ppb:fixture:29980518": fixture,
            },
          },
        };

        createCardByURNSelector.mockReturnValue(() => matchStatsCard);
      };

      it("should return the match stats card along with the opponents' details and its FULL stats", () => {
        setup();

        expect(createHydratedMatchStatsCardByURNSelector()(state, "ppb:tbd:card:matchStats:29980518")).toEqual({
          urn: "ppb:tbd:card:matchStats:29980518",
          fixture: "ppb:fixture:29980518",
          home: {
            details: { name: "home" },
            stats: { corners: 4 },
          },
          away: {
            details: { name: "away" },
            stats: { corners: 5 },
          },
        });
      });
    });
  });

  describe("createLayoutStructureByViewURNSelector", () => {
    describe("when no view with that URN exists", () => {
      let state;

      const setup = () => {
        state = {
          layouts: {
            views: {},
          },
        };

        createFindViewByURNSelector.mockReturnValue(() => undefined);
      };

      it("should return undefined", () => {
        setup();

        expect(createLayoutStructureByViewURNSelector()(state, "ppb:tbd:view:sport:1")).toEqual(undefined);
      });
    });

    describe("when current view has no items", () => {
      let state;
      const setup = () => {
        const view = {
          urn: "ppb:tbd:view:sport:1",
          url: "football/sport:1",
          title: "Football",
          typename: "SportView",
          sport: "ppb:eventType:1",
        };

        state = {
          layouts: {
            views: {},
          },
        };

        createFindViewByURNSelector.mockReturnValue(() => view);
      };

      it("should return undefined", () => {
        setup();

        expect(createLayoutStructureByViewURNSelector()(state, "ppb:tbd:view:sport:1")).toEqual(undefined);
      });
    });

    describe("when current view has items", () => {
      let state;
      let sportView;
      let eventMarketCard1;
      let eventMarketCard2;
      let eventMarketCard3;
      let eventMarketCard4;
      let eventMarketCard5;
      let marketExtendedCard1;
      let marketExtendedCard2;
      let popularBetBuilderCard;
      let popularMultiplesBetBuilderCard;
      let eventMarketGroup;
      let pebbleCardGroup;
      let filteredCouponCardGroup;
      let navigationTabList;
      let navigationTab;
      let racingSwimlaneCardGroup;
      let popularSwimlaneCardGroup;

      const setup = () => {
        eventMarketCard1 = {
          urn: "ppb:tbd:card:eventPrimaryMarket:30092111",
          type: "EventMarketCard",
        };

        eventMarketCard2 = {
          urn: "ppb:tbd:card:eventPrimaryMarket:30092222",
          type: "EventMarketCard",
        };

        eventMarketCard3 = {
          urn: "ppb:tbd:card:eventPrimaryMarket:30092333",
          type: "EventMarketCard",
        };

        eventMarketCard4 = {
          urn: "ppb:tbd:card:eventPrimaryMarket:30092444",
          type: "EventMarketCard",
        };

        eventMarketCard5 = {
          urn: "ppb:tbd:card:eventPrimaryMarket:30092555",
          type: "EventMarketCard",
        };

        marketExtendedCard1 = {
          urn: "ppb:tbd:card:marketExtended:1.174822835;924.243683269",
          type: "MARKET_EXTENDED_CARD",
        };

        marketExtendedCard2 = {
          urn: "ppb:tbd:card:marketExtended:1.174822765;924.243683177",
          type: "MARKET_EXTENDED_CARD",
        };

        popularBetBuilderCard = {
          urn: "ppb:tbd:card:popularbetbuilder:111",
          type: "PopularBetBuilderCard",
        };

        popularMultiplesBetBuilderCard = {
          urn: "ppb:tbd:card:multiplesBetBuilder:popular:333",
          type: "PopularMultiplesBetBuilderCard",
        };

        eventMarketGroup = {
          type: "EventMarketCardGROUP",
          urn: "ppb:tbd:cardgroup:swimlane:X3zlNhIAACQAUjAx/s/1",
          items: [{ urn: eventMarketCard2.urn, typename: "EventMarketCard" }],
        };

        pebbleCardGroup = {
          urn: "ppb:tbd:card:pebbleExtendedMarkets:1.174822835",
          type: "PEBBLE_CARDGROUP",
          items: [
            {
              name: "0.5",
              urn: "ppb:tbd:card:marketExtended:1.174822835;924.243683269",
            },
            {
              name: "1.5",
              urn: "ppb:tbd:card:marketExtended:1.174822765;924.243683177",
            },
          ],
        };

        filteredCouponCardGroup = {
          urn: "ppb:tbd:cardgroup:coupon:X9Dx_hIAACkAwzyd/s/1",
          filterOptions: {},
          pageInfo: { hasNextPage: false },
          title: "Football In-Play",
          typename: "FilteredCouponCardGroup",
          items: [{ urn: eventMarketCard5.urn, typename: "EventMarketCard" }],
        };

        racingSwimlaneCardGroup = {
          urn: "ppb:tbd:cardgroup:racingSwimlane:abc123",
          type: "RacingSwimlaneCardGroup",
          items: [{ urn: eventMarketCard3.urn, typename: "EventMarketCard" }],
        };

        popularSwimlaneCardGroup = {
          urn: "ppb:tbd:cardgroup:popularSwimlane:def456",
          type: "PopularSwimlaneCardGroup",
          items: [
            {
              urn: popularBetBuilderCard.urn,
              typename: popularBetBuilderCard.type,
            },
            {
              urn: popularMultiplesBetBuilderCard.urn,
              typename: popularMultiplesBetBuilderCard.type,
            },
          ],
        };

        navigationTabList = {
          urn: "ppb:tbd:card:navigationTabsList:abc",
          title: "All Chicken Racing",
          items: [
            {
              urn: "ppb:tbd:view:navigationTab:123",
              title: "some title 1",
            },
            {
              urn: "ppb:tbd:view:navigationTab:456",
              title: "some title 2",
            },
          ],
        };

        navigationTab = {
          urn: "ppb:tbd:view:navigationTab:123",
          title: {
            translated: "some title 1",
          },
          items: [{ urn: eventMarketCard4.urn, typename: "EventMarketCard" }],
        };

        sportView = {
          urn: "ppb:tbd:view:sport:1",
          typename: "SportView",
          items: [
            { urn: eventMarketCard1.urn, typename: "EventMarketCard" },
            { urn: eventMarketGroup.urn, typename: "SwimlaneCardGroup" },
            { urn: pebbleCardGroup.urn, typename: "PebbleCardGroup" },
            { urn: filteredCouponCardGroup.urn, typename: "FilteredCouponCardGroup" },
            { urn: navigationTabList.urn, typename: "NavigationTabsList" },
            { urn: racingSwimlaneCardGroup.urn, typename: "RacingSwimlaneCardGroup" },
            { urn: popularSwimlaneCardGroup.urn, typename: "PopularSwimlaneCardGroup" },
          ],
        };

        state = {
          layouts: {
            views: { sport: { [sportView.urn]: sportView } },
            cards: {
              [eventMarketCard1.urn]: eventMarketCard1,
              [eventMarketCard2.urn]: eventMarketCard2,
              [eventMarketCard3.urn]: eventMarketCard3,
              [eventMarketCard4.urn]: eventMarketCard4,
              [eventMarketCard5.urn]: eventMarketCard5,
              [marketExtendedCard1.urn]: marketExtendedCard1,
              [marketExtendedCard2.urn]: marketExtendedCard2,
              [popularBetBuilderCard.urn]: popularBetBuilderCard,
              [popularMultiplesBetBuilderCard.urn]: popularMultiplesBetBuilderCard,
            },
            cardgroups: {
              swimlanecardgroups: {
                [eventMarketGroup.urn]: eventMarketGroup,
              },
              halftimespecialsswimlanecardgroups: {
                [eventMarketGroup.urn]: eventMarketGroup,
              },
              pebblecardgroups: {
                [pebbleCardGroup.urn]: pebbleCardGroup,
              },
              filteredcouponcardgroups: {
                [filteredCouponCardGroup.urn]: filteredCouponCardGroup,
              },
              racingswimlanecardgroups: {
                [racingSwimlaneCardGroup.urn]: racingSwimlaneCardGroup,
              },
              popularswimlanecardgroups: {
                [popularSwimlaneCardGroup.urn]: popularSwimlaneCardGroup,
              },
            },
            navigationtabslists: {
              [navigationTabList.urn]: navigationTabList,
            },
            navigationtabs: {
              [navigationTab.urn]: navigationTab,
            },
          },
        };

        createFindViewByURNSelector.mockReturnValue((views, urn) => views.sport[urn]);
        createFindCardbyURNSelector.mockReturnValue((cards, urn) => cards[urn]);
        createCardGroupByURNSelector.mockReturnValueOnce((swimlanecardgroups, urn) => swimlanecardgroups[urn]);
        createCardGroupByURNSelector.mockReturnValueOnce(
          (halftimespecialsswimlanecardgroups, urn) => halftimespecialsswimlanecardgroups[urn],
        );
        createCardGroupByURNSelector.mockReturnValueOnce((pebblecardgroups, urn) => pebblecardgroups[urn]);
        createCardGroupByURNSelector.mockReturnValueOnce(
          (filteredcouponcardgroups, urn) => filteredcouponcardgroups[urn],
        );
        createCardGroupByURNSelector.mockReturnValueOnce(
          (racingswimlanecardgroups, urn) => racingswimlanecardgroups[urn],
        );
        createCardGroupByURNSelector.mockReturnValueOnce(
          (popularswimlanecardgroups, urn) => popularswimlanecardgroups[urn],
        );
        createNavigationTabsListByURNSelector.mockReturnValue((navigationtablist, urn) => navigationtablist[urn]);
        createNavigationTabByURNSelector.mockReturnValue((navigationtab, urn) => navigationtab[urn]);
      };

      it("should return view hydrated with full relational layout structure in 'items'", () => {
        setup();

        const result = {
          ...sportView,
          items: {
            [eventMarketCard1.urn]: eventMarketCard1,
            [eventMarketGroup.urn]: {
              ...eventMarketGroup,
              items: {
                [eventMarketCard2.urn]: eventMarketCard2,
              },
            },
            [pebbleCardGroup.urn]: {
              ...pebbleCardGroup,
              items: {
                [marketExtendedCard1.urn]: marketExtendedCard1,
                [marketExtendedCard2.urn]: marketExtendedCard2,
              },
            },
            [filteredCouponCardGroup.urn]: {
              ...filteredCouponCardGroup,
              items: {
                [eventMarketCard5.urn]: eventMarketCard5,
              },
            },
            [navigationTabList.urn]: {
              ...navigationTabList,
              items: {
                [navigationTab.urn]: {
                  ...navigationTab,
                  items: {
                    [eventMarketCard4.urn]: eventMarketCard4,
                  },
                },
              },
            },
            [racingSwimlaneCardGroup.urn]: {
              ...racingSwimlaneCardGroup,
              items: {
                [eventMarketCard3.urn]: eventMarketCard3,
              },
            },
            [popularSwimlaneCardGroup.urn]: {
              ...popularSwimlaneCardGroup,
              items: {
                [popularBetBuilderCard.urn]: popularBetBuilderCard,
                [popularMultiplesBetBuilderCard.urn]: popularMultiplesBetBuilderCard,
              },
            },
          },
        };

        expect(createLayoutStructureByViewURNSelector()(state, "ppb:tbd:view:sport:1")).toEqual(result);
      });
    });
  });

  describe("createGetRunnerViewTitlesFromRunnerViewLinksSelector", () => {
    it("should return view hydrated with full relational layout structure in 'items'", () => {
      const state = {
        layouts: {
          views: {
            runner: {
              "ppb:tbd:view:runner:1.175610606/866340/0": {
                typename: "RunnerView",
                urn: "ppb:tbd:view:runner:1.175610606/866340/0",
                url: "Not Implemented",
                title: "Additional Information",
                items: [
                  { urn: "ppb:tbd:card:fixture:30123836", typename: "FixtureCard" },
                  { urn: "ppb:tbd:card:marketGraphs:1.175610606/866340/0", typename: "MarketGraphsCard" },
                ],
              },
              "ppb:tbd:view:runner:1.175565548/25912/0": {
                typename: "RunnerView",
                urn: "ppb:tbd:view:runner:1.175565548/25912/0",
                url: "Not Implemented",
                items: [],
              },
            },
          },
        },
      };

      const runnerViewLinks = {
        "ppb:excRunner:1.175565548/24/0": {
          runnerUrn: "ppb:excRunner:1.175565548/24/0",
          viewUrl: "Not Implemented",
          viewUrn: "ppb:tbd:view:runner:1.175610606/866340/0",
        },
        "ppb:excRunner:1.175565548/25912/0": {
          runnerUrn: "ppb:excRunner:1.175565548/25912/0",
          viewUrl: "Not Implemented",
          viewUrn: "ppb:tbd:view:runner:1.175565548/25912/0",
        },
      };

      expect(
        createGetRunnerViewTitlesFromRunnerViewLinksSelector()(state.layouts.views.runner, runnerViewLinks),
      ).toEqual({
        "ppb:tbd:view:runner:1.175565548/25912/0": undefined,
        "ppb:tbd:view:runner:1.175610606/866340/0": "Additional Information",
      });
    });
  });

  describe("createHydratedCompetitionRegionSelector", () => {
    describe("when no card with that URN exists", () => {
      const state = {
        layouts: {
          cards: {},
        },
        entities: {
          competition: {},
        },
      };

      beforeAll(() => {
        createCardByURNSelector.mockReturnValue(() => undefined);
      });

      it("should return null", () => {
        const result = createHydratedCompetitionRegionSelector()(state, "URN");

        expect(result).toBeNull();
      });
    });

    describe("when the card exists", () => {
      const state = {
        layouts: {
          cards: {
            competitionregions: {
              "ppb:tbd:competitionregions:1": {
                urn: "ppb:tbd:competitionregions:1",
                competitionRegions: [
                  {
                    country: { urn: "ppb:tbd:country:pt", code: "Region 1", flag: "someflag.svg" },
                    competitionViewLinks: [
                      {
                        title: "Competition 1",
                      },
                    ],
                  },
                ],
              },
            },
          },
        },
        entities: {
          competitions: {
            "ppb:competition:123": {
              urn: "ppb:competition:123",
            },
          },
        },
      };

      const changedState = {
        layouts: {
          cards: {
            competitionregions: {
              "ppb:tbd:competitionregions:1": {
                urn: "ppb:tbd:competitionregions:1",
                competitionRegions: [
                  {
                    title: "Region 1",
                    competitionViewLinks: [
                      {
                        title: "Competition 1",
                      },
                    ],
                  },
                ],
              },
            },
          },
        },
        entities: {
          competitions: {
            "ppb:competition:123": {
              changed: true,
              urn: "ppb:competition:123",
            },
          },
        },
      };

      const setup = () => {
        createCardByURNSelector.mockReturnValue(
          () => state.layouts.cards.competitionregions["ppb:tbd:competitionregions:1"],
        );
        createCompetitionSelector.mockReturnValue(() => state.entities.competitions["ppb:competition:123"]);
      };

      it("should return the hydrated competition region card", () => {
        setup();
        const hydrated = createHydratedCompetitionRegionSelector()(state, "ppb:tbd:competitionregions:1");

        expect(hydrated).toEqual([
          {
            code: "Region 1",
            flag: "someflag.svg",
            urn: "ppb:tbd:country:pt",
            competitionViewLinks: [
              {
                competition: { urn: "ppb:competition:123" },
              },
            ],
          },
        ]);
      });

      it("should call createCompetitionSelector", () => {
        setup();
        createHydratedCompetitionRegionSelector()(state, "ppb:tbd:competitionregions:1");

        expect(createCompetitionSelector).toHaveBeenCalledTimes(1);
      });

      describe("when calling the same selector with the same information", () => {
        setup();

        const getHydratedCompetitionRegionSelector = createHydratedCompetitionRegionSelector();

        const firstResponse = getHydratedCompetitionRegionSelector(state, "ppb:tbd:competitionregions:1");
        const secondResponse = getHydratedCompetitionRegionSelector(state, "ppb:tbd:competitionregions:1");

        it("should return the same reference", () => {
          expect(firstResponse === secondResponse).toBe(true);
        });
      });

      describe("when calling the same selector with different state", () => {
        setup();
        const getHydratedCompetitionRegionSelector = createHydratedCompetitionRegionSelector();

        const firstResponse = getHydratedCompetitionRegionSelector(state, "ppb:tbd:competitionregions:1");
        const secondResponse = getHydratedCompetitionRegionSelector(changedState, "ppb:tbd:competitionregions:1");

        it("should return a different reference", () => {
          expect(firstResponse === secondResponse).toBe(false);
        });
      });
    });
  });

  describe("createExchangeRunnerOddsWithPotentialBetsByURNSelector", () => {
    describe("when there's no information for the given runner URN", () => {
      const state = {
        layouts: {
          cards: {},
        },
        betting: {},
        entities: {
          competition: {},
          exchangemarkets: {},
          exchangerunners: {},
        },
        betslip: {
          exchangeContext: undefined,
        },
      };

      const props = {
        marketURN: "ppb:tbd:market:1.174822835;924.243683269",
        runnerURN: "ppb:excRunner:1.174822835/24/0",
        bestOdds: true,
        side: ExchangeSide.BACK,
      };

      beforeAll(() => {
        createExchangeMarketRunnerByMarketAndRunnerURNsSelector.mockReturnValue(() => undefined);
        createExchangeRunnerOddsByURNSelector.mockReturnValue(() => undefined);
        createMarketPotentialBetsSelector.mockReturnValue(() => undefined);
        createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => []);
      });

      it("should return null", () => {
        const result = createExchangeRunnerOddsWithPotentialBetsByURNSelector()(state, props);

        expect(result).toBe(undefined);
      });
    });

    describe("when the given market and runner exist", () => {
      let state;

      const props = {
        marketURN: "ppb:tbd:market:1.174822835;924.243683269",
        runnerURN: "ppb:excRunner:1.174822835/24/0",
        bestOdds: true,
        side: ExchangeSide.BACK,
      };

      let marketRunner;

      let exchangeRunner;

      let potentialBets;

      beforeEach(() => {
        state = {
          betting: {},
          entities: {
            exchangemarkets: {},
            exchangerunners: {},
          },
          betslip: {
            exchangeContext: {
              marketDepth: 0,
            },
          },
        };

        marketRunner = {
          urn: "ppb:excRunner:1.174822835/24/0",
          selectionId: 24,
          name: "horse 1",
          handicap: 0,
        };

        exchangeRunner = {
          urn: "ppb:excRunner:1.174822835/24/0",
          market: "ppb:market:1.174822835",
          selectionId: 24,
          handicap: 0,
          back: [
            {
              price: 1,
              liquidity: 10,
              marketDepth: 0,
            },
          ],
          lay: [
            {
              price: 2,
              liquidity: 5,
              marketDepth: 1,
            },
          ],
          reduction: null,
        };

        potentialBets = [
          {
            handicap: 1,
            id: "bet2",
            orderType: "LIMIT",
            selectionId: 24,
            side: "LAY",
            size: 1,
            price: 15,
            profit: 15,
            liability: 0.2,
            payout: 13,
          },
          {
            handicap: 0,
            id: "bet1",
            orderType: "LIMIT",
            selectionId: 24,
            side: "BACK",
            size: 1,
            price: 10,
            profit: 10,
            liability: 0.1,
            payout: 11,
          },
        ];

        createExchangeMarketRunnerByMarketAndRunnerURNsSelector.mockReturnValue(() => marketRunner);
        createExchangeRunnerOddsByURNSelector.mockReturnValue(() => exchangeRunner);
        createMarketPotentialBetsSelector.mockReturnValue(() => potentialBets);
        createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => potentialBets);
      });

      it("should return exchange runner odds with back and lay as an empty array when runner does not have them", () => {
        state = {
          ...state,
          betslip: {
            exchangeContext: {
              marketDepth: 1,
            },
          },
        };
        marketRunner = {
          ...marketRunner,
          handicap: 2,
        };
        exchangeRunner = {
          ...exchangeRunner,
          back: [],
          lay: [],
        };

        const result = createExchangeRunnerOddsWithPotentialBetsByURNSelector()(state, props);
        expect(result).toStrictEqual({
          ...exchangeRunner,
          back: [],
          lay: [],
        });
      });

      describe("and there're potential bets for that runner", () => {
        it("should return exchange runner odds with potential bet back", () => {
          const result = createExchangeRunnerOddsWithPotentialBetsByURNSelector()(state, props);
          expect(result).toStrictEqual({
            ...exchangeRunner,
            back: [
              {
                isPotentialBet: true,
                liquidity: 10,
                marketDepth: 0,
                price: 1,
              },
            ],
            lay: [
              {
                isPotentialBet: false,
                liquidity: 5,
                marketDepth: 1,
                price: 2,
              },
            ],
          });
        });

        it("should return exchange runner odds with potential bet lay", () => {
          state = {
            ...state,
            betslip: {
              exchangeContext: {
                marketDepth: 1,
              },
            },
          };
          marketRunner = {
            ...marketRunner,
            handicap: 1,
          };

          const result = createExchangeRunnerOddsWithPotentialBetsByURNSelector()(state, props);
          expect(result).toStrictEqual({
            ...exchangeRunner,
            back: [
              {
                isPotentialBet: false,
                liquidity: 10,
                marketDepth: 0,
                price: 1,
              },
            ],
            lay: [
              {
                isPotentialBet: true,
                liquidity: 5,
                marketDepth: 1,
                price: 2,
              },
            ],
          });
        });
      });

      describe("and there're potential bets for that runner but in a different market depth", () => {
        it("should return exchange runner odds with both potential bets false when marketDepth doesn't match", () => {
          state = {
            ...state,
            betslip: {
              exchangeContext: {
                marketDepth: 2,
              },
            },
          };

          const result = createExchangeRunnerOddsWithPotentialBetsByURNSelector()(state, props);
          expect(result).toStrictEqual({
            ...exchangeRunner,
            back: [
              {
                isPotentialBet: false,
                liquidity: 10,
                marketDepth: 0,
                price: 1,
              },
            ],
            lay: [
              {
                isPotentialBet: false,
                liquidity: 5,
                marketDepth: 1,
                price: 2,
              },
            ],
          });
        });
      });

      describe("and there're no potential bets for that runner", () => {
        beforeEach(() => {
          createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => []);
        });
        it("should return exchange runner odds with both potential bets false when no potential bets", () => {
          const result = createExchangeRunnerOddsWithPotentialBetsByURNSelector()(state, props);
          expect(result).toStrictEqual({
            ...exchangeRunner,
            back: [
              {
                isPotentialBet: false,
                liquidity: 10,
                marketDepth: 0,
                price: 1,
              },
            ],
            lay: [
              {
                isPotentialBet: false,
                liquidity: 5,
                marketDepth: 1,
                price: 2,
              },
            ],
          });
        });
      });
    });
  });

  describe("createIsProductSwitcherActiveSelector", () => {
    const getHasProductSwitcher = jest.fn();

    beforeEach(() => {
      createHasProductSwitcherSelector.mockReturnValue(getHasProductSwitcher);
      getHasProductSwitcher.mockReturnValue(true);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe("when PRODUCT_SWITCHER throttle is inactive", () => {
      const throttleOffMock = {
        layouts: {
          cards: {
            bottombar: {},
          },
          views: {},
        },
        entities: {
          competition: {},
          throttles: { PRODUCT_SWITCHER: { isActive: false } },
        },
      };

      describe("and `hasProductSwitcher` is false", () => {
        it("should return false", () => {
          getHasProductSwitcher.mockReturnValue(false);

          expect(createIsProductSwitcherActiveSelector()(throttleOffMock)).toEqual(false);
        });
      });

      describe("and `hasProductSwitcher` is true", () => {
        it("should return false", () => {
          getHasProductSwitcher.mockReturnValue(true);

          expect(createIsProductSwitcherActiveSelector()(throttleOffMock)).toEqual(false);
        });
      });
    });

    describe("when PRODUCT_SWITCHER throttle is active", () => {
      const stateMock = {
        layouts: {
          cards: {
            bottombar: {},
          },
          views: {},
        },
        entities: {
          competition: {},
          throttles: { PRODUCT_SWITCHER: { isActive: true } },
        },
      };
      describe("and `hasProductSwitcher` is false", () => {
        it("should return false", () => {
          getHasProductSwitcher.mockReturnValue(false);

          expect(createIsProductSwitcherActiveSelector()(stateMock)).toEqual(false);
        });
      });

      describe("and `hasProductSwitcher` is true", () => {
        it("should return true", () => {
          getHasProductSwitcher.mockReturnValue(true);

          expect(createIsProductSwitcherActiveSelector()(stateMock)).toEqual(true);
        });
      });
    });
  });

  describe("createIsProductSwitcherActiveNativeSelector", () => {
    const getHasProductSwitcher = jest.fn();

    beforeEach(() => {
      createHasProductSwitcherSelector.mockReturnValue(getHasProductSwitcher);
      getHasProductSwitcher.mockReturnValue(true);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe("when PRODUCT_SWITCHER_NATIVE throttle is inactive", () => {
      const throttleOffMock = {
        layouts: {
          cards: {
            bottombar: {},
          },
          views: {},
        },
        entities: {
          competition: {},
          throttles: { PRODUCT_SWITCHER_NATIVE: { isActive: false } },
        },
      };

      describe("and `hasProductSwitcher` is false", () => {
        it("should return false", () => {
          getHasProductSwitcher.mockReturnValue(false);

          expect(createIsProductSwitcherActiveNativeSelector()(throttleOffMock)).toEqual(false);
        });
      });

      describe("and `hasProductSwitcher` is true", () => {
        it("should return false", () => {
          getHasProductSwitcher.mockReturnValue(true);

          expect(createIsProductSwitcherActiveNativeSelector()(throttleOffMock)).toEqual(false);
        });
      });
    });

    describe("when PRODUCT_SWITCHER_NATIVE throttle is active", () => {
      const stateMock = {
        layouts: {
          cards: {
            bottombar: {},
          },
          views: {},
        },
        entities: {
          competition: {},
          throttles: { PRODUCT_SWITCHER_NATIVE: { isActive: true } },
        },
      };
      describe("and `hasProductSwitcher` is false", () => {
        it("should return false", () => {
          getHasProductSwitcher.mockReturnValue(false);

          expect(createIsProductSwitcherActiveNativeSelector()(stateMock)).toEqual(false);
        });
      });

      describe("and `hasProductSwitcher` is true", () => {
        it("should return true", () => {
          getHasProductSwitcher.mockReturnValue(true);

          expect(createIsProductSwitcherActiveNativeSelector()(stateMock)).toEqual(true);
        });
      });
    });
  });
});
