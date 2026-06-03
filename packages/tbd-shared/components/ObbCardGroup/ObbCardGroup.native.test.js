import { render, fireEvent, act } from "@testing-library/react-native";
import { ActionLink, BottomSheet, EmptyState } from "@ppb/the-wall-native";
import ObbCardGroup from "./ObbCardGroup.native";
import { OBB_CARD_GROUP_HEADER, OBB_CARD_GROUP_TITLE } from "./ObbCardGroup.native.selectors";
import TimerCountDown from "../TimerCountDown/TimerCountDown.native";
import { ObbMoreInfoDetails } from "../ObbMoreInfoDetails/ObbMoreInfoDetails.native";
import ObbSection from "../ObbSection/ObbSection.native";

jest.useFakeTimers();

jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(),
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: jest.fn(() => ({
    top: 34,
  })),
}));

jest.mock("@ppb/the-wall-native", () => ({
  BottomSheet: jest.fn(({ children }) => <>{children}</>),
  ActionLink: jest.fn(({ text, onClick }) => (
    <mock onPress={onClick} testID="action-link-mock">
      {text}
    </mock>
  )),
  EmptyState: jest.fn(({ message, ...props }) => (
    <empty-state-mock testID="empty-state-mock" {...props}>
      {message}
    </empty-state-mock>
  )),
  QuickLink: jest.fn(() => <quick-link-mock />),
  PebbleList: jest.fn(({ items = [], onPebblePress, ...props }) => (
    <pebble-list-mock {...props}>
      {items.map((item) => (
        <button key={item.id} testID={`filter-tag-${item.text}`} onClick={() => onPebblePress(item.id)}>
          {item.text}
        </button>
      ))}
    </pebble-list-mock>
  )),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("@ppb/the-wall-native/components/RichText/RichText", () => ({
  RichTextComponent: jest.fn((props) => <rich-text testID="rich-text" {...props} />),
}));
jest.mock("../ObbSection/ObbSection.native", () => jest.fn(() => <obb-section data-testid="obb-section" />));

jest.mock("../TimerCountDown/TimerCountDown.native", () =>
  jest.fn((props) => <timer-mock data-testid="timer-mock-mock" {...props} />),
);

jest.mock("../ObbMoreInfoDetails/ObbMoreInfoDetails.native", () => ({
  ObbMoreInfoDetails: jest.fn((props) => <more-info-details-mock {...props} />),
}));

jest.mock("@ppb/tbd-shared/helpers/i18n", () => ({
  i18n: ({ key }) => key,
}));

jest.mock("../ObbSquadVsSquadCard/snowflakes/PlayersTooltip/TooltipContext", () => ({
  TooltipProvider: ({ children }) => <div>{children}</div>,
  useTooltip: jest.fn(() => ({
    visibleTooltipId: undefined,
    openTooltip: jest.fn(),
    closeTooltip: jest.fn(),
    tooltipText: "",
    coords: undefined,
  })),
}));

jest.mock("../ObbSquadVsSquadCard/snowflakes/PlayersTooltip/PlayersTooltip.native", () => ({
  PlayersTooltip: jest.fn(({ targetRef, position }) => (
    <players-tooltip-mock testID="players-tooltip-mock" targetRef={targetRef} position={position} />
  )),
}));

const dateSpy = jest.spyOn(Date, "now");
const DATE_NOW_MOCK = new Date("2024-11-11T21:30:00Z").getTime();

const itemsMock = [
  { urn: "urn1", typename: "CardA", filterTags: [{ label: "Tag1", type: "TAG" }] },
  { urn: "urn2", typename: "CardB", filterTags: [{ label: "Tag2", type: "TAG" }] },
  { urn: "urn3", typename: "CardC", filterTags: [{ label: "Tag1", type: "TAG" }] },
];

const sectionsMock = [
  {
    urn: "urn1",
    title: "title",
    icon: {
      id: "iconId",
      category: "iconCategory",
    },
    isExpanded: true,
    layouts: [{ urn: "urn1", title: "title", isSelected: true, items: itemsMock }],
  },
];

const defaultProps = {
  urn: "obbCardGroupUrn",
  title: "title",
  event: {
    urn: "urn",
    openDate: "2024-11-12T20:30:00Z",
    name: "eventName",
  },
  obbBettingStartTime: new Date("2024-11-11T20:30:00Z"),
  bettingWindowOffset: 120,
  footballFixture: {},
  eventDate: new Date("2024-11-12T20:30:00Z"),
  moreInfoLabel: "Info",
  moreInfoDetails: [
    {
      type: "heading1",
      text: "some text",
    },
  ],
  showFilterTags: false,
  filterTags: [],
  selectedFilter: "ALL",
  sections: sectionsMock,
  sectionExpansionOverrideByFilter: {},
  dispatchObbEventSelection: jest.fn(),
  dispatchSetFilter: jest.fn(),
  dispatchLayoutSelection: jest.fn(),
  dispatchSectionToggle: jest.fn(),
  dispatchShowMoreClicked: jest.fn(),
};

const filterTagsMock = [
  { type: "CATCH_ALL", label: "All" },
  { type: "TAG", label: "Tag1" },
  { type: "TAG", label: "Tag2" },
];

function renderObbCardGroup(props = {}) {
  const containerProps = { ...defaultProps, ...props };
  return render(<ObbCardGroup {...containerProps} />);
}

describe("ObbCardGroup Native", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when the props are passed", () => {
    beforeEach(() => {
      dateSpy.mockReturnValue(DATE_NOW_MOCK);
    });

    it("should render the card group with title and action link", () => {
      const { getByTestId } = renderObbCardGroup();

      expect(getByTestId(OBB_CARD_GROUP_TITLE)).toHaveTextContent("title");
      expect(ActionLink).toHaveBeenCalledWith(
        { onClick: expect.any(Function), text: "Info", color: "default", typography: "Regular" },
        undefined,
      );
      expect(BottomSheet).not.toHaveBeenCalled();
    });

    describe("and the action link is clicked", () => {
      beforeEach(() => {
        const { getByTestId } = renderObbCardGroup();

        fireEvent.press(getByTestId("action-link-mock"));
      });

      it("should render the bottom sheet", () => {
        expect(BottomSheet).toHaveBeenCalledTimes(1);
        expect(ObbMoreInfoDetails).toHaveBeenCalledTimes(1);
        expect(ObbMoreInfoDetails).toHaveBeenCalledWith(
          {
            moreInfoDetails: [
              {
                text: "some text",
                type: "heading1",
              },
            ],
          },
          undefined,
        );
      });
    });

    describe("when the event starts in less than the betting window offset", () => {
      const obbBettingStartTime = new Date("2024-11-11T20:30:00Z");
      const eventDate = new Date("2024-11-12T20:30:00Z");

      it("should render the obb section component when there are OBB layouts with cards", async () => {
        renderObbCardGroup({
          obbBettingStartTime,
          eventDate,
          sections: [{ urn: "sectionUrn", layouts: [{ urn: "urn1", isSelected: true, items: itemsMock }] }],
        });

        expect(ObbSection).toHaveBeenCalled();
        expect(EmptyState).not.toHaveBeenCalled();
        expect(TimerCountDown).not.toHaveBeenCalled();
      });

      it("should render an empty state with unavailable label if there are sections, but no layouts", async () => {
        renderObbCardGroup({
          obbBettingStartTime,
          eventDate,
          sections: [{ layouts: [] }],
        });

        expect(ObbSection).not.toHaveBeenCalled();
        expect(EmptyState).toHaveBeenCalledWith(
          expect.objectContaining({
            message: "I18N.OBB.UNAVAILABLE.ERROR.SUBTITLE",
            title: "I18N.OBB.UNAVAILABLE.ERROR.TITLE",
          }),
          undefined,
        );
        expect(TimerCountDown).not.toHaveBeenCalled();
      });

      it("should render an empty state with unavailable label if there are layouts, but no cards", async () => {
        renderObbCardGroup({
          obbBettingStartTime: new Date("2024-11-11T20:30:00Z"),
          eventDate: new Date("2024-11-12T20:30:00Z"),
          sections: [{ layouts: [{ urn: "urn1", isSelected: true, items: [] }] }],
        });

        expect(ObbSection).not.toHaveBeenCalled();
        expect(EmptyState).toHaveBeenCalledWith(
          expect.objectContaining({
            message: "I18N.OBB.UNAVAILABLE.ERROR.SUBTITLE",
            title: "I18N.OBB.UNAVAILABLE.ERROR.TITLE",
          }),
          undefined,
        );
        expect(TimerCountDown).not.toHaveBeenCalled();
      });

      it("should render an empty state with unavailable label if there are no sections", async () => {
        renderObbCardGroup({
          obbBettingStartTime: new Date("2024-11-11T20:30:00Z"),
          eventDate: new Date("2024-11-12T20:30:00Z"),
          sections: [],
        });

        expect(ObbSection).not.toHaveBeenCalled();
        expect(EmptyState).toHaveBeenCalledWith(
          expect.objectContaining({
            message: "I18N.OBB.UNAVAILABLE.ERROR.SUBTITLE",
            title: "I18N.OBB.UNAVAILABLE.ERROR.TITLE",
          }),
          undefined,
        );
        expect(TimerCountDown).not.toHaveBeenCalled();
      });
    });

    describe("when the event starts in more than the betting window offset", () => {
      const obbBettingStartTime = new Date("2024-11-11T22:30:00Z");
      const eventDate = new Date("2024-11-12T20:30:00Z");

      it("should render the countdown component", async () => {
        renderObbCardGroup({
          obbBettingStartTime,
          eventDate,
        });

        expect(EmptyState).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "I18N.OBB.UNAVAILABLE.PREPLAY.TITLE",
          }),
          undefined,
        );
        expect(TimerCountDown).toHaveBeenCalled();
        expect(ObbSection).not.toHaveBeenCalled();
      });
    });

    describe("when the event is already in play", () => {
      it("should render the empty state card with in-play labels", async () => {
        renderObbCardGroup({
          footballFixture: {
            duration: { status: "InPlay" },
          },
        });

        expect(EmptyState).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "I18N.OBB.UNAVAILABLE.INPLAY.TITLE",
          }),
          undefined,
        );
        expect(ObbSection).not.toHaveBeenCalled();
        expect(TimerCountDown).not.toHaveBeenCalled();
      });
    });

    describe("but title is undefined", () => {
      it("shouldn't render the header", () => {
        const { queryByTestId } = renderObbCardGroup({ title: undefined });
        expect(queryByTestId(OBB_CARD_GROUP_HEADER)).toBeNull();
      });
    });
  });

  describe("when the card rerenders", () => {
    beforeEach(() => {
      dateSpy.mockReturnValue(DATE_NOW_MOCK);
    });

    describe("and the props are the same", () => {
      it("shouldn't rerender the component", () => {
        const { rerender } = renderObbCardGroup();

        rerender(<ObbCardGroup {...defaultProps} />);

        // expect component not to be rerendered since props are the same
        expect(ActionLink).toHaveBeenCalledTimes(1);
      });
    });

    describe("and the title props are not the same", () => {
      it("should rerender the component", () => {
        const { rerender } = renderObbCardGroup();

        rerender(<ObbCardGroup {...defaultProps} title="new title" />);

        // expect component to be rerendered since props are different
        expect(ActionLink).toHaveBeenCalledTimes(2);
      });
    });

    describe("and the obbBettingStartTime prop is not the same", () => {
      it("should rerender the component", () => {
        const { rerender } = renderObbCardGroup();

        rerender(<ObbCardGroup {...defaultProps} obbBettingStartTime={new Date("2024-11-11T21:30:00Z")} />);

        // expect component to be rerendered since props are different
        expect(ActionLink).toHaveBeenCalledTimes(2);
      });
    });

    describe("and the eventDate prop is not the same", () => {
      it("should rerender the component", () => {
        const { rerender } = renderObbCardGroup();

        rerender(<ObbCardGroup {...defaultProps} eventDate={new Date("2024-11-12T21:30:00Z")} />);

        // expect component to be rerendered since props are different
        expect(ActionLink).toHaveBeenCalledTimes(2);
      });
    });

    describe("and the moreInfoLabel prop is not the same", () => {
      it("should rerender the component", () => {
        const { rerender } = renderObbCardGroup();

        rerender(<ObbCardGroup {...defaultProps} moreInfoLabel="Info-2" />);

        // expect component to be rerendered since props are different
        expect(ActionLink).toHaveBeenCalledTimes(2);
      });
    });

    describe("and the selectedFilter prop is not the same", () => {
      it("should rerender the component", () => {
        const { rerender } = renderObbCardGroup();

        rerender(
          <ObbCardGroup
            {...defaultProps}
            selectedFilter="Tag1"
            sectionExpansionOverrideByFilter={{
              Tag1: {
                urn1: true,
              },
            }}
          />,
        );

        // expect component to be rerendered since props are different
        expect(ActionLink).toHaveBeenCalledTimes(2);
      });
    });

    describe("and the dispatchObbEventSelection prop is not the same", () => {
      it("should rerender the component", () => {
        const { rerender } = renderObbCardGroup();

        rerender(<ObbCardGroup {...defaultProps} dispatchObbEventSelection={jest.fn()} />);

        // expect component to be rerendered since props are different
        expect(ActionLink).toHaveBeenCalledTimes(2);
      });
    });

    describe("and the dispatchSetFilter prop is not the same", () => {
      it("should rerender the component", () => {
        const { rerender } = renderObbCardGroup();

        rerender(<ObbCardGroup {...defaultProps} dispatchSetFilter={jest.fn()} />);

        // expect component to be rerendered since props are different
        expect(ActionLink).toHaveBeenCalledTimes(2);
      });
    });

    describe("and the footballFixture props are not the same", () => {
      it("should rerender the component", () => {
        const { rerender } = renderObbCardGroup();

        rerender(<ObbCardGroup {...defaultProps} footballFixture={{ typename: "FootballFixture" }} />);

        // expect component to be rerendered since props are different
        expect(ActionLink).toHaveBeenCalledTimes(2);
      });
    });

    describe("and the moreInfoDetails props are not the same", () => {
      it("should rerender the component", () => {
        const { rerender } = renderObbCardGroup();

        rerender(<ObbCardGroup {...defaultProps} moreInfoDetails={[]} />);

        // expect component to be rerendered since props are different
        expect(ActionLink).toHaveBeenCalledTimes(2);
      });
    });

    describe("when the sections prop is not the same", () => {
      describe("and sections length is not the same", () => {
        it("should rerender the component", () => {
          const { rerender } = renderObbCardGroup();

          const newSections = [...sectionsMock, { ...sectionsMock[0], urn: "urn2" }];

          rerender(<ObbCardGroup {...defaultProps} sections={newSections} />);

          // expect component to be rerendered since props are different
          expect(ActionLink).toHaveBeenCalledTimes(2);
        });
      });

      describe("and a section urn is not the same", () => {
        it("should rerender the component", () => {
          const { rerender } = renderObbCardGroup();

          const newSections = [{ ...sectionsMock[0], urn: "urn2" }];

          rerender(<ObbCardGroup {...defaultProps} sections={newSections} />);

          // expect component to be rerendered since props are different
          expect(ActionLink).toHaveBeenCalledTimes(2);
        });
      });

      describe("and a section title is not the same", () => {
        it("should rerender the component", () => {
          const { rerender } = renderObbCardGroup();

          const newSections = [{ ...sectionsMock[0], title: "title2" }];

          rerender(<ObbCardGroup {...defaultProps} sections={newSections} />);

          // expect component to be rerendered since props are different
          expect(ActionLink).toHaveBeenCalledTimes(2);
        });
      });

      describe("and a section icon is not the same", () => {
        it("should rerender the component", () => {
          const { rerender } = renderObbCardGroup();

          const newSections = [
            {
              ...sectionsMock[0],
              icon: {
                id: "iconId2",
                category: "iconCategory2",
              },
            },
          ];

          rerender(<ObbCardGroup {...defaultProps} sections={newSections} />);

          // expect component to be rerendered since props are different
          expect(ActionLink).toHaveBeenCalledTimes(2);
        });
      });

      describe("and a section isExpanded is not the same", () => {
        it("should rerender the component", () => {
          const { rerender } = renderObbCardGroup();

          const newSections = [{ ...sectionsMock[0], isExpanded: false }];

          rerender(<ObbCardGroup {...defaultProps} sections={newSections} />);

          // expect component to be rerendered since props are different
          expect(ActionLink).toHaveBeenCalledTimes(2);
        });
      });

      describe("and a section layouts length is not the same", () => {
        it("should rerender the component", () => {
          const { rerender } = renderObbCardGroup();

          const newSections = [
            {
              ...sectionsMock[0],
              layouts: [...sectionsMock[0].layouts, { ...sectionsMock[0].layouts[0], urn: "urn2" }],
            },
          ];

          rerender(<ObbCardGroup {...defaultProps} sections={newSections} />);

          // expect component to be rerendered since props are different
          expect(ActionLink).toHaveBeenCalledTimes(2);
        });
      });

      describe("and a section layout urn is not the same", () => {
        it("should rerender the component", () => {
          const { rerender } = renderObbCardGroup();

          const newSections = [
            {
              ...sectionsMock[0],
              layouts: [{ ...sectionsMock[0].layouts[0], urn: "urn2" }],
            },
          ];

          rerender(<ObbCardGroup {...defaultProps} sections={newSections} />);

          // expect component to be rerendered since props are different
          expect(ActionLink).toHaveBeenCalledTimes(2);
        });
      });
    });
  });

  describe("when showFilterTags is true", () => {
    it("renders filter tags", () => {
      const { getByTestId } = renderObbCardGroup({ showFilterTags: true, filterTags: filterTagsMock });

      expect(getByTestId("filter-tag-I18N.OBB.FILTERTAGS.ALL")).toBeTruthy();
      expect(getByTestId("filter-tag-Tag1")).toBeTruthy();
      expect(getByTestId("filter-tag-Tag2")).toBeTruthy();
    });

    it("filters card layouts based on selected filter tag", () => {
      // Simulate selecting Tag1 by rendering with selectedFilterTag prop
      const { getByTestId, queryByTestId } = renderObbCardGroup({
        showFilterTags: true,
        filterTags: filterTagsMock,
        selectedFilterTag: "Tag1",
        sections: [
          {
            urn: "sectionUrn",
            layouts: [
              {
                urn: "layout-1",
                isSelected: true,
                items: [
                  { typename: "CardA", filterTags: [{ label: "Tag1" }] },
                  { typename: "CardB", filterTags: [{ label: "Tag2" }] },
                ],
              },
            ],
          },
        ],
      });

      expect(getByTestId("filter-tag-Tag1")).toBeTruthy();
      expect(queryByTestId("filter-tag-Tag3")).toBeNull();
    });

    it("shows all cards when 'All' filter is selected", () => {
      // Simulate selecting 'All' by rendering with selectedFilterTag prop
      const { getByTestId } = renderObbCardGroup({
        showFilterTags: true,
        filterTags: filterTagsMock,
        selectedFilterTag: "All",
        sections: [
          {
            urn: "sectionUrn",
            layouts: [
              {
                urn: "layout-1",
                isSelected: true,
                items: [
                  { typename: "CardA", filterTags: [{ label: "Tag1" }] },
                  { typename: "CardB", filterTags: [{ label: "Tag2" }] },
                ],
              },
            ],
          },
        ],
      });

      expect(getByTestId("filter-tag-Tag1")).toBeTruthy();
      expect(getByTestId("filter-tag-Tag2")).toBeTruthy();
    });
  });

  describe("when showFilterTags is false", () => {
    it("does not render filter tags", () => {
      const { queryByText } = renderObbCardGroup({ showFilterTags: false, filterTags: filterTagsMock });

      expect(queryByText("I18N.OBB.FILTERTAGS.ALL")).toBeNull();
      expect(queryByText("Tag1")).toBeNull();
      expect(queryByText("Tag2")).toBeNull();
    });
  });

  describe("when filterTags has only a 'CATCH_ALL' tag", () => {
    it("does not render PebbleList", () => {
      const { queryByText } = renderObbCardGroup({
        showFilterTags: true,
        filterTags: [{ type: "CATCH_ALL", label: "All" }],
      });

      expect(queryByText("I18N.OBB.FILTERTAGS.ALL")).toBeNull();
    });
  });

  describe("when sections are provided", () => {
    it("should call dispatchLayoutSelection with 'obbCardGroupUrn', 'urn1', 'layoutUrn' and 'eventName' when a layout is selected", () => {
      const dispatchLayoutSelection = jest.fn();

      renderObbCardGroup({ dispatchLayoutSelection });

      const obbSectionsProps = ObbSection.mock.calls[0][0];
      obbSectionsProps.handleLayoutSelection("urn1", "layoutUrn");

      expect(dispatchLayoutSelection).toHaveBeenCalledTimes(1);
      expect(dispatchLayoutSelection).toHaveBeenCalledWith("obbCardGroupUrn", "urn1", "layoutUrn", "eventName");
    });

    it("should call dispatchSectionToggle with 'obbCardGroupUrn', 'sectionUrn', 'isOpen' and 'eventName' when a section header is clicked", () => {
      const dispatchSectionToggle = jest.fn();

      renderObbCardGroup({ dispatchSectionToggle });

      const obbSectionsProps = ObbSection.mock.calls[0][0];
      obbSectionsProps.onToggle(true);

      expect(dispatchSectionToggle).toHaveBeenCalledTimes(1);
      expect(dispatchSectionToggle).toHaveBeenCalledWith("obbCardGroupUrn", "urn1", true, "eventName");
    });

    it("should call dispatchShowMoreClicked with 'obbCardGroupUrn', 'sectionUrn', 'layoutUrn', 'isOpen' and 'eventName' when 'Show More' button is clicked", () => {
      const dispatchShowMoreClicked = jest.fn();

      renderObbCardGroup({ dispatchShowMoreClicked });

      const obbSectionsProps = ObbSection.mock.calls[0][0];
      obbSectionsProps.onShowMoreClicked("sectionUrn", "layoutUrn", true);

      expect(dispatchShowMoreClicked).toHaveBeenCalledTimes(1);
      expect(dispatchShowMoreClicked).toHaveBeenCalledWith(
        "obbCardGroupUrn",
        "sectionUrn",
        "layoutUrn",
        true,
        "eventName",
      );
    });
  });

  describe("betting/event time transitions", () => {
    describe("pre-betting to normal state", () => {
      it("should transition from countdown to normal betting UI when obbBettingStartTime is reached", () => {
        const now = new Date("2024-11-11T21:30:00Z").getTime();
        // Betting opens 5 minutes from "now"
        const obbBettingStartTime = new Date("2024-11-11T21:35:00Z");
        const eventDate = new Date("2024-11-12T20:30:00Z");

        dateSpy.mockReturnValue(now);

        renderObbCardGroup({ obbBettingStartTime, eventDate });

        // Initially renders the pre-betting countdown
        expect(EmptyState).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "I18N.OBB.UNAVAILABLE.PREPLAY.TITLE",
          }),
          undefined,
        );
        expect(TimerCountDown).toHaveBeenCalled();
        expect(ObbSection).not.toHaveBeenCalled();

        jest.clearAllMocks();

        // Advance time past the betting start time
        dateSpy.mockReturnValue(now + 5 * 60 * 1000);
        act(() => {
          jest.advanceTimersByTime(5 * 60 * 1000);
        });

        // Now renders the normal betting screen
        expect(ObbSection).toHaveBeenCalled();
        expect(TimerCountDown).not.toHaveBeenCalled();
      });

      it("should not schedule a timer when obbBettingStartTime is already in the past", () => {
        const now = new Date("2024-11-11T21:30:00Z").getTime();
        // Betting opened 5 minutes ago
        const obbBettingStartTime = new Date("2024-11-11T21:25:00Z");
        const eventDate = new Date("2024-11-12T20:30:00Z");

        dateSpy.mockReturnValue(now);

        renderObbCardGroup({ obbBettingStartTime, eventDate });

        // Renders normal betting screen immediately
        expect(ObbSection).toHaveBeenCalled();
        expect(TimerCountDown).not.toHaveBeenCalled();
      });
    });

    describe("pre-match to in-play state", () => {
      it("should transition from normal betting UI to in-play empty state when eventDate is reached", () => {
        const now = new Date("2024-11-11T21:30:00Z").getTime();
        const obbBettingStartTime = new Date("2024-11-11T20:30:00Z");
        // Event starts 5 minutes from "now"
        const eventDate = new Date("2024-11-11T21:35:00Z");

        dateSpy.mockReturnValue(now);

        renderObbCardGroup({ obbBettingStartTime, eventDate });

        // Initially renders the normal betting screen
        expect(ObbSection).toHaveBeenCalled();
        expect(EmptyState).not.toHaveBeenCalledWith(
          expect.objectContaining({
            title: "I18N.OBB.UNAVAILABLE.INPLAY.TITLE",
          }),
          undefined,
        );

        jest.clearAllMocks();

        // Advance time past the event start time
        dateSpy.mockReturnValue(now + 5 * 60 * 1000);
        act(() => {
          jest.advanceTimersByTime(5 * 60 * 1000);
        });

        // Now renders the in-play empty state
        expect(EmptyState).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "I18N.OBB.UNAVAILABLE.INPLAY.TITLE",
            message: "I18N.OBB.UNAVAILABLE.INPLAY.SUBTITLE",
          }),
          undefined,
        );
        expect(ObbSection).not.toHaveBeenCalled();
      });

      it("should show in-play empty state immediately when eventDate is already in the past", () => {
        const now = new Date("2024-11-11T21:30:00Z").getTime();
        const obbBettingStartTime = new Date("2024-11-11T20:30:00Z");
        // Event already started 5 minutes ago
        const eventDate = new Date("2024-11-11T21:25:00Z");

        dateSpy.mockReturnValue(now);

        renderObbCardGroup({ obbBettingStartTime, eventDate });

        expect(EmptyState).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "I18N.OBB.UNAVAILABLE.INPLAY.TITLE",
          }),
          undefined,
        );
        expect(ObbSection).not.toHaveBeenCalled();
      });
    });

    describe("pre-betting to in-play state", () => {
      it("should transition through pre-betting, normal, and into in-play as both time boundaries pass", () => {
        const now = new Date("2024-11-11T21:30:00Z").getTime();
        // Betting opens in 2 minutes, event starts in 5 minutes
        const obbBettingStartTime = new Date("2024-11-11T21:32:00Z");
        const eventDate = new Date("2024-11-11T21:35:00Z");

        dateSpy.mockReturnValue(now);

        renderObbCardGroup({ obbBettingStartTime, eventDate });

        // Phase 1: pre-betting countdown
        expect(TimerCountDown).toHaveBeenCalled();
        expect(ObbSection).not.toHaveBeenCalled();

        jest.clearAllMocks();

        // Phase 2: advance past betting start → normal betting screen
        dateSpy.mockReturnValue(now + 2 * 60 * 1000);
        act(() => {
          jest.advanceTimersByTime(2 * 60 * 1000);
        });

        expect(ObbSection).toHaveBeenCalled();
        expect(EmptyState).not.toHaveBeenCalledWith(
          expect.objectContaining({
            title: "I18N.OBB.UNAVAILABLE.INPLAY.TITLE",
          }),
          undefined,
        );

        jest.clearAllMocks();

        // Phase 3: advance past event start → in-play empty state
        dateSpy.mockReturnValue(now + 5 * 60 * 1000);
        act(() => {
          jest.advanceTimersByTime(3 * 60 * 1000);
        });

        expect(EmptyState).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "I18N.OBB.UNAVAILABLE.INPLAY.TITLE",
          }),
          undefined,
        );
        expect(ObbSection).not.toHaveBeenCalled();
      });
    });
  });
});
