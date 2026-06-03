import virtualCardGroupsReducer from "./virtual-cardgroups-reducer";

const cardgroupMock = {
  urn: "ppb:tbd:cardgroup:virtualcardgroup:1",
  typename: "VirtualCardGroup",
  isClosed: false,
  isDisabled: false,
  items: [
    {
      typename: "VirtualEventDetailsCard",
      urn: "ppb:tbd:card:virtualeventdetailscard:1",
    },
    {
      typename: "VirtualMarketCard",
      urn: "ppb:tbd:card:virtualmarketcard:924.244997858",
    },
  ],
};

const cardgroupUpdateMock = {
  urn: "ppb:tbd:cardgroup:virtualcardgroup:1",
  typename: "VirtualCardGroup",
  isClosed: false,
  isDisabled: false,
  items: [
    {
      typename: "VirtualEventDetailsCard",
      urn: "ppb:tbd:card:virtualeventdetailscard:1",
    },
  ],
};

const stateMock = {
  "ppb:tbd:cardgroup:virtualcardgroup:1": cardgroupMock,
};

describe('"virtualCardGroupsReducer" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = virtualCardGroupsReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    describe("when data come from normalizer engine transformed layout", () => {
      it('must return the new state with "cardgroups"', () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: { VirtualCardGroup: [cardgroupMock] },
          },
        };
        const state = virtualCardGroupsReducer(undefined, action);

        expect(state).toEqual(stateMock);
      });
    });

    describe("when there are already items in a card", () => {
      it("should retain the initial items", () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: { VirtualCardGroup: [cardgroupUpdateMock] },
          },
        };
        const state = virtualCardGroupsReducer(
          {
            "ppb:tbd:cardgroup:virtualcardgroup:1": cardgroupMock,
          },
          action,
        );

        expect(state["ppb:tbd:cardgroup:virtualcardgroup:1"].items).toEqual(cardgroupMock.items);
      });
    });
  });

  describe("when action type is DELETE_LAYOUT", () => {
    it("should return an empty object", () => {
      const state = virtualCardGroupsReducer(
        { layout: {} },
        {
          type: "DELETE_LAYOUT",
        },
      );

      expect(state).toEqual({});
    });
  });
});
