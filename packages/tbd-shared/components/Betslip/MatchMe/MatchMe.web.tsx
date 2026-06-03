import type { FunctionComponent } from "react";
import { useState } from "react";

import { Modal, RichTextComponent } from "@ppb/the-wall-web";
import { Switch } from "@ppb/the-wall-web/components/bricks/Switch/Switch";
import { RichTextType } from "@ppb/the-wall-common/types";
import { SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { i18n } from "../../../helpers/i18n";
import { ComponentProps } from "./props";
import styles from "./MatchMe.web.css";

const infoModalContent = [
  { text: i18n({ key: "I18N.MATCH_ME.MODAL.CONTENT.HEADING_1" }), type: RichTextType.HEADING3 },
  { text: i18n({ key: "I18N.MATCH_ME.MODAL.CONTENT.TEXT_1" }), type: RichTextType.PARAGRAPH },
  { text: i18n({ key: "I18N.MATCH_ME.MODAL.CONTENT.HEADING_2" }), type: RichTextType.HEADING3 },
  { text: i18n({ key: "I18N.MATCH_ME.MODAL.CONTENT.TEXT_2" }), type: RichTextType.PARAGRAPH },
];

const MatchMe: FunctionComponent<ComponentProps> = ({ isEnabled, oddsRange, label, onToggle }) => {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const handleInfoOpen = () => setIsInfoModalOpen(true);
  const handleInfoClose = () => setIsInfoModalOpen(false);

  return (
    <>
      <div className={styles.container}>
        <button className={styles.infoIcon} type="button" onClick={handleInfoOpen}>
          <GenericIcon name={SystemIconName.NOTIFICATION_INFO} color={"var(--action-tertiary-icon-default)"} />
        </button>
        <div className={styles.content}>
          <div className={styles.textContent}>
            <span className={styles.label}>{label}</span>
            {oddsRange && (
              <span className={styles.oddsRange}>
                {i18n({
                  key: "I18N.MATCH_ME.ODDS_RANGE",
                  interpolationValues: { min: oddsRange.min, max: oddsRange.max },
                })}
              </span>
            )}
          </div>
          <div className={styles.toggle}>
            <Switch
              label=""
              isChecked={isEnabled}
              onChange={onToggle}
              checkboxId="match-me-toggle"
              checkboxName="match-me-toggle"
            />
          </div>
        </div>
      </div>
      {isInfoModalOpen && (
        <Modal title={i18n({ key: "I18N.MATCH_ME.MODAL.TITLE" })} onDismiss={handleInfoClose}>
          <RichTextComponent list={infoModalContent} />
        </Modal>
      )}
    </>
  );
};

export default MatchMe;
