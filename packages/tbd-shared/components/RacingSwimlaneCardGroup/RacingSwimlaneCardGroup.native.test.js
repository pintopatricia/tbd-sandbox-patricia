import "jest-extended";
import { useRef } from "react";
import { render } from "@testing-library/react-native";
import { ScrollableSwimlane } from "@ppb/the-wall-native";
import ConnectedCard from "../Card";
import { FlatList } from "../FlatList.native";
import Card from "../Card/Card.native";
import RacingSwimlaneCardGroup from "./RacingSwimlaneCardGroup.native";
import styles from "./RacingSwimlaneCardGroup.native.styles";
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
  spacings: { "spacing-3": 10 },
}));

const itemsMock = [
  { urn: "urn1", typename: "RaceMarketCard" },
  { urn: "urn2", typename: "RaceMarketCard" },
  { urn: "urn3", typename: "RaceMarketCard" },
];

const mockLazyLoading = jest.fn();
jest.mock("../../hooks/useNativeLazyLoading.native", () => ({
  useNativeLazyLoading: jest.fn(() => mockLazyLoading),
}));

jest.mock("react-redux", () => ({
  useSelector: jest.fn(() => undefined),
}));

const mockNavigate = jest.fn();
jest.mock("@ppb/tbd-router/native", () => ({ navigate: (viewLink) => mockNavigate(viewLink) }));

const dispatchFetchCards = jest.fn();
const onPressMock = jest.fn();
const dispatchViewAllTap = jest.fn();
const dispatchFetchCardsAction = jest.fn();

const viewAllMock = { label: "Some Label", viewLink: { viewUrn: "ppb:some:urn", viewUrl: "some/url" } };

function renderRacingSwimlaneCardGroup(props) {
  const spy = jest.spyOn(console, "error").mockImplementation(() => null);

  const result = render(<RacingSwimlaneCardGroup {...props} />);

  spy.mockRestore();

  return result;
}

describe("RacingSwimlaneCardGroup", () => {
  beforeEach(jest.clearAllMocks);

  it("should render a ScrollableSwimlane", () => {
    const props = {
      title: "Today",
      items: itemsMock,
      cardgroupURN: "randomURN",
      dispatchFetchCards,
      viewAll: viewAllMock,
      onNavLinkPress: onPressMock,
    };

    renderRacingSwimlaneCardGroup(props);

    expect(ScrollableSwimlane).toHaveBeenCalledWith(
      {
        title: "Today",
        navLink: viewAllMock,
        onNavLinkPress: expect.any(Function),
        children: expect.any(Object),
      },
      undefined,
    );

    expect(FlatList).toHaveBeenCalledWith(
      expect.objectContaining({
        listRef: { current: null },
        data: itemsMock,
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
        getItemLayout: expect.any(Function),
      }),
      undefined,
    );
  });

  it("should render the items with renderItem and call ConnectedCard", () => {
    renderRacingSwimlaneCardGroup({
      title: "Today",
      items: itemsMock,
      cardgroupURN: "randomURN",
      displayMode: "SNAP",
      dispatchFetchCards,
    });

    const { renderItem } = FlatList.mock.calls[0][0];
    const itemComponent = renderItem({ item: { urn: "urn", typename: "Card" }, index: 0 });

    render(itemComponent);

    expect(ConnectedCard).toHaveBeenCalledWith({ urn: "urn", typename: "Card", component: Card }, undefined);
  });

  describe("layout calculator", () => {
    it("should return a calculated layout", () => {
      renderRacingSwimlaneCardGroup({
        title: "Today",
        items: [itemsMock[0], itemsMock[1]],
        cardgroupURN: "randomURN",
        dispatchFetchCards,
      });

      const { getItemLayout } = FlatList.mock.calls[0][0];
      expect(getItemLayout({ urn: "urn" }, 2)).toEqual({ length: 760, offset: 1520, index: 2 });
    });
  });

  describe("when the ScrollableSwimlane nav link is pressed", () => {
    describe("but there is no viewAll prop", () => {
      it("should not navigate", () => {
        renderRacingSwimlaneCardGroup({
          title: "Today",
          items: itemsMock,
          cardgroupURN: "randomURN",
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
      it("should navigate with the expected values", () => {
        renderRacingSwimlaneCardGroup({
          title: "Today",
          items: itemsMock,
          cardgroupURN: "randomURN",
          dispatchFetchCards,
          viewAll: viewAllMock,
          onNavLinkPress: onPressMock,
          dispatchViewAllTap,
        });

        ScrollableSwimlane.mock.calls[0][0].onNavLinkPress(viewAllMock);

        expect(dispatchViewAllTap).toHaveBeenCalledWith({
          title: "Today",
          viewAll: viewAllMock,
          cardgroupURN: "randomURN",
        });
        expect(mockNavigate).toHaveBeenCalledWith({ viewUrn: "ppb:some:urn", viewUrl: "some/url" });
      });
    });
  });

  it("should define lazy loading callback", () => {
    renderRacingSwimlaneCardGroup({
      title: "Today",
      items: itemsMock,
      cardgroupURN: "randomURN",
      displayMode: "SNAP",
      dispatchFetchCards,
    });

    expect(useNativeLazyLoading).toHaveBeenCalledWith(itemsMock, dispatchFetchCards);
  });

  describe("useRefreshComponent", () => {
    describe("when refresh is triggered before 140 seconds", () => {
      it("should not call dispatchFetchCardsAction", () => {
        renderRacingSwimlaneCardGroup({
          items: itemsMock,
          cardgroupURN: "randomURN",
          dispatchFetchCardsAction,
        });

        jest.useFakeTimers();
        jest.advanceTimersByTime(139000);

        renderRacingSwimlaneCardGroup({
          items: itemsMock,
          cardgroupURN: "randomURN",
          dispatchFetchCardsAction,
        });

        expect(dispatchFetchCardsAction).not.toHaveBeenCalled();
      });
    });

    describe("when refresh is triggered after 140 seconds", () => {
      it("should call dispatchFetchCardsAction", () => {
        renderRacingSwimlaneCardGroup({
          items: itemsMock,
          cardgroupURN: "randomURN",
          dispatchFetchCardsAction,
        });

        jest.useFakeTimers();
        jest.advanceTimersByTime(141000);

        renderRacingSwimlaneCardGroup({
          items: itemsMock,
          cardgroupURN: "randomURN",
          dispatchFetchCardsAction,
        });

        expect(dispatchFetchCardsAction).toHaveBeenCalledWith("randomURN");
      });
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

      renderRacingSwimlaneCardGroup({
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
