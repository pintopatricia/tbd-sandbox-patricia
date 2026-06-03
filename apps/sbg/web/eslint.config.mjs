import config, { wdioRules } from "../../../eslint.config.mjs";

export default [...config, wdioRules(["regression-tests/**/*.js"])];
