import { buildAssetsConfig, LinkAssetDefinition, RelType } from "./helpers/assets-builder";

function buildLinkHeaderStringPart(base: string, asset: LinkAssetDefinition): string {
  const rel = asset.rel === RelType.Stylesheet ? "preload" : asset.rel;
  const crossorigin = asset.crossorigin ? "crossorigin" : "";
  const as = asset.as ? `as="${asset.as}"` : "";
  const relAttr = rel ? `rel="${rel}"` : "";

  const attrs = [relAttr, as, crossorigin].filter((a) => a).join("; ");
  const finalAttrs = attrs.length ? `; ${attrs}` : "";

  return `<${base}${asset.name}>${finalAttrs}`;
}

/**
 * Builds content for Link header
 * More documentation available at https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link
 *
 * @param criticalAssets {LinkAssetDefinition[]} List of critical assets to be server pushed
 */
function buildLinkHeaderString(base: string, criticalAssets: LinkAssetDefinition[]): string {
  const uniqueLinkAssets = Array.from(
    new Set(criticalAssets.map((element) => buildLinkHeaderStringPart(base, element))),
  );

  return uniqueLinkAssets.join(", ");
}

/**
 * Builds the content of the `Link` header for critical assets to be preloaded.
 */
function buildLinkHeaderValue(base: string, assets: ReturnType<typeof buildAssetsConfig>): string {
  const assetList = [...assets.PRELOAD_FONTS, ...assets.PRELOAD_CSS_ASSETS, ...assets.PRELOAD_JS_ASSETS];

  return buildLinkHeaderString(encodeURI(base), assetList);
}

export { buildLinkHeaderValue };
