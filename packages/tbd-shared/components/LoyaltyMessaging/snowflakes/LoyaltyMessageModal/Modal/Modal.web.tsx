import { FunctionComponent, useCallback, useRef, KeyboardEvent, MouseEvent } from "react";
import ReactDOM from "react-dom";
import { ActionLinkTypography } from "@ppb/the-wall-common/types";

import { useDisableBodyScroll } from "@ppb/the-wall-web/hooks/useDisableBodyScroll";
import { ActionLink } from "@ppb/the-wall-web/components/bricks/ActionLink/ActionLink";
import { PrimaryButton } from "@ppb/the-wall-web/components/bricks/PrimaryButton/PrimaryButton";
import styles from "./Modal.web.css";
import { ModalProps } from "./Modal.types";

export const ModalWeb: FunctionComponent<ModalProps> = ({
  title,
  children,
  onDismiss,
  dismissOnOutsideTap = true,
  containerId = "modal-root",
  imageSrc,
  imageAlt,
  buttonText,
  onTap,
}) => {
  const element = document.getElementById(containerId) || document.body;
  const modalPanelRef = useRef<HTMLDivElement>(null);

  const onModalPaneClick = useCallback(
    (e: MouseEvent<HTMLDivElement>): void => {
      if (dismissOnOutsideTap && e.target === modalPanelRef.current) {
        onDismiss(); // onDismiss
      }
    },
    [onDismiss, dismissOnOutsideTap],
  );

  const onModalPaneonKeyUp = useCallback(
    (e: KeyboardEvent<HTMLDivElement>): void => {
      if (e.keyCode === 27) {
        // "ESC" key
        onDismiss();
      }
    },
    [onDismiss],
  );

  const onCloseBtnClick = useCallback(() => onDismiss(), [onDismiss]);

  useDisableBodyScroll();

  return ReactDOM.createPortal(
    <div
      className={`${styles.overlay} ${styles.modalContainer}`}
      onClick={onModalPaneClick}
      onKeyUp={onModalPaneonKeyUp}
      ref={modalPanelRef}
      role="button"
      tabIndex={0}
      data-testid={"overlay"}
    >
      <div className={styles.modal}>
        {imageSrc && <img className={styles.image} src={imageSrc} alt={imageAlt} />}
        <div className={styles.content}>
          <div>
            <h5 className={styles.title}>{title}</h5>
            {children}
          </div>
          {buttonText && onTap && <PrimaryButton label={buttonText} onTap={onTap} />}
          <div className={styles.actionLink} data-testid={"actionLink"}>
            <ActionLink text={"Dismiss"} onClick={onCloseBtnClick} typography={ActionLinkTypography.Large} />
          </div>
        </div>
      </div>
    </div>,
    element,
  );
};
