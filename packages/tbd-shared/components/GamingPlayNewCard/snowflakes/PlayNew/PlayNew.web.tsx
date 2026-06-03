import { FunctionComponent } from "react";
import { BadgeLayout, BadgeType } from "@ppb/the-wall-common/types";
import classnames from "classnames";
import { Badge } from "@ppb/the-wall-web/components/walls/Badge/Badge";
import { Timer } from "../../../TimerCountDown/snowflakes/Timer/Timer.web";
import { PlayNewProps } from "./PlayNew.types";
import styles from "./PlayNew.web.css";

const IMG_SIZES = {
  xsmall: 225,
  small: 350,
  medium: 500,
  intermediate: 700,
  large: 900,
};

/**
 * Returns the srcset property, based on url and a specific width
 * @param {object} url
 * @param {number} width
 * @param promotionsCDN
 * @param pmas3PromotionsCDN
 */
const buildSrcSetUrl = (url: any, width: any, promotionsCDN: string, pmas3PromotionsCDN: string) => {
  const origin = `${url.origin}/`;
  if (origin === promotionsCDN || origin === pmas3PromotionsCDN) {
    return `${origin}cdn-cgi/image/h=${width},f=auto${url.pathname}`;
  }
  return url;
};

/**
 * Creates srcset attribute string for an image object
 * @returns {string}
 * @param imageSource
 * @param promotionsCDN
 * @param pmas3PromotionsCDN
 */
const createSrcset = (imageSource: any, promotionsCDN: string, pmas3PromotionsCDN: string): string => {
  const sizes = Object.values(IMG_SIZES);
  const imgs = sizes.map((size) => {
    if (!imageSource) {
      return null;
    }

    const img = new URL(imageSource);
    const src = buildSrcSetUrl(img, size, promotionsCDN, pmas3PromotionsCDN);

    return {
      src,
      w: size,
    };
  });

  return imgs
    .filter(Boolean)
    .map((img) => `${img?.src} ${img?.w}w`)
    .join(", ");
};

export const PlayNew: FunctionComponent<PlayNewProps> = ({
  isStaticPromo,
  title,
  subtitle,
  moreInfoLabel,
  buttonLabel,
  timer,
  logoImage,
  backgroundImage,
  targetUrl,
  arrowImage,
  badgeLabel,
  onMoreInfoClick,
  onPlayNowClick,
  promotionsCDN,
  pmas3PromotionsCDN,
}) => {
  const containerClassnames = classnames(styles.container, {
    [styles.staticContainer]: isStaticPromo,
  });
  const titleClassnames = classnames("typography-h158", styles.title);
  const subtitleClassnames = classnames("typography-h098", styles.title, styles.subtitle);
  const moreInfoClassnames = classnames(styles.moreInfoLink, "typography-h180");
  const buttonClassnames = classnames(styles.button, "typography-h370");
  const rightContainerClassnames = classnames(styles.rightContainerWidget, {
    [styles.activeRightContainerWidget]: !isStaticPromo,
  });
  const logoClassnames = classnames({
    [styles.activeLogoImage]: !isStaticPromo,
    [styles.staticLogoImage]: isStaticPromo,
  });
  const backgroundClassnames = classnames(styles.backgroundImageContainer, {
    [styles.staticBackground]: isStaticPromo,
    [styles.activeBackground]: !isStaticPromo,
  });

  return (
    <div className={containerClassnames}>
      <span className={styles.contentContainer} style={{ backgroundImage: `url(${arrowImage})` }}>
        <span className={styles.leftContentWidget}>
          <span className={styles.titleContainer}>
            {title && <span className={titleClassnames}>{title}</span>}
            {subtitle && <span className={subtitleClassnames}>{subtitle}</span>}
          </span>
          {isStaticPromo && timer ? (
            <div className={styles.timerContainer}>
              <Timer hours={timer.hours} minutes={timer.minutes} />
            </div>
          ) : (
            <a className={buttonClassnames} href={targetUrl} onClick={onPlayNowClick}>
              {buttonLabel}
            </a>
          )}
        </span>
        <span className={styles.rightContentWidget}>
          <span className={rightContainerClassnames}>
            {logoImage && (
              <img
                className={logoClassnames}
                srcSet={createSrcset(logoImage, promotionsCDN, pmas3PromotionsCDN)}
                src={logoImage}
                alt="Logo"
              />
            )}
            {!isStaticPromo && (
              <div className={styles.gameBadgeContainer}>
                <Badge label={badgeLabel} badgeType={BadgeType.NEW} badgeLayout={BadgeLayout.GAME_TILE_BADGE} />
              </div>
            )}
            <a className={moreInfoClassnames} href={targetUrl} onClick={onMoreInfoClick}>
              {moreInfoLabel}
            </a>
          </span>
        </span>
        {backgroundImage && <img className={backgroundClassnames} src={backgroundImage} alt="Background" />}
      </span>
    </div>
  );
};
