import type { FunctionComponent } from "react";
import { useLayoutEffect, useCallback, useContext, useMemo, useState, useRef } from "react";

import { QuickStakes } from "@ppb/the-wall-web";
import { type BetslipCards } from "./snowflakes/SportsbookPlacePanel/SportsbookPlacePanel.types";

import UpsellSuggestions from "@ppb/tbd-components-flexible-betting-opportunities/components/UpsellSuggestions/view/UpsellSuggestions.web";
import { BetslipSection } from "../Betslip.types";
import { ConfigContext } from "../../Config/ConfigContext";
import ConnectedNotifier from "../Notifier";
import { Notifier } from "../Notifier/Notifier.web";
import { KeyboardContext } from "../Keyboard/KeyboardContext";
import ConnectedSinglesCard from "../SinglesCard";
import { SinglesCard } from "../SinglesCard/SinglesCard.web";
import ConnectedBetBuildersCard from "../BetBuildersCard";
import { BetBuildersCard } from "../BetBuildersCard/BetBuildersCard.web";
import ConnectedCastBetsCard from "../CastBetsCard";
import { CastBetsCard } from "../CastBetsCard/CastBetsCard.web";
import ConnectedMultiBetBuilderCard from "../MultiBetBuilderCard";
import { MultiBetBuilderCard } from "../MultiBetBuilderCard/MultiBetBuilderCard.web";
import { OneLineMultiple } from "../OneLineMultiple/OneLineMultiple.web";
import ConnectedOneLineMultiple from "../OneLineMultiple";
import { PriceBoostSection } from "../PriceBoostSection/PriceBoostSection.web";
import ConnectedPriceBoostSection from "../PriceBoostSection";
import { MultiLinesMultiples } from "../MultiLinesMultiples/MultiLinesMultiples.web";
import ConnectedMultiLinesMultiples from "../MultiLinesMultiples";
import { buildDepositRedirectPayload } from "../betslip-deposit-redirect-mapper";
import { useRefContext } from "../../../hooks/useRefContext";
import { getAuthData } from "../../../config/endpoints";

