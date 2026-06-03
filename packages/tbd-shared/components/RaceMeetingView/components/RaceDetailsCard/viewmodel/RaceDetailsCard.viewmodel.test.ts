import { renderHook } from "@testing-library/react";
import { getEventRegistry } from "eventemitter3-singleton";
import { useRaceDetailsCardVM } from "./RaceDetailsCard.viewmodel";

jest.mock("../../../../../helpers/i18n", () => ({
  i18n: ({ key }: { key: string }) => `t(${key})`,
}));

jest.mock("eventemitter3-singleton", () => {
  const emit = jest.fn();

  return {
    getEventRegistry: jest.fn(() => ({
      emit,
    })),
  };
});

const emit = getEventRegistry().emit as jest.Mock;

const meeting = {
  name: "Ascot",
  venue: "Ascot",
  date: "2026-04-23",
  countryFlag: null,
};

const meetingWithCountryFlag = {
  name: "Royal Ascot",
  venue: "Ascot Racecourse",
  date: "2026-04-23",
  countryFlag: {
    vector: "vector-flag",
    small: "small-flag",
  },
};

const baseRace = {
  raceId: "12345",
  raceUrn: "ppb:race:12345.1500",
  isHorseRacing: true,
  raceName: "Race 1",
  startTime: "2026-04-23T15:00:00Z",
  resultType: null,
  raceStatus: null,
  raceStatusLabel: null,
  numberOfRunners: 8,
  raceClass: null,
  going: null,
  raceDetailsTitle: null,
  isRaceRunningStatus: false,
  availableToSubscribe: false,
};

