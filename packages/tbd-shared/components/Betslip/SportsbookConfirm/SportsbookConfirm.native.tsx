import { FunctionComponent, useCallback, useContext, useEffect, useMemo } from "react";

import useLoginWithPendingState from "../../../hooks/useLoginWithPendingState.native";
import { navigateDeposit } from "@ppb/tbd-router/native";
import { SecondaryButton } from "@ppb/the-wall-native";

import { View } from "react-native";
import type { BetslipCards } from "../SportsbookPlace/snowflakes/SportsbookPlacePanel/SportsbookPlacePanel.types";
import { BetslipSection } from "../Betslip.types";
import { KeyboardContext } from "../Keyboard/KeyboardContext";
import ConnectedNotifier from "../Notifier";
import { Notifier } from "../Notifier/Notifier.native";
import ConnectedSinglesCard from "../SinglesCard";
import { SinglesCard } from "../SinglesCard/SinglesCard.native";
import ConnectedBetBuildersCard from "../BetBuildersCard";
import { BetBuildersCard } from "../BetBuildersCard/BetBuildersCard.native";
import ConnectedCastBetsCard from "../CastBetsCard";
import { CastBetsCard } from "../CastBetsCard/CastBetsCard.native";
import ConnectedMultiBetBuilderCard from "../MultiBetBuilderCard";
import { MultiBetBuilderCard } from "../MultiBetBuilderCard/MultiBetBuilderCard.native";
import { getEndpoint } from "../../../config/endpoints";
import { OneLineMultiple } from "../OneLineMultiple/OneLineMultiple.native";
import ConnectedOneLineMultiple from "../OneLineMultiple";
import { MultiLinesMultiples } from "../MultiLinesMultiples/MultiLinesMultiples.native";
import ConnectedMultiLinesMultiples from "../MultiLinesMultiples";
import { SportsbookPlacePanel } from "../SportsbookPlace/snowflakes/SportsbookPlacePanel/SportsbookPlacePanel.native";

import { ComponentProps } from "./props";
import styles from "./SportsbookConfirm.native.styles";

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
  dispatchDepositRedirect,
  dispatchEdit,
  dispatchRemoveAll,
  dispatchAccordionToggle,
}) => {
  const login = useLoginWithPendingState();
  const { setFocusedKeyboardControls } = useContext(KeyboardContext);
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
      login();
      return;
    }

    if (isDepositRequired) {
      dispatchDepositRedirect();
      navigateDeposit(getEndpoint("DEPOSIT"));

      return;
    }

    dispatchPlacement();
  }, [isLoggedIn, isDepositRequired, dispatchPlacement, dispatchLoginToPlaceBetAction, login, dispatchDepositRedirect]);

  const handleEditClick = useCallback(() => {
    dispatchEdit();
  }, [dispatchEdit]);

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
    () => <ConnectedNotifier style={styles.notificationsListContainer} component={Notifier} />,
    [],
  );

  const editButton = useMemo(
    () => (
      <View style={styles.editButtonContainer}>
        <SecondaryButton
          label={sportsbooksConfirmI18N.secondaryButtonLabel}
          disabled={isPanelDisabled}
          onTap={handleEditClick}
        />
      </View>
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
    <SportsbookPlacePanel
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
  );
};
