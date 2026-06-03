import { FunctionComponent } from "react";
import { HeadToHeadDetailed } from "./snowflakes/HeadToHeadDetailed/HeadToHeadDetailed.web";
import { ComponentProps } from "./props";
import styles from "./HeadToHeadCard.web.css";

const ConnectedHeadToHeadCard: FunctionComponent<ComponentProps> = ({ headToHeadProps, captionTranslations }) => {
  if (!headToHeadProps) return null;

  return (
    <div className={styles.headToHeadCard}>
      <div className={styles.content}>
        <HeadToHeadDetailed headToHeadDetailedProps={headToHeadProps} captionI18n={captionTranslations} />
      </div>
    </div>
  );
};

export default ConnectedHeadToHeadCard;
