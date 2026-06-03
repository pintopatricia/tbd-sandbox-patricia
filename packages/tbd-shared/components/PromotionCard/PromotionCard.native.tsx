import { FunctionComponent, useCallback, useEffect, useMemo, memo, useId } from "react";
import { Platform, useWindowDimensions } from "react-native";
import { useJoinNow } from "@flutter-global/react-native-cet-framework";
import { EntityType } from "@ppb/tbd-urn-codecs";
import {
  navigate,
  navigateWithDeepLinking,
  navigateWithThirdPartyScreenName,
  ScreenName,
} from "@ppb/tbd-router/native";
import { PromotionBackgroundImage, PromotionNavigationAction } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { PromotionContentType } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { CasinoPromotionCard } from "./snowflakes/CasinoPromotionCard/CasinoPromotionCard.native";
import { PromotionCard as PromoCard } from "./snowflakes/PromotionCard/PromotionCard.native";
import { ComponentProps } from "./props";
import { getBackgroundImage } from "./promotion-card-helper";
import ConnectedSportsbookBetButton from "../SportsbookBetButton";
import SportsbookBetButton from "../SportsbookBetButton/SportsbookBetButton.native";
import { getMovableInkPromoRedirectUrl } from "../../helpers/promotion-helper";
import appConfiguration from "../../config/app-configuration.native";
import { getHomepagePaths, getHost } from "../../config/endpoints";
import { getValidGameLaunchPatterns } from "../../helpers/gaming.native";

type MemoizedProps = ComponentProps & {
  onPromotionCardTap: () => void;
  onTermsAndConditionsTap: () => void;
  isOddsboostEligible: boolean;
  promotionImage?: PromotionBackgroundImage;
};

const MemoizedPromotionCard: FunctionComponent<MemoizedProps> = memo(
  ({
    cardUrn,
    action,
    termsAndConditionsLabel,
    name,
    promotionContentType,
    promotionTitle,
    termsAndConditions,
    promoTypeLabel,
    runnerUrn,
    marketUrn,
    betButtondisplayPreviousOdd,
    isCasino,
    hasBetfairBoost,
    isOddsboostEligible,
    onPromotionCardTap,
    onTermsAndConditionsTap,
    promotionImage,
  }) => {
    if (isCasino) {
      return (
        <CasinoPromotionCard
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          backgroundImage={require("../../assets/images/promotions/casino-promo-background.jpg")}
          title={name}
          subtitle={promotionTitle || undefined}
          action={action as PromotionNavigationAction}
          promotionImage={promotionImage?.url}
          termsAndConditions={termsAndConditions || undefined}
          onActionButtonTap={onPromotionCardTap}
        />
      );
    }
    return (
      <PromoCard
        action={action}
        backgroundImage={promotionImage}
        name={name}
        onPromotionCardTap={onPromotionCardTap}
        onTermsAndConditionsTap={onTermsAndConditionsTap}
        promotionContentType={promotionContentType}
        promoTypeLabel={promoTypeLabel}
        termsAndConditions={termsAndConditions}
        termsAndConditionsLabel={termsAndConditionsLabel}
        title={promotionTitle}
        hasBetfairBoost={hasBetfairBoost}
      >
        {isOddsboostEligible && marketUrn && runnerUrn && (
          <ConnectedSportsbookBetButton
            marketUrn={marketUrn}
            runnerUrn={runnerUrn}
            component={SportsbookBetButton}
            displayPreviousOdd={betButtondisplayPreviousOdd}
            cardUrn={cardUrn}
          />
        )}
      </PromoCard>
    );
  },
);

MemoizedPromotionCard.displayName = "MemoizedPromotionCard";

