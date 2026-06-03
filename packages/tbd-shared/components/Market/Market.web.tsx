import { lazy, FunctionComponent, useCallback, useState, useMemo } from "react";

import { isSportsbookMarket } from "@ppb/tbd-store/helpers/markets";
import { Card, SecondaryButton } from "@ppb/the-wall-web";

import { MarketBlurb, MarketBlurbLink } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { SportsbookMarketBlurbClickParams } from "@ppb/the-wall-common/types";

import MarketBlurbsGA4Variants from "../../helpers/market-blurbs-ga4-variants";

import useShowMore from "../../hooks/useShowMore";
import ShowMoreComponent from "../ShowMore/ShowMore.web";

import { ComponentProps } from "./props";
import styles from "./Market.web.css";
import { iconsMap } from "@ppb/the-wall-icons/icons";

const ConnectedExchangeMarket = lazy(() => import(/* webpackChunkName: "ExchangeMarket" */ "../ExchangeMarket"));
const ExchangeMarket = lazy(
  () => import(/* webpackChunkName: "ExchangeMarket" */ "../ExchangeMarket/ExchangeMarket.web"),
);

const ConnectedSportsbookMarket = lazy(() => import(/* webpackChunkName: "SportsbookMarket" */ "../SportsbookMarket"));
const SportsbookMarket = lazy(
  () => import(/* webpackChunkName: "SportsbookMarket" */ "../SportsbookMarket/SportsbookMarket.web"),
);

const ConnectedMarketBlurb = lazy(() => import(/* webpackChunkName: "MarketBlurb" */ "../MarketBlurb"));
const MarketBlurb = lazy(() => import(/* webpackChunkName: "MarketBlurb" */ "../MarketBlurb/MarketBlurb.web"));

/**
 * Dual usage market component
 *
 * @param title Title for the market
 * @param marketURNs A list of market URNs to draw on the card
 * @param cardUrn The urn for the card
 * @returns The component html
 */
export const Market: FunctionComponent<ComponentProps> = ({
  cardUrn,
  title,
  marketViewLinks,
  eventViewLink,
  isCashoutQuoteAvailable,
  runnerUrns,
  marketUrn,
  runnerViewLinks,
  getCardType,
  navigateToMarketView,
  runnersAmount,
  pushAction,
  dispatchToggleShowMoreRunners,
  inline,
  isRunnerExpandable,
  template,
  sporteventURN,
  numberOfItemsToDisplay,
  marketPromo,
  marketBlurb,
  infoBlurbs,
  show90MinBlurb,
  dispatchTogglePromoDescription,
  dispatchNavigateToView,
  dispatchPushExternalBlankAction,
  dispatchMarketBlurbLinkClick,
  dispatchClickCardAction,
  tabLink,
}) => {
  const [cardRef, setCardRef] = useState<HTMLDivElement | null>(null); 

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

  const onTabButtonClick = useCallback(() => {
    if (tabLink) {
      dispatchClickCardAction(cardUrn, sporteventURN || "", tabLink.tabViewLink?.viewUrl, tabLink?.label);
      pushAction(tabLink.tabViewLink);
    }
  }, [tabLink, dispatchClickCardAction, cardUrn, sporteventURN, pushAction]);

  const onMarketTitleClick = useCallback((): void => {
    const viewLink = getCurrentViewLink();

    if (!viewLink) {
      return;
    }

    if (!eventViewLink) {
      const cardType = getCardType(isCashoutQuoteAvailable);
      // This should happen before the pushAction
      navigateToMarketView(cardType, viewLink.viewUrl, cardUrn, title);
    }

    // navigate to market or event view
    dispatchNavigateToView(viewLink.viewUrl, cardUrn, title);
    pushAction(viewLink);
  }, [
    getCurrentViewLink,
    eventViewLink,
    pushAction,
    getCardType,
    isCashoutQuoteAvailable,
    navigateToMarketView,
    cardUrn,
    title,
    dispatchNavigateToView,
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
        dispatchPushExternalBlankAction(link.url);
      }
    },
    [dispatchMarketBlurbLinkClick, dispatchPushExternalBlankAction],
  );

  const icon = useMemo(
    () => (tabLink?.icon ? iconsMap[tabLink.icon.category]?.[tabLink.icon.id] : undefined),
    [tabLink],
  );
  const displayShowMore = useMemo(
    () => !!(numberOfItemsToDisplay && numberOfItemsToDisplay < runnersAmount),
    [numberOfItemsToDisplay, runnersAmount],
  );

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
    />
  );

  return (
    <div ref={setCardRef} className={styles.marketContainer}>
      <Card title={title} onTitleClick={onMarketTitleClick}>
        {marketBlurb && (
          <ConnectedMarketBlurb component={MarketBlurb} variant={MarketBlurbsGA4Variants.SUPER_SUB} {...marketBlurb} />
        )}
        {isSportsbookMarket(marketUrn) ? sportsbook : exchange}
        {displayShowMore && (
          <ShowMoreComponent
            numberOfItemsToDisplay={numberOfItemsToDisplay}
            numberOfLines={runnersAmount}
            cardRef={cardRef}
            setShowMore={onShowMoreChange}
            showMore={isItemsListCollapsed}
            onToggleShowMoreRunners={onToggleShowMoreRunners}
          />
        )}
        {tabLink && <SecondaryButton label={tabLink.label} onTap={onTabButtonClick} icon={icon} />}
      </Card>
    </div>
  );
};
