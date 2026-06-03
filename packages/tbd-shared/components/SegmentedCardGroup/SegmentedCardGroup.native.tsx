import { FunctionComponent, useCallback } from "react";
import { View } from "react-native";
import { ScrollableSwimlane } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { ComponentProps } from "./props";
import styles from "./SegmentedCardGroup.native.styles";
import selectors from "./SegmentedCardGroup.native.selectors";
import { useNativeLazyLoading } from "../../hooks/useNativeLazyLoading.native";
import ConnectedGamingCardGroup from "../GamingCardGroup";
import GamingCardGroup from "../GamingCardGroup/GamingCardGroup.native";
import SegmentedCardGroupPlaceholder from "./SegmentedCardGroupPlaceholder.native";
import { FlatList, RenderItem } from "../FlatList.native";

const SegmentedCardGroup: FunctionComponent<ComponentProps> = ({ zones, dispatchFetchCards }) => {
  const onViewableItemsChanged = useNativeLazyLoading(zones, dispatchFetchCards);

  const renderItem = useCallback<RenderItem>(
    ({ item: { urn }, index }) => (
      <View style={styles.item}>
        {index !== 0 && <View style={styles.sectionGutter} />}
        <ConnectedGamingCardGroup
          urn={urn}
          component={GamingCardGroup}
          placeholder={SegmentedCardGroupPlaceholder}
          isSegmented={true}
        />
      </View>
    ),
    [],
  );

  if (!zones?.length) {
    return null;
  }

  return (
    <View {...getTestProps(selectors.SEGMENTED_CARD_GROUP_CONTAINER, false)}>
      <ScrollableSwimlane>
        <FlatList
          data={zones}
          renderItem={renderItem}
          contentContainerStyle={[styles.scrollSection, styles.scrollableContainer]}
          onViewableItemsChanged={onViewableItemsChanged}
          horizontal
        />
      </ScrollableSwimlane>
    </View>
  );
};

export default SegmentedCardGroup;
