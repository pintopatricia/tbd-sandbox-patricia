import { render, act } from "@testing-library/react-native";
import { EmptyState } from "@ppb/the-wall-native";
import { OrderTypeFilterItem } from "@ppb/tbd-store/state/layout/cards/MyBets.types";
import ConnectedCardGroup from "../CardGroup";
import CardGroup from "../CardGroup/CardGroup.native";
import MyBetsPage from "./MyBetsPage.native";
import { MyBetsHeader } from "./snowflakes/MyBetsHeader/MyBetsHeader.native";
import ConnectedMyBetsExchangeBottomSheet from "../MyBetsExchangeBottomSheet";
import MyBetsExchangeBottomSheet from "../MyBetsExchangeBottomSheet/MyBetsExchangeBottomSheet.native";
import {
  defaultSelectedOrderTypeMock,
  orderTypeListMock,
  defaultSelectedProductTypeMock,
  productTypeListMock,
  labelsMock,
  emptyStateSubTitleMock,
  myBetsViewMock,
  myBetsItemsMock,
  settlementLinkLabelMock,
  headerItemsMock,
} from "./MyBetsPage.mocks";
import selectors from "./MyBetsPage.native.selectors";

jest.useFakeTimers();

jest.mock("@ppb/tbd-router/native", () => ({
  useScrollToTop: jest.fn(),
}));

jest.mock("@ppb/the-wall-native", () => ({
  ActionLink: jest.fn((props) => <action-link-mock {...props} />),
  Snackbar: jest.fn((props) => <snackbar-mock {...props} />),
  StatusLabel: jest.fn((props) => <status-label-mock {...props} />),
  SegmentedControl: jest.fn((props) => <segmented-control-mock {...props} />),
  EmptyState: jest.fn((props) => <empty-state-mock {...props} />),
  Styled: jest.fn((props) => <styled-mock {...props} />),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("./snowflakes/MyBetsHeader/MyBetsHeader.native", () => ({
  MyBetsHeader: jest.fn(({ props }) => <my-bets-header-mock {...props} />),
}));

jest.mock("../MyBetsExchangeBottomSheet", () => jest.fn(() => <connected-my-bets-bets-exchange-light-market-bet />));
jest.mock("../MyBetsExchangeBottomSheet/MyBetsExchangeBottomSheet.native", () =>
  jest.fn(() => <my-bets-bets-exchange-light-market-bet />),
);

jest.mock("../CardGroup", () => jest.fn(() => <connected-card-group-mock />));

jest.mock("../CardGroup/CardGroup.native", () => jest.fn(() => <card-group-native-mock />));
jest.mock("../PullRefresh", () => jest.fn(() => <pull-refresh-mock />));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {
    PullRefreshIconColour: "#FFB80C",
  },
  colors: {},
  spacings: {},
  typography: {},
}));

