import { createImagePath } from "./create-image-path.web";

describe("createImagePath", () => {
  beforeEach(() => {
    global.window.__TBD_ENVIRONMENT__ = {
      ASSETS: {
        BASE_PATH: "https://test.com/assets",
      },
    };
  });

  it("should return a valid image path when an image name is provided", () => {
    const imageName = "image";
    const expectedPath = "https://test.com/assets/image.png";

    const result = createImagePath(imageName);

    expect(result).toBe(expectedPath);
  });

  it("should return undefined when no image name is provided", () => {
    const result = createImagePath();

    expect(result).toBeUndefined();
  });

  it("should return undefined when an empty string is provided as the image name", () => {
    const result = createImagePath("");

    expect(result).toBeUndefined();
  });

  it("should return undefined when __TBD_ENVIRONMENT__.ASSETS.BASE_PATH is missing", () => {
    delete global.window.__TBD_ENVIRONMENT__.ASSETS.BASE_PATH;

    const result = createImagePath("image");

    expect(result).toBeUndefined();
  });
});
