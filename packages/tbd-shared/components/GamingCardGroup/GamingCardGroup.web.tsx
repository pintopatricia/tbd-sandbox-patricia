import type { JSX } from "react";
import { FunctionComponent, Suspense, useCallback, useContext } from "react";
import * as React from "react";
import { EmptyState, ScrollableSwimlane } from "@ppb/the-wall-web";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import classnames from "classnames";
import { ViewAllLink } from "@ppb/tbd-store/state/layout/views/ViewAll.types";
import { CardGroupLayout, DisplayMode, GameTileSize } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { GameCardTileSize, GamingCardGroupType } from "@ppb/tbd-store/state/constants";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import ReactDOM from "react-dom";
import styles from "./GamingCardGroup.web.css";
import ConnectedCard from "../Card";
import { ComponentProps } from "./props";
import Card from "../Card/Card.web";
import ConnectedGamingRibbonCard from "../GamingRibbonCard";
import GamingRibbonCard from "../GamingRibbonCard/GamingRibbonCard.web";

import SwimlaneCardGroupPlaceholder from "../SwimlaneCardGroup/SwimlaneCardGroupPlaceholder.web";
import { useVisibilityObserver } from "../../hooks/useVisibilityObserver.web";
import { Observe } from "../../hooks/useVisibilityObserver.types";
import { ConfigContext } from "../Config/ConfigContext";
import { i18n } from "../../helpers/i18n";
import { ViewItemTheme } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { cardGroupTaggingService } from "../../services/TaggingService";

const ConnectedGamesCardGroup = React.lazy(() => import(/* webpackChunkName: "GamesCardGroup" */ "../GamesCardGroup"));
const GamesCardGroup = React.lazy(
  () => import(/* webpackChunkName: "GamesCardGroup" */ "../GamesCardGroup/GamesCardGroup.web"),
);
const ConnectedGameCard = React.lazy(() => import(/* webpackChunkName: "GameCard" */ "../GameCard"));
const GameCard = React.lazy(() => import(/* webpackChunkName: "GameCard" */ "../GameCard/GameCard.web"));
const GameCardPlaceholder = React.lazy(
  () => import(/* webpackChunkName: "GameCard" */ "../GameCard/GameCardPlaceholder.web"),
);
const navigation = "navigation";

function renderGamesCardGroup(urn: string, parentUrn: string | undefined): JSX.Element {
  return (
    <Suspense fallback={<SwimlaneCardGroupPlaceholder />}>
      <ConnectedGamesCardGroup
        urn={urn}
        component={GamesCardGroup}
        placeholder={SwimlaneCardGroupPlaceholder}
        parentUrn={parentUrn}
      />
    </Suspense>
  );
}

function renderGamingRibbonCardGroup(
  items: PartialItem[],
  observe: Observe,
  visibility: Record<string, boolean | undefined>,
  pinGamingRibbonNav: boolean,
  isGamesRibbonHighlighted: boolean,
): JSX.Element {
  const ribbonCardGroup = (
    <ScrollableSwimlane isHighlighted={isGamesRibbonHighlighted}>
      <div className={styles.gamingRibbonCardGroup}>
        {items.map(({ urn: itemUrn }, index) => (
          <div
            key={`${itemUrn}-${index}`}
            ref={(node) => {
              observe(node, itemUrn);
            }}
          >
            <ConnectedGamingRibbonCard urn={itemUrn} component={GamingRibbonCard} visible={!!visibility[itemUrn]} />
          </div>
        ))}
      </div>
    </ScrollableSwimlane>
  );

  if (!pinGamingRibbonNav) {
    return ribbonCardGroup;
  }

  const ribbonCardGroupPortal = <div className={styles.pinnedRibbonCardGroup}>{ribbonCardGroup}</div>;
  const portalTarget = document.getElementById("gaming-ribbon-nav-portal");
  const renderGamingRibbonGroupNav = () => {
    if (portalTarget) return ReactDOM.createPortal(ribbonCardGroupPortal, portalTarget);
    return null;
  };

  return <>{renderGamingRibbonGroupNav()}</>;
}

function renderSegmentedGroup(
  title: string,
  items: PartialItem[],
  observe: Observe,
  visibility: Record<string, boolean | undefined>,
): JSX.Element {
  return (
    <div>
      {title && (
        <div>
          <h4 className={classnames("typography-h158", styles.segmentedTitle)}>{title}</h4>
        </div>
      )}
      <div className={styles.segmentedWrapper}>
        {items.map(({ urn, typename }, index) => (
          <div
            key={`${urn}-${index}`}
            className={styles.segmentedContainer}
            ref={(node) => {
              observe(node, urn);
            }}
          >
            <ConnectedCard urn={urn} component={Card} typename={typename} visible={!!visibility[urn]} />
          </div>
        ))}
      </div>
    </div>
  );
}

