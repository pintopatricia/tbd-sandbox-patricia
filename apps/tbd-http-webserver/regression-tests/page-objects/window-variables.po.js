/* eslint-disable no-underscore-dangle */
class WindowVariablesPO {
  constructor(dom) {
    this.element = dom;
  }

  /**
   * Returns the preloaded state
   */
  get preloadedState() {
    return this.element.window.__PRELOADED_STATE__;
  }

  /**
   * Returns the tbd environment
   */
  get environment() {
    return this.element.window.__TBD_ENVIRONMENT__;
  }

  /**
   * Returns the tbd preloaded catalog
   */
  get preloadedCatalog() {
    return this.element.window.__TBD_PRELOADED_CATALOG__;
  }

  /**
   * Returns the content loading params
   */
  get contentLoadingParams() {
    return this.element.window.__CONTENT_LOADING_PARAMETERS__;
  }

  /**
   * Returns the post login session
   */
  get postLoginSession() {
    return this.element.window.__POST_LOGIN_SESSION__;
  }

  /**
   * Returns the tbd app commands
   */
  get appCommands() {
    return this.element.window.__TBD_APP_COMMANDS__;
  }
}

module.exports = WindowVariablesPO;
