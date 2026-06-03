/**
 * Extract a cookie from the document.cookie
 *
 * @param name The cookie name
 * @returns The extracted cookie
 */
export const getCookie = (name: string): string | null => {
  const matchedCookie = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
  return matchedCookie ? matchedCookie[2] : null;
};

/**
 * Extract a cookie from the document.cookie asynchronously
 *
 * @param name The cookie name
 * @returns Promise with the extracted cookie
 */
export const getAsyncCookie = (name: string): Promise<string | null> => Promise.resolve(getCookie(name));

const getDomain = (location: Location): string => location.hostname.split(".").splice(1).join(".");

const getPath = (location: Location): string => `/${location.pathname.split("/")[1]}`;

/**
 * Set a cookie on the document.cookie
 *
 * @param name The cookie name
 * @param path The cookie path; if not passed, will be on current basePath
 * @returns
 */
export const setCookie = (name: string, value: string, path?: string): void => {
  const domain = getDomain(window.location);

  document.cookie = `${name}=${value};domain=.${domain};path=${path || getPath(window.location)}`;
};
