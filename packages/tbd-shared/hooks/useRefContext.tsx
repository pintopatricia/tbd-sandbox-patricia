import { useContext } from "react";

import { RefContext, RefContextValues } from "../components/RefContext";

export const useRefContext = (): RefContextValues => {
  const context = useContext(RefContext);
  if (!context) {
    throw new Error("useRefContext must be used within a RefContext");
  }

  return context;
};
