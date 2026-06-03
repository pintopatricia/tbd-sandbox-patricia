import "jest-extended";
import { useRef } from "react";
import { act, render } from "@testing-library/react-native";
import { ScrollableSwimlane } from "@ppb/the-wall-native";
import ConnectedCard from "../Card";
import Card from "../Card/Card.native";
import SwimlaneCardGroup from "./SwimlaneCardGroup.native";
import styles from "./SwimlaneCardGroup.native.styles";
import { useNativeLazyLoading } from "../../hooks/useNativeLazyLoading.native";
import { FlatList } from "../FlatList.native";

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
}));

const mockLazyLoading = jest.fn();
jest.mock("../../hooks/useNativeLazyLoading.native", () => ({
  useNativeLazyLoading: jest.fn(() => mockLazyLoading),
}));

const mockNavigate = jest.fn();
jest.mock("@ppb/tbd-router/native", () => ({ navigate: (viewLink) => mockNavigate(viewLink) }));

const dispatchFetchCards = jest.fn();
const onPressMock = jest.fn();
const dispatchViewAllTap = jest.fn();

const viewAllMock = { label: "Some Label", viewLink: { viewUrn: "ppb:some:urn", viewUrl: "some/url" } };

function renderSwimlaneCardGroup(props) {
  // Using forwardRef always log errors
  const spy = jest.spyOn(console, "error").mockImplementation(() => null);

  const result = render(<SwimlaneCardGroup {...props} />);

  spy.mockRestore();

  return result;
}

