import { createCookieParser, createHeaderParser, createKeyValueParser } from "./parsers";

describe("Parsers", () => {
  describe("createKeyValueParser", () => {
    describe("when creating a key value parser", () => {
      it("should return a factory function", () => {
        expect(createKeyValueParser("=", ";")).toEqual(expect.any(Function));
      });
    });

    describe("when passed an attributor and separator", () => {
      describe("when string to parse is correct", () => {
        it("should return a Map of key values", () => {
          expect(createKeyValueParser("=", ";")("testA=a;testB=b;")).toEqual(
            new Map([
              ["testA", "a"],
              ["testB", "b"],
            ]),
          );
        });
      });

      describe("when string to parse is missing an ending separator", () => {
        it("should return a Map of key values", () => {
          expect(createKeyValueParser("=", ";")("testA=a;testB=b")).toEqual(
            new Map([
              ["testA", "a"],
              ["testB", "b"],
            ]),
          );
        });
      });

      describe("when string to parse contains separator in an unexpected place", () => {
        it("should return a Map of key values ignoring the misformatted section", () => {
          expect(createKeyValueParser("=", ";")("testA=a;tes;tB=b;")).toEqual(
            new Map([
              ["testA", "a"],
              ["tB", "b"],
            ]),
          );
        });
      });

      describe("when string to parse contains attributor in an unexpected place", () => {
        it("should allow it and consume it as value", () => {
          expect(createKeyValueParser("=", ";")("testA=a;tes=tB=b")).toEqual(
            new Map([
              ["testA", "a"],
              ["tes", "tB=b"],
            ]),
          );
        });
      });

      describe("when repeated separators are present", () => {
        it("should ignore them", () => {
          expect(createKeyValueParser("=", ";")("testA=a;;;testB=b;;;")).toEqual(
            new Map([
              ["testA", "a"],
              ["testB", "b"],
            ]),
          );
        });
      });

      describe("when string to parse contains other special characters", () => {
        it("should return correctly parsed special characters", () => {
          expect(createKeyValueParser("=", ";")("testA=a;testB_B-b&=b;")).toEqual(
            new Map([
              ["testA", "a"],
              ["testB_B-b&", "b"],
            ]),
          );
        });
      });

      describe("when string contains spaces", () => {
        it("should return a Map of key values without spaces", () => {
          expect(createKeyValueParser("=", ";")("testA= a;  testB=b;  ")).toEqual(
            new Map([
              ["testA", "a"],
              ["testB", "b"],
            ]),
          );
        });
      });

      describe("when repeated attributors are present", () => {
        it("should consume them", () => {
          expect(createKeyValueParser("=", ";")("testA==a=;testB===b;")).toEqual(
            new Map([
              ["testA", "=a="],
              ["testB", "==b"],
            ]),
          );
        });
      });
    });
  });

  describe("createHeaderParser", () => {
    describe("when creating a header key value parser", () => {
      it("should interpret all headers correctly", () => {
        expect(
          createHeaderParser()(
            "X-Authentication: Test=, User-Agent: Mozilla, Cookie: ssoid=Test=;, Link: <test.com>, Empty_Header:",
          ),
        ).toEqual(
          new Map([
            ["Cookie", "ssoid=Test=;"],
            ["Empty_Header", ""],
            ["Link", "<test.com>"],
            ["User-Agent", "Mozilla"],
            ["X-Authentication", "Test="],
          ]),
        );
      });
    });
  });

  describe("createCookieParser", () => {
    describe("when creating a cookie key value parser", () => {
      it("should interpret all cookies correctly", () => {
        expect(createCookieParser()("ssoid==Test#$=;drk=id;test_a-a=;")).toEqual(
          new Map([
            ["ssoid", "=Test#$="],
            ["drk", "id"],
            ["test_a-a", ""],
          ]),
        );
      });
    });
  });
});
