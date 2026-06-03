import { useCallback } from "react";
import * as React from "react";
import { ShowMore as ShowMoreComponent } from "@ppb/the-wall-native";
import { LayoutChangeEvent } from "react-native";
import { ComponentPropsNative, i18nLabels } from "./props";
import { useScrollIntoView } from "../../hooks/useScrollIntoView.native";

const ShowMore: React.FC<ComponentPropsNative> = ({
  cardRef,
  numberOfItemsToDisplay,
  numberOfLines,
  showMore,
  setShowMore,
  isHighlighted = false,
  onToggleShowMoreRunners,
}) => {
  const onLayout = useScrollIntoView(cardRef);

  const showAll = useCallback(() => {
    if (cardRef.current) {
      if (!showMore) {
        onLayout({ nativeEvent: {}, persist: () => {} } as LayoutChangeEvent, false);
      }
    }
    setShowMore(!showMore);

    onToggleShowMoreRunners(showMore);
  }, [cardRef, onToggleShowMoreRunners, onLayout, setShowMore, showMore]);

  if (!numberOfLines || !numberOfItemsToDisplay || numberOfLines <= numberOfItemsToDisplay) {
    return null;
  }

  return (
    <ShowMoreComponent
      onClick={showAll}
      text={showMore ? i18nLabels.showMore : i18nLabels.showLess}
      opened={!showMore}
      isHighlighted={isHighlighted}
    />
  );
};

export default ShowMore;
