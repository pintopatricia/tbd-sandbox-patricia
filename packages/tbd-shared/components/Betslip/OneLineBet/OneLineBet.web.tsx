import { FunctionComponent, useCallback, useContext } from "react";
import { BetDetailsAction, BetDetailsColor, RoundButtonSize, RoundButtonState } from "@ppb/the-wall-common/types";
import { BetDetails } from "@ppb/the-wall-web";

import LottoSelections from "@ppb/tbd-components-sports-betting/components/LottoCard/view/snowflakes/LottoSelections/LottoSelections.web";
import { ConfigContext } from "../../Config/ConfigContext";

import ConnectedBetControls from "../BetControls";
import { BetControls } from "../BetControls/BetControls.web";
import { ComponentProps } from "./props";
import styles from "./OneLineBet.web.css";
import { RootBetslipContext } from "../RootBetslip/RootBetslipContext";

export const OneLineBet: FunctionComponent<ComponentProps> = ({
  runnerUrns,
  id,
  legId,
  runners,
  subtitle,
  isPlacing,
  selectionTypeIcon,
  hasAvailabilityHints,
  shouldFocusStakeField,
  dispatchRemoveSelectionAction,
}) => {
  const handleOnAction = useCallback(
    () => dispatchRemoveSelectionAction({ legId, runnerUrns }),
    [dispatchRemoveSelectionAction, legId, runnerUrns],
  );
  const { isDesktopLayout } = useContext(ConfigContext);
  const { isBetConfirmationStep } = useContext(RootBetslipContext);

  return (
    <article className={styles.single}>
      <BetDetails
        displayAllSubtitleText={isDesktopLayout}
        title={
          !!runners && (
            <LottoSelections runners={runners} size={RoundButtonSize.SMALL} state={RoundButtonState.READ_ONLY} />
          )
        }
        subtitle={subtitle}
        action={!isBetConfirmationStep ? BetDetailsAction.Remove : BetDetailsAction.None}
        color={BetDetailsColor.Teal}
        selectionTypeIcon={selectionTypeIcon}
        onAction={!isBetConfirmationStep ? handleOnAction : undefined}
        isPlacing={isPlacing}
      />
      <ConnectedBetControls
        component={BetControls}
        combinationId={id}
        shouldFocusStakeField={shouldFocusStakeField}
        hasAvailabilityHints={hasAvailabilityHints}
      />
    </article>
  );
};
