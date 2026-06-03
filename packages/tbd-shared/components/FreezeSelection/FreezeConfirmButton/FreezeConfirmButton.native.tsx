import { FunctionComponent } from "react";
import { View } from "react-native";
import { PrimaryButton, Text } from "@ppb/the-wall-native";
import { ValueIconName } from "@ppb/the-wall-icons";
import styles from "./FreezeConfirmButton.native.styles";
import { i18n } from "../../../helpers/i18n";
import { ComponentProps } from "./props";

export const FreezeConfirmButton: FunctionComponent<ComponentProps> = ({ selectedLeg, onConfirm, oddsLabel }) => {
  const UNABLE_TO_FREEZE = i18n({ key: "I18N.FREEZE_SELECTION.BOTTOM_SHEET.UNABLE_TO_FREEZE" });
  const isDisabled =
    selectedLeg && selectedLeg.mutations?.eligibility?.some((l) => l?.mutationAvailability !== "Available");
  let buttonLabel = i18n({ key: "I18N.FREEZE_LEG.SELECT_BUTTON_LABEL" });
  let buttonText = <Text style={styles.text}>{i18n({ key: "I18N.FREEZE_LEG.UNSELECTED_LABEL" })}</Text>;

  if (selectedLeg) {
    const team = selectedLeg.parts[0].selectionName;

    const selectionText = `${team} @ ${oddsLabel}`;

    buttonLabel = isDisabled
      ? i18n({ key: "I18N.FREEZE_SELECTION.BOTTOM_SHEET.FREEZE_SELECTION_SUSPENDED" })
      : i18n({ key: "I18N.FREEZE_SELECTION.CONFIRM_BUTTON_LABEL" });

    if (isDisabled) {
      buttonText = (
        <>
          <Text style={styles.text}>
            {UNABLE_TO_FREEZE} <Text style={styles.LegDetailsText}>{selectionText}</Text>
          </Text>
        </>
      );
    } else {
      buttonText = (
        <>
          <Text style={styles.text}>{i18n({ key: "I18N.FREEZE_LEG.SELECTED_LABEL" })}</Text>
          <Text style={styles.LegDetailsText}>{selectionText}</Text>
        </>
      );
    }
  }

  return (
    <>
      <PrimaryButton
        label={buttonLabel}
        icon={ValueIconName.ACCA_FREEZE}
        onTap={isDisabled || !selectedLeg ? () => {} : onConfirm}
        disabled={isDisabled || !selectedLeg}
        stopAnimation={true}
      />
      <View style={styles.infoTextContainer}>{buttonText}</View>
    </>
  );
};
