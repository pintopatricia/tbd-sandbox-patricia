import "jest-dom/extend-expect";
import { MatchStats } from "@ppb/the-wall-web";

import { render } from "@testing-library/react";
import { TEST_ID } from "./MatchStatsCard.web.selectors";
import MatchStatsCard from "./MatchStatsCard.web";

const subscribe = jest.fn();
const unsubscribe = jest.fn();

jest.mock("@ppb/the-wall-web", () => ({
  MatchStats: jest.fn(() => <match-stats-mock />),
}));

const renderMatchStatsCard = (props) => render(<MatchStatsCard {...props} />);

describe("MatchStatsCard - WEB", () => {
  afterEach(jest.clearAllMocks);

  describe("when there are no matchStats", () => {
    it("should not render anything if there are no matchStats", () => {
      const component = renderMatchStatsCard({
        fixtureURN: "fixtureURN",
        typename: "typename",
        dispatchSubscribeFixtureUpdates: subscribe,
        dispatchUnsubscribeFixtureUpdates: unsubscribe,
      });

      expect(component.container.querySelector(TEST_ID)).toBeNull();
      expect(MatchStats).not.toHaveBeenCalled();
    });
  });

  describe("when there are matchStatsProps", () => {
    let unmountFn;
    const BAR_STATS = ["BAR_STATS_1", "BAR_STATS_2", "BAR_STATS_3"];
    const CARD_STATS = "CARD_STATS";
    const STATS = "STATS";

    beforeEach(() => {
      const MATCH_STATS = {
        barStats: BAR_STATS,
        cardStats: CARD_STATS,
        stats: STATS,
      };
      const COMPONENT_PROPS = {
        matchStats: MATCH_STATS,
        typename: "FootballFixture",
        fixtureURN: "fixtureURN",
        dispatchSubscribeFixtureUpdates: subscribe,
        dispatchUnsubscribeFixtureUpdates: unsubscribe,
      };

      const { unmount } = renderMatchStatsCard(COMPONENT_PROPS);
      unmountFn = unmount;
    });

    it("should render MatchStats with the correct props", () => {
      expect(MatchStats).toHaveBeenCalledWith(
        {
          barStats: BAR_STATS,
          cardStats: CARD_STATS,
          stats: STATS,
        },
        undefined,
      );
    });

    it("should call subscribe once with correct parameters", () => {
      expect(subscribe).toHaveBeenCalledTimes(1);
      expect(subscribe).toHaveBeenCalledWith("fixtureURN", "FootballFixture");
    });

    describe("when the component unmounts", () => {
      beforeAll(() => {
        unmountFn();
      });

      it("should call unsubscribe", () => {
        expect(unsubscribe).toHaveBeenCalledTimes(1);
        expect(unsubscribe).toHaveBeenCalledWith("fixtureURN", "FootballFixture");
      });
    });
  });
});
