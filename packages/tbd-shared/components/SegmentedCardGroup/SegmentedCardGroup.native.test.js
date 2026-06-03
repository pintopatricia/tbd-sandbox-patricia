import { render } from "@testing-library/react-native";
import { ScrollableSwimlane } from "@ppb/the-wall-native";
import ConnectedGamingCardGroup from "../GamingCardGroup";
import GamingCardGroup from "../GamingCardGroup/GamingCardGroup.native";
import SegmentedCardGroup from "./SegmentedCardGroup.native";
import SegmentedCardGroupPlaceholder from "./SegmentedCardGroupPlaceholder.native";
import styles from "./SegmentedCardGroup.native.styles";
import { useNativeLazyLoading } from "../../hooks/useNativeLazyLoading.native";
import { FlatList } from "../FlatList.native";

jest.mock("../GamingCardGroup", () => jest.fn(() => <connected-cardgroup-mock />));
jest.mock("../GamingCardGroup/GamingCardGroup.native", () => jest.fn(() => <cardgroup-mock />));
jest.mock("./SegmentedCardGroupPlaceholder.native", () => jest.fn(() => <segmented-card-group-placeholder-mock />));
jest.mock("@ppb/the-wall-native", () => ({
  ScrollableSwimlane: jest.fn(({ children }) => <scrollable-mock>{children}</scrollable-mock>),
}));
jest.mock("../FlatList.native", () => ({
  FlatList: jest.fn(() => <flatlist-mock />),
}));

const mockLazyLoading = jest.fn();
jest.mock("../../hooks/useNativeLazyLoading.native", () => ({
  useNativeLazyLoading: jest.fn(() => mockLazyLoading),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  spacings: {},
  typography: {
    "typography-h158": { lineHeight: 0 },
  },
  heights: {},
  gutters: {},
  tokens: {},
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

const dispatchFetchCards = jest.fn();
function renderSegmentedCardGroup(zones) {
  return render(<SegmentedCardGroup zones={zones} dispatchFetchCards={dispatchFetchCards} />);
}

const zones = [
  { urn: "1", typename: "typename" },
  { urn: "2", typename: "typename" },
  { urn: "3", typename: "typename" },
];

describe("Segmented Card Group", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when there are no urns", () => {
    it("should render empty component", () => {
      renderSegmentedCardGroup([]);

      expect(ConnectedGamingCardGroup).not.toHaveBeenCalled();
      expect(ScrollableSwimlane).not.toHaveBeenCalled();
    });
  });

  describe("when there are urns", () => {
    beforeEach(() => {
      renderSegmentedCardGroup(zones);
    });

    it("should render a flatlist wrapped in a swipeable swimlane", () => {
      expect(ScrollableSwimlane).toHaveBeenCalledWith({ children: expect.any(Object) }, undefined);

      expect(FlatList).toHaveBeenCalledWith(
        {
          data: zones,
          renderItem: expect.any(Function),
          horizontal: true,
          contentContainerStyle: [styles.scrollSection, styles.scrollableContainer],
          onViewableItemsChanged: mockLazyLoading,
        },
        undefined,
      );
    });

    it("should define lazy loading callback", () => {
      expect(useNativeLazyLoading).toHaveBeenCalledWith(
        [
          { urn: "1", typename: "typename" },
          { urn: "2", typename: "typename" },
          { urn: "3", typename: "typename" },
        ],
        dispatchFetchCards,
      );
    });

    it("should render the first card with renderItem", () => {
      const { renderItem } = FlatList.mock.calls[0][0];

      // first card
      const firstSwimlaneItemComponent = renderItem({ item: { urn: "urn" } });
      render(firstSwimlaneItemComponent);

      // when we render the item it should call ConnectedCardGroup
      expect(ConnectedGamingCardGroup).toHaveBeenCalledWith(
        {
          urn: "urn",
          component: GamingCardGroup,
          placeholder: SegmentedCardGroupPlaceholder,
          isSegmented: true,
        },
        undefined,
      );
    });
  });
});