function renderRecentlyPlayed(
  title: string,
  items: PartialItem[],
  viewAll: ViewAllLink | undefined,
  displayMode: DisplayMode,
  onClick: () => void,
  observe: Observe,
  visibility: Record<string, boolean | undefined>,
  isDesktopLayout: boolean,
): JSX.Element {
  const itemCls = classnames(styles.swimlaneItemContainer, styles.roundGame);

  return (
    <ScrollableSwimlane
      title={title}
      snap={displayMode === "SNAP"}
      noSpacing={displayMode === "SNAP"}
      navLink={viewAll}
      onButtonClick={onClick}
      isDesktopLayout={isDesktopLayout}
    >
      {items.map(({ urn }, index) => (
        <div
          key={`${urn}-${index}`}
          className={itemCls}
          ref={(node) => {
            observe(node, urn);
          }}
        >
          <Suspense fallback={<GameCardPlaceholder />}>
            <ConnectedGameCard
              urn={urn}
              isRoundGameTile={true}
              component={GameCard}
              placeholder={GameCardPlaceholder}
              visible={!!visibility[urn]}
            />
          </Suspense>
        </div>
      ))}
    </ScrollableSwimlane>
  );
}

function renderScrollableSwimlane(
  cardgroupURN: string,
  title: string,
  items: PartialItem[],
  viewAll: ViewAllLink | undefined,
  displayMode: DisplayMode,
  onClick: () => void,
  observe: Observe,
  visibility: Record<string, boolean | undefined>,
  decoration: string | undefined,
  isDesktopLayout: boolean,
  gameTileSize?: GameTileSize,
  isXmallGameTile?: boolean,
): JSX.Element {
  const getStyle = (typename: string): string => {
    const isMediumTileSize = gameTileSize === GameCardTileSize.MEDIUM;
    const isSmallTileSize = gameTileSize === GameCardTileSize.SMALL;
    return classnames(styles.swimlaneItemContainer, {
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
      [styles.circle]: ["CompetitionViewLinkCard"].includes(typename),
      [styles.decoratedGame]:
        (["GameCard"].includes(typename) && decoration && !isMediumTileSize) ||
        (["GameCard"].includes(typename) && isSmallTileSize),
      [styles.game]: (["GameCard"].includes(typename) && !decoration) || isMediumTileSize,
      [styles.gamingLink]: ["GamingLinkCard"].includes(typename),
      [styles.promotion]: ["PromotionCard"].includes(typename),
      [styles.sportviewlink]: ["SportViewLinkCard", "GenericViewLinkCard"].includes(typename),
      [styles.byTimeRangeMeeting]: ["RaceByTimeRangeCard"].includes(typename),
      [styles.snap]: displayMode === "SNAP",
      [styles.xmallGameTile]: isXmallGameTile && !isDesktopLayout,
    });
  };
  return (
    <ScrollableSwimlane
      title={title}
      snap={displayMode === "SNAP"}
      noSpacing={displayMode === "SNAP"}
      navLink={viewAll}
      onButtonClick={onClick}
      isDesktopLayout={isDesktopLayout}
    >
      {items.map(({ urn, typename }, index) => (
        <div
          key={`${urn}-${index}`}
          className={getStyle(typename)}
          ref={(node) => {
            observe(node, urn);
          }}
        >
          <ConnectedCard
            urn={urn}
            component={Card}
            typename={typename}
            moduleTitle={title}
            theme={isXmallGameTile && !isDesktopLayout ? ViewItemTheme.GamingSmallTiles : undefined}
            visible={!!visibility[urn]}
          />
        </div>
      ))}
    </ScrollableSwimlane>
  );
}

function renderFavouriteGames(items: any, cardgroupURN: string, segmentedCardGroupUrn: string | undefined) {
  return (
    <>
      <p className={styles.favouritesWelcome}>{i18n({ key: "I18N.FAVOURITE_GAMES.WELCOME" })}</p>
      <h2 className={styles.favouritesTitle}>{i18n({ key: "I18N.FAVOURITE_GAMES.TITLE" })}</h2>

      {items.length === 0 ? (
        <EmptyState
          message={
            <div className={styles.emptyStateMessage}>
              <p>{i18n({ key: "I18N.FAVOURITE_GAMES.EMPTY_STATE_MESSAGE" })}</p>
              <p className={styles.emptyStateInstruction}>
                {i18n({ key: "I18N.FAVOURITE_GAMES.EMPTY_STATE_INSTRUCTION_CLICK" })}&nbsp;
                <span className={styles.heartIcon}>
                  <GenericIcon name={SystemIconName.HEART_OUTLINE} />
                </span>
                &nbsp;
                {i18n({ key: "I18N.FAVOURITE_GAMES.EMPTY_STATE_INSTRUCTION" })}
              </p>
            </div>
          }
          hasImage={false}
          isHighlighted={false}
        />
      ) : (
        renderGamesCardGroup(cardgroupURN, segmentedCardGroupUrn)
      )}
    </>
  );
}

