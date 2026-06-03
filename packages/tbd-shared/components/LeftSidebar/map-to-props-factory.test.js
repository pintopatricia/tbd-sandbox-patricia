import { makeMapStateToProps } from "./map-to-props-factory";

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should be a factory function", () => {
    expect(makeMapStateToProps()).toEqual(expect.any(Function));
  });

  describe("mapStateToProps", () => {
    it("should return props", () => {
      const stateMock = {
        layouts: {
          leftSidebar: {
            items: "ITEMS",
          },
        },
        entities: {
          throttles: "THROTTLES",
        },
      };
      const mapStateToProps = makeMapStateToProps();
      const props = mapStateToProps(stateMock, { isDesktop: true });

      expect(props).toEqual({
        items: "ITEMS",
        isDesktop: true,
      });
    });
  });
});
