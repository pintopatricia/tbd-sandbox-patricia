import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { createExchangeMarketSelector } from "@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { PUSH } from "@ppb/tbd-store/actions/router";
import { UI__NAVIGATE_TO_EVENT_FROM_MARKET_SCOREBOARD } from "@ppb/tbd-store/actions/navigation";
import { SUBSCRIBE_MAIN_MARKET_TRANSITIONS } from "@ppb/tbd-store/actions/market-transitions";
import {
  SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
} from "@ppb/tbd-store/actions/sportsbook-markets";
import {
  SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
  UNSUBSCRIBE_EXCHANGE_MARKET_UPDATES,
} from "@ppb/tbd-store/actions/exchange-markets";
import { Jurisdiction } from "@ppb/tbd-store/state/constants";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.spyOn(global.console, "error").mockImplementation();

const getSportEventByURN = jest.fn(() => ({
  name: "chelsea v burnley",
}));

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/sport-events/sport-event-selectors", () => ({
  createSportEventByURNSelector: () => getSportEventByURN,
}));

jest.mock("@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors", () => ({
  getSportsbookMarket: jest.fn(() => ({
    marketId: "924.111111",
  })),
}));

jest.mock("@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors", () => ({
  createExchangeMarketSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => ({ jurisdiction: { jurisdiction: Jurisdiction.INTERNATIONAL } })),
}));

