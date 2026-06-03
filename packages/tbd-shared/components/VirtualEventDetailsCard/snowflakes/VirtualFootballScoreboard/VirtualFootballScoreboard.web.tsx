import { FunctionComponent } from "react";
import classnames from "classnames";
import styles from "@ppb/the-wall-web/components/rooms/FootballScoreboard/FootballScoreboard.module.css";
import footballScoreStyles from "@ppb/the-wall-web/components/walls/FootballScore/FootballScore.module.css";
import customStyles from "./VirtualFootballScoreboard.web.css";
import { VirtualTeam } from "../VirtualTeam/VirtualTeam.web";
import { VirtualFootballScoreboardProps } from "./VirtualFootballScoreboard.types";

export const VirtualFootballScoreboard: FunctionComponent<VirtualFootballScoreboardProps> = ({ home, away }) => (
  <section className={styles.footballScoreboard}>
    <div className={styles.durationContainer} />
    <div className={styles.container}>
      <VirtualTeam team={home} reverseOrder />
      <div className={classnames(footballScoreStyles.score, footballScoreStyles.viewLarge)}>
        <div className={classnames(footballScoreStyles.versusContainer, footballScoreStyles.versusContainerLarge)}>
          <span className={classnames(footballScoreStyles.versusSpacer, customStyles.separator)} />
        </div>
      </div>
      <VirtualTeam team={away} reverseOrder={false} />
    </div>
  </section>
);
