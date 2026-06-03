import { render } from "@testing-library/react-native";

import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { OthersIconName } from "@ppb/the-wall-icons";

import { RacingResults } from "./RacingResults.native";
import {
  RACING_RESULTS,
  RACING_RESULTS_TITLE,
  RACING_RESULTS_TABLE_HEADERS,
  RACING_RESULTS_POSITION,
  RACING_RESULTS_DISTANCE,
  RACING_RESULTS_HORSE_NAME,
  RACING_RESULTS_STARTING_PRICE,
  RACING_RESULTS_NUMBER_OF_RAN_RUNNERS,
  RACING_RESULTS_DNFS_BOARD,
  RACING_RESULTS_FAV,
} from "./RacingResults.native.selectors";

jest.mock("react-native-svg", () => ({ SvgCssUri: jest.fn(() => <svg-css-uri-mock />) }));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {
    NeutralsIconDefault: "#FCFCFD",
  },
  typography: {},
  spacings: {},
  heights: {},
}));

jest.mock("@ppb/the-wall-native/components/TBDImage/TBDImage", () => ({
  TBDImage: jest.fn(() => <tbd-image />),
}));

function renderRacingResults({ title, labels, runners, ranNumber, dnfCodes }) {
  return render(
    <RacingResults title={title} labels={labels} runners={runners} ranNumber={ranNumber} dnfCodes={dnfCodes} />,
  );
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
      trainerName: "Amazing trainer",
      silk: "/images/silk.png",
      hasPerformance: true,
      favouriteLabel: "Fav",
    },
    {
      saddleCloth: "77",
      draw: 11,
      distance: "nd",
      position: 2,
      startingPrice: "12/1",
      horseName: "Never Said Nothing 2",
      jockeyName: "Marco Ghiani 2",
      trainerName: "Amazing trainer 2",
      silk: "/images/silk.png",
      hasPerformance: true,
      favouriteLabel: "2 Fav",
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
  dnfCodes: {
    PU: "Pulled up",
  },
};

describe("Racing Results", () => {
  let racingResults;
  let title;
  let headers;
  let positions;
  let distances;
  let horseNames;
  let startingPrices;
  let numberOfRanRunners;
  let dnfsBoard;
  let favLabel;

  describe("when the component is rendered", () => {
    beforeEach(() => {
      const { queryByTestId, getAllByTestId } = renderRacingResults(firstMock);

      racingResults = queryByTestId(RACING_RESULTS);
      title = queryByTestId(RACING_RESULTS_TITLE);

      headers = getAllByTestId(RACING_RESULTS_TABLE_HEADERS);
      positions = getAllByTestId(RACING_RESULTS_POSITION);
      distances = getAllByTestId(RACING_RESULTS_DISTANCE);
      horseNames = getAllByTestId(RACING_RESULTS_HORSE_NAME);
      startingPrices = getAllByTestId(RACING_RESULTS_STARTING_PRICE);
      numberOfRanRunners = queryByTestId(RACING_RESULTS_NUMBER_OF_RAN_RUNNERS);
      dnfsBoard = queryByTestId(RACING_RESULTS_DNFS_BOARD);
      favLabel = getAllByTestId(RACING_RESULTS_FAV);
    });

    it("should render the racing results", () => {
      expect(racingResults).not.toBeNull();
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
        expect(GenericIcon.mock.calls[1][0]).toEqual({ color: "#FCFCFD", name: OthersIconName.WINNER_RIBBON });
      });

      it("should display distance for the second runner", () => {
        expect(distances.length).toBe(2);
        expect(distances[0]).toHaveTextContent("nd");
        expect(distances[1]).toHaveTextContent("-");
      });
    });

    it("should display the horse cells", () => {
      expect(horseNames.length).toBe(3);
      expect(horseNames[0]).toHaveTextContent("Never Said Nothing");
      expect(horseNames[1]).toHaveTextContent("Never Said Nothing 2");
      expect(horseNames[2]).toHaveTextContent("Non Runner");
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

    it("should display the dnfs board", () => {
      expect(dnfsBoard).not.toBeNull();
    });

    it("should display favourite label", () => {
      expect(favLabel.length).toBe(2);
      expect(favLabel[0]).toHaveTextContent("Fav");
      expect(favLabel[1]).toHaveTextContent("2 Fav");
    });
  });
});
