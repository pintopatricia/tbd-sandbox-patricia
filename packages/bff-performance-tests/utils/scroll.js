const SCROLL_PERCENTAGE = 0.7;

const scrollDown = () =>
  browser.execute(
    (scrollPercentage) => window.scrollBy(0, window.screen.availHeight * scrollPercentage),
    SCROLL_PERCENTAGE
  );

module.exports = {
  scrollDown,
};