describe("MapToPropsFactory - FixtureCard", () => {
  describe("makeMapStateToProps", () => {
    it("should create the selectors", () => {
      makeMapStateToProps();

      expect(createCardByURNSelector).toHaveBeenCalledWith();
      expect(createExchangeMarketSelector).toHaveBeenCalledWith();
    });

    describe("mapStateToProps", () => {
      const getFixtureCardbyURN = jest.fn();
      const getExchangeMarketByURN = jest.fn();
      const FIXTURE = "FIXTURE";

      const STATE = {
        layouts: { cards: { fixtures: FIXTURE } },
        entities: { fixtures: {} },
        router: {
          currentView: null,
        },
      };
      const STATE_WITH_ROUTER = {
        layouts: { cards: { fixtures: FIXTURE }, views: {} },
        router: { theRouter: "" },
        entities: { fixtures: {} },
      };
      const STATE_WITH_RUNNER_VIEW = {
        layouts: {
          cards: { fixtures: FIXTURE },
          views: {
            runner: { 1: {} },
          },
        },
        router: { currentView: null },
        entities: { fixtures: {} },
      };

      const STATE_WITH_STATISTICS_VIEW = {
        layouts: {
          cards: { fixtures: FIXTURE },
          views: {
            runner: { "ppb:tbd:view:generic:statistics": {} },
          },
        },
        entities: { fixtures: {} },
        router: {
          currentView: null,
        },
      };
      const CONTAINER_PROPS = { urn: "ppb:card:fixture:1234" };
      let mapStateToProps;

      beforeEach(() => {
        createCardByURNSelector.mockReturnValue(getFixtureCardbyURN);
        createExchangeMarketSelector.mockReturnValue(getExchangeMarketByURN);

        mapStateToProps = makeMapStateToProps();
      });

      it("should call getFixtureCardbyURN with the correct parameters", () => {
        mapStateToProps(STATE, CONTAINER_PROPS);

        expect(getFixtureCardbyURN).toHaveBeenCalledWith(FIXTURE, CONTAINER_PROPS.urn);
      });

      it("should return undefined when there is no fixtureCard", () => {
        expect(mapStateToProps(STATE, CONTAINER_PROPS)).toEqual({});
      });

      describe("and there is a corresponding fixtureCard", () => {
        const FIXTURE_CARD = {
          fixture: "fixtureURN",
          eventViewLink: {
            viewUrn: "viewUrn",
            viewUrl: "viewUrl",
          },
          sportevent: "sportEventURN",
          urn: "ppb:card:fixture:1234",
          availableToSubscribe: true,
        };

        beforeEach(() => {
          getFixtureCardbyURN.mockReturnValue(FIXTURE_CARD);
        });

        it("should return the fixture urn", () => {
          expect(mapStateToProps(STATE, CONTAINER_PROPS).fixture).toBe(FIXTURE_CARD.fixture);
        });

        describe("when `getUserDetailsSelector` throws", () => {
          const GET_USER_DETAILS_ERROR = "GET_USER_DETAILS_ERROR";

          it("should return an empty object", () => {
            getUserDetails.mockImplementationOnce(() => {
              throw new Error(GET_USER_DETAILS_ERROR);
            });

            mapStateToProps(STATE, CONTAINER_PROPS);

            expect(global.console.error).toHaveBeenCalledTimes(1);
            expect(global.console.error).toHaveBeenCalledWith(new Error(GET_USER_DETAILS_ERROR));
          });
        });

        describe("when brand setting HORIZONTAL_COUPON is true", () => {
          it("should return showHorizontalDuration as true", () => {
            const component = mapStateToProps(
              {
                ...STATE_WITH_ROUTER,
                router: {
                  currentView: EntityType.SportView,
                },
                entities: {
                  ...STATE_WITH_ROUTER.entities,
                  brandSettings: {
                    HORIZONTAL_COUPON: true,
                  },
                },
              },
              CONTAINER_PROPS,
            );
            expect(component.showHorizontalDuration).toBe(true);
          });
        });

        it("should return the viewMode as SMALL if it is a statistics view", () => {
          const component = mapStateToProps(STATE_WITH_STATISTICS_VIEW, CONTAINER_PROPS);
          expect(component.viewMode).toBe(ScoreboardViewMode.SMALL);
        });

        it("should return the viewMode as DEFAULT if current route isn't the market-view nor my-bets-view", () => {
          const component = mapStateToProps(
            {
              ...STATE_WITH_ROUTER,
              router: {
                currentView: "other view",
              },
            },
            CONTAINER_PROPS,
          );
          expect(component.viewMode).toBe(ScoreboardViewMode.DEFAULT);
        });

        it("should return the sportevent urn as sporteventURN", () => {
          expect(mapStateToProps(STATE, CONTAINER_PROPS).sporteventURN).toBe(FIXTURE_CARD.sportevent);
        });

        describe("where there is no rich content (SCA) for the given fixtureCard", () => {
          const baseFixtureFallbackMock = {
            typename: "BaseFixture",
            sportevent: "fakeSportEvent",
            mainMarket: {
              exchange: {},
              sportsbook: {},
            },
          };

          beforeEach(() => {
            createCardByURNSelector.mockReturnValue(
              jest.fn(() => ({
                typename: "FixtureCard",
                fixture: baseFixtureFallbackMock,
                sportevent: "fakeSportEvent",
              })),
            );

            mapStateToProps = makeMapStateToProps();
          });

          it("should return the fixture fallback information (sportevent and its corresponding main market)", () => {
            expect(mapStateToProps(STATE, CONTAINER_PROPS).fixture).toEqual(baseFixtureFallbackMock);
          });
        });

        it("should return the fixture card urn as cardURN", () => {
          expect(mapStateToProps(STATE, CONTAINER_PROPS).cardURN).toBe(FIXTURE_CARD.urn);
        });

        describe("when fixture is a baseFixture", () => {
          it("should return fixture object, excMainMarketId and sbkMainMarketId", () => {
            getExchangeMarketByURN.mockReturnValue({ marketId: "1.11111" });
            getFixtureCardbyURN.mockReturnValue({
              ...FIXTURE_CARD,
              fixture: {
                urn: "ppb:fixture:29444319##MATCH_ODDS",
                typename: "BaseFixture",
                sportevent: "ppb:event:29444319",
                mainMarket: { exchange: "ppb:excMarket:1.11111", sportsbook: "ppb:sbkMarket:924.111111" },
              },
            });

            expect(mapStateToProps(STATE, CONTAINER_PROPS)).toEqual(
              expect.objectContaining({
                fixture: {
                  mainMarket: {
                    exchange: "ppb:excMarket:1.11111",
                    sportsbook: "ppb:sbkMarket:924.111111",
                  },
                  sportevent: "ppb:event:29444319",
                  typename: "BaseFixture",
                  urn: "ppb:fixture:29444319##MATCH_ODDS",
                },
                excMainMarketId: "1.11111",
                sbkMainMarketId: "924.111111",
              }),
            );
          });
        });

        describe("stickyOnScroll", () => {
          describe("if view isn't my-bets-view", () => {
            it("should return the stickyOnScroll as false if is runner view", () => {
              expect(mapStateToProps(STATE_WITH_RUNNER_VIEW, CONTAINER_PROPS).stickyOnScroll).toBe(false);
            });

            it("should return the stickyOnScroll as false if is statistics view", () => {
              expect(mapStateToProps(STATE_WITH_STATISTICS_VIEW, CONTAINER_PROPS).stickyOnScroll).toBe(false);
            });

            it("should return the stickyOnScroll as true if it's not runner view", () => {
              expect(mapStateToProps(STATE, CONTAINER_PROPS).stickyOnScroll).toBe(true);
            });

            describe("when isRunnerView is already defined", () => {
              it("should not change stickyOnScroll value if state changes", () => {
                expect(mapStateToProps(STATE_WITH_RUNNER_VIEW, CONTAINER_PROPS).stickyOnScroll).toBe(false);
                expect(mapStateToProps(STATE, CONTAINER_PROPS).stickyOnScroll).toBe(false);
              });
            });
          });
        });

        describe("eventViewLink", () => {
          it("should return the eventViewLink as undefined when null", () => {
            getFixtureCardbyURN.mockReturnValue({ ...FIXTURE_CARD, eventViewLink: null });

            expect(mapStateToProps(STATE, CONTAINER_PROPS).eventViewLink).toBe(undefined);
          });

          it("should return the eventViewLink when provided", () => {
            getFixtureCardbyURN.mockReturnValue(FIXTURE_CARD);
            expect(mapStateToProps(STATE, CONTAINER_PROPS).eventViewLink).toEqual({
              viewUrl: "viewUrl",
              viewUrn: "viewUrn",
            });
          });
        });

        describe("eventName", () => {
          it("should return the event name as empty string when sportevent is undefined", () => {
            getSportEventByURN.mockReturnValue(undefined);
            expect(mapStateToProps(STATE, CONTAINER_PROPS).eventName).toBe("");
          });

          it("should return the event name when provided", () => {
            getSportEventByURN.mockReturnValue({ name: "chelsea v burnley" });
            expect(mapStateToProps(STATE, CONTAINER_PROPS).eventName).toBe("chelsea v burnley");
          });
        });

        describe("showEventDateBelow", () => {
          it("should return as true when jurisdiction is BRAZIL", () => {
            getUserDetails.mockReturnValueOnce({
              jurisdiction: {
                jurisdiction: Jurisdiction.BRAZIL,
              },
            });

            expect(mapStateToProps(STATE, CONTAINER_PROPS).showEventDateBelow).toBe(true);
          });
        });
      });
    });
  });

  describe("mapDispatchToProps", () => {
    describe("dispatchPushAction", () => {
      it("should dispatch click card action", () => {
        const { dispatchPushAction } = mapDispatchToProps;
        const viewUrn = "ppb:tbd:view:event:1";
        const viewUrl = "soccer/fake-league/team-a-v-team-b/e-1";

        expect(dispatchPushAction({ viewUrn, viewUrl })).toEqual({
          payload: {
            viewUrl,
            viewUrn,
          },
          type: PUSH,
        });
      });
    });

    describe("dispatchNavigateToEventFromMarketScoreboard", () => {
      it("should dispatch GTM navigation", () => {
        const { dispatchNavigateToEventFromMarketScoreboard } = mapDispatchToProps;
        const viewLink = {
          viewUrn: "ppb:tbd:view:event:1",
          viewUrl: "soccer/fake-league/team-a-v-team-b/e-1",
        };
        const text = "chelsea v burnley";

        expect(dispatchNavigateToEventFromMarketScoreboard(viewLink, text)).toEqual({
          payload: {
            url: viewLink.viewUrl,
            text,
          },
          type: UI__NAVIGATE_TO_EVENT_FROM_MARKET_SCOREBOARD,
        });
      });
    });

    describe("dispatchMainMarketsTransitionsSubscription", () => {
      it("should dispatch SUBSCRIBE_MAIN_MARKET_TRANSITIONS action", () => {
        const { dispatchMainMarketsTransitionsSubscription } = mapDispatchToProps;
        const cardURN = "urn:ppb:eventmarketcard:1";
        const marketURNs = ["urn:ppb:excMarket:1", "urn:ppb:sbkMarket:1"];

        expect(dispatchMainMarketsTransitionsSubscription(cardURN, marketURNs, true)).toEqual({
          type: SUBSCRIBE_MAIN_MARKET_TRANSITIONS,
          payload: {
            cardURN,
            marketURNs,
            withFixtureUpdates: true,
          },
        });
      });
    });

    describe("dispatchSportsbookMarketUpdatesSubscribe", () => {
      it("should dispatch SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES action", () => {
        const { dispatchSportsbookMarketUpdatesSubscribe } = mapDispatchToProps;
        const marketId = "924.111111";

        expect(dispatchSportsbookMarketUpdatesSubscribe(marketId)).toEqual({
          type: SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
          payload: {
            marketId,
          },
        });
      });
    });

    describe("dispatchSportsbookMarketUpdatesUnsubscribe", () => {
      it("should dispatch UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES action", () => {
        const { dispatchSportsbookMarketUpdatesUnsubscribe } = mapDispatchToProps;
        const marketId = "924.111111";

        expect(dispatchSportsbookMarketUpdatesUnsubscribe(marketId)).toEqual({
          type: UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
          payload: {
            marketId,
          },
        });
      });
    });

    describe("dispatchExchangeMarketUpdatesSubscribe", () => {
      it("should dispatch SUBSCRIBE_EXCHANGE_MARKET_UPDATES action", () => {
        const { dispatchExchangeMarketUpdatesSubscribe } = mapDispatchToProps;
        const marketId = "1.11111";

        expect(dispatchExchangeMarketUpdatesSubscribe(marketId)).toEqual({
          type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
          payload: {
            marketId,
          },
        });
      });
    });

    describe("dispatchExchangeMarketUpdatesUnsubscribe", () => {
      it("should dispatch UNSUBSCRIBE_EXCHANGE_MARKET_UPDATES action", () => {
        const { dispatchExchangeMarketUpdatesUnsubscribe } = mapDispatchToProps;
        const marketId = "1.11111";

        expect(dispatchExchangeMarketUpdatesUnsubscribe(marketId)).toEqual({
          type: UNSUBSCRIBE_EXCHANGE_MARKET_UPDATES,
          payload: {
            marketId,
          },
        });
      });
    });
  });
});
