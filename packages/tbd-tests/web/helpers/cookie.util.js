async function clearCookies() {
  const cookieToKeep = "drk";
  const allCookies = await browser.getCookies();
  await Promise.all(
    allCookies.filter((cookie) => cookie.name !== cookieToKeep).map((cookie) => browser.deleteCookies(cookie.name)),
  );
}

async function setCookie(name, value) {
  if (process.env.BASE_URL.includes("https")) {
    return browser.execute(
      ({ cookieName, cookieValue }) => {
        const domain = window.location.hostname.replace(/^www\./, "");
        document.cookie = `${cookieName}=${cookieValue};secure;domain=.${domain};path=/;`;
      },
      { cookieName: name, cookieValue: value },
    );
  }

  return browser.execute(
    ({ cookieName, cookieValue }) => {
      document.cookie = `${cookieName}=${cookieValue};`;
    },
    { cookieName: name, cookieValue: value },
  );
}

module.exports = {
  clearCookies,
  setCookie,
};
