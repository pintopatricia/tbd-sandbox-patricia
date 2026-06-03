import { runAsWorker } from "synckit";
import { getDocument } from "../core";

// Create a sync function, this is useful for babel and webpack plugins where
// async functions are not supported
runAsWorker(async (configFilePath: string, resourceFilePath: string) => {
  const document = await getDocument(configFilePath, resourceFilePath);
  return document;
});
