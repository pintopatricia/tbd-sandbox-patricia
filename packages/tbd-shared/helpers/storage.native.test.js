import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  multiGet: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

const setup = () => {
  jest.resetAllMocks();
  AsyncStorage.getItem.mockResolvedValue("bla");
  AsyncStorage.multiGet.mockResolvedValue([
    ["key1", '"value1"'],
    ["key2", '"value2"'],
  ]);

  let Storage;
  jest.isolateModules(() => {
    Storage = require("./storage.native").default;
  });

  return { Storage };
};

describe("Storage", () => {
  describe("after instatiation", () => {
    let Storage;
    beforeAll(() => {
      ({ Storage } = setup());
    });

    describe("getItem", () => {
      describe("stored value is null", () => {
        let result;
        beforeAll(async () => {
          AsyncStorage.getItem.mockResolvedValue(null);
          result = await Storage.getItem("key");
        });

        it("should call AsyncStorage getItem with correct arguments", () => {
          expect(AsyncStorage.getItem).toHaveBeenCalledWith("key");
        });

        it("should return undefined", () => {
          expect(result).toEqual(undefined);
        });
      });

      describe("stored value is string", () => {
        let result;
        beforeAll(async () => {
          AsyncStorage.getItem.mockResolvedValue('"result"');
          result = await Storage.getItem("key");
        });

        it("should call AsyncStorage getItem with correct arguments", () => {
          expect(AsyncStorage.getItem).toHaveBeenCalledWith("key");
        });

        it("should return correct value", () => {
          expect(result).toEqual("result");
        });
      });

      describe("stored value is object", () => {
        let result;
        beforeAll(async () => {
          AsyncStorage.getItem.mockResolvedValue('{"key":"value"}');
          result = await Storage.getItem("key");
        });

        it("should call AsyncStorage getItem with correct arguments", () => {
          expect(AsyncStorage.getItem).toHaveBeenCalledWith("key");
        });

        it("should return correct value", () => {
          expect(result).toEqual({ key: "value" });
        });
      });
    });

    describe("multiGet", () => {
      describe("stored values are strings", () => {
        let result;
        beforeAll(async () => {
          result = await Storage.multiGet(["key1", "key2"]);
        });

        it("should call AsyncStorage multiGet with correct arguments", () => {
          expect(AsyncStorage.multiGet).toHaveBeenCalledWith(["key1", "key2"]);
        });

        it("should return correct values", () => {
          expect(result).toEqual({
            key1: "value1",
            key2: "value2",
          });
        });
      });

      describe("stored values include null", () => {
        let result;
        beforeAll(async () => {
          AsyncStorage.multiGet.mockResolvedValue([
            ["key1", '"value1"'],
            ["key2", null],
          ]);
          result = await Storage.multiGet(["key1", "key2"]);
        });

        it("should call AsyncStorage multiGet with correct arguments", () => {
          expect(AsyncStorage.multiGet).toHaveBeenCalledWith(["key1", "key2"]);
        });

        it("should return correct values with null", () => {
          expect(result).toEqual({
            key1: "value1",
            key2: null,
          });
        });
      });

      describe("stored values include objects", () => {
        let result;

        beforeAll(async () => {
          AsyncStorage.multiGet.mockResolvedValue([
            ["key1", JSON.stringify({ name: "someData" })],
            ["key2", null],
          ]);
          result = await Storage.multiGet(["key1", "key2"]);
        });

        it("should call AsyncStorage multiGet with correct arguments", () => {
          expect(AsyncStorage.multiGet).toHaveBeenCalledWith(["key1", "key2"]);
        });

        it("should return correct values with objects", () => {
          expect(result).toEqual({
            key1: { name: "someData" },
            key2: null,
          });
        });
      });
    });

    describe("setItem", () => {
      describe("value to store is string", () => {
        beforeAll(async () => {
          await Storage.setItem("key", "test");
        });

        it("should call AsyncStorage setItem with correct arguments", () => {
          expect(AsyncStorage.setItem).toHaveBeenCalledWith("key", '"test"');
        });
      });

      describe("value to store is object", () => {
        beforeAll(async () => {
          await Storage.setItem("key", { key: "value" });
        });

        it("should call AsyncStorage setItem with correct arguments", () => {
          expect(AsyncStorage.setItem).toHaveBeenCalledWith("key", '{"key":"value"}');
        });
      });
    });

    describe("removeItem", () => {
      beforeAll(async () => {
        await Storage.removeItem();
      });

      it("should call AsyncStorage removeItem", () => {
        expect(AsyncStorage.removeItem).toHaveBeenCalledTimes(1);
      });
    });

    describe("clear", () => {
      beforeAll(async () => {
        await Storage.clear();
      });

      it("should call AsyncStorage clear", () => {
        expect(AsyncStorage.clear).toHaveBeenCalledTimes(1);
      });
    });
  });
});
