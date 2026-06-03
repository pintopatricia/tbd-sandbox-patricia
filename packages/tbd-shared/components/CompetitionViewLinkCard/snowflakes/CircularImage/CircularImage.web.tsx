import { FunctionComponent } from "react";
import classnames from "classnames";

import { SportsIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { type CircularImageCommonProps, CircularImageSize } from "./CircularImage.types";

import styles from "./CircularImage.web.css";

export type CircularImageProps = CircularImageCommonProps & {
  imageURL?: string;
  imageAlt?: string;
};

export const CircularImage: FunctionComponent<CircularImageProps> = ({
  imageURL,
  imageAlt,
  fallbackIcon = SportsIconName.COMPETITION,
  text,
  size = CircularImageSize.Large,
}) => {
  const imageClassNames = classnames(styles.imageContainer, {
    [styles.small]: size === CircularImageSize.Small,
    [styles.large]: size === CircularImageSize.Large,
  });

  return (
    <div className={styles.container}>
      <div className={imageClassNames}>
        {imageURL ? (
          <img loading="lazy" className={styles.image} src={imageURL} alt={imageAlt} />
        ) : (
          <GenericIcon name={fallbackIcon} color={"var(--neutrals-icon-secondary)"} />
        )}
      </div>
      {text && <p className={`typography-h120 ${styles.text}`}>{text}</p>}
    </div>
  );
};
