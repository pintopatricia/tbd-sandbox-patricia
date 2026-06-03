import { buildViewResult } from "@ppb/tbd-store";

type CriticalChunks = {
  criticalChunksCss: string[];
  criticalChunksJs: string[];
  criticalImages: string[];
};

type ViewResult = ReturnType<typeof buildViewResult>;
type ViewResultData = ViewResult["data"];
type ViewResultDataItem = NonNullable<ViewResultData[keyof ViewResultData]>;

const extractImages = (normalizationResult: ViewResultDataItem): string[] =>
  normalizationResult
    .map((normalizedEntity) => {
      if (!normalizedEntity) return null;

      if ("backgroundImage" in normalizedEntity) {
        return normalizedEntity.backgroundImage.map((image) => image?.url);
      }

      if ("image" in normalizedEntity) {
        return normalizedEntity.image?.url;
      }

      if ("promoImage" in normalizedEntity) {
        return normalizedEntity.promoImage?.url;
      }

      if ("selections" in normalizedEntity) {
        return normalizedEntity.selections.map((selection) => selection.silkUrl);
      }

      return null;
    })
    .flat()
    .filter((image): image is NonNullable<typeof image> => !!image);

export const getCriticalChunksAssets = (data: ViewResult["data"]): CriticalChunks => {
  const JS_CRITICAL_CHUNKS = new Set<string>();
  const CSS_CRITICAL_CHUNKS = new Set<string>();
  const IMG_CRITICAL_CHUNKS = new Set<string>();

  const addAssetToCriticalChunk = (name: string): void => {
    JS_CRITICAL_CHUNKS.add(`${name}.js`);
    CSS_CRITICAL_CHUNKS.add(`${name}.css`);
  };

  // Check full cards only in the payload, which means they are critical for a first load
  Object.entries(data).forEach(([typename, result]) => {
    const images = extractImages(result);

    if (result.length > 0) {
      addAssetToCriticalChunk(typename);
    }

    if (images.length > 0) {
      images.forEach((img) => IMG_CRITICAL_CHUNKS.add(img));
    }
  });

  return {
    criticalChunksJs: Array.from(JS_CRITICAL_CHUNKS),
    criticalChunksCss: Array.from(CSS_CRITICAL_CHUNKS),
    criticalImages: Array.from(IMG_CRITICAL_CHUNKS),
  };
};
