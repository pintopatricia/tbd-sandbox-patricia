import { isValidElement, ReactNode, useCallback, useState, type FunctionComponent } from "react";
import { View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Text } from "@ppb/the-wall-native";
import { i18n } from "../../../helpers/i18n";

import {
  PLAYER_VIEW_CONTAINER,
  PLAYER_VIEW_LOADING_LABEL,
  PLAYER_VIEW_HEADER,
  PLAYER_VIEW_HEADER_NAME,
  PLAYER_VIEW_HEADER_POSITION,
  PLAYER_VIEW_HEADER_SHIRT_NUMBER,
} from "./PlayerView.native.selectors";
import usePlayerViewVM from "../viewmodel/PlayerView.viewmodel";
import type { PlayerViewHeader } from "./PlayerView.types";
import styles, { headerStyles } from "./PlayerView.native.styles";
import FootballPlayerCompetitionStatsCard from "../components/FootballPlayerCompetitionStatsCard/view/FootballPlayerCompetitionStatsCard.native";
import ConnectedRegulatoryCard from "../../RegulatoryCard";
import RegulatoryCard from "../../RegulatoryCard/RegulatoryCard.native";
import RegulatoryCardPlaceholder from "../../RegulatoryCard/RegulatoryCardPlaceholder.native";
import PlayerMarketsCardGroup from "../components/PlayerMarketsCardGroup/view/PlayerMarketsCardGroup.native";
import { useNativeLazyLoading } from "../../../hooks/useNativeLazyLoading.native";
import { PartialItem } from "@ppb/tbd-store";
import { FlatList, RenderItem } from "../../FlatList.native";

const PlayerViewHeader: FunctionComponent<PlayerViewHeader> = ({ name, position, shirtNumber }) => {
  return (
    <View style={headerStyles.container} {...getTestProps(PLAYER_VIEW_HEADER, false)}>
      <View>
        <Text style={headerStyles.playerName} {...getTestProps(PLAYER_VIEW_HEADER_NAME, false)}>
          {name}
        </Text>
        {position ? (
          <Text style={headerStyles.playerPosition} {...getTestProps(PLAYER_VIEW_HEADER_POSITION, false)}>
            {position}
          </Text>
        ) : null}
      </View>

      {shirtNumber ? (
        <View>
          <Text style={headerStyles.playerShirtNumber} {...getTestProps(PLAYER_VIEW_HEADER_SHIRT_NUMBER, false)}>
            {shirtNumber || "-"}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const renderPlayerViewItem = (typename: string, urn: string, visible: boolean): ReactNode => {
  switch (typename) {
    case "FootballPlayerCompetitionStatsCard":
      return <FootballPlayerCompetitionStatsCard key={urn} urn={urn} visible={visible} />;
    case "PlayerMarketsCardGroup":
      return <PlayerMarketsCardGroup key={urn} urn={urn} visible={visible} />;
    case "RegulatoryCard":
      return (
        <ConnectedRegulatoryCard
          key={urn}
          urn={urn}
          component={RegulatoryCard}
          placeholder={RegulatoryCardPlaceholder}
        />
      );
    default:
      return <></>;
  }
};

const PlayerView: FunctionComponent<{ urn: string }> = ({ urn }) => {
  const {
    vm: { data: vmData, events },
    loading,
  } = usePlayerViewVM(urn);

  const [visibleItems, setVisibleItems] = useState<Map<string, boolean>>(new Map());

  const onViewableItemsChanged = useNativeLazyLoading(
    (vmData?.items ?? []).map((item) => {
      return { ...item, typename: item.__typename };
    }),
    (urn: string, partialItems: PartialItem[]) => {
      // Filter non apollo component
      const item = partialItems.find((item) => item.urn === urn);
      if (item) {
        setVisibleItems((prev) => {
          const newMap = new Map(prev);
          newMap.set(urn, true);
          return newMap;
        });
        if (["RegulatoryCard"].includes(item?.typename ?? "")) {
          events?.fetchCards([urn]);
        }
      }
    },
  );

  const renderItem = useCallback<RenderItem>(
    (component) => {
      const item = vmData?.items?.find((item) => item.urn === component.item.urn);

      const renderedItem = renderPlayerViewItem(
        item?.__typename ?? "",
        item?.urn ?? "",
        visibleItems.get(item?.urn ?? "") ?? false,
      );
      return isValidElement(renderedItem) ? renderedItem : null;
    },
    [vmData, visibleItems],
  );

  if (loading) {
    return (
      <View style={styles.container} {...getTestProps(PLAYER_VIEW_CONTAINER, false)}>
        <Text style={styles.loadingLabel} {...getTestProps(PLAYER_VIEW_LOADING_LABEL, false)}>
          {i18n({ key: "I18N.STATE_INIDICATOR.SPLASH_SCREEN_TITLE" })}
        </Text>
      </View>
    );
  }

  if (!vmData?.viewHeader) return null;

  const viewHeader = vmData.viewHeader;

  return (
    <FlatList
      {...getTestProps(PLAYER_VIEW_CONTAINER, false)}
      ListHeaderComponent={
        <PlayerViewHeader name={viewHeader.name} position={viewHeader.position} shirtNumber={viewHeader.shirtNumber} />
      }
      style={styles.container}
      data={vmData.items}
      renderItem={renderItem}
      onViewableItemsChanged={onViewableItemsChanged}
      scrollEventThrottle={16}
    />
  );
};

export default PlayerView;
