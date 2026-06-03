import type { FunctionComponent } from "react";
import { useMemo } from "react";

import {
  AlertType,
  BetDetailsAction,
  BetDetailsColor,
  BetSegmentsSize,
  FallbackIconType,
} from "@ppb/the-wall-common/types";
import { Alert, BetDetails, BetSegments, FreeBets, Option, SilkWrapper, TrapWrapper } from "@ppb/the-wall-web";
import { RacingSport } from "@ppb/tbd-store";
import styles from "./BetSportsbookReceipt.web.css";
import { BetSportsbookReceiptProps } from "./BetSportsbookReceipt.types";

export const BetSportsbookReceipt: FunctionComponent<BetSportsbookReceiptProps> = ({
  title,
  subtitle,
  odds,
  previousOdds,
  segmentsIcon,
  stake,
  profitOrLiability,
  oddsLabel,
  stakeLabel,
  colorIndicator,
  profitOrLiabilityLabel,
  previousProfitOrLiability,
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
    <article className={styles.betReceiptContainer}>
      <BetDetails
        tagName="div"
        title={title}
        subtitle={subtitle}
        color={isPriceBoosted ? BetDetailsColor.Black : BetDetailsColor.Teal}
        icon={IconComponent}
        action={BetDetailsAction.None}
        is90Min={is90Min}
        selectionTypeIcon={selectionTypeIcon}
        isGuaranteedPriceSelected={isGuaranteedPriceSelected}
        guaranteedPriceLabel={guaranteedPriceLabel}
        displayAllSubtitleText={displayAllSubtitleText}
      />
      <div className={styles.content}>
        {hasEachWay && <Option title={eachWayLabel} subtitle={eachWaySubtitle} isSelected isReadOnly />}
        <BetSegments
          colorIndicator={colorIndicator}
          icon={segmentsIcon}
          leftLabel={oddsLabel}
          leftValue={odds}
          leftPreviousValue={previousOdds}
          midLabel={stakeLabel}
          midValue={stake}
          rightLabel={profitOrLiabilityLabel}
          rightValue={profitOrLiability}
          rightPreviousValue={previousProfitOrLiability}
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
      </div>
    </article>
  );
};
