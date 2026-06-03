import { FunctionComponent, memo, useCallback, useEffect, useRef } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { MarketTemplate } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { Card, Text } from "@ppb/the-wall-native";
import { CardTheme, CardHeaderSize } from "@ppb/the-wall-common/types/Card/Card.types";

import ConnectedFavouriteIcon from "../FavouriteIcon";
import FavouriteIcon from "../FavouriteIcon/FavouriteIcon.native";
import ConnectedSportsbookMarket from "../SportsbookMarket";
import SportsbookMarket from "../SportsbookMarket/SportsbookMarket.native";
import ShowMoreComponent from "../ShowMore/ShowMore.native";
import useShowMore from "../../hooks/useShowMore";
import type { OutrightMarket } from "./map-to-props-factory";
import { OUTRIGHT_MARKET_LIST_CARD, OUTRIGHT_MARKET_TITLE } from "./OutrightMarketListCard.native.selectors";
import { ComponentProps } from "./props";
import styles from "./OutrightMarketListCard.native.styles";

const MemoizedOutrightMarketListCard: FunctionComponent<ComponentProps> = memo(
  ({
    cardUrn,
    outrightMarkets,
    title,
    dispatchToggleShowMoreRunners,
    numberOfRowsToDisplay,
    visible,
    favouriteMarketsStateURN,
  }) => {
    const scrollViewRef = useRef<View>(null);

    const { itemsToDisplay, isItemsListCollapsed, isShowMoreAvailable, onShowMoreChange } = useShowMore<OutrightMarket>(
      {
        items: outrightMarkets,
        numberOfItemsToDisplay: numberOfRowsToDisplay,
      },
    );

    const onToggleShowMoreRunners = useCallback(
      (showMore: boolean) => dispatchToggleShowMoreRunners(cardUrn, showMore),
      [cardUrn, dispatchToggleShowMoreRunners],
    );

    const showMoreStyle = (): StyleProp<ViewStyle> => (isShowMoreAvailable ? styles.showMore : {});

    return (
      <View ref={scrollViewRef} {...getTestProps(OUTRIGHT_MARKET_LIST_CARD, false)} style={styles.container}>
        <Card
          key={cardUrn}
          startOpen
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
                contentSectionURN={cardUrn}
              />
            )
          }
        >
          {itemsToDisplay.map(({ marketUrn, runnersUrns, marketName }) => (
            <View key={marketUrn} style={styles.item}>
              <View>
                <Text {...getTestProps(OUTRIGHT_MARKET_TITLE, false)} style={styles.title}>
                  {marketName}
                </Text>
              </View>
              <ConnectedSportsbookMarket
                key={marketUrn}
                component={SportsbookMarket}
                urn={marketUrn}
                cardUrn={cardUrn}
                template={MarketTemplate.Inline}
                displayRunnersUrns={runnersUrns}
                visible={visible}
                isUppercase
              />
            </View>
          ))}
          <View style={showMoreStyle()}>
            <ShowMoreComponent
              cardRef={scrollViewRef}
              numberOfItemsToDisplay={numberOfRowsToDisplay}
              numberOfLines={outrightMarkets.length}
              showMore={isItemsListCollapsed}
              setShowMore={onShowMoreChange}
              onToggleShowMoreRunners={onToggleShowMoreRunners}
            />
          </View>
        </Card>
      </View>
    );
  },
);

MemoizedOutrightMarketListCard.displayName = "MemoizedOutrightMarketListCard";

const OutrightMarketListCard: FunctionComponent<ComponentProps> = (props) => {
  const { cardUrn, visible, dispatchRefreshCard } = props;

  useEffect(() => {
    dispatchRefreshCard(cardUrn, !!visible);
  }, [dispatchRefreshCard, cardUrn, visible]);

  return <MemoizedOutrightMarketListCard {...props} />;
};

export default OutrightMarketListCard;
