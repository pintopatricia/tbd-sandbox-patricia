import { BetDetailsAction, BetDetailsColor, RoundButtonSize, RoundButtonState } from "@ppb/the-wall-common/types";
import { BetDetails } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { FunctionComponent, useCallback, useContext } from "react";
import { View } from "react-native";

import LottoSelections from "@ppb/tbd-components-sports-betting/components/LottoCard/view/snowflakes/LottoSelections/LottoSelections.native";
import ConnectedBetControls from "../BetControls";
import { BetControls } from "../BetControls/BetControls.native";
import { ComponentProps } from "./props";
import { SINGLE, SINGLE_CONTROLS } from "./OneLineBet.native.selectors";
import styles from "./OneLineBet.native.styles";
import { RootBetslipContext } from "../RootBetslip/RootBetslipContext";
import { i18n } from "../../../helpers/i18n";

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
  const handleOnRemove = useCallback(() => {
    dispatchRemoveSelectionAction({ legId, runnerUrns });
  }, [dispatchRemoveSelectionAction, legId, runnerUrns]);
  const { isBetConfirmationStep } = useContext(RootBetslipContext);

  return (
    <View {...getTestProps(SINGLE, false)} style={styles.single}>
      <View style={styles.betDetails}>
        <BetDetails
          title={
            !!runners && (
              <LottoSelections runners={runners} size={RoundButtonSize.SMALL} state={RoundButtonState.READ_ONLY} />
            )
          }
          subtitle={subtitle}
          action={!isBetConfirmationStep ? BetDetailsAction.Remove : BetDetailsAction.None}
          color={BetDetailsColor.Teal}
          selectionTypeIcon={selectionTypeIcon}
          onAction={!isBetConfirmationStep ? handleOnRemove : undefined}
          isPlacing={isPlacing}
          i18n={{
            Remove: i18n({
              key: "I18N.ACCESSIBILITY.REMOVE_BET_SELECTION",
            }),
            Edit: i18n({
              key: "I18N.ACCESSIBILITY.EDIT_BET",
            }),
            None: i18n({
              key: "I18N.ACCESSIBILITY.NO_ACTION_AVAILABLE",
            }),
          }}
        />
      </View>
      <View {...getTestProps(SINGLE_CONTROLS, false)} style={styles.controls}>
        <ConnectedBetControls
          component={BetControls}
          combinationId={id}
          shouldFocusStakeField={shouldFocusStakeField}
          hasAvailabilityHints={hasAvailabilityHints}
        />
      </View>
    </View>
  );
};
