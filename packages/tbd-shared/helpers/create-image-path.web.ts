export function createImagePath(image?: string): string | undefined {
  if (!image?.trim()) return undefined;

  const assetsPath = window.__TBD_ENVIRONMENT__?.ASSETS?.BASE_PATH;

  return assetsPath ? `${assetsPath}/${image}.png` : undefined;
}
