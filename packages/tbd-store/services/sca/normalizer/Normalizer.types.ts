// Add types to NormalizerRelations instead of `any` when a normalizer has relations for the first time
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NormalizerRelations = any;

export type TransformedFragment<T> = {
  data: T;
  relations: () => (() => TransformedFragment<NormalizerRelations>)[] | [];
};
