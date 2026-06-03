import { useRef, useEffect } from "react";
import type { FlatListProps } from "react-native";
import type { BasicCard } from "@ppb/tbd-store/state/layout/cards/Card.types";
import type URN from "@ppb/tbd-store/state/layout/URN";

let listeners: (() => void)[] = [];

let visibilityState: Record<URN, boolean> = {};

// Emit changes to all listeners
function emitChange(): void {
  for (let i = 0; i < listeners.length; i += 1) {
    const listener = listeners[i];

    listener();
  }
}

// Create a pub/sub store to save the visibility status of all components
const store = {
  setVisibility(urn: URN, visibility: boolean) {
    visibilityState = {
      ...visibilityState,
      [urn]: visibility,
    };
    emitChange();
  },
  subscribe(listener: () => void) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  getSnapshot() {
    return visibilityState;
  },
};

/**
 * A custom hook to expose the setVisibility method
 *
 * @returns The setVisibility function that should be used to mark a component as visible
 */
function useVisibility(): (urn: URN, visible: boolean) => void {
  return store.setVisibility;
}

type DispatchFetchCards<T extends BasicCard = BasicCard> = (urn: string, partials: T[], numberOfCards?: number) => void;

type OnViewableItemsChanged<T extends BasicCard = BasicCard> = NonNullable<FlatListProps<T>["onViewableItemsChanged"]>;

const useNativeLazyLoading = <T extends BasicCard>(
  items: T[],
  dispatchFetchCards?: DispatchFetchCards<T>,
  batchSize?: number,
) => {
  const loadedCardsUrns = useRef<Map<URN, boolean>>(new Map());
  const partialItems = useRef(items);
  const setVisibility = useVisibility();

  useEffect(() => {
    // Reset loaded card urns when there's no items, which means we're loading from scratch
    if (!items.length) {
      loadedCardsUrns.current = new Map();
    }

    partialItems.current = items;
  }, [items]);

  const onViewableItemsChanged: OnViewableItemsChanged = ({ changed, viewableItems }) => {
    // Dispatch FETCH_CARDS on the first time a card changes to visible
    viewableItems.forEach((token) => {
      if (token.isViewable && loadedCardsUrns.current && !loadedCardsUrns.current.has(token.item.urn)) {
        loadedCardsUrns.current.set(token.item.urn, true);

        if (dispatchFetchCards) {
          dispatchFetchCards(token.item.urn, partialItems.current, batchSize);
        }
      }
    });

    // Everytime an item changes its visibility update the VisibilityContext
    changed.forEach(({ item, isViewable }) => setVisibility(item.urn, isViewable));
  };

  // eslint-disable-next-line react-hooks/refs -- return a stable reference to the onViewableItemsChanged callback to avoid unnecessary re-renders of FlatList
  return useRef(onViewableItemsChanged).current;
};

export { useNativeLazyLoading, useVisibility };
