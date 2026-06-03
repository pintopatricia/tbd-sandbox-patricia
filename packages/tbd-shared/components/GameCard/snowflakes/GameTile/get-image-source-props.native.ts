import { ImageSourcePropType, ImageURISource } from "react-native";
import { GameTileImage, GameTileImages } from "./GameTile.types";

// Return only the images that have all the attributes as on Android will cause the app
// to crash when width or height is null
export const getImageProps = (image: GameTileImage | undefined): ImageURISource[] => {
  if (image) {
    const { url: uri, width, height } = image;
    if (uri && width && height) {
      return [{ uri, width, height }];
    }
  }
  return [];
};

export const getImageSourceProps = (background: GameTileImages | undefined): ImageSourcePropType => {
  const images: ImageURISource[] = [];
  images.push(
    ...getImageProps(background?.small),
    ...getImageProps(background?.medium),
    ...getImageProps(background?.large),
  );

  return images;
};
