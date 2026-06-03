import { useEffect } from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { TooltipProvider, useTooltip } from "./TooltipContext";
import { PlayersTooltip } from "./PlayersTooltip.native";
import { TOOLTIP_CONTAINER } from "./PlayersTooltip.native.selectors";

jest.mock("@ppb/the-wall-native", () => ({
  Tooltip: jest.fn(({ title, onClosePress }) => (
    <tooltip-mock testID="tooltip-mock" onPress={onClosePress}>
      {title}
    </tooltip-mock>
  )),
  getTestProps: jest.fn(() => ({})),
}));

const renderWithContext = (children) => render(<TooltipProvider>{children}</TooltipProvider>);

const TooltipOpener = () => {
  const { openTooltip, containerRef } = useTooltip();
  useEffect(() => {
    containerRef.current = {
      measure: jest.fn((callback) => callback(0, 0, 0, 500)),
    };
    openTooltip("tooltip-id", "Pedro Porro, Brennan Johnson", jest.fn(), "cardUrn", { pageY: 120 });
  }, [openTooltip, containerRef]);
  return <PlayersTooltip />;
};

describe("PlayersTooltip (Native)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders nothing if visibleTooltipId is undefined", () => {
      const { queryByTestId } = renderWithContext(<PlayersTooltip />);
      expect(queryByTestId("tooltip-mock")).toBeNull();
    });

    it("renders tooltip if visibleTooltipId is set", async () => {
      const { getByTestId } = renderWithContext(<TooltipOpener />);

      await waitFor(() => {
        expect(getByTestId("tooltip-mock")).toBeTruthy();
      });
    });
  });

  describe("interactions", () => {
    it("calls closeTooltip when tooltip close button is pressed", async () => {
      const { getByTestId, queryByTestId } = renderWithContext(<TooltipOpener />);

      const tooltip = await waitFor(() => getByTestId("tooltip-mock"));
      fireEvent.press(tooltip);

      await waitFor(() => {
        expect(queryByTestId("tooltip-mock")).toBeNull();
      });
    });
  });

  describe("positioning", () => {
    it("sets top style when tooltip fits inside container", async () => {
      const { queryByTestId } = renderWithContext(<TooltipOpener />);

      const wrapper = await waitFor(() => queryByTestId(TOOLTIP_CONTAINER));

      fireEvent(wrapper, "layout", { nativeEvent: { layout: { height: 20 } } });

      await waitFor(() => {
        expect(wrapper.props.style).toEqual(
          expect.objectContaining({
            top: 120,
            position: "absolute",
            width: "100%",
          }),
        );
      });
    });

    it("sets bottom style when tooltip overflows container", async () => {
      const { queryByTestId } = renderWithContext(<TooltipOpener />);

      const wrapper = await waitFor(() => queryByTestId(TOOLTIP_CONTAINER));

      fireEvent(wrapper, "layout", { nativeEvent: { layout: { height: 400 } } });

      await waitFor(() => {
        expect(wrapper.props.style).toEqual(
          expect.objectContaining({
            bottom: 0,
            position: "absolute",
            width: "100%",
          }),
        );
      });
    });
  });
});
