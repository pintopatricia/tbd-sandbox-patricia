import { replaceDomainPlaceholders, EnvironmentConfig, EnvironmentJSON } from "@ppb/tbd-store";
import { PreloadedData } from "../services/preload-catalog-service";
import templateOptions from "../config/template-options.json";
import { SupportedJurisdiction } from "../constants/supported-jurisdictions";
import { Log } from "../@types/Log";

export enum AsType {
  Style = "style",
  Script = "script",
  Font = "font",
  Image = "image",
}

export enum RelType {
  Preconnect = "preconnect",
  Preload = "preload",
  Stylesheet = "stylesheet",
}

export type BaseAssetDefinition = { name: string };
export type LinkAssetDefinition = BaseAssetDefinition & {
  rel: RelType;
  crossorigin?: boolean;
  as?: AsType;
  priority?: boolean;
};
export type ScriptAssetDefinition = BaseAssetDefinition & { defer?: boolean; async?: boolean };
export type SignalFXInstrumenationDefinition = {
  connectivity: boolean;
  visibility: boolean;
};
export type SignalFXAssetDefinition = BaseAssetDefinition & {
  realm: string;
  accessToken: string;
  environment: string;
  disableAutomationFrameworks: boolean;
  instrumentations: SignalFXInstrumenationDefinition;
  disableBots: boolean;
  sessionRecording: boolean;
  sampleRatio: number;
};

const DEFAULT_SIGNALFX_SAMPLE_RATIO = 0.2;
const DEFAULT_SIGNALFX_DISABLE_BOTS = true;
const DEFAULT_SIGNALFX_DISABLE_AUTOMATION_FRAMEWORKS = true;
const DEFAULT_SIGNALFX_INSTRUMENTATION = {
  visibility: true,
  connectivity: true,
};

function getNonNullable<T extends BaseAssetDefinition>(assets: (T | undefined)[]): T[] {
  return assets.filter((asset: T | undefined): asset is T => !!asset);
}

