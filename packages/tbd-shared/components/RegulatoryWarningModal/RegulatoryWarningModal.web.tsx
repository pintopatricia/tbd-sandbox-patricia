import { useCallback, useEffect, useState } from "react";
import type { FunctionComponent, JSX } from "react";

import { GenericIcon, IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { Modal, Styled } from "@ppb/the-wall-web";

import styles from "./RegulatoryWarningModal.web.css";
import type { ComponentProps } from "./props";

const AUTO_DISMISS_TIMEOUT_MS = 5000;

const createRegulatoryWarningCustomRender = (href: string) => ({
  link: (text: string): JSX.Element => (
    <a key="warning-link" className={styles.warningMessageLink} href={href} target="_blank" rel="noopener noreferrer">
      {text}
    </a>
  ),
});

const RegulatoryWarningModal: FunctionComponent<ComponentProps> = ({
  labels,
  warningMessageLink,
}): JSX.Element | null => {
  const [displayModal, setDisplayModal] = useState<boolean>(true);

  useEffect(() => {
    const autoDismissTimeout = setTimeout(() => {
      setDisplayModal(false);
    }, AUTO_DISMISS_TIMEOUT_MS);

    return () => {
      clearTimeout(autoDismissTimeout);
    };
  }, []);

  const onDismiss = useCallback(() => {
    setDisplayModal(false);
  }, []);

  if (!displayModal || !labels.warningMessageText || !warningMessageLink) {
    return null;
  }

  return (
    <Modal title={labels.modalTitle} dismissOnOutsideTap={false} onDismiss={onDismiss}>
      <div className={styles.modalContent}>
        <div className={styles.modalContentHeader}>
          <GenericIcon name={IconsList.SAFER_GAMBLING} />
          <span className={styles.modalContentHeaderTitle}>{labels.modalContentHeaderTitle}</span>
        </div>
        <div className={styles.warningMessageContainer}>
          <p className={styles.warningMessageTitle}>{labels.warningMessageTitle}</p>
          <p className={styles.warningMessageText}>
            <Styled
              translation={labels.warningMessageText}
              customRender={createRegulatoryWarningCustomRender(warningMessageLink)}
            />
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default RegulatoryWarningModal;
