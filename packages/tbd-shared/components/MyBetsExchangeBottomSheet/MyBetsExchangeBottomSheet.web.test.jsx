import { BottomSheet } from "@ppb/the-wall-web";
import { render } from "@testing-library/react/dist/pure";
import ConnectedCard from "../Card";
import Card from "../Card/Card.web";
import { resetApolloCacheWithAppContext } from "../../apollo-client/client";
import MyBetsExchangeBottomSheet from "./MyBetsExchangeBottomSheet.web";

jest.mock("../../apollo-client/client", () => ({
  resetApolloCacheWithAppContext: jest.fn(),
}));

jest.mock("../Card", () => jest.fn(() => <connected-card-mock />));

jest.mock("../Card/Card.web", () => jest.fn(() => <card-mock />));

jest.mock("@ppb/the-wall-web", () => ({
  BottomSheet: jest.fn(({ children, props }) => <bottom-sheet {...props}> {children} </bottom-sheet>),
  Divider: jest.fn(() => <divider-mock />),
}));

const spy = jest.fn();
const ITEMS = [
  { urn: "pb:tbd:card:urn:1", typename: "FixtureCard" },
  { urn: "pb:tbd:card:urn:2", typename: "MarketExtendedCard" },
];

const HEADER_ITEM = { urn: "pb:tbd:card:urn:1", typename: "FixtureCard" };

function renderMyBetsExchangeBottomSheet({
  title = "Edit Bet",
  isFromEditBet = false,
  displayBottomSheet = false,
  items = undefined,
  headerItem = undefined,
  myBetsPageUrn = undefined,
  contentUrn = undefined,
  dispatchCloseBottomSheetAction = spy,
  dispatchFetchCatalogueAction = spy,
  dispatchFetchCardsAction = spy,
  dispatchMyBetsPageRefreshAction = spy,
}) {
  return render(
    <MyBetsExchangeBottomSheet
      title={title}
      isFromEditBet={isFromEditBet}
      displayBottomSheet={displayBottomSheet}
      contentUrn={contentUrn}
      myBetsPageUrn={myBetsPageUrn}
      items={items}
      headerItem={headerItem}
      dispatchCloseBottomSheetAction={dispatchCloseBottomSheetAction}
      dispatchFetchCatalogueAction={dispatchFetchCatalogueAction}
      dispatchFetchCardsAction={dispatchFetchCardsAction}
      dispatchMyBetsPageRefreshAction={dispatchMyBetsPageRefreshAction}
    />,
  );
}

