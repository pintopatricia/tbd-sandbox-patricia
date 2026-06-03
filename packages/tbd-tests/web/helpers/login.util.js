const { extractUserAndPassword } = require("../../utils/extractCredential");
const { extractEndpoints } = require("../../utils/extractEndpoints");
const { setCookie } = require("./cookie.util");
const { openPageAndAcceptCookieConsent } = require("./helper.util");

function getSsoConfig() {
  const data = extractEndpoints();

  return { xApplication: data.X_APPLICATION, loginUrl: data.SSO.endpoint };
}

async function addCookieWithSSOID(response, customExtraParams, throttleOptions = {}) {
  if (response.status !== "SUCCESS") {
    throw new Error(`SSO Login failed with status: ${response.status}`);
  }

  await setCookie("ssoid", response.token);
  await openPageAndAcceptCookieConsent(throttleOptions, customExtraParams);
}

async function loginWithSSOID(username, userAgent = "", customExtraParams, throttleOptions = {}) {
  const { user, password } = extractUserAndPassword(username);
  const { xApplication, loginUrl } = getSsoConfig();
  const bodyString = `username=${encodeURIComponent(user)}&password=${encodeURIComponent(password)}`;

  const response = await fetch(loginUrl, {
    method: "POST",
    headers: {
      "X-Application": xApplication,
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": userAgent,
    },
    body: bodyString,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch SSOID: ${response.statusText}`);
  }
  const responseData = await response.json();
  await addCookieWithSSOID(responseData, customExtraParams, throttleOptions);
}

module.exports = {
  loginWithSSOID,
  getSsoConfig,
  addCookieWithSSOID,
};
