import { onAll } from "./event-subscriber";

const mockOnce = jest.fn();

jest.mock("eventemitter3-singleton", () => {
  return {
    getEventRegistry: () => ({
      on: (...args) => mockOnce(...args),
    }),
  };
});

const getRegisteredCallback = (eventName) => {
  const call = mockOnce.mock.calls.find(([name]) => name === eventName);
  return call?.[1];
};

describe("onAll", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not fire handler until all events have emitted", () => {
    const handler = jest.fn();

    onAll(["@@UI/LOYALTY_PROMO_CARD_TAP_NAV", "@@UI/LOYALTY_PROMO_CARD_CTA_TAP_NAV"], handler);

    const firstCallback = getRegisteredCallback("@@UI/LOYALTY_PROMO_CARD_TAP_NAV");
    firstCallback({ some: "data" });

    expect(handler).not.toHaveBeenCalled();
  });

  it("should fire handler exactly once after all events emit", () => {
    const handler = jest.fn();

    onAll(["@@UI/LOYALTY_PROMO_CARD_TAP_NAV", "@@UI/LOYALTY_PROMO_CARD_CTA_TAP_NAV"], handler);

    const firstCallback = getRegisteredCallback("@@UI/LOYALTY_PROMO_CARD_TAP_NAV");
    const secondCallback = getRegisteredCallback("@@UI/LOYALTY_PROMO_CARD_CTA_TAP_NAV");

    firstCallback("payload-1");
    secondCallback("payload-2");

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should preserve payload order matching the event array order regardless of emission order", () => {
    const handler = jest.fn();

    onAll(["@@UI/LOYALTY_PROMO_CARD_TAP_NAV", "@@UI/LOYALTY_PROMO_CARD_CTA_TAP_NAV"], handler);

    const firstCallback = getRegisteredCallback("@@UI/LOYALTY_PROMO_CARD_TAP_NAV");
    const secondCallback = getRegisteredCallback("@@UI/LOYALTY_PROMO_CARD_CTA_TAP_NAV");

    // Emit in reverse order
    secondCallback("payload-B");
    firstCallback("payload-A");

    expect(handler).toHaveBeenCalledWith("payload-A", "payload-B");
  });

  it("should work with a single event", () => {
    const handler = jest.fn();

    onAll(["@@UI/LOYALTY_PROMO_CARD_TAP_NAV"], handler);

    const callback = getRegisteredCallback("@@UI/LOYALTY_PROMO_CARD_TAP_NAV");
    callback("only-payload");

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith("only-payload");
  });

  it("should register a once listener for each event", () => {
    const handler = jest.fn();
    const events = ["@@UI/LOYALTY_PROMO_CARD_TAP_NAV", "@@UI/LOYALTY_PROMO_CARD_CTA_TAP_NAV"];

    onAll(events, handler);

    expect(mockOnce).toHaveBeenCalledTimes(2);
    expect(mockOnce.mock.calls[0][0]).toBe("@@UI/LOYALTY_PROMO_CARD_TAP_NAV");
    expect(mockOnce.mock.calls[1][0]).toBe("@@UI/LOYALTY_PROMO_CARD_CTA_TAP_NAV");
  });
});

describe("onAll with forceAfterTimeout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should behave the same as default when forceAfterTimeout is false", () => {
    const handler = jest.fn();

    onAll(["@@UI/LOYALTY_PROMO_CARD_TAP_NAV", "@@UI/LOYALTY_PROMO_CARD_CTA_TAP_NAV"], handler, false);

    const firstCallback = getRegisteredCallback("@@UI/LOYALTY_PROMO_CARD_TAP_NAV");
    const secondCallback = getRegisteredCallback("@@UI/LOYALTY_PROMO_CARD_CTA_TAP_NAV");

    firstCallback("payload-1");
    expect(handler).not.toHaveBeenCalled();

    secondCallback("payload-2");
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith("payload-1", "payload-2");
  });

  it("should NOT fire handler after timeout when no events emit", () => {
    const handler = jest.fn();

    onAll(["@@UI/LOYALTY_PROMO_CARD_TAP_NAV", "@@UI/LOYALTY_PROMO_CARD_CTA_TAP_NAV"], handler, true);

    jest.advanceTimersByTime(2000);
    expect(handler).not.toHaveBeenCalled();
  });

  it("should fire handler immediately when all events complete before timeout", () => {
    const handler = jest.fn();

    onAll(["@@UI/LOYALTY_PROMO_CARD_TAP_NAV", "@@UI/LOYALTY_PROMO_CARD_CTA_TAP_NAV"], handler, true);

    const firstCallback = getRegisteredCallback("@@UI/LOYALTY_PROMO_CARD_TAP_NAV");
    const secondCallback = getRegisteredCallback("@@UI/LOYALTY_PROMO_CARD_CTA_TAP_NAV");

    firstCallback("payload-A");
    secondCallback("payload-B");

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith("payload-A", "payload-B");

    jest.advanceTimersByTime(1000);
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
