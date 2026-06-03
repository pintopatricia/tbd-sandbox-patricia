import { render } from "@testing-library/react-native";
import { RaceDetails } from "@ppb/the-wall-native";
import VirtualEventDetailsCard from "./VirtualEventDetailsCard.native";
import { VirtualEventKind } from "./map-to-props-factory";
import { VirtualFootballScoreboard } from "./snowflakes/VirtualFootballScoreboard/VirtualFootballScoreboard.native";

jest.mock("@ppb/the-wall-native", () => ({
  RaceDetails: jest.fn(() => <race-details-mock />),
}));

jest.mock("./snowflakes/VirtualFootballScoreboard/VirtualFootballScoreboard.native", () => ({
  VirtualFootballScoreboard: jest.fn(() => <virtual-football-scoreboard-mock />),
}));

function renderVirtualEventDetailsCard(virtualEventDetailsProps) {
  return render(<VirtualEventDetailsCard {...virtualEventDetailsProps} />);
}

describe("VirtualEventDetails component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when racing", () => {
    it("should render with race details", () => {
      renderVirtualEventDetailsCard({
        kind: VirtualEventKind.Racing,
        startTime: "some start time",
        venue: "some venue",
        name: "some name",
        showMeetingInfo: true,
        distance: "3f",
      });

      expect(RaceDetails).toHaveBeenCalledWith(
        {
          raceTime: "some start time",
          meetingName: "some venue",
          raceName: "some name",
          showMeetingInfo: true,
          distance: "3f",
          isHighlighted: true,
        },
        undefined,
      );
      expect(RaceDetails).toHaveBeenCalledTimes(1);
    });
  });

  describe("when football", () => {
    it("should render with avb scoreboard", () => {
      renderVirtualEventDetailsCard({
        kind: VirtualEventKind.Football,
        home: "Sporting Lisabona",
        away: "Benfica Lisabona",
      });

      expect(VirtualFootballScoreboard).toHaveBeenCalledWith(
        {
          home: { name: "Sporting Lisabona" },
          away: { name: "Benfica Lisabona" },
        },
        undefined,
      );
      expect(VirtualFootballScoreboard).toHaveBeenCalledTimes(1);
    });
  });
});
