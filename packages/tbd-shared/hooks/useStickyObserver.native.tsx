import { useRef, useEffect, useContext } from "react";
import { ViewToken } from "react-native";
import { StickyContext } from "../components/StickyContext";

type OnViewableItemsChanged = ({
  viewableItems,
  changed,
}: {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}) => void;

export type ViewableItemsChangedCallback = React.RefObject<OnViewableItemsChanged>;

const HEADERS_OFFSET = 1;

export const useStickyObserver = (stickyIndexes: number[] = []): ViewableItemsChangedCallback => {
  // Create refs for items
  const stickyIndexesRef = useRef(stickyIndexes);
  const { setCurrentSticky } = useContext(StickyContext);

  const state: { stickyKey: string | undefined } = {
    stickyKey: undefined,
  };

  useEffect(() => {
    stickyIndexesRef.current = stickyIndexes;
  }, [stickyIndexes]);

  const onViewableItemsChanged: OnViewableItemsChanged = (viewabilityChange) => {
    if (stickyIndexesRef.current.length === 0) {
      return;
    }

    const lastStickyIndex = stickyIndexesRef.current[stickyIndexesRef.current.length - 1];
    const { viewableItems } = viewabilityChange;
    const [firstViewableItem] = viewableItems;
    const firstViewableItemIndex =
      firstViewableItem && firstViewableItem.index !== null ? firstViewableItem.index + HEADERS_OFFSET : undefined;

    if (!firstViewableItemIndex) {
      return;
    }

    const stickyElement = viewableItems.find(({ index }) => index && index + HEADERS_OFFSET === lastStickyIndex);

    if (stickyElement && stickyElement.key !== state.stickyKey) {
      state.stickyKey = stickyElement.key;
    }

    const isBeforeSticky = firstViewableItemIndex && firstViewableItemIndex < lastStickyIndex;

    setCurrentSticky(isBeforeSticky ? undefined : state.stickyKey);
  };

  return useRef(onViewableItemsChanged);
};
