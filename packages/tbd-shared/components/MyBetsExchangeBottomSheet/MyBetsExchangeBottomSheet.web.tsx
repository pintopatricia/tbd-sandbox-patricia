import { BottomSheet, Divider } from "@ppb/the-wall-web";
import type { JSX } from "react";
import { FunctionComponent, useCallback, useEffect } from "react";

import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import classnames from "classnames";
import { ComponentProps } from "./props";
import ConnectedCard from "../Card";
import Card from "../Card/Card.web";
import { resetApolloCacheWithAppContext } from "../../apollo-client/client";
import styles from "./MyBetsExchangeBottomSheet.web.css";

const CONTENT_ITEMS_TYPENAMES = ["MarketExtendedCard", "RegulatoryCard"];

const renderHeaderContent = (headerItem: PartialItem | undefined): JSX.Element | null => {
  if (!headerItem) return null;

  const { urn, typename } = headerItem;
  const cardStyle = typename === "FixtureCard" ? styles.cardFixture : styles.cardHeader;

  return (
    <>
      <div className={cardStyle}>
        <ConnectedCard component={Card} urn={urn} typename={typename} />
      </div>
      <Divider />
    </>
  );
};

const renderItems = (items: PartialItem[] | undefined): JSX.Element[] | JSX.Element | null => {
  if (!items?.length) return null;

  return items.map(({ urn, typename }, index) => {
    const className = classnames({
      [styles.extendedCard]: typename === "MarketExtendedCard",
      [styles.regulatory]: typename === "RegulatoryCard",
    });

    return (
      <div key={`${typename}-${index}`} className={className}>
        <ConnectedCard component={Card} urn={urn} typename={typename} />
      </div>
    );
  });
};

const MyBetsExchangeBottomSheet: FunctionComponent<ComponentProps> = ({
  title,
  isFromEditBet,
  displayBottomSheet,
  items,
  headerItem,
  myBetsPageUrn,
  contentUrn,
  dispatchCloseBottomSheetAction,
  dispatchFetchCatalogueAction,
  dispatchFetchCardsAction,
  dispatchMyBetsPageRefreshAction,
}) => {
  useEffect(() => {
    if (displayBottomSheet && contentUrn) {
      dispatchFetchCatalogueAction(contentUrn);
    }
  }, [dispatchFetchCatalogueAction, displayBottomSheet, contentUrn]);

  useEffect(() => {
    if (items?.length && contentUrn) {
      dispatchFetchCardsAction(contentUrn, items);
    }
  }, [items, dispatchFetchCardsAction, contentUrn]);

  useEffect(
    () => () => {
      if (items?.length && contentUrn) {
        dispatchCloseBottomSheetAction(false, isFromEditBet);
      }
    },
    [dispatchCloseBottomSheetAction, items, contentUrn, isFromEditBet],
  );

  const handleOnClose = useCallback((): void => {
    dispatchCloseBottomSheetAction(true, isFromEditBet);
    if (myBetsPageUrn) {
      dispatchMyBetsPageRefreshAction(myBetsPageUrn);
      resetApolloCacheWithAppContext();
    }
  }, [dispatchCloseBottomSheetAction, dispatchMyBetsPageRefreshAction, isFromEditBet, myBetsPageUrn]);

  const headerContent = renderHeaderContent(headerItem);

  return displayBottomSheet && items ? (
    <BottomSheet
      onHeaderIconTap={handleOnClose}
      title={title}
      headerContent={headerContent}
      showContentFullWidth={true}
    >
      {renderItems(items?.filter(({ typename }) => CONTENT_ITEMS_TYPENAMES.includes(typename)))}
    </BottomSheet>
  ) : null;
};

export default MyBetsExchangeBottomSheet;
