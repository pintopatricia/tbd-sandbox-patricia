export type TbdCatalogue = {
  post<T>(path: string, operation: string, body: Record<string, unknown>): Promise<Data<T>>;
};

export type Data<T> = {
  data: () => {
    data: T;
  };
  isSuccess: () => () => void;
  status: () => () => void;
  isError: () => () => void;
  isServerError: () => () => void;
  isClientError: () => () => void;
  isRedirect: () => () => void;
};
