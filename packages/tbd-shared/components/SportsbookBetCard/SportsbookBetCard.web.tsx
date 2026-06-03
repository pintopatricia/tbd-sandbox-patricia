import { lazy, FunctionComponent, Suspense, useCallback, useContext, useEffect, useMemo } from "react";

import { InfoLabel, StatusLabel, useOnIntersect } from "@ppb/the-wall-web";
import { SportsbookBetPanel } from "../SportsbookBetPanel/SportsbookBetPanel.web";
import { InfoLabelType, StatusLabelSizeType, StatusLabelType } from "@ppb/the-wall-common/types";
import { OnIntersectCallback } from "@ppb/the-wall-common/types/web";
import { ValueIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { canShare } from "../../helpers/share.web";
import ConnectedGenericView from "../GenericView";
import { GenericView } from "../GenericView/GenericView.web";
import { ConfigContext } from "../Config/ConfigContext";
import FreezeSelection from "../FreezeSelection/FreezeSelection.web";
import styles from "./SportsbookBetCard.web.css";
import { ComponentProps } from "./props";
import { i18n } from "../../helpers/i18n";

const ConnectedCashout = lazy(() => import(/* webpackChunkName: "Cashout" */ "../Cashout"));
const Cashout = lazy(() => import(/* webpackChunkName: "Cashout" */ "../Cashout/Cashout.web"));

const BetSharingViewPlaceholder = () => <></>;

const SportsbookBetCard: FunctionComponent<ComponentProps> = ({
  urn,
  isSettled,
  title,
  subTitle,
  supportingText,
  statusLabelText,
  statusLabelIcon,
  statusLabelType,
  isMultiple,
  isGuaranteedPriceSelected,
  labels,
  stake,
  originalReturns,
  stakeDetail,
  returns,
  placedReturns,
  betSegmentInfos,
  showOddsBoostSignposting,
  statusLabelBoostedInfo,
  isAccaFreezeEligible,
  cashoutQuoteURN,
  hasQuote,
  shouldSubscribe,
  betSharingViewUrn,
  shouldShowHeritageInfoLabel,
  heritageInfoLabelViewLink,
  numberOfAccaFreezeEligibleLegs,
  numberOfBetLegs,
  isMutationEligible,
  shouldShowFreezeSelectionButton,
  alert,
  dispatchSubscribeCardUpdatesAction,
  dispatchUnsubscribeCardUpdatesAction,
  dispatchFetchCatalogue,
  dispatchShareIconTap,
  dispatchSubscribeBlhResult,
  dispatchUnsubscribeBlhResult,
  dispatchSubscribeBmeResult,
  dispatchUnsubscribeBmeResult,
  dispatchExternalPushAction,
  dispatchExternalPushBlankAction,
  dispatchHeritageInfoLabelClick,
  dispatchAccaFreezeOpenedAction,
  dispatchAccaFreezeClosedAction,
  superSubIcon,
}) => {
  const { isIntersecting, ref } = useOnIntersect<HTMLDivElement>(null);
  const { isDesktopLayout } = useContext(ConfigContext);

  const onIntersectCallback = useCallback<OnIntersectCallback>(
    (isIntersectingFlag) => {
      if (isIntersectingFlag) {
        dispatchSubscribeCardUpdatesAction(urn);
        dispatchSubscribeBlhResult(urn);
        if (isMutationEligible) dispatchSubscribeBmeResult(urn);
        return;
      }

      dispatchUnsubscribeCardUpdatesAction(urn);
      dispatchUnsubscribeBlhResult(urn);
      if (isMutationEligible) dispatchUnsubscribeBmeResult(urn);
    },
    [
      isMutationEligible,
      dispatchSubscribeBlhResult,
      dispatchSubscribeBmeResult,
      dispatchSubscribeCardUpdatesAction,
      dispatchUnsubscribeBlhResult,
      dispatchUnsubscribeBmeResult,
      dispatchUnsubscribeCardUpdatesAction,
      urn,
    ],
  );

  useEffect(() => {
    if (shouldSubscribe && onIntersectCallback) {
      onIntersectCallback(isIntersecting);
    }
  }, [onIntersectCallback, isIntersecting, shouldSubscribe]);

  const segmentData = useMemo(
    () => ({
      midLabel: labels.stake,
      midValue: stake,
      midValueDetail: stakeDetail,
      rightLabel: labels.returns,
      rightPreviousValue: originalReturns,
      rightValue: returns,
      isOddsBoosted: showOddsBoostSignposting,
    }),
    [labels.returns, labels.stake, originalReturns, returns, stake, stakeDetail, showOddsBoostSignposting],
  );

  const secondarySegmentData = useMemo(
    () =>
      !isSettled && placedReturns
        ? {
            rightValue: placedReturns,
            rightPreviousValue: "",
            rightLabel: labels.placedReturns,
          }
        : undefined,
    [isSettled, placedReturns, labels.placedReturns],
  );

  const onShareIconTap = useCallback((): void => {
    if (betSharingViewUrn) {
      dispatchFetchCatalogue(betSharingViewUrn);
      dispatchShareIconTap();
    }
  }, [betSharingViewUrn, dispatchFetchCatalogue, dispatchShareIconTap]);

  const onHeritageInfoLabelTap = useCallback(() => {
    dispatchHeritageInfoLabelClick(heritageInfoLabelViewLink, labels.heritageInfoLabel.label);
    dispatchExternalPushBlankAction(heritageInfoLabelViewLink);
  }, [
    dispatchHeritageInfoLabelClick,
    dispatchExternalPushBlankAction,
    heritageInfoLabelViewLink,
    labels.heritageInfoLabel.label,
  ]);

  const isBetSharingSupported = !!betSharingViewUrn && !isDesktopLayout && canShare();

  return title && returns && stake ? (
    <div ref={ref}>
      <SportsbookBetPanel
        title={title}
        subTitle={subTitle}
        supportingText={supportingText}
        statusLabelText={statusLabelText}
        statusLabelIcon={statusLabelIcon}
        statusLabelType={statusLabelType}
        isMultiple={isMultiple}
        isGuaranteedPriceSelected={isGuaranteedPriceSelected}
        guaranteedPriceLabel={labels.guaranteedPriceLabel}
        segmentData={segmentData}
        secondarySegmentData={secondarySegmentData}
        betSegmentInfos={betSegmentInfos}
        onShareIconTap={isBetSharingSupported ? onShareIconTap : undefined}
        onOpenExternalUrl={dispatchExternalPushAction}
        alert={alert}
      >
        {shouldShowHeritageInfoLabel && (
          <div>
            <InfoLabel
              label={labels.heritageInfoLabel.label}
              iconName={labels.heritageInfoLabel.icon}
              iconPosition="right"
              infoLabelType={InfoLabelType.BRANDED}
              onClick={onHeritageInfoLabelTap}
            />
          </div>
        )}
        {isAccaFreezeEligible ? (
          <div className={styles.accaFreezeSignPostingContainer}>
            <StatusLabel
              iconName={ValueIconName.ACCA_FREEZE}
              statusLabelSize={StatusLabelSizeType.SMALL}
              statusLabelType={StatusLabelType.ALTERNATIVE_BRANDED}
              text={i18n({ key: "I18N.ACCA_FREEZE.TITLE" })}
            />
          </div>
        ) : null}
        {statusLabelBoostedInfo && (
          <div>
            <StatusLabel
              iconName={statusLabelBoostedInfo.iconName}
              text={statusLabelBoostedInfo.label}
              statusLabelType={StatusLabelType.ALTERNATIVE_BRANDED}
              statusLabelSize={StatusLabelSizeType.SMALL}
            />
          </div>
        )}
        {!!cashoutQuoteURN && hasQuote && (
          <Suspense fallback={<></>}>
            <ConnectedCashout component={Cashout} cashoutURN={cashoutQuoteURN} />
          </Suspense>
        )}
        <FreezeSelection
          urn={urn}
          numberOfEligibleLegs={numberOfAccaFreezeEligibleLegs}
          numberOfBetLegs={numberOfBetLegs}
          shouldShowFreezeSelectionButton={shouldShowFreezeSelectionButton}
          dispatchAccaFreezeOpenedAction={dispatchAccaFreezeOpenedAction}
          dispatchAccaFreezeClosedAction={dispatchAccaFreezeClosedAction}
        />
      </SportsbookBetPanel>
      {superSubIcon && (
        <div className={styles.superSubIconContainer}>
          <GenericIcon name={superSubIcon} />
        </div>
      )}

      {isBetSharingSupported && (
        // @ts-expect-error TODO Universal integration with placeholders still break on ts-jest
        <ConnectedGenericView urn={betSharingViewUrn} component={GenericView} placeholder={BetSharingViewPlaceholder} />
      )}
    </div>
  ) : null;
};

export default SportsbookBetCard;
