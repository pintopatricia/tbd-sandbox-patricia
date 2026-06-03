import { renderHook } from "@testing-library/react-native";
import { StickyContext } from "../components/StickyContext";
import { useStickyObserver } from "./useStickyObserver.native";

const setCurrentSticky = jest.fn();

const MockProvider = ({ children }) => (
  <StickyContext.Provider value={{ setCurrentSticky }}>{children}</StickyContext.Provider>
);

const victim = ({ stickyIndexes }) => {
  const {
    rerender,
    result: { current: onViewableItemsChange },
  } = renderHook((props) => useStickyObserver(props.stickyIndexes), {
    initialProps: { stickyIndexes },
    wrapper: MockProvider,
  });

  return {
    onViewableItemsChange: onViewableItemsChange.current,
    rerender,
  };
};

describe("useStickyObserver", () => {
  afterEach(jest.clearAllMocks);

  describe("when the sticky indexes contains no elements", () => {
    it("should not call setCurrentSticky", () => {
      const { onViewableItemsChange } = victim({ setCurrentSticky });

      onViewableItemsChange({ viewableItems: [{ index: 1, key: "test:urn" }] });

      expect(setCurrentSticky).not.toHaveBeenCalled();
    });
  });

  describe("when the sticky indexes contains elements", () => {
    describe("and a viweableItem corresponds to a sticky header index", () => {
      const VIWEABLE_ITEMS = [
        { index: 0, key: "item:0:urn" },
        { index: 1, key: "item:1:urn" },
        { index: 2, key: "item:2:sticky:urn" },
      ];
      let onViewableItemsChangeFn;

      beforeEach(() => {
        const { onViewableItemsChange } = victim({ stickyIndexes: [2, 3] });

        onViewableItemsChangeFn = onViewableItemsChange;

        onViewableItemsChangeFn({ viewableItems: VIWEABLE_ITEMS });

        // clear setCurrentSticky calls made during the initial act
        setCurrentSticky.mockClear();
      });

      describe("and the first viweableItem is undefined", () => {
        it("should not call setCurrentSticky", () => {
          onViewableItemsChangeFn({ viewableItems: [] });

          expect(setCurrentSticky).not.toHaveBeenCalled();
        });
      });

      describe("and the first viweableItem has a null index", () => {
        it("should not call setCurrentSticky", () => {
          onViewableItemsChangeFn({ viewableItems: [{ index: null }] });

          expect(setCurrentSticky).not.toHaveBeenCalled();
        });
      });

      describe("and the last stickyIndex (3) is equal to the first viweableItemIndex + HEADER_OFFSET (1)", () => {
        it("should call setCurrentSticky with the first viweableItem key", () => {
          onViewableItemsChangeFn({ viewableItems: [{ index: 2, key: "item:2:new:sticky:urn" }] });

          expect(setCurrentSticky).toHaveBeenCalledWith("item:2:new:sticky:urn");
        });
      });

      describe("and the last stickyIndex (3) is lower to the first viweableItemIndex + HEADER_OFFSET (1)", () => {
        it("should call setCurrentSticky with the sticky key", () => {
          onViewableItemsChangeFn({ viewableItems: [{ index: 4, key: "item:4:urn" }] });

          expect(setCurrentSticky).toHaveBeenCalledWith("item:2:sticky:urn");
        });
      });

      describe("and the last stickyIndex (3) is higher to the first viweableItemIndex + HEADER_OFFSET (1)", () => {
        it("should call setCurrentSticky with undefined (remove sticky)", () => {
          onViewableItemsChangeFn({ viewableItems: [{ index: 1, key: "item:4:urn" }] });

          expect(setCurrentSticky).toHaveBeenCalledWith(undefined);
        });
      });
    });

    describe("and no viweableItem corresponds to a sticky header index", () => {
      it("should call setCurrentSticky with undefined", () => {
        const VIWEABLE_ITEMS = [
          { index: 0, key: "item:0:urn" },
          { index: 1, key: "item:1:urn" },
        ];
        const { onViewableItemsChange } = victim({ stickyIndexes: [2, 3] });

        onViewableItemsChange({ viewableItems: VIWEABLE_ITEMS });

        expect(setCurrentSticky).toHaveBeenCalledWith(undefined);
      });
    });
  });
});
