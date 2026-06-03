import { act, renderHook } from "@testing-library/react";
import useShowMore from "./useShowMore";

const itemsMock = ["foo", "bar", "baz"];

function setup(items, numberOfItemsToDisplay) {
  return renderHook(() => useShowMore({ items, numberOfItemsToDisplay }));
}

describe("useShowMore", () => {
  beforeEach(jest.clearAllMocks);

  describe("when the number of items is lower than the number of rows to display", () => {
    it("should return isShowMoreAvailable with the value of false", () => {
      const { result } = setup(itemsMock, 5);

      expect(result.current.isShowMoreAvailable).toEqual(false);
    });

    it("should return isItemsListCollapsed with the value of false", () => {
      const { result } = setup(itemsMock, 5);

      expect(result.current.isItemsListCollapsed).toEqual(false);
    });

    it("should return the itemsToDisplay with the same values as the items input", () => {
      const { result } = setup(itemsMock, 5);

      expect(result.current.itemsToDisplay.length).toEqual(3);
      expect(result.current.itemsToDisplay[0]).toEqual(itemsMock[0]);
      expect(result.current.itemsToDisplay[1]).toEqual(itemsMock[1]);
      expect(result.current.itemsToDisplay[2]).toEqual(itemsMock[2]);
    });

    it("should return the onShowMoreChange dispatch", () => {
      const { result } = setup(itemsMock, 5);

      expect(result.current.onShowMoreChange).toEqual(expect.any(Function));
    });

    describe("and when the onShowMoreChange is called", () => {
      it("should not change the isItemsListCollapsed value", () => {
        const { result } = setup(itemsMock, 5);

        expect(result.current.isItemsListCollapsed).toEqual(false);

        act(() => {
          result.current.onShowMoreChange(true);
        });

        expect(result.current.isItemsListCollapsed).toEqual(false);
      });
    });
  });

  describe("when the number of items is equal to the number of rows to display", () => {
    it("should return isShowMoreAvailable with the value of false", () => {
      const { result } = setup(itemsMock, 3);

      expect(result.current.isShowMoreAvailable).toEqual(false);
    });

    it("should return isItemsListCollapsed with the value of false", () => {
      const { result } = setup(itemsMock, 3);

      expect(result.current.isItemsListCollapsed).toEqual(false);
    });

    it("should return the itemsToDisplay with the same values as the items input", () => {
      const { result } = setup(itemsMock, 3);

      expect(result.current.itemsToDisplay.length).toEqual(3);
      expect(result.current.itemsToDisplay[0]).toEqual(itemsMock[0]);
      expect(result.current.itemsToDisplay[1]).toEqual(itemsMock[1]);
      expect(result.current.itemsToDisplay[2]).toEqual(itemsMock[2]);
    });

    it("should return the onShowMoreChange dispatch", () => {
      const { result } = setup(itemsMock, 3);

      expect(result.current.onShowMoreChange).toEqual(expect.any(Function));
    });

    describe("and when the onShowMoreChange is called", () => {
      it("should not change the isItemsListCollapsed value", () => {
        const { result } = setup(itemsMock, 3);

        expect(result.current.isItemsListCollapsed).toEqual(false);

        act(() => {
          result.current.onShowMoreChange(true);
        });

        expect(result.current.isItemsListCollapsed).toEqual(false);
      });
    });
  });

  describe("when the number of items is higher than the number of rows to display", () => {
    it("should return isShowMoreAvailable with the value of true", () => {
      const { result } = setup(itemsMock, 2);

      expect(result.current.isShowMoreAvailable).toEqual(true);
    });

    it("should return isItemsListCollapsed with the value of true", () => {
      const { result } = setup(itemsMock, 2);

      expect(result.current.isItemsListCollapsed).toEqual(true);
    });

    it("should return the itemsToDisplay in the same number as the numberOfItemsToDisplay", () => {
      const { result } = setup(itemsMock, 2);

      expect(result.current.itemsToDisplay.length).toEqual(2);
      expect(result.current.itemsToDisplay[0]).toEqual(itemsMock[0]);
      expect(result.current.itemsToDisplay[1]).toEqual(itemsMock[1]);
    });

    it("should return the onShowMoreChange dispatch", () => {
      const { result } = setup(itemsMock, 2);

      expect(result.current.onShowMoreChange).toEqual(expect.any(Function));
    });

    describe("and when the onShowMoreChange is called", () => {
      it("should change the isItemsListCollapsed value", () => {
        const { result } = setup(itemsMock, 2);

        expect(result.current.isItemsListCollapsed).toEqual(true);

        act(() => {
          result.current.onShowMoreChange(false);
        });

        expect(result.current.isItemsListCollapsed).toEqual(false);
      });

      it("should change the itemsToDisplay value", () => {
        const { result } = setup(itemsMock, 2);

        expect(result.current.itemsToDisplay.length).toEqual(2);
        expect(result.current.itemsToDisplay[0]).toEqual(itemsMock[0]);
        expect(result.current.itemsToDisplay[1]).toEqual(itemsMock[1]);

        act(() => {
          result.current.onShowMoreChange(false);
        });

        expect(result.current.itemsToDisplay.length).toEqual(3);
        expect(result.current.itemsToDisplay[0]).toEqual(itemsMock[0]);
        expect(result.current.itemsToDisplay[1]).toEqual(itemsMock[1]);
        expect(result.current.itemsToDisplay[2]).toEqual(itemsMock[2]);
      });
    });
  });
});
