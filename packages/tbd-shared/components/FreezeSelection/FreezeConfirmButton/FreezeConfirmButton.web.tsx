import { FunctionComponent } from "react";
import { PrimaryButton, RichTextComponent } from "@ppb/the-wall-web";
import { ValueIconName } from "@ppb/the-wall-icons";
import { RichText, RichTextType } from "@ppb/the-wall-common/types";
import styles from "./FreezeConfirmButton.web.css";
import { i18n } from "../../../helpers/i18n";
import { ComponentProps } from "./props";

export const FreezeConfirmButton: FunctionComponent<ComponentProps> = ({ selectedLeg, onConfirm, oddsLabel }) => {
  const UNABLE_TO_FREEZE = i18n({ key: "I18N.FREEZE_SELECTION.BOTTOM_SHEET.UNABLE_TO_FREEZE" });
  const isDisabled =
    selectedLeg && selectedLeg.mutations?.eligibility?.some((l) => l?.mutationAvailability !== "Available");
  let buttonLabel = i18n({ key: "I18N.FREEZE_LEG.SELECT_BUTTON_LABEL" });
  let buttonText: RichText[] = [
    {
      type: RichTextType.PARAGRAPH,
      text: i18n({ key: "I18N.FREEZE_LEG.UNSELECTED_LABEL" }),
    },
  ];

  if (selectedLeg) {
    const team = selectedLeg.parts[0].selectionName;
    const selectionText = `${team} @ ${oddsLabel}`;

    buttonLabel = isDisabled
      ? i18n({ key: "I18N.FREEZE_SELECTION.BOTTOM_SHEET.FREEZE_SELECTION_SUSPENDED" })
      : i18n({ key: "I18N.FREEZE_SELECTION.CONFIRM_BUTTON_LABEL" });

    if (isDisabled) {
      buttonText = [
        {
          type: RichTextType.PARAGRAPH,
          text: UNABLE_TO_FREEZE + selectionText,
          spans: [
            {
              start: UNABLE_TO_FREEZE.length,
              end: UNABLE_TO_FREEZE.length + selectionText.length,
              style: "strong",
            },
          ],
        },
      ];
    } else {
      buttonText = [
        {
          type: RichTextType.PARAGRAPH,
          text: i18n({ key: "I18N.FREEZE_LEG.SELECTED_LABEL" }),
        },
        {
          type: RichTextType.PARAGRAPH,
          text: selectionText,
          spans: [{ start: 0, end: selectionText.length, style: "strong" }],
        },
      ];
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
      <div className={styles.freezeConfirmButtonText}>
        <RichTextComponent list={buttonText} />
      </div>
    </>
  );
};
