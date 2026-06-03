import { FunctionComponent, useContext, useMemo, useCallback, useLayoutEffect } from "react";
import { View } from "react-native";

import useLoginWithPendingState from "../../../hooks/useLoginWithPendingState.native";
import { QuickStakes } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { QuickStakesOnTouch } from "@ppb/the-wall-common/types";
import { navigateDeposit } from "@ppb/tbd-router/native";
import ConnectedObbSingle from "../ObbSingle";
import ConnectedObbMultiple from "../ObbMultiple";
import ConnectedObbNotifier from "../ObbNotifier";

import { ObbSingle } from "../ObbSingle/ObbSingle.native";
import { ObbMultiple } from "../ObbMultiple/ObbMultiple.native";
import { ComponentProps } from "./props";
import { KeyboardContext } from "../Keyboard/KeyboardContext";
import styles from "./ObbPlace.native.styles";
import { getEndpoint } from "../../../config/endpoints";
import { ObbNotifier } from "../ObbNotifier/ObbNotifier.native";
import { OBB_BET_CONTROLS_QUICK_STAKE } from "../ObbBetControls/ObbBetControls.selectors";
import { FooterCustomKeyboard } from "../Keyboard/FooterCustomKeyboard.native";
import { SportsbookPlacePanel } from "../SportsbookPlace/snowflakes/SportsbookPlacePanel/SportsbookPlacePanel.native";
import {
  BetslipCards,
  BetslipSection,
} from "../SportsbookPlace/snowflakes/SportsbookPlacePanel/SportsbookPlacePanel.types";
import { BetslipCollapseStrategy, useCollapseStrategy } from "../SportsbookPlace/hooks/useCollapseStrategy";