function renderGamingWidget(
  items: PartialItem[],
  observe: Observe,
  visibility: Record<string, boolean | undefined>,
  isBetslipContainerDisplayed: boolean,
  isDesktopLayout: boolean,
): JSX.Element {
  if (isDesktopLayout) {
    return <></>;
  }
  const gamingWidgetStyle = classnames(styles.gameTileWidgetPositioning, {
    [styles.gameTileWidgetPositioningAfterBetslipOpen]: isBetslipContainerDisplayed,
  });
  return (
    <div className={gamingWidgetStyle}>
      {items.slice(0, 1).map(({ urn }, index) => (
        <div
          key={`${urn}-${index}`}
          ref={(node) => {
            observe(node, urn);
          }}
        >
          <ConnectedGameCard
            urn={urn}
            isGameWidget={true}
            component={GameCard}
            placeholder={GameCardPlaceholder}
            visible={!!visibility[urn]}
          />
        </div>
      ))}
    </div>
  );
}

const GamingCardGroup: FunctionComponent<ComponentProps> = ({
  isSegmented,
  title,
  items,
  cardgroupURN,
  segmentedCardGroupUrn,
  displayMode,
  defaultLayout,
  viewAll,
  decoration,
  dispatchFetchCards,
  dispatchPushAction,
  dispatchViewAllTap,
  dispatchLoadedContent,
  gameTileSize,
  type,
  pinGamingRibbonNav,
  isGamesRibbonHighlighted,
  isBetslipContainerDisplayed,
  isXmallGameTile,
  taggingService = cardGroupTaggingService,
}) => {
  const isNavigationUrn = cardgroupURN.includes(navigation);

  // Check if this will render GamesCardGroup (which handles its own events)
  // The widget (decoration === "BF Gaming iconwidget") renders before layout checks, so it never uses GamesCardGroup
  const isWidget = decoration === "BF Gaming iconwidget";
  const willRenderGamesCardGroup =
    !isWidget &&
    ((isSegmented && defaultLayout === CardGroupLayout.CARD_LIST) ||
      defaultLayout === CardGroupLayout.GRID_TWO_COLUMNS ||
      defaultLayout === CardGroupLayout.GRID_FOUR_COLUMNS);

  const dispatchEventsOnShow = React.useCallback(
    (urn: string) => {
      // Skip if GamesCardGroup will handle events, navigation URN, or already dispatched globally
      if (!willRenderGamesCardGroup && !isNavigationUrn && !taggingService.hasFired(cardgroupURN)) {
        taggingService.markFired(cardgroupURN);
        const itemUrns = items.map((item) => item.urn);
        dispatchLoadedContent(cardgroupURN, title, itemUrns);
      }
      // Always dispatch fetch for lazy loading card data
      dispatchFetchCards(urn, items);
    },
    [
      cardgroupURN,
      dispatchFetchCards,
      dispatchLoadedContent,
      isNavigationUrn,
      items,
      taggingService,
      title,
      willRenderGamesCardGroup,
    ],
  );

  const { observe, visibility } = useVisibilityObserver({
    onFirstShow: (urn) => dispatchEventsOnShow(urn),
  });

  const { isDesktopLayout } = useContext(ConfigContext);

  const onClick = useCallback(() => {
    if (!viewAll) return;
    dispatchViewAllTap(title, viewAll, cardgroupURN);
    dispatchPushAction(viewAll.viewLink);
  }, [cardgroupURN, dispatchPushAction, dispatchViewAllTap, title, viewAll]);

  if (type === GamingCardGroupType.FAVOURITE_GAMES) {
    return renderFavouriteGames(items, cardgroupURN, segmentedCardGroupUrn);
  }

  // Empty swimlane
  if (!items.length) {
    return <></>;
  }
  if (decoration === "BF Gaming iconwidget") {
    return renderGamingWidget(items, observe, visibility, isBetslipContainerDisplayed, isDesktopLayout);
  }

  if (type === GamingCardGroupType.CATEGORIES) {
    return renderGamingRibbonCardGroup(items, observe, visibility, pinGamingRibbonNav, isGamesRibbonHighlighted);
  }

  if (type === GamingCardGroupType.RECENTLY_PLAYED) {
    return renderRecentlyPlayed(title, items, viewAll, displayMode, onClick, observe, visibility, isDesktopLayout);
  }

  // Grid component for games
  if (
    (isSegmented && defaultLayout === CardGroupLayout.CARD_LIST) ||
    defaultLayout === CardGroupLayout.GRID_TWO_COLUMNS ||
    defaultLayout === CardGroupLayout.GRID_FOUR_COLUMNS
  ) {
    return renderGamesCardGroup(cardgroupURN, segmentedCardGroupUrn);
  }

  if (isSegmented) {
    return renderSegmentedGroup(title, items, observe, visibility);
  }

  // Default
  return renderScrollableSwimlane(
    cardgroupURN,
    title,
    items,
    viewAll,
    displayMode,
    onClick,
    observe,
    visibility,
    decoration,
    isDesktopLayout,
    gameTileSize,
    isXmallGameTile,
  );
};

export default GamingCardGroup;
