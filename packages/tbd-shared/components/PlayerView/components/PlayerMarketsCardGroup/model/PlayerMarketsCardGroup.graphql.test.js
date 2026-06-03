import { useLazyQuery } from "@apollo/client/react";
import { renderHook } from "@testing-library/react";
import { usePlayerMarketsCardGroupQuery, PlayerMarketsCardGroupQuery } from "./PlayerMarketsCardGroup.graphql";

const CARD_GROUP_URN = "ppb:tbd:cardgroup:playermarkets:1";

const callFn = jest.fn();

jest.mock("@apollo/client/react", () => ({
  useLazyQuery: jest.fn(),
}));

function setup(cardURN = CARD_GROUP_URN) {
  const { result } = renderHook(() => usePlayerMarketsCardGroupQuery({ cardURN }, { visible: true }));

  return result;
}

describe("PlayerMarketsCardGroup.graphql", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("usePlayerMarketsCardGroupQuery", () => {
    beforeEach(() => {
      useLazyQuery.mockReturnValue([
        callFn,
        {
          called: true,
          loading: false,
          data: {
            Cards: [
              {
                __typename: "PlayerMarketsCardGroup",
                urn: CARD_GROUP_URN,
              },
            ],
          },
        },
      ]);
    });

    it("should call useLazyQuery with the correct parameters", () => {
      setup();

      expect(useLazyQuery).toHaveBeenCalledWith(PlayerMarketsCardGroupQuery);
    });

    it("should return the correct value", () => {
      const result = setup();

      expect(result.current).toEqual({
        called: true,
        loading: false,
        data: {
          cardGroup: {
            __typename: "PlayerMarketsCardGroup",
            urn: CARD_GROUP_URN,
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

      expect(callFn).toHaveBeenCalledWith({
        variables: {
          urn: CARD_GROUP_URN,
        },
      });
    });
  });
});
