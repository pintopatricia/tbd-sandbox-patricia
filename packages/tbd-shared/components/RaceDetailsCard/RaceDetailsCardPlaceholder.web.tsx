import { Placeholder } from "@ppb/the-wall-web/components/bricks/Placeholder/Placeholder";
import classnames from "classnames";
import styles from "./RaceDetailsCard.web.css";

const RaceDetailsCardPlaceholder = () => (
  <div className={classnames(styles.raceDetailsContainer, styles.nonSticky)}>
    <Placeholder />
  </div>
);

export default RaceDetailsCardPlaceholder;
