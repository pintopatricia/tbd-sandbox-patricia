import { i18n } from "../../../../../helpers/i18n";
import type { TranslationKey } from "../../../../../translations/keys";
import { CompetitionFilterGroup } from "../../CompetitionFilterDrawer.types";
import { useAllCompetitionsFilterQuery, QueryResponseData } from "../../model/useAllCompetitionsFilterQuery.graphql";

type AllCompetitionsViewModel = {
  loading: boolean;
  competitions: CompetitionFilterGroup[] | null;
};

function mapCompetitions(
  allCompetitions: QueryResponseData["filterOptions"]["competitionsFilter"]["allCompetitions"],
): CompetitionFilterGroup[] {
  return (
    allCompetitions
      .map((competitionGroup) => ({
        id: competitionGroup.country.code,
        flag: competitionGroup.country.flag?.vector,
        title: i18n({ key: `I18N.COUNTRIES.${competitionGroup.country.code.toUpperCase()}` as keyof TranslationKey }),
        items: competitionGroup.competitions.map((competition) => ({
          id: competition.urn,
          text: competition.name,
          isSelected: false,
        })),
      }))
      // sort competition groups alphabetically
      .sort((group1, group2) => group1.title.localeCompare(group2.title))
  );
}

export const useAllCompetitionsVM = (urn: string): AllCompetitionsViewModel => {
  const { loading, data } = useAllCompetitionsFilterQuery(urn);

  // generated types from apollo queries has an issue where everything can be null,
  // casting to the correct response for now, until this issue is not solved
  // when types are correctly generated and infered, we can remove this cast and the type definition "QueryResponseData"
  const card = data?.Cards ? (data.Cards[0] as QueryResponseData) : null;
  const allCompetitions = card?.filterOptions?.competitionsFilter?.allCompetitions;

  return {
    loading,
    competitions: allCompetitions ? mapCompetitions(allCompetitions) : null,
  };
};
