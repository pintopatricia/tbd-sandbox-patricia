import { render } from "@testing-library/react-native";
import RaceView from "./RaceView.native";
import { useSubscribeToRaceUpdates } from "./useSubscribeToRaceUpdates";
import ConnectedGenericView from "../GenericView";
import { GenericView } from "../GenericView/GenericView.native";
import { GenericViewPlaceholder } from "../GenericView/GenericViewPlaceholder.native";
import RaceMeetingView from "../RaceMeetingView/components/RaceMeetingView/view/RaceMeetingView.native";

jest.mock("./useSubscribeToRaceUpdates");
jest.mock("../GenericView", () => jest.fn(() => <connected-generic-view-mock testID="connected-generic-view" />));
jest.mock("../GenericView/GenericView.native", () => ({
  GenericView: jest.fn(() => <generic-view-mock />),
}));
jest.mock("../GenericView/GenericViewPlaceholder.native", () => ({
  GenericViewPlaceholder: jest.fn(() => <generic-view-placeholder-mock />),
}));
jest.mock("../RaceMeetingView/components/RaceMeetingView/view/RaceMeetingView.native", () =>
  jest.fn(() => <race-meeting-view-mock testID="race-meeting-view" />),
);

describe("RaceView.native", () => {
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

  it("renders SubscribedRaceView and GenericView when isRaceViewActive is true", () => {
    const { getByTestId } = render(<RaceView {...baseProps} />);

    expect(useSubscribeToRaceUpdates).toHaveBeenCalledWith({
      urn: baseProps.urn,
      raceURN: baseProps.raceURN,
      raceStatus: baseProps.raceStatus,
      resultType: baseProps.resultType,
      dispatchSubscribeRaceUpdates: baseProps.dispatchSubscribeRaceUpdates,
      dispatchUnsubscribeRaceUpdates: baseProps.dispatchUnsubscribeRaceUpdates,
      dispatchFetchCatalogue: baseProps.dispatchFetchCatalogue,
    });
    expect(getByTestId("connected-generic-view")).toBeDefined();
    expect(ConnectedGenericView).toHaveBeenCalledWith(
      {
        urn: baseProps.urn,
        component: GenericView,
        placeholder: GenericViewPlaceholder,
        root: true,
      },
      undefined,
    );
  });

  it("does not subscribe when isRaceViewActive is false and still renders GenericView", () => {
    const { getByTestId } = render(<RaceView {...baseProps} isRaceViewActive={false} />);

    expect(useSubscribeToRaceUpdates).not.toHaveBeenCalled();
    expect(getByTestId("connected-generic-view")).toBeDefined();
  });

  it("renders RaceMeetingView when isRaceMeetingViewActive is true", () => {
    const { getByTestId, queryByTestId } = render(<RaceView {...baseProps} isRaceMeetingViewActive />);

    expect(useSubscribeToRaceUpdates).not.toHaveBeenCalled();
    expect(RaceMeetingView).toHaveBeenCalledWith({ urn: baseProps.urn }, undefined);
    expect(getByTestId("race-meeting-view")).toBeDefined();
    expect(queryByTestId("connected-generic-view")).toBeNull();
  });
});
