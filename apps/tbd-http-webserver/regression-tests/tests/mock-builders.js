function buildPreferencesMock() {
  return {
    confirmCashout: { urn: "urn:confirmCashout", shouldConfirmCashout: false },
    exchangeConfirmBetPlacement: { urn: "urn:exchangeConfirmBetPlacement", shouldConfirmBetPlacement: false },
    oddsMovement: { urn: "urn:oddsMovement", shouldAcceptOddsMovement: false },
    showBalances: { urn: "urn:showBalances", shouldShowBalances: false },
    quickStakes: { urn: "urn:quickStakes", selectedQuickStakes: [] },
    exchangeOddsDisplay: { urn: "urn:exchangeOddsDisplay", selectedOddsDisplayFormat: "FRACTIONAL" },
    sportsbookOddsDisplay: { urn: "urn:sportsbookOddsDisplay", selectedOddsDisplayFormat: "FRACTIONAL" },
    favoriteSports: { urn: "urn:favoriteSports", selectedFavoriteSports: [] },
    defaultProduct: { urn: "urn:defaultProduct", selectedDefaultProduct: "exchange" },
    exchangeDefaultProduct: { urn: "urn:exchangeDefaultProduct", selectedExchangeDefaultProduct: null },
    products: { urn: "urn:products", selectedProduct: null },
    lastViewedProduct: { urn: "urn:lastViewedProduct", selectedLastViewedProduct: "sportsbook" },
    phoenixMigratedUser: { urn: "urn:phoenixMigratedUser", isPhoenixMigratedUser: false },
    exchangeDefaultMode: { urn: "urn:exchangeDefaultMode", selectedExchangeDefaultMode: "DEFAULT" },
  };
}

module.exports = {
  buildPreferencesMock,
};
