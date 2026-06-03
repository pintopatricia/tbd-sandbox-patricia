import { useRef } from "react";
import { render, act } from "@testing-library/react-native";

import { ModalHeader, PageHeader } from "@ppb/the-wall-native";
import { PageHeaderIcons } from "@ppb/the-wall-common/types";
import { goBack } from "@ppb/tbd-router";

import { GenericView } from "./GenericView.native";
import { GENERIC_VIEW_HEADER, GENERIC_VIEW_ITEMS } from "./GenericView.native.selectors";
import { useNativeLazyLoading } from "../../hooks/useNativeLazyLoading.native";
import styles from "./GenericView.native.styles";
import { FlatListWithOffsetContext } from "../FlatListWithOffsetContext/FlatListWithOffsetContext.native";
import { useStickyObserver } from "../../hooks/useStickyObserver.native";
import { ViewItem } from "../ViewItem/ViewItem.native";
import ConnectedBackNavigationItem from "../BackNavigationItem/index";
import { useGenericViewScrollListener } from "./generic-view-scroll-listener";

jest.mock("react", () => {
  const actualReact = jest.requireActual("react");

  return {
    ...actualReact,
    useRef: jest.fn(actualReact.useRef),
  };
});

jest.mock("@ppb/the-wall-native", () => ({
  ModalHeader: jest.fn(({ onDismiss }) => <modal-header onClick={onDismiss} />),
  PageHeader: jest.fn(() => <page-header-mock testID="page-header-mock" />),
}));

jest.mock("@ppb/tbd-router/native", () => ({
  goBack: jest.fn(),
  NativeEntityTypes: {
    HOME: "ppb:tbd:view:home",
  },
}));

const mockLazyLoading = jest.fn();
const mockSetVisibility = jest.fn();
jest.mock("../../hooks/useNativeLazyLoading.native", () => ({
  useNativeLazyLoading: jest.fn(() => mockLazyLoading),
  useVisibility: jest.fn(() => mockSetVisibility),
}));

jest.mock("../FlatListWithOffsetContext/FlatListWithOffsetContext.native", () => ({
  FlatListWithOffsetContext: jest.fn(() => <flat-list-mock></flat-list-mock>),
}));

jest.mock("../../hooks/useScrollIntoView.native", () => ({
  ...jest.requireActual("../../hooks/useScrollIntoView.native"),
  useScrollIntoViewUseScrollY: jest.fn().mockReturnValue([0, () => {}]),
}));

jest.mock("../../hooks/useStickyObserver.native", () => ({
  useStickyObserver: jest.fn().mockReturnValue({
    current: jest.fn(),
  }),
}));

jest.mock("./generic-view-scroll-listener", () => ({
  useGenericViewScrollListener: jest.fn(() => ({ onScroll: jest.fn() })),
}));

jest.mock("../PullRefresh", () => jest.fn(() => <connected-pull-refresh />));
jest.mock("../PullRefresh/PullRefresh.native", () => jest.fn(() => <pull-refresh-mock />));

jest.mock("../ViewItem/ViewItem.native", () => ({ ViewItem: jest.fn(() => <view-item-mock />) }));
jest.mock("../BackNavigationItem", () => jest.fn(() => <mock-back-nav-item data-testid="navigation-item" />));

const sportViewMock = {
  title: "Football",
  subtitle: "Subtitle",
  badge: PageHeaderIcons.ODDSONTHAT,
  urn: "fakeSportViewUrn",
  sport: "ppb:eventType:1",
  items: [
    { urn: "1", typename: "SwimlaneCardGroup" },
    { urn: "2", typename: "PebbleCardGroup" },
    { urn: "3", typename: "Card" },
    { urn: "4", typename: "CouponCardGroup" },
    { urn: "5", typename: "FilteredCouponCardGroup" },
  ],
};

const sportViewMockWithoutTitle = {
  title: "",
  urn: "fakeSportViewUrn",
  sport: "ppb:eventType:1",
  items: [
    { urn: "1", typename: "SwimlaneCardGroup" },
    { urn: "2", typename: "PebbleCardGroup" },
    { urn: "3", typename: "Card" },
    { urn: "5", typename: "FilteredCouponCardGroup" },
  ],
};

const sportViewMockWithStickyCards = {
  title: "",
  urn: "fakeSportViewUrn",
  sport: "ppb:eventType:1",
  items: [
    { urn: "1", typename: "RaceDetailsCard" },
    { urn: "2", typename: "FixtureCard" },
    {
      urn: "3",
      typename: "FixtureCard",
      red7Scoreboard: {
        fullURL: "https://example.com/red7/scoreboard",
        origin: "ppb:card:red7:scoreboard",
      },
    },
  ],
};

