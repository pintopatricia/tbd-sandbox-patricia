import { useRef } from "react";
import { render, waitFor, queryByTestId, queryAllByText, act } from "@testing-library/react";
import "jest-dom/extend-expect";
import { EmptyState } from "@ppb/the-wall-web";
import { OrderTypeFilterItem } from "@ppb/tbd-store/state/layout/cards/MyBets.types";

import { ConfigContext } from "../Config/ConfigContext";
import MyBetsPage from "./MyBetsPage.web";
import ConnectedCard from "../Card";
import Card from "../Card/Card.web";
import ConnectedMyBetsExchangeBottomSheet from "../MyBetsExchangeBottomSheet";
import { useInfiniteScroll } from "../../hooks";
import ConnectedSwimlaneCardGroup from "../SwimlaneCardGroup";
import SwimlaneCardGroup from "../SwimlaneCardGroup/SwimlaneCardGroup.web";
import SwimlaneCardGroupPlaceholder from "../SwimlaneCardGroup/SwimlaneCardGroupPlaceholder.web";
import { MyBetsHeader } from "./snowflakes/MyBetsHeader/MyBetsHeader.web";

import {
  defaultSelectedOrderTypeMock,
  orderTypeListMock,
  defaultSelectedProductTypeMock,
  productTypeListMock,
  labelsMock,
  emptyStateSubTitleMock,
  myBetsViewMock,
  myBetsItemsMock,
  emptyTransactionTitleMock,
  settlementLinkLabelMock,
  headerItemsMock,
} from "./MyBetsPage.mocks";

jest.mock("@ppb/the-wall-web", () => ({
  ActionLink: jest.fn((props) => <action-link-mock {...props} />),
  Snackbar: jest.fn((props) => <snackbar-mock {...props} />),
  StatusLabel: jest.fn((props) => <status-label-mock {...props} />),
  SegmentedControl: jest.fn((props) => <segmented-control-mock {...props} />),
  EmptyState: jest.fn((props) => <empty-state-mock {...props} />),
  Styled: jest.fn((props) => <styled-mock {...props} />),
}));

jest.mock("./snowflakes/MyBetsHeader/MyBetsHeader.web", () => ({
  MyBetsHeader: jest.fn(({ props }) => <my-bets-header-mock {...props} />),
}));

jest.mock("../MyBetsExchangeBottomSheet", () => jest.fn(() => <connected-my-bets-exchange-light-market-bet />));

jest.mock("../Card", () => jest.fn(() => <connected-card-mock />));

jest.mock("../Card/Card.web", () => jest.fn(() => <card-mock />));

jest.mock("../SwimlaneCardGroup", () => jest.fn(() => <connected-swimlane-card-group />));

jest.mock("../SwimlaneCardGroup/SwimlaneCardGroup.web", () => jest.fn(() => <swimlane-card-group />));

jest.mock("../SwimlaneCardGroup/SwimlaneCardGroupPlaceholder.web", () =>
  jest.fn(() => <swimlane-card-group-placeholder />),
);

jest.mock("../RegulatoryCard", () => jest.fn(() => <connected-regulatory-card-mock />));

jest.mock("../RegulatoryCard/RegulatoryCard.web", () => jest.fn(() => <regulatory-card-mock />));

const resetScroll = jest.fn();

jest.mock("../../hooks", () => ({
  useInfiniteScroll: jest.fn(() => ({ scrollViewRef: useRef(), resetScroll })),
}));

jest.mock("../../view-model-factories/game.web", () => ({
  getImagePath: jest.fn().mockReturnValue("imageMock"),
}));

jest.mock("../../helpers/share.web", () => ({
  canShare: jest.fn(),
}));

const dispatchFetchMoreCatalogueActionSpy = jest.fn();

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

