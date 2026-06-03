import { captureRef } from "react-native-view-shot";

import { takeElementScreenshot } from "./screenshot.native";

jest.mock("react-native-view-shot", () => ({
  captureRef: jest.fn(),
}));

describe("Screenshot Native", () => {
  beforeEach(jest.clearAllMocks);

  describe("takeElementScreenshot", () => {
    const refMock = "some ref";
    const optionsMock = {};

    describe("when captureRef throws an exception", () => {
      const errorMessageMock = "some error";

      beforeEach(() => {
        captureRef.mockRejectedValue(new Error(errorMessageMock));
      });

      it("should throw an error", async () => {
        await expect(takeElementScreenshot(refMock, optionsMock)).rejects.toThrow(
          `An error occurred while taking the screenshot: Error: ${errorMessageMock}`,
        );
      });
    });

    describe("when captureRef is successful", () => {
      beforeEach(async () => {
        captureRef.mockResolvedValue();

        await takeElementScreenshot(refMock, optionsMock);
      });

      it("should call captureRef with the correct arguments", () => {
        expect(captureRef).toHaveBeenCalledTimes(1);
        expect(captureRef).toHaveBeenCalledWith(refMock, {
          ...optionsMock,
          format: "png",
        });
      });
    });
  });
});
