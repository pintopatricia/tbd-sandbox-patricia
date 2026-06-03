import { runAsWorker } from "synckit";
import { getUserConfig } from "../core";

// Create a sync function, this is useful for babel and webpack plugins where
// async functions are not supported.
//
// IMPORTANT: The output of this function needs to be serializable. That is why we
// only return documents and not the whole config (which may contain non-serializable functions)
runAsWorker(async (configFilePath: string) => {
  const config = await getUserConfig(configFilePath);
  return config?.config.documents || [];
});
