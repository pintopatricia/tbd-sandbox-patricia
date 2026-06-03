import { FunctionComponent } from "react";
import classnames from "classnames";
import { PrimaryButton } from "@ppb/the-wall-web";
import type { CasinoPromotionCardProps } from "./CasinoPromotionCard.types";
import styles from "./CasinoPromotionCard.web.css";

type CasinoPromotionCardWebProps = {
  backgroundImage?: string;
};

export type CasinoPromotionCardViewModel = CasinoPromotionCardProps & CasinoPromotionCardWebProps;

export const CasinoPromotionCard: FunctionComponent<CasinoPromotionCardViewModel> = ({
  action,
  backgroundImage,
  onActionButtonTap,
  promotionImage,
  subtitle,
  termsAndConditions,
  title,
  headline,
}) => {
  const titleContainerClassnames = classnames(styles.promotionTitles, styles.title, "typography-h158", {
    [styles.titleEnd]: !headline,
  });
  const headlineContainerClassnames = classnames(styles.promotionTitles, styles.headline, "typography-h158", {
    [styles.titleEnd]: !!headline,
  });

  const subtitleContainerClassnames = classnames(styles.promotionTitles, styles.subtitle, "typography-h182");
  const summaryClassnames = classnames(styles.summary, "typography-h072");

  return (
    <section className={styles.promotionCard} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className={styles.promotionContainer}>
        <div className={styles.promotionBody}>
          <div className={styles.promotionInfoContainer}>
            <div className={titleContainerClassnames}>
              <p>{title}</p>
            </div>
            {!!headline && (
              <div className={headlineContainerClassnames}>
                <p>{headline}</p>
              </div>
            )}
            {!!subtitle && (
              <div className={subtitleContainerClassnames}>
                <p>{subtitle}</p>
              </div>
            )}
            <div className={styles.actionContainer}>
              <div className={styles.promotionAction}>
                <PrimaryButton label={action.label} onTap={onActionButtonTap} />
              </div>
            </div>
          </div>
          {!!promotionImage && (
            <div className={styles.promotionImageContainer}>
              <img className={styles.promotionImage} src={promotionImage} alt="promotion" />
            </div>
          )}
        </div>
        {termsAndConditions?.summary ? (
          <footer className={styles.promotionFooter}>
            <p className={summaryClassnames}>{termsAndConditions.summary}</p>
          </footer>
        ) : null}
      </div>
    </section>
  );
};
