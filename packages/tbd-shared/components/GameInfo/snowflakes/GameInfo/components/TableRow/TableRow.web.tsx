import { FunctionComponent } from "react";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";

import { TableRowProps } from "./TableRow.types";
import styles from "./TableRow.web.css";

const TableRow: FunctionComponent<TableRowProps> = ({ icon, label, value, href }) => (
  <div className={styles.tableRow}>
    <div className={styles.rowLeftSide}>
      <div className={styles.rowIcon}>
        <GenericIcon
          name={icon || SystemIconName.NOTIFICATION_HELP}
          color={"var(--game-info-text-content-text-colour)"}
        />
      </div>
      {href ? (
        <a href={href} className={styles.rowTitle} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      ) : (
        <p className={styles.rowTitle}>{label}</p>
      )}
    </div>
    {!href && <p className={styles.rowValue}>{value}</p>}
  </div>
);

export default TableRow;
