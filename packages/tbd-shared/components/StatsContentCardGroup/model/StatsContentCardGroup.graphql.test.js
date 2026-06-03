import { useLazyQuery } from "@apollo/client/react";
import { renderHook } from "@testing-library/react";
import { generateLayoutSnapshot } from "@ppb/tbd-store/state/layout-snapshot";
import { useStatsContentCardGroupQuery, StatsContentCardGroupQuery } from "./StatsContentCardGroup.graphql";

const CARD_URN = "ppb:tbd:card:1";

const callFn = jest.fn();

jest.mock("@apollo/client/react", () => ({
  ...jest.requireActual("@apollo/client/react"),
  useLazyQuery: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/layout-snapshot", () => ({
  generateLayoutSnapshot: jest.fn((value) => value),
}));

function setup() {
  const { result } = renderHook(() => useStatsContentCardGroupQuery({ cardURN: CARD_URN }, { visible: true }));
  return result;
}

describe("StatsContentCardGroup.graphql", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("useStatsContentCardGroupQuery", () => {
    beforeEach(() => {
      useLazyQuery.mockReturnValue([
        callFn,
        {
          called: true,
          loading: false,
          data: {
            Cards: [
              {
                __typename: "StatsContentCardGroup",
                urn: CARD_URN,
              },
            ],
          },
        },
      ]);
    });

    it("should call useLazyQuery with the correct parameters", () => {
      setup();

      expect(useLazyQuery).toHaveBeenCalledWith(StatsContentCardGroupQuery);
    });

    it("should return the correct value", () => {
      const result = setup();

      expect(result.current).toEqual({
        loading: false,
        data: {
          card: {
            __typename: "StatsContentCardGroup",
            urn: CARD_URN,
          },
        },
      });
    });

    it("should call generateLayoutSnapshot with the correct parameters", () => {
      setup();

      expect(generateLayoutSnapshot).toHaveBeenCalledWith(
        {
          data: {
            StatsContentCardGroup: [
              {
                __typename: "StatsContentCardGroup",
                urn: CARD_URN,
              },
            ],
          },
        },
        "ppb:tbd:card:1",
      );
    });

    it("should fetch the card when the component is mounted", () => {
      useLazyQuery.mockReturnValue([
        callFn,
        {
          called: false,
          loading: false,
        },
      ]);

      setup();

      expect(callFn).toHaveBeenCalledWith({
        variables: {
          urn: CARD_URN,
        },
      });
    });
  });
});
