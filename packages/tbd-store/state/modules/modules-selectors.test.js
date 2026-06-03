import { getModules } from "./modules-selectors";

describe("getModules", () => {
  it("should return app state modules", () => {
    const MODULES_MOCK = {
      betting: true,
    };

    expect(
      getModules({
        modules: MODULES_MOCK,
      }),
    ).toBe(MODULES_MOCK);
  });
});
