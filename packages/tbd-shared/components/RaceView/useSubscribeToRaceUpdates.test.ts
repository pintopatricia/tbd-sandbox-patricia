import { renderHook } from "@testing-library/react";
import { RaceDetails } from "@ppb/tbd-store";
import { useSubscribeToRaceUpdates } from "./useSubscribeToRaceUpdates";

describe("useSubscribeToRaceUpdates", () => {
  const urn = "urn:view:race:1";
  const raceURN = "urn:race:1";
  let dispatchSubscribeRaceUpdates: jest.Mock;
  let dispatchUnsubscribeRaceUpdates: jest.Mock;
  let dispatchFetchCatalogue: jest.Mock;

  beforeEach(() => {
    dispatchSubscribeRaceUpdates = jest.fn();
    dispatchUnsubscribeRaceUpdates = jest.fn();
    dispatchFetchCatalogue = jest.fn();
  });

  it("subscribes and unsubscribes on mount/unmount", () => {
    const { unmount } = renderHook((props) => useSubscribeToRaceUpdates(props), {
      initialProps: {
        urn,
        raceURN,
        raceStatus: "DORMANT" as RaceDetails["status"],
        resultType: undefined,
        dispatchSubscribeRaceUpdates,
        dispatchUnsubscribeRaceUpdates,
        dispatchFetchCatalogue,
      },
    });
    expect(dispatchSubscribeRaceUpdates).toHaveBeenCalledWith(raceURN);
    unmount();
    expect(dispatchUnsubscribeRaceUpdates).toHaveBeenCalledWith(raceURN);
  });

  it("does not subscribe if raceStatus is undefined", () => {
    renderHook((props) => useSubscribeToRaceUpdates(props), {
      initialProps: {
        urn,
        raceURN,
        raceStatus: undefined,
        resultType: undefined,
        dispatchSubscribeRaceUpdates,
        dispatchUnsubscribeRaceUpdates,
        dispatchFetchCatalogue,
      },
    });
    expect(dispatchSubscribeRaceUpdates).not.toHaveBeenCalled();
  });

  it("does not subscribe if raceURN is undefined", () => {
    renderHook((props) => useSubscribeToRaceUpdates(props), {
      initialProps: {
        urn,
        raceURN: undefined,
        raceStatus: undefined,
        resultType: undefined,
        dispatchSubscribeRaceUpdates,
        dispatchUnsubscribeRaceUpdates,
        dispatchFetchCatalogue,
      },
    });
    expect(dispatchSubscribeRaceUpdates).not.toHaveBeenCalled();
  });

  it("does not dispatches fetch catalogue when raceStatus isn't RESULT", () => {
    const { rerender } = renderHook((props) => useSubscribeToRaceUpdates(props), {
      initialProps: {
        urn,
        raceURN,
        raceStatus: "OPEN" as RaceDetails["status"],
        dispatchSubscribeRaceUpdates,
        dispatchUnsubscribeRaceUpdates,
        dispatchFetchCatalogue,
      },
    });
    rerender({
      urn,
      raceURN,
      raceStatus: "OFF" as RaceDetails["status"],
      dispatchSubscribeRaceUpdates,
      dispatchUnsubscribeRaceUpdates,
      dispatchFetchCatalogue,
    });
    expect(dispatchFetchCatalogue).not.toHaveBeenCalled();
  });

  it("does not dispatches fetch catalogue when raceStatus is RESULT but resultType is undefined", () => {
    const { rerender } = renderHook((props) => useSubscribeToRaceUpdates(props), {
      initialProps: {
        urn,
        raceURN,
        raceStatus: "OPEN" as RaceDetails["status"],
        dispatchSubscribeRaceUpdates,
        dispatchUnsubscribeRaceUpdates,
        dispatchFetchCatalogue,
      },
    });
    rerender({
      urn,
      raceURN,
      raceStatus: "RESULT" as RaceDetails["status"],
      dispatchSubscribeRaceUpdates,
      dispatchUnsubscribeRaceUpdates,
      dispatchFetchCatalogue,
    });
    expect(dispatchFetchCatalogue).not.toHaveBeenCalled();
  });

  it("dispatches fetch catalogue when raceStatus is RESULT and resultType is QUICK_RESULT", () => {
    const { rerender } = renderHook((props) => useSubscribeToRaceUpdates(props), {
      initialProps: {
        urn,
        raceURN,
        raceStatus: "OPEN" as RaceDetails["status"],
        resultType: undefined as RaceDetails["resultType"] | undefined,
        dispatchSubscribeRaceUpdates,
        dispatchUnsubscribeRaceUpdates,
        dispatchFetchCatalogue,
      },
    });
    rerender({
      urn,
      raceURN,
      raceStatus: "RESULT" as RaceDetails["status"],
      resultType: "QUICK_RESULT",
      dispatchSubscribeRaceUpdates,
      dispatchUnsubscribeRaceUpdates,
      dispatchFetchCatalogue,
    });
    expect(dispatchFetchCatalogue).toHaveBeenCalledTimes(1);
    expect(dispatchFetchCatalogue).toHaveBeenCalledWith(urn);
  });

  it("dispatches fetch catalogue only once when resultType transitions from QUICK_RESULT to FULL_RESULT", () => {
    const { rerender } = renderHook((props) => useSubscribeToRaceUpdates(props), {
      initialProps: {
        urn,
        raceURN,
        raceStatus: "RESULT" as RaceDetails["status"],
        resultType: "QUICK_RESULT" as RaceDetails["resultType"],
        dispatchSubscribeRaceUpdates,
        dispatchUnsubscribeRaceUpdates,
        dispatchFetchCatalogue,
      },
    });
    // QUICK_RESULT triggers fetch
    expect(dispatchFetchCatalogue).toHaveBeenCalledTimes(1);
    expect(dispatchFetchCatalogue).toHaveBeenCalledWith(urn);
    // Transition to FULL_RESULT triggers fetch once
    rerender({
      urn,
      raceURN,
      raceStatus: "RESULT" as RaceDetails["status"],
      resultType: "FULL_RESULT",
      dispatchSubscribeRaceUpdates,
      dispatchUnsubscribeRaceUpdates,
      dispatchFetchCatalogue,
    });
    expect(dispatchFetchCatalogue).toHaveBeenCalledTimes(2);
    expect(dispatchFetchCatalogue).toHaveBeenCalledWith(urn);
    // Further rerenders with FULL_RESULT do not trigger again
    rerender({
      urn,
      raceURN,
      raceStatus: "RESULT" as RaceDetails["status"],
      resultType: "FULL_RESULT",
      dispatchSubscribeRaceUpdates,
      dispatchUnsubscribeRaceUpdates,
      dispatchFetchCatalogue,
    });
    expect(dispatchFetchCatalogue).toHaveBeenCalledTimes(2);
  });

  it("does not dispatch fetch catalogue for FULL_RESULT if not transitioned from QUICK_RESULT", () => {
    const { rerender } = renderHook((props) => useSubscribeToRaceUpdates(props), {
      initialProps: {
        urn,
        raceURN,
        raceStatus: "RESULT" as RaceDetails["status"],
        resultType: undefined as RaceDetails["resultType"] | undefined,
        dispatchSubscribeRaceUpdates,
        dispatchUnsubscribeRaceUpdates,
        dispatchFetchCatalogue,
      },
    });
    rerender({
      urn,
      raceURN,
      raceStatus: "RESULT" as RaceDetails["status"],
      resultType: "FULL_RESULT",
      dispatchSubscribeRaceUpdates,
      dispatchUnsubscribeRaceUpdates,
      dispatchFetchCatalogue,
    });
    expect(dispatchFetchCatalogue).not.toHaveBeenCalled();
  });
});
