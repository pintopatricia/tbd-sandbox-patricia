import { render, act } from "@testing-library/react-native";
import { getEventRegistry } from "eventemitter3-singleton";
import GamingPrizeMachineCardWithRefetch from "./GamingPrizeMachineCardWithRefetch.native";
import { GamingPrizeMachineQuery } from "@ppb/tbd-components-gaming/components/GamingPrizeMachineCard/model/GamingPrizeMachine.graphql";
import { getApolloClient } from "../../apollo-client/client";
import { useFocusEffect } from "@react-navigation/native";

jest.mock("../../apollo-client/client");

jest.mock("@react-navigation/native", () => ({
  useFocusEffect: jest.fn(),
}));

jest.mock("@ppb/tbd-components-gaming/components/GamingPrizeMachineCard/view/GamingPrizeMachineCard.native", () =>
  jest.fn(() => <gaming-prize-machine-card />),
);

describe("GamingPrizeMachineCardWithRefetch", () => {
  const { emit } = getEventRegistry();
  const mockRefetchQueries = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    getApolloClient.mockReturnValue({ refetchQueries: mockRefetchQueries });
    useFocusEffect.mockImplementation((cb) => cb());
  });

  it("should refetch GamingPrizeMachineQuery when webview closes and screen regains focus", () => {
    let focusCallback;
    useFocusEffect.mockImplementation((cb) => {
      focusCallback = cb;
    });

    render(<GamingPrizeMachineCardWithRefetch urn="urn:prizeMachine" />);

    act(() => {
      emit("@@UI/WEBVIEW_SCREEN_CLOSED", undefined);
    });

    act(() => {
      focusCallback();
    });

    expect(mockRefetchQueries).toHaveBeenCalledWith({
      include: [GamingPrizeMachineQuery],
    });
  });

  it("should not refetch before webview close event fires", () => {
    render(<GamingPrizeMachineCardWithRefetch urn="urn:prizeMachine" />);

    expect(mockRefetchQueries).not.toHaveBeenCalled();
  });

  it("should not refetch when webview closes but screen is not focused", () => {
    useFocusEffect.mockImplementation(() => {});

    render(<GamingPrizeMachineCardWithRefetch urn="urn:prizeMachine" />);

    act(() => {
      emit("@@UI/WEBVIEW_SCREEN_CLOSED", undefined);
    });

    expect(mockRefetchQueries).not.toHaveBeenCalled();
  });

  it("should refetch when screen regains focus after webview closed", () => {
    let focusCallback;
    useFocusEffect.mockImplementation((cb) => {
      focusCallback = cb;
    });

    render(<GamingPrizeMachineCardWithRefetch urn="urn:prizeMachine" />);

    act(() => {
      emit("@@UI/WEBVIEW_SCREEN_CLOSED", undefined);
    });

    expect(mockRefetchQueries).not.toHaveBeenCalled();

    act(() => {
      focusCallback();
    });

    expect(mockRefetchQueries).toHaveBeenCalledWith({
      include: [GamingPrizeMachineQuery],
    });
  });
});
