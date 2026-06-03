import { FunctionComponent } from "react";
import classnames from "classnames";

import styles from "./PromotionTitles.web.css";

export type PromotionTitlesProps = {
  title: string;
  subtitle: string | null;
};

export const PromotionTitles: FunctionComponent<PromotionTitlesProps> = ({ title, subtitle }) => {
  const titleContainerClassnames = classnames(styles.promotionTitles, styles.title, "typography-h158");

  const subtitleContainerClassnames = classnames(styles.promotionTitles, styles.subtitle, "typography-h180");

  return (
    <section className={styles.container}>
      <div className={titleContainerClassnames}>
        <span>{title}</span>
      </div>
      {subtitle && (
        <div className={subtitleContainerClassnames}>
          <span>{subtitle}</span>
        </div>
      )}
    </section>
  );
};
