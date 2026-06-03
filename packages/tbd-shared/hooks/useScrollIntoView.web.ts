import { useCallback, useMemo } from "react";

/**
 * The area that marks visibility limits
 * */
type VisibleArea = {
  getRect: () => Pick<DOMRect, "top" | "bottom">;
  getScrollPosition: () => number;
  scrollTo: (options: ScrollToOptions) => void;
};

type Options = {
  offset?: ScrollToOptions["top"];
  behavior?: ScrollToOptions["behavior"];
};

type ScrollCallback<T extends HTMLElement | null> = (nodeToDisplay: T, scrollTop?: boolean) => void;

type ScrollIntoViewHook = <T extends HTMLElement | null>(
  visibleArea: VisibleArea | null,
  options?: Options,
) => ScrollCallback<T>;

const useScrollIntoView: ScrollIntoViewHook = (visibleArea, { offset = 0, behavior = "smooth" } = {}) =>
  useCallback(
    (nodeToDisplay, scrollTop = false) => {
      if (!nodeToDisplay || !visibleArea) {
        return;
      }

      const { top: visibleAreaTop, bottom: visibleAreaBottom } = visibleArea.getRect();
      const { top, bottom } = nodeToDisplay.getBoundingClientRect();
      const nodeBottom = bottom + offset;
      const nodeTop = top - offset;

      const isNodeFullyVisible = nodeTop >= visibleAreaTop && nodeBottom <= visibleAreaBottom;
      if (!scrollTop && isNodeFullyVisible) {
        return;
      }

      const currentScrollPosition = visibleArea.getScrollPosition();

      /**
       * Amount of pixels to scroll.
       *
       * It's not equal to the height of node, because the node might be
       * only partially hidden.
       *
       * Example: when a node with height of 200px is only half visible,
       * the movement required is only 100px.
       */
      const movementRequired = scrollTop ? nodeTop - visibleAreaTop : nodeBottom - visibleAreaBottom;

      visibleArea.scrollTo({
        top: currentScrollPosition + movementRequired,
        behavior,
      });
    },
    [visibleArea, offset, behavior],
  );

type WindowScrollIntoViewHook = <T extends HTMLElement | null>(options?: Options) => ScrollCallback<T>;

const visibleAreaWindow: VisibleArea = {
  getRect: () => ({ top: 0, bottom: window.innerHeight }),
  getScrollPosition: () => window.scrollY,
  scrollTo: (options) => window.scrollTo(options),
};

/**
 * Uses window for checking visibility limits and scrolling
 * */
export const useWindowScrollIntoView: WindowScrollIntoViewHook = ({ offset = 0, behavior = "smooth" } = {}) =>
  useScrollIntoView(visibleAreaWindow, { offset, behavior });

type NodeScrollIntoViewHook = <T extends HTMLElement | null>(
  scrollableElement: HTMLElement | null,
  options?: Options,
) => ScrollCallback<T>;

/**
 * Uses provided DOM node for checking visibility limits and scrolling
 * */
export const useNodeScrollIntoView: NodeScrollIntoViewHook = (node, { offset = 0, behavior = "smooth" } = {}) => {
  const visibleAreaNode = useMemo(() => {
    if (!node) {
      return null;
    }

    return {
      getRect: () => node.getBoundingClientRect(),
      getScrollPosition: () => node.scrollTop,
      scrollTo: (options) => node.scrollTo(options),
    } as VisibleArea;
  }, [node]);

  return useScrollIntoView(visibleAreaNode, { offset, behavior });
};
