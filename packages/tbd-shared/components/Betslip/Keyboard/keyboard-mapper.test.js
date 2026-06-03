import { KeyboardKeysMap, KeyboardSeparator } from "@ppb/the-wall-common/types";

import { updateInputValue } from "./keyboard-mapper";

describe("keyboard-mapper", () => {
  describe("updateInputValue", () => {
    describe("when KeyboardKeysMap.DELETE is provided", () => {
      describe("when useLongPress is true", () => {
        it("should return an empty string", () => {
          const mappedValue = updateInputValue("1.11", KeyboardKeysMap.DELETE, true);

          expect(mappedValue).toEqual("");
        });
      });

      describe("when useLongPress is false", () => {
        it("should return a string with last character removed", () => {
          const mappedValue = updateInputValue("1.11", KeyboardKeysMap.DELETE, false);

          expect(mappedValue).toEqual("1.1");
        });
      });
    });

    describe("when KeyboardKeysMap.SEPARATOR is provided", () => {
      describe("when string has a separator", () => {
        it("should return the same string", () => {
          const mappedValue = updateInputValue("1.1", KeyboardKeysMap.SEPARATOR, false);

          expect(mappedValue).toEqual("1.1");
        });
      });

      describe("when string does not have a separator", () => {
        describe("and no separator is provided", () => {
          it("should return a string with dot separator", () => {
            const mappedValue = updateInputValue("1", KeyboardKeysMap.SEPARATOR, false);

            expect(mappedValue).toEqual("1.");
          });
        });

        describe("and comma separator key is provided", () => {
          it("should return a string with comma separator", () => {
            const mappedValue = updateInputValue("1", KeyboardKeysMap.SEPARATOR, false, KeyboardSeparator.Comma);

            expect(mappedValue).toEqual("1,");
          });
        });
      });
    });

    describe("when any other key is provided", () => {
      it("should return mapped key", () => {
        const mappedValue = updateInputValue("1.", KeyboardKeysMap.ONE, false);

        expect(mappedValue).toEqual("1.1");
      });
    });
  });
});
