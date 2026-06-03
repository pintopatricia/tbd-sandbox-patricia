import normalizeConfirmCashoutPreferenceFragmentIntoConfirmCashoutPreference from "./confirm-cashout-preference-normalizer";

const BFF_RESPONSE = {
  __typename: "ConfirmCashoutPreference",
  urn: "ppb:tbd:preference:confirmCashout",
  shouldConfirmCashout: true,
};

describe("confirm cashout preference normalizer", () => {
  describe("normalizeConfirmCashoutPreferenceFragmentIntoConfirmCashoutPreference", () => {
    it("should correctly transform and return the data object when shouldConfirmCashout is true", () => {
      const { data } = normalizeConfirmCashoutPreferenceFragmentIntoConfirmCashoutPreference(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "ConfirmCashoutPreference",
        urn: "ppb:tbd:preference:confirmCashout",
        shouldConfirmCashout: true,
      });
    });

    it("should correctly transform and return the data object when shouldConfirmCashout is false", () => {
      const { data } = normalizeConfirmCashoutPreferenceFragmentIntoConfirmCashoutPreference({
        ...BFF_RESPONSE,
        shouldConfirmCashout: false,
      });

      expect(data).toEqual({
        typename: "ConfirmCashoutPreference",
        urn: "ppb:tbd:preference:confirmCashout",
        shouldConfirmCashout: false,
      });
    });
  });
});
