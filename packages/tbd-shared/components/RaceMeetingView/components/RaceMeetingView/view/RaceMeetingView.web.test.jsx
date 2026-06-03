import { act, render } from "@testing-library/react";
import RaceDetailsCard from "../../RaceDetailsCard/view/RaceDetailsCard.web";
import LiveVideoCard from "../../LiveVideoCard/view/LiveVideoCard.web";
import RaceItemsContent from "../../RaceItemsContent/view/RaceItemsContent.web";
import RaceSwitcherCard from "../../RaceSwitcherCard/view/RaceSwitcherCard.web";
import RaceViewLinksCard from "../../RaceViewLinksCard/view/RaceViewLinksCard.web";
import { useRaceMeetingViewVM } from "../viewmodel/RaceMeetingView.viewmodel";
import RaceMeetingView from "./RaceMeetingView.web";
import SELECTORS from "./RaceMeetingView.selectors";
import styles from "./RaceMeetingView.web.module.css";

jest.mock("../viewmodel/RaceMeetingView.viewmodel", () => ({
  useRaceMeetingViewVM: jest.fn(),
}));

jest.mock("../../RaceSwitcherCard/view/RaceSwitcherCard.web", () =>
  jest.fn((props) => <race-switcher-mock {...props} />),
);
jest.mock("../../RaceViewLinksCard/view/RaceViewLinksCard.web", () =>
  jest.fn((props) => <race-links-mock {...props} />),
);
jest.mock("../../RaceDetailsCard/view/RaceDetailsCard.web", () => jest.fn((props) => <race-details-mock {...props} />));
jest.mock("../../LiveVideoCard/view/LiveVideoCard.web", () => jest.fn((props) => <live-video-mock {...props} />));
jest.mock("../../RaceItemsContent/view/RaceItemsContent.web", () => jest.fn((props) => <race-items-mock {...props} />));
jest.mock("./RaceMeetingViewPlaceholder.web", () =>
  jest.fn(() => <placeholder-mock data-testid="race-meeting-view-placeholder" />),
);

const VIEW_URN = "ppb:tbd:view:raceMeeting:7|12345.1500";
const VIEW_URN_ALT = "ppb:tbd:view:raceMeeting:7|12345.1600";
const VIEW_URN_SIBLING = "ppb:tbd:view:raceMeeting:7|54321.1500";
const RACE_URN_A = "ppb:race:12345.1500";
const RACE_URN_B = "ppb:race:12345.1600";
const RACE_URN_SIBLING = "ppb:race:54321.1500";

const meeting = {
  urn: "ppb:meeting:12345",
  name: "Ascot",
  venue: "Ascot",
  country: "GB",
  date: "2026-04-23",
  countryFlag: null,
};

const siblingViewLink = {
  viewUrn: VIEW_URN_SIBLING,
  viewUrl: "horse-racing/kempton",
};

const raceA = {
  raceId: "12345",
  raceUrn: RACE_URN_A,
  isHorseRacing: true,
  raceName: "Race 1",
  startTime: "2026-04-23T15:00:00Z",
  isRaceClosed: false,
  resultType: null,
  raceStatus: "OFF",
  raceStatusLabel: "Off",
  numberOfRunners: 8,
  raceClass: 3,
  going: "SOFT",
  raceDetailsTitle: "Handicap Stakes",
  isRaceRunningStatus: true,
  viewLink: {
    viewUrn: VIEW_URN,
    viewUrl: "horse-racing/example",
  },
  promotion: null,
  broadcasts: {
    liveVideoUrl: "https://example.com/live",
    dataVizUrl: null,
  },
  expertView: null,
  availableToSubscribe: false,
};

const raceB = {
  ...raceA,
  raceId: "12346",
  raceUrn: RACE_URN_B,
  raceName: "Race 2",
  resultType: "QUICK_RESULT",
  isRaceClosed: true,
  viewLink: {
    viewUrn: VIEW_URN_ALT,
    viewUrl: "horse-racing/example-race-2",
  },
};

