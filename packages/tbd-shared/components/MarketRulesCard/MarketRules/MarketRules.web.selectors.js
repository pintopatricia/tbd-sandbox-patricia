const { TEST_ID: MARKET_RULES_SECTION } = require("./MarketRulesSection/MarketRulesSection.web.selectors");
const stylesMarketRulesContent = require("./MarketRulesContent/MarketRulesContent.web.modules.json");
const styles = require("./MarketRules.web.modules.json");

module.exports = {
  TEST_ID: styles.content,
  TITLE: stylesMarketRulesContent.title,
  SECTION: MARKET_RULES_SECTION,
  FOOTER: stylesMarketRulesContent.footer,
};