import { ComponentProps } from "./props";
import styles from "./SportsbookPlace.web.css";
import { EmptyBetslip } from "../EmptyBetslip";
import { FooterCustomKeyboard } from "../Keyboard/FooterCustomKeyboard.web";
import { useCollapseStrategy } from "./hooks/useCollapseStrategy";
import { SportsbookPlacePlaceholder } from "./SportsbookPlacePlaceholder.web";
import { SportsbookPlacePanelOrchestrator } from "./snowflakes/SportsbookPlacePanel/SportsbookPlacePanelOrchestrator.web";
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
  hasBetBuilders,
  hasPriceBoost,
  shouldFocusMultiple,
  shouldFocusBetBuilder,
  shouldFocusCastBet,
  focusedCard,
  firstCombinationId,
  placeBtnLabel,
  placeBtnSecondaryLabel,
  placeBtnLoadingLabel,
  reversePlaceBtnLabels,
  balanceAfterBet,
  isLoggedIn,
  isBetConfirmationStepActive,
  isDepositRequired,
  requiredDepositValue,
  isPanelDisabled,
  isOddsMovementOn,
  showAcceptOddsMovementAlert,
  oddsMovementLabels,
  isCollapsed,
  i18n,
  termsUrl,
  hasOneLineMultiple,
  hasMultipleLinesMultiples,
  shouldDisplayPlaceholder,
  marketSelections,
  freeBetsAlertMessage,
  quickStakes,
  separator,
  currencySymbol,
  dispatchPlacement,
  dispatchRemoveAll,
  dispatchSportsbookBonusToggle,
  dispatchLogin,
  dispatchConfirmBet,
  dispatchDepositRedirect,
  dispatchNavigate,
  dispatchAccordionToggle,
  dispatchTabSwitch,
  dispatchLoginToPlaceBetAction,
  dispatchFreeBetsRemoveAction,
  dispatchIncrementPress,
  dispatchOddsMovementChange,
}) => {
  const [, setScrollableRef] = useRefContext();
  const { isDesktopLayout } = useContext(ConfigContext);
  const {
    focusedKeyboardControls: { focusedCombinationId },
    setFocusedKeyboardControls,
  } = useContext(KeyboardContext);
  const ref = useRef<HTMLDivElement | null>(null);
  const [placeholderHeight, setPlaceholderHeight] = useState<number>(0);
  const betControlsExperimentVariant = useExperimentVariant("betslip-bet-controls-order");

  useLayoutEffect(() => {
    if (ref.current?.offsetHeight) {
      setPlaceholderHeight(ref?.current?.offsetHeight);
    }
  }, [ref.current?.offsetHeight]);

  /**
   * It's necessary to clear the focusedInputId whenever the betslip changes in its composition, so that its value
   * could be assigned in the BetControls component if it's the instance that should receive the automatic focus.
   * However, the focusedInputId shouldn't be clean when focusedCard is "singles" or if the focused input is the first
   * combination.
   */
  const clearFocusedInputId = useCallback(() => {
    if (focusedCard !== BetslipSection.singles || firstCombinationId !== focusedCombinationId) {
      setFocusedKeyboardControls((prev) => ({
        ...prev,
        focusedInputId: null,
      }));
    }
    // We do not need to listen for all the dependencies of the effect,
    // adding focusedInputId props to this effect produces undesired outputs and running at the wrong times
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedCard, firstCombinationId, setFocusedKeyboardControls]);

  useLayoutEffect(() => {
    clearFocusedInputId();
  }, [clearFocusedInputId]);

  const handlePlaceClick = useCallback(() => {
    if (!isLoggedIn) {
      dispatchLoginToPlaceBetAction();

      const { SSO_URL } = getAuthData() || {};
      const ssoWithRedirectUrl = `${SSO_URL}&url=${encodeURIComponent(window.location.href)}`;

      dispatchLogin(ssoWithRedirectUrl);

      return;
    }

    if (isBetConfirmationStepActive) {
      dispatchConfirmBet();

      return;
    }

    if (isDepositRequired) {
      const { viewUrn, viewUrl } = buildDepositRedirectPayload(window.location.href, requiredDepositValue);

      dispatchDepositRedirect();
      dispatchNavigate(viewUrn, viewUrl);

      return;
    }

    dispatchPlacement();
  }, [
    dispatchConfirmBet,
    dispatchDepositRedirect,
    dispatchLogin,
    dispatchLoginToPlaceBetAction,
    dispatchNavigate,
    dispatchPlacement,
    isBetConfirmationStepActive,
    isDepositRequired,
    isLoggedIn,
    requiredDepositValue,
  ]);

  const handleFreeBetsChange = useCallback(() => {
    dispatchSportsbookBonusToggle(isFreeBetsSelected);
  }, [dispatchSportsbookBonusToggle, isFreeBetsSelected]);

  const upsellSuggestionsCard = useMemo(
    () => <UpsellSuggestions isDesktop={isDesktopLayout} marketSelections={marketSelections} />,
    [isDesktopLayout, marketSelections],
  );

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

  const notifications = useMemo(
    () => (
      <ConnectedNotifier
        className={styles.notificationsListContainer}
        component={Notifier}
        isBetslipCollapsed={isCollapsed}
      />
    ),
    [isCollapsed],
  );

  const betslipCards: BetslipCards[] = useMemo(() => {
    const betslipSectionsContents = {
      [BetslipSection.upsellSuggestions]: {
        card: upsellSuggestionsCard,
        title: "",
        startsOpen: false,
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

  const onQuickStakePress = useCallback(
    (stake: number) => {
      if (focusedCombinationId) {
        dispatchIncrementPress(focusedCombinationId, stake, currencySymbol);
      }
    },
    [focusedCombinationId, dispatchIncrementPress, currencySymbol],
  );

  const quickStakesComponent = useMemo(
    () => (
      <div className={styles.quickStakes}>
        <QuickStakes quickStakes={quickStakes} onTouch={onQuickStakePress} isDisabled={isPanelDisabled} />
      </div>
    ),
    [quickStakes, isPanelDisabled, onQuickStakePress],
  );

  const footerPrefix = useMemo(
    () => (
      <FooterCustomKeyboard
        className={styles.keyboardContainer}
        prefix={quickStakesComponent}
        separator={separator}
        isDisabled={isPanelDisabled || false}
        shouldScrollIntoView={!isCollapsed}
      />
    ),
    [isCollapsed, isPanelDisabled, quickStakesComponent, separator],
  );

  const collapseAwareCards = useCollapseStrategy(betslipCards, collapseStrategy);

  if (shouldDisplayPlaceholder) {
    if (isDesktopLayout) {
      return <EmptyBetslip />;
    }

    return <SportsbookPlacePlaceholder height={placeholderHeight} />;
  }

  return (
    <div ref={ref}>
      <SportsbookPlacePanelOrchestrator
        ref={setScrollableRef}
        isDesktopLayout={isDesktopLayout}
        betslipCards={collapseAwareCards}
        betControlsExperimentVariant={betControlsExperimentVariant}
        hasFreeBets={isEligibleToBonus}
        isFreeBetsSelected={isFreeBetsSelected}
        freeBetsAlertMessage={freeBetsAlertMessage}
        onFreeBetsRemovePress={dispatchFreeBetsRemoveAction}
        isOddsBoosted={isOddsBoosted}
        totalReturns={totalReturns}
        totalOriginalReturns={totalOriginalReturns}
        hasPlaceError={hasPlaceError || isDepositRequired || !isLoggedIn}
        isPlaceDisabled={isPlaceDisabled}
        isSummaryDisabled={isSummaryDisabled}
        notifications={notifications}
        footerPrefix={footerPrefix}
        placeBtnLabel={placeBtnLabel}
        placeBtnSecondaryLabel={placeBtnSecondaryLabel}
        placeBtnLoadingLabel={placeBtnLoadingLabel}
        reversePlaceBtnLabels={reversePlaceBtnLabels}
        isDesktop={isDesktopLayout}
        balanceAfterBet={balanceAfterBet}
        i18n={i18n}
        termsUrl={termsUrl}
        isPanelDisabled={isPanelDisabled}
        isOddsMovementOn={isOddsMovementOn}
        showAcceptOddsMovementAlert={showAcceptOddsMovementAlert}
        oddsMovementLabels={oddsMovementLabels}
        onPlaceClick={handlePlaceClick}
        onRemoveAllClick={dispatchRemoveAll}
        onFreeBetsChange={handleFreeBetsChange}
        onCollapseToggle={dispatchAccordionToggle}
        onOddsMovementPreferencesChange={dispatchOddsMovementChange}
        onTabSwitch={dispatchTabSwitch}
        isLoggedIn={isLoggedIn}
        hasSingles={hasSingles}
        hasOnlyOneSingle={hasOnlyOneSingle}
        hasOneLineMultiple={hasOneLineMultiple}
        hasMultipleLinesMultiples={hasMultipleLinesMultiples}
        hasMultiBetBuilder={hasMultiBetBuilder}
        hasCastBets={hasCastBets}
        shouldFocusMultiple={shouldFocusMultiple}
        shouldFocusBetBuilder={shouldFocusBetBuilder}
        shouldFocusCastBet={shouldFocusCastBet}
        hasPriceBoost={hasPriceBoost}
        hasBetBuilders={hasBetBuilders}
        betBuilderIds={betBuilderIds}
        failedCombinationGroups={failedCombinationGroups}
        boostedCombinationIds={boostedCombinationIds}
        failedCombinationGroupIds={failedCombinationGroupIds}
      />
    </div>
  );
};
