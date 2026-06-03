import { Text } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";
import { useUpdateScrollOffsetContext, useUpdateScrollIdleContext } from "@ppb/the-wall-native/helpers/ScrollContext";
import { useScrollToTop } from "@ppb/tbd-router/native";
import { FLATLIST_USE_SCROLLER_NATIVE_FLATLIST } from "./FlatListWithOffsetContext.native.selectors";
import { FlatListWithOffsetContext } from "./FlatListWithOffsetContext.native";
import { FlatList } from "../FlatList.native";

jest.mock("@ppb/tbd-router/native", () => ({
  useScrollToTop: jest.fn(),
}));

jest.mock("../FlatList.native", () => ({
  FlatList: jest.fn(() => (
    <flatlist-mock
      accessible={true}
      testID={"flatlist-use-scroller-native-flatlist"}
      accessibilityLabel={"flatlist-use-scroller-native-flatlist"}
    />
  )),
}));

jest.mock("@ppb/the-wall-native/helpers/ScrollContext", () => ({
  useScrollIdleContext: jest.fn(() => false),
  useUpdateScrollOffsetContext: jest.fn(() => jest.fn()),
  useUpdateScrollIdleContext: jest.fn(() => jest.fn()),
}));

function renderFlatListWithOffsetContext({ children, ...props }) {
  return render(<FlatListWithOffsetContext {...props}>{children}</FlatListWithOffsetContext>);
}

const MockText = ({ text }) => <Text>{text}</Text>;

const props = {
  renderItem: function renderItem({ index, item }) {
    return <MockText key={index} text={item} />;
  },
  data: ["item1", "item2", "item3", "item4", "item5", "item6"],
  stickyHeaderIndices: [0],
  keyExtractor: jest.fn((item, index) => `${item}${index}`),
};

describe("FlatListWithOffsetContext", () => {
  beforeEach(jest.clearAllMocks);

  describe("when rendering the FlatListWithOffsetContext component", () => {
    it("should call useScrollToTop", () => {
      renderFlatListWithOffsetContext(props);
      expect(useScrollToTop).toHaveBeenCalled();
    });

    it("should render the native FlatList", () => {
      const component = renderFlatListWithOffsetContext(props);
      const nativeFlatlist = component.getByTestId(FLATLIST_USE_SCROLLER_NATIVE_FLATLIST);

      expect(nativeFlatlist).toBeDefined();
    });

    describe("and on scroll", () => {
      const eventData = {
        nativeEvent: {
          contentOffset: {
            y: 400,
          },
          contentSize: {
            // Dimensions of the scrollable content
            height: 500,
            width: 100,
          },
          layoutMeasurement: {
            // Dimensions of the device
            height: 100,
            width: 100,
          },
        },
      };

      it("should call setOffsett", () => {
        const setOffset = jest.fn();
        useUpdateScrollOffsetContext.mockImplementationOnce(() => setOffset);
        const component = renderFlatListWithOffsetContext(props);

        const container = component.getByTestId(FLATLIST_USE_SCROLLER_NATIVE_FLATLIST);

        fireEvent.scroll(container, eventData);

        expect(setOffset).toHaveBeenCalled();
      });

      it("should call setIsScrollIdle with false", () => {
        const setIsScrollIdle = jest.fn();
        useUpdateScrollIdleContext.mockImplementationOnce(() => setIsScrollIdle);
        const { getByTestId } = renderFlatListWithOffsetContext(props);
        const container = getByTestId(FLATLIST_USE_SCROLLER_NATIVE_FLATLIST);

        fireEvent.scroll(container, eventData);

        expect(setIsScrollIdle).toHaveBeenCalledWith(false);
      });
    });

    describe("and on momentum scroll end", () => {
      it("should call setIsScrollIdle to true", () => {
        const setIsScrollIdle = jest.fn();

        useUpdateScrollIdleContext.mockImplementationOnce(() => setIsScrollIdle);

        renderFlatListWithOffsetContext(props);

        const { onMomentumScrollEnd } = FlatList.mock.calls[0][0];

        onMomentumScrollEnd();

        expect(setIsScrollIdle).toHaveBeenCalledWith(true);
      });

      describe("when there's onMomemtumScrollEnd prop", () => {
        it("should call onMomemtumScrollEnd", () => {
          const onMomentumScrollEndMock = jest.fn();

          renderFlatListWithOffsetContext({
            onMomentumScrollEnd: onMomentumScrollEndMock,
          });

          const { onMomentumScrollEnd } = FlatList.mock.calls[0][0];

          onMomentumScrollEnd();

          expect(onMomentumScrollEndMock).toHaveBeenCalled();
        });
      });
    });

    describe("and on scroll end drag", () => {
      it("should call setIsScrollIdle", () => {
        const setIsScrollIdle = jest.fn();
        useUpdateScrollIdleContext.mockImplementationOnce(() => setIsScrollIdle);

         
        const { UNSAFE_getByType } = renderFlatListWithOffsetContext(props);

        // https://callstack.github.io/react-native-testing-library/docs/api-queries#unsafe_bytype
        const flatList = UNSAFE_getByType(FlatList);
        flatList.props.onScrollEndDrag();

        expect(setIsScrollIdle).toHaveBeenCalled();
      });

      describe("when there's onScrollEndDrag prop", () => {
        it("should call onScrollEndDrag", () => {
          const onScrollEndDragMock = jest.fn();

          renderFlatListWithOffsetContext({
            onScrollEndDrag: onScrollEndDragMock,
          });

          const { onScrollEndDrag } = FlatList.mock.calls[0][0];

          onScrollEndDrag({ nativeEvent: { velocity: 1 } });

          expect(onScrollEndDragMock).toHaveBeenCalled();
        });
      });
    });
  });
});
