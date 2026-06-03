import { FunctionComponent, useState } from "react";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { AssetsIconName } from "@ppb/the-wall-icons";

type ImageWithFallbackProps = {
  url: string;
  alt: string;
  fallbackIconName: AssetsIconName;
};

export const ImageWithFallback: FunctionComponent<ImageWithFallbackProps> = ({ url, alt, fallbackIconName }) => {
  const [hasImageError, setHasImageError] = useState(false);

  if (hasImageError) {
    return <GenericIcon name={fallbackIconName} />;
  }

  return (
    <img
      src={url}
      alt={alt}
      onError={() => {
        setHasImageError(true);
      }}
    />
  );
};
