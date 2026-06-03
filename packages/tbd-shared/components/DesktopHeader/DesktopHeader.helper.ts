import * as React from "react";
import { SscConfig } from "./map-to-props-factory";

export const loadHeader = (
  cssUrl: string,
  headerHTML: string,
  callBack: React.Dispatch<React.SetStateAction<string>>,
) => {
  const link = document.createElement("link");

  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = cssUrl;
  link.onerror = (e) => {
    throw new Error(`Could not load CSS for SSC: ${e}`);
  };
  link.onload = () => {
    callBack(headerHTML);
  };

  document.head.appendChild(link);
};

export const startSSC = async (sscConfig: SscConfig, sscContentUrl: string, ssoidCookie: string) => {
  try {
    const requestPayload = {
      body: JSON.stringify(sscConfig),
      headers: {},
    };

    if (ssoidCookie.length) {
      requestPayload.headers = {
        "X-Authentication": ssoidCookie,
      };
    }

    const sscRequest = await fetch(sscContentUrl, {
      method: "post",
      ...requestPayload,
    });

    return sscRequest.json();
  } catch (e) {
    throw new Error(`Could not load SSC Header: ${e}`);
  }
};

const loadScript = (scriptUrl: string) => {
  const script = document.createElement("script");

  script.src = scriptUrl;
  script.crossOrigin = "anonymous";
  script.async = true;
  script.onerror = (e) => {
    throw new Error(`Could not load JS for SSC: ${e}`);
  };

  document.head.appendChild(script);
};

export const loadScripts = (jsFiles: string[]) => {
  // https://flutteruki.atlassian.net/wiki/spaces/FND/pages/182954749/SSC+Adoption+-+Browser+-+via+Javascript ¯\_(ツ)_/¯
  const sscHeaderContainerElement = document.getElementById("ssc-header-container");
  const scriptsInsideIt = sscHeaderContainerElement?.getElementsByTagName("script");

  if (!scriptsInsideIt?.length) {
    return;
  }

  Array.from(scriptsInsideIt).forEach((script) => {
    try {
      eval(script.innerHTML);
    } catch (e) {
      console.error("Failed to eval script inside SSC header", e);
    }
  });

  jsFiles.forEach((jsUrl: string) => {
    loadScript(jsUrl);
  });
};
