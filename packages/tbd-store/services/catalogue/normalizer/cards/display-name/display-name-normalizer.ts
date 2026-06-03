/* eslint-disable no-underscore-dangle */

import { DisplayNameFragment } from "../../../../../clients/catalogue/catalogue-response-types";

const normalizeDisplayNameFragmentIntoDisplayName = (fragment: DisplayNameFragment): string => {
  const title = fragment.__typename === "DisplayNameTitle" ? fragment.name : "";
  const titleTranslationKey = fragment.__typename === "DisplayNameTranslationKey" ? fragment.translationKey : "";

  return title || titleTranslationKey;
};

export default normalizeDisplayNameFragmentIntoDisplayName;
