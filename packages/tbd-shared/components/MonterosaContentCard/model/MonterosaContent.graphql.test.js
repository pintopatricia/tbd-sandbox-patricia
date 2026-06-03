import { useLazyQuery } from "@apollo/client/react";
import { renderHook } from "@testing-library/react";
import {
  useMonterosaAppContextQuery,
  useMonterosaContentCardQuery,
  MonterosaAppContextQuery,
  MonterosaContentQuery,
} from "./MonterosaContent.graphql";

const CARD_URN = "ppb:tbd:card:1";
const fetchMockFn = jest.fn();

jest.mock("@apollo/client/react", () => ({
  useLazyQuery: jest.fn(),
}));

function setup(visible = true) {
  const { result } = renderHook(() => useMonterosaContentCardQuery({ cardURN: CARD_URN }, { visible }));
  return result;
}

describe("MonterosaContent.graphql", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("useMonterosaContentCardQuery", () => {
    beforeEach(() => {
      useLazyQuery.mockReturnValue([
        fetchMockFn,
        {
          called: true,
          loading: false,
          data: {
            Cards: [
              {
                __typename: "MonterosaContentCard",
                urn: CARD_URN,
                host: "host",
                projectId: "projectId",
                monterosaEventId: "eventId",
              },
            ],
          },
        },
      ]);
    });

    it("should call useLazyQuery with the correct parameters", () => {
      setup();
      expect(useLazyQuery).toHaveBeenCalledWith(MonterosaContentQuery);
    });

    it("should return the correct value", () => {
      const result = setup();
      expect(result.current).toEqual({
        called: true,
        loading: false,
        data: {
          card: {
            __typename: "MonterosaContentCard",
            urn: CARD_URN,
            host: "host",
            projectId: "projectId",
            monterosaEventId: "eventId",
          },
        },
      });
    });

    it("should fetch the card when visible is true", () => {
      useLazyQuery.mockReturnValue([
        fetchMockFn,
        {
          called: false,
          loading: false,
        },
      ]);
      setup();
      expect(fetchMockFn).toHaveBeenCalledWith({
        variables: {
          urn: CARD_URN,
        },
      });
    });

    it("should not fetch the card when visible is false", () => {
      useLazyQuery.mockReturnValue([
        fetchMockFn,
        {
          called: false,
          loading: false,
        },
      ]);
      setup(false);
      expect(fetchMockFn).not.toHaveBeenCalled();
    });
  });

  describe("useMonterosaAppContextQuery", () => {
    function setupAppContext(visible = true) {
      const { result } = renderHook(() => useMonterosaAppContextQuery({ visible }));
      return result;
    }

    beforeEach(() => {
      useLazyQuery.mockReturnValue([
        fetchMockFn,
        {
          called: true,
          loading: false,
          data: {
            AppContext: {
              __typename: "AppContextDetails",
              urn: "ppb:tbd:context:app",
              preferences: {
                sportsbookOddsDisplay: {
                  __typename: "SportsbookOddsDisplayPreference",
                  urn: "ppb:tbd:preference:sporsbookOddsDisplay:sportsbookOddsDisplayPreference",
                  selectedOddsDisplayFormat: "FRACTIONAL",
                },
              },
            },
          },
        },
      ]);
    });

    it("should call useLazyQuery with the correct parameters", () => {
      setupAppContext();
      expect(useLazyQuery).toHaveBeenCalledWith(MonterosaAppContextQuery);
    });

    it("should return the correct value", () => {
      const result = setupAppContext();
      expect(result.current).toEqual({
        called: true,
        loading: false,
        data: {
          appContext: {
            __typename: "AppContextDetails",
            urn: "ppb:tbd:context:app",
            preferences: {
              sportsbookOddsDisplay: {
                __typename: "SportsbookOddsDisplayPreference",
                urn: "ppb:tbd:preference:sporsbookOddsDisplay:sportsbookOddsDisplayPreference",
                selectedOddsDisplayFormat: "FRACTIONAL",
              },
            },
          },
        },
      });
    });

    it("should fetch app context when visible is true", () => {
      useLazyQuery.mockReturnValue([
        fetchMockFn,
        {
          called: false,
          loading: false,
        },
      ]);

      setupAppContext();
      expect(fetchMockFn).toHaveBeenCalled();
    });

    it("should not fetch app context when visible is false", () => {
      useLazyQuery.mockReturnValue([
        fetchMockFn,
        {
          called: false,
          loading: false,
        },
      ]);

      setupAppContext(false);
      expect(fetchMockFn).not.toHaveBeenCalled();
    });
  });
});
