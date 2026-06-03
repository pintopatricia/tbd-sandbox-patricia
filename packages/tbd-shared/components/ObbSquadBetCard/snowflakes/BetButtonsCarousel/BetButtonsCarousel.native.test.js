import { render, act, fireEvent } from "@testing-library/react-native";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { BetButtonsCarousel } from "./BetButtonsCarousel.native";
import {
  CAROUSEL_ARROW_LEFT,
  CAROUSEL_ARROW_RIGHT,
  CAROUSEL_CONTAINER,
  CAROUSEL_ITEM,
} from "./BetButtonsCarousel.native.selectors";

jest.mock(
  "react-native/Libraries/Components/Touchable/TouchableOpacity",
  () =>
    function MockTouchableOpacity(props) {
      return <view-mock {...props}>{props.children}</view-mock>;
    },
);

jest.mock("@ppb/the-wall-native", () => ({
  Placeholder: jest.fn(() => <placeholder-mock />),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => null),
}));

const createItems = (count) =>
  Array.from({ length: count }, (_, index) => <view-mock key={index} testID={`carousel-item-${index}`} />);

function renderBetButtonsCarousel({ pageSize, initialIndex, children }) {
  return render(
    <BetButtonsCarousel pageSize={pageSize} initialIndex={initialIndex}>
      {children}
    </BetButtonsCarousel>,
  );
}

describe("BetButtonsCarousel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.requestAnimationFrame = (cb) => cb();
  });

  it("should update containerWidth when layout changes", () => {
    const items = createItems(10);
    const { getByTestId, getAllByTestId } = renderBetButtonsCarousel({ pageSize: 4, children: items });

    const scrollView = getByTestId(CAROUSEL_CONTAINER);

    act(() => {
      fireEvent(scrollView, "layout", {
        nativeEvent: {
          layout: {
            width: 400,
          },
        },
      });
    });

    expect(getAllByTestId(CAROUSEL_ITEM).length).toBe(10);
  });

  describe("when on initial page and having a total of 3 pages", () => {
    it("should render two arrow buttons and only the first one should be disabled", async () => {
      const items = createItems(10);

      renderBetButtonsCarousel({ pageSize: 4, children: items });

      expect(GenericIcon).toHaveBeenCalledTimes(2);
      expect(GenericIcon).toHaveBeenNthCalledWith(
        1,
        {
          color: tokens.BetButtonCarouselIconDisableColour,
          name: "System--chevron-left",
        },
        undefined,
      );
      expect(GenericIcon).toHaveBeenNthCalledWith(
        2,
        {
          color: tokens.BetButtonCarouselIconDefaultColour,
          name: "System--chevron-right",
        },
        undefined,
      );
    });

    describe("when click on right arrow", () => {
      it("should scroll to next page and have both arrows enabled", async () => {
        const items = createItems(10);

        const { getByTestId } = renderBetButtonsCarousel({ pageSize: 4, children: items });

        const rightArrow = getByTestId(CAROUSEL_ARROW_RIGHT);

        await act(async () => {
          fireEvent.press(rightArrow);
        });

        expect(GenericIcon).toHaveBeenCalledTimes(4);
        expect(GenericIcon).toHaveBeenNthCalledWith(
          3,
          {
            color: tokens.BetButtonCarouselIconDefaultColour,
            name: "System--chevron-left",
          },
          undefined,
        );
        expect(GenericIcon).toHaveBeenNthCalledWith(
          4,
          {
            color: tokens.BetButtonCarouselIconDefaultColour,
            name: "System--chevron-right",
          },
          undefined,
        );
      });
    });
  });

  describe("when on last page and having a total of 3 pages", () => {
    it("should render two arrow buttons and only the last one should be disabled", async () => {
      const items = createItems(10);

      renderBetButtonsCarousel({ pageSize: 4, initialIndex: 8, children: items });

      expect(GenericIcon).toHaveBeenCalledTimes(2);
      expect(GenericIcon).toHaveBeenNthCalledWith(
        1,
        {
          color: tokens.BetButtonCarouselIconDefaultColour,
          name: "System--chevron-left",
        },
        undefined,
      );
      expect(GenericIcon).toHaveBeenNthCalledWith(
        2,
        {
          color: tokens.BetButtonCarouselIconDisableColour,
          name: "System--chevron-right",
        },
        undefined,
      );
    });

    describe("when click on left arrow", () => {
      it("should scroll to previous page and have both arrows enabled", async () => {
        const items = createItems(10);

        const { getByTestId } = renderBetButtonsCarousel({ pageSize: 4, initialIndex: 8, children: items });

        const leftArrow = getByTestId(CAROUSEL_ARROW_LEFT);

        await act(async () => {
          fireEvent.press(leftArrow);
        });

        expect(GenericIcon).toHaveBeenCalledTimes(4);
        expect(GenericIcon).toHaveBeenNthCalledWith(
          3,
          {
            color: tokens.BetButtonCarouselIconDefaultColour,
            name: "System--chevron-left",
          },
          undefined,
        );
        expect(GenericIcon).toHaveBeenNthCalledWith(
          4,
          {
            color: tokens.BetButtonCarouselIconDefaultColour,
            name: "System--chevron-right",
          },
          undefined,
        );
      });
    });
  });
});
