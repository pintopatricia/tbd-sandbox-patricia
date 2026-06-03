import { FunctionComponent, useState, useMemo } from "react";
import { View, FlatList } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { ObbPlayersListCard } from "../ObbPlayersListCard/ObbPlayersListCard.native";
import { useSortedObbPlayersList } from "../../hooks/useSortedObbPlayersList";
import { TEST_ID, PLAYER_CONTAINER, TEST_ID_CONTAINER } from "./ObbPlayersGrid.native.selectors";
import { ObbPlayersGridProps } from "./ObbPlayersGrid.types";
import styles from "./ObbPlayersGrid.native.styles";
import { spacings } from "@ppb/the-wall-common/base-theme";

const GRID_BREAKPOINT_WIDTH = 360;

export const ObbPlayersGrid: FunctionComponent<ObbPlayersGridProps> = ({
  participants,
  selectedParticipantId,
  handleSelectParticipant,
  participantQuotesMap,
  maxStatValue,
}) => {
  const { players, isLoading } = useSortedObbPlayersList(participants, participantQuotesMap);

  const [containerWidth, setContainerWidth] = useState(0);

  const numColumns = containerWidth < GRID_BREAKPOINT_WIDTH ? 2 : 3;

  const itemWidth = useMemo(
    () => (containerWidth ? Math.floor((containerWidth - spacings["spacing-2"] * (numColumns - 1)) / numColumns) : 0),
    [containerWidth, numColumns],
  );

  const isSelected = (playerId: string) => selectedParticipantId === playerId;

  const renderItem = ({ item }: { item: (typeof players)[0]; index: number }) => (
    <View key={item.player.id} style={[styles.player, { width: itemWidth }]} {...getTestProps(PLAYER_CONTAINER, false)}>
      <ObbPlayersListCard
        participant={item}
        isSelected={isSelected(item.player.id)}
        handleSelectParticipant={handleSelectParticipant}
        isLoading={isLoading}
        maxStatValue={maxStatValue}
      />
    </View>
  );

  const shouldRender = containerWidth > 0;

  return (
    <View
      style={styles.container}
      onLayout={(e) => {
        const width = e.nativeEvent.layout.width;
        if (width !== containerWidth) setContainerWidth(width);
      }}
      {...getTestProps(TEST_ID_CONTAINER, false)}
    >
      {shouldRender && (
        <FlatList
          key={`numColumns-${numColumns}`}
          data={players}
          renderItem={renderItem}
          keyExtractor={(item: any) => item.player.id}
          numColumns={numColumns}
          columnWrapperStyle={styles.flatListContainer}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          {...getTestProps(TEST_ID, false)}
        />
      )}
    </View>
  );
};
