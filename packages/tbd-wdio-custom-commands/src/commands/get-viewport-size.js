const getViewportSize = (browser) => async () =>
  browser.execute(() => ({
    width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
  }));

module.exports = getViewportSize;