export const ObbPlace: FunctionComponent<ComponentProps> = ({
  i18n,
  totalReturns,
  isPanelDisabled,
  isPlaceDisabled,
  hasError,
  isDepositRequired,
  isLoggedIn,
  placeBtnLabel,
  placeBtnSecondaryLabel,
  placeBtnLoadingLabel,
  reversePlaceBtnLabels,
  balanceAfterBet,
  quickStakes = [],
  dispatchOnRemoveAllClick,
  dispatchOnPlaceBetsClick,
  dispatchDepositRedirect,
  dispatchIncrementPress,
  dispatchAccordionToggle,
  currencySymbol,
  singles,
  multiplesGroups,
  termsUrl,
}) => {
  const login = useLoginWithPendingState();
  const {
    focusedKeyboardControls: { focusedCombinationId },
    setFocusedKeyboardControls,
  } = useContext(KeyboardContext);
  useLayoutEffect(() => {
    setFocusedKeyboardControls({
      focusedCombinationId: null,
      focusedInputId: null,
      focusedInputRef: null,
      focusedTargetRef: null,
    });
  }, [setFocusedKeyboardControls]);

  const handlePlaceClick = useCallback(() => {
    if (!isLoggedIn) {
      login();
      return;
    }

    if (isDepositRequired) {
      dispatchDepositRedirect();
      navigateDeposit(getEndpoint("DEPOSIT"));

      return;
    }

    dispatchOnPlaceBetsClick();
  }, [isLoggedIn, isDepositRequired, dispatchOnPlaceBetsClick, login, dispatchDepositRedirect]);

  const onQuickStakePress = useCallback<QuickStakesOnTouch>(
    (value) => {
      if (focusedCombinationId && !isPanelDisabled) {
        dispatchIncrementPress({ potentialBetId: focusedCombinationId, increment: value, currencySymbol });
      }
    },
    [focusedCombinationId, currencySymbol, isPanelDisabled, dispatchIncrementPress],
  );

  const onOddsMovementPreferencesChange = useCallback(() => {}, []);

  const oddsMovementLabels = useMemo(
    () => ({
      message: "",
      detailMessage: "",
    }),
    [],
  );

  const quickStakesComponent = useMemo(
    () => (
      <View style={styles.quickStakesContainer}>
        <QuickStakes
          quickStakes={quickStakes}
          onTouch={onQuickStakePress}
          isDisabled={isPanelDisabled}
          {...getTestProps(OBB_BET_CONTROLS_QUICK_STAKE)}
        />
      </View>
    ),
    [quickStakes, isPanelDisabled, onQuickStakePress],
  );

  const footerKeyboardPrefix = useMemo(
    () => (
      <View>
        <FooterCustomKeyboard
          style={styles.keyboardContainer}
          prefix={quickStakesComponent}
          isDisabled={false}
          id={"id"}
        />
      </View>
    ),
    [quickStakesComponent],
  );

  const singlesCard = useMemo(
    () => (
      <>
        {singles.map((single, index) => (
          <ConnectedObbSingle
            key={index}
            component={ObbSingle}
            potentialBetId={single}
            shouldFocusStakeField={singles.length === 1}
            hasAvailabilityHints={true}
            hasReturnsLabel={singles.length > 1}
          />
        ))}
      </>
    ),
    [singles],
  );

  /*
   * Now that the multiplesGroups variable is an array of arrays the useMemo will only make a shallow comparison of the outer array.
   * In order to avoid this, we need to make a deeper comparison of the multiplesGroups, or the useMemo will be useless here if the inner arrays change.
   * One way that we found was to create a stable reference that will have the stringified version of the multiplesGroups as a dependency.
   * And then use that stable reference in the multiplesCard useMemo dependencies.
   * This way, the multiplesCard useMemo will recompute when the inner arrays change. And having the stable reference separated from the main useMemo makes the code a little more performant.
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableMultipleGroups = useMemo(() => multiplesGroups, [JSON.stringify(multiplesGroups)]);

  const multiplesCard = useMemo(
    () => (
      <>
        {multiplesGroups.map((group, index) => (
          <ConnectedObbMultiple
            key={index}
            component={ObbMultiple}
            potentialBets={group}
            shouldFocusStakeField={false}
            hasAvailabilityHints={true}
            hasReturnsLabel={true}
          />
        ))}
      </>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stableMultipleGroups],
  );

  const betslipCards: BetslipCards[] = useMemo(() => {
    const cards: BetslipCards[] = [];

    if (multiplesGroups.length > 0) {
      cards.push({
        id: [BetslipSection.multiLinesMultiples].toString(),
        content: [
          {
            card: multiplesCard,
            title: i18n.multiples,
            startsOpen: true,
            collapsable: true,
          },
        ],
      });
    }

    cards.push({
      id: [BetslipSection.singles].toString(),
      content: [
        {
          card: singlesCard,
          title: i18n.singles,
          startsOpen: false,
          collapsable: singles.length > 1,
        },
      ],
    });

    return cards;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.multiples, i18n.singles, multiplesGroups, multiplesCard, singlesCard]);

  const collapseAwareCards = useCollapseStrategy(betslipCards, BetslipCollapseStrategy.FirstOpen);

  const notifications = useMemo(() => <ConnectedObbNotifier component={ObbNotifier} />, []);

  return (
    <SportsbookPlacePanel
      betslipCards={collapseAwareCards}
      footerPrefix={footerKeyboardPrefix}
      totalReturns={totalReturns}
      hasPlaceError={hasError || isDepositRequired || !isLoggedIn}
      isPlaceDisabled={isPlaceDisabled}
      isPanelDisabled={isPanelDisabled}
      isSummaryDisabled={isPanelDisabled}
      notifications={notifications}
      placeBtnLabel={placeBtnLabel}
      placeBtnSecondaryLabel={placeBtnSecondaryLabel}
      placeBtnLoadingLabel={placeBtnLoadingLabel}
      reversePlaceBtnLabels={reversePlaceBtnLabels}
      balanceAfterBet={balanceAfterBet}
      i18n={i18n}
      // TODO: Deprecate after SoBB merge (breaking change)
      onPlaceClick={handlePlaceClick}
      onRemoveAllClick={dispatchOnRemoveAllClick}
      onCollapseToggle={dispatchAccordionToggle}
      isLoggedIn={isLoggedIn}
      hasMarketBlurbs={true}
      termsUrl={termsUrl}
      isOddsMovementOn={false}
      showAcceptOddsMovementAlert={false}
      oddsMovementLabels={oddsMovementLabels}
      onOddsMovementPreferencesChange={onOddsMovementPreferencesChange}
    />
  );
};
