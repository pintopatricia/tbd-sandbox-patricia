import { FunctionComponent, useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "@ppb/the-wall-native";
import { getCookie } from "../../helpers/cookies.native";
import styles from "./EnvironmentBanner.native.styles";
import { getEnv } from "../../config/endpoints";

type EnvironmentIndicator = "drk" | "ie1" | "ie2";

async function resolveEnvironmentIndicator(env: string): Promise<EnvironmentIndicator | null> {
  if (env === "drk" && (await getCookie("drk"))) {
    return "drk";
  }

  if (env === "prd" && (await getCookie("datacenter")) === "ie1") {
    return "ie1";
  }

  if (env === "prd" && (await getCookie("datacenter")) === "ie2") {
    return "ie2";
  }

  return null;
}

export const EnvironmentBanner: FunctionComponent = () => {
  const [environmentIndicator, setEnvironmentIndicator] = useState<EnvironmentIndicator | null>(null);
  const env = getEnv();

  useEffect(() => {
    resolveEnvironmentIndicator(env).then((indicator) => setEnvironmentIndicator(indicator));
  }, [env]);

  if (environmentIndicator) {
    return (
      <View style={styles.banner}>
        <Text style={styles.bannerText}>{environmentIndicator}</Text>
      </View>
    );
  }

  return <></>;
};
