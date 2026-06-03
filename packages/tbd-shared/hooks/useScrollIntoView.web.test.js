import { renderHook } from "@testing-library/react";
import { useNodeScrollIntoView, useWindowScrollIntoView } from "./useScrollIntoView.web";

window.innerHeight = 416;
const scrollToSpy = jest.spyOn(window, "scrollTo");

describe("useWindowScrollIntoView", () => {
  beforeEach(jest.clearAllMocks);

  function setup(options = {}) {
    const { rerender, result } = renderHook(() => useWindowScrollIntoView(options), {
      initialProps: { options },
    });
    return { scrollWindowIntoView: result.current, rerender };
  }

  describe("when nothing changes", () => {
    it("should return the same callback", () => {
      const { scrollWindowIntoView, rerender } = setup();

      const original = scrollWindowIntoView;
      rerender();

      expect(original).toBe(scrollWindowIntoView);
    });
  });

  describe("when there's no node", () => {
    it("should not call window.scrollTo", () => {
      const { scrollWindowIntoView } = setup();
      scrollWindowIntoView();

      expect(scrollToSpy).not.toHaveBeenCalled();
    });
  });

  describe("when there's a node", () => {
    describe("and scrollTop is true", () => {
      it("should call window.scrollTo", () => {
        const getBoundingClientRect = jest.fn(() => ({ top: 500 }));
        const { scrollWindowIntoView } = setup();
        scrollWindowIntoView({ getBoundingClientRect }, true);

        expect(scrollToSpy).toHaveBeenCalledWith({ behavior: "smooth", top: 500 });
        expect(scrollToSpy).toHaveBeenCalledTimes(1);
      });

      describe("when offset is provided", () => {
        it("should call window.scrollTo with added offset value", () => {
          const getBoundingClientRect = jest.fn(() => ({ top: 500 }));
          const { scrollWindowIntoView } = setup({ offset: 16 });
          scrollWindowIntoView({ getBoundingClientRect }, true);

          expect(scrollToSpy).toHaveBeenCalledWith({ behavior: "smooth", top: 484 });
          expect(scrollToSpy).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe("and element is fully visible on viewport", () => {
      it("should not call window.scrollTo", () => {
        const getBoundingClientRect = jest.fn(() => ({ top: 0, bottom: 200 }));
        const { scrollWindowIntoView } = setup();
        scrollWindowIntoView({ getBoundingClientRect });

        expect(getBoundingClientRect).toHaveBeenCalledWith();
        expect(getBoundingClientRect).toHaveBeenCalledTimes(1);
        expect(scrollToSpy).not.toHaveBeenCalled();
      });
    });

    describe("and element is not fully visible on viewport", () => {
      it("should call window.scrollTo", () => {
        const getBoundingClientRect = jest.fn(() => ({ bottom: 500 }));
        const { scrollWindowIntoView } = setup();
        scrollWindowIntoView({ getBoundingClientRect });

        expect(scrollToSpy).toHaveBeenCalledWith({ behavior: "smooth", top: 84 });
        expect(scrollToSpy).toHaveBeenCalledTimes(1);
      });

      describe("when offset is provided", () => {
        it("should call window.scrollTo with added offset value", () => {
          const getBoundingClientRect = jest.fn(() => ({ bottom: 500 }));
          const { scrollWindowIntoView } = setup({ offset: 16 });
          scrollWindowIntoView({ getBoundingClientRect });

          expect(scrollToSpy).toHaveBeenCalledWith({ behavior: "smooth", top: 100 });
          expect(scrollToSpy).toHaveBeenCalledTimes(1);
        });
      });

      describe("when behavior is set to auto", () => {
        it("should call window.scrollTo with auto behavior", () => {
          const getBoundingClientRect = jest.fn(() => ({ bottom: 500 }));
          const { scrollWindowIntoView } = setup({ behavior: "auto" });
          scrollWindowIntoView({ getBoundingClientRect });

          expect(scrollToSpy).toHaveBeenCalledWith({ behavior: "auto", top: 84 });
          expect(scrollToSpy).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});

describe("useNodeScrollIntoView", () => {
  beforeEach(jest.clearAllMocks);

  const scrollToMock = jest.fn();

  const scrollableElement = {
    getBoundingClientRect: () => {},
    scrollTop: 0,
    scrollTo: scrollToMock,
  };

  function setup({ scrollable = scrollableElement, options = {} } = {}) {
    const { result, rerender } = renderHook(() => useNodeScrollIntoView(scrollable, options), {
      initialProps: { scrollable, options },
    });
    return { scrollNodeIntoView: result.current, rerender };
  }

  describe("when nothing changes", () => {
    it("should return the same callback", () => {
      const { scrollNodeIntoView, rerender } = setup();

      const original = scrollNodeIntoView;
      rerender();

      expect(original).toBe(scrollNodeIntoView);
    });
  });

  describe("when there's no scrollable element", () => {
    it("should not call scrollable.scrollTo", () => {
      const { scrollNodeIntoView } = setup({ scrollable: null });
      scrollNodeIntoView();

      expect(scrollToMock).not.toHaveBeenCalled();
    });
  });

  describe("when there's no node", () => {
    it("should not call scrollable.scrollTo", () => {
      const { scrollNodeIntoView } = setup();
      scrollNodeIntoView();

      expect(scrollToMock).not.toHaveBeenCalled();
    });
  });

  describe("when there's a scrollable element and a node", () => {
    const scrollableGetBoundingClientRect = jest.fn(() => ({ top: 0, bottom: 200, height: 400 }));

    describe("and element is fully visible on viewport", () => {
      it("should not call scrollable.scrollTo", () => {
        const { scrollNodeIntoView } = setup({
          scrollable: { ...scrollableElement, getBoundingClientRect: scrollableGetBoundingClientRect },
        });

        const nodeGetBoundingClientRect = jest.fn(() => ({ top: 0, bottom: 200 }));

        scrollNodeIntoView({ getBoundingClientRect: nodeGetBoundingClientRect });

        expect(nodeGetBoundingClientRect).toHaveBeenCalledWith();
        expect(nodeGetBoundingClientRect).toHaveBeenCalledTimes(1);
        expect(scrollToMock).not.toHaveBeenCalled();
      });
    });

    describe("and element is not fully visible on viewport", () => {
      const nodeGetBoundingClientRect = jest.fn(() => ({ top: 0, bottom: 500 }));

      it("should call scrollable.scrollTo", () => {
        const scrollableScrollTo = jest.fn();
        const { scrollNodeIntoView } = setup({
          scrollable: {
            getBoundingClientRect: scrollableGetBoundingClientRect,
            scrollTop: 100,
            scrollTo: scrollableScrollTo,
          },
        });

        scrollNodeIntoView({ getBoundingClientRect: nodeGetBoundingClientRect });

        expect(scrollableGetBoundingClientRect).toHaveBeenCalledWith();
        expect(scrollableGetBoundingClientRect).toHaveBeenCalledTimes(1);

        expect(scrollableScrollTo).toHaveBeenCalledWith({ behavior: "smooth", top: 400 });
        expect(scrollableScrollTo).toHaveBeenCalledTimes(1);
      });

      describe("when offset is provided", () => {
        it("should call scrollable.scrollTo with added offset value", () => {
          const scrollableScrollTo = jest.fn();
          const { scrollNodeIntoView } = setup({
            scrollable: {
              getBoundingClientRect: scrollableGetBoundingClientRect,
              scrollTop: 100,
              scrollTo: scrollableScrollTo,
            },
            options: { offset: 16 },
          });

          scrollNodeIntoView({ getBoundingClientRect: nodeGetBoundingClientRect });

          expect(scrollableScrollTo).toHaveBeenCalledWith({ behavior: "smooth", top: 416 });
          expect(scrollableScrollTo).toHaveBeenCalledTimes(1);
        });
      });

      describe("when behavior is set to auto", () => {
        it("should call scrollable.scrollTo with auto behavior", () => {
          const scrollableScrollTo = jest.fn();
          const { scrollNodeIntoView } = setup({
            scrollable: {
              getBoundingClientRect: scrollableGetBoundingClientRect,
              scrollTop: 100,
              scrollTo: scrollableScrollTo,
            },
            options: { behavior: "auto" },
          });
          scrollNodeIntoView({ getBoundingClientRect: nodeGetBoundingClientRect });

          expect(scrollableScrollTo).toHaveBeenCalledWith({ behavior: "auto", top: 400 });
          expect(scrollableScrollTo).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
