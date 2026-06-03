import { mapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

beforeEach(jest.clearAllMocks);

describe("mapStateToProps", () => {
  it("should return empty object", () => {
    const props = mapStateToProps();

    expect(props).toEqual({});
  });
});

describe("mapDispatchToProps", () => {
  it("should return empty object", () => {
    const result = mapDispatchToProps();

    expect(result).toEqual({});
  });
});
