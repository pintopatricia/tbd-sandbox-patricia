import { FunctionComponent } from "react";
import styles from "./GameBadge.native.styles";
import GameBadgeImg from "./game-badge.svg";

export const GameBadge: FunctionComponent = () => <GameBadgeImg style={styles.gameBadge} />;
