import Storage from "./storage.web";

global.window = Object.create(window);
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: jest.fn(),
    multiGet: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
});

describe("Storage", () => {
  describe("getItem", () => {
    describe("stored value is null", () => {
      let result;
      beforeAll(() => {
        window.localStorage.getItem.mockReturnValue(null);
        result = Storage.getItem("key");
      });

      it("should call localStorage getItem with correct arguments", () => {
        expect(window.localStorage.getItem).toHaveBeenCalledWith("key");
      });

      it("should return undefined", async () => {
        expect(await result).toEqual(undefined);
      });
    });

    describe("stored value is string", () => {
      let result;
      beforeAll(() => {
        window.localStorage.getItem.mockReturnValue('"result"');
        result = Storage.getItem("key");
      });

      it("should call localStorage getItem with correct arguments", () => {
        expect(window.localStorage.getItem).toHaveBeenCalledWith("key");
      });

      it("should return correct value", async () => {
        expect(await result).toEqual("result");
      });
    });

    describe("stored value is object", () => {
      let result;
      beforeAll(() => {
        window.localStorage.getItem.mockReturnValue('{"key":"value"}');
        result = Storage.getItem("key");
      });

      it("should call localStorage getItem with correct arguments", () => {
        expect(window.localStorage.getItem).toHaveBeenCalledWith("key");
      });

      it("should return correct value", async () => {
        expect(await result).toEqual({ key: "value" });
      });
    });
  });

  describe("multiGet", () => {
    describe("when given an array of key names", () => {
      let results;

      beforeAll(async () => {
        window.localStorage.getItem
          .mockReturnValueOnce('"value1"')
          .mockReturnValueOnce('"value2"')
          .mockReturnValueOnce(null);

        results = await Storage.multiGet(["key1", "key2", "key3"]);
      });

      it("should call localStorage getItem for each key with correct arguments", () => {
        expect(window.localStorage.getItem).toHaveBeenCalledWith("key1");
        expect(window.localStorage.getItem).toHaveBeenCalledWith("key2");
        expect(window.localStorage.getItem).toHaveBeenCalledWith("key3");
      });

      it("should return an object of key-value pairs with correct values", () => {
        expect(results).toEqual({
          key1: "value1",
          key2: "value2",
          key3: null,
        });
      });
    });

    describe("when no keyNames are provided", () => {
      let results;

      beforeAll(async () => {
        jest.clearAllMocks();
        results = await Storage.multiGet([]);
      });

      it("should not call localStorage getItem", () => {
        expect(window.localStorage.getItem).not.toHaveBeenCalled();
      });

      it("should return an empty object", () => {
        expect(results).toEqual({});
      });
    });

    describe("when an error occurs during retrieval", () => {
      let results;

      beforeAll(async () => {
        window.localStorage.getItem.mockImplementation(() => {
          throw new Error("Simulated error");
        });

        results = await Storage.multiGet(["key1", "key2", "key3"]);
      });

      it("should return an empty object", () => {
        expect(results).toEqual({});
      });
    });
  });

  describe("setItem", () => {
    describe("value to store is string", () => {
      beforeAll(() => {
        window.localStorage.setItem("key", "test");
      });

      it("should call localStorage setItem with correct arguments", () => {
        expect(window.localStorage.setItem).toHaveBeenCalledWith("key", "test");
      });
    });

    describe("value to store is object", () => {
      beforeAll(() => {
        Storage.setItem("key", { key: "value" });
      });

      it("should call AsyncStorage setItem with correct arguments", () => {
        expect(window.localStorage.setItem).toHaveBeenCalledWith("key", '{"key":"value"}');
      });
    });
  });

  describe("removeItem", () => {
    describe("value to store is string", () => {
      beforeAll(() => {
        Storage.removeItem("key");
      });

      it("should call localStorage removeItem with correct arguments", () => {
        expect(window.localStorage.removeItem).toHaveBeenCalledWith("key");
      });
    });
  });

  describe("clear", () => {
    beforeAll(() => {
      Storage.clear();
    });

    it("should call localStorage clear", () => {
      expect(window.localStorage.clear).toHaveBeenCalledTimes(1);
    });
  });
});
