import type { FunctionComponent } from "react";
import { useCallback, useMemo, Fragment } from "react";
import * as React from "react";
import { View, ScrollView } from "react-native";
import {
  SelectionsBoardTheme,
  FallbackIconType,
  AlertType,
  StatusLabelSizeType,
  StatusLabelType,
  RoundButtonSize,
  RoundButtonState,
} from "@ppb/the-wall-common/types";
import {
  SportsbookBetButton,
  BetSegments,
  BetsSummary,
  BetSummary,
  ForecastTricastSelection,
  SubHeader,
  BetInfo,
  SilkWrapper,
  Alert,
  SelectionsBoard,
  SelectionsBoardSection,
  BetSelectionDetails,
  CastBet,
  FreeBets,
  StatusLabel,
  TrapWrapper,
} from "@ppb/the-wall-native";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import type { Region } from "@ppb/the-wall-icons/traps";
import { SystemIconName, ValueIconName } from "@ppb/the-wall-icons";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { type BetInfoItem, BetInfoItemMode } from "@ppb/the-wall-common/types/BetInfo.types";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import LottoSelections from "@ppb/tbd-components-sports-betting/components/LottoCard/view/snowflakes/LottoSelections/LottoSelections.native";
import { RacingSport, CastBetRunnerSelectionProps } from "@ppb/tbd-store";
import { BetSportsbookReceipt } from "./snowflakes/BetSportsbookReceipt/BetSportsbookReceipt.native";
import { BetBuilderSummary } from "./snowflakes/BetBuilderSummary/BetBuilderSummary.native";
import { BetSelections } from "./snowflakes/BetSelections/BetSelections.native";
import { SportsbookReceiptPanelViewModel } from "./SportsbookReceiptPanel.types";

import styles from "./SportsbookReceiptPanel.native.styles";

