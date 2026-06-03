import { useCallback, memo } from "react";
import * as React from "react";
import { View } from "react-native";

import { PartialItem } from "@ppb/tbd-store";
import type { ObbCardsSwimlaneLayout as ObbCardsSwimlaneLayoutType } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { ScrollableSwimlane } from "@ppb/the-wall-native";
import { tokens } from "@ppb/the-wall-common/base-theme";
import ConnectedObbCard from "../../../ObbCard";
import ObbCard from "../../../ObbCard/ObbCard.native";
import { FlatList } from "../../../FlatList.native";
import styles from "./ObbCardsSwimlaneLayout.native.styles";

type ObbCardsLayoutProps = { layout: ObbCardsSwimlaneLayoutType };

const TOKEN_OF_SQUAD_BET_CARD_WIDTH = tokens.SquadBetCardWidth;
const TOKEN_OF_CARDS_GAP = tokens.MicroPlayerSwimlaneHorizontalGap.gap;

const snapProps = {
  pagingEnabled: false,
  bounces: false,
  snapToEnd: false,
  snapToInterval: TOKEN_OF_SQUAD_BET_CARD_WIDTH + TOKEN_OF_CARDS_GAP,
  decelerationRate: 0.98,
};

export const ObbCardsSwimlaneLayout: React.FC<ObbCardsLayoutProps> = memo(({ layout }) => {
  const renderItem = useCallback(
    ({ item }: { item: PartialItem }) => (
      <View style={styles.cardWrapper}>
        <ConnectedObbCard typename={item.typename} urn={item.urn} component={ObbCard} />
      </View>
    ),
    [],
  );

  const keyExtractor = useCallback(({ urn }: { urn: string }, index: number) => `${urn}-${index}`, []);

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: TOKEN_OF_SQUAD_BET_CARD_WIDTH,
      offset: (TOKEN_OF_SQUAD_BET_CARD_WIDTH + TOKEN_OF_CARDS_GAP) * index,
      index,
    }),
    [],
  );

  return (
    <View style={styles.container}>
      <ScrollableSwimlane>
        <FlatList
          data={layout.items}
          horizontal
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          getItemLayout={getItemLayout}
          contentContainerStyle={styles.scrollViewContent}
          style={styles.scrollView}
          key={`${layout.urn}${layout.items.length}`}
          {...snapProps}
        />
      </ScrollableSwimlane>
    </View>
  );
});

ObbCardsSwimlaneLayout.displayName = "ObbCardsSwimlaneLayout";
