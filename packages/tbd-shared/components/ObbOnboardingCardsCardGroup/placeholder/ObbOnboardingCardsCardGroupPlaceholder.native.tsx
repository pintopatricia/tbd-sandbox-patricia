import { FunctionComponent, useCallback } from "react";
import { View, FlatList } from "react-native";
import { ScrollableSwimlane } from "@ppb/the-wall-native";
import ObbOnboardingCardPlaceholder from "../../ObbOnboardingCard/placeholder/ObbOnboardingCardPlaceholder.native";
import styles, { CARD_WIDTH, CARD_GAP } from "./ObbOnboardingCardsCardGroupPlaceholder.native.styles";

const DECELERATION_RATE = 0.98;

const snapProps = {
  pagingEnabled: false,
  snapToInterval: CARD_WIDTH + CARD_GAP,
  decelerationRate: DECELERATION_RATE,
};

const placeholderData = [{ id: "placeholder-1" }, { id: "placeholder-2" }, { id: "placeholder-3" }];

const ObbOnboardingCardsCardGroupPlaceholder: FunctionComponent = () => {
  const renderItem = useCallback(
    () => (
      <View style={styles.cardWrapper}>
        <ObbOnboardingCardPlaceholder />
      </View>
    ),
    [],
  );

  const keyExtractor = useCallback((item: { id: string }) => item.id, []);

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: CARD_WIDTH,
      offset: (CARD_WIDTH + CARD_GAP) * index,
      index,
    }),
    [],
  );

  return (
    <ScrollableSwimlane title="">
      <FlatList
        data={placeholderData}
        horizontal
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsHorizontalScrollIndicator={false}
        getItemLayout={getItemLayout}
        contentContainerStyle={styles.scrollContent}
        {...snapProps}
      />
    </ScrollableSwimlane>
  );
};

export default ObbOnboardingCardsCardGroupPlaceholder;
