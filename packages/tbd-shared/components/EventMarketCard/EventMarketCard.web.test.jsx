import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import useOnIntersect from "@ppb/the-wall-web/hooks/useOnIntersect";
import { Product } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { ExchangeMarketStatus } from "@ppb/tbd-store/state/entities/exchange-markets/ExchangeMarket.types";
import { EventMarketCard } from "./EventMarketCard.web";
import FixtureHeader from "../FixtureHeader/FixtureHeader.web";
import ConnectedFixtureHeader from "../FixtureHeader";
import ConnectedMarket from "../Market";
import { Market } from "../Market/Market.web";

import { ROUTER_LINK, TEST_ID as EVENT_CARD } from "./EventMarketCard.web.selectors";

jest.mock("../FixtureHeader", () => jest.fn(() => <connected-fixture-header-mock />));
jest.mock("../FixtureHeader/FixtureHeader.web", () => jest.fn(() => <fixture-header-mock />));
jest.mock("../Market", () => jest.fn(() => <connected-market-card-mock />));
jest.mock("../Market/Market.web", () => ({ Market: jest.fn(() => <market-card-mock />) }));
jest.mock("@ppb/the-wall-web/hooks/useOnIntersect");
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useId: () => "r:id",
}));

function renderEventCard(eventCardProps) {
  return render(<EventMarketCard {...eventCardProps} />);
}

