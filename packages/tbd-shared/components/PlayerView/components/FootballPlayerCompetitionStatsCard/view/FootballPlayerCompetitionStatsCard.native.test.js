import "jest-dom/extend-expect";
import { render } from "@testing-library/react-native";
import FootballPlayerCompetitionStatsCard from "./FootballPlayerCompetitionStatsCard.native";
import useFootballPlayerCompetitionStatsCardVM from "../viewmodel/FootballPlayerCompetitionStatsCard.viewmodel";

import {
  FOOTBALL_PLAYER_COMPETITION_STATS_CARD_CONTAINER,
  FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STAT_ITEM,
  FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STAT_LABEL,
  FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STAT_VALUE,
  FOOTBALL_PLAYER_COMPETITION_STATS_CARD_NO_STATS_LABEL,
} from "./FootballPlayerCompetitionStatsCard.native.selectors";
import { Placeholder } from "@ppb/the-wall-native";

const useFootballPlayerCompetitionStatsCardVMMock = {
  request: {
    called: true,
    loading: false,
    call: () => {},
  },
  called: true,
  loading: false,
  vm: {
    data: {
      stats: {
        totalGoals: 10,
        totalAssists: 5,
        totalCards: 8,
      },
    },
  },
};

jest.mock("../viewmodel/FootballPlayerCompetitionStatsCard.viewmodel", () => ({
  __esModule: true,
  default: jest.fn(() => useFootballPlayerCompetitionStatsCardVMMock),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {},
  spacings: {},
}));

jest.mock("@ppb/the-wall-native", () => ({
  Collapse: jest.fn(({ children, props }) => <collapse-mock {...props}>{children}</collapse-mock>),
  Placeholder: jest.fn(({ props }) => <placeholder-mock {...props} />),

  Text: jest.requireActual("react-native").Text,
}));

const renderComponent = (props = { urn: "tbd:view:player:1234" }) =>
  render(<FootballPlayerCompetitionStatsCard {...props} />);

describe("FootballPlayerCompetitionStatsCard", () => {
  beforeEach(jest.clearAllMocks);

  describe("when rendering the FootballPlayerCompetitionStatsCard", () => {
    describe("and the request is called but still loading", () => {
      it("should show the loading state", () => {
        const NO_DATA_CALLED_LOADING = {
          vm: {
            data: null,
          },
          loading: true,
        };
        useFootballPlayerCompetitionStatsCardVM.mockReturnValue(NO_DATA_CALLED_LOADING);

        renderComponent();
        expect(Placeholder).toHaveBeenCalledTimes(1);
      });
    });

    describe("when it's not loading and there is no data", () => {
      it("should render nothing", () => {
        const VM_NO_DATA_NOT_LOADING = {
          vm: {
            data: null,
          },
          loading: false,
          called: false,
        };

        useFootballPlayerCompetitionStatsCardVM.mockReturnValue(VM_NO_DATA_NOT_LOADING);

        const { queryByTestId } = renderComponent();

        const container = queryByTestId(FOOTBALL_PLAYER_COMPETITION_STATS_CARD_CONTAINER);

        expect(container).toBeNull();
      });
    });

    describe("when it's not loading and there is data", () => {
      describe("and there are no stats", () => {
        it("should render no stats label", () => {
          const VM_NO_STATS_NOT_LOADING = {
            vm: {
              data: {
                test: undefined,
              },
            },
            loading: false,
            called: true,
          };

          useFootballPlayerCompetitionStatsCardVM.mockReturnValue(VM_NO_STATS_NOT_LOADING);

          const { queryByTestId } = renderComponent();

          const noStatsLabel = queryByTestId(FOOTBALL_PLAYER_COMPETITION_STATS_CARD_NO_STATS_LABEL);
          expect(noStatsLabel).toBeTruthy();
          expect(noStatsLabel.props.children).toBe("No season stats available.");

          const container = queryByTestId(FOOTBALL_PLAYER_COMPETITION_STATS_CARD_CONTAINER);
          expect(container).toBeNull();
        });
      });
      describe("and there are stats", () => {
        it("should render the FootballPlayerCompetitionStatsCard container", () => {
          useFootballPlayerCompetitionStatsCardVM.mockReturnValue(useFootballPlayerCompetitionStatsCardVMMock);

          const { queryByTestId } = renderComponent();

          const container = queryByTestId(FOOTBALL_PLAYER_COMPETITION_STATS_CARD_CONTAINER);

          expect(container).toBeDefined();
          expect(container).toBeTruthy();
        });

        it("should render the FootballPlayerCompetitionStatsCard stats", () => {
          useFootballPlayerCompetitionStatsCardVM.mockReturnValue(useFootballPlayerCompetitionStatsCardVMMock);

          const { queryAllByTestId } = renderComponent();

          const stats = queryAllByTestId(FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STAT_ITEM);

          expect(stats).toBeDefined();
          expect(stats.length).toBe(3);
          expect(
            stats[0].findByProps({ testID: FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STAT_LABEL }).props.children,
          ).toBe("Goals");
          expect(
            stats[0].findByProps({ testID: FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STAT_VALUE }).props.children,
          ).toBe(useFootballPlayerCompetitionStatsCardVMMock.vm.data.stats.totalGoals);

          expect(
            stats[1].findByProps({ testID: FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STAT_LABEL }).props.children,
          ).toBe("Assists");
          expect(
            stats[1].findByProps({ testID: FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STAT_VALUE }).props.children,
          ).toBe(useFootballPlayerCompetitionStatsCardVMMock.vm.data.stats.totalAssists);

          expect(
            stats[2].findByProps({ testID: FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STAT_LABEL }).props.children,
          ).toBe("Cards");
          expect(
            stats[2].findByProps({ testID: FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STAT_VALUE }).props.children,
          ).toBe(useFootballPlayerCompetitionStatsCardVMMock.vm.data.stats.totalCards);
        });
      });
    });
  });
});
