import { FunctionComponent, useCallback, useEffect, useMemo, useRef } from "react";
import { View, FlatList, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { ScrollableSwimlane, StatusLabel } from "@ppb/the-wall-native";
import { StatusLabelSizeType, StatusLabelType } from "@ppb/the-wall-common/types";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import ObbOnboardingCard from "../ObbOnboardingCard/ObbOnboardingCard.native";
import styles, { CARD_WIDTH, CARD_GAP } from "./ObbOnboardingCardsCardGroup.native.styles";
import { ComponentProps, ObbOnboardingCard as ObbOnboardingCardType } from "./ObbOnboardingCardsCardGroup.props";
import { CARD_CONTAINER } from "./ObbOnboardingCardsCardGroup.native.selectors";
import ObbOnboardingCardsCardGroupPlaceholder from "./placeholder/ObbOnboardingCardsCardGroupPlaceholder.native";

const DECELERATION_RATE = 0.98;

const ObbOnboardingCardsCardGroup: FunctionComponent<ComponentProps> = ({
  urn: cardGroupUrn,
  title,
  badgeLabel,
  event,
  clearCardGroupView,
  onboardingCards,
  dispatchOnboardingCardGroupDisplayed,
  dispatchOnboardingCardGroupScrollEvent,
  dispatchDeleteObbOnboardingCardsCardGroup,
}) => {
  useEffect(() => {
    if (!clearCardGroupView) return;
    dispatchDeleteObbOnboardingCardsCardGroup();
  }, [clearCardGroupView, dispatchDeleteObbOnboardingCardsCardGroup]);

  useEffect(() => {
    if (clearCardGroupView) return;
    dispatchOnboardingCardGroupDisplayed(event.name, onboardingCards.length);
  }, [event.name, onboardingCards.length, dispatchOnboardingCardGroupDisplayed, clearCardGroupView]);
  const keyExtractor = useCallback((_: ObbOnboardingCardType, index: number) => `onboarding-card-${index}`, []);

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: CARD_WIDTH,
      offset: (CARD_WIDTH + CARD_GAP) * index,
      index,
    }),
    [],
  );

  const cardCount = useMemo(() => onboardingCards.length, [onboardingCards]);
  const currentCardIndexRef = useRef<number>(0);

  const handleMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      /**
       * Handles scroll events to dispatch a tagging event when the user drags to a new card.
       * Instead of firing on every scroll tick, it debounces the callback and only dispatches
       * when the scroll has settled on a new card index (i.e., a full card swipe is consummated).
       */
      const offsetX = e.nativeEvent.contentOffset.x;
      const newCardIndex = Math.round(offsetX / (CARD_WIDTH + CARD_GAP));

      if (newCardIndex !== currentCardIndexRef.current) {
        const direction = newCardIndex > currentCardIndexRef.current ? "right" : "left";
        dispatchOnboardingCardGroupScrollEvent(event.name, direction);
        currentCardIndexRef.current = newCardIndex;
      }
    },
    [dispatchOnboardingCardGroupScrollEvent, event.name],
  );

  const snapProps =
    cardCount >= 2
      ? {
          pagingEnabled: false,
          snapToInterval: CARD_WIDTH + CARD_GAP,
          decelerationRate: DECELERATION_RATE,
        }
      : {};

  const renderItem = useCallback(
    ({ item }: { item: ObbOnboardingCardType }) => (
      <View style={styles.cardWrapper}>
        <ObbOnboardingCard card={item} event={event} cardGroupUrn={cardGroupUrn} />
      </View>
    ),
    [event, cardGroupUrn],
  );

  if (clearCardGroupView) {
    return <ObbOnboardingCardsCardGroupPlaceholder />;
  }

  return (
    <ScrollableSwimlane
      title={title}
      icon={
        badgeLabel ? (
          <View style={styles.statusLabelWrapper}>
            <View style={styles.statusLabelAbsolute}>
              <StatusLabel
                text={badgeLabel}
                statusLabelSize={StatusLabelSizeType.SMALL}
                statusLabelType={StatusLabelType.COMPLIMENTARY}
              />
            </View>
          </View>
        ) : undefined
      }
      iconPosition="after"
    >
      <FlatList
        {...getTestProps(CARD_CONTAINER, false)}
        data={onboardingCards}
        horizontal
        scrollEnabled={cardCount > 1}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsHorizontalScrollIndicator={false}
        getItemLayout={cardCount >= 2 ? getItemLayout : undefined}
        contentContainerStyle={styles.scrollContent}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        {...snapProps}
      />
    </ScrollableSwimlane>
  );
};

export default ObbOnboardingCardsCardGroup;
