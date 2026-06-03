import { runSaga, stdChannel } from "redux-saga";

let tasks = [];

afterEach(() => {
  tasks.forEach((task) => {
    // if you see this, you forgot to call stopSaga() at the end of the test
    // eslint-disable-next-line jest/no-standalone-expect
    expect(task.isRunning()).toBe(false);
  });
  tasks = [];
});

function advanceTimersByTime(ms) {
  jest.advanceTimersByTime(ms);
  return Promise.resolve(); // release event loop so that generator continues after yield
}

async function hasDispatchedAction(dispatch, action) {
  // Waits for event loop to complete for a specific action
  const timers = new Array(500).fill(advanceTimersByTime(0));

  // eslint-disable-next-line no-restricted-syntax
  for await (const timer of timers) {
    const [calledAction] = dispatch.mock.calls[dispatch.mock.calls.length - 1];

    if (calledAction.type === action) {
      return;
    }

    await timer;
  }

  throw new Error(`${action} type has not been dispatched from the saga`);
}

function getChannelActionPutter(channel) {
  return (actions, time = 0) => {
    actions.forEach((action) => channel.put(action));

    return advanceTimersByTime(time);
  };
}

function getDispatchedActionChecker(dispatch) {
  return (action) => hasDispatchedAction(dispatch, action);
}

function getTaskRunner(saga, { channel, dispatch, getState }, ...args) {
  return () => {
    const task = runSaga({ channel, dispatch, getState }, saga, ...args);

    tasks.push(task);

    return { stop: () => task.cancel(), task };
  };
}

function getTaskContext() {
  const channel = stdChannel();
  const dispatch = jest.fn();
  const getState = jest.fn();

  return { channel, dispatch, getState };
}

// Allow the decision when to start running the saga
// This is useful for sagas that run processes at boot
// and mocks must be present at that time before running
export function setupManagedSagaMocks(saga, ...args) {
  jest.useFakeTimers("modern");

  const context = getTaskContext();
  const run = getTaskRunner(saga, context, ...args);

  return {
    ...context,
    putActions: getChannelActionPutter(context.channel),
    hasDispatchedAction: getDispatchedActionChecker(context.dispatch),
    run,
    advanceTimersByTime,
  };
}

// Runs the saga straight away and waits to receive action
// as per saga implementation
export default function setupSagaMocks(saga, ...args) {
  jest.useFakeTimers("modern");
  const context = getTaskContext();
  const { task, stop } = getTaskRunner(saga, context, ...args)();

  return {
    ...context,
    putActions: getChannelActionPutter(context.channel),
    hasDispatchedAction: getDispatchedActionChecker(context.dispatch),
    stopSaga: stop,
    task,
    advanceTimersByTime,
  };
}
