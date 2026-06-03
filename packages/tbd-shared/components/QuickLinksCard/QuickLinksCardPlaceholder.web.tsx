import { Placeholder } from "@ppb/the-wall-web/components/bricks/Placeholder/Placeholder";
import styles from "./QuickLinksCardPlaceholder.web.css";

const QuickLinksCardPlaceholder = () => (
  <div className={styles.placeholder}>
    <div className={styles.placeholderTitle}>
      <Placeholder />
    </div>
    <div className={styles.placeholderContainer}>
      <Placeholder />
    </div>
  </div>
);

export default QuickLinksCardPlaceholder;
