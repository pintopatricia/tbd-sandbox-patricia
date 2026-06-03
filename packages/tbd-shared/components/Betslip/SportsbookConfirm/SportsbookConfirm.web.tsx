import { FunctionComponent, useCallback, useContext, useEffect, useMemo } from "react";
import classnames from "classnames";

import { SecondaryButton } from "@ppb/the-wall-web";
import { BetslipCards } from "../SportsbookPlace/snowflakes/SportsbookPlacePanel/SportsbookPlacePanel.types";
import { BetslipSection } from "../Betslip.types";

import { KeyboardContext } from "../Keyboard/KeyboardContext";
import { ConfigContext } from "../../Config/ConfigContext";
import ConnectedNotifier from "../Notifier";
import { Notifier } from "../Notifier/Notifier.web";
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
import { MultiLinesMultiples } from "../MultiLinesMultiples/MultiLinesMultiples.web";
import ConnectedMultiLinesMultiples from "../MultiLinesMultiples";
import { SportsbookPlacePanel as BetslipSportsbookPlacePanel } from "../SportsbookPlace/snowflakes/SportsbookPlacePanel/SportsbookPlacePanel.web";
import { buildDepositRedirectPayload } from "../betslip-deposit-redirect-mapper";
import { useRefContext } from "../../../hooks/useRefContext";
import { getAuthData } from "../../../config/endpoints";

import { ComponentProps } from "./props";
import styles from "./SportsbookConfirm.web.css";

// Placeholder callback for freebets, otherwise it would be readonly
const onFreeBetsChange = () => undefined;

