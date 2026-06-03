const HOSTNAME_REGEX = /^(?:https?:\/\/)?(?:[^@\n]+@)?([^:/\n?]+)/;

async function handleIdentitySSOResponse(response, cookieDomain) {
  if (response.status !== "SUCCESS") {
    throw new Error(response.status);
  }

  await browser.addCookie({
    name: "ssoid",
    value: response.token,
    ...(cookieDomain && { domain: cookieDomain }),
  });
}

async function setSsoIdCookie(
  username,
  password,
  cookieDomain,
  url = "http://ssobf.prd.internal/api/login",
  userAgent = "",
) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-Application": "Q5vPQGFHSYfsasIo",
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": userAgent,
      },
      body: new URLSearchParams({ username, password }).toString(),
    });
    const responseData = await response.json();
    // Navigate to NGINX to set cookie on that url
    await browser.url("/betting");
    await handleIdentitySSOResponse(responseData, cookieDomain);
  } catch (e) {
    throw new Error(`LOGIN FAILED: ${e}`);
  }
}

function getCookieDomain() {
  const { baseUrl } = browser.options;

  // Replicate Web and Native cookie domain logic
  const [, hostname] = baseUrl.match(HOSTNAME_REGEX);
  const domain = `.${hostname.split(".").splice(1).join(".")}`;

  return domain;
}

/**
 * Sets an invalid SSOID cookie
 */
async function setInvalidSsoIdCookie() {
  await browser.url("/betting");
  await browser.addCookie({
    name: "ssoid",
    value: "Invalid or expired cookie",
  });
}

module.exports = {
  getCookieDomain,
  setInvalidSsoIdCookie,
  setSsoIdCookie,
};
