import { AssetsConfig } from "../state/initial-state/Environment.types";

let ASSETS: AssetsConfig | undefined;

/**
 * Set configuration for retrieving assets
 */
export function setupAssets(assetsConfig: AssetsConfig, basePath?: string): void {
  ASSETS = assetsConfig;

  // FIXME: native, send this to the app-context package when it becomes basePath aware (endpoints migration)
  if (basePath && !ASSETS.HOST) {
    ASSETS.BASE_PATH = new URL(ASSETS.BASE_PATH, basePath).toString();
  }
}

/**
 * Get assets configuration
 */
export function getAssets(): AssetsConfig | undefined {
  return ASSETS;
}
