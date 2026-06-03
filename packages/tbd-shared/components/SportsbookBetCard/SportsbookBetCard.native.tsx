import { FunctionComponent, useCallback, useEffect, useMemo, useState } from "react";
import { AppState, View } from "react-native";
import { InfoLabel, StatusLabel } from "@ppb/the-wall-native";
import { SportsbookBetPanel } from "../SportsbookBetPanel/SportsbookBetPanel.native";
import { InfoLabelType, StatusLabelSizeType, StatusLabelType } from "@ppb/the-wall-common/types";
import { DisplayMode } from "@ppb/the-wall-common/types/ViewLink.types";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { navigate } from "@ppb/tbd-router";
import { ValueIconName } from "@ppb/the-wall-icons";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import ConnectedNotificationsSubscription from "../NotificationsSubscription";
import NotificationsSubscription from "../NotificationsSubscription/NotificationsSubscription.native";
import { NotificationsViewMode } from "../NotificationsSubscription/map-to-props-factory";
import ConnectedCashout from "../Cashout";
import Cashout from "../Cashout/Cashout.native";
import ConnectedGenericView from "../GenericView";
import { GenericView } from "../GenericView/GenericView.native";
import { SPORTSBOOK_BET_CARD, SUPER_SUB_ICON } from "./SportsbookBetCard.native.selectors";
import { ComponentProps } from "./props";
import FreezeSelection from "../FreezeSelection/FreezeSelection.native";
import styles from "./SportsbookBetCard.native.styles";
import { i18n } from "../../helpers/i18n";
import { useFocusEffect } from "@react-navigation/native";

const SportsbookBetCard: FunctionComponent<ComponentProps> = ({
  urn,
  isSettled,
  title,
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
  superSubIcon,
  dispatchSubscribeCardUpdatesAction,
  dispatchUnsubscribeCardUpdatesAction,
  dispatchFetchCatalogue,
  dispatchShareIconTap,
  dispatchSubscribeBlhResult,
  dispatchUnsubscribeBlhResult,
  dispatchSubscribeBmeResult,
  dispatchUnsubscribeBmeResult,
  dispatchHeritageInfoLabelClick,
  dispatchAccaFreezeOpenedAction,
  dispatchAccaFreezeClosedAction,
}) => {
  // For tracking jumps between main APP foreground/background states
  // (lock screen, app switching, etc)
  const [isAppActive, setIsAppActive] = useState(AppState.currentState === "active");

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      setIsAppActive(nextAppState === "active");
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // "useFocusEffect" for tracking jumps between native screens (focus changes)
  useFocusEffect(
    useCallback(() => {
      if (shouldSubscribe && isAppActive) {
        dispatchSubscribeCardUpdatesAction(urn);
        dispatchSubscribeBlhResult(urn);
        if (isMutationEligible) dispatchSubscribeBmeResult(urn);
      }

      return () => {
        if (shouldSubscribe) {
          dispatchUnsubscribeCardUpdatesAction(urn);
          dispatchUnsubscribeBlhResult(urn);
          if (isMutationEligible) dispatchUnsubscribeBmeResult(urn);
        }
      };
    }, [
      urn,
      shouldSubscribe,
      isMutationEligible,
      isAppActive,
      dispatchSubscribeCardUpdatesAction,
      dispatchUnsubscribeCardUpdatesAction,
      dispatchSubscribeBlhResult,
      dispatchUnsubscribeBlhResult,
      dispatchSubscribeBmeResult,
      dispatchUnsubscribeBmeResult,
    ]),
  );

  const segmentData = useMemo(
    () => ({
      rightValue: returns,
      rightPreviousValue: originalReturns,
      rightLabel: labels.returns,
      midValue: stake,
      midValueDetail: stakeDetail,
      midLabel: labels.stake,
      isOddsBoosted: showOddsBoostSignposting,
    }),
    [labels.returns, labels.stake, originalReturns, returns, stake, showOddsBoostSignposting, stakeDetail],
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

  const notificationsSubscription = (
    <ConnectedNotificationsSubscription
      viewMode={NotificationsViewMode.MY_BETS}
      betURN={urn}
      component={NotificationsSubscription}
    />
  );

  const onShareIconTap = useCallback((): void => {
    if (betSharingViewUrn) {
      dispatchFetchCatalogue(betSharingViewUrn);
      dispatchShareIconTap();
    }
  }, [betSharingViewUrn, dispatchFetchCatalogue, dispatchShareIconTap]);

  const onExternalUrlClicked = useCallback((externalUrl: string) => {
    navigate({
      viewUrl: externalUrl,
      viewUrn: EntityType.ExternalView,
      viewDisplayMode: DisplayMode.BlankWebview,
    });
  }, []);

  const onHeritageInfoLabelTap = useCallback(() => {
    navigate(heritageInfoLabelViewLink);
    dispatchHeritageInfoLabelClick(heritageInfoLabelViewLink, labels.heritageInfoLabel.label);
  }, [dispatchHeritageInfoLabelClick, heritageInfoLabelViewLink, labels.heritageInfoLabel.label]);

  const isBetSharingSupported = !!betSharingViewUrn;

  return title && returns && stake ? (
    <View {...getTestProps(SPORTSBOOK_BET_CARD, false)}>
      <SportsbookBetPanel
        title={title}
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
        notification={notificationsSubscription}
        onShareIconTap={isBetSharingSupported ? onShareIconTap : undefined}
        onOpenExternalUrl={onExternalUrlClicked}
        alert={alert}
      >
        {shouldShowHeritageInfoLabel && (
          <View>
            <InfoLabel
              label={labels.heritageInfoLabel.label}
              iconName={labels.heritageInfoLabel.icon}
              iconPosition="right"
              infoLabelType={InfoLabelType.BRANDED}
              onClick={onHeritageInfoLabelTap}
            />
          </View>
        )}
        {isAccaFreezeEligible ? (
          <View style={styles.accaFreezeSignPostingContainer}>
            <StatusLabel
              iconName={ValueIconName.ACCA_FREEZE}
              statusLabelSize={StatusLabelSizeType.SMALL}
              statusLabelType={StatusLabelType.ALTERNATIVE_BRANDED}
              text={i18n({ key: "I18N.ACCA_FREEZE.TITLE" })}
            />
          </View>
        ) : null}
        {statusLabelBoostedInfo && (
          <View>
            <StatusLabel
              iconName={statusLabelBoostedInfo.iconName}
              text={statusLabelBoostedInfo.label}
              statusLabelType={StatusLabelType.ALTERNATIVE_BRANDED}
              statusLabelSize={StatusLabelSizeType.SMALL}
            />
          </View>
        )}
        {!!cashoutQuoteURN && hasQuote && <ConnectedCashout component={Cashout} cashoutURN={cashoutQuoteURN} />}
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
        <View {...getTestProps(SUPER_SUB_ICON, false)} style={styles.superSubIconContainer}>
          <GenericIcon name={superSubIcon} />
        </View>
      )}
      <View style={styles.inlineViewContainer}>
        {isBetSharingSupported && (
          // @ts-expect-error TODO Universal integration with placeholders still break on ts-jest
          <ConnectedGenericView urn={betSharingViewUrn} component={GenericView} />
        )}
      </View>
    </View>
  ) : null;
};

export default SportsbookBetCard;
