import { act, renderHook } from "@testing-library/react-native";
import { useNativeLazyLoading } from "./useNativeLazyLoading.native";

const FAKE_CALLBACK = jest.fn();
const ITEMS_URNS = [
  { urn: "urn1", typename: "Card" },
  { urn: "urn2", typename: "Card" },
  { urn: "urn3", typename: "Card" },
  { urn: "urn4", typename: "Card" },
];
const VISIBLE_ITEMS = {
  viewableItems: [
    {
      item: {
        urn: "urn1",
      },
      isViewable: true,
    },
    {
      item: {
        urn: "urn2",
      },
      isViewable: false,
    },
    {
      item: {
        urn: "urn3",
      },
      isViewable: true,
    },
  ],
  changed: [
    {
      item: {
        urn: "urn4",
      },
      isViewable: true,
    },
    {
      item: {
        urn: "urn5",
      },
      isViewable: false,
    },
  ],
};
const ITEMS_MOCK = [
  { urn: "urn1", typename: "Card" },
  { urn: "urn2", typename: "Card" },
  { urn: "urn3", typename: "Card" },
  { urn: "urn4", typename: "Card" },
];

function setup({ fetchCardsCallback = () => {}, batchSize = 4 }) {
  return renderHook((props) => useNativeLazyLoading(props.items, props.fetchCardsCallback, props.batchSize), {
    initialProps: { items: ITEMS_MOCK, fetchCardsCallback, batchSize },
  });
}

describe("useNativeLazyLoading", () => {
  beforeEach(jest.clearAllMocks);

  describe("when is the first time we ask for the cards", () => {
    it("should dispatch action once item is viewable", () => {
      // render hook result
      const { result } = setup({ fetchCardsCallback: FAKE_CALLBACK });
      act(() => {
        result.current(VISIBLE_ITEMS);
      });

      expect(FAKE_CALLBACK).toHaveBeenCalledWith("urn1", ITEMS_URNS, 4);
      expect(FAKE_CALLBACK).toHaveBeenCalledWith("urn3", ITEMS_URNS, 4);
      expect(FAKE_CALLBACK).not.toHaveBeenCalledWith("urn2", ITEMS_URNS, 4);
      expect(FAKE_CALLBACK).toHaveBeenCalledTimes(2);
    });
  });

  describe("when items change to empty and they are again populated", () => {
    it("should dispatch action again once item is viewable", () => {
      // render hook result
      const { result, rerender } = setup({ fetchCardsCallback: FAKE_CALLBACK });
      act(() => {
        result.current(VISIBLE_ITEMS);
      });

      expect(FAKE_CALLBACK).toHaveBeenNthCalledWith(1, "urn1", ITEMS_URNS, 4);
      expect(FAKE_CALLBACK).toHaveBeenNthCalledWith(2, "urn3", ITEMS_URNS, 4);
      expect(FAKE_CALLBACK).not.toHaveBeenCalledWith("urn2", ITEMS_URNS, 4);
      expect(FAKE_CALLBACK).toHaveBeenCalledTimes(2);

      rerender({ dispatchFetchCards: FAKE_CALLBACK, items: [] });
      act(() => {
        result.current({ viewableItems: [], changed: [] });
      });

      rerender({ dispatchFetchCards: FAKE_CALLBACK, items: ITEMS_MOCK });
      act(() => {
        result.current(VISIBLE_ITEMS);
      });

      expect(FAKE_CALLBACK).toHaveBeenNthCalledWith(3, "urn1", ITEMS_URNS, 4);
      expect(FAKE_CALLBACK).toHaveBeenNthCalledWith(4, "urn3", ITEMS_URNS, 4);
      expect(FAKE_CALLBACK).not.toHaveBeenCalledWith("urn2", ITEMS_URNS, 4);
      expect(FAKE_CALLBACK).toHaveBeenCalledTimes(4);
    });
  });

  describe("some cards have already been requested", () => {
    const OTHER_ITEMS = {
      viewableItems: [
        {
          item: {
            urn: "urn10",
          },
          isViewable: true,
        },
        {
          item: {
            urn: "urn20",
          },
          isViewable: false,
        },
        {
          item: {
            urn: "urn3",
          },
          isViewable: true,
        },
      ],
      changed: [],
    };

    it("should NOT dispatch action again", () => {
      // render hook result
      const { result } = setup({ fetchCardsCallback: FAKE_CALLBACK });
      act(() => {
        result.current(VISIBLE_ITEMS);
      });
      act(() => {
        result.current(OTHER_ITEMS);
      });

      expect(FAKE_CALLBACK).toHaveBeenCalledWith("urn1", ITEMS_URNS, 4);
      expect(FAKE_CALLBACK).toHaveBeenCalledWith("urn3", ITEMS_URNS, 4);
      expect(FAKE_CALLBACK).toHaveBeenCalledWith("urn10", ITEMS_URNS, 4);
      expect(FAKE_CALLBACK).not.toHaveBeenCalledWith("urn2", ITEMS_URNS, 4);
      expect(FAKE_CALLBACK).toHaveBeenCalledTimes(3);
    });
  });
});
