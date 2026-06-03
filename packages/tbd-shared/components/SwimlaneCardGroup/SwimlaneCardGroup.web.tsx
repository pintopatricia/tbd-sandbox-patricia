import { FunctionComponent, useCallback, useRef, useLayoutEffect, useContext } from "react";
import * as React from "react";
import { Image, ScrollableSwimlane, Card as CardTheWall } from "@ppb/the-wall-web";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { DisplayMode } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { ViewAllLink } from "@ppb/tbd-store/state/layout/views/ViewAll.types";
import classnames from "classnames";
import styles from "./SwimlaneCardGroup.web.css";
import ConnectedCard from "../Card";
import { ComponentProps } from "./props";
import Card, { isCardImplemented } from "../Card/Card.web";
import { useVisibilityObserver } from "../../hooks/useVisibilityObserver.web";
import { Observe } from "../../hooks/useVisibilityObserver.types";
import useCardGroupItems from "../../hooks/useCardGroupItems";
import { ConfigContext } from "../Config/ConfigContext";
import { CardTheme } from "@ppb/the-wall-common/types";

type ScrollableSwimlaneRenderFnProps = {
  title: string;
  items: PartialItem[];
  scrollIntoIndex?: number;
  viewAll: ViewAllLink | undefined;
  displayMode: DisplayMode;
  icon: React.ReactNode | undefined;
  onClick: () => void;
  observe: Observe;
  isDesktopLayout: boolean;
  isHighlighted: boolean;
  visibility: Record<string, boolean | undefined>;
};

// threshold for when there's auto scroll to a given index, so we can still present a hint of the previous item in the screen
const SCROLL_INTO_OFFSET = 30;

const ScrollableSwimlaneRenderFn: FunctionComponent<ScrollableSwimlaneRenderFnProps> = ({
  title,
  items,
  scrollIntoIndex = 0,
  viewAll,
  displayMode,
  icon,
  onClick,
  observe,
  isDesktopLayout,
  isHighlighted,
  visibility,
}) => {
  const getStyle = (typename: string): string =>
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
  const listRef = useRef<HTMLDivElement>(null);
  const lastRectRef = React.useRef<{ width: number; height: number } | null>(null);

  useLayoutEffect(() => {
    if (
      listRef?.current &&
      typeof scrollIntoIndex === "number" &&
      Number.isFinite(scrollIntoIndex) &&
      itemsRef?.current &&
      items.length
    ) {
      const index = scrollIntoIndex < items.length ? scrollIntoIndex : items.length - 1;
      const currentItem = itemsRef.current[index];
      if (!currentItem) return undefined;

      const observer = new ResizeObserver(([entry]) => {
        const rect = entry.target.getBoundingClientRect();
        const prev = lastRectRef.current;

        if (rect.height !== prev?.height) {
          lastRectRef.current = {
            width: rect.width,
            height: rect.height,
          };

          const itemX = entry.target.getBoundingClientRect().x;
          const listX = listRef.current?.getBoundingClientRect().x || 0;
          const relativeX = itemX - listX;

          const listLeft = listRef.current?.scrollLeft || 0;

          if (relativeX && relativeX !== SCROLL_INTO_OFFSET) {
            listRef.current?.scrollTo({
              left: listLeft + relativeX - SCROLL_INTO_OFFSET,
            });
          }
        }
      });

      observer.observe(currentItem);

      return () => {
        observer.unobserve(currentItem);
        observer.disconnect();
      };
    }

    return undefined;
  }, [items.length, itemsRef, listRef, scrollIntoIndex]);

  return (
    <CardTheWall showShadow fullWidthContent theme={CardTheme.TRANSPARENT}>
      <ScrollableSwimlane
        title={title}
        icon={icon}
        snap={displayMode === "SNAP"}
        noSpacing={displayMode === "SNAP"}
        navLink={viewAll}
        onButtonClick={onClick}
        ref={listRef}
        isDesktopLayout={isDesktopLayout}
        isHighlighted={isHighlighted}
      >
        {items.map(({ urn, typename }, index) => (
          <div
            key={`${urn}-${index}`}
            className={getStyle(typename)}
            ref={(el) => {
              itemsRef.current[index] = el;
              observe(el, urn);
            }}
          >
            <ConnectedCard urn={urn} component={Card} typename={typename} visible={!!visibility[urn]} />
          </div>
        ))}
      </ScrollableSwimlane>
    </CardTheWall>
  );
};

const SwimlaneCardGroup: FunctionComponent<ComponentProps> = ({
  title,
  icon,
  items: partials,
  scrollIntoIndex,
  cardgroupURN,
  displayMode,
  viewAll,
  isHighlighted,
  dispatchFetchCards,
  dispatchPushAction,
  dispatchViewAllTap,
}) => {
  const { isDesktopLayout } = useContext(ConfigContext);
  const items = useCardGroupItems(partials, isCardImplemented);

  const { observe, visibility } = useVisibilityObserver({
    onFirstShow: (urn) => dispatchFetchCards(urn, partials),
  });

  const onClick = useCallback(() => {
    if (!viewAll) return;
    dispatchViewAllTap(title, viewAll, cardgroupURN);
    dispatchPushAction(viewAll.viewLink);
  }, [cardgroupURN, dispatchPushAction, dispatchViewAllTap, title, viewAll]);

  if (!items.length) {
    return null;
  }

  const img = icon?.vector && <Image width={20} height={20} alt="" src={icon?.vector} />;
  return (
    <ScrollableSwimlaneRenderFn
      title={title}
      items={items}
      icon={img}
      scrollIntoIndex={scrollIntoIndex}
      viewAll={viewAll}
      displayMode={displayMode}
      onClick={onClick}
      observe={observe}
      isDesktopLayout={isDesktopLayout}
      isHighlighted={isHighlighted}
      visibility={visibility}
    />
  );
};

export default SwimlaneCardGroup;
