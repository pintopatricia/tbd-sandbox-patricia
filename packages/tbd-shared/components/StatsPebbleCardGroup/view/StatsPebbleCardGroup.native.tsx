import { FunctionComponent, useCallback } from "react";
import { View } from "react-native";
import { PebbleList, EmptyState } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import styles from "./StatsPebbleCardGroup.native.styles";
import ConnectedCard from "../../Card";
import Card from "../../Card/Card.native";
import useStatsPebbleCardGroupVM from "../viewmodel/StatsPebbleCardGroup.viewmodel";
import PebbleCardGroupPlaceholder from "../../PebbleCardGroup/PebbleCardGroupPlaceholder.native";
import { Props } from "./StatsPebbleCardGroup.types";
import { writeLocalStatsPebbleCardGroupFragment } from "../model/StatsPebbleCardGroup.graphql";
import { STATS_PEBBLE_CARD_GROUP_CONTAINER } from "./StatsPebbleCardGroup.native.selectors";

const StatsPebbleCardGroup: FunctionComponent<Props> = ({ urn, visible = true }) => {
  const {
    loading,
    vm: { data: vmData, events, emptyLabels },
  } = useStatsPebbleCardGroupVM(urn, visible);

  const onPressPebble = useCallback(
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

  if (loading) {
    return <PebbleCardGroupPlaceholder />;
  }

  if (!vmData?.items || !vmData?.local?.selectedPebble) {
    return <EmptyState isHighlighted message={emptyLabels.message} title={emptyLabels.title} hasImage={false} />;
  }

  return (
    <View style={styles.statsContainer} {...getTestProps(STATS_PEBBLE_CARD_GROUP_CONTAINER, false)}>
      {vmData.local.selectedPebble.urn && (
        <View style={styles.pebblesContainer}>
          <PebbleList
            items={vmData.items}
            onPebblePress={onPressPebble}
            defaultSelectedPebble={vmData.local.selectedPebble.urn}
          />
        </View>
      )}
      {vmData.local.selectedPebble.urn && vmData.local.selectedPebble.typename && (
        <View style={styles.statsContent}>
          <ConnectedCard
            urn={vmData.local.selectedPebble.urn}
            component={Card}
            typename={vmData.local.selectedPebble.typename}
            visible={visible}
          />
        </View>
      )}
    </View>
  );
};

export default StatsPebbleCardGroup;