const siblingRace = {
  ...raceA,
  raceId: "54321",
  raceUrn: RACE_URN_SIBLING,
  raceName: "Kempton Race 1",
  viewLink: siblingViewLink,
};

const initialItems = {
  selectedRace: {
    race: { urn: RACE_URN_A },
  },
  edges: [],
  pageInfo: null,
};

const siblingInitialItems = {
  selectedRace: {
    race: { urn: RACE_URN_SIBLING },
  },
  edges: [],
  pageInfo: null,
};

const siblingMeetingData = [
  {
    meetingUrn: "ppb:meeting:54321",
    venue: "Kempton",
    countryFlag: null,
    viewLink: siblingViewLink,
  },
];

const baseData = {
  urn: VIEW_URN,
  title: "Meeting",
  meeting,
  sportName: "Horse Racing",
  locale: "en-GB",
  timezone: "UTC",
  races: [raceA, raceB],
  selectedRaceUrn: RACE_URN_A,
  siblingMeetings: [],
  siblingMeetingData: [],
  initialItems,
  isHighlighted: false,
};

const createEvents = () => ({
  onMount: jest.fn(),
  onRaceSelected: jest.fn(),
  onSiblingSelected: jest.fn(),
  onCardClicked: jest.fn(),
  fetchBars: jest.fn(),
});

const buildData = (overrides = {}) => ({
  ...baseData,
  ...overrides,
});

const buildVM = ({
  data = buildData(),
  loading = false,
  canRenderHeader = true,
  events = createEvents(),
  refresh = jest.fn(),
} = {}) => ({
  loading,
  canRenderHeader,
  refresh,
  vm: {
    data,
    events,
  },
});

const getLatestProps = (mockFn) => mockFn.mock.calls[mockFn.mock.calls.length - 1]?.[0];
const hasMockCall = (mockFn, matcher) =>
  mockFn.mock.calls.some(([props]) => expect.objectContaining(matcher).asymmetricMatch(props));

const renderComponent = ({
  dataOverrides = {},
  data,
  loading = false,
  canRenderHeader = true,
  urn = VIEW_URN,
  refresh = jest.fn(),
  viewModels,
} = {}) => {
  const events = createEvents();

  useRaceMeetingViewVM.mockImplementation((activeViewUrn) => {
    if (viewModels) {
      const vmConfig = viewModels[activeViewUrn] ?? viewModels.default;
      return buildVM({
        data: vmConfig?.data ?? buildData(vmConfig?.dataOverrides ?? {}),
        loading: vmConfig?.loading ?? false,
        canRenderHeader: vmConfig?.canRenderHeader ?? true,
        events,
        refresh,
      });
    }

    return buildVM({
      data: data ?? (data === null ? null : buildData(dataOverrides)),
      loading,
      canRenderHeader,
      events,
      refresh,
    });
  });

  const view = render(<RaceMeetingView urn={urn} />);

  return {
    ...view,
    events,
    refresh,
    rerenderWithUrn: (nextUrn) => {
      view.rerender(<RaceMeetingView urn={nextUrn} />);
    },
  };
};

