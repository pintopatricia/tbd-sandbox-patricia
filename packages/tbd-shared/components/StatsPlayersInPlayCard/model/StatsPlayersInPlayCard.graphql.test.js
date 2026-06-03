import { useLazyQuery } from "@apollo/client/react";
import { renderHook } from "@testing-library/react";
import {
  useStatsPlayersInPlayCardQuery,
  StatsPlayersInPlayCardQuery,
  StatsPlayersInPlayUserDetailsQuery,
  useStatsPlayersInPlayUserDetailsQuery,
} from "./StatsPlayersInPlayCard.graphql";

const CARD_URN = "ppb:tbd:card:1";

const callFn = jest.fn();

jest.mock("@apollo/client/react", () => ({
  useLazyQuery: jest.fn(),
}));

function setup() {
  const { result: cardResult } = renderHook(() =>
    useStatsPlayersInPlayCardQuery({ cardURN: CARD_URN }, { visible: true }),
  );
  const { result: userDetailsResult } = renderHook(() => useStatsPlayersInPlayUserDetailsQuery({ visible: true }));

  return {
    card: cardResult,
    userDetails: userDetailsResult,
  };
}

describe("StatsPlayersInPlayCard.graphql", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("useStatsPlayersInPlayCardQuery", () => {
    beforeEach(() => {
      useLazyQuery.mockReturnValue([
        callFn,
        {
          called: true,
          loading: false,
          data: {
            Cards: [
              {
                __typename: "StatsPlayersInPlayCard",
                urn: CARD_URN,
              },
            ],
          },
        },
      ]);
    });

    it("should call useLazyQuery with the correct parameters", () => {
      setup();

      expect(useLazyQuery).toHaveBeenCalledWith(StatsPlayersInPlayCardQuery, {
        fetchPolicy: "network-only",
      });
    });

    it("should return the correct value", () => {
      const result = setup();

      expect(result.card.current).toEqual({
        loading: false,
        data: {
          card: {
            __typename: "StatsPlayersInPlayCard",
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

      expect(callFn).toHaveBeenCalledWith();
    });
  });

  describe("useStatsPlayersInPlayUserDetailsQuery", () => {
    beforeEach(() => {
      useLazyQuery.mockReturnValue([
        callFn,
        {
          called: true,
          loading: false,
          data: {
            AppContext: {
              __typename: "AppContext",
              urn: "ppb:tbd:appContext:appContext",
            },
          },
        },
      ]);
    });

    it("should call useLazyQuery with the correct parameters", () => {
      setup();

      expect(useLazyQuery).toHaveBeenCalledWith(StatsPlayersInPlayUserDetailsQuery);
    });

    it("should return the correct value", () => {
      const result = setup();

      expect(result.userDetails.current).toEqual({
        loading: false,
        data: {
          appContext: {
            __typename: "AppContext",
            urn: "ppb:tbd:appContext:appContext",
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

      expect(callFn).toHaveBeenCalledWith();
    });
  });
});
