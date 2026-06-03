export const UI__OPEN_PREDICTS = "UI/OPEN_PREDICTS";
export const UI__CLOSE_PREDICTS = "UI/CLOSE_PREDICTS";

export type OpenPredictsAction = {
  type: typeof UI__OPEN_PREDICTS;
};

export type ClosePredictsAction = {
  type: typeof UI__CLOSE_PREDICTS;
};

export const openPredicts = (): OpenPredictsAction => ({
  type: UI__OPEN_PREDICTS,
});

export const closePredicts = (): ClosePredictsAction => ({
  type: UI__CLOSE_PREDICTS,
});
