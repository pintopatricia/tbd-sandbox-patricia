import filteredCouponCardgroupsReducer from "./filtered-coupon-cardgroups-reducer";

const urnMock = "ppb:tbd:cardgroup:filtered:1";
const selectedMarketTabMock = "Sportsbook";

const cardGroupMock = {
  urn: urnMock,
  title: "All matches",
  viewAll: {
    viewUrn: "viewUrnMock",
    viewUrl: "viewUrlMock",
  },
  items: [
    { urn: "ppb:tbd:card:eventPrimaryMarket:1", typename: "EventMarketCard" },
    { urn: "ppb:tbd:card:eventPrimaryMarket:2", typename: "EventMarketCard" },
    { urn: "ppb:tbd:card:eventPrimaryMarket:3", typename: "EventMarketCard" },
    { urn: "ppb:tbd:card:eventPrimaryMarket:4", typename: "EventMarketCard" },
  ],
  filterOptions: {},
};

const cardGroupWithFiltersMock = {
  urn: urnMock,
  title: "All matches",
  viewAll: {
    viewUrn: "viewUrnMock",
    viewUrl: "viewUrlMock",
  },
  items: cardGroupMock.items,
  filterOptions: {
    sortOption: "sortOption",
  },
};

const cardGroupWithMarketTypeFiltersMock = {
  urn: urnMock,
  title: "All matches",
  viewAll: {
    viewUrn: "viewUrnMock",
    viewUrl: "viewUrlMock",
  },
  items: cardGroupMock.items,
  filterOptions: {
    marketTypeFilter: {},
  },
};

const cardGroupWithDateRangeTypeFiltersMock = {
  urn: urnMock,
  title: "All matches",
  viewAll: {
    viewUrn: "viewUrnMock",
    viewUrl: "viewUrlMock",
  },
  items: cardGroupMock.items,
  filterOptions: {
    dateRangeFilter: {
      selectedOption: {
        urn: "ppb:tbd:daterangeoption:cHBiOnRiZDpjYX",
        name: "Today",
      },
    },
  },
};

const cardGroupWithSortTypeFiltersMock = {
  urn: urnMock,
  title: "All matches",
  viewAll: {
    viewUrn: "viewUrnMock",
    viewUrl: "viewUrlMock",
  },
  items: cardGroupMock.items,
  filterOptions: {
    sortOption: {
      selectedOption: "RANK",
    },
  },
};

const cardGroupWithCompetitionTypeFiltersMock = {
  urn: urnMock,
  title: "All matches",
  viewAll: {
    viewUrn: "viewUrnMock",
    viewUrl: "viewUrlMock",
  },
  items: cardGroupMock.items,
  filterOptions: {
    competitionsFilter: {
      selectedOptions: [
        { name: "Spanish La Liga", urn: "ppb:competition:512051" },
        { name: "Italian Serie A", urn: "ppb:competition:554973" },
      ],
    },
  },
};

const stateMock = {
  [urnMock]: cardGroupMock,
};

const stateWithFilterMock = {
  [urnMock]: cardGroupWithFiltersMock,
};

const stateWithMarketTypeFilterMock = {
  [urnMock]: cardGroupWithMarketTypeFiltersMock,
};

const stateWithDateRangeFilterMock = {
  [urnMock]: cardGroupWithDateRangeTypeFiltersMock,
};

const stateWithSortFilterMock = {
  [urnMock]: cardGroupWithSortTypeFiltersMock,
};

const stateWithCompetitionFilterMock = {
  [urnMock]: cardGroupWithCompetitionTypeFiltersMock,
};

