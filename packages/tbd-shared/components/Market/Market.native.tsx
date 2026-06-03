import { FunctionComponent, useCallback, useMemo, useRef } from "react";
import { View } from "react-native";

import { navigate } from "@ppb/tbd-router/native";
import { isSportsbookMarket } from "@ppb/tbd-store/helpers/markets";
import { Card, SecondaryButton } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import { SportsbookMarketBlurbClickParams } from "@ppb/the-wall-common/types";
import { MarketBlurbLink } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { EntityType } from "@ppb/tbd-urn-codecs/dist/types";

import MarketBlurbsGA4Variants from "../../helpers/market-blurbs-ga4-variants";

import useShowMore from "../../hooks/useShowMore";
import ConnectedExchangeMarket from "../ExchangeMarket";

import ExchangeMarket from "../ExchangeMarket/ExchangeMarket.native";
import ConnectedMarketBlurb from "../MarketBlurb";
import MarketBlurb from "../MarketBlurb/MarketBlurb.native";
import ShowMoreComponent from "../ShowMore/ShowMore.native";
import ConnectedSportsbookMarket from "../SportsbookMarket";
import SportsbookMarket from "../SportsbookMarket/SportsbookMarket.native";

import { MARKET } from "./Market.native.selectors";
import styles from "./Market.native.styles";
import { ComponentProps } from "./props";
import { getEndpoint } from "../../config/endpoints";
import { iconsMap } from "@ppb/the-wall-icons/icons";

export const Market: FunctionComponent<ComponentProps> = ({
  cardUrn,
  runnerUrns,
  runnersAmount,
  marketUrn,
  title,
  eventViewLink,
  marketViewLinks,
  isCashoutQuoteAvailable,
  runnerViewLinks,
  getCardType,
  navigateToMarketView,
  dispatchToggleShowMoreRunners,
  inline,
  isRunnerExpandable,
  template,
  numberOfItemsToDisplay,
  marketPromo,
  marketBlurb,
  infoBlurbs,
  show90MinBlurb,
  visible,
  dispatchTogglePromoDescription,
  dispatchNavigateToView,
  dispatchMarketBlurbLinkClick,
  sporteventURN,
  dispatchClickCardAction,
  tabLink,
}) => {
  const scrollViewRef = useRef<View>(null);

  const { itemsToDisplay, isShowMoreAvailable, isItemsListCollapsed, onShowMoreChange } = useShowMore<string>({
    items: runnerUrns,
    numberOfItemsToDisplay,
  });

  const getCurrentViewLink = useCallback(() => {
    if (eventViewLink) {
      return eventViewLink;
    }

    const [marketViewLink] = marketViewLinks || [];

    return marketViewLink;
  }, [eventViewLink, marketViewLinks]);

  const onMarketTitleClick = useCallback((): void => {
    const viewLink = getCurrentViewLink();
    if (!viewLink) {
      return;
    }

    if (!eventViewLink) {
      const cardType = getCardType(isCashoutQuoteAvailable);
      navigateToMarketView(cardType, viewLink.viewUrl, cardUrn, title);
    }

    dispatchNavigateToView(viewLink.viewUrl, cardUrn, title);
    navigate(viewLink);
  }, [
    getCurrentViewLink,
    eventViewLink,
    dispatchNavigateToView,
    cardUrn,
    title,
    getCardType,
    isCashoutQuoteAvailable,
    navigateToMarketView,
  ]);

  const onMarketPromoClick = useCallback(
    ({ title: marketPromoTitle, isOpen, variant }: SportsbookMarketBlurbClickParams) => {
      dispatchTogglePromoDescription(marketPromoTitle, isOpen, variant);
    },
    [dispatchTogglePromoDescription],
  );

  const onLinkClick = useCallback(
    (link?: MarketBlurbLink) => {
      if (link) {
        dispatchMarketBlurbLinkClick(link);

        navigate({
          viewUrn: EntityType.ExternalView,
          viewUrl: link.url,
          fallbackViewUrl: getEndpoint("EXCHANGE_SITE"),
        });
      }
    },
    [dispatchMarketBlurbLinkClick],
  );
  const icon = useMemo(
    () => (tabLink?.icon ? iconsMap[tabLink.icon.category]?.[tabLink.icon.id] : undefined),
    [tabLink],
  );
  const displayShowMore = useMemo(
    () => !!(numberOfItemsToDisplay && numberOfItemsToDisplay < runnersAmount),
    [numberOfItemsToDisplay, runnersAmount],
  );

  const onTabButtonTap = useCallback(() => {
    if (tabLink) {
      dispatchClickCardAction(cardUrn, sporteventURN || "", tabLink.tabViewLink?.viewUrl, tabLink?.label);
      navigate(tabLink.tabViewLink);
    }
  }, [tabLink, dispatchClickCardAction, cardUrn, sporteventURN]);

  const onToggleShowMoreRunners = useCallback(
    (showMore: boolean) => dispatchToggleShowMoreRunners(cardUrn, showMore, marketBlurb?.gaModuleSuffix),
    [cardUrn, dispatchToggleShowMoreRunners, marketBlurb?.gaModuleSuffix],
  );

  if (!marketUrn) {
    return null;
  }

  const sportsbook = (
    <ConnectedSportsbookMarket
      component={SportsbookMarket}
      urn={marketUrn}
      cardUrn={cardUrn}
      runnerViewLinks={runnerViewLinks}
      displayRunnersUrns={itemsToDisplay}
      inline={inline}
      isRunnerExpandable={isRunnerExpandable}
      eventViewLink={eventViewLink}
      template={template}
      isShowMoreAvailable={isShowMoreAvailable}
      isItemsListCollapsed={isItemsListCollapsed}
      numberOfItemsToDisplay={numberOfItemsToDisplay}
      marketPromo={marketPromo}
      infoBlurbs={infoBlurbs}
      onMarketPromoClick={onMarketPromoClick}
      onLinkClick={onLinkClick}
      show90MinBlurb={show90MinBlurb}
      visible={visible}
    />
  );
  const exchange = (
    <ConnectedExchangeMarket
      component={ExchangeMarket}
      urn={marketUrn}
      cardUrn={cardUrn}
      isCashoutQuoteAvailable={isCashoutQuoteAvailable}
      runnerViewLinks={runnerViewLinks}
      displayRunnersUrns={itemsToDisplay}
      inline={inline}
      isRunnerExpandable={isRunnerExpandable}
      eventViewLink={eventViewLink}
      marketPromo={marketPromo}
      onMarketPromoClick={onMarketPromoClick}
      onLinkClick={onLinkClick}
      visible={visible}
    />
  );

  return (
    <View ref={scrollViewRef} {...getTestProps(MARKET, false)} style={styles.marketContainer}>
      <Card title={title} onTitleClick={onMarketTitleClick}>
        {marketBlurb && (
          <ConnectedMarketBlurb component={MarketBlurb} variant={MarketBlurbsGA4Variants.SUPER_SUB} {...marketBlurb} />
        )}
        {isSportsbookMarket(marketUrn) ? sportsbook : exchange}
        {displayShowMore && (
          <ShowMoreComponent
            cardRef={scrollViewRef}
            numberOfItemsToDisplay={numberOfItemsToDisplay}
            numberOfLines={runnersAmount}
            showMore={isItemsListCollapsed}
            setShowMore={onShowMoreChange}
            onToggleShowMoreRunners={onToggleShowMoreRunners}
          />
        )}
        {tabLink && <SecondaryButton label={tabLink.label} onTap={onTabButtonTap} icon={icon} stopAnimation={true} />}
      </Card>
    </View>
  );
};
