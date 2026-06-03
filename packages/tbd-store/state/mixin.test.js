import mixin from "./mixin";

const firstMock = {
  name: "First Mock",
  firstOnlyProp: true,
  scores: [{ home: 0, away: 0 }],
};

const secondMock = {
  name: "Second Mock",
  secondOnlyProp: false,
  scores: [{ home: 1 }],
};

describe("mixin", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should merge two objects", () => {
    const result = mixin(firstMock, secondMock);

    expect(result).toEqual({
      name: "Second Mock",
      firstOnlyProp: true,
      secondOnlyProp: false,
      scores: [{ home: 1, away: 0 }],
    });
  });

  it("should mutate the first object", () => {
    const result = mixin(firstMock, secondMock);

    expect(result.scores).toBe(firstMock.scores);
  });

  it("should support Proxies", () => {
    const result = mixin(new Proxy(firstMock, {}), secondMock);

    expect(result).toEqual({
      name: "Second Mock",
      firstOnlyProp: true,
      secondOnlyProp: false,
      scores: [{ home: 1, away: 0 }],
    });
  });

  it("should maintain all references", () => {
    const result = mixin(firstMock, secondMock);

    expect(result).toBe(firstMock);
    expect(result.scores).toBe(firstMock.scores);
    expect(result.scores[0]).toBe(firstMock.scores[0]);
  });

  it("should remove elements from arrays", () => {
    const mock = {
      ...firstMock,
      scores: [{ home: 0, away: 0 }, 1, "string", false],
    };
    const result = mixin(mock, secondMock);

    expect(result).toEqual({
      name: "Second Mock",
      firstOnlyProp: true,
      secondOnlyProp: false,
      scores: [{ home: 1, away: 0 }],
    });
  });
});
