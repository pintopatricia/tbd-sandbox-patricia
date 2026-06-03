import type { JSX } from "react";
import { FunctionComponent, useCallback, useEffect, useMemo } from "react";
import { BottomSheet, Divider } from "@ppb/the-wall-native";
import { StyleProp, View, ViewStyle } from "react-native";
import { ComponentProps } from "./props";

import ConnectedCard from "../Card";
import Card from "../Card/Card.native";
import styles from "./MyBetsExchangeBottomSheet.native.styles";
import { resetApolloCacheWithAppContext } from "../../apollo-client/client";

const CONTENT_ITEMS_TYPENAMES = ["MarketExtendedCard", "RegulatoryCard"];

const getStyle = (typename: string): StyleProp<ViewStyle> => [
  typename === "MarketExtendedCard" && styles.extendedCard,
  typename === "RegulatoryCard" && styles.regulatory,
];

const MyBetsExchangeBottomSheet: FunctionComponent<ComponentProps> = ({
  title,
  isFromEditBet,
  myBetsPageUrn,
  displayBottomSheet,
  dispatchCloseBottomSheetAction,
  headerItem,
  items,
  contentUrn,
  visible,
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
    if (items && contentUrn) {
      dispatchFetchCardsAction(contentUrn, items);
    }
  }, [items, dispatchFetchCardsAction, contentUrn]);

  const renderHeaderItem = useMemo((): JSX.Element | null => {
    if (!headerItem) return null;

    const { urn, typename } = headerItem;
    const cardStyle = typename === "FixtureCard" ? styles.cardFixture : styles.cardHeader;

    return (
      <>
        <View style={cardStyle}>
          <ConnectedCard component={Card} urn={urn} typename={typename} visible={visible} />
        </View>
        <Divider />
      </>
    );
  }, [headerItem, visible]);

  const renderedItems = useMemo(() => {
    const contentItems = items?.filter(({ typename }) => CONTENT_ITEMS_TYPENAMES.includes(typename));

    return contentItems?.length
      ? contentItems.map(({ urn, typename }) => (
          <View key={urn} style={getStyle(typename)}>
            <ConnectedCard component={Card} urn={urn} typename={typename} visible={visible} />
          </View>
        ))
      : null;
  }, [items, visible]);

  const handleOnClose = useCallback((): void => {
    dispatchCloseBottomSheetAction(true, isFromEditBet);
    if (myBetsPageUrn) {
      dispatchMyBetsPageRefreshAction(myBetsPageUrn);
      resetApolloCacheWithAppContext();
    }
  }, [dispatchCloseBottomSheetAction, dispatchMyBetsPageRefreshAction, isFromEditBet, myBetsPageUrn]);

  useEffect(
    () => () => {
      if (items?.length && contentUrn) {
        dispatchCloseBottomSheetAction(false, isFromEditBet);
      }
    },
    [dispatchCloseBottomSheetAction, items?.length, contentUrn, isFromEditBet],
  );

  return displayBottomSheet && items ? (
    <BottomSheet
      onHeaderIconTap={handleOnClose}
      title={title}
      headerContent={renderHeaderItem}
      showContentFullWidth={true}
    >
      <View style={styles.bottomSheetContent}>{renderedItems}</View>
    </BottomSheet>
  ) : null;
};

export default MyBetsExchangeBottomSheet;
