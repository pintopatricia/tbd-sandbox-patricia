import { FunctionComponent, RefObject, useCallback, useEffect, useRef, useState } from "react";
import { FlatList, View } from "react-native";
import { SelectableItems, SegmentedControl, Text, Card } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import {
  SelectableItemsCardGroupEdge,
  SelectableItemsFilterOptions,
} from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { ComponentProps } from "./props";
import {
  TEST_ID as SELECTABLE_ITEMS_CARD_GROUP_CONTAINER,
  SELECTABLE_ITEMS_CARDGROUP_TITLE,
} from "./SelectableItemsCardGroup.native.selectors";
import styles from "./SelectableItemsCardGroup.native.styles";
import ConnectedCardGroup from "../CardGroup";
import CardGroup from "../CardGroup/CardGroup.native";
import { CardTheme } from "@ppb/the-wall-common/types";

const SelectableItemsCardGroup: FunctionComponent<ComponentProps> = ({
  urn,
  title,
  isHighlighted,
  cardGroupItems,
  selectableItems,
  filterProps,
  hasItemRotation,
  visible,
  dispatchFetchCardsAction,
  dispatchRaceClick,
  dispatchStatisticsItemClick,
  dispatchNextRacesFilterClick,
  dispatchFetchFilteredSelectableItems,
}) => {
  const [selectedItem, setSelectedCardURN] = useState<SelectableItemsCardGroupEdge | null>(cardGroupItems[0] || null);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const listContainer = useRef<FlatList>(null) as RefObject<FlatList>;
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
    if (listContainer?.current && !hasItemRotation) {
      listContainer.current.scrollToOffset({ animated: true, offset: 0 });
    }
  }, [cardGroupItems, hasItemRotation]);

  useEffect(() => {
    if (urnToFetch && urnToFetch !== fetchedUrnRef.current) {
      fetchedUrnRef.current = urnToFetch;
      dispatchFetchCardsAction([urnToFetch]);
    }
  }, [urnToFetch, dispatchFetchCardsAction]);

  return (
    <View {...getTestProps(SELECTABLE_ITEMS_CARD_GROUP_CONTAINER, false)}>
      {!!title && (
        <Text style={styles.title} {...getTestProps(SELECTABLE_ITEMS_CARDGROUP_TITLE, false)}>
          {title}
        </Text>
      )}
      {filterProps && (
        <View style={styles.toggleContainer}>
          <SegmentedControl
            onPress={onSegmentedControlClick}
            options={filterProps.options}
            selectedOption={filterProps.selectedOption}
          />
        </View>
      )}
      <Card showShadow fullWidthContent theme={CardTheme.TRANSPARENT}>
        <SelectableItems
          isHighlighted={isHighlighted}
          items={selectableItems}
          onRaceTimeClick={onRaceTimeClick}
          defaultItemIndex={currentIndex}
          listContainerRef={listContainer}
          onStatisticsClick={onStatisticsClick}
        />
      </Card>
      <View style={styles.cardContainer}>
        {!!selectedItem && (
          <ConnectedCardGroup
            urn={selectedItem.urn}
            component={CardGroup}
            typename={selectedItem.typename}
            visible={visible}
          />
        )}
      </View>
    </View>
  );
};

export default SelectableItemsCardGroup;
