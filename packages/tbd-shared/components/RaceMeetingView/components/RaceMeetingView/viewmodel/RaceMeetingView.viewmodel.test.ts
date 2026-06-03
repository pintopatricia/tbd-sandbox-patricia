import { renderHook } from "@testing-library/react";
import { getEventRegistry } from "eventemitter3-singleton";
import { useRaceMeetingViewAppContextQuery, useRaceMeetingViewQuery } from "../model/RaceMeetingView.graphql";
import { useRaceMeetingViewVM } from "./RaceMeetingView.viewmodel";

jest.mock("eventemitter3-singleton", () => {
  const emit = jest.fn();

  return {
    getEventRegistry: jest.fn(() => ({
      emit,
    })),
  };
});

jest.mock("../model/RaceMeetingView.graphql", () => ({
  useRaceMeetingViewAppContextQuery: jest.fn(),
  useRaceMeetingViewQuery: jest.fn(),
}));

jest.mock("../../../../../helpers/i18n", () => ({
  i18n: ({ key }: { key: string }) => `t(${key})`,
}));

const mockedUseRaceMeetingViewAppContextQuery = jest.mocked(useRaceMeetingViewAppContextQuery);
const mockedUseRaceMeetingViewQuery = jest.mocked(useRaceMeetingViewQuery);
const emit = getEventRegistry().emit as jest.Mock;

const VIEW_URN = "ppb:tbd:view:raceMeeting:7|12345.1500";
const VIEW_URN_ALT = "ppb:tbd:view:raceMeeting:7|12345.1600";
const RACE_URN = "ppb:race:12345.1500";
const ALT_RACE_URN = "ppb:race:12345.1600";

function mockAppContext(options: {
  loading?: boolean;
  locale?: string | undefined;
  timezone?: string | undefined;
  brandSettings?: Array<{ name: string; isActive: boolean }>;
} = {}) {
  const { loading = false, brandSettings = [] } = options;
  const localeCodeBcp47 = Object.prototype.hasOwnProperty.call(options, "locale") ? options.locale : "en-GB";
  const timezone = Object.prototype.hasOwnProperty.call(options, "timezone") ? options.timezone : "Europe/London";

  mockedUseRaceMeetingViewAppContextQuery.mockReturnValue({
    loading,
    data: {
      appContext: {
        userdetails: {
          localeCodeBcp47,
          timezone,
        },
        brandSettings,
      },
    },
  } as unknown as ReturnType<typeof useRaceMeetingViewAppContextQuery>);
}

function mockViewQuery(
  view: unknown,
  {
    loading = false,
    canRenderHeader = true,
    refresh = jest.fn(),
  }: {
    loading?: boolean;
    canRenderHeader?: boolean;
    refresh?: jest.Mock;
  } = {},
) {
  mockedUseRaceMeetingViewQuery.mockReturnValue({
    loading,
    canRenderHeader,
    refresh,
    data: { view },
  } as unknown as ReturnType<typeof useRaceMeetingViewQuery>);

  return refresh;
}

function makeRaceNavigationItem(overrides: Record<string, unknown> = {}) {
  const { race: nestedRace, viewLink, promotion, ...raceOverrides } = overrides as {
    race?: Record<string, unknown>;
    viewLink?: Record<string, unknown>;
    promotion?: Record<string, unknown> | null;
  };

  return {
    race: {
      raceId: "12345",
      urn: RACE_URN,
      name: "Race 1",
      startTime: "2026-04-23T15:00:00Z",
      verdict: null,
      broadcasts: null,
      primaryMarket: null,
      raceKind: {
        __typename: "HorseRaceKind",
        runners: [],
        details: {
          numberOfRunners: 8,
          status: "DORMANT",
          resultType: null,
          raceClass: null,
          going: null,
          title: null,
        },
      },
      availableToSubscribe: null,
      ...raceOverrides,
      ...nestedRace,
    },
    viewLink: {
      viewUrn: VIEW_URN,
      viewUrl: "horse-racing/example",
      ...viewLink,
    },
    promotion: promotion ?? null,
  };
}