describe("RaceMeetingView.web", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the placeholder while data is missing and loading", () => {
    const { getByTestId } = renderComponent({ data: null, loading: true });

    expect(getByTestId(SELECTORS.PLACEHOLDER)).toBeDefined();
    expect(RaceSwitcherCard).not.toHaveBeenCalled();
    expect(RaceViewLinksCard).not.toHaveBeenCalled();
    expect(RaceDetailsCard).not.toHaveBeenCalled();
    expect(LiveVideoCard).not.toHaveBeenCalled();
    expect(RaceItemsContent).not.toHaveBeenCalled();
  });

  it("renders nothing when data is missing and loading is false", () => {
    const { container } = renderComponent({ data: null, loading: false });

    expect(container.firstChild).toBeNull();
    expect(RaceSwitcherCard).not.toHaveBeenCalled();
    expect(RaceViewLinksCard).not.toHaveBeenCalled();
  });

  it("renders the meeting header and delegates the expected props to child cards", () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId(SELECTORS.TEST_ID)).toBeDefined();
    expect(RaceSwitcherCard).toHaveBeenCalledWith(
      expect.objectContaining({
        viewUrn: VIEW_URN,
        meeting,
        siblings: [],
        locale: "en-GB",
        timezone: "UTC",
        onMeetingSelected: expect.any(Function),
      }),
      undefined,
    );
    expect(RaceViewLinksCard).toHaveBeenCalledWith(
      expect.objectContaining({
        viewUrn: VIEW_URN,
        selectedRaceUrn: RACE_URN_A,
        races: [raceA, raceB],
        locale: "en-GB",
        timezone: "UTC",
        onRaceSelected: expect.any(Function),
      }),
      undefined,
    );
  });

  it("applies highlighted header styles when the meeting is highlighted", () => {
    const { getByTestId, container } = renderComponent({ dataOverrides: { isHighlighted: true } });

    expect(getByTestId(SELECTORS.TEST_ID).className).toContain(styles.highlighted);
    expect(container.querySelector(`.${styles.headerHighlighted}`)).not.toBeNull();
  });

  it("omits highlighted classes when the meeting is not highlighted", () => {
    const { getByTestId, container } = renderComponent({ dataOverrides: { isHighlighted: false } });

    expect(getByTestId(SELECTORS.TEST_ID).className).not.toContain(styles.highlighted);
    expect(container.querySelector(`.${styles.headerHighlighted}`)).toBeNull();
  });

  it("shows the fading transition while header data cannot render yet", () => {
    const { getByTestId } = renderComponent({ loading: true, canRenderHeader: false });

    expect(getByTestId(SELECTORS.TEST_ID).className).toContain(styles.transitioning);
  });

  it("clears the fading transition when the header can render", () => {
    const { getByTestId } = renderComponent({ loading: true, canRenderHeader: true });

    expect(getByTestId(SELECTORS.TEST_ID).className).not.toContain(styles.transitioning);
  });

  it("renders RaceDetailsCard for the selected race", () => {
    renderComponent();

    expect(RaceDetailsCard).toHaveBeenCalledWith(
      expect.objectContaining({
        race: raceA,
        meeting,
        locale: "en-GB",
        timezone: "UTC",
        isHighlighted: false,
      }),
      undefined,
    );
  });

  it("skips RaceDetailsCard when selectedRaceUrn matches no race", () => {
    renderComponent({ dataOverrides: { selectedRaceUrn: "ppb:race:missing" } });

    expect(RaceDetailsCard).not.toHaveBeenCalled();
  });

  it("renders LiveVideoCard when the selected race is not closed", () => {
    renderComponent();

    expect(LiveVideoCard).toHaveBeenCalledWith(
      expect.objectContaining({
        race: raceA,
        isHighlighted: false,
      }),
      undefined,
    );
  });

  it("skips LiveVideoCard when the selected race is closed", () => {
    renderComponent({ dataOverrides: { selectedRaceUrn: RACE_URN_B } });

    expect(LiveVideoCard).not.toHaveBeenCalled();
  });

  it("uses the user-selected race for RaceDetailsCard and RaceItemsContent", () => {
    renderComponent();

    act(() => {
      getLatestProps(RaceViewLinksCard).onRaceSelected(RACE_URN_B, raceB.viewLink);
    });

    expect(hasMockCall(RaceDetailsCard, { race: raceB })).toBe(true);
    expect(hasMockCall(RaceItemsContent, { raceUrn: RACE_URN_B })).toBe(true);
  });

  it("defers the items query after the user selects a race whose initial items do not match", () => {
    renderComponent();

    act(() => {
      getLatestProps(RaceViewLinksCard).onRaceSelected(RACE_URN_B, raceB.viewLink);
    });

    expect(RaceItemsContent).toHaveBeenLastCalledWith(
      expect.objectContaining({
        viewUrn: VIEW_URN_ALT,
        raceUrn: RACE_URN_B,
        initialItems: undefined,
        deferQuery: true,
      }),
      undefined,
    );
  });

  it("uses the initial items without deferring when the selected race matches the preloaded items", () => {
    renderComponent();

    expect(RaceItemsContent).toHaveBeenLastCalledWith(
      expect.objectContaining({
        viewUrn: VIEW_URN,
        raceUrn: RACE_URN_A,
        initialItems,
        deferQuery: false,
      }),
      undefined,
    );
  });

  it("resets the user-selected race when the incoming urn prop changes", () => {
    const nextData = buildData({
      urn: VIEW_URN_SIBLING,
      races: [siblingRace],
      selectedRaceUrn: RACE_URN_SIBLING,
      initialItems: siblingInitialItems,
    });
    const { rerenderWithUrn } = renderComponent({
      viewModels: {
        [VIEW_URN]: { data: buildData() },
        [VIEW_URN_SIBLING]: { data: nextData },
      },
    });

    act(() => {
      getLatestProps(RaceViewLinksCard).onRaceSelected(RACE_URN_B, raceB.viewLink);
    });

    expect(getLatestProps(RaceViewLinksCard).selectedRaceUrn).toBe(RACE_URN_B);

    act(() => {
      rerenderWithUrn(VIEW_URN_SIBLING);
    });

    expect(getLatestProps(RaceViewLinksCard).selectedRaceUrn).toBe(RACE_URN_SIBLING);
  });

  it("fires onMount and fetchBars once per mounted data urn", () => {
    const { events, rerenderWithUrn } = renderComponent({
      viewModels: {
        [VIEW_URN]: { data: buildData() },
        [VIEW_URN_SIBLING]: {
          data: buildData({
            urn: VIEW_URN_SIBLING,
            selectedRaceUrn: RACE_URN_SIBLING,
            races: [siblingRace],
            initialItems: siblingInitialItems,
          }),
        },
      },
    });

    expect(events.onMount).toHaveBeenCalledTimes(1);
    expect(events.fetchBars).toHaveBeenCalledTimes(1);
    expect(events.onMount).toHaveBeenLastCalledWith(VIEW_URN);
    expect(events.fetchBars).toHaveBeenLastCalledWith(VIEW_URN);

    act(() => {
      rerenderWithUrn(VIEW_URN);
    });

    expect(events.onMount).toHaveBeenCalledTimes(1);
    expect(events.fetchBars).toHaveBeenCalledTimes(1);

    act(() => {
      rerenderWithUrn(VIEW_URN_SIBLING);
    });

    expect(events.onMount).toHaveBeenCalledTimes(2);
    expect(events.fetchBars).toHaveBeenCalledTimes(2);
    expect(events.onMount).toHaveBeenLastCalledWith(VIEW_URN_SIBLING);
    expect(events.fetchBars).toHaveBeenLastCalledWith(VIEW_URN_SIBLING);
  });

  it("emits sibling selection events and switches the active meeting", () => {
    const { events } = renderComponent({
      viewModels: {
        [VIEW_URN]: { data: buildData({ siblingMeetingData }) },
        [VIEW_URN_SIBLING]: {
          data: buildData({
            urn: VIEW_URN_SIBLING,
            selectedRaceUrn: RACE_URN_SIBLING,
            races: [siblingRace],
            initialItems: siblingInitialItems,
          }),
        },
      },
    });

    act(() => {
      getLatestProps(RaceSwitcherCard).onMeetingSelected(siblingViewLink);
    });

    expect(events.onSiblingSelected).toHaveBeenCalledWith(VIEW_URN_SIBLING, siblingViewLink);
    expect(getLatestProps(RaceViewLinksCard).viewUrn).toBe(VIEW_URN_SIBLING);
  });

  it("emits race selection events when RaceViewLinksCard changes race", () => {
    const { events } = renderComponent();

    act(() => {
      getLatestProps(RaceViewLinksCard).onRaceSelected(RACE_URN_B, raceB.viewLink);
    });

    expect(events.onRaceSelected).toHaveBeenCalledWith(RACE_URN_B, raceB.viewLink);
  });
});
