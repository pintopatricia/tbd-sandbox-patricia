import { FunctionComponent } from "react";
import { Alert } from "@ppb/the-wall-web";
import { AlertType } from "@ppb/the-wall-common/types";
import styles from "./ErrorToast.web.css";

export type ErrorToastProps = {
  message: string;
  onClose: () => void;
};

export const ErrorToast: FunctionComponent<ErrorToastProps> = ({ message, onClose }) => (
  <div className={styles.errorToastContainer}>
    <div className={styles.errorToastWrapper}>
      <Alert id="error-toast" type={AlertType.Error} message={message} showCloseIcon={true} onClose={onClose} />
    </div>
  </div>
);
