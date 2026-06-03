import { EnvironmentJSON } from "@ppb/tbd-store";
import { extractBasePathFromRequestUri } from "../helpers/base-path";
import { SupportedJurisdiction } from "../constants/supported-jurisdictions";
import { LANGUAGE_FOLDER_TO_LOCALE_CODE } from "../constants/language-folders";
import { RequestContext } from "../@types/RequestContext";

type BaseRedirect = { base: string; localeCode: string };

export function getLocaleFromURL({
  $requestContext,
  requestUri,
  environment,
  jurisdiction,
  userLocaleCode,
  isLoggedIn,
}: {
  $requestContext: RequestContext;
  requestUri: string;
  environment: EnvironmentJSON;
  jurisdiction: SupportedJurisdiction;
  userLocaleCode: string;
  isLoggedIn: boolean;
}): BaseRedirect {
  const { languageFolder } = extractBasePathFromRequestUri(requestUri);

  // TODO: check if config exists and if not fallback to an hardcoded one
  const { defaultLocale, LOCALE_TO_BASE_HREF } = environment.JURISDICTION_URL_CONFIGS![jurisdiction]; // eslint-disable-line @typescript-eslint/no-non-null-assertion

  if (!isLoggedIn) {
    const reqCtxLocaleCode = $requestContext.localeCode || "";
    const basePathForReqCtxLocaleCode = LOCALE_TO_BASE_HREF[reqCtxLocaleCode];

    /*
    When the request context locale code is defined due to cookies being set,
    it should be the first criteira used to check for redirects using the base path associated
    with that locale code.
    */
    if (basePathForReqCtxLocaleCode) {
      return { base: basePathForReqCtxLocaleCode, localeCode: reqCtxLocaleCode };
    }

    const localeFromLanguageFolder = LANGUAGE_FOLDER_TO_LOCALE_CODE[languageFolder || ""];
    const basePathForLanguageFolder = LOCALE_TO_BASE_HREF[localeFromLanguageFolder];

    /*
    When there's no request context locale code since the user doesn't have cookies set
    and the url contains a language folder
    the user should be redirected to the base path associated with that language folder.
    */
    if (basePathForLanguageFolder) {
      return { base: basePathForLanguageFolder, localeCode: localeFromLanguageFolder };
    }

    const basePathForUserLocaleCode = LOCALE_TO_BASE_HREF[userLocaleCode];

    /*
    When the other 2 criteria don't exist,
    the 3rd one (user locale code) is used to attempt a redirect.
    */
    if (basePathForUserLocaleCode) {
      return { base: basePathForUserLocaleCode, localeCode: userLocaleCode };
    }
  } else {
    const basePathForUserLocaleCode = LOCALE_TO_BASE_HREF[userLocaleCode];

    /*
    For logged in users their locale code should be the only criteria used.
    */
    if (basePathForUserLocaleCode) {
      return { base: basePathForUserLocaleCode, localeCode: userLocaleCode };
    }
  }

  const defaultBasePath = LOCALE_TO_BASE_HREF[defaultLocale];
  /*
  When none of the other criteria are met, assess redirect using default values
  */
  return { base: defaultBasePath, localeCode: defaultLocale };
}
