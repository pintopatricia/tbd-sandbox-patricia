import { FunctionComponent } from "react";
import URN from "@ppb/tbd-store/state/layout/URN";
import styles from "./GamingRibbonCardPlaceholder.web.css";

type Props = {
  urn: URN;
};

const GamingRibbonCardPlaceholder: FunctionComponent<Props> = () => <div className={styles.placeholder} />;

export default GamingRibbonCardPlaceholder;
