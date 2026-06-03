import { FETCH_CATALOGUE_SUCCESS, FetchCatalogueSuccessAction } from "../../../actions/catalogue";
import { RegulatoryData } from "./RegulatoryData.types";

const INITIAL_STATE: RegulatoryData = {
  typename: "RegulatoryData",
  sections: [],
};
type ActionTypes = FetchCatalogueSuccessAction;

export default (currentState: undefined | RegulatoryData | null, action: ActionTypes): RegulatoryData => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const regulatoryData = action.payload.data.RegulatoryData || [];
      const data = regulatoryData[0] || null;

      if (data && data.sections.length > 0) {
        return data;
      }

      return state;
    }
    default:
      return state;
  }
};
