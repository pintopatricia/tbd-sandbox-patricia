import { FunctionComponent, useCallback, MouseEvent } from "react";
import * as React from "react";
import classnames from "classnames";

import {
  PromotionAction,
  PromotionBackgroundImage,
  PromotionContentType,
  PromotionTermsAndConditions,
} from "@ppb/the-wall-common/types/PromoCard/PromoCard.types";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { AssetsIconName } from "@ppb/the-wall-icons";
import { HEIGHTS, WIDTHS } from "@ppb/the-wall-common/base-theme-tokens/spacing";

import { PrimaryButton } from "@ppb/the-wall-web";
import { PromotionTitles } from "./snowflakes/PromotionTitles/PromotionTitles.web";
import type { PromotionCardProps } from "./PromotionCard.types";
import styles from "./PromotionCard.web.css";

const MI_CLASS = "mi-web";
const PIXEL_TRACKER = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const noop = (): void => {};

const Footer: FunctionComponent<{
  action?: PromotionAction;
  isImsPromo?: boolean;
  promotionContentType: PromotionContentType;
  onPromotionCardTap?: () => void;
  onTermsAndConditionsTap: () => void;
  termsAndConditions: PromotionTermsAndConditions | null;
  termsAndConditionsLabel?: string;
  children?: React.ReactNode;
}> = ({
  action,
  isImsPromo,
  promotionContentType,
  onPromotionCardTap,
  onTermsAndConditionsTap,
  termsAndConditions,
  termsAndConditionsLabel,
  children,
}) => {
  const onTermsAndConditionsCallback = useCallback(
    (event: MouseEvent) => {
      // Prevent the click propagation from the terms and condition button to the banner
      event.stopPropagation();
      // Prevent the browser's default action on the image href element
      event.preventDefault();

      onTermsAndConditionsTap();
    },
    [onTermsAndConditionsTap],
  );

  // Prevent the click propagation from ActionButton
  const onPromotionActionButtonTap = useCallback((event: MouseEvent) => {
    event.stopPropagation();
  }, []);

  return (
    <footer className={styles.promotionFooter}>
      <div className={styles.promoDescriptionContainer}>
        <div className={styles.promotionTermsAndConditions}>
          {(termsAndConditions || isImsPromo) && termsAndConditionsLabel && termsAndConditions?.url && (
            <button
              className={classnames("typography-h072", styles.promotionTermsAndConditionsLink)}
              onClick={onTermsAndConditionsCallback}
            >
              <span className={styles.promotionTermsAndConditionsLabel}>{termsAndConditionsLabel}</span>
            </button>
          )}
        </div>
      </div>
      {promotionContentType !== PromotionContentType.MovableInk && (
        <div
          className={styles.promotionAction}
          onClick={onPromotionActionButtonTap}
          role="button"
          onKeyUp={noop}
          tabIndex={0}
        >
          {promotionContentType === PromotionContentType.Oddsboost && (
            <div className={styles.betButton}>{children}</div>
          )}
          {promotionContentType !== PromotionContentType.Oddsboost &&
            action &&
            "label" in action &&
            onPromotionCardTap && <PrimaryButton label={action.label} onTap={onPromotionCardTap} />}
        </div>
      )}
    </footer>
  );
};

