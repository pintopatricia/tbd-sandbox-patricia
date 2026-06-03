import { FunctionComponent } from "react";
import classnames from "classnames";
import styles from "./VirtualTeam.web.css";
import { VirtualTeamProps } from "./VirtualTeam.types";

export const VirtualTeam: FunctionComponent<VirtualTeamProps> = ({ team, reverseOrder }) => {
  const classNameTeam = classnames(styles.team, {
    [styles.reverseOrder]: reverseOrder,
    [styles.singleLine]: team?.name?.split(/\s+/).length === 1,
  });

  return (
    <div className={classNameTeam}>
      <span className={styles.teamName}>
        <p className={styles.teamNameLabel}>{team.name}</p>
      </span>
    </div>
  );
};
