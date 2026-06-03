import { ExchangeSide } from "../../constants";
import { getExchangePotentialState } from "./exchange-betting-potential-selectors";

describe("getExchangePotentialState", () => {
  describe("when runner isn't found", () => {
    it("should return null", () => {
      const returnedState = getExchangePotentialState(
        {
          betting: {
            exchangeBettingPotential: {},
          },
        },
        "non:existent:runner:urn",
        ExchangeSide.BACK,
      );

      expect(returnedState).toBeNull();
    });
  });

  describe("when runner exists and side isn't found", () => {
    describe("back", () => {
      it("should return null", () => {
        const returnedState = getExchangePotentialState(
          {
            betting: {
              exchangeBettingPotential: {
                "runner:urn": {
                  lay: {},
                },
                "other:urn": {
                  back: {},
                  lay: {},
                },
              },
            },
          },
          "runner:urn",
          ExchangeSide.BACK,
        );

        expect(returnedState).toBeNull();
      });
    });

    describe("lay", () => {
      it("should return null", () => {
        const returnedState = getExchangePotentialState(
          {
            betting: {
              exchangeBettingPotential: {
                "runner:urn": {
                  back: {},
                },
                "other:urn": {
                  back: {},
                  lay: {},
                },
              },
            },
          },
          "runner:urn",
          ExchangeSide.LAY,
        );

        expect(returnedState).toBeNull();
      });
    });
  });

  describe("when runner back is found", () => {
    it("should return the potential state", () => {
      const returnedState = getExchangePotentialState(
        {
          betting: {
            exchangeBettingPotential: {
              "runner:urn": {
                back: "back potential state",
              },
            },
          },
        },
        "runner:urn",
        ExchangeSide.BACK,
      );

      expect(returnedState).toBe("back potential state");
    });
  });

  describe("when runner lay is found", () => {
    it("should return the potential state", () => {
      const returnedState = getExchangePotentialState(
        {
          betting: {
            exchangeBettingPotential: {
              "runner:urn": {
                lay: "lay potential state",
              },
            },
          },
        },
        "runner:urn",
        ExchangeSide.LAY,
      );

      expect(returnedState).toBe("lay potential state");
    });
  });
});
