import { render, act } from "@testing-library/react-native";
import { FlatList as ReactNativeFlatList } from "react-native";
import { FlatList } from "./FlatList.native";

jest.mock("@ppb/the-wall-native/helpers/flatlist-props", () => ({
  INITIAL_NUM_TO_RENDER: "INITIAL_NUM_TO_RENDER",
  MAX_TO_RENDER_PER_BATCH: "MAX_TO_RENDER_PER_BATCH",
  REMOVE_CLIPPED_SUBVIEWS: "REMOVE_CLIPPED_SUBVIEWS",
  UPDATE_CELLS_BATCHING_PERIOD: "UPDATE_CELLS_BATCHING_PERIOD",
  WINDOW_SIZE: "WINDOW_SIZE",
}));

jest.mock("react-native", () => {
  const { Platform } = jest.requireActual("react-native");
  return {
    Platform,
    FlatList: jest.fn(),
  };
});

function setup(props) {
  return render(<FlatList {...props} />);
}

describe("FlatList", () => {
  beforeEach(jest.clearAllMocks);

  it("should be called with all default values", () => {
    setup({ data: [] });

    expect(ReactNativeFlatList).toHaveBeenCalledWith(
      {
        data: [],
        viewabilityConfigCallbackPairs: expect.any(Array),
        keyExtractor: expect.any(Function),
        initialNumToRender: "INITIAL_NUM_TO_RENDER",
        keyboardShouldPersistTaps: "handled",
        maxToRenderPerBatch: "MAX_TO_RENDER_PER_BATCH",
        removeClippedSubviews: "REMOVE_CLIPPED_SUBVIEWS",
        showsHorizontalScrollIndicator: false,
        showsVerticalScrollIndicator: false,
        updateCellsBatchingPeriod: "UPDATE_CELLS_BATCHING_PERIOD",
        windowSize: "WINDOW_SIZE",
      },
      undefined,
    );
  });

  it("should populate the original partial items with a visibility prop", () => {
    setup({ data: [{ urn: "urn", typename: "typename" }] });

    expect(ReactNativeFlatList).toHaveBeenCalledWith(
      expect.objectContaining({
        data: [{ urn: "urn", typename: "typename", visible: false }],
      }),
      undefined,
    );
  });

  it("should populate items synchronously on the initial render", () => {
    setup({ data: [{ urn: "urn", typename: "typename" }] });

    expect(ReactNativeFlatList.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        data: [{ urn: "urn", typename: "typename", visible: false }],
      }),
    );
  });

  it("should preserve the original visible prop on the initial render", () => {
    setup({ data: [{ urn: "urn", typename: "typename", visible: true }] });

    expect(ReactNativeFlatList.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        data: [{ urn: "urn", typename: "typename", visible: true }],
      }),
    );
  });

  it("should not trigger a redundant render after mount when data is unchanged", () => {
    setup({ data: [{ urn: "urn", typename: "typename" }] });

    expect(ReactNativeFlatList).toHaveBeenCalledTimes(1);
  });

  describe("when data prop changes after mount", () => {
    it("should reflect the new data on re-render", () => {
      const { rerender } = setup({ data: [{ urn: "urn:1", typename: "typename:1" }] });

      rerender(
        <FlatList
          data={[
            { urn: "urn:1", typename: "typename:1" },
            { urn: "urn:2", typename: "typename:2" },
          ]}
        />,
      );

      expect(ReactNativeFlatList).toHaveBeenLastCalledWith(
        expect.objectContaining({
          data: [
            { urn: "urn:1", typename: "typename:1", visible: false },
            { urn: "urn:2", typename: "typename:2", visible: false },
          ],
        }),
        undefined,
      );
    });

    it("should preserve visibility from the previous list across data updates", () => {
      const { rerender } = setup({
        data: [
          { urn: "urn:1", typename: "typename:1" },
          { urn: "urn:2", typename: "typename:2" },
        ],
      });

      const { onViewableItemsChanged } = ReactNativeFlatList.mock.calls[0][0].viewabilityConfigCallbackPairs[0];

      act(() => {
        onViewableItemsChanged({
          viewableItems: [{ item: { urn: "urn:1" }, isViewable: true }],
        });
      });

      rerender(
        <FlatList
          data={[
            { urn: "urn:1", typename: "typename:1" },
            { urn: "urn:2", typename: "typename:2" },
            { urn: "urn:3", typename: "typename:3" },
          ]}
        />,
      );

      expect(ReactNativeFlatList).toHaveBeenLastCalledWith(
        expect.objectContaining({
          data: [
            { urn: "urn:1", typename: "typename:1", visible: true },
            { urn: "urn:2", typename: "typename:2", visible: false },
            { urn: "urn:3", typename: "typename:3", visible: false },
          ],
        }),
        undefined,
      );
    });
  });

  describe("with onViewableItemsChanged", () => {
    it("should change visibility on the data prop", () => {
      setup({
        data: [
          { urn: "urn:1", typename: "typename:1" },
          { urn: "urn:2", typename: "typename:2" },
        ],
      });

      const { onViewableItemsChanged } = ReactNativeFlatList.mock.calls[0][0].viewabilityConfigCallbackPairs[0];

      act(() => {
        onViewableItemsChanged({
          viewableItems: [{ item: { urn: "urn:1" }, isViewable: true }],
        });
      });

      expect(ReactNativeFlatList).toHaveBeenCalledWith(
        expect.objectContaining({
          data: [
            { urn: "urn:1", typename: "typename:1", visible: true },
            { urn: "urn:2", typename: "typename:2", visible: false },
          ],
        }),
        undefined,
      );
    });

    it("should call original callback if provided", () => {
      const onViewableItemsChangedMock = jest.fn();

      setup({
        data: [
          { urn: "urn:1", typename: "typename:1" },
          { urn: "urn:2", typename: "typename:2" },
        ],
        onViewableItemsChanged: onViewableItemsChangedMock,
      });

      const { onViewableItemsChanged } = ReactNativeFlatList.mock.calls[0][0].viewabilityConfigCallbackPairs[0];

      act(() => {
        onViewableItemsChanged({
          viewableItems: [{ item: { urn: "urn:1" }, isViewable: true }],
        });
      });

      expect(onViewableItemsChangedMock).toHaveBeenCalledWith({
        viewableItems: [{ isViewable: true, item: { urn: "urn:1" } }],
      });
    });
  });

  describe("with keyExtractor", () => {
    it("should use URN and index as the default key", () => {
      setup();

      const { keyExtractor } = ReactNativeFlatList.mock.calls[0][0];

      expect(keyExtractor({ urn: "urn" }, 1)).toBe("urn");
    });

    it("should call original callback if provided", () => {
      const keyExtractorMock = jest.fn();

      setup({
        keyExtractor: keyExtractorMock,
      });

      const { keyExtractor } = ReactNativeFlatList.mock.calls[0][0];

      act(() => {
        keyExtractor({ urn: "urn" }, 0);
      });

      expect(keyExtractorMock).toHaveBeenCalledWith({ urn: "urn" }, 0);
    });
  });
});