describe("Event card component", () => {
  let component;
  const dispatchClickMock = jest.fn();
  const dispatchPushMock = jest.fn();
  const dispatchMainMarketsTransitionsSubscriptionMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useOnIntersect.mockReturnValue({ isIntersecting: false, ref: null });
  });

  const eventCardProps = {
    typename: "EventMarketCard",
    fixture: "fixtureURN",
    fixtureURN: "fixtureURN",
    sporteventURN: "sportEventURN",
    awayCrestUrl: "testAwayCrestUrl",
    competition: "testCompetition",
    homeCrestUrl: "testHomeCrestUrl",
    scoreboardProps: "testScoreboardProps",
    cardUrn: "testCardUrn",
    title: "testTitle",
    eventViewLink: {
      viewUrl: "eventUrl",
      viewUrn: "eventUrn",
    },
    stickyOnScroll: true,
    dispatchClickCardAction: dispatchClickMock,
    dispatchPushAction: dispatchPushMock,
    displayRunners: {
      exchange: {
        market: "ppb:excMarket:1",
        runners: [{ urn: "runner1Urn" }, { urn: "runner2Urn" }],
      },
      sportsbook: {
        market: "ppb:sbkMarket:1",
        runners: [{ urn: "runner1Urn" }, { urn: "runner2Urn" }],
      },
    },
    sportsbookMarketURN: "ppb:sbkMarket:1",
    exchangeMarketURN: "ppb:excMarket:1",
    dispatchMainMarketsTransitionsSubscription: dispatchMainMarketsTransitionsSubscriptionMock,
    marketPromo: {
      title: "market title",
      description: "market description",
      signposting: "EXTRA_PLACES",
    },
    videoAvailable: true,
  };

  describe("when videoAvailable is false", () => {
    it("must render with a dual usage market and fixture card", () => {
      component = renderEventCard({ ...eventCardProps, videoAvailable: false }).container;
      expect(ConnectedFixtureHeader).toHaveBeenCalledWith(
        {
          fixture: "fixtureURN",
          sporteventURN: "sportEventURN",
          displayRunners: [{ urn: "runner1Urn" }, { urn: "runner2Urn" }],
          stickyOnScroll: true,
          viewMode: "DEFAULT",
          component: FixtureHeader,
          showBottomSeparator: false,
          videoAvailable: false,
        },
        undefined,
      );
    });
  });

  it("must render with a dual usage market and fixture card", () => {
    component = renderEventCard(eventCardProps).container;
    expect(component.querySelector(EVENT_CARD)).toBeVisible();
    expect(component.querySelector(ROUTER_LINK)).toBeVisible();
    expect(ConnectedFixtureHeader).toHaveBeenCalledWith(
      {
        fixture: "fixtureURN",
        sporteventURN: "sportEventURN",
        displayRunners: [{ urn: "runner1Urn" }, { urn: "runner2Urn" }],
        stickyOnScroll: true,
        viewMode: "DEFAULT",
        component: FixtureHeader,
        showBottomSeparator: false,
        videoAvailable: true,
      },
      undefined,
    );
    expect(ConnectedMarket).toHaveBeenCalledWith(
      {
        cardUrn: "testCardUrn",
        component: Market,
        eventViewLink: {
          viewUrl: "eventUrl",
          viewUrn: "eventUrn",
        },
        displayRunners: {
          exchange: {
            market: "ppb:excMarket:1",
            runners: [{ urn: "runner1Urn" }, { urn: "runner2Urn" }],
          },
          sportsbook: {
            market: "ppb:sbkMarket:1",
            runners: [{ urn: "runner1Urn" }, { urn: "runner2Urn" }],
          },
        },
        template: "INLINE",
        show90MinBlurb: false,
        tabLink: undefined,
        sporteventURN: "sportEventURN",
        marketPromo: {
          title: "market title",
          description: "market description",
          signposting: "EXTRA_PLACES",
        },
      },
      undefined,
    );
  });

  it("should dispatch dispatchMainMarketsTransitionsSubscription with cardUrn and marketURNs", () => {
    renderEventCard(eventCardProps);

    expect(dispatchMainMarketsTransitionsSubscriptionMock).toHaveBeenCalledWith("testCardUrn", [
      "ppb:excMarket:1",
      "ppb:sbkMarket:1",
    ]);
  });

  describe("when clicked in scoreboard", () => {
    it("must dispatch the click action", () => {
      component = renderEventCard(eventCardProps).container;
      component.querySelector(ROUTER_LINK).click();
      expect(dispatchClickMock).toHaveBeenCalledWith("testCardUrn", "fixtureURN", "sportEventURN", "eventUrl");
    });

    it("must dispatch the push action", () => {
      component = renderEventCard(eventCardProps).container;
      component.querySelector(ROUTER_LINK).click();
      expect(dispatchPushMock).toHaveBeenCalledWith({ viewUrl: "eventUrl", viewUrn: "eventUrn" });
    });
  });

  describe("Base Fixture", () => {
    describe("when mainMarketUrns is not empty", () => {
      it("should call dispatchMainMarketsTransitionsSubscription with correct params", async () => {
        const dispatchMainMarketsTransitionsSubscription = jest.fn();

        renderEventCard({
          ...eventCardProps,
          excMainMarketId: null,
          cardUrn: "cardUrn",
          dispatchMainMarketsTransitionsSubscription,
          product: Product.Exchange,
          fixture: {
            typename: "BaseFixture",
            sportevent: "ppb:event:1234",
            mainMarket: {
              exchange: "ppb:excMarket:1.178522912",
              sportsbook: "ppb:sbkMarket:1234",
            },
          },
          sbkMainMarketId: null,
          marketStatus: ExchangeMarketStatus.Open,
          displayRunners: {
            exchange: {
              market: "ppb:fake:excmarket:urn",
              runners: [],
            },
            sportsbook: {
              market: "ppb:fake:sbkmarket:urn",
              runners: [],
            },
          },
        });

        expect(dispatchMainMarketsTransitionsSubscription).toHaveBeenCalledWith("cardUrn", [
          "ppb:fake:excmarket:urn",
          "ppb:fake:sbkmarket:urn",
        ]);
        expect(dispatchMainMarketsTransitionsSubscription).toHaveBeenCalledWith(
          "cardUrn",
          ["ppb:excMarket:1.178522912", "ppb:sbkMarket:1234"],
          true,
        );
      });
    });

    describe("when is intersecting", () => {
      beforeEach(() => {
        useOnIntersect.mockReturnValue({ isIntersecting: true, ref: null });
      });

      describe("when excMainMarketId exists", () => {
        it("should call dispatchExchangeMarketUpdatesSubscribe with correct params", async () => {
          const dispatchExchangeMarketUpdatesSubscribe = jest.fn();

          renderEventCard({
            ...eventCardProps,
            excMainMarketId: 1,
            cardUrn: "cardUrn",
            dispatchExchangeMarketUpdatesSubscribe,
            product: Product.Exchange,
            fixture: {
              typename: "BaseFixture",
              sportevent: "ppb:event:1234",
              mainMarket: {
                exchange: "ppb:excMarket:1.178522912",
                sportsbook: "ppb:sbkMarket:1234",
              },
            },
            sbkMainMarketId: null,
            marketStatus: ExchangeMarketStatus.Open,
            displayRunners: {
              exchange: {
                market: "ppb:fake:excmarket:urn",
                runners: [],
              },
              sportsbook: {
                market: "ppb:fake:sbkmarket:urn",
                runners: [],
              },
            },
          });

          expect(dispatchExchangeMarketUpdatesSubscribe).toHaveBeenCalledWith(1);
        });
      });

      describe("when sbkMainMarketId exists", () => {
        it("should call dispatchSportsbookMarketUpdatesSubscribe with correct params", async () => {
          const dispatchSportsbookMarketUpdatesSubscribe = jest.fn();

          renderEventCard({
            ...eventCardProps,
            excMainMarketId: null,
            cardUrn: "cardUrn",
            dispatchSportsbookMarketUpdatesSubscribe,
            product: Product.Exchange,
            fixture: {
              typename: "BaseFixture",
              sportevent: "ppb:event:1234",
              mainMarket: {
                exchange: "ppb:excMarket:1.178522912",
                sportsbook: "ppb:sbkMarket:1234",
              },
            },
            sbkMainMarketId: 1,
            marketStatus: ExchangeMarketStatus.Open,
            displayRunners: {
              exchange: {
                market: "ppb:fake:excmarket:urn",
                runners: [],
              },
              sportsbook: {
                market: "ppb:fake:sbkmarket:urn",
                runners: [],
              },
            },
          });

          expect(dispatchSportsbookMarketUpdatesSubscribe).toHaveBeenCalledWith(1, "r:id");
        });
      });
    });

    describe("when is not intersecting", () => {
      beforeEach(() => {
        useOnIntersect.mockReturnValue({ isIntersecting: false, ref: null });
      });

      describe("when excMainMarketId exists", () => {
        it("should call dispatchExchangeMarketUpdatesUnsubscribe with correct params", async () => {
          const dispatchExchangeMarketUpdatesUnsubscribe = jest.fn();

          renderEventCard({
            ...eventCardProps,
            excMainMarketId: 1,
            cardUrn: "cardUrn",
            dispatchExchangeMarketUpdatesUnsubscribe,
            product: Product.Exchange,
            fixture: {
              typename: "BaseFixture",
              sportevent: "ppb:event:1234",
              mainMarket: {
                exchange: "ppb:excMarket:1.178522912",
                sportsbook: "ppb:sbkMarket:1234",
              },
            },
            sbkMainMarketId: null,
            marketStatus: ExchangeMarketStatus.Open,
            displayRunners: {
              exchange: {
                market: "ppb:fake:excmarket:urn",
                runners: [],
              },
              sportsbook: {
                market: "ppb:fake:sbkmarket:urn",
                runners: [],
              },
            },
          });

          expect(dispatchExchangeMarketUpdatesUnsubscribe).toHaveBeenCalledWith(1);
        });
      });

      describe("when sbkMainMarketId exists", () => {
        it("should call dispatchSportsbookMarketUpdatesUnsubscribe with correct params", async () => {
          const dispatchSportsbookMarketUpdatesUnsubscribe = jest.fn();

          renderEventCard({
            ...eventCardProps,
            excMainMarketId: null,
            cardUrn: "cardUrn",
            dispatchSportsbookMarketUpdatesUnsubscribe,
            product: Product.Exchange,
            fixture: {
              typename: "BaseFixture",
              sportevent: "ppb:event:1234",
              mainMarket: {
                exchange: "ppb:excMarket:1.178522912",
                sportsbook: "ppb:sbkMarket:1234",
              },
            },
            sbkMainMarketId: 1,
            marketStatus: ExchangeMarketStatus.Open,
            displayRunners: {
              exchange: {
                market: "ppb:fake:excmarket:urn",
                runners: [],
              },
              sportsbook: {
                market: "ppb:fake:sbkmarket:urn",
                runners: [],
              },
            },
          });

          expect(dispatchSportsbookMarketUpdatesUnsubscribe).toHaveBeenCalledWith(1, "r:id");
        });
      });
    });
  });
});