export function buildAssetsConfig(
  $log: Log,
  manifest: Record<string, string>,
  environmentConfig: EnvironmentConfig,
  environment: EnvironmentJSON,
  userLocale: string,
  jurisdiction: SupportedJurisdiction,
  domain: string,
  preloadedData?: PreloadedData,
) {
  function withBaseManifest<T extends BaseAssetDefinition>(entry: T): T | undefined {
    const asset = manifest[entry.name];

    if (!asset) {
      $log.warn(`Failed to include "${entry.name}"`);
      return undefined;
    }

    return {
      ...entry,
      name: `${environmentConfig.ASSETS.BASE_PATH}/${asset}`,
    };
  }

  function withBaseManifestless<T extends BaseAssetDefinition>(entry: T): T | undefined {
    return {
      ...entry,
      name: `${environmentConfig.ASSETS.BASE_PATH}/${entry.name}`,
    };
  }

  function withSignalFX<T extends SignalFXAssetDefinition>(entry: T): T | undefined {
    let sampleRate = entry.sampleRatio;

    if (Number.isNaN(entry.sampleRatio) || sampleRate < 0 || sampleRate > 1) {
      sampleRate = DEFAULT_SIGNALFX_SAMPLE_RATIO;
    }

    return {
      ...entry,
      name: entry.name,
      accessToken: entry.accessToken,
      realm: entry.realm,
      environment: entry.environment,
      sampleRatio: sampleRate,
      disableBots: entry.disableBots,
      disableAutomationFrameworks: entry.disableAutomationFrameworks,
      instrumentations: entry.instrumentations,
    };
  }

  function withDomainExtensionReplace<T extends BaseAssetDefinition>(entry: T): T | undefined {
    return {
      ...entry,
      name: replaceDomainPlaceholders(entry.name, environment.DOMAIN_EXTENSIONS[jurisdiction], domain),
    };
  }

  const CATALOG_PRELOAD_CSS_ASSETS =
    preloadedData?.criticalChunksCss?.map((cssChunk) =>
      withBaseManifest<LinkAssetDefinition>({ name: cssChunk, rel: RelType.Stylesheet, as: AsType.Style }),
    ) || [];

  const CATALOG_PRELOAD_JS_ASSETS =
    preloadedData?.criticalChunksJs?.map((jsChunk) =>
      withBaseManifest<LinkAssetDefinition>({ name: jsChunk, rel: RelType.Preload, as: AsType.Script }),
    ) || [];

  const PRELOAD_IMG_ASSETS =
    preloadedData?.criticalImages?.map((img) => ({
      name: img,
      rel: RelType.Preload,
      as: AsType.Image,
      priority: true,
    })) || [];

  const PRELOAD_CSS_ASSETS = [
    withBaseManifest<LinkAssetDefinition>({ name: "app.css", rel: RelType.Stylesheet, as: AsType.Style }),
    withBaseManifest<LinkAssetDefinition>({
      name: "vendors~app.css",
      rel: RelType.Stylesheet,
      as: AsType.Style,
    }),
    withBaseManifest<LinkAssetDefinition>({
      name: "Header.css",
      rel: RelType.Stylesheet,
      as: AsType.Style,
    }),
    withBaseManifest<LinkAssetDefinition>({
      name: "BottomBar.css",
      rel: RelType.Stylesheet,
      as: AsType.Style,
    }),
    withBaseManifest<LinkAssetDefinition>({
      name: "vendors-colors-tokens~app.css",
      rel: RelType.Stylesheet,
      as: AsType.Style,
    }),
  ];

  function getTranslationAsset<T extends BaseAssetDefinition>({
    locale,
    assetOptions,
    defaultLocale = "en_GB",
  }: {
    locale: string;
    assetOptions?: Omit<T, "name">;
    defaultLocale?: string;
  }): T | undefined {
    let assetName = `translations-${locale}.js`;
    const asset = manifest[assetName];

    if (!asset) {
      assetName = `translations-${defaultLocale}.js`;
    }
    const props = { ...assetOptions, name: assetName };

    return withBaseManifest({
      ...(props as BaseAssetDefinition),
    } as T);
  }

  const PRELOAD_JS_ASSETS = [
    getTranslationAsset<LinkAssetDefinition>({
      locale: userLocale,
      assetOptions: { rel: RelType.Preload, as: AsType.Script },
    }),
    withBaseManifest<LinkAssetDefinition>({
      name: "vendors-react-dom~app.js",
      rel: RelType.Preload,
      as: AsType.Script,
    }),
    withBaseManifest<LinkAssetDefinition>({
      name: "vendors-apollo~app.js",
      rel: RelType.Preload,
      as: AsType.Script,
    }),
    withBaseManifest<LinkAssetDefinition>({
      name: "vendors~app.js",
      rel: RelType.Preload,
      as: AsType.Script,
    }),
    withBaseManifest<LinkAssetDefinition>({
      name: "vendors-colors-tokens~app.js",
      rel: RelType.Preload,
      as: AsType.Script,
    }),
    withBaseManifest<LinkAssetDefinition>({ name: "runtime.js", rel: RelType.Preload, as: AsType.Script }),
    withBaseManifest<LinkAssetDefinition>({ name: "app.js", rel: RelType.Preload, as: AsType.Script }),
    withBaseManifest<LinkAssetDefinition>({ name: "Header.js", rel: RelType.Preload, as: AsType.Script }),
    withBaseManifest<LinkAssetDefinition>({
      name: "BottomBar.js",
      rel: RelType.Preload,
      as: AsType.Script,
    }),
  ];

  const PRELOAD_ICON_ASSETS = [
    withBaseManifest<LinkAssetDefinition>({
      name: "sportsIcons.js",
      rel: RelType.Preload,
      as: AsType.Script,
    }),
    withBaseManifest<LinkAssetDefinition>({
      name: "navigationIcons.js",
      rel: RelType.Preload,
      as: AsType.Script,
    }),
    withBaseManifest<LinkAssetDefinition>({
      name: "systemIcons.js",
      rel: RelType.Preload,
      as: AsType.Script,
    }),
  ];

  const PRELOAD_FONTS = environment.ASSETS.FONTS.map((fontName) =>
    withBaseManifestless<LinkAssetDefinition>({
      name: fontName,
      rel: RelType.Preload,
      as: AsType.Font,
      crossorigin: true,
    }),
  );

  const JS_SCRIPTS = [
    getTranslationAsset<ScriptAssetDefinition>({
      locale: userLocale,
    }),
    withBaseManifest<ScriptAssetDefinition>({ name: "vendors-react-dom~app.js" }),
    withBaseManifest<ScriptAssetDefinition>({ name: "vendors-apollo~app.js" }),
    withBaseManifest<ScriptAssetDefinition>({ name: "vendors~app.js" }),
    withBaseManifest<ScriptAssetDefinition>({ name: "vendors-colors-tokens~app.js" }),
    withBaseManifest<ScriptAssetDefinition>({ name: "runtime.js" }),
    withBaseManifest<ScriptAssetDefinition>({ name: "app.js" }),
    withBaseManifest<ScriptAssetDefinition>({ name: "Header.js" }),
    withBaseManifest<ScriptAssetDefinition>({ name: "BottomBar.js" }),
    withBaseManifest<ScriptAssetDefinition>({ name: "sportsIcons.js" }),
    withBaseManifest<ScriptAssetDefinition>({ name: "navigationIcons.js" }),
    withBaseManifest<ScriptAssetDefinition>({ name: "systemIcons.js" }),
  ];

  // the background service is used for processing images off the main thread when using session replay
  const SIGNALFX_BACKGROUND_SERVICE =
    environment.SIGNALFX && environment.SIGNALFX_SESSION_RECORDING
      ? withBaseManifestless({ name: "background-service.html" })
      : undefined;
  const SIGNALFX = environment.SIGNALFX ? withBaseManifestless({ name: "splunk-otel-web.js" }) : undefined;
  const SIGNALFX_SESSION_RECORDING =
    environment.SIGNALFX && environment.SIGNALFX_SESSION_RECORDING
      ? withBaseManifestless({ name: "splunk-otel-web-session-recorder.js" })
      : undefined;
  const SIGNALFX_META = environment.SIGNALFX
    ? withSignalFX({
        name: environment.SIGNALFX_NAME,
        realm: environment.SIGNALFX_REALM,
        environment: environment.SIGNALFX_ENVIRONMENT,
        accessToken: environment.SIGNALFX_ACCESS_TOKEN,
        sampleRatio: environment.SIGNALFX_SAMPLE_RATIO || DEFAULT_SIGNALFX_SAMPLE_RATIO,
        sessionRecording: environment.SIGNALFX_SESSION_RECORDING,
        instrumentations: environment.SIGNALFX_INSTRUMENTATION ?? DEFAULT_SIGNALFX_INSTRUMENTATION,
        disableBots: environment.SIGNALFX_DISABLE_BOTS ?? DEFAULT_SIGNALFX_DISABLE_BOTS,
        disableAutomationFrameworks:
          environment.SIGNALFX_DISABLE_AUTOMATION_FRAMEWORKS ?? DEFAULT_SIGNALFX_DISABLE_AUTOMATION_FRAMEWORKS,
      })
    : undefined;
  const PRECONNECT_ORIGINS =
    templateOptions.PRECONNECT_ORIGINS?.map((origin) =>
      withDomainExtensionReplace<LinkAssetDefinition>({ name: origin, rel: RelType.Preconnect, crossorigin: true }),
    ) || [];

  return {
    PRELOAD_CSS_ASSETS: getNonNullable(PRELOAD_CSS_ASSETS),
    PRELOAD_JS_ASSETS: getNonNullable(PRELOAD_JS_ASSETS),
    PRELOAD_IMG_ASSETS: getNonNullable(PRELOAD_IMG_ASSETS),
    PRELOAD_ICON_ASSETS: getNonNullable(PRELOAD_ICON_ASSETS),
    PRELOAD_FONTS: getNonNullable(PRELOAD_FONTS),
    CATALOG_PRELOAD_CSS_ASSETS: getNonNullable(CATALOG_PRELOAD_CSS_ASSETS),
    CATALOG_PRELOAD_JS_ASSETS: getNonNullable(CATALOG_PRELOAD_JS_ASSETS),
    JS_SCRIPTS: getNonNullable(JS_SCRIPTS),
    PRECONNECT_ORIGINS: getNonNullable([
      { name: environmentConfig.ASSETS.HOST, rel: RelType.Preconnect, crossorigin: true },
      ...PRECONNECT_ORIGINS,
    ]),
    SIGNALFX_BACKGROUND_SERVICE,
    SIGNALFX,
    SIGNALFX_SESSION_RECORDING,
    SIGNALFX_META,
  };
}
