import { getIcon } from "./icon";

describe("icon", () => {
  beforeEach(jest.clearAllMocks);

  it("should return an icon when it's valid", () => {
    const icon = getIcon("System--star-filled");

    expect(icon).toBe("System--star-filled");
  });

  it("should return undefined when it is not valid", () => {
    const icon = getIcon("Null--icon");

    expect(icon).toBeUndefined();
  });
});
