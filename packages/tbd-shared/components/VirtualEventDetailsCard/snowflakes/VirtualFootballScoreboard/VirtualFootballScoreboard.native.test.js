import { render } from "@testing-library/react-native";
import {
  FOOTBALL_SCOREBOARD,
  RED_CARDS_DURATION_CONTAINER,
} from "@ppb/the-wall-native/components/Scoreboard/FootballScoreboard/FootballScoreboard.selectors";
import { VirtualTeam } from "../VirtualTeam/VirtualTeam.native";

import { VirtualFootballScoreboard } from "./VirtualFootballScoreboard.native";

jest.mock("../VirtualTeam/VirtualTeam.native", () => ({
  VirtualTeam: jest.fn(() => <team-mock testID="team" />),
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

const SCOREBOARD = {
  home: {
    name: "CFR Cluj",
  },
  away: {
    name: "Rennes",
  },
  firstLegScore: null,
  penaltyScore: null,
  penaltyShootout: null,
  translations: {
    i18n: {
      penalties: "",
      half: "",
      full: "",
      versus: "v",
      error: "",
      extraTime: "",
      inplay: "",
    },
  },
};

const renderFootballScoreboard = (props = SCOREBOARD) => render(<VirtualFootballScoreboard {...props} />);

describe("FootballScoreboard", () => {
  beforeEach(jest.clearAllMocks);

  describe("when view mode is DEFAULT", () => {
    it("should render the container", () => {
      const { queryByTestId } = renderFootballScoreboard();
      const footballScoreboardContainer = queryByTestId(FOOTBALL_SCOREBOARD);

      expect(footballScoreboardContainer).not.toBeNull();
    });

    it("should render the red cards and duration container", () => {
      const { queryByTestId } = renderFootballScoreboard();
      const redCardsAndDurationContainer = queryByTestId(RED_CARDS_DURATION_CONTAINER);
      expect(redCardsAndDurationContainer).not.toBeNull();
    });

    it("should render the team component", () => {
      renderFootballScoreboard();

      expect(VirtualTeam).toHaveBeenCalledTimes(2);
      expect(VirtualTeam.mock.calls[0][0]).toEqual(
        {
          reverseOrder: true,
          team: { name: "CFR Cluj" },
        },
        {},
      );
      expect(VirtualTeam.mock.calls[1][0]).toEqual(
        {
          reverseOrder: false,
          team: { name: "Rennes" },
        },
        {},
      );
    });
  });
});
