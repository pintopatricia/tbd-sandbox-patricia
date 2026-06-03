import config, { javascriptRules } from "../../eslint.config.mjs";
import globals from "globals";

export default [...config, javascriptRules({ ...globals.node })];
