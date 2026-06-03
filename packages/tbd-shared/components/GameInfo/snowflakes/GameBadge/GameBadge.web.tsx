import { FunctionComponent } from "react";
import classnames from "classnames";
import styles from "./GameBadge.web.css";
import GameBadgeImg from "./game-badge.svg";

export const GameBadge: FunctionComponent = () => {
  const classname = classnames(styles.gameBadge);

  return <GameBadgeImg className={classname} />;
};
