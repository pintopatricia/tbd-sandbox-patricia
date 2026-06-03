import "jest-extended";
import { useRef } from "react";
import "jest-dom/extend-expect";
import { act, render } from "@testing-library/react-native";
import { ScrollableSwimlane } from "@ppb/the-wall-native";
import ConnectedCard from "../Card";
import Card from "../Card/Card.native";
import HalfTimeSpecialsSwimlaneCardGroup from "./HalfTimeSpecialsSwimlaneCardGroup.native";
import styles from "./HalfTimeSpecialsSwimlaneCardGroup.native.styles";
import { useNativeLazyLoading } from "../../hooks/useNativeLazyLoading.native";
import { FlatList } from "../FlatList.native";
import { ANIMATED_ICON_CONTAINER } from "./snowflakes/AnimatedIcon/AnimatedIcon.native.selectors";
import LinearView from "@ppb/the-wall-native/helpers/LinearView";

const scrollToIndexSpy = jest.fn();

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useRef: jest.fn((input) => ({ current: input })),
}));

jest.mock("../Card/", () => jest.fn(() => <connected-card-mock />));
jest.mock("../Card/Card.native", () => ({
  __esModule: true,
  default: jest.fn(() => <card-mock />),
  isCardImplemented: jest.fn(() => true),
}));

