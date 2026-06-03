import { useQuery } from "@apollo/client/react";
import { renderHook } from "@testing-library/react";
import { PlayerViewQuery, usePlayerViewQuery } from "./PlayerView.graphql";

jest.mock("@apollo/client/react", () => ({
  useQuery: jest.fn(),
}));

const URN_MOCK = "ppb:tbd:view:player:1|2";
const DATA_MOCK = "some data";

function setup(urn = URN_MOCK) {
  const { result } = renderHook(() => usePlayerViewQuery(urn));

  return result;
}

describe("PlayerView.graphql", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("usePlayerViewQuery", () => {
    beforeEach(() => {
      useQuery.mockReturnValue({
        called: true,
        loading: false,
        data: DATA_MOCK,
      });
    });

    it("should call useQuery with the correct parameters", () => {
      setup();

      expect(useQuery).toHaveBeenCalledWith(PlayerViewQuery, {
        variables: {
          urn: URN_MOCK,
        },
      });
    });

    it("should return the correct value", () => {
      const result = setup();

      expect(result.current).toEqual({
        loading: false,
        data: DATA_MOCK,
      });
    });

    describe("when loading is true", () => {
      beforeEach(() => {
        useQuery.mockReturnValue({
          called: true,
          loading: true,
          data: null,
        });
      });

      it("should return loading true and data null", () => {
        const result = setup();

        expect(result.current).toEqual({
          loading: true,
          data: null,
        });
      });
    });
  });
});
