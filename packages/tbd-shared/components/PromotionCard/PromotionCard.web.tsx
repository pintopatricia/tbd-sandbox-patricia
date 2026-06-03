import { FunctionComponent, useCallback, useEffect, useId } from "react";
import { useOnIntersect } from "@ppb/the-wall-web";
import { OnIntersectCallback } from "@ppb/the-wall-common/types/web";
import { PromotionNavigationAction } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { PromotionContentType } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { ComponentProps } from "./props";
import { getBackgroundImage, getImsPromoUrlWithReturnUrl } from "./promotion-card-helper";
import { getImagePath } from "../../view-model-factories/game.web";

import ConnectedSportsbookBetButton from "../SportsbookBetButton";
import SportsbookBetButton from "../SportsbookBetButton/SportsbookBetButton.web";
import { getPromoUrlWithReturnURL } from "../../helpers/promotion-helper";
import { CasinoPromotionCard } from "./snowflakes/CasinoPromotionCard/CasinoPromotionCard.web";
import { PromotionCard as PromoCard } from "./snowflakes/PromotionCard/PromotionCard.web";

const PromotionCard: FunctionComponent<ComponentProps> = ({
  cardUrn,
  action,
  backgroundImage,
  termsAndConditionsLabel,
  name,
  promotionContentType,
  promotionTitle,
  termsAndConditions,
  promotionUrn,
  isImsPromo,
  hasPersonalisation,
  promoTypeLabel,
  dispatchCallToActionTap,
  dispatchTermsAndConditionsTap,
  dispatchExternalPushAction,
  dispatchPushAction,
  runnerUrn,
  marketUrn,
  marketId,
  betButtondisplayPreviousOdd,
  dispatchSportsbookMarketUpdatesSubscribe,
  dispatchSportsbookMarketUpdatesUnsubscribe,
  currentUrl,
  currentUrn,
  isCasino,
  isPlayNewPromo,
  headline,
  subHeadline,
  strapline,
  hasBetfairBoost,
  odds,
  dispatchBetPlacement,
}) => {
  const isOddsboostEligible =
    promotionContentType === PromotionContentType.Oddsboost &&
    runnerUrn &&
    marketUrn &&
    typeof betButtondisplayPreviousOdd !== "undefined";

  const onPromotionCardTap = useCallback(() => {
    if (promotionContentType === PromotionContentType.MovableInk && "viewLink" in action) {
      const imageURL = getBackgroundImage(backgroundImage, window.innerWidth, false)?.url || "";

      dispatchCallToActionTap(action.viewLink, imageURL, promotionUrn, isImsPromo);
      return;
    }

    if (promotionContentType !== PromotionContentType.Oddsboost && "viewLink" in action) {
      if (isImsPromo) {
        const imsPromoViewLink = getImsPromoUrlWithReturnUrl(
          action.viewLink.viewUrl,
          window.location.href,
          currentUrl,
          currentUrn,
        );
        const viewLink = {
          ...action.viewLink,
          viewUrl: imsPromoViewLink || action.viewLink.viewUrl,
        };
        dispatchCallToActionTap(action.viewLink, name, promotionUrn, isImsPromo);
        dispatchPushAction(viewLink);
      } else {
        const viewLink = {
          ...action.viewLink,
          viewUrl: getPromoUrlWithReturnURL(action.viewLink.viewUrl, window.location.href),
        };
        dispatchCallToActionTap(viewLink, name, promotionUrn, isImsPromo);
        dispatchExternalPushAction(viewLink);
      }
    }

    if (isOddsboostEligible) {
      const bet = { urn: runnerUrn, odds };
      const metadata = { cardUrn, betOriginURL: window.location.href };
      dispatchBetPlacement(bet, metadata);
    }
  }, [
    promotionContentType,
    action,
    isOddsboostEligible,
    runnerUrn,
    backgroundImage,
    isImsPromo,
    currentUrl,
    currentUrn,
    dispatchCallToActionTap,
    name,
    promotionUrn,
    dispatchPushAction,
    dispatchExternalPushAction,
    odds,
    cardUrn,
    dispatchBetPlacement,
  ]);

  const onTermsAndConditionsTap = (): void => {
    if (isImsPromo && "viewLink" in action) {
      const imsPromoViewLink = getImsPromoUrlWithReturnUrl(
        action.viewLink.viewUrl,
        window.location.href,
        currentUrl,
        currentUrn,
      );
      const viewLink = {
        ...action.viewLink,
        viewUrl: imsPromoViewLink || action.viewLink.viewUrl,
      };
      dispatchTermsAndConditionsTap(action.viewLink, name, promotionUrn, isImsPromo);
      dispatchPushAction(viewLink);
    } else if (termsAndConditions) {
      const termsAndConditionsUrl = termsAndConditions.url || "";
      const title = promotionContentType === PromotionContentType.MovableInk ? termsAndConditionsUrl : name;
      const viewLink = {
        viewUrn: "",
        viewUrl: getPromoUrlWithReturnURL(termsAndConditionsUrl, window.location.href),
      };
      dispatchTermsAndConditionsTap(viewLink, title, promotionUrn, isImsPromo);
      dispatchExternalPushAction(viewLink);
    }
  };

  const { isIntersecting, ref } = useOnIntersect<HTMLDivElement>(null);
  const id = useId();
  const onIntersectCallback = useCallback<OnIntersectCallback>(
    (isIntersectingFlag) => {
      if (marketId) {
        if (isIntersectingFlag) {
          dispatchSportsbookMarketUpdatesSubscribe(marketId, id);
        } else {
          dispatchSportsbookMarketUpdatesUnsubscribe(marketId, id);
        }
      }
    },
    [dispatchSportsbookMarketUpdatesSubscribe, dispatchSportsbookMarketUpdatesUnsubscribe, marketId, id],
  );

  useEffect(() => {
    onIntersectCallback(isIntersecting);
  }, [onIntersectCallback, isIntersecting]);

  return (
    <div ref={ref}>
      {isCasino ? (
        <CasinoPromotionCard
          action={action as PromotionNavigationAction}
          backgroundImage={getImagePath("casino-promo")}
          promotionImage={getBackgroundImage(backgroundImage, window.innerWidth, false)?.url}
          subtitle={isImsPromo ? strapline : promotionTitle || undefined}
          headline={subHeadline}
          termsAndConditions={termsAndConditions || undefined}
          title={isImsPromo ? headline : name}
          onActionButtonTap={onPromotionCardTap}
        />
      ) : (
        <PromoCard
          action={action}
          backgroundImage={getBackgroundImage(backgroundImage, window.innerWidth, isPlayNewPromo)}
          name={name}
          promotionContentType={promotionContentType}
          promoTypeLabel={promoTypeLabel}
          onPromotionCardTap={onPromotionCardTap}
          onTermsAndConditionsTap={onTermsAndConditionsTap}
          termsAndConditions={termsAndConditions}
          termsAndConditionsLabel={termsAndConditionsLabel}
          title={promotionTitle}
          hasPersonalisation={hasPersonalisation}
          hasBetfairBoost={hasBetfairBoost}
        >
          {isOddsboostEligible && (
            <ConnectedSportsbookBetButton
              marketUrn={marketUrn}
              runnerUrn={runnerUrn}
              component={SportsbookBetButton}
              displayPreviousOdd={betButtondisplayPreviousOdd}
              cardUrn={cardUrn}
            />
          )}
        </PromoCard>
      )}
    </div>
  );
};

export default PromotionCard;
