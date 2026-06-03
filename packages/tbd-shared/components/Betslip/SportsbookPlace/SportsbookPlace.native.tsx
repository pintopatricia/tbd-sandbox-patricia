import { FunctionComponent, useCallback, useContext, useMemo } from "react";
import { View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import useLoginWithPendingState from "../../../hooks/useLoginWithPendingState.native";
import { navigateDeposit } from "@ppb/tbd-router/native";
import { QuickStakes } from "@ppb/the-wall-native";
import { QuickStakesOnTouch } from "@ppb/the-wall-common/types";
import { BetslipCards } from "./snowflakes/SportsbookPlacePanel/SportsbookPlacePanel.types";
import UpsellSuggestions from "@ppb/tbd-components-flexible-betting-opportunities/components/UpsellSuggestions/view/UpsellSuggestions.native";
import { BetslipSection } from "../Betslip.types";
import ConnectedSinglesCard from "../SinglesCard";
import { SinglesCard } from "../SinglesCard/SinglesCard.native";
import ConnectedBetBuildersCard from "../BetBuildersCard";
import { BetBuildersCard } from "../BetBuildersCard/BetBuildersCard.native";
import ConnectedCastBetsCard from "../CastBetsCard";
import { CastBetsCard } from "../CastBetsCard/CastBetsCard.native";
import ConnectedMultiBetBuilderCard from "../MultiBetBuilderCard";
import { MultiBetBuilderCard } from "../MultiBetBuilderCard/MultiBetBuilderCard.native";
import ConnectedNotifier from "../Notifier";
import { Notifier } from "../Notifier/Notifier.native";
import { getEndpoint } from "../../../config/endpoints";
import { OneLineMultiple } from "../OneLineMultiple/OneLineMultiple.native";
import ConnectedOneLineMultiple from "../OneLineMultiple";
import { PriceBoostSection } from "../PriceBoostSection/PriceBoostSection.native";
import ConnectedPriceBoostSection from "../PriceBoostSection";
import { MultiLinesMultiples } from "../MultiLinesMultiples/MultiLinesMultiples.native";
import ConnectedMultiLinesMultiples from "../MultiLinesMultiples";
import { ComponentProps } from "./props";
import styles from "./SportsbookPlace.native.styles";
import { useCollapseStrategy } from "./hooks/useCollapseStrategy";
import { SportsbookPlacePanelOrchestrator } from "./snowflakes/SportsbookPlacePanel/SportsbookPlacePanelOrchestrator.native";
import { KeyboardContext } from "../Keyboard/KeyboardContext";
import { FooterCustomKeyboard } from "../Keyboard/FooterCustomKeyboard.native";
import { useExperimentVariant } from "../../../experimentation/hooks/useExperimentVariant";

export const SportsbookPlace: FunctionComponent<ComponentProps> = ({
  betslipCardsOrder,
  collapseStrategy,
  betBuilderIds,
  boostedCombinationIds,
  failedCombinationGroups,
  failedCombinationGroupIds,
  totalReturns,
  totalOriginalReturns,
  hasPlaceError,
  isPlaceDisabled,
  isSummaryDisabled,
  isFreeBetsSelected,
  isOddsBoosted,
  isEligibleToBonus,
  hasSingles,
  hasOnlyOneSingle,
  hasMultiBetBuilder,
  hasCastBets,
  hasOneLineMultiple,
  hasMultipleLinesMultiples,
  hasBetBuilders,
  hasPriceBoost,
  shouldFocusMultiple,
  shouldFocusBetBuilder,
  shouldFocusCastBet,
  focusedCard,
  isOddsMovementOn,
  oddsMovementLabels,
  showAcceptOddsMovementAlert,
  placeBtnLabel,
  placeBtnSecondaryLabel,
  placeBtnLoadingLabel,
  reversePlaceBtnLabels,
  balanceAfterBet,
  isLoggedIn,
  isBetConfirmationStepActive,
  isDepositRequired,
  requiredDepositValue,
  i18n,
  isPanelDisabled,
  freeBetsAlertMessage,
  dispatchPlacement,
  dispatchRemoveAll,
  dispatchSportsbookBonusToggle,
  dispatchDepositRedirect,
  dispatchAccordionToggle,
  dispatchLoginToPlaceBetAction,
  dispatchConfirmBet,
  dispatchTabSwitch,
  dispatchFreeBetsRemoveAction,
  dispatchIncrementPress,
  quickStakes = [],
  marketSelections,
  dispatchOddsMovementChange,
}) => {
  const login = useLoginWithPendingState();
  const betControlsExperimentVariant = useExperimentVariant("betslip-bet-controls-order");

  const {
    focusedKeyboardControls: { focusedCombinationId },
  } = useContext(KeyboardContext);

  const handlePlaceClick = useCallback(() => {
    if (!isLoggedIn) {
      dispatchLoginToPlaceBetAction();
      login();
      return;
    }

    if (isBetConfirmationStepActive) {
      dispatchConfirmBet();

      return;
    }

    if (isDepositRequired) {
      dispatchDepositRedirect();
      const url = new URL(getEndpoint("DEPOSIT"));
      if (requiredDepositValue) {
        url.searchParams.set("amount", requiredDepositValue.toString());
      }
      navigateDeposit(url.toString());

      return;
    }

    dispatchPlacement();
  }, [
    isLoggedIn,
    isBetConfirmationStepActive,
    isDepositRequired,
    requiredDepositValue,
    dispatchPlacement,
    dispatchLoginToPlaceBetAction,
    login,
    dispatchConfirmBet,
    dispatchDepositRedirect,
  ]);

  const handleFreeBetsChange = useCallback(() => {
    dispatchSportsbookBonusToggle(isFreeBetsSelected);
  }, [dispatchSportsbookBonusToggle, isFreeBetsSelected]);

  const isFocused = useIsFocused();

  const upsellSuggestionsCard = useMemo(() => {
    if (!isFocused || !marketSelections || marketSelections.length === 0) {
      return undefined;
    }
    return <UpsellSuggestions marketSelections={marketSelections} visible={isFocused} />;
  }, [isFocused, marketSelections]);

  const priceBoostMultisCard = useMemo(
    () =>
      hasPriceBoost ? (
        <ConnectedPriceBoostSection
          component={PriceBoostSection}
          boostedCombinationIds={boostedCombinationIds}
          failedCombinationGroupIds={failedCombinationGroupIds}
          shouldFocusStakeField={focusedCard === BetslipSection.priceBoostMultis}
          betControlsExperimentVariant={betControlsExperimentVariant}
        />
      ) : undefined,
    [hasPriceBoost, boostedCombinationIds, failedCombinationGroupIds, focusedCard, betControlsExperimentVariant],
  );

  const multiBetBuilderCard = useMemo(
    () =>
      hasMultiBetBuilder ? (
        <ConnectedMultiBetBuilderCard
          component={MultiBetBuilderCard}
          shouldFocusStakeField={focusedCard === BetslipSection.bbMulti}
          betControlsExperimentVariant={betControlsExperimentVariant}
        />
      ) : undefined,
    [hasMultiBetBuilder, focusedCard, betControlsExperimentVariant],
  );

  const oneLineMultiple = useMemo(
    () =>
      hasOneLineMultiple ? (
        <ConnectedOneLineMultiple
          component={OneLineMultiple}
          hasOneLineMultiple={hasOneLineMultiple}
          shouldFocusStakeField={focusedCard === BetslipSection.oneLineMultiple}
          betControlsExperimentVariant={betControlsExperimentVariant}
        />
      ) : undefined,
    [hasOneLineMultiple, focusedCard, betControlsExperimentVariant],
  );

  const multiLinesMultiples = useMemo(
    () =>
      hasMultipleLinesMultiples ? (
        <ConnectedMultiLinesMultiples
          component={MultiLinesMultiples}
          shouldFocusStakeField={focusedCard === BetslipSection.multiLinesMultiples}
        />
      ) : undefined,
    [hasMultipleLinesMultiples, focusedCard],
  );

  const betBuildersCard = useMemo(
    () =>
      hasBetBuilders ? (
        <ConnectedBetBuildersCard
          component={BetBuildersCard}
          combinationIds={betBuilderIds}
          failedCombinationGroups={failedCombinationGroups}
          shouldFocusStakeField={focusedCard === BetslipSection.betBuilders}
          betControlsExperimentVariant={betControlsExperimentVariant}
        />
      ) : undefined,
    [hasBetBuilders, betBuilderIds, failedCombinationGroups, focusedCard, betControlsExperimentVariant],
  );

  const castBetsCard = useMemo(
    () =>
      hasCastBets ? (
        <ConnectedCastBetsCard
          component={CastBetsCard}
          shouldFocusStakeField={focusedCard === BetslipSection.castBets}
        />
      ) : undefined,
    [hasCastBets, focusedCard],
  );

  const singlesCard = useMemo(
    () =>
      hasSingles ? (
        <ConnectedSinglesCard
          component={SinglesCard}
          hasAvailabilityHints
          shouldFocusStakeField={focusedCard === BetslipSection.singles}
        />
      ) : undefined,
    [focusedCard, hasSingles],
  );

  const onQuickStakePress = useCallback<QuickStakesOnTouch>(
    (value) => focusedCombinationId && !isPanelDisabled && dispatchIncrementPress(focusedCombinationId, value),
    [focusedCombinationId, isPanelDisabled, dispatchIncrementPress],
  );

  const quickStakesComponent = useMemo(
    () => (
      <View style={styles.quickStakesContainer}>
        <QuickStakes quickStakes={quickStakes} onTouch={onQuickStakePress} isDisabled={isPanelDisabled} />
      </View>
    ),
    [quickStakes, onQuickStakePress, isPanelDisabled],
  );

  const notifications = useMemo(
    () => <ConnectedNotifier style={styles.notificationsListContainer} component={Notifier} />,
    [],
  );

  const betslipCards: BetslipCards[] = useMemo(() => {
    const betslipSectionsContents = {
      [BetslipSection.upsellSuggestions]: {
        card: upsellSuggestionsCard,
        title: "",
        startsOpen: true,
        collapsable: false,
      },
      [BetslipSection.priceBoostMultis]: {
        card: priceBoostMultisCard,
        title: i18n.priceBoosts,
        startsOpen: true,
        collapsable: true,
      },
      [BetslipSection.bbMulti]: {
        card: multiBetBuilderCard,
        title: i18n.multiBetBuilder,
        startsOpen: true,
        collapsable: true,
      },
      [BetslipSection.betBuilders]: {
        card: betBuildersCard,
        title: i18n.betBuilder,
        startsOpen: true,
        collapsable: true,
      },
      [BetslipSection.oneLineMultiple]: {
        card: oneLineMultiple,
        title: i18n.multiples,
        startsOpen: true,
        collapsable: true,
      },
      [BetslipSection.multiLinesMultiples]: {
        card: multiLinesMultiples,
        title: i18n.additionalMultiples,
        startsOpen: true,
        collapsable: true,
      },
      [BetslipSection.castBets]: {
        card: castBetsCard,
        title: i18n.casts,
        startsOpen: true,
        collapsable: true,
      },
      [BetslipSection.singles]: {
        card: singlesCard,
        title: i18n.singles,
        startsOpen: true,
        collapsable: !hasOnlyOneSingle,
      },
    };

    return betslipCardsOrder.reduce(
      (acc: BetslipCards[], { id, cardsOrder }) => [
        ...acc,
        { id, content: cardsOrder.map((betslipSection) => betslipSectionsContents[betslipSection]) },
      ],
      [],
    );
  }, [
    upsellSuggestionsCard,
    priceBoostMultisCard,
    i18n.priceBoosts,
    i18n.multiBetBuilder,
    i18n.betBuilder,
    i18n.multiples,
    i18n.additionalMultiples,
    i18n.casts,
    i18n.singles,
    multiBetBuilderCard,
    betBuildersCard,
    oneLineMultiple,
    multiLinesMultiples,
    castBetsCard,
    singlesCard,
    hasOnlyOneSingle,
    betslipCardsOrder,
  ]);

  const collapseAwareCards = useCollapseStrategy(betslipCards, collapseStrategy);
  const footerPrefix = useMemo(
    () => (
      <View>
        <FooterCustomKeyboard
          id={"test"}
          style={styles.keyboardContainer}
          prefix={quickStakesComponent}
          isDisabled={isPanelDisabled || false}
        />
      </View>
    ),
    [isPanelDisabled, quickStakesComponent],
  );

  return (
    <SportsbookPlacePanelOrchestrator
      isDesktopLayout={false}
      betControlsExperimentVariant={betControlsExperimentVariant}
      hasFreeBets={isEligibleToBonus}
      isFreeBetsSelected={isFreeBetsSelected}
      freeBetsAlertMessage={freeBetsAlertMessage}
      onFreeBetsRemovePress={dispatchFreeBetsRemoveAction}
      betslipCards={collapseAwareCards}
      footerPrefix={footerPrefix}
      totalReturns={totalReturns}
      totalOriginalReturns={totalOriginalReturns}
      hasPlaceError={hasPlaceError || isDepositRequired || !isLoggedIn}
      isPlaceDisabled={isPlaceDisabled}
      isPanelDisabled={isPanelDisabled}
      isSummaryDisabled={isSummaryDisabled}
      isOddsBoosted={isOddsBoosted}
      notifications={notifications}
      placeBtnLabel={placeBtnLabel}
      placeBtnSecondaryLabel={placeBtnSecondaryLabel}
      placeBtnLoadingLabel={placeBtnLoadingLabel}
      reversePlaceBtnLabels={reversePlaceBtnLabels}
      balanceAfterBet={balanceAfterBet}
      i18n={i18n}
      isOddsMovementOn={isOddsMovementOn}
      showAcceptOddsMovementAlert={showAcceptOddsMovementAlert}
      oddsMovementLabels={oddsMovementLabels}
      onPlaceClick={handlePlaceClick}
      onRemoveAllClick={dispatchRemoveAll}
      onFreeBetsChange={handleFreeBetsChange}
      onCollapseToggle={dispatchAccordionToggle}
      onTabSwitch={dispatchTabSwitch}
      isLoggedIn={isLoggedIn}
      hasSingles={hasSingles}
      hasOnlyOneSingle={hasOnlyOneSingle}
      hasOneLineMultiple={hasOneLineMultiple}
      hasMultipleLinesMultiples={hasMultipleLinesMultiples}
      hasMultiBetBuilder={hasMultiBetBuilder}
      hasCastBets={hasCastBets}
      hasPriceBoost={hasPriceBoost}
      shouldFocusMultiple={shouldFocusMultiple}
      shouldFocusBetBuilder={shouldFocusBetBuilder}
      shouldFocusCastBet={shouldFocusCastBet}
      hasBetBuilders={hasBetBuilders}
      betBuilderIds={betBuilderIds}
      failedCombinationGroups={failedCombinationGroups}
      boostedCombinationIds={boostedCombinationIds}
      failedCombinationGroupIds={failedCombinationGroupIds}
      onOddsMovementPreferencesChange={dispatchOddsMovementChange}
    />
  );
};
