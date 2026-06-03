import HttpPoller from "./http-poller";
import { setInternetStatus } from "./internet-status";

// Mock subclass for testing
class TestPoller extends HttpPoller {
  constructor(pollInterval = 5000) {
    super(pollInterval);
    this.mockPoll = jest.fn();
  }

  // Override abstract methods with mocks
  async poll() {
    return this.mockPoll();
  }

  // Expose mocks for verification
  getMocks() {
    return {
      poll: this.mockPoll,
    };
  }
}

describe("AbstractHttpPoller", () => {
  let poller;
  let mocks;

  beforeEach(() => {
    poller = new TestPoller(1000); // 1-second interval for testing
    mocks = poller.getMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should start polling and call 'poll' periodically", () => {
    poller.start();

    // Fast-forward time to trigger the polling
    jest.advanceTimersByTime(3000);

    expect(mocks.poll).toHaveBeenCalledTimes(3); // Called every second
  });

  it("should stop polling when stop is called", () => {
    poller.start();
    poller.stop();

    // Fast-forward time
    jest.advanceTimersByTime(3000);

    expect(mocks.poll).not.toHaveBeenCalled();
  });

  describe("when internet connection is lost (user is offline)", () => {
    it("should pause the poller", () => {
      // Simulate going offline
      setInternetStatus(false);
      poller.start();

      jest.advanceTimersByTime(3000);

      expect(mocks.poll).not.toHaveBeenCalled();
    });
  });

  describe("when internet connection is restored (user is online)", () => {
    it("should resume the poller", () => {
      // Simulate going online
      setInternetStatus(true);

      jest.advanceTimersByTime(3000);

      expect(mocks.poll).toHaveBeenCalled();
    });
  });

  it("should not start polling if already polling", async () => {
    poller.start();
    poller.start();
    poller.start();
    poller.start(); // Calling multiple times

    jest.advanceTimersByTime(3000);

    expect(mocks.poll).toHaveBeenCalledTimes(3);
  });
});
