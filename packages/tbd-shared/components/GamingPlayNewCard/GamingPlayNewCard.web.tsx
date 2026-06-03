import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { ComponentProps } from "./props";
import { getImagePath } from "../../view-model-factories/game.web";
import { getEndpoint } from "../../config/endpoints";
import { getPromoUrlWithReturnURL } from "../../helpers/promotion-helper";
import { PlayNew } from "./snowflakes/PlayNew/PlayNew.web";

const timeFormatter = (timing: number, isHoursHand: boolean): number[] => {
  if (isHoursHand && timing < 0) {
    return [0, 0];
  }
  const timeLeft = timing < 10 ? `0${timing}` : timing;
  return Array.from(String(timeLeft), Number);
};

let timer: ReturnType<typeof setTimeout>;

const GamingPlayNewCard: FunctionComponent<ComponentProps> = ({
  urn,
  title,
  subtitle,
  backgroundImage,
  logoImage,
  termsAndConditions,
  isStaticPromo,
  isExceededTime,
  hours,
  minutes,
  translations,
  dispatchGamingPlayNewLoaded,
  dispatchClickToMoreInfoButtonAction,
  dispatchClickToPlayNowButtonAction,
}) => {
  const arrowImage = getImagePath("play-new-wrapper");
  const [count, setCount] = useState({
    hours,
    minutes,
  });

  const calculateTimeLeft = (): void => {
    setCount((currentCount) => ({
      hours: currentCount.minutes !== 0 ? currentCount.hours : currentCount.hours - 1,
      minutes: currentCount.minutes !== 0 ? currentCount.minutes - 1 : 59,
    }));
  };
  useEffect(() => {
    if (isStaticPromo && !isExceededTime) {
      timer = setTimeout(calculateTimeLeft, 60000);
      if (count.hours === 0 && count.minutes === 0) {
        clearTimeout(timer);
      }
    }
    dispatchGamingPlayNewLoaded(urn, isStaticPromo);
    return () => {
      clearTimeout(timer);
    };
  }, [count.hours, count.minutes]); /* eslint-disable-line react-hooks/exhaustive-deps */

  const timeLeft = {
    hours: {
      value: timeFormatter(count.hours, true),
      label: translations.i18n.hoursLabel,
    },
    minutes: {
      value: timeFormatter(count.minutes, false),
      label: translations.i18n.minutesLabel,
    },
  };

  const promoUrl = getPromoUrlWithReturnURL(termsAndConditions?.url || "", window.location.href);
  const onMoreInfoClick = useCallback(
    () => dispatchClickToMoreInfoButtonAction(promoUrl, urn, isStaticPromo),
    [dispatchClickToMoreInfoButtonAction, isStaticPromo, promoUrl, urn],
  );
  const onPlayNowClick = useCallback(
    () => dispatchClickToPlayNowButtonAction(promoUrl, urn),
    [dispatchClickToPlayNowButtonAction, promoUrl, urn],
  );

  const promotionsCDN = getEndpoint("PROMOTIONS_CDN");
  const pmas3PromotionsCDN = getEndpoint("PMA_S3_PROMOTIONS_CDN");

  return (
    <PlayNew
      isStaticPromo={isStaticPromo}
      title={title}
      subtitle={subtitle}
      moreInfoLabel={translations.i18n.moreInfoLabel}
      buttonLabel={translations.i18n.playNowLabel}
      timer={timeLeft}
      logoImage={logoImage}
      backgroundImage={backgroundImage}
      targetUrl={promoUrl}
      arrowImage={arrowImage}
      badgeLabel={translations.i18n.badgeLabel}
      onMoreInfoClick={onMoreInfoClick}
      onPlayNowClick={onPlayNowClick}
      promotionsCDN={promotionsCDN}
      pmas3PromotionsCDN={pmas3PromotionsCDN}
    />
  );
};

export default GamingPlayNewCard;
