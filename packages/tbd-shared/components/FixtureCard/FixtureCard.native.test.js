import { render, fireEvent } from "@testing-library/react-native";

import { navigate } from "@ppb/tbd-router/native";
import FixtureCard from "./FixtureCard.native";
import FixtureHeader from "../FixtureHeader/FixtureHeader.native";
import ConnectedFixtureHeader from "../FixtureHeader";
import { FIXTURE_CARD } from "./FixtureCard.native.selectors";
import Red7Scoreboard from "../Red7Scoreboard/Red7Scoreboard.native";

let MOCK_VIEW_URN = [];

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => MOCK_VIEW_URN),
}));

jest.mock("../../hooks/useNativeLazyLoading.native", () => ({
  useVisibilityStatus: jest.fn(() => true),
}));

jest.mock("../FixtureHeader", () => jest.fn(() => <connected-fixture-header />));
jest.mock("../FixtureHeader/FixtureHeader.native", () => jest.fn(() => <fixture-header />));
jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
}));

jest.mock("react-native-webview", () => ({
  WebView: jest.fn(),
}));

jest.mock("../../helpers/webview-event.native", () => ({
  readMessagesInjetedJavascript: "readMessagesInjetedJavascript",
}));

jest.mock("../Red7Scoreboard/Red7Scoreboard.native", () => jest.fn(() => <fixture-red7-scoreboard />));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useId: () => "r:id",
}));

const dispatchNavigateToEventFromMarketScoreboardMock = jest.fn();
const dispatchMainMarketsTransitionsSubscriptionMock = jest.fn();

const PROPS = {
  eventViewLink: { viewUrn: "viewUrn", viewUrl: "viewUrl" },
  dispatchNavigateToEventFromMarketScoreboard: dispatchNavigateToEventFromMarketScoreboardMock,
  dispatchMainMarketsTransitionsSubscription: dispatchMainMarketsTransitionsSubscriptionMock,
  eventName: "chelsea v burnley",
  fixture: "fixtureURN",
  sporteventURN: "sporteventURN",
  viewMode: "NORMAL",
  stickyOnScroll: true,
  cardURN: "ppb:card:footballfixture:1",
  availableToSubscribe: true,
  showEventDateBelow: true,
  showHorizontalDuration: false,
};

function renderFixtureCard(props) {
  return render(<FixtureCard {...props} />);
}

describe("FixtureCard - Native", () => {
  afterEach(jest.clearAllMocks);

  describe("when initializing the component", () => {
    it("should render fixture header", () => {
      renderFixtureCard(PROPS);

      expect(ConnectedFixtureHeader).toHaveBeenCalledWith(
        {
          fixture: "fixtureURN",
          cardURN: "ppb:card:footballfixture:1",
          sporteventURN: "sporteventURN",
          viewMode: "NORMAL",
          stickyOnScroll: true,
          component: FixtureHeader,
          availableToSubscribe: true,
          showEventDateBelow: true,
          showHorizontalDuration: false,
        },
        undefined,
      );
    });
  });

  describe("when click is performed on fixture card", () => {
    describe("when there is a eventViewLink and is not BetSharingView", () => {
      it("must dispatch the click action and call the navigate function", () => {
        MOCK_VIEW_URN = ["123"];
        const component = renderFixtureCard(PROPS);
        const action = component.queryByTestId(FIXTURE_CARD);

        fireEvent(action, "onPress");

        expect(navigate).toHaveBeenCalledWith({ viewUrl: "viewUrl", viewUrn: "viewUrn" });
      });

      it("must dispatch the GTM navigation", () => {
        MOCK_VIEW_URN = ["123"];
        const component = renderFixtureCard(PROPS);
        const action = component.queryByTestId(FIXTURE_CARD);

        fireEvent(action, "onPress");

        expect(dispatchNavigateToEventFromMarketScoreboardMock).toHaveBeenCalledWith(
          { viewUrl: "viewUrl", viewUrn: "viewUrn" },
          "chelsea v burnley",
        );
      });
    });

    describe("when there is not a eventViewLink", () => {
      it("must not dispatch the click action or the GTM navigation", () => {
        const component = renderFixtureCard({ ...PROPS, eventViewLink: undefined });
        const action = component.queryByTestId(FIXTURE_CARD);

        fireEvent(action, "onPress");

        expect(dispatchNavigateToEventFromMarketScoreboardMock).not.toHaveBeenCalled();
      });
    });
  });

  describe("Fixture", () => {
    describe("when rendering with sbk and exc market id", () => {
      it("should call dispatchSportsbookMarketUpdatesUnsubscribe with sbk market id on clean up", async () => {
        const dispatchSportsbookMarketUpdatesUnsubscribe = jest.fn();

        const { rerender } = renderFixtureCard({
          ...PROPS,
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
          <FixtureCard
            {...PROPS}
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

        const { rerender } = renderFixtureCard({
          ...PROPS,
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
          <FixtureCard
            {...PROPS}
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

        const { rerender } = renderFixtureCard({
          ...PROPS,
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
          <FixtureCard
            {...PROPS}
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

        const { rerender } = renderFixtureCard({
          ...PROPS,
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
          <FixtureCard
            {...PROPS}
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

        const { rerender } = renderFixtureCard({
          ...PROPS,
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
          <FixtureCard
            {...PROPS}
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

        const { rerender } = renderFixtureCard({
          ...PROPS,
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
          <FixtureCard
            {...PROPS}
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

  describe("when rendering red 7 scoreboard instead of fixture header", () => {
    it("should only render Red7Scoreboard when red7Scoreboard.fullURL is populated", () => {
      const red7Scoreboard = {
        fullURL: "https://fullred7iframeURL.com",
        origin: "https://originURL.com",
      };

      renderFixtureCard({
        ...PROPS,
        red7Scoreboard,
      });

      expect(Red7Scoreboard).toHaveBeenCalled();
      expect(ConnectedFixtureHeader).not.toHaveBeenCalled();
    });

    it("should not render Red7Scoreboard when red7Scoreboard is null", () => {
      const red7Scoreboard = null;

      renderFixtureCard({
        ...PROPS,
        red7Scoreboard,
      });

      expect(Red7Scoreboard).not.toHaveBeenCalled();
      expect(ConnectedFixtureHeader).toHaveBeenCalled();
    });
  });
});
