/**
 * A Sinon fake timer helper that needs to be bundled locally on @sinon/fake-timers bump, and then the output commited.
 * To generate the bundled version, just run `yarn bundle:fake-timers`
 */

// eslint-disable-next-line import/no-extraneous-dependencies
const fakeTimers = require("@sinonjs/fake-timers");

module.exports = fakeTimers;
