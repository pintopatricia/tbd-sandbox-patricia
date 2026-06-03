import config, { javascriptRules, wdioRules } from "../../eslint.config.mjs";
import globals from "globals";

export default [...config, javascriptRules({ ...globals.node }), wdioRules(["**/*.js"])];
