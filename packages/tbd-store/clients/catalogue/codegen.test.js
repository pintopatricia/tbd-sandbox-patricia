import { existsSync, readFileSync } from "fs";

jest.mock("fs", () => ({
  readFileSync: jest.fn(() => ""),
  existsSync: jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false),
}));

describe("codegen", () => {
  let config;

  describe("by default", () => {
    beforeEach(() => {
      jest.isolateModulesAsync(async () => {
        const { default: codegenConfig } = await import("./codegen");

        config = codegenConfig;
      });
    });

    it("should use remote URL for schema", () => {
      expect(readFileSync).toHaveBeenCalled();
      expect(config.schema).toBeInstanceOf(Array);
    });
  });

  describe("when env var is present", () => {
    let thrownError;

    beforeAll(() => {
      process.env.LOCAL_BFF_SCHEMA_PATH = "/local/schema.graphql";
    });

    beforeEach(() => {
      thrownError = undefined;

      jest.isolateModulesAsync(async () => {
        try {
          const { default: codegenConfig } = await import("./codegen");

          config = codegenConfig;
        } catch (error) {
          thrownError = error;
        }
      });
    });

    afterAll(() => {
      delete process.env.LOCAL_BFF_SCHEMA_PATH;
    });

    it("should use local bff schema", () => {
      expect(existsSync).toHaveBeenCalled();
      expect(config.schema).toEqual([
        "/local/schema.graphql",
        "./packages/tbd-shared/**/*.local.graphql",
        "./node_modules/@ppb/**/*.local.graphql",
      ]);
    });

    it("should throw an error if local bff schema file does not exist", () => {
      expect(existsSync).toHaveBeenCalled();
      expect(thrownError).toBeDefined();
    });
  });
});
