import { FunctionComponent } from "react";
import { ScrollView, View } from "react-native";
import { Divider, ScrollableSwimlane, SupportingContentButton } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Props, StatsContentItem } from "./StatsContentCardGroup.types";
import { ViewItem } from "../../ViewItem/ViewItem.native";
import styles from "./StatsContentCardGroup.native.styles";
import useStatsContentCardGroupVM from "../viewmodel/StatsContentCardGroup.viewmodel";
import { STATS_CONTENT, STATS_CONTENT_CARD_GROUP_TAB } from "./StatsContentCardGroup.native.selectors";
import StatsContentCardGroupPlaceholder from "./placeholder/StatsContentCardGroupPlaceholder.native";
import { writeStatsContentCardGroupFragment } from "../model/StatsContentCardGroup.graphql";

const SNAP_TO_INTERVAL = styles.supportingContentItem.minWidth + styles.supportingContentItem.marginRight;

const StatsContentCardGroup: FunctionComponent<Props> = ({ urn, visible = true }) => {
  const {
    loading,
    vm: { data: vmData, events, hasDivider },
  } = useStatsContentCardGroupVM(urn, visible);

  if (loading) {
    return <StatsContentCardGroupPlaceholder />;
  }

  if (!vmData?.items) {
    return null;
  }

  const onPressTab = (tabUrn: string, typename: string) => {
    const isOpen = !(tabUrn === vmData.local?.selectedTab?.urn);

    writeStatsContentCardGroupFragment(urn, isOpen, tabUrn, typename);

    events.onTabPress(urn, tabUrn, isOpen);
  };

  const renderItem = ({ item, index }: { item: StatsContentItem; index: number }) => {
    const isLastItem = index === vmData.items.length - 1;

    return (
      <View
        style={[styles.supportingContentItem, isLastItem && styles.lastItem]}
        key={item.urn}
        {...getTestProps(STATS_CONTENT_CARD_GROUP_TAB, false)}
      >
        <SupportingContentButton
          icon={item.icon}
          title={item.label}
          isOpen={item.urn === vmData.local?.selectedTab?.urn}
          onPress={() => onPressTab(item.urn, item.typename)}
          isHighlighted={true}
        />
      </View>
    );
  };

  const snapProps = {
    pagingEnabled: false,
    bounces: false,
    decelerationRate: 0.98,
    snapToEnd: false,
    snapToInterval: SNAP_TO_INTERVAL,
  };

  return (
    <>
      {hasDivider && (
        <View style={styles.dividerContainer}>
          <Divider isHighlighted />
        </View>
      )}
      <View style={styles.statsContent} {...getTestProps(STATS_CONTENT, false)}>
        <ScrollableSwimlane>
          <ScrollView
            horizontal
            contentContainerStyle={{ flexGrow: 1 }}
            showsHorizontalScrollIndicator={false}
            {...snapProps}
          >
            {vmData.items.map((item, index) => renderItem({ item, index }))}
          </ScrollView>
        </ScrollableSwimlane>
        <View style={styles.viewItemContainer}>
          {vmData.local?.selectedTab?.urn && vmData.local.selectedTab.typename && (
            <ViewItem
              key={vmData.local.selectedTab.urn}
              urn={vmData.local.selectedTab.urn}
              typename={vmData.local.selectedTab.typename}
              visible
            />
          )}
        </View>
      </View>
    </>
  );
};

export default StatsContentCardGroup;
