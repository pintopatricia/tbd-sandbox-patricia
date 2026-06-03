import { View } from "react-native";
import { BetDetails } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { BetDetailsAction, BetDetailsColor } from "@ppb/the-wall-common/types";
import { FunctionComponent, useCallback } from "react";
import { ComponentProps } from "./props";
import ConnectedObbBetControls from "../ObbBetControls";
import { ObbBetControls } from "../ObbBetControls/ObbBetControls.native";
import styles from "./ObbSingle.native.styles";
import { OBB_SINGLE, OBB_SINGLE_CONTROLS } from "./ObbSingle.native.selectors";
import { i18n } from "../../../helpers/i18n";

export const ObbSingle: FunctionComponent<ComponentProps> = ({
  potentialBetId,
  legId,
  outcomeDescription,
  shouldFocusStakeField,
  hasReturnsLabel,
  dispatchRemoveSelectionAction,
  participant,
  hasAvailabilityHints,
  isPlacing,
}) => {
  const handleOnSelectionRemove = useCallback(() => {
    dispatchRemoveSelectionAction(legId);
  }, [dispatchRemoveSelectionAction, legId]);

  return (
    <View style={styles.obbSingle} {...getTestProps(OBB_SINGLE, false)}>
      <BetDetails
        title={participant}
        subtitle={outcomeDescription}
        action={BetDetailsAction.Remove}
        onAction={handleOnSelectionRemove}
        color={BetDetailsColor.Teal}
        isPlacing={isPlacing}
        displayAllSubtitleText
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
      <View style={styles.controls} {...getTestProps(OBB_SINGLE_CONTROLS, false)}>
        <ConnectedObbBetControls
          component={ObbBetControls}
          potentialBetId={potentialBetId}
          shouldFocusStakeField={shouldFocusStakeField}
          hasReturnsLabel={hasReturnsLabel}
          hasAvailabilityHints={hasAvailabilityHints}
        />
      </View>
    </View>
  );
};
