import { FunctionComponent } from "react";
import { getEndpoint } from "../../../../config/endpoints";
import styles from "./Notifications.web.css";
import { i18n } from "../../../../helpers/i18n";
import { SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

export const Notifications: FunctionComponent<{ onClose: () => void }> = ({ onClose }) => {
  const url = getEndpoint("WMS");
  return (
    <div className={styles.notificationsContainer}>
      <div className={styles.notificationsHeader}>
        <h1 className={styles.title}>{i18n({ key: "I18N.NOTIFICATIONS" })}</h1>
        <button onClick={onClose} className={styles.closeIconContainer}>
          <GenericIcon name={SystemIconName.CLOSE} />
        </button>
      </div>

      <iframe width={"100%"} height={"100%"} title="Notifications" src={url} />
    </div>
  );
};
