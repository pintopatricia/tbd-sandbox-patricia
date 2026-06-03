import { act, fireEvent, render } from "@testing-library/react-native";
import { NativeModules, Platform, RefreshControl, ScrollView } from "react-native";
import RaceDetailsCard from "../../RaceDetailsCard/view/RaceDetailsCard.native";
import LiveVideoCard from "../../LiveVideoCard/view/LiveVideoCard.native";
import RaceItemsContent from "../../RaceItemsContent/view/RaceItemsContent.native";
import RaceSwitcherCard from "../../RaceSwitcherCard/view/RaceSwitcherCard.native";
import RaceViewLinksCard from "../../RaceViewLinksCard/view/RaceViewLinksCard.native";
import { useRefreshEnabled } from "../../../../../hooks/useRefreshEnabled.native";
import { useRaceMeetingViewVM } from "../viewmodel/RaceMeetingView.viewmodel";
import RaceMeetingView from "./RaceMeetingView.native";
import SELECTORS from "./RaceMeetingView.selectors";
import styles from "./RaceMeetingView.native.styles";

jest.mock("../viewmodel/RaceMeetingView.viewmodel", () => ({
  useRaceMeetingViewVM: jest.fn(),
}));

jest.mock("../../../../../hooks/useRefreshEnabled.native", () => ({
  useRefreshEnabled: jest.fn(() => ({ refreshEnabled: true })),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {
    NeutralsBackgroundElevation4: "NeutralsBackgroundElevation4",
  },
  tokens: {
    PullRefreshIconColour: "#FFB80C",
    PageHighlightedSectionBackgroundColor: "highlighted-background",
    PageVerticalGapPrimary: { gap: 16 },
  },
}));

jest.mock("react-native", () => {
  const Platform = {
    OS: "ios",
    select: (values) => values[Platform.OS] ?? values.default,
  };

  return {
    NativeModules: {
      LaunchArgumentsModule: {
        getLaunchArguments: jest.fn(() => Promise.resolve({ pullToRefresh: true })),
      },
    },
    Platform,
    RefreshControl: jest.fn((props) => <refresh-control-mock {...props} />),
    ScrollView: jest.fn(({ children, ...props }) => <scroll-view-mock {...props}>{children}</scroll-view-mock>),
    StyleSheet: {
      create: (styles) => styles,
      flatten: (style) => {
        if (Array.isArray(style)) {
          return style.filter(Boolean).reduce((accumulator, item) => ({ ...accumulator, ...item }), {});
        }

        return style ?? {};
      },
    },
    View: jest.fn(({ children, ...props }) => <view-mock {...props}>{children}</view-mock>),
  };
});

jest.mock("../../RaceSwitcherCard/view/RaceSwitcherCard.native", () =>
  jest.fn((props) => <race-switcher-mock {...props} />),
);
jest.mock("../../RaceViewLinksCard/view/RaceViewLinksCard.native", () =>
  jest.fn((props) => <race-links-mock {...props} />),
);
jest.mock("../../RaceDetailsCard/view/RaceDetailsCard.native", () =>
  jest.fn((props) => <race-details-mock {...props} />),
);
jest.mock("../../LiveVideoCard/view/LiveVideoCard.native", () => jest.fn((props) => <live-video-mock {...props} />));
jest.mock("../../RaceItemsContent/view/RaceItemsContent.native", () =>
  jest.fn((props) => <race-items-mock {...props} />),
);
jest.mock("./RaceMeetingViewPlaceholder.native", () =>
  jest.fn(() => <placeholder-mock testID="race-meeting-view-placeholder" />),
);

jest.mock("./RaceMeetingView.native.styles", () => ({
  wrapper: { name: "wrapper" },
  container: { name: "container" },
  stickyOverlay: { name: "stickyOverlay" },
  headerHighlighted: { name: "headerHighlighted" },
  offsetContainer: { name: "offsetContainer" },
  placeholder: { name: "placeholder" },
}));

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
  events = createEvents(),
  refresh = jest.fn().mockResolvedValue(undefined),
} = {}) => ({
  loading,
  refresh,
  vm: {
    data,
    events,
  },
});

const getLatestProps = (mockFn) => mockFn.mock.calls[mockFn.mock.calls.length - 1]?.[0];
const hasMockCall = (mockFn, matcher) =>
  mockFn.mock.calls.some(([props]) => expect.objectContaining(matcher).asymmetricMatch(props));
const hasStyledNode = (root, styleToFind) =>
  root.findAll((node) => {
    const { style } = node.props;

    if (!style) {
      return false;
    }

    if (Array.isArray(style)) {
      return style.includes(styleToFind);
    }

    return style === styleToFind;
  }).length > 0;

const createDeferred = () => {
  let resolve;

  const promise = new Promise((resolvePromise) => {
    resolve = resolvePromise;
  });

  return { promise, resolve };
};

