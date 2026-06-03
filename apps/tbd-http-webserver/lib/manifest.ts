import { LocalStorage } from "./@types/LocalStorage";

/**
 * Function getManifest
 * Responsible for reading the manifest file produced by webpack dynamically
 * Returns a promise with the manifest content (assets to be added to the HTML template)
 */
export default async function getManifest($localStorage: LocalStorage): Promise<Record<string, string>> {
  const manifest = await $localStorage.getItem("tbd-assets/manifest.json").then((result) => JSON.parse(result));

  if (!manifest) {
    throw new Error("unable to read manifest.json file");
  }

  return manifest;
}
