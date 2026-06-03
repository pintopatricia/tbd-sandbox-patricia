import { NativeModules } from "react-native";
import { createEnvironments } from "./environments.native";
import config from "./app-configuration.native";

jest.mock("react-native", () => ({
  Platform: {
    OS: "android",
  },
  NativeModules: {
    LaunchArgumentsModule: {
      getLaunchArguments: jest.fn().mockReturnValue({ MOCKHOST: "localhost", MOCKHOSTPORT: "1084" }),
    },
  },
}));

jest.mock("../config/app-configuration.native.ts", () => ({
  appBrand: "brand",
  appConfig: {
    LOADING_URL: {
      subdomain: "apitbdn",
      domain: "brand.net",
    },
  },
}));

describe("environments android", () => {
  describe("createEnvironments", () => {
    let environments;

    beforeEach(async () => {
      environments = await createEnvironments();
    });

    describe("mockserver", () => {
      describe("when called with LaunchArguments", () => {
        it("should assign the mockserver url to the mockserver environment variable", () => {
          expect(environments.mockserver.path).toEqual("http://localhost:1084/");
        });
      });

      describe("when called without LaunchArguments", () => {
        beforeEach(async () => {
          NativeModules.LaunchArgumentsModule.getLaunchArguments.mockReturnValue({});
          environments = await createEnvironments();
        });

        it("should assign the mockserver url to the mockserver environment variable", () => {
          expect(environments.mockserver.path).toEqual("http://localhost:1084/");
        });
      });
    });

    describe("when environment is prd", () => {
      it("should return the correct url", () => {
        expect(environments.prd.path).toBe(`https://apitbdn.brand.net/`);
      });
    });

    it("should set localhost to 'https://10.0.2.2/'", () => {
      expect(environments.localhost.path).toBe("https://10.0.2.2/");
    });

    it("should set localhostRO to 'https://10.0.2.2/'", () => {
      expect(environments.localhostRO.path).toBe("https://10.0.2.2/");
    });

    describe.each([
      ["nxt", "net"],
      ["qa", "com"],
      ["qabranch", "com"],
      ["prf", "com"],
    ])("when environment is %s for international", (env, tld) => {
      it("should return the correct url", () => {
        expect(environments[env].path).toBe(`https://apitbdn.brand.${tld}.${env}.ppbdev.com/`);
      });
    });

    describe("when environment is qacms for international", () => {
      it("should return the correct url", () => {
        expect(environments.qacms.path).toBe(`https://apitbdn.qacms.com.brand/`);
      });
    });

    describe.each(
      ["qa", "qabranch", "prf"].flatMap((env) =>
        Object.entries({
          BR: "bet.br",
          IT: "it",
          RO: "ro",
          ES: "es",
        }).map(([countryCode, tld]) => [env, countryCode, tld]),
      ),
    )("when environment is %s and country code is %s", (env, countryCode, tld) => {
      it("should return the correct url", () => {
        expect(environments[`${env}${countryCode}`].path).toBe(`https://apitbdn.brand.${tld}.${env}.ppbdev.com/`);
      });
    });

    describe.each([
      ["BR", "bet.br"],
      ["IT", "it"],
      ["RO", "ro"],
      ["ES", "es"],
    ])("when environment is qacms and country code is %s", (countryCode, tld) => {
      it("should return the correct url", () => {
        expect(environments[`qacms${countryCode}`].path).toBe(`https://apitbdn.qacms.${tld}.brand/`);
      });
    });

    describe("when brand is skybet", () => {
      beforeEach(async () => {
        jest.clearAllMocks();
        config.appBrand = "skybet";
        environments = await createEnvironments();
      });

      it("should return the correct url", () => {
        expect(environments.prd.path).toBe(`https://apitbdn.skybet.com/`);
      });
    });

    describe("when custom subdomain is apitbdn-store for betfair", () => {
      beforeEach(async () => {
        jest.clearAllMocks();
        config.appBrand = "betfair";
        config.appConfig = {
          LOADING_URL: {
            subdomain: "apitbdn-store",
            domain: "brand.net",
          },
        };

        environments = await createEnvironments();
      });

      it("should return the correct url", () => {
        expect(environments.prd.path).toBe(`https://apitbdn-store.brand.net/`);
      });
    });
  });
});
