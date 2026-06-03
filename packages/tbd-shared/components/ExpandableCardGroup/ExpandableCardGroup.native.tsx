import { FunctionComponent, useCallback, useMemo } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { PartialItem } from "@ppb/tbd-store";
import { Card, Text } from "@ppb/the-wall-native";
import { CardTheme, CardHeaderSize } from "@ppb/the-wall-common/types/Card/Card.types";
import styles from "./ExpandableCardGroup.native.styles";
import ConnectedCard from "../Card";
import { ComponentProps } from "./props";
import TBDCard from "../Card/Card.native";
import { useNativeLazyLoading } from "../../hooks/useNativeLazyLoading.native";
import {
  EXPANDABLE_CARDGROUP,
  EXPANDABLE_CARDGROUP_HEADER_CONTAINER,
  EXPANDABLE_CARDGROUP_ITEM,
} from "./ExpandableCardGroup.native.selectors";
import { FlatList, RenderItem } from "../FlatList.native";

const getStyle = (typename: string): StyleProp<ViewStyle> => [
  typename === "HighlightedSelectionCard" && styles.highlightedSelection,
];

const ExpandableCardGroup: FunctionComponent<ComponentProps> = ({
  urn,
  title,
  items,
  isExpanded = true,
  isExpandable = true,
  dispatchFetchCards,
  dispatchExpandableCardGroupToggle,
}) => {
  const onViewableItemsChanged = useNativeLazyLoading(items, dispatchFetchCards);
  const onCollapseComponentToggle = useCallback(
    (expanded: boolean) => {
      dispatchExpandableCardGroupToggle(expanded, urn, title);
    },
    [dispatchExpandableCardGroupToggle, urn, title],
  );
  const renderItem = useCallback<RenderItem<PartialItem>>(
    ({ item }) => (
      <View style={getStyle(item.typename)} {...getTestProps(EXPANDABLE_CARDGROUP_ITEM, false)}>
        <ConnectedCard urn={item.urn} component={TBDCard} typename={item.typename} visible={item.visible} />
      </View>
    ),
    [],
  );

  const renderTitle = useMemo(
    () =>
      !!title && (
        <View style={styles.headerTitle}>
          <Text {...getTestProps(EXPANDABLE_CARDGROUP_HEADER_CONTAINER, false)} style={styles.headerTextList}>
            {title}
          </Text>
        </View>
      ),
    [title],
  );

  if (!items.length) {
    return null;
  }

  return (
    <View style={styles.container} {...getTestProps(EXPANDABLE_CARDGROUP, false)}>
      {isExpandable ? (
        <Card
          title={title}
          startOpen={isExpanded}
          onTitleClick={onCollapseComponentToggle}
          theme={CardTheme.SECONDARY}
          size={CardHeaderSize.LARGE}
          isCollapsible
          fullWidthContent
        >
          <FlatList data={items} renderItem={renderItem} onViewableItemsChanged={onViewableItemsChanged} />
        </Card>
      ) : (
        <>
          {renderTitle}
          <FlatList data={items} renderItem={renderItem} onViewableItemsChanged={onViewableItemsChanged} />
        </>
      )}
    </View>
  );
};

export default ExpandableCardGroup;
