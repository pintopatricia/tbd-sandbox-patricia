import { tokens } from "@ppb/the-wall-common/base-theme";
import { FunctionComponent, memo, useCallback, useMemo, useRef } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, View } from "react-native";
import { ScrollView as GestureScrollView } from "react-native-gesture-handler";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import { MicroPlayersCarouselProps, areMicroPlayersCarouselPropsEqual } from "./props";
import { getSquadBetParticipantName } from "../../../../helpers/obb";
import styles from "./MicroPlayersCarousel.native.styles";
import { ObbMicroPlayer } from "../../../ObbMicroPlayer/ObbMicroPlayer.native";

const snapProps = {
  pagingEnabled: false,
  bounces: false,
  snapToEnd: false,
  snapToInterval: tokens.MicroPlayerWidthSizing + tokens.MicroPlayerSwimlaneHorizontalGap.gap,
};

const MicroPlayersCarouselComponent: FunctionComponent<MicroPlayersCarouselProps> = ({
  players,
  onClick,
  onEditSquadButtonClick,
  onRemovePlayerClick,
}) => {
  const innerScrollRef = useRef<ScrollView>(null);

  const handleScrollEndDrag = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const layoutWidth = event.nativeEvent.layoutMeasurement.width;
    const contentWidth = event.nativeEvent.contentSize.width;
    const maxOffset = contentWidth - layoutWidth;

    if (offsetX <= 0 || offsetX >= maxOffset) {
      const adjustedX = offsetX <= 0 ? 1 : maxOffset - 1;
      innerScrollRef.current?.scrollTo({ x: adjustedX, animated: true });
    }
  }, []);

  const microPlayers = useMemo(
    () =>
      players.map((participant, index) => {
        const isLastParticipant = index === players.length - 1;
        const { firstName, lastName } = getSquadBetParticipantName(participant);
        const jersey = participant.status === "loaded" ? participant.jersey : undefined;
        const playerKey = participant.status === "loaded" ? participant.urn : `loading-${index}`;

        const microPlayerContent = (
          <View style={[styles.microPlayer, !isLastParticipant && styles.microPlayerSpacing]}>
            <ObbMicroPlayer
              players={[{ firstName: firstName || "", lastName: lastName || "" }]}
              jerseys={[jersey]}
              onRemovePlayerClick={
                onRemovePlayerClick && participant.status === "loaded"
                  ? () => onRemovePlayerClick(participant.urn)
                  : undefined
              }
            />
          </View>
        );

        return onClick ? (
          <Pressable key={playerKey} onPress={onClick}>
            {microPlayerContent}
          </Pressable>
        ) : (
          <View key={playerKey}>{microPlayerContent}</View>
        );
      }),
    [players, onClick, onRemovePlayerClick],
  );

  return (
    <View style={styles.carouselContainer}>
      <GestureScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.innerScroll}
        contentContainerStyle={styles.innerScrollContent}
        nestedScrollEnabled
        ref={innerScrollRef}
        onScrollEndDrag={handleScrollEndDrag}
        {...snapProps}
      >
        {microPlayers}
      </GestureScrollView>
      {onEditSquadButtonClick && (
        <Pressable
          onPress={() => onEditSquadButtonClick()}
          style={styles.editSquadButtonIcon}
          testID="edit-squad-button-icon"
        >
          <GenericIcon name={SystemIconName.NUDGE_PLUS} color="white" />
        </Pressable>
      )}
    </View>
  );
};

export const MicroPlayersCarousel = memo(MicroPlayersCarouselComponent, areMicroPlayersCarouselPropsEqual);

export default MicroPlayersCarousel;