const PromotionCard: FunctionComponent<ComponentProps> = (props) => {
  const {
    cardUrn,
    action,
    backgroundImage,
    name,
    promotionContentType,
    termsAndConditions,
    promotionUrn,
    dispatchCallToActionTap,
    dispatchTermsAndConditionsTap,
    runnerUrn,
    marketUrn,
    betButtondisplayPreviousOdd,
    dispatchSportsbookMarketUpdatesSubscribe,
    dispatchSportsbookMarketUpdatesUnsubscribe,
    marketId,
    odds,
    visible,
    dispatchBetPlacement,
  } = props;
  const VIEWPORT_WIDTH = useWindowDimensions().width;
  const joinNow = useJoinNow();

  const isOddsboostEligible = !!(
    promotionContentType === PromotionContentType.Oddsboost &&
    runnerUrn &&
    marketUrn &&
    typeof betButtondisplayPreviousOdd !== "undefined"
  );

  const promotionImage = useMemo(
    () => getBackgroundImage(backgroundImage, VIEWPORT_WIDTH),
    [backgroundImage, VIEWPORT_WIDTH],
  );

  const onPromotionCardTap = useCallback(async () => {
    const handleCETNavigation = (viewURL: string): boolean => {
      if (viewURL.includes("register") && viewURL.includes("registration")) {
        joinNow(viewURL);
        return true;
      }
      return false;
    };
    if (promotionContentType === PromotionContentType.Link && "viewLink" in action && Platform.OS === "android") {
      if (getValidGameLaunchPatterns().some((pattern) => pattern && action.viewLink.viewUrl.match(pattern))) {
        navigateWithThirdPartyScreenName(ScreenName.GameLaunchScreen, {
          viewLink: action.viewLink,
        });
        return;
      }
    }
    if (promotionContentType === PromotionContentType.MovableInk && "viewLink" in action) {
      dispatchCallToActionTap(action.viewLink, promotionImage?.url || "", promotionUrn);
      const host = getHost();
      const homepagePaths = getHomepagePaths();
      navigateWithDeepLinking(
        await getMovableInkPromoRedirectUrl(action.viewLink.viewUrl),
        host,
        homepagePaths,
        appConfiguration.deeplinkConfiguration,
      );

      return;
    }

    if (promotionContentType !== PromotionContentType.Oddsboost && "viewLink" in action) {
      const isCETNavigation = handleCETNavigation(action.viewLink.viewUrl);
      if (!isCETNavigation) {
        dispatchCallToActionTap(action.viewLink, name, promotionUrn);
        navigate(action.viewLink);
      }
    }

    if (isOddsboostEligible) {
      const bet = { urn: runnerUrn, odds };
      const metadata = { cardUrn, betOriginURL: "" };
      dispatchBetPlacement(bet, metadata);
    }
  }, [
    action,
    cardUrn,
    dispatchBetPlacement,
    dispatchCallToActionTap,
    isOddsboostEligible,
    joinNow,
    name,
    odds,
    promotionContentType,
    promotionImage,
    promotionUrn,
    runnerUrn,
  ]);

  const onTermsAndConditionsTap = useCallback(() => {
    if (termsAndConditions) {
      const termsAndConditionsUrl = termsAndConditions.url || "";
      const title = promotionContentType === PromotionContentType.MovableInk ? termsAndConditionsUrl : name;
      const viewLink = {
        viewUrn: EntityType.ExternalView,
        viewUrl: termsAndConditionsUrl,
      };

      dispatchTermsAndConditionsTap(viewLink, title, promotionUrn);
      navigate(viewLink);
    }
  }, [dispatchTermsAndConditionsTap, name, promotionContentType, promotionUrn, termsAndConditions]);
  const id = useId();
  useEffect(() => {
    if (marketId) {
      if (visible) {
        dispatchSportsbookMarketUpdatesSubscribe(marketId, id);
      } else {
        dispatchSportsbookMarketUpdatesUnsubscribe(marketId, id);
      }

      return () => {
        dispatchSportsbookMarketUpdatesUnsubscribe(marketId, id);
      };
    }
    return () => {};
  }, [dispatchSportsbookMarketUpdatesSubscribe, dispatchSportsbookMarketUpdatesUnsubscribe, marketId, visible]);
  return (
    <MemoizedPromotionCard
      isOddsboostEligible={isOddsboostEligible}
      onPromotionCardTap={onPromotionCardTap}
      onTermsAndConditionsTap={onTermsAndConditionsTap}
      promotionImage={promotionImage}
      {...props}
    />
  );
};

export default PromotionCard;
