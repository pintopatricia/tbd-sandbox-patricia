import { renderHook } from "@testing-library/react";
import { getEventRegistry } from "eventemitter3-singleton";
import { useRaceSwitcherCardVM } from "./RaceSwitcherCard.viewmodel";

jest.mock("eventemitter3-singleton", () => {
  const emit = jest.fn();
  return {
    getEventRegistry: jest.fn(() => ({ emit })),
  };
});

const emit = getEventRegistry().emit as jest.Mock;

const VIEW_URN = "ppb:tbd:view:raceMeeting:7|12345.1500";

const meeting = {
  urn: "ppb:meeting:1",
  name: "Royal Ascot",
  venue: "Ascot",
  country: "GB",
  date: "2026-04-23",
  countryFlag: { vector: "vector-flag", small: "small-flag" },
};

const siblingA = {
  meetingUrn: "ppb:meeting:1",
  venue: "Ascot",
  countryFlag: { vector: "vector-a", small: "small-a" },
  viewLink: { viewUrn: VIEW_URN, viewUrl: "/meeting/ascot" },
};

const siblingB = {
  meetingUrn: "ppb:meeting:2",
  venue: "Cheltenham",
  countryFlag: null,
  viewLink: { viewUrn: "ppb:tbd:view:raceMeeting:7|99.1", viewUrl: "/meeting/cheltenham" },
};

describe("RaceSwitcherCard.viewmodel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("builds defaultValue from the meeting urn and venue", () => {
    const { result } = renderHook(() => useRaceSwitcherCardVM(meeting, [], "en-GB", "UTC"));

    expect(result.current.vm.data.defaultValue).toEqual({
      id: meeting.urn,
      label: meeting.venue,
    });
  });

  it("derives the icon from the meeting countryFlag, dropping nulls", () => {
    const { result } = renderHook(() =>
      useRaceSwitcherCardVM({ ...meeting, countryFlag: { vector: "v", small: null } }, [], "en-GB", "UTC"),
    );

    expect(result.current.vm.data.icon).toEqual({ vector: "v", small: undefined });
  });

  it("returns icon=undefined when the meeting has no countryFlag", () => {
    const { result } = renderHook(() => useRaceSwitcherCardVM({ ...meeting, countryFlag: null }, [], "en-GB", "UTC"));

    expect(result.current.vm.data.icon).toBeUndefined();
  });

  it("maps siblings into selector items with iconUrl when countryFlag is present", () => {
    const { result } = renderHook(() => useRaceSwitcherCardVM(meeting, [siblingA, siblingB], "en-GB", "UTC"));

    expect(result.current.vm.data.items).toEqual([
      { id: siblingA.meetingUrn, label: siblingA.venue, iconUrl: { vector: "vector-a", small: "small-a" } },
      { id: siblingB.meetingUrn, label: siblingB.venue, iconUrl: undefined },
    ]);
  });

  it("indexes sibling viewLinks by their meetingUrn", () => {
    const { result } = renderHook(() => useRaceSwitcherCardVM(meeting, [siblingA, siblingB], "en-GB", "UTC"));

    expect(result.current.vm.data.links).toEqual({
      [siblingA.meetingUrn]: siblingA.viewLink,
      [siblingB.meetingUrn]: siblingB.viewLink,
    });
  });

  it("appends the current meeting as a fallback item when siblings do not include it", () => {
    const { result } = renderHook(() => useRaceSwitcherCardVM(meeting, [siblingB], "en-GB", "UTC"));

    expect(result.current.vm.data.items.at(-1)).toEqual({ id: meeting.urn, label: meeting.venue });
  });

  it("does not append a fallback item when the current meeting is already a sibling", () => {
    const { result } = renderHook(() => useRaceSwitcherCardVM(meeting, [siblingA], "en-GB", "UTC"));

    // Only one item, the sibling that matches the current meeting.
    expect(result.current.vm.data.items).toHaveLength(1);
    expect(result.current.vm.data.items[0]?.id).toBe(meeting.urn);
  });

  it("formats the date using the supplied locale and timezone", () => {
    const { result } = renderHook(() => useRaceSwitcherCardVM(meeting, [], "en-GB", "UTC"));

    expect(result.current.vm.data.date).toBe("23 Apr");
  });

  it("returns date=undefined when the meeting has no date", () => {
    const { result } = renderHook(() => useRaceSwitcherCardVM({ ...meeting, date: null }, [], "en-GB", "UTC"));

    expect(result.current.vm.data.date).toBeUndefined();
  });

  it("emits @@UI/RACE_SWITCHER_OPEN when onOpen is invoked", () => {
    const { result } = renderHook(() => useRaceSwitcherCardVM(meeting, [], "en-GB", "UTC"));

    result.current.vm.events.onOpen(VIEW_URN);

    expect(emit).toHaveBeenCalledWith("@@UI/RACE_SWITCHER_OPEN", { urn: VIEW_URN });
  });

  it("emits @@UI/RACE_SWITCHER_CLOSE with the chosen viewLink", () => {
    const { result } = renderHook(() => useRaceSwitcherCardVM(meeting, [], "en-GB", "UTC"));

    result.current.vm.events.onClose(VIEW_URN, siblingB.viewLink);

    expect(emit).toHaveBeenCalledWith("@@UI/RACE_SWITCHER_CLOSE", {
      urn: VIEW_URN,
      viewLink: siblingB.viewLink,
    });
  });

  it("title is taken from the meeting name", () => {
    const { result } = renderHook(() => useRaceSwitcherCardVM(meeting, [], "en-GB", "UTC"));

    expect(result.current.vm.data.title).toBe(meeting.name);
  });
});
