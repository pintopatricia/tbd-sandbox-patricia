const FakeTimers = require("@sinonjs/fake-timers");

FakeTimers.install({
  toFake: ["Date"],
  now: new Date("2020-05-06T11:22:33.444Z"),
});
