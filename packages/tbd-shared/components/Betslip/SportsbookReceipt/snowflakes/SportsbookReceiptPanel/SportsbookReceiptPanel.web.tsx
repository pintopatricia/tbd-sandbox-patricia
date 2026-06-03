import type { FunctionComponent } from "react";
import { Fragment, useCallback, useMemo } from "react";
import * as React from "react";
import classnames from "classnames";

import {
  AlertType,
  FallbackIconType,
  SelectionsBoardTheme,
  StatusLabelSizeType,
  StatusLabelType,
  RoundButtonSize,
  RoundButtonState,
} from "@ppb/the-wall-common/types";
import type { Region } from "@ppb/the-wall-icons/traps";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName, ValueIconName } from "@ppb/the-wall-icons";
import { type BetInfoItem, BetInfoItemMode } from "@ppb/the-wall-common/types/BetInfo.types";

import {
  Alert,
  BetInfo,
  BetSegments,
  BetSelectionDetails,
  BetslipBetSummary,
  BetslipCastBet,
  BetsSummary,
  ForecastTricastSelection,
  SelectionsBoard,
  SelectionsBoardSection,
  SilkWrapper,
  TrapWrapper,
  SportsbookBetButton,
  SubHeader,
  FreeBets,
  StatusLabel,
} from "@ppb/the-wall-web";
import { RacingSport, CastBetRunnerSelectionProps } from "@ppb/tbd-store";
import LottoSelections from "@ppb/tbd-components-sports-betting/components/LottoCard/view/snowflakes/LottoSelections/LottoSelections.web";
import { BetBuilderSummary } from "./snowflakes/BetBuilderSummary/BetBuilderSummary.web";
import { BetSportsbookReceipt } from "./snowflakes/BetSportsbookReceipt/BetSportsbookReceipt.web";
import { BetSelections } from "./snowflakes/BetSelections/BetSelections.web";

import { SportsbookReceiptPanelViewModel } from "./SportsbookReceiptPanel.types";
import { BetSelection } from "./snowflakes/BetSelections/BetSelections.types";

import styles from "./SportsbookReceiptPanel.web.css";

const ReceiptIds: FunctionComponent<{
  betReceiptIdLabel: string;
  regulatorBetIdLabel: string;
  betReceiptId?: string;
  regulatorId?: string;
  onBetIdCopy: () => void;
  onRegulatorBetIdCopy: () => void;
}> = ({ betReceiptIdLabel, regulatorBetIdLabel, betReceiptId, regulatorId, onBetIdCopy, onRegulatorBetIdCopy }) => {
  const betInfoItems: BetInfoItem[] = [];

  if (betReceiptId) {
    betInfoItems.push({
      title: betReceiptIdLabel,
      mode: BetInfoItemMode.WITH_COPY,
      copyContent: {
        label: betReceiptId,
        onCopy: onBetIdCopy,
      },
    });
  }

  if (regulatorId && onRegulatorBetIdCopy) {
    betInfoItems.push({
      title: regulatorBetIdLabel,
      mode: BetInfoItemMode.WITH_COPY,
      copyContent: {
        label: regulatorId,
        onCopy: onRegulatorBetIdCopy,
      },
    });
  }

  if (betInfoItems.length === 0) {
    return <></>;
  }
  return <BetInfo items={betInfoItems} />;
};

