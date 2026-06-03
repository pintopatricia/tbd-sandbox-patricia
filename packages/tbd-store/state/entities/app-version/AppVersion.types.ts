export type AppPlatformVersionBlacklist = {
  versioncode: number;
};

export type AppPlatformVersion = {
  url?: string;
  downloadUrl?: string;
  storeUrl?: string;
  versionCode?: number;
  minVersionCode?: number;
  minOSVersion?: string;
  blackList?: AppPlatformVersionBlacklist[];
};

export type AppPlatform = "android" | "ios";

export type AppVersion = Record<AppPlatform, AppPlatformVersion> | null;

export type InitialAppVersionState = {
  appstoreurl?: string;
  iosappversioncode?: number;
  iosappminversioncode?: number;
  miniosversion?: string;
  iosappblacklist?: {
    versioncode: number;
  }[];
  androiddownloadurl?: string;
  playstoreurl?: string;
  androidappversioncode?: number;
  minversioncode?: number;
  minandroidversion?: string;
  androidappblacklist?: {
    versioncode: number;
  }[];
};
