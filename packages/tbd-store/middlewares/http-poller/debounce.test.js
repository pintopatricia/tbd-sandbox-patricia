import debounce from "./debounce"; // Update this path to your debounce function file

jest.useFakeTimers(); // Use Jest's fake timers to control time

let mockFunction;

describe("debounce", () => {
  beforeEach(() => {
    mockFunction = jest.fn(); // Create a mock function to track calls
  });

  it("should delay the execution of the function", () => {
    const debouncedFunction = debounce(mockFunction, 500);

    debouncedFunction();
    expect(mockFunction).not.toHaveBeenCalled();

    // Fast-forward time
    jest.advanceTimersByTime(500);
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  it("should call the function only once if invoked multiple times quickly", () => {
    const debouncedFunction = debounce(mockFunction, 500);

    debouncedFunction();
    debouncedFunction();
    debouncedFunction();

    // Fast-forward time
    jest.advanceTimersByTime(500);
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  it("should reset the timer on each call", () => {
    const debouncedFunction = debounce(mockFunction, 500);

    debouncedFunction();
    jest.advanceTimersByTime(300); // Not enough time to trigger the function
    debouncedFunction();
    jest.advanceTimersByTime(300); // Still not enough time
    expect(mockFunction).not.toHaveBeenCalled();

    jest.advanceTimersByTime(200); // Enough time after the last call
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  it("should pass arguments to the debounced function", () => {
    const debouncedFunction = debounce(mockFunction, 500);

    debouncedFunction("arg1", "arg2");
    jest.advanceTimersByTime(500);

    expect(mockFunction).toHaveBeenCalledWith("arg1", "arg2");
  });
});
