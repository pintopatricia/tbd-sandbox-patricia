export {};

declare global {
  interface Window {
    __CONTENT_LOADING_PARAMETERS__: import("state/entities").ContentLoadingParameters;
    SplunkRum?: {
      setGlobalAttributes: (attributes: { [key: string]: string | number | boolean | undefined }) => void;
      error: <E extends Error>(error: E, info: string) => void;
    };
    prerenderReady: boolean;
  }
}
