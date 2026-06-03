import classnames from "classnames";

import { FunctionComponent, MouseEvent, useCallback, useContext } from "react";

import * as React from "react";
import { ActionLink } from "@ppb/the-wall-web";
import { CardGroup } from "@ppb/the-wall-web/components/bricks/CardGroup/CardGroup";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { CardGroupLayout } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { isRecentlyPlayedGroup } from "@ppb/tbd-store/helpers/recently-played-games";
import { GameTileContainerLayout } from "./snowflakes/GameTileContainer/GameTileContainerLayout.types";
import { GameTileContainer } from "./snowflakes/GameTileContainer/GameTileContainer.web";
import { i18n } from "../../helpers/i18n";
import ConnectedGameCard from "../GameCard";
import GameCard from "../GameCard/GameCard.web";
import GameCardPlaceholder from "../GameCard/GameCardPlaceholder.web";
import {
  GamingCategoryLink,
  type GamingCategoryLinkPropsViewModel,
} from "./snowflakes/GamingCategoryLink/GamingCategoryLink.web";
import styles from "./GamesCardGroup.web.css";
import { ComponentProps } from "./props";
import { useVisibilityObserver } from "../../hooks/useVisibilityObserver.web";
import { ConfigContext } from "../Config/ConfigContext";
import { gamesCardGroupTaggingService } from "../../services/TaggingService";

/**
 * Function component that wraps a scrollable  swimlane of games
 *
 * @param props The component props
 * @returns The react component
 */
const GamesCardGroup: FunctionComponent<ComponentProps> = ({
  title,
  layout,
  viewAll,
  items,
  cardGroupUrn,
  totalItems,
  viewZoneTitle,
  gamingCategoryLink,
  dispatchNavigateToCategoryUsingSeeAllButton,
  dispatchPushAction,
  dispatchFetchCards,
  dispatchLaunchCategory,
  dispatchLoadedContent,
  taggingService = gamesCardGroupTaggingService,
}) => {
  const dispatchEventsOnShow = React.useCallback(
    (urn: string) => {
      // Dispatch content loaded event ONCE per cardgroup (using taggingService for tracking)
      if (!taggingService.hasFired(cardGroupUrn)) {
        taggingService.markFired(cardGroupUrn);
        const itemUrns = items.map((item) => item.urn);
        dispatchLoadedContent(cardGroupUrn, title || "", itemUrns);
      }
      // Always dispatch fetch for lazy loading card data
      dispatchFetchCards(urn, items);
    },
    [cardGroupUrn, dispatchFetchCards, dispatchLoadedContent, items, taggingService, title],
  );

  const { observe, visibility } = useVisibilityObserver({
    onFirstShow: (urn) => dispatchEventsOnShow(urn),
  });
  const { isDesktopLayout } = useContext(ConfigContext);

  const seeAllButtonClickHandler = useCallback(() => {
    if (viewAll?.viewLink) {
      dispatchNavigateToCategoryUsingSeeAllButton(viewAll.viewLink, cardGroupUrn, viewAll.label, title);
      dispatchPushAction(viewAll.viewLink);
    }
  }, [cardGroupUrn, dispatchNavigateToCategoryUsingSeeAllButton, dispatchPushAction, title, viewAll]);

  const onCategoryClickHandler = useCallback<GamingCategoryLinkPropsViewModel["onClick"]>(
    (event: MouseEvent, viewLink: ViewLink, categoryName: string, gamingZoneTitle: string) => {
      event.preventDefault();
      dispatchPushAction(viewLink);
      dispatchLaunchCategory(viewLink, categoryName, `${viewZoneTitle} - ${gamingZoneTitle}`);
    },
    [dispatchPushAction, dispatchLaunchCategory, viewZoneTitle],
  );

  if (!items?.length) {
    return <></>;
  }

  const isSegmentedCardGroup = layout === CardGroupLayout.CARD_LIST;
  const isFourColumns = layout === CardGroupLayout.GRID_FOUR_COLUMNS;

  const wrapperStyle = classnames({
    [layout === CardGroupLayout.GRID_FOUR_COLUMNS ? styles.fourColumns : styles.twoColumns]: !isSegmentedCardGroup,
    [styles.rectangle]: totalItems % 2 === 1 && !isSegmentedCardGroup && !isFourColumns,
    [styles.gamesGrid]: !isSegmentedCardGroup,
    [styles.segmentedGamesWrapper]: isSegmentedCardGroup,
    [styles.recentlyPlayed]: isRecentlyPlayedGroup(cardGroupUrn),
  });

  const gameContainerStyle = !isSegmentedCardGroup ? styles.gameContainer : styles.segmentedGamesContainer;

  const displayViewAll = viewAll && !isSegmentedCardGroup;

  return (
    <CardGroup
      title={title}
      action={
        displayViewAll && (
          <ActionLink text={i18n({ key: "I18N.GAME_PAGE.GRID_LAYOUT.SEE_ALL" })} onClick={seeAllButtonClickHandler} />
        )
      }
      fullWidthContent={isSegmentedCardGroup}
    >
      <div className={wrapperStyle}>
        {items.map(({ urn }, index) => (
          <div
            className={gameContainerStyle}
            key={`${urn}-${index}`}
            ref={(node) => {
              observe(node, urn);
            }}
          >
            <GameTileContainer
              layout={
                totalItems % 2 === 1 && index === 0 && !isSegmentedCardGroup
                  ? GameTileContainerLayout.RECTANGLE
                  : GameTileContainerLayout.SQUARE
              }
            >
              <ConnectedGameCard
                urn={urn}
                isRoundGameTile={layout === CardGroupLayout.GRID_FOUR_COLUMNS}
                component={GameCard}
                placeholder={GameCardPlaceholder}
                visible={!!visibility[urn]}
              />
            </GameTileContainer>
          </div>
        ))}
        {gamingCategoryLink && title && !isDesktopLayout && (
          <GamingCategoryLink {...gamingCategoryLink} gamingZoneTitle={title} onClick={onCategoryClickHandler} />
        )}
      </div>
    </CardGroup>
  );
};

export default GamesCardGroup;
