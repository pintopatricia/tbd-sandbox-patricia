import { useCallback } from "react";
import * as React from "react";
import { ShowMore as ShowMoreComponent } from "@ppb/the-wall-web";
import { ComponentPropsWeb, i18nLabels } from "./props";

const ShowMore: React.FC<ComponentPropsWeb> = ({
  numberOfItemsToDisplay,
  numberOfLines,
  showMore,
  setShowMore,
  cardRef, // FIXME: cardRef should be a Ref to the card element to avoid unnecessary re-renders
  isHighlighted = false,
  onToggleShowMoreRunners,
}) => {
  const scrollableDesktopOffset = 275;
  const windowOffset = 335;

  const toggleShowMore = useCallback(() => {
    if (!showMore) {
      const cardContainer = cardRef?.parentElement?.parentElement;
      if (cardContainer) {
        const element = document.getElementById("scrollable-desktop-container") || window;
        const offset = document.getElementById("scrollable-desktop-container") ? scrollableDesktopOffset : windowOffset;

        element.scrollTo({
          top: cardContainer.offsetTop - offset,
          behavior: "smooth",
        });
      }
    }

    setShowMore(!showMore);

    onToggleShowMoreRunners(showMore);
  }, [cardRef, onToggleShowMoreRunners, setShowMore, showMore]);

  if (!numberOfLines || !numberOfItemsToDisplay || numberOfLines <= numberOfItemsToDisplay) {
    return null;
  }

  return (
    <ShowMoreComponent
      onClick={toggleShowMore}
      text={showMore ? i18nLabels.showMore : i18nLabels.showLess}
      opened={!showMore}
      isHighlighted={isHighlighted}
    />
  );
};

export default ShowMore;
