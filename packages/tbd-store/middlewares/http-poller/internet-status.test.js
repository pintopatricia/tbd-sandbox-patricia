import { setInternetStatus, getInternetStatus, onInternetStatusChange } from "./internet-status";

describe("internetStatus module", () => {
  describe("when internetStatus is 'online'", () => {
    beforeEach(() => {
      setInternetStatus(true);
    });

    it("should return the status as truthy", () => {
      expect(getInternetStatus()).toBe(true);
    });

    describe("and there is a listener to internet status changes", () => {
      const listener1Spy = jest.fn();

      beforeEach(() => {
        onInternetStatusChange(listener1Spy);
        setInternetStatus(true);
      });

      it("should call all listeners with the new status", () => {
        expect(listener1Spy).toHaveBeenCalledWith(true);
      });
    });
  });

  describe("when internetStatus is 'offline'", () => {
    beforeEach(() => {
      setInternetStatus(false);
    });

    it("should return the status as falsy", () => {
      expect(getInternetStatus()).toBe(false);
    });

    describe("and there is a listener to internet status changes", () => {
      const listener1Spy = jest.fn();

      beforeEach(() => {
        onInternetStatusChange(listener1Spy);
        setInternetStatus(false);
      });

      it("should call all listeners with the new status", () => {
        expect(listener1Spy).toHaveBeenCalledWith(false);
      });
    });
  });

  describe("when trying to register a listener that is not a function", () => {
    it("should throw an error", () => {
      expect(() => onInternetStatusChange("listener1Spy")).toThrow("Callback must be a function.");
    });
  });
});
