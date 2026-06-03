import { FunctionComponent } from "react";

import { ModalWeb } from "./Modal/Modal.web";
import { LoyaltyMessageModalProps } from "./LoyaltyMessageModal.types";
import styles from "./LoyaltyMessageModal.web.css";

export const LoyaltyMessageModal: FunctionComponent<LoyaltyMessageModalProps> = ({
  title,
  message,
  onDismiss,
  tcText,
  tcUrl,
  onTcClick,
  buttonText,
  onTap,
  imageSrc,
  imageAlt,
  onInit,
}) => {
  if (onInit) {
    onInit();
  }

  return (
    <div className={styles.loyaltyMessageModal}>
      <ModalWeb
        title={title}
        onDismiss={onDismiss}
        dismissOnOutsideTap={false}
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        buttonText={buttonText}
        onTap={onTap}
      >
        <div className={styles.container}>
          <div className={styles.message}>
            {message}
            {!!tcText && !!tcUrl && onTcClick && (
              <a href={tcUrl} onClick={onTcClick} className={styles.terms}>
                {tcText}
              </a>
            )}
          </div>
        </div>
      </ModalWeb>
    </div>
  );
};
