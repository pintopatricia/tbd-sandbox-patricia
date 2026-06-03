import type { FunctionComponent } from "react";
import { useMemo } from "react";
import { View } from "react-native";

import {
  BetDetailsColor,
  BetDetailsAction,
  AlertType,
  BetSegmentsSize,
  FallbackIconType,
} from "@ppb/the-wall-common/types";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Alert, BetDetails, BetSegments, FreeBets, Option, SilkWrapper, TrapWrapper } from "@ppb/the-wall-native";
import { RacingSport } from "@ppb/tbd-store";
import { BetSportsbookReceiptProps } from "./BetSportsbookReceipt.types";
import styles from "./BetSportsbookReceipt.native.styles";
import { BET_SPORTSBOOK_RECEIPT, BET_SEGMENTS_CONTAINER } from "./BetSportsbookReceipt.native.selectors";
import { i18n } from "../../../../../../../helpers/i18n";

export const BetSportsbookReceipt: FunctionComponent<BetSportsbookReceiptProps> = ({
  title,
  subtitle,
  odds,
  previousOdds,
  segmentsIcon,
  stake,
  profitOrLiability,
  previousProfitOrLiability,
  oddsLabel,
  stakeLabel,
  colorIndicator,
  profitOrLiabilityLabel,
  hasBonusUsed = false,
  freeBetsLabel,
  generosityAlertMessage,
  generosityIconName,
  icon,
  meetingCountry,
  trap,
  racingSport,
  silkFallbackIconType,
  hasEachWay,
  eachWayLabel,
  eachWaySubtitle,
  isPriceBoosted,
  is90Min,
  selectionTypeIcon,
  hasMyOddsBoost,
  isGuaranteedPriceSelected,
  guaranteedPriceLabel,
  isPushNotificationsUnavailable,
  displayAllSubtitleText = false,
}) => {
  const hasAnyBonus = hasBonusUsed || generosityAlertMessage;

  const IconComponent = useMemo(() => {
    if (racingSport === RacingSport.HORSE_RACING) {
      return <SilkWrapper silkUrl={icon} silkFallbackType={silkFallbackIconType as FallbackIconType} />;
    }

    if (racingSport === RacingSport.GREYHOUND_RACING && trap) {
      return <TrapWrapper region={meetingCountry ?? "AGNOSTIC"} trap={trap} size="medium" />;
    }

    return undefined;
  }, [racingSport, icon, silkFallbackIconType, meetingCountry, trap]);

  return (
    <View style={styles.betReceiptContainer} {...getTestProps(BET_SPORTSBOOK_RECEIPT, false)}>
      <BetDetails
        title={title}
        subtitle={subtitle}
        color={isPriceBoosted ? BetDetailsColor.Black : BetDetailsColor.Teal}
        icon={IconComponent}
        is90Min={is90Min}
        selectionTypeIcon={selectionTypeIcon}
        action={BetDetailsAction.None}
        isGuaranteedPriceSelected={isGuaranteedPriceSelected}
        guaranteedPriceLabel={guaranteedPriceLabel}
        notificationsUnavailable={isPushNotificationsUnavailable}
        displayAllSubtitleText={displayAllSubtitleText}
        i18n={{
          Remove: i18n({
            key: "I18N.ACCESSIBILITY.REMOVE_BET_SELECTION",
          }),
          Edit: i18n({
            key: "I18N.ACCESSIBILITY.EDIT_BET",
          }),
          None: i18n({
            key: "I18N.ACCESSIBILITY.NO_ACTION_AVAILABLE",
          }),
        }}
      />
      {hasEachWay && <Option title={eachWayLabel} subtitle={eachWaySubtitle} isSelected isReadOnly />}
      <View style={styles.content} {...getTestProps(BET_SEGMENTS_CONTAINER, false)}>
        <BetSegments
          colorIndicator={colorIndicator}
          icon={segmentsIcon}
          leftLabel={oddsLabel}
          leftValue={odds}
          leftPreviousValue={previousOdds}
          midLabel={stakeLabel}
          midValue={stake}
          rightValue={profitOrLiability}
          rightPreviousValue={previousProfitOrLiability}
          rightLabel={profitOrLiabilityLabel}
          isOddsBoosted={isPriceBoosted || hasMyOddsBoost}
          size={BetSegmentsSize.SMALL}
        />
        {hasAnyBonus && (
          <>
            {!!freeBetsLabel && <FreeBets label={freeBetsLabel} isSelected={hasBonusUsed} isReadOnly />}
            {!!generosityAlertMessage && (
              <Alert
                message={generosityAlertMessage}
                type={AlertType.Generosity}
                showCloseIcon={false}
                iconOverload={generosityIconName}
              />
            )}
          </>
        )}
      </View>
    </View>
  );
};
