import { useContext } from "react";
import { render, act } from "@testing-library/react";
import "jest-dom/extend-expect";
import { ActionLink, BottomSheet, EmptyState, Modal, PebbleList } from "@ppb/the-wall-web";
import ObbCardGroup from "./ObbCardGroup.web";
import { HEADER, TITLE } from "./ObbCardGroup.web.selectors";
import TimerCountDown from "../TimerCountDown/TimerCountDown.web";
import { ObbMoreInfoDetails } from "../ObbMoreInfoDetails/ObbMoreInfoDetails.web";
import ObbSection from "../ObbSection/ObbSection.web";

jest.useFakeTimers();

jest.mock("@ppb/the-wall-web", () => ({
  BottomSheet: jest.fn(({ children }) => <div data-testid="bottom-sheet-mock">{children}</div>),
  ActionLink: jest.fn(({ text, onClick }) => (
    <action-link-mock data-testid="action-link-mock" onClick={onClick} onKeyDown={onClick} role="presentation">
      {text}
    </action-link-mock>
  )),
  RichTextComponent: jest.fn(({ props }) => (
    <rich-text-component-mock data-test-id="rich-text-component-mock" {...props}></rich-text-component-mock>
  )),
  Modal: jest.fn(({ props, children }) => <modal-mock {...props}>{children}</modal-mock>),
  EmptyState: jest.fn(({ message, ...props }) => (
    <empty-state-mock data-testid="empty-state-mock" {...props}>
      {message}
    </empty-state-mock>
  )),
  QuickLink: jest.fn(() => <quick-link-mock />),
  PebbleList: jest.fn(({ items, onPebbleClick }) => (
    <div>
      {items.map((item) => (
        <button key={item.id} onClick={() => onPebbleClick(item.text)}>
          {item.text}
        </button>
      ))}
    </div>
  )),
}));

jest.mock("../TimerCountDown/TimerCountDown.web", () =>
  jest.fn((props) => <timer-mock data-testid="timer-mock-mock" {...props} />),
);

jest.mock("../ObbSection/ObbSection.web", () => jest.fn(() => <obb-section data-testid="obb-section" />));

jest.mock("../ObbMoreInfoDetails/ObbMoreInfoDetails.web", () => ({
  ObbMoreInfoDetails: jest.fn((props) => <more-info-details-mock {...props} />),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => ({
    isDesktopLayout: false,
  })),
}));

jest.mock("@ppb/tbd-shared/helpers/i18n", () => ({
  i18n: ({ key }) => key,
}));

global.Date.now = jest.fn(() => new Date("2024-11-11T20:30:00Z").getTime());

const itemsMock = [
  { urn: "urn1", typename: "CardA", filterTags: [{ label: "Tag1", type: "TAG" }] },
  { urn: "urn2", typename: "CardB", filterTags: [{ label: "Tag2", type: "TAG" }] },
  { urn: "urn3", typename: "CardC", filterTags: [{ label: "Tag1", type: "TAG" }] },
];

const sectionsMock = [{ urn: "urn1", layouts: [{ urn: "urn1", title: "title", isSelected: true, items: itemsMock }] }];

const dispatchNavigateToTermsAndConditionsPageMock = jest.fn();

const defaultProps = {
  urn: "obbCardGroupUrn",
  title: "title",
  event: {
    urn: "urn",
    openDate: "2024-11-12T20:30:00Z",
    name: "event name",
  },
  obbBettingStartTime: new Date("2024-11-11T20:30:00Z"),
  bettingWindowOffset: 24,
  footballFixture: {},
  eventDate: new Date("2026-11-12T20:30:00Z"),
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
  dispatchSetFilter: jest.fn,
  dispatchNavigateToTermsAndConditionsPage: dispatchNavigateToTermsAndConditionsPageMock,
  dispatchObbEventSelection: jest.fn,
};

const filterTagsMock = [
  { type: "CATCH_ALL", label: "All" },
  { type: "TAG", label: "Tag1" },
  { type: "TAG", label: "Tag2" },
];

function renderObbCardGroup(props = {}) {
  const componentProps = { ...defaultProps, ...props };
  return render(<ObbCardGroup {...componentProps} />);
}

