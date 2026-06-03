import { resolveAppCommands } from "./commands-resolver";
import { resolveBetslipDeepLinking } from "./deep-linking-resolver";

jest.mock("./deep-linking-resolver", () => ({
  resolveBetslipDeepLinking: jest.fn(() => "some command"),
}));

describe("commands resolver", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("resolveAppCommands()", () => {
    describe("when resolveBetslipDeepLinking returns undefined", () => {
      it("should return an empty array", () => {
        const errorLogFn = jest.fn();
        resolveBetslipDeepLinking.mockReturnValue(undefined);

        const cmds = resolveAppCommands(errorLogFn, "some url");

        expect(resolveBetslipDeepLinking).toHaveBeenCalledWith("some url", errorLogFn);
        expect(resolveBetslipDeepLinking).toHaveBeenCalledTimes(1);
        expect(cmds).toEqual([]);
      });
    });

    describe("when resolveBetslipDeepLinking returns a command", () => {
      it("should return that command in the set of commands", () => {
        const errorLogFn = jest.fn();
        resolveBetslipDeepLinking.mockReturnValueOnce("some command");

        const cmds = resolveAppCommands(errorLogFn, "some url");

        expect(resolveBetslipDeepLinking).toHaveBeenCalledWith("some url", errorLogFn);
        expect(resolveBetslipDeepLinking).toHaveBeenCalledTimes(1);
        expect(cmds).toContain("some command");
      });
    });
  });
});