export const SportsbookReceiptPanel: FunctionComponent<SportsbookReceiptPanelViewModel> = ({
  selections,
  boostedMultiples,
  multiples,
  casts,
  singles,
  betBuilders,
  multiBetBuilder,
  multiBetBuilderGroups = {},
  oneLineBets,
  topContent,
  potentialReturns,
  totalStake,
  totalOriginalReturns,
  isSummaryDisabled = false,
  isOddsBoosted,
  isDesktop,
  isTrapIconThrottleActive,
  hasShownReceiptIds,
  hasBoostSignposting,
  i18n,
  displayAllSubtitleTextSingles = false,
  showReuseSelectionsButton = true,
  onTitleClick,
  onReUseSelectionsClick,
  onBetIdCopy,
  onRegulatorBetIdCopy,
}) => {
  const betBuilderLabels = useMemo(
    () => ({
      odds: i18n.oddsLabel,
      stake: i18n.stakeLabel,
      returns: i18n.returnsLabel,
    }),
    [i18n.oddsLabel, i18n.returnsLabel, i18n.stakeLabel],
  );
  const summaryStaticLabels = useMemo(
    () => ({
      oddsLabel: i18n.oddsLabel,
      returnsLabel: i18n.returnsLabel,
      stakeLabel: i18n.stakeLabel,
      eachWayLabel: i18n.eachWayLabel,
      linesLabel: i18n.linesLabel,
      accaInsuranceLabel: i18n.accaInsuranceLabel,
    }),
    [i18n.accaInsuranceLabel, i18n.eachWayLabel, i18n.linesLabel, i18n.oddsLabel, i18n.returnsLabel, i18n.stakeLabel],
  );

  const getIconWrapper = useCallback(
    (
      racingSport?: number,
      icon?: string,
      silkFallbackType?: FallbackIconType,
      meetingCountry?: Region,
      trap?: string | number,
    ) => {
      if (racingSport === RacingSport.HORSE_RACING) {
        return <SilkWrapper silkUrl={icon} silkFallbackType={silkFallbackType} />;
      }

      if (racingSport === RacingSport.GREYHOUND_RACING && trap && isTrapIconThrottleActive) {
        return <TrapWrapper region={meetingCountry ?? "AGNOSTIC"} trap={trap} size="small" />;
      }

      return undefined;
    },
    [isTrapIconThrottleActive],
  );

  const mainSectionClassNames = classnames(styles.container, { [styles.scrollableMobile]: !isDesktop });

  const scrollableClassnames = classnames(styles.scrollable, {
    [styles.scrollableDesktop]: isDesktop,
  });

  const getIconForSelection = (selection: BetSelection | CastBetRunnerSelectionProps): React.ReactNode => {
    if (selection.racingSport === RacingSport.HORSE_RACING) {
      return (
        <SilkWrapper
          key={selection.id}
          silkUrl={selection.icon as string}
          silkFallbackType={selection.silkFallbackType}
          silkAlt={selection.icon as string}
        />
      );
    }

    if (selection.racingSport === RacingSport.GREYHOUND_RACING && selection.trap && isTrapIconThrottleActive) {
      return <TrapWrapper region={selection.meetingCountry ?? "AGNOSTIC"} trap={selection.trap} size="small" />;
    }

    return undefined;
  };

  return (
    <section className={mainSectionClassNames}>
      <section className={scrollableClassnames}>
        <section className={styles.alertContainer}>
          <Alert type={AlertType.Success} message={i18n.confirmationMessage} showCloseIcon={false} />
        </section>
        {topContent}
        {!!boostedMultiples.length && (
          <div className={styles.receiptContentContainer}>
            <header>
              <SubHeader text={i18n.boostedMultiplesTitleLabel || ""} tagName="h2" />
            </header>
            {boostedMultiples.map((boostedMultiple) => (
              <Fragment key={boostedMultiple.id}>
                <header className={styles.boostedMultiplesHeader}>
                  <div className={styles.boostedMultiplesIcon}>
                    <GenericIcon name={ValueIconName.ODDBOOST} preserveAspectRatio="preserveAspectRatio" />
                  </div>
                </header>
                <BetSelections
                  title={i18n.selectionsLabel}
                  selections={selections.map((selection) => ({
                    ...selection,
                    icon: getIconForSelection(selection),
                  }))}
                />
                <BetslipBetSummary
                  title={boostedMultiple.title}
                  odds={boostedMultiple.odds}
                  stake={boostedMultiple.stake}
                  returns={boostedMultiple.returns}
                  i18n={summaryStaticLabels}
                  hasAccaInsurance={boostedMultiple.hasAccaInsurance}
                  hasBonusUsed={boostedMultiple.hasBonusUsed}
                  freeBetsLabel={boostedMultiple.freeBetsLabel}
                  generosityAlertMessage={boostedMultiple.generosityAlertMessage}
                  generosityIconName={boostedMultiple.generosityIconName}
                />
              </Fragment>
            ))}
          </div>
        )}
        {!!multiBetBuilder && (
          <div className={styles.receiptContentContainer}>
            <header>
              <SubHeader text={i18n.multiBetBuilderTitleLabel || ""} tagName="h2" />
            </header>
            <SelectionsBoard title={multiBetBuilder.title} theme={SelectionsBoardTheme.Blue}>
              {Object.values(multiBetBuilderGroups).map(({ selections: mbbSelections, title, urn }) => (
                <SelectionsBoardSection key={urn} title={title}>
                  {mbbSelections.map((selection) => (
                    <BetSelectionDetails
                      key={selection.id}
                      title={selection.title}
                      subtitle={selection.subtitle}
                      is90Min={selection.is90Min}
                      selectionTypeIcon={selection.selectionTypeIcon}
                      icon={getIconWrapper(
                        selection.racingSport,
                        selection.icon,
                        selection.silkFallbackType,
                        selection.meetingCountry,
                        selection.trap,
                      )}
                    />
                  ))}
                </SelectionsBoardSection>
              ))}
            </SelectionsBoard>
            <div className={styles.combinationSummary}>
              <BetslipBetSummary
                title={multiBetBuilder.title}
                odds={multiBetBuilder.odds}
                previousOdds={multiBetBuilder.previousOdds}
                stake={multiBetBuilder.stake}
                returns={multiBetBuilder.returns}
                previousValue={multiBetBuilder.previousValue}
                i18n={summaryStaticLabels}
                hasAccaInsurance={false}
                hasShownReceiptIds={hasShownReceiptIds}
                hasMyOddsBoost={multiBetBuilder.hasMyOddsBoost}
                hasBonusUsed={multiBetBuilder.hasBonusUsed}
                freeBetsLabel={multiBetBuilder.freeBetsLabel}
                generosityAlertMessage={multiBetBuilder.generosityAlertMessage}
                generosityIconName={multiBetBuilder.generosityIconName}
              />
              {hasShownReceiptIds && (
                <ReceiptIds
                  betReceiptIdLabel={i18n.betReceiptIdLabel}
                  regulatorBetIdLabel={i18n.regulatorBetIdLabel}
                  betReceiptId={multiBetBuilder.betReceiptId}
                  regulatorId={multiBetBuilder.regulatorId}
                  onBetIdCopy={onBetIdCopy}
                  onRegulatorBetIdCopy={onRegulatorBetIdCopy}
                />
              )}
            </div>
          </div>
        )}
        {!!betBuilders.length && (
          <div className={styles.receiptContentContainer}>
            <header>
              <SubHeader text={i18n.betBuilderTitleLabel || ""} tagName="h2" />
            </header>

            <div className={styles.betBuilders}>
              {betBuilders.map((betBuilder) => (
                <div className={styles.betBuilder} key={betBuilder.id}>
                  <BetBuilderSummary
                    bet={betBuilder}
                    labels={betBuilderLabels}
                    hasShownReceiptIds={hasShownReceiptIds}
                  />
                  {hasShownReceiptIds && (
                    <ReceiptIds
                      betReceiptIdLabel={i18n.betReceiptIdLabel}
                      regulatorBetIdLabel={i18n.regulatorBetIdLabel}
                      betReceiptId={betBuilder.betReceiptId}
                      regulatorId={betBuilder.regulatorId}
                      onBetIdCopy={onBetIdCopy}
                      onRegulatorBetIdCopy={onRegulatorBetIdCopy}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {!!multiples.length && (
          <div className={styles.receiptContentContainer}>
            <header>
              <SubHeader text={i18n.multiplesTitleLabel} tagName="h2" />
            </header>
            <BetSelections
              title={i18n.selectionsLabel}
              selections={selections.map((selection) => ({
                ...selection,
                icon: getIconForSelection(selection),
              }))}
              onTitleClick={onTitleClick}
            />
            <div className={styles.multiples}>
              {multiples.map((summary, i) => {
                const key = `${summary.title}-${i}`;

                return (
                  <Fragment key={key}>
                    <BetslipBetSummary
                      title={summary.title}
                      odds={summary.odds}
                      stake={summary.stake}
                      returns={summary.returns}
                      previousValue={summary.previousValue}
                      previousOdds={summary.previousOdds}
                      i18n={summaryStaticLabels}
                      hasAccaInsurance={summary.hasAccaInsurance}
                      hasBonusUsed={summary.hasBonusUsed}
                      freeBetsLabel={summary.freeBetsLabel}
                      generosityAlertMessage={summary.generosityAlertMessage}
                      generosityIconName={summary.generosityIconName}
                      hasEachWay={summary.hasEachWay}
                      lines={summary.lines}
                      hasShownReceiptIds={hasShownReceiptIds}
                      hasMyOddsBoost={summary.hasMyOddsBoost}
                    />
                    {hasShownReceiptIds && (
                      <ReceiptIds
                        betReceiptIdLabel={i18n.betReceiptIdLabel}
                        regulatorBetIdLabel={i18n.regulatorBetIdLabel}
                        betReceiptId={summary.betReceiptId}
                        regulatorId={summary.regulatorId}
                        onBetIdCopy={onBetIdCopy}
                        onRegulatorBetIdCopy={onRegulatorBetIdCopy}
                      />
                    )}
                  </Fragment>
                );
              })}
            </div>
          </div>
        )}
        {!!casts.length && (
          <div className={styles.receiptContentContainer}>
            <header>
              <SubHeader text={i18n.castsTitleLabel} tagName="h2" />
            </header>
            <div className={styles.castBetContainer}>
              {casts.map((castBet) => (
                <BetslipCastBet
                  key={castBet.betReceiptId}
                  isDesktop={isDesktop}
                  title={castBet.title}
                  subtitle={castBet.subtitle}
                  controls={
                    <div className={styles.combinationSummary}>
                      <BetSegments
                        leftLabel={i18n.linesLabel}
                        midLabel={i18n.stakeLabel}
                        rightLabel={i18n.returnsLabel}
                        leftValue={castBet.lines.toString()}
                        midValue={castBet.stake}
                        rightValue={castBet.returns}
                      />
                      {hasShownReceiptIds && (
                        <ReceiptIds
                          betReceiptIdLabel={i18n.betReceiptIdLabel}
                          regulatorBetIdLabel={i18n.regulatorBetIdLabel}
                          betReceiptId={castBet.betReceiptId}
                          regulatorId={castBet.regulatorId}
                          onBetIdCopy={onBetIdCopy}
                          onRegulatorBetIdCopy={onRegulatorBetIdCopy}
                        />
                      )}
                      {castBet.hasBonusUsed && !!castBet.freeBetsLabel && (
                        <div className={styles.option}>
                          <FreeBets label={castBet.freeBetsLabel} isReadOnly isSelected={castBet.hasBonusUsed} />
                        </div>
                      )}
                      {!!castBet.generosityAlertMessage && (
                        <Alert
                          message={castBet.generosityAlertMessage}
                          type={AlertType.Generosity}
                          showCloseIcon={false}
                          iconOverload={castBet.generosityIconName}
                        />
                      )}
                    </div>
                  }
                  runners={castBet.selections.map((selection, index) => {
                    const { id, horse, position, positionOrdinal } = selection;

                    return (
                      <ForecastTricastSelection
                        key={index}
                        id={id}
                        horse={horse}
                        position={position}
                        positionOrdinal={positionOrdinal}
                        icon={getIconForSelection(selection)}
                      />
                    );
                  })}
                />
              ))}
            </div>
          </div>
        )}
        {(!!singles.length || !!oneLineBets?.length) && (
          <div className={styles.receiptContentContainer}>
            <header>
              <SubHeader text={i18n.singlesTitleLabel} tagName="h2" />
            </header>
            <div className={styles.singles}>
              {singles.map((single, i) => {
                const { title, isPriceBoosted, boostedInfo } = single;
                const key = `${title}-${i}`;

                return (
                  <div className={styles.single} key={key}>
                    {!!isPriceBoosted && !!hasBoostSignposting && (
                      <div className={styles.singleSignposting}>
                        <StatusLabel
                          text={boostedInfo?.label ?? ""}
                          iconName={boostedInfo?.iconName}
                          statusLabelSize={StatusLabelSizeType.MEDIUM}
                          statusLabelType={StatusLabelType.ALTERNATIVE_BRANDED}
                        />
                      </div>
                    )}
                    <BetSportsbookReceipt
                      title={single.title}
                      subtitle={single.subtitle}
                      odds={single.odds}
                      previousOdds={single.previousOdds}
                      segmentsIcon={single.segmentsIcon}
                      stake={single.stake}
                      profitOrLiability={single.profitOrLiability}
                      previousProfitOrLiability={single.previousProfitOrLiability}
                      oddsLabel={i18n.oddsLabel}
                      stakeLabel={i18n.stakeLabel}
                      profitOrLiabilityLabel={i18n.returnsLabel}
                      hasBonusUsed={single.hasBonusUsed}
                      freeBetsLabel={single.freeBetsLabel}
                      generosityAlertMessage={single.generosityAlertMessage}
                      generosityIconName={single.generosityIconName}
                      icon={single.icon}
                      meetingCountry={single.meetingCountry}
                      trap={isTrapIconThrottleActive ? single.trap : undefined}
                      silkIconAlt={single.silkIconAlt}
                      silkFallbackIconType={single.silkFallbackIconType}
                      racingSport={single.racingSport}
                      hasEachWay={single.hasEachWay}
                      eachWayLabel={i18n.eachWayLabel}
                      eachWaySubtitle={single.eachWaySubtitle}
                      isPriceBoosted={single.isPriceBoosted}
                      hasMyOddsBoost={single.hasMyOddsBoost}
                      is90Min={single.is90Min}
                      selectionTypeIcon={single.selectionTypeIcon}
                      isGuaranteedPriceSelected={single.isGuaranteedPriceSelected}
                      guaranteedPriceLabel={i18n.guaranteedPriceLabel}
                      displayAllSubtitleText={displayAllSubtitleTextSingles}
                    />
                    {hasShownReceiptIds && (
                      <ReceiptIds
                        betReceiptIdLabel={i18n.betReceiptIdLabel}
                        regulatorBetIdLabel={i18n.regulatorBetIdLabel}
                        betReceiptId={single.betReceiptId}
                        regulatorId={single.regulatorId}
                        onBetIdCopy={onBetIdCopy}
                        onRegulatorBetIdCopy={onRegulatorBetIdCopy}
                      />
                    )}
                  </div>
                );
              })}
              {oneLineBets?.map((oneLine, i) => {
                const {
                  runners,
                  title,
                  subtitle,
                  odds,
                  stake,
                  profitOrLiability,
                  hasBonusUsed,
                  freeBetsLabel,
                  generosityAlertMessage,
                  selectionTypeIcon,
                  regulatorId,
                  betReceiptId,
                } = oneLine;
                const key = `${title}-${i}`;

                return (
                  <div className={styles.single} key={key}>
                    <BetSportsbookReceipt
                      title={
                        !!runners && (
                          <LottoSelections
                            runners={runners}
                            size={RoundButtonSize.SMALL}
                            state={RoundButtonState.READ_ONLY}
                          />
                        )
                      }
                      subtitle={subtitle}
                      odds={odds}
                      stake={stake}
                      profitOrLiability={profitOrLiability}
                      oddsLabel={i18n.oddsLabel}
                      stakeLabel={i18n.stakeLabel}
                      profitOrLiabilityLabel={i18n.returnsLabel}
                      hasBonusUsed={hasBonusUsed}
                      freeBetsLabel={freeBetsLabel}
                      generosityAlertMessage={generosityAlertMessage}
                      hasEachWay={false}
                      eachWayLabel={i18n.eachWayLabel}
                      eachWaySubtitle={""}
                      isPriceBoosted={false}
                      selectionTypeIcon={selectionTypeIcon}
                      hasMyOddsBoost={false}
                      isGuaranteedPriceSelected={false}
                      guaranteedPriceLabel={i18n.guaranteedPriceLabel}
                      displayAllSubtitleText={displayAllSubtitleTextSingles}
                    />
                    {hasShownReceiptIds && (
                      <ReceiptIds
                        betReceiptIdLabel={i18n.betReceiptIdLabel}
                        regulatorBetIdLabel={i18n.regulatorBetIdLabel}
                        betReceiptId={betReceiptId}
                        regulatorId={regulatorId}
                        onBetIdCopy={onBetIdCopy}
                        onRegulatorBetIdCopy={onRegulatorBetIdCopy}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
      <footer className={styles.summary}>
        <BetsSummary
          disabled={isSummaryDisabled}
          totalStakeLabel={i18n.totalStakeLabel}
          totalReturnsLabel={i18n.totalReturnsLabel}
          totalReturns={potentialReturns}
          totalStake={totalStake}
          totalOriginalReturns={totalOriginalReturns}
          isOddsBoosted={isOddsBoosted}
        />
        {showReuseSelectionsButton && (
          <SportsbookBetButton
            animated={false}
            onClick={onReUseSelectionsClick}
            label={i18n.reUseSelectionsLabel}
            icon={SystemIconName.ACC_ADD}
          />
        )}
      </footer>
    </section>
  );
};
