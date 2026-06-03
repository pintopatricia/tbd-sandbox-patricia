import { FunctionComponent } from "react";
import { Platform } from "react-native";
import { Text } from "@ppb/the-wall-native";
import { getEndpoint } from "../../config/endpoints";
import appConfiguration from "../../config/app-configuration.native";
import { getCustomUserAgent } from "../../helpers/user-agent.native";
import styles from "./DebugInfo.native.styles";

const OS = Platform.OS as "android" | "ios";
const APP_KEY = appConfiguration.appConfig?.APP_KEYS[OS] || "";

type DebugInfoProps = { reason: Error | string };

type DebugInfoTextProps = { info: Error | string; subTitle: string };
const Info: FunctionComponent<DebugInfoTextProps> = ({ info, subTitle }) => (
  <>
    <Text style={styles.subTitle}>{subTitle}</Text>
    <Text style={styles.text}>
      <Text>{info.toString()}</Text>
    </Text>
  </>
);
const getEndpointInfo = (): string => {
  try {
    // We are getting the CATALOGUE endpoint to get the hostname the app is using
    const endpoint = new URL(getEndpoint("CATALOGUE"));
    return endpoint.hostname;
  } catch (error) {
     
    console.error(error);
    if (error instanceof Error) {
      return error.message;
    }
    return error as string;
  }
};

export const DebugInfo: FunctionComponent<DebugInfoProps> = ({ reason }) => {
  const endpointInfo = getEndpointInfo();
  const userAgent = getCustomUserAgent();
  return (
    <>
      <Text style={styles.title}>DEBUG MESSAGE</Text>
      <Info subTitle="You are seeing this because:" info={reason} />
      <Info subTitle="App key:" info={APP_KEY} />
      <Info subTitle="Endpoint info:" info={endpointInfo} />
      <Info subTitle="User agent:" info={userAgent} />
      <Info subTitle="Current OS:" info={Platform.OS} />
    </>
  );
};
