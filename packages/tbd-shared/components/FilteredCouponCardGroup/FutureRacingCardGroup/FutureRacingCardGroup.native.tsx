import { FunctionComponent, useCallback } from "react";
import { View, SectionList } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { Text } from "@ppb/the-wall-native";
import { ComponentProps } from "./props";
import ConnectedCard from "../../Card";
import Card from "../../Card/Card.native";
import { useNativeLazyLoading } from "../../../hooks/useNativeLazyLoading.native";
import styles from "./FutureRacingCardGroup.native.styles";
import { FUTURE_RACING_TEST_ID, FUTURE_RACING_TITLE } from "./FutureRacingCardGroup.native.selectors";

const VIEW_AREA_COVERAGE_PERCENT_THRESHOLD = 1;
const viewConfig = {
  itemVisiblePercentThreshold: VIEW_AREA_COVERAGE_PERCENT_THRESHOLD,
};

const FutureRacingCardGroup: FunctionComponent<ComponentProps> = ({ items, urnList, visible, dispatchFetchCards }) => {
  const onViewableItemsChanged = useNativeLazyLoading(urnList, dispatchFetchCards);
  const sectionItems = items.map((item) => ({ title: item.date, data: item.items }));
  const renderItem = useCallback(
    ({ item }: { item: PartialItem }) => (
      <View key={item.urn} style={styles.separator}>
        <ConnectedCard key={item.urn} urn={item.urn} typename={item.typename} component={Card} visible={visible} />
      </View>
    ),
    [visible],
  );

  const keyExtractor = useCallback(
    (item: PartialItem, index: number) => `future-racing-card-group-${item.urn}-${index}`,
    [],
  );

  const renderSectionHeader = useCallback(
    ({ section: { title } }: { section: { title: string } }) => (
      <Text {...getTestProps(FUTURE_RACING_TITLE)} style={styles.title}>
        {title}
      </Text>
    ),
    [],
  );

  return (
    <SectionList
      {...getTestProps(FUTURE_RACING_TEST_ID, false)}
      style={styles.container}
      sections={sectionItems}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      viewabilityConfig={viewConfig}
      onViewableItemsChanged={onViewableItemsChanged}
    />
  );
};

export default FutureRacingCardGroup;
