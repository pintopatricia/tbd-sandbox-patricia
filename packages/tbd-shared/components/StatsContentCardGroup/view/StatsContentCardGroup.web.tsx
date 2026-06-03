import { FunctionComponent, useContext } from "react";
import { Divider, ScrollableSwimlane, SupportingContentButton } from "@ppb/the-wall-web";
import { Props, StatsContentItem } from "./StatsContentCardGroup.types";
import { ConfigContext } from "../../Config/ConfigContext";
import { ViewItem } from "../../ViewItem/ViewItem.web";
import styles from "./StatsContentCardGroup.web.css";
import useStatsContentCardGroupVM from "../viewmodel/StatsContentCardGroup.viewmodel";
import StatsContentCardGroupPlaceholder from "./placeholder/StatsContentCardGroupPlaceholder.web";
import { writeStatsContentCardGroupFragment } from "../model/StatsContentCardGroup.graphql";

const StatsContentCardGroup: FunctionComponent<Props> = ({ urn, visible = true }) => {
  const { isDesktopLayout } = useContext(ConfigContext);

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

  const onClickTab = (tabUrn: string, typename: string) => {
    const isOpen = !(tabUrn === vmData.local?.selectedTab?.urn);

    writeStatsContentCardGroupFragment(urn, isOpen, tabUrn, typename);

    events.onTabPress(urn, tabUrn, isOpen);
  };

  return (
    <>
      {hasDivider && <Divider isHighlighted />}
      <div className={styles.statsContent}>
        <ScrollableSwimlane isDesktopLayout={isDesktopLayout} large snap>
          {vmData.items.map((item: StatsContentItem) => (
            <div className={styles.supportingContentItem} key={item.urn}>
              <SupportingContentButton
                icon={item.icon}
                title={item.label}
                isOpen={item.urn === vmData.local?.selectedTab?.urn}
                onPress={() => onClickTab(item.urn, item.typename)}
                isHighlighted={true}
              />
            </div>
          ))}
        </ScrollableSwimlane>
        {vmData.local?.selectedTab?.urn && vmData.local.selectedTab.typename && (
          <ViewItem
            key={vmData.local.selectedTab.urn}
            urn={vmData.local.selectedTab.urn}
            typename={vmData.local.selectedTab.typename}
            visible
          />
        )}
      </div>
    </>
  );
};

export default StatsContentCardGroup;
