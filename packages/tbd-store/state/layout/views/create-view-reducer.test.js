import createViewReducer from "./create-view-reducer";

const INITIAL_STATE_MOCK = {
  "urn:1": {
    urn: "urn:1",
    items: [
      {
        urn: "urn:card:1",
        prop: "value",
      },
    ],
  },
  "urn:2": {
    urn: "urn:2",
    items: [],
  },
};

describe("createViewReducer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers().setSystemTime(new Date(1739542487386));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe("FETCH_CATALOGUE_SUCCESS", () => {
    it("should override state views with payload views", () => {
      const reducer = createViewReducer("GenericView");
      const result = reducer(
        { ...INITIAL_STATE_MOCK },
        {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: {
              GenericView: [
                {
                  urn: "urn:1",
                  items: [
                    {
                      urn: "urn:card:2",
                      prop: "value",
                    },
                  ],
                },
              ],
            },
          },
        },
      );

      expect(result).toEqual({
        "urn:1": {
          urn: "urn:1",
          items: [{ urn: "urn:card:2", prop: "value" }],
          metadata: {
            cacheTimestamp: 1739542487386,
          },
        },
        "urn:2": {
          urn: "urn:2",
          items: [],
        },
      });
    });

    it("should ignore unsupported views", () => {
      const reducer = createViewReducer("GenericView");
      const result = reducer(
        {},
        {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: {
              RandomView: [
                {
                  urn: "urn:1",
                  newProp: "newValue",
                },
              ],
            },
          },
        },
      );

      expect(result).toEqual({});
    });
  });

  describe("PUSH", () => {
    it("should clean up the state", () => {
      const reducer = createViewReducer("generic");
      const result = reducer(
        { random: "state" },
        {
          type: "PUSH",
          payload: {},
        },
      );

      expect(result).toEqual({ random: "state" });
    });
  });

  describe("DELETE_VIEW", () => {
    it("should clean the view", () => {
      const reducer = createViewReducer("generic");
      const result = reducer(
        { ...INITIAL_STATE_MOCK },
        {
          type: "DELETE_VIEW",
          payload: "urn:1",
        },
      );

      expect(result).toEqual({
        "urn:2": {
          urn: "urn:2",
          items: [],
        },
      });
    });
  });

  describe("DELETE_VIEW_ITEMS", () => {
    it("should remove flagged items", () => {
      const reducer = createViewReducer("generic");
      const result = reducer(
        { ...INITIAL_STATE_MOCK },
        {
          type: "DELETE_VIEW_ITEMS",
          payload: ["urn:card:1"],
        },
      );

      expect(result["urn:1"].items).toEqual([]);
    });
  });

  describe("DELETE_LAYOUT", () => {
    it("should return an empty object", () => {
      const reducer = createViewReducer("GenericView");
      const state = reducer(
        { layout: {} },
        {
          type: "DELETE_LAYOUT",
        },
      );

      expect(state).toEqual({});
    });
  });
});
