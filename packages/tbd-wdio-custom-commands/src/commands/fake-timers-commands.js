const tickFakeClock =
  (browser) =>
  async (time = "00:00:30") => {
    await browser.execute((timeToTick) => {
      window.fakeTimersClock.tick(timeToTick);
    }, time);
  };

const flushFakeClockTimers = (browser) => async () => {
  await browser.execute(() => {
    window.fakeTimersClock.next();
  }, []);
};

module.exports = { tickFakeClock, flushFakeClockTimers };
