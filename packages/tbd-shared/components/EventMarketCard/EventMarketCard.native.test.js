import { fireEvent, render } from "@testing-library/react-native";
import { ShadowedView } from "react-native-fast-shadow";
import { navigate } from "@ppb/tbd-router/native";
import EventMarketCard from "./EventMarketCard.native";
import ConnectedMarket from "../Market";
import FixtureHeader from "../FixtureHeader/FixtureHeader.native";
import ConnectedFixtureHeader from "../FixtureHeader";

import { Market } from "../Market/Market.native";
import {
  EVENT_MARKET_CARD_HEADER,
  EVENT_MARKET_CARD,
  EVENT_MARKET_CARD_SHADOW,
  EVENT_MARKET_CARD_CONTAINER,
} from "./EventMarketCard.native.selectors";

jest.mock("react-native-fast-shadow", () => ({
  ShadowedView: jest.fn((props) => <react-native-fast-shadow-mock {...props} />),
}));
jest.mock("../../hooks/useNativeLazyLoading.native", () => ({
  useVisibilityStatus: jest.fn(() => true),
}));

jest.mock("../Market", () => jest.fn(() => <connected-market-card-mock />));
jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(),
}));
jest.mock("../Market/Market.native", () => ({ Market: jest.fn(() => <market-card-mock />) }));
jest.mock("../FixtureHeader/FixtureHeader.native", () => jest.fn(() => <fixture-header-mock />));
jest.mock("../FixtureHeader", () => jest.fn(() => <connected-fixture-header-mock />));
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useId: () => "r:id",
}));

const dispatchClickMock = jest.fn();
const dispatchPushMock = jest.fn();
const dispatchMainMarketsTransitionsSubscriptionMock = jest.fn();

const tabLinkMock = {
  label: "BuildABet",
  icon: {
    id: "Bet-Builder",
    category: "Value",
  },
  tabViewLink: {
    viewUrn: "ppb:tbd:view:event:36906754?=tabId=ZkXyWxEAAB8AOXvr",
    viewUrl: "football/german-bundesliga/hoffenheim-v-dortmund/e-36906754?tabId=ZkXyWxEAAB8AOXvr#bet-builder",
  },
};

const eventCardProps = {
  fixture: "fixtureURN",
  sporteventURN: "sporteventURN",
  fixtureURN: "fixtureURN",
  eventId: "testEventId",
  awayCrestUrl: "testAwayCrestUrl",
  competition: "testCompetition",
  homeCrestUrl: "testHomeCrestUrl",
  scoreboardProps: "testScoreboardProps",
  cardUrn: "testCardUrn",
  eventViewLink: {
    viewUrl: "eventUrl",
    viewUrn: "eventUrn",
  },
  stickyOnScroll: false,
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
  dispatchMainMarketsTransitionsSubscription: dispatchMainMarketsTransitionsSubscriptionMock,
  marketPromo: {
    title: "market title",
    description: "market description",
    signposting: "EXTRA_PLACES",
  },
  videoAvailable: true,
  tabLink: tabLinkMock,
};

function renderEventCard(props) {
  return render(<EventMarketCard {...props} />);
}

