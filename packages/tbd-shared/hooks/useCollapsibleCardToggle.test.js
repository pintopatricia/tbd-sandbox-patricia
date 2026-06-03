import { renderHook, act } from "@testing-library/react";
import useCollapsibleCardToggle from "./useCollapsibleCardToggle";

describe("useCollapsibleCardToggle", () => {
  function render({ isBetPanelOpen = false, dispatchToggleAccordionAction = jest.fn() } = {}) {
    return renderHook(() => useCollapsibleCardToggle({ isBetPanelOpen, dispatchToggleAccordionAction }));
  }

  describe("when isBetPanelOpen is false", () => {
    it("should isExpanded to be false", () => {
      const { result } = render({ isBetPanelOpen: false });

      expect(result.current.isExpanded).toBe(false);
    });

    it("should onCollapseToggle to call dispatchToggleAccordionAction", () => {
      const dispatchToggleAccordionAction = jest.fn();
      const { result } = render({ isBetPanelOpen: false, dispatchToggleAccordionAction });

      act(() => {
        result.current.onCollapseToggle();
      });

      expect(dispatchToggleAccordionAction).toHaveBeenCalled();
      expect(result.current.isExpanded).toBe(true);
    });
  });

  describe("when isBetPanelOpen is true", () => {
    it("should isExpanded to be true", () => {
      const { result } = renderHook(() => useCollapsibleCardToggle({ isBetPanelOpen: true }));

      expect(result.current.isExpanded).toBe(true);
    });

    it("should onCollapseToggle to call dispatchToggleAccordionAction", () => {
      const dispatchToggleAccordionAction = jest.fn();
      const { result } = render({ isBetPanelOpen: true, dispatchToggleAccordionAction });

      act(() => {
        result.current.onCollapseToggle();
      });

      expect(dispatchToggleAccordionAction).toHaveBeenCalled();
      expect(result.current.isExpanded).toBe(false);
    });
  });
});
