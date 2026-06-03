import { render } from "@testing-library/react-native";
import { ScrollableSwimlane } from "@ppb/the-wall-native";
import ObbOnboardingCardsCardGroupPlaceholder from "./ObbOnboardingCardsCardGroupPlaceholder.native";
import ObbOnboardingCardPlaceholder from "../../ObbOnboardingCard/placeholder/ObbOnboardingCardPlaceholder.native";

jest.mock("@ppb/the-wall-native", () => ({
  ScrollableSwimlane: jest.fn(({ children, ...props }) => (
    <scrollable-swimlane-mock {...props}>{children}</scrollable-swimlane-mock>
  )),
}));

jest.mock("../../ObbOnboardingCard/placeholder/ObbOnboardingCardPlaceholder.native", () =>
  jest.fn(() => <obb-onboarding-card-placeholder-mock />),
);

describe("ObbOnboardingCardsCardGroupPlaceholder - Native", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when component renders", () => {
    it("should render ScrollableSwimlane with empty title", () => {
      render(<ObbOnboardingCardsCardGroupPlaceholder />);

      expect(ScrollableSwimlane).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "",
        }),
        undefined,
      );
    });

    it("should render FlatList with 3 placeholder items and correct configuration", () => {
      render(<ObbOnboardingCardsCardGroupPlaceholder />);

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
      render(<ObbOnboardingCardsCardGroupPlaceholder />);

      const swimlaneCall = ScrollableSwimlane.mock.calls[0][0];
      const { keyExtractor } = swimlaneCall.children.props;

      expect(keyExtractor({ id: "test-id" })).toBe("test-id");
    });

    it("should provide getItemLayout with correct offset calculation", () => {
      render(<ObbOnboardingCardsCardGroupPlaceholder />);

      const swimlaneCall = ScrollableSwimlane.mock.calls[0][0];
      const { getItemLayout } = swimlaneCall.children.props;

      const layout0 = getItemLayout(null, 0);
      expect(layout0.index).toBe(0);
      expect(layout0.offset).toBe(0);

      const layout1 = getItemLayout(null, 1);
      expect(layout1.index).toBe(1);
      expect(layout1.offset).toBeGreaterThan(0);
    });

    it("should render an inner card placeholder for each item", () => {
      render(<ObbOnboardingCardsCardGroupPlaceholder />);

      const swimlaneCall = ScrollableSwimlane.mock.calls[0][0];
      const { renderItem, data } = swimlaneCall.children.props;

      render(renderItem({ item: data[0], index: 0 }));

      expect(ObbOnboardingCardPlaceholder).toHaveBeenCalled();
    });
  });
});