describe("EventMarketCard component", () => {
  let component;

  beforeEach(jest.clearAllMocks);

  describe("render EventMarketCard Component", () => {
    beforeEach(() => {
      component = renderEventCard(eventCardProps);
    });

    it("should render a drop shadow", () => {
      expect(component.queryByTestId(EVENT_MARKET_CARD_SHADOW)).toBeDefined();
      expect(ShadowedView).toHaveBeenCalledTimes(1);
    });

    it("should render a view", () => {
      expect(component.queryByTestId(EVENT_MARKET_CARD)).toBeDefined();
    });

    it("should render the container", () => {
      expect(component.queryByTestId(EVENT_MARKET_CARD_CONTAINER)).toBeDefined();
    });

    it("should render a market card", () => {
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
          sporteventURN: "sporteventURN",
          marketPromo: {
            title: "market title",
            description: "market description",
            signposting: "EXTRA_PLACES",
          },
          tabLink: tabLinkMock,

          show90MinBlurb: false,
        },
        undefined,
      );
    });

    it("should render the fixture header", () => {
      expect(ConnectedFixtureHeader).toHaveBeenCalledWith(
        {
          fixture: "fixtureURN",
          sporteventURN: "sporteventURN",
          component: FixtureHeader,
          displayRunners: [{ urn: "runner1Urn" }, { urn: "runner2Urn" }],
          viewMode: "DEFAULT",
          stickyOnScroll: false,
          videoAvailable: true,
          showBottomSeparator: false,
          cardURN: "testCardUrn",
        },
        undefined,
      );
    });

    it("should dispatch dispatchMainMarketsTransitionsSubscription with cardUrn and marketURNs", () => {
      expect(dispatchMainMarketsTransitionsSubscriptionMock).toHaveBeenCalledWith("testCardUrn", [
        "ppb:excMarket:1",
        "ppb:sbkMarket:1",
      ]);
    });
  });

  describe("when video available is false", () => {
    beforeEach(() => {
      component = renderEventCard({ ...eventCardProps, videoAvailable: false });
    });
    it("should render the fixture header", () => {
      expect(ConnectedFixtureHeader).toHaveBeenCalledWith(
        {
          fixture: "fixtureURN",
          sporteventURN: "sporteventURN",
          component: FixtureHeader,
          displayRunners: [{ urn: "runner1Urn" }, { urn: "runner2Urn" }],
          viewMode: "DEFAULT",
          stickyOnScroll: false,
          videoAvailable: false,
          showBottomSeparator: false,
          cardURN: "testCardUrn",
        },
        undefined,
      );
    });
  });

  describe("perform actions when clicked", () => {
    beforeEach(() => {
      component = renderEventCard(eventCardProps);
      fireEvent.press(component.queryByTestId(EVENT_MARKET_CARD_HEADER));
    });

    it("must dispatch the click action", () => {
      expect(dispatchClickMock).toHaveBeenCalledWith("testCardUrn", "fixtureURN", "sporteventURN", "eventUrl");
    });

    it("must call the navigate function", () => {
      expect(navigate).toHaveBeenCalledWith({ viewUrl: "eventUrl", viewUrn: "eventUrn" });
    });
  });

  describe("Fixture", () => {
    describe("when rendering with sbk and exc market id", () => {
      it("should call dispatchSportsbookMarketUpdatesUnsubscribe with sbk market id on clean up", async () => {
        const dispatchSportsbookMarketUpdatesUnsubscribe = jest.fn();

        const { rerender } = renderEventCard({
          ...eventCardProps,
          dispatchSportsbookMarketUpdatesUnsubscribe,
          dispatchExchangeMarketUpdatesUnsubscribe: jest.fn(),
          excMainMarketId: 1,
          sbkMainMarketId: 2,
          displayRunners: {
            exchange: {
              market: "ppb:fake:market:urn",
              runners: [],
            },
          },
        });

        rerender(
          <EventMarketCard
            {...eventCardProps}
            displayRunners={{
              exchange: {
                market: "ppb:fake:market:urn",
                runners: [],
              },
            }}
            dispatchMainMarketsTransitionsSubscription={jest.fn}
            dispatchSportsbookMarketUpdatesUnsubscribe={dispatchSportsbookMarketUpdatesUnsubscribe}
            dispatchExchangeMarketUpdatesUnsubscribe={jest.fn}
          />,
        );

        expect(dispatchSportsbookMarketUpdatesUnsubscribe).toHaveBeenCalledWith(2, "r:id");
      });

      it("should call dispatchExchangeMarketUpdatesUnsubscribe with exc market id on clean up", async () => {
        const dispatchExchangeMarketUpdatesUnsubscribe = jest.fn();

        const { rerender } = renderEventCard({
          ...eventCardProps,
          dispatchSportsbookMarketUpdatesUnsubscribe: jest.fn(),
          excMainMarketId: 1,
          sbkMainMarketId: 2,
          displayRunners: {
            exchange: {
              market: "ppb:fake:market:urn",
              runners: [],
            },
          },
          dispatchExchangeMarketUpdatesUnsubscribe,
        });

        rerender(
          <EventMarketCard
            {...eventCardProps}
            displayRunners={{
              exchange: {
                market: "ppb:fake:market:urn",
                runners: [],
              },
            }}
            dispatchMainMarketsTransitionsSubscription={jest.fn}
            dispatchExchangeMarketUpdatesUnsubscribe={dispatchExchangeMarketUpdatesUnsubscribe}
            dispatchSportsbookMarketUpdatesUnsubscribe={jest.fn}
          />,
        );

        expect(dispatchExchangeMarketUpdatesUnsubscribe).toHaveBeenCalledWith(1);
      });
    });

    describe("when rendering only with sbk market id", () => {
      it("should call dispatchSportsbookMarketUpdatesUnsubscribe with sbk market id on clean up", async () => {
        const dispatchSportsbookMarketUpdatesUnsubscribe = jest.fn();

        const { rerender } = renderEventCard({
          ...eventCardProps,
          dispatchSportsbookMarketUpdatesUnsubscribe,
          sbkMainMarketId: 2,
          displayRunners: {
            exchange: {
              market: "ppb:fake:market:urn",
              runners: [],
            },
          },
        });

        rerender(
          <EventMarketCard
            {...eventCardProps}
            displayRunners={{
              exchange: {
                market: "ppb:fake:market:urn",
                runners: [],
              },
            }}
            dispatchMainMarketsTransitionsSubscription={jest.fn}
            dispatchSportsbookMarketUpdatesUnsubscribe={dispatchSportsbookMarketUpdatesUnsubscribe}
          />,
        );

        expect(dispatchSportsbookMarketUpdatesUnsubscribe).toHaveBeenCalledWith(2, "r:id");
      });

      it("should not call dispatchExchangeMarketUpdatesUnsubscribe with exc market id on clean up", async () => {
        const dispatchExchangeMarketUpdatesUnsubscribe = jest.fn();

        const { rerender } = renderEventCard({
          ...eventCardProps,
          dispatchExchangeMarketUpdatesUnsubscribe,
          sbkMainMarketId: 2,
          dispatchSportsbookMarketUpdatesUnsubscribe: jest.fn(),
          displayRunners: {
            exchange: {
              market: "ppb:fake:market:urn",
              runners: [],
            },
          },
        });

        rerender(
          <EventMarketCard
            {...eventCardProps}
            displayRunners={{
              exchange: {
                market: "ppb:fake:market:urn",
                runners: [],
              },
            }}
            dispatchMainMarketsTransitionsSubscription={jest.fn}
            dispatchExchangeMarketUpdatesUnsubscribe={dispatchExchangeMarketUpdatesUnsubscribe}
            dispatchSportsbookMarketUpdatesUnsubscribe={jest.fn}
          />,
        );

        expect(dispatchExchangeMarketUpdatesUnsubscribe).not.toHaveBeenCalled();
      });
    });

    describe("when rendering only with exc market id", () => {
      it("should call dispatchExchangeMarketUpdatesUnsubscribe with exc market id on clean up", async () => {
        const dispatchExchangeMarketUpdatesUnsubscribe = jest.fn();

        const { rerender } = renderEventCard({
          ...eventCardProps,
          excMainMarketId: 1,
          dispatchExchangeMarketUpdatesUnsubscribe,
          displayRunners: {
            exchange: {
              market: "ppb:fake:market:urn",
              runners: [],
            },
          },
        });

        rerender(
          <EventMarketCard
            {...eventCardProps}
            displayRunners={{
              exchange: {
                market: "ppb:fake:market:urn",
                runners: [],
              },
            }}
            dispatchMainMarketsTransitionsSubscription={jest.fn}
            dispatchExchangeMarketUpdatesUnsubscribe={dispatchExchangeMarketUpdatesUnsubscribe}
          />,
        );

        expect(dispatchExchangeMarketUpdatesUnsubscribe).toHaveBeenCalledWith(1);
      });

      it("should not call dispatchSportsbookMarketUpdatesUnsubscribe with sbk market id on clean up", async () => {
        const dispatchSportsbookMarketUpdatesUnsubscribe = jest.fn();

        const { rerender } = renderEventCard({
          ...eventCardProps,
          excMainMarketId: 1,
          dispatchSportsbookMarketUpdatesUnsubscribe,
          dispatchExchangeMarketUpdatesUnsubscribe: jest.fn(),
          displayRunners: {
            exchange: {
              market: "ppb:fake:market:urn",
              runners: [],
            },
          },
        });

        rerender(
          <EventMarketCard
            {...eventCardProps}
            displayRunners={{
              exchange: {
                market: "ppb:fake:market:urn",
                runners: [],
              },
            }}
            dispatchMainMarketsTransitionsSubscription={jest.fn}
            dispatchSportsbookMarketUpdatesUnsubscribe={dispatchSportsbookMarketUpdatesUnsubscribe}
          />,
        );

        expect(dispatchSportsbookMarketUpdatesUnsubscribe).not.toHaveBeenCalled();
      });
    });
  });
});