jest.mock("@ppb/the-wall-native/helpers/flatlist-props", () => ({
  FLAT_LIST_DEFAULTS: {
    initialNumToRender: undefined,
    windowSize: undefined,
    maxToRenderPerBatch: undefined,
    removeClippedSubviews: undefined,
  },
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

const mockSetVisibility = jest.fn();

jest.mock("../../hooks/useNativeLazyLoading.native", () => ({
  useVisibility: jest.fn(() => mockSetVisibility),
}));

jest.mock("../../assets/images/my_bets_empty.png", () => {
  jest.fn("imageMock");
});

const productTypeFilterViewUrnMock = {
  [OrderTypeFilterItem.Open]: "ppb:view:myBetsView:openMock",
  [OrderTypeFilterItem.Settled]: "ppb:view:myBetsView:settledMock",
};

const heritageBetsToggleOptionsMock = [
  { key: "new", value: `Latest` },
  { key: "heritage", value: `Bets before migration` },
];

const heritageFilterViewUrnMock = {
  [OrderTypeFilterItem.Open]: "ppb:view:myBetsView:hopenMock",
  [OrderTypeFilterItem.Settled]: "ppb:view:myBetsView:hsettledMock",
};

const dispatchFetchMoreCatalogueActionSpy = jest.fn();
const dispatchSettlementLinkPageNavigationActionSpy = jest.fn();

function renderMyBetsPage({
  urn = "ppb:tbd:view:myBets:open",
  selectedOrderType = defaultSelectedOrderTypeMock,
  orderTypeList = orderTypeListMock,
  selectedProductType = defaultSelectedProductTypeMock,
  productTypeFilterViewUrn = productTypeFilterViewUrnMock,
  heritageFilterViewUrn = heritageFilterViewUrnMock,
  labels = labelsMock,
  emptyStateSubTitle = emptyStateSubTitleMock,
  view = myBetsViewMock,
  items = myBetsItemsMock,
  cursor = "cursor",
  dispatchFetchCatalogueAction = jest.fn(),
  dispatchMyBetsOrderTypeFilterClick = jest.fn(),
  dispatchMyBetsHeritageToggleFilterClick = jest.fn(),
  dispatchFetchMoreCatalogueAction = dispatchFetchMoreCatalogueActionSpy,
  dispatchResetFilterClick = jest.fn(),
  isLoggedIn = true,
  isExchangeProduct = false,
  hasResetFilters = true,
  lastLoginDate = "",
  toastLabels = {},
  orderStatusList = [],
  selectedOrderStatusType,
  orderStatusUrnByKey,
  dispatchOrderStatusFilterTap = jest.fn(),
  dispatchMyBetsExchangeOrderStatusSwitch = jest.fn(),
  toastItems = [],
  showHeritageBetsToggle,
  heritageBetsToggleOptions = heritageBetsToggleOptionsMock,
  selectedHeritageBetsType,
  dispatchSettlementLinkPageNavigationAction = jest.fn(),
  settlementLink = myBetsViewMock.settlementLink,
  settlementLinkLabel = settlementLinkLabelMock,
  headerItems = headerItemsMock,
} = {}) {
  return render(
    <MyBetsPage
      urn={urn}
      selectedOrderType={selectedOrderType}
      orderTypeList={orderTypeList}
      selectedProductType={selectedProductType}
      productTypeFilterViewUrn={productTypeFilterViewUrn}
      heritageFilterViewUrn={heritageFilterViewUrn}
      labels={labels}
      emptyStateSubTitle={emptyStateSubTitle}
      view={view}
      items={items}
      cursor={cursor}
      dispatchFetchCatalogueAction={dispatchFetchCatalogueAction}
      dispatchFetchMoreCatalogueAction={dispatchFetchMoreCatalogueAction}
      dispatchMyBetsOrderTypeFilterClick={dispatchMyBetsOrderTypeFilterClick}
      dispatchMyBetsHeritageToggleFilterClick={dispatchMyBetsHeritageToggleFilterClick}
      dispatchResetFilterClick={dispatchResetFilterClick}
      isLoggedIn={isLoggedIn}
      isExchangeProduct={isExchangeProduct}
      hasResetFilters={hasResetFilters}
      lastLoginDate={lastLoginDate}
      toastLabels={toastLabels}
      orderStatusList={orderStatusList}
      selectedOrderStatusType={selectedOrderStatusType}
      orderStatusUrnByKey={orderStatusUrnByKey}
      dispatchOrderStatusFilterTap={dispatchOrderStatusFilterTap}
      dispatchMyBetsExchangeOrderStatusSwitch={dispatchMyBetsExchangeOrderStatusSwitch}
      toastItems={toastItems}
      showHeritageBetsToggle={showHeritageBetsToggle}
      heritageBetsToggleOptions={heritageBetsToggleOptions}
      selectedHeritageBetsType={selectedHeritageBetsType}
      dispatchSettlementLinkPageNavigationAction={dispatchSettlementLinkPageNavigationAction}
      settlementLink={settlementLink}
      settlementLinkLabel={settlementLinkLabel}
      headerItems={headerItems}
    />,
  );
}

describe("MyBetsPage", () => {
  beforeEach(jest.clearAllMocks);

  it("should make view as visible on mount", () => {
    renderMyBetsPage();
    expect(mockSetVisibility).toHaveBeenCalledWith("ppb:tbd:view:myBets:open", true);
  });

  it("should make view as unvisible on unmount", () => {
    const { unmount } = renderMyBetsPage();

    act(() => {
      unmount();
    });

    expect(mockSetVisibility).toHaveBeenCalledWith("ppb:tbd:view:myBets:open", false);
  });

  it("should pass a refreshControl", () => {
    const { getByTestId } = renderMyBetsPage();
    const flatList = getByTestId(selectors.MY_BETS_PAGE_FLATLIST);
    expect(flatList.props.refreshControl).toEqual(expect.any(Object));
  });

  it("should call MyBetsHeader with correct props", () => {
    const selectedOrderTypeMock = orderTypeListMock[0];
    const selectedProductTypeMock = 0;
    renderMyBetsPage({
      selectedOrderType: selectedOrderTypeMock,
      orderTypeList: orderTypeListMock,
      selectedProductType: selectedProductTypeMock,
      dispatchFetchCatalogueAction: dispatchFetchMoreCatalogueActionSpy,
      dispatchMyBetsOrderTypeFilterClick: dispatchFetchMoreCatalogueActionSpy,
      dispatchSettlementLinkPageNavigationAction: dispatchSettlementLinkPageNavigationActionSpy,
    });

    expect(MyBetsHeader).toHaveBeenCalledWith(
      {
        title: "title",
        resetButtonText: "resetButtonText",
        resetAlertText: "alertText",
        orderTypeList: orderTypeListMock,
        onOrderTypeTap: expect.any(Function),
        selectedOrderType: selectedOrderTypeMock,
        showResetButton: true,
        showResetAlert: false,
        onResetButtonClick: expect.any(Function),
        onOrderStatusTap: expect.any(Function),
        orderStatusList: [],
        showOrderStatusFilter: false,
        settlementLink: "brand.com/help",
        settlementLinkLabel: settlementLinkLabelMock,
        dispatchSettlementLinkPageNavigationAction: expect.any(Function),
        headerItems: headerItemsMock,
      },
      undefined,
    );
    expect(MyBetsHeader).toHaveBeenCalledTimes(1);
  });

  describe("when there aren't items on the view", () => {
    it("should not render connected cards and should render EmptyState", async () => {
      renderMyBetsPage({
        urn: "ppb:tbd:view:myBets:open",
        items: [{ isEmptyStateCard: true }],
      });

      expect(ConnectedCardGroup).toHaveBeenCalledTimes(0);
      expect(EmptyState).toHaveBeenCalledTimes(1);
    });
  });

  describe("when there are items on the view", () => {
    it("should render 3 connected cards", () => {
      const { queryByTestId } = renderMyBetsPage();

      expect(ConnectedCardGroup).toHaveBeenCalledTimes(3);
      expect(ConnectedCardGroup).toHaveBeenCalledWith(
        { urn: "ppb:tbd:card:footer", component: CardGroup, typename: "Footer", visible: false },
        undefined,
      );
      expect(ConnectedCardGroup).toHaveBeenCalledWith(
        { urn: "ppb:tbd:card:sbkBet:1", component: CardGroup, typename: "BetCardGroup", visible: false },
        undefined,
      );
      expect(ConnectedCardGroup).toHaveBeenCalledWith(
        { urn: "ppb:tbd:card:sbkBet:2", component: CardGroup, typename: "BetCardGroup", visible: false },
        undefined,
      );

      expect(queryByTestId("my-bets-page-empty-state")).toBeNull();
    });
  });

  describe("and when onOrderTypeTap is triggered", () => {
    describe("and the order type is the same", () => {
      it("should not trigger the 'onOrderTypeTap'", () => {
        const dispatchMyBetsOrderTypeFilterClickSpy = jest.fn();
        const dispatchFetchCatalogueActionSpy = jest.fn();
        renderMyBetsPage({
          dispatchMyBetsOrderTypeFilterClick: dispatchMyBetsOrderTypeFilterClickSpy,
          dispatchFetchCatalogueAction: dispatchFetchCatalogueActionSpy,
        });
        const { onOrderTypeTap } = MyBetsHeader.mock.calls[0][0];

        onOrderTypeTap(orderTypeListMock[0].id);

        expect(dispatchMyBetsOrderTypeFilterClickSpy).not.toHaveBeenCalled();
        expect(dispatchFetchCatalogueActionSpy).not.toHaveBeenCalled();
      });
    });

    describe("and the order type is not the same", () => {
      it("should trigger the 'onOrderTypeTap'", () => {
        const dispatchMyBetsOrderTypeFilterClickSpy = jest.fn();
        const dispatchFetchCatalogueActionSpy = jest.fn();

        renderMyBetsPage({
          dispatchMyBetsOrderTypeFilterClick: dispatchMyBetsOrderTypeFilterClickSpy,
          dispatchFetchCatalogueAction: dispatchFetchCatalogueActionSpy,
        });

        const { onOrderTypeTap } = MyBetsHeader.mock.calls[0][0];
        onOrderTypeTap(orderTypeListMock[1].id);

        expect(dispatchMyBetsOrderTypeFilterClickSpy).toHaveBeenCalledWith(
          "settled",
          "exc",
          false,
          "ppb:view:myBetsView:settledMock",
        );
        expect(dispatchFetchCatalogueActionSpy).toHaveBeenCalledWith("ppb:view:myBetsView:settledMock");
      });
    });
  });

  describe("and when handleOrderStatusTap is triggered", () => {
    describe("and the order status is the same", () => {
      it("should not trigger the 'onOrderStatusTap'", () => {
        const dispatchOrderStatusFilterTapSpy = jest.fn();
        const dispatchFetchCatalogueActionSpy = jest.fn();
        const dispatchMyBetsExchangeOrderStatusSwitchSpy = jest.fn();

        renderMyBetsPage({
          dispatchOrderStatusFilterTap: dispatchOrderStatusFilterTapSpy,
          dispatchFetchCatalogueAction: dispatchFetchCatalogueActionSpy,
          dispatchMyBetsExchangeOrderStatusSwitch: dispatchMyBetsExchangeOrderStatusSwitchSpy,
          selectedOrderStatusType: "unmatched",
          orderStatusUrnByKey: {
            unmatched: "unmatchedURN",
            matched: "matchedURN",
          },
        });
        const { onOrderStatusTap } = MyBetsHeader.mock.calls[0][0];

        onOrderStatusTap("unmatched");

        expect(dispatchOrderStatusFilterTapSpy).not.toHaveBeenCalled();
        expect(dispatchFetchCatalogueActionSpy).not.toHaveBeenCalled();
        expect(dispatchMyBetsExchangeOrderStatusSwitchSpy).not.toHaveBeenCalled();
      });
    });

    describe("and the order type is not the same", () => {
      describe("and the order type does not have a match urn", () => {
        it("should trigger the 'onOrderTypeTap'", () => {
          const dispatchOrderStatusFilterTapSpy = jest.fn();
          const dispatchFetchCatalogueActionSpy = jest.fn();
          const dispatchMyBetsExchangeOrderStatusSwitchSpy = jest.fn();

          renderMyBetsPage({
            dispatchOrderStatusFilterTap: dispatchOrderStatusFilterTapSpy,
            dispatchFetchCatalogueAction: dispatchFetchCatalogueActionSpy,
            dispatchMyBetsExchangeOrderStatusSwitch: dispatchMyBetsExchangeOrderStatusSwitchSpy,
            selectedOrderStatusType: "unmatched",
            orderStatusUrnByKey: {
              matched: "matchedURN",
            },
          });
          const { onOrderStatusTap } = MyBetsHeader.mock.calls[0][0];

          onOrderStatusTap("umatched");

          expect(dispatchOrderStatusFilterTapSpy).not.toHaveBeenCalled();
          expect(dispatchFetchCatalogueActionSpy).not.toHaveBeenCalled();
          expect(dispatchMyBetsExchangeOrderStatusSwitchSpy).toHaveBeenCalledWith("umatched");
        });
      });
      describe("and the order type has a match urn", () => {
        it("should trigger the 'onOrderTypeTap'", () => {
          const dispatchOrderStatusFilterTapSpy = jest.fn();
          const dispatchFetchCatalogueActionSpy = jest.fn();
          const dispatchMyBetsExchangeOrderStatusSwitchSpy = jest.fn();

          renderMyBetsPage({
            dispatchOrderStatusFilterTap: dispatchOrderStatusFilterTapSpy,
            dispatchFetchCatalogueAction: dispatchFetchCatalogueActionSpy,
            dispatchMyBetsExchangeOrderStatusSwitch: dispatchMyBetsExchangeOrderStatusSwitchSpy,
            selectedOrderStatusType: "unmatched",
            orderStatusUrnByKey: {
              unmatched: "unmatchedURN",
              matched: "matchedURN",
            },
          });
          const { onOrderStatusTap } = MyBetsHeader.mock.calls[0][0];

          onOrderStatusTap("matched");

          expect(dispatchOrderStatusFilterTapSpy).toHaveBeenCalledWith("matchedURN", "matched");
          expect(dispatchFetchCatalogueActionSpy).toHaveBeenCalledWith("matchedURN");
          expect(dispatchMyBetsExchangeOrderStatusSwitchSpy).toHaveBeenCalledWith("matched");
        });
      });
    });
  });

  describe("and when handleHeritageToggleTap is triggered", () => {
    describe("and the tapped key is heritage", () => {
      it("should trigger the 'onPress'", () => {
        const dispatchMyBetsHeritageToggleFilterClickSpy = jest.fn();
        const dispatchFetchCatalogueActionSpy = jest.fn();

        renderMyBetsPage({
          dispatchMyBetsHeritageToggleFilterClick: dispatchMyBetsHeritageToggleFilterClickSpy,
          dispatchFetchCatalogueAction: dispatchFetchCatalogueActionSpy,
          selectedHeritageBetsType: "new",
          showHeritageBetsToggle: true,
        });
        const { headerAction } = MyBetsHeader.mock.calls[0][0];

        headerAction.props.children[0].props.children.props.onPress("heritage");

        expect(dispatchMyBetsHeritageToggleFilterClickSpy).toHaveBeenCalledWith(
          true,
          "ppb:view:myBetsView:hopenMock",
          "Bets before migration",
        );
        expect(dispatchFetchCatalogueActionSpy).toHaveBeenCalledWith("ppb:view:myBetsView:hopenMock");
      });
    });

    describe("and the tapped key is new", () => {
      it("should trigger the 'onPress'", () => {
        const dispatchMyBetsHeritageToggleFilterClickSpy = jest.fn();
        const dispatchFetchCatalogueActionSpy = jest.fn();

        renderMyBetsPage({
          dispatchMyBetsHeritageToggleFilterClick: dispatchMyBetsHeritageToggleFilterClickSpy,
          dispatchFetchCatalogueAction: dispatchFetchCatalogueActionSpy,
          selectedHeritageBetsType: "heritage",
          showHeritageBetsToggle: true,
        });
        const { headerAction } = MyBetsHeader.mock.calls[0][0];

        headerAction.props.children[0].props.children.props.onPress("new");

        expect(dispatchMyBetsHeritageToggleFilterClickSpy).toHaveBeenCalledWith(
          false,
          "ppb:view:myBetsView:openMock",
          "Latest",
        );
        expect(dispatchFetchCatalogueActionSpy).toHaveBeenCalledWith("ppb:view:myBetsView:openMock");
      });
    });
  });

  describe("and when handleResetFilterTap is triggered", () => {
    it("should trigger the 'onResetButtonClick'", () => {
      const dispatchResetFilterClickSpy = jest.fn();
      renderMyBetsPage({
        dispatchResetFilterClick: dispatchResetFilterClickSpy,
      });
      const { onResetButtonClick } = MyBetsHeader.mock.calls[0][0];

      onResetButtonClick();

      expect(dispatchResetFilterClickSpy).toHaveBeenCalledWith();
    });
  });

  describe("and when onEndReached is triggered", () => {
    describe("and pageInfo hasNextPage flag is false", () => {
      it("should not trigger the 'dispatchFetchMoreCatalogueAction'", () => {
        const { getByTestId } = renderMyBetsPage({
          view: {
            ...myBetsViewMock,
            pageInfo: {
              hasNextPage: false,
            },
          },
        });
        const flatList = getByTestId(selectors.MY_BETS_PAGE_FLATLIST);
        flatList.props.onEndReached();
        expect(dispatchFetchMoreCatalogueActionSpy).not.toHaveBeenCalled();
      });
    });

    describe("and pageInfo hasNextPage flag is true", () => {
      it("should trigger the 'dispatchFetchMoreCatalogueAction'", () => {
        const { getByTestId } = renderMyBetsPage({
          view: {
            ...myBetsViewMock,
            pageInfo: {
              hasNextPage: true,
            },
          },
        });
        const flatList = getByTestId(selectors.MY_BETS_PAGE_FLATLIST);
        flatList.props.onEndReached();
        expect(dispatchFetchMoreCatalogueActionSpy).toHaveBeenCalledWith("ppb:tbd:view:myBets:open", "cursor");
      });
    });
  });

  describe("when the prop `isLoggedIn` is false", () => {
    it("shouldn't call MyBetsHeader", () => {
      const selectedOrderTypeMock = orderTypeListMock[1].id;
      const selectedProductTypeMock = productTypeListMock[1].id;
      renderMyBetsPage({
        selectedOrderType: selectedOrderTypeMock,
        orderTypeList: orderTypeListMock,
        selectedProductType: selectedProductTypeMock,
        dispatchFetchCatalogueAction: dispatchFetchMoreCatalogueActionSpy,
        dispatchMyBetsOrderTypeFilterClick: dispatchFetchMoreCatalogueActionSpy,
        isLoggedIn: false,
      });

      expect(MyBetsHeader).not.toHaveBeenCalled();
    });
  });

  describe("when the props `isExchangeProduct` is true", () => {
    it("should call EditExchangeBetBottomSheet", () => {
      const selectedOrderTypeMock = orderTypeListMock[1].id;
      const selectedProductTypeMock = productTypeListMock[0].id;
      renderMyBetsPage({
        selectedOrderType: selectedOrderTypeMock,
        orderTypeList: orderTypeListMock,
        selectedProductType: selectedProductTypeMock,
        productTypeList: productTypeListMock,
        dispatchFetchCatalogueAction: dispatchFetchMoreCatalogueActionSpy,
        dispatchMyBetsOrderTypeFilterClick: dispatchFetchMoreCatalogueActionSpy,
        isLoggedIn: false,
        isExchangeProduct: true,
      });

      expect(ConnectedMyBetsExchangeBottomSheet).toHaveBeenCalledWith(
        { component: MyBetsExchangeBottomSheet, visible: true },
        undefined,
      );
      expect(ConnectedMyBetsExchangeBottomSheet).toHaveBeenCalledTimes(1);
    });
  });

  describe("on load view handler", () => {
    const setup = (viewableItemsChanged) => {
      const { getByTestId } = renderMyBetsPage({
        view: {
          ...myBetsViewMock,
          pageInfo: {
            hasNextPage: true,
          },
        },
      });
      const flatList = getByTestId(selectors.MY_BETS_PAGE_FLATLIST);

      jest.clearAllMocks();

      act(() => {
        flatList.props.viewabilityConfigCallbackPairs[0].onViewableItemsChanged(viewableItemsChanged);
      });
    };

    describe("when initial render has more cards than the shown ones", () => {
      it("should not dispatch fetch more catalogue", () => {
        setup({
          viewableItems: [],
          changed: [],
        });

        expect(dispatchFetchMoreCatalogueActionSpy).not.toHaveBeenCalled();
      });
    });

    describe("when initial render has more cards than what is shown", () => {
      it("should dispatch fetch more catalogue", () => {
        setup({
          viewableItems: [
            { item: { urn: "ppb:tbd:card:sbkBet:1" }, isViewable: true },
            { item: { urn: "ppb:tbd:card:sbkBet:2" }, isViewable: true },
            { item: { urn: "ppb:tbd:card:footer" }, isViewable: true },
          ],
          changed: [],
        });

        expect(dispatchFetchMoreCatalogueActionSpy).toHaveBeenCalledTimes(1);
        expect(dispatchFetchMoreCatalogueActionSpy).toHaveBeenCalledWith("ppb:tbd:view:myBets:open", "cursor");
      });
    });

    describe("when there are cards that changed viewability", () => {
      it("should call setVisibility", () => {
        setup({
          viewableItems: [
            { item: { urn: "ppb:tbd:card:sbkBet:1" }, isViewable: true },
            { item: { urn: "ppb:tbd:card:sbkBet:2" }, isViewable: true },
            { item: { urn: "ppb:tbd:card:footer" }, isViewable: true },
          ],
          changed: [{ item: { urn: "ppb:tbd:card:sbkBet:1" }, isViewable: true }],
        });

        expect(mockSetVisibility).toHaveBeenCalledTimes(1);
        expect(mockSetVisibility).toHaveBeenCalledWith("ppb:tbd:card:sbkBet:1", true);
      });
    });

    describe("when there are no cards that changed viewability", () => {
      it("should not call setVisibility", () => {
        setup({
          viewableItems: [
            { item: { urn: "ppb:tbd:card:sbkBet:1" }, isViewable: true },
            { item: { urn: "ppb:tbd:card:sbkBet:2" }, isViewable: true },
            { item: { urn: "ppb:tbd:card:footer" }, isViewable: true },
          ],
          changed: [],
        });

        expect(mockSetVisibility).not.toHaveBeenCalled();
      });
    });
  });

  describe("when the showHeritageBetsToggle is false", () => {
    it("should call MyBetsHeader with undefined headerAction", () => {
      renderMyBetsPage({
        showHeritageBetsToggle: false,
      });

      expect(MyBetsHeader).toHaveBeenCalledWith(expect.objectContaining({ headerAction: undefined }), undefined);
    });
  });

  describe("when the showHeritageBetsToggle is true", () => {
    it("should call MyBetsHeader with headerAction containing the SegmentedControl component", () => {
      renderMyBetsPage({
        showHeritageBetsToggle: true,
        heritageBetsToggleOptions: ["heritageBet1", "heritageBet2"],
        selectedHeritageBetsType: "heritageBet1",
      });

      expect(MyBetsHeader).toHaveBeenCalledWith(
        expect.objectContaining({ headerAction: expect.any(Object) }),
        undefined,
      );
    });
  });
});
