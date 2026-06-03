import { CATEGORIES } from "cookie-consent";

const getCookieConsentCategories = (): typeof CATEGORIES => CATEGORIES || [];

export { getCookieConsentCategories };
