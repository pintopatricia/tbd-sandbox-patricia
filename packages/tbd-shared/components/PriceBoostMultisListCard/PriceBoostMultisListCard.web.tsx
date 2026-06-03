import { FunctionComponent, useCallback, useMemo, useRef, useState } from "react";
import { Card, MarketPromo, ShowMore } from "@ppb/the-wall-web";
import { CardTheme, CardHeaderSize } from "@ppb/the-wall-common/types/Card/Card.types";
import { GenericIcon, IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { ValueIconName } from "@ppb/the-wall-icons";
import { ComponentProps } from "./props";
import { i18n } from "../../helpers/i18n";
import ConnectedBettingOpportunity from "../BettingOpportunity";
import BettingOpportunity from "../BettingOpportunity/BettingOpportunity.web";
import styles from "./PriceBoostMultisListCard.web.css";
import { OPPORTUNITIES_PAGE_SIZE } from "./map-to-props-factory";
import { NoContentAvailableCard } from "../NoContentAvailableCard/NoContentAvailableCard.web";
import { emitCollapseToggleEvent, emitShowMoreShowLessClickEvent } from "./event-emitters";

const PriceBoostMultisListCard: FunctionComponent<ComponentProps> = ({
  title,
  blurb,
  items,
  showWasPrice,
  cardUrn,
  cursor,
  hasNextPage,
  hasMoreItems,
  pageType,
  tabName,
  dispatchFetchCards,
}) => {
  // Since the first iteration is pagination based
  // this is set as open so we can see all the items
  const [isOpen, setOpen] = useState(true);
  const tableRef = useRef<HTMLDivElement>(null);

  const onShowMore = useCallback(() => {
    const isToShowMore = !hasNextPage && isOpen;
    if (isToShowMore) {
      if (tableRef.current) {
        const { top } = tableRef.current.getBoundingClientRect();
        const element = document.getElementById("scrollable-desktop-container") || window;

        element.scrollTo({ top, behavior: "smooth" });
      }
    }

    if (hasNextPage) {
      dispatchFetchCards(cardUrn, cursor);
      emitShowMoreShowLessClickEvent(true, pageType, title, tabName);
    } else {
      emitShowMoreShowLessClickEvent(!isOpen, pageType, title, tabName);
      setOpen((open) => !open);
    }
  }, [cardUrn, cursor, dispatchFetchCards, hasNextPage, isOpen, pageType, tabName, title]);

  const filteredItems = useMemo(() => (isOpen ? items : items.slice(0, OPPORTUNITIES_PAGE_SIZE)), [isOpen, items]);

  const onCollapseToggle = useCallback(
    (isExpanded: boolean) => {
      emitCollapseToggleEvent(isExpanded, pageType, title, tabName);
    },
    [pageType, title, tabName],
  );
  const isShowMoreOpen = !hasNextPage && isOpen;
  const opportunities =
    filteredItems.length === 0 ? (
      <NoContentAvailableCard />
    ) : (
      <div className={styles.packagedCreatedBetsContainer} ref={tableRef}>
        {blurb && (
          <MarketPromo
            isExpanded={blurb.isExpanded}
            variant="info"
            title={blurb.title}
            description={blurb.description}
            signposting={IconsList.NOTIFICATION_WARNING}
          />
        )}
        <div className={styles.opportunitiesList}>
          {filteredItems?.map((opportunityUrn) => (
            <ConnectedBettingOpportunity
              cardUrn={cardUrn}
              opportunityUrn={opportunityUrn}
              showWasPrice={showWasPrice}
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

  return (
    <Card
      startElement={
        <div className={styles.collapseHeaderIconContainer}>
          <GenericIcon
            name={ValueIconName.PRICE_BOOST}
            color="var(--popular-bet-builder-card-header-boost-icon-colour)"
          />
        </div>
      }
      title={title}
      startOpen
      onTitleClick={onCollapseToggle}
      theme={CardTheme.SECONDARY}
      size={CardHeaderSize.LARGE}
      isCollapsible
      fullWidthContent
    >
      {opportunities}
    </Card>
  );
};

export default PriceBoostMultisListCard;
