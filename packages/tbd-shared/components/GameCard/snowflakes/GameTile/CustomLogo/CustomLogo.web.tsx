import { FunctionComponent } from "react";
import classnames from "classnames";

import { GameBaseImage } from "@ppb/tbd-store/state/entities/Gaming.types";

import styles from "./CustomLogo.web.css";
import { CustomLogoProps } from "./CustomLogo.types";

const HEIGHT_LIMIT = 120;

export const buildSrcSet = (image: GameBaseImage, originalHeight: number): string[] => {
  const imgs: { url: string; height: number; pxDensity: number }[] = [];

  for (let count = 1; count <= 3; count += 1) {
    const height = Math.min(originalHeight * count, HEIGHT_LIMIT);

    imgs.push({ url: image.url, height, pxDensity: count });

    if (height === HEIGHT_LIMIT) {
      break;
    }
  }

  return imgs.map((img) => {
    const url = new URL(img.url);
    url.searchParams.set("w", "auto");
    url.searchParams.set("h", img.height.toString());

    return `${url} ${img.pxDensity}x`;
  });
};

export const CustomLogo: FunctionComponent<CustomLogoProps> = ({ customLogo, isGameInfo, sizes }) => (
  <picture className={classnames(styles.customLogo, isGameInfo ? styles.gameInfo : "")}>
    {sizes.map((dimension) => (
      <source
        key={dimension.size}
        srcSet={buildSrcSet(customLogo.image, dimension.size).join(", ")}
        media={dimension.mediaType && `(${dimension.mediaType}: ${dimension.mediaValue}px)`}
      />
    ))}
    <img src={customLogo.image.url} alt="" />
  </picture>
);
