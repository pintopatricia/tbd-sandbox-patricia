export function getImagePath(image?: string): string | undefined {
  let imagePath;
  if (image) {
    const assetsPath = (window as any).__TBD_ENVIRONMENT__.ASSETS.BASE_PATH; // eslint-disable-line
    imagePath = `${assetsPath}/${image}.png`;
  }
  return imagePath;
}
