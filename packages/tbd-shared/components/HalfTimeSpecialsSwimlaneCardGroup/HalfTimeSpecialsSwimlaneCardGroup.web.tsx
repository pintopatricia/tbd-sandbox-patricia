import { FunctionComponent, useRef, useEffect, useContext } from "react";
import { PartialItem } from "@ppb/tbd-store";
import { DisplayMode } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { ScrollableSwimlane } from "@ppb/the-wall-web";
import classnames from "classnames";
import { Observe } from "../../hooks/useVisibilityObserver.types";
import { ComponentProps } from "./props";
import styles from "./HalfTimeSpecialsSwimlaneCardGroup.web.css";
import { ConfigContext } from "../Config/ConfigContext";
import useCardGroupItems from "../../hooks/useCardGroupItems";
import Card, { isCardImplemented } from "../Card/Card.web";
import { useVisibilityObserver } from "../../hooks/useVisibilityObserver.web";
import ConnectedCard from "../Card";
import AnimatedIcon from "./snowflakes/AnimatedIcon/AnimatedIcon.web";

type ScrollableHalfTimeSpecialsSwimlaneRenderFnProps = {
  title?: string;
  subtitle?: string;
  items: PartialItem[];
  scrollIntoIndex?: number;
  displayMode: DisplayMode;
  observe: Observe;
  isDesktopLayout: boolean;
  visibility: Record<string, boolean | undefined>;
  isDecorated?: boolean;
  isIconSupportingTitle?: boolean;
  isHighlighted: boolean;
};

const SCROLL_INTO_OFFSET = 30;

const ScrollableHalfTimeSpecialsSwimlaneRenderFn: FunctionComponent<
  ScrollableHalfTimeSpecialsSwimlaneRenderFnProps
> = ({ title, subtitle, items, scrollIntoIndex, displayMode, observe, isDesktopLayout, isHighlighted, visibility }) => {
  const getStyle = (typename: string, index: number): string =>
    classnames(styles.swimlaneItemContainer, {
      [styles.navigation]: ["EventViewLinkCard", "MarketViewLinkCard", "GamingLinkCard", "RaceViewLinkCard"].includes(
        typename,
      ),
      [styles.supportingContent]: [
        "MatchStatsCard",
        "MatchTimelineCard",
        "TeamLineupCard",
        "TeamFormCard",
        "HeadToHeadCard",
      ].includes(typename),
      [styles.scrollableSwimlaneLeft]: index === 0,
      [styles.scrollableSwimlaneRight]: index === items.length - 1,
      [styles.highlightedSelection]: ["HighlightedSelectionCard"].includes(typename),
      [styles.competitionViewLink]: ["CompetitionViewLinkCard"].includes(typename),
      [styles.game]: ["GameCard"].includes(typename),
      [styles.gamingLink]: ["GamingLinkCard"].includes(typename),
      [styles.sportviewlink]: ["SportViewLinkCard", "GenericViewLinkCard"].includes(typename),
      [styles.byTimeRangeMeeting]: ["RaceByTimeRangeCard"].includes(typename),
      [styles.promoCard]: [
        "BetOpportunityPromoCard",
        "EditorialPromoCard",
        "SelectionPromoCard",
        "LoyaltyPromoCard",
      ].includes(typename),
      [styles.extended]: items.length < 2,
      [styles.snap]: displayMode === "SNAP",
    });

  // if there's a scrollIntoIndex defined, apply auto scroll for the given index
  const itemsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (listRef?.current && scrollIntoIndex && itemsRef?.current && items.length) {
      const index = scrollIntoIndex < items.length ? scrollIntoIndex : items.length - 1;
      const { x, width } = itemsRef.current[index]?.getBoundingClientRect() || {};

      if (x && width) {
        listRef.current?.scrollTo(x - SCROLL_INTO_OFFSET, 0);
      }
    }
  }, [items.length, itemsRef, listRef, scrollIntoIndex]);

  return (
    <div
      className={classnames(styles.container, {
        [styles.highlightedContainer]: isHighlighted,
      })}
    >
      <div>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>{title}</h1>
          <AnimatedIcon />
        </div>
        <h2 className={styles.subtitle}>{subtitle}</h2>
      </div>
      <ScrollableSwimlane
        snap={displayMode === "SNAP"}
        noSpacing={displayMode === "SNAP"}
        ref={listRef}
        isDesktopLayout={isDesktopLayout}
      >
        {items.map(({ urn, typename }, index) => (
          <div
            key={`${urn}-${index}`}
            className={getStyle(typename, index)}
            ref={(el) => {
              itemsRef.current[index] = el;
              observe(el, urn);
            }}
          >
            <ConnectedCard urn={urn} component={Card} typename={typename} visible={!!visibility[urn]} />
          </div>
        ))}
      </ScrollableSwimlane>
    </div>
  );
};

const HalfTimeSpecialsSwimlaneCardGroup: FunctionComponent<ComponentProps> = ({
  title,
  subtitle,
  items: partials,
  scrollIntoIndex,
  displayMode,
  isHighlighted,
  dispatchFetchCards,
}) => {
  const { isDesktopLayout } = useContext(ConfigContext);
  const items = useCardGroupItems(partials, isCardImplemented);

  const { observe, visibility } = useVisibilityObserver({
    onFirstShow: (urn) => dispatchFetchCards(urn, partials),
  });

  if (!items.length) {
    return null;
  }

  return (
    <ScrollableHalfTimeSpecialsSwimlaneRenderFn
      title={title}
      subtitle={subtitle}
      items={items}
      scrollIntoIndex={scrollIntoIndex}
      displayMode={displayMode}
      observe={observe}
      isDesktopLayout={isDesktopLayout}
      visibility={visibility}
      isHighlighted={isHighlighted}
    />
  );
};

export default HalfTimeSpecialsSwimlaneCardGroup;
