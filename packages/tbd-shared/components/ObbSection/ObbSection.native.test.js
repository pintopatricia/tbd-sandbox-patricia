import { render } from "@testing-library/react-native";
import { Card, PebbleList, PebbleText, StatusLabel } from "@ppb/the-wall-native";
import { CardHeaderSize, CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";
import "jest-dom/extend-expect";
import ObbSection from "./ObbSection.native";
import { ObbCardsLayout } from "../ObbCardsLayout/ObbCardsLayout.native";

jest.mock("@ppb/the-wall-native", () => ({
  Card: jest.fn(({ children, ...props }) => (
    <card-mock data-testid="card-mock" {...props}>
      {children}
    </card-mock>
  )),
  PebbleList: jest.fn(({ items, onPebblePress, ...props }) => (
    <pebble-list-mock data-testid="pebble-list-mock" {...props}>
      {items.map((item) => (
        <button key={item.id} data-id={item.id} onClick={() => onPebblePress(item.id)}>
          {item.children || item.text}
        </button>
      ))}
    </pebble-list-mock>
  )),
  PebbleText: jest.fn(({ text, ...props }) => (
    <pebble-text-mock data-testid="pebble-text-mock" {...props}>
      {text}
    </pebble-text-mock>
  )),
  StatusLabel: jest.fn(({ text, ...props }) => (
    <status-label-mock data-testid="status-label-mock" {...props}>
      {text}
    </status-label-mock>
  )),
}));

jest.mock("../ObbCardsLayout/ObbCardsLayout.native", () => ({
  ObbCardsLayout: jest.fn((props) => <obb-cards-layout-mock data-testid="obb-cards-layout-mock" {...props} />),
}));

jest.mock("@ppb/the-wall-icons/icons", () => ({
  iconsMap: {
    sports: {
      football: "FOOTBALL_ICON",
    },
  },
}));

const defaultLayouts = [
  {
    urn: "layout-1",
    title: "Layout 1",
    isSelected: true,
    items: [{ id: "item-1" }],
  },
  {
    urn: "layout-2",
    title: "",
    isSelected: false,
    items: [],
  },
];

const defaultProps = {
  urn: "section-urn",
  title: "Section title",
  isExpanded: true,
  layouts: defaultLayouts,
  selectedFilter: "filter-1",
  onToggle: jest.fn(),
  handleLayoutSelection: jest.fn(),
  onShowMoreClicked: jest.fn(),
};

describe("ObbSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function renderObbSection(props = {}) {
    const componentProps = { ...defaultProps, ...props };
    return render(<ObbSection {...componentProps} />);
  }

  describe("when layouts are provided", () => {
    it("should render a Card with correct props", () => {
      renderObbSection();

      expect(Card).toHaveBeenCalledTimes(1);
      expect(Card).toHaveBeenCalledWith(
        expect.objectContaining({
          title: defaultProps.title,
          icon: undefined,
          theme: CardTheme.SECONDARY,
          size: CardHeaderSize.LARGE,
          isCollapsible: true,
          startOpen: defaultProps.isExpanded,
        }),
        undefined,
      );
    });

    it("should render a Card icon when provided", () => {
      renderObbSection({ icon: { category: "sports", id: "football" } });

      expect(Card).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "FOOTBALL_ICON",
        }),
        undefined,
      );
    });

    it("should render PebbleList when there are multiple layouts", () => {
      renderObbSection();

      expect(PebbleList).toHaveBeenCalledTimes(1);

      const pebbleProps = PebbleList.mock.calls[0][0];

      expect(pebbleProps.items).toEqual([
        { id: "layout-1", text: "Layout 1" },
        { id: "layout-2", text: "" },
      ]);

      expect(pebbleProps.defaultSelectedPebble).toBe("layout-1");
    });

    it("should render PebbleText and StatusLabel when badge is provided", () => {
      const layoutsWithBadge = [
        {
          urn: "layout-1",
          title: "Layout 1",
          badge: "New",
          isSelected: true,
          items: [{ id: "item-1" }],
        },
        {
          urn: "layout-2",
          title: "Layout 2",
          isSelected: false,
          items: [],
        },
      ];

      renderObbSection({ layouts: layoutsWithBadge });

      expect(PebbleList).toHaveBeenCalledTimes(1);

      const pebbleProps = PebbleList.mock.calls[0][0];

      expect(pebbleProps.items[0].children).toBeDefined();

      expect(PebbleText).toHaveBeenCalledWith(
        expect.objectContaining({
          text: "Layout 1",
        }),
        undefined,
      );

      expect(StatusLabel).toHaveBeenCalledWith(
        expect.objectContaining({
          text: "New",
        }),
        undefined,
      );
    });

    it("should call handleLayoutSelection with 'urn' and 'layoutUrn' when a 'pebble' is clicked", () => {
      const handleLayoutSelection = jest.fn();

      renderObbSection({ handleLayoutSelection });

      const pebbleProps = PebbleList.mock.calls[0][0];

      pebbleProps.onPebblePress("layout-2");

      expect(handleLayoutSelection).toHaveBeenCalledTimes(1);
      expect(handleLayoutSelection).toHaveBeenCalledWith("section-urn", "layout-2");
    });

    it("should call onToggle with 'isOpen' when a section header is clicked", () => {
      const onToggle = jest.fn();

      renderObbSection({ onToggle });

      const sectionProps = Card.mock.calls[0][0];

      sectionProps.onTitleClick(true);

      expect(onToggle).toHaveBeenCalledTimes(1);
      expect(onToggle).toHaveBeenCalledWith(true);
    });

    it("should call onShowMoreClicked with 'urn', 'layoutUrn' and 'isOpen' when 'Show More' button is clicked", () => {
      const onShowMoreClicked = jest.fn();

      renderObbSection({ onShowMoreClicked });

      const obbCardsLayoutProps = ObbCardsLayout.mock.calls[0][0];

      obbCardsLayoutProps.onShowMoreClicked("layout-urn", true);

      expect(onShowMoreClicked).toHaveBeenCalledTimes(1);
      expect(onShowMoreClicked).toHaveBeenCalledWith("section-urn", "layout-urn", true);
    });

    it("should use the first layout when only one layout is provided and not render PebbleList", () => {
      const singleLayout = [
        {
          urn: "only-layout",
          title: "Only Layout",
          isSelected: false,
          items: [{ id: "item-1" }],
        },
      ];

      renderObbSection({ layouts: singleLayout });

      expect(PebbleList).not.toHaveBeenCalled();

      expect(ObbCardsLayout).toHaveBeenCalledTimes(1);

      const layoutProps = ObbCardsLayout.mock.calls[0][0];

      expect(layoutProps.layout).toEqual(singleLayout[0]);
    });

    it("should render ObbCardsLayout for the selected layout when it has items", () => {
      renderObbSection();

      expect(ObbCardsLayout).toHaveBeenCalledTimes(1);

      const layoutProps = ObbCardsLayout.mock.calls[0][0];

      expect(layoutProps.layout).toEqual(defaultLayouts[0]);
    });

    it("should not render ObbCardsLayout when selected layout has no items", () => {
      const layouts = [
        {
          urn: "layout-1",
          title: "Layout 1",
          isSelected: true,
          items: [],
        },
      ];

      renderObbSection({ layouts });

      expect(ObbCardsLayout).not.toHaveBeenCalled();
    });
  });

  describe("when layouts array is empty", () => {
    it("should return null and not render Card", () => {
      const { queryByTestId } = renderObbSection({ layouts: [] });

      expect(Card).not.toHaveBeenCalled();
      expect(queryByTestId("card-mock")).toBeNull();
    });
  });

  describe("when no selectedLayout is found (all layouts empty and no isSelected)", () => {
    it("should return null", () => {
      const layouts = [];

      const { queryByTestId } = renderObbSection({ layouts });

      expect(Card).not.toHaveBeenCalled();
      expect(queryByTestId("card-mock")).toBeNull();
    });
  });
});
