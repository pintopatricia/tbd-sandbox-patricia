class AppScreen {
  constructor(selector) {
    this.selector = selector;
  }

  async waitForScreen() {
    const sel = await $(this.selector);
    const isReady = await sel.waitForDisplayed({ timeout: 20000 });
    return isReady;
  }
}

module.exports = AppScreen;
