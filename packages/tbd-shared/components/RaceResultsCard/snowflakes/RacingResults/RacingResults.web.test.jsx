import { fireEvent, render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { AssetsIconName, OthersIconName } from "@ppb/the-wall-icons";

import { RacingResults } from "./RacingResults.web";
import {
  TEST_ID,
  TABLE,
  TITLE,
  TABLE_HEADER,
  POSITION,
  DISTANCE,
  STARTING_PRICE,
  RUNNER,
  NUMBER_OF_RAN_RUNNERS,
  SILK,
  DNFS_BOARD,
  FAVOURITE_LABEL,
} from "./RacingResults.web.selectors";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

function renderRacingResults({ title, labels, runners, ranNumber }) {
  return render(<RacingResults title={title} labels={labels} runners={runners} ranNumber={ranNumber} />);
}

const firstMock = {
  title: "Full Results",
  labels: {
    positionLabel: "POS",
    distanceLabel: "DIST",
    horseLabel: "HORSE",
    startingPriceLabel: "SP",
    ranLabel: "Ran",
  },
  runners: [
    {
      saddleCloth: "7",
      draw: 1,
      distance: "nd",
      position: 1,
      startingPrice: "SP",
      horseName: "Never Said Nothing",
      jockeyName: "Marco Ghiani",
      trainerName: "Amazing Trainer",
      silk: "/images/silk.png",
      hasPerformance: true,
      favouriteLabel: "2 Fav",
    },
    {
      saddleCloth: "77",
      draw: 11,
      distance: "nd",
      position: 2,
      startingPrice: "12/1",
      horseName: "Never Said Nothing 2",
      jockeyName: "Marco Ghiani 2",
      trainerName: "Amazing Trainer 2",
      silk: "/images/silk.png",
      hasPerformance: true,
      favouriteLabel: "Fav",
    },
    {
      saddleCloth: "000",
      draw: 0,
      distance: "-",
      position: 0,
      startingPrice: "-",
      horseName: "No Performance",
      jockeyName: "Should not appear",
      trainerName: "Trainer should not appear",
      silk: "/images/silk.png",
      hasPerformance: false,
    },
    {
      saddleCloth: "000",
      draw: 0,
      distance: "-",
      position: 0,
      startingPrice: "Non Runner",
      horseName: "Non Runner",
      jockeyName: "Should be present",
      trainerName: "Trainer should be present",
      silk: "/images/silk.png",
      hasPerformance: false,
      isNonRunner: true,
    },
  ],
  ranNumber: 6,
};

describe("Racing Results", () => {
  let racingResults;
  let title;
  let table;
  let headers;
  let positions;
  let distances;
  let runners;
  let startingPrices;
  let numberOfRanRunners;
  let silks;
  let dnfsBoard;
  let favouriteLabels;

  let container;

  describe("when the component is rendered", () => {
    beforeEach(() => {
      ({ container } = renderRacingResults(firstMock));

      racingResults = container.querySelector(TEST_ID);
      title = container.querySelector(TITLE);
      table = container.querySelector(TABLE);

      headers = container.querySelectorAll(TABLE_HEADER);
      positions = container.querySelectorAll(POSITION);
      distances = container.querySelectorAll(DISTANCE);
      runners = container.querySelectorAll(RUNNER);
      startingPrices = container.querySelectorAll(STARTING_PRICE);
      numberOfRanRunners = container.querySelector(NUMBER_OF_RAN_RUNNERS);
      silks = container.querySelectorAll(SILK);
      dnfsBoard = container.querySelectorAll(DNFS_BOARD);
      favouriteLabels = container.querySelectorAll(FAVOURITE_LABEL);
    });

    it("should render the racing results", () => {
      expect(racingResults).not.toBeNull();
      expect(table).not.toBeNull();
    });

    it("should display the title equal to 'Full Results'", () => {
      expect(title).toHaveTextContent("Full Results");
    });

    it("should display the table header labels", () => {
      expect(headers.length).toBe(4);
      expect(headers[0]).toHaveTextContent("POS");
      expect(headers[1]).toHaveTextContent("DIST");
      expect(headers[2]).toHaveTextContent("HORSE");
      expect(headers[3]).toHaveTextContent("SP");
    });

    it("should display the position cells", () => {
      expect(positions.length).toBe(3);
      expect(positions[0]).toHaveTextContent("1");
      expect(positions[1]).toHaveTextContent("2");
      expect(positions[2]).toHaveTextContent("-");
    });

    describe("should display the distance cells", () => {
      it("should display the winner ribbon icon for the first runner", () => {
        expect(GenericIcon.mock.calls[1][0]).toEqual({
          color: "var(--neutrals-icon-default)",
          name: OthersIconName.WINNER_RIBBON,
        });
      });

      it("should display distance for the remaining runners", () => {
        expect(distances.length).toBe(3);
        expect(distances[1]).toHaveTextContent("nd");
        expect(distances[2]).toHaveTextContent("-");
      });
    });

    it("should display the horse cells", () => {
      expect(runners.length).toBe(3);
      expect(runners[0]).toHaveTextContent("Never Said Nothing");
      expect(runners[1]).toHaveTextContent("Never Said Nothing 2");
      expect(runners[2]).toHaveTextContent("Non Runner");
    });

    it("should display the startingPrice cells", () => {
      expect(startingPrices.length).toBe(3);
      expect(startingPrices[0]).toHaveTextContent("SP");
      expect(startingPrices[1]).toHaveTextContent("12/1");
      expect(startingPrices[2]).toHaveTextContent("Non Runner");
    });

    it("should display the number of runners that ran", () => {
      expect(numberOfRanRunners).toHaveTextContent("Ran: 6");
    });

    it("should display default silk when img throws error", () => {
      expect(GenericIcon).not.toHaveBeenCalledWith(
        {
          name: AssetsIconName.SILK,
        },
        undefined,
      );
      fireEvent.error(silks[0]);
      expect(GenericIcon).toHaveBeenCalledWith(
        {
          name: AssetsIconName.SILK,
        },
        undefined,
      );
    });

    it("should display the favouriteLabel cells", () => {
      expect(favouriteLabels.length).toBe(2);
      expect(favouriteLabels[0]).toHaveTextContent("2 Fav");
      expect(favouriteLabels[1]).toHaveTextContent("Fav");
    });

    describe("when the first runner has no performance data (is not displayed)", () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it("should not display winner ribbon on the first line", () => {
        expect(GenericIcon).not.toHaveBeenCalled();
      });
    });

    it("should display the dnfs board", () => {
      expect(dnfsBoard).not.toBeNull();
    });
  });
});