export const SportsbookConfirm: FunctionComponent<ComponentProps> = ({
  isLoggedIn,
  isDepositRequired,
  betsWithTotalCombinedStake,
  betBuilderIds,
  sportsbooksConfirmI18N,
  sportsbookPlacePanelI18N,
  betslipCardsOrder,
  sectionsInitialState,
  placeBtnLabel,
  placeBtnSecondaryLabel,
  placeBtnLoadingLabel,
  reversePlaceBtnLabels,
  contentLayout,
  isEligibleToBonus,
  isFreeBetsSelected,
  isOddsBoosted,
  totalReturns,
  totalOriginalReturns,
  hasPlaceError,
  isPlaceDisabled,
  isSummaryDisabled,
  isPanelDisabled,
  freeBetsAlertMessage,
  balanceAfterBet,
  dispatchPlacement,
  dispatchLoginToPlaceBetAction,
  dispatchLogin,
  dispatchDepositRedirect,
  dispatchNavigate,
  dispatchEdit,
  dispatchRemoveAll,
  dispatchAccordionToggle,
}) => {
  const { setFocusedKeyboardControls } = useContext(KeyboardContext);
  const { isDesktopLayout } = useContext(ConfigContext);
  const [, setScrollableRef] = useRefContext();
  const {
    bbMulti: hasMultiBetBuilder,
    betBuilders: hasBetBuilders,
    oneLineMultiple: hasOneLineMultiple,
    multiLinesMultiples: hasMultipleLinesMultiples,
    castBets: hasCastBets,
    singles: hasSingles,
  } = betsWithTotalCombinedStake;

  useEffect(() => {
    setFocusedKeyboardControls((prev) => ({
      ...prev,
      focusedInputId: null,
    }));
  }, [setFocusedKeyboardControls]);

  const handlePlaceClick = useCallback(() => {
    if (!isLoggedIn) {
      dispatchLoginToPlaceBetAction();

      const { SSO_URL } = getAuthData() || {};
      const ssoWithRedirectUrl = `${SSO_URL}&url=${encodeURIComponent(window.location.href)}`;

      dispatchLogin(ssoWithRedirectUrl);

      return;
    }

    if (isDepositRequired) {
      const { viewUrn, viewUrl } = buildDepositRedirectPayload(window.location.href);

      dispatchDepositRedirect();
      dispatchNavigate(viewUrn, viewUrl);

      return;
    }

    dispatchPlacement();
  }, [
    isLoggedIn,
    isDepositRequired,
    dispatchPlacement,
    dispatchLoginToPlaceBetAction,
    dispatchLogin,
    dispatchDepositRedirect,
    dispatchNavigate,
  ]);

  const handleEditClick = useCallback(() => dispatchEdit(), [dispatchEdit]);

  const onOddsMovementPreferencesChange = useCallback(() => {}, []);

  const oddsMovementLabels = useMemo(
    () => ({
      message: "",
      detailMessage: "",
    }),
    [],
  );

  const multiBetBuilderCard = useMemo(
    () => (hasMultiBetBuilder ? <ConnectedMultiBetBuilderCard component={MultiBetBuilderCard} /> : undefined),
    [hasMultiBetBuilder],
  );

  const betBuildersCard = useMemo(
    () =>
      hasBetBuilders ? (
        <ConnectedBetBuildersCard
          component={BetBuildersCard}
          combinationIds={betBuilderIds}
          failedCombinationGroups={[]}
        />
      ) : undefined,
    [hasBetBuilders, betBuilderIds],
  );

  const oneLineMultipleCard = useMemo(
    () =>
      hasOneLineMultiple ? (
        <ConnectedOneLineMultiple component={OneLineMultiple} hasOneLineMultiple={hasOneLineMultiple} />
      ) : undefined,
    [hasOneLineMultiple],
  );

  const multiLinesMultiplesCard = useMemo(
    () =>
      hasMultipleLinesMultiples ? (
        <ConnectedMultiLinesMultiples component={MultiLinesMultiples} shouldRenderBetLegs={!hasOneLineMultiple} />
      ) : undefined,
    [hasMultipleLinesMultiples, hasOneLineMultiple],
  );

  const castBetsCard = useMemo(
    () => (hasCastBets ? <ConnectedCastBetsCard component={CastBetsCard} /> : undefined),
    [hasCastBets],
  );

  const singlesCard = useMemo(
    () =>
      hasSingles && <ConnectedSinglesCard component={SinglesCard} hasAvailabilityHints shouldFocusStakeField={false} />,
    [hasSingles],
  );

  const notifications = useMemo(
    () => <ConnectedNotifier className={styles.notificationsListContainer} component={Notifier} />,
    [],
  );

  const editButton = useMemo(
    () => (
      <div className={styles.editButtonContainer}>
        <SecondaryButton
          label={sportsbooksConfirmI18N.secondaryButtonLabel}
          disabled={isPanelDisabled}
          onTap={handleEditClick}
        />
      </div>
    ),
    [handleEditClick, sportsbooksConfirmI18N.secondaryButtonLabel, isPanelDisabled],
  );

  const betslipCards: BetslipCards[] = useMemo(() => {
    const betslipSectionsContents = {
      [BetslipSection.bbMulti]: {
        card: multiBetBuilderCard,
        title: sportsbooksConfirmI18N.multiBetBuilder,
        startsOpen: sectionsInitialState.bbMulti,
        collapsable: true,
      },
      [BetslipSection.betBuilders]: {
        card: betBuildersCard,
        title: sportsbooksConfirmI18N.betBuilder,
        startsOpen: sectionsInitialState.betBuilders,
        collapsable: true,
      },
      [BetslipSection.oneLineMultiple]: {
        card: oneLineMultipleCard,
        title: sportsbooksConfirmI18N.multiples,
        startsOpen: sectionsInitialState.oneLineMultiple,
        collapsable: true,
      },
      [BetslipSection.multiLinesMultiples]: {
        card: multiLinesMultiplesCard,
        title: sportsbooksConfirmI18N.additionalMultiples,
        startsOpen: sectionsInitialState.multiLinesMultiples,
        collapsable: true,
      },
      [BetslipSection.castBets]: {
        card: castBetsCard,
        title: sportsbooksConfirmI18N.casts,
        startsOpen: sectionsInitialState.castBets,
        collapsable: true,
      },
      [BetslipSection.singles]: {
        card: singlesCard,
        title: sportsbooksConfirmI18N.singles,
        startsOpen: sectionsInitialState.singles,
        collapsable: true,
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
    betslipCardsOrder,
    multiBetBuilderCard,
    betBuildersCard,
    oneLineMultipleCard,
    multiLinesMultiplesCard,
    castBetsCard,
    singlesCard,
    sectionsInitialState,
    sportsbooksConfirmI18N,
  ]);

  return (
    <div
      className={classnames(styles.scrollableConfirm, {
        [styles.scrollableConfirmDesktop]: isDesktopLayout,
      })}
    >
      <BetslipSportsbookPlacePanel
        ref={setScrollableRef}
        betslipCards={betslipCards}
        contentLayout={contentLayout}
        hasFreeBets={isEligibleToBonus}
        isFreeBetsSelected={isFreeBetsSelected}
        isFreeBetsDisabled={true}
        freeBetsAlertMessage={freeBetsAlertMessage}
        isOddsBoosted={isOddsBoosted}
        totalReturns={totalReturns}
        totalOriginalReturns={totalOriginalReturns}
        hasPlaceError={hasPlaceError || isDepositRequired || !isLoggedIn}
        isPlaceDisabled={isPlaceDisabled}
        isSummaryDisabled={isSummaryDisabled}
        notifications={notifications}
        placeBtnLabel={placeBtnLabel}
        placeBtnSecondaryLabel={placeBtnSecondaryLabel}
        placeBtnLoadingLabel={placeBtnLoadingLabel}
        reversePlaceBtnLabels={reversePlaceBtnLabels}
        isDesktop={isDesktopLayout}
        i18n={sportsbookPlacePanelI18N}
        isPanelDisabled={isPanelDisabled}
        balanceAfterBet={balanceAfterBet}
        secondaryButton={editButton}
        onPlaceClick={handlePlaceClick}
        onRemoveAllClick={dispatchRemoveAll}
        onCollapseToggle={dispatchAccordionToggle}
        onFreeBetsChange={onFreeBetsChange}
        isOddsMovementOn={false}
        showAcceptOddsMovementAlert={false}
        oddsMovementLabels={oddsMovementLabels}
        onOddsMovementPreferencesChange={onOddsMovementPreferencesChange}
      />
    </div>
  );
};
