import { VirtualSport } from "../../../../../state/entities";
import { VirtualSportFragment, VirtualSportKind } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const VirtualSportKindMapper: { [k in VirtualSportFragment["kind"]]: VirtualSport["kind"] } = {
  [VirtualSportKind.Football]: "FOOTBALL",
  [VirtualSportKind.Racing]: "RACING",
  [VirtualSportKind.Other]: "OTHER",
};

const normalizeVirtualSportFragmentIntoVirtualSport = (
  virtualSport: VirtualSportFragment,
): TransformedFragment<VirtualSport> => {
  const { urn, name, sportId, kind, __typename } = virtualSport;

  return {
    data: {
      typename: __typename,
      sportId,
      urn,
      name,
      kind: VirtualSportKindMapper[kind],
    },
  };
};

export default normalizeVirtualSportFragmentIntoVirtualSport;
