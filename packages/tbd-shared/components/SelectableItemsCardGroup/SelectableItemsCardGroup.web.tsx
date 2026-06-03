import { FunctionComponent, useCallback, useContext, useEffect, useRef, useState } from "react";
import { SelectableItems, SegmentedControl, Card as CardTheWall } from "@ppb/the-wall-web";
import {
  SelectableItemsCardGroupEdge,
  SelectableItemsFilterOptions,
} from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { ComponentProps } from "./props";
import ConnectedCard from "../Card";
import Card from "../Card/Card.web";
import styles from "./SelectableItemsCardGroup.web.css";
import { ConfigContext } from "../Config/ConfigContext";
import { CardTheme } from "@ppb/the-wall-common/types";

const SelectableItemsCardGroup: FunctionComponent<ComponentProps> = ({
  urn,
  title,
  isHighlighted,
  cardGroupItems,
  selectableItems,
  filterProps,
  hasItemRotation,
  dispatchFetchCardsAction,
  dispatchRaceClick,
  dispatchStatisticsItemClick,
  dispatchNextRacesFilterClick,
  dispatchFetchFilteredSelectableItems,
}) => {
  const { isDesktopLayout } = useContext(ConfigContext);
  const [selectedItem, setSelectedCardURN] = useState<SelectableItemsCardGroupEdge | null>(cardGroupItems[0] || null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const onRaceTimeClick = useCallback(
    (index: number): void => {
      setSelectedCardURN(cardGroupItems[index]);
      setCurrentIndex(index);

      dispatchRaceClick(urn);
      dispatchFetchCardsAction([cardGroupItems[index].urn]);
    },
    [cardGroupItems, dispatchFetchCardsAction, dispatchRaceClick, urn],
  );

  const onStatisticsClick = useCallback(
    (index: number, itemTitle: string): void => {
      setSelectedCardURN(cardGroupItems[index]);
      setCurrentIndex(index);

      dispatchStatisticsItemClick(itemTitle);
      dispatchFetchCardsAction([cardGroupItems[index].urn]);
    },
    [cardGroupItems, dispatchFetchCardsAction, dispatchStatisticsItemClick],
  );

  const onSegmentedControlClick = useCallback(
    (country: string, translation: string): void => {
      dispatchFetchFilteredSelectableItems(urn, country as SelectableItemsFilterOptions);
      dispatchNextRacesFilterClick(translation);
    },
    [urn, dispatchFetchFilteredSelectableItems, dispatchNextRacesFilterClick],
  );

  const [urnToFetch, setUrnToFetch] = useState<string | null>(null);
  const fetchedUrnRef = useRef<string | null>(null);
  const [prevCardGroupItems, setPrevCardGroupItems] = useState(cardGroupItems);
  const [prevSelectableItems, setPrevSelectableItems] = useState(selectableItems);
  const [prevSelectedUrn, setPrevSelectedUrn] = useState(selectedItem?.urn);

  const cardGroupItemsChanged = prevCardGroupItems !== cardGroupItems;
  const selectableItemsChanged = prevSelectableItems !== selectableItems;
  const selectedUrnChanged = prevSelectedUrn !== selectedItem?.urn;

  if (cardGroupItemsChanged) setPrevCardGroupItems(cardGroupItems);
  if (selectableItemsChanged) setPrevSelectableItems(selectableItems);
  if (selectedUrnChanged) setPrevSelectedUrn(selectedItem?.urn);

  if (cardGroupItemsChanged && !hasItemRotation) {
    setCurrentIndex(0);
    setSelectedCardURN(cardGroupItems[0]);
  }

  if (hasItemRotation && (cardGroupItemsChanged || selectableItemsChanged || selectedUrnChanged)) {
    const currentItemIndex = cardGroupItems.findIndex((item) => item.urn === selectedItem?.urn);
    const truncatedItemIndex = currentItemIndex >= 0 ? currentItemIndex : 0;
    const shouldRotateItem =
      selectableItems[truncatedItemIndex]?.isRaceClosed && selectableItems[truncatedItemIndex + 1];
    const adjustedIndex = shouldRotateItem ? truncatedItemIndex + 1 : truncatedItemIndex;

    if (shouldRotateItem) {
      setUrnToFetch(cardGroupItems[adjustedIndex].urn);
    }

    setCurrentIndex(adjustedIndex);
    setSelectedCardURN(cardGroupItems[adjustedIndex]);
  }

  useEffect(() => {
    if (listRef?.current && !hasItemRotation) {
      listRef.current.scrollTo(0, 0);
    }
  }, [cardGroupItems, hasItemRotation]);

  useEffect(() => {
    if (urnToFetch && urnToFetch !== fetchedUrnRef.current) {
      fetchedUrnRef.current = urnToFetch;
      dispatchFetchCardsAction([urnToFetch]);
    }
  }, [urnToFetch, dispatchFetchCardsAction]);

  return (
    <div className={styles.container}>
      {title && <h2 className={`typography-h380 ${styles.title}`}>{title}</h2>}
      {filterProps && (
        <div className={styles.toggleContainer}>
          <SegmentedControl
            onClick={onSegmentedControlClick}
            options={filterProps.options}
            selectedOption={filterProps.selectedOption}
          />
        </div>
      )}
      <CardTheWall showShadow fullWidthContent theme={CardTheme.TRANSPARENT}>
        <SelectableItems
          isHighlighted={isHighlighted}
          items={selectableItems}
          onRaceTimeClick={onRaceTimeClick}
          onStatisticsClick={onStatisticsClick}
          defaultItemIndex={currentIndex}
          listContainerRef={listRef}
          isDesktop={isDesktopLayout}
        />
      </CardTheWall>
      <div className={styles.cardContainer}>
        {selectedItem && <ConnectedCard urn={selectedItem.urn} component={Card} typename={selectedItem.typename} />}
      </div>
    </div>
  );
};

export default SelectableItemsCardGroup;
