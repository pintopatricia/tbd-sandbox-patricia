/* eslint-disable no-undef */
const { excBetslipSetupInit, sbkBetslipSetupInit } = require("./setup-fns");

function wrap(setupFn) {
  return function wrapSetup(...setupArgs) {
    return function sbkDescribe(...describeArgs) {
      beforeAll(() => setupFn(...setupArgs));
      describe(...describeArgs);
    };
  };
}

// augment describe API
function betslipDescribe(...args) {
  return describe(...args);
}
betslipDescribe.excBetslipSetup = wrap(excBetslipSetupInit);
betslipDescribe.sbkBetslipSetup = wrap(sbkBetslipSetupInit);

module.exports = betslipDescribe;
