import type { FunctionComponent } from "react";
import { useCallback, useContext, useMemo, useRef, useLayoutEffect } from "react";

import classnames from "classnames";
import { QuickStakes } from "@ppb/the-wall-web";
import { QuickStakesOnTouch } from "@ppb/the-wall-common/types";
import ConnectedObbNotifier from "../ObbNotifier";
import { ObbNotifier } from "../ObbNotifier/ObbNotifier.web";
import ConnectedObbSingle from "../ObbSingle";
import ConnectedObbMultiple from "../ObbMultiple";

import { ObbSingle } from "../ObbSingle/ObbSingle.web";
import { ObbMultiple } from "../ObbMultiple/ObbMultiple.web";

import { ComponentProps } from "./props";
import styles from "./ObbPlace.web.css";
import { KeyboardContext } from "../Keyboard/KeyboardContext";
import { buildDepositRedirectPayload } from "../betslip-deposit-redirect-mapper";
import { FooterCustomKeyboard } from "../Keyboard/FooterCustomKeyboard.web";
import { BetslipCollapseStrategy, useCollapseStrategy } from "../SportsbookPlace/hooks/useCollapseStrategy";
import { BetslipSection } from "../Betslip.types";
import { BetslipCards } from "../SportsbookPlace/snowflakes/SportsbookPlacePanel/SportsbookPlacePanel.types";
import { SportsbookPlacePanel } from "../SportsbookPlace/snowflakes/SportsbookPlacePanel/SportsbookPlacePanel.web";
import { ConfigContext } from "../../Config/ConfigContext";
import { getAuthData } from "../../../config/endpoints";
import { useRefContext } from "../../../hooks/useRefContext";

export const ObbPlace: FunctionComponent<ComponentProps> = ({
  i18n,
  totalReturns,
  isPanelDisabled,
  isPlaceDisabled,
  isCollapsed,
  hasError,
  isDepositRequired,
  isLoggedIn,
  placeBtnLabel,
  placeBtnSecondaryLabel,
  placeBtnLoadingLabel,
  reversePlaceBtnLabels,
  balanceAfterBet,
  currencySymbol,
  quickStakes,
  separator,
  singles,
  multiplesGroups,
  termsUrl,
  dispatchOnRemoveAllClick,
  dispatchOnPlaceBetsClick,
  dispatchRedirectToLogin,
  dispatchDepositRedirect,
  dispatchNavigate,
  dispatchIncrementPress,
  dispatchAccordionToggle,
}) => {
  const [, setScrollableRef] = useRefContext();
  const ref = useRef<HTMLDivElement | null>(null);
  const { isDesktopLayout } = useContext(ConfigContext);
  const {
    focusedKeyboardControls: { focusedCombinationId },
    setFocusedKeyboardControls,
  } = useContext(KeyboardContext);

  useLayoutEffect(() => {
    setFocusedKeyboardControls((prev) => ({
      ...prev,
      focusedInputId: null,
    }));
  }, [setFocusedKeyboardControls]);

  const onOddsMovementPreferencesChange = useCallback(() => {}, []);

  const oddsMovementLabels = useMemo(
    () => ({
      message: "",
      detailMessage: "",
    }),
    [],
  );

  const handlePlaceClick = useCallback(() => {
    if (!isLoggedIn) {
      const { SSO_URL } = getAuthData() || {};
      const ssoWithRedirectUrl = `${SSO_URL}&url=${encodeURIComponent(window.location.href)}`;

      dispatchRedirectToLogin(ssoWithRedirectUrl);

      return;
    }
    if (isDepositRequired) {
      const { viewUrn, viewUrl } = buildDepositRedirectPayload(window.location.href);

      dispatchDepositRedirect();
      dispatchNavigate(viewUrn, viewUrl);

      return;
    }

    dispatchOnPlaceBetsClick();
  }, [
    dispatchDepositRedirect,
    dispatchNavigate,
    dispatchOnPlaceBetsClick,
    dispatchRedirectToLogin,
    isDepositRequired,
    isLoggedIn,
  ]);

  const onQuickStakePress = useCallback<QuickStakesOnTouch>(
    (stake: number) => {
      if (!focusedCombinationId) return;

      dispatchIncrementPress({
        potentialBetId: focusedCombinationId || "",
        increment: stake,
        currencySymbol,
      });
    },
    [focusedCombinationId, dispatchIncrementPress, currencySymbol],
  );

  const quickStakesComponent = useMemo(
    () => (
      <div className={styles.quickStakesContainer}>
        <QuickStakes quickStakes={quickStakes} onTouch={onQuickStakePress} isDisabled={isPanelDisabled} />
      </div>
    ),
    [quickStakes, isPanelDisabled, onQuickStakePress],
  );

  const footerPrefix = useMemo(
    () => (
      <>
        <FooterCustomKeyboard
          className={styles.keyboardContainer}
          prefix={quickStakesComponent}
          separator={separator}
          isDisabled={isPanelDisabled || false}
          shouldScrollIntoView={!isCollapsed}
        />
      </>
    ),
    [quickStakesComponent, separator, isPanelDisabled, isCollapsed],
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
  }, [i18n.multiples, i18n.singles, singles.length, multiplesGroups.length, multiplesCard, singlesCard]);

  const collapseAwareCards = useCollapseStrategy(betslipCards, BetslipCollapseStrategy.FirstOpen);

  const notifications = useMemo(
    () => <ConnectedObbNotifier className={styles.notificationsListContainer} component={ObbNotifier} />,
    [],
  );

  return (
    <div
      ref={ref}
      className={classnames(styles.scrollableBetslip, {
        [styles.scrollableBetslipDesktop]: isDesktopLayout,
      })}
    >
      <SportsbookPlacePanel
        ref={setScrollableRef}
        betslipCards={collapseAwareCards}
        totalReturns={totalReturns}
        hasPlaceError={hasError || isDepositRequired || !isLoggedIn}
        isPanelDisabled={isPanelDisabled}
        isPlaceDisabled={isPlaceDisabled || isPanelDisabled}
        isSummaryDisabled={isPanelDisabled}
        placeBtnLabel={placeBtnLabel}
        placeBtnSecondaryLabel={placeBtnSecondaryLabel}
        placeBtnLoadingLabel={placeBtnLoadingLabel}
        reversePlaceBtnLabels={reversePlaceBtnLabels}
        isDesktop={isDesktopLayout}
        balanceAfterBet={balanceAfterBet}
        i18n={i18n}
        onPlaceClick={handlePlaceClick}
        onRemoveAllClick={dispatchOnRemoveAllClick}
        onCollapseToggle={dispatchAccordionToggle}
        isLoggedIn={isLoggedIn}
        notifications={notifications}
        footerPrefix={!isDesktopLayout ? footerPrefix : undefined}
        hasMarketBlurbs={true}
        termsUrl={termsUrl}
        isOddsMovementOn={false}
        showAcceptOddsMovementAlert={false}
        oddsMovementLabels={oddsMovementLabels}
        onOddsMovementPreferencesChange={onOddsMovementPreferencesChange}
      />
    </div>
  );
};
