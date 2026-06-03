import "jest-extended";
import React, { useRef } from "react";
import { render } from "@testing-library/react-native";
import { Dimensions } from "react-native";
import { ScrollableSwimlane } from "@ppb/the-wall-native";
import ConnectedCard from "../Card";
import { FlatList } from "../FlatList.native";
import Card from "../Card/Card.native";
import PopularSwimlaneCardGroup from "./PopularSwimlaneCardGroup.native";
import styles from "./PopularSwimlaneCardGroup.native.styles";
import { useNativeLazyLoading } from "../../hooks/useNativeLazyLoading.native";

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
  widths: { "swimlane-item-container-max-width": 750, "swimlane-item-container-width-percentage": 1 },
  spacings: { "spacing-3": 12 },
}));

const itemsMock = [
  { urn: "urn1", typename: "PopularBetBuilderCard" },
  { urn: "urn2", typename: "PopularBetBuilderCard" },
  { urn: "urn3", typename: "PopularBetBuilderCard" },
];

const mockLazyLoading = jest.fn();
jest.mock("../../hooks/useNativeLazyLoading.native", () => ({
  useNativeLazyLoading: jest.fn(() => mockLazyLoading),
}));

const dispatchFetchCards = jest.fn();
const dispatchFetchCardsAction = jest.fn();

const defaultProps = {
  title: "Popular",
  items: itemsMock,
  cardgroupURN: "randomURN",
  dispatchFetchCards,
};

function renderPopularSwimlaneCardGroup(props) {
  const spy = jest.spyOn(console, "error").mockImplementation(() => null);

  const result = render(<PopularSwimlaneCardGroup {...props} />);

  spy.mockRestore();

  return result;
}

describe("PopularSwimlaneCardGroup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Dimensions, "get").mockReturnValue({ width: 375, height: 667 });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should render a ScrollableSwimlane", () => {
    renderPopularSwimlaneCardGroup(defaultProps);

    expect(ScrollableSwimlane).toHaveBeenLastCalledWith(
      {
        title: "Popular",
        children: expect.any(Object),
      },
      undefined,
    );

    expect(FlatList).toHaveBeenLastCalledWith(
      expect.objectContaining({
        listRef: { current: null },
        data: itemsMock,
        renderItem: expect.any(Function),
        horizontal: true,
        bounces: false,
        decelerationRate: 0.98,
        snapToInterval: expect.any(Number),
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
        getItemLayout: expect.any(Function),
      }),
      undefined,
    );
  });

  it("should render the items with renderItem and call ConnectedCard", () => {
    renderPopularSwimlaneCardGroup(defaultProps);

    const { renderItem } = FlatList.mock.calls[0][0];
    const itemComponent = renderItem({ item: { urn: "urn", typename: "Card" }, index: 0 });

    render(itemComponent);

    expect(ConnectedCard).toHaveBeenCalledWith({ urn: "urn", typename: "Card", component: Card }, undefined);
  });

  describe("layout calculator", () => {
    describe("when there is no fixed width", () => {
      it("should not call the ScrollableSwimlane with getItemlayout", () => {
        renderPopularSwimlaneCardGroup({
          title: "Popular",
          items: [itemsMock[0]],
          cardgroupURN: "randomURN",
          dispatchFetchCards,
        });

        expect(ScrollableSwimlane).not.toHaveBeenCalledWith(
          expect.objectContaining({ getItemLayout: expect.any(Function) }),
        );
      });
    });

    describe("when there is a fixed width", () => {
      it("should return a calculated layout", () => {
        renderPopularSwimlaneCardGroup({
          title: "Popular",
          items: [itemsMock[0], itemsMock[1]],
          cardgroupURN: "randomURN",
          dispatchFetchCards,
        });

        const { getItemLayout } = FlatList.mock.calls[0][0];
        expect(getItemLayout({ urn: "urn" }, 2)).toEqual({ length: 750, offset: 1500, index: 2 });
      });
    });
  });

  it("should define lazy loading callback", () => {
    renderPopularSwimlaneCardGroup(defaultProps);

    expect(useNativeLazyLoading).toHaveBeenCalledWith(itemsMock, dispatchFetchCards);
  });

  describe("useRefreshComponent", () => {
    describe("when refresh is triggered before 140 seconds", () => {
      it("should not call dispatchFetchCardsAction", () => {
        renderPopularSwimlaneCardGroup({
          items: itemsMock,
          cardgroupURN: "randomURN",
          dispatchFetchCardsAction,
        });

        jest.useFakeTimers();
        jest.advanceTimersByTime(139000);

        renderPopularSwimlaneCardGroup({
          items: itemsMock,
          cardgroupURN: "randomURN",
          dispatchFetchCardsAction,
        });

        expect(dispatchFetchCardsAction).not.toHaveBeenCalled();
      });
    });

    describe("when refresh is triggered after 140 seconds", () => {
      it("should call dispatchFetchCardsAction", () => {
        renderPopularSwimlaneCardGroup({
          items: itemsMock,
          cardgroupURN: "randomURN",
          dispatchFetchCardsAction,
        });

        jest.useFakeTimers();
        jest.advanceTimersByTime(141000);

        renderPopularSwimlaneCardGroup({
          items: itemsMock,
          cardgroupURN: "randomURN",
          dispatchFetchCardsAction,
        });

        expect(dispatchFetchCardsAction).toHaveBeenCalledWith("randomURN");
      });
    });
  });

  describe("when visible prop changes", () => {
    it("should pass visible prop to ConnectedCard", () => {
      renderPopularSwimlaneCardGroup({
        title: "Popular",
        items: [{ urn: "urn1", typename: "PopularBetBuilderCard", visible: false }],
        cardgroupURN: "randomURN",
        dispatchFetchCards,
        visible: false,
      });

      const { renderItem } = FlatList.mock.calls[0][0];
      const itemComponent = renderItem({
        item: { urn: "urn1", typename: "PopularBetBuilderCard", visible: false },
        index: 0,
      });

      render(itemComponent);

      expect(ConnectedCard).toHaveBeenCalledWith(
        { urn: "urn1", typename: "PopularBetBuilderCard", component: Card, visible: false },
        undefined,
      );
    });
  });

  describe("when rendering last item", () => {
    it("should apply lastItem style to the last card", () => {
      renderPopularSwimlaneCardGroup({
        title: "Popular",
        items: [itemsMock[0], itemsMock[1]],
        cardgroupURN: "randomURN",
        dispatchFetchCards,
      });

      const { renderItem } = FlatList.mock.calls[0][0];
      const lastItem = renderItem({ item: itemsMock[1], index: 1 });

      expect(lastItem.props.style).toContain(styles.lastItem);
    });
  });
});
