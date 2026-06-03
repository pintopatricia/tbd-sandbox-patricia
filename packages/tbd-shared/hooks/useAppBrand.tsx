import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Brand } from "@ppb/tbd-store/config/Brand";
import { ApplicationState } from "@ppb/tbd-store/state";
import { isSkybetProduct } from "@ppb/tbd-store/helpers/app-brand";

export const useProductId = (): string | null => useSelector((state: ApplicationState) => state.entities.productId);

export const useAppBrand = (): Brand => {
  const productId = useProductId();

  return useMemo(() => {
    if (isSkybetProduct(productId)) {
      return Brand.Skybet;
    }

    return Brand.Betfair;
  }, [productId]);
};
