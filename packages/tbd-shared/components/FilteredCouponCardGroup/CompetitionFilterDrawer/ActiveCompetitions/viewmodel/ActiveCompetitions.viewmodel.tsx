import { useMemo } from "react";
import { CardProps } from "../props";
import { useAllCompetitionsFilterQuery, QueryResponseData } from "../../model/useAllCompetitionsFilterQuery.graphql";

type ActiveCompetitionsViewModel = {
  loading: boolean;
  selectedCompetitions: { id: string; name: string }[];
};

export const useActiveCompetitionsVM = (
  urn: string,
  selectedCompetitionsIds: string[],
): ActiveCompetitionsViewModel => {
  const { loading, data } = useAllCompetitionsFilterQuery(urn);

  // generated types from apollo queries has an issue where everything can be null,
  // casting to the correct response for now, until this issue is not solved
  // when types are correctly generated and infered, we can remove this cast and the type definition "QueryResponseData"
  const card = data?.Cards ? (data.Cards[0] as QueryResponseData) : null;
  const allCompetitions = card?.filterOptions?.competitionsFilter?.allCompetitions ?? [];
  const allCompetitionsFlat = allCompetitions.map((group) => group.competitions).flat();

  const selectedCompetitions = useMemo(
    () =>
      selectedCompetitionsIds.reduce<CardProps["selectedCompetitions"]>((acc, competitionUrn) => {
        const competitionItem = allCompetitionsFlat.find((competition) => competition.urn === competitionUrn);

        if (!competitionItem) {
          return acc;
        }

        return [...acc, { id: competitionItem.urn, name: competitionItem.name }];
      }, []),
    [allCompetitionsFlat, selectedCompetitionsIds],
  );
  return { loading, selectedCompetitions };
};