const RegularPromotion: FunctionComponent<{
  action: PromotionAction;
  backgroundImage?: PromotionBackgroundImage;
  isImsPromo?: boolean;
  promotionContentType: PromotionContentType;
  promoTypeLabel?: string;
  name: string;
  onPromotionCardTap: () => void;
  onTermsAndConditionsTap: () => void;
  termsAndConditions: PromotionTermsAndConditions | null;
  termsAndConditionsLabel?: string;
  title: string | null;
  hasBetfairBoost?: boolean;
  children: React.ReactNode;
}> = ({
  action,
  backgroundImage,
  isImsPromo,
  promotionContentType,
  promoTypeLabel,
  name,
  onPromotionCardTap,
  onTermsAndConditionsTap,
  termsAndConditions,
  termsAndConditionsLabel,
  title,
  hasBetfairBoost,
  children,
}) => {
  const summaryClassnames = classnames(styles.promotionSummary, "typography-h082");
  const promotionHeaderClassnames = classnames(styles.promotionHeader, {
    [styles.promotionHeaderContent]: hasBetfairBoost || promotionContentType === PromotionContentType.Link,
  });

  return (
    <>
      <div className={styles.promotionImageContainer}>
        {backgroundImage?.url && (
          <img
            className={styles.promotionImage}
            alt=""
            src={backgroundImage.url}
            height={HEIGHTS["promo-card-height"]}
            width={WIDTHS["swimlane-item-container-max-width"]}
          />
        )}
      </div>
      <div className={styles.promotionOverlay}>
        <article className={styles.promotionContent}>
          <header className={promotionHeaderClassnames}>
            {hasBetfairBoost && (
              <div className={styles.oddsBoostTag}>
                <GenericIcon name={AssetsIconName.BETFAIR_BOOST} color={"var(--brand-betfair-icon-default)"} />
              </div>
            )}
            {promotionContentType === PromotionContentType.Link && (
              <span className={`${styles.linkTag} typography-h220`}>{promoTypeLabel}</span>
            )}
          </header>
          <div className={styles.promotionBody}>
            <PromotionTitles title={name} subtitle={title} />
            {termsAndConditions?.summary && <span className={summaryClassnames}>{termsAndConditions.summary}</span>}
          </div>
          <Footer
            action={action}
            isImsPromo={isImsPromo}
            promotionContentType={promotionContentType}
            onPromotionCardTap={onPromotionCardTap}
            onTermsAndConditionsTap={onTermsAndConditionsTap}
            termsAndConditions={termsAndConditions}
            termsAndConditionsLabel={termsAndConditionsLabel}
          >
            {children}
          </Footer>
        </article>
      </div>
    </>
  );
};

const MIPromotion: FunctionComponent<{
  action: PromotionAction;
  backgroundImage?: PromotionBackgroundImage;
  isImsPromo?: boolean;
  hasPersonalisation?: boolean;
  onTermsAndConditionsTap: () => void;
  termsAndConditions: PromotionTermsAndConditions | null;
  termsAndConditionsLabel?: string;
}> = ({
  action,
  backgroundImage,
  isImsPromo,
  hasPersonalisation,
  onTermsAndConditionsTap,
  termsAndConditions,
  termsAndConditionsLabel,
}) => (
  <>
    {action && "viewLink" in action && (
      <a href={action.viewLink.viewUrl}>
        <img
          className={`${styles.promotionImage} ${MI_CLASS}`}
          alt=""
          height={HEIGHTS["promo-card-height"]}
          width={WIDTHS["swimlane-item-container-max-width"]}
          {...(hasPersonalisation
            ? { "mi-src": backgroundImage?.url, src: PIXEL_TRACKER }
            : { src: backgroundImage?.url })}
        />
        <Footer
          isImsPromo={isImsPromo}
          promotionContentType={PromotionContentType.MovableInk}
          onTermsAndConditionsTap={onTermsAndConditionsTap}
          termsAndConditions={termsAndConditions}
          termsAndConditionsLabel={termsAndConditionsLabel}
        />
      </a>
    )}
  </>
);

export const PromotionCard: FunctionComponent<PromotionCardProps> = ({
  action,
  backgroundImage,
  isImsPromo,
  hasPersonalisation = false,
  promotionContentType = PromotionContentType.Generic,
  promoTypeLabel,
  name,
  onPromotionCardTap,
  onTermsAndConditionsTap,
  termsAndConditions,
  termsAndConditionsLabel = "",
  title,
  hasBetfairBoost = false,
  children,
}) => (
  <section className={styles.promotionCard}>
    <div className={styles.promotionCardLink} onClick={onPromotionCardTap} role="button" onKeyUp={noop} tabIndex={0}>
      {promotionContentType === PromotionContentType.MovableInk ? (
        <MIPromotion
          action={action}
          backgroundImage={backgroundImage}
          isImsPromo={isImsPromo}
          hasPersonalisation={hasPersonalisation}
          onTermsAndConditionsTap={onTermsAndConditionsTap}
          termsAndConditions={termsAndConditions}
          termsAndConditionsLabel={termsAndConditionsLabel}
        />
      ) : (
        <RegularPromotion
          action={action}
          backgroundImage={backgroundImage}
          isImsPromo={isImsPromo}
          promotionContentType={promotionContentType}
          promoTypeLabel={promoTypeLabel}
          name={name}
          onPromotionCardTap={onPromotionCardTap}
          onTermsAndConditionsTap={onTermsAndConditionsTap}
          termsAndConditions={termsAndConditions}
          termsAndConditionsLabel={termsAndConditionsLabel}
          title={title}
          hasBetfairBoost={hasBetfairBoost}
        >
          {children}
        </RegularPromotion>
      )}
    </div>
  </section>
);
