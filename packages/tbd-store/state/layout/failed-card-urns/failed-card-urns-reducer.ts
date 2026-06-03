import { DELETE_LAYOUT, DELETE_VIEW_ITEMS, DeleteLayoutAction, DeleteViewItems } from "../../../actions/catalogue";

type Action = DeleteViewItems | DeleteLayoutAction;

const initialState: string[] = [];

export default function failedCardUrnsReducer(state = initialState, action: Action): string[] {
  switch (action.type) {
    case DELETE_VIEW_ITEMS: {
      const newUrns = action.payload.filter((urn) => !state.includes(urn));
      return newUrns.length ? [...state, ...newUrns] : state;
    }
    case DELETE_LAYOUT:
      return initialState;
    default:
      return state;
  }
}