function renderMyBetsPage({
  urn = "ppb:tbd:view:myBets:open",
  selectedOrderType = defaultSelectedOrderTypeMock,
  orderTypeList = orderTypeListMock,
  selectedProductType = defaultSelectedProductTypeMock,
  productTypeFilterViewUrn = productTypeFilterViewUrnMock,
  heritageFilterViewUrn = heritageFilterViewUrnMock,
  labels = labelsMock,
  emptyStateSubTitle = emptyStateSubTitleMock,
  emptyTransactionTitle = emptyTransactionTitleMock,
  view = myBetsViewMock,
  items = myBetsItemsMock,
  cursor,
  dispatchFetchCatalogueAction = jest.fn(),
  dispatchFetchMoreCatalogueAction = jest.fn(),
  dispatchMyBetsOrderTypeFilterClick = jest.fn(),
  dispatchMyBetsHeritageToggleFilterClick = jest.fn(),
  dispatchResetFilterClick = jest.fn(),
  dispatchHomepageNavigation = jest.fn(),
  dispatchTransactionHistoryNavigation = jest.fn(),
  isLoggedIn = true,
  isExchangeProduct = false,
  hasResetFilters = true,
  lastLoginDate = "",
  orderStatusList = [],
  selectedOrderStatusType,
  orderStatusUrnByKey,
  dispatchOrderStatusFilterTap = jest.fn(),
  dispatchMyBetsExchangeOrderStatusSwitch = jest.fn(),
  toastItems = [],
  isDesktop = false,
  showHeritageBetsToggle,
  heritageBetsToggleOptions = heritageBetsToggleOptionsMock,
  selectedHeritageBetsType,
  dispatchSettlementLinkPageNavigationAction = jest.fn(),
  settlementLink = myBetsViewMock.settlementLink,
  settlementLinkLabel = settlementLinkLabelMock,
  headerItems = headerItemsMock,
} = {}) {
  const contextWrapper = ({ children }) => (
    <ConfigContext.Provider value={{ isDesktopLayout: isDesktop }}>{children}</ConfigContext.Provider>
  );

  const { container } = render(
    <MyBetsPage
      urn={urn}
      selectedOrderType={selectedOrderType}
      orderTypeList={orderTypeList}
      selectedProductType={selectedProductType}
      productTypeFilterViewUrn={productTypeFilterViewUrn}
      heritageFilterViewUrn={heritageFilterViewUrn}
      labels={labels}
      emptyStateSubTitle={emptyStateSubTitle}
      emptyTransactionTitle={emptyTransactionTitle}
      view={view}
      items={items}
      cursor={cursor}
      dispatchFetchCatalogueAction={dispatchFetchCatalogueAction}
      dispatchFetchMoreCatalogueAction={dispatchFetchMoreCatalogueAction}
      dispatchMyBetsOrderTypeFilterClick={dispatchMyBetsOrderTypeFilterClick}
      dispatchMyBetsHeritageToggleFilterClick={dispatchMyBetsHeritageToggleFilterClick}
      dispatchResetFilterClick={dispatchResetFilterClick}
      dispatchHomepageNavigation={dispatchHomepageNavigation}
      dispatchTransactionHistoryNavigation={dispatchTransactionHistoryNavigation}
      isLoggedIn={isLoggedIn}
      isExchangeProduct={isExchangeProduct}
      hasResetFilters={hasResetFilters}
      lastLoginDate={lastLoginDate}
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
    { wrapper: contextWrapper },
  );

  return { container };
}

