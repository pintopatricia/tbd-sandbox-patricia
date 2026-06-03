import { useContext } from "react";
import { ScrollableSwimlane, Placeholder, Divider } from "@ppb/the-wall-web";

import { ConfigContext } from "../../Config/ConfigContext";

import styles from "./ObbEventPopularsCardPlaceholder.web.css";

const ObbEventPopularsCardPlaceholder = () => {
  const { isDesktopLayout } = useContext(ConfigContext);

  return (
    <ScrollableSwimlane title="" isDesktopLayout={isDesktopLayout}>
      <div className={styles.card}>
        <div className={styles.bettingOpportunitiesContainer}>
          <div className={styles.marketSection}>
            <div className={styles.popularEvidenceContainer}>
              <div className={styles.popularEvidencePlaceholderContainer}>
                <Placeholder />
              </div>
            </div>
            <div className={styles.marketContent}>
              <div className={styles.marketContentContainer}>
                <Placeholder />
              </div>
              <div className={styles.buttonContainer}>
                <Placeholder />
              </div>
            </div>
            <div className={styles.statsContainer}>
              <div className={styles.statsPlaceholderContainer}>
                <Placeholder />
              </div>
            </div>
          </div>

          <Divider />

          <div className={styles.marketSection}>
            <div className={styles.popularEvidenceContainer}>
              <div className={styles.popularEvidencePlaceholderContainer}>
                <Placeholder />
              </div>
            </div>
            <div className={styles.marketContent}>
              <div className={styles.marketContentContainer}>
                <Placeholder />
              </div>
              <div className={styles.buttonContainer}>
                <Placeholder />
              </div>
            </div>
            <div className={styles.statsContainer}>
              <div className={styles.statsPlaceholderContainer}>
                <Placeholder />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <Divider />
          <div className={styles.showMoreContainer}>
            <div className={styles.linkContainer}>
              <Placeholder />
            </div>
          </div>
        </div>
      </div>
    </ScrollableSwimlane>
  );
};

export default ObbEventPopularsCardPlaceholder;
