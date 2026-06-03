import { useEffect } from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "jest-dom/extend-expect";
import { TooltipProvider, useTooltip } from "./TooltipContext";
import { PlayersTooltip } from "./PlayersTooltip.web";
import { TooltipPosition } from "./props";

jest.mock("@ppb/the-wall-web", () => ({
  Tooltip: ({ onCloseClick, title }) => (
    <tooltip-mock data-testid="tooltip-mock" onClick={onCloseClick}>
      {title}
    </tooltip-mock>
  ),
}));

const TooltipOpener = ({ targetRef, position = TooltipPosition.LEFT }) => {
  const { openTooltip } = useTooltip();

  useEffect(() => {
    openTooltip("tooltip-id", "Pedro Porro, Brennan Johnson, Xavi Simons, João Palhinha", jest.fn());
  }, [openTooltip]);

  return <PlayersTooltip targetRef={targetRef} position={position} />;
};

const renderWithContext = (children) => render(<TooltipProvider>{children}</TooltipProvider>);

const createContainerAndTarget = () => {
  const container = document.createElement("div");
  container.id = "obb-card-group-container-id";
  document.body.appendChild(container);

  const targetElement = document.createElement("div");
  document.body.appendChild(targetElement);

  return { container, targetElement, targetRef: { current: targetElement } };
};

describe("PlayersTooltip", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = "";
  });

  describe("rendering", () => {
    it("renders nothing if container is not found", () => {
      const { container } = renderWithContext(<PlayersTooltip targetRef={{ current: null }} />);
      expect(container.firstChild).toBeNull();
    });

    it("renders nothing if visibleTooltipId is undefined", () => {
      const { targetRef } = createContainerAndTarget();
      const { container: rendered } = renderWithContext(<PlayersTooltip targetRef={targetRef} />);
      expect(rendered.firstChild).toBeNull();
    });

    it("renders tooltip if visibleTooltipId is set and container exists", () => {
      const { container, targetRef } = createContainerAndTarget();
      renderWithContext(<TooltipOpener targetRef={targetRef} />);
      expect(screen.getByTestId("tooltip-mock")).toBeInTheDocument();
      expect(container.querySelector("[data-testid='tooltip-mock']")).not.toBeNull();
    });
  });

  describe("positioning", () => {
    let container;
    let targetRef;

    beforeEach(() => {
      const setup = createContainerAndTarget();
      container = setup.container;
      targetRef = setup.targetRef;

      setup.targetElement.getBoundingClientRect = jest.fn(() => ({
        top: 100,
        left: 50,
        bottom: 150,
        right: 150,
        width: 100,
        height: 50,
        x: 50,
        y: 100,
      }));
      container.getBoundingClientRect = jest.fn(() => ({
        top: 0,
        left: 0,
        bottom: 500,
        right: 500,
        width: 500,
        height: 500,
        x: 0,
        y: 0,
      }));
    });

    it("applies LEFT positioning correctly", async () => {
      await act(async () => {
        renderWithContext(<TooltipOpener targetRef={targetRef} position={TooltipPosition.LEFT} />);
      });

      const tooltip = await screen.findByTestId("tooltip-mock");
      const wrapper = tooltip.parentElement;

      await act(async () => window.dispatchEvent(new Event("resize")));

      await waitFor(() => {
        expect(wrapper.style.top).toBe("150px");
        expect(wrapper.style.right).toBe("");
      });
    });

    it("applies RIGHT positioning correctly", async () => {
      await act(async () => {
        renderWithContext(<TooltipOpener targetRef={targetRef} position={TooltipPosition.RIGHT} />);
      });

      const tooltip = await screen.findByTestId("tooltip-mock");
      const wrapper = tooltip.parentElement;

      await act(async () => window.dispatchEvent(new Event("resize")));

      await waitFor(() => {
        expect(wrapper.style.top).toBe("150px");
        expect(wrapper.style.left).toBe("");
      });
    });
  });

  describe("interactions", () => {
    it("removes tooltip from DOM when user clicks close button", async () => {
      const { targetRef } = createContainerAndTarget();

      await act(async () => {
        renderWithContext(<TooltipOpener targetRef={targetRef} />);
      });

      const tooltip = await screen.findByTestId("tooltip-mock");
      expect(tooltip).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(tooltip);
      });

      await waitFor(() => {
        expect(screen.queryByTestId("tooltip-mock")).toBeNull();
      });
    });
  });
});
