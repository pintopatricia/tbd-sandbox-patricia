import CookieManager from "@react-native-cookies/cookies";
import { getCurrentEnv } from "../config/base-path-utils.native";

/**
 * Temporary logging while in dev mode
 */
const log = (message: string, details = ""): void => {
  if (__DEV__) {
    console.log(message, details);
  }
};

/**
 * Adds 'CactusNP' cookie to `CookieManager` so that it's exposed in all
 * webviews inside the native apps
 *
 * Notes:
 * During the migration phase, we need to provide a specific cookie so that
 * some pages inside the native app's webview are served in the TBD version.
 * If the application is in a non-production environment, the cookie will also
 * be added to the development domain.
 *
 * TODO: This code should be deleted after the migration is completed
 * and the 'CactusNP' cookie is no longer needed
 */
export const addCactusNPCookie = () => {
  // Adds cookie for non-production environments
  if (getCurrentEnv() !== "prd") {
    CookieManager.set("https://*.ppbdev.com/", {
      name: "CactusNP",
      value: "true",
      secure: true,
      httpOnly: true,
      domain: ".ppbdev.com",
    })
      .then((success) => {
        log(`Set CactusNP cookie to development environment with success: ${success}`);
      })
      .catch((err) => {
        log("Failed to set CactusNP cookie to development environment", err.message);
      });
  }

  // Adds production cookie
  CookieManager.set("https://*.skybet.com/", {
    name: "CactusNP",
    value: "true",
    secure: true,
    httpOnly: true,
    domain: ".skybet.com",
  })
    .then((success) => {
      log(`Set CactusNP cookie to Production environment with success: ${success}`);
    })
    .catch((err) => {
      log("Failed to set CactusNP cookie to Production environment", err.message);
    });
};
