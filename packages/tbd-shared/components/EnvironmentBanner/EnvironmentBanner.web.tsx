import { FunctionComponent } from "react";
import { getCookie } from "../../helpers/cookies.web";
import styles from "./EnvironmentBanner.web.css";

function resolveEnvironmentIndicator(): string | null {
  const env = window?.__TBD_ENVIRONMENT__?.ENV;

  if (env === "drk" && getCookie("drk")) {
    return "drk";
  }

  if (env === "prd" && getCookie("datacenter") === "ie1") {
    return "ie1";
  }

  if (env === "prd" && getCookie("datacenter") === "ie2") {
    return "ie2";
  }

  if (typeof env === "string" && env.startsWith("tokens preview")) {
    return env;
  }

  return null;
}

export const EnvironmentBanner: FunctionComponent = () => {
  const environmentIndicator = resolveEnvironmentIndicator();

  if (environmentIndicator) {
    return <div className={styles.banner}>{environmentIndicator}</div>;
  }

  return <></>;
};
