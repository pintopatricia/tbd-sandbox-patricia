import { Placeholder } from "@ppb/the-wall-web";
import styles from "./StatsContentCardGroupPlaceholder.web.css";

const StatsContentCardGroupPlaceholder = () => {
  const items = Array.from({ length: 3 }, (_, i) => i);

  return (
    <div className={styles.statsContent}>
      {items.map((_, index) => (
        <div className={styles.supportingContentItem} key={index}>
          <Placeholder />
        </div>
      ))}
    </div>
  );
};

export default StatsContentCardGroupPlaceholder;