import {
  SBK_RECEIPT,
  MULTIPLES_TITLE,
  SINGLE,
  SINGLES_TITLE,
  CASTS_TITLE,
  MULTIPLE,
  ONE_LINE_BET,
  BET_BUILDER,
  BET_BUILDER_TITLE,
  MULTI_BET_BUILDER_TITLE,
  BET_BUILDER_SUMMARY,
  RE_USE_SELECTIONS_CONTAINER,
  MULTI_BET_BUILDER,
  PUSH_NOTIFICATIONS_TOGGLE,
  TOP_CONTENT_CONTAINER,
} from "./SportsbookReceiptPanel.native.selectors";
import { BetSelection } from "./snowflakes/BetSelections/BetSelections.types";

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
  multiples,
  boostedMultiples,
  singles,
  casts,
  betBuilders,
  multiBetBuilder,
  multiBetBuilderGroups = {},
  oneLineBets,
  potentialReturns,
  totalOriginalReturns,
  totalStake,
  isSummaryDisabled = false,
  isTrapIconThrottleActive,
  isOddsBoosted,
  hasShownReceiptIds,
  hasBoostSignposting,
  i18n,
  notificationsSubscription,
  displayAllSubtitleTextSingles = false,
  showReuseSelectionsButton = true,
  onTitleClick,
  onReUseSelectionsClick,
  onBetIdCopy,
  onRegulatorBetIdCopy,
  topContent,
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
    <View style={styles.container} {...getTestProps(SBK_RECEIPT, false)}>
      <View style={styles.content}>
        <Alert type={AlertType.Success} message={i18n.confirmationMessage} showCloseIcon={false} />
        {notificationsSubscription && (
          <View {...getTestProps(PUSH_NOTIFICATIONS_TOGGLE, false)}>{notificationsSubscription}</View>
        )}
        <ScrollView contentContainerStyle={styles.scrollable}>
          {!!topContent && <View {...getTestProps(TOP_CONTENT_CONTAINER, false)}>{topContent}</View>}
          {!!boostedMultiples.length && (
            <View style={styles.receiptContentContainer}>
              <SubHeader text={i18n.boostedMultiplesTitleLabel} />
              <View>
                {boostedMultiples.map((boostedMultiple) => (
                  <Fragment key={boostedMultiple.id}>
                    <View style={styles.boostedMultiplesHeader}>
                      <View style={styles.boostedMultiplesIcon}>
                        <GenericIcon
                          name={ValueIconName.ODDBOOST}
                          preserveAspectRatio="preserveAspectRatio"
                          color={tokens.SportsbookReceiptPanelIconColour}
                        />
                      </View>
                    </View>
                    <BetSelections
                      title={i18n.selectionsLabel}
                      selections={selections.map((selection) => ({
                        ...selection,
                        icon: getIconForSelection(selection),
                      }))}
                    />
                    <BetSummary
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
              </View>
            </View>
          )}
          {!!multiBetBuilder && (
            <View style={styles.receiptContentContainer} {...getTestProps(MULTI_BET_BUILDER, false)}>
              <View {...getTestProps(MULTI_BET_BUILDER_TITLE, false)}>
                <SubHeader text={i18n.multiBetBuilderTitleLabel || ""} />
              </View>
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
              <View style={styles.combinationSummary}>
                <BetSummary
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
              </View>
            </View>
          )}
          {betBuilders.length > 0 && (
            <View style={styles.receiptContentContainer}>
              <View {...getTestProps(BET_BUILDER_TITLE, false)}>
                <SubHeader text={i18n.betBuilderTitleLabel || ""} />
              </View>

              <View style={styles.list} {...getTestProps(BET_BUILDER, false)}>
                {betBuilders.map((betBuilder) => (
                  <View style={styles.combination} key={betBuilder.id} {...getTestProps(BET_BUILDER_SUMMARY, false)}>
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
                  </View>
                ))}
              </View>
            </View>
          )}
          {multiples.length > 0 && (
            <View style={styles.receiptContentContainer}>
              <View testID={MULTIPLES_TITLE}>
                <SubHeader text={i18n.multiplesTitleLabel} />
              </View>
              <BetSelections
                title={i18n.selectionsLabel}
                selections={selections.map((selection) => ({
                  ...selection,
                  icon: getIconForSelection(selection),
                }))}
                onTitleClick={onTitleClick}
              />
              <View style={styles.combinationSummary}>
                {multiples.map((summary, i) => {
                  const key = `${summary.title}-${i}`;

                  return (
                    <View style={styles.combinationSummary} key={key} {...getTestProps(MULTIPLE, false)}>
                      <BetSummary
                        title={summary.title}
                        odds={summary.odds}
                        stake={summary.stake}
                        returns={summary.returns}
                        hasAccaInsurance={summary.hasAccaInsurance}
                        i18n={summaryStaticLabels}
                        previousValue={summary.previousValue}
                        previousOdds={summary.previousOdds}
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
                    </View>
                  );
                })}
              </View>
            </View>
          )}
          {casts.length > 0 && (
            <View style={styles.receiptContentContainer}>
              <View testID={CASTS_TITLE}>
                <SubHeader text={i18n.castsTitleLabel} />
              </View>
              <View style={styles.list}>
                {casts.map((castBet) => (
                  <CastBet
                    key={castBet.betReceiptId}
                    title={castBet.title}
                    subtitle={castBet.subtitle}
                    controls={
                      <View style={styles.combinationSummary}>
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
                          <View style={styles.option}>
                            <FreeBets label={castBet.freeBetsLabel} isReadOnly isSelected={castBet.hasBonusUsed} />
                          </View>
                        )}
                        {!!castBet.generosityAlertMessage && (
                          <Alert
                            message={castBet.generosityAlertMessage}
                            type={AlertType.Generosity}
                            showCloseIcon={false}
                            iconOverload={castBet.generosityIconName}
                          />
                        )}
                      </View>
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
              </View>
            </View>
          )}
          {(!!singles.length || !!oneLineBets?.length) && (
            <View style={styles.receiptContentContainer}>
              <View testID={SINGLES_TITLE}>
                <SubHeader text={i18n.singlesTitleLabel} />
              </View>

              <View style={styles.list}>
                {singles.map((single, i) => {
                  const { title, isPriceBoosted, boostedInfo } = single;

                  const key = `${title}-${i}`;

                  return (
                    <View style={styles.combination} key={key} {...getTestProps(SINGLE, false)}>
                      {!!isPriceBoosted && !!hasBoostSignposting && (
                        <View style={styles.singleSignposting}>
                          <StatusLabel
                            text={boostedInfo?.label ?? ""}
                            iconName={boostedInfo?.iconName}
                            statusLabelSize={StatusLabelSizeType.MEDIUM}
                            statusLabelType={StatusLabelType.ALTERNATIVE_BRANDED}
                          />
                        </View>
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
                        silkFallbackIconType={single.silkFallbackIconType}
                        racingSport={single.racingSport}
                        hasEachWay={single.hasEachWay}
                        eachWayLabel={i18n.eachWayLabel}
                        eachWaySubtitle={single.eachWaySubtitle}
                        is90Min={single.is90Min}
                        selectionTypeIcon={single.selectionTypeIcon}
                        isPriceBoosted={single.isPriceBoosted}
                        hasMyOddsBoost={single.hasMyOddsBoost}
                        isGuaranteedPriceSelected={single.isGuaranteedPriceSelected}
                        guaranteedPriceLabel={i18n.guaranteedPriceLabel}
                        isPushNotificationsUnavailable={single.isPushNotificationsUnavailable}
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
                    </View>
                  );
                })}
                {oneLineBets?.map((oneLineBet, i) => {
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
                  } = oneLineBet;
                  const key = `${title}-${i}`;

                  return (
                    <View style={styles.combination} key={key} {...getTestProps(ONE_LINE_BET, false)}>
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
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
      <View style={styles.summary}>
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
          <View style={styles.reUseSelectionsContainer} {...getTestProps(RE_USE_SELECTIONS_CONTAINER, false)}>
            <SportsbookBetButton
              animated={false}
              onClick={onReUseSelectionsClick}
              label={i18n.reUseSelectionsLabel}
              icon={SystemIconName.ACC_ADD}
            />
          </View>
        )}
      </View>
    </View>
  );
};
