import HttpPollerObservable from "./http-poller-observable";

const debouncedTickSpy = jest.fn(() => () => {});

// Mock subclass for testing
class TestPollerObservable extends HttpPollerObservable {
  constructor(pollInterval = 5000) {
    super(pollInterval);

    this.debouncedTick = debouncedTickSpy;
    this.mockTick = jest.fn();
    this.mockStart = jest.fn();
    this.mockStop = jest.fn();
    this.mockRestart = jest.fn();
  }

  // Override abstract methods with mocks
  tick() {
    return this.mockTick();
  }

  start() {
    return this.mockStart();
  }

  stop() {
    return this.mockStop();
  }

  restart() {
    return this.mockRestart();
  }

  // Expose mocks for verification
  getMocks() {
    return {
      start: this.mockStart,
      tick: this.mockTick,
      mockStart: this.mockStart,
      mockStop: this.mockStop,
      mockRestart: this.mockRestart,
    };
  }
}

describe("AbstractHttpPollerObservable", () => {
  let observable;
  let mocks;

  beforeEach(() => {
    observable = new TestPollerObservable(1000); // 1-second interval for testing
    mocks = observable.getMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("add", () => {
    describe("when adding an ID to the pool of IDs to fetch", () => {
      beforeEach(() => {
        jest.resetAllMocks();
        observable.add("mockID", {});
      });

      it("should add it to the pool of IDs", () => {
        expect(observable.POOL.size).toEqual(1);
      });

      it("should start polling", () => {
        expect(mocks.start).toHaveBeenCalledTimes(1);
      });

      it("should trigger a tick", () => {
        expect(debouncedTickSpy).toHaveBeenCalledTimes(1);
      });

      describe("and the ID was already existing in the POOL", () => {
        beforeEach(() => {
          jest.resetAllMocks();
          observable.add("mockID", {});
        });

        it("should increment the number of times the ID as added to the pool", () => {
          expect(observable.POOL.get("mockID").count).toEqual(2);
        });
      });
    });
  });

  describe("remove", () => {
    describe("when removing an ID with a single occurence from the pool", () => {
      beforeEach(() => {
        jest.resetAllMocks();
        observable.add("mockID1", {});
        observable.add("mockID2", {});
        observable.remove("mockID1", {});
      });

      it("should remove the ID from the pool", () => {
        expect(observable.POOL.size).toEqual(1);
      });
    });

    describe("when removing an ID with multiple occurences from the pool", () => {
      beforeEach(() => {
        jest.resetAllMocks();
        observable.add("mockID", {});
        observable.add("mockID", {});
        observable.remove("mockID", {});
      });

      it("should decrement the number of times the ID as added to the pool", () => {
        expect(observable.POOL.get("mockID").count).toEqual(1);
      });
    });
  });

  describe("reset", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      observable.add("mockID1", {});
      observable.add("mockID2", {});
      observable.add("mockID3", {});
      observable.add("mockID4", {});
      observable.reset();
    });

    it("should clear the pool entirely", () => {
      expect(observable.POOL.size).toEqual(0);
    });
  });

  describe("notify", () => {
    describe("when mutiple observers subscribe and there's a new update", () => {
      const observer1 = jest.fn();
      const observer2 = jest.fn();
      const observer3 = jest.fn();

      beforeEach(() => {
        jest.resetAllMocks();
        observable.subscribe(observer1);
        observable.subscribe(observer2);
        observable.subscribe(observer3);
        observable.notify();
      });

      it("should call every observer with the update", () => {
        expect(observer1).toHaveBeenCalledTimes(1);
        expect(observer2).toHaveBeenCalledTimes(1);
        expect(observer3).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("poll", () => {
    describe("when there are no IDs in the pool", () => {
      beforeEach(() => {
        jest.resetAllMocks();
        observable.poll();
      });

      it("should trigger a tick", () => {
        expect(mocks.tick).not.toHaveBeenCalledTimes(1);
      });
    });

    describe("when there are IDs in the pool", () => {
      beforeEach(() => {
        jest.resetAllMocks();
        observable.add("mockID1", {});
        observable.poll();
      });

      it("should trigger a tick", () => {
        expect(mocks.tick).toHaveBeenCalledTimes(1);
      });
    });
  });
});