describe("SwimlaneCardGroup", () => {
  beforeEach(jest.clearAllMocks);

  it("should render scrollable swimlane", () => {
    renderSwimlaneCardGroup({
      title: "Today",
      items: [
        { urn: "1", typename: "typename" },
        { urn: "2", typename: "typename" },
        { urn: "3", typename: "typename" },
      ],
      cardgroupURN: "randomURN",
      displayMode: "SCROLLABLE",
      dispatchFetchCards,
      isHighlighted: true,
      viewAll: viewAllMock,
      onNavLinkPress: onPressMock,
    });

    expect(ScrollableSwimlane).toHaveBeenCalledWith(
      {
        title: "Today",
        navLink: viewAllMock,
        onNavLinkPress: expect.any(Function),
        children: expect.any(Object),
        isHighlighted: true,
      },
      undefined,
    );

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

  describe("scrollToIndex", () => {
    beforeEach(() => {
      useRef.mockReturnValue({
        current: { scrollToIndex: scrollToIndexSpy },
      });
    });
    it("should scroll to scrollToIndex index value when it is smaller than items length", () => {
      renderSwimlaneCardGroup({
        title: "Today",
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
        viewAll: viewAllMock,
        onNavLinkPress: onPressMock,
      });

      expect(FlatList).toHaveBeenCalled();

      act(() => FlatList.mock.calls[0][0].onLayout());

      expect(scrollToIndexSpy).toHaveBeenCalledWith({ index: 2, viewOffset: 30, viewPosition: 0 });
    });

    it("should scroll to the last item index when scrollToIndex is bigger than items length", () => {
      renderSwimlaneCardGroup({
        title: "Today",
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
        viewAll: viewAllMock,
        onNavLinkPress: onPressMock,
      });

      expect(FlatList).toHaveBeenCalled();

      act(() => FlatList.mock.calls[0][0].onLayout());

      expect(scrollToIndexSpy).toHaveBeenCalledWith({ index: 4, viewOffset: 30, viewPosition: 0 });
    });

    it("should not scroll if scrollIntoIndex is undefined", () => {
      renderSwimlaneCardGroup({
        title: "Today",
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
        viewAll: viewAllMock,
        onNavLinkPress: onPressMock,
      });

      expect(ScrollableSwimlane).toHaveBeenCalled();

      expect(scrollToIndexSpy).not.toHaveBeenCalled();
    });

    it("should apply the correct layout at the latest card", () => {
      renderSwimlaneCardGroup({
        title: "Today",
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
        viewAll: viewAllMock,
        onNavLinkPress: onPressMock,
      });

      expect(FlatList).toHaveBeenCalled();

      const { renderItem } = FlatList.mock.calls[0][0];

      const lastSwimlaneItemComponent = renderItem({ item: { urn: "urn", typename: "Card" }, index: 4 });

      render(lastSwimlaneItemComponent);

      expect(lastSwimlaneItemComponent.props.style).toContain(styles.swimlaneCardGroupLastItem);
    });

    it("shouldn't apply the style to the latest card when has item of SportViewLinkCard", () => {
      renderSwimlaneCardGroup({
        title: "Today",
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
        viewAll: viewAllMock,
        onNavLinkPress: onPressMock,
      });

      expect(FlatList).toHaveBeenCalled();

      const { renderItem } = FlatList.mock.calls[0][0];

      const lastSwimlaneItemComponent = renderItem({ item: { urn: "urn", typename: "SportViewLinkCard" }, index: 4 });

      render(lastSwimlaneItemComponent);

      expect(lastSwimlaneItemComponent.props.style).not.toContain(styles.swimlaneCardGroupLastItem);
    });
  });

  it("should render the first card with renderItem", () => {
    renderSwimlaneCardGroup({
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

    const { renderItem } = FlatList.mock.calls[0][0];

    // first card
    const firstSwimlaneItemComponent = renderItem({ item: { urn: "urn", typename: "Card" }, index: 0 });

    render(firstSwimlaneItemComponent);

    // when we render the item it should call ConnectedCard
    expect(ConnectedCard).toHaveBeenCalledWith({ urn: "urn", typename: "Card", component: Card }, undefined);
  });

  describe("layout calculator", () => {
    describe("when there is no fixed width", () => {
      it("should not call the ScrollableSwimlane with getItemlayout", () => {
        renderSwimlaneCardGroup({
          title: "Today",
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
        renderSwimlaneCardGroup({
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

  describe("when a Swimlane ActionLink is pressed", () => {
    describe("and there is not a viewAll prop", () => {
      it("should not call navigate", () => {
        renderSwimlaneCardGroup({
          title: "Today",
          items: [
            { urn: "1", typename: "typename" },
            { urn: "2", typename: "typename" },
            { urn: "3", typename: "typename" },
          ],
          cardgroupURN: "randomURN",
          displayMode: "SNAP",
          dispatchFetchCards,
          viewAll: undefined,
          onNavLinkPress: onPressMock,
          dispatchViewAllTap,
        });

        ScrollableSwimlane.mock.calls[0][0].onNavLinkPress(viewAllMock);

        expect(dispatchViewAllTap).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });

    describe("and there is a viewAll prop", () => {
      it("should call navigate with the correct values", () => {
        renderSwimlaneCardGroup({
          title: "Today",
          items: [
            { urn: "1", typename: "typename" },
            { urn: "2", typename: "typename" },
            { urn: "3", typename: "typename" },
          ],
          cardgroupURN: "randomURN",
          displayMode: "SNAP",
          dispatchFetchCards,
          viewAll: viewAllMock,
          onNavLinkPress: onPressMock,
          dispatchViewAllTap,
        });

        ScrollableSwimlane.mock.calls[0][0].onNavLinkPress(viewAllMock);

        expect(dispatchViewAllTap).toHaveBeenCalledWith("Today", viewAllMock, "randomURN");
        expect(mockNavigate).toHaveBeenCalledWith({ viewUrn: "ppb:some:urn", viewUrl: "some/url" });
      });
    });
  });

  it("should define lazy loading callback", () => {
    renderSwimlaneCardGroup({
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
      renderSwimlaneCardGroup({
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

  describe("SportViewLinkCard", () => {
    beforeEach(() => {
      renderSwimlaneCardGroup({
        title: "Favourite Sports",
        items: [{ urn: "1", typename: "SportViewLinkCard" }],
        cardgroupURN: "randomURN",
        displayMode: "SNAP",
        dispatchFetchCards,
      });
    });

    it("should define sportViewLink styles", () => {
      const { renderItem } = FlatList.mock.calls[0][0];

      const firstSwimlaneItemComponent = renderItem({ item: { urn: "1", typename: "SportViewLinkCard" } });

      render(firstSwimlaneItemComponent);

      expect(firstSwimlaneItemComponent.props.style).toIncludeAllPartialMembers([styles.sportViewLink]);
    });
  });

  describe("when there are no urns", () => {
    it("should render empty component", () => {
      renderSwimlaneCardGroup({
        title: "Today",
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

      renderSwimlaneCardGroup({
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
});
