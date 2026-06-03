import { FunctionComponent, useCallback, useRef } from "react";
import { LayoutChangeEvent, View } from "react-native";
import { useScrollIntoView } from "../../../hooks/useScrollIntoView.native";
import StatsPlayersSeasonStatsCardNative from "@ppb/tbd-components-rich-data/components/StatsPlayersSeasonStatsCard/view/StatsPlayersSeasonStatsCard.native";

export interface Props {
  urn: string;
  visible?: boolean;
}

const StatsPlayersSeasonStatsCard: FunctionComponent<Props> = ({ urn, visible = true }) => {
  const viewRef = useRef<View>(null);

  const persistedEventScroller = useScrollIntoView(viewRef, true);

  const handleShowMore = useCallback(() => {
    persistedEventScroller({ nativeEvent: {}, persist: () => {} } as LayoutChangeEvent, true);
  }, [persistedEventScroller]);

  return (
    <View ref={viewRef}>
      <StatsPlayersSeasonStatsCardNative urn={urn} visible={visible} onShowMore={handleShowMore} />
    </View>
  );
};

export default StatsPlayersSeasonStatsCard;
