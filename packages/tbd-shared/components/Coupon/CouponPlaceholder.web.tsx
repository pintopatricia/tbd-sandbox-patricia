import { FunctionComponent } from "react";
import { Placeholder } from "@ppb/the-wall-web/components/bricks/Placeholder/Placeholder";
import styles from "./CouponPlaceholder.web.css";

const CouponPlaceholder: FunctionComponent = () => (
  <section className={styles.placeholder}>
    <div className={styles.teamsContainer}>
      <div className={styles.teamName}>
        <Placeholder />
      </div>
      <div className={styles.teamName}>
        <Placeholder />
      </div>
    </div>
    <div className={styles.betButtons}>
      <div className={styles.betButton}>
        <Placeholder />
      </div>
      <div className={styles.betButton}>
        <Placeholder />
      </div>
      <div className={styles.betButton}>
        <Placeholder />
      </div>
      <div className={styles.statsButton}>
        <Placeholder />
      </div>
    </div>
  </section>
);

export default CouponPlaceholder;
