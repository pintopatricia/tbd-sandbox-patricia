import { DELETE_LAYOUT, DELETE_VIEW_ITEMS, FETCH_CATALOGUE_SUCCESS } from "../../../../actions";
import { UI__CLICK_PEBBLE_ITEM } from "../../../../actions/interface";

import pebbleCardGroupReducer from "./pebble-cardgroups-reducer";

const URN_MOCK = "ppb:tbd:cardgroup:pebble:marketTemplateEvent:YaC9ThIAACAAN6LQ/e/34149631";
const CARD_GROUP_MOCK = {
  typename: "PebbleCardGroup",
  urn: URN_MOCK,
  items: [
    {
      name: "3 Places",
      typename: "MarketCard",
      urn: "ppb:tbd:card:market:1.175262306;924.244997857|25",
    },
    {
      name: "Not To Be Placed",
      typename: "MarketCard",
      urn: "ppb:tbd:card:market:924.244997858|25",
    },
  ],
  selectedItemUrn: "ppb:tbd:card:market:1.175262306;924.244997857|25",
  pebbleExpanded: true,
};
const STATE_MOCK = {
  [URN_MOCK]: CARD_GROUP_MOCK,
};

describe('"pebbleCardGroupReducer" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = pebbleCardGroupReducer(undefined, {});

      expect(state).toEqual({});
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    describe("when data comes from normalizer engine transformed layout", () => {
      it('must return the new state with "cardgroups"', () => {
        const state = pebbleCardGroupReducer(undefined, {
          type: FETCH_CATALOGUE_SUCCESS,
          payload: {
            data: { PebbleCardGroup: [CARD_GROUP_MOCK] },
          },
        });

        expect(state).toEqual(STATE_MOCK);
      });
    });
  });

  describe('when action type is "DELETE_VIEW_ITEMS"', () => {
    it("should remove those URNS from list items", () => {
      const state = pebbleCardGroupReducer(STATE_MOCK, {
        type: DELETE_VIEW_ITEMS,
        payload: ["ppb:tbd:card:market:924.244997858|25"],
      });

      expect(state[URN_MOCK].items).toEqual([
        {
          name: "3 Places",
          typename: "MarketCard",
          urn: "ppb:tbd:card:market:1.175262306;924.244997857|25",
        },
      ]);
    });
  });

  describe("when action type is DELETE_LAYOUT", () => {
    it("should return an empty object", () => {
      const state = pebbleCardGroupReducer(STATE_MOCK, {
        type: DELETE_LAYOUT,
      });

      expect(state).toEqual({});
    });
  });

  describe('when action type is "UI__CLICK_PEBBLE_ITEM"', () => {
    it("should update the selectedItemUrn accordingly", () => {
      const state = pebbleCardGroupReducer(STATE_MOCK, {
        type: UI__CLICK_PEBBLE_ITEM,
        payload: {
          cardGroupURN: URN_MOCK,
          pebbleURN: "ppb:tbd:card:market:924.244997858|25",
        },
      });

      expect(state).toEqual({
        ...STATE_MOCK,
        [URN_MOCK]: {
          ...STATE_MOCK[URN_MOCK],
          selectedItemUrn: "ppb:tbd:card:market:924.244997858|25",
        },
      });
    });
  });
});
