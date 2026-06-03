import { render } from "@testing-library/react";
import { RaceDetails, StickyHeader, useOnIntersect } from "@ppb/the-wall-web";
import { useRaceDetailsCardVM } from "../viewmodel/RaceDetailsCard.viewmodel";
import RaceDetailsCard from "./RaceDetailsCard.web";
import SELECTORS from "./RaceDetailsCard.selectors";

jest.mock("../viewmodel/RaceDetailsCard.viewmodel", () => ({
  useRaceDetailsCardVM: jest.fn(),
}));

let shouldRenderStickyView = true;

jest.mock("@ppb/the-wall-web", () => ({
  RaceDetails: jest.fn((props) => <race-details-mock {...props} />),
  StickyHeader: jest.fn(({ stickyView, children }) => (
    <sticky-header-mock>
      {children}
      {shouldRenderStickyView ? stickyView : null}
    </sticky-header-mock>
  )),
  useOnIntersect: jest.fn(),
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

const renderComponent = ({ dataOverrides = {}, isIntersecting = false, isHighlighted = true } = {}) => {
  const vm = buildVM(dataOverrides);

  useRaceDetailsCardVM.mockReturnValue(vm.value);
  useOnIntersect.mockReturnValue({
    isIntersecting,
    ref: null,
  });

  const view = render(
    <RaceDetailsCard race={race} meeting={meeting} locale="en-GB" timezone="UTC" isHighlighted={isHighlighted} />,
  );

  return {
    ...view,
    events: vm.events,
  };
};

const hasRaceDetailsCall = (matcher) =>
  RaceDetails.mock.calls.some(([props]) => expect.objectContaining(matcher).asymmetricMatch(props));

describe("RaceDetailsCard.web", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    shouldRenderStickyView = true;
  });

  it("renders container and delegates props to RaceDetails", () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId(SELECTORS.TEST_ID)).toBeDefined();
    expect(StickyHeader).toHaveBeenCalled();
    expect(
      hasRaceDetailsCall({
        countryFlag: baseData.countryFlag,
        raceTime: baseData.raceTime,
        raceName: baseData.raceName,
        meetingName: baseData.meetingName,
        raceStatus: baseData.raceStatus,
        raceStatusLabel: baseData.raceStatusLabel,
        date: baseData.date,
        numberOfRunners: baseData.numberOfRunners,
        raceClass: baseData.raceClass,
        trackGoing: baseData.trackGoing,
        raceDetailsTitle: baseData.raceDetailsTitle,
        runnersLabel: baseData.runnersLabel,
        isRaceRunningStatus: baseData.isRaceRunningStatus,
        availableToSubscribe: baseData.availableToSubscribe,
        isHighlighted: true,
      }),
    ).toBe(true);
  });

  it("renders sticky variant with showMeetingInfo", () => {
    renderComponent();

    expect(
      hasRaceDetailsCall({
        showMeetingInfo: true,
        isHighlighted: true,
      }),
    ).toBe(true);
  });

  it("calls onSubscribe when isIntersecting is true", () => {
    shouldRenderStickyView = false;
    const { events } = renderComponent({ isIntersecting: true });

    expect(events.onSubscribe).toHaveBeenCalledWith({
      raceUrn: race.raceUrn,
      isHorseRacing: race.isHorseRacing,
    });
    expect(events.onUnsubscribe).not.toHaveBeenCalled();
  });

  it("calls onUnsubscribe when not intersecting and not sticky", () => {
    shouldRenderStickyView = false;
    const { events } = renderComponent({ isIntersecting: false });

    expect(events.onUnsubscribe).toHaveBeenCalledWith(race.raceUrn);
    expect(events.onSubscribe).not.toHaveBeenCalled();
  });

  it("calls onSubscribe when sticky ref becomes attached", () => {
    const { events } = renderComponent({ isIntersecting: false });

    expect(events.onSubscribe).toHaveBeenCalledWith({
      raceUrn: race.raceUrn,
      isHorseRacing: race.isHorseRacing,
    });
  });
});