function makeSiblingRaceMeetingView(overrides: Record<string, unknown> = {}) {
  return {
    urn: VIEW_URN_ALT,
    url: "horse-racing/sibling-example",
    meeting: {
      urn: "ppb:meeting:54321",
      name: "Kempton",
      venue: "Kempton",
      country: "GB",
      countryFlag: {
        vector: "vector-flag",
        small: "small-flag",
      },
    },
    ...overrides,
  };
}

function makeView(races: unknown[] = [], siblings: unknown[] = [], overrides: Record<string, unknown> = {}) {
  return {
    urn: VIEW_URN,
    title: "Meeting",
    meeting: {
      urn: "ppb:meeting:12345",
      name: "Ascot",
      venue: "Ascot",
      country: "GB",
      date: "2026-04-23",
      countryFlag: null,
      sport: { name: "Horse Racing" },
    },
    races,
    siblingRaceMeetingViews: siblings,
    items: {
      selectedRace: { race: { urn: RACE_URN } },
      edges: [],
      pageInfo: null,
    },
    ...overrides,
  };
}

function getFirstRace() {
  const { result } = renderHook(() => useRaceMeetingViewVM(VIEW_URN));
  const data = result.current.vm.data;

  expect(data).not.toBeNull();

  if (data === null) {
    throw new Error("Expected race meeting data to be present");
  }

  expect(data.races.length).toBeGreaterThan(0);

  return data.races[0];
}

