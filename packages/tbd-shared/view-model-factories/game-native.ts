import { getAssets } from "@ppb/tbd-store/config/assets-config";

export function getJackpotLogo(jackpotLogoType: string): string | undefined {
  const assets = getAssets();

  if (!jackpotLogoType || !assets?.BASE_PATH) {
    return undefined;
  }

  return `${assets.BASE_PATH}/${jackpotLogoType}.png`;
}
