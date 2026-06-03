import { FunctionComponent, useEffect, useMemo, useState, useCallback } from "react";
import { ConfirmDrawer, Alert } from "@ppb/the-wall-web";
import { AlertType } from "@ppb/the-wall-common/types/";
import { PromotionStatus } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { PromotionLayout } from "@ppb/tbd-store/state/entities";
import styles from "./ImsPromotionStateCard.web.css";

import { LoadedComponentProps } from "./props";
import { currencyFormatWithDecimalPlaces } from "../../formatters/currency-formatters";
import { DisclaimerProps } from "./snowflakes/ClaimNowPromo/snowflakes/Disclaimer/Disclaimer.web";
import { AcceptPromoCard } from "./snowflakes/AcceptPromoCard/AcceptPromoCard.web";
import { ClaimNowPromo } from "./snowflakes/ClaimNowPromo/ClaimNowPromo.web";
import { OngoingPromoCard } from "./snowflakes/OngoingPromoCard/OngoingPromoCard.web";

const ImsPromotionStateCard: FunctionComponent<LoadedComponentProps> = ({
  promoCard,
  promotion,
  title,
  image,
  layout,
  subHeadline,
  ctaText,
  i18n,
  min,
  max,
  buyInMaxValue,
  depositViewLink,
  bonusAmount,
  bonusPercent,
  disclaimerText,
  currencyDetails,
  type,
  progressValue,
  footerValue,
  availableFunds,
  status,
  secondsLeft,
  notificationMessage,
  pendingWinnings,
  isLoggedIn,
  authData,
  dispatchCancelPromotion,
  dispatchAcceptPromotion,
  dispatchDepositNavigation,
  dispatchRefreshPromotion,
  dispatchSawPromotionError,
  dispatchInteractCancelPromotionModal,
  dispatchClearErrorMessage,
  dispatchExternalPushAction,
}) => {
  const steps = max - min + 1;
  const [amountSlider, setAmountSlider] = useState<number>(max);
  const [shouldShowConfirm, setShouldShowConfirm] = useState<boolean>(false);
  const [disableRefresh, setDisableRefresh] = useState<boolean>(false);
  const promoStatus = status === PromotionStatus.OptedIn ? "Accepted" : "Not Accepted";

  const refreshDeps = useMemo(
    () => ({ promotion, footerValue, secondsLeft, progressValue, notificationMessage }),
    [promotion, footerValue, secondsLeft, progressValue, notificationMessage],
  );
  const [prevRefreshDeps, setPrevRefreshDeps] = useState(refreshDeps);
  if (prevRefreshDeps !== refreshDeps) {
    setPrevRefreshDeps(refreshDeps);
    setDisableRefresh(false);
  }

  useEffect(() => {
    if (notificationMessage && notificationMessage.type !== AlertType.Success) {
      dispatchSawPromotionError(notificationMessage.title);
    }
  }, [notificationMessage, dispatchSawPromotionError]);

  const handleRefuseClick = useCallback(() => {
    dispatchInteractCancelPromotionModal(
      promotion,
      title,
      promoStatus,
      status,
      "yes, cancel promotion",
      type,
      progressValue,
    );
    dispatchCancelPromotion(promotion);
    setShouldShowConfirm(!shouldShowConfirm);
  }, [
    dispatchInteractCancelPromotionModal,
    promotion,
    title,
    promoStatus,
    status,
    dispatchCancelPromotion,
    shouldShowConfirm,
    type,
    progressValue,
  ]);

  const handleAcceptButton = useCallback(() => {
    dispatchAcceptPromotion(promotion, title, promoStatus, status, undefined, type, progressValue);
  }, [dispatchAcceptPromotion, promoStatus, promotion, status, title, type, progressValue]);

  const handleClaimNowButton = useCallback(() => {
    if ((amountSlider * 100) / bonusPercent <= availableFunds)
      if (bonusAmount > 0)
        dispatchAcceptPromotion(promotion, title, promoStatus, status, buyInMaxValue, type, progressValue);
      else
        dispatchAcceptPromotion(
          promotion,
          title,
          promoStatus,
          status,
          (amountSlider * 100) / bonusPercent,
          type,
          progressValue,
        );
    else if (depositViewLink) dispatchDepositNavigation(depositViewLink);
  }, [
    amountSlider,
    bonusPercent,
    availableFunds,
    bonusAmount,
    dispatchAcceptPromotion,
    promotion,
    title,
    promoStatus,
    status,
    buyInMaxValue,
    dispatchDepositNavigation,
    depositViewLink,
    type,
    progressValue,
  ]);

  const handleAcceptClick = useCallback(() => {
    dispatchInteractCancelPromotionModal(
      promotion,
      title,
      promoStatus,
      status,
      "no, continue playing",
      type,
      progressValue,
    );
    setShouldShowConfirm(!shouldShowConfirm);
  }, [
    dispatchInteractCancelPromotionModal,
    promoStatus,
    promotion,
    shouldShowConfirm,
    status,
    title,
    type,
    progressValue,
  ]);

  const handleOpenPromotionModalClick = useCallback(() => {
    dispatchInteractCancelPromotionModal(promotion, title, promoStatus, status, "cancel", type, progressValue);
    setShouldShowConfirm(!shouldShowConfirm);
  }, [
    dispatchInteractCancelPromotionModal,
    promoStatus,
    promotion,
    shouldShowConfirm,
    status,
    title,
    type,
    progressValue,
  ]);

  const handleRefreshClick = useCallback(() => {
    setDisableRefresh(true);
    dispatchRefreshPromotion(promoCard, title, promoStatus, status, "refresh", promotion, type, progressValue);
  }, [dispatchRefreshPromotion, promoCard, promoStatus, status, title, promotion, type, progressValue]);

  const onSliderChange = useCallback(
    (step: number): void => {
      setAmountSlider(min + step);
    },
    [min],
  );

  const onButtonClickWhenLoggedOut = useCallback((): void => {
    const ssoWithRedirectUrl = `${authData?.SSO_URL}&url=${encodeURIComponent(window.location.href)}`;
    dispatchExternalPushAction("login", "promotional-modal", ssoWithRedirectUrl);
  }, [dispatchExternalPushAction, authData]);

  const onAcceptTapAction = isLoggedIn ? handleAcceptButton : onButtonClickWhenLoggedOut;

  const onClaimNowTapAction = isLoggedIn ? handleClaimNowButton : onButtonClickWhenLoggedOut;

  const amountDeps = useMemo(
    () => ({ availableFunds, bonusPercent, max, min }),
    [availableFunds, bonusPercent, max, min],
  );
  const [prevAmountDeps, setPrevAmountDeps] = useState(amountDeps);
  if (prevAmountDeps !== amountDeps) {
    setPrevAmountDeps(amountDeps);
    const actualBonusAmount = parseFloat((Math.floor(availableFunds * bonusPercent) / 100).toFixed(2));
    let value = max;
    if (actualBonusAmount >= min && actualBonusAmount <= max) {
      value = actualBonusAmount;
    }
    setAmountSlider(value);
  }

  const formattedDisclaimer = bonusAmount > 0 ? buyInMaxValue : (amountSlider * 100) / bonusPercent;
  const ctaTextToShow = formattedDisclaimer > availableFunds ? i18n.deposit : ctaText;

  useEffect(
    () =>
      function cleanupErrorMessage() {
        if (notificationMessage) {
          dispatchClearErrorMessage(promotion);
        }
      },
  );

  const disclaimer: DisclaimerProps = {
    i18n: disclaimerText,
    value:
      bonusAmount > 0
        ? currencyFormatWithDecimalPlaces({
            currencyCode: currencyDetails.currencyCode,
            localeCodeBcp47: currencyDetails.localeCode,
            value: buyInMaxValue,
          })
        : currencyFormatWithDecimalPlaces({
            currencyCode: currencyDetails.currencyCode,
            localeCodeBcp47: currencyDetails.localeCode,
            value: formattedDisclaimer,
          }),
  };

  return (
    <div>
      {notificationMessage && (
        <div className={styles.notificationContainer}>
          <Alert
            type={notificationMessage.type}
            message={notificationMessage.title}
            detail={notificationMessage.body}
          />
        </div>
      )}
      {status === PromotionStatus.NotOptedIn &&
        (layout === PromotionLayout.Accept || layout === PromotionLayout.OptIn) && (
          <AcceptPromoCard
            title={title}
            tcText={subHeadline}
            image={image}
            i18n={{ accept: ctaText }}
            onAccept={onAcceptTapAction}
          />
        )}
      {status === PromotionStatus.NotOptedIn && layout === PromotionLayout.BuyIn && (
        <ClaimNowPromo
          title={title}
          subHeader={subHeadline}
          availableFunds={currencyFormatWithDecimalPlaces({
            currencyCode: currencyDetails.currencyCode,
            localeCodeBcp47: currencyDetails.localeCode,
            value: availableFunds,
          })}
          disclaimer={disclaimer}
          backgroundImage={image}
          steps={steps}
          initialStep={amountSlider - min}
          bubbleLabel={currencyFormatWithDecimalPlaces({
            currencyCode: currencyDetails.currencyCode,
            localeCodeBcp47: currencyDetails.localeCode,
            value: amountSlider,
            decimalPlaces: amountSlider % 1 === 0 ? 0 : 2,
          })}
          i18n={{ claimNow: ctaTextToShow, availableFunds: i18n.availableFunds }}
          onClaimNow={onClaimNowTapAction}
          onChange={onSliderChange}
        />
      )}
      {status !== PromotionStatus.NotOptedIn && (
        <OngoingPromoCard
          title={title}
          type={type}
          tcText={subHeadline}
          backgroundImage={image}
          requirements={i18n.requirements}
          remainingHeader={i18n.remainingHeader}
          remainingSubheader={i18n.remainingSubHeader}
          footerValue={footerValue}
          pendingWinnings={pendingWinnings}
          i18N={{
            cancel: i18n.cancel,
            refresh: i18n.refresh,
            footerText: i18n.footerText,
            badgeLabel: i18n.badgeLabel,
            pendingWinnings: i18n.pendingWinnings,
          }}
          progressValue={progressValue}
          disableRefresh={disableRefresh}
          onCancel={handleOpenPromotionModalClick}
          onRefresh={handleRefreshClick}
        />
      )}

      {shouldShowConfirm && (
        <ConfirmDrawer
          title={i18n.promotionTitle}
          subtitle={i18n.promotionContent}
          refuseLabel={i18n.confirmCancel}
          acceptLabel={i18n.declineCancel}
          onRefuseTap={handleRefuseClick}
          onAcceptTap={handleAcceptClick}
        />
      )}
    </div>
  );
};

export default ImsPromotionStateCard;
