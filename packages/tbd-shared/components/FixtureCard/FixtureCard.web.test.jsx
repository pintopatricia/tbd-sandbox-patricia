import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import FixtureCard from "./FixtureCard.web";
import ConnectedFixtureHeader from "../FixtureHeader";
import FixtureHeader from "../FixtureHeader/FixtureHeader.web";
import Red7Scoreboard from "../Red7Scoreboard/Red7Scoreboard.web";
import { TEST_ID } from "./FixtureCard.web.selectors";

jest.mock("../FixtureHeader", () => jest.fn(() => <connected-fixture-header />));
jest.mock("../FixtureHeader/FixtureHeader.web", () => jest.fn(() => <fixture-header />));
jest.mock("../Red7Scoreboard/Red7Scoreboard.web", () => jest.fn(() => <fixture-red7-scoreboard />));
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useId: () => "r:id",
}));

function renderFixtureCard(props) {
  return render(<FixtureCard {...props} />);
}

describe("FixtureCard - Web", () => {
  afterEach(jest.clearAllMocks);
  const dispatchPushMock = jest.fn();
  const dispatchNavigateToEventFromMarketScoreboardMock = jest.fn();
  const dispatchMainMarketsTransitionsSubscriptionMock = jest.fn();

  const PROPS = {
    eventViewLink: { viewUrn: "viewUrn", viewUrl: "viewUrl" },
    dispatchPushAction: dispatchPushMock,
    dispatchNavigateToEventFromMarketScoreboard: dispatchNavigateToEventFromMarketScoreboardMock,
    dispatchMainMarketsTransitionsSubscription: dispatchMainMarketsTransitionsSubscriptionMock,
    eventName: "chelsea v burnley",
    sporteventURN: "ppb:sportevent:1",
    fixture: "ppb:fixture:1",
    viewMode: ScoreboardViewMode.NORMAL,
    stickyOnScroll: true,
    cardURN: "ppb:card:fixture:1",
    showEventDateBelow: true,
    showHorizontalDuration: false,
  };

  describe("when initializing the component", () => {
    it("should render the fixture", () => {
      render(<FixtureCard {...PROPS} />);

      expect(ConnectedFixtureHeader).toHaveBeenCalledWith(
        {
          component: FixtureHeader,
          fixture: "ppb:fixture:1",
          stickyOnScroll: true,
          viewMode: ScoreboardViewMode.NORMAL,
          sporteventURN: "ppb:sportevent:1",
          showEventDateBelow: true,
          showHorizontalDuration: false,
        },
        undefined,
      );
    });
  });

  describe("when clicked in the fixture card", () => {
    describe("when there is a eventViewLink and is not BetSharingView", () => {
      it("must dispatch the click action", () => {
        const component = render(<FixtureCard {...PROPS} />).container;
        component.querySelector(TEST_ID).click();

        expect(dispatchPushMock).toHaveBeenCalledWith({ viewUrl: "viewUrl", viewUrn: "viewUrn" });
      });

      it("must dispatch GTM navigation", () => {
        const component = render(<FixtureCard {...PROPS} />).container;
        component.querySelector(TEST_ID).click();

        expect(dispatchNavigateToEventFromMarketScoreboardMock).toHaveBeenCalledWith(
          { viewUrl: "viewUrl", viewUrn: "viewUrn" },
          "chelsea v burnley",
        );
      });
    });

    describe("when there is not a eventViewLink", () => {
      it("must not dispatch the click action or GTM navigation", () => {
        const NEW_PROPS = {
          ...PROPS,
          eventViewLink: undefined,
        };
        const component = render(<FixtureCard {...NEW_PROPS} />).container;
        component.querySelector(TEST_ID).click();

        expect(dispatchPushMock).not.toHaveBeenCalled();
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