jest.mock("@ppb/the-wall-native", () => ({
  TBDImage: jest.fn(() => <image-mock />),
  ScrollableSwimlane: jest.fn(({ children, ref, ...props }) => (
    <scrollable-swimlane-mock {...props}>{children}</scrollable-swimlane-mock>
  )),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("@ppb/the-wall-native/helpers/LinearView", () => ({
  __esModule: true,
  default: jest.fn(({ children, ...props }) => <linear-view-mock {...props}>{children}</linear-view-mock>),
}));

jest.mock("../FlatList.native", () => ({
  FlatList: jest.fn(() => <flatlist-mock />),
}));

jest.mock("../../hooks/useCardVisibility.native", () => ({
  CARD_VIEWABILITY_CONFIG: { itemVisiblePercentThreshold: 1 },
  useCardVisibility: jest.fn(() => ({
    viewabilityConfig: {
      waitForInteraction: 1000,
      itemVisiblePercentThreshold: 1,
    },
  })),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  widths: { "swimlane-item-container-max-width": 750, "swimlane-item-container-width-percentage": 1 },
  heights: {},
  spacings: {},
  typography: {},
  gutters: {},
  tokens: {
    HalfTimePulseCardBackgroundColour: "mock-half-time-pulse-card-background-colour",
    HalfTimePulseCardBackgroundHighlightedColour: "mock-half-time-pulse-card-background-highlighted-colour",
  },
}));

const mockLazyLoading = jest.fn();
jest.mock("../../hooks/useNativeLazyLoading.native", () => ({
  useNativeLazyLoading: jest.fn(() => mockLazyLoading),
}));

jest.mock("react-native-reanimated", () => require("react-native-reanimated/mock"));

const mockNavigate = jest.fn();
jest.mock("@ppb/tbd-router/native", () => ({ navigate: (viewLink) => mockNavigate(viewLink) }));

const dispatchFetchCards = jest.fn();

function renderHalfTimeSpecialsSwimlaneCardGroup(props) {
  // Using forwardRef always log errors
  const spy = jest.spyOn(console, "error").mockImplementation(() => null);

  const result = render(<HalfTimeSpecialsSwimlaneCardGroup {...props} />);

  spy.mockRestore();

  return result;
}

describe("HalfTimeSwimlaneCardGroup", () => {
  beforeEach(jest.clearAllMocks);

  it("should render scrollable swimlane", () => {
    renderHalfTimeSpecialsSwimlaneCardGroup({
      title: "Half-Time Specials",
      subtitle: "Subtitle",
      items: [
        { urn: "1", typename: "typename" },
        { urn: "2", typename: "typename" },
        { urn: "3", typename: "typename" },
      ],
      cardgroupURN: "randomURN",
      displayMode: "SCROLLABLE",
      dispatchFetchCards,
    });

    expect(ScrollableSwimlane).toHaveBeenCalledWith(expect.objectContaining({}), undefined);

    expect(FlatList).toHaveBeenCalledWith(
      {
        data: [
          { urn: "1", typename: "typename" },
          { urn: "2", typename: "typename" },
          { urn: "3", typename: "typename" },
        ],
        getItemLayout: expect.any(Function),
        renderItem: expect.any(Function),
        horizontal: true,
        contentContainerStyle: styles.scrollableContainer,
        viewabilityConfigCallbackPairs: [
          {
            viewabilityConfig: {
              itemVisiblePercentThreshold: 1,
              waitForInteraction: 1000,
            },
          },
          {
            onViewableItemsChanged: mockLazyLoading,
            viewabilityConfig: {
              itemVisiblePercentThreshold: 1,
            },
          },
        ],
        onLayout: expect.any(Function),
        onScrollToIndexFailed: expect.any(Function),
        initialNumToRender: 3,
        listRef: { current: null },
      },
      undefined,
    );
  });

  it("should render the animated icon", () => {
    const component = renderHalfTimeSpecialsSwimlaneCardGroup({
      title: "Half-Time Specials",
      subtitle: "Subtitle",
      items: [
        { urn: "1", typename: "typename" },
        { urn: "2", typename: "typename" },
        { urn: "3", typename: "typename" },
      ],
      cardgroupURN: "randomURN",
      displayMode: "SCROLLABLE",
    });
    expect(component.queryByTestId(ANIMATED_ICON_CONTAINER)).toBeDefined();
  });

  describe("scrollToIndex", () => {
    beforeEach(() => {
      useRef.mockReturnValue({
        current: { scrollToIndex: scrollToIndexSpy },
      });
    });
    it("should scroll to scrollToIndex index value when it is smaller than items length", () => {
      renderHalfTimeSpecialsSwimlaneCardGroup({
        title: "Half-Time Specials",
        subtitle: "Subtitle",
        items: [
          { urn: "1", typename: "typename" },
          { urn: "2", typename: "typename" },
          { urn: "3", typename: "typename" },
          { urn: "4", typename: "typename" },
          { urn: "5", typename: "typename" },
        ],
        cardgroupURN: "randomURN",
        displayMode: "SCROLLABLE",
        scrollIntoIndex: 2,
        dispatchFetchCards,
      });

      expect(FlatList).toHaveBeenCalled();

      act(() => FlatList.mock.calls[0][0].onLayout());

      expect(scrollToIndexSpy).toHaveBeenCalledWith({ index: 2, viewOffset: 30, viewPosition: 0 });
    });

    it("should scroll to the last item index when scrollToIndex is bigger than items length", () => {
      renderHalfTimeSpecialsSwimlaneCardGroup({
        title: "Half-Time Specials",
        subtitle: "Subtitle",
        items: [
          { urn: "1", typename: "typename" },
          { urn: "2", typename: "typename" },
          { urn: "3", typename: "typename" },
          { urn: "4", typename: "typename" },
          { urn: "5", typename: "typename" },
        ],
        cardgroupURN: "randomURN",
        displayMode: "SCROLLABLE",
        scrollIntoIndex: 10,
        dispatchFetchCards,
      });

      expect(FlatList).toHaveBeenCalled();

      act(() => FlatList.mock.calls[0][0].onLayout());

      expect(scrollToIndexSpy).toHaveBeenCalledWith({ index: 4, viewOffset: 30, viewPosition: 0 });
    });

    it("should not scroll if scrollIntoIndex is undefined", () => {
      renderHalfTimeSpecialsSwimlaneCardGroup({
        title: "Half-Time Specials",
        subtitle: "Subtitle",
        items: [
          { urn: "1", typename: "typename" },
          { urn: "2", typename: "typename" },
          { urn: "3", typename: "typename" },
          { urn: "4", typename: "typename" },
          { urn: "5", typename: "typename" },
        ],
        cardgroupURN: "randomURN",
        displayMode: "SCROLLABLE",
        scrollIntoIndex: undefined,
        dispatchFetchCards,
      });

      expect(ScrollableSwimlane).toHaveBeenCalled();

      expect(scrollToIndexSpy).not.toHaveBeenCalled();
    });

    it("should apply the correct layout at the latest card", () => {
      renderHalfTimeSpecialsSwimlaneCardGroup({
        title: "Half-Time Specials",
        subtitle: "Subtitle",
        items: [
          { urn: "1", typename: "typename" },
          { urn: "2", typename: "typename" },
          { urn: "3", typename: "typename" },
          { urn: "4", typename: "typename" },
          { urn: "5", typename: "typename" },
        ],
        cardgroupURN: "randomURN",
        displayMode: "SCROLLABLE",
        scrollIntoIndex: 10,
        dispatchFetchCards,
      });

      expect(FlatList).toHaveBeenCalled();

      const { renderItem } = FlatList.mock.calls[0][0];

      const lastSwimlaneItemComponent = renderItem({ item: { urn: "urn", typename: "Card" }, index: 4 });

      render(lastSwimlaneItemComponent);

      expect(lastSwimlaneItemComponent.props.style).toContain(styles.swimlaneCardGroupLastItem);
    });

    it("shouldn't apply the style to the latest card when has item of SportViewLinkCard", () => {
      renderHalfTimeSpecialsSwimlaneCardGroup({
        title: "Half-Time Specials",
        subtitle: "Subtitle",
        items: [
          { urn: "1", typename: "SportViewLinkCard" },
          { urn: "2", typename: "SportViewLinkCard" },
          { urn: "3", typename: "SportViewLinkCard" },
          { urn: "4", typename: "SportViewLinkCard" },
          { urn: "5", typename: "SportViewLinkCard" },
        ],
        cardgroupURN: "randomURN",
        displayMode: "SCROLLABLE",
        scrollIntoIndex: 10,
        dispatchFetchCards,
      });

      expect(FlatList).toHaveBeenCalled();

      const { renderItem } = FlatList.mock.calls[0][0];

      const lastSwimlaneItemComponent = renderItem({ item: { urn: "urn", typename: "SportViewLinkCard" }, index: 4 });

      render(lastSwimlaneItemComponent);

      expect(lastSwimlaneItemComponent.props.style).not.toContain(styles.swimlaneCardGroupLastItem);
    });
  });

  it("should render the first card with renderItem", () => {
    renderHalfTimeSpecialsSwimlaneCardGroup({
      title: "Half-Time Specials",
      subtitle: "Subtitle",
      items: [
        { urn: "1", typename: "typename" },
        { urn: "2", typename: "typename" },
        { urn: "3", typename: "typename" },
      ],
      cardgroupURN: "randomURN",
      displayMode: "SNAP",
      dispatchFetchCards,
    });

    const { renderItem } = FlatList.mock.calls[0][0];

    const firstSwimlaneItemComponent = renderItem({ item: { urn: "urn", typename: "Card" }, index: 0 });

    render(firstSwimlaneItemComponent);

    expect(ConnectedCard).toHaveBeenCalledWith({ urn: "urn", typename: "Card", component: Card }, undefined);
  });

  describe("layout calculator", () => {
    describe("when there is no fixed width", () => {
      it("should not call the ScrollableSwimlane with getItemlayout", () => {
        renderHalfTimeSpecialsSwimlaneCardGroup({
          items: [{ urn: "1", typename: "MatchStatsCard" }],
          cardgroupURN: "randomURN",
          displayMode: "SNAP",
          dispatchFetchCards,
        });

        expect(ScrollableSwimlane).not.toHaveBeenCalledWith(
          expect.objectContaining({ getItemLayout: expect.any(Function) }),
        );
      });
    });

    describe("when there is a fixed width", () => {
      it("should return a calculated layout", () => {
        renderHalfTimeSpecialsSwimlaneCardGroup({
          title: "Today",
          // There's only fixed width on a swimlane when we have more than one card (with 1 card it adjust to the screen)
          items: [
            { urn: "1", typename: "typename" },
            { urn: "2", typename: "typename" },
          ],
          cardgroupURN: "randomURN",
          displayMode: "SNAP",
          dispatchFetchCards,
        });

        const { getItemLayout } = FlatList.mock.calls[0][0];
        expect(getItemLayout({ urn: "urn" }, 2)).toEqual({ length: 750, offset: 1500, index: 2 });
      });
    });
  });

  describe("when isHighlighted is true", () => {
    it("should apply highlighted styles to container", () => {
      renderHalfTimeSpecialsSwimlaneCardGroup({
        title: "Today",
        items: [
          { urn: "1", typename: "typename" },
          { urn: "2", typename: "typename" },
          { urn: "3", typename: "typename" },
        ],
        cardgroupURN: "randomURN",
        displayMode: "SNAP",
        isHighlighted: true,
        dispatchFetchCards,
      });

      const props = LinearView.mock.calls[0][0];

      expect(props.background).toBe("mock-half-time-pulse-card-background-highlighted-colour");
      expect(props.style).toEqual([styles.container, styles.highlightedContainer]);
    });
  });
});

it("should define lazy loading callback", () => {
  renderHalfTimeSpecialsSwimlaneCardGroup({
    title: "Today",
    items: [
      { urn: "1", typename: "typename" },
      { urn: "2", typename: "typename" },
      { urn: "3", typename: "typename" },
    ],
    cardgroupURN: "randomURN",
    displayMode: "SNAP",
    dispatchFetchCards,
  });

  expect(useNativeLazyLoading).toHaveBeenCalledWith(
    [
      { urn: "1", typename: "typename" },
      { urn: "2", typename: "typename" },
      { urn: "3", typename: "typename" },
    ],
    dispatchFetchCards,
  );
});

describe("Promotion Card", () => {
  beforeEach(() => {
    renderHalfTimeSpecialsSwimlaneCardGroup({
      title: "Today",
      items: [
        { urn: "1", typename: "PromotionCard" },
        { urn: "2", typename: "PromotionCard" },
        { urn: "3", typename: "PromotionCard" },
      ],
      cardgroupURN: "randomURN",
      displayMode: "SNAP",
      dispatchFetchCards,
    });
  });

  it("should define generic styles for first card", () => {
    const { renderItem } = FlatList.mock.calls[0][0];

    // first card
    const firstSwimlaneItemComponent = renderItem({ item: { urn: "1", typename: "PromotionCard" } });

    render(firstSwimlaneItemComponent);
    expect(firstSwimlaneItemComponent.props.style).toIncludeAllPartialMembers([styles.swimlaneCardGroupItem]);
  });
});

describe("when there are no urns", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render empty component", () => {
    renderHalfTimeSpecialsSwimlaneCardGroup({
      title: "Half-Time Specials",
      subtitle: "Subtitle",
      items: [],
      cardgroupURN: "randomURN",
      displayMode: "SNAP",
      dispatchFetchCards,
    });

    expect(ConnectedCard).not.toHaveBeenCalled();
    expect(ScrollableSwimlane).not.toHaveBeenCalled();
  });
});

describe("when there is a hidden card", () => {
  beforeEach(() => {
    useRef.mockImplementation((input) => ({
      current: input,
    }));
  });

  it("should send the correct viewabilityConfigPair", () => {
    const dispatchClearBettingSpy = jest.fn();

    renderHalfTimeSpecialsSwimlaneCardGroup({
      title: "Favourite Sports",
      items: [{ urn: "1", typename: "SportViewLinkCard" }],
      cardgroupURN: "randomURN",
      currentRunner: "runner:urn:something",
      displayMode: "SNAP",
      dispatchFetchCards,
      dispatchClearBetting: dispatchClearBettingSpy,
    });

    const { viewabilityConfigCallbackPairs } = FlatList.mock.calls[0][0];

    expect(viewabilityConfigCallbackPairs).toEqual([
      { viewabilityConfig: { itemVisiblePercentThreshold: 1, waitForInteraction: 1000 } },
      { onViewableItemsChanged: mockLazyLoading, viewabilityConfig: { itemVisiblePercentThreshold: 1 } },
    ]);
  });
});