const renderComponent = async ({
  dataOverrides = {},
  data,
  loading = false,
  urn = VIEW_URN,
  refresh = jest.fn().mockResolvedValue(undefined),
  viewModels,
} = {}) => {
  const events = createEvents();

  useRaceMeetingViewVM.mockImplementation((activeViewUrn) => {
    if (viewModels) {
      const vmConfig = viewModels[activeViewUrn] ?? viewModels.default;
      return buildVM({
        data: vmConfig?.data ?? buildData(vmConfig?.dataOverrides ?? {}),
        loading: vmConfig?.loading ?? false,
        events,
        refresh,
      });
    }

    return buildVM({
      data: data ?? (data === null ? null : buildData(dataOverrides)),
      loading,
      events,
      refresh,
    });
  });

  const view = render(<RaceMeetingView urn={urn} />);

  await act(async () => {
    await Promise.resolve();
  });

  return {
    ...view,
    events,
    refresh,
    rerenderWithUrn: async (nextUrn) => {
      await act(async () => {
        view.rerender(<RaceMeetingView urn={nextUrn} />);
        await Promise.resolve();
      });
    },
  };
};

describe("RaceMeetingView.native", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Platform.OS = "ios";
    NativeModules.LaunchArgumentsModule.getLaunchArguments.mockResolvedValue({ pullToRefresh: true });
    useRefreshEnabled.mockReturnValue({ refreshEnabled: true });
  });

  it("renders the placeholder while data is missing and loading", async () => {
    const { getByTestId } = await renderComponent({ data: null, loading: true });

    expect(getByTestId(SELECTORS.PLACEHOLDER)).toBeDefined();
    expect(RaceSwitcherCard).not.toHaveBeenCalled();
    expect(RaceViewLinksCard).not.toHaveBeenCalled();
    expect(RaceItemsContent).not.toHaveBeenCalled();
  });

  it("renders nothing when data is missing and loading is false", async () => {
    const { queryByTestId } = await renderComponent({ data: null, loading: false });

    expect(queryByTestId(SELECTORS.TEST_ID)).toBeNull();
    expect(RaceSwitcherCard).not.toHaveBeenCalled();
  });

  it("renders the root ScrollView with the expected identifiers and content", async () => {
    const { getByTestId } = await renderComponent();
    const scrollView = getByTestId(SELECTORS.TEST_ID);

    expect(scrollView).toBeDefined();
    expect(RaceSwitcherCard).toHaveBeenCalled();
    expect(RaceItemsContent).toHaveBeenCalled();
    expect(ScrollView).toHaveBeenCalledWith(
      expect.objectContaining({
        testID: SELECTORS.TEST_ID,
      }),
      undefined,
    );
  });

  it("does not attach a RefreshControl on ios when pull-to-refresh is disabled", async () => {
    Platform.OS = "ios";
    NativeModules.LaunchArgumentsModule.getLaunchArguments.mockResolvedValue({ pullToRefresh: false });

    await renderComponent();

    expect(RefreshControl).not.toHaveBeenCalled();
    expect(getLatestProps(ScrollView).refreshControl).toBeUndefined();
  });

  it("attaches a disabled RefreshControl on ios when pull-to-refresh is enabled", async () => {
    Platform.OS = "ios";
    NativeModules.LaunchArgumentsModule.getLaunchArguments.mockResolvedValue({ pullToRefresh: true });

    await renderComponent();

    expect(getLatestProps(ScrollView).refreshControl).toBeDefined();
    expect(getLatestProps(ScrollView).refreshControl.props.enabled).toBe(false);
  });

  it("enables RefreshControl on android when pull-to-refresh is enabled", async () => {
    Platform.OS = "android";
    NativeModules.LaunchArgumentsModule.getLaunchArguments.mockResolvedValue({ pullToRefresh: true });

    await renderComponent();

    expect(getLatestProps(ScrollView).refreshControl.props.enabled).toBe(true);
  });

  it("disables RefreshControl on android when refreshEnabled is false", async () => {
    Platform.OS = "android";
    NativeModules.LaunchArgumentsModule.getLaunchArguments.mockResolvedValue({ pullToRefresh: true });
    useRefreshEnabled.mockReturnValue({ refreshEnabled: false });

    await renderComponent();

    expect(getLatestProps(ScrollView).refreshControl.props.enabled).toBe(false);
  });

  it("runs the refresh lifecycle and resets refreshing after refresh resolves", async () => {
    Platform.OS = "android";
    NativeModules.LaunchArgumentsModule.getLaunchArguments.mockResolvedValue({ pullToRefresh: true });
    const deferred = createDeferred();
    const refresh = jest.fn(() => deferred.promise);

    await renderComponent({ refresh });

    const onRefresh = getLatestProps(ScrollView).refreshControl.props.onRefresh;
    let refreshPromise;

    await act(async () => {
      refreshPromise = onRefresh();
      await Promise.resolve();
    });

    expect(getLatestProps(ScrollView).refreshControl.props.refreshing).toBe(true);
    expect(refresh).toHaveBeenCalledTimes(1);

    deferred.resolve();

    await act(async () => {
      await refreshPromise;
    });

    expect(getLatestProps(ScrollView).refreshControl.props.refreshing).toBe(false);
  });

  it("keeps the sticky overlay hidden before RaceDetails layout has been measured", async () => {
    await renderComponent();

    expect(hasMockCall(RaceDetailsCard, { isSticky: true })).toBe(false);
  });

  it("keeps the sticky overlay hidden while scroll offset is within the RaceDetails bounds", async () => {
    const view = await renderComponent();
    const layoutTarget = view.UNSAFE_root.findAll((node) => typeof node.props.onLayout === "function")[0];

    fireEvent(layoutTarget, "layout", {
      nativeEvent: {
        layout: { y: 100, height: 50 },
      },
    });
    fireEvent.scroll(view.getByTestId(SELECTORS.TEST_ID), {
      nativeEvent: {
        contentOffset: { y: 100 },
      },
    });

    expect(hasMockCall(RaceDetailsCard, { isSticky: true })).toBe(false);
  });

  it("shows the sticky overlay when scroll offset exceeds the RaceDetails bounds", async () => {
    const view = await renderComponent();
    const layoutTarget = view.UNSAFE_root.findAll((node) => typeof node.props.onLayout === "function")[0];

    fireEvent(layoutTarget, "layout", {
      nativeEvent: {
        layout: { y: 100, height: 50 },
      },
    });
    fireEvent.scroll(view.getByTestId(SELECTORS.TEST_ID), {
      nativeEvent: {
        contentOffset: { y: 200 },
      },
    });

    expect(hasMockCall(RaceDetailsCard, { isSticky: true, race: raceA })).toBe(true);
  });

  it("never shows the sticky overlay when no selected race can be resolved", async () => {
    const view = await renderComponent({ dataOverrides: { selectedRaceUrn: "ppb:race:missing" } });

    fireEvent.scroll(view.getByTestId(SELECTORS.TEST_ID), {
      nativeEvent: {
        contentOffset: { y: 200 },
      },
    });

    expect(RaceDetailsCard).not.toHaveBeenCalled();
  });

  it("applies the highlighted header style when the meeting is highlighted", async () => {
    const view = await renderComponent({ dataOverrides: { isHighlighted: true } });

    expect(hasStyledNode(view.UNSAFE_root, styles.headerHighlighted)).toBe(true);
  });

  it("resets the user-selected race when the incoming urn prop changes", async () => {
    const nextData = buildData({
      urn: VIEW_URN_SIBLING,
      races: [siblingRace],
      selectedRaceUrn: RACE_URN_SIBLING,
      initialItems: siblingInitialItems,
    });
    const { rerenderWithUrn } = await renderComponent({
      viewModels: {
        [VIEW_URN]: { data: buildData() },
        [VIEW_URN_SIBLING]: { data: nextData },
      },
    });

    await act(async () => {
      getLatestProps(RaceViewLinksCard).onRaceSelected(RACE_URN_B, raceB.viewLink);
    });

    expect(getLatestProps(RaceViewLinksCard).selectedRaceUrn).toBe(RACE_URN_B);

    await rerenderWithUrn(VIEW_URN_SIBLING);

    expect(getLatestProps(RaceViewLinksCard).selectedRaceUrn).toBe(RACE_URN_SIBLING);
  });

  it("fires onMount once per mounted data urn and never fetches bars", async () => {
    const { events, rerenderWithUrn } = await renderComponent({
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
    expect(events.onMount).toHaveBeenLastCalledWith(VIEW_URN);
    expect(events.fetchBars).not.toHaveBeenCalled();

    await rerenderWithUrn(VIEW_URN);

    expect(events.onMount).toHaveBeenCalledTimes(1);
    expect(events.fetchBars).not.toHaveBeenCalled();

    await rerenderWithUrn(VIEW_URN_SIBLING);

    expect(events.onMount).toHaveBeenCalledTimes(2);
    expect(events.onMount).toHaveBeenLastCalledWith(VIEW_URN_SIBLING);
    expect(events.fetchBars).not.toHaveBeenCalled();
  });

  it("emits sibling selection events and switches the active meeting", async () => {
    const { events } = await renderComponent({
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

    await act(async () => {
      getLatestProps(RaceSwitcherCard).onMeetingSelected(siblingViewLink);
    });

    expect(events.onSiblingSelected).toHaveBeenCalledWith(VIEW_URN_SIBLING, siblingViewLink);
    expect(getLatestProps(RaceViewLinksCard).viewUrn).toBe(VIEW_URN_SIBLING);
  });

  it("emits race selection events and updates the effective race selection", async () => {
    const { events } = await renderComponent();

    await act(async () => {
      getLatestProps(RaceViewLinksCard).onRaceSelected(RACE_URN_B, raceB.viewLink);
    });

    expect(events.onRaceSelected).toHaveBeenCalledWith(RACE_URN_B, raceB.viewLink);
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

  it("renders RaceDetailsCard and suppresses LiveVideoCard when the selected race is closed", async () => {
    await renderComponent({ dataOverrides: { selectedRaceUrn: RACE_URN_B } });

    expect(RaceDetailsCard).toHaveBeenCalledWith(
      expect.objectContaining({
        race: raceB,
        meeting,
        locale: "en-GB",
        timezone: "UTC",
        isHighlighted: false,
      }),
      undefined,
    );
    expect(LiveVideoCard).not.toHaveBeenCalled();
  });
});
