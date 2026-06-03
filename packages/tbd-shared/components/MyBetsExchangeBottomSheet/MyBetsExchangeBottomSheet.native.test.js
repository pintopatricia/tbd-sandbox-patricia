import { BottomSheet } from "@ppb/the-wall-native";
import { render } from "@testing-library/react-native";
import { resetApolloCacheWithAppContext } from "../../apollo-client/client";
import MyBetsExchangeBottomSheet from "./MyBetsExchangeBottomSheet.native";
import ConnectedCard from "../Card";
import Card from "../Card/Card.native";

jest.mock("../../apollo-client/client", () => ({
  resetApolloCacheWithAppContext: jest.fn(),
}));

jest.mock("@ppb/the-wall-native", () => ({
  BottomSheet: jest.fn(({ children, props }) => <bottom-sheet {...props}> {children} </bottom-sheet>),
  Divider: jest.fn(() => <divider-mock />),
}));

jest.mock("../Card", () => jest.fn(() => <connected-card-mock />));
jest.mock("../Card/Card.native", () => jest.fn(() => <card-mock />));

const HEADER_ITEM = { urn: "pb:tbd:card:urn:1", typename: "FixtureCard" };

const spy = jest.fn();

function renderMyBetsExchangeBottomSheet({
  title = "Edit Bet",
  isFromEditBet = false,
  displayBottomSheet = false,
  contentUrn = undefined,
  items = undefined,
  headerItem = undefined,
  myBetsPageUrn = undefined,
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
      items={items}
      headerItem={headerItem}
      myBetsPageUrn={myBetsPageUrn}
      dispatchCloseBottomSheetAction={dispatchCloseBottomSheetAction}
      dispatchFetchCatalogueAction={dispatchFetchCatalogueAction}
      dispatchFetchCardsAction={dispatchFetchCardsAction}
      dispatchMyBetsPageRefreshAction={dispatchMyBetsPageRefreshAction}
    />,
  );
}

describe("MyBetsExchangeBottomSheet", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when initializing", () => {
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

    it("should not dispatch dispatchMyBetsPageRefreshAction", () => {
      renderMyBetsExchangeBottomSheet({
        displayBottomSheet: false,
        contentUrn: undefined,
        dispatchMyBetsPageRefreshAction: spy,
      });

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe("when displayBottomSheet is true", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should render bottom sheet with content", () => {
      renderMyBetsExchangeBottomSheet({
        displayBottomSheet: true,
        contentUrn: "URN",
        items: [
          { urn: "ppb:tbd:card:urn:1", typename: "MarketExtendedCard" },
          { urn: "ppb:tbd:card:urn:2", typename: "RegulatoryCard" },
        ],
        headerItem: HEADER_ITEM,
      });

      expect(BottomSheet).toHaveBeenCalledTimes(1);
      expect(BottomSheet).toHaveBeenCalledWith(
        {
          onHeaderIconTap: expect.any(Function),
          title: "Edit Bet",
          children: expect.anything(),
          headerContent: expect.anything(),
          showContentFullWidth: true,
        },
        undefined,
      );
    });

    describe("when there are two items to be shown", () => {
      it("should render two connected cards", () => {
        renderMyBetsExchangeBottomSheet({
          displayBottomSheet: true,
          contentUrn: "URN",
          dispatchFetchCatalogueAction: spy,
          dispatchFetchCardsAction: spy,
          items: [
            { urn: "ppb:tbd:card:urn:2", typename: "MarketExtendedCard" },
            { urn: "ppb:tbd:card:urn:3", typename: "RegulatoryCard" },
          ],
          headerItem: HEADER_ITEM,
        });

        expect(ConnectedCard).toHaveBeenCalledTimes(2);
        expect(ConnectedCard).toHaveBeenCalledWith(
          { urn: "ppb:tbd:card:urn:2", component: Card, typename: "MarketExtendedCard" },
          undefined,
        );
        expect(ConnectedCard).toHaveBeenCalledWith(
          { urn: "ppb:tbd:card:urn:3", component: Card, typename: "RegulatoryCard" },
          undefined,
        );
      });
    });

    describe("and onHeaderIconTap is triggered", () => {
      const spyDispatchMyBetsPageRefreshAction = jest.fn();
      const spyCloseBottomSheetAction = jest.fn();

      beforeEach(() => {
        renderMyBetsExchangeBottomSheet({
          displayBottomSheet: true,
          items: [
            { urn: "ppb:tbd:card:urn:2", typename: "MarketExtendedCard" },
            { urn: "ppb:tbd:card:urn:3", typename: "RegulatoryCard" },
          ],
          headerItem: HEADER_ITEM,
          contentUrn: "contentUrn",
          dispatchCloseBottomSheetAction: spyCloseBottomSheetAction,
          dispatchMyBetsPageRefreshAction: spyDispatchMyBetsPageRefreshAction,
        });

        const { onHeaderIconTap } = BottomSheet.mock.calls[0][0];
        onHeaderIconTap();
      });

      it("should dispatch dispatchCloseBottomSheetAction", () => {
        expect(spyCloseBottomSheetAction).toHaveBeenCalledTimes(1);
        expect(spyCloseBottomSheetAction).toHaveBeenCalledWith(true, false);
      });

      it("should not call mybetspagerefreshaction", () => {
        expect(spyDispatchMyBetsPageRefreshAction).not.toHaveBeenCalled();
      });

      it("should not call apollo to reset cache", () => {
        expect(resetApolloCacheWithAppContext).not.toHaveBeenCalled();
      });
    });

    describe("when myBetsUrn is defined and is to edit bet", () => {
      describe("and onHeaderIconTap is triggered", () => {
        const spyDispatchMyBetsPageRefreshAction = jest.fn();
        const spyCloseBottomSheetAction = jest.fn();
        const MY_BETS_URN = "ppb:tbd:view:myBets:open";

        beforeEach(() => {
          renderMyBetsExchangeBottomSheet({
            displayBottomSheet: true,
            isFromEditBet: true,
            items: [
              { urn: "ppb:tbd:card:urn:2", typename: "MarketExtendedCard" },
              { urn: "ppb:tbd:card:urn:3", typename: "RegulatoryCard" },
            ],
            headerItem: HEADER_ITEM,
            myBetsPageUrn: MY_BETS_URN,
            contentUrn: "contentUrn",
            dispatchCloseBottomSheetAction: spyCloseBottomSheetAction,
            dispatchMyBetsPageRefreshAction: spyDispatchMyBetsPageRefreshAction,
          });

          const { onHeaderIconTap } = BottomSheet.mock.calls[0][0];
          onHeaderIconTap();
        });

        it("should dispatch dispatchCloseBottomSheetAction", () => {
          expect(spyCloseBottomSheetAction).toHaveBeenCalledTimes(1);
          expect(spyCloseBottomSheetAction).toHaveBeenCalledWith(true, true);
        });
      });
    });
  });

  describe("when displayBottomSheet is false", () => {
    beforeAll(() => {
      renderMyBetsExchangeBottomSheet({});
    });

    it("should not render the BottomSheet", () => {
      renderMyBetsExchangeBottomSheet({});
      expect(BottomSheet).not.toHaveBeenCalled();
    });
  });
});
