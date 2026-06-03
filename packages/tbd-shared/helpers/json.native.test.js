/* eslint-disable no-undef */
import { isJsonString } from "./json.native";

const dev = __DEV__;

describe("json helper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.console.log = jest.fn();
  });
  afterAll(() => {
    __DEV__ = dev;
  });

  describe("isJsonString", () => {
    describe("when the value is not a json string", () => {
      describe("and in dev mode", () => {
        it("should return false", () => {
          __DEV__ = true;
          const result = isJsonString("foo");
          expect(result).toBe(false);
          expect(console.log).toHaveBeenCalled();
        });
      });
      describe("and not in dev mode", () => {
        it("should return false", () => {
          __DEV__ = false;
          const result = isJsonString("foo");
          expect(result).toBe(false);
          expect(console.log).not.toHaveBeenCalled();
        });
      });
    });
    describe("when the value is json string", () => {
      it("should return the javascript code to inject on webview", () => {
        __DEV__ = true;
        const result = isJsonString('{"foo": "bar"}');
        expect(result).toBe(true);
        expect(console.log).not.toHaveBeenCalled();
      });
    });
  });
});
