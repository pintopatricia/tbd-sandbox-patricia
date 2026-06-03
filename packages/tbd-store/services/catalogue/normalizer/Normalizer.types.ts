import { Normalizers } from "./normalizer-config";

type ValueOf<T> = T[keyof T];

export type Relations = () => (() => ReturnType<ValueOf<Normalizers>>)[] | [];

export type TransformedFragment<T> = {
  data: T;
};
