import { FunctionComponent } from "react";
import { Placeholder } from "@ppb/the-wall-web";
import styles from "./GameInfoPlaceholder.web.css";

const GameInfoCardPlaceholder: FunctionComponent = () => (
  <div className={styles.placeholder}>
    <Placeholder />
  </div>
);

export default GameInfoCardPlaceholder;
