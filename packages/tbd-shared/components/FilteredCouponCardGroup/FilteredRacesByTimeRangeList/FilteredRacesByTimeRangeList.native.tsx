import type { JSX } from "react";
import { FunctionComponent, useCallback } from "react";
import { View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { withStyle, Card } from "@ppb/the-wall-native";
import { PartialItem } from "@ppb/tbd-store";
import { ComponentProps } from "./props";
import ConnectedSwimlaneCardGroup from "../../SwimlaneCardGroup";
import SwimlaneCardGroup from "../../SwimlaneCardGroup/SwimlaneCardGroup.native";
import SwimlaneCardGroupPlaceholder from "../../SwimlaneCardGroup/SwimlaneCardGroupPlaceholder.native";
import ConnectedByTimeRangeMeetingCardGroup from "../../ByTimeRangeMeetingCardGroup";
import ByTimeRangeMeetingCardGroup from "../../ByTimeRangeMeetingCardGroup/ByTimeRangeMeetingCardGroup.native";
import ByTimeRangeMeetingCardGroupPlaceholder from "../../ByTimeRangeMeetingCardGroup/ByTimeRangeMeetingCardGroupPlaceholder.native";
import { useNativeLazyLoading } from "../../../hooks/useNativeLazyLoading.native";
import { CardTheme } from "@ppb/the-wall-common/types";
import styles from "./FilteredRacesByTimeRangeList.native.styles";
import { FILTERED_SWIMLANE } from "./FilteredRacesByTimeRangeList.native.selectors";
import { FlatList, RenderItem } from "../../FlatList.native";

const StyledSwimlanePlaceHolder = withStyle(SwimlaneCardGroupPlaceholder, { height: 500 });
const StyledGridPlaceHolder = withStyle(ByTimeRangeMeetingCardGroupPlaceholder, { height: 500 });

const getCardGroupComponent = (urn: string, visible: boolean, typename?: string): JSX.Element => {
  if (typename === "ByTimeRangeMeetingCardGroup") {
    return (
      <ConnectedByTimeRangeMeetingCardGroup
        urn={urn}
        component={ByTimeRangeMeetingCardGroup}
        placeholder={StyledGridPlaceHolder}
        visible={visible}
      />
    );
  }

  return (
    <ConnectedSwimlaneCardGroup
      urn={urn}
      component={SwimlaneCardGroup}
      placeholder={StyledSwimlanePlaceHolder}
      visible={visible}
    />
  );
};

const FilteredRacesByTimeRangeList: FunctionComponent<ComponentProps> = ({ items, dispatchFetchCards }) => {
  const onViewableItemsChanged = useNativeLazyLoading(items, dispatchFetchCards);

  const renderItem = useCallback<RenderItem<PartialItem>>(
    ({ item: { urn, visible, typename } }) => (
      <View style={styles.swimlaneContainer} {...getTestProps(FILTERED_SWIMLANE, false)}>
        {getCardGroupComponent(urn, visible, typename)}
      </View>
    ),
    [],
  );

  return (
    <Card showShadow fullWidthContent theme={CardTheme.TRANSPARENT}>
      <FlatList data={items} renderItem={renderItem} onViewableItemsChanged={onViewableItemsChanged} />
    </Card>
  );
};

export default FilteredRacesByTimeRangeList;