const sportViewMockWithCardsFollowedByStickyCards = {
  title: "",
  urn: "fakeSportViewUrn",
  sport: "ppb:eventType:1",
  items: [
    { urn: "1", typename: "GenericSwitcherCard" },
    { urn: "2", typename: "FixtureCard" },
    { urn: "3", typename: "GenericSwitcherCard" },
    { urn: "4", typename: "RaceViewLinksCard" },
  ],
};

const runnerViewMock = {
  title: "Runner View",
  urn: "fakeRunnerViewUrn",
  isModalView: true,
  items: [{ urn: "1", typename: "Card" }],
};

const categoryViewMock = {
  title: "Category title",
  urn: "fakeUrn",
  items: [{ urn: "3", typename: "Card" }],
  backNavigationTitle: "Category title",
};

function renderGenericView(mockedProps = {}) {
  const defaultProps = {
    dispatchFetchCards: jest.fn(),
  };

  return render(<GenericView {...defaultProps} {...mockedProps} />);
}

describe("Generic view", () => {
  beforeEach(jest.clearAllMocks);

  it("should make view as visible on mount", () => {
    renderGenericView({ ...sportViewMock });

    expect(mockSetVisibility).toHaveBeenCalledWith("fakeSportViewUrn", true);
  });

  it("should make view as unvisible on unmount", () => {
    const { unmount } = renderGenericView({ ...sportViewMock });

    act(() => {
      unmount();
    });

    expect(mockSetVisibility).toHaveBeenCalledWith("fakeSportViewUrn", false);
  });

  describe("when rendering the view component", () => {
    it("should render header", () => {
      renderGenericView({ ...sportViewMock });
      const { getByTestId } = render(FlatListWithOffsetContext.mock.calls[0][0].ListHeaderComponent);
      const header = getByTestId(GENERIC_VIEW_HEADER);

      expect(header).toBeDefined();
      expect(header).toHaveStyle({});
    });

    it("should call the PageHeader with the correct props", () => {
      renderGenericView({ ...sportViewMock });
      render(FlatListWithOffsetContext.mock.calls[0][0].ListHeaderComponent);

      expect(PageHeader).toHaveBeenCalledWith(
        {
          title: sportViewMock.title,
          subtitle: sportViewMock.subtitle,
          icon: sportViewMock.badge,
        },
        undefined,
      );
    });

    it("should render without styles", () => {
      renderGenericView({ ...sportViewMockWithoutTitle });
      const { getByTestId } = render(FlatListWithOffsetContext.mock.calls[0][0].ListHeaderComponent);
      const header = getByTestId(GENERIC_VIEW_HEADER);

      expect(header).toBeDefined();
      expect(header).not.toHaveStyle(styles.header);
    });

    it("should call ViewItem for any typename", () => {
      renderGenericView({ ...sportViewMock });
      render(
        FlatListWithOffsetContext.mock.calls[0][0].renderItem({
          item: { urn: "1", typename: "SwimlaneCardGroup" },
          index: 0,
        }),
      );

      expect(ViewItem).toHaveBeenCalledWith(
        {
          urn: "1",
          typename: "SwimlaneCardGroup",
        },
        undefined,
      );
    });

    it("should not render ViewItem without view items", () => {
      renderGenericView({ ...sportViewMock, items: undefined });

      expect(ViewItem).not.toHaveBeenCalled();
    });

    it("should call useRef", () => {
      renderGenericView();

      expect(useRef).toHaveBeenCalledWith(null);
      expect(useRef).toHaveBeenCalledTimes(2);
    });

    it("should pass ConnectedPullRefresh to FlatListWithOffsetContext refreshControl", () => {
      renderGenericView({ ...sportViewMock });

      expect(FlatListWithOffsetContext).toHaveBeenCalledWith(
        expect.objectContaining({ refreshControl: expect.any(Object) }),
        undefined,
      );
    });

    it("should pass scrollEnabled as true", () => {
      renderGenericView({ ...sportViewMock });

      expect(FlatListWithOffsetContext).toHaveBeenCalledWith(
        expect.objectContaining({ scrollEnabled: true }),
        undefined,
      );
    });

    it("should pass onScroll callback from useGenericViewScrollListener", () => {
      const onScrollSpy = jest.fn();
      useGenericViewScrollListener.mockReturnValue({ onScroll: onScrollSpy });
      renderGenericView({ ...sportViewMock });

      expect(FlatListWithOffsetContext).toHaveBeenCalledWith(
        expect.objectContaining({ onScroll: onScrollSpy }),
        undefined,
      );
    });

    it("should render BackNavigationItem when backNavigationTitle exists", () => {
      renderGenericView({ ...categoryViewMock });
      expect(ConnectedBackNavigationItem).toHaveBeenCalledTimes(1);
    });

    describe("when the card is visible", () => {
      it("should define lazy loading callback", () => {
        const dispatchFetchCards = jest.fn();
        renderGenericView({
          ...sportViewMock,
          dispatchFetchCards,
          items: [{ typename: "EventMarketCard", urn: "ppb:card:event" }],
        });

        expect(useNativeLazyLoading).toHaveBeenCalledWith(
          [{ typename: "EventMarketCard", urn: "ppb:card:event" }],
          dispatchFetchCards,
        );
      });

      it("should add lazy loading callback to flatlist", () => {
        const dispatchFetchCards = jest.fn();

        renderGenericView({
          ...sportViewMock,
          dispatchFetchCards,
          dispatchFetchCatalogueAction: jest.fn(),
        });

        expect(FlatListWithOffsetContext).toHaveBeenCalledWith(
          expect.objectContaining({ onViewableItemsChanged: expect.any(Function) }),
          undefined,
        );
      });

      describe("when viewable items change", () => {
        it("should call lazy load callback with the change", () => {
          renderGenericView({
            ...sportViewMock,
            dispatchFetchCards: jest.fn(),
            dispatchFetchCatalogueAction: jest.fn(),
          });
          const { onViewableItemsChanged } = FlatListWithOffsetContext.mock.calls[0][0];

          onViewableItemsChanged({ viewableItems: [] });

          expect(mockLazyLoading).toHaveBeenCalledWith({ viewableItems: [] });
        });

        it("should call sticky callback with the change", () => {
          const stickyObserver = jest.fn();
          useStickyObserver.mockReturnValue({ current: stickyObserver });
          renderGenericView({
            ...sportViewMock,
            dispatchFetchCards: jest.fn(),
            dispatchFetchCatalogueAction: jest.fn(),
          });
          const { onViewableItemsChanged } = FlatListWithOffsetContext.mock.calls[0][0];

          onViewableItemsChanged({ viewableItems: [] });

          expect(stickyObserver).toHaveBeenCalledWith({ viewableItems: [] });
        });
      });
    });
  });

  describe("when there are sticky cards", () => {
    it("should set initialNumToRender to include the sticky card in the initial render", () => {
      renderGenericView({ ...sportViewMockWithStickyCards });

      // it will be 3 because the sticky card is at index 1 and the sticky index selector adds one for the header component
      expect(FlatListWithOffsetContext).toHaveBeenCalledWith(
        expect.objectContaining({ initialNumToRender: 3 }),
        undefined,
      );
    });
  });

  describe("when there are no sticky cards", () => {
    it("should set initialNumToRender to include the sticky card in the initial render", () => {
      renderGenericView({ ...sportViewMock });

      // it will be undefined because thats the mocked vlaue of the default
      expect(FlatListWithOffsetContext).toHaveBeenCalledWith(
        expect.objectContaining({ initialNumToRender: Infinity }),
        undefined,
      );
    });
  });

  describe("when there are cards followed by sticky cards", () => {
    it("should render card items with the correct styling", () => {
      renderGenericView({ ...sportViewMockWithCardsFollowedByStickyCards });
      const firstItem = render(
        FlatListWithOffsetContext.mock.calls[0][0].renderItem({
          item: sportViewMockWithCardsFollowedByStickyCards.items[0],
          index: 0,
        }),
      );

      expect(firstItem.getByTestId(GENERIC_VIEW_ITEMS)).toHaveStyle(styles.cardFollowedBySticky);
    });
  });

  describe("when it is a modal view", () => {
    it("should render the ModalHeader", () => {
      renderGenericView({ ...runnerViewMock });

      expect(ModalHeader).toHaveBeenCalledWith({ title: "Runner View", onDismiss: expect.any(Function) }, undefined);
    });

    it("calls `dispatchModalToggleAction` and `goBack` when `onDismissCallback` is called", () => {
      const dispatchModalToggleAction = jest.fn();

      renderGenericView({ ...runnerViewMock, dispatchModalToggleAction });

      const { onDismiss } = ModalHeader.mock.calls[0][0];

      onDismiss();

      expect(dispatchModalToggleAction).toHaveBeenCalledWith(false);
      expect(goBack).toHaveBeenCalled();
    });
  });
});
