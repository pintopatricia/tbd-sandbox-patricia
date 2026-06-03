 
import { FunctionComponent, useContext } from "react";
import { Placeholder } from "@ppb/the-wall-web/components/bricks/Placeholder/Placeholder";
import styles from "./NavigationTabsListPlaceholder.web.css";
import { ConfigContext } from "../Config/ConfigContext";

/**
 * CardGroup placeholder
 */
const CardGroupPlaceholder: FunctionComponent = () => {
  const { isDesktopLayout } = useContext(ConfigContext);
  return (
    <section className={`${styles.placeholder} ${isDesktopLayout ? styles.placeholderDesktop : ""}`}>
      <div className={styles.placeholderTabList}>
        <div className={styles.placeholderTabListItem}>
          <Placeholder />
        </div>
        <div className={styles.placeholderTabListItem}>
          <Placeholder />
        </div>
        <div className={styles.placeholderTabListItem}>
          <Placeholder />
        </div>
        <div className={styles.placeholderTabListItem}>
          <Placeholder />
        </div>
      </div>
      <div className={styles.placeholderTabContainer}>
        <Placeholder className={styles.noBorderRadius} />
      </div>
    </section>
  );
};

export default CardGroupPlaceholder;
