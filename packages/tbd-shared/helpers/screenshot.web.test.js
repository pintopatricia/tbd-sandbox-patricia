import * as htmlToImage from "html-to-image";

import { takeElementScreenshot } from "./screenshot.web";

jest.mock("html-to-image", () => ({
  toBlob: jest.fn(),
}));

describe("Screenshot Web", () => {
  beforeEach(jest.clearAllMocks);

  describe("takeElementScreenshot", () => {
    const refMock = "some ref";
    const optionsMock = {};
    let result;

    describe("when htmlToImage.toBlob throws an exception", () => {
      const errorMessageMock = "some error";

      beforeEach(() => {
        htmlToImage.toBlob.mockRejectedValueOnce(new Error(errorMessageMock));
      });

      it("should throw an error", async () => {
        await expect(takeElementScreenshot(refMock, optionsMock)).rejects.toThrow(
          `An error occurred while taking the screenshot: Error: ${errorMessageMock}`,
        );
      });
    });

    describe("when htmlToImage.toBlob returns null", () => {
      beforeEach(() => {
        htmlToImage.toBlob.mockResolvedValueOnce(null);
      });

      it("should throw an error", async () => {
        await expect(takeElementScreenshot(refMock, optionsMock)).rejects.toThrow(
          "The element could not be converted to a blob",
        );
      });
    });

    describe("when htmlToImage.toBlob returns a valid Blob", () => {
      const fileTypeMock = "image/png";

      beforeEach(async () => {
        htmlToImage.toBlob.mockReturnValueOnce(new Blob(["some blob"], { type: fileTypeMock }));

        result = await takeElementScreenshot(refMock, optionsMock);
      });

      it("should call htmlToImage.toBlob with the correct params", () => {
        expect(htmlToImage.toBlob).toHaveBeenCalledWith(refMock, { filter: expect.any(Function), type: fileTypeMock });
      });

      it("should return the screenshot with correct name and type", () => {
        expect(result.name).toBe("betfair.png");
        expect(result.type).toBe(fileTypeMock);
      });
    });
  });
});