describe('"filteredCouponCardgroupsReducer" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = filteredCouponCardgroupsReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    it('must return the new state with "filteredcouponcardgroups"', () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            FilteredCouponCardGroup: [cardGroupMock],
          },
        },
      };
      const state = filteredCouponCardgroupsReducer(undefined, action);
      expect(state).toEqual(stateMock);
    });
    it("must maintain the filters, title and viewAll between states", () => {
      const firstAction = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            FilteredCouponCardGroup: [cardGroupWithFiltersMock],
          },
        },
      };
      const secondAction = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            FilteredCouponCardGroup: [{ ...cardGroupMock, title: undefined, viewAll: undefined }],
          },
        },
      };
      const firstState = filteredCouponCardgroupsReducer(undefined, firstAction);
      const secondState = filteredCouponCardgroupsReducer(firstState, secondAction);

      expect(secondState).toEqual(stateWithFilterMock);
    });

    describe('and "selectedMarketTab" is defined', () => {
      it('must not override "selectedMarketTab"', () => {
        const stateWithSelectedMarketTab = {
          [urnMock]: {
            selectedMarketTab: selectedMarketTabMock,
          },
        };

        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: {
              FilteredCouponCardGroup: [cardGroupMock],
            },
          },
        };

        const state = filteredCouponCardgroupsReducer(stateWithSelectedMarketTab, action);
        expect(state[urnMock].selectedMarketTab).toEqual(selectedMarketTabMock);
      });
    });
  });

  describe('when action type is "DELETE_VIEW_ITEMS"', () => {
    it("should remove those URNS from list items", () => {
      const action = {
        type: "DELETE_VIEW_ITEMS",
        payload: ["ppb:tbd:card:eventPrimaryMarket:3"],
      };

      const state = filteredCouponCardgroupsReducer(stateMock, action);

      expect(state["ppb:tbd:cardgroup:filtered:1"].items).toEqual([
        {
          typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:1",
        },
        {
          typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:2",
        },
        {
          typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:4",
        },
      ]);
    });
  });

  describe('when action type is "UI__SELECTED_MARKET_SWITCHER"', () => {
    const action = {
      type: "UI__SELECTED_MARKET_SWITCHER",
      payload: {
        urn: "ppb:tbd:cardgroup:filtered:1",
        selectedOption: {
          marketType: "ppb:marketType:OVER_UNDER_15",
          name: "Over/Under 1.5 Goals",
        },
      },
    };

    describe("when the state doesn't have marketTypeFilter", () => {
      it("must return the initial state", () => {
        const state = filteredCouponCardgroupsReducer(stateWithFilterMock, action);
        expect(state).toEqual(stateWithFilterMock);
      });
    });

    describe("when the state have filterOptions", () => {
      it("must return the selectedOption in filterOptions", () => {
        const state = filteredCouponCardgroupsReducer(stateWithMarketTypeFilterMock, action);
        expect(state).toEqual({
          "ppb:tbd:cardgroup:filtered:1": {
            ...stateWithMarketTypeFilterMock["ppb:tbd:cardgroup:filtered:1"],
            filterOptions: {
              marketTypeFilter: {
                selectedOption: {
                  marketType: "ppb:marketType:OVER_UNDER_15",
                  name: "Over/Under 1.5 Goals",
                },
              },
            },
          },
        });
      });
    });
  });

  describe('when action type is "UI__SELECTED_FILTER_CHANGED"', () => {
    const action = {
      type: "UI__SELECTED_FILTER_CHANGED",
      payload: {
        urn: "ppb:tbd:cardgroup:filtered:1",
        selectedOption: {
          urn: "ppb:tbd:daterangeoption:cHBiOnRiZDpjYX",
          name: "Today",
        },
      },
    };

    describe("when the state doesn't have dateRangeFilter", () => {
      it("must return the initial state", () => {
        const state = filteredCouponCardgroupsReducer(stateWithFilterMock, action);
        expect(state).toEqual(stateWithFilterMock);
      });
    });

    describe("when the state have filterOptions", () => {
      it("must return the selectedOption in filterOptions", () => {
        const state = filteredCouponCardgroupsReducer(stateWithDateRangeFilterMock, action);
        expect(state).toEqual({
          "ppb:tbd:cardgroup:filtered:1": {
            ...stateWithDateRangeFilterMock["ppb:tbd:cardgroup:filtered:1"],
            filterOptions: {
              dateRangeFilter: {
                selectedOption: {
                  urn: "ppb:tbd:daterangeoption:cHBiOnRiZDpjYX",
                  name: "Today",
                },
              },
            },
          },
        });
      });
    });
  });

  describe('when action type is "UI__SELECTED_SORT_FILTER_CHANGED"', () => {
    const action = {
      type: "UI__SELECTED_SORT_FILTER_CHANGED",
      payload: {
        urn: "ppb:tbd:cardgroup:filtered:1",
        selectedOption: "RANK",
      },
    };

    describe("when the state doesn't have sortFilter", () => {
      it("must return the initial state", () => {
        const state = filteredCouponCardgroupsReducer(stateWithCompetitionFilterMock, action);
        expect(state).toEqual(stateWithCompetitionFilterMock);
      });
    });

    describe("when the state have filterOptions", () => {
      it("must return the selectedOption in filterOptions", () => {
        const state = filteredCouponCardgroupsReducer(stateWithSortFilterMock, action);
        expect(state).toEqual({
          "ppb:tbd:cardgroup:filtered:1": {
            ...stateWithSortFilterMock["ppb:tbd:cardgroup:filtered:1"],
            filterOptions: {
              sortOption: {
                selectedOption: "RANK",
              },
            },
          },
        });
      });
    });
  });

  describe('when action type is "UI__SELECTED_COMPETITIONS_FILTER_CHANGED"', () => {
    const action = {
      type: "UI__SELECTED_COMPETITIONS_FILTER_CHANGED",
      payload: {
        urn: "ppb:tbd:cardgroup:filtered:1",
        selectedOptions: [
          { name: "Spanish La Liga", urn: "ppb:competition:512051" },
          { name: "Italian Serie A", urn: "ppb:competition:554973" },
        ],
      },
    };

    describe("when the state doesn't have competitionsFilter", () => {
      it("must return the initial state", () => {
        const state = filteredCouponCardgroupsReducer(stateWithFilterMock, action);
        expect(state).toEqual(stateWithFilterMock);
      });
    });

    describe("when the state have filterOptions", () => {
      it("must return the selectedOption in filterOptions", () => {
        const state = filteredCouponCardgroupsReducer(stateWithCompetitionFilterMock, action);
        expect(state).toEqual({
          "ppb:tbd:cardgroup:filtered:1": {
            ...stateWithCompetitionFilterMock["ppb:tbd:cardgroup:filtered:1"],
            filterOptions: {
              competitionsFilter: {
                selectedOptions: [
                  { name: "Spanish La Liga", urn: "ppb:competition:512051" },
                  { name: "Italian Serie A", urn: "ppb:competition:554973" },
                ],
              },
            },
          },
        });
      });
    });
  });

  describe("when action type is DELETE_LAYOUT", () => {
    it("should return an empty object", () => {
      const state = filteredCouponCardgroupsReducer(
        { layout: {} },
        {
          type: "DELETE_LAYOUT",
        },
      );

      expect(state).toEqual({});
    });
  });
});
