import { useLazyQuery } from "@apollo/client/react";
import { renderHook } from "@testing-library/react";
import { useStatsRaceResultsCardQuery, StatsRaceResultsCardQuery } from "./StatsRaceResultsCard.graphql";

const CARD_URN = "ppb:tbd:card:1";

const callFn = jest.fn();

jest.mock("@apollo/client/react", () => ({
  useLazyQuery: jest.fn(),
}));

function setup() {
  const { result } = renderHook(() => useStatsRaceResultsCardQuery({ cardURN: CARD_URN }, { visible: true }));
  return result;
}

describe("StatsRaceResultsCard.graphql", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("useStatsRaceResultsCardQuery", () => {
    beforeEach(() => {
      useLazyQuery.mockReturnValue([
        callFn,
        {
          called: true,
          loading: false,
          data: {
            Cards: [
              {
                __typename: "StatsRaceResultsCard",
                urn: CARD_URN,
              },
            ],
          },
        },
      ]);
    });

    it("should call useLazyQuery with the correct parameters", () => {
      setup();

      expect(useLazyQuery).toHaveBeenCalledWith(StatsRaceResultsCardQuery);
    });

    it("should return the correct value", () => {
      const result = setup();

      expect(result.current).toEqual({
        loading: false,
        data: {
          card: {
            __typename: "StatsRaceResultsCard",
            urn: CARD_URN,
          },
        },
      });
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

      expect(callFn).toHaveBeenCalledWith({ variables: { urn: "ppb:tbd:card:1" } });
    });
  });
});
