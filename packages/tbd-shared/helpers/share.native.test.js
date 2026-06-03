import Share from "react-native-share";

import { share } from "./share.native";

jest.mock("react-native-share", () => ({
  open: jest.fn(),
}));

describe("Share Native", () => {
  beforeEach(jest.clearAllMocks);

  describe("share", () => {
    const shareOptionsMock = {
      title: "some title",
      message: "some message",
      url: "some url",
    };

    describe("when Share.open throws an exception", () => {
      const errorMessageMock = "some error";

      beforeEach(() => {
        Share.open.mockRejectedValue(new Error(errorMessageMock));
      });

      it("should throw an error", async () => {
        await expect(share(shareOptionsMock)).rejects.toThrow(
          `An error occurred while sharing: Error: ${errorMessageMock}`,
        );
      });
    });

    describe("when Share.open is successful", () => {
      beforeEach(() => {
        Share.open.mockResolvedValue();

        share(shareOptionsMock);
      });

      it("should call Share.open with shareOptions", () => {
        expect(Share.open).toHaveBeenCalledTimes(1);
        expect(Share.open).toHaveBeenCalledWith(shareOptionsMock);
      });
    });
  });
});