describe("ObbCardGroup", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    useContext.mockReturnValue({ isDesktopLayout: false });
  });

  describe("when the props are passed", () => {
    it("should render the card", async () => {
      const result = renderObbCardGroup();

      expect(result.container.querySelector(TITLE)).toHaveTextContent("title");
      expect(ActionLink).toHaveBeenCalledWith(
        { onClick: expect.any(Function), text: "Info", color: "default", typography: "Regular" },
        undefined,
      );
      expect(BottomSheet).not.toHaveBeenCalled();
    });

    describe("and the link is clicked", () => {
      describe("and is not desktop", () => {
        it("should render the bottomSheet", () => {
          renderObbCardGroup({});

          act(() => {
            ActionLink.mock.calls[0][0].onClick();
          });

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
              dispatchNavigateToTermsAndConditionsPage: dispatchNavigateToTermsAndConditionsPageMock,
            },
            undefined,
          );
        });
      });
      it("should dispatch obb event selection when more info is opened", () => {
        const dispatchObbEventSelection = jest.fn();

        renderObbCardGroup({ dispatchObbEventSelection });

        act(() => {
          ActionLink.mock.calls[0][0].onClick();
        });

        expect(dispatchObbEventSelection).toHaveBeenCalledWith({
          elementText: "more info",
          module: "obb - event page - build ups - more info - event name",
        });
      });
      describe("and is desktop", () => {
        beforeEach(() => {
          useContext.mockReturnValue({ isDesktopLayout: true });
        });

        it("should render the modal", async () => {
          useContext.mockReturnValue({ isDesktopLayout: true });
          renderObbCardGroup({});

          act(() => {
            ActionLink.mock.calls[0][0].onClick();
          });

          expect(Modal).toHaveBeenCalledTimes(1);
          expect(ObbMoreInfoDetails).toHaveBeenCalledTimes(1);
          expect(ObbMoreInfoDetails).toHaveBeenCalledWith(
            {
              moreInfoDetails: [
                {
                  text: "some text",
                  type: "heading1",
                },
              ],
              dispatchNavigateToTermsAndConditionsPage: dispatchNavigateToTermsAndConditionsPageMock,
            },
            undefined,
          );
        });
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
          obbBettingStartTime: new Date("2024-11-11T20:30:00Z"),
          eventDate: new Date("2024-11-12T20:30:00Z"),
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
        const result = renderObbCardGroup({ title: undefined });
        expect(result.container.querySelector(HEADER)).toBeNull();
      });
    });
  });

  describe("when showFilterTags is true", () => {
    it("renders filter tags", () => {
      const { getByText } = renderObbCardGroup({ showFilterTags: true, filterTags: filterTagsMock });

      expect(getByText("I18N.OBB.FILTERTAGS.ALL")).toBeInTheDocument();
      expect(getByText("Tag1")).toBeInTheDocument();
      expect(getByText("Tag2")).toBeInTheDocument();
    });

    it("filters card layouts based on selected filter tag", () => {
      const { getByText, queryByText } = renderObbCardGroup({
        showFilterTags: true,
        filterTags: filterTagsMock,
        sections: [
          {
            urn: "sectionUrn",
            layouts: [
              {
                urn: "layout-1",
                isSelected: true,
                items: [
                  { typename: "Card", filterTags: [{ label: "Tag1", type: "TAG" }] },
                  { typename: "Card", filterTags: [{ label: "Tag2", type: "TAG" }] },
                ],
              },
            ],
          },
        ],
      });

      act(() => {
        getByText("Tag1").click();
      });

      expect(getByText("Tag1")).toBeInTheDocument();
      expect(queryByText("Tag3")).not.toBeInTheDocument();
    });

    it("shows all cards when 'All' filter is selected", () => {
      const { getByText } = renderObbCardGroup({
        showFilterTags: true,
        filterTags: filterTagsMock,
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

      act(() => {
        getByText("I18N.OBB.FILTERTAGS.ALL").click();
      });

      expect(getByText("Tag1")).toBeInTheDocument();
      expect(getByText("Tag2")).toBeInTheDocument();
    });
  });

  describe("when showFilterTags is false", () => {
    it("does not render filter tags", () => {
      const { queryByText } = renderObbCardGroup({ showFilterTags: false, filterTags: filterTagsMock });

      expect(queryByText("I18N.OBB.FILTERTAGS.ALL")).not.toBeInTheDocument();
      expect(queryByText("Tag1")).not.toBeInTheDocument();
      expect(queryByText("Tag2")).not.toBeInTheDocument();
    });
  });

  describe("when filterTags has only a 'CATCH_ALL' tag", () => {
    it("does not render PebbleList", () => {
      const { queryByText } = renderObbCardGroup({
        showFilterTags: true,
        filterTags: [{ type: "CATCH_ALL", label: "All" }],
      });

      expect(queryByText("I18N.OBB.FILTERTAGS.ALL")).not.toBeInTheDocument();
    });
  });

  describe("when sections are provided", () => {
    it("should call dispatchLayoutSelection with 'obbCardGroupUrn', 'urn1', 'layoutUrn' and 'eventName' when a layout is selected", () => {
      const dispatchLayoutSelection = jest.fn();

      renderObbCardGroup({ dispatchLayoutSelection, event: { name: "eventName" } });

      const obbSectionsProps = ObbSection.mock.calls[0][0];
      obbSectionsProps.handleLayoutSelection("urn1", "layoutUrn");

      expect(dispatchLayoutSelection).toHaveBeenCalledTimes(1);
      expect(dispatchLayoutSelection).toHaveBeenCalledWith("obbCardGroupUrn", "urn1", "layoutUrn", "eventName");
    });

    it("should call dispatchSectionToggle with 'obbCardGroupUrn', 'sectionUrn', 'isOpen' and 'eventName' when a section header is clicked", () => {
      const dispatchSectionToggle = jest.fn();

      renderObbCardGroup({ dispatchSectionToggle, event: { name: "eventName" } });

      const obbSectionsProps = ObbSection.mock.calls[0][0];
      obbSectionsProps.onToggle(true);

      expect(dispatchSectionToggle).toHaveBeenCalledTimes(1);
      expect(dispatchSectionToggle).toHaveBeenCalledWith("obbCardGroupUrn", "urn1", true, "eventName");
    });

    it("should call dispatchShowMoreClicked with 'obbCardGroupUrn', 'sectionUrn', 'layoutUrn', 'isOpen' and 'eventName' when 'Show More' button is clicked", () => {
      const dispatchShowMoreClicked = jest.fn();

      renderObbCardGroup({ dispatchShowMoreClicked, event: { name: "eventName" } });

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

    it("should dispatch filter changes and obb event selection when a pebble is clicked", () => {
      const dispatchSetFilter = jest.fn();
      const dispatchObbEventSelection = jest.fn();

      renderObbCardGroup({
        showFilterTags: true,
        filterTags: filterTagsMock,
        selectedFilter: "ALL",
        dispatchSetFilter,
        dispatchObbEventSelection,
      });

      const pebbleProps = PebbleList.mock.calls[0][0];

      act(() => {
        pebbleProps.onPebbleClick("Tag1");
      });

      expect(dispatchSetFilter).toHaveBeenCalledWith("Tag1", "obbCardGroupUrn");
      expect(dispatchObbEventSelection).toHaveBeenCalledWith(
        {
          module: { card: "filters pebble", group: "null" },
          elementText: "Tag1",
        },
        "obbCardGroupUrn",
        "event name",
      );
    });

    it("should render no cards empty state when filtering removes all layouts", () => {
      useContext.mockReturnValue({ isDesktopLayout: false });
      renderObbCardGroup({
        selectedFilter: "Tag3",
        filterTags: filterTagsMock,
        sections: [
          {
            urn: "sectionUrn",
            layouts: [
              {
                urn: "layout-1",
                isSelected: true,
                items: [{ typename: "CardA", filterTags: [{ label: "Tag1", type: "TAG" }] }],
              },
            ],
          },
        ],
      });

      expect(EmptyState).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "I18N.OBB.UNAVAILABLE.NOCARDS.TITLE",
          message: "I18N.OBB.UNAVAILABLE.NOCARDS.SUBTITLE",
        }),
        undefined,
      );
      expect(ObbSection).not.toHaveBeenCalled();
    });

    it("should dispatch swimlane arrow interactions through dispatchObbEventSelection", () => {
      const dispatchObbEventSelection = jest.fn();

      renderObbCardGroup({ dispatchObbEventSelection });

      const obbSectionsProps = ObbSection.mock.calls[0][0];
      obbSectionsProps.handleOnSwimlaneArrowClick("right", "group-name");

      expect(dispatchObbEventSelection).toHaveBeenCalledWith(
        {
          elementText: "card - next",
          module: { card: "null", group: "group-name" },
        },
        "obbCardGroupUrn",
        "event name",
      );
    });

    it("should respect section expansion overrides when a filter is applied", () => {
      useContext.mockReturnValue({ isDesktopLayout: false });

      const sectionExpansionOverrideByFilter = {
        Tag1: { urn1: false, urn2: true },
      };

      renderObbCardGroup({
        selectedFilter: "Tag1",
        sectionExpansionOverrideByFilter,
        sections: [
          {
            urn: "urn1",
            isExpanded: true,
            layouts: [
              { urn: "layout-1", isSelected: true, items: [{ typename: "Card", filterTags: [{ label: "Tag1" }] }] },
            ],
          },
          {
            urn: "urn2",
            isExpanded: false,
            layouts: [
              { urn: "layout-2", isSelected: true, items: [{ typename: "Card", filterTags: [{ label: "Tag1" }] }] },
            ],
          },
        ],
      });

      expect(ObbSection.mock.calls[0][0].isExpanded).toBe(false);
      expect(ObbSection.mock.calls[1][0].isExpanded).toBe(true);
    });
  });
});
