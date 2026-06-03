import type { JSX } from "react";
import { FunctionComponent, ReactNode, useCallback, useState } from "react";
import classNames from "classnames";

import { BubbleItemCommonProps } from "./BubbleItem.types";
import styles from "./BubbleItem.web.css";

export type BubbleItemProps = BubbleItemCommonProps & {
  titleIconFallback?: ReactNode;
};

export const BubbleItem: FunctionComponent<BubbleItemProps> = ({
  titleIcon,
  titleIconFallback,
  title,
  description,
  subDescription,
  isLast,
  children,
}): JSX.Element => {
  const [iconValid, setIconValid] = useState(true);

  const onError = useCallback(() => {
    setIconValid(false);
  }, [setIconValid]);

  return (
    <li className={styles.container}>
      <span className={styles.lineContainer}>
        <span className={styles.dot} />
        <div className={classNames(styles.line, isLast && styles.last)} />
      </span>
      <div className={styles.infoContainer}>
        <div className={styles.titleContainer}>
          <div className={styles.iconAndTitleContainer}>
            {titleIcon && (
              <div className={styles.iconContainer}>
                {iconValid ? (
                  <img loading="lazy" src={titleIcon} onError={onError} alt="titleIcon" />
                ) : (
                  titleIconFallback || null
                )}
              </div>
            )}
            <div className={titleIcon && styles.titleWithIconText}>
              <div className={styles.entryText}>
                <span className={styles.titleText}>{title.bold}</span>
                {!!title.regular && <span className={styles.regularText}>&nbsp;-&nbsp;{title.regular}</span>}
              </div>
            </div>
          </div>
          {children && <div className={styles.children}>{children}</div>}
        </div>
        {description || subDescription ? (
          <div className={styles.textContainer}>
            {description && <div className={styles.description}>{description}</div>}
            {subDescription && <div className={styles.subDescription}>{subDescription}</div>}
          </div>
        ) : null}
      </div>
    </li>
  );
};
