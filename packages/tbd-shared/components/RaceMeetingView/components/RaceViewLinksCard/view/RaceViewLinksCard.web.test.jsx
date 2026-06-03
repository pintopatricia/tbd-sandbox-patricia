import { render } from "@testing-library/react";
import { SelectableItems } from "@ppb/the-wall-web";
import { useRaceViewLinksCardVM } from "../viewmodel/RaceViewLinksCard.viewmodel";
import RaceViewLinksCard from "./RaceViewLinksCard.web";
import SELECTORS from "./RaceViewLinksCard.selectors";

jest.mock("../viewmodel/RaceViewLinksCard.viewmodel", () => ({
  useRaceViewLinksCardVM: jest.fn(),
}));

jest.mock("@ppb/the-wall-web", () => ({
  SelectableItems: jest.fn(() => <selectable-items-mock />),
}));

const VIEW_URN = "ppb:tbd:view:raceMeeting:7|12345.1500";
const RACE_URN_1 = "ppb:race:12345.1500";
const RACE_URN_2 = "ppb:race:12345.1530";

const races = [
  {
    raceUrn: RACE_URN_1,
    startTime: "2026-04-23T15:00:00Z",
    isRaceClosed: false,
    viewLink: { viewUrn: "ppb:tbd:view:raceMeeting:7|1.1", viewUrl: "/race/1" },
    promotion: null,
  },
  {
    raceUrn: RACE_URN_2,
    startTime: "2026-04-23T15:30:00Z",
    isRaceClosed: false,
    viewLink: { viewUrn: "ppb:tbd:view:raceMeeting:7|2.1", viewUrl: "/race/2" },
    promotion: null,
  },
];

const items = [
  { viewLink: races[0].viewLink, raceTime: "15:00", isRaceClosed: false, marketPromo: undefined },
  { viewLink: races[1].viewLink, raceTime: "15:30", isRaceClosed: false, marketPromo: undefined },
];

const createEvents = () => ({ onClick: jest.fn() });

const buildVM = (overrides = {}) => {
  const events = createEvents();
  return {
    events,
    value: {
      vm: {
        data: { items, defaultRaceIndex: 0, ...overrides },
        events,
        viewUrn: VIEW_URN,
      },
    },
  };
};

const renderComponent = ({ vmOverrides = {}, onRaceSelected, selectedRaceUrn = null } = {}) => {
  Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 1200 });
  const vm = buildVM(vmOverrides);
  useRaceViewLinksCardVM.mockReturnValue(vm.value);
  const view = render(
    <RaceViewLinksCard
      viewUrn={VIEW_URN}
      selectedRaceUrn={selectedRaceUrn}
      races={races}
      locale="en-GB"
      timezone="UTC"
      onRaceSelected={onRaceSelected}
    />,
  );
  return { ...view, events: vm.events };
};

describe("RaceViewLinksCard.web", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the container with the test id", () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId(SELECTORS.TEST_ID)).toBeDefined();
  });

  it("returns null when no items are returned by the VM", () => {
    const { container } = renderComponent({ vmOverrides: { items: [] } });
    expect(container.firstChild).toBeNull();
  });

  it("forwards items and defaultRaceIndex to SelectableItems", () => {
    renderComponent({ vmOverrides: { defaultRaceIndex: 1 } });
    expect(SelectableItems).toHaveBeenCalledWith(
      expect.objectContaining({
        items,
        defaultItemIndex: 1,
        isHighlighted: false,
      }),
      undefined,
    );
  });

  it("emits onClick with the matching viewLink when a race is clicked", () => {
    const { events } = renderComponent();
    SelectableItems.mock.calls[0][0].onRaceTimeClick(0, false, races[1].viewLink);
    expect(events.onClick).toHaveBeenCalledWith(VIEW_URN, races[1].viewLink);
  });

  it("does nothing when onRaceTimeClick is called without a viewLink", () => {
    const { events } = renderComponent();
    SelectableItems.mock.calls[0][0].onRaceTimeClick(0, false, undefined);
    expect(events.onClick).not.toHaveBeenCalled();
  });

  it("invokes onRaceSelected with the matching raceUrn when provided", () => {
    const onRaceSelected = jest.fn();
    renderComponent({ onRaceSelected });
    SelectableItems.mock.calls[0][0].onRaceTimeClick(0, false, races[1].viewLink);
    expect(onRaceSelected).toHaveBeenCalledWith(RACE_URN_2, races[1].viewLink);
  });

  it("does not invoke onRaceSelected when no race matches the viewLink", () => {
    const onRaceSelected = jest.fn();
    renderComponent({ onRaceSelected });
    const { events } = { events: undefined };
    void events;
    SelectableItems.mock.calls[0][0].onRaceTimeClick(0, false, { viewUrn: "ppb:unknown", viewUrl: "/unknown" });
    expect(onRaceSelected).not.toHaveBeenCalled();
  });
});
