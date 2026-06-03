import { PUSH } from "../../actions/router";
import { bootstrapApp } from "./bootstrap-app";

const dispatchMock = jest.fn();
const stateMock = {
  currentUrn: "fakeUrn",
  currentUrl: "fakeUrl",
};
const preloadedCatalog = {
  layouts: {},
  entities: {},
};

describe("bootstrapApp", () => {
  beforeAll(jest.clearAllMocks);

  describe("when catalog is preloaded", () => {
    it("should dispatch a FETCH_CATALOGUE_SUCCESS action", () => {
      bootstrapApp(dispatchMock, stateMock, preloadedCatalog);
      expect(dispatchMock).toHaveBeenCalledWith({
        payload: { ...preloadedCatalog, requestedUrns: [stateMock.currentUrn] },
        type: "FETCH_CATALOGUE_SUCCESS",
      });
    });
  });

  describe("when catalog is not preloaded", () => {
    it("should dispatch a PUSH action", () => {
      bootstrapApp(dispatchMock, stateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        payload: {
          viewUrn: "fakeUrn",
          viewUrl: "fakeUrl",
        },
        type: PUSH,
      });
    });

    describe("when router state is not defined", () => {
      it("should dispatch a PUSH action with empty values", () => {
        bootstrapApp(dispatchMock, {});

        expect(dispatchMock).toHaveBeenCalledWith({
          payload: {
            viewUrn: "",
            viewUrl: "",
          },
          type: PUSH,
        });
      });
    });
  });
});
