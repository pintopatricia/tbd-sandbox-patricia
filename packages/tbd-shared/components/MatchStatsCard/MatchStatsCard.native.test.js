import { render } from "@testing-library/react-native";

import { MatchStats } from "@ppb/the-wall-native";

import styles from "./MatchStatsCard.native.styles";
import { MATCH_STATS, MATCH_STATS_CONTAINER } from "./MatchStatsCard.native.selectors";
import MatchStatsCard from "./MatchStatsCard.native";

const subscribe = jest.fn();
const unsubscribe = jest.fn();

jest.mock("@ppb/the-wall-native", () => ({
  MatchStats: jest.fn(() => <match-stats-mock />),
}));

const renderMatchStatsCard = (props) => render(<MatchStatsCard {...props} />);

describe("Connected MatchStatsCard", () => {
  afterEach(jest.clearAllMocks);

  describe("when there are no matchStats", () => {
    it("should not render anything if there are no matchStats", () => {
      const component = renderMatchStatsCard({
        fixtureURN: "fixtureURN",
        typename: "typename",
        dispatchSubscribeFixtureUpdates: subscribe,
        dispatchUnsubscribeFixtureUpdates: unsubscribe,
      });

      expect(component.queryByTestId(MATCH_STATS)).toBeNull();
      expect(MatchStats).not.toHaveBeenCalled();
    });
  });

  describe("when there are matchStatsProps", () => {
    let queryByTestIdFn;
    let unmountFn;
    const BAR_STATS = ["BAR_STATS_1", "BAR_STATS_2", "BAR_STATS_3"];
    const CARD_STATS = "CARD_STATS";
    const STATS = "STATS";

    beforeEach(() => {
      const MATCH_STATS_MOCK = {
        barStats: BAR_STATS,
        cardStats: CARD_STATS,
        stats: STATS,
      };
      const COMPONENT_PROPS = {
        matchStats: MATCH_STATS_MOCK,
        typename: "FootballFixture",
        fixtureURN: "fixtureURN",
        dispatchSubscribeFixtureUpdates: subscribe,
        dispatchUnsubscribeFixtureUpdates: unsubscribe,
      };

      const { queryByTestId, unmount } = renderMatchStatsCard(COMPONENT_PROPS);
      unmountFn = unmount;
      queryByTestIdFn = queryByTestId;
    });

    it("should apply the correct styling to the MatchStats container", () => {
      expect(queryByTestIdFn(MATCH_STATS_CONTAINER)).toHaveStyle(styles.matchStatsContainer);
    });

    it("should render MatchStats with the correct parameters", () => {
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
