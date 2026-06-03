import { useQuery } from "@apollo/client/react";
import { renderHook } from "@testing-library/react";
import {
  SkyBetClubTrackerQuery,
  SkyBetClubTrackerUserDetailsQuery,
  useSkyBetClubTrackerQuery,
  useSkyBetClubTrackerUserDetailsQuery,
} from "./SkyBetClubTracker.graphql";

const CARD_URN = "ppb:tbd:card:skyBetClubTracker:skyBetClubTracker";

jest.mock("@apollo/client/react", () => ({
  useQuery: jest.fn(),
}));

function setup() {
  const { result: cardResult } = renderHook(() => useSkyBetClubTrackerQuery({ cardURN: CARD_URN }));
  const { result: userDetailsResult } = renderHook(() => useSkyBetClubTrackerUserDetailsQuery());

  return {
    card: cardResult,
    userDetails: userDetailsResult,
  };
}

describe("SkyBetClubTrackerCard.graphql", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("useSkyBetClubTrackerQuery", () => {
    beforeEach(() => {
      useQuery.mockReturnValue({
        called: true,
        loading: false,
        data: {
          Cards: [
            {
              __typename: "SkyBetClubTrackerCard",
              urn: CARD_URN,
            },
          ],
        },
      });
    });

    it("should call useQuery with the correct parameters", () => {
      setup();

      expect(useQuery).toHaveBeenCalledWith(SkyBetClubTrackerQuery, {
        variables: {
          urn: CARD_URN,
        },
        fetchPolicy: "network-only",
      });
    });

    it("should return the correct value", () => {
      const result = setup();

      expect(result.card.current).toEqual({
        loading: false,
        data: {
          card: {
            __typename: "SkyBetClubTrackerCard",
            urn: CARD_URN,
          },
        },
      });
    });
  });

  describe("useSkyBetClubTrackerUserDetailsQuery", () => {
    beforeEach(() => {
      useQuery.mockReturnValue({
        called: true,
        loading: false,
        data: {
          AppContext: {
            __typename: "AppContext",
            urn: "ppb:tbd:appContext:appContext",
          },
        },
      });
    });

    it("should call useQuery with the correct parameters", () => {
      setup();

      expect(useQuery).toHaveBeenCalledWith(SkyBetClubTrackerUserDetailsQuery);
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
  });
});
