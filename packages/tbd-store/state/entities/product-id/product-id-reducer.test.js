import productIdReducer from "./product-id-reducer";
import { NETWORK__FETCH_APP_CONTEXT_SUCCESS } from "../../../actions/app-context";

describe("productIdReducer", () => {
  beforeEach(jest.clearAllMocks);

  describe("when action type is not met by the reducer", () => {
    it("should return the initial state", () => {
      const state = productIdReducer(null, {});

      expect(state).toBeNull();
    });
  });

  describe("when NETWORK__FETCH_USER_CONTEXT_SUCCESS action type is received", () => {
    describe("and productId is defined in the payload", () => {
      it("should return the correct payload", () => {
        const action = {
          type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
          payload: {
            initialState: {
              entities: {
                productId: "100",
              },
            },
          },
        };

        const state = productIdReducer(null, action);
        expect(state).toEqual("100");
      });
    });

    describe("and productId is not defined in the payload", () => {
      it("should return null", () => {
        const action = {
          type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
          payload: {
            initialState: {
              entities: {
                productId: null,
              },
            },
          },
        };

        const state = productIdReducer(null, action);
        expect(state).toBeNull();
      });
    });
  });
});
