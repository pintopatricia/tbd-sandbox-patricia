import { FunctionComponent, useState } from "react";
import { Image, ImageStyle } from "react-native";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { AssetsIconName } from "@ppb/the-wall-icons";

type ImageWithFallbackProps = {
  url: string;
  alt: string;
  fallbackIconName: AssetsIconName;
  style?: ImageStyle;
};

export const ImageWithFallback: FunctionComponent<ImageWithFallbackProps> = ({ url, alt, fallbackIconName, style }) => {
  const [hasImageError, setHasImageError] = useState(false);

  if (hasImageError) {
    return <GenericIcon name={fallbackIconName} />;
  }

  return (
    <Image
      source={{ uri: url }}
      accessibilityLabel={alt}
      style={style}
      onError={() => {
        setHasImageError(true);
      }}
    />
  );
};
