import myBetsReducer from "./my-bets-cards-reducer";
import { DELETE_LAYOUT } from "../../../../actions/catalogue";
import {
  MY_BETS_RESET_FILTERS,
  UI__MY_BETS_ORDER_STATUS_FILTER_CLICK,
  UI__MY_BETS_ORDER_TYPE_FILTER_CLICK,
  UI__MY_BETS_HERITAGE_TOGGLE_FILTER_CLICK,
} from "../../../../actions/my-bets";

describe('"mybets" reducer', () => {
  describe("when action type is not met by the reducer and previous state is undefined", () => {
    it("must return the empty state", () => {
      const state = myBetsReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe("when action type is not met by the reducer and previous state isn't undefined", () => {
    it("must return the previous state", () => {
      const state = myBetsReducer(
        {
          previousProps: "previousData",
        },
        {},
      );
      expect(state).toEqual({
        previousProps: "previousData",
      });
    });
  });

  describe('when action type is "UI__MY_BETS_ORDER_TYPE_FILTER_CLICK"', () => {
    it('must return the new state with "orderTypeFilter" and corresponding viewUrn', () => {
      const state = myBetsReducer(
        {
          orderTypeFilter: "oldOrderType",
          viewUrn: "oldViewUrn",
          otherProps: "otherData",
        },
        {
          type: UI__MY_BETS_ORDER_TYPE_FILTER_CLICK,
          payload: {
            filter: {
              productType: "newProductType",
              orderType: "newOrderType",
            },
            viewUrn: "newViewUrn",
          },
        },
      );

      expect(state).toEqual({
        productTypeFilter: "newProductType",
        orderTypeFilter: "newOrderType",
        viewUrn: "newViewUrn",
        otherProps: "otherData",
      });
    });
  });

  describe('when action type is "UI__MY_BETS_ORDER_STATUS_FILTER_CLICK"', () => {
    it('must return the new state with "orderTypeFilter" and corresponding viewUrn', () => {
      const state = myBetsReducer(
        {
          orderStatusFilter: "oldOrderStatus",
          viewUrn: "oldViewUrn",
          otherProps: "otherData",
        },
        {
          type: UI__MY_BETS_ORDER_STATUS_FILTER_CLICK,
          payload: {
            filter: {
              orderStatus: "newOrderStatus",
            },
            viewUrn: "newViewUrn",
          },
        },
      );

      expect(state).toEqual({
        orderStatusFilter: "newOrderStatus",
        viewUrn: "newViewUrn",
        otherProps: "otherData",
      });
    });
  });

  describe('when action type is "UI__MY_BETS_HERITAGE_TOGGLE_FILTER_CLICK"', () => {
    it('must return the new state with "isHeritageView" and corresponding viewUrn', () => {
      const state = myBetsReducer(
        {
          isHeritageView: false,
          viewUrn: "oldViewUrn",
          otherProps: "otherData",
        },
        {
          type: UI__MY_BETS_HERITAGE_TOGGLE_FILTER_CLICK,
          payload: {
            filter: {
              isHeritageView: true,
            },
            viewUrn: "newViewUrn",
          },
        },
      );

      expect(state).toEqual({
        isHeritageView: true,
        viewUrn: "newViewUrn",
        otherProps: "otherData",
      });
    });
  });

  describe("when action type is MY_BETS_RESET_FILTERS", () => {
    it("should return an empty object", () => {
      const state = myBetsReducer(
        { layout: {} },
        {
          type: MY_BETS_RESET_FILTERS,
        },
      );

      expect(state).toEqual({});
    });
  });

  describe("when action type is DELETE_LAYOUT", () => {
    it("should return an empty object", () => {
      const state = myBetsReducer(
        { layout: {} },
        {
          type: DELETE_LAYOUT,
        },
      );

      expect(state).toEqual({});
    });
  });
});
