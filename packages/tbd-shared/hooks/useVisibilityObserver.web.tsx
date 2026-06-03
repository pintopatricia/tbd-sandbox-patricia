import { useState, useCallback, useRef, useEffect } from "react";
import { Nodes, VisibilityObserverOptions, Observe, ObservableElement } from "./useVisibilityObserver.types";

const THRESHOLD = 0.01;

/**
 * Creates a single IntersectionObserver and callback ref to determine when a particular card
 * is within viewport.
 *
 * @param options.onShow Callback to be executed everytime a node gets visible
 * @param options.onFirstShow Callback to be executed the first time a node gets visible
 * @param options.onHide Callback to be executed everytime the node disappears from viewport
 * @returns A callback reference to be used in the nodes to watch
 */
function useVisibilityObserver({ onShow, onFirstShow, onHide }: VisibilityObserverOptions): {
  observe: Observe;
  visibility: Nodes;
} {
  const [nodes, setNodes] = useState<Nodes>({});
  const global = useRef(nodes);
  const onShowRef = useRef(onShow);
  const onFirstShowRef = useRef(onFirstShow);
  const onHideRef = useRef(onHide);

  useEffect(() => {
    onShowRef.current = onShow;
    onFirstShowRef.current = onFirstShow;
    onHideRef.current = onHide;
  });

  // Sync global ref with nodes state
  useEffect(() => {
    global.current = nodes;
  }, [nodes]);

  const [observer] = useState<IntersectionObserver>(
    new IntersectionObserver(
      // eslint-disable-next-line react-hooks/refs -- using refs to always have the latest version of the callbacks without needing to re-create the observer
      (entries) => {
        const changes: Nodes = {};

        entries.forEach((entry) => {
          const target = entry.target as ObservableElement;
          const { urn } = target;

          if (!urn) {
            return;
          }

          const visibility = global.current[urn];

          // Node being visible for the first time
          if (entry.isIntersecting && visibility === undefined) {
            onFirstShowRef.current?.(urn);
          }

          // Node becoming visible
          if (entry.isIntersecting) {
            onShowRef.current?.(urn);
            changes[urn] = true;
          }

          // Node going out of the viewport
          if (!entry.isIntersecting && visibility) {
            onHideRef.current?.(urn);
            changes[urn] = false;
          }
        });

        // Update changes
        if (Object.keys(changes).length) {
          setNodes((map) => ({
            ...map,
            ...changes,
          }));
        }
      },
      {
        threshold: THRESHOLD,
      },
    ),
  );

  /**
   * Callback ref to be send to components. It should be called like this:
   *
   * <div ref={(node) => visibilityRef(node, urn)} />
   *
   * This callback will be called on mount and unmount: https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
   */
  const observe = useCallback<Observe>(
    (node, urn) => {
      const stored = global.current;

      // Component mounted
      if (node && !stored[urn]) {
        node.urn = urn;
        observer.observe(node);
      }
    },
    [observer],
  );

  return { observe, visibility: nodes };
}

export { useVisibilityObserver };
