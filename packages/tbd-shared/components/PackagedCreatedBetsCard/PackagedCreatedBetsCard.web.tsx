import { FunctionComponent, useCallback, useMemo, useRef, useState } from "react";

import { Card, ShowMore } from "@ppb/the-wall-web";
import { CardTheme, CardHeaderSize } from "@ppb/the-wall-common/types/Card/Card.types";

import { i18n } from "../../helpers/i18n";
import ConnectedBettingOpportunity from "../BettingOpportunity";
import BettingOpportunity from "../BettingOpportunity/BettingOpportunity.web";
import ConnectedFavouriteIcon from "../FavouriteIcon";
import FavouriteIcon from "../FavouriteIcon/FavouriteIcon.web";
import { useRefreshComponent } from "../../hooks/useRefreshComponent.web";
import { NoContentAvailableCard } from "../NoContentAvailableCard/NoContentAvailableCard.web";

import { emitCollapseToggleEvent, emitShowMoreClickEvent, emitShowLessClickEvent } from "./event-emitters";
import { OPPORTUNITIES_INITIAL_PAGE_SIZE } from "./map-to-props-factory";
import styles from "./PackagedCreatedBets.web.css";
import { ComponentProps } from "./props";

const PackagedCreatedBetsCard: FunctionComponent<ComponentProps> = ({
  title,
  layoutType,
  favouriteMarketsStateURN,
  items,
  cardUrn,
  cursor,
  hasNextPage,
  hasMoreItems,
  pageType,
  tabName,
  refreshEnabled,
  dispatchFetchCards,
  dispatchRefreshCards,
}) => {
  // Since the first iteration is pagination based
  // this is set as open so we can see all the items
  const [isOpen, setOpen] = useState(true);

  const tableRef = useRef<HTMLDivElement>(null);

  const onShowMore = useCallback(() => {
    const isToShowMore = !hasNextPage && isOpen;
    if (isToShowMore) {
      const cardContainer = tableRef.current?.parentElement?.parentElement;
      if (cardContainer) {
        const element = document.getElementById("scrollable-desktop-container") || window;
        const offset = document.getElementById("scrollable-desktop-container") ? 275 : 335;

        element.scrollTo({
          top: cardContainer.offsetTop - offset,
          behavior: "smooth",
        });
      }
    }

    if (hasNextPage) {
      dispatchFetchCards(cardUrn, cursor);
      emitShowMoreClickEvent(pageType, title, tabName);
    } else {
      const emitEvent = isOpen ? emitShowLessClickEvent : emitShowMoreClickEvent;
      emitEvent(pageType, title, tabName);
      setOpen((open) => !open);
    }
  }, [cardUrn, cursor, dispatchFetchCards, hasNextPage, isOpen, pageType, title, tabName]);

  const onCollapseToggle = useCallback(
    (isExpanded: boolean) => {
      emitCollapseToggleEvent(isExpanded, pageType, title, tabName);
    },
    [pageType, title, tabName],
  );

  const filteredItems = useMemo(
    () => (isOpen ? items : items.slice(0, OPPORTUNITIES_INITIAL_PAGE_SIZE)),
    [isOpen, items],
  );

  const refreshAction = useCallback(() => {
    dispatchRefreshCards(cardUrn, filteredItems.length);
  }, [cardUrn, dispatchRefreshCards, filteredItems.length]);

  useRefreshComponent({
    urn: cardUrn,
    refreshEnabled,
    refreshAction,
    chefComponentName: "PackagedCreatedBetsCard",
  });

  const isShowMoreOpen = !hasNextPage && isOpen;
  const opportunities =
    filteredItems.length === 0 ? (
      <NoContentAvailableCard />
    ) : (
      <div className={styles.packagedCreatedBetsContainer} ref={tableRef}>
        <div className={styles.opportunitiesList}>
          {filteredItems?.map((opportunityUrn) => (
            <ConnectedBettingOpportunity
              cardUrn={cardUrn}
              opportunityUrn={opportunityUrn}
              component={BettingOpportunity}
              key={opportunityUrn}
            />
          ))}
        </div>
        {hasMoreItems && (
          <ShowMore
            text={isShowMoreOpen ? i18n({ key: "I18N.SHOW_LESS" }) : i18n({ key: "I18N.SHOW_MORE" })}
            opened={isShowMoreOpen}
            onClick={onShowMore}
          />
        )}
      </div>
    );

  return layoutType === "OUT_OF_CARD" ? (
    <Card
      title={title}
      startOpen
      onTitleClick={onCollapseToggle}
      theme={CardTheme.SECONDARY}
      size={CardHeaderSize.LARGE}
      isCollapsible
      fullWidthContent
      endElement={
        favouriteMarketsStateURN && (
          <ConnectedFavouriteIcon
            component={FavouriteIcon}
            urn={favouriteMarketsStateURN}
            contentSectionURN={cardUrn}
          />
        )
      }
    >
      {opportunities}
    </Card>
  ) : (
    opportunities
  );
};

export default PackagedCreatedBetsCard;
