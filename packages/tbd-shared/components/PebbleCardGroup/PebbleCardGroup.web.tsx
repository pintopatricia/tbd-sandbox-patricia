import { FunctionComponent, useCallback, useState } from "react";

import URN from "@ppb/tbd-store/state/layout/URN";
import { ActionLink, Card } from "@ppb/the-wall-web";
import { CardHeaderSize, CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";

import useCardGroupItems from "../../hooks/useCardGroupItems";
import ConnectedCard from "../Card";
import TBDCard, { isCardImplemented } from "../Card/Card.web";
import ConnectedFavouriteIcon from "../FavouriteIcon";
import FavouriteIcon from "../FavouriteIcon/FavouriteIcon.web";
import ConnectedOpenBets from "../OpenBets";
import { OpenBets } from "../OpenBets/OpenBets.web";

import { emitCollapseToggleEvent } from "./event-emitters";
import { PebbleMarketTemplate } from "./snowflakes/PebbleMarketTemplate/PebbleMarketTemplate.web";
import styles from "./PebbleCardGroup.web.css";
import { ComponentProps } from "./props";
import { HydratedCardProps, ShellCardProps } from "./map-to-props-factory";

type PebbleCardGroupShellProps = ShellCardProps;
type HydratedPebbleCardGroupProps = ComponentProps & HydratedCardProps;

const PebbleCardGroupShell: FunctionComponent<PebbleCardGroupShellProps> = ({
  title,
  favouriteMarketsStateURN,
  cardGroupURN,
}) => (
  <div className={styles.shell}>
    <Card
      title={title}
      theme={CardTheme.SECONDARY}
      size={CardHeaderSize.LARGE}
      isCollapsible
      fullWidthContent
      endElement={
        favouriteMarketsStateURN && (
          <ConnectedFavouriteIcon
            component={FavouriteIcon}
            urn={favouriteMarketsStateURN}
            contentSectionURN={cardGroupURN}
          />
        )
      }
    >
      <></>
    </Card>
  </div>
);

const HydratedPebbleCardGroup: FunctionComponent<HydratedPebbleCardGroupProps> = ({
  visible,
  title,
  icon,
  outerTitle,
  viewLink,
  viewAllLabel,
  pebbleExpanded,
  favouriteMarketsStateURN,
  items: partials,
  pebbleList,
  selectedCardURN,
  selectedCardTypename,
  cardGroupURN,
  pageType,
  gaTitle,
  tabName,
  dispatchPebbleItemSelection,
  dispatchFetchCardsAction,
  dispatchPushAction,
}) => {
  const items = useCardGroupItems(partials, isCardImplemented);
  const [marketCardURN, setMarketCardURN] = useState(selectedCardURN || "");
  const [marketCardTypename, setMarketCardTypename] = useState(selectedCardTypename || "");

  const onPebbleClick = useCallback(
    (pebbleURN: URN) => {
      const cardTypename = items.find((item) => item.id === pebbleURN)?.typename;
      if (cardTypename) {
        setMarketCardTypename(cardTypename);
        setMarketCardURN(pebbleURN);
        dispatchPebbleItemSelection(pebbleURN, cardTypename, cardGroupURN);
        dispatchFetchCardsAction(pebbleURN);
      }
    },
    [cardGroupURN, dispatchFetchCardsAction, dispatchPebbleItemSelection, items],
  );

  const onViewAllClick = useCallback(() => viewLink && dispatchPushAction(viewLink), [viewLink, dispatchPushAction]);

  const onCollapseToggle = useCallback(
    (isExpanded: boolean) => {
      emitCollapseToggleEvent(isExpanded, pageType, gaTitle, tabName);
    },
    [pageType, gaTitle, tabName],
  );

  // Empty pebble card group
  if (!items.length) {
    return <></>;
  }

  const pebbleCardGroupItems = (
    <PebbleMarketTemplate onPebbleClick={onPebbleClick} items={pebbleList} defaultSelectedPebble={marketCardURN}>
      {marketCardURN && (
        <ConnectedCard urn={marketCardURN} component={TBDCard} typename={marketCardTypename} visible={visible} />
      )}
    </PebbleMarketTemplate>
  );

  return (
    <div className={styles.container}>
      {!!outerTitle && !!viewAllLabel && (
        <section className={styles.header}>
          <h4 className={`typography-h380 ${styles.outerTitle}`}>{outerTitle}</h4>
          <ActionLink onClick={onViewAllClick} text={viewAllLabel} noPadding />
        </section>
      )}
      {title && (
        <Card
          startOpen={pebbleExpanded}
          icon={icon}
          title={title}
          theme={CardTheme.SECONDARY}
          size={CardHeaderSize.LARGE}
          fullWidthContent
          isCollapsible
          endElement={
            <div className={styles.collapseEndElements}>
              <ConnectedOpenBets component={OpenBets} cardURN={cardGroupURN} />
              {favouriteMarketsStateURN && (
                <ConnectedFavouriteIcon
                  component={FavouriteIcon}
                  urn={favouriteMarketsStateURN}
                  contentSectionURN={cardGroupURN}
                />
              )}
            </div>
          }
          onTitleClick={onCollapseToggle}
        >
          {pebbleCardGroupItems}
        </Card>
      )}
    </div>
  );
};

const PebbleCardGroup: FunctionComponent<ComponentProps> = (props) => {
  if (props.isShell) {
    return <PebbleCardGroupShell {...props} />;
  }

  return <HydratedPebbleCardGroup {...props} />;
};

export default PebbleCardGroup;
