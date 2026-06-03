import racesByTimeRangeCardgroupsReducer from "./races-by-time-range-cardgroups-reducer";

const urnMock = "ppb:tbd:cardgroup:byTimeRange:A/s/7";

const racesByTimeRangeCardgroupMock = {
  urn: "ppb:tbd:cardgroup:byTimeRange:A/s/7",
  typename: "RacesByTimeRangeCardGroup",
  filterOptions: {
    urn: "ppb:tbd:cardgroup:byTimeRange:A/s/7",
    availableOptions: [{ urn: "ppb:tbd:cardfilter:countriesoption:X/s/7", name: "UK" }],
  },
  pageInfo: false,
  items: [
    { urn: "ppb:tbd:card:byTimeRange:7|1", typename: "RaceByTimeRangeCard" },
    { urn: "ppb:tbd:card:byTimeRange:7|2", typename: "RaceByTimeRangeCard" },
    { urn: "ppb:tbd:card:byTimeRange:7|3", typename: "RaceByTimeRangeCard" },
    { urn: "ppb:tbd:card:byTimeRange:7|4", typename: "RaceByTimeRangeCard" },
  ],
};

const cardGroupWithCountriesTypeFiltersMock = {
  urn: urnMock,
  title: "All matches",
  viewAll: {
    viewUrn: "viewUrnMock",
    viewUrl: "viewUrlMock",
  },
  items: racesByTimeRangeCardgroupMock.items,
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
  [urnMock]: racesByTimeRangeCardgroupMock,
};

const stateWithCountiresFilterMock = {
  [urnMock]: cardGroupWithCountriesTypeFiltersMock,
};

describe('"racesByTimeRangeCardgroupsReducer" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = racesByTimeRangeCardgroupsReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    it('must return the new state with "bytimerangecardgroups"', () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            RacesByTimeRangeCardGroup: [racesByTimeRangeCardgroupMock],
          },
        },
      };
      const state = racesByTimeRangeCardgroupsReducer(undefined, action);
      expect(state).toEqual(stateMock);
    });
  });

  describe('when action type is "DELETE_VIEW_ITEMS"', () => {
    it("should remove those URNS from list items", () => {
      const action = {
        type: "DELETE_VIEW_ITEMS",
        payload: ["ppb:tbd:card:byTimeRange:7|3"],
      };

      const state = racesByTimeRangeCardgroupsReducer(stateMock, action);

      expect(state["ppb:tbd:cardgroup:byTimeRange:A/s/7"].items).toEqual([
        {
          typename: "RaceByTimeRangeCard",
          urn: "ppb:tbd:card:byTimeRange:7|1",
        },
        {
          typename: "RaceByTimeRangeCard",
          urn: "ppb:tbd:card:byTimeRange:7|2",
        },
        {
          typename: "RaceByTimeRangeCard",
          urn: "ppb:tbd:card:byTimeRange:7|4",
        },
      ]);
    });
  });

  describe('when action type is "UI__SELECTED_COUNTRIES_FILTER_CHANGED"', () => {
    const action = {
      type: "UI__SELECTED_COUNTRIES_FILTER_CHANGED",
      payload: {
        urn: "ppb:tbd:cardgroup:byTimeRange:A/s/7",
        selectedOptions: [
          { name: "France", urn: "ppb:tbd:cardfilter:countriesoption:ZmwbrhEAAB4Avk0M/s/7" },
          { name: "South Africa", urn: "ppb:tbd:cardfilter:countriesoption:Zmwb_BEAAB8Avk2Q/s/7" },
        ],
      },
    };

    describe("when the state doesn't have filteredCoupon", () => {
      it("must return the initial state", () => {
        const state = racesByTimeRangeCardgroupsReducer(stateMock, {
          ...action,
          payload: { urn: "ppb:tbd:cardgroup:filtered:2" },
        });
        expect(state).toEqual(stateMock);
      });
    });

    describe("when the state doesn't have countriesFilter", () => {
      it("must return the initial state", () => {
        const state = racesByTimeRangeCardgroupsReducer(stateMock, action);
        expect(state).toEqual(stateMock);
      });
    });

    describe("when the state have filterOptions", () => {
      it("must return the selectedOption in filterOptions", () => {
        const state = racesByTimeRangeCardgroupsReducer(stateWithCountiresFilterMock, action);
        expect(state).toEqual({
          "ppb:tbd:cardgroup:byTimeRange:A/s/7": {
            ...stateWithCountiresFilterMock["ppb:tbd:cardgroup:byTimeRange:A/s/7"],
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

  describe("when action type is DELETE_LAYOUT", () => {
    it("should return an empty object", () => {
      const state = racesByTimeRangeCardgroupsReducer(
        { layout: {} },
        {
          type: "DELETE_LAYOUT",
        },
      );

      expect(state).toEqual({});
    });
  });
});