describe("MyBetsPage", () => {
  beforeEach(jest.clearAllMocks);
  const spy = jest.fn();

  describe("when initialized", () => {
    it("should not dispatch dispatchFetchCatalogueAction", () => {
      renderMyBetsPage({
        urn: "urn",
        dispatchFetchCatalogueAction: spy,
      });

      expect(spy).not.toHaveBeenCalled();
    });
  });

  it("should call the useInfiniteScroll hook with the callback", () => {
    renderMyBetsPage({
      urn: "urn",
      cursor: "cursor",
      dispatchFetchMoreCatalogueAction: spy,
    });
    expect(useInfiniteScroll).toHaveBeenCalledWith(expect.any(Function), 0, true);
  });

  it("should call MyBetsHeader with correct props", () => {
    const selectedOrderTypeMock = orderTypeListMock[1].id;
    const selectedProductTypeMock = productTypeListMock[1].id;
    renderMyBetsPage({
      selectedOrderType: selectedOrderTypeMock,
      orderTypeList: orderTypeListMock,
      selectedProductType: selectedProductTypeMock,
      dispatchFetchCatalogueAction: spy,
      dispatchMyBetsOrderTypeFilterClick: spy,
      dispatchSettlementLinkPageNavigationAction: spy,
    });

    expect(MyBetsHeader).toHaveBeenCalledWith(
      {
        title: "title",
        resetButtonText: "resetButtonText",
        resetAlertText: "alertText",
        orderTypeList: orderTypeListMock,
        onOrderTypeTap: expect.any(Function),
        onResetButtonClick: expect.any(Function),
        selectedOrderType: selectedOrderTypeMock,
        showResetButton: true,
        showResetAlert: false,
        onOrderStatusTap: expect.any(Function),
        orderStatusList: [],
        showOrderStatusFilter: false,
        settlementLink: "brand.com/help",
        settlementLinkLabel: "Need help?",
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

      expect(ConnectedCard).toHaveBeenCalledTimes(0);
      expect(EmptyState).toHaveBeenCalledTimes(1);
    });

    describe("and when is desktop template", () => {
      describe("and when the settled view is displayed", () => {
        it("should display the transaction history link", async () => {
          const selectedOrderTypeMock = orderTypeListMock[1].id;
          const { container } = renderMyBetsPage({
            urn: "ppb:tbd:view:myBets:settled",
            selectedOrderType: selectedOrderTypeMock,
            items: [{ isEmptyStateCard: true }],
            isDesktop: true,
          });

          expect(ConnectedCard).toHaveBeenCalledTimes(0);

          await waitFor(() => {
            expect(queryAllByText(container, emptyTransactionTitleMock)).not.toBeNull();
          });
        });
      });
    });
  });

  describe("when there are items on the view", () => {
    it("should render 3 connected cards", async () => {
      const { container } = renderMyBetsPage();

      expect(ConnectedCard).toHaveBeenCalledTimes(3);
      expect(ConnectedCard).toHaveBeenCalledWith(
        { urn: "ppb:tbd:card:footer", component: Card, typename: "Footer" },
        undefined,
      );
      expect(ConnectedCard).toHaveBeenCalledWith(
        { urn: "ppb:tbd:card:sbkBet:1", component: Card, typename: "BetCardGroup" },
        undefined,
      );
      expect(ConnectedCard).toHaveBeenCalledWith(
        { urn: "ppb:tbd:card:sbkBet:2", component: Card, typename: "BetCardGroup" },
        undefined,
      );

      await waitFor(() => {
        expect(queryByTestId(container, "my-bets-page-empty-state")).toBeNull();
      });
    });
  });

  describe("when there's an item that's a SwimlaneCardGroup", () => {
    it("should call ConnectedSwimlaneCardGroup", () => {
      renderMyBetsPage({ items: [{ typename: "SwimlaneCardGroup", urn: "swimlane:urn" }] });

      expect(ConnectedSwimlaneCardGroup).toHaveBeenCalledWith(
        {
          urn: "swimlane:urn",
          component: SwimlaneCardGroup,
          placeholder: SwimlaneCardGroupPlaceholder,
        },
        undefined,
      );
      expect(ConnectedSwimlaneCardGroup).toHaveBeenCalledTimes(1);
    });
  });

  describe("when scroll down to the container's bottom", () => {
    describe("when the view is not available", () => {
      it("should not fetch more layout items", () => {
        useInfiniteScroll.mockClear();
        renderMyBetsPage({
          view: null,
          cursor: "cursor",
          dispatchFetchMoreCatalogueAction: spy,
        });

        // Simulate got to end of container's bottom
        const handleScrollEnd = useInfiniteScroll.mock.calls[0][0];
        handleScrollEnd();

        expect(spy).toHaveBeenCalledTimes(0);
      });
    });

    describe("and pageInfo hasNextPage flag is false", () => {
      it("should not trigger the 'dispatchFetchMoreCatalogueAction'", () => {
        renderMyBetsPage({
          dispatchFetchMoreCatalogueAction: dispatchFetchMoreCatalogueActionSpy,
          view: {
            ...myBetsViewMock,
            pageInfo: {
              hasNextPage: false,
            },
          },
        });

        // Simulate got to end of container's bottom
        const handleScrollEnd = useInfiniteScroll.mock.calls[0][0];
        handleScrollEnd();

        expect(dispatchFetchMoreCatalogueActionSpy).not.toHaveBeenCalled();
      });
    });

    describe("and pageInfo hasNextPage flag is true", () => {
      it("should trigger the 'dispatchFetchMoreCatalogueAction'", () => {
        renderMyBetsPage({
          dispatchFetchMoreCatalogueAction: dispatchFetchMoreCatalogueActionSpy,
          view: {
            ...myBetsViewMock,
            pageInfo: {
              hasNextPage: true,
            },
          },
          cursor: "cursor",
        });

        // Simulate got to end of container's bottom
        const handleScrollEnd = useInfiniteScroll.mock.calls[0][0];
        handleScrollEnd();

        expect(dispatchFetchMoreCatalogueActionSpy).toHaveBeenCalledWith("ppb:tbd:view:myBets:open", "cursor");
      });
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
        expect(resetScroll).toHaveBeenCalled();
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
      it("should trigger the 'onClick'", () => {
        const dispatchMyBetsHeritageToggleFilterClickSpy = jest.fn();
        const dispatchFetchCatalogueActionSpy = jest.fn();

        renderMyBetsPage({
          dispatchMyBetsHeritageToggleFilterClick: dispatchMyBetsHeritageToggleFilterClickSpy,
          dispatchFetchCatalogueAction: dispatchFetchCatalogueActionSpy,
          selectedHeritageBetsType: "new",
          showHeritageBetsToggle: true,
        });
        const { headerAction } = MyBetsHeader.mock.calls[0][0];

        headerAction.props.children[0].props.children.props.onClick("heritage");

        expect(dispatchMyBetsHeritageToggleFilterClickSpy).toHaveBeenCalledWith(
          true,
          "ppb:view:myBetsView:hopenMock",
          "Bets before migration",
        );
        expect(dispatchFetchCatalogueActionSpy).toHaveBeenCalledWith("ppb:view:myBetsView:hopenMock");
      });
    });

    describe("and the tapped key is new", () => {
      it("should trigger the 'onClick'", () => {
        const dispatchMyBetsHeritageToggleFilterClickSpy = jest.fn();
        const dispatchFetchCatalogueActionSpy = jest.fn();

        renderMyBetsPage({
          dispatchMyBetsHeritageToggleFilterClick: dispatchMyBetsHeritageToggleFilterClickSpy,
          dispatchFetchCatalogueAction: dispatchFetchCatalogueActionSpy,
          selectedHeritageBetsType: "heritage",
          showHeritageBetsToggle: true,
        });
        const { headerAction } = MyBetsHeader.mock.calls[0][0];

        headerAction.props.children[0].props.children.props.onClick("new");

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

  describe("when the prop `isLoggedIn` is false", () => {
    it("shouldn't call MyBetsHeader", () => {
      const selectedOrderTypeMock = orderTypeListMock[1].id;
      const selectedProductTypeMock = productTypeListMock[1].id;
      renderMyBetsPage({
        selectedOrderType: selectedOrderTypeMock,
        orderTypeList: orderTypeListMock,
        selectedProductType: selectedProductTypeMock,
        productTypeList: productTypeListMock,
        dispatchFetchCatalogueAction: spy,
        dispatchMyBetsOrderTypeFilterClick: spy,
        isLoggedIn: false,
      });

      expect(MyBetsHeader).not.toHaveBeenCalled();
    });
  });

  describe("when the props `isExchangeProduct` is true", () => {
    it("should call ExchangeBetBottomSheet", async () => {
      const selectedOrderTypeMock = orderTypeListMock[1].id;
      const selectedProductTypeMock = productTypeListMock[0].id;
      const { container } = renderMyBetsPage({
        selectedOrderType: selectedOrderTypeMock,
        orderTypeList: orderTypeListMock,
        selectedProductType: selectedProductTypeMock,
        productTypeList: productTypeListMock,
        dispatchFetchCatalogueAction: spy,
        dispatchMyBetsOrderTypeFilterClick: spy,
        isLoggedIn: false,
        isExchangeProduct: true,
      });

      await waitFor(() => {
        expect(container.querySelector("connected-my-bets-exchange-light-market-bet")).toBeInTheDocument();
      });

      expect(ConnectedMyBetsExchangeBottomSheet).toHaveBeenCalledWith({ component: expect.any(Object) }, undefined);
      expect(ConnectedMyBetsExchangeBottomSheet).toHaveBeenCalledTimes(1);
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
