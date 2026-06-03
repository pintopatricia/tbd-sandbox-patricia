// Components
import { FunctionComponent } from "react";
import { RecentFormDetailed } from "./snowflakes/RecentFormDetailed/RecentFormDetailed.web";

import { ComponentProps } from "./props";
import styles from "./RecentFormCard.web.css";

const ConnectedRecentFormCard: FunctionComponent<ComponentProps> = ({ home, away, translations }) => {
  // Empty component
  if (!home || !away) {
    return <></>;
  }
  return (
    <div className={styles.recentFormCard}>
      <div className={styles.content}>
        <RecentFormDetailed
          relativeFixtureResult={[home.detailed, away.detailed]}
          i18n={translations.recentFormDetailedTranslations}
        />
      </div>
    </div>
  );
};

export default ConnectedRecentFormCard;
