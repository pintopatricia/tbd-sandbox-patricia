import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import FootballPlayerCompetitionStatsCard from "./FootballPlayerCompetitionStatsCard.web";
import useFootballPlayerCompetitionStatsCardVM from "../viewmodel/FootballPlayerCompetitionStatsCard.viewmodel";

import {
  FOOTBALL_PLAYER_COMPETITION_STATS_CARD_CONTAINER,
  FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STAT_ITEM,
  FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STAT_LABEL,
  FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STAT_VALUE,
  FOOTBALL_PLAYER_COMPETITION_STATS_CARD_NO_STATS_LABEL,
} from "./FootballPlayerCompetitionStatsCard.web.selectors";
import { Placeholder } from "@ppb/the-wall-web";

const useFootballPlayerCompetitionStatsCardVMMock = {
  request: {
    called: true,
    loading: true,
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

jest.mock("@ppb/the-wall-web", () => ({
  Collapse: jest.fn(({ children, props }) => <collapse-mock {...props}>{children}</collapse-mock>),
  Placeholder: jest.fn(({ props }) => <placeholder-mock {...props} />),
}));

const renderComponent = (props = { urn: "tbd:view:player:1234" }) =>
  render(<FootballPlayerCompetitionStatsCard visible {...props} />);

describe("FootballPlayerCompetitionStatsCard", () => {
  beforeEach(jest.clearAllMocks);

  describe("when rendering the FootballPlayerCompetitionStatsCard", () => {
    describe("and the request is called but still loading", () => {
      it("should show the placeholder", () => {
        const NO_DATA_CALLED_LOADING = {
          vm: {
            data: null,
          },
          loading: true,
        };
        useFootballPlayerCompetitionStatsCardVM.mockReturnValueOnce(NO_DATA_CALLED_LOADING);
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
          called: false,
          loading: false,
        };

        useFootballPlayerCompetitionStatsCardVM.mockReturnValueOnce(VM_NO_DATA_NOT_LOADING);
        renderComponent();

        const container = document.querySelector(FOOTBALL_PLAYER_COMPETITION_STATS_CARD_CONTAINER);
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
            called: true,
            loading: false,
          };

          useFootballPlayerCompetitionStatsCardVM.mockReturnValueOnce(VM_NO_STATS_NOT_LOADING);

          renderComponent();

          const noStatsLabel = document.querySelector(FOOTBALL_PLAYER_COMPETITION_STATS_CARD_NO_STATS_LABEL);
          expect(noStatsLabel).toBeTruthy();
          expect(noStatsLabel).toHaveTextContent("No season stats available.");

          const container = document.querySelector(FOOTBALL_PLAYER_COMPETITION_STATS_CARD_CONTAINER);
          expect(container).toBeNull();
        });
      });
      describe("and there are  stats", () => {
        it("should render the FootballPlayerCompetitionStatsCard container", () => {
          useFootballPlayerCompetitionStatsCardVM.mockReturnValueOnce(useFootballPlayerCompetitionStatsCardVMMock);
          renderComponent();
          const container = document.querySelector(FOOTBALL_PLAYER_COMPETITION_STATS_CARD_CONTAINER);

          expect(container).toBeTruthy();
        });

        it("should render the FootballPlayerCompetitionStatsCard stats", () => {
          useFootballPlayerCompetitionStatsCardVM.mockReturnValueOnce(useFootballPlayerCompetitionStatsCardVMMock);
          renderComponent();
          const stats = document.querySelectorAll(FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STAT_ITEM);

          expect(stats).toBeTruthy();
          expect(stats.length).toBe(3);

          expect(stats[0].querySelector(FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STAT_LABEL)).toHaveTextContent("Goals");
          expect(stats[0].querySelector(FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STAT_VALUE)).toHaveTextContent(
            useFootballPlayerCompetitionStatsCardVMMock.vm.data.stats.totalGoals,
          );

          expect(stats[1].querySelector(FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STAT_LABEL)).toHaveTextContent("Assists");
          expect(stats[1].querySelector(FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STAT_VALUE)).toHaveTextContent(
            useFootballPlayerCompetitionStatsCardVMMock.vm.data.stats.totalAssists,
          );

          expect(stats[2].querySelector(FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STAT_LABEL)).toHaveTextContent("Cards");
          expect(stats[2].querySelector(FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STAT_VALUE)).toHaveTextContent(
            useFootballPlayerCompetitionStatsCardVMMock.vm.data.stats.totalCards,
          );
        });
      });
    });
  });
});
