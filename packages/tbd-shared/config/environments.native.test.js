import { NativeModules } from "react-native";
import { getMockserverURL, resolveCETEnvironment } from "./environments.native";

jest.mock("react-native", () => ({
  NativeModules: {
    LaunchArgumentsModule: {
      getLaunchArguments: jest.fn().mockReturnValue({ MOCKHOST: "MOCKHOST", MOCKHOSTPORT: "MOCKHOSTPORT" }),
    },
  },
}));

describe("environments", () => {
  describe("resolveCETEnvironment", () => {
    describe.each([
      ["mockserver", "localhost"],
      ["localhost", "nxt"],
      ["drk", "drk"],
      ["nxt", "nxt"],
      ["qa", "qa"],
      ["qaCMS", "qaCMS"],
      ["qaBRANCH", "qaBRANCH"],
      ["prf", "prf"],
      ["prd", "prd"],
    ])(`when environment is %s`, (environment, cetEnvironment) => {
      it(`should return ${cetEnvironment}`, () => {
        expect(resolveCETEnvironment(environment)).toBe(cetEnvironment);
      });
    });
  });

  describe("getMockserverURL", () => {
    describe("when called with LaunchArguments", () => {
      it("should build the mockserver url", async () => {
        const mockserverURL = await getMockserverURL();

        expect(mockserverURL).toEqual("http://MOCKHOST:MOCKHOSTPORT/");
      });
    });

    describe("when called without LaunchArguments", () => {
      beforeEach(() => {
        NativeModules.LaunchArgumentsModule.getLaunchArguments.mockReturnValue({});
      });

      it("should build the mockserver url", async () => {
        const mockserverURL = await getMockserverURL();

        expect(mockserverURL).toEqual("http://localhost:1084/");
      });
    });
  });
});
