import { getCookie } from "../helpers/cookies.web";

export function resolveVisitorId(): string | null {
  const vidCookie = getCookie("vid");

  return vidCookie;
}
