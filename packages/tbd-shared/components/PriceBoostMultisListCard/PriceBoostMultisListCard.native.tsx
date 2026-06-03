import { FunctionComponent, useCallback, useMemo, useRef, useState } from "react";
import { ShowMore, MarketPromo, Card } from "@ppb/the-wall-native";
import { CardHeaderSize, CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";
import { LayoutChangeEvent, View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { GenericIcon, IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { ValueIconName } from "@ppb/the-wall-icons";
import { ComponentProps } from "./props";
import { i18n } from "../../helpers/i18n";
import ConnectedBettingOpportunity from "../BettingOpportunity";
import { NoContentAvailableCard } from "../NoContentAvailableCard/NoContentAvailableCard.native";
import BettingOpportunity from "../BettingOpportunity/BettingOpportunity.native";
import styles from "./PriceBoostMultisListCard.native.styles";
import { OPPORTUNITIES_PAGE_SIZE } from "./map-to-props-factory";
import { TEST_ID } from "./PriceBoostMultisListCard.native.selectors";
import { emitShowMoreShowLessClickEvent, emitCollapseToggleEvent } from "./event-emitters";
import { useScrollIntoView } from "../../hooks/useScrollIntoView.native";

const PriceBoostMultisListCard: FunctionComponent<ComponentProps> = ({
  title,
  blurb,
  items,
  cardUrn,
  cursor,
  hasNextPage,
  hasMoreItems,
  showWasPrice,
  visible,
  pageType,
  tabName,
  dispatchFetchCards,
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
      emitShowMoreShowLessClickEvent(true, pageType, title, tabName);
    } else {
      emitShowMoreShowLessClickEvent(!isOpen, pageType, title, tabName);
      setOpen((open) => !open);
    }
  }, [cardUrn, cursor, dispatchFetchCards, hasNextPage, pageType, title, tabName, isOpen, onLayout]);

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
      <View ref={scrollViewRef} style={styles.packagedCreatedBetsContainer}>
        {blurb && (
          <MarketPromo
            isExpanded={blurb.isExpanded}
            variant="info"
            title={blurb.title}
            description={blurb.description}
            signposting={IconsList.NOTIFICATION_WARNING}
          />
        )}
        <View style={styles.opportunitiesList}>
          {filteredItems?.map((opportunityUrn) => (
            <ConnectedBettingOpportunity
              cardUrn={cardUrn}
              opportunityUrn={opportunityUrn}
              showWasPrice={showWasPrice}
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

  return (
    <View {...getTestProps(TEST_ID, false)} style={styles.card}>
      <Card
        startElement={
          <View style={styles.collapseHeaderIconContainer}>
            <View style={styles.collapseHeaderIcon}>
              <GenericIcon name={ValueIconName.PRICE_BOOST} color={tokens.PopularBetBuilderCardHeaderBoostIconColour} />
            </View>
          </View>
        }
        title={title || ""}
        startOpen
        onTitleClick={onCollapseToggle}
        theme={CardTheme.SECONDARY}
        size={CardHeaderSize.LARGE}
        isCollapsible
        fullWidthContent
      >
        {opportunities}
      </Card>
    </View>
  );
};

export default PriceBoostMultisListCard;