describe("useRaceMeetingViewVM", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    emit.mockClear();
    mockAppContext();
  });

  describe("expert view assembly", () => {
    it("sorts runner ratings ascending by rating123 (1 = strongest tip first)", () => {
      const race = makeRaceNavigationItem({
        raceKind: {
          __typename: "HorseRaceKind",
          runners: [
            { horse: { name: "Charlie" }, rating123: 3, ratingStars: 1 },
            { horse: { name: "Alpha" }, rating123: 1, ratingStars: 5 },
            { horse: { name: "Bravo" }, rating123: 2, ratingStars: 3 },
          ],
          details: { numberOfRunners: 3, status: null, resultType: null },
        },
      });
      mockViewQuery(makeView([race]));

      const first = getFirstRace();

      expect(first.expertView).not.toBeNull();

      if (first.expertView === null) {
        throw new Error("Expected expert view to be present");
      }

      expect(first.expertView.runnerRatings.map((runner) => runner.name)).toEqual(["Alpha", "Bravo", "Charlie"]);
    });

    it("returns expertView === null when no runner has a rating123", () => {
      const race = makeRaceNavigationItem({
        raceKind: {
          __typename: "HorseRaceKind",
          runners: [
            { horse: { name: "Alpha" }, rating123: null, ratingStars: 5 },
            { horse: { name: "Bravo" }, rating123: null, ratingStars: 3 },
          ],
          details: { numberOfRunners: 2, status: null, resultType: null },
        },
      });
      mockViewQuery(makeView([race]));

      const first = getFirstRace();

      expect(first.expertView).toBeNull();
    });
  });

  describe("isRaceRunningStatus", () => {
    test.each(["UNDER_ORDERS", "OFF", "RESULT"])("returns true for %s", (status: string) => {
      const race = makeRaceNavigationItem({
        raceKind: {
          __typename: "HorseRaceKind",
          runners: [],
          details: { numberOfRunners: 1, status, resultType: null },
        },
      });
      mockViewQuery(makeView([race]));

      expect(getFirstRace().isRaceRunningStatus).toBe(true);
    });

    test.each(["DORMANT", "ABANDONED", "", null, undefined])(
      "returns false for %s",
      (status: string | null | undefined) => {
      const race = makeRaceNavigationItem({
        raceKind: {
          __typename: "HorseRaceKind",
          runners: [],
          details: { numberOfRunners: 1, status, resultType: null },
        },
      });
      mockViewQuery(makeView([race]));

      expect(getFirstRace().isRaceRunningStatus).toBe(false);
      },
    );
  });

  describe("raceStatusLabel (formatRaceStatus)", () => {
    it("returns null for DORMANT", () => {
      const race = makeRaceNavigationItem({
        raceKind: {
          __typename: "HorseRaceKind",
          runners: [],
          details: { numberOfRunners: 1, status: "DORMANT", resultType: null },
        },
      });
      mockViewQuery(makeView([race]));

      expect(getFirstRace().raceStatusLabel).toBeNull();
    });

    test.each([null, undefined])("returns null when status is %s", (status: null | undefined) => {
      const race = makeRaceNavigationItem({
        raceKind: {
          __typename: "HorseRaceKind",
          runners: [],
          details: { numberOfRunners: 1, status, resultType: null },
        },
      });
      mockViewQuery(makeView([race]));

      expect(getFirstRace().raceStatusLabel).toBeNull();
    });

    it("returns the translated status label for other values", () => {
      const race = makeRaceNavigationItem({
        raceKind: {
          __typename: "HorseRaceKind",
          runners: [],
          details: { numberOfRunners: 1, status: "OFF", resultType: null },
        },
      });
      mockViewQuery(makeView([race]));

      expect(getFirstRace().raceStatusLabel).toBe("t(I18N.RACE_STATUS.OFF)");
    });
  });

  describe("availableToSubscribe", () => {
    it("coerces missing values to false", () => {
      const race = makeRaceNavigationItem({ availableToSubscribe: null });
      mockViewQuery(makeView([race]));

      expect(getFirstRace().availableToSubscribe).toBe(false);
    });

    it("preserves true", () => {
      const race = makeRaceNavigationItem({ availableToSubscribe: true });
      mockViewQuery(makeView([race]));

      expect(getFirstRace().availableToSubscribe).toBe(true);
    });
  });

  describe("isHorseRacing", () => {
    it("returns true for horse races", () => {
      const race = makeRaceNavigationItem();
      mockViewQuery(makeView([race]));

      expect(getFirstRace().isHorseRacing).toBe(true);
    });

    it("returns false for greyhound races", () => {
      const race = makeRaceNavigationItem({
        raceKind: {
          __typename: "GreyhoundRaceKind",
          details: {
            numberOfRunners: 6,
            status: "DORMANT",
            resultType: null,
          },
        },
      });
      mockViewQuery(makeView([race]));

      expect(getFirstRace().isHorseRacing).toBe(false);
    });
  });

  describe("numberOfRunners", () => {
    it("reads from raceKind.details.numberOfRunners", () => {
      const race = makeRaceNavigationItem({
        raceKind: {
          __typename: "HorseRaceKind",
          runners: [],
          details: { numberOfRunners: 12, status: null, resultType: null },
        },
      });
      mockViewQuery(makeView([race]));

      expect(getFirstRace().numberOfRunners).toBe(12);
    });

    it("is null when raceKind is missing", () => {
      const race = makeRaceNavigationItem({ raceKind: null });
      mockViewQuery(makeView([race]));

      expect(getFirstRace().numberOfRunners).toBeNull();
    });
  });

  describe("useAppContext integration", () => {
    it("marks data as highlighted when the highlighted-header brand setting is active", () => {
      mockAppContext({
        brandSettings: [{ name: "HIGHLIGHTED_HEADER", isActive: true }],
      });
      mockViewQuery(makeView([makeRaceNavigationItem()]));

      const { result } = renderHook(() => useRaceMeetingViewVM(VIEW_URN));

      expect(result.current.vm.data?.isHighlighted).toBe(true);
    });

    test.each([
      { brandSettings: [] as Array<{ name: string; isActive: boolean }> },
      { brandSettings: [{ name: "HIGHLIGHTED_HEADER", isActive: false }] },
    ])(
      "leaves data.isHighlighted false when the setting is missing or inactive",
      ({ brandSettings }: { brandSettings: Array<{ name: string; isActive: boolean }> }) => {
      mockAppContext({ brandSettings });
      mockViewQuery(makeView([makeRaceNavigationItem()]));

      const { result } = renderHook(() => useRaceMeetingViewVM(VIEW_URN));

      expect(result.current.vm.data?.isHighlighted).toBe(false);
      },
    );

    it("propagates locale and timezone from the app context", () => {
      mockAppContext({ locale: "fr-FR", timezone: "Europe/Paris" });
      mockViewQuery(makeView([makeRaceNavigationItem()]));

      const { result } = renderHook(() => useRaceMeetingViewVM(VIEW_URN));

      expect(result.current.vm.data?.locale).toBe("fr-FR");
      expect(result.current.vm.data?.timezone).toBe("Europe/Paris");
    });

    test.each([
      { appContextLoading: true, queryLoading: false },
      { appContextLoading: false, queryLoading: true },
    ])(
      "combines app-context and query loading state",
      ({ appContextLoading, queryLoading }: { appContextLoading: boolean; queryLoading: boolean }) => {
      mockAppContext({ loading: appContextLoading });
      mockViewQuery(makeView([makeRaceNavigationItem()]), { loading: queryLoading });

      const { result } = renderHook(() => useRaceMeetingViewVM(VIEW_URN));

      expect(result.current.loading).toBe(true);
      },
    );
  });

  describe("data nullability", () => {
    it("returns vm.data as null when the view is undefined", () => {
      mockViewQuery(undefined);

      const { result } = renderHook(() => useRaceMeetingViewVM(VIEW_URN));

      expect(result.current.vm.data).toBeNull();
    });

    it("returns vm.data as null when locale is missing", () => {
      mockAppContext({ locale: undefined });
      mockViewQuery(makeView([makeRaceNavigationItem()]));

      const { result } = renderHook(() => useRaceMeetingViewVM(VIEW_URN));

      expect(result.current.vm.data).toBeNull();
    });

    it("returns vm.data as null when timezone is missing", () => {
      mockAppContext({ timezone: undefined });
      mockViewQuery(makeView([makeRaceNavigationItem()]));

      const { result } = renderHook(() => useRaceMeetingViewVM(VIEW_URN));

      expect(result.current.vm.data).toBeNull();
    });

    it("returns vm.data when view, locale, timezone, and meeting are present", () => {
      mockViewQuery(makeView([makeRaceNavigationItem()]));

      const { result } = renderHook(() => useRaceMeetingViewVM(VIEW_URN));

      expect(result.current.vm.data).not.toBeNull();
    });
  });

  describe("meeting data mapping", () => {
    it("maps meeting fields, selectedRaceUrn, and sportName", () => {
      const view = makeView([makeRaceNavigationItem()], [], {
        meeting: {
          urn: "ppb:meeting:12345",
          name: "Royal Ascot",
          venue: "Ascot Racecourse",
          country: "GB",
          date: "2026-04-23",
          countryFlag: null,
          sport: { name: "Horse Racing" },
        },
        items: {
          selectedRace: { race: { urn: ALT_RACE_URN } },
          edges: [],
          pageInfo: null,
        },
      });
      mockViewQuery(view);

      const { result } = renderHook(() => useRaceMeetingViewVM(VIEW_URN));
      const data = result.current.vm.data;

      expect(data?.meeting).toEqual({
        urn: "ppb:meeting:12345",
        name: "Royal Ascot",
        venue: "Ascot Racecourse",
        country: "GB",
        date: "2026-04-23",
        countryFlag: null,
      });
      expect(data?.selectedRaceUrn).toBe(ALT_RACE_URN);
      expect(data?.sportName).toBe("Horse Racing");
    });

    it("maps meeting countryFlag fields and preserves nullable subfields", () => {
      const view = makeView([makeRaceNavigationItem()], [], {
        meeting: {
          urn: "ppb:meeting:12345",
          name: "Royal Ascot",
          venue: "Ascot Racecourse",
          country: "GB",
          date: "2026-04-23",
          countryFlag: {
            vector: "vector-flag",
            small: null,
          },
          sport: { name: "Horse Racing" },
        },
      });
      mockViewQuery(view);

      const { result } = renderHook(() => useRaceMeetingViewVM(VIEW_URN));

      expect(result.current.vm.data?.meeting.countryFlag).toEqual({
        vector: "vector-flag",
        small: null,
      });
    });
  });

  describe("races mapping — additional fields", () => {
    it("maps closed state, broadcasts, and promotion for horse races", () => {
      const race = makeRaceNavigationItem({
        race: {
          raceId: "12345",
          urn: RACE_URN,
          name: "Race 1",
          startTime: "2026-04-23T15:00:00Z",
          verdict: null,
          broadcasts: {
            liveVideoUrl: "https://example.com/live",
            dataVizUrl: "https://example.com/dataviz",
          },
          primaryMarket: null,
          raceKind: {
            __typename: "HorseRaceKind",
            runners: [],
            details: {
              numberOfRunners: 8,
              status: "RESULT",
              resultType: "QUICK_RESULT",
              raceClass: 3,
              going: "SOFT",
              title: "Handicap Stakes",
            },
          },
          availableToSubscribe: true,
        },
        promotion: { signposting: "Boosted odds" },
      });
      mockViewQuery(makeView([race]));

      const first = getFirstRace();

      expect(first.isRaceClosed).toBe(true);
      expect(first.broadcasts).toEqual({
        liveVideoUrl: "https://example.com/live",
        dataVizUrl: "https://example.com/dataviz",
      });
      expect(first.promotion).toBe("Boosted odds");
    });

    it("defaults broadcasts and promotion to null and keeps isRaceClosed false without a resultType", () => {
      const race = makeRaceNavigationItem({
        race: {
          raceId: "12345",
          urn: RACE_URN,
          name: "Race 1",
          startTime: "2026-04-23T15:00:00Z",
          verdict: null,
          broadcasts: null,
          primaryMarket: null,
          raceKind: {
            __typename: "HorseRaceKind",
            runners: [],
            details: {
              numberOfRunners: 8,
              status: "DORMANT",
              resultType: null,
              raceClass: 2,
              going: "GOOD",
              title: "Novice Stakes",
            },
          },
          availableToSubscribe: false,
        },
      });
      mockViewQuery(makeView([race]));

      const first = getFirstRace();

      expect(first.isRaceClosed).toBe(false);
      expect(first.broadcasts).toBeNull();
      expect(first.promotion).toBeNull();
    });

    it("maps greyhound races with horse-only fields cleared", () => {
      const race = makeRaceNavigationItem({
        race: {
          raceId: "54321",
          urn: ALT_RACE_URN,
          name: "Greyhound Race 1",
          startTime: "2026-04-23T16:00:00Z",
          verdict: null,
          broadcasts: null,
          primaryMarket: null,
          raceKind: {
            __typename: "GreyhoundRaceKind",
            details: {
              numberOfRunners: 6,
            },
          },
          availableToSubscribe: null,
        },
      });
      mockViewQuery(makeView([race]));

      const first = getFirstRace();

      expect(first.raceClass).toBeNull();
      expect(first.going).toBeNull();
      expect(first.raceDetailsTitle).toBeNull();
      expect(first.resultType).toBeNull();
      expect(first.raceStatus).toBeNull();
      expect(first.isRaceClosed).toBe(false);
    });

    it("filters null entries from view.races", () => {
      mockViewQuery(makeView([null, makeRaceNavigationItem(), null]));

      const { result } = renderHook(() => useRaceMeetingViewVM(VIEW_URN));

      expect(result.current.vm.data?.races.length).toBe(1);
    });
  });

  describe("sibling meetings assembly", () => {
    it("returns empty sibling collections when siblingRaceMeetingViews is empty", () => {
      mockViewQuery(makeView([makeRaceNavigationItem()], []));

      const { result } = renderHook(() => useRaceMeetingViewVM(VIEW_URN));

      expect(result.current.vm.data?.siblingMeetings).toEqual([]);
      expect(result.current.vm.data?.siblingMeetingData).toEqual([]);
    });

    it("filters null siblings and maps sibling meeting shapes", () => {
      const sibling = makeSiblingRaceMeetingView();
      mockViewQuery(makeView([makeRaceNavigationItem()], [null, sibling]));

      const { result } = renderHook(() => useRaceMeetingViewVM(VIEW_URN));
      const data = result.current.vm.data;

      expect(data?.siblingMeetings).toEqual([
        {
          urn: VIEW_URN_ALT,
          name: "Kempton",
          venue: "Kempton",
          country: "GB",
          countryFlagUrl: "small-flag",
          viewLink: {
            viewUrn: VIEW_URN_ALT,
            viewUrl: "horse-racing/sibling-example",
          },
        },
      ]);
      expect(data?.siblingMeetingData).toEqual([
        {
          meetingUrn: "ppb:meeting:54321",
          venue: "Kempton",
          countryFlag: {
            vector: "vector-flag",
            small: "small-flag",
          },
          viewLink: {
            viewUrn: VIEW_URN_ALT,
            viewUrl: "horse-racing/sibling-example",
          },
        },
      ]);
    });

    it("falls back countryFlagUrl to null when sibling countryFlag is missing", () => {
      const sibling = makeSiblingRaceMeetingView({
        meeting: {
          urn: "ppb:meeting:54321",
          name: "Kempton",
          venue: "Kempton",
          country: "GB",
          countryFlag: null,
        },
      });
      mockViewQuery(makeView([makeRaceNavigationItem()], [sibling]));

      const { result } = renderHook(() => useRaceMeetingViewVM(VIEW_URN));

      expect(result.current.vm.data?.siblingMeetings[0].countryFlagUrl).toBeNull();
    });
  });

  describe("event emissions", () => {
    it("emits onMount with the loaded urn", () => {
      mockViewQuery(makeView([makeRaceNavigationItem()]));

      const { result } = renderHook(() => useRaceMeetingViewVM(VIEW_URN));

      result.current.vm.events.onMount(VIEW_URN);

      expect(emit).toHaveBeenCalledWith("@@UI/RACE_MEETING_VIEW_LOADED", { urn: VIEW_URN });
    });

    it("emits onRaceSelected with the outer view urn", () => {
      mockViewQuery(makeView([makeRaceNavigationItem()]));

      const { result } = renderHook(() => useRaceMeetingViewVM(VIEW_URN));
      const viewLink = { viewUrn: VIEW_URN_ALT, viewUrl: "horse-racing/race-2" };

      result.current.vm.events.onRaceSelected(ALT_RACE_URN, viewLink);

      expect(emit).toHaveBeenCalledWith("@@UI/RACE_MEETING_VIEW_RACE_SELECTED", {
        urn: VIEW_URN,
        viewLink,
      });
    });

    it("emits onSiblingSelected with the sibling urn and viewLink", () => {
      mockViewQuery(makeView([makeRaceNavigationItem()]));

      const { result } = renderHook(() => useRaceMeetingViewVM(VIEW_URN));
      const viewLink = { viewUrn: VIEW_URN_ALT, viewUrl: "horse-racing/sibling-example" };

      result.current.vm.events.onSiblingSelected(VIEW_URN_ALT, viewLink);

      expect(emit).toHaveBeenCalledWith("@@UI/RACE_MEETING_VIEW_SIBLING_SELECTED", {
        urn: VIEW_URN_ALT,
        viewLink,
      });
    });

    it("emits onCardClicked with the card payload", () => {
      mockViewQuery(makeView([makeRaceNavigationItem()]));

      const { result } = renderHook(() => useRaceMeetingViewVM(VIEW_URN));

      result.current.vm.events.onCardClicked(VIEW_URN, "ppb:card:123");

      expect(emit).toHaveBeenCalledWith("@@UI/RACE_MEETING_VIEW_CARD_CLICKED", {
        viewUrn: VIEW_URN,
        cardUrn: "ppb:card:123",
      });
    });

    it("emits fetchBars with both bars enabled", () => {
      mockViewQuery(makeView([makeRaceNavigationItem()]));

      const { result } = renderHook(() => useRaceMeetingViewVM(VIEW_URN));

      result.current.vm.events.fetchBars(VIEW_URN);

      expect(emit).toHaveBeenCalledWith("@@UI/FETCH_BARS", {
        bottomBar: true,
        leftSidebar: true,
        viewUrn: VIEW_URN,
      });
    });
  });
});
