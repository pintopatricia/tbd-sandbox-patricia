import { AppVersion, AppPlatformVersion, AppPlatformVersionBlacklist } from "../state";
import { AppVersionQuery } from "../clients/catalogue/catalogue-response-types";

export const mapAppVersion = (appVersionQuery?: AppVersionQuery): AppVersion => {
  if (!appVersionQuery?.AppVersion) {
    return { ios: {}, android: {} };
  }

  const { blackList, downloadUrl, minOSVersion, minVersionCode, storeUrl, versionCode, url } =
    appVersionQuery.AppVersion;

  const version: AppPlatformVersion = {
    blackList: blackList ? blackList.filter((item): item is AppPlatformVersionBlacklist => item !== null) : undefined,
    url: url ?? undefined,
    storeUrl: storeUrl ?? undefined,
    versionCode: versionCode ?? undefined,
    downloadUrl: downloadUrl ?? undefined,
    minOSVersion: minOSVersion ?? undefined,
    minVersionCode: minVersionCode ?? undefined,
  };

  return {
    android: version,
    ios: version,
  };
};
