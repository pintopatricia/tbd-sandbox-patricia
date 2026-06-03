import { combineReducers, createStore } from "redux";
import { PUSH } from "../actions";
import { dispatchRoutePushAction } from "./store";

describe("store", () => {
  let store;

  beforeEach(() => {
    store = createStore(
      combineReducers({
        entities: () => ({}),
        layouts: () => ({}),
        router: () => ({}),
      }),
    );
    store.dispatch = jest.fn();
  });

  it("should dispatch route push action", () => {
    dispatchRoutePushAction(store, "viewUrn");
    expect(store.dispatch).toHaveBeenCalledWith({ type: PUSH, payload: { viewUrn: "viewUrn", viewUrl: "" } });
  });
});
