import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { RaceDetails } from "@ppb/the-wall-web";
import { VirtualFootballScoreboard } from "./snowflakes/VirtualFootballScoreboard/VirtualFootballScoreboard.web";
import VirtualEventDetailsCard from "./VirtualEventDetailsCard.web";
import { VirtualEventKind } from "./map-to-props-factory";

jest.mock("@ppb/the-wall-web", () => ({
  RaceDetails: jest.fn(() => <race-details-mock data-testid="race-details" />),
}));

jest.mock("./snowflakes/VirtualFootballScoreboard/VirtualFootballScoreboard.web", () => ({
  VirtualFootballScoreboard: jest.fn(() => <virtual-football-scoreboard-mock data-testid="football-scoreboard" />),
}));

function renderVirtualEventDetailsCard(virtualEventDetailsProps) {
  return render(<VirtualEventDetailsCard {...virtualEventDetailsProps} />);
}

describe("VirtualEventDetails component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when racing", () => {
    it("must render with race details", () => {
      renderVirtualEventDetailsCard({
        kind: VirtualEventKind.Racing,
        startTime: "some start time",
        venue: "some venu",
        name: "some name",
        showMeetingInfo: true,
      });

      expect(RaceDetails).toHaveBeenCalledWith(
        {
          raceTime: "some start time",
          meetingName: "some venu",
          raceName: "some name",
          showMeetingInfo: true,
          isHighlighted: true,
        },
        undefined,
      );
      expect(RaceDetails).toHaveBeenCalledTimes(1);
    });
  });

  describe("when football", () => {
    it("must render with fixture", () => {
      renderVirtualEventDetailsCard({
        kind: VirtualEventKind.Football,
        home: "home team",
        away: "away team",
      });

      expect(VirtualFootballScoreboard).toHaveBeenCalledWith(
        {
          home: { name: "home team" },
          away: { name: "away team" },
        },
        undefined,
      );
      expect(VirtualFootballScoreboard).toHaveBeenCalledTimes(1);
    });
  });
});
