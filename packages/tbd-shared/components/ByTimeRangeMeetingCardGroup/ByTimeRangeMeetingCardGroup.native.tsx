import { FunctionComponent, memo } from "react";
import { View } from "react-native";
import { TBDImage, Text } from "@ppb/the-wall-native";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import ConnectedCard from "../Card";
import Card, { isCardImplemented } from "../Card/Card.native";
import { ComponentProps } from "./props";
import { useNativeLazyLoading } from "../../hooks/useNativeLazyLoading.native";
import styles from "./ByTimeRangeMeetingCardGroup.native.styles";
import useCardGroupItems from "../../hooks/useCardGroupItems";
import {
  TIME_RANGE_MEETING,
  TIME_RANGE_MEETING_ICON,
  TIME_RANGE_MEETING_TITLE,
} from "./ByTimeRangeMeetingCardGroup.native.selectors";

type MemoizedProps = ComponentProps & {
  items: PartialItem[];
};

export const MemoizedByTimeRangeMeetingCardGroup: FunctionComponent<MemoizedProps> = memo(
  ({ title, items, icon, visible }) => {
    const groupedItems = items.reduce<PartialItem[][]>((acc, item, index) => {
      const pairIndex = Math.floor(index / 2);

      if (!acc[pairIndex]) {
        acc[pairIndex] = [];
      }
      acc[pairIndex].push(item);

      return acc;
    }, []);

    return (
      <View {...getTestProps(TIME_RANGE_MEETING, false)} style={styles.container}>
        <View style={styles.header}>
          {!!(icon?.vector && title) && (
            <View {...getTestProps(TIME_RANGE_MEETING_ICON, false)} style={styles.icon}>
              <TBDImage width={styles.icon.width} height={styles.icon.height} source={icon?.vector} />
            </View>
          )}
          {!!title && (
            <Text {...getTestProps(TIME_RANGE_MEETING_TITLE)} style={styles.title}>
              {title}
            </Text>
          )}
        </View>
        {groupedItems.map((pairItems, index) => {
          const { urn: urn1, typename: typename1 } = pairItems[0];
          const { urn: urn2, typename: typename2 } = pairItems[1] ?? {};

          return (
            <View key={`pair-${urn1}-${urn2}`} style={[styles.racePair, index === 0 && styles.racePaddingTop]}>
              <View key={urn1} style={styles.raceRight}>
                <ConnectedCard urn={urn1} component={Card} typename={typename1} visible={visible} />
              </View>
              {!!urn2 && (
                <View key={urn2} style={styles.raceLeft}>
                  <ConnectedCard urn={urn2} component={Card} typename={typename2} visible={visible} />
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  },
);
MemoizedByTimeRangeMeetingCardGroup.displayName = "MemoizedByTimeRangeMeetingCardGroup";

const ByTimeRangeMeetingCardGroup: FunctionComponent<ComponentProps> = (props) => {
  const { items: partials, dispatchFetchCards } = props;

  const items = useCardGroupItems(partials, isCardImplemented);

  /**
   * Triggers fetch card when item is visible
   */
  useNativeLazyLoading(items, dispatchFetchCards);

  // Empty list
  if (!items.length) {
    return null;
  }

  return <MemoizedByTimeRangeMeetingCardGroup {...props} />;
};

export default ByTimeRangeMeetingCardGroup;
