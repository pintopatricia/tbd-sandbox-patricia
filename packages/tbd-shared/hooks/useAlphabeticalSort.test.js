import { act, renderHook } from "@testing-library/react";
import useAlphabeticalSort from "./useAlphabeticalSort";

const itemMock0 = { name: "foo" };
const itemMock1 = { name: "bar" };
const itemMock2 = { name: "baz" };

const itemsMock = [itemMock0, itemMock1, itemMock2];
const translationMock = "sometranslation";

const dispatchAzSwitchClickMock = jest.fn();

jest.mock("@ppb/tbd-shared/helpers/i18n", () => ({
  i18n: jest.fn(() => translationMock),
}));

function setup(
  isItemsListCollapsed,
  items,
  numberOfItemsToDisplay,
  sortKey = "name",
  dispatchAzSwitchClick = dispatchAzSwitchClickMock,
) {
  return renderHook(() =>
    useAlphabeticalSort({
      isItemsListCollapsed,
      items,
      numberOfItemsToDisplay,
      sortKey,
      dispatchAzSwitchClick,
    }),
  );
}

describe("useAlphabeticalSort", () => {
  beforeEach(jest.clearAllMocks);

  describe("when initialized", () => {
    describe("and isItemsListCollapsed is false", () => {
      it("should return azSwitcherLabel with the expected value", () => {
        const { result } = setup(false, itemsMock, 3);

        expect(result.current.azSwitcherLabel).toEqual(translationMock);
      });

      it("should return isSorted with the value of false", () => {
        const { result } = setup(false, itemsMock, 3);

        expect(result.current.isSorted).toEqual(false);
      });

      it("should return the items to display in the same order", () => {
        const { result } = setup(false, itemsMock, 3);

        expect(result.current.itemsToDisplay.length).toEqual(3);
        expect(result.current.itemsToDisplay[0]).toEqual(itemMock0);
        expect(result.current.itemsToDisplay[1]).toEqual(itemMock1);
        expect(result.current.itemsToDisplay[2]).toEqual(itemMock2);
      });

      it("should return the onSwitch callback", () => {
        const { result } = setup(false, itemsMock, 3);

        expect(result.current.onSwitch).toEqual(expect.any(Function));
      });

      describe("and when the onSwitch is called with the value of true", () => {
        it("should return isSorted with the value of true", () => {
          const { result } = setup(false, itemsMock, 3);

          expect(result.current.isSorted).toEqual(false);

          act(() => {
            result.current.onSwitch(true);
          });

          expect(result.current.isSorted).toEqual(true);
        });

        it("should return the items to display in alphabetical order", () => {
          const { result } = setup(false, itemsMock, 3);

          expect(result.current.isSorted).toEqual(false);

          act(() => {
            result.current.onSwitch(true);
          });

          expect(result.current.itemsToDisplay.length).toEqual(3);
          expect(result.current.itemsToDisplay[0]).toEqual(itemMock1);
          expect(result.current.itemsToDisplay[1]).toEqual(itemMock2);
          expect(result.current.itemsToDisplay[2]).toEqual(itemMock0);
        });
      });
    });

    describe("and when isItemsListCollapsed set to true", () => {
      it("should return azSwitcherLabel with the expected value", () => {
        const { result } = setup(true, itemsMock, 2);

        expect(result.current.azSwitcherLabel).toEqual(translationMock);
      });

      it("should return isSorted with the value of false", () => {
        const { result } = setup(true, itemsMock, 2);

        expect(result.current.isSorted).toEqual(false);
      });

      it("should return the items to display until the maximum defined by isItemsListCollapsed", () => {
        const { result } = setup(true, itemsMock, 2);

        expect(result.current.itemsToDisplay.length).toEqual(2);
        expect(result.current.itemsToDisplay[0]).toEqual(itemMock0);
        expect(result.current.itemsToDisplay[1]).toEqual(itemMock1);
      });

      it("should return the onSwitch callback", () => {
        const { result } = setup(true, itemsMock, 2);

        expect(result.current.onSwitch).toEqual(expect.any(Function));
      });

      describe("and when the onSwitch is called with the value of true", () => {
        it("should return isSorted with the value of true", () => {
          const { result } = setup(true, itemsMock, 2);

          expect(result.current.isSorted).toEqual(false);

          act(() => {
            result.current.onSwitch(true);
          });

          expect(result.current.isSorted).toEqual(true);
        });

        it("should return the items to display in alphabetical order until the maximum defined by isItemsListCollapsed", () => {
          const { result } = setup(true, itemsMock, 2);

          expect(result.current.isSorted).toEqual(false);

          act(() => {
            result.current.onSwitch(true);
          });

          expect(result.current.itemsToDisplay.length).toEqual(2);
          expect(result.current.itemsToDisplay[0]).toEqual(itemMock1);
          expect(result.current.itemsToDisplay[1]).toEqual(itemMock2);
        });
      });
    });
  });
});
