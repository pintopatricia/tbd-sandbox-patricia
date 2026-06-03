import futureracingcardgroups from "./future-racing-cardgroups-reducer";

const urnMock = "ppb:tbd:cardgroup:filtered:1";

const cardGroupWithFiltersMock = {
  urn: urnMock,
  title: "All matches",
  items: [
    { urn: "ppb:tbd:card:eventPrimaryMarket:1", typename: "EventMarketCard" },
    { urn: "ppb:tbd:card:eventPrimaryMarket:2", typename: "EventMarketCard" },
    { urn: "ppb:tbd:card:eventPrimaryMarket:3", typename: "EventMarketCard" },
    { urn: "ppb:tbd:card:eventPrimaryMarket:4", typename: "EventMarketCard" },
  ],
  filterOptions: {
    sortOption: "sortOption",
  },
};

const cardGroupWithMonthTypeFiltersMock = {
  urn: urnMock,
  title: "All matches",
  viewAll: {
    viewUrn: "viewUrnMock",
    viewUrl: "viewUrlMock",
  },
  items: cardGroupWithFiltersMock.items,
  filterOptions: {
    monthFilter: {
      selectedOptions: [
        { date: "June", urn: "ppb:tbd:cardfilter:monthoption:1748732400000" },
        { date: "July", urn: "ppb:tbd:cardfilter:monthoption:1751324400000" },
      ],
    },
  },
};

const cardGroupWithCountriesTypeFiltersMock = {
  urn: urnMock,
  title: "All matches",
  viewAll: {
    viewUrn: "viewUrnMock",
    viewUrl: "viewUrlMock",
  },
  items: cardGroupWithFiltersMock.items,
  filterOptions: {
    countriesFilter: {
      selectedOptions: [
        { name: "France", urn: "ppb:tbd:cardfilter:countriesoption:ZmwbrhEAAB4Avk0M/s/7" },
        { name: "South Africa", urn: "ppb:tbd:cardfilter:countriesoption:Zmwb_BEAAB8Avk2Q/s/7" },
      ],
    },
  },
};

const stateMock = {
  [urnMock]: cardGroupWithFiltersMock,
};

const stateWithMonthFilterMock = {
  [urnMock]: cardGroupWithMonthTypeFiltersMock,
};

const stateWithCountiresFilterMock = {
  [urnMock]: cardGroupWithCountriesTypeFiltersMock,
};

describe('"futureracingcardgroups" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = futureracingcardgroups(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    it('must return the new state with "couponcardgroups"', () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            FutureRacingCardGroup: [cardGroupWithFiltersMock],
          },
        },
      };
      const state = futureracingcardgroups(undefined, action);
      expect(state).toEqual(stateMock);
    });
  });

  describe('when action type is "UI__SELECTED_MONTH_FILTER_CHANGED"', () => {
    const action = {
      type: "UI__SELECTED_MONTH_FILTER_CHANGED",
      payload: {
        urn: "ppb:tbd:cardgroup:filtered:1",
        selectedOptions: [
          { date: "June", urn: "ppb:tbd:cardfilter:monthoption:1748732400000" },
          { date: "July", urn: "ppb:tbd:cardfilter:monthoption:1751324400000" },
        ],
      },
    };

    describe("when the state doesn't have monthFilter", () => {
      it("must return the initial state", () => {
        const state = futureracingcardgroups(stateMock, action);
        expect(state).toEqual(stateMock);
      });
    });

    describe("when the state have filterOptions", () => {
      it("must return the selectedOption in filterOptions", () => {
        const state = futureracingcardgroups(stateWithMonthFilterMock, action);
        expect(state).toEqual({
          "ppb:tbd:cardgroup:filtered:1": {
            ...stateWithMonthFilterMock["ppb:tbd:cardgroup:filtered:1"],
            filterOptions: {
              monthFilter: {
                selectedOptions: [
                  { date: "June", urn: "ppb:tbd:cardfilter:monthoption:1748732400000" },
                  { date: "July", urn: "ppb:tbd:cardfilter:monthoption:1751324400000" },
                ],
              },
            },
          },
        });
      });
    });
  });

  describe('when action type is "UI__SELECTED_COUNTRIES_FILTER_CHANGED"', () => {
    const action = {
      type: "UI__SELECTED_COUNTRIES_FILTER_CHANGED",
      payload: {
        urn: "ppb:tbd:cardgroup:filtered:1",
        selectedOptions: [
          { name: "France", urn: "ppb:tbd:cardfilter:countriesoption:ZmwbrhEAAB4Avk0M/s/7" },
          { name: "South Africa", urn: "ppb:tbd:cardfilter:countriesoption:Zmwb_BEAAB8Avk2Q/s/7" },
        ],
      },
    };

    describe("when the state doesn't have filteredCoupon", () => {
      it("must return the initial state", () => {
        const state = futureracingcardgroups(stateMock, {
          ...action,
          payload: { urn: "ppb:tbd:cardgroup:filtered:2" },
        });
        expect(state).toEqual(stateMock);
      });
    });

    describe("when the state doesn't have countriesFilter", () => {
      it("must return the initial state", () => {
        const state = futureracingcardgroups(stateMock, action);
        expect(state).toEqual(stateMock);
      });
    });

    describe("when the state have filterOptions", () => {
      it("must return the selectedOption in filterOptions", () => {
        const state = futureracingcardgroups(stateWithCountiresFilterMock, action);
        expect(state).toEqual({
          "ppb:tbd:cardgroup:filtered:1": {
            ...stateWithCountiresFilterMock["ppb:tbd:cardgroup:filtered:1"],
            filterOptions: {
              countriesFilter: {
                selectedOptions: [
                  { name: "France", urn: "ppb:tbd:cardfilter:countriesoption:ZmwbrhEAAB4Avk0M/s/7" },
                  { name: "South Africa", urn: "ppb:tbd:cardfilter:countriesoption:Zmwb_BEAAB8Avk2Q/s/7" },
                ],
              },
            },
          },
        });
      });
    });
  });

  describe('when action type is "DELETE_VIEW_ITEMS"', () => {
    it("should remove those URNS from list items", () => {
      const action = {
        type: "DELETE_VIEW_ITEMS",
        payload: ["ppb:tbd:card:eventPrimaryMarket:3"],
      };

      const state = futureracingcardgroups(stateMock, action);

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

  describe("when action type is DELETE_LAYOUT", () => {
    it("should return an empty object", () => {
      const state = futureracingcardgroups(
        { layout: {} },
        {
          type: "DELETE_LAYOUT",
        },
      );

      expect(state).toEqual({});
    });
  });
});
