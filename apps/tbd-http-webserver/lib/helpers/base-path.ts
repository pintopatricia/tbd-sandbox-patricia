import { VALID_LANGUAGE_FOLDERS } from "../constants/language-folders";
import env from "../config/environment.json";

const ROOT_PATH = "/";

export function extractBasePathFromRequestUri(requestUri: string): {
  base: string;
  languageFolder?: string;
} {
  const isBasePathEqRootPath = env.BASE_PATH === ROOT_PATH;
  // provide mocked base so we can use the URL API
  const url = new URL(requestUri, "https://www.betfair.com");
  // first folder should be betting keyword and second one is possibly the language folder when applicable
  const [firstFolder, secondFolder] = url.pathname.split(ROOT_PATH).filter((char) => !!char);

  let basePath: string;
  let languageFolder: string | undefined;

  if (isBasePathEqRootPath) {
    languageFolder = VALID_LANGUAGE_FOLDERS.has(firstFolder) ? firstFolder : undefined;
    basePath = `${ROOT_PATH}${languageFolder ? `${languageFolder}/` : ""}`;
  } else {
    languageFolder = VALID_LANGUAGE_FOLDERS.has(secondFolder) ? `${secondFolder}` : undefined;
    basePath = `/${firstFolder}${languageFolder ? `/${languageFolder}` : ""}/`;
  }

  return {
    base: decodeURI(basePath),
    languageFolder,
  };
}
