import { render } from "@testing-library/react-native";
import { ScrollableSwimlane } from "@ppb/the-wall-native";
import ObbCreatedBetsCardGroupPlaceholder from "./ObbCreatedBetsCardGroupPlaceholder.native";
import ObbCreatedBetsCardPlaceholder from "../../ObbCreatedBetsCard/placeholder/ObbCreatedBetsCardPlaceholder.native";

jest.mock("@ppb/the-wall-native", () => ({
  ScrollableSwimlane: jest.fn(({ children, ...props }) => (
    <scrollable-swimlane-mock {...props}>{children}</scrollable-swimlane-mock>
  )),
}));

jest.mock("../../ObbCreatedBetsCard/placeholder/ObbCreatedBetsCardPlaceholder.native", () =>
  jest.fn(() => <obb-created-bets-card-placeholder-mock />),
);

describe("ObbCreatedBetsCardGroupPlaceholder - Native", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when component renders", () => {
    it("should render ScrollableSwimlane with empty title", () => {
      render(<ObbCreatedBetsCardGroupPlaceholder />);

      expect(ScrollableSwimlane).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "",
        }),
        undefined,
      );
    });

    it("should render FlatList with 3 placeholder items and correct configuration", () => {
      render(<ObbCreatedBetsCardGroupPlaceholder />);

      const swimlaneCall = ScrollableSwimlane.mock.calls[0][0];
      const flatListProps = swimlaneCall.children.props;

      expect(flatListProps.data).toEqual([{ id: "placeholder-1" }, { id: "placeholder-2" }, { id: "placeholder-3" }]);
      expect(flatListProps.horizontal).toBe(true);
      expect(flatListProps.showsHorizontalScrollIndicator).toBe(false);
      expect(flatListProps.pagingEnabled).toBe(false);
      expect(flatListProps.snapToInterval).toBeDefined();
      expect(flatListProps.decelerationRate).toBe(0.98);
    });

    it("should provide keyExtractor that returns item id", () => {
      render(<ObbCreatedBetsCardGroupPlaceholder />);

      const swimlaneCall = ScrollableSwimlane.mock.calls[0][0];
      const { keyExtractor } = swimlaneCall.children.props;

      expect(keyExtractor({ id: "test-id" })).toBe("test-id");
    });

    it("should provide getItemLayout with correct offset calculation", () => {
      render(<ObbCreatedBetsCardGroupPlaceholder />);

      const swimlaneCall = ScrollableSwimlane.mock.calls[0][0];
      const { getItemLayout } = swimlaneCall.children.props;

      const layout0 = getItemLayout(null, 0);
      expect(layout0.index).toBe(0);
      expect(layout0.offset).toBe(0);

      const layout1 = getItemLayout(null, 1);
      expect(layout1.index).toBe(1);
      expect(layout1.offset).toBeGreaterThan(0);
    });

    it("should render placeholder cards for each item", () => {
      render(<ObbCreatedBetsCardGroupPlaceholder />);

      const swimlaneCall = ScrollableSwimlane.mock.calls[0][0];
      const { renderItem, data } = swimlaneCall.children.props;

      data.forEach((item, index) => {
        renderItem({ item, index });
      });

      expect(ObbCreatedBetsCardPlaceholder).toHaveBeenCalledTimes(3);
    });
  });
});
