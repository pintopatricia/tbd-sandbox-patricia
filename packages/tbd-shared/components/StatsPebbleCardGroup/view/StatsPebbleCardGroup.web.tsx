import { FunctionComponent, useCallback, useContext } from "react";
import { PebbleList, EmptyState } from "@ppb/the-wall-web";
import styles from "./StatsPebbleCardGroup.web.css";
import { ConfigContext } from "../../Config/ConfigContext";
import useStatsPebbleCardGroupVM from "../viewmodel/StatsPebbleCardGroup.viewmodel";
import PebbleCardGroupPlaceholder from "../../PebbleCardGroup/PebbleCardGroupPlaceholder.web";
import ConnectedCard from "../../Card";
import Card from "../../Card/Card.web";
import { Props } from "./StatsPebbleCardGroup.types";
import { writeLocalStatsPebbleCardGroupFragment } from "../model/StatsPebbleCardGroup.graphql";

const StatsPebbleCardGroup: FunctionComponent<Props> = ({ urn, visible = true }) => {
  const {
    loading,
    vm: { data: vmData, events, emptyLabels },
  } = useStatsPebbleCardGroupVM(urn, visible);
  const { isDesktopLayout } = useContext(ConfigContext);

  const onClickPebble = useCallback(
    (pebbleId: string) => {
      const foundPebble = vmData?.items?.find((item) => item.id === pebbleId);

      if (foundPebble?.typename) {
        writeLocalStatsPebbleCardGroupFragment(urn, {
          pebbleUrn: foundPebble.id,
          typename: foundPebble.typename,
        });
      }

      events.onPebbleStatsPress(urn, pebbleId);
    },
    [events, urn, vmData?.items],
  );

  // If component is still loading show placeholder
  if (loading) {
    return <PebbleCardGroupPlaceholder />;
  }

  if (!vmData?.items || !vmData?.local?.selectedPebble) {
    return <EmptyState isHighlighted message={emptyLabels.message} title={emptyLabels.title} hasImage={false} />;
  }

  return (
    <div className={styles.statsContainer}>
      {vmData.local.selectedPebble.urn && (
        <div className={styles.pebblesContainer}>
          <PebbleList
            items={vmData.items}
            onPebbleClick={onClickPebble}
            selectedPebble={vmData.local.selectedPebble.urn}
            isDesktopLayout={isDesktopLayout}
          />
        </div>
      )}
      {vmData.local.selectedPebble.urn && vmData.local.selectedPebble.typename && (
        <div className={styles.statsContent}>
          <ConnectedCard
            urn={vmData.local.selectedPebble.urn}
            component={Card}
            typename={vmData.local.selectedPebble.typename}
          />
        </div>
      )}
    </div>
  );
};

export default StatsPebbleCardGroup;