describe("MyBetsExchangeBottomSheet-web", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when initialize", () => {
    it("should not dispatch dispatchFetchCatalogueAction", () => {
      renderMyBetsExchangeBottomSheet({
        displayBottomSheet: false,
        contentUrn: undefined,
        dispatchFetchCatalogueAction: spy,
      });

      expect(spy).not.toHaveBeenCalled();
    });

    it("should not dispatch dispatchFetchCardsAction", () => {
      renderMyBetsExchangeBottomSheet({
        displayBottomSheet: false,
        contentUrn: undefined,
        dispatchFetchCardsAction: spy,
      });

      expect(spy).not.toHaveBeenCalled();
    });

    describe("and when updating", () => {
      it("should dispatch an action to fetch the catalogue with the urn", () => {
        const spyFetchCatalogueAction = jest.fn();

        const { rerender } = renderMyBetsExchangeBottomSheet({
          displayBottomSheet: false,
          contentUrn: undefined,
          dispatchFetchCardsAction: spy,
          dispatchFetchCatalogueAction: spyFetchCatalogueAction,
        });

        const newUrn = "new:genericunmatched:urn";

        rerender(
          <MyBetsExchangeBottomSheet
            title={"Edit Bet"}
            displayBottomSheet={true}
            contentUrn={newUrn}
            items={undefined}
            dispatchCloseBottomSheetAction={spy}
            dispatchFetchCatalogueAction={spyFetchCatalogueAction}
            dispatchFetchCardsAction={spy}
          />,
        );

        expect(spyFetchCatalogueAction).toHaveBeenCalledWith(newUrn);
      });

      it("should dispatch an action to cards with items and urn", () => {
        const spyFetchCardsAction = jest.fn();

        const { rerender } = renderMyBetsExchangeBottomSheet({
          displayBottomSheet: false,
          contentUrn: undefined,
          dispatchFetchCatalogueAction: spy,
          dispatchFetchCardsAction: spyFetchCardsAction,
        });

        const newUrn = "new:genericunmatched:urn";

        rerender(
          <MyBetsExchangeBottomSheet
            title={"Edit Bet"}
            displayBottomSheet={true}
            contentUrn={newUrn}
            items={ITEMS}
            headerItem={HEADER_ITEM}
            dispatchCloseBottomSheetAction={spy}
            dispatchFetchCatalogueAction={spy}
            dispatchFetchCardsAction={spyFetchCardsAction}
          />,
        );

        expect(spyFetchCardsAction).toHaveBeenCalledWith(newUrn, [
          { urn: "pb:tbd:card:urn:1", typename: "FixtureCard" },
          { urn: "pb:tbd:card:urn:2", typename: "MarketExtendedCard" },
        ]);
      });
    });
  });

  describe("when unmounted", () => {
    it("should dispatch dispatchCloseBottomSheetAction", () => {
      const spydispatchCloseBottomSheetAction = jest.fn();

      const { unmount } = renderMyBetsExchangeBottomSheet({
        displayBottomSheet: true,
        items: ITEMS,
        headerItem: HEADER_ITEM,
        contentUrn: "contentViewUrn",
        dispatchCloseBottomSheetAction: spydispatchCloseBottomSheetAction,
      });

      unmount();

      expect(spydispatchCloseBottomSheetAction).toHaveBeenCalledTimes(1);
      expect(spydispatchCloseBottomSheetAction).toHaveBeenCalledWith(false, false);
    });

    it("should dispatch dispatchCloseBottomSheetAction with edit bet as true", () => {
      const spydispatchCloseBottomSheetAction = jest.fn();

      const { unmount } = renderMyBetsExchangeBottomSheet({
        displayBottomSheet: true,
        isFromEditBet: true,
        items: ITEMS,
        headerItem: HEADER_ITEM,
        contentUrn: "contentViewUrn",
        dispatchCloseBottomSheetAction: spydispatchCloseBottomSheetAction,
      });

      unmount();

      expect(spydispatchCloseBottomSheetAction).toHaveBeenCalledTimes(1);
      expect(spydispatchCloseBottomSheetAction).toHaveBeenCalledWith(false, true);
    });
  });

  describe("when displayBottomSheet is true", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should render BottomSheet with content", () => {
      renderMyBetsExchangeBottomSheet({
        displayBottomSheet: true,
        contentUrn: "URN",
        items: ITEMS,
        headerItem: HEADER_ITEM,
      });

      expect(BottomSheet).toHaveBeenCalledTimes(1);
      expect(BottomSheet).toHaveBeenCalledWith(
        {
          title: "Edit Bet",
          onHeaderIconTap: expect.any(Function),
          headerContent: expect.anything(),
          children: expect.anything(),
          showContentFullWidth: true,
        },
        undefined,
      );
    });

    describe("when there are items", () => {
      it("should render 1 connected", () => {
        renderMyBetsExchangeBottomSheet({
          displayBottomSheet: true,
          contentUrn: "URN",
          dispatchFetchCatalogueAction: spy,
          dispatchFetchCardsAction: spy,
          items: ITEMS,
          headerItem: HEADER_ITEM,
        });

        expect(ConnectedCard).toHaveBeenCalledTimes(1);
        expect(ConnectedCard).toHaveBeenCalledWith(
          { urn: "pb:tbd:card:urn:2", component: Card, typename: "MarketExtendedCard" },
          undefined,
        );
      });

      it("the bottom sheet header content shouldn't be null", () => {
        renderMyBetsExchangeBottomSheet({
          displayBottomSheet: true,
          contentUrn: "URN",
          dispatchFetchCatalogueAction: spy,
          dispatchFetchCardsAction: spy,
          items: ITEMS,
          headerItem: HEADER_ITEM,
        });

        const { headerContent } = BottomSheet.mock.calls[0][0];
        expect(headerContent).not.toBeNull();
      });
    });

    describe("when onHeaderIconTap is called", () => {
      const spyDispatchCloseBottomSheetAction = jest.fn();
      const spyDispatchMyBetsPageRefreshAction = jest.fn();

      beforeEach(() => {
        renderMyBetsExchangeBottomSheet({
          displayBottomSheet: true,
          items: ITEMS,
          headerItem: HEADER_ITEM,
          contentUrn: "contentViewUrn",
          dispatchCloseBottomSheetAction: spyDispatchCloseBottomSheetAction,
          dispatchMyBetsPageRefreshAction: spyDispatchMyBetsPageRefreshAction,
        });
        const { onHeaderIconTap } = BottomSheet.mock.calls[0][0];

        onHeaderIconTap();
      });

      it("should call dispatchClickCloseBottomSheet", () => {
        expect(spyDispatchCloseBottomSheetAction).toHaveBeenCalledTimes(1);
        expect(spyDispatchCloseBottomSheetAction).toHaveBeenCalledWith(true, false);
      });

      it("should not call mybetspagerefreshaction", () => {
        expect(spyDispatchMyBetsPageRefreshAction).not.toHaveBeenCalled();
      });

      it("should not call apollo to reset cache", () => {
        expect(resetApolloCacheWithAppContext).not.toHaveBeenCalled();
      });
    });
  });

  describe("when the myBetsPageUrn is defined", () => {
    describe("when onHeaderIconTap is called", () => {
      const spyDispatchCloseBottomSheetAction = jest.fn();
      const spyDispatchMyBetsPageRefreshAction = jest.fn();
      const MY_BETS_URN = "ppb:tbd:view:myBets:open";

      beforeEach(() => {
        renderMyBetsExchangeBottomSheet({
          displayBottomSheet: true,
          items: ITEMS,
          headerItem: HEADER_ITEM,
          myBetsPageUrn: MY_BETS_URN,
          contentUrn: "contentViewUrn",
          dispatchCloseBottomSheetAction: spyDispatchCloseBottomSheetAction,
          dispatchMyBetsPageRefreshAction: spyDispatchMyBetsPageRefreshAction,
        });
        const { onHeaderIconTap } = BottomSheet.mock.calls[0][0];

        onHeaderIconTap();
      });

      it("should call dispatchClickCloseBottomSheet", () => {
        expect(spyDispatchCloseBottomSheetAction).toHaveBeenCalledTimes(1);
        expect(spyDispatchCloseBottomSheetAction).toHaveBeenCalledWith(true, false);
      });

      it("should call mybetspagerefreshaction", () => {
        expect(spyDispatchMyBetsPageRefreshAction).toHaveBeenCalledWith(MY_BETS_URN);
      });

      it("should call apollo to reset cache", () => {
        expect(resetApolloCacheWithAppContext).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("when displayBottomSheet is false", () => {
    it("should not render BottomSheet", () => {
      renderMyBetsExchangeBottomSheet({});
      expect(BottomSheet).not.toHaveBeenCalled();
    });
  });
});
