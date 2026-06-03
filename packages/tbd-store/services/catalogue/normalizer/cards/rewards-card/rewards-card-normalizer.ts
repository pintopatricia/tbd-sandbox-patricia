/* eslint-disable no-underscore-dangle */
import { Amount, Benefits, BenefitsPackageSection, RewardsCard } from "../../../../../state/layout/cards/Card.types";
import {
  ValueLookupItem,
  Benefit,
  BenefitAccess,
  BenefitsPackage,
  RewardsCardFragment,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import { BenefitsPackageCriteriaType } from "../../../../../state/constants";

function isNotNull<T>(it: T): it is NonNullable<T> {
  return it !== null;
}

const getAmount = (amount: ValueLookupItem): Amount => ({
  type: amount.type,
  value: amount.value,
});

const getBenefits = (benefit: Benefit): Benefits => ({
  hidden: benefit.hidden,
  type: benefit.type,
  accessLevel: benefit.accessLevel,
  valueLookup: {
    maxAmount: benefit.valueLookup?.maxAmount ? getAmount(benefit.valueLookup.maxAmount) : null,
    quantity: benefit.valueLookup?.quantity ? getAmount(benefit.valueLookup.quantity) : null,
    size: null,
  },
});

export function getCriteriaType(type: string | null): BenefitsPackageCriteriaType | null {
  switch (type) {
    case BenefitsPackageCriteriaType.SUM_EXCH_SBK:
      return BenefitsPackageCriteriaType.SUM_EXCH_SBK;
    case BenefitsPackageCriteriaType.EXCH_MARKETS:
      return BenefitsPackageCriteriaType.EXCH_MARKETS;
    default:
      return null;
  }
}

const getBenefitsPackage = (benefits: BenefitsPackage): BenefitsPackageSection => ({
  commissionRate: benefits.commissionRate,
  requiredMarketBets: benefits.requiredMarketBets,
  packageLevel: benefits.packageLevel,
  benefits: benefits.benefits
    ? benefits.benefits
        .filter((element): element is Benefit => isNotNull(element))
        .map((benefit) => getBenefits(benefit))
    : null,
  criteriaType: getCriteriaType(benefits.criteriaType),
  excludedBenefits: benefits.excludedBenefits
    ? benefits.excludedBenefits
        .filter((element): element is BenefitAccess => isNotNull(element))
        .map((excludedBenefit) => excludedBenefit)
    : null,
});

const getBenefitsPackages = (benefits: BenefitsPackage[]): BenefitsPackageSection[] =>
  benefits.map((benefit) => getBenefitsPackage(benefit));

const normalizeRewardsCardFragmentIntoRewardsCard = (
  fragment: RewardsCardFragment,
): TransformedFragment<RewardsCard> => ({
  data: {
    typename: fragment.__typename,
    urn: fragment.urn,
    benefitsPackages: {
      rewardsStatus: fragment.benefitsPackages.rewardsStatus,
      lastMonthTradedMarkets: fragment.benefitsPackages.lastMonthTradedMarkets,
      currentMonthTradedMarkets: fragment.benefitsPackages.currentMonthTradedMarkets,
      currentMonth: fragment.benefitsPackages.currentMonth,
      nextMonth: fragment.benefitsPackages.nextMonth,
      qualifiedBenefitsPackage: fragment.benefitsPackages.qualifiedBenefitsPackage
        ? getBenefitsPackage(fragment.benefitsPackages.qualifiedBenefitsPackage)
        : null,
      chosenBenefitsPackage: fragment.benefitsPackages.chosenBenefitsPackage
        ? getBenefitsPackage(fragment.benefitsPackages.chosenBenefitsPackage)
        : null,
      availablePackages: fragment.benefitsPackages.availablePackages
        ? getBenefitsPackages(
            fragment.benefitsPackages.availablePackages.filter((element): element is BenefitsPackage =>
              isNotNull(element),
            ),
          )
        : null,
    },
  },
});

export default normalizeRewardsCardFragmentIntoRewardsCard;
