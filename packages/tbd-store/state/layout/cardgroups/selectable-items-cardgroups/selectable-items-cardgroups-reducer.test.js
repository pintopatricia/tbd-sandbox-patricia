import selectableitemsCardGroupReducer from "./selectable-items-cardgroups-reducer";

const cardgroupMock = {
  urn: "ppb:tbd:cardgroup:selectableItems:Ytki8REAACYA-5OJ/r/7|31647584.1230",
  typename: "SelectableItemsCardGroup",
  title: "Title",
  items: [
    {
      startTime: "2020-11-12T17:00:00.000Z",
      venue: "Ruby",
      typename: "RaceMarketCard",
      urn: "ppb:tbd:card:racemarket:1.175262304;924.244997853|25",
    },
    {
      startTime: "2020-11-12T17:00:00.000Z",
      venue: "Newcastle",
      typename: "RaceMarketCard",
      urn: "ppb:tbd:card:racemarket:924.244997858|25",
    },
  ],
  filter: {
    countries: ["UkAndIre", "AllCountries"],
    defaultCountry: "UkAndIre",
  },
};

const stateMock = {
  "ppb:tbd:cardgroup:selectableItems:Ytki8REAACYA-5OJ/r/7|31647584.1230": cardgroupMock,
};

describe('"selectableitemsCardGroupReducer" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = selectableitemsCardGroupReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    describe("when data come from normalizer engine transformed layout", () => {
      it('must return the new state with "cardgroups"', () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: { SelectableItemsCardGroup: [cardgroupMock] },
          },
        };
        const state = selectableitemsCardGroupReducer(undefined, action);
        expect(state).toEqual(stateMock);
      });
    });
  });

  describe('when action type is "FETCH_FILTERED_SELECTABLE_ITEMS"', () => {
    it("should update the selectedOption accordingly", () => {
      const action = {
        type: "FETCH_FILTERED_SELECTABLE_ITEMS",
        payload: {
          urn: "ppb:tbd:cardgroup:selectableItems:Ytki8REAACYA-5OJ/r/7|31647584.1230",
          filterBy: {
            country: "UkAndIre",
          },
        },
      };
      const mockUrn = "ppb:tbd:cardgroup:selectableItems:Ytki8REAACYA-5OJ/r/7|31647584.1230";
      const state = selectableitemsCardGroupReducer(stateMock, action);
      expect(state).toEqual({
        ...stateMock,
        [mockUrn]: {
          ...stateMock[mockUrn],
          filter: {
            ...stateMock[mockUrn].filter,
            selectedOption: "UkAndIre",
          },
        },
      });
    });
  });

  describe("when action type is DELETE_LAYOUT", () => {
    it("should return an empty object", () => {
      const state = selectableitemsCardGroupReducer(
        { layout: {} },
        {
          type: "DELETE_LAYOUT",
        },
      );

      expect(state).toEqual({});
    });
  });
});
