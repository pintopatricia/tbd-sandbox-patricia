import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { VirtualTeam } from "../VirtualTeam/VirtualTeam.web";
import { VirtualFootballScoreboard } from "./VirtualFootballScoreboard.web";

jest.mock("../VirtualTeam/VirtualTeam.web", () => ({
  VirtualTeam: jest.fn((props) => <div>{props.children}</div>),
}));

const renderScoreboard = (props) => render(<VirtualFootballScoreboard {...props} />);

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
  inplay: false,
};

describe("FootballScoreboard component", () => {
  beforeEach(() => jest.clearAllMocks());
  describe("render all subcomponents", () => {
    it("should render the home Team component", () => {
      renderScoreboard(SCOREBOARD);
      expect(VirtualTeam).toHaveBeenCalledWith(
        {
          team: {
            name: "CFR Cluj",
          },
          reverseOrder: true,
        },
        undefined,
      );
    });

    it("should render the away Team", () => {
      renderScoreboard(SCOREBOARD);
      expect(VirtualTeam).toHaveBeenLastCalledWith(
        {
          team: {
            name: "Rennes",
          },
          reverseOrder: false,
        },
        undefined,
      );
    });
  });
});
