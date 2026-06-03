import * as React from "react";

type UseInfiniteScrollReturnType<T> = {
  scrollViewRef: React.RefObject<T | null>;
  resetScroll: () => void;
};

function useInfiniteScroll<T extends HTMLElement>(
  loadMoreCallback: () => void,
  threshold = 150,
  executeOnLoad = false,
): UseInfiniteScrollReturnType<T> {
  const ref = React.useRef<T>(null);
  const [listHeight, setListHeight] = React.useState<number | null>(null);

  const resetScroll = React.useCallback(() => {
    setListHeight(null);
  }, [setListHeight]);

  const handleScroll = React.useCallback((): void => {
    if (ref.current) {
      const { bottom } = ref.current.getBoundingClientRect();
      const bottomOffset = bottom - window.innerHeight;
      const currentListHeight = ref.current.clientHeight;
      // it only calls the callback if the current list height isn't the same
      // as in the last call
      if (bottomOffset <= threshold && listHeight !== currentListHeight) {
        setListHeight(currentListHeight);
        loadMoreCallback();
      }
    }
  }, [loadMoreCallback, threshold, listHeight]);

  const eventsToListen = ["scroll"];
  if (executeOnLoad) {
    eventsToListen.push("load");
  }

  React.useEffect(() => {
    eventsToListen.forEach((eventToListen) => window.addEventListener(eventToListen, handleScroll, true));
    if (executeOnLoad) {
      handleScroll();
    }

    return () =>
      eventsToListen.forEach((eventToListen) => window.removeEventListener(eventToListen, handleScroll, true));
  }, [handleScroll]);

  return { scrollViewRef: ref, resetScroll };
}

export default useInfiniteScroll;
