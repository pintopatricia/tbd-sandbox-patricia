import { Platform } from "react-native";
import { getEnvironmentCookieHandler } from "./handler.native";
import { writer as androidWriter } from "./writer.android.native";
import { writer as iosWriter } from "./writer.ios.native";

jest.mock("./writer.android", () => ({
  writer: jest.fn().mockReturnValue({ set: jest.fn(), clear: jest.fn() }),
}));
jest.mock("./writer.ios", () => ({
  writer: jest.fn().mockReturnValue({ set: jest.fn(), clear: jest.fn() }),
}));

jest.spyOn(console, "warn").mockImplementation(() => {});

const ENVS = [
  ["prf", [".com.skybet", ".com.betfair", ".ppbdev.com"]],
  ["nxt", [".com.skybet", ".com.betfair", ".ppbdev.com"]],
  ["drk", [".com.skybet", ".com.betfair", ".ppbdev.com"]],
  ["qa", [".com.skybet", ".com.betfair", ".ppbdev.com"]],
  ["qabranch", [".com.skybet", ".com.betfair", ".ppbdev.com"]],
  ["qacms", [".com.skybet", ".com.betfair", ".ppbdev.com"]],
  ["localhost", ["localhost.betfair.com", "localhost.skybet.com", "10.0.2.2"]],
  [
    "prd",
    [
      ".betfair.bet.br",
      ".betfair.com",
      ".betfair.it",
      ".betfair.ro",
      ".betfair.es",
      ".betfair.net",
      ".skybet.bet.br",
      ".skybet.com",
      ".skybet.it",
      ".skybet.ro",
      ".skybet.es",
      ".skybet.net",
    ],
  ],
];

function setup({ handler } = { handler: { set: jest.fn(), clear: jest.fn() } }) {
  androidWriter.mockReturnValue(handler);
  iosWriter.mockReturnValue(handler);
}

describe("Environment Handler", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("when building a cookie environment handler", () => {
    describe("when the platform is not supported", () => {
      it("should return a noop set", async () => {
        Platform.OS = "web";
        setup();
        const handler = getEnvironmentCookieHandler("irrelevant");

        expect(await handler.set(new Map([["x", "x"]]))).toEqual(false);
      });

      it("should return a noop clear", async () => {
        Platform.OS = "web";
        setup();
        const handler = getEnvironmentCookieHandler("irrelevant");

        expect(await handler.clear()).toEqual(false);
      });
    });

    describe("when android", () => {
      describe.each(ENVS)("when environment is %s", (env, domains) => {
        it("should call handler with correct domains", () => {
          Platform.OS = "android";
          setup();
          getEnvironmentCookieHandler(env);

          expect(androidWriter).toHaveBeenCalledWith(domains);
        });
      });

      describe("when the environment is not supported", () => {
        it("should warn when setting", async () => {
          Platform.OS = "android";
          setup();
          const handler = getEnvironmentCookieHandler("irrelevant");

          expect(await handler.set()).toEqual(false);
          expect(global.console.warn).toHaveBeenCalledWith("No cookie handler defined for", "irrelevant");
        });

        it("should clear when clearing", async () => {
          Platform.OS = "android";
          const clearSpy = jest.fn();

          setup({ handler: { set: jest.fn(), clear: clearSpy } });

          const handler = getEnvironmentCookieHandler("irrelevant");

          await handler.clear();

          expect(clearSpy).toHaveBeenCalled();
        });
      });
    });

    describe("when ios", () => {
      describe.each(ENVS)("when environment is %s", (env, domains) => {
        it("should call handler with correct domains", () => {
          Platform.OS = "ios";
          setup();
          getEnvironmentCookieHandler(env);

          expect(iosWriter).toHaveBeenCalledWith(domains);
        });
      });

      describe("when the environment is not supported", () => {
        it("should warn when setting", async () => {
          Platform.OS = "ios";
          setup();
          const handler = getEnvironmentCookieHandler("irrelevant");

          expect(await handler.set()).toEqual(false);
          expect(global.console.warn).toHaveBeenCalledWith("No cookie handler defined for", "irrelevant");
        });

        it("should clear when clearing", async () => {
          Platform.OS = "ios";
          const clearSpy = jest.fn();

          setup({ handler: { set: jest.fn(), clear: clearSpy } });

          const handler = getEnvironmentCookieHandler("irrelevant");

          await handler.clear();

          expect(clearSpy).toHaveBeenCalled();
        });
      });
    });
  });
});
