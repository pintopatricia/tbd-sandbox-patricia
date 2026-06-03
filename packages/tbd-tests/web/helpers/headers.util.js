export const setExtraHTTPHeaders = async (httpHeaders) => {
  const puppeteer = await browser.getPuppeteer();
  const [page] = await puppeteer.pages();
  await page.setExtraHTTPHeaders(httpHeaders);
};
