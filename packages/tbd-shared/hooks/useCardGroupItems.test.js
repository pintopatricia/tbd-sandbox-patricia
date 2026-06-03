import { renderHook } from "@testing-library/react";
import useCardGroupItems from "./useCardGroupItems";

describe("useCardGroupItems", () => {
  const PARTIALS_MOCK = [
    { typename: "CARD_1", content: "RANDOM_CONTENT" },
    { typename: "CARD_2", content: "MORE_RANDOM_CONTENT" },
    { typename: "CARD_3", content: "EVEN_MORE_RANDOM_CONTENT" },
  ];
  const IMPLEMENTED_CARDS = ["CARD_1", "CARD_3"];
  const IS_CARD_IMPLEMENTED_MOCK = jest.fn((typename) => IMPLEMENTED_CARDS.includes(typename));

  it("should return only the items that `isCardImplemented` returns as true", () => {
    const { result } = renderHook(() => useCardGroupItems(PARTIALS_MOCK, IS_CARD_IMPLEMENTED_MOCK));

    expect(result.current).toEqual([
      { typename: "CARD_1", content: "RANDOM_CONTENT" },
      { typename: "CARD_3", content: "EVEN_MORE_RANDOM_CONTENT" },
    ]);
  });
});
