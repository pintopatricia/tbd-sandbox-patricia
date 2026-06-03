import {
  getVirtualRunnerByURN,
  createVirtualRunnerByURNSelector,
  createVirtualRunnerByIdSelector,
  getVirtualRunnerById,
} from "./virtual-runner-selectors";

const stateMock = {
  "ppb:virtualRunner:22334455": {
    urn: "ppb:virtualRunner:22334455",
    selectionId: 22334455,
  },
};

describe("virtual runner selectors", () => {
  describe("getVirtualRunnerByURN selector", () => {
    it("should return undefined when no virtual runner exists", () => {
      const result = getVirtualRunnerByURN(stateMock, "RANDOM_URN");
      expect(result).toBe(undefined);
    });

    it("should return the correct entity when provided with a valid URN", () => {
      const result = getVirtualRunnerByURN(stateMock, "ppb:virtualRunner:22334455");
      expect(result).toEqual({
        urn: "ppb:virtualRunner:22334455",
        selectionId: 22334455,
      });
    });
  });

  describe("createVirtualRunnerByURNSelector selector", () => {
    it("must return undefined when receiving an URN for a non-existing virtual runner", () => {
      const getVirtualRunnerByURNSelector = createVirtualRunnerByURNSelector();
      const result = getVirtualRunnerByURNSelector(stateMock, "RANDOM_URN");

      expect(result).toBe(undefined);
    });

    it("must return a virtual runner when receiving an URN for an existing virtual runner", () => {
      const getVirtualRunnerByURNSelector = createVirtualRunnerByURNSelector();
      const result = getVirtualRunnerByURNSelector(stateMock, "ppb:virtualRunner:22334455");

      expect(result).toEqual(stateMock["ppb:virtualRunner:22334455"]);
    });
  });
  describe("getVirtualRunnerById selector", () => {
    it("should return undefined when no virtual runner exists", () => {
      const result = getVirtualRunnerById(stateMock, "RANDOM_URN");
      expect(result).toBe(undefined);
    });

    it("should return the correct entity when provided with a valid URN", () => {
      const result = getVirtualRunnerById(stateMock, 22334455);
      expect(result).toEqual({
        urn: "ppb:virtualRunner:22334455",
        selectionId: 22334455,
      });
    });
  });

  describe("createVirtualRunnerByIdSelector selector", () => {
    it("must return undefined when receiving an ID for a non-existing virtual runner", () => {
      const getVirtualRunnerByIdSelector = createVirtualRunnerByIdSelector();
      const result = getVirtualRunnerByIdSelector(stateMock, "RANDOM_ID");

      expect(result).toBe(undefined);
    });

    it("must return a virtual runner when receiving an ID for an existing virtual runner", () => {
      const getVirtualRunnerByIdSelector = createVirtualRunnerByIdSelector();
      const result = getVirtualRunnerByIdSelector(stateMock, 22334455);

      expect(result).toEqual(stateMock["ppb:virtualRunner:22334455"]);
    });
  });
});
