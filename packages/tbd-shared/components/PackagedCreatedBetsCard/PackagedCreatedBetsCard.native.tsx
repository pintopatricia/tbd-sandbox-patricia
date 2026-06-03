import { FunctionComponent, useCallback, useMemo, useRef, useState } from "react";
import { LayoutChangeEvent, View } from "react-native";

import { Card, ShowMore } from "@ppb/the-wall-native";
import { CardTheme, CardHeaderSize } from "@ppb/the-wall-common/types/Card/Card.types";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import { i18n } from "../../helpers/i18n";
import { useScrollIntoView } from "../../hooks/useScrollIntoView.native";
import { useRefreshComponent } from "../../hooks/useRefreshComponent.native";
import ConnectedBettingOpportunity from "../BettingOpportunity";
import BettingOpportunity from "../BettingOpportunity/BettingOpportunity.native";
import ConnectedFavouriteIcon from "../FavouriteIcon";
import FavouriteIcon from "../FavouriteIcon/FavouriteIcon.native";
import { NoContentAvailableCard } from "../NoContentAvailableCard/NoContentAvailableCard.native";

import { emitCollapseToggleEvent, emitShowMoreClickEvent, emitShowLessClickEvent } from "./event-emitters";
import { OPPORTUNITIES_INITIAL_PAGE_SIZE } from "./map-to-props-factory";
import { TEST_ID } from "./PackagedCreatedBetsCard.native.selectors";
import styles from "./PackagedCreatedBets.native.styles";
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
  visible,
  refreshEnabled,
  dispatchFetchCards,
  dispatchRefreshCards,
}) => {
  // Since the first iteration is pagination based
  // this is set as open so we can see all the items
  const scrollViewRef = useRef<View>(null);

  const onLayout = useScrollIntoView(scrollViewRef);

  const [isOpen, setOpen] = useState(true);
  const onShowMore = useCallback(() => {
    const next = !hasNextPage && isOpen;
    if (next) {
      onLayout({ nativeEvent: {}, persist: () => {} } as LayoutChangeEvent, false);
    }

    if (hasNextPage) {
      dispatchFetchCards(cardUrn, cursor);
      emitShowMoreClickEvent(pageType, title, tabName);
    } else {
      const emitEvent = isOpen ? emitShowLessClickEvent : emitShowMoreClickEvent;
      emitEvent(pageType, title, tabName);
      setOpen((open) => !open);
    }
  }, [cardUrn, cursor, dispatchFetchCards, onLayout, hasNextPage, isOpen, pageType, title, tabName]);

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
      <View ref={scrollViewRef} style={styles.packagedCreatedBetsContainer}>
        <View style={styles.opportunitiesList}>
          {filteredItems?.map((opportunityUrn) => (
            <ConnectedBettingOpportunity
              cardUrn={cardUrn}
              opportunityUrn={opportunityUrn}
              component={BettingOpportunity}
              key={opportunityUrn}
              visible={visible}
            />
          ))}
        </View>
        {hasMoreItems && (
          <ShowMore
            text={isShowMoreOpen ? i18n({ key: "I18N.SHOW_LESS" }) : i18n({ key: "I18N.SHOW_MORE" })}
            opened={isShowMoreOpen}
            onClick={onShowMore}
          />
        )}
      </View>
    );

  return layoutType === "OUT_OF_CARD" ? (
    <View {...getTestProps(TEST_ID, false)} style={styles.card}>
      <Card
        title={title || ""}
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
    </View>
  ) : (
    opportunities
  );
};

export default PackagedCreatedBetsCard;
