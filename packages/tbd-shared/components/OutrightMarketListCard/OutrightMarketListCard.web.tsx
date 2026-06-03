import { FC, useCallback, useEffect, useState } from "react";
import { Card, useOnIntersect } from "@ppb/the-wall-web";
import { CardHeaderSize, CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";
import { MarketTemplate } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import ShowMoreComponent from "../ShowMore/ShowMore.web";
import useShowMore from "../../hooks/useShowMore";
import { ComponentProps } from "./props";
import ConnectedFavouriteIcon from "../FavouriteIcon";
import FavouriteIcon from "../FavouriteIcon/FavouriteIcon.web";
import ConnectedSportsbookMarket from "../SportsbookMarket";
import SportsbookMarket from "../SportsbookMarket/SportsbookMarket.web";
import type { OutrightMarket } from "./map-to-props-factory";
import styles from "./OutrightMarketListCard.web.css";

const OutrightMarketListCard: FC<ComponentProps> = ({
  cardUrn,
  title,
  outrightMarkets,
  numberOfRowsToDisplay,
  favouriteMarketsStateURN,
  dispatchRefreshCard,
  dispatchToggleShowMoreRunners,
}) => {
  const [cardRef, setCardRef] = useState<HTMLDivElement | null>(null);
  const { isIntersecting } = useOnIntersect<HTMLDivElement>(null);

  const { itemsToDisplay, isItemsListCollapsed, onShowMoreChange } = useShowMore<OutrightMarket>({
    items: outrightMarkets,
    numberOfItemsToDisplay: numberOfRowsToDisplay,
  });

  const onToggleShowMoreRunners = useCallback(
    (showMore: boolean) => dispatchToggleShowMoreRunners(cardUrn, showMore),
    [cardUrn, dispatchToggleShowMoreRunners],
  );

  useEffect(() => {
    dispatchRefreshCard(cardUrn, isIntersecting);
  }, [dispatchRefreshCard, cardUrn, isIntersecting]);

  return (
    <div className={styles.container} ref={setCardRef}>
      {title && (
        <Card
          title={title}
          startOpen
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
          {itemsToDisplay.map(({ marketUrn, runnersUrns, marketName }) => (
            <div className={styles.item} key={marketUrn}>
              <span className={`typography-h092 ${styles.marketName}`}>{marketName}</span>
              <ConnectedSportsbookMarket
                component={SportsbookMarket}
                urn={marketUrn}
                cardUrn={cardUrn}
                template={MarketTemplate.Inline}
                displayRunnersUrns={runnersUrns}
                isUppercase
              />
            </div>
          ))}
          <div className={styles.showMoreContainer}>
            <ShowMoreComponent
              cardRef={cardRef}
              numberOfItemsToDisplay={numberOfRowsToDisplay}
              numberOfLines={outrightMarkets.length}
              setShowMore={onShowMoreChange}
              showMore={isItemsListCollapsed}
              onToggleShowMoreRunners={onToggleShowMoreRunners}
            />
          </div>
        </Card>
      )}
    </div>
  );
};

export default OutrightMarketListCard;