describe("useRaceDetailsCardVM", () => {
  beforeEach(() => {
    emit.mockClear();
  });

  const subscribePayload = {
    raceUrn: baseRace.raceUrn,
    isHorseRacing: baseRace.isHorseRacing,
  };

  it("maps race and meeting data for the view", () => {
    const race = {
      ...baseRace,
      raceStatus: "RESULTED",
      raceStatusLabel: "Final result",
      raceClass: 3,
      going: "SOFT",
      raceDetailsTitle: "Handicap Stakes",
      isRaceRunningStatus: true,
      availableToSubscribe: true,
    };

    const { result } = renderHook(() => useRaceDetailsCardVM(race, meetingWithCountryFlag, "en-GB", "UTC"));

    expect(result.current.vm.data).toEqual({
      countryFlag: {
        vector: "vector-flag",
        small: "small-flag",
      },
      raceTime: "15:00",
      raceName: race.raceName,
      meetingName: meetingWithCountryFlag.venue,
      raceStatus: "RESULTED",
      raceStatusLabel: "Final result",
      date: meetingWithCountryFlag.date,
      numberOfRunners: race.numberOfRunners,
      raceClass: "t(I18N.LABELS.CLASS) 3",
      trackGoing: "t(I18N.RACE_GOING.SOFT)",
      raceDetailsTitle: "Handicap Stakes",
      runnersLabel: "t(I18N.LABELS.RUNNERS)",
      isRaceRunningStatus: true,
      availableToSubscribe: true,
    });
  });

  it("normalizes nullable data fields for the view", () => {
    const race = {
      ...baseRace,
      raceStatus: null,
      raceStatusLabel: null,
      numberOfRunners: null,
      raceClass: null,
      going: null,
      raceDetailsTitle: null,
    };

    const { result } = renderHook(() =>
      useRaceDetailsCardVM(
        race,
        {
          ...meeting,
          date: null,
          countryFlag: null,
        },
        "en-GB",
        "UTC",
      ),
    );

    expect(result.current.vm.data).toEqual({
      countryFlag: undefined,
      raceTime: "15:00",
      raceName: race.raceName,
      meetingName: meeting.venue,
      raceStatus: undefined,
      raceStatusLabel: undefined,
      date: undefined,
      numberOfRunners: undefined,
      raceClass: undefined,
      trackGoing: undefined,
      raceDetailsTitle: undefined,
      runnersLabel: "t(I18N.LABELS.RUNNERS)",
      isRaceRunningStatus: false,
      availableToSubscribe: false,
    });
  });

  it("keeps an empty country flag object when nested values are null", () => {
    const { result } = renderHook(() =>
      useRaceDetailsCardVM(
        baseRace,
        {
          ...meeting,
          countryFlag: {
            vector: null,
            small: null,
          },
        },
        "en-GB",
        "UTC",
      ),
    );

    expect(result.current.vm.data.countryFlag).toEqual({});
  });

  it("maps only vector when small is null", () => {
    const { result } = renderHook(() =>
      useRaceDetailsCardVM(
        baseRace,
        {
          ...meeting,
          countryFlag: {
            vector: "vector-flag",
            small: null,
          },
        },
        "en-GB",
        "UTC",
      ),
    );

    expect(result.current.vm.data.countryFlag).toEqual({
      vector: "vector-flag",
    });
  });

  it("maps only small when vector is null", () => {
    const { result } = renderHook(() =>
      useRaceDetailsCardVM(
        baseRace,
        {
          ...meeting,
          countryFlag: {
            vector: null,
            small: "small-flag",
          },
        },
        "en-GB",
        "UTC",
      ),
    );

    expect(result.current.vm.data.countryFlag).toEqual({
      small: "small-flag",
    });
  });

  it("treats raceClass 0 as absent", () => {
    const { result } = renderHook(() =>
      useRaceDetailsCardVM(
        {
          ...baseRace,
          raceClass: 0,
        },
        meeting,
        "en-GB",
        "UTC",
      ),
    );

    expect(result.current.vm.data.raceClass).toBeUndefined();
  });

  it("preserves numberOfRunners 0", () => {
    const { result } = renderHook(() =>
      useRaceDetailsCardVM(
        {
          ...baseRace,
          numberOfRunners: 0,
        },
        meeting,
        "en-GB",
        "UTC",
      ),
    );

    expect(result.current.vm.data.numberOfRunners).toBe(0);
  });

  ["SOFT", "GOOD_TO_FIRM", "HEAVY"].forEach((going) => {
    it(`builds going key for ${going}`, () => {
      const { result } = renderHook(() =>
        useRaceDetailsCardVM(
          {
            ...baseRace,
            going,
          },
          meeting,
          "en-GB",
          "UTC",
        ),
      );

      expect(result.current.vm.data.trackGoing).toBe(`t(I18N.RACE_GOING.${going})`);
    });
  });

  it("formats raceTime with non-UTC timezone", () => {
    const { result } = renderHook(() => useRaceDetailsCardVM(baseRace, meeting, "en-GB", "Europe/London"));

    expect(result.current.vm.data.raceTime).toBe("16:00");
  });

  it("formats raceTime with en-US locale", () => {
    const { result } = renderHook(() => useRaceDetailsCardVM(baseRace, meeting, "en-US", "UTC"));

    expect(result.current.vm.data.raceTime).toBe("15:00");
  });

  it("emits subscribe for horse races", () => {
    const { result } = renderHook(() => useRaceDetailsCardVM(baseRace, meeting, "en-GB", "Europe/London"));

    result.current.vm.events.onSubscribe(subscribePayload);

    expect(emit).toHaveBeenCalledWith("@@UI/RACE_DETAILS_CARD_SUBSCRIBE", { raceURN: baseRace.raceUrn });
  });

  it("ignores subscribe for greyhound races", () => {
    const greyhoundRace = {
      ...baseRace,
      isHorseRacing: false,
    };

    const { result } = renderHook(() => useRaceDetailsCardVM(greyhoundRace, meeting, "en-GB", "Europe/London"));

    result.current.vm.events.onSubscribe({
      raceUrn: greyhoundRace.raceUrn,
      isHorseRacing: greyhoundRace.isHorseRacing,
    });

    expect(emit).not.toHaveBeenCalled();
  });

  it("emits unsubscribe events", () => {
    const { result } = renderHook(() => useRaceDetailsCardVM(baseRace, meeting, "en-GB", "Europe/London"));

    result.current.vm.events.onUnsubscribe(baseRace.raceUrn);

    expect(emit).toHaveBeenCalledWith("@@UI/RACE_DETAILS_CARD_UNSUBSCRIBE", { raceURN: baseRace.raceUrn });
  });
});
