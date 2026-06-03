import normalizeVirtualRunnerFragmentIntoVirtualRunner from "./virtual-runner-normalizer";

const BFF_RESPONSE = {
  __typename: "VirtualRunner",
  runnerURN: "ppb:virtualRunner:112233",
  name: "runner name",
  selectionId: "selection id",
  humanTexture: "1",
  selectionTexture: "2",
};

describe("Virtual runner normalizer", () => {
  beforeEach(jest.clearAllMocks);

  describe("normalizeVirtualRunnerFragmentIntoVirtualRunner", () => {
    describe("when odds are defined", () => {
      it("should correctly transform and return the data object", () => {
        const { data } = normalizeVirtualRunnerFragmentIntoVirtualRunner({
          ...BFF_RESPONSE,
          odds: {
            decimal: 1.23,
            fractional: {
              denominator: 9,
              numerator: 5,
            },
          },
        });

        expect(data).toEqual({
          typename: "VirtualRunner",
          urn: "ppb:virtualRunner:112233",
          name: "runner name",
          selectionId: "selection id",
          odds: {
            decimal: 1.23,
            fractional: {
              denominator: 9,
              numerator: 5,
            },
          },
          humanTexture: "1",
          selectionTexture: "2",
        });
      });
    });

    describe("when odds are NOT defined", () => {
      it("should correctly transform and return the data object", () => {
        const { data } = normalizeVirtualRunnerFragmentIntoVirtualRunner(BFF_RESPONSE);

        expect(data).toEqual({
          typename: "VirtualRunner",
          urn: "ppb:virtualRunner:112233",
          name: "runner name",
          selectionId: "selection id",
          humanTexture: "1",
          selectionTexture: "2",
        });
      });
    });
  });
});
