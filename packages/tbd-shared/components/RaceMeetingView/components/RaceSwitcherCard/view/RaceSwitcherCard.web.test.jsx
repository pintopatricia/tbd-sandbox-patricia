import { act, render } from "@testing-library/react";
import { Selector } from "@ppb/the-wall-web";
import { useRaceSwitcherCardVM } from "../viewmodel/RaceSwitcherCard.viewmodel";
import RaceSwitcherCard from "./RaceSwitcherCard.web";
import SELECTORS from "./RaceSwitcherCard.selectors";

jest.mock("../viewmodel/RaceSwitcherCard.viewmodel", () => ({
  useRaceSwitcherCardVM: jest.fn(),
}));

jest.mock("@ppb/the-wall-web", () => ({
  Selector: jest.fn(() => <selector-mock />),
}));

const VIEW_URN = "ppb:tbd:view:raceMeeting:7|12345.1500";
const ASCOT_URN = "ppb:meeting:1";
const CHELTENHAM_URN = "ppb:meeting:2";

const meeting = {
  urn: ASCOT_URN,
  name: "Royal Ascot",
  venue: "Ascot",
  country: "GB",
  date: "2026-04-23",
  countryFlag: { vector: "vector-flag", small: "small-flag" },
};

const sibling = {
  meetingUrn: CHELTENHAM_URN,
  venue: "Cheltenham",
  countryFlag: { vector: "vector-c", small: "small-c" },
  viewLink: { viewUrn: "ppb:tbd:view:raceMeeting:7|99.1", viewUrl: "/meeting/cheltenham" },
};

const createEvents = () => ({
  onOpen: jest.fn(),
  onClose: jest.fn(),
});

const buildVM = (overrides = {}) => {
  const events = createEvents();
  const items = [
    { id: ASCOT_URN, label: "Ascot", iconUrl: { vector: "vector-flag", small: "small-flag" } },
    { id: CHELTENHAM_URN, label: "Cheltenham", iconUrl: { vector: "vector-c", small: "small-c" } },
  ];
  const links = { [CHELTENHAM_URN]: sibling.viewLink };
  return {
    events,
    value: {
      vm: {
        data: {
          title: "Royal Ascot",
          defaultValue: { id: ASCOT_URN, label: "Ascot" },
          items,
          links,
          icon: { vector: "vector-flag", small: "small-flag" },
          date: "23 Apr",
          ...overrides,
        },
        events,
      },
    },
  };
};

const renderComponent = ({ vmOverrides = {}, onMeetingSelected, innerWidth = 1200 } = {}) => {
  Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: innerWidth });
  const vm = buildVM(vmOverrides);
  useRaceSwitcherCardVM.mockReturnValue(vm.value);
  const view = render(
    <RaceSwitcherCard
      viewUrn={VIEW_URN}
      meeting={meeting}
      siblings={[sibling]}
      locale="en-GB"
      timezone="UTC"
      onMeetingSelected={onMeetingSelected}
    />,
  );
  return { ...view, events: vm.events };
};

describe("RaceSwitcherCard.web", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the container with the test id", () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId(SELECTORS.TEST_ID)).toBeDefined();
  });

  it("forwards title, defaultId and items to Selector", () => {
    renderComponent();
    expect(Selector).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Royal Ascot",
        defaultId: ASCOT_URN,
        items: expect.arrayContaining([
          expect.objectContaining({ id: ASCOT_URN, label: "Ascot" }),
          expect.objectContaining({ id: CHELTENHAM_URN, label: "Cheltenham" }),
        ]),
      }),
      undefined,
    );
  });

  it("renders the date and meeting icon when both are present", () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId(SELECTORS.DETAILS)).toBeDefined();
    expect(getByTestId(SELECTORS.DATE).textContent).toBe("23 Apr");
    expect(getByTestId(SELECTORS.ICON)).toBeDefined();
  });

  it("does not render the date when no date is available", () => {
    const { queryByTestId } = renderComponent({ vmOverrides: { date: undefined } });
    expect(queryByTestId(SELECTORS.DATE)).toBeNull();
  });

  it("calls events.onOpen with the viewUrn when the selector opens", () => {
    const { events } = renderComponent();
    Selector.mock.calls[0][0].onOpen();
    expect(events.onOpen).toHaveBeenCalledWith(VIEW_URN);
  });

  it("emits onClose with the matching viewLink when a different sibling is selected", () => {
    const { events } = renderComponent();
    act(() => {
      Selector.mock.calls[0][0].onClose({ id: CHELTENHAM_URN });
    });
    expect(events.onClose).toHaveBeenCalledWith(VIEW_URN, sibling.viewLink);
  });

  it("does not emit onClose when an unknown id is closed", () => {
    const { events } = renderComponent();
    Selector.mock.calls[0][0].onClose({ id: "ppb:meeting:unknown" });
    expect(events.onClose).not.toHaveBeenCalled();
  });

  it("does not emit onClose when the same default item is reselected", () => {
    const { events } = renderComponent({
      vmOverrides: {
        links: { [ASCOT_URN]: sibling.viewLink },
      },
    });
    Selector.mock.calls[0][0].onClose({ id: ASCOT_URN });
    expect(events.onClose).not.toHaveBeenCalled();
  });

  it("invokes onMeetingSelected and skips the global event when a callback is provided", () => {
    const onMeetingSelected = jest.fn();
    const { events } = renderComponent({ onMeetingSelected });
    act(() => {
      Selector.mock.calls[0][0].onClose({ id: CHELTENHAM_URN });
    });
    expect(onMeetingSelected).toHaveBeenCalledWith(sibling.viewLink);
    expect(events.onClose).not.toHaveBeenCalled();
  });
});
