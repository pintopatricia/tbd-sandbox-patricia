import { setCetInitialised, onCetInitialised, resetCetInitState } from "./cet-init-state.native";

describe("cet-init-state", () => {
  afterEach(() => {
    resetCetInitState();
  });

  describe("when CET is initialised before subscribing", () => {
    it("should call listener immediately", () => {
      const listener = jest.fn();
      setCetInitialised();
      onCetInitialised(listener);

      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe("when CET is initialised after subscribing", () => {
    it("should call listener when setCetInitialised is called", () => {
      const listener = jest.fn();
      onCetInitialised(listener);

      expect(listener).not.toHaveBeenCalled();

      setCetInitialised();

      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe("when multiple listeners are registered", () => {
    it("should call all listeners when setCetInitialised is called", () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      onCetInitialised(listener1);
      onCetInitialised(listener2);

      setCetInitialised();

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });
  });

  describe("when a listener is unsubscribed before CET is initialised", () => {
    it("should not call the unsubscribed listener", () => {
      const listener = jest.fn();
      const unsubscribe = onCetInitialised(listener);

      unsubscribe();
      setCetInitialised();

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe("when subscribing after CET is already initialised", () => {
    it("should return a no-op unsubscribe function", () => {
      setCetInitialised();

      const listener = jest.fn();
      const unsubscribe = onCetInitialised(listener);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(() => unsubscribe()).not.toThrow();
    });
  });
});
