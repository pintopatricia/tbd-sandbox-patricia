function setup() {
  let configModule;

  jest.isolateModules(() => {
    configModule = require("./product-configuration");
  });

  return configModule.productConfiguration;
}

describe("Product Configuration", () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe("getPayoutLimit", () => {
    describe("when setPayoutLimits has been called", () => {
      describe("when there is a limit for a currency", () => {
        it("should return the configured value for that currency", () => {
          const productConfiguration = setup();

          productConfiguration.setPayoutLimits({
            USD: { softCap: 25, hardCap: 50, hardCapKey: "TRANSLATION_KEY_USD" },
            DEFAULT: { softCap: 5, hardCap: 10, hardCapKey: "TRANSLATION_KEY_DEFAULT" },
          });

          expect(productConfiguration.getPayoutLimit("USD")).toEqual({
            softCap: 25,
            hardCap: 50,
            hardCapKey: "TRANSLATION_KEY_USD",
          });
        });
      });

      describe("when there is no limit for a currency", () => {
        describe("when there is a default configured value", () => {
          it("should return the default value", () => {
            const productConfiguration = setup();

            productConfiguration.setPayoutLimits({
              USD: { softCap: 25, hardCap: 50, hardCapKey: "TRANSLATION_KEY_USD" },
              DEFAULT: { softCap: 5, hardCap: 10, hardCapKey: "TRANSLATION_KEY_DEFAULT" },
            });

            expect(productConfiguration.getPayoutLimit("GBP")).toEqual({
              softCap: 5,
              hardCap: 10,
              hardCapKey: "TRANSLATION_KEY_DEFAULT",
            });
          });
        });

        describe("when there is no default configured value", () => {
          it("should return undefined", () => {
            const productConfiguration = setup();

            productConfiguration.setPayoutLimits({
              USD: { softCap: 25, hardCap: 50, hardCapKey: "TRANSLATION_KEY_USD" },
            });

            expect(productConfiguration.getPayoutLimit("GBP")).toEqual(undefined);
          });
        });
      });
    });

    describe("when setPayoutLimits has not been called", () => {
      it("should return undefined", () => {
        const productConfiguration = setup();

        expect(productConfiguration.getPayoutLimit("GBP")).toEqual(undefined);
      });
    });
  });
});
