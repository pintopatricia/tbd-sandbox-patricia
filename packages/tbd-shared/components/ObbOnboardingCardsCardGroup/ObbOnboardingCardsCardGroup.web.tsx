import { FunctionComponent, useCallback, useContext, useEffect, useRef } from "react";
import classNames from "classnames";
import { ScrollableSwimlane, StatusLabel } from "@ppb/the-wall-web";
import { StatusLabelSizeType, StatusLabelType } from "@ppb/the-wall-common/types";
import styles from "./ObbOnboardingCardsCardGroup.web.css";
import { ComponentProps } from "./ObbOnboardingCardsCardGroup.props";
import { ConfigContext } from "../Config/ConfigContext";
import ObbOnboardingCard from "../ObbOnboardingCard/ObbOnboardingCard.web";
import ObbOnboardingCardsCardGroupPlaceholder from "./placeholder/ObbOnboardingCardsCardGroupPlaceholder.web";

const DEBOUNCE_SCROLL_TIME_MS = 150;
const ObbOnboardingCardsCardGroup: FunctionComponent<ComponentProps> = ({
  urn: cardGroupUrn,
  title,
  badgeLabel,
  event,
  clearCardGroupView,
  onboardingCards,
  dispatchOnboardingCardGroupDisplayed,
  dispatchOnboardingCardGroupScrollEvent,
  dispatchObbEventSelection,
  dispatchDeleteObbOnboardingCardsCardGroup,
}) => {
  const { isDesktopLayout } = useContext(ConfigContext);
  const scrollableSwimlaneRef = useRef<HTMLDivElement>(null);
  const currentCardIndexRef = useRef<number>(0);
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!clearCardGroupView) return;
    dispatchDeleteObbOnboardingCardsCardGroup();
  }, [clearCardGroupView, dispatchDeleteObbOnboardingCardsCardGroup]);

  useEffect(() => {
    if (clearCardGroupView) return;
    dispatchOnboardingCardGroupDisplayed(event.name, onboardingCards.length);
  }, [event.name, onboardingCards.length, dispatchOnboardingCardGroupDisplayed, clearCardGroupView]);

  useEffect(() => {
    return () => {
      if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
    };
  }, []);

  const cardCount = onboardingCards.length;
  const enableDesktopLayout = isDesktopLayout && cardCount >= 2;

  const handleSwimlaneArrowClick = useCallback(
    (direction: "left" | "right") => {
      dispatchObbEventSelection(
        {
          elementText: direction === "left" ? "previous" : "next",
          module: { card: "onboarding card" },
        },
        event.name,
      );
    },
    [dispatchObbEventSelection, event.name],
  );

  const handleOnScrollCb = useCallback(() => {
    /**
     * Handles scroll events to dispatch a tagging event when the user drags to a new card.
     * Instead of firing on every scroll tick, it debounces the callback and only dispatches
     * when the scroll has settled on a new card index (i.e., a full card swipe is consummated).
     */
    if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);

    scrollEndTimerRef.current = setTimeout(() => {
      const container = scrollableSwimlaneRef.current;
      if (!container || cardCount === 0) return;

      const cardWidth = container.scrollWidth / cardCount;
      const newCardIndex = Math.round(container.scrollLeft / cardWidth);

      if (newCardIndex !== currentCardIndexRef.current) {
        const direction = newCardIndex > currentCardIndexRef.current ? "right" : "left";
        dispatchOnboardingCardGroupScrollEvent(event.name, direction);
        currentCardIndexRef.current = newCardIndex;
      }
    }, DEBOUNCE_SCROLL_TIME_MS);
  }, [cardCount, dispatchOnboardingCardGroupScrollEvent, event.name]);

  if (clearCardGroupView) {
    return <ObbOnboardingCardsCardGroupPlaceholder />;
  }

  return (
    <ScrollableSwimlane
      title={title}
      ref={scrollableSwimlaneRef}
      icon={
        badgeLabel && (
          <StatusLabel
            text={badgeLabel}
            statusLabelSize={StatusLabelSizeType.SMALL}
            statusLabelType={StatusLabelType.COMPLIMENTARY}
          />
        )
      }
      iconPosition="after"
      isDesktopLayout={enableDesktopLayout}
      onScrollCb={!isDesktopLayout ? handleOnScrollCb : undefined}
      onScrollArrowClick={handleSwimlaneArrowClick}
      snap
    >
      {onboardingCards.map((card, index) => (
        <div
          key={`${cardGroupUrn}-${index}`}
          className={classNames(styles.card, {
            [styles.firstCard]: index === 0,
            [styles.lastCard]: index === onboardingCards.length - 1,
          })}
        >
          <ObbOnboardingCard card={card} event={event} cardGroupUrn={cardGroupUrn} />
        </div>
      ))}
    </ScrollableSwimlane>
  );
};

export default ObbOnboardingCardsCardGroup;
