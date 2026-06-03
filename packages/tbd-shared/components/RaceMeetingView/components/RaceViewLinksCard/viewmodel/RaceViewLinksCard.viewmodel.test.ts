import { renderHook } from "@testing-library/react";
import { getEventRegistry } from "eventemitter3-singleton";
import { useRaceViewLinksCardVM } from "./RaceViewLinksCard.viewmodel";

jest.mock("eventemitter3-singleton", () => {
  const emit = jest.fn();
  return {
    getEventRegistry: jest.fn(() => ({ emit })),
  };
});

const emit = getEventRegistry().emit as jest.Mock;

const VIEW_URN = "ppb:tbd:view:raceMeeting:7|12345.1500";
const RACE_URN_1 = "ppb:race:12345.1500";
const RACE_URN_2 = "ppb:race:12345.1530";

const buildRace = (overrides: Partial<Parameters<typeof useRaceViewLinksCardVM>[2][number]> = {}) => ({
  raceUrn: RACE_URN_1,
  startTime: "2026-04-23T15:00:00Z",
  isRaceClosed: false,
  viewLink: { viewUrn: VIEW_URN, viewUrl: "/race/1" },
  promotion: null as string | null,
  ...overrides,
});

describe("RaceViewLinksCard.viewmodel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("formats startTime as HH:mm in the supplied locale and timezone", () => {
    const { result } = renderHook(() => useRaceViewLinksCardVM(VIEW_URN, null, [buildRace()], "en-GB", "UTC"));

    expect(result.current.vm.data.items[0]?.raceTime).toBe("15:00");
  });

  it("maps the viewLink and isRaceClosed flag onto each item", () => {
    const { result } = renderHook(() =>
      useRaceViewLinksCardVM(VIEW_URN, null, [buildRace({ isRaceClosed: true })], "en-GB", "UTC"),
    );

    expect(result.current.vm.data.items[0]).toMatchObject({
      viewLink: { viewUrn: VIEW_URN, viewUrl: "/race/1" },
      isRaceClosed: true,
    });
  });

  it("omits the marketPromo when the race is closed", () => {
    const { result } = renderHook(() =>
      useRaceViewLinksCardVM(VIEW_URN, null, [buildRace({ isRaceClosed: true, promotion: "promo" })], "en-GB", "UTC"),
    );

    expect(result.current.vm.data.items[0]?.marketPromo).toBeUndefined();
  });

  it("forwards the promotion as marketPromo when the race is open", () => {
    const { result } = renderHook(() =>
      useRaceViewLinksCardVM(VIEW_URN, null, [buildRace({ promotion: "promo" })], "en-GB", "UTC"),
    );

    expect(result.current.vm.data.items[0]?.marketPromo).toBe("promo");
  });

  it("falls back to undefined when there is no promotion and the race is open", () => {
    const { result } = renderHook(() =>
      useRaceViewLinksCardVM(VIEW_URN, null, [buildRace({ promotion: null })], "en-GB", "UTC"),
    );

    expect(result.current.vm.data.items[0]?.marketPromo).toBeUndefined();
  });

  it("sets defaultRaceIndex to the position of the selectedRaceUrn", () => {
    const { result } = renderHook(() =>
      useRaceViewLinksCardVM(
        VIEW_URN,
        RACE_URN_2,
        [buildRace({ raceUrn: RACE_URN_1 }), buildRace({ raceUrn: RACE_URN_2 })],
        "en-GB",
        "UTC",
      ),
    );

    expect(result.current.vm.data.defaultRaceIndex).toBe(1);
  });

  it("defaults defaultRaceIndex to 0 when no race matches the selected urn", () => {
    const { result } = renderHook(() =>
      useRaceViewLinksCardVM(VIEW_URN, "ppb:race:unknown", [buildRace()], "en-GB", "UTC"),
    );

    expect(result.current.vm.data.defaultRaceIndex).toBe(0);
  });

  it("returns an empty items list when no races are passed", () => {
    const { result } = renderHook(() => useRaceViewLinksCardVM(VIEW_URN, null, [], "en-GB", "UTC"));

    expect(result.current.vm.data.items).toEqual([]);
    expect(result.current.vm.data.defaultRaceIndex).toBe(0);
  });

  it("emits @@UI/RACE_VIEW_LINKS_CARD_CLICKED when onClick is invoked", () => {
    const { result } = renderHook(() => useRaceViewLinksCardVM(VIEW_URN, null, [buildRace()], "en-GB", "UTC"));

    const viewLink = { viewUrn: "ppb:tbd:view:raceMeeting:7|999.1", viewUrl: "/race/2" };
    result.current.vm.events.onClick(VIEW_URN, viewLink);

    expect(emit).toHaveBeenCalledWith("@@UI/RACE_VIEW_LINKS_CARD_CLICKED", { urn: VIEW_URN, viewLink });
  });

  it("exposes the viewUrn under vm.viewUrn", () => {
    const { result } = renderHook(() => useRaceViewLinksCardVM(VIEW_URN, null, [], "en-GB", "UTC"));

    expect(result.current.vm.viewUrn).toBe(VIEW_URN);
  });
});
