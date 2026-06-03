import { mapAppVersion } from "./app-version";

describe("mapAppVersion", () => {
  it("returns empty objects when input is undefined", () => {
    expect(mapAppVersion(undefined)).toEqual({ android: {}, ios: {} });
  });

  it("maps from AppVersionQuery shape and filters nulls", () => {
    const input = {
      AppVersion: {
        urn: "ppb:tbd:appversion",
        url: null,
        downloadUrl: "dl-url",
        storeUrl: null,
        versionCode: 42,
        minVersionCode: null,
        minOSVersion: "12.1.0",
        blackList: [{ versioncode: 100 }, null],
      },
    };

    const result = mapAppVersion(input);

    expect(result).toEqual({
      android: {
        blackList: [{ versioncode: 100 }],
        url: undefined,
        storeUrl: undefined,
        versionCode: 42,
        downloadUrl: "dl-url",
        minOSVersion: "12.1.0",
        minVersionCode: undefined,
      },
      ios: {
        blackList: [{ versioncode: 100 }],
        url: undefined,
        storeUrl: undefined,
        versionCode: 42,
        downloadUrl: "dl-url",
        minOSVersion: "12.1.0",
        minVersionCode: undefined,
      },
    });
  });

  it("maps when AppVersionQuery is provided with non-null values", () => {
    const input = {
      AppVersion: {
        urn: "ppb:tbd:appversion",
        url: "landing",
        downloadUrl: "dl",
        storeUrl: "store",
        versionCode: 7,
        minVersionCode: 5,
        minOSVersion: "11",
        blackList: [],
      },
    };

    const result = mapAppVersion(input);

    expect(result).toEqual({
      android: {
        blackList: [],
        url: "landing",
        storeUrl: "store",
        versionCode: 7,
        downloadUrl: "dl",
        minOSVersion: "11",
        minVersionCode: 5,
      },
      ios: {
        blackList: [],
        url: "landing",
        storeUrl: "store",
        versionCode: 7,
        downloadUrl: "dl",
        minOSVersion: "11",
        minVersionCode: 5,
      },
    });
  });
});
