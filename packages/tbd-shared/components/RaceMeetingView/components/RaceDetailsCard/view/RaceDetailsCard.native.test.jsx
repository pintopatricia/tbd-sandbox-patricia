import { render } from "@testing-library/react-native";
import { RaceDetails } from "@ppb/the-wall-native";
import { useRaceDetailsCardVM } from "../viewmodel/RaceDetailsCard.viewmodel";
import RaceDetailsCard from "./RaceDetailsCard.native";
import SELECTORS from "./RaceDetailsCard.selectors";
import styles from "./RaceDetailsCard.native.styles";
import ConnectedNotificationsSubscription from "../../../../NotificationsSubscription";
import NotificationsSubscription from "../../../../NotificationsSubscription/NotificationsSubscription.native";
import { NotificationsViewMode } from "../../../../NotificationsSubscription/map-to-props-factory";

jest.mock("../viewmodel/RaceDetailsCard.viewmodel", () => ({
  useRaceDetailsCardVM: jest.fn(),
}));

jest.mock("@ppb/the-wall-native", () => ({
  RaceDetails: jest.fn(({ children, ...props }) => <race-details-mock {...props}>{children}</race-details-mock>),
}));

jest.mock("../../../../NotificationsSubscription", () => jest.fn(() => <connected-notifications-subscription-mock />));

jest.mock("../../../../NotificationsSubscription/NotificationsSubscription.native", () => jest.fn(() => null));

jest.mock("react-native-device-info", () => ({
  getSystemVersion: jest.fn(() => "26.0"),
}));

const race = {
  raceId: "12345",
  raceUrn: "ppb:race:12345.1500",
  isHorseRacing: true,
};

const meeting = {
  name: "Ascot",
  venue: "Ascot",
  date: "2026-04-23",
  countryFlag: null,
};

const baseData = {
  countryFlag: {
    vector: "vector-flag",
    small: "small-flag",
  },
  raceTime: "15:00",
  raceName: "Race 1",
  meetingName: "Ascot Racecourse",
  raceStatus: "RESULTED",
  raceStatusLabel: "Final result",
  date: "2026-04-23",
  numberOfRunners: 8,
  raceClass: "t(I18N.LABELS.CLASS) 3",
  trackGoing: "t(I18N.RACE_GOING.SOFT)",
  raceDetailsTitle: "Handicap Stakes",
  runnersLabel: "t(I18N.LABELS.RUNNERS)",
  isRaceRunningStatus: true,
  availableToSubscribe: true,
};

const createEvents = () => ({
  onSubscribe: jest.fn(),
  onUnsubscribe: jest.fn(),
});

const buildVM = (overrides = {}) => {
  const events = createEvents();

  return {
    events,
    value: {
      vm: {
        data: {
          ...baseData,
          ...overrides,
        },
        events,
      },
    },
  };
};

const renderComponent = ({ dataOverrides = {}, isSticky, isHighlighted = true } = {}) => {
  const vm = buildVM(dataOverrides);

  useRaceDetailsCardVM.mockReturnValue(vm.value);

  const view = render(
    <RaceDetailsCard
      race={race}
      meeting={meeting}
      locale="en-GB"
      timezone="UTC"
      isHighlighted={isHighlighted}
      isSticky={isSticky}
    />,
  );

  return {
    ...view,
    events: vm.events,
  };
};

describe("RaceDetailsCard.native", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders root View with test id", () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId(SELECTORS.TEST_ID)).toBeDefined();
  });

  it("passes mapped VM data to RaceDetails", () => {
    renderComponent({ isSticky: true });

    expect(RaceDetails).toHaveBeenCalledWith(
      expect.objectContaining({
        countryFlag: baseData.countryFlag,
        raceTime: baseData.raceTime,
        meetingName: baseData.meetingName,
        date: baseData.date,
        runnersLabel: baseData.runnersLabel,
        raceName: baseData.raceName,
        numberOfRunners: baseData.numberOfRunners,
        raceClass: baseData.raceClass,
        raceDetailsTitle: baseData.raceDetailsTitle,
        trackGoing: baseData.trackGoing,
        raceStatusLabel: baseData.raceStatusLabel,
        isRaceRunningStatus: baseData.isRaceRunningStatus,
        isHighlighted: true,
        showMeetingInfo: true,
      }),
      undefined,
    );
  });

  it("subscribes on mount and unsubscribes on unmount", () => {
    const { events, unmount } = renderComponent();

    expect(events.onSubscribe).toHaveBeenCalledWith({
      raceUrn: race.raceUrn,
      isHorseRacing: race.isHorseRacing,
    });

    unmount();

    expect(events.onUnsubscribe).toHaveBeenCalledWith(race.raceUrn);
  });

  it("renders ConnectedNotificationsSubscription when availableToSubscribe and raceUrn", () => {
    renderComponent();

    expect(ConnectedNotificationsSubscription).toHaveBeenCalledWith(
      expect.objectContaining({
        viewMode: NotificationsViewMode.RACE,
        raceId: race.raceId,
        raceUrn: race.raceUrn,
        component: NotificationsSubscription,
      }),
      undefined,
    );
  });

  it("skips ConnectedNotificationsSubscription when availableToSubscribe is false", () => {
    renderComponent({
      dataOverrides: {
        availableToSubscribe: false,
      },
    });

    expect(ConnectedNotificationsSubscription).not.toHaveBeenCalled();
  });

  it("applies sticky background style when isSticky is true", () => {
    const { getByTestId } = renderComponent({ isSticky: true });
    const style = getByTestId(SELECTORS.TEST_ID).props.style;

    expect(style).toContainEqual(styles.raceDetailsContainerStickyColor);
    expect(RaceDetails).toHaveBeenCalledWith(
      expect.objectContaining({
        showMeetingInfo: true,
      }),
      undefined,
    );
  });

  it("omits sticky background when isSticky is false", () => {
    const { getByTestId } = renderComponent({ isSticky: false });
    const style = getByTestId(SELECTORS.TEST_ID).props.style;

    expect(style).not.toContainEqual(styles.raceDetailsContainerStickyColor);
    expect(RaceDetails.mock.calls[0][0].showMeetingInfo).toBe(false);
  });
});
