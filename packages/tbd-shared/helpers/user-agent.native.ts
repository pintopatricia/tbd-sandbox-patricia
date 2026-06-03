import { Platform, NativeModules } from "react-native";
import DeviceInfo from "react-native-device-info";
import config from "../config/app-configuration.native";

const applicationName = config.appBrand
  ? config.appBrand[0].toUpperCase() + config.appBrand.slice(1)
  : DeviceInfo.getApplicationName();
const buildNumber = DeviceInfo.getBuildNumber();
const applicationVersion = DeviceInfo.getVersion();
const getUserAgent = () => DeviceInfo.getUserAgent();

const getAndroidUserAgentSync = () => DeviceInfo.getUserAgentSync();
const getiOSUserAgentSync = (): string => {
  // By moving away from `react-native-user-agent` we lost the method to retrieve userAgent synchronous,
  // that was constructed by the dependency itself. So it's not something that we would get from any other dependency.
  // We tried to replicate the same code that was being done in here:
  // https://github.com/bebnev/react-native-user-agent/blob/ae94fecda87767af33320ae989009663489d165d/ios/RNUserAgent.m#L244

  const cfnVersion = "0.0.0"; // Not possible to get with this framework. Custom code needed?
  const darwinVersion = "0.0.0"; // Not possible to get with this framework. Custom code needed?
  // Both CFNetwork and Darwin versions cannot be retrieved by the current framework. If this is needed by our services,
  // we need to create custom Native code to retrieve this information.

  const modelName = DeviceInfo.getModel();
  const deviceSystemName = DeviceInfo.getSystemName();
  const deviceSystemVersion = DeviceInfo.getSystemVersion();

  return `/CFNetwork/${cfnVersion} Darwin/${darwinVersion} (${modelName} ${deviceSystemName}/${deviceSystemVersion})`;
};

export const getCustomUserAgentSuffix = async (): Promise<string> => {
  if (Platform.OS === "ios") {
    // CustomUserAgent is a BridgeModule that expose three methods from iOS native:
    // - getFrameworkVersion - returns the version of the iOS GamesFramework
    // - getResourcesVersion - returns the version of the Gaming Resources from Info.plist
    const { CustomUserAgent } = NativeModules;

    const versions = await Promise.all([CustomUserAgent.getFrameworkVersion(), CustomUserAgent.getResourcesVersion()]);

    return `; TBDN (${applicationName}/${applicationVersion}.${buildNumber}; iOS; GamesFramework/${versions[0]}; ResourcesVersion/${versions[1]})`;
  }
  return "";
};

export const registerCustomUserAgent = async (): Promise<void> => {
  if (Platform.OS === "ios") {
    // CustomUserAgent is a BridgeModule that expose three methods from iOS native:
    // - registerCustomUserAgent(UserAgent: String) - register a User-Agent iOS games framework WkWebViews
    const { CustomUserAgent } = NativeModules;

    const versions = await Promise.all([getCustomUserAgentSuffix(), getUserAgent()]);

    const customUserAgentPart = versions[0];
    const defaultUserAgent = versions[1];

    if (defaultUserAgent && defaultUserAgent.length > 0 && !defaultUserAgent.match(/TBDN \(/gm)) {
      CustomUserAgent.registerCustomUserAgent(defaultUserAgent + customUserAgentPart);
    }
  }
};

export const getCustomUserAgent = (): string => {
  const androidUserAgentToReplace = getAndroidUserAgentSync();
  const iOSUserAgentToReplace = getiOSUserAgentSync();
  const appType = DeviceInfo.getBundleId().split(".").pop();
  // prefix user agent with "TBDN" so we can easily distinguish between Betfair apps when we are applying regexes and filter requests by User Agent
  const defaultUserAgentBase = `TBDN/${applicationName}/${buildNumber}/${appType}/${config.appConfig?.TBDN_DEFAULT_ENVIRONMENT}`;

  switch (Platform.OS) {
    case "ios":
      return `${defaultUserAgentBase}/CFNetwork${iOSUserAgentToReplace.split("CFNetwork")[1]}`;
    case "android":
      return `${defaultUserAgentBase}/Mozilla${androidUserAgentToReplace.split("Mozilla")[1]}`;
    default:
      return DeviceInfo.getUserAgentSync();
  }
};

export const getCustomWebViewUserAgent = async (): Promise<string> => {
  switch (Platform.OS) {
    case "ios": {
      const versions = await Promise.all([getCustomUserAgentSuffix(), getUserAgent()]);
      const customUserAgentPart = versions[0];
      const defaultUserAgent = versions[1];
      return `${defaultUserAgent}${customUserAgentPart}`;
    }
    default:
      return getCustomUserAgent();
  }
};
