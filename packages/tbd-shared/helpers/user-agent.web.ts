import { UAParser } from "ua-parser-js";

export const getUserAgent = (): string => window.navigator.userAgent;

export const getUserAgentData = (): UAParser.IResult => UAParser(getUserAgent());

export const getUserAgentOS = (): string | undefined => getUserAgentData().os.name?.toLowerCase();

export const isAndroidDevice = (): boolean => getUserAgentOS() === "android";

export const isIOSDevice = (): boolean => getUserAgentOS() === "ios";

export const getOSVersion = (): string | undefined => getUserAgentData().os.version;
