import "jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import RaceView from "./RaceView.web";
import { useSubscribeToRaceUpdates } from "./useSubscribeToRaceUpdates";

jest.mock("./useSubscribeToRaceUpdates");

jest.mock("../GenericView", () => jest.fn(() => <div>connected-generic-view</div>));

describe("RaceView.Web", () => {
  beforeEach(jest.clearAllMocks);

  const baseProps = {
    urn: "urn:view:race:1",
    raceURN: "urn:race:1",
    raceStatus: "OPEN",
    resultType: "OFFICIAL",
    dispatchFetchCatalogue: jest.fn(),
    dispatchSubscribeRaceUpdates: jest.fn(),
    dispatchUnsubscribeRaceUpdates: jest.fn(),
    isRaceViewActive: true,
  };

  it("renders SubscribedRaceView and Generic when isRaceViewActive is true", async () => {
    render(<RaceView {...baseProps} />);
    expect(useSubscribeToRaceUpdates).toHaveBeenCalledWith({
      urn: baseProps.urn,
      raceURN: baseProps.raceURN,
      raceStatus: baseProps.raceStatus,
      resultType: baseProps.resultType,
      dispatchSubscribeRaceUpdates: baseProps.dispatchSubscribeRaceUpdates,
      dispatchUnsubscribeRaceUpdates: baseProps.dispatchUnsubscribeRaceUpdates,
      dispatchFetchCatalogue: baseProps.dispatchFetchCatalogue,
    });
    expect(await screen.findByText("connected-generic-view")).toBeInTheDocument();
  });

  it("returns null when isRaceViewActive is false but GenericView is returned", async () => {
    render(<RaceView {...baseProps} isRaceViewActive={false} />);
    expect(useSubscribeToRaceUpdates).not.toHaveBeenCalled();
    expect(await screen.findByText("connected-generic-view")).toBeInTheDocument();
  });
});
