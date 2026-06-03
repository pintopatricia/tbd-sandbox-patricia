import { useEffect, useMemo, useRef } from "react";
import { LayoutAnimation, type ViewabilityConfigCallbackPair } from "react-native";

export const CARD_VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 1, waitForInteraction: false };

export const useCardVisibility = (onCardHidden?: () => void): ViewabilityConfigCallbackPair => {
  // Changes on the fly of the viewability config, pairs or callback throw an error, hence the useRef
  const onCardHiddenRef = useRef(onCardHidden);

  useEffect(() => {
    // sync the ref with the latest onCardHidden callback
    onCardHiddenRef.current = onCardHidden;
  }, [onCardHidden]);

  const viewabilityConfigPair: ViewabilityConfigCallbackPair = useMemo(
    () => ({
      viewabilityConfig: CARD_VIEWABILITY_CONFIG,
      onViewableItemsChanged: (viewability) => {
        const anyHiddenItem = viewability.changed.find((itemChange) => itemChange.isViewable === false);

        if (anyHiddenItem && onCardHiddenRef.current) {
          LayoutAnimation.configureNext({ ...LayoutAnimation.Presets.easeInEaseOut, duration: 200 });
          onCardHiddenRef.current();
        }
      },
    }),
    [],
  );

  return viewabilityConfigPair;
};
